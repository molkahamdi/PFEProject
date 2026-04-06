// ============================================================
//  frontend/screens/OnboardingPersonalDataScreen.tsx
//  ✅ Version finale intégration dynamique
//  ✅ Gestion erreurs réaliste : CIN existante, surveillance, SED
//  ✅ Redirection vers OnboardingHome en cas de blocage
// ============================================================
import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  KeyboardAvoidingView, Platform, StyleSheet, Image,
  StatusBar, Modal, Alert, ActivityIndicator, FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import CustomDropdown from '../components/common/CustomDropdown';
import colors from '../../constants/colors';
import { NavigationProp, RouteProp } from '../types/navigation';
import {
  createCustomer,
  updateCustomer,
  getCustomer,
  verifyOnboarding,
} from '../services/customerApi';

type Props = {
  navigation: NavigationProp<'OnboardingPersonalData'>;
  route: RouteProp<'OnboardingPersonalData'>;
};

type FormData = {
  lastName: string; firstName: string;
  lastNameArabic: string; firstNameArabic: string;
  gender: string; nationality: string;
  birthDate: string; birthPlace: string;
  countryOfBirth: string; 
  countryOfResidence: string;
  phoneNumber: string; 
  email: string;
  idCardNumber: string; 
  idIssueDate: string;
  

};

type DateField = 'birthDate' | 'idIssueDate';

const GENDER_OPTIONS = [
  { label: 'Madame', value: 'F' },
  { label: 'Monsieur', value: 'M' },
] as const;

