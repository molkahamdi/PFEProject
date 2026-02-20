// ============================================================
//  frontend/screens/OnboardingPersonalDataScreen.tsx
//  ÉTAPE 1 — Données personnelles (VERSION FINALE RÉORGANISÉE)
// ============================================================

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
  Modal,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import StepIndicator from '../components/common/StepIndicator';
import CustomDropdown from '../components/common/CustomDropdown';
import CustomInput from '../components/common/CustomInput';
import colors from '../../constants/colors';
import { NavigationProp } from '../types/navigation';
import { createCustomer } from '../services/customerApi';

// ============================================================
//  TYPES
// ============================================================

type Props = {
  navigation: NavigationProp<'OnboardingPersonalData'>;
};

type FormData = {
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
};

type DateField = 'birthDate' | 'idIssueDate';

// ============================================================
//  CONSTANTES
// ============================================================

const GENDER_OPTIONS = [
  { label: 'Madame', value: 'F' },
  { label: 'Monsieur', value: 'M' },
] as const;

const COUNTRIES = [
  { label: 'Tunisie', value: 'Tunisie' },
  { label: 'France', value: 'France' },
  { label: 'Allemagne', value: 'Allemagne' },
  { label: 'Espagne', value: 'Espagne' },
  { label: 'Italie', value: 'Italie' },
] as const;

const CITIES = [
  { label: 'Tunis', value: 'Tunis' },
  { label: 'Sfax', value: 'Sfax' },
  { label: 'Sousse', value: 'Sousse' },
  { label: 'Gabès', value: 'Gabès' },
  { label: 'Bizerte', value: 'Bizerte' },
  { label: 'Nabeul', value: 'Nabeul' },
  { label: 'Kairouan', value: 'Kairouan' },
  { label: 'Monastir', value: 'Monastir' },
  { label: 'Gafsa', value: 'Gafsa' },
  { label: 'Médenine', value: 'Médenine' },
] as const;

const WEEK_DAYS = ['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di'];

const MONTHS = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
] as const;

// ============================================================
//  COMPOSANTS RÉUTILISABLES
// ============================================================

const Header: React.FC = () => (
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
    <LinearGradient
      colors={[colors.atb.red, colors.atb.red]}
      style={styles.digipackBadge}
    >
      <Text style={styles.digipackText}>DIGIPACK</Text>
    </LinearGradient>
  </View>
);

const TitleSection: React.FC = () => (
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
          style={[styles.progressBarFill, { width: '20%' }]}
        />
      </View>
      <Text style={styles.progressText}>20%</Text>
    </View>
  </View>
);

const SectionHeader: React.FC<{ number: string; title: string }> = ({ number, title }) => (
  <View style={styles.sectionHeader}>
    <LinearGradient colors={[colors.atb.red, colors.atb.red]} style={styles.sectionNumber}>
      <Text style={styles.sectionNumberText}>{number}</Text>
    </LinearGradient>
    <Text style={styles.sectionTitle}>{title}</Text>
  </View>
);

const FieldLabel: React.FC<{ left: string; right: string }> = ({ left, right }) => (
  <View style={styles.horizontalLabelRow}>
    <Text style={styles.fieldLabelLeft}>{left}</Text>
    <Text style={styles.fieldLabelRight}>{right}</Text>
  </View>
);

const SecurityNotice: React.FC = () => (
  <View style={styles.securityNotice}>
    <LinearGradient
      colors={[colors.neutral.gray800, colors.neutral.gray700]}
      style={styles.securityIconWrapper}
    >
      <Text style={styles.securityIcon}>🔒</Text>
    </LinearGradient>
    <Text style={styles.securityText}>
      <Text style={styles.confidentialText}>Confidentialité</Text> : Vos données
      personnelles sont protégées et cryptées selon les normes internationales de
      sécurité bancaire.
    </Text>
    <Text style={[styles.securityText, styles.arabicText]}>
      <Text style={styles.confidentialText}>السرية</Text> : يتم حماية بياناتك الشخصية
      وتشفيرها وفقًا لمعايير الأمن البنكي الدولية.
    </Text>
  </View>
);

