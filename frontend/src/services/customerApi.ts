
const BASE_URL = 'http://172.20.10.2:3000'; 


async function apiCall<T>(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' = 'GET',
  body?: object,
): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;

  const options: RequestInit = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url, options);
  const json     = await response.json();

  if (!response.ok) {
    // NestJS retourne { message: string | string[], statusCode: number }
    const message = Array.isArray(json.message)
      ? json.message.join(', ')
      : json.message || 'Une erreur est survenue';
    throw new Error(message);
  }

  return json;
}

// ══════════════════════════════════════════════════════════════
//  TYPES DE RÉPONSE
// ══════════════════════════════════════════════════════════════

export interface CustomerCreatedResponse {
  success: boolean;
  message: string;
  data: {
    id:          string;
    currentStep: number;
    status:      string;
  };
}

export interface OtpResponse {
  success:      boolean;
  message:      string;
  devOnly_otp?: string;   // DEV uniquement — retirer en production
  expiresAt?:   string;
}

export interface VerifyOtpResponse {
  success: boolean;
  message: string;
}

export interface CustomerDataResponse {
  success: boolean;
  data:    Record<string, any>;
}

// ══════════════════════════════════════════════════════════════
//  ÉTAPE 1 — Créer le customer
//  Appelé par OnboardingPersonalDataScreen → handleContinue
// ══════════════════════════════════════════════════════════════

export async function createCustomer(
  data: {
    lastName:           string;
    firstName:          string;
    lastNameArabic:     string;
    firstNameArabic:    string;
    gender:             string;
    nationality:        string;
    birthDate:          string;
    birthPlace:         string;
    countryOfBirth:     string;
    countryOfResidence: string;
    phoneNumber:        string;
    email:              string;
    idCardNumber:       string;
    idIssueDate:        string;
  },
  identificationSource: 'MANUAL' | 'E_HOUWIYA' = 'MANUAL',
): Promise<{ id: string; currentStep: number; status: string }> {
  const response = await apiCall<CustomerCreatedResponse>('/customer', 'POST', {
    ...data,
    identificationSource,
  });
  return response.data;
}

// ══════════════════════════════════════════════════════════════
//  OTP — Demander un code
//  Appelé par OtpVerificationScreen au montage du composant
// ══════════════════════════════════════════════════════════════

export async function requestOtp(customerId: string): Promise<OtpResponse> {
  return apiCall<OtpResponse>(`/customer/${customerId}/otp`, 'POST');
}

// ══════════════════════════════════════════════════════════════
//  OTP — Vérifier le code saisi
//  Appelé par OtpVerificationScreen → handleContinue
// ══════════════════════════════════════════════════════════════

export async function verifyOtp(
  customerId: string,
  otpCode:    string,
): Promise<VerifyOtpResponse> {
  return apiCall<VerifyOtpResponse>(`/customer/${customerId}/verify-otp`, 'POST', { otpCode });
}

// ══════════════════════════════════════════════════════════════
//  FATCA — Sauvegarder la déclaration
//  Appelé par FATCAScreen → handleContinue
// ══════════════════════════════════════════════════════════════

export async function saveFatca(
  customerId: string,
  data: {
    isUsCitizen:          boolean;
    isUsResident:         boolean;
    hasGreenCard:         boolean;
    isUsTaxpayer:         boolean;
    hasUsTransfers:       boolean;
    hasUsPhone:           boolean;
    hasUsProxy:           boolean;
    isPoliticallyExposed: boolean;
  },
): Promise<{ id: string; currentStep: number; status: string }> {
  const response = await apiCall<CustomerCreatedResponse>(
    `/customer/${customerId}/fatca`,
    'POST',
    data,
  );
  return response.data;
}

// ══════════════════════════════════════════════════════════════
//  DOCUMENTS — Sauvegarder les chemins/URIs
//  Appelé par DocumentsJustificatifsScreen → handleContinue
// ══════════════════════════════════════════════════════════════

