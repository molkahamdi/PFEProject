// ============================================================
//  backend/src/email-otp/email-otp.service.ts
//  ✅ Génération code OTP 6 chiffres
//  ✅ Stockage en mémoire TTL 10 minutes
//  ✅ Limite 3 tentatives
//  ✅ Envoi via EmailService (Resend)
// ============================================================
import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { EmailService } from '../email/email.service';

interface OtpRecord {
  code:       string;
  expiresAt:  number;
  attempts:   number;
  firstName?: string;
}

@Injectable()
export class EmailOtpService {
  private readonly logger = new Logger(EmailOtpService.name);
  private readonly store  = new Map<string, OtpRecord>();

  private readonly OTP_TTL_MS   = 10 * 60 * 1000; // 10 minutes
  private readonly MAX_ATTEMPTS = 3;

  constructor(private readonly emailService: EmailService) {}

  // ── Génère et envoie l'OTP ────────────────────────────────
  async requestEmailOtp(
    customerId: string,
    firstName?: string,
  ): Promise<void> {
    const code = this.generateCode();

    this.store.set(customerId, {
      code,
      expiresAt: Date.now() + this.OTP_TTL_MS,
      attempts:  0,
      firstName,
    });

    this.logger.log(`OTP email généré pour customerId=${customerId}`);
    await this.emailService.sendOtpEmail(code, firstName);
  }

  // ── Vérifie le code saisi ─────────────────────────────────
  verifyEmailOtp(customerId: string, code: string): void {
    const record = this.store.get(customerId);

    if (!record) {
      throw new NotFoundException(
        'Aucun code OTP en attente. Veuillez en demander un nouveau.',
      );
    }

    if (Date.now() > record.expiresAt) {
      this.store.delete(customerId);
      throw new BadRequestException(
        'Le code OTP a expiré. Veuillez en demander un nouveau.',
      );
    }

    record.attempts += 1;

    if (record.attempts > this.MAX_ATTEMPTS) {
      this.store.delete(customerId);
      throw new BadRequestException(
        'Nombre maximum de tentatives atteint. Veuillez demander un nouveau code.',
      );
    }

    if (record.code !== code.trim()) {
      const remaining = this.MAX_ATTEMPTS - record.attempts;
      throw new BadRequestException(
        `Code incorrect. ${remaining > 0
          ? `Il vous reste ${remaining} tentative(s).`
          : 'Aucune tentative restante.'
        }`,
      );
    }

    // ✅ Code correct → nettoyage
    this.store.delete(customerId);
    this.logger.log(`✅ Email OTP vérifié pour customerId=${customerId}`);
  }

  // ── Génère un code 6 chiffres ─────────────────────────────
  private generateCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
}