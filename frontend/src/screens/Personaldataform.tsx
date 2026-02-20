// ============================================================
//  frontend/screens/PersonalDataForm.tsx
//  DONNÉES PERSONNELLES (Adresse, Profession, Agence)
//  VERSION FINALE — avec calendrier custom pour date d'embauche
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
  StatusBar,
  Image,
  StyleSheet,
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import CustomDropdown from '../components/common/CustomDropdown';
import colors from '../../constants/colors';
import { savePersonalForm } from '../services/customerApi';

// ============================================================
//  TYPES
// ============================================================

type NavigationProp = {
  goBack: () => void;
  navigate: (screen: string, params?: object) => void;
};

type PersonalDataFormProps = {
  navigation: NavigationProp;
  route: { params: { customerId: string } };
};

type FormData = {
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
  revenuMensuel: string;
  agenceDattachement: string;
  gouvernoratAgence: string;
  agence: string;
};

type DropdownOption = { label: string; value: string };

// ============================================================
//  CONSTANTES
// ============================================================

const GOUVERNORATS: DropdownOption[] = [
  { label: 'Tunis', value: 'Tunis' },
  { label: 'Ariana', value: 'Ariana' },
  { label: 'Ben Arous', value: 'Ben Arous' },
  { label: 'Manouba', value: 'Manouba' },
  { label: 'Nabeul', value: 'Nabeul' },
  { label: 'Zaghouan', value: 'Zaghouan' },
  { label: 'Bizerte', value: 'Bizerte' },
  { label: 'Béja', value: 'Béja' },
  { label: 'Jendouba', value: 'Jendouba' },
  { label: 'Kef', value: 'Kef' },
  { label: 'Siliana', value: 'Siliana' },
  { label: 'Kairouan', value: 'Kairouan' },
  { label: 'Kasserine', value: 'Kasserine' },
  { label: 'Sidi Bouzid', value: 'Sidi Bouzid' },
  { label: 'Sousse', value: 'Sousse' },
  { label: 'Monastir', value: 'Monastir' },
  { label: 'Mahdia', value: 'Mahdia' },
  { label: 'Sfax', value: 'Sfax' },
  { label: 'Gafsa', value: 'Gafsa' },
  { label: 'Tozeur', value: 'Tozeur' },
  { label: 'Kebili', value: 'Kebili' },
  { label: 'Gabès', value: 'Gabès' },
  { label: 'Medenine', value: 'Medenine' },
  { label: 'Tataouine', value: 'Tataouine' },
];

const DELEGATIONS: Record<string, string[]> = {
  'Tunis': ['Carthage', 'La Médina', 'Le Bardo', 'Le Kram', 'La Goulette', 'Sidi Bou Said'],
  'Ariana': ['Ariana Ville', 'Ettadhamen', 'Mnihla', 'Raoued', 'Kalâat el-Andalous', 'Soukra'],
  'Ben Arous': ['Ben Arous', 'El Mourouj', 'Hammam Lif', 'Hammam Chott', 'Mohamedia'],
  'Manouba': ['Manouba', 'Djedeida', 'Douar Hicher', 'Oued Ellil', 'Tebourba'],
  'Nabeul': ['Nabeul', 'Dar Chaabane', 'El Haouaria', 'Grombalia', 'Hammamet', 'Kélibia'],
};

const SITUATIONS_PROFESSIONNELLES: DropdownOption[] = [
  { label: 'Etudiant', value: 'Etudiant' },
  { label: 'Femme au foyer', value: 'Femme au foyer' },
  { label: 'Freelance', value: 'Freelance' },
  { label: 'Retraité', value: 'Retraité' },
  { label: 'Salarié du secteur privé', value: 'Salarié du secteur privé' },
  { label: 'Salarié du secteur public', value: 'Salarié du secteur public' },
  { label: 'Sans emploi', value: 'Sans emploi' },
];

