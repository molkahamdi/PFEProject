import { IsString, IsOptional, IsNumber, IsEnum, IsBoolean } from 'class-validator';
import { CustomerStatus } from '../../entities/customer.entity';

/**
 * DTO pour mettre à jour le customer au fil des étapes suivantes
 * Tous les champs sont optionnels car on met à jour progressivement
 * (étape 2 : documents, étape 3 : récap, etc.)
 */
export class UpdateCustomerDto {

  // ── Étape 2 : chemins des fichiers uploadés ─────────────────
  @IsString()
  @IsOptional()
  idCardFrontPath?: string;

  @IsString()
  @IsOptional()
  idCardBackPath?: string;

  @IsString()
  @IsOptional()
  addressProofPath?: string;

  @IsString()
  @IsOptional()
  photoPath?: string;

  // ── Étape 3 : informations complémentaires ──────────────────
  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsString()
  @IsOptional()
  postalCode?: string;

  @IsString()
  @IsOptional()
  profession?: string;

  @IsString()
  @IsOptional()
  employerName?: string;

  @IsNumber()
  @IsOptional()
  monthlyIncome?: number;

  // ── OTP ─────────────────────────────────────────────────────
  @IsBoolean()
  @IsOptional()
  isPhoneVerified?: boolean;

  // ── Étape 5 : signature ─────────────────────────────────────
  @IsString()
  @IsOptional()
  signaturePath?: string;

  // ── Statut et progression ───────────────────────────────────
  @IsEnum(CustomerStatus)
  @IsOptional()
  status?: CustomerStatus;

  @IsNumber()
  @IsOptional()
  currentStep?: number;
}