const COUNTRIES = [
  { label: 'Tunisie', value: 'Tunisie' },
  
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
const MONTHS = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'] as const;

const CURRENT_YEAR = new Date().getFullYear();
const YEARS_LIST   = Array.from({ length: CURRENT_YEAR - 1939 }, (_, i) => CURRENT_YEAR - i);
const MONTHS_LIST  = MONTHS.map((m, i) => ({ label: m, value: i }));
const DAYS_LIST    = Array.from({ length: 31 }, (_, i) => ({ label: String(i + 1).padStart(2, '0'), value: i + 1 }));

const INITIAL_FORM: FormData = {
  lastName: '', firstName: '', lastNameArabic: '', firstNameArabic: '',
  gender: '', nationality: 'Tunisie', birthDate: '', birthPlace: 'Tunis',
  countryOfBirth: 'Tunisie', countryOfResidence: 'Tunisie',
  phoneNumber: '', email: '', idCardNumber: '', idIssueDate: '',
};

const validateFrenchText = (t: string) => /^[a-zA-ZÀ-ÿ\s\-']*$/.test(t);
const validateArabicText  = (t: string) => /^[\u0600-\u06FF\s\-']*$/.test(t);

// ── ScrollPicker ──────────────────────────────────────────────
const ITEM_HEIGHT = 44;
const ScrollPicker: React.FC<{
  items: { label: string; value: number }[];
  selectedValue: number;
  onSelect: (v: number) => void;
  width?: number;
}> = ({ items, selectedValue, onSelect, width = 80 }) => {
  const flatRef = useRef<FlatList>(null);
  const selectedIndex = items.findIndex(i => i.value === selectedValue);
  useEffect(() => {
    if (selectedIndex >= 0) setTimeout(() => {
      flatRef.current?.scrollToIndex({ index: selectedIndex, animated: true, viewPosition: 0.5 });
    }, 100);
  }, [selectedIndex]);
  return (
    <View style={{ width, height: ITEM_HEIGHT * 5, overflow: 'hidden' }}>
      <View pointerEvents="none" style={[styles.pickerLine, { top: ITEM_HEIGHT * 2 }]} />
      <View pointerEvents="none" style={[styles.pickerLine, { top: ITEM_HEIGHT * 3 - 1 }]} />
      <FlatList
        ref={flatRef} data={items} keyExtractor={i => String(i.value)}
        showsVerticalScrollIndicator={false} snapToInterval={ITEM_HEIGHT}
        decelerationRate="fast" contentContainerStyle={{ paddingVertical: ITEM_HEIGHT * 2 }}
        getItemLayout={(_, idx) => ({ length: ITEM_HEIGHT, offset: ITEM_HEIGHT * idx, index: idx })}
        onMomentumScrollEnd={e => {
          const idx = Math.round(e.nativeEvent.contentOffset.y / ITEM_HEIGHT);
          if (idx >= 0 && idx < items.length) onSelect(items[idx].value);
        }}
        renderItem={({ item }) => (
          <TouchableOpacity style={{ height: ITEM_HEIGHT, justifyContent: 'center', alignItems: 'center' }}
            onPress={() => onSelect(item.value)} activeOpacity={0.7}>
            <Text style={[styles.pickerText, item.value === selectedValue && styles.pickerTextSel]}>{item.label}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

// ── QuickDatePicker ───────────────────────────────────────────
const QuickDatePicker: React.FC<{
  visible: boolean; day: number; month: number; year: number;
  onConfirm: (d: number, m: number, y: number) => void; onClose: () => void;
}> = ({ visible, day, month, year, onConfirm, onClose }) => {
  const [d, setD] = useState(day);
  const [m, setM] = useState(month);
  const [y, setY] = useState(year);
  useEffect(() => { setD(day); setM(month); setY(year); }, [visible, day, month, year]);
  if (!visible) return null;
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.quickPickerOverlay}>
        <View style={styles.quickPickerContainer}>
          <Text style={styles.quickPickerTitle}>Sélectionner la date</Text>
          <Text style={styles.quickPickerSubtitle}>Faites défiler pour choisir</Text>
          <View style={styles.quickPickerRow}>
            <View style={styles.quickPickerCol}>
              <Text style={styles.quickPickerLabel}>Jour</Text>
              <ScrollPicker items={DAYS_LIST} selectedValue={d} onSelect={setD} width={60} />
            </View>
            <Text style={styles.quickPickerSep}>/</Text>
            <View style={[styles.quickPickerCol, { flex: 2 }]}>
              <Text style={styles.quickPickerLabel}>Mois</Text>
              <ScrollPicker items={MONTHS_LIST.map(mo => ({ label: mo.label, value: mo.value }))} selectedValue={m} onSelect={setM} width={120} />
            </View>
            <Text style={styles.quickPickerSep}>/</Text>
            <View style={styles.quickPickerCol}>
              <Text style={styles.quickPickerLabel}>Année</Text>
              <ScrollPicker items={YEARS_LIST.map(yr => ({ label: String(yr), value: yr }))} selectedValue={y} onSelect={setY} width={72} />
            </View>
          </View>
          <View style={styles.quickPickerActions}>
            <TouchableOpacity style={styles.quickPickerCancel} onPress={onClose}>
              <Text style={styles.quickPickerCancelText}>Annuler</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickPickerConfirm} onPress={() => { onConfirm(d, m, y); onClose(); }}>
              <LinearGradient colors={[colors.atb.red, colors.atb.red]} style={styles.quickPickerConfirmGrad}>
                <Text style={styles.quickPickerConfirmText}>Confirmer</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// ── Sous-composants ───────────────────────────────────────────
const Header: React.FC = () => (
  <View style={styles.header}>
    <View style={styles.headerLeft}>
      <View style={styles.logoContainer}>
        <LinearGradient colors={[colors.atb.primary, colors.atb.primaryDark]} style={styles.logoGradient}>
          <Image source={require('../assets/atb.png')} style={styles.logo} resizeMode="contain" />
        </LinearGradient>
      </View>
      <View>
        <Text style={styles.bankName}>Arab Tunisian Bank</Text>
        <Text style={styles.bankSubtitle}>البنك العربي التونسي</Text>
      </View>
    </View>
    <LinearGradient colors={[colors.atb.red, colors.atb.red]} style={styles.digipackBadge}>
      <Text style={styles.digipackText}>DIGIPACK</Text>
    </LinearGradient>
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
    <Text style={styles.securityText}>
      <Text style={styles.confidentialText}>Confidentialité</Text> : Vos données personnelles sont protégées et cryptées selon les normes internationales de sécurité bancaire.
    </Text>
    <Text style={[styles.securityText, styles.arabicText]}>
      <Text style={styles.confidentialText}>السرية</Text> : يتم حماية بياناتك الشخصية وتشفيرها وفقًا لمعايير الأمن البنكي الدولية.
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

const PhaseIndicator: React.FC<{ currentPhase: number }> = ({ currentPhase }) => {
  const phases = [
    { id: 1, label: 'Données personnelles' },
    { id: 2, label: 'Documents Justificatifs' },
    { id: 3, label: 'Récapitulatif' },
    { id: 4, label: 'Envoi de la demande' },
    { id: 5, label: 'Signature électronique' },
  ];
  return (
    <View style={styles.phaseContainer}>
      {phases.map((phase, index) => (
        <React.Fragment key={phase.id}>
          <View style={styles.phaseItem}>
            <View style={[styles.phaseRadioOuter, phase.id < currentPhase && styles.phaseRadioCompleted, phase.id === currentPhase && styles.phaseRadioActive]}>
              {phase.id < currentPhase
                ? <Text style={styles.phaseRadioCheck}>✓</Text>
                : <View style={[styles.phaseRadioInner, phase.id === currentPhase && styles.phaseRadioInnerActive]} />}
            </View>
            <Text style={[styles.phaseLabel, phase.id === currentPhase && styles.phaseLabelActive, phase.id < currentPhase && styles.phaseLabelCompleted]}>
              {phase.label}
            </Text>
          </View>
          {index < phases.length - 1 && <View style={styles.phaseConnector} />}
        </React.Fragment>
      ))}
    </View>
  );
};

// ── Composant principal ───────────────────────────────────────
const OnboardingPersonalDataScreen: React.FC<Props> = ({ navigation, route }) => {
  const customerId   = route?.params?.customerId;
  const fromRecap    = route?.params?.fromRecap   ?? false;
  const isEHouwiya   = route?.params?.isEHouwiya  ?? false;
  const eHouwiyaData = route?.params?.data        ?? null;
  const prefillData  = route?.params?.prefillData ?? null;

  const [formData, setFormData]     = useState<FormData>(INITIAL_FORM);
  const [isLoading, setIsLoading]   = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [loadingStep, setLoadingStep] = useState(''); // texte de progression

  const [datePickerVisible,  setDatePickerVisible]  = useState(false);
  const [currentDateField,   setCurrentDateField]   = useState<DateField | null>(null);
  const [selectedYear,  setSelectedYear]  = useState(new Date().getFullYear() - 25);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedDay,   setSelectedDay]   = useState(1);
  const [quickPickerVisible, setQuickPickerVisible] = useState(false);

  // ── Chargement ───────────────────────────────────────────
  useEffect(() => {
    if (fromRecap && customerId) {
      setIsFetching(true);
      getCustomer(customerId)
        .then((data: any) => setFormData({
          lastName: data.lastName || '', firstName: data.firstName || '',
          lastNameArabic: data.lastNameArabic || '', firstNameArabic: data.firstNameArabic || '',
          gender: data.gender || '', nationality: data.nationality || 'Tunisie',
          birthDate: data.birthDate || '', birthPlace: data.birthPlace || 'Tunis',
          countryOfBirth: data.countryOfBirth || 'Tunisie',
          countryOfResidence: data.countryOfResidence || 'Tunisie',
          phoneNumber: data.phoneNumber || '', email: data.email || '',
          idCardNumber: data.idCardNumber || '', idIssueDate: data.idIssueDate || '',
        }))
        .catch(() => Alert.alert('Erreur', 'Impossible de charger vos données.'))
        .finally(() => setIsFetching(false));
    } else if (isEHouwiya && eHouwiyaData) {
      setFormData(prev => ({ ...prev, ...eHouwiyaData }));
    } else if (prefillData) {
      setFormData(prev => ({
        ...prev,
        lastName:           prefillData.lastNameLatin  || prefillData.lastName      || prev.lastName,
        firstName:          prefillData.firstNameLatin || prefillData.firstName     || prev.firstName,
        lastNameArabic:     prefillData.lastName       || prev.lastNameArabic,
        firstNameArabic:    prefillData.firstName      || prev.firstNameArabic,
        idCardNumber:       prefillData.idCardNumber   || prev.idCardNumber,
        birthDate:          prefillData.birthDate      || prev.birthDate,
        email:              prefillData.email          || prev.email,
        gender:             prefillData.gender         || prev.gender,
        nationality:        prefillData.nationality    || prev.nationality,
        birthPlace:         prefillData.birthPlace     || prev.birthPlace,
        countryOfBirth:     prefillData.countryOfBirth     || prev.countryOfBirth,
        countryOfResidence: prefillData.countryOfResidence || prev.countryOfResidence,
        phoneNumber:        prefillData.phoneNumber    || prev.phoneNumber,
        idIssueDate:        prefillData.idIssueDate    || prev.idIssueDate,
      }));
    }
  }, []);

  const updateField = (field: keyof FormData, value: string) =>
    setFormData(prev => ({ ...prev, [field]: value }));

  const handleFrenchInput = (field: 'lastName' | 'firstName', text: string) => {
    if (validateFrenchText(text)) updateField(field, text);
  };
  const handleArabicInput = (field: 'lastNameArabic' | 'firstNameArabic', text: string) => {
    if (validateArabicText(text) || text === '') updateField(field, text);
  };

  const formatDate = (date: Date) => {
    const d = date.getDate().toString().padStart(2, '0');
    const m = (date.getMonth() + 1).toString().padStart(2, '0');
    return `${d}/${m}/${date.getFullYear()}`;
  };

  const openDatePicker = (field: DateField) => {
    setCurrentDateField(field);
    const existing = formData[field];
    if (existing) {
      const [d, m, y] = existing.split('/');
      const parsed = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
      if (!isNaN(parsed.getTime())) {
        setSelectedYear(parseInt(y)); setSelectedMonth(parseInt(m) - 1); setSelectedDay(parseInt(d));
        setDatePickerVisible(true); return;
      }
    }
    const t = new Date();
    setSelectedYear(t.getFullYear() - 25); setSelectedMonth(t.getMonth()); setSelectedDay(t.getDate());
    setDatePickerVisible(true);
  };

  const applyDate = () => {
    if (currentDateField) updateField(currentDateField, formatDate(new Date(selectedYear, selectedMonth, selectedDay)));
    setDatePickerVisible(false); setCurrentDateField(null);
  };

  const cancelDatePicker = () => { setDatePickerVisible(false); setCurrentDateField(null); };

  const changeMonth = (dir: 'prev' | 'next') => {
    if (dir === 'prev') {
      if (selectedMonth === 0) { setSelectedMonth(11); setSelectedYear(y => y - 1); }
      else setSelectedMonth(m => m - 1);
    } else {
      if (selectedMonth === 11) { setSelectedMonth(0); setSelectedYear(y => y + 1); }
      else setSelectedMonth(m => m + 1);
    }
  };

  const generateCalendarDays = () => {
    const firstDay = new Date(selectedYear, selectedMonth, 1).getDay();
    const adj = firstDay === 0 ? 6 : firstDay - 1;
    const dim = new Date(selectedYear, selectedMonth + 1, 0).getDate();
    const prev = new Date(selectedYear, selectedMonth, 0).getDate();
    const days: { day: number; isCurrentMonth: boolean; date: Date }[] = [];
    for (let i = 0; i < adj; i++) {
      const d = prev - adj + i + 1;
      days.push({ day: d, isCurrentMonth: false, date: new Date(selectedYear, selectedMonth - 1, d) });
    }
    for (let i = 1; i <= dim; i++) days.push({ day: i, isCurrentMonth: true, date: new Date(selectedYear, selectedMonth, i) });
    const rem = 42 - days.length;
    for (let i = 1; i <= rem; i++) days.push({ day: i, isCurrentMonth: false, date: new Date(selectedYear, selectedMonth + 1, i) });
    return days;
  };
  const calendarDays = generateCalendarDays();

  const validateForm = (): boolean => {
    const required = [
      formData.lastName, formData.firstName, formData.lastNameArabic, formData.firstNameArabic,
      formData.gender, formData.nationality, formData.birthDate, formData.birthPlace,
      formData.countryOfBirth, formData.countryOfResidence,
      formData.phoneNumber, formData.email, formData.idCardNumber, formData.idIssueDate,
    ];
    if (required.some(f => !f || f.trim() === '')) {
      Alert.alert('Champs obligatoires', 'Veuillez remplir tous les champs obligatoires.', [{ text: 'OK' }]);
      return false;
    }
    return true;
  };

  // ── handleContinue — flux complet ────────────────────────
  const handleContinue = async () => {
    if (!validateForm()) return;
    setIsLoading(true);

    try {
      const payload = {
        lastName: formData.lastName, firstName: formData.firstName,
        lastNameArabic: formData.lastNameArabic, firstNameArabic: formData.firstNameArabic,
        gender: formData.gender, nationality: formData.nationality,
        birthDate: formData.birthDate, birthPlace: formData.birthPlace,
        countryOfBirth: formData.countryOfBirth, countryOfResidence: formData.countryOfResidence,
        phoneNumber: formData.phoneNumber, email: formData.email,
        idCardNumber: formData.idCardNumber, idIssueDate: formData.idIssueDate,
      };

      const otpFormData = {
        lastName: formData.lastNameArabic, firstName: formData.firstNameArabic,
        lastNameLatin: formData.lastName, firstNameLatin: formData.firstName,
        idCardNumber: formData.idCardNumber, birthDate: formData.birthDate,
        email: formData.email, gender: formData.gender,
        nationality: formData.nationality, birthPlace: formData.birthPlace,
        countryOfBirth: formData.countryOfBirth, countryOfResidence: formData.countryOfResidence,
        phoneNumber: formData.phoneNumber, idIssueDate: formData.idIssueDate,
      };

      // ── MODE MODIFICATION : pas de vérification onboarding ─
      if (fromRecap && customerId) {
        setLoadingStep('Sauvegarde...');
        await updateCustomer(customerId, payload);
        Alert.alert('✅ Modifications enregistrées', 'Vos informations ont été mises à jour.', [
          { text: 'Retour au récapitulatif', onPress: () => {
            // @ts-ignore
            navigation.navigate('Recapitulatif', { customerId });
          }},
        ]);
        return;
      }

      // ── ÉTAPE 1 : enregistrement du dossier ──────────────
      setLoadingStep('Enregistrement...');
      let currentCustomerId = customerId;
      if (!currentCustomerId) {
        const result = await createCustomer(payload, 'MANUAL');
        currentCustomerId = result.id;
      } else {
        await updateCustomer(currentCustomerId, payload);
      }

      // ── ÉTAPE 2 : vérifications sécurité ─────────────────
      // VerifPID (CIN existante?) + FCM SCAN (surveillance?) + SED (chéquier?)
      setLoadingStep('Vérification de votre identité...');
      const verification = await verifyOnboarding(currentCustomerId);

      if (!verification.success) {
        // Afficher le message exact du backend selon l'étape bloquée
        Alert.alert(
          'Demande non autorisée',
          verification.message,
          [{ 
            text: 'Compris', 
            onPress: () => {
              // Redirection forcée vers l'accueil
              navigation.reset({
                index: 0,
                routes: [{ name: 'OnboardingHome' }],
              });
            }
          }],
        );
        return;
      }

      // ── ÉTAPE 3 : OTP ─────────────────────────────────────
      setLoadingStep('Redirection vers OTP...');
      // @ts-ignore
      navigation.navigate('OtpVerification', {
        customerId: currentCustomerId,
        formData: otpFormData,
      });

    } catch (error: any) {
      Alert.alert('Erreur de connexion', error.message || 'Impossible de contacter le serveur. Vérifiez votre connexion.');
    } finally {
      setIsLoading(false);
      setLoadingStep('');
    }
  };

  if (isFetching) {
    return (
      <SafeAreaView style={styles.loadingScreen} edges={['top']}>
        <ActivityIndicator size="large" color={colors.atb.red} />
        <Text style={styles.loadingText}>Chargement de vos données...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.neutral.gray100} />

      {/* ── Modal calendrier ── */}
      <Modal visible={datePickerVisible} transparent animationType="fade" onRequestClose={cancelDatePicker}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.calendarHeader}>
              <TouchableOpacity style={styles.monthNavButton} onPress={() => changeMonth('prev')}>
                <Text style={styles.monthNavText}>←</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setQuickPickerVisible(true)} activeOpacity={0.7}>
                <View style={styles.monthYearTouchable}>
                  <Text style={styles.monthYearText}>{MONTHS[selectedMonth]} {selectedYear}</Text>
                  <Text style={styles.monthYearHint}>↕</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.monthNavButton} onPress={() => changeMonth('next')}>
                <Text style={styles.monthNavText}>→</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.weekDaysContainer}>
              {WEEK_DAYS.map((day, i) => <Text key={i} style={styles.weekDayText}>{day}</Text>)}
            </View>
            <View style={styles.calendarGrid}>
              {calendarDays.map((day, index) => {
                const isSelected = day.isCurrentMonth && day.day === selectedDay &&
                  day.date.getMonth() === selectedMonth && day.date.getFullYear() === selectedYear;
                const isToday = day.date.toDateString() === new Date().toDateString();
                return (
                  <TouchableOpacity key={index}
                    style={[styles.calendarDay, !day.isCurrentMonth && styles.calendarDayOtherMonth,
                      isSelected && styles.calendarDaySelected, isToday && styles.calendarDayToday]}
                    onPress={() => { if (day.isCurrentMonth) setSelectedDay(day.day); }}>
                    <Text style={[styles.calendarDayText, !day.isCurrentMonth && styles.calendarDayTextOtherMonth,
                      isSelected && styles.calendarDayTextSelected, isToday && !isSelected && styles.calendarDayTextToday]}>
                      {day.day}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            <View style={styles.calendarActions}>
              <TouchableOpacity style={styles.calendarCancelButton} onPress={cancelDatePicker}>
                <Text style={styles.calendarCancelText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.calendarApplyButton} onPress={applyDate}>
                <LinearGradient colors={[colors.atb.red, colors.atb.red]} style={styles.calendarApplyGradient}>
                  <Text style={styles.calendarApplyText}>Appliquer</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <QuickDatePicker
        visible={quickPickerVisible} day={selectedDay} month={selectedMonth} year={selectedYear}
        onConfirm={(d, m, y) => { setSelectedDay(d); setSelectedMonth(m); setSelectedYear(y); }}
        onClose={() => setQuickPickerVisible(false)}
      />

      <Header />

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
        <ScrollView style={styles.flex} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>

            {fromRecap && (
              <View style={styles.editBanner}>
                <Text style={styles.editBannerText}>Mode modification — Vos données précédentes sont pré-remplies. Modifiez puis sauvegardez.</Text>
              </View>
            )}
            {isEHouwiya && !fromRecap && (
              <View style={styles.eHouwiyaBanner}>
                <Text style={styles.eHouwiyaBannerText}>✅ Données E-Houwiya récupérées — Vérifiez et complétez si nécessaire.</Text>
              </View>
            )}

            <View style={styles.titleSection}>
              <Text style={styles.title}>{fromRecap ? 'Modifier les informations' : 'Informations personnelles'}</Text>
              <Text style={styles.subtitle}>Veuillez remplir vos informations avec précision</Text>
            </View>

            {!fromRecap && (
              <View style={styles.stepIndicatorContainer}>
                <PhaseIndicator currentPhase={1} />
              </View>
            )}

            {/* CARTE 1 : Identité */}
            <View style={styles.card}>
              <SectionHeader number="1" title="Identité" />
              <View style={styles.formSection}>
                <View style={styles.fieldContainer}>
                  <FieldLabel left="Nom en français*" right="اللقب *" />
                  <View style={styles.inputContainer}>
                    <TextInput style={styles.singleInput} placeholder="Écrire en français"
                      placeholderTextColor={colors.neutral.gray400} value={formData.lastName}
                      onChangeText={t => handleFrenchInput('lastName', t)}
                      autoCapitalize="words" selectionColor={colors.atb.primary} />
                  </View>
                </View>
                <View style={styles.fieldContainer}>
                  <FieldLabel left="Prénom en français*" right="الإسم *" />
                  <View style={styles.inputContainer}>
                    <TextInput style={styles.singleInput} placeholder="Écrire en français"
                      placeholderTextColor={colors.neutral.gray400} value={formData.firstName}
                      onChangeText={t => handleFrenchInput('firstName', t)}
                      autoCapitalize="words" selectionColor={colors.atb.primary} />
                  </View>
                </View>
                <View style={styles.row}>
                  <View style={styles.halfWidth}>
                    <View style={styles.arabicLabelRow}><Text style={styles.arabicFieldLabelRight}>اللقب بالعربية*</Text></View>
                    <View style={[styles.inputContainer, styles.arabicInputBorder]}>
                      <TextInput style={[styles.singleInput, styles.arabicTextAlign]} placeholder="أكتب بالعربية"
                        placeholderTextColor={colors.neutral.gray400} value={formData.lastNameArabic}
                        onChangeText={t => handleArabicInput('lastNameArabic', t)}
                        keyboardType="default" textContentType="none" autoComplete="off"
                        autoCorrect={false} autoCapitalize="none" selectionColor={colors.atb.primary} />
                    </View>
                  </View>
                  <View style={styles.halfWidth}>
                    <View style={styles.arabicLabelRow}><Text style={styles.arabicFieldLabelRight}>الإسم بالعربية*</Text></View>
                    <View style={[styles.inputContainer, styles.arabicInputBorder]}>
                      <TextInput style={[styles.singleInput, styles.arabicTextAlign]} placeholder="أكتب بالعربية"
                        placeholderTextColor={colors.neutral.gray400} value={formData.firstNameArabic}
                        onChangeText={t => handleArabicInput('firstNameArabic', t)}
                        keyboardType="default" textContentType="none" autoComplete="off"
                        autoCorrect={false} autoCapitalize="none" selectionColor={colors.atb.primary} />
                    </View>
                  </View>
                </View>
                <View style={styles.fieldContainer}>
                  <FieldLabel left="Civilité *" right="الجنس *" />
                  <View style={styles.genderRow}>
                    {GENDER_OPTIONS.map(opt => (
                      <TouchableOpacity key={opt.value} onPress={() => updateField('gender', opt.value)}
                        style={[styles.genderButton, formData.gender === opt.value && styles.genderButtonSelected]}>
                        <Text style={[styles.genderText, formData.gender === opt.value && styles.genderTextSelected]}>{opt.label}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
                <View style={styles.fieldContainer}>
                  <FieldLabel left="Nationalité *" right="الجنسية *" />
                  <CustomDropdown label="" value={formData.nationality} options={COUNTRIES} onSelect={v => updateField('nationality', v)} required={false} />
                </View>
                <View style={styles.fieldContainer}>
                  <FieldLabel left="Date de naissance *" right="تاريخ الميلاد *" />
                  <TouchableOpacity style={styles.dateInputTouchable} onPress={() => openDatePicker('birthDate')} activeOpacity={0.7}>
                    <View style={styles.dateInputContainer}>
                      <Text style={[styles.dateInputText, !formData.birthDate && styles.dateInputPlaceholder]}>
                        {formData.birthDate || 'JJ/MM/AAAA'}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={styles.fieldContainer}>
                  <FieldLabel left="Lieu de naissance *" right="مكان الميلاد *" />
                  <CustomDropdown label="" value={formData.birthPlace} options={CITIES} onSelect={v => updateField('birthPlace', v)} required={false} />
                </View>
                <View style={styles.fieldContainer}>
                  <FieldLabel left="Pays de naissance *" right="بلد الميلاد *" />
                  <CustomDropdown label="" value={formData.countryOfBirth} options={COUNTRIES} onSelect={v => updateField('countryOfBirth', v)} required={false} />
                </View>
                <View style={styles.fieldContainer}>
                  <FieldLabel left="Pays de résidence *" right="بلد الإقامة *" />
                  <CustomDropdown label="" value={formData.countryOfResidence} options={COUNTRIES} onSelect={v => updateField('countryOfResidence', v)} required={false} />
                </View>
              </View>
            </View>

            {/* CARTE 2 : Contact */}
            <View style={styles.card}>
              <SectionHeader number="2" title="Contact" />
              <View style={styles.formSection}>
                <View style={styles.fieldContainer}>
                  <FieldLabel left="Numéro de téléphone *" right="رقم الهاتف *" />
                  <Text style={styles.fieldHint}>Requis pour l'ouverture de compte / مطلوب لفتح الحساب</Text>
                  <View style={styles.phoneRow}>
                    <View style={styles.phonePrefix}><Text style={styles.phonePrefixText}>+216</Text></View>
                    <View style={styles.phoneInputContainer}>
                      <TextInput style={styles.phoneInput} placeholder="00 000 000"
                        placeholderTextColor={colors.neutral.gray400} keyboardType="number-pad"
                        value={formData.phoneNumber}
                        onChangeText={t => { const c = t.replace(/[^0-9]/g,''); if (c.length <= 8) updateField('phoneNumber', c); }}
                        selectionColor={colors.atb.primary} />
                    </View>
                  </View>
                </View>
                <View style={styles.fieldContainer}>
                  <FieldLabel left="Adresse email *" right="البريد الإلكتروني *" />
                  <Text style={styles.fieldHint}>Pour les confirmations et notifications / للتأكيدات والإشعارات</Text>
                  <View style={styles.emailInputWrapper}>
                    <TextInput style={styles.emailInput} placeholder="exemple@domaine.com"
                      placeholderTextColor={colors.neutral.gray400} keyboardType="email-address"
                      autoCapitalize="none" value={formData.email}
                      onChangeText={t => updateField('email', t)} selectionColor={colors.atb.primary} />
                  </View>
                </View>
              </View>
            </View>

            {/* CARTE 3 : CIN */}
            <View style={styles.card}>
              <SectionHeader number="3" title="Pièce d'identité" />
              <View style={styles.formSection}>
                <View style={styles.fieldContainer}>
                  <FieldLabel left="Numéro de la carte d'identité *" right="رقم بطاقة الهوية *" />
                  <View style={styles.inputContainer}>
                    <TextInput style={styles.singleInput} placeholder="Saisir le numéro CIN"
                      placeholderTextColor={colors.neutral.gray400} value={formData.idCardNumber}
                      onChangeText={t => { const c = t.replace(/[^0-9]/g,''); if (c.length <= 8) updateField('idCardNumber', c); }}
                      keyboardType="number-pad" selectionColor={colors.atb.primary} />
                  </View>
                </View>
                <View style={styles.fieldContainer}>
                  <FieldLabel left="Date d'émission *" right="تاريخ الإصدار *" />
                  <TouchableOpacity style={styles.dateInputTouchable} onPress={() => openDatePicker('idIssueDate')} activeOpacity={0.7}>
                    <View style={styles.dateInputContainer}>
                      <Text style={[styles.dateInputText, !formData.idIssueDate && styles.dateInputPlaceholder]}>
                        {formData.idIssueDate || 'JJ/MM/AAAA'}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
              <SecurityNotice />
            </View>

            {/* Boutons */}
            <View style={styles.buttonContainer}>
              {fromRecap ? (
                <>
                  <TouchableOpacity onPress={() => { // @ts-ignore
                    navigation.navigate('Recapitulatif', { customerId }); }} style={styles.backButton}>
                    <View style={styles.backArrow} />
                    <Text style={styles.backButtonText}>Annuler</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleContinue} style={styles.continueButton} disabled={isLoading}>
                    <LinearGradient colors={[colors.atb.red, colors.atb.red]} style={styles.continueGradient}>
                      <Text style={styles.continueButtonText}>{isLoading ? (loadingStep || 'Sauvegarde...') : 'Sauvegarder'}</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <View style={styles.backArrow} />
                    <Text style={styles.backButtonText}>Retour</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleContinue} style={styles.continueButton} disabled={isLoading}>
                    <LinearGradient colors={[colors.atb.red, colors.atb.red]} style={styles.continueGradient}>
                      {isLoading
                        ? <ActivityIndicator size="small" color={colors.neutral.white} style={{ marginRight: 8 }} />
                        : null}
                      <Text style={styles.continueButtonText}>
                        {isLoading ? (loadingStep || 'Vérification...') : 'Continuer'}
                      </Text>
                      {!isLoading && <View style={styles.arrowRight} />}
                    </LinearGradient>
                  </TouchableOpacity>
                </>
              )}
            </View>

            <Footer />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.neutral.white },
  flex: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  content: { padding: 24 },
  loadingScreen: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.neutral.white },
  loadingText: { marginTop: 16, fontSize: 15, color: colors.neutral.gray600 },
  editBanner: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: 'rgba(200,35,51,0.07)', borderWidth: 1, borderColor: 'rgba(200,35,51,0.2)', borderRadius: 10, padding: 14, marginBottom: 16 },
  editBannerText: { flex: 1, fontSize: 13, color: colors.atb.red, fontWeight: '500', lineHeight: 18 },
  eHouwiyaBanner: { backgroundColor: 'rgba(34,197,94,0.08)', borderWidth: 1, borderColor: 'rgba(34,197,94,0.25)', borderRadius: 10, padding: 14, marginBottom: 16 },
  eHouwiyaBannerText: { fontSize: 13, color: '#0f682f', fontWeight: '500', lineHeight: 18 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: colors.neutral.gray300, backgroundColor: colors.neutral.gray100 },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  logoContainer: { shadowColor: colors.atb.red, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 6 },
  logo: { width: 40, height: 40 },
  logoGradient: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  bankName: { fontSize: 16, fontWeight: '700', color: colors.atb.red, letterSpacing: 0.3 },
  bankSubtitle: { fontSize: 11, color: colors.neutral.gray500, marginTop: 2, fontWeight: '500' },
  digipackBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 4, alignItems: 'center', justifyContent: 'center' },
  digipackText: { fontSize: 10, fontWeight: '800', color: colors.neutral.white, letterSpacing: 2 },
  titleSection: { marginBottom: 5 },
  title: { fontSize: 26, fontWeight: '700', color: colors.neutral.gray900, marginBottom: 6, letterSpacing: -0.3 },
  subtitle: { fontSize: 13, color: colors.neutral.gray600, fontWeight: '400', lineHeight: 19 },
  stepIndicatorContainer: { marginBottom: 12 },
  phaseContainer: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', paddingVertical: 8 },
  phaseItem: { alignItems: 'center', flex: 1 },
  phaseRadioOuter: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: colors.neutral.gray400, alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  phaseRadioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: 'transparent' },
  phaseRadioInnerActive: { backgroundColor: colors.atb.red },
  phaseRadioActive: { borderColor: colors.atb.red },
  phaseRadioCompleted: { borderColor: colors.atb.red, backgroundColor: colors.atb.red },
  phaseRadioCheck: { fontSize: 12, color: colors.neutral.white, fontWeight: 'bold' },
  phaseLabel: { fontSize: 11, color: colors.neutral.gray600, fontWeight: '500', textAlign: 'center' },
  phaseLabelActive: { color: colors.atb.red, fontWeight: '700' },
  phaseLabelCompleted: { color: colors.neutral.gray800, fontWeight: '600' },
  phaseConnector: { width: 20, height: 2, backgroundColor: colors.neutral.gray300, alignSelf: 'center', marginTop: -10 },
  card: { backgroundColor: colors.neutral.white, borderRadius: 12, marginBottom: 20, paddingVertical: 24, paddingHorizontal: 20, shadowColor: colors.neutral.gray900, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 24, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: colors.neutral.beige },
  sectionNumber: { width: 30, height: 30, borderRadius: 6, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  sectionNumberText: { fontSize: 13, fontWeight: '800', color: colors.neutral.white },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: colors.neutral.gray900, letterSpacing: 0.1 },
  formSection: { gap: 0 },
  fieldContainer: { marginBottom: 18 },
  horizontalLabelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 },
  fieldLabelLeft: { fontSize: 12, fontWeight: '700', color: colors.neutral.gray800, letterSpacing: 0.3, textTransform: 'uppercase' },
  fieldLabelRight: { fontSize: 12, fontWeight: '700', color: colors.neutral.gray800, letterSpacing: 0.3, textTransform: 'uppercase', textAlign: 'right' },
  fieldHint: { fontSize: 12, color: colors.neutral.gray500, marginBottom: 12 },
  inputContainer: { height: 50, backgroundColor: colors.neutral.white, borderWidth: 1.5, borderColor: colors.neutral.gray300, borderRadius: 6, paddingHorizontal: 16, justifyContent: 'center' },
  singleInput: { fontSize: 14, color: colors.neutral.gray900, fontWeight: '600', padding: 0 },
  row: { flexDirection: 'row', gap: 12, marginBottom: 18 },
  halfWidth: { flex: 1 },
  arabicLabelRow: { flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 5 },
  arabicFieldLabelRight: { fontSize: 12, fontWeight: '700', color: colors.neutral.gray800, textAlign: 'right' },
  arabicInputBorder: { borderColor: colors.atb.primary },
  arabicTextAlign: { textAlign: 'right' },
  genderRow: { flexDirection: 'row', gap: 12 },
  genderButton: { flex: 1, height: 50, borderWidth: 1.5, borderColor: colors.neutral.gray300, borderRadius: 6, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.neutral.white },
  genderButtonSelected: { borderColor: colors.atb.red, backgroundColor: colors.neutral.offWhite, borderWidth: 2 },
  genderText: { fontSize: 14, fontWeight: '600', color: colors.neutral.gray600 },
  genderTextSelected: { color: colors.atb.red, fontWeight: '700' },
  phoneRow: { flexDirection: 'row', gap: 12 },
  phonePrefix: { width: 76, height: 50, backgroundColor: colors.neutral.offWhite, borderWidth: 1.5, borderColor: colors.neutral.gray300, borderRadius: 6, alignItems: 'center', justifyContent: 'center' },
  phonePrefixText: { fontSize: 15, fontWeight: '600', color: colors.neutral.gray700 },
  phoneInputContainer: { flex: 1, height: 50, backgroundColor: colors.neutral.white, borderWidth: 1.5, borderColor: colors.neutral.gray300, borderRadius: 6, paddingHorizontal: 16, justifyContent: 'center' },
  phoneInput: { fontSize: 14, color: colors.neutral.gray900, fontWeight: '600', padding: 0 },
  emailInputWrapper: { height: 50, backgroundColor: colors.neutral.white, borderWidth: 1.5, borderColor: colors.neutral.gray300, borderRadius: 6, paddingHorizontal: 16, justifyContent: 'center' },
  emailInput: { fontSize: 14, color: colors.neutral.gray900, fontWeight: '600', padding: 0 },
  dateInputTouchable: { width: '100%' },
  dateInputContainer: { height: 50, backgroundColor: colors.neutral.white, borderWidth: 1.5, borderColor: colors.neutral.gray300, borderRadius: 6, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  dateInputText: { fontSize: 14, color: colors.neutral.gray900, fontWeight: '600', flex: 1 },
  dateInputPlaceholder: { color: colors.neutral.gray400, fontWeight: '400' },
  securityNotice: { padding: 16, backgroundColor: colors.neutral.offWhite, borderRadius: 8, borderWidth: 1, borderColor: colors.neutral.beige, marginTop: 8 },
  securityText: { fontSize: 11, color: colors.neutral.gray600, lineHeight: 16, fontWeight: '500', marginBottom: 8 },
  arabicText: { textAlign: 'right' },
  confidentialText: { color: colors.atb.red, fontWeight: '700' },
  buttonContainer: { flexDirection: 'row', gap: 12, marginBottom: 32 },
  backButton: { flex: 1, height: 54, backgroundColor: colors.neutral.white, borderWidth: 1.5, borderColor: colors.neutral.gray300, borderRadius: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  backArrow: { width: 7, height: 7, borderLeftWidth: 2, borderBottomWidth: 2, borderColor: colors.neutral.gray700, transform: [{ rotate: '45deg' }], marginRight: 8 },
  backButtonText: { fontSize: 15, fontWeight: '700', color: colors.neutral.gray700, letterSpacing: 0.3 },
  continueButton: { flex: 1, borderRadius: 8, overflow: 'hidden', shadowColor: colors.atb.red, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 8, elevation: 4 },
  continueGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 54, paddingHorizontal: 28 },
  continueButtonText: { fontSize: 15, fontWeight: '700', color: colors.neutral.white, letterSpacing: 0.5, marginRight: 8 },
  arrowRight: { width: 7, height: 7, borderRightWidth: 2, borderTopWidth: 2, borderColor: colors.neutral.white, transform: [{ rotate: '45deg' }] },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  modalContent: { width: '100%', maxWidth: 400, backgroundColor: colors.neutral.white, borderRadius: 16, overflow: 'hidden', shadowColor: colors.neutral.gray900, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 16, elevation: 8, padding: 20 },
  calendarHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, paddingHorizontal: 10 },
  monthNavButton: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.neutral.gray100 },
  monthNavText: { fontSize: 16, fontWeight: '600', color: colors.atb.red },
  monthYearTouchable: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, backgroundColor: 'rgba(200,35,51,0.06)' },
  monthYearText: { fontSize: 18, fontWeight: '700', color: colors.neutral.gray900 },
  monthYearHint: { fontSize: 16, color: colors.atb.red, fontWeight: '700' },
  weekDaysContainer: { flexDirection: 'row', marginBottom: 10, paddingHorizontal: 5 },
  weekDayText: { flex: 1, textAlign: 'center', fontSize: 14, fontWeight: '600', color: colors.neutral.gray600, paddingVertical: 8 },
  calendarGrid: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 20 },
  calendarDay: { width: '14.28%', aspectRatio: 1, alignItems: 'center', justifyContent: 'center', borderRadius: 8 },
  calendarDayOtherMonth: { opacity: 0.3 },
  calendarDaySelected: { backgroundColor: colors.atb.red },
  calendarDayToday: { borderWidth: 1, borderColor: colors.atb.red },
  calendarDayText: { fontSize: 15, fontWeight: '500', color: colors.neutral.gray900 },
  calendarDayTextOtherMonth: { color: colors.neutral.gray500 },
  calendarDayTextSelected: { color: colors.neutral.white, fontWeight: '700' },
  calendarDayTextToday: { color: colors.atb.red, fontWeight: '700' },
  calendarActions: { flexDirection: 'row', gap: 12, marginTop: 10 },
  calendarCancelButton: { flex: 1, height: 48, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.neutral.white, borderWidth: 1, borderColor: colors.neutral.gray300, borderRadius: 8 },
  calendarCancelText: { fontSize: 15, fontWeight: '600', color: colors.neutral.gray700 },
  calendarApplyButton: { flex: 1, height: 48, borderRadius: 8, overflow: 'hidden' },
  calendarApplyGradient: { width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' },
  calendarApplyText: { fontSize: 15, fontWeight: '700', color: colors.neutral.white },
  quickPickerOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  quickPickerContainer: { backgroundColor: colors.neutral.white, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24, paddingBottom: 36 },
  quickPickerTitle: { fontSize: 18, fontWeight: '700', color: colors.neutral.gray900, textAlign: 'center', marginBottom: 4 },
  quickPickerSubtitle: { fontSize: 12, color: colors.neutral.gray500, textAlign: 'center', marginBottom: 20 },
  quickPickerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, marginBottom: 24 },
  quickPickerCol: { flex: 1, alignItems: 'center' },
  quickPickerLabel: { fontSize: 11, fontWeight: '600', color: colors.neutral.gray500, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 },
  quickPickerSep: { fontSize: 22, fontWeight: '700', color: colors.neutral.gray400, marginTop: 16 },
  quickPickerActions: { flexDirection: 'row', gap: 12 },
  quickPickerCancel: { flex: 1, height: 50, borderWidth: 1.5, borderColor: colors.neutral.gray300, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  quickPickerCancelText: { fontSize: 15, fontWeight: '600', color: colors.neutral.gray700 },
  quickPickerConfirm: { flex: 1, height: 50, borderRadius: 10, overflow: 'hidden' },
  quickPickerConfirmGrad: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  quickPickerConfirmText: { fontSize: 15, fontWeight: '700', color: colors.neutral.white },
  pickerText: { fontSize: 14, color: colors.neutral.gray400, fontWeight: '500', textAlign: 'center' },
  pickerTextSel: { fontSize: 17, color: colors.atb.red, fontWeight: '700' },
  pickerLine: { position: 'absolute', left: 0, right: 0, height: 1, backgroundColor: colors.atb.red, zIndex: 10 },
  footer: { alignItems: 'center', paddingTop: 20, paddingBottom: 8 },
  footerDivider: { width: 50, height: 2, backgroundColor: colors.neutral.gray300, borderRadius: 1, marginBottom: 16 },
  footerText: { fontSize: 11, color: colors.neutral.gray500, fontWeight: '500', marginBottom: 4 },
  footerSubtext: { fontSize: 10, color: colors.neutral.gray400, fontWeight: '400' },
});

export default OnboardingPersonalDataScreen;