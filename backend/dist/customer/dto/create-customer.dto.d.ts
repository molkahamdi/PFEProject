import { IdentificationSource } from '../entities/customer.entity';
export declare class CreateCustomerDto {
    identificationSource?: IdentificationSource;
    lastName: string;
    firstName: string;
    lastNameArabic: string;
    firstNameArabic: string;
    gender: string;
    nationality?: string;
    birthDate: string;
    birthPlace?: string;
    countryOfBirth?: string;
    countryOfResidence?: string;
    phoneNumber: string;
    email: string;
    idCardNumber: string;
    idIssueDate: string;
}
