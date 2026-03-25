// ============================================================
//  backend/src/customer/contract/contract.controller.ts
//  ✅ GET /customer/:id/contract/docx  → DOCX rempli
//  ✅ GET /customer/:id/contract/pdf   → PDF rempli
// ============================================================
import { Controller, Get, Param, Res } from '@nestjs/common';
import type { Response } from 'express';
import { ContractService } from './contract.service';

@Controller('customer')
export class ContractController {
  constructor(private readonly contractService: ContractService) {}

  // ── Télécharger le contrat Word (.docx) ───────────────────
  @Get(':id/contract/docx')
  async downloadDocx(
    @Param('id') customerId: string,
    @Res() res: Response,
  ): Promise<void> {
    await this.contractService.generateContractDocx(customerId, res);
  }

  // ── Télécharger le contrat PDF ────────────────────────────
  @Get(':id/contract/pdf')
  async downloadPdf(
    @Param('id') customerId: string,
    @Res() res: Response,
  ): Promise<void> {
    await this.contractService.generateContractPdf(customerId, res);
  }
}