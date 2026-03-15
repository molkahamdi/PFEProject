import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  Image, StatusBar, ActivityIndicator, Alert, RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, Feather } from '@expo/vector-icons';
import colors from '../../constants/colors';
import { NavigationProp, RouteProp } from '../types/navigation';
import { getCustomer } from '../services/customerApi';

type Props = {
  navigation: NavigationProp<'Recapitulatif'>;
  route: RouteProp<'Recapitulatif'>;
};

type Customer = {
  id: string; firstName: string; lastName: string;
  firstNameArabic: string; lastNameArabic: string;
  gender: 'M' | 'F'; nationality: string; birthDate: string;
  birthPlace: string; countryOfBirth: string; phoneNumber: string;
  email: string; idCardNumber: string; idIssueDate: string;
  isUsCitizen?: boolean; isUsResident?: boolean; hasGreenCard?: boolean;
  isUsTaxpayer?: boolean; hasUsTransfers?: boolean; hasUsPhone?: boolean;
  hasUsProxy?: boolean; isPoliticallyExposed?: boolean; usePassport?: boolean;
  idCardFrontPath?: string; idCardBackPath?: string; passportPath?: string;
  pays?: string; gouvernorat?: string; delegation?: string; codePostal?: string;
  adresse?: string; adresseSuite?: string; situationProfessionnelle?: string;
  profession?: string; posteActuel?: string; entreprise?: string;
  revenuMensuel?: number; gouvernoratAgence?: string; agence?: string;
};

// ── PhaseIndicator ────────────────────────────────────────────
const PhaseIndicator: React.FC<{ currentPhase: number }> = ({ currentPhase }) => {
  const phases = [
    { id: 1, label: 'Données personnelles' },
    { id: 2, label: 'Documents justificatifs' },
    { id: 3, label: 'Résumer de la demande' },
    { id: 4, label: 'Envoi de la demande' },
    { id: 5, label: 'Signature éléctronique' },
  ];
  return (
    <View style={styles.phaseContainer}>
      {phases.map((phase, index) => (
        <React.Fragment key={phase.id}>
          <View style={styles.phaseItem}>
            <View style={[
              styles.phaseRadioOuter,
              phase.id < currentPhase && styles.phaseRadioCompleted,
              phase.id === currentPhase && styles.phaseRadioActive,
            ]}>
              {phase.id < currentPhase ? (
                <Text style={styles.phaseRadioCheck}>✓</Text>
              ) : (
                <View style={[
                  styles.phaseRadioInner,
                  phase.id === currentPhase && styles.phaseRadioInnerActive,
                ]} />
              )}
            </View>
            <Text style={[
              styles.phaseLabel,
              phase.id === currentPhase && styles.phaseLabelActive,
              phase.id < currentPhase && styles.phaseLabelCompleted,
            ]}>
              {phase.label}
            </Text>
          </View>
          {index < phases.length - 1 && <View style={styles.phaseConnector} />}
        </React.Fragment>
      ))}
    </View>
  );
};

// ── Sous-composants ───────────────────────────────────────────
const InfoRow: React.FC<{ label: string; value?: string | null }> = ({ label, value }) => {
  if (!value) return null;
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
};

const VerifiedBadge: React.FC = () => (
  <View style={styles.verifiedBadge}>
    <Ionicons name="checkmark-circle" size={15} color={colors.status.success} />
    <Text style={styles.verifiedText}>Téléphone vérifié par OTP ✓</Text>
  </View>
);

const SubTitle: React.FC<{ children: string }> = ({ children }) => (
  <Text style={styles.subTitle}>{children}</Text>
);

const Divider: React.FC = () => <View style={styles.divider} />;

// ── Section modifiable ────────────────────────────────────────
const Section: React.FC<{
  number: string; title: string; icon: React.ReactNode;
  onEdit: () => void; children: React.ReactNode;
}> = ({ number, title, icon, onEdit, children }) => (
  <View style={styles.section}>
    <View style={styles.sectionHeader}>
      <LinearGradient colors={[colors.atb.red, colors.atb.red]} style={styles.sectionBadge}>
        <Text style={styles.sectionBadgeText}>{number}</Text>
      </LinearGradient>
      <View style={styles.sectionTitleRow}>
        {icon}
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      <TouchableOpacity style={styles.editBtn} onPress={onEdit} activeOpacity={0.7}>
        <Feather name="edit-2" size={13} color={colors.atb.red} />
        <Text style={styles.editBtnText}>Modifier</Text>
      </TouchableOpacity>
    </View>
    <View style={styles.sectionBody}>{children}</View>
  </View>
);

