import { Repository } from 'typeorm';
import { Customer } from '../entities/customer.entity';
import { CreateCustomerDto, VerifyOtpDto, SaveFatcaDto, SaveDocumentsDto, SavePersonalFormDto } from './dto/customer.dto';
import { SmsService } from '../sms/sms.service';
export declare class CustomerService {
    private readonly repo;
    private readonly smsService;
    private readonly logger;
    constructor(repo: Repository<Customer>, smsService: SmsService);
    private findOrFail;
    create(dto: CreateCustomerDto): Promise<Customer>;
    generateOtp(id: string): Promise<{
        otp: string;
        expiresAt: Date;
    }>;
    verifyOtp(id: string, dto: VerifyOtpDto): Promise<{
        success: boolean;
    }>;
    saveFatca(id: string, dto: SaveFatcaDto): Promise<Customer>;
    saveDocuments(id: string, dto: SaveDocumentsDto): Promise<Customer>;
    savePersonalForm(id: string, dto: SavePersonalFormDto): Promise<Customer>;
    findOne(id: string): Promise<Customer>;
    findAll(): Promise<Customer[]>;
    findByEmail(email: string): Promise<Customer | null>;
    update(id: string, dto: Partial<CreateCustomerDto>): Promise<Customer>;
}