const Footer: React.FC = () => (
  <View style={styles.footer}>
    <View style={styles.footerDivider} />
    <Text style={styles.footerText}>© 2026 Arab Tunisian Bank · Tous droits réservés</Text>
    <Text style={styles.footerSubtext}>Service client : 71 143 000</Text>
  </View>
);

// ============================================================
//  COMPOSANT PRINCIPAL
// ============================================================

const OnboardingPersonalDataScreen: React.FC<Props> = ({ navigation }) => {
  // ── État du formulaire ──────────────────────────────────────
  const [formData, setFormData] = useState<FormData>({
    lastName: '',
    firstName: '',
    lastNameArabic: '',
    firstNameArabic: '',
    gender: '',
    nationality: 'Tunisie',
    birthDate: '',
    birthPlace: 'Tunis',
    countryOfBirth: 'Tunisie',
    countryOfResidence: 'Tunisie',
    phoneNumber: '',
    email: '',
    idCardNumber: '',
    idIssueDate: '',
  });

  const [isLoading, setIsLoading] = useState(false);

  // ── État du calendrier ────────────────────────────────────
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [currentDateField, setCurrentDateField] = useState<DateField | null>(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());

  // ============================================================
  //  FONCTIONS UTILITAIRES
  // ============================================================

  const updateField = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = (): boolean => {
    const requiredFields = [
      formData.lastName, formData.firstName,
      formData.lastNameArabic, formData.firstNameArabic,
      formData.gender, formData.nationality,
      formData.birthDate, formData.birthPlace,
      formData.countryOfBirth, formData.countryOfResidence,
      formData.phoneNumber, formData.email,
      formData.idCardNumber, formData.idIssueDate,
    ];

    if (requiredFields.some(field => !field || field.trim() === '')) {
      Alert.alert('Champs obligatoires', 'Veuillez remplir tous les champs obligatoires.', [
        { text: 'OK' },
      ]);
      return false;
    }
    return true;
  };

  const handleContinue = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const result = await createCustomer(
        {
          lastName: formData.lastName,
          firstName: formData.firstName,
          lastNameArabic: formData.lastNameArabic,
          firstNameArabic: formData.firstNameArabic,
          gender: formData.gender,
          nationality: formData.nationality,
          birthDate: formData.birthDate,
          birthPlace: formData.birthPlace,
          countryOfBirth: formData.countryOfBirth,
          countryOfResidence: formData.countryOfResidence,
          phoneNumber: formData.phoneNumber,
          email: formData.email,
          idCardNumber: formData.idCardNumber,
          idIssueDate: formData.idIssueDate,
        },
        'MANUAL',
      );

      // @ts-ignore — navigate avec params
      navigation.navigate('OtpVerification', { customerId: result.id });
    } catch (error: any) {
      Alert.alert('Erreur', error.message || 'Une erreur est survenue. Réessayez.');
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================================
  //  FONCTIONS CALENDRIER
  // ============================================================

  const formatDate = (date: Date): string => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const openDatePicker = (field: DateField) => {
    setCurrentDateField(field);
    const existingDate = formData[field];
    
    if (existingDate) {
      const [day, month, year] = existingDate.split('/');
      const parsedDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      if (!isNaN(parsedDate.getTime())) {
        setSelectedYear(parseInt(year));
        setSelectedMonth(parseInt(month) - 1);
        setSelectedDay(parseInt(day));
        setDatePickerVisible(true);
        return;
      }
    }
    
    const today = new Date();
    setSelectedYear(today.getFullYear());
    setSelectedMonth(today.getMonth());
    setSelectedDay(today.getDate());
    setDatePickerVisible(true);
  };

  const applyDate = () => {
    if (currentDateField) {
      const date = new Date(selectedYear, selectedMonth, selectedDay);
      updateField(currentDateField, formatDate(date));
    }
    setDatePickerVisible(false);
    setCurrentDateField(null);
  };

  const cancelDatePicker = () => {
    setDatePickerVisible(false);
    setCurrentDateField(null);
  };

  const changeMonth = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      if (selectedMonth === 0) {
        setSelectedMonth(11);
        setSelectedYear(prev => prev - 1);
      } else {
        setSelectedMonth(prev => prev - 1);
      }
    } else {
      if (selectedMonth === 11) {
        setSelectedMonth(0);
        setSelectedYear(prev => prev + 1);
      } else {
        setSelectedMonth(prev => prev + 1);
      }
    }
  };

  const generateCalendarDays = () => {
    const firstDay = new Date(selectedYear, selectedMonth, 1).getDay();
    const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1;
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
    const prevMonthDays = new Date(selectedYear, selectedMonth, 0).getDate();
    
    const days: { day: number; isCurrentMonth: boolean; date: Date }[] = [];

    // Jours du mois précédent
    for (let i = 0; i < adjustedFirstDay; i++) {
      const day = prevMonthDays - adjustedFirstDay + i + 1;
      days.push({ 
        day, 
        isCurrentMonth: false, 
        date: new Date(selectedYear, selectedMonth - 1, day) 
      });
    }

    // Jours du mois courant
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ 
        day: i, 
        isCurrentMonth: true, 
        date: new Date(selectedYear, selectedMonth, i) 
      });
    }

    // Jours du mois suivant
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({ 
        day: i, 
        isCurrentMonth: false, 
        date: new Date(selectedYear, selectedMonth + 1, i) 
      });
    }

    return days;
  };

  const calendarDays = generateCalendarDays();

  // ============================================================
  //  RENDU
  // ============================================================

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.neutral.gray100} />

      {/* Modal Calendrier */}
      <Modal
        visible={datePickerVisible}
        transparent
        animationType="fade"
        onRequestClose={cancelDatePicker}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Navigation mois */}
            <View style={styles.calendarHeader}>
              <TouchableOpacity 
                style={styles.monthNavButton} 
                onPress={() => changeMonth('prev')}
              >
                <Text style={styles.monthNavText}>←</Text>
              </TouchableOpacity>
              
              <Text style={styles.monthYearText}>
                {MONTHS[selectedMonth]} {selectedYear}
              </Text>
              
              <TouchableOpacity 
                style={styles.monthNavButton} 
                onPress={() => changeMonth('next')}
              >
                <Text style={styles.monthNavText}>→</Text>
              </TouchableOpacity>
            </View>

            {/* Jours de la semaine */}
            <View style={styles.weekDaysContainer}>
              {WEEK_DAYS.map((day, index) => (
                <Text key={index} style={styles.weekDayText}>{day}</Text>
              ))}
            </View>

            {/* Grille des jours */}
            <View style={styles.calendarGrid}>
              {calendarDays.map((day, index) => {
                const isSelected = day.isCurrentMonth &&
                  day.day === selectedDay &&
                  day.date.getMonth() === selectedMonth &&
                  day.date.getFullYear() === selectedYear;
                
                const isToday = day.date.toDateString() === new Date().toDateString();

                return (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.calendarDay,
                      !day.isCurrentMonth && styles.calendarDayOtherMonth,
                      isSelected && styles.calendarDaySelected,
                      isToday && styles.calendarDayToday,
                    ]}
                    onPress={() => {
                      if (day.isCurrentMonth) setSelectedDay(day.day);
                    }}
                  >
                    <Text
                      style={[
                        styles.calendarDayText,
                        !day.isCurrentMonth && styles.calendarDayTextOtherMonth,
                        isSelected && styles.calendarDayTextSelected,
                        isToday && !isSelected && styles.calendarDayTextToday,
                      ]}
                    >
                      {day.day}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Actions */}
            <View style={styles.calendarActions}>
              <TouchableOpacity 
                style={styles.calendarCancelButton} 
                onPress={cancelDatePicker}
              >
                <Text style={styles.calendarCancelText}>Annuler</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.calendarApplyButton} 
                onPress={applyDate}
              >
                <LinearGradient
                  colors={[colors.atb.red, colors.atb.red]}
                  style={styles.calendarApplyGradient}
                >
                  <Text style={styles.calendarApplyText}>Appliquer</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Header */}
      <Header />

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

            {/* Titre + Progression */}
            <TitleSection />

            {/* Indicateur d'étapes */}
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

            {/* CARTE 1 : Identité */}
            <View style={styles.card}>
              <SectionHeader number="1" title="Identité" />

              <View style={styles.formSection}>
                {/* Nom */}
                <View style={styles.fieldContainer}>
                  <FieldLabel left="Nom *" right="اللقب *" />
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.singleInput}
                      placeholder="Votre nom"
                      placeholderTextColor={colors.neutral.gray400}
                      value={formData.lastName}
                      onChangeText={text => updateField('lastName', text)}
                      selectionColor={colors.atb.primary}
                    />
                  </View>
                </View>

                {/* Prénom */}
                <View style={styles.fieldContainer}>
                  <FieldLabel left="Prénom *" right="الإسم *" />
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.singleInput}
                      placeholder="Votre prénom"
                      placeholderTextColor={colors.neutral.gray400}
                      value={formData.firstName}
                      onChangeText={text => updateField('firstName', text)}
                      selectionColor={colors.atb.primary}
                    />
                  </View>
                </View>

                {/* Noms en arabe */}
                <View style={styles.row}>
                  <View style={styles.halfWidth}>
                    <CustomInput
                      label="الاسم العائلي*"
                      placeholder=""
                      value={formData.lastNameArabic}
                      onChangeText={text => updateField('lastNameArabic', text)}
                      style={{ textAlign: 'right' }}
                    />
                  </View>
                  <View style={styles.halfWidth}>
                    <CustomInput
                      label="الاسم الشخصي*"
                      placeholder=""
                      value={formData.firstNameArabic}
                      onChangeText={text => updateField('firstNameArabic', text)}
                      style={{ textAlign: 'right' }}
                    />
                  </View>
                </View>

                {/* Civilité */}
                <View style={styles.fieldContainer}>
                  <FieldLabel left="Civilité *" right="الجنس *" />
                  <View style={styles.genderRow}>
                    {GENDER_OPTIONS.map(option => (
                      <TouchableOpacity
                        key={option.value}
                        onPress={() => updateField('gender', option.value)}
                        style={[
                          styles.genderButton,
                          formData.gender === option.value && styles.genderButtonSelected
                        ]}
                      >
                        <Text
                          style={[
                            styles.genderText,
                            formData.gender === option.value && styles.genderTextSelected
                          ]}
                        >
                          {option.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Nationalité */}
                <View style={styles.fieldContainer}>
                  <FieldLabel left="Nationalité *" right="الجنسية *" />
                  <CustomDropdown
                    label=""
                    value={formData.nationality}
                    options={COUNTRIES}
                    onSelect={value => updateField('nationality', value)}
                    required={false}
                  />
                </View>

                {/* Date de naissance */}
                <View style={styles.fieldContainer}>
                  <FieldLabel left="Date de naissance *" right="تاريخ الميلاد *" />
                  <TouchableOpacity
                    style={styles.dateInputTouchable}
                    onPress={() => openDatePicker('birthDate')}
                    activeOpacity={0.7}
                  >
                    <View style={styles.dateInputContainer}>
                      <Text style={[
                        styles.dateInputText, 
                        !formData.birthDate && styles.dateInputPlaceholder
                      ]}>
                        {formData.birthDate || 'JJ/MM/AAAA'}
                      </Text>
                      <LinearGradient 
                        colors={[colors.atb.red, colors.atb.red]} 
                        style={styles.calendarIconContainer}
                      >
                        <Text style={styles.calendarIcon}>📅</Text>
                      </LinearGradient>
                    </View>
                  </TouchableOpacity>
                </View>

                {/* Lieu de naissance */}
                <View style={styles.fieldContainer}>
                  <FieldLabel left="Lieu de naissance *" right="مكان الميلاد *" />
                  <CustomDropdown
                    label=""
                    value={formData.birthPlace}
                    options={CITIES}
                    onSelect={value => updateField('birthPlace', value)}
                    required={false}
                  />
                </View>

                {/* Pays de naissance */}
                <View style={styles.fieldContainer}>
                  <FieldLabel left="Pays de naissance *" right="بلد الميلاد *" />
                  <CustomDropdown
                    label=""
                    value={formData.countryOfBirth}
                    options={COUNTRIES}
                    onSelect={value => updateField('countryOfBirth', value)}
                    required={false}
                  />
                </View>

                {/* Pays de résidence */}
                <View style={styles.fieldContainer}>
                  <FieldLabel left="Pays de résidence *" right="بلد الإقامة *" />
                  <CustomDropdown
                    label=""
                    value={formData.countryOfResidence}
                    options={COUNTRIES}
                    onSelect={value => updateField('countryOfResidence', value)}
                    required={false}
                  />
                </View>
              </View>
            </View>

            {/* CARTE 2 : Contact */}
            <View style={styles.card}>
              <SectionHeader number="2" title="Contact" />

              <View style={styles.formSection}>
                {/* Téléphone */}
                <View style={styles.fieldContainer}>
                  <FieldLabel left="Numéro de téléphone *" right="رقم الهاتف *" />
                  <Text style={styles.fieldHint}>
                    Requis pour l'ouverture de compte / مطلوب لفتح الحساب
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
                        onChangeText={text => updateField('phoneNumber', text)}
                        selectionColor={colors.atb.primary}
                        maxLength={8}
                      />
                    </View>
                  </View>
                </View>

                {/* Email */}
                <View style={styles.fieldContainer}>
                  <FieldLabel left="Adresse email *" right="البريد الإلكتروني *" />
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
                      onChangeText={text => updateField('email', text)}
                      selectionColor={colors.atb.primary}
                    />
                  </View>
                </View>
              </View>
            </View>

            {/* CARTE 3 : Pièce d'identité */}
            <View style={styles.card}>
              <SectionHeader number="3" title="Pièce d'identité" />

              <View style={styles.formSection}>
                {/* Numéro CIN */}
                <View style={styles.fieldContainer}>
                  <FieldLabel left="Numéro de la carte d'identité *" right="رقم بطاقة الهوية *" />
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.singleInput}
                      placeholder="Saisir le numéro CIN"
                      placeholderTextColor={colors.neutral.gray400}
                      value={formData.idCardNumber}
                      onChangeText={text => updateField('idCardNumber', text)}
                      keyboardType="number-pad"
                      selectionColor={colors.atb.primary}
                      maxLength={8}
                    />
                  </View>
                </View>

                {/* Date d'émission */}
                <View style={styles.fieldContainer}>
                  <FieldLabel left="Date d'émission *" right="تاريخ الإصدار *" />
                  <TouchableOpacity
                    style={styles.dateInputTouchable}
                    onPress={() => openDatePicker('idIssueDate')}
                    activeOpacity={0.7}
                  >
                    <View style={styles.dateInputContainer}>
                      <Text style={[
                        styles.dateInputText, 
                        !formData.idIssueDate && styles.dateInputPlaceholder
                      ]}>
                        {formData.idIssueDate || 'JJ/MM/AAAA'}
                      </Text>
                      <LinearGradient 
                        colors={[colors.atb.red, colors.atb.red]} 
                        style={styles.calendarIconContainer}
                      >
                        <Text style={styles.calendarIcon}>📅</Text>
                      </LinearGradient>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Notice sécurité */}
              <SecurityNotice />
            </View>

            {/* Boutons */}
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
                disabled={isLoading}
              >
                <LinearGradient
                  colors={[colors.atb.red, colors.atb.red]}
                  style={styles.continueGradient}
                >
                  <Text style={styles.continueButtonText}>
                    {isLoading ? 'Envoi...' : 'Continuer'}
                  </Text>
                  <View style={styles.arrowRight} />
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {/* Footer */}
            <Footer />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// ============================================================
//  STYLES
// ============================================================

const styles = StyleSheet.create({
  // Layout de base
  safeArea: { 
    flex: 1, 
    backgroundColor: colors.neutral.white 
  },
  flex: { 
    flex: 1 
  },
  scrollContent: { 
    flexGrow: 1 
  },
  content: { 
    padding: 24 
  },

  // Header
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 24, 
    paddingVertical: 16, 
    borderBottomWidth: 1, 
    borderBottomColor: colors.neutral.gray300, 
    backgroundColor: colors.neutral.gray100 
  },
  headerLeft: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 12 
  },
  logoContainer: { 
    shadowColor: colors.atb.red, 
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.2, 
    shadowRadius: 8, 
    elevation: 6 
  },
  logo: { 
    width: 40, 
    height: 40 
  },
  logoGradient: { 
    width: 44, 
    height: 44, 
    borderRadius: 12, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  bankName: { 
    fontSize: 16, 
    fontWeight: '700', 
    color: colors.atb.red, 
    letterSpacing: 0.3 
  },
  bankSubtitle: { 
    fontSize: 11, 
    color: colors.neutral.gray500, 
    marginTop: 2, 
    fontWeight: '500' 
  },
  digipackBadge: { 
    paddingHorizontal: 10, 
    paddingVertical: 4, 
    borderRadius: 4, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  digipackText: { 
    fontSize: 10, 
    fontWeight: '800', 
    color: colors.neutral.white, 
    letterSpacing: 2 
  },

  // Titre et progression
  titleSection: { 
    marginBottom: 36 
  },
  titleHeader: { 
    marginBottom: 24 
  },
  pageNumber: { 
    fontSize: 11, 
    fontWeight: '800', 
    color: colors.atb.red, 
    letterSpacing: 1.5, 
    marginBottom: 10 
  },
  title: { 
    fontSize: 26, 
    fontWeight: '700', 
    color: colors.neutral.gray900, 
    marginBottom: 6, 
    letterSpacing: -0.3 
  },
  subtitle: { 
    fontSize: 13, 
    color: colors.neutral.gray600, 
    fontWeight: '400', 
    lineHeight: 19 
  },
  progressContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 12 
  },
  progressBarBackground: { 
    flex: 1, 
    height: 4, 
    backgroundColor: colors.neutral.gray200, 
    borderRadius: 2, 
    overflow: 'hidden' 
  },
  progressBarFill: { 
    height: '100%', 
    borderRadius: 2 
  },
  progressText: { 
    fontSize: 12, 
    fontWeight: '800', 
    color: colors.atb.red 
  },
  stepIndicatorContainer: { 
    marginBottom: 32 
  },

  // Cartes
  card: { 
    backgroundColor: colors.neutral.white, 
    borderRadius: 12, 
    marginBottom: 20, 
    paddingVertical: 24, 
    paddingHorizontal: 20, 
    shadowColor: colors.neutral.gray900, 
    shadowOffset: { width: 0, height: 1 }, 
    shadowOpacity: 0.05, 
    shadowRadius: 8, 
    elevation: 2 
  },
  sectionHeader: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 24, 
    paddingBottom: 16, 
    borderBottomWidth: 1, 
    borderBottomColor: colors.neutral.beige 
  },
  sectionNumber: { 
    width: 30, 
    height: 30, 
    borderRadius: 6, 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginRight: 12 
  },
  sectionNumberText: { 
    fontSize: 13, 
    fontWeight: '800', 
    color: colors.neutral.white 
  },
  sectionTitle: { 
    fontSize: 17, 
    fontWeight: '700', 
    color: colors.neutral.gray900, 
    letterSpacing: 0.1 
  },
  formSection: { 
    gap: 0 
  },

  // Champs de formulaire
  fieldContainer: { 
    marginBottom: 18 
  },
  horizontalLabelRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 5 
  },
  fieldLabelLeft: { 
    fontSize: 12, 
    fontWeight: '700', 
    color: colors.neutral.gray800, 
    letterSpacing: 0.3, 
    textTransform: 'uppercase' 
  },
  fieldLabelRight: { 
    fontSize: 12, 
    fontWeight: '700', 
    color: colors.neutral.gray800, 
    letterSpacing: 0.3, 
    textTransform: 'uppercase', 
    textAlign: 'right' 
  },
  fieldHint: { 
    fontSize: 12, 
    color: colors.neutral.gray500, 
    marginBottom: 12 
  },
  inputContainer: { 
    height: 50, 
    backgroundColor: colors.neutral.white, 
    borderWidth: 1.5, 
    borderColor: colors.neutral.gray300, 
    borderRadius: 6, 
    paddingHorizontal: 16, 
    justifyContent: 'center' 
  },
  singleInput: { 
    fontSize: 14, 
    color: colors.neutral.gray900, 
    fontWeight: '600', 
    padding: 0 
  },

  // Genre
  genderRow: { 
    flexDirection: 'row', 
    gap: 12 
  },
  genderButton: { 
    flex: 1, 
    height: 50, 
    borderWidth: 1.5, 
    borderColor: colors.neutral.gray300, 
    borderRadius: 6, 
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor: colors.neutral.white 
  },
  genderButtonSelected: { 
    borderColor: colors.atb.red, 
    backgroundColor: colors.neutral.offWhite, 
    borderWidth: 2 
  },
  genderText: { 
    fontSize: 14, 
    fontWeight: '600', 
    color: colors.neutral.gray600 
  },
  genderTextSelected: { 
    color: colors.atb.red, 
    fontWeight: '700' 
  },

  // Row
  row: { 
    flexDirection: 'row', 
    gap: 12, 
    marginBottom: 0 
  },
  halfWidth: { 
    flex: 1 
  },

  // Téléphone
  phoneRow: { 
    flexDirection: 'row', 
    gap: 12 
  },
  phonePrefix: { 
    width: 76, 
    height: 50, 
    backgroundColor: colors.neutral.offWhite, 
    borderWidth: 1.5, 
    borderColor: colors.neutral.gray300, 
    borderRadius: 6, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  phonePrefixText: { 
    fontSize: 15, 
    fontWeight: '600', 
    color: colors.neutral.gray700 
  },
  phoneInputContainer: { 
    flex: 1, 
    height: 50, 
    backgroundColor: colors.neutral.white, 
    borderWidth: 1.5, 
    borderColor: colors.neutral.gray300, 
    borderRadius: 6, 
    paddingHorizontal: 16, 
    justifyContent: 'center' 
  },
  phoneInput: { 
    fontSize: 14, 
    color: colors.neutral.gray900, 
    fontWeight: '600', 
    padding: 0 
  },

  // Email
  emailInputWrapper: { 
    height: 50, 
    backgroundColor: colors.neutral.white, 
    borderWidth: 1.5, 
    borderColor: colors.neutral.gray300, 
    borderRadius: 6, 
    paddingHorizontal: 16, 
    justifyContent: 'center' 
  },
  emailInput: { 
    fontSize: 14, 
    color: colors.neutral.gray900, 
    fontWeight: '600', 
    padding: 0 
  },

  // Date picker
  dateInputTouchable: { 
    width: '100%' 
  },
  dateInputContainer: { 
    height: 50, 
    backgroundColor: colors.neutral.white, 
    borderWidth: 1.5, 
    borderColor: colors.neutral.gray300, 
    borderRadius: 6, 
    paddingHorizontal: 16, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between' 
  },
  dateInputText: { 
    fontSize: 14, 
    color: colors.neutral.gray900, 
    fontWeight: '600', 
    flex: 1 
  },
  dateInputPlaceholder: { 
    color: colors.neutral.gray400, 
    fontWeight: '400' 
  },
  calendarIconContainer: { 
    width: 36, 
    height: 36, 
    borderRadius: 6, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  calendarIcon: { 
    fontSize: 18 
  },

  // Modal calendrier
  modalOverlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.5)', 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 24 
  },
  modalContent: { 
    width: '100%', 
    maxWidth: 400, 
    backgroundColor: colors.neutral.white, 
    borderRadius: 16, 
    overflow: 'hidden', 
    shadowColor: colors.neutral.gray900, 
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.25, 
    shadowRadius: 16, 
    elevation: 8, 
    padding: 20 
  },
  calendarHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 20, 
    paddingHorizontal: 10 
  },
  monthNavButton: { 
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor: colors.neutral.gray100 
  },
  monthNavText: { 
    fontSize: 16, 
    fontWeight: '600', 
    color: colors.atb.red 
  },
  monthYearText: { 
    fontSize: 18, 
    fontWeight: '700', 
    color: colors.neutral.gray900 
  },
  weekDaysContainer: { 
    flexDirection: 'row', 
    marginBottom: 10, 
    paddingHorizontal: 5 
  },
  weekDayText: { 
    flex: 1, 
    textAlign: 'center', 
    fontSize: 14, 
    fontWeight: '600', 
    color: colors.neutral.gray600, 
    paddingVertical: 8 
  },
  calendarGrid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    marginBottom: 20 
  },
  calendarDay: { 
    width: '14.28%', 
    aspectRatio: 1, 
    alignItems: 'center', 
    justifyContent: 'center', 
    borderRadius: 8 
  },
  calendarDayOtherMonth: { 
    opacity: 0.3 
  },
  calendarDaySelected: { 
    backgroundColor: colors.atb.red 
  },
  calendarDayToday: { 
    borderWidth: 1, 
    borderColor: colors.atb.red 
  },
  calendarDayText: { 
    fontSize: 15, 
    fontWeight: '500', 
    color: colors.neutral.gray900 
  },
  calendarDayTextOtherMonth: { 
    color: colors.neutral.gray500 
  },
  calendarDayTextSelected: { 
    color: colors.neutral.white, 
    fontWeight: '700' 
  },
  calendarDayTextToday: { 
    color: colors.atb.red, 
    fontWeight: '700' 
  },
  calendarActions: { 
    flexDirection: 'row', 
    gap: 12, 
    marginTop: 10 
  },
  calendarCancelButton: { 
    flex: 1, 
    height: 48, 
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor: colors.neutral.white, 
    borderWidth: 1, 
    borderColor: colors.neutral.gray300, 
    borderRadius: 8 
  },
  calendarCancelText: { 
    fontSize: 15, 
    fontWeight: '600', 
    color: colors.neutral.gray700 
  },
  calendarApplyButton: { 
    flex: 1, 
    height: 48, 
    borderRadius: 8, 
    overflow: 'hidden' 
  },
  calendarApplyGradient: { 
    width: '100%', 
    height: '100%', 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  calendarApplyText: { 
    fontSize: 15, 
    fontWeight: '700', 
    color: colors.neutral.white 
  },

  // Sécurité
  securityNotice: { 
    padding: 16, 
    backgroundColor: colors.neutral.offWhite, 
    borderRadius: 8, 
    borderWidth: 1, 
    borderColor: colors.neutral.beige, 
    marginTop: 8 
  },
  securityIconWrapper: { 
    width: 32, 
    height: 32, 
    borderRadius: 6, 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginBottom: 12, 
    alignSelf: 'flex-start' 
  },
  securityIcon: { 
    fontSize: 16 
  },
  securityText: { 
    fontSize: 11, 
    color: colors.neutral.gray600, 
    lineHeight: 16, 
    fontWeight: '500', 
    marginBottom: 8 
  },
  arabicText: { 
    textAlign: 'right' 
  },
  confidentialText: { 
    color: colors.atb.red, 
    fontWeight: '700' 
  },

  // Boutons
  buttonContainer: { 
    flexDirection: 'row', 
    gap: 12, 
    marginBottom: 32 
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
    justifyContent: 'center' 
  },
  backArrow: { 
    width: 7, 
    height: 7, 
    borderLeftWidth: 2, 
    borderBottomWidth: 2, 
    borderColor: colors.neutral.gray700, 
    transform: [{ rotate: '45deg' }], 
    marginRight: 8 
  },
  backButtonText: { 
    fontSize: 15, 
    fontWeight: '700', 
    color: colors.neutral.gray700, 
    letterSpacing: 0.3 
  },
  continueButton: { 
    flex: 1, 
    borderRadius: 8, 
    overflow: 'hidden', 
    shadowColor: colors.atb.red, 
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.25, 
    shadowRadius: 8, 
    elevation: 4 
  },
  continueGradient: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    height: 54, 
    paddingHorizontal: 28 
  },
  continueButtonText: { 
    fontSize: 15, 
    fontWeight: '700', 
    color: colors.neutral.white, 
    letterSpacing: 0.5, 
    marginRight: 8 
  },
  arrowRight: { 
    width: 7, 
    height: 7, 
    borderRightWidth: 2, 
    borderTopWidth: 2, 
    borderColor: colors.neutral.white, 
    transform: [{ rotate: '45deg' }] 
  },

  // Footer
  footer: { 
    alignItems: 'center', 
    paddingTop: 20, 
    paddingBottom: 8 
  },
  footerDivider: { 
    width: 50, 
    height: 2, 
    backgroundColor: colors.neutral.gray300, 
    borderRadius: 1, 
    marginBottom: 16 
  },
  footerText: { 
    fontSize: 11, 
    color: colors.neutral.gray500, 
    fontWeight: '500', 
    marginBottom: 4 
  },
  footerSubtext: { 
    fontSize: 10, 
    color: colors.neutral.gray400, 
    fontWeight: '400' 
  },
});

export default OnboardingPersonalDataScreen;