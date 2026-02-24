export declare enum CustomerStatus {
    DRAFT = "DRAFT",
    PENDING_OTP = "PENDING_OTP",
    FATCA_PENDING = "FATCA_PENDING",
    DOCUMENTS_PENDING = "DOCUMENTS_PENDING",
    PERSONAL_PENDING = "PERSONAL_PENDING",
    SUBMITTED = "SUBMITTED",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED"
}
export declare enum IdentificationSource {
    E_HOUWIYA = "E_HOUWIYA",
    MANUAL = "MANUAL"
}
export declare class Customer {
    id: string;
    identificationSource: IdentificationSource;
    lastName: string;
    firstName: string;
    lastNameArabic: string;
    firstNameArabic: string;
    gender: string;
    nationality: string;
    birthDate: string;
    birthPlace: string;
    countryOfBirth: string;
    countryOfResidence: string;
    phoneNumber: string;
    email: string;
    idCardNumber: string;
    idIssueDate: string;
    otpCode: string;
    otpExpiresAt: Date;
    otpAttempts: number;
    isPhoneVerified: boolean;
    isUsCitizen: boolean;
    isUsResident: boolean;
    hasGreenCard: boolean;
    isUsTaxpayer: boolean;
    hasUsTransfers: boolean;
    hasUsPhone: boolean;
    hasUsProxy: boolean;
    isPoliticallyExposed: boolean;
    fatcaCompletedAt: Date;
    idCardFrontPath: string;
    idCardBackPath: string;
    passportPath: string;
    usePassport: boolean;
    documentsUploadedAt: Date;
    pays: string;
    gouvernorat: string;
    delegation: string;
    codePostal: string;
    adresse: string;
    adresseSuite: string;
    situationProfessionnelle: string;
    profession: string;
    posteActuel: string;
    dateEmbauche: string;
    employeur: string;
    entreprise: string;
    revenuMensuel: number;
    gouvernoratAgence: string;
    agence: string;
    status: CustomerStatus;
    currentStep: number;
    submittedAt: Date;
    accountNumber: string;
    accountCreatedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}
