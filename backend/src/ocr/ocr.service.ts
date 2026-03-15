import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

const FormData = require('form-data');

export type DocType = 'CIN_RECTO' | 'CIN_VERSO' | 'PASSPORT';

export interface OcrParsedData {
  lastNameArabic?:  string;
  firstNameArabic?: string;
  lastName?:        string;
  firstName?:       string;
  idCardNumber?:    string;
  birthDate?:       string;
  idIssueDate?:     string;
  expiryDate?:      string;
}

export interface OcrResult {
  success:       boolean;
  ocrDocumentId: string;
  allTokens:     string[];
  parsedData:    OcrParsedData;
  confidence:    number;
  docType:       DocType;
}

@Injectable()
export class OcrService {
  private readonly logger = new Logger(OcrService.name);
  private readonly OCR_URL = process.env.OCR_SERVICE_URL || 'http://localhost:8001';

  constructor(private readonly httpService: HttpService) {}

  async scanDocument(
    fileBuffer: Buffer,
    filename:   string,
    mimeType:   string,
    docType:    DocType,
    customerId: string,
  ): Promise<OcrResult> {
    this.logger.log(`Scan OCR [${docType}] pour customer ${customerId}`);

    const form = new FormData();
    form.append('document',   fileBuffer, { filename, contentType: mimeType });
    form.append('docType',    docType);
    form.append('customerId', customerId);

    try {
      const response = await firstValueFrom(
        this.httpService.post<OcrResult>(
          `${this.OCR_URL}/ocr/scan`,
          form,
          { headers: form.getHeaders() },
        ),
      );
      this.logger.log(`OCR succès [${docType}] confidence=${response.data.confidence}`);
      return response.data;

    } catch (error) {
      const msg = error?.response?.data?.detail || error?.message || 'Erreur OCR inconnue';
      this.logger.error(`OCR échoué [${docType}]: ${msg}`);
      throw new HttpException(
        `Erreur microservice OCR: ${msg}`,
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      await firstValueFrom(
        this.httpService.get(`${this.OCR_URL}/health`),
      );
      return true;
    } catch {
      return false;
    }
  }
}