// ── Section verrouillée (documents) ──────────────────────────
const LockedSection: React.FC<{
  number: string; title: string; icon: React.ReactNode;
  children: React.ReactNode;
}> = ({ number, title, icon, children }) => (
  <View style={styles.section}>
    {/* En-tête avec cadenas au lieu du bouton modifier */}
    <View style={styles.sectionHeader}>
      <LinearGradient colors={['#6b7280', '#4b5563']} style={styles.sectionBadge}>
        <Text style={styles.sectionBadgeText}>{number}</Text>
      </LinearGradient>
      <View style={styles.sectionTitleRow}>
        {icon}
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      <View style={styles.lockedBadge}>
        <Ionicons name="lock-closed" size={12} color="#6b7280" />
        <Text style={styles.lockedBadgeText}>Vérifié</Text>
      </View>
    </View>

    {/* Notice de sécurité */}
    <View style={styles.lockedNotice}>
      <Ionicons name="shield-checkmark" size={16} color="#c82333" />
      <Text style={styles.lockedNoticeText}>
        Les documents d'identité soumis sont définitivement liés à votre dossier
        et ne peuvent pas être modifiés. Ils constituent la preuve de vérification
        de votre identité.
      </Text>
    </View>

    <View style={styles.sectionBody}>{children}</View>
  </View>
);

