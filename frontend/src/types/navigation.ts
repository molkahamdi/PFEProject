// frontend/types/navigation.ts
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp as RNRouteProp } from '@react-navigation/native';

// Type partagé pour les données du formulaire OCR
export type OcrFormData = {
  lastName?:       string;   // arabe pour CIN
  firstName?:      string;   // arabe pour CIN
  lastNameLatin?:  string;   // latin pour PASSPORT
  firstNameLatin?: string;   // latin pour PASSPORT
  idCardNumber?:   string;
  birthDate?:      string;
  idIssueDate?:    string;
  gender?:         string;
  email?:          string;
};

export type RootStackParamList = {
  Home: undefined;
  EligibilityConditions: undefined;
  OnboardingHome: undefined;
  OnboardingPersonalData: { customerId?: string; isEHouwiya?: boolean; data?: any; fromRecap?: boolean; prefillData?: any;  } | undefined;
 OtpVerification: { customerId: string; formData?: OcrFormData; mode?: 'sms' | 'email'; };  
  FATCA: { customerId: string; fromRecap?: boolean; formData?: OcrFormData };
  DocumentsJustificatif: { customerId: string; fromRecap?: boolean; formData?: OcrFormData };
  Personaldataform: { customerId: string };
  Recapitulatif: { customerId: string };
  DigigoScreen: { customerId: string };
  OnboardingDocuments: undefined;
  OnboardingSummary: undefined;
  OnboardingSend: undefined;
  OnboardingSignature: undefined;
  ResumeRequest: undefined;
  ResumewithReference: undefined;
  IdentityVerification: undefined;
  ForgetPassword: undefined;
  NewPassword: undefined;
};

export type NavigationProp<T extends keyof RootStackParamList> =
  NativeStackNavigationProp<RootStackParamList, T>;

export type RouteProp<T extends keyof RootStackParamList> =
  RNRouteProp<RootStackParamList, T>;