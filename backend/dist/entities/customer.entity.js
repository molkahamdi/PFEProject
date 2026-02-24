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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Customer = exports.IdentificationSource = exports.CustomerStatus = void 0;
const typeorm_1 = require("typeorm");
var CustomerStatus;
(function (CustomerStatus) {
    CustomerStatus["DRAFT"] = "DRAFT";
    CustomerStatus["PENDING_OTP"] = "PENDING_OTP";
    CustomerStatus["FATCA_PENDING"] = "FATCA_PENDING";
    CustomerStatus["DOCUMENTS_PENDING"] = "DOCUMENTS_PENDING";
    CustomerStatus["PERSONAL_PENDING"] = "PERSONAL_PENDING";
    CustomerStatus["SUBMITTED"] = "SUBMITTED";
    CustomerStatus["APPROVED"] = "APPROVED";
    CustomerStatus["REJECTED"] = "REJECTED";
})(CustomerStatus || (exports.CustomerStatus = CustomerStatus = {}));
var IdentificationSource;
(function (IdentificationSource) {
    IdentificationSource["E_HOUWIYA"] = "E_HOUWIYA";
    IdentificationSource["MANUAL"] = "MANUAL";
})(IdentificationSource || (exports.IdentificationSource = IdentificationSource = {}));
let Customer = class Customer {
    id;
    identificationSource;
    lastName;
    firstName;
    lastNameArabic;
    firstNameArabic;
    gender;
    nationality;
    birthDate;
    birthPlace;
    countryOfBirth;
    countryOfResidence;
    phoneNumber;
    email;
    idCardNumber;
    idIssueDate;
    otpCode;
    otpExpiresAt;
    otpAttempts;
    isPhoneVerified;
    isUsCitizen;
    isUsResident;
    hasGreenCard;
    isUsTaxpayer;
    hasUsTransfers;
    hasUsPhone;
    hasUsProxy;
    isPoliticallyExposed;
    fatcaCompletedAt;
    idCardFrontPath;
    idCardBackPath;
    passportPath;
    usePassport;
    documentsUploadedAt;
    pays;
    gouvernorat;
    delegation;
    codePostal;
    adresse;
    adresseSuite;
    situationProfessionnelle;
    profession;
    posteActuel;
    dateEmbauche;
    employeur;
    entreprise;
    revenuMensuel;
    gouvernoratAgence;
    agence;
    status;
    currentStep;
    submittedAt;
    accountNumber;
    accountCreatedAt;
    createdAt;
    updatedAt;
};
exports.Customer = Customer;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Customer.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'identification_source',
        type: 'enum',
        enum: IdentificationSource,
        default: IdentificationSource.MANUAL,
    }),
    __metadata("design:type", String)
], Customer.prototype, "identificationSource", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'last_name', nullable: true }),
    __metadata("design:type", String)
], Customer.prototype, "lastName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'first_name', nullable: true }),
    __metadata("design:type", String)
], Customer.prototype, "firstName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'last_name_arabic', nullable: true }),
    __metadata("design:type", String)
], Customer.prototype, "lastNameArabic", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'first_name_arabic', nullable: true }),
    __metadata("design:type", String)
], Customer.prototype, "firstNameArabic", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, comment: 'M = Monsieur / F = Madame' }),
    __metadata("design:type", String)
], Customer.prototype, "gender", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, default: 'Tunisie' }),
    __metadata("design:type", String)
], Customer.prototype, "nationality", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'birth_date', nullable: true, comment: 'JJ/MM/AAAA' }),
    __metadata("design:type", String)
], Customer.prototype, "birthDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'birth_place', nullable: true, default: 'Tunis' }),
    __metadata("design:type", String)
], Customer.prototype, "birthPlace", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'country_of_birth', nullable: true, default: 'Tunisie' }),
    __metadata("design:type", String)
], Customer.prototype, "countryOfBirth", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'country_of_residence', nullable: true, default: 'Tunisie' }),
    __metadata("design:type", String)
], Customer.prototype, "countryOfResidence", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'phone_number', nullable: true, comment: '8 chiffres sans +216' }),
    __metadata("design:type", String)
], Customer.prototype, "phoneNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, unique: true }),
    __metadata("design:type", String)
], Customer.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'id_card_number', nullable: true, comment: 'CIN 8 chiffres' }),
    __metadata("design:type", String)
], Customer.prototype, "idCardNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'id_issue_date', nullable: true, comment: 'JJ/MM/AAAA' }),
    __metadata("design:type", String)
], Customer.prototype, "idIssueDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'otp_code', nullable: true }),
    __metadata("design:type", String)
], Customer.prototype, "otpCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'otp_expires_at', nullable: true }),
    __metadata("design:type", Date)
], Customer.prototype, "otpExpiresAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'otp_attempts', default: 0, comment: 'Nombre de tentatives OTP' }),
    __metadata("design:type", Number)
], Customer.prototype, "otpAttempts", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_phone_verified', default: false }),
    __metadata("design:type", Boolean)
], Customer.prototype, "isPhoneVerified", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_us_citizen', nullable: true }),
    __metadata("design:type", Boolean)
], Customer.prototype, "isUsCitizen", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_us_resident', nullable: true }),
    __metadata("design:type", Boolean)
], Customer.prototype, "isUsResident", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'has_green_card', nullable: true }),
    __metadata("design:type", Boolean)
], Customer.prototype, "hasGreenCard", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_us_taxpayer', nullable: true }),
    __metadata("design:type", Boolean)
], Customer.prototype, "isUsTaxpayer", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'has_us_transfers', nullable: true }),
    __metadata("design:type", Boolean)
], Customer.prototype, "hasUsTransfers", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'has_us_phone', nullable: true }),
    __metadata("design:type", Boolean)
], Customer.prototype, "hasUsPhone", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'has_us_proxy', nullable: true }),
    __metadata("design:type", Boolean)
], Customer.prototype, "hasUsProxy", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_politically_exposed', nullable: true }),
    __metadata("design:type", Boolean)
], Customer.prototype, "isPoliticallyExposed", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'fatca_completed_at', nullable: true }),
    __metadata("design:type", Date)
], Customer.prototype, "fatcaCompletedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'id_card_front_path', nullable: true }),
    __metadata("design:type", String)
], Customer.prototype, "idCardFrontPath", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'id_card_back_path', nullable: true }),
    __metadata("design:type", String)
], Customer.prototype, "idCardBackPath", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'passport_path', nullable: true }),
    __metadata("design:type", String)
], Customer.prototype, "passportPath", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'use_passport', default: false, comment: 'true = passeport / false = CIN' }),
    __metadata("design:type", Boolean)
], Customer.prototype, "usePassport", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'documents_uploaded_at', nullable: true }),
    __metadata("design:type", Date)
], Customer.prototype, "documentsUploadedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, default: 'Tunisie' }),
    __metadata("design:type", String)
], Customer.prototype, "pays", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Customer.prototype, "gouvernorat", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Customer.prototype, "delegation", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'code_postal', nullable: true }),
    __metadata("design:type", String)
], Customer.prototype, "codePostal", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Customer.prototype, "adresse", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'adresse_suite', nullable: true }),
    __metadata("design:type", String)
], Customer.prototype, "adresseSuite", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'situation_professionnelle', nullable: true }),
    __metadata("design:type", String)
], Customer.prototype, "situationProfessionnelle", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Customer.prototype, "profession", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'poste_actuel', nullable: true }),
    __metadata("design:type", String)
], Customer.prototype, "posteActuel", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'date_embauche', nullable: true }),
    __metadata("design:type", String)
], Customer.prototype, "dateEmbauche", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Customer.prototype, "employeur", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Customer.prototype, "entreprise", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'revenu_mensuel',
        type: 'decimal',
        precision: 10,
        scale: 2,
        nullable: true,
    }),
    __metadata("design:type", Number)
], Customer.prototype, "revenuMensuel", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'gouvernorat_agence', nullable: true }),
    __metadata("design:type", String)
], Customer.prototype, "gouvernoratAgence", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Customer.prototype, "agence", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: CustomerStatus,
        default: CustomerStatus.DRAFT,
    }),
    __metadata("design:type", String)
], Customer.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'current_step',
        default: 1,
        comment: '1=PersonalData 2=OTP 3=FATCA 4=Documents 5=PersonalForm',
    }),
    __metadata("design:type", Number)
], Customer.prototype, "currentStep", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'submitted_at', nullable: true }),
    __metadata("design:type", Date)
], Customer.prototype, "submittedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'account_number', nullable: true, unique: true }),
    __metadata("design:type", String)
], Customer.prototype, "accountNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'account_created_at', nullable: true }),
    __metadata("design:type", Date)
], Customer.prototype, "accountCreatedAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Customer.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Customer.prototype, "updatedAt", void 0);
exports.Customer = Customer = __decorate([
    (0, typeorm_1.Entity)('customers')
], Customer);
//# sourceMappingURL=customer.entity.js.map