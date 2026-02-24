import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Customer,
  CustomerStatus,
  IdentificationSource,
} from '../entities/customer.entity';
import {
  CreateCustomerDto,
  VerifyOtpDto,
  SaveFatcaDto,
  SaveDocumentsDto,
  SavePersonalFormDto,
} from './dto/customer.dto';
import { SmsService } from '../sms/sms.service'; // ← chemin relatif correct

@Injectable()
export class CustomerService {

  // ✅ Logger déclaré EN PREMIER avant le constructor
  private readonly logger = new Logger(CustomerService.name);

  constructor(
    @InjectRepository(Customer)
    private readonly repo: Repository<Customer>,
    private readonly smsService: SmsService,
  ) {}

  // ══════════════════════════════════════════════════════════
  //  UTILITAIRES PRIVÉS
  // ══════════════════════════════════════════════════════════

  private async findOrFail(id: string): Promise<Customer> {
    const c = await this.repo.findOne({ where: { id } });
    if (!c) throw new NotFoundException(`Customer "${id}" introuvable.`);
    return c;
  }

  // ══════════════════════════════════════════════════════════
  //  ÉTAPE 1 — Créer le customer (OnboardingPersonalDataScreen)
  //  POST /customer
  // ══════════════════════════════════════════════════════════

  async create(dto: CreateCustomerDto): Promise<Customer> {
    const byEmail = await this.repo.findOne({ where: { email: dto.email } });
    if (byEmail) throw new ConflictException('Cet email est déjà utilisé.');

    const byCin = await this.repo.findOne({ where: { idCardNumber: dto.idCardNumber } });
    if (byCin) throw new ConflictException('Ce numéro de CIN est déjà enregistré.');

    const customer = this.repo.create({
      ...dto,
      identificationSource: dto.identificationSource ?? IdentificationSource.MANUAL,
      status: CustomerStatus.PENDING_OTP,
      currentStep: 1,
      otpAttempts: 0,
    });

    const saved = await this.repo.save(customer);
    this.logger.log(`✅ Customer créé : ${saved.id} | ${saved.email}`);
    return saved;
  }

  // ══════════════════════════════════════════════════════════
  //  OTP — Générer un code OTP (POST /customer/:id/otp)
  // ══════════════════════════════════════════════════════════

  // ── generateOtp — Twilio envoie le code lui-même ──
async generateOtp(id: string): Promise<{ otp: string; expiresAt: Date }> {
  const customer = await this.findOrFail(id);

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + 10);

  customer.otpCode      = otp;
  customer.otpExpiresAt = expiresAt;
  customer.otpAttempts  = 0;
  customer.status       = CustomerStatus.PENDING_OTP;

  await this.repo.save(customer);

  // Tente d'envoyer via Twilio Verify
  try {
    await this.smsService.sendOtp(customer.phoneNumber);
    this.logger.log(`📱 SMS OTP envoyé au +216${customer.phoneNumber}`);
  } catch (err: any) {
    this.logger.warn(`⚠️ SMS non envoyé : ${err.message}`);
  }

  return { otp, expiresAt };
}

