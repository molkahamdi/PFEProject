import { CustomerStatus } from '../entities/customer.entity';
export declare class UpdateCustomerDto {
    idCardFrontPath?: string;
    idCardBackPath?: string;
    addressProofPath?: string;
    photoPath?: string;
    address?: string;
    city?: string;
    postalCode?: string;
    profession?: string;
    employerName?: string;
    monthlyIncome?: number;
    isPhoneVerified?: boolean;
    signaturePath?: string;
    status?: CustomerStatus;
    currentStep?: number;
}
