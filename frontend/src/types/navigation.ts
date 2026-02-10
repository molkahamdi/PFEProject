
/**
 * FICHIER : types/navigation.ts
 * 
 * DÉFINITION CENTRALISÉE DES TYPES DE NAVIGATION
 * 
 * Ce fichier est essentiel pour :
 * 1. Définir toutes les routes (écrans) disponibles dans l'application
 * 2. Fournir un typage TypeScript pour la navigation
 * 3. Activer l'auto-complétion et la vérification des erreurs
 * 4. Documenter la structure de navigation de l'application
 */

/**
 * Liste de tous les écrans (routes) disponibles dans l'application
 * 
 * FORMAT : "NomDeLEcran": typeDesParamètres
 * - "undefined" = l'écran ne reçoit aucun paramètre
 * - { param1: type, param2: type } = l'écran reçoit des paramètres
 * 
 * BONNE PRATIQUE : Regrouper les écrans par fonctionnalité
 */
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';

// Définir tous les screens de votre app
export type RootStackParamList = {
  OnboardingPersonalData: undefined;
  OnboardingDocuments: undefined;
  OnboardingSummary: undefined;
  OnboardingSend: undefined;
  OnboardingSignature: undefined;
  Home: undefined;
  EligibilityConditions: undefined;
  OtpVerification: undefined;
  FATCA: undefined;
  DocumentsJustificatif: undefined;
  OnboardingHome: undefined;
  Personaldataform: undefined;
  DigigoScreen: undefined;
  ResumeRequest: undefined;
  IdentityVerification: undefined;
  ResumewithReference:undefined
  ForgetPassword: undefined
  NewPassword: undefined;
  // Ajoutez vos autres screens ici
};

// Types helper pour la navigation
export type NavigationProp<T extends keyof RootStackParamList> = 
  NativeStackNavigationProp<RootStackParamList, T>;

export type RoutePropType<T extends keyof RootStackParamList> = 
  RouteProp<RootStackParamList, T>;