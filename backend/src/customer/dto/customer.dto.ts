// ══════════════════════════════════════════════════════════════
//  DTOs — Data Transfer Objects
//  Validation automatique de chaque étape
// ══════════════════════════════════════════════════════════════

import {
  IsString, IsEmail, IsEnum, IsOptional, IsNotEmpty,
  Length, Matches, IsBoolean, IsNumber,
} from 'class-validator';
import { IdentificationSource } from '../../entities/customer.entity';

// ──────────────────────────────────────────────────────────────
//  DTO ÉTAPE 1 : Données personnelles (OnboardingPersonalDataScreen)
// ──────────────────────────────────────────────────────────────
export class CreateCustomerDto {

  @IsEnum(IdentificationSource)
  @IsOptional()
  identificationSource?: IdentificationSource;

  // Identité
  @IsString() @IsNotEmpty({ message: 'Le nom est obligatoire' })
  lastName: string;

  @IsString() @IsNotEmpty({ message: 'Le prénom est obligatoire' })
  firstName: string;

  @IsString() @IsNotEmpty({ message: 'الاسم العائلي مطلوب' })
  lastNameArabic: string;

  @IsString() @IsNotEmpty({ message: 'الاسم الشخصي مطلوب' })
  firstNameArabic: string;

  @IsString() @IsNotEmpty({ message: 'Le genre est obligatoire' })
  gender: string;

  @IsString() @IsOptional()
  nationality?: string;

  @IsString() @IsNotEmpty()
  @Matches(/^\d{2}\/\d{2}\/\d{4}$/, { message: 'Format: JJ/MM/AAAA' })
  birthDate: string;

  @IsString() @IsOptional()
  birthPlace?: string;

  @IsString() @IsOptional()
  countryOfBirth?: string;

  @IsString() @IsOptional()
  countryOfResidence?: string;

  // Contact
  @IsString() @IsNotEmpty()
  @Length(8, 8, { message: '8 chiffres requis' })
  phoneNumber: string;

  @IsEmail({}, { message: 'Email invalide' })
  @IsNotEmpty({ message: 'L\'email est obligatoire' })
  email: string;

  // CIN
  @IsString() @IsNotEmpty()
  @Length(8, 8, { message: 'CIN = 8 chiffres' })
  idCardNumber: string;

  @IsString() @IsNotEmpty()
  @Matches(/^\d{2}\/\d{2}\/\d{4}$/, { message: 'Format: JJ/MM/AAAA' })
  idIssueDate: string;
}

// ──────────────────────────────────────────────────────────────
//  DTO OTP : Vérification téléphone (OtpVerificationScreen)
// ──────────────────────────────────────────────────────────────
export class VerifyOtpDto {
  @IsString() @IsNotEmpty()
  @Length(6, 6, { message: 'Le code OTP doit contenir 6 chiffres' })
  otpCode: string;
}

// ──────────────────────────────────────────────────────────────
//  DTO FATCA : Déclaration réglementaire (FATCAScreen)
// ──────────────────────────────────────────────────────────────
export class SaveFatcaDto {
  @IsBoolean() isUsCitizen: boolean;
  @IsBoolean() isUsResident: boolean;
  @IsBoolean() hasGreenCard: boolean;
  @IsBoolean() isUsTaxpayer: boolean;
  @IsBoolean() hasUsTransfers: boolean;
  @IsBoolean() hasUsPhone: boolean;
  @IsBoolean() hasUsProxy: boolean;
  @IsBoolean() isPoliticallyExposed: boolean;
}

// ──────────────────────────────────────────────────────────────
//  DTO ÉTAPE 2 : Documents (DocumentsJustificatifsScreen)
// ──────────────────────────────────────────────────────────────
export class SaveDocumentsDto {
  @IsBoolean() @IsOptional()
  usePassport?: boolean;

  @IsString() @IsOptional()
  idCardFrontPath?: string;

  @IsString() @IsOptional()
  idCardBackPath?: string;

  @IsString() @IsOptional()
  passportPath?: string;
}

// ──────────────────────────────────────────────────────────────
//  DTO ÉTAPE 3 : Données perso complètes (PersonalDataForm)
// ──────────────────────────────────────────────────────────────
export class SavePersonalFormDto {
  // Adresse
  @IsString() @IsOptional() pays?: string;
  @IsString() @IsNotEmpty() gouvernorat: string;
  @IsString() @IsNotEmpty() delegation: string;
  @IsString() @IsNotEmpty() codePostal: string;
  @IsString() @IsNotEmpty() adresse: string;
  @IsString() @IsOptional() adresseSuite?: string;

  // Profession
  @IsString() @IsNotEmpty() situationProfessionnelle: string;
  @IsString() @IsOptional() profession?: string;
  @IsString() @IsOptional() posteActuel?: string;
  @IsString() @IsOptional() dateEmbauche?: string;
  @IsString() @IsOptional() employeur?: string;
  @IsString() @IsOptional() entreprise?: string;
  @IsNumber() @IsOptional() revenuMensuel?: number;

  // Agence
  @IsString() @IsNotEmpty() gouvernoratAgence: string;
  @IsString() @IsNotEmpty() agence: string;
}