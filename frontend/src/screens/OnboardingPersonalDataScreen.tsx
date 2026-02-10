import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Image,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import StepIndicator from '../components/common/StepIndicator';
import CustomDropdown from '../components/common/CustomDropdown';
import DateInput from '../components/common/DateInput';
import colors from 'constants/colors';
import CustomInput from '@/components/common/CustomInput';

type NavigationProp = {
  goBack: () => void;
  navigate: (screen: string) => void;
};

type OnboardingPersonalDataScreenProps = {
  navigation: NavigationProp;
};

const OnboardingPersonalDataScreen: React.FC<OnboardingPersonalDataScreenProps> = ({ navigation }) => {
  const [formData, setFormData] = useState({
    lastName: '',
    firstName: '',
    lastNameArabic: '',
    firstNameArabic: '',
    gender: '',
    nationality: 'Tunisienne',
    birthDate: '',
    birthPlace: 'Tunis',
    countryOfBirth: 'Tunisia',
    countryOfResidence: 'Tunisia',
    phoneNumber: '',
    email: '',
    idCardNumber: '',
    idIssueDate: '',
  });

  const genderOptions = [
    { label: 'Madame', value: 'F' },
    { label: 'Monsieur', value: 'M' },
  ];

  const countries = [
    { label: 'Tunisie', value: 'Tunisia' },
    { label: 'France', value: 'France' },
    { label: 'Allemagne', value: 'Germany' },
    { label: 'Espagne', value: 'Spain' },
    { label: 'Italie', value: 'Italy' },
  ];

  const cities = [
    { label: 'Tunis', value: 'Tunis' },
    { label: 'Sfax', value: 'Sfax' },
    { label: 'Sousse', value: 'Sousse' },
    { label: 'Gabès', value: 'Gabes' },
    { label: 'Bizerte', value: 'Bizerte' },
  ];

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleContinue = () => {
    // Navigation directe vers OTP Verification Screen
    navigation.navigate('OtpVerification');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
       <StatusBar barStyle="dark-content" backgroundColor={colors.neutral.gray100} />
      {/* Header identique au EligibilityScreen */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.logoContainer}>
            <LinearGradient
              colors={[colors.atb.primary, colors.atb.primaryDark]}
              style={styles.logoGradient}
            >
              <Image
                source={require('../assets/atb.png')} 
                style={styles.logo}
                resizeMode="contain"
              />
            </LinearGradient>
          </View>
          <View>
            <Text style={styles.bankName}>Arab Tunisian Bank</Text>
            <Text style={styles.bankSubtitle}>البنك العربي التونسي</Text>
          </View>
        </View>
        
        {/* Badge DIGIPACK */}
        <LinearGradient
          colors={[colors.atb.red, colors.atb.red]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.digipackBadge}
        >
          <Text style={styles.digipackText}>DIGIPACK</Text>
        </LinearGradient>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <View style={styles.titleSection}>
              <View style={styles.titleHeader}>
                <View>
                  <Text style={styles.pageNumber}>ÉTAPE 01/05</Text>
                  <Text style={styles.title}>Informations personnelles</Text>
                  <Text style={styles.subtitle}>Veuillez remplir vos informations avec précision</Text>
                </View>
              </View>
              
              <View style={styles.progressContainer}>
                <View style={styles.progressBarBackground}>
                  <LinearGradient
                    colors={[colors.atb.red, colors.atb.red]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[styles.progressBarFill, { width: '20%' }]}
                  />
                </View>
                <Text style={styles.progressText}>20%</Text>
              </View>
            </View>

            <View style={styles.stepIndicatorContainer}>
              <StepIndicator
                currentStep={1}
                steps={[
                  'Données personnelles',
                  'Documents Justificatifs',
                  'Récapitulatif',
                  'Envoi de la demande',
                  'Signature électronique',
                ]}
              />
            </View>

            <View style={styles.card}>
              <View style={styles.sectionHeader}>
                <LinearGradient
                  colors={[colors.atb.red, colors.atb.red]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.sectionNumber}
                >
                  <Text style={styles.sectionNumberText}>1</Text>
                </LinearGradient>
                <Text style={styles.sectionTitle}>Identité</Text>
              </View>

              <View style={styles.formSection}>
                {/* Nom - Horizontal */}
                <View style={styles.fieldContainer}>
                  <View style={styles.horizontalLabelRow}>
                    <Text style={styles.fieldLabelLeft}>Nom *</Text>
                    <Text style={styles.fieldLabelRight}>اللقب  *</Text>
                  </View>
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.singleInput}
                      placeholder="Votre nom"
                      placeholderTextColor={colors.neutral.gray400}
                      value={formData.lastName}
                      onChangeText={(text) => updateField('lastName', text)}
                      selectionColor={colors.atb.primary}
                    />
                  </View>
                </View>

                {/* Prénom - Horizontal */}
                <View style={styles.fieldContainer}>
                  <View style={styles.horizontalLabelRow}>
                    <Text style={styles.fieldLabelLeft}>Prénom *</Text>
                    <Text style={styles.fieldLabelRight}>الإسم *</Text>
                  </View>
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.singleInput}
                      placeholder="Votre prénom"
                      placeholderTextColor={colors.neutral.gray400}
                      value={formData.firstName}
                      onChangeText={(text) => updateField('firstName', text)}
                      selectionColor={colors.atb.primary}
                    />
                  </View>
                </View>
                
                <View style={styles.row}>
                  <View style={styles.halfWidth}>
                    <CustomInput
                      label="الاسم العائلي*"
                      placeholder=""
                      value={formData.lastNameArabic}
                      onChangeText={(text) => updateField('lastNameArabic', text)}
                      style={{ textAlign: 'right' }}
                    />
                  </View>
                  <View style={styles.halfWidth}>
                    <CustomInput
                      label="الاسم الشخصي*"
                      placeholder=""
                      value={formData.firstNameArabic}
                      onChangeText={(text) => updateField('firstNameArabic', text)}
                      style={{ textAlign: 'right' }}
                    />
                  </View>
                </View>

                {/* Civilité - Horizontal */}
                <View style={styles.fieldContainer}>
                  <View style={styles.horizontalLabelRow}>
                    <Text style={styles.fieldLabelLeft}>Civilité *</Text>
                    <Text style={styles.fieldLabelRight}>الجنس *</Text>
                  </View>
                  <View style={styles.genderRow}>
                    {genderOptions.map((option) => (
                      <TouchableOpacity
                        key={option.value}
                        onPress={() => updateField('gender', option.value)}
                        style={[
                          styles.genderButton,
                          formData.gender === option.value && styles.genderButtonSelected,
                        ]}
                      >
                        <Text
                          style={[
                            styles.genderText,
                            formData.gender === option.value && styles.genderTextSelected,
                          ]}
                        >
                          {option.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Nationalité - Horizontal */}
                <View style={styles.fieldContainer}>
                  <View style={styles.horizontalLabelRow}>
                    <Text style={styles.fieldLabelLeft}>Nationalité *</Text>
                    <Text style={styles.fieldLabelRight}>الجنسية *</Text>
                  </View>
                  <CustomDropdown
                    label=""
                    value={formData.nationality}
                    options={countries}
                    onSelect={(value) => updateField('nationality', value)}
                    required={false}
                  />
                </View>

                {/* Date de naissance - Vertical (un des 4 champs spéciaux) */}
                <View style={styles.row}>
                  <View style={styles.halfWidth}>
                    <View style={styles.fieldContainer}>
                      <View style={styles.verticalLabelContainer}>
                        <Text style={styles.fieldLabel}>Date de naissance *</Text>
                        <Text style={styles.arabicLabel}>تاريخ الميلاد *</Text>
                      </View>
                      <DateInput
                        label=""
                        placeholder="JJ/MM/AAAA"
                        value={formData.birthDate}
                        onChangeText={(text) => updateField('birthDate', text)}
                        required={false}
                      />
                    </View>
                  </View>
                  
                  {/* Lieu de naissance - Vertical (un des 4 champs spéciaux) */}
                  <View style={styles.halfWidth}>
                    <View style={styles.fieldContainer}>
                      <View style={styles.verticalLabelContainer}>
                        <Text style={styles.fieldLabel}>Lieu de naissance *</Text>
                        <Text style={styles.arabicLabel}>مكان الميلاد *</Text>
                      </View>
                      <CustomDropdown
                        label=""
                        value={formData.birthPlace}
                        options={cities}
                        onSelect={(value) => updateField('birthPlace', value)}
                        required={false}
                      />
                    </View>
                  </View>
                </View>

                {/* Pays de naissance - Vertical (un des 4 champs spéciaux) */}
                <View style={styles.row}>
                  <View style={styles.halfWidth}>
                    <View style={styles.fieldContainer}>
                      <View style={styles.verticalLabelContainer}>
                        <Text style={styles.fieldLabel}>Pays de naissance *</Text>
                        <Text style={styles.arabicLabel}>بلد الميلاد *</Text>
                      </View>
                      <CustomDropdown
                        label=""
                        value={formData.countryOfBirth}
                        options={countries}
                        onSelect={(value) => updateField('countryOfBirth', value)}
                        required={false}
                      />
                    </View>
                  </View>
                  
                  {/* Pays de résidence - Vertical (un des 4 champs spéciaux) */}
                  <View style={styles.halfWidth}>
                    <View style={styles.fieldContainer}>
                      <View style={styles.verticalLabelContainer}>
                        <Text style={styles.fieldLabel}>Pays de résidence *</Text>
                        <Text style={styles.arabicLabel}>بلد الإقامة *</Text>
                      </View>
                      <CustomDropdown
                        label=""
                        value={formData.countryOfResidence}
                        options={countries}
                        onSelect={(value) => updateField('countryOfResidence', value)}
                        required={false}
                      />
                    </View>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.card}>
              <View style={styles.sectionHeader}>
                <LinearGradient
                  colors={[colors.atb.red, colors.atb.red]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.sectionNumber}
                >
                  <Text style={styles.sectionNumberText}>2</Text>
                </LinearGradient>
                <Text style={styles.sectionTitle}>Contact</Text>
              </View>

              <View style={styles.formSection}>
                {/* Téléphone - Horizontal */}
                <View style={styles.fieldContainer}>
                  <View style={styles.horizontalLabelRow}>
                    <Text style={styles.fieldLabelLeft}>Numéro de téléphone *</Text>
                    <Text style={styles.fieldLabelRight}>رقم الهاتف *</Text>
                  </View>
                  <Text style={styles.fieldHint}>
                    Requis pour l&apos;ouverture de compte / مطلوب لفتح الحساب
                  </Text>
                  
                  <View style={styles.phoneRow}>
                    <View style={styles.phonePrefix}>
                      <Text style={styles.phonePrefixText}>+216</Text>
                    </View>
                    <View style={styles.phoneInputContainer}>
                      <TextInput
                        style={styles.phoneInput}
                        placeholder="00 000 000"
                        placeholderTextColor={colors.neutral.gray400}
                        keyboardType="phone-pad"
                        value={formData.phoneNumber}
                        onChangeText={(text) => updateField('phoneNumber', text)}
                        selectionColor={colors.atb.primary}
                      />
                    </View>
                  </View>
                </View>

                {/* Email - Horizontal */}
                <View style={styles.fieldContainer}>
                  <View style={styles.horizontalLabelRow}>
                    <Text style={styles.fieldLabelLeft}>Adresse email *</Text>
                    <Text style={styles.fieldLabelRight}>البريد الإلكتروني *</Text>
                  </View>
                  <Text style={styles.fieldHint}>
                    Pour les confirmations et notifications / للتأكيدات والإشعارات
                  </Text>
                  
                  <View style={styles.emailInputWrapper}>
                    <TextInput
                      style={styles.emailInput}
                      placeholder="exemple@domaine.com"
                      placeholderTextColor={colors.neutral.gray400}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      value={formData.email}
                      onChangeText={(text) => updateField('email', text)}
                      selectionColor={colors.atb.primary}
                    />
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.card}>
              <View style={styles.sectionHeader}>
                <LinearGradient
                  colors={[colors.atb.red, colors.atb.red]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.sectionNumber}
                >
                  <Text style={styles.sectionNumberText}>3</Text>
                </LinearGradient>
                <Text style={styles.sectionTitle}>Pièce d&apos;identité</Text>
              </View>

              <View style={styles.formSection}>
                {/* Numéro CIN - Horizontal */}
                <View style={styles.fieldContainer}>
                  <View style={styles.horizontalLabelRow}>
                    <Text style={styles.fieldLabelLeft}>Numéro de la carte d&apos;identité *</Text>
                    <Text style={styles.fieldLabelRight}>رقم بطاقة الهوية *</Text>
                  </View>
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.singleInput}
                      placeholder="Saisir le numéro CIN"
                      placeholderTextColor={colors.neutral.gray400}
                      value={formData.idCardNumber}
                      onChangeText={(text) => updateField('idCardNumber', text)}
                      keyboardType="number-pad"
                      selectionColor={colors.atb.primary}
                    />
                  </View>
                </View>

                {/* Date d'émission - Horizontal */}
                <View style={styles.fieldContainer}>
                  <View style={styles.horizontalLabelRow}>
                    <Text style={styles.fieldLabelLeft}>Date d&apos;émission *</Text>
                    <Text style={styles.fieldLabelRight}>تاريخ الإصدار *</Text>
                  </View>
                  <DateInput
                    label=""
                    placeholder="JJ/MM/AAAA"
                    value={formData.idIssueDate}
                    onChangeText={(text) => updateField('idIssueDate', text)}
                    required={false}
                  />
                </View>
              </View>

              <View style={styles.securityNotice}>
                <LinearGradient
                  colors={[colors.neutral.gray800, colors.neutral.gray700]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.securityIconWrapper}
                >
                  {/* Contenu vide - juste le gradient */}
                </LinearGradient>
                <Text style={styles.securityText}>
                  <Text style={styles.confidentialText}>Confidentialité</Text> : Vos données personnelles sont protégées et cryptées selon les normes
                  internationales de sécurité bancaire.
                </Text>
                <Text style={[styles.securityText, styles.arabicText]}>
                  <Text style={styles.confidentialText}>السرية</Text> : يتم حماية بياناتك الشخصية وتشفيرها وفقًا لمعايير الأمن البنكي الدولية.
                </Text>
              </View>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.backButton}
              >
                <View style={styles.backArrow} />
                <Text style={styles.backButtonText}>Retour</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleContinue}
                style={styles.continueButton}
              >
                <LinearGradient
                  colors={[colors.atb.red, colors.atb.red]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.continueGradient}
                >
                  <Text style={styles.continueButtonText}>Continuer</Text>
                  <View style={styles.arrowRight} />
                </LinearGradient>
              </TouchableOpacity>
            </View>

            <View style={styles.footer}>
              <View style={styles.footerDivider} />
              <Text style={styles.footerText}>
                © 2026 Arab Tunisian Bank · Tous droits réservés
              </Text>
              <Text style={styles.footerSubtext}>Service client : 71 143 000</Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.neutral.white, 
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.gray300,
    backgroundColor: colors.neutral.gray100,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoContainer: {
    shadowColor: colors.atb.red,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  logo: {
    width: 40,
    height: 40,
  },
  logoGradient: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bankName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.atb.red,
    letterSpacing: 0.3,
  },
  bankSubtitle: {
    fontSize: 11,
    color: colors.neutral.gray500,
    marginTop: 2,
    fontWeight: '500',
  },
  digipackBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  digipackText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.neutral.white,
    letterSpacing: 2,
  },
  
  // Le reste des styles reste inchangé
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    padding: 24,
  },
  titleSection: {
    marginBottom: 36,
  },
  titleHeader: {
    marginBottom: 24,
  },
  pageNumber: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.atb.red,
    letterSpacing: 1.5,
    marginBottom: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.neutral.gray900,
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 13,
    color: colors.neutral.gray600,
    fontWeight: '400',
    lineHeight: 19,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressBarBackground: {
    flex: 1,
    height: 4,
    backgroundColor: colors.neutral.gray200,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.atb.red,
  },
  stepIndicatorContainer: {
    marginBottom: 32,
  },
  card: {
    backgroundColor: colors.neutral.white,
    borderRadius: 12,
    marginBottom: 20,
    paddingVertical: 24,
    paddingHorizontal: 20,
    shadowColor: colors.neutral.gray900,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.beige,
  },
  sectionNumber: {
    width: 30,
    height: 30,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  sectionNumberText: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.neutral.white,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.neutral.gray900,
    letterSpacing: 0.1,
  },
  formSection: {
    gap: 0,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  // Styles pour labels horizontaux (pour la plupart des champs)
  horizontalLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  fieldLabelLeft: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.neutral.gray800,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  fieldLabelRight: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.neutral.gray800,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
    textAlign: 'right',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  // Styles pour labels verticaux (pour les 4 champs spécifiques)
  verticalLabelContainer: {
    marginBottom: 8,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.neutral.gray800,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  arabicLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.neutral.gray800,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
    textAlign: 'left',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  confidentialText: {
    color: colors.atb.red,
    fontWeight: '700',
  },
  inputContainer: {
    height: 50,
    backgroundColor: colors.neutral.white,
    borderWidth: 1.5,
    borderColor: colors.neutral.gray300,
    borderRadius: 6,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  singleInput: {
    fontSize: 14,
    color: colors.neutral.gray900,
    fontWeight: '600',
    padding: 0,
  },
  fieldHint: {
    fontSize: 12,
    color: colors.neutral.gray500,
    marginBottom: 12,
  },
  genderRow: {
    flexDirection: 'row',
    gap: 12,
  },
  genderButton: {
    flex: 1,
    height: 50,
    borderWidth: 1.5,
    borderColor: colors.neutral.gray300,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.neutral.white,
  },
  genderButtonSelected: {
    borderColor: colors.atb.red,
    backgroundColor: colors.neutral.offWhite,
    borderWidth: 2,
  },
  genderText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.neutral.gray600,
  },
  genderTextSelected: {
    color: colors.atb.red,
    fontWeight: '700',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  phoneRow: {
    flexDirection: 'row',
    gap: 12,
  },
  phonePrefix: {
    width: 76,
    height: 50,
    backgroundColor: colors.neutral.offWhite,
    borderWidth: 1.5,
    borderColor: colors.neutral.gray300,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  phonePrefixText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.neutral.gray700,
  },
  phoneInputContainer: {
    flex: 1,
    height: 50,
    backgroundColor: colors.neutral.white,
    borderWidth: 1.5,
    borderColor: colors.neutral.gray300,
    borderRadius: 6,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  phoneInput: {
    fontSize: 14,
    color: colors.neutral.gray900,
    fontWeight: '600',
    padding: 0,
  },
  emailInputWrapper: {
    height: 50,
    backgroundColor: colors.neutral.white,
    borderWidth: 1.5,
    borderColor: colors.neutral.gray300,
    borderRadius: 6,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  emailInput: {
    fontSize: 14,
    color: colors.neutral.gray900,
    fontWeight: '600',
    padding: 0,
  },
  securityNotice: {
    padding: 16,
    backgroundColor: colors.neutral.offWhite,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.neutral.beige,
    marginTop: 8,
  },
  securityIconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  securityText: {
    fontSize: 11,
    color: colors.neutral.gray600,
    lineHeight: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  arabicText: {
    textAlign: 'right',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  backButton: {
    flex: 1,
    height: 54,
    backgroundColor: colors.neutral.white,
    borderWidth: 1.5,
    borderColor: colors.neutral.gray300,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrow: {
    width: 7,
    height: 7,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    borderColor: colors.neutral.gray700,
    transform: [{ rotate: '45deg' }],
    marginRight: 8,
  },
  backButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.neutral.gray700,
    letterSpacing: 0.3,
  },
  continueButton: {
    flex: 1,
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: colors.atb.red,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  continueGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 54,
    paddingHorizontal: 28,
  },
  continueButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.neutral.white,
    letterSpacing: 0.5,
    marginRight: 8,
  },
  arrowRight: {
    width: 7,
    height: 7,
    borderRightWidth: 2,
    borderTopWidth: 2,
    borderColor: colors.neutral.white,
    transform: [{ rotate: '45deg' }],
  },
  footer: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 8,
  },
  footerDivider: {
    width: 50,
    height: 2,
    backgroundColor: colors.neutral.gray300,
    borderRadius: 1,
    marginBottom: 16,
  },
  footerText: {
    fontSize: 11,
    color: colors.neutral.gray500,
    fontWeight: '500',
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 10,
    color: colors.neutral.gray400,
    fontWeight: '400',
  },
});

export default OnboardingPersonalDataScreen;