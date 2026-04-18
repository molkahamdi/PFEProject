// ============================================================
//  backend/src/customer/customer.controller.ts
//
//  ✅ [E-HOUWIYA] CORRECTION :
//  L'endpoint PATCH /:id/ehouwiya-contact est SUPPRIMÉ.
//
//  Raison : email et phoneNumber sont aussi verrouillés
//  pour les customers E-Houwiya (validés par TunTrust).
//  Aucun champ de contact ne peut être modifié.
//
//  Le PATCH /:id standard protège automatiquement tous
//  les champs via EHOUWIYA_LOCKED_FIELDS dans le service.
// ============================================================
import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  Patch,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CustomerService } from './customer.service';
import {
  CreateCustomerDto,
  VerifyOtpDto,
  SaveFatcaDto,
  SaveDocumentsDto,
  SavePersonalFormDto,
} from './dto/customer.dto';

@Controller('customer')
export class CustomerController {
  constructor(private readonly service: CustomerService) {}

  // ── Créer un customer ─────────────────────────────────────
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateCustomerDto) {
    const customer = await this.service.create(dto);
    return {
      success: true,
      message: 'Dossier créé.',
      data: {
        id:                   customer.id,
        currentStep:          customer.currentStep,
        status:               customer.status,
        identificationSource: customer.identificationSource,
      },
    };
  }

  // ── Lire un customer ──────────────────────────────────────
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const customer = await this.service.findOne(id);
    return { success: true, data: customer };
  }

  @Get()
  async findAll() {
    const list = await this.service.findAll();
    return { success: true, count: list.length, data: list };
  }

  @Get('by-email/:email')
  async findByEmail(@Param('email') email: string) {
    const customer = await this.service.findByEmail(email);
    if (!customer) return { success: false, data: null };
    return { success: true, data: customer };
  }

  // ── Générer OTP ───────────────────────────────────────────
  @Post(':id/otp')
  @HttpCode(HttpStatus.OK)
  async generateOtp(@Param('id') id: string) {
    const result = await this.service.generateOtp(id);
    return {
      success:     true,
      message:     'Code OTP généré.',
      devOnly_otp: result.otp,
      expiresAt:   result.expiresAt,
    };
  }

  // ── Vérifier OTP ─────────────────────────────────────────
  @Post(':id/verify-otp')
  @HttpCode(HttpStatus.OK)
  async verifyOtp(@Param('id') id: string, @Body() dto: VerifyOtpDto) {
    const result = await this.service.verifyOtp(id, dto);
    return {
      ...result,
      message: result.success ? 'Téléphone vérifié.' : 'Code OTP invalide',
    };
  }

  // ── FATCA ─────────────────────────────────────────────────
  @Post(':id/fatca')
  @HttpCode(HttpStatus.OK)
  async saveFatca(@Param('id') id: string, @Body() dto: SaveFatcaDto) {
    const customer = await this.service.saveFatca(id, dto);
    return {
      success: true,
      message: 'Déclaration FATCA enregistrée.',
      data: { id: customer.id, currentStep: customer.currentStep, status: customer.status },
    };
  }

  // ── Documents ─────────────────────────────────────────────
  @Post(':id/documents')
  @HttpCode(HttpStatus.OK)
  async saveDocuments(@Param('id') id: string, @Body() dto: SaveDocumentsDto) {
    const customer = await this.service.saveDocuments(id, dto);
    return {
      success: true,
      message: 'Documents enregistrés.',
      data: { id: customer.id, currentStep: customer.currentStep, status: customer.status },
    };
  }

  // ── Formulaire personnel ──────────────────────────────────
  @Post(':id/personal-form')
  @HttpCode(HttpStatus.OK)
  async savePersonalForm(@Param('id') id: string, @Body() dto: SavePersonalFormDto) {
    const customer = await this.service.savePersonalForm(id, dto);
    return {
      success: true,
      message: 'Dossier soumis avec succès !',
      data: {
        id:          customer.id,
        currentStep: customer.currentStep,
        status:      customer.status,
        submittedAt: customer.submittedAt,
      },
    };
  }

  // ── Mise à jour partielle ─────────────────────────────────
  // ✅ [E-HOUWIYA] : Si source = E_HOUWIYA, les champs
  // identité + email + téléphone sont automatiquement
  // préservés dans customer.service.ts via EHOUWIYA_LOCKED_FIELDS
  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: Partial<CreateCustomerDto>) {
    const customer = await this.service.update(id, dto);
    return {
      success: true,
      message: 'Customer mis à jour.',
      data: {
        id:                   customer.id,
        currentStep:          customer.currentStep,
        status:               customer.status,
        identificationSource: customer.identificationSource,
      },
    };
  }

  // ── OCR SCAN ──────────────────────────────────────────────
  @Post(':id/ocr/scan')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('document'))
  async ocrScan(
    @Param('id') customerId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body('docType') docType: string,
  ) {
    return this.service.ocrScan(customerId, file, docType);
  }
}