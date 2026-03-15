// ============================================================
//  backend/src/email-otp/email-otp.module.ts
//  ✅ Importe EmailModule pour accéder à EmailService
// ============================================================
import { Module } from '@nestjs/common';
import { EmailModule }        from '../email/email.module';
import { EmailOtpService }    from './email-otp.service';
import { EmailOtpController } from './email-otp.controller';

@Module({
  imports:     [EmailModule],
  controllers: [EmailOtpController],
  providers:   [EmailOtpService],
  exports:     [EmailOtpService],
})
export class EmailOtpModule {}