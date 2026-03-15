// ============================================================
//  backend/src/email/email.module.ts
//  ✅ Exporte EmailService pour les autres modules
// ============================================================
import { Module } from '@nestjs/common';
import { EmailService } from './email.service';

@Module({
  providers: [EmailService],
  exports:   [EmailService],
})
export class EmailModule {}