// ── Composant principal ───────────────────────────────────────
const RecapitulatifScreen: React.FC<Props> = ({ navigation, route }) => {
  const { customerId } = route.params;
  const [customer, setCustomer]   = useState<Customer | null>(null);
  const [loading, setLoading]     = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const currentPhase = 3;

  const loadCustomerData = useCallback(async (showLoader = true) => {
    if (showLoader) setLoading(true);
    try {
      const data = await getCustomer(customerId);
      setCustomer(data as Customer);
    } catch (error: any) {
      Alert.alert('Erreur de chargement', 'Impossible de charger le récapitulatif.', [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Réessayer', onPress: () => loadCustomerData(showLoader) },
      ]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [customerId]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadCustomerData(false);
    });
    loadCustomerData(true);
    return unsubscribe;
  }, [loadCustomerData, navigation]);

  const formatFullName   = () => customer ? `${customer.firstName} ${customer.lastName}` : '';
  const formatArabicName = () => customer ? `${customer.firstNameArabic} ${customer.lastNameArabic}` : '';
  const formatGender     = () => customer?.gender === 'M' ? 'Monsieur' : 'Madame';
  const formatBoolean    = (v?: boolean | null) => v === true ? '✓ Oui' : v === false ? '✗ Non' : '—';
  const formatFileStatus = (path?: string) => path ? '✓ Téléchargé et vérifié' : '✗ Manquant';
  const formatCurrency   = (v?: number) => v ? `${v} DT` : null;

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingScreen}>
        <ActivityIndicator size="large" color={colors.atb.red} />
        <Text style={styles.loadingText}>Chargement du récapitulatif...</Text>
      </SafeAreaView>
    );
  }

  if (!customer) return null;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.neutral.gray100} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <LinearGradient colors={[colors.atb.red, colors.atb.red]} style={styles.logoGradient}>
            <Image source={require('../assets/atb.png')} style={styles.logo} resizeMode="contain" />
          </LinearGradient>
          <View>
            <Text style={styles.bankName}>Arab Tunisian Bank</Text>
            <Text style={styles.bankSubtitle}>البنك العربي التونسي</Text>
          </View>
        </View>
        <LinearGradient colors={[colors.atb.red, colors.atb.red]} style={styles.digipackBadge}>
          <Text style={styles.digipackText}>DIGIPACK</Text>
        </LinearGradient>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => { setRefreshing(true); loadCustomerData(false); }}
          />
        }
      >
        <View style={styles.content}>

          {/* Titre */}
          <View style={styles.titleSection}>
            <Text style={styles.title}>Résumé de la demande</Text>
            <Text style={styles.subtitle}>Veuillez vérifier les données que vous avez renseignées.</Text>
            <View style={styles.phaseIndicatorWrapper}>
              <PhaseIndicator currentPhase={currentPhase} />
            </View>
          </View>

          {/* Bandeau info */}
          <View style={styles.infoBanner}>
            <Ionicons name="information-circle" size={20} color={colors.atb.red} />
            <Text style={styles.infoBannerText}>
              Vous pouvez modifier les sections personnelles. Les documents d'identité vérifiés sont définitivement enregistrés.
            </Text>
          </View>

          {/* ── Section 1 : Informations personnelles ── */}
          <Section
            number="1"
            title="Informations personnelles"
            icon={<Ionicons name="person-outline" size={16} color={colors.atb.red} style={{ marginRight: 6 }} />}
            onEdit={() => {
              // @ts-ignore
              navigation.navigate('OnboardingPersonalData', { customerId, fromRecap: true });
            }}
          >
            <InfoRow label="Nom complet"    value={formatFullName()} />
            <InfoRow label="Nom arabe"      value={formatArabicName()} />
            <InfoRow label="Civilité"       value={formatGender()} />
            <InfoRow label="Nationalité"    value={customer.nationality} />
            <InfoRow label="Date naissance" value={customer.birthDate} />
            <InfoRow label="Lieu naissance" value={`${customer.birthPlace}, ${customer.countryOfBirth}`} />
            <InfoRow label="Téléphone"      value={`+216 ${customer.phoneNumber}`} />
            <InfoRow label="Email"          value={customer.email} />
            <InfoRow label="N° CIN"         value={customer.idCardNumber} />
            <InfoRow label="Date émission"  value={customer.idIssueDate} />
            <VerifiedBadge />
          </Section>

          {/* ── Section 2 : FATCA ── */}
          <Section
            number="2"
            title="Déclaration FATCA"
            icon={<Ionicons name="document-text-outline" size={16} color={colors.atb.red} style={{ marginRight: 6 }} />}
            onEdit={() => {
              // @ts-ignore
              navigation.navigate('FATCA', { customerId, fromRecap: true });
            }}
          >
            <InfoRow label="Citoyen américain"      value={formatBoolean(customer.isUsCitizen)} />
            <InfoRow label="Résident USA"            value={formatBoolean(customer.isUsResident)} />
            <InfoRow label="Green Card"              value={formatBoolean(customer.hasGreenCard)} />
            <InfoRow label="Contribuable américain"  value={formatBoolean(customer.isUsTaxpayer)} />
            <InfoRow label="Transferts vers USA"     value={formatBoolean(customer.hasUsTransfers)} />
            <InfoRow label="Téléphone américain"     value={formatBoolean(customer.hasUsPhone)} />
            <InfoRow label="Procuration USA"         value={formatBoolean(customer.hasUsProxy)} />
            <InfoRow label="Personne exposée (PEP)"  value={formatBoolean(customer.isPoliticallyExposed)} />
          </Section>

          {/* ── Section 3 : Documents — VERROUILLÉE ── */}
          <LockedSection
            number="3"
            title="Documents justificatifs"
            icon={<Ionicons name="shield-checkmark-outline" size={16} color="#6b7280" style={{ marginRight: 6 }} />}
          >
            <InfoRow
              label="Type document"
              value={customer.usePassport ? 'Passeport' : "Carte Nationale d'Identité"}
            />
            {!customer.usePassport && (
              <>
                <InfoRow label="Face avant CIN"  value={formatFileStatus(customer.idCardFrontPath)} />
                <InfoRow label="Face arrière CIN" value={formatFileStatus(customer.idCardBackPath)} />
              </>
            )}
            {customer.usePassport && (
              <InfoRow label="Passeport" value={formatFileStatus(customer.passportPath)} />
            )}
          </LockedSection>

          {/* ── Section 4 : Adresse & Profession ── */}
          <Section
            number="4"
            title="Adresse & Situation professionnelle"
            icon={<Ionicons name="home-outline" size={16} color={colors.atb.red} style={{ marginRight: 6 }} />}
            onEdit={() => {
              // @ts-ignore
              navigation.navigate('Personaldataform', { customerId, fromRecap: true });
            }}
          >
            <SubTitle>Adresse</SubTitle>
            <InfoRow label="Pays"        value={customer.pays} />
            <InfoRow label="Gouvernorat" value={customer.gouvernorat} />
            <InfoRow label="Délégation"  value={customer.delegation} />
            <InfoRow label="Code postal" value={customer.codePostal} />
            <InfoRow label="Adresse"     value={customer.adresse} />
            <InfoRow label="Complément"  value={customer.adresseSuite} />
            <Divider />
            <SubTitle>Situation professionnelle</SubTitle>
            <InfoRow label="Situation"  value={customer.situationProfessionnelle} />
            <InfoRow label="Profession" value={customer.profession} />
            <InfoRow label="Poste"      value={customer.posteActuel} />
            <InfoRow label="Entreprise" value={customer.entreprise} />
            <InfoRow label="Revenu/mois" value={formatCurrency(customer.revenuMensuel)} />
            <Divider />
            <SubTitle>Agence ATB</SubTitle>
            <InfoRow label="Gouvernorat agence" value={customer.gouvernoratAgence} />
            <InfoRow label="Agence"             value={customer.agence} />
          </Section>

          {/* Boutons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Feather name="arrow-left" size={18} color={colors.neutral.gray700} />
              <Text style={styles.backButtonText}>Retour</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                // @ts-ignore
                navigation.navigate('DigigoScreen', { customerId });
              }}
              style={styles.continueButton}
            >
              <LinearGradient colors={[colors.atb.red, colors.atb.red]} style={styles.continueGradient}>
                <Text style={styles.continueButtonText}>Confirmer</Text>
                <Feather name="arrow-right" size={18} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <View style={styles.footerDivider} />
            <Text style={styles.footerText}>© 2026 Arab Tunisian Bank · Tous droits réservés</Text>
            <Text style={styles.footerSubtext}>Service client : 71 143 000</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// ── Styles ────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safeArea:      { flex: 1, backgroundColor: colors.neutral.white },
  loadingScreen: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.neutral.white },
  loadingText:   { marginTop: 16, fontSize: 15, color: colors.neutral.gray600 },

  header:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: colors.neutral.gray300, backgroundColor: colors.neutral.gray100 },
  headerLeft:  { flexDirection: 'row', alignItems: 'center', gap: 12 },
  logo:        { width: 40, height: 40 },
  logoGradient:{ width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  bankName:    { fontSize: 16, fontWeight: '700', color: colors.atb.red },
  bankSubtitle:{ fontSize: 11, color: colors.neutral.gray500, marginTop: 2 },
  digipackBadge:{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: 4 },
  digipackText: { fontSize: 10, fontWeight: '800', color: '#fff', letterSpacing: 2 },

  scrollContent: { paddingBottom: 40 },
  content:       { padding: 20 },

  phaseIndicatorWrapper:  { marginTop: 10 },
  phaseContainer:         { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', paddingVertical: 8 },
  phaseItem:              { alignItems: 'center', flex: 1 },
  phaseRadioOuter:        { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: colors.neutral.gray400, alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  phaseRadioInner:        { width: 10, height: 10, borderRadius: 5, backgroundColor: 'transparent' },
  phaseRadioInnerActive:  { backgroundColor: colors.atb.red },
  phaseRadioActive:       { borderColor: colors.atb.red },
  phaseRadioCompleted:    { borderColor: colors.atb.red, backgroundColor: colors.atb.red },
  phaseRadioCheck:        { fontSize: 12, color: colors.neutral.white, fontWeight: 'bold' },
  phaseLabel:             { fontSize: 10, color: colors.neutral.gray600, fontWeight: '500', textAlign: 'center' },
  phaseLabelActive:       { color: colors.atb.red, fontWeight: '700' },
  phaseLabelCompleted:    { color: colors.neutral.gray800, fontWeight: '600' },
  phaseConnector:         { width: 20, height: 2, backgroundColor: colors.neutral.gray300, alignSelf: 'center', marginTop: -10 },

  titleSection: { marginBottom: 12 },
  title:        { fontSize: 24, fontWeight: '700', color: colors.neutral.gray900, marginBottom: 4 },
  subtitle:     { fontSize: 13, color: colors.neutral.gray600, marginBottom: 12 },

  infoBanner:     { flexDirection: 'row', backgroundColor: 'rgba(139,21,56,0.06)', borderRadius: 10, padding: 14, marginBottom: 16, gap: 10, alignItems: 'flex-start' },
  infoBannerText: { flex: 1, fontSize: 13, color: colors.neutral.gray700, lineHeight: 19 },

  // Section modifiable
  section:        { backgroundColor: colors.neutral.white, borderRadius: 14, marginBottom: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2, overflow: 'hidden' },
  sectionHeader:  { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.neutral.gray100 },
  sectionBadge:   { width: 28, height: 28, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  sectionBadgeText:{ fontSize: 13, fontWeight: '800', color: '#fff' },
  sectionTitleRow:{ flexDirection: 'row', alignItems: 'center', flex: 1 },
  sectionTitle:   { fontSize: 14, fontWeight: '700', color: colors.neutral.gray900 },
  editBtn:        { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8, borderWidth: 1, borderColor: colors.atb.red },
  editBtnText:    { fontSize: 12, color: colors.atb.red, fontWeight: '600' },
  sectionBody:    { padding: 16 },

  // Section verrouillée
  lockedBadge:     { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8, borderWidth: 1, borderColor: '#d1d5db', backgroundColor: '#f9fafb' },
  lockedBadgeText: { fontSize: 12, color: '#6b7280', fontWeight: '600' },
  lockedNotice:    { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginHorizontal: 16, marginTop: 14, marginBottom: 2, backgroundColor: 'rgba(200,35,51,0.05)', borderRadius: 8, padding: 12, borderWidth: 1, borderColor: 'rgba(200,35,51,0.15)' },
  lockedNoticeText:{ flex: 1, fontSize: 12, color: '#7f1d1d', lineHeight: 18 },

  subTitle:  { fontSize: 12, fontWeight: '700', color: colors.atb.red, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8, marginTop: 4 },
  divider:   { height: 1, backgroundColor: colors.neutral.gray100, marginVertical: 12 },
  infoRow:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingVertical: 7, borderBottomWidth: 1, borderBottomColor: colors.neutral.gray50 },
  infoLabel: { fontSize: 13, color: colors.neutral.gray500, flex: 1 },
  infoValue: { fontSize: 13, color: colors.neutral.gray900, fontWeight: '600', flex: 1.4, textAlign: 'right' },

  verifiedBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 10, backgroundColor: colors.status.successLight, padding: 10, borderRadius: 8 },
  verifiedText:  { fontSize: 13, color: colors.status.success, fontWeight: '600' },

  buttonRow:          { flexDirection: 'row', gap: 12, marginTop: 8, marginBottom: 28 },
  backButton:         { flex: 1, height: 54, backgroundColor: '#fff', borderWidth: 1.5, borderColor: colors.neutral.gray300, borderRadius: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  backButtonText:     { fontSize: 14, fontWeight: '700', color: colors.neutral.gray700 },
  continueButton:     { flex: 2, borderRadius: 10, overflow: 'hidden', shadowColor: colors.atb.red, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 8, elevation: 4 },
  continueGradient:   { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 54, paddingHorizontal: 5, gap: 6 },
  continueButtonText: { fontSize: 14, fontWeight: '700', color: '#fff' },

  footer:        { alignItems: 'center', paddingTop: 12 },
  footerDivider: { width: 40, height: 2, backgroundColor: colors.neutral.gray300, borderRadius: 1, marginBottom: 10 },
  footerText:    { fontSize: 11, color: colors.neutral.gray500, marginBottom: 4 },
  footerSubtext: { fontSize: 10, color: colors.neutral.gray400 },
});

export default RecapitulatifScreen;