async verifyOtp(id: string, dto: VerifyOtpDto): Promise<{ success: boolean }> {
  const customer = await this.findOrFail(id);

  if (customer.otpAttempts >= 3) {
    throw new BadRequestException('Trop de tentatives. Demandez un nouveau code.');
  }

  if (!customer.otpExpiresAt || new Date() > customer.otpExpiresAt) {
    throw new BadRequestException('Le code OTP a expiré. Demandez un nouveau code.');
  }

  // Vérifie d'abord via Twilio, sinon fallback sur le code local
  let isValid = false;
  try {
    isValid = await this.smsService.verifyOtpCode(customer.phoneNumber, dto.otpCode);
  } catch {
    // Fallback — vérification locale si Twilio échoue
    isValid = customer.otpCode === dto.otpCode;
  }

  if (!isValid) {
    customer.otpAttempts += 1;
    await this.repo.save(customer);
    const remaining = 3 - customer.otpAttempts;
    throw new BadRequestException(`Code incorrect. ${remaining} tentative(s) restante(s).`);
  }

  customer.isPhoneVerified = true;
  customer.otpCode         = null as unknown as string;
  customer.otpExpiresAt    = null as unknown as Date;
  customer.otpAttempts     = 0;
  customer.status          = CustomerStatus.FATCA_PENDING;
  customer.currentStep     = 2;

  await this.repo.save(customer);
  this.logger.log(`✅ Téléphone vérifié pour : ${id} → passage à FATCA`);
  return { success: true };
}
  // ══════════════════════════════════════════════════════════
  //  FATCA — Sauvegarder la déclaration (POST /customer/:id/fatca)
  // ══════════════════════════════════════════════════════════

  async saveFatca(id: string, dto: SaveFatcaDto): Promise<Customer> {
    const customer = await this.findOrFail(id);

    if (!customer.isPhoneVerified) {
      throw new BadRequestException('Le téléphone doit être vérifié avant le FATCA.');
    }

    Object.assign(customer, dto);
    customer.fatcaCompletedAt = new Date();
    customer.status           = CustomerStatus.DOCUMENTS_PENDING;
    customer.currentStep      = 3;

    const saved = await this.repo.save(customer);
    this.logger.log(`📋 FATCA enregistré pour : ${id} → passage aux Documents`);
    return saved;
  }

  // ══════════════════════════════════════════════════════════
  //  DOCUMENTS — Sauvegarder les chemins (POST /customer/:id/documents)
  // ══════════════════════════════════════════════════════════

  async saveDocuments(id: string, dto: SaveDocumentsDto): Promise<Customer> {
    const customer = await this.findOrFail(id);

    if (dto.usePassport && !dto.passportPath) {
      throw new BadRequestException('Le chemin du passeport est requis.');
    }
    if (!dto.usePassport && (!dto.idCardFrontPath || !dto.idCardBackPath)) {
      throw new BadRequestException('Les deux faces de la CIN sont requises.');
    }

    Object.assign(customer, dto);
    customer.documentsUploadedAt = new Date();
    customer.status              = CustomerStatus.PERSONAL_PENDING;
    customer.currentStep         = 4;

    const saved = await this.repo.save(customer);
    this.logger.log(`📄 Documents enregistrés pour : ${id} → passage au formulaire perso`);
    return saved;
  }

  // ══════════════════════════════════════════════════════════
  //  FORMULAIRE PERSO — Adresse + Pro + Agence
  //  POST /customer/:id/personal-form
  // ══════════════════════════════════════════════════════════

  async savePersonalForm(id: string, dto: SavePersonalFormDto): Promise<Customer> {
    const customer = await this.findOrFail(id);

    Object.assign(customer, dto);
    customer.status      = CustomerStatus.SUBMITTED;
    customer.submittedAt = new Date();
    customer.currentStep = 5;

    const saved = await this.repo.save(customer);
    this.logger.log(`🎉 Dossier soumis pour : ${id} → statut SUBMITTED`);
    return saved;
  }

  // ══════════════════════════════════════════════════════════
  //  LECTURE — Récupérer un customer par ID
  //  GET /customer/:id
  // ══════════════════════════════════════════════════════════

  async findOne(id: string): Promise<Customer> {
    return this.findOrFail(id);
  }

  async findAll(): Promise<Customer[]> {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  // ══════════════════════════════════════════════════════════
  //  REPRISE — Trouver un dossier par email
  //  GET /customer/by-email/:email
  // ══════════════════════════════════════════════════════════

  async findByEmail(email: string): Promise<Customer | null> {
    return this.repo.findOne({ where: { email } });
  }
  async update(id: string, dto: Partial<CreateCustomerDto>): Promise<Customer> {
  const customer = await this.findOrFail(id);

  // Mise à jour partielle
  Object.assign(customer, dto);

  // Optionnel : ne pas réinitialiser currentStep/status si déjà avancé
  // if (dto.currentStep) customer.currentStep = dto.currentStep;
  // etc.

  const updated = await this.repo.save(customer);
  this.logger.log(`Customer mis à jour : ${id}`);
  return updated;
}
}