const PROFESSIONS: DropdownOption[] = [
  { label: 'Retraité', value: 'Retraité' },
  { label: "En recherche d'emploi", value: "En recherche d'emploi" },
  { label: 'Développeur', value: 'Développeur' },
  { label: 'Ingénieur', value: 'Ingénieur' },
  { label: 'Commercial', value: 'Commercial' },
  { label: 'Cadre Administratif', value: 'Cadre Administratif' },
  { label: 'Technicien', value: 'Technicien' },
  { label: 'Consultant', value: 'Consultant' },
  { label: 'Designer', value: 'Designer' },
  { label: 'Fonctionnaire', value: 'Fonctionnaire' },
  { label: 'Enseignant', value: 'Enseignant' },
  { label: 'Médecin', value: 'Médecin' },
  { label: 'Avocat', value: 'Avocat' },
  { label: 'Architecte', value: 'Architecte' },
  { label: 'Comptable', value: 'Comptable' },
  { label: 'Infirmier', value: 'Infirmier' },
  { label: 'Pharmacien', value: 'Pharmacien' },
  { label: 'Journaliste', value: 'Journaliste' },
  { label: 'Artisan', value: 'Artisan' },
  { label: 'Agriculteur', value: 'Agriculteur' },
  { label: 'Autre', value: 'Autre' },
];

const CODES_POSTAUX: DropdownOption[] = [
  { label: '1000', value: '1000' }, { label: '1001', value: '1001' },
  { label: '1002', value: '1002' }, { label: '1003', value: '1003' },
  { label: '1004', value: '1004' }, { label: '1005', value: '1005' },
  { label: '1006', value: '1006' }, { label: '1007', value: '1007' },
  { label: '1008', value: '1008' }, { label: '1009', value: '1009' },
  { label: '2000', value: '2000' }, { label: '2001', value: '2001' },
  { label: '2002', value: '2002' }, { label: '2009', value: '2009' },
  { label: '2010', value: '2010' }, { label: '2011', value: '2011' },
  { label: '2020', value: '2020' }, { label: '2021', value: '2021' },
  { label: '2022', value: '2022' }, { label: '2023', value: '2023' },
];

const AGENCES: DropdownOption[] = [
  { label: 'Agence Centrale Tunis', value: 'Agence Centrale Tunis' },
  { label: 'Agence Lac', value: 'Agence Lac' },
  { label: 'Agence Lafayette', value: 'Agence Lafayette' },
  { label: 'Agence Menzah', value: 'Agence Menzah' },
];

const SITUATIONS_SANS_PROFESSION = ['Etudiant', 'Femme au foyer', 'Sans emploi'];
const SITUATIONS_SANS_EMPLOI = ['Etudiant', 'Femme au foyer', 'Retraité', 'Sans emploi'];

const WEEK_DAYS = ['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di'];
const MONTHS = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
];

// ============================================================
//  SOUS-COMPOSANTS
// ============================================================

const Header: React.FC = () => (
  <View style={styles.header}>
    <View style={styles.headerLeft}>
      <View style={styles.logoContainer}>
        <LinearGradient colors={[colors.atb.red, colors.atb.red]} style={styles.logoGradient}>
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

const TitleSection: React.FC = () => (
  <View style={styles.titleSection}>
    <Text style={styles.title}>Données personnelles</Text>
    <Text style={styles.subtitle}>Complétez vos informations personnelles et choisissez votre agence</Text>
  </View>
);

const SectionHeader: React.FC<{ number: string; title: string; description: string }> = ({ number, title, description }) => (
  <View style={styles.sectionHeader}>
    <View style={styles.sectionNumberWrapper}>
      <Text style={styles.sectionNumber}>{number}</Text>
    </View>
    <View style={styles.sectionTitleWrapper}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.sectionDescription}>{description}</Text>
    </View>
  </View>
);

