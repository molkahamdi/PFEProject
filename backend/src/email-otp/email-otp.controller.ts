// ============================================================
//  backend/src/email-otp/email-otp.controller.ts
//  ✅ POST /email-otp/request  → génère et envoie l'OTP email
//  ✅ POST /email-otp/verify   → vérifie le code saisi
// ============================================================
import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import { EmailOtpService } from './email-otp.service';

// ── DTOs ─────────────────────────────────────────────────────

export class RequestEmailOtpDto {
  @IsNotEmpty()
  @IsString()
  customerId: string;

  @IsOptional()
  @IsString()
  firstName?: string;
}

export class VerifyEmailOtpDto {
  @IsNotEmpty()
  @IsString()
  customerId: string;

  @IsNotEmpty()
  @IsString()
  @Length(6, 6, { message: 'Le code doit contenir exactement 6 chiffres.' })
  code: string;
}

// ── Controller ────────────────────────────────────────────────

@Controller('email-otp')
export class EmailOtpController {
  constructor(private readonly emailOtpService: EmailOtpService) {}

  /**
   * POST /email-otp/request
   * Génère un code OTP et l'envoie via Resend
   */
  @Post('request')
  @HttpCode(HttpStatus.OK)
  async requestEmailOtp(@Body() dto: RequestEmailOtpDto) {
    await this.emailOtpService.requestEmailOtp(
      dto.customerId,
      dto.firstName,
    );
    return {
      success: true,
      message: 'Un code de vérification a été envoyé par email.',
    };
  }

  /**
   * POST /email-otp/verify
   * Vérifie le code OTP saisi par l'utilisateur
   */
  @Post('verify')
  @HttpCode(HttpStatus.OK)
  verifyEmailOtp(@Body() dto: VerifyEmailOtpDto) {
    this.emailOtpService.verifyEmailOtp(dto.customerId, dto.code);
    return {
      success: true,
      message: 'Adresse email vérifiée avec succès.',
    };
  }
}