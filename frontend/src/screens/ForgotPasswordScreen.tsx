import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  ImageBackground,
  StatusBar,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Linking,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import colors from 'constants/colors';

type NavigationProp = {
  goBack: () => void;
  navigate: (screen: string) => void;
};

type ForgotPasswordScreenProps = {
  navigation: NavigationProp;
};

const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({ navigation }) => {
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [isResendEnabled, setIsResendEnabled] = useState(false);
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Timer pour le renvoi de code
  useEffect(() => {
    let interval: number;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            setIsResendEnabled(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleCodeChange = (text: string, index: number) => {
    // Ne permettre que les chiffres
    const numericText = text.replace(/[^0-9]/g, '');
    
    const newCode = [...verificationCode];
    newCode[index] = numericText;
    setVerificationCode(newCode);

    // Passer automatiquement au champ suivant
    if (numericText && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Si on supprime, revenir au champ précédent
    if (!numericText && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleKeyPress = (event: any, index: number) => {
    if (event.nativeEvent.key === 'Backspace' && !verificationCode[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };
  
  const handleVerify = () => {
    const code = verificationCode.join('');
    
    if (code.length !== 6) {
      Alert.alert('Code incomplet', 'Veuillez saisir les 6 chiffres du code de vérification');
      return;
    }
    
    if (!/^\d{6}$/.test(code)) {
      Alert.alert('Code invalide', 'Le code doit contenir exactement 6 chiffres');
      return;
    }
    
    setIsLoading(true);
    
    // Simulation de vérification avec succès
    setTimeout(() => {
      setIsLoading(false);
      
      // Naviguer directement vers NewPasswordScreen
      navigation.navigate('NewPassword');
      
      // Optionnel: Afficher un message de succès
      Alert.alert(
        'Code vérifié',
        'Votre code a été vérifié avec succès. Veuillez maintenant créer un nouveau mot de passe.',
        [{ text: 'OK' }]
      );
    }, 1000);
  };

  const handleResendCode = () => {
    if (!isResendEnabled) return;

    setIsLoading(true);
    setTimer(60);
    setIsResendEnabled(false);
    setVerificationCode(['', '', '', '', '', '']);
    
    // Simulation d'envoi de code
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert('Code envoyé', 'Un nouveau code a été envoyé à votre adresse e-mail/numéro de téléphone.');
      inputRefs.current[0]?.focus();
    }, 1000);
  };

  const openPrivacyPolicy = () => {
    Linking.openURL('https://www.atb.com.tn/politique-de-confidentialite');
  };

  const openFAQ = () => {
    Linking.openURL('https://www.atb.com.tn/faq');
  };

  const openContact = () => {
    Linking.openURL('https://www.atb.com.tn/contact');
  };

  const openAgencies = () => {
    Linking.openURL('https://www.atb.com.tn/agences');
  };

  const openHelp = () => {
    Linking.openURL('https://www.atb.com.tn/aide');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.neutral.white} />
      
      {/* Header Professionnel */}
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
      </View>

      {/* Background général */}
      <View style={styles.background}>
        <LinearGradient
          colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.98)']}
          style={styles.backgroundOverlay}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.flex}
          >
            <ScrollView
              style={styles.flex}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.mainContent}>
                {/* 🖼 SECTION IMAGE PROMOTIONNELLE EN HAUT */}
                <View style={styles.heroSection}>
                  <ImageBackground
                    source={require('../assets/Employee.jpg')}
                    style={styles.heroImage}
                    resizeMode="cover"
                  >
                    <LinearGradient
                      colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.6)']}
                      style={styles.heroOverlay}
                    >
                      <View style={styles.heroContent}>
                        <Text style={styles.heroTitle}>
                          Ouvrez votre compte en quelques clics
                        </Text>
                        <Text style={styles.heroSubtitle}>
                          Où que vous soyez, avec ATB DIGIPACK !
                        </Text>
                        <Text style={styles.heroTagline}>
                          Votre banque, toujours à portée de main.
                        </Text>
                      </View>
                    </LinearGradient>
                  </ImageBackground>
                </View>

                {/* Titre principal */}
                <View style={styles.titleSection}>
                  <Text style={styles.mainTitle}>Réinitialisation du mot de passe</Text>
                  <Text style={styles.mainSubtitle}>
                    Le code de sécurité sera envoyé à votre adresse e-mail/numéro de téléphone principal.
                  </Text>
                </View>

                {/* Code de vérification - STYLE PRESTIGIEUX */}
                <View style={styles.codeSection}>
                  <Text style={styles.codeTitle}>Code de vérification</Text>
                  <Text style={styles.codeSubtitle}>Entrez le code de vérification</Text>
                  
                  <View style={styles.codeInputsContainer}>
                    {verificationCode.map((digit, index) => (
                      <View 
                        key={index} 
                        style={[
                          styles.codeInputWrapper,
                          digit !== '' && styles.codeInputFilled
                        ]}
                      >
                        <TextInput
                          ref={(ref) => { inputRefs.current[index] = ref; }}
                          style={styles.codeInput}
                          value={digit}
                          onChangeText={(text) => handleCodeChange(text, index)}
                          onKeyPress={(e) => handleKeyPress(e, index)}
                          keyboardType="numeric"
                          maxLength={1}
                          selectTextOnFocus
                          autoFocus={index === 0}
                        />
                        {digit === '' && (
                          <View style={styles.codePlaceholder} />
                        )}
                      </View>
                    ))}
                  </View>
                  
                  {/* Bouton Continuer */}
                  <TouchableOpacity
                    style={[
                      styles.continueButton,
                      isLoading && styles.continueButtonDisabled
                    ]}
                    onPress={handleVerify}
                    disabled={isLoading}
                    activeOpacity={0.9}
                  >
                    <LinearGradient
                      colors={[colors.atb.red, colors.atb.red]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.continueButtonGradient}
                    >
                      {isLoading ? (
                        <View style={styles.loadingContainer}>
                          <Text style={styles.continueButtonText}>Vérification...</Text>
                        </View>
                      ) : (
                        <Text style={styles.continueButtonText}>Continuer</Text>
                      )}
                    </LinearGradient>
                  </TouchableOpacity>

                  {/* Timer et renvoi */}
                  <View style={styles.resendContainer}>
                    <Text style={styles.timerText}>
                      {timer > 0 ? `Renvoyer un nouveau code dans ${timer}s` : 'Vous pouvez renvoyer un nouveau code'}
                    </Text>
                    
                    <TouchableOpacity
                      onPress={handleResendCode}
                      disabled={!isResendEnabled || isLoading}
                      style={[
                        styles.resendButton,
                        (!isResendEnabled || isLoading) && styles.resendButtonDisabled
                      ]}
                    >
                      <Text style={[
                        styles.resendButtonText,
                        (!isResendEnabled || isLoading) && styles.resendButtonTextDisabled
                      ]}>
                        Renvoyer un nouveau code
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Informations */}
                <View style={styles.infoBadge}>
                  <View style={styles.badgeIcon}>
                    <Text style={styles.badgeIconText}>i</Text>
                  </View>
                  <View style={styles.badgeContent}>
                    <Text style={styles.infoText}>
                      Le code de vérification est valide pendant 10 minutes. Assurez-vous de le saisir rapidement.
                    </Text>
                  </View>
                </View>

                {/* Footer avec liens */}
                <View style={styles.footer}>
                  <View style={styles.footerLinks}>
                    <TouchableOpacity style={styles.footerLink} onPress={openAgencies}>
                      <Text style={styles.footerLinkText}>Nos Agences</Text>
                    </TouchableOpacity>
                    <View style={styles.separatorDot} />
                    <TouchableOpacity style={styles.footerLink} onPress={openFAQ}>
                      <Text style={styles.footerLinkText}>FAQ</Text>
                    </TouchableOpacity>
                    <View style={styles.separatorDot} />
                    <TouchableOpacity style={styles.footerLink} onPress={openContact}>
                      <Text style={styles.footerLinkText}>Contactez nous</Text>
                    </TouchableOpacity>
                    <View style={styles.separatorDot} />
                    <TouchableOpacity style={styles.footerLink} onPress={openHelp}>
                      <Text style={styles.footerLinkText}>Aide</Text>
                    </TouchableOpacity>
                    <View style={styles.separatorDot} />
                    <TouchableOpacity style={styles.footerLink} onPress={openPrivacyPolicy}>
                      <Text style={styles.footerLinkText}>Politique de confidentialité</Text>
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.copyright}>
                    © 2026 ATB. All rights reserved.
                  </Text>
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </LinearGradient>
      </View>
    </SafeAreaView>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral.white,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.gray200,
    backgroundColor: colors.neutral.gray100,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoContainer: {
    shadowColor: colors.atb.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  logo: {
    width: 36,
    height: 36,
  },
  logoGradient: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bankName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.atb.primary,
    letterSpacing: 0.3,
  },
  bankSubtitle: {
    fontSize: 11,
    color: colors.neutral.gray500,
    marginTop: 2,
    fontWeight: '500',
  },
  background: {
    flex: 1,
    backgroundColor: colors.neutral.gray200,
  },
  backgroundOverlay: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  mainContent: {
    padding: 22,
  },
  // Hero Section
  heroSection: {
    marginBottom: 12,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: colors.neutral.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
  },
  heroImage: {
    width: '100%',
    height: 180,
    justifyContent: 'center',
  },
  heroOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  heroContent: {
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.neutral.white,
    textAlign: 'center',
    marginBottom: 10,
    lineHeight: 24,
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  heroSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.neutral.white,
    textAlign: 'center',
    marginBottom: 10,
    lineHeight: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  heroTagline: {
    fontSize: 13,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    fontStyle: 'italic',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  titleSection: {
    marginBottom: 20,
    alignItems: 'center',
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.atb.primary,
    marginBottom: 9,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  mainSubtitle: {
    fontSize: 16,
    color: colors.neutral.gray600,
    textAlign: 'center',
    lineHeight: 22,
    fontWeight: '400',
    maxWidth: '90%',
  },
  // Code Section - STYLE PRESTIGIEUX ET FIN
  codeSection: {
    backgroundColor: 'transparent',
    borderRadius: 0,
    padding: 0,
    marginBottom: 24,
    elevation: 0,
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    borderWidth: 0,
    borderColor: 'transparent',
  },
  codeTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.neutral.gray800,
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  codeSubtitle: {
    fontSize: 15,
    color: colors.neutral.gray600,
    marginBottom: 32,
    fontWeight: '400',
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  codeInputsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
    gap: 8,
  },
  codeInputWrapper: {
    width: (width - 168) / 6,
    height: 56,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.neutral.gray300,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  codeInputFilled: {
    borderColor: colors.atb.red,
    borderWidth: 1.5,
    backgroundColor: 'transparent',
    shadowColor: colors.atb.red,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  codeInput: {
    width: '100%',
    height: '100%',
    fontSize: 24,
    fontWeight: '500',
    color: colors.neutral.gray900,
    textAlign: 'center',
    backgroundColor: 'transparent',
  },
  codePlaceholder: {
    position: 'absolute',
    width: 2,
    height: 24,
    backgroundColor: colors.neutral.gray400,
    borderRadius: 1,
    opacity: 0.6,
  },
  // Continue Button - ÉLÉGANT ET FIN
  continueButton: {
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: colors.atb.red,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    marginBottom: 24,
    borderWidth: 0.5,
    borderColor: 'rgba(172, 0, 51, 0.1)',
  },
  continueButtonDisabled: {
    opacity: 0.6,
  },
  continueButtonGradient: {
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.neutral.white,
    letterSpacing: 0.3,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  // Resend Container - STYLE SUBTIL
  resendContainer: {
    alignItems: 'center',
  },
  timerText: {
    fontSize: 13,
    color: colors.neutral.gray500,
    marginBottom: 12,
    fontWeight: '400',
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  resendButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    backgroundColor: 'transparent',
  },
  resendButtonDisabled: {
    opacity: 0.4,
  },
  resendButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.atb.red,
    textDecorationLine: 'none',
    letterSpacing: 0.2,
  },
  resendButtonTextDisabled: {
    color: colors.neutral.gray400,
  },
  // Info Badge - STYLE RAFFINÉ
  infoBadge: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(172, 0, 51, 0.03)',
    borderRadius: 8,
    padding: 14,
    marginBottom: 29,
    borderWidth: 0.5,
    borderColor: 'rgba(172, 0, 51, 0.08)',
  },
  badgeIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.atb.red,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginTop: 1,
  },
  badgeIconText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.neutral.white,
  },
  badgeContent: {
    flex: 1,
  },
  infoText: {
    fontSize: 12,
    color: colors.neutral.gray600,
    lineHeight: 16,
    fontWeight: '400',
    letterSpacing: 0.1,
  },
  // Footer
  footer: {
    alignItems: 'center',
  },
  footerLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 26,
    flexWrap: 'wrap',
  },
  footerLink: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  footerLinkText: {
    fontSize: 11,
    color: colors.neutral.gray500,
    fontWeight: '400',
    letterSpacing: 0.1,
  },
  separatorDot: {
    width: 1.5,
    height: 1.5,
    borderRadius: 0.75,
    backgroundColor: colors.neutral.gray300,
    marginHorizontal: 4,
  },
  copyright: {
    fontSize: 10,
    color: colors.neutral.gray400,
    fontWeight: '300',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
});

export default ForgotPasswordScreen;