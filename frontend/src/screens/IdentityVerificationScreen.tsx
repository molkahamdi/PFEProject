import React, { useState, useEffect, useRef } from 'react';
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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import colors from 'constants/colors';

type NavigationProp = {
  goBack: () => void;
  navigate: (screen: string) => void;
};

type IdentityVerificationScreenProps = {
  navigation: NavigationProp;
};

const IdentityVerificationScreen: React.FC<IdentityVerificationScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [idCardNumber, setIdCardNumber] = useState('');
  const [captcha, setCaptcha] = useState('');
  const [captchaText, setCaptchaText] = useState('');
  const [captchaError, setCaptchaError] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [idError, setIdError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const phoneInputRef = useRef<TextInput>(null);

  // Générer un nouveau CAPTCHA aléatoire
  const generateCaptcha = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const length = 5 + Math.floor(Math.random() * 3); // 5 à 7 caractères
    
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    
    // Ajouter des variations de casse et de police
    const styledCaptcha = result.split('').map(char => {
      if (Math.random() > 0.5) {
        return char.toUpperCase();
      }
      return char.toLowerCase();
    }).join('');
    
    setCaptchaText(styledCaptcha);
    setCaptcha('');
    setCaptchaError(false);
  };

  // Générer un CAPTCHA après une erreur (plus complexe)
  const generateErrorCaptcha = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const length = 6 + Math.floor(Math.random() * 3); // 6 à 8 caractères (plus long après erreur)
    
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    
    // Ajouter plus de variations après une erreur
    const styledCaptcha = result.split('').map((char, index) => {
      if (index % 2 === 0) {
        return char.toUpperCase();
      }
      return char.toLowerCase();
    }).join('');
    
    setCaptchaText(styledCaptcha);
    setCaptcha('');
    setCaptchaError(true); // Garder l'état d'erreur pour feedback visuel
  };

  // Initialiser le CAPTCHA au chargement
  useEffect(() => {
    generateCaptcha();
  }, []);

  // Validation de l'email
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError('L\'adresse email est requise');
      return false;
    }
    if (!emailRegex.test(email)) {
      setEmailError('Adresse email invalide');
      return false;
    }
    setEmailError('');
    return true;
  };

  // Validation du numéro de téléphone
  const validatePhone = (phone: string) => {
    // Nettoyer le numéro - ne garder que les chiffres
    const cleanPhone = phone.replace(/\D/g, '');
    
    if (!phone) {
      setPhoneError('Le numéro de téléphone est requis');
      return false;
    }
    
    if (cleanPhone.length !== 8) {
      setPhoneError('Numéro invalide. 8 chiffres requis (ex: 12345678)');
      return false;
    }
    
    // Vérifier que c'est un numéro tunisien valide (commence par 2, 4, 5, 9)
    const firstDigit = cleanPhone.charAt(0);
    if (!['2', '4', '5', '9'].includes(firstDigit)) {
      setPhoneError('Numéro tunisien invalide. Doit commencer par 2, 4, 5 ou 9');
      return false;
    }
    
    setPhoneError('');
    return true;
  };

  // Validation du numéro de carte d'identité
  const validateIdCard = (id: string) => {
    if (!id) {
      setIdError('Le numéro de carte d\'identité est requis');
      return false;
    }
    if (id.length < 8 || id.length > 12) {
      setIdError('Numéro de carte invalide (8-12 chiffres)');
      return false;
    }
    if (!/^\d+$/.test(id)) {
      setIdError('Le numéro ne doit contenir que des chiffres');
      return false;
    }
    setIdError('');
    return true;
  };

  // Gestion du changement de numéro de téléphone
  const handlePhoneChange = (text: string) => {
    // N'autoriser que les chiffres
    const numbersOnly = text.replace(/\D/g, '');
    
    // Limiter à 8 chiffres pour les numéros tunisiens
    const limitedNumbers = numbersOnly.substring(0, 8);
    
    setPhoneNumber(limitedNumbers);
    
    // Validation en temps réel
    if (limitedNumbers.length > 0) {
      validatePhone(limitedNumbers);
    } else {
      setPhoneError('');
    }
  };

  // Formatage du numéro pour l'affichage
  const formatPhoneDisplay = (phone: string) => {
    if (!phone) return '';
    
    // Ajouter des espaces pour une meilleure lisibilité
    if (phone.length <= 2) return phone;
    if (phone.length <= 5) return `${phone.substring(0, 2)} ${phone.substring(2)}`;
    return `${phone.substring(0, 2)} ${phone.substring(2, 5)} ${phone.substring(5)}`;
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (text.length > 0) {
      validateEmail(text);
    } else {
      setEmailError('');
    }
  };

  const handleIdCardChange = (text: string) => {
    // N'autoriser que les chiffres
    const numericText = text.replace(/[^0-9]/g, '');
    setIdCardNumber(numericText);
    
    if (numericText.length > 0) {
      validateIdCard(numericText);
    } else {
      setIdError('');
    }
  };

  const handleContinue = async () => {
    // Valider tous les champs
    const isEmailValid = validateEmail(email);
    const isPhoneValid = validatePhone(phoneNumber);
    const isIdCardValid = validateIdCard(idCardNumber);
    const isCaptchaValid = captcha === captchaText;

    if (!isEmailValid || !isPhoneValid || !isIdCardValid) {
      Alert.alert('Erreur', 'Veuillez corriger les erreurs dans le formulaire');
      return;
    }

    if (!captcha) {
      Alert.alert('Erreur', 'Veuillez saisir le code de vérification');
      setCaptchaError(true);
      return;
    }

    if (!isCaptchaValid) {
      // Code incorrect - générer un nouveau CAPTCHA
      Alert.alert('Erreur', 'Le code de vérification est incorrect. Un nouveau code a été généré.');
      generateErrorCaptcha(); // Génère un nouveau CAPTCHA après erreur
      return;
    }

    setIsLoading(true);
    
    // Simulation de vérification d'identité avec délai
    setTimeout(() => {
      setIsLoading(false);
      
      // Formater le numéro complet avec le code pays
      const fullPhoneNumber = `+216 ${formatPhoneDisplay(phoneNumber)}`;
      
      // Simulation de vérification d'identité
      Alert.alert(
        'Vérification réussie',
        'Votre identité a été vérifiée avec succès.\n\n' +
        'Email: ' + email + '\n' +
        'Téléphone: ' + fullPhoneNumber + '\n' +
        'CIN: ' + idCardNumber,
        [
          {
            text: 'Continuer',
            onPress: () => navigation.navigate('ResumewithReference'),
          }
        ]
      );
    }, 1500);
  };

  const handleRefreshCaptcha = () => {
    // Rafraîchir manuellement - génère un CAPTCHA normal
    generateCaptcha();
  };

  // Focus sur le champ téléphone quand on clique sur le conteneur
  const focusPhoneInput = () => {
    if (phoneInputRef.current) {
      phoneInputRef.current.focus();
    }
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
                    source={require('../assets/atb-onboarding-bg.jpg')}
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
                  <Text style={styles.mainTitle}>Vérification de l'identité</Text>
                  <Text style={styles.mainSubtitle}>
                    Connectez-vous pour bénéficier de services bancaires transparents, 
                    à tout moment et en tout lieu.
                  </Text>
                </View>

                {/* FORMULAIRE - STYLE CARTES SÉPARÉES */}
                <View style={styles.formContainer}>
                  
                  {/* Carte Email */}
                  <View style={[styles.inputCard, emailError ? styles.inputCardError : null]}>
                    <Text style={styles.cardLabel}>Adresse Email</Text>
                    <View style={styles.cardInputContainer}>
                      <Feather name="mail" size={18} color={emailError ? colors.atb.red : colors.neutral.gray500} style={styles.inputIcon} />
                      <TextInput
                        style={styles.cardInput}
                        value={email}
                        onChangeText={handleEmailChange}
                        onBlur={() => validateEmail(email)}
                        placeholder="Insérez votre adresse e-mail"
                        placeholderTextColor={colors.neutral.gray400}
                        autoCapitalize="none"
                        keyboardType="email-address"
                        autoComplete="email"
                      />
                    </View>
                    {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
                  </View>

                  {/* Carte Numéro de téléphone - CORRIGÉ */}
                  <View style={[styles.inputCard, phoneError ? styles.inputCardError : null]}>
                    <Text style={styles.cardLabel}>Numéro de téléphone</Text>
                    <TouchableOpacity 
                      style={styles.cardInputContainer}
                      onPress={focusPhoneInput}
                      activeOpacity={1}
                    >
                      {/* Logo Tunisie */}
                      <View style={styles.countryCodeContainer}>
                        <Image
                          source={require('../assets/tunisia-flag.png')} // Remplacez par votre image du drapeau tunisien
                          style={styles.flagIcon}
                          resizeMode="contain"
                        />
                        <Text style={styles.countryCode}>+216</Text>
                      </View>
                      
                      <View style={styles.phoneSeparator} />
                      
                      <TextInput
                        ref={phoneInputRef}
                        style={styles.cardInput}
                        value={formatPhoneDisplay(phoneNumber)}
                        onChangeText={handlePhoneChange}
                        onBlur={() => validatePhone(phoneNumber)}
                        placeholder="XX XXX XXX"
                        placeholderTextColor={colors.neutral.gray400}
                        keyboardType="phone-pad"
                        maxLength={10} // 2 espaces + 8 chiffres
                        returnKeyType="done"
                      />
                    </TouchableOpacity>
                    {phoneError ? <Text style={styles.errorText}>{phoneError}</Text> : null}
                  </View>

                  {/* Carte Numéro de carte d'identité */}
                  <View style={[styles.inputCard, idError ? styles.inputCardError : null]}>
                    <Text style={styles.cardLabel}>Numéro de la carte d'identité nationale</Text>
                    <View style={styles.cardInputContainer}>
                      <Feather name="credit-card" size={18} color={idError ? colors.atb.red : colors.neutral.gray500} style={styles.inputIcon} />
                      <TextInput
                        style={styles.cardInput}
                        value={idCardNumber}
                        onChangeText={handleIdCardChange}
                        onBlur={() => validateIdCard(idCardNumber)}
                        placeholder="Entrez votre numéro CIN"
                        placeholderTextColor={colors.neutral.gray400}
                        keyboardType="numeric"
                        maxLength={12}
                      />
                    </View>
                    {idError ? <Text style={styles.errorText}>{idError}</Text> : null}
                  </View>

                  {/* Section CAPTCHA intelligente */}
                  <View style={[styles.captchaSection, captchaError ? styles.captchaSectionError : null]}>
                    <View style={styles.captchaHeader}>
                      <Text style={styles.captchaLabel}>Vérification de sécurité</Text>
                    
                    </View>
                    
                    <View style={styles.captchaContainer}>
                      {/* Zone d'affichage du CAPTCHA avec design amélioré */}
                      <View style={styles.captchaDisplay}>
                        <LinearGradient
                          colors={[colors.neutral.gray100, colors.neutral.gray200]}
                          style={styles.captchaGradient}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                        >
                          <View style={styles.captchaLines}>
                            {Array.from({ length: 5 }).map((_, i) => (
                              <View 
                                key={i} 
                                style={[
                                  styles.captchaLine,
                                  { 
                                    top: Math.random() * 40,
                                    left: Math.random() * 100,
                                    width: 60 + Math.random() * 40,
                                    opacity: 0.2 + Math.random() * 0.3
                                  }
                                ]} 
                              />
                            ))}
                          </View>
                          <Text style={[
                            styles.captchaText,
                            { 
                              transform: [
                                { rotate: `${(Math.random() * 10 - 5)}deg` },
                                { skewX: `${Math.random() * 10 - 5}deg` }
                              ]
                            }
                          ]}>
                            {captchaText}
                          </Text>
                        </LinearGradient>
                        
                        <TouchableOpacity 
                          style={styles.refreshButton}
                          onPress={handleRefreshCaptcha}
                          activeOpacity={0.7}
                        >
                          <Feather name="refresh-cw" size={18} color={colors.neutral.white} />
                        </TouchableOpacity>
                      </View>
                      
                      {/* Champ de saisie du CAPTCHA */}
                      <View style={styles.captchaInputCard}>
                        <Text style={styles.captchaInstruction}>
                          Entrez le texte ci-dessus{' '}
    
                        </Text>
                        <View style={styles.captchaInputContainer}>
                          <TextInput
                            style={[
                              styles.captchaInput,
                              captchaError ? styles.captchaInputError : null
                            ]}
                            value={captcha}
                            onChangeText={(text) => {
                              setCaptcha(text);
                              setCaptchaError(false); // Réinitialiser l'erreur quand l'utilisateur tape
                            }}
                            placeholder="Saisissez le code"
                            placeholderTextColor={colors.neutral.gray400}
                            autoCapitalize="characters"
                            maxLength={10}
                          />
                          {captchaError && (
                            <Feather name="alert-circle" size={16} color={colors.atb.red} style={styles.errorIcon} />
                          )}
                        </View>
                        {captchaError ? (
                          <Text style={styles.captchaErrorText}>
                            Code incorrect. Un nouveau code a été généré.
                          </Text>
                        ) : null}
                      </View>
                    </View>
                    
                    <Text style={styles.captchaHelp}>
                      <Feather name="info" size={12} color={colors.neutral.gray500} />
                      {' '}Cette vérification permet de confirmer que vous n'êtes pas un robot
                    </Text>
                  </View>

                  {/* Bouton - Style flottant */}
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity
                      style={[styles.continueButton, isLoading ? styles.continueButtonDisabled : null]}
                      onPress={handleContinue}
                      activeOpacity={0.9}
                      disabled={isLoading}
                    >
                      <LinearGradient
                        colors={[colors.atb.red, colors.atb.red]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.buttonGradient}
                      >
                        {isLoading ? (
                          <View style={styles.loadingContainer}>
                            <Feather name="loader" size={20} color={colors.neutral.white} style={styles.loadingIcon} />
                            <Text style={styles.continueButtonText}>Vérification...</Text>
                          </View>
                        ) : (
                          <>
                            <Text style={styles.continueButtonText}>Continuer</Text>
                            <Feather name="arrow-right" size={20} color={colors.neutral.white} style={styles.buttonIcon} />
                          </>
                        )}
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Section Informations */}
                <View style={styles.infoBadge}>
                  <View style={styles.badgeIcon}>
                    <Feather name="shield" size={14} color={colors.neutral.white} />
                  </View>
                  <View style={styles.badgeContent}>
                    <Text style={styles.infoText}>
                      Assurez-vous que les informations saisies correspondent à celles 
                      utilisées lors de votre demande initiale. Toutes vos données sont 
                      sécurisées et cryptées.
                    </Text>
                  </View>
                </View>

                {/* Footer avec liens */}
                <View style={styles.footer}>
                  <View style={styles.footerLinks}>
                    <TouchableOpacity style={styles.footerLink}>
                      <Text style={styles.footerLinkText}>Agences</Text>
                    </TouchableOpacity>
                    <View style={styles.separatorDot} />
                    <TouchableOpacity style={styles.footerLink}>
                      <Text style={styles.footerLinkText}>FAQ</Text>
                    </TouchableOpacity>
                    <View style={styles.separatorDot} />
                    <TouchableOpacity style={styles.footerLink}>
                      <Text style={styles.footerLinkText}>Contact</Text>
                    </TouchableOpacity>
                    <View style={styles.separatorDot} />
                    <TouchableOpacity style={styles.footerLink}>
                      <Text style={styles.footerLinkText}>Aide</Text>
                    </TouchableOpacity>
                    <View style={styles.separatorDot} />
                    <TouchableOpacity style={styles.footerLink}>
                      <Text style={styles.footerLinkText}>Confidentialité</Text>
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.copyright}>
                    © 2026 Arab Tunisian Bank. Tous droits réservés.
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
    backgroundColor: colors.neutral.offWhite,
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
    padding: 24,
  },
  // Hero Section
  heroSection: {
    marginBottom: 20,
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
    height: 200,
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
    fontSize: 20,
    fontWeight: '700',
    color: colors.neutral.white,
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 28,
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  heroSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.neutral.white,
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 22,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  heroTagline: {
    fontSize: 14,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    fontStyle: 'italic',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  titleSection: {
    marginBottom: 12,
    alignItems: 'center',
  },
  mainTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: colors.neutral.gray900,
    marginBottom: 10,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  mainSubtitle: {
    fontSize: 14,
    color: colors.neutral.gray600,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 10,
    fontWeight: '400',
  },
  // FORMULAIRE
  formContainer: {
    backgroundColor: 'transparent',
    marginBottom: 20,
  },
  inputCard: {
    backgroundColor: colors.neutral.white,
    borderRadius: 12,
    padding: 13,
    marginBottom: 10,
    elevation: 2,
    shadowColor: colors.neutral.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    borderWidth: 0.5,
    borderColor: colors.neutral.gray200,
  },
  inputCardError: {
    borderColor: colors.atb.red,
    borderWidth: 1,
    backgroundColor: 'rgba(172, 0, 51, 0.02)',
  },
  cardLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.neutral.gray700,
    letterSpacing: 0.3,
    marginBottom: 8,
  },
  cardInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputIcon: {
    marginRight: 10,
  },
  countryCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.neutral.gray100,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 10,
  },
  flagIcon: {
    width: 20,
    height: 15,
    marginRight: 6,
  },
  countryCode: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.neutral.gray800,
  },
  phoneSeparator: {
    width: 1,
    height: 20,
    backgroundColor: colors.neutral.gray300,
    marginRight: 10,
  },
  cardInput: {
    flex: 1,
    fontSize: 16,
    color: colors.neutral.gray900,
    fontWeight: '400',
    paddingVertical: 8,
    height: 32,
  },
  errorText: {
    fontSize: 12,
    color: colors.atb.red,
    marginTop: 4,
    fontWeight: '400',
  },
  // Section CAPTCHA
  captchaSection: {
    backgroundColor: colors.neutral.white,
    borderRadius: 12,
    padding: 13,
    marginBottom: 10,
    elevation: 2,
    shadowColor: colors.neutral.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    borderWidth: 0.5,
    borderColor: colors.neutral.gray200,
  },
  captchaSectionError: {
    borderColor: colors.atb.red,
    backgroundColor: 'rgba(172, 0, 51, 0.02)',
  },
  captchaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  captchaLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.neutral.gray700,
    letterSpacing: 0.3,
  },
  captchaRefreshAll: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  captchaRefreshText: {
    fontSize: 11,
    color: colors.atb.red,
    fontWeight: '500',
  },
  captchaContainer: {
    alignItems: 'center',
  },
  captchaDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    width: '100%',
  },
  captchaGradient: {
    flex: 1,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    overflow: 'hidden',
    position: 'relative',
  },
  captchaLines: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  captchaLine: {
    position: 'absolute',
    height: 1,
    backgroundColor: colors.neutral.gray400,
  },
  captchaText: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.neutral.gray800,
    letterSpacing: 2,
  },
  refreshButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: colors.atb.red,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: colors.atb.red,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  captchaInputCard: {
    width: '100%',
    backgroundColor: colors.neutral.offWhite,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.neutral.gray300,
  },
  captchaInstruction: {
    fontSize: 12,
    color: colors.neutral.gray600,
    marginBottom: 8,
    textAlign: 'center',
  },
  captchaHint: {
    fontSize: 11,
    color: colors.neutral.gray500,
    fontStyle: 'italic',
  },
  captchaInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  captchaInput: {
    flex: 1,
    fontSize: 16,
    color: colors.neutral.gray900,
    fontWeight: '500',
    textAlign: 'center',
    paddingVertical: 8,
    borderBottomWidth: 2,
    borderBottomColor: colors.neutral.gray400,
  },
  captchaInputError: {
    borderBottomColor: colors.atb.red,
  },
  errorIcon: {
    marginLeft: 10,
  },
  captchaErrorText: {
    fontSize: 11,
    color: colors.atb.red,
    textAlign: 'center',
    marginTop: 6,
    fontWeight: '400',
  },
  captchaHelp: {
    fontSize: 10,
    color: colors.neutral.gray500,
    textAlign: 'center',
    marginTop: 10,
    fontStyle: 'italic',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    marginTop: 15,
  },
  continueButton: {
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: colors.atb.red,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  continueButtonDisabled: {
    opacity: 0.7,
  },
  buttonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingIcon: {
    marginRight: 10,
   
  },
  continueButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.neutral.white,
    letterSpacing: 0.5,
  },
  buttonIcon: {
    marginLeft: 8,
  },
  infoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(172, 0, 51, 0.05)',
    borderRadius: 10,
    padding: 16,
    marginBottom: 28,
    borderWidth: 0.5,
    borderColor: 'rgba(172, 0, 51, 0.1)',
  },
  badgeIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.atb.red,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  badgeContent: {
    flex: 1,
  },
  infoText: {
    fontSize: 13,
    color: colors.neutral.gray700,
    lineHeight: 18,
    fontWeight: '400',
  },
  // Footer
  footer: {
    alignItems: 'center',
  },
  footerLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    flexWrap: 'wrap',
  },
  footerLink: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  footerLinkText: {
    fontSize: 11,
    color: colors.neutral.gray600,
    fontWeight: '400',
  },
  separatorDot: {
    width: 2,
    height: 2,
    borderRadius: 1,
    backgroundColor: colors.neutral.gray400,
    marginHorizontal: 4,
  },
  copyright: {
    fontSize: 10,
    color: colors.neutral.gray500,
    fontWeight: '300',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
});

export default IdentityVerificationScreen;