// ============================================================
//  frontend/screens/OtpVerificationScreen.tsx
//  VÉRIFICATION OTP — VERSION FINALE PROFESSIONNELLE
// ============================================================

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Image,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import OtpInput from '../components/common/OtpInput';
import colors from '../../constants/colors';
import { NavigationProp, RouteProp } from '../types/navigation';
import { requestOtp, verifyOtp } from '../services/customerApi';

// ============================================================
//  TYPES & CONSTANTES
// ============================================================

type Props = {
  navigation: NavigationProp<'OtpVerification'>;
  route: RouteProp<'OtpVerification'>;
};

const { width } = Dimensions.get('window');
const isSmallScreen = width < 375;
const s = (normal: number, small: number) => (isSmallScreen ? small : normal);

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

const OtpVerificationScreen: React.FC<Props> = ({ navigation, route }) => {
  const { customerId } = route.params;

  const [otp, setOtp]             = useState('');
  const [timer, setTimer]         = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(true);

  // ── Minuterie ─────────────────────────────────────────────
  const startTimer = () => {
    setTimer(30);
    setCanResend(false);

    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return interval;
  };

  // ── Envoi OTP ─────────────────────────────────────────────
  const sendOtp = async (isResend = false) => {
    setIsSending(true);
    try {
      await requestOtp(customerId);

      if (isResend) {
        Alert.alert(
          '✅ Code renvoyé',
          'Un nouveau code de vérification a été envoyé par SMS.'
        );
      }
    } catch (error: any) {
      Alert.alert(
        'Erreur',
        "Impossible d'envoyer le code SMS. Vérifiez votre connexion et réessayez."
      );
    } finally {
      setIsSending(false);
    }
  };

  // ── Effet initial ─────────────────────────────────────────
  useEffect(() => {
    sendOtp(false);
    const interval = startTimer();
    return () => clearInterval(interval);
  }, [customerId]);

  // ── Renvoi du code ────────────────────────────────────────
  const handleResendCode = async () => {
    setOtp('');
    await sendOtp(true);
    startTimer();
  };

  // ── Vérification OTP ──────────────────────────────────────
  const handleContinue = async () => {
    if (otp.length !== 6) {
      Alert.alert('Erreur', 'Veuillez entrer le code complet à 6 chiffres.');
      return;
    }

    setIsLoading(true);
    try {
      await verifyOtp(customerId, otp);
      // @ts-ignore
      navigation.navigate('FATCA', { customerId });
    } catch (error: any) {
      Alert.alert(
        'Code invalide',
        error.message || 'Le code saisi est incorrect. Veuillez réessayer.'
      );
      setOtp('');
    } finally {
      setIsLoading(false);
    }
  };

  // ── Quitter ───────────────────────────────────────────────
  const handleQuit = () => {
    Alert.alert(
      'Quitter',
      'Êtes-vous sûr de vouloir quitter le processus ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Quitter',
          style: 'destructive',
          onPress: () => {
            // @ts-ignore
            navigation.navigate('EligibilityConditions');
          },
        },
      ]
    );
  };

  // ============================================================
  //  RENDU
  // ============================================================
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.neutral.gray100} />

      <Header />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 20 : 0}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>

            {/* ── TITRE ── */}
            <View style={styles.titleSection}>
              <Text style={styles.pageNumber}>ÉTAPE 02/05</Text>
              <Text style={styles.title}>Vérification du numéro</Text>
              <Text style={styles.subtitle}>
                Un code à 6 chiffres a été envoyé par SMS au numéro que vous avez saisi
              </Text>
              <View style={styles.progressContainer}>
                <View style={styles.progressBarBackground}>
                  <LinearGradient
                    colors={[colors.atb.red, colors.atb.red]}
                    style={[styles.progressBarFill, { width: '40%' }]}
                  />
                </View>
                <Text style={styles.progressText}>40%</Text>
              </View>
            </View>

            {/* ── CARTE OTP ── */}
            <View style={styles.card}>
              <View style={styles.sectionHeader}>
                <LinearGradient
                  colors={[colors.atb.red, colors.atb.red]}
                  style={styles.sectionBadge}
                >
                  <Text style={styles.sectionBadgeText}>2</Text>
                </LinearGradient>
                <View>
                  <Text style={styles.sectionTitle}>Code de vérification</Text>
                  <Text style={styles.sectionDesc}>Saisissez le code reçu par SMS</Text>
                </View>
              </View>

              {/* Indicateur d'envoi */}
              {isSending ? (
                <View style={styles.sendingContainer}>
                  <ActivityIndicator color={colors.atb.red} size="small" />
                  <Text style={styles.sendingText}>Envoi du code en cours...</Text>
                </View>
              ) : (
                <View style={styles.sentContainer}>
                  <Ionicons name="checkmark-circle" size={18} color="#22c55e" />
                  <Text style={styles.sentText}>Code envoyé par SMS avec succès</Text>
                </View>
              )}

              {/* Saisie OTP */}
              <View style={styles.otpContainer}>
                <OtpInput
                  length={6}
                  onChangeOtp={setOtp}
                  onComplete={(code: string) => setOtp(code)}
                />
              </View>

              {/* Renvoyer / Minuterie */}
              <View style={styles.resendContainer}>
                {canResend ? (
                  <TouchableOpacity
                    onPress={handleResendCode}
                    style={styles.resendButton}
                    activeOpacity={0.7}
                    disabled={isSending}
                  >
                    <Ionicons name="refresh" size={16} color={colors.atb.red} />
                    <Text style={styles.resendButtonText}>Renvoyer le code</Text>
                  </TouchableOpacity>
                ) : (
                  <View style={styles.timerContainer}>
                    <Ionicons name="time-outline" size={16} color={colors.neutral.gray500} />
                    <Text style={styles.timerText}>Renvoyer dans {timer}s</Text>
                  </View>
                )}
              </View>

              {/* Info box */}
              <View style={styles.infoBox}>
                <Ionicons name="information-circle" size={20} color={colors.atb.red} />
                <View style={styles.infoContent}>
                  <Text style={styles.infoTitle}>Informations importantes</Text>
                  <Text style={styles.infoItem}>• Le code expire dans 10 minutes</Text>
                  <Text style={styles.infoItem}>• Vous avez droit à 3 tentatives</Text>
                  <Text style={styles.infoItem}>• Code composé uniquement de chiffres</Text>
                </View>
              </View>
            </View>

            {/* ── BOUTONS ── */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={handleQuit}
                style={[styles.button, styles.quitButton]}
                activeOpacity={0.7}
              >
                <Text style={styles.quitButtonText}>Quitter</Text>
              </TouchableOpacity>

              <View style={styles.rightButtonsContainer}>
                <TouchableOpacity
                  onPress={() => navigation.goBack()}
                  style={[styles.button, styles.backButton]}
                  activeOpacity={0.7}
                >
                  <Text style={styles.backButtonText}>Retour</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleContinue}
                  style={[
                    styles.continueButton,
                    (otp.length !== 6 || isLoading) && { opacity: 0.6 },
                  ]}
                  disabled={otp.length !== 6 || isLoading}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={[colors.atb.red, colors.atb.red]}
                    style={styles.continueGradient}
                  >
                    {isLoading ? (
                      <ActivityIndicator color={colors.neutral.white} />
                    ) : (
                      <>
                        <Text style={styles.continueButtonText}>Continuer</Text>
                        <View style={styles.arrowRight} />
                      </>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </View>
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
  scrollContent: { flexGrow: 1 },
  content: { padding: s(24, 16) },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: s(24, 16),
    paddingVertical: s(16, 12),
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.gray300,
    backgroundColor: colors.neutral.gray100,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: s(12, 8) },
  logoContainer: {
    shadowColor: colors.atb.red,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  logo: { width: s(40, 36), height: s(40, 36) },
  logoGradient: {
    width: s(44, 40),
    height: s(44, 40),
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bankName: { fontSize: s(16, 14), fontWeight: '700', color: colors.atb.red },
  bankSubtitle: { fontSize: s(11, 9), color: colors.neutral.gray500, marginTop: 2 },
  digipackBadge: { paddingHorizontal: s(10, 8), paddingVertical: s(4, 3), borderRadius: 4 },
  digipackText: { fontSize: s(10, 9), fontWeight: '800', color: colors.neutral.white, letterSpacing: 2 },

  titleSection: { marginBottom: s(24, 20) },
  pageNumber: { fontSize: 11, fontWeight: '800', color: colors.atb.red, letterSpacing: 1.5, marginBottom: 6 },
  title: { fontSize: s(24, 20), fontWeight: '700', color: colors.neutral.gray900, marginBottom: 4 },
  subtitle: { fontSize: s(13, 12), color: colors.neutral.gray600, lineHeight: 19, marginBottom: 16 },
  progressContainer: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  progressBarBackground: { flex: 1, height: 4, backgroundColor: colors.neutral.gray200, borderRadius: 2, overflow: 'hidden' },
  progressBarFill: { height: '100%', borderRadius: 2 },
  progressText: { fontSize: 12, fontWeight: '800', color: colors.atb.red },

  card: {
    backgroundColor: colors.neutral.white,
    borderRadius: 12,
    marginBottom: 20,
    padding: s(20, 16),
    shadowColor: colors.neutral.gray900,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: colors.neutral.beige,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.beige,
  },
  sectionBadge: { width: 30, height: 30, borderRadius: 6, justifyContent: 'center', alignItems: 'center' },
  sectionBadgeText: { fontSize: 13, fontWeight: '800', color: colors.neutral.white },
  sectionTitle: { fontSize: s(16, 14), fontWeight: '700', color: colors.neutral.gray900 },
  sectionDesc: { fontSize: 12, color: colors.neutral.gray500, marginTop: 2 },

  sendingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.neutral.offWhite,
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  sendingText: { fontSize: 13, color: colors.neutral.gray600, fontWeight: '500' },
  sentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(34,197,94,0.08)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(34,197,94,0.2)',
  },
  sentText: { fontSize: 13, color: '#16a34a', fontWeight: '600' },

  otpContainer: {
    paddingVertical: s(20, 15),
    paddingHorizontal: s(10, 5),
    backgroundColor: colors.neutral.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.neutral.beige,
    marginBottom: 16,
    alignItems: 'center',
  },

  resendContainer: { alignItems: 'center', marginBottom: 20 },
  resendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: colors.atb.red,
    backgroundColor: colors.neutral.white,
  },
  resendButtonText: { fontSize: s(14, 13), fontWeight: '600', color: colors.atb.red },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.neutral.gray300,
  },
  timerText: { fontSize: s(14, 13), color: colors.neutral.gray500 },

  infoBox: {
    flexDirection: 'row',
    gap: 10,
    padding: 14,
    backgroundColor: 'rgba(200,35,51,0.05)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(200,35,51,0.15)',
    alignItems: 'flex-start',
  },
  infoContent: { flex: 1 },
  infoTitle: { fontSize: s(13, 12), fontWeight: '700', color: colors.atb.red, marginBottom: 6 },
  infoItem: { fontSize: s(12, 11), color: colors.atb.red, lineHeight: 20 },

  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: s(32, 24),
    gap: 10,
  },
  rightButtonsContainer: { flexDirection: 'row', gap: s(10, 8), flex: 1, justifyContent: 'flex-end' },
  button: {
    height: s(52, 48),
    backgroundColor: colors.neutral.white,
    borderWidth: 1.5,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    minWidth: s(90, 80),
  },
  quitButton: { borderColor: colors.atb.red },
  backButton: { borderColor: colors.neutral.gray300 },
  quitButtonText: { fontSize: s(14, 13), fontWeight: '700', color: colors.atb.red },
  backButtonText: { fontSize: s(14, 13), fontWeight: '700', color: colors.neutral.gray700 },
  continueButton: {
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: colors.atb.red,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
    minWidth: s(120, 100),
  },
  continueGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: s(52, 48),
    paddingHorizontal: s(20, 16),
    gap: 8,
  },
  continueButtonText: { fontSize: s(14, 13), fontWeight: '700', color: colors.neutral.white },
  arrowRight: {
    width: 7,
    height: 7,
    borderRightWidth: 2,
    borderTopWidth: 2,
    borderColor: colors.neutral.white,
    transform: [{ rotate: '45deg' }],
  },

  footer: { alignItems: 'center', paddingTop: s(20, 16), paddingBottom: 8 },
  footerDivider: { width: 50, height: 2, backgroundColor: colors.neutral.gray300, borderRadius: 1, marginBottom: 8 },
  footerText: { fontSize: s(11, 10), color: colors.neutral.gray500, marginBottom: 4, textAlign: 'center' },
  footerSubtext: { fontSize: s(10, 9), color: colors.neutral.gray400, textAlign: 'center' },
});

export default OtpVerificationScreen;