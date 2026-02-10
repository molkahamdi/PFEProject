import React, { useState } from 'react';
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
import { Feather, MaterialIcons } from '@expo/vector-icons';
import colors from 'constants/colors';

type NavigationProp = {
  goBack: () => void;
  navigate: (screen: string) => void;
};

type NewPasswordScreenProps = {
  navigation: NavigationProp;
};

const NewPasswordScreen: React.FC<NewPasswordScreenProps> = ({ navigation }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Règles de validation
  const [passwordRules, setPasswordRules] = useState({
    minLength: false,
    maxLength: false,
    hasSpecialChar: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    maxConsecutive: false,
    noSpaces: true,
    noUsernamePart: true, // À vérifier avec le nom d'utilisateur réel
    latinAlphabet: true, // À vérifier
    noPersonalInfo: true, // À vérifier
  });

  // Fonction pour vérifier les règles du mot de passe
  const checkPasswordRules = (password: string) => {
    const specialChars = /[_@!#$%&().*+,\-./:;<=>?@[\]^_`{|}~]/;
    const latinAlphabet = /^[A-Za-z0-9_@!#$%&().*+,\-./:;<=>?@[\]^_`{|}~]+$/;
    
    const rules = {
      minLength: password.length >= 8,
      maxLength: password.length <= 16,
      hasSpecialChar: specialChars.test(password),
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      maxConsecutive: !/(.)\1\1\1/.test(password), // Pas plus de 3 caractères consécutifs identiques
      noSpaces: !/\s/.test(password),
      noUsernamePart: true, // À implémenter avec le vrai nom d'utilisateur
      latinAlphabet: latinAlphabet.test(password),
      noPersonalInfo: true, // À implémenter avec vérification des infos personnelles
    };
    
    setPasswordRules(rules);
    return Object.values(rules).every(rule => rule === true);
  };

  const handleNewPasswordChange = (text: string) => {
    setNewPassword(text);
    checkPasswordRules(text);
  };

  const handleConfirmPasswordChange = (text: string) => {
    setConfirmPassword(text);
  };

  const handleSubmit = () => {
    // Vérifier que les mots de passe sont identiques
    if (newPassword !== confirmPassword) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas');
      return;
    }

    // Vérifier toutes les règles
    const isValid = checkPasswordRules(newPassword);
    if (!isValid) {
      Alert.alert('Mot de passe invalide', 'Veuillez respecter toutes les règles de sécurité');
      return;
    }

    setIsLoading(true);

    // Simulation d'enregistrement du nouveau mot de passe
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert(
        'Mot de passe modifié',
        'Votre mot de passe a été modifié avec succès.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Login'),
          },
        ]
      );
    }, 1500);
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

  // Fonction pour obtenir l'icône de validation
  const getValidationIcon = (isValid: boolean) => {
    return isValid ? (
      <Feather name="check-circle" size={16} color={colors.status.success} />
    ) : (
      <Feather name="x-circle" size={16} color={colors.status.error} />
    );
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
                  <Text style={styles.mainTitle}>Saisissez un nouveau mot de passe pour votre compte</Text>
                </View>

                {/* Section Nouveau mot de passe */}
                <View style={styles.passwordSection}>
                  <Text style={styles.sectionTitle}>Définir votre nouveau mot de passe</Text>
                  <Text style={styles.sectionSubtitle}>
                    Saisissez un nouveau mot de passe pour votre compte.
                  </Text>

                  {/* Nouveau mot de passe */}
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Entrez un nouveau mot de passe</Text>
                    <View style={styles.inputWrapper}>
                      <TextInput
                        style={styles.input}
                        value={newPassword}
                        onChangeText={handleNewPasswordChange}
                        placeholder="Saisissez votre nouveau mot de passe"
                        placeholderTextColor={colors.neutral.gray400}
                        secureTextEntry={!showNewPassword}
                        autoCapitalize="none"
                        autoComplete="off"
                        autoCorrect={false}
                        spellCheck={false}
                      />
                      <TouchableOpacity
                        style={styles.visibilityButton}
                        onPress={() => setShowNewPassword(!showNewPassword)}
                      >
                        <Feather
                          name={showNewPassword ? "eye-off" : "eye"}
                          size={20}
                          color={colors.neutral.gray500}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Confirmation du mot de passe */}
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Confirmez votre nouveau mot de passe</Text>
                    <View style={styles.inputWrapper}>
                      <TextInput
                        style={styles.input}
                        value={confirmPassword}
                        onChangeText={handleConfirmPasswordChange}
                        placeholder="Confirmez votre nouveau mot de passe"
                        placeholderTextColor={colors.neutral.gray400}
                        secureTextEntry={!showConfirmPassword}
                        autoCapitalize="none"
                        autoComplete="off"
                        autoCorrect={false}
                        spellCheck={false}
                      />
                      <TouchableOpacity
                        style={styles.visibilityButton}
                        onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        <Feather
                          name={showConfirmPassword ? "eye-off" : "eye"}
                          size={20}
                          color={colors.neutral.gray500}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Indicateur de force du mot de passe */}
                  {newPassword.length > 0 && (
                    <View style={styles.passwordStrength}>
                      <Text style={styles.strengthTitle}>Force du mot de passe:</Text>
                      <View style={styles.strengthBarContainer}>
                        <View 
                          style={[
                            styles.strengthBar,
                            { 
                              width: `${(Object.values(passwordRules).filter(rule => rule).length / Object.values(passwordRules).length) * 100}%`,
                              backgroundColor: Object.values(passwordRules).filter(rule => rule).length >= 8
                                ? colors.status.success
                                : Object.values(passwordRules).filter(rule => rule).length >= 5
                                ? colors.atb.orange
                                : colors.status.error
                            }
                          ]} 
                        />
                      </View>
                    </View>
                  )}

                  {/* Règles de sécurité */}
                  <View style={styles.rulesSection}>
                    <Text style={styles.rulesTitle}>Règles à respecter:</Text>
                    
                    <View style={styles.ruleItem}>
                      {getValidationIcon(passwordRules.minLength && passwordRules.maxLength)}
                      <Text style={styles.ruleText}>
                        Le mot de passe doit contenir au moins 8 caractères et jusqu'à 16 caractères.
                      </Text>
                    </View>

                    <View style={styles.ruleItem}>
                      {getValidationIcon(passwordRules.hasSpecialChar)}
                      <Text style={styles.ruleText}>
                        Il doit contenir au moins un caractère spécial, seuls les suivants sont autorisés : 
                        _@!#$%&().*+,-./:;{"<"}={">"}?@[\]^_`{"{|}"}~
                      </Text>
                    </View>

                    <View style={styles.ruleItem}>
                      {getValidationIcon(passwordRules.hasUppercase && passwordRules.hasLowercase && passwordRules.hasNumber)}
                      <Text style={styles.ruleText}>
                        Le mot de passe doit inclure au moins une lettre majuscule, une lettre minuscule et un chiffre.
                      </Text>
                    </View>

                    <View style={styles.ruleItem}>
                      {getValidationIcon(passwordRules.maxConsecutive)}
                      <Text style={styles.ruleText}>
                        Le mot de passe peut contenir jusqu'à 3 caractères consécutifs répétés.
                      </Text>
                    </View>

                    <View style={styles.ruleItem}>
                      {getValidationIcon(passwordRules.noUsernamePart)}
                      <Text style={styles.ruleText}>
                        Le mot de passe ne doit pas être identique à une partie du nom d'utilisateur.
                      </Text>
                    </View>

                    <View style={styles.ruleItem}>
                      {getValidationIcon(passwordRules.latinAlphabet)}
                      <Text style={styles.ruleText}>
                        Le mot de passe doit être saisi en alphabet latin (sans accents, ni caractères spéciaux 
                        propres à d'autres alphabets, etc.). Il est sensible à la casse (majuscules/minuscules).
                      </Text>
                    </View>

                    <View style={styles.ruleItem}>
                      {getValidationIcon(passwordRules.noPersonalInfo)}
                      <Text style={styles.ruleText}>
                        Le mot de passe ne doit pas être identique à votre date de naissance, votre nom d'utilisateur, 
                        le mot de passe d'activation temporaire, le numéro de compte, le numéro de carte, etc.
                      </Text>
                    </View>

                    <View style={styles.ruleItem}>
                      {getValidationIcon(passwordRules.noSpaces)}
                      <Text style={styles.ruleText}>
                        Le mot de passe ne doit contenir aucun espace.
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Bouton Confirmer */}
                <TouchableOpacity
                  style={[
                    styles.confirmButton,
                    isLoading && styles.confirmButtonDisabled
                  ]}
                  onPress={handleSubmit}
                  disabled={isLoading}
                  activeOpacity={0.9}
                >
                  <LinearGradient
                    colors={[colors.atb.red, colors.atb.red]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.confirmButtonGradient}
                  >
                    {isLoading ? (
                      <View style={styles.loadingContainer}>
                        <Text style={styles.confirmButtonText}>Validation...</Text>
                      </View>
                    ) : (
                      <Text style={styles.confirmButtonText}>Confirmer</Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>

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
    marginBottom: 24,
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
    marginBottom: 6,
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
    marginBottom: 6,
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
    marginBottom: 10,
    alignItems: 'center',
  },
  mainTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: colors.atb.primary,
    marginBottom: 2,
    textAlign: 'center',
    letterSpacing: 0.3,
    lineHeight: 28,
  },
  // Password Section
  passwordSection: {
    backgroundColor: colors.neutral.white,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: colors.neutral.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    borderWidth: 0.5,
    borderColor: colors.neutral.gray200,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.neutral.gray800,
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: colors.neutral.gray600,
    marginBottom: 20,
    lineHeight: 20,
    fontWeight: '400',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.neutral.gray700,
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.neutral.gray300,
    borderRadius: 8,
    backgroundColor: colors.neutral.offWhite,
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: colors.neutral.gray900,
    paddingVertical: 12,
    height: 44,
  },
  visibilityButton: {
    padding: 4,
  },
  // Password Strength Indicator
  passwordStrength: {
    marginBottom: 20,
  },
  strengthTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.neutral.gray700,
    marginBottom: 8,
  },
  strengthBarContainer: {
    height: 6,
    backgroundColor: colors.neutral.gray200,
    borderRadius: 3,
    overflow: 'hidden',
  },
  strengthBar: {
    height: '100%',
    borderRadius: 3,
  },
  // Rules Section
  rulesSection: {
    backgroundColor: colors.neutral.offWhite,
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.neutral.gray200,
  },
  rulesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.neutral.gray800,
    marginBottom: 12,
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  ruleText: {
    flex: 1,
    fontSize: 13,
    color: colors.neutral.gray600,
    lineHeight: 18,
    marginLeft: 8,
    fontWeight: '400',
  },
  // Confirm Button
  confirmButton: {
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: colors.atb.red,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    marginBottom: 28,
  },
  confirmButtonDisabled: {
    opacity: 0.7,
  },
  confirmButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.neutral.white,
    letterSpacing: 0.5,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  // Footer
  footer: {
    alignItems: 'center',
  },
  footerLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
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

export default NewPasswordScreen;