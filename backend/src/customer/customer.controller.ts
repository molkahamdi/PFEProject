import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  Patch,
} from '@nestjs/common';
import { CustomerService } from './customer.service';
import {
  CreateCustomerDto,
  VerifyOtpDto,
  SaveFatcaDto,
  SaveDocumentsDto,
  SavePersonalFormDto,
} from './dto/customer.dto';

@Controller('customer')
export class CustomerController {
  constructor(private readonly service: CustomerService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateCustomerDto) {
    const customer = await this.service.create(dto);
    return {
      success: true,
      message: 'Dossier créé. OTP à envoyer.',
      data: {
        id: customer.id,
        currentStep: customer.currentStep,
        status: customer.status,
      },
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const customer = await this.service.findOne(id);
    return { success: true, data: customer };
  }

  @Get()
  async findAll() {
    const list = await this.service.findAll();
    return { success: true, count: list.length, data: list };
  }

  @Get('by-email/:email')
  async findByEmail(@Param('email') email: string) {
    const customer = await this.service.findByEmail(email);
    if (!customer) return { success: false, data: null };
    return { success: true, data: customer };
  }

@Post(':id/otp')
@HttpCode(HttpStatus.OK)
async generateOtp(@Param('id') id: string) {
  const result = await this.service.generateOtp(id);
  return {
    success: true,
    message: 'Code OTP envoyé.',
    devOnly_otp: result.otp, // ← visible dans les logs Expo en DEV
    expiresAt: result.expiresAt,
  };
}

  @Post(':id/verify-otp')
  @HttpCode(HttpStatus.OK)
  async verifyOtp(@Param('id') id: string, @Body() dto: VerifyOtpDto) {
    const result = await this.service.verifyOtp(id, dto);
    return {
      ...result,
      message: result.success 
        ? 'Téléphone vérifié. Passage au FATCA.' 
        : 'Code OTP invalide',
    };
  }

  @Post(':id/fatca')
  @HttpCode(HttpStatus.OK)
  async saveFatca(@Param('id') id: string, @Body() dto: SaveFatcaDto) {
    const customer = await this.service.saveFatca(id, dto);
    return {
      success: true,
      message: 'Déclaration FATCA enregistrée.',
      data: { 
        id: customer.id, 
        currentStep: customer.currentStep, 
        status: customer.status 
      },
    };
  }

  @Post(':id/documents')
  @HttpCode(HttpStatus.OK)
  async saveDocuments(@Param('id') id: string, @Body() dto: SaveDocumentsDto) {
    const customer = await this.service.saveDocuments(id, dto);
    return {
      success: true,
      message: 'Documents enregistrés.',
      data: {  
        id: customer.id, 
        currentStep: customer.currentStep, 
        status: customer.status 
      },
    };
  }

  @Post(':id/personal-form')
  @HttpCode(HttpStatus.OK)
  async savePersonalForm(@Param('id') id: string, @Body() dto: SavePersonalFormDto) {
    const customer = await this.service.savePersonalForm(id, dto);
    return {
      success: true,
      message: 'Dossier soumis avec succès !',
      data: {
        id: customer.id,
        currentStep: customer.currentStep,
        status: customer.status,
        submittedAt: customer.submittedAt,
      },
    };
  }
  @Patch(':id')
async update(
  @Param('id') id: string,
  @Body() updateCustomerDto: Partial<CreateCustomerDto>, // ou un DTO dédié
) {
  const customer = await this.service.update(id, updateCustomerDto);
  return {
    success: true,
    message: 'Customer mis à jour avec succès',
    data: {
      id: customer.id,
      currentStep: customer.currentStep,
      status: customer.status,
    },
  };
}
  
}