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
exports.CreateCustomerDto = void 0;
const class_validator_1 = require("class-validator");
const customer_entity_1 = require("../entities/customer.entity");
class CreateCustomerDto {
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
}
exports.CreateCustomerDto = CreateCustomerDto;
__decorate([
    (0, class_validator_1.IsEnum)(customer_entity_1.IdentificationSource),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateCustomerDto.prototype, "identificationSource", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Le nom est obligatoire' }),
    __metadata("design:type", String)
], CreateCustomerDto.prototype, "lastName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Le prénom est obligatoire' }),
    __metadata("design:type", String)
], CreateCustomerDto.prototype, "firstName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Le nom en arabe est obligatoire' }),
    __metadata("design:type", String)
], CreateCustomerDto.prototype, "lastNameArabic", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Le prénom en arabe est obligatoire' }),
    __metadata("design:type", String)
], CreateCustomerDto.prototype, "firstNameArabic", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Le genre est obligatoire' }),
    __metadata("design:type", String)
], CreateCustomerDto.prototype, "gender", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateCustomerDto.prototype, "nationality", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'La date de naissance est obligatoire' }),
    (0, class_validator_1.Matches)(/^\d{2}\/\d{2}\/\d{4}$/, { message: 'Format attendu: JJ/MM/AAAA' }),
    __metadata("design:type", String)
], CreateCustomerDto.prototype, "birthDate", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateCustomerDto.prototype, "birthPlace", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateCustomerDto.prototype, "countryOfBirth", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateCustomerDto.prototype, "countryOfResidence", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Le numéro de téléphone est obligatoire' }),
    (0, class_validator_1.Length)(8, 8, { message: 'Le numéro doit contenir exactement 8 chiffres' }),
    __metadata("design:type", String)
], CreateCustomerDto.prototype, "phoneNumber", void 0);
__decorate([
    (0, class_validator_1.IsEmail)({}, { message: 'Adresse email invalide' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'L\'email est obligatoire' }),
    __metadata("design:type", String)
], CreateCustomerDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Le numéro CIN est obligatoire' }),
    (0, class_validator_1.Length)(8, 8, { message: 'Le numéro CIN doit contenir exactement 8 chiffres' }),
    __metadata("design:type", String)
], CreateCustomerDto.prototype, "idCardNumber", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'La date d\'émission est obligatoire' }),
    (0, class_validator_1.Matches)(/^\d{2}\/\d{2}\/\d{4}$/, { message: 'Format attendu: JJ/MM/AAAA' }),
    __metadata("design:type", String)
], CreateCustomerDto.prototype, "idIssueDate", void 0);
//# sourceMappingURL=create-customer.dto.js.map