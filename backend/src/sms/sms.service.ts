// src/sms/sms.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);
  private readonly accountSid: string;
  private readonly authToken: string;
  private readonly serviceSid: string;

  constructor(private readonly config: ConfigService) {
    this.accountSid = this.config.get<string>('TWILIO_ACCOUNT_SID') || '';
    this.authToken  = this.config.get<string>('TWILIO_AUTH_TOKEN')  || '';
    this.serviceSid = this.config.get<string>('TWILIO_VERIFY_SERVICE_SID') || '';
  }

  // ── Envoyer OTP via Twilio Verify ──────────────────────────
  async sendOtp(phoneNumber: string, otpCode?: string): Promise<void> {
    const formatted = phoneNumber.startsWith('+')
      ? phoneNumber
      : `+216${phoneNumber}`;

    console.log('📤 Twilio Verify — Envoi OTP à:', formatted);

    const body = new URLSearchParams({
      To:      formatted,
      Channel: 'sms',
    });

    const response = await fetch(
      `https://verify.twilio.com/v2/Services/${this.serviceSid}/Verifications`,
      {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + Buffer.from(
            `${this.accountSid}:${this.authToken}`
          ).toString('base64'),
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: body.toString(),
      }
    );

    const data = await response.json() as any;
    console.log('📥 Twilio Verify Response:', JSON.stringify(data, null, 2));

    if (!response.ok) {
      throw new Error(data?.message || `Erreur Twilio Verify HTTP ${response.status}`);
    }

    this.logger.log(`✅ OTP Twilio Verify envoyé à ${formatted} — status: ${data.status}`);
  }

  // ── Vérifier le code OTP via Twilio Verify ─────────────────
  async verifyOtpCode(phoneNumber: string, code: string): Promise<boolean> {
    const formatted = phoneNumber.startsWith('+')
      ? phoneNumber
      : `+216${phoneNumber}`;

    const body = new URLSearchParams({
      To:   formatted,
      Code: code,
    });

    const response = await fetch(
      `https://verify.twilio.com/v2/Services/${this.serviceSid}/VerificationCheck`,
      {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + Buffer.from(
            `${this.accountSid}:${this.authToken}`
          ).toString('base64'),
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: body.toString(),
      }
    );

    const data = await response.json() as any;
    console.log('Twilio VerifyCheck:', JSON.stringify(data, null, 2));

    return data.status === 'approved';
  }
}