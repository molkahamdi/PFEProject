import { IsString, IsEmail, IsEnum, IsOptional, IsNotEmpty, Length, Matches } from 'class-validator';
import { IdentificationSource } from '../entities/customer.entity';

/**
 * DTO = Data Transfer Object
 * Valide et type les données reçues depuis le frontend
 * pour la création initiale du customer (Étape 1 : données personnelles)
 */
export class CreateCustomerDto {

  // ── Source d'identification ─────────────────────────────────
  @IsEnum(IdentificationSource)
  @IsOptional()
  identificationSource?: IdentificationSource;

  // ── Identité ────────────────────────────────────────────────
  @IsString()
  @IsNotEmpty({ message: 'Le nom est obligatoire' })
  lastName: string;

  @IsString()
  @IsNotEmpty({ message: 'Le prénom est obligatoire' })
  firstName: string;

  @IsString()
  @IsNotEmpty({ message: 'Le nom en arabe est obligatoire' })
  lastNameArabic: string;

  @IsString()
  @IsNotEmpty({ message: 'Le prénom en arabe est obligatoire' })
  firstNameArabic: string;

  @IsString()
  @IsNotEmpty({ message: 'Le genre est obligatoire' })
  gender: string; // 'M' ou 'F'

  @IsString()
  @IsOptional()
  nationality?: string;

  @IsString()
  @IsNotEmpty({ message: 'La date de naissance est obligatoire' })
  @Matches(/^\d{2}\/\d{2}\/\d{4}$/, { message: 'Format attendu: JJ/MM/AAAA' })
  birthDate: string;

  @IsString()
  @IsOptional()
  birthPlace?: string;

  @IsString()
  @IsOptional()
  countryOfBirth?: string;

  @IsString()
  @IsOptional()
  countryOfResidence?: string;

  // ── Contact ─────────────────────────────────────────────────
  @IsString()
  @IsNotEmpty({ message: 'Le numéro de téléphone est obligatoire' })
  @Length(8, 8, { message: 'Le numéro doit contenir exactement 8 chiffres' })
  phoneNumber: string;

  @IsEmail({}, { message: 'Adresse email invalide' })
  @IsNotEmpty({ message: 'L\'email est obligatoire' })
  email: string;

  // ── Pièce d'identité ────────────────────────────────────────
  @IsString()
  @IsNotEmpty({ message: 'Le numéro CIN est obligatoire' })
  @Length(8, 8, { message: 'Le numéro CIN doit contenir exactement 8 chiffres' })
  idCardNumber: string;

  @IsString()
  @IsNotEmpty({ message: 'La date d\'émission est obligatoire' })
  @Matches(/^\d{2}\/\d{2}\/\d{4}$/, { message: 'Format attendu: JJ/MM/AAAA' })
  idIssueDate: string;
}