const FieldHeader: React.FC<{
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  required?: boolean;
  optional?: boolean;
}> = ({ icon, label, required = false, optional = false }) => (
  <View style={styles.fieldHeader}>
    <Ionicons name={icon} size={14} color={required ? colors.atb.red : colors.neutral.gray500} />
    <Text style={[styles.fieldLabel, optional && styles.optionalLabel]}>{label}</Text>
    {required && <View style={styles.requiredIndicator} />}
  </View>
);

const TextField: React.FC<{
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  required?: boolean;
  optional?: boolean;
  keyboardType?: 'default' | 'numeric';
}> = ({ icon, label, placeholder, value, onChangeText, required = false, optional = false, keyboardType = 'default' }) => (
  <View style={[styles.fieldGroup, styles.fullWidth]}>
    <FieldHeader icon={icon} label={label} required={required} optional={optional} />
    <View style={styles.textInputContainer}>
      <TextInput
        style={styles.textInput}
        placeholder={placeholder}
        placeholderTextColor={colors.neutral.gray400}
        value={value}
        onChangeText={onChangeText}
        selectionColor={colors.atb.red}
        keyboardType={keyboardType}
      />
    </View>
  </View>
);

const DropdownField: React.FC<{
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  options: DropdownOption[];
  onSelect: (value: string) => void;
  required?: boolean;
  placeholder?: string;
}> = ({ icon, label, value, options, onSelect, required = false, placeholder = 'Sélectionner' }) => (
  <View style={[styles.fieldGroup, styles.fullWidth]}>
    <FieldHeader icon={icon} label={label} required={required} />
    <CustomDropdown label="" value={value} options={options} onSelect={onSelect} required={false} placeholder={placeholder} />
  </View>
);

const CurrencyField: React.FC<{
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  required?: boolean;
}> = ({ icon, label, value, onChangeText, required = false }) => (
  <View style={[styles.fieldGroup, styles.fullWidth]}>
    <FieldHeader icon={icon} label={label} required={required} />
    <View style={styles.currencyInputContainer}>
      <Text style={styles.currencySymbol}>DT</Text>
      <TextInput
        style={styles.currencyInput}
        placeholder="0,00"
        placeholderTextColor={colors.neutral.gray400}
        value={value}
        onChangeText={onChangeText}
        keyboardType="numeric"
        selectionColor={colors.atb.red}
      />
    </View>
  </View>
);

const InfoCard: React.FC<{ situation: string }> = ({ situation }) => {
  const getInfoText = (): string => {
    switch (situation) {
      case 'Etudiant': return "Vous êtes étudiant. Les champs d'emploi ne sont pas requis.";
      case 'Femme au foyer': return "Vous êtes femme au foyer. Les champs d'emploi ne sont pas requis.";
      case 'Retraité': return "Vous êtes retraité. Les champs d'emploi ne sont pas requis.";
      case 'Sans emploi': return "Vous êtes en recherche d'emploi. Les champs d'emploi ne sont pas requis.";
      default: return "Les champs d'emploi ne sont pas requis.";
    }
  };
  return (
    <View style={styles.infoCard}>
      <Ionicons name="information-circle-outline" size={20} color={colors.atb.red} />
      <Text style={styles.infoText}>{getInfoText()}</Text>
    </View>
  );
};

