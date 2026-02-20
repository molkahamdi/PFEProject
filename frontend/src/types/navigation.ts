// frontend/types/navigation.ts
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp as RNRouteProp } from '@react-navigation/native';

export type RootStackParamList = {
  Home: undefined;
  EligibilityConditions: undefined;
  OnboardingHome: undefined;
  OnboardingPersonalData: { customerId?: string; isEHouwiya?: boolean; data?: any } | undefined;
  OtpVerification: { customerId: string };
  FATCA: { customerId: string };
  DocumentsJustificatif: { customerId: string };
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