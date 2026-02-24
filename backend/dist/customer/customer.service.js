"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var CustomerService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const customer_entity_1 = require("../entities/customer.entity");
const sms_service_1 = require("../sms/sms.service");
let CustomerService = CustomerService_1 = class CustomerService {
    repo;
    smsService;
    logger = new common_1.Logger(CustomerService_1.name);
    constructor(repo, smsService) {
        this.repo = repo;
        this.smsService = smsService;
    }
    async findOrFail(id) {
        const c = await this.repo.findOne({ where: { id } });
        if (!c)
            throw new common_1.NotFoundException(`Customer "${id}" introuvable.`);
        return c;
    }
    async create(dto) {
        const byEmail = await this.repo.findOne({ where: { email: dto.email } });
        if (byEmail)
            throw new common_1.ConflictException('Cet email est déjà utilisé.');
        const byCin = await this.repo.findOne({ where: { idCardNumber: dto.idCardNumber } });
        if (byCin)
            throw new common_1.ConflictException('Ce numéro de CIN est déjà enregistré.');
        const customer = this.repo.create({
            ...dto,
            identificationSource: dto.identificationSource ?? customer_entity_1.IdentificationSource.MANUAL,
            status: customer_entity_1.CustomerStatus.PENDING_OTP,
            currentStep: 1,
            otpAttempts: 0,
        });
        const saved = await this.repo.save(customer);
        this.logger.log(`✅ Customer créé : ${saved.id} | ${saved.email}`);
        return saved;
    }
    async generateOtp(id) {
        const customer = await this.findOrFail(id);
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 10);
        customer.otpCode = otp;
        customer.otpExpiresAt = expiresAt;
        customer.otpAttempts = 0;
        customer.status = customer_entity_1.CustomerStatus.PENDING_OTP;
        await this.repo.save(customer);
        try {
            await this.smsService.sendOtp(customer.phoneNumber);
            this.logger.log(`📱 SMS OTP envoyé au +216${customer.phoneNumber}`);
        }
        catch (err) {
            this.logger.warn(`⚠️ SMS non envoyé : ${err.message}`);
        }
        return { otp, expiresAt };
    }
    async verifyOtp(id, dto) {
        const customer = await this.findOrFail(id);
        if (customer.otpAttempts >= 3) {
            throw new common_1.BadRequestException('Trop de tentatives. Demandez un nouveau code.');
        }
        if (!customer.otpExpiresAt || new Date() > customer.otpExpiresAt) {
            throw new common_1.BadRequestException('Le code OTP a expiré. Demandez un nouveau code.');
        }
        let isValid = false;
        try {
            isValid = await this.smsService.verifyOtpCode(customer.phoneNumber, dto.otpCode);
        }
        catch {
            isValid = customer.otpCode === dto.otpCode;
        }
        if (!isValid) {
            customer.otpAttempts += 1;
            await this.repo.save(customer);
            const remaining = 3 - customer.otpAttempts;
            throw new common_1.BadRequestException(`Code incorrect. ${remaining} tentative(s) restante(s).`);
        }
        customer.isPhoneVerified = true;
        customer.otpCode = null;
        customer.otpExpiresAt = null;
        customer.otpAttempts = 0;
        customer.status = customer_entity_1.CustomerStatus.FATCA_PENDING;
        customer.currentStep = 2;
        await this.repo.save(customer);
        this.logger.log(`✅ Téléphone vérifié pour : ${id} → passage à FATCA`);
        return { success: true };
    }
    async saveFatca(id, dto) {
        const customer = await this.findOrFail(id);
        if (!customer.isPhoneVerified) {
            throw new common_1.BadRequestException('Le téléphone doit être vérifié avant le FATCA.');
        }
        Object.assign(customer, dto);
        customer.fatcaCompletedAt = new Date();
        customer.status = customer_entity_1.CustomerStatus.DOCUMENTS_PENDING;
        customer.currentStep = 3;
        const saved = await this.repo.save(customer);
        this.logger.log(`📋 FATCA enregistré pour : ${id} → passage aux Documents`);
        return saved;
    }
    async saveDocuments(id, dto) {
        const customer = await this.findOrFail(id);
        if (dto.usePassport && !dto.passportPath) {
            throw new common_1.BadRequestException('Le chemin du passeport est requis.');
        }
        if (!dto.usePassport && (!dto.idCardFrontPath || !dto.idCardBackPath)) {
            throw new common_1.BadRequestException('Les deux faces de la CIN sont requises.');
        }
        Object.assign(customer, dto);
        customer.documentsUploadedAt = new Date();
        customer.status = customer_entity_1.CustomerStatus.PERSONAL_PENDING;
        customer.currentStep = 4;
        const saved = await this.repo.save(customer);
        this.logger.log(`📄 Documents enregistrés pour : ${id} → passage au formulaire perso`);
        return saved;
    }
    async savePersonalForm(id, dto) {
        const customer = await this.findOrFail(id);
        Object.assign(customer, dto);
        customer.status = customer_entity_1.CustomerStatus.SUBMITTED;
        customer.submittedAt = new Date();
        customer.currentStep = 5;
        const saved = await this.repo.save(customer);
        this.logger.log(`🎉 Dossier soumis pour : ${id} → statut SUBMITTED`);
        return saved;
    }
    async findOne(id) {
        return this.findOrFail(id);
    }
    async findAll() {
        return this.repo.find({ order: { createdAt: 'DESC' } });
    }
    async findByEmail(email) {
        return this.repo.findOne({ where: { email } });
    }
    async update(id, dto) {
        const customer = await this.findOrFail(id);
        Object.assign(customer, dto);
        const updated = await this.repo.save(customer);
        this.logger.log(`Customer mis à jour : ${id}`);
        return updated;
    }
};
exports.CustomerService = CustomerService;
exports.CustomerService = CustomerService = CustomerService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(customer_entity_1.Customer)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        sms_service_1.SmsService])
], CustomerService);
//# sourceMappingURL=customer.service.js.map