const SecurityCard: React.FC = () => (
  <View style={styles.securityCard}>
    <View style={styles.securityHeader}>
      <Ionicons name="shield-checkmark" size={18} color={colors.atb.red} />
      <Text style={styles.securityTitle}>Confidentialité garantie</Text>
    </View>
    <Text style={styles.securityText}>
      ATB protège vos données personnelles conformément à la réglementation sur la protection des données.
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

const PersonalDataForm: React.FC<PersonalDataFormProps> = ({ navigation, route }) => {
  const { customerId } = route.params;

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    pays: 'Tunisie',
    gouvernorat: '',
    delegation: '',
    codePostal: '',
    adresse: '',
    adresseSuite: '',
    situationProfessionnelle: '',
    profession: '',
    posteActuel: '',
    dateEmbauche: '',
    employeur: '',
    entreprise: '',
    revenuMensuel: '',
    agenceDattachement: '',
    gouvernoratAgence: '',
    agence: '',
  });

  const [showProfessionalFields, setShowProfessionalFields] = useState(false);
  const [showProfessionField, setShowProfessionField] = useState(true);

  // ── Calendrier custom ─────────────────────────────────────
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());

  // ============================================================
  //  FONCTIONS CALENDRIER
  // ============================================================

  const formatDate = (day: number, month: number, year: number): string => {
    return `${day.toString().padStart(2, '0')}/${(month + 1).toString().padStart(2, '0')}/${year}`;
  };

  const openDatePicker = () => {
    const existing = formData.dateEmbauche;
    if (existing) {
      const [d, m, y] = existing.split('/');
      const parsed = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
      if (!isNaN(parsed.getTime())) {
        setSelectedDay(parseInt(d));
        setSelectedMonth(parseInt(m) - 1);
        setSelectedYear(parseInt(y));
        setDatePickerVisible(true);
        return;
      }
    }
    const today = new Date();
    setSelectedDay(today.getDate());
    setSelectedMonth(today.getMonth());
    setSelectedYear(today.getFullYear());
    setDatePickerVisible(true);
  };

  const applyDate = () => {
    updateFormData('dateEmbauche', formatDate(selectedDay, selectedMonth, selectedYear));
    setDatePickerVisible(false);
  };

  const changeMonth = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      if (selectedMonth === 0) { setSelectedMonth(11); setSelectedYear(y => y - 1); }
      else setSelectedMonth(m => m - 1);
    } else {
      if (selectedMonth === 11) { setSelectedMonth(0); setSelectedYear(y => y + 1); }
      else setSelectedMonth(m => m + 1);
    }
  };

  const generateCalendarDays = () => {
    const firstDay = new Date(selectedYear, selectedMonth, 1).getDay();
    const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1;
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
    const prevMonthDays = new Date(selectedYear, selectedMonth, 0).getDate();
    const days: { day: number; isCurrentMonth: boolean; date: Date }[] = [];

    for (let i = 0; i < adjustedFirstDay; i++) {
      const day = prevMonthDays - adjustedFirstDay + i + 1;
      days.push({ day, isCurrentMonth: false, date: new Date(selectedYear, selectedMonth - 1, day) });
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ day: i, isCurrentMonth: true, date: new Date(selectedYear, selectedMonth, i) });
    }
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push({ day: i, isCurrentMonth: false, date: new Date(selectedYear, selectedMonth + 1, i) });
    }
    return days;
  };

  // ============================================================
  //  HANDLERS FORMULAIRE
  // ============================================================

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    if (field === 'situationProfessionnelle') {
      setShowProfessionField(!SITUATIONS_SANS_PROFESSION.includes(value));
      setShowProfessionalFields(!SITUATIONS_SANS_EMPLOI.includes(value));
      setFormData(prev => ({
        ...prev,
        [field]: value,
        profession: '',
        posteActuel: '',
        dateEmbauche: '',
        employeur: '',
        entreprise: '',
        revenuMensuel: '',
      }));
      if (SITUATIONS_SANS_PROFESSION.includes(value)) {
        const autoProfession = value === 'Sans emploi' ? "En recherche d'emploi" : value;
        setFormData(prev => ({ ...prev, [field]: value, profession: autoProfession }));
      }
    }
  };

  const getDelegationOptions = (): DropdownOption[] => {
    if (!formData.gouvernorat) return [];
    return (DELEGATIONS[formData.gouvernorat] || []).map(d => ({ label: d, value: d }));
  };

  const validateForm = (): boolean => {
    const requiredFields: (keyof FormData)[] = ['gouvernorat', 'delegation', 'codePostal', 'adresse', 'situationProfessionnelle'];
    if (showProfessionField) requiredFields.push('profession');
    if (showProfessionalFields) requiredFields.push('posteActuel', 'dateEmbauche', 'entreprise', 'revenuMensuel');
    requiredFields.push('gouvernoratAgence', 'agence');
    const missing = requiredFields.filter(f => !formData[f]);
    if (missing.length > 0) {
      Alert.alert('Champs manquants', 'Veuillez remplir tous les champs obligatoires (*).');
      return false;
    }
    return true;
  };

  const handleContinue = async () => {
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      const result = await savePersonalForm(customerId, {
        pays: formData.pays,
        gouvernorat: formData.gouvernorat,
        delegation: formData.delegation,
        codePostal: formData.codePostal,
        adresse: formData.adresse,
        adresseSuite: formData.adresseSuite,
        situationProfessionnelle: formData.situationProfessionnelle,
        profession: formData.profession,
        posteActuel: formData.posteActuel,
        dateEmbauche: formData.dateEmbauche,
        employeur: formData.employeur,
        entreprise: formData.entreprise,
        revenuMensuel: formData.revenuMensuel ? parseFloat(formData.revenuMensuel) : undefined,
        gouvernoratAgence: formData.gouvernoratAgence,
        agence: formData.agence,
      });
      navigation.navigate('Recapitulatif', { customerId: result.id });
    } catch (error: any) {
      Alert.alert('Erreur', error.message || 'Erreur lors de la soumission du dossier.');
    } finally {
      setIsLoading(false);
    }
  };

  const calendarDays = generateCalendarDays();

  // ============================================================
  //  RENDU
  // ============================================================
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.neutral.white} />

      {/* ── MODAL CALENDRIER ── */}
      <Modal visible={datePickerVisible} transparent animationType="fade" onRequestClose={() => setDatePickerVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>

            {/* Navigation mois */}
            <View style={styles.calendarHeader}>
              <TouchableOpacity style={styles.monthNavButton} onPress={() => changeMonth('prev')}>
                <Text style={styles.monthNavText}>←</Text>
              </TouchableOpacity>
              <Text style={styles.monthYearText}>{MONTHS[selectedMonth]} {selectedYear}</Text>
              <TouchableOpacity style={styles.monthNavButton} onPress={() => changeMonth('next')}>
                <Text style={styles.monthNavText}>→</Text>
              </TouchableOpacity>
            </View>

            {/* Jours de la semaine */}
            <View style={styles.weekDaysContainer}>
              {WEEK_DAYS.map((day, i) => (
                <Text key={i} style={styles.weekDayText}>{day}</Text>
              ))}
            </View>

            {/* Grille */}
            <View style={styles.calendarGrid}>
              {calendarDays.map((day, index) => {
                const isSelected = day.isCurrentMonth && day.day === selectedDay &&
                  day.date.getMonth() === selectedMonth && day.date.getFullYear() === selectedYear;
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
                    onPress={() => { if (day.isCurrentMonth) setSelectedDay(day.day); }}
                  >
                    <Text style={[
                      styles.calendarDayText,
                      !day.isCurrentMonth && styles.calendarDayTextOtherMonth,
                      isSelected && styles.calendarDayTextSelected,
                      isToday && !isSelected && styles.calendarDayTextToday,
                    ]}>
                      {day.day}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Actions */}
            <View style={styles.calendarActions}>
              <TouchableOpacity style={styles.calendarCancelButton} onPress={() => setDatePickerVisible(false)}>
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

      {/* Header */}
      <Header />

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
        <ScrollView style={styles.flex} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>

            <TitleSection />

            {/* ── SECTION 1 : Adresse ── */}
            <View style={styles.sectionCard}>
              <SectionHeader number="1" title="Adresse de résidence" description="Votre adresse actuelle en Tunisie" />
              <View style={styles.formGrid}>
                <View style={[styles.fieldGroup, styles.fullWidth]}>
                  <FieldHeader icon="flag-outline" label="Pays" />
                  <CustomDropdown label="" value={formData.pays} options={[{ label: 'Tunisie', value: 'Tunisie' }]} onSelect={(v) => updateFormData('pays', v)} required={false} />
                </View>
                <View style={[styles.fieldGroup, styles.fullWidth]}>
                  <FieldHeader icon="location-outline" label="Gouvernorat" required />
                  <CustomDropdown label="" value={formData.gouvernorat} options={GOUVERNORATS} onSelect={(v) => updateFormData('gouvernorat', v)} required={false} placeholder="Sélectionner" />
                </View>
                <View style={[styles.fieldGroup, styles.fullWidth]}>
                  <FieldHeader icon="map-outline" label="Délégation" required />
                  <CustomDropdown label="" value={formData.delegation} options={getDelegationOptions()} onSelect={(v) => updateFormData('delegation', v)} required={false} placeholder="Sélectionner" />
                </View>
                <View style={[styles.fieldGroup, styles.fullWidth]}>
                  <FieldHeader icon="mail-outline" label="Code postal" required />
                  <CustomDropdown label="" value={formData.codePostal} options={CODES_POSTAUX} onSelect={(v) => updateFormData('codePostal', v)} required={false} placeholder="Sélectionner" />
                </View>
                <TextField icon="home-outline" label="Adresse complète" placeholder="Numéro, rue, appartement..." value={formData.adresse} onChangeText={(v) => updateFormData('adresse', v)} required />
                <TextField icon="add-circle-outline" label="Complément d'adresse" placeholder="Bâtiment, étage, porte..." value={formData.adresseSuite} onChangeText={(v) => updateFormData('adresseSuite', v)} optional />
              </View>
            </View>

            {/* ── SECTION 2 : Profession ── */}
            <View style={styles.sectionCard}>
              <SectionHeader number="2" title="Situation professionnelle" description="Informations sur votre activité" />
              <View style={styles.formGrid}>
                <DropdownField icon="briefcase-outline" label="Situation actuelle" value={formData.situationProfessionnelle} options={SITUATIONS_PROFESSIONNELLES} onSelect={(v) => updateFormData('situationProfessionnelle', v)} required placeholder="Sélectionner votre situation" />

                {showProfessionField && (
                  <DropdownField icon="school-outline" label="Profession" value={formData.profession} options={PROFESSIONS} onSelect={(v) => updateFormData('profession', v)} required placeholder="Sélectionner votre profession" />
                )}

                {showProfessionalFields && (
                  <>
                    <TextField icon="person-outline" label="Poste actuel" placeholder="Ex: Développeur Full Stack" value={formData.posteActuel} onChangeText={(v) => updateFormData('posteActuel', v)} required />

                    {/* ✅ DATE D'EMBAUCHE — même calendrier que OnboardingPersonalData */}
                    <View style={[styles.fieldGroup, styles.fullWidth]}>
                      <FieldHeader icon="calendar-outline" label="Date d'embauche" required />
                      <TouchableOpacity style={styles.dateInputTouchable} onPress={openDatePicker} activeOpacity={0.7}>
                        <View style={styles.dateInputContainer}>
                          <Text style={[styles.dateInputText, !formData.dateEmbauche && styles.dateInputPlaceholder]}>
                            {formData.dateEmbauche || 'JJ/MM/AAAA'}
                          </Text>
                          <LinearGradient colors={[colors.atb.red, colors.atb.red]} style={styles.calendarIconContainer}>
                            <Text style={styles.calendarIcon}>📅</Text>
                          </LinearGradient>
                        </View>
                      </TouchableOpacity>
                    </View>

                    <TextField icon="business-outline" label="Entreprise" placeholder="Nom de l'entreprise" value={formData.entreprise} onChangeText={(v) => updateFormData('entreprise', v)} required />
                    <CurrencyField icon="cash-outline" label="Revenu mensuel net" value={formData.revenuMensuel} onChangeText={(v) => updateFormData('revenuMensuel', v)} required />
                  </>
                )}

                {!showProfessionalFields && formData.situationProfessionnelle && (
                  <InfoCard situation={formData.situationProfessionnelle} />
                )}
              </View>
            </View>

            {/* ── SECTION 3 : Agence ── */}
            <View style={styles.sectionCard}>
              <SectionHeader number="3" title="Agence de rattachement" description="Votre agence ATB de référence" />
              <View style={styles.formGrid}>
                <DropdownField icon="business-outline" label="Gouvernorat de l'agence" value={formData.gouvernoratAgence} options={GOUVERNORATS} onSelect={(v) => updateFormData('gouvernoratAgence', v)} required placeholder="Sélectionner le gouvernorat" />
                <DropdownField icon="ban-outline" label="Agence ATB" value={formData.agence} options={AGENCES} onSelect={(v) => updateFormData('agence', v)} required placeholder="Sélectionner votre agence" />
              </View>
              <SecurityCard />
            </View>

            {/* Boutons */}
            <View style={styles.actionsContainer}>
              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Ionicons name="arrow-back" size={18} color={colors.atb.red} />
                <Text style={styles.backButtonText}>Retour</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleContinue} style={[styles.continueButton, isLoading && { opacity: 0.7 }]} disabled={isLoading}>
                <LinearGradient colors={[colors.atb.red, colors.atb.red]} style={styles.continueGradient}>
                  <Text style={styles.continueButtonText}>{isLoading ? 'Envoi en cours...' : 'Continuer'}</Text>
                  {!isLoading && <Ionicons name="arrow-forward" size={18} color={colors.neutral.white} />}
                </LinearGradient>
              </TouchableOpacity>
            </View>

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
  safeArea: { flex: 1, backgroundColor: colors.neutral.white },
  flex: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingBottom: 30 },
  content: { padding: 20 },

  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 24, paddingVertical: 16,
    borderBottomWidth: 1, borderBottomColor: colors.neutral.gray300,
    backgroundColor: colors.neutral.gray100,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  logoContainer: { shadowColor: colors.atb.red, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 6 },
  logo: { width: 40, height: 40 },
  logoGradient: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  bankName: { fontSize: 16, fontWeight: '700', color: colors.atb.red },
  bankSubtitle: { fontSize: 11, color: colors.neutral.gray500, marginTop: 2 },
  digipackBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 4 },
  digipackText: { fontSize: 10, fontWeight: '800', color: colors.neutral.white, letterSpacing: 2 },

  titleSection: { marginBottom: 24 },
  title: { fontSize: 24, fontWeight: '700', color: colors.neutral.gray900, marginBottom: 4 },
  subtitle: { fontSize: 14, color: colors.neutral.gray600, lineHeight: 20 },

  sectionCard: {
    backgroundColor: colors.neutral.white, borderRadius: 16, marginBottom: 16, padding: 20,
    shadowColor: colors.neutral.gray900, shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08, shadowRadius: 8, elevation: 3,
    borderWidth: 1, borderColor: colors.neutral.beige,
  },
  sectionHeader: {
    flexDirection: 'row', alignItems: 'center', marginBottom: 24,
    paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: colors.neutral.beige,
  },
  sectionNumberWrapper: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.atb.red, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  sectionNumber: { fontSize: 14, fontWeight: '700', color: colors.neutral.white },
  sectionTitleWrapper: { flex: 1 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.neutral.gray900, marginBottom: 2 },
  sectionDescription: { fontSize: 12, color: colors.neutral.gray500 },

  formGrid: { gap: 16 },
  fieldGroup: { flex: 1 },
  fullWidth: { flexBasis: '100%' },
  fieldHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 6 },
  fieldLabel: { fontSize: 13, fontWeight: '600', color: colors.neutral.gray700 },
  optionalLabel: { color: colors.neutral.gray500 },
  requiredIndicator: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.atb.red, marginLeft: 2 },

  textInputContainer: {
    height: 48, backgroundColor: colors.neutral.white,
    borderWidth: 1.5, borderColor: colors.neutral.gray300,
    borderRadius: 10, paddingHorizontal: 14, justifyContent: 'center',
  },
  textInput: { fontSize: 14, color: colors.neutral.gray900, fontWeight: '500', padding: 0 },

  currencyInputContainer: {
    height: 48, backgroundColor: colors.neutral.white,
    borderWidth: 1.5, borderColor: colors.neutral.gray300,
    borderRadius: 10, paddingHorizontal: 14,
    flexDirection: 'row', alignItems: 'center',
  },
  currencySymbol: { fontSize: 14, fontWeight: '600', color: colors.neutral.gray600, marginRight: 8 },
  currencyInput: { flex: 1, fontSize: 14, color: colors.neutral.gray900, fontWeight: '500', padding: 0 },

  // ✅ Date picker — même style que OnboardingPersonalData
  dateInputTouchable: { width: '100%' },
  dateInputContainer: {
    height: 50, backgroundColor: colors.neutral.white,
    borderWidth: 1.5, borderColor: colors.neutral.gray300,
    borderRadius: 10, paddingHorizontal: 16,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  dateInputText: { fontSize: 14, 
    color: colors.neutral.gray900, 
    fontWeight: '600', flex: 1 },

  dateInputPlaceholder: { color: colors.neutral.gray400, 
    fontWeight: '400' },
  calendarIconContainer: { width: 36, height: 36,
     borderRadius: 6, alignItems: 'center', 
     justifyContent: 'center' },
  calendarIcon: { fontSize: 18 },

  // ✅ Modal calendrier — identique à OnboardingPersonalData
  modalOverlay: { flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.5)', 
    justifyContent: 'center', alignItems: 'center', padding: 24 },
  modalContent: {
    width: '100%', maxWidth: 400, backgroundColor: colors.neutral.white,
    borderRadius: 16, padding: 20,
    shadowColor: colors.neutral.gray900, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25, shadowRadius: 16, elevation: 8,
  },
  calendarHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, paddingHorizontal: 10 },
  monthNavButton: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.neutral.gray100 },
  monthNavText: { fontSize: 16, fontWeight: '600', color: colors.atb.red },
  monthYearText: { fontSize: 18, fontWeight: '700', color: colors.neutral.gray900 },
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

  infoCard: { flexDirection: 'row', backgroundColor: 'rgba(200,35,51,0.05)', padding: 14, borderRadius: 10, borderWidth: 1, borderColor: 'rgba(200,35,51,0.1)', alignItems: 'flex-start', gap: 10 },
  infoText: { flex: 1, fontSize: 13, color: colors.neutral.gray700, fontWeight: '500', lineHeight: 18 },

  securityCard: { marginTop: 15, padding: 16, backgroundColor: colors.neutral.offWhite, borderRadius: 12, borderWidth: 1, borderColor: colors.neutral.beige },
  securityHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 8 },
  securityTitle: { fontSize: 14, fontWeight: '600', color: colors.neutral.gray800 },
  securityText: { fontSize: 12, color: colors.neutral.gray600, lineHeight: 18 },

  actionsContainer: { flexDirection: 'row', gap: 12, marginBottom: 24, marginTop: 8 },
  backButton: { flex: 1, height: 52, backgroundColor: colors.neutral.white, borderWidth: 1.5, borderColor: colors.neutral.gray300, borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  backButtonText: { fontSize: 15, fontWeight: '600', color: colors.atb.red },
  continueButton: { flex: 1, borderRadius: 12, overflow: 'hidden', shadowColor: colors.atb.red, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
  continueGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 52, paddingHorizontal: 24, gap: 8 },
  continueButtonText: { fontSize: 15, fontWeight: '700', color: colors.neutral.white },

  footer: { alignItems: 'center', paddingTop: 16, paddingBottom: 8 },
  footerDivider: { width: 40, height: 2, backgroundColor: colors.neutral.gray300, borderRadius: 1, marginBottom: 16 },
  footerText: { fontSize: 11, color: colors.neutral.gray500, marginBottom: 4 },
  footerSubtext: { fontSize: 10, color: colors.neutral.gray400 },
});

export default PersonalDataForm;