import {
  Controller,
  Post,
  Get,
  Body,
  UploadedFile,
  UseInterceptors,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { OcrService, DocType } from './ocr.service';
import type { Multer } from 'multer';

@Controller('ocr')
export class OcrController {
  private readonly logger = new Logger(OcrController.name);

  constructor(private readonly ocrService: OcrService) {}

  /**
   * POST /ocr/scan
   * Body : multipart/form-data
   *   - document  : fichier image (jpg/png)
   *   - docType   : CIN_RECTO | CIN_VERSO | PASSPORT
   */
  @Post('scan')
  @UseInterceptors(FileInterceptor('document'))
  async scanDocument(
    @UploadedFile() file: Express.Multer.File,
    @Body('docType')    docType:    string,
    @Body('customerId') customerId: string,
  ) {
    if (!file) {
      throw new HttpException('Fichier manquant', HttpStatus.BAD_REQUEST);
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.mimetype)) {
      throw new HttpException(
        'Format invalide. Utilisez JPG ou PNG.',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Log ce qui est reçu pour debug
    this.logger.log(`Reçu → docType="${docType}" customerId="${customerId}" fichier="${file.originalname}"`);

    const cleanDocType = (docType || '').trim().toUpperCase();

    if (!['CIN_RECTO', 'CIN_VERSO', 'PASSPORT'].includes(cleanDocType)) {
      throw new HttpException(
        `docType invalide: "${docType}". Valeurs acceptées: CIN_RECTO, CIN_VERSO, PASSPORT`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const result = await this.ocrService.scanDocument(
      file.buffer,
      file.originalname,
      file.mimetype,
      cleanDocType as DocType,
      customerId || '',
    );

    return result;
  }

  /**
   * GET /ocr/health
   * Vérifie que le microservice Python est disponible
   */
  @Get('health')
  async health() {
    const isUp = await this.ocrService.healthCheck();
    return {
      nestjs:     'ok',
      ocrService: isUp ? 'ok' : 'unavailable',
    };
  }
}