// ============================================================
//  backend/src/customer/onboarding-verification.controller.ts
// ============================================================
import {
  Controller, Post, Param, HttpCode, HttpStatus,
} from '@nestjs/common';
import { OnboardingVerificationService } from './onboarding-verification.service';

@Controller('customer')
export class OnboardingVerificationController {
  constructor(private readonly service: OnboardingVerificationService) {}

  // POST /customer/:id/verify-onboarding
  @Post(':id/verify-onboarding')
  @HttpCode(HttpStatus.OK)
  async verifyOnboarding(@Param('id') id: string) {
    return this.service.verifyOnboarding(id);
  }

  // POST /customer/:id/verify-risk
  @Post(':id/verify-risk')
  @HttpCode(HttpStatus.OK)
  async verifyRisk(@Param('id') id: string) {
    return this.service.verifyRisk(id);
  }
}
