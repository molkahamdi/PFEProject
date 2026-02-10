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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { NavigationProp } from '../types/navigation';
import OtpInput from '../components/common/OtpInput';
import colors from 'constants/colors';

type OtpVerificationScreenProps = {
  navigation: NavigationProp<'OtpVerification'>;
};

const { width, height } = Dimensions.get('window');
const isSmallScreen = width < 375;

const OtpVerificationScreen: React.FC<OtpVerificationScreenProps> = ({ navigation }) => {
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  // Countdown timer
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const handleResendCode = () => {
    setTimer(30);
    setCanResend(false);
    setOtp('');
    Alert.alert('Code renvoyé', 'Un nouveau code de vérification a été envoyé.');
  };

  const handleContinue = () => {
    if (otp.length === 6) {
      navigation.navigate('FATCA');
    } else {
      Alert.alert('Erreur', 'Veuillez entrer le code complet à 6 chiffres.');
    }
  };

  const handleQuit = () => {
    Alert.alert(
      'Quitter',
      'Êtes-vous sûr de vouloir quitter le processus ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Quitter', onPress: () => navigation.navigate('EligibilityConditions') },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.neutral.gray100} />
      {/* Header identique à EligibilityConditionsScreen */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.logoContainer}>
            <LinearGradient
              colors={[colors.atb.red, colors.atb.red]}
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
        
        {/* Badge DIGIPACK identique */}
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
        keyboardVerticalOffset={Platform.OS === 'ios' ? 20 : 0}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
            {/* Title Section */}
            <View style={styles.titleSection}>
              <Text style={styles.title}>Vérification du numéro de téléphone</Text>
              <Text style={styles.subtitle}>
                Veuillez saisir le code de vérification envoyé par SMS
              </Text>
            </View>

            {/* OTP Card */}
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
                <Text style={styles.sectionTitle}>Code de vérification</Text>
              </View>

              <View style={styles.instructionSection}>
                <Text style={styles.instructionText}>
                  Un code à 6 chiffres a été envoyé au numéro que vous avez saisi.
                  Veuillez le saisir ci-dessous :
                </Text>
              </View>

              {/* OTP Input Section */}
              <View style={styles.otpContainer}>
                <View style={styles.otpInputWrapper}>
                  <OtpInput
                    length={6}
                    onChangeOtp={setOtp}
                    onComplete={(code) => setOtp(code)}
                  />
                </View>

                {/* Resend Code */}
                <View style={styles.resendContainer}>
                  {canResend ? (
                    <TouchableOpacity
                      onPress={handleResendCode}
                      style={styles.resendButton}
                      activeOpacity={0.7}
                    >
                      <Ionicons name="refresh" size={18} color={colors.atb.red} />
                      <Text style={styles.resendButtonText}>Renvoyer le code</Text>
                    </TouchableOpacity>
                  ) : (
                    <View style={styles.timerContainer}>
                      <Ionicons name="time-outline" size={16} color={colors.neutral.gray500} />
                      <Text style={styles.timerText}>Renvoyer dans {timer}s</Text>
                    </View>
                  )}
                </View>
              </View>

              {/* Information Box */}
              <View style={styles.infoBox}>
                <View style={styles.infoBoxContent}>
                  <View style={styles.infoIconContainer}>
                    <Ionicons name="information-circle" size={22} color={colors.atb.red} />
                  </View>
                  <View style={styles.infoTextContainer}>
                    <Text style={styles.infoTitle}>Informations importantes</Text>
                    <View style={styles.infoList}>
                      <Text style={styles.infoItem}>• Le code expire au bout de 30 secondes</Text>
                      <Text style={styles.infoItem}>• Vous avez droit à 3 tentatives</Text>
                      <Text style={styles.infoItem}>• Code composé uniquement de chiffres</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.buttonContainer}>
              {/* Bouton Quitter à gauche */}
              <TouchableOpacity
                onPress={handleQuit}
                style={[styles.button, styles.quitButton]}
                activeOpacity={0.7}
              >
                <Text style={styles.quitButtonText}>Quitter</Text>
              </TouchableOpacity>

              {/* Conteneur pour Retour et Continuer à droite */}
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
                  style={styles.continueButton}
                  disabled={otp.length !== 6}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={[colors.atb.red, colors.atb.red]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[
                      styles.continueGradient,
                      otp.length !== 6 && styles.disabledButton
                    ]}
                  >
                    <Text style={styles.continueButtonText}>Continuer</Text>
                    <View style={styles.arrowRight} />
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>

            {/* Footer */}
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
    paddingHorizontal: isSmallScreen ? 16 : 24,
    paddingVertical: isSmallScreen ? 12 : 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.gray300,
    backgroundColor: colors.neutral.gray100,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: isSmallScreen ? 8 : 12,
  },
  logoContainer: {
    shadowColor: colors.atb.red,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  logo: {
    width: isSmallScreen ? 36 : 40,
    height: isSmallScreen ? 36 : 40,
  },
  logoGradient: {
    width: isSmallScreen ? 40 : 44,
    height: isSmallScreen ? 40 : 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bankName: {
    fontSize: isSmallScreen ? 14 : 16,
    fontWeight: '700',
    color: colors.atb.red,
    letterSpacing: 0.3,
  },
  bankSubtitle: {
    fontSize: isSmallScreen ? 9 : 11,
    color: colors.neutral.gray500,
    marginTop: 2,
    fontWeight: '500',
  },
  digipackBadge: {
    paddingHorizontal: isSmallScreen ? 8 : 10,
    paddingVertical: isSmallScreen ? 3 : 4,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  digipackText: {
    fontSize: isSmallScreen ? 9 : 10,
    fontWeight: '800',
    color: colors.neutral.white,
    letterSpacing: 2,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    padding: isSmallScreen ? 16 : 24,
  },
  titleSection: {
    marginBottom: isSmallScreen ? 24 : 32,
  },
  title: {
    fontSize: isSmallScreen ? 22 : 26,
    fontWeight: '700',
    color: colors.neutral.gray900,
    marginBottom: 6,
    lineHeight: isSmallScreen ? 28 : 32,
  },
  subtitle: {
    fontSize: isSmallScreen ? 12 : 13,
    color: colors.neutral.gray600,
    fontWeight: '400',
    lineHeight: isSmallScreen ? 18 : 19,
  },
  card: {
    backgroundColor: colors.neutral.white,
    borderRadius: 12,
    marginBottom: 20,
    paddingVertical: isSmallScreen ? 20 : 24,
    paddingHorizontal: isSmallScreen ? 16 : 20,
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
    marginBottom: isSmallScreen ? 16 : 20,
    paddingBottom: isSmallScreen ? 14 : 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.beige,
  },
  sectionNumber: {
    width: isSmallScreen ? 26 : 30,
    height: isSmallScreen ? 26 : 30,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  sectionNumberText: {
    fontSize: isSmallScreen ? 11 : 13,
    fontWeight: '800',
    color: colors.neutral.white,
  },
  sectionTitle: {
    fontSize: isSmallScreen ? 15 : 17,
    fontWeight: '700',
    color: colors.neutral.gray900,
    letterSpacing: 0.1,
  },
  instructionSection: {
    marginBottom: isSmallScreen ? 20 : 24,
  },
  instructionText: {
    fontSize: isSmallScreen ? 13 : 14,
    color: colors.neutral.gray800,
    lineHeight: isSmallScreen ? 19 : 20,
  },
  otpContainer: {
    marginBottom: isSmallScreen ? 20 : 20,
    alignItems: 'center',
    paddingVertical: isSmallScreen ? 15 : 20,
    backgroundColor: colors.neutral.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.neutral.beige,
  },
  otpInputWrapper: {
    marginBottom: isSmallScreen ? 16 : 20,
    width: '100%',
    paddingHorizontal: isSmallScreen ? 10 : 15,
  },
  resendContainer: {
    alignItems: 'center',
    marginTop: 8,
  },
  resendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: colors.neutral.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.atb.red,
  },
  resendButtonText: {
    fontSize: isSmallScreen ? 13 : 14,
    fontWeight: '600',
    color: colors.atb.red,
    marginLeft: 6,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: colors.neutral.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.neutral.gray300,
  },
  timerText: {
    fontSize: isSmallScreen ? 13 : 14,
    color: colors.neutral.gray500,
    marginLeft: 6,
  },
  infoBox: {
    padding: isSmallScreen ? 12 : 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.atb.red,
    borderLeftWidth: 4,
    borderLeftColor: colors.atb.red,
  },
  infoBoxContent: {
    flexDirection: 'row',
  },
  infoIconContainer: {
    marginRight: 10,
    marginTop: 2,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoTitle: {
    fontSize: isSmallScreen ? 13 : 14,
    fontWeight: '600',
    color: colors.atb.red,
    marginBottom: 6,
  },
  infoList: {
    gap: 3,
  },
  infoItem: {
    fontSize: isSmallScreen ? 11 : 12,
    color: colors.atb.red,
    lineHeight: isSmallScreen ? 16 : 18,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: isSmallScreen ? 24 : 32,
  },
  rightButtonsContainer: {
    flexDirection: 'row',
    gap: isSmallScreen ? 8 : 12,
    flex: 1,
    justifyContent: 'flex-end',
  },
  button: {
    height: isSmallScreen ? 48 : 54,
    backgroundColor: colors.neutral.white,
    borderWidth: 1.5,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: isSmallScreen ? 90 : 100,
  },
  quitButton: {
    borderColor: colors.atb.red,
  },
  backButton: {
    borderColor: colors.neutral.gray300,
  },
  quitButtonText: {
    fontSize: isSmallScreen ? 14 : 15,
    fontWeight: '700',
    color: colors.status.error,
    letterSpacing: 0.3,
  },
  backButtonText: {
    fontSize: isSmallScreen ? 14 : 15,
    fontWeight: '700',
    color: colors.neutral.gray700,
    letterSpacing: 0.3,
  },
  continueButton: {
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
    minWidth: isSmallScreen ? 110 : 120,
  },
  continueGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: isSmallScreen ? 48 : 54,
    paddingHorizontal: isSmallScreen ? 20 : 24,
  },
  disabledButton: {
    opacity: 0.6,
  },
  continueButtonText: {
    fontSize: isSmallScreen ? 14 : 15,
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
    paddingTop: isSmallScreen ? 16 : 20,
    paddingBottom: 8,
  },
  footerDivider: {
    width: 50,
    height: 2,
    backgroundColor: colors.neutral.gray300,
    borderRadius: 1,
    marginBottom: 8,
  },
  footerText: {
    fontSize: isSmallScreen ? 10 : 11,
    color: colors.neutral.gray500,
    fontWeight: '500',
    marginBottom: 12,
    textAlign: 'center',
  },
  footerSubtext: {
    fontSize: isSmallScreen ? 9 : 10,
    color: colors.neutral.gray400,
    fontWeight: '400',
    textAlign: 'center',
  },
});

export default OtpVerificationScreen;