export async function saveDocuments(
  customerId: string,
  data: {
    usePassport:       boolean;
    idCardFrontPath:   string | null;
    idCardBackPath:    string | null;
    passportPath:      string | null;
  },
): Promise<{ id: string; currentStep: number; status: string }> {
  const response = await apiCall<CustomerCreatedResponse>(
    `/customer/${customerId}/documents`,
    'POST',
    data,
  );
  return response.data;
}
// ══════════════════════════════════════════════════════════════
//  FORMULAIRE PERSO — Sauvegarder adresse + pro + agence
//  Appelé par PersonalDataForm → handleContinue
// ══════════════════════════════════════════════════════════════
export async function savePersonalForm(
  customerId: string,
  data: {
    pays:                    string;
    gouvernorat:             string;
    delegation:              string;
    codePostal:              string;
    adresse:                 string;
    adresseSuite?:           string;
    situationProfessionnelle:string;
    profession?:             string;
    posteActuel?:            string;
    dateEmbauche?:           string;
    employeur?:              string;
    entreprise?:             string;
    revenuMensuel?:          number;
    gouvernoratAgence:       string;
    agence:                  string;
  },
): Promise<{ id: string; currentStep: number; status: string; submittedAt: string }> {
  const response = await apiCall<{
    success: boolean;
    message: string;
    data: { id: string; currentStep: number; status: string; submittedAt: string };
  }>(`/customer/${customerId}/personal-form`, 'POST', data);
  return response.data;
}
// ══════════════════════════════════════════════════════════════
//  LECTURE — Récupérer un customer complet
//  Appelé par RecapitulatifScreen au chargement
// ══════════════════════════════════════════════════════════════

export async function getCustomer(customerId: string): Promise<Record<string, any>> {
  const response = await apiCall<CustomerDataResponse>(`/customer/${customerId}`, 'GET');
  return response.data;
}

// ══════════════════════════════════════════════════════════════
//  REPRISE — Chercher un dossier par email
// ══════════════════════════════════════════════════════════════

export async function findCustomerByEmail(
  email: string,
): Promise<Record<string, any> | null> {
  const response = await apiCall<CustomerDataResponse>(
    `/customer/by-email/${encodeURIComponent(email)}`,
    'GET',
  );
  return response.success ? response.data : null;
}

// ══════════════════════════════════════════════════════════════
//  MISE À JOUR — Mettre à jour partiellement un customer
//  Appelé par RecapitulatifScreen → handleContinue (si fromRecap = true)
// ══════════════════════════════════════════════════════════════
export async function updateCustomer(
  customerId: string,
  data: Partial<Record<string, any>>,  // Partial pour permettre des mises à jour partielles
): Promise<{ id: string; currentStep: number; status: string }> {
  const response = await apiCall<CustomerCreatedResponse>(`/customer/${customerId}`, 'PATCH', data);
  return response.data;
}

// ══════════════════════════════════════════════════════════════
//  TYPES
// ══════════════════════════════════════════════════════════════

export interface EmailOtpResponse {
  success: boolean;
  message: string;
}

export interface VerifyEmailOtpResponse {
  success: boolean;
  message: string;
}

// ══════════════════════════════════════════════════════════════
//  EMAIL OTP — Demander l'envoi du code par email
//  Appelé par OtpVerificationScreen quand mode === 'email'
// ══════════════════════════════════════════════════════════════

export async function requestEmailOtp(
  customerId: string,
  firstName?: string,
): Promise<EmailOtpResponse> {
  return apiCall<EmailOtpResponse>('/email-otp/request', 'POST', {
    customerId,
    firstName,
  });
}

// ══════════════════════════════════════════════════════════════
//  EMAIL OTP — Vérifier le code saisi par l'utilisateur
//  Appelé par OtpVerificationScreen → handleContinue (mode email)
// ══════════════════════════════════════════════════════════════

export async function verifyEmailOtp(
  customerId: string,
  code:       string,
): Promise<VerifyEmailOtpResponse> {
  return apiCall<VerifyEmailOtpResponse>('/email-otp/verify', 'POST', {
    customerId,
    code,
  });
}