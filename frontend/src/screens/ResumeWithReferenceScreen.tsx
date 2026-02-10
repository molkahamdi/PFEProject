import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
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

type ResumeWithReferenceScreenProps = {
  navigation: NavigationProp;
};

const ResumeWithReferenceScreen: React.FC<ResumeWithReferenceScreenProps> = ({ navigation }) => {
  const [referenceCode, setReferenceCode] = useState('');
  const [referenceError, setReferenceError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // Validation du code de référence
  const validateReference = (code: string) => {
    if (!code) {
      setReferenceError('Le code de référence est requis');
      return false;
    }
    
    if (code.length < 8) {
      setReferenceError('Le code de référence doit contenir au moins 8 caractères');
      return false;
    }
    
    setReferenceError('');
    return true;
  };

  const handleReferenceChange = (text: string) => {
    setReferenceCode(text.toUpperCase()); // Convertir en majuscules
    if (text.length > 0) {
      validateReference(text);
    } else {
      setReferenceError('');
    }
  };

  const handleResumeRequest = () => {
    if (!validateReference(referenceCode)) {
      return;
    }

    setIsLoading(true);
    
    // Simulation de vérification
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert(
        'Demande trouvée',
        `Votre demande avec la référence ${referenceCode} a été retrouvée avec succès.`,
        [
          {
            text: 'Continuer',
            onPress: () => navigation.navigate('IdentityVerification')
          },
          {
            text: 'Annuler',
            style: 'cancel'
          }
        ]
      );
    }, 1500);
  };

  const handleBackToHome = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.neutral.white} />
      
      {/* Header Professionnel comme dans le code 1 */}
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
                {/* Titre principal */}
                <View style={styles.titleSection}>
                  <Text style={styles.mainTitle}>Reprendre ma demande</Text>
                  <Text style={styles.mainSubtitle}>
                    Identification de la demande
                  </Text>
                  <Text style={styles.instruction}>
                    Veuillez saisir le code de référence de votre demande.
                  </Text>
                </View>

                {/* FORMULAIRE - STYLE AMÉLIORÉ */}
                <View style={styles.formContainer}>
                  
                  {/* Carte Référence - Style élégant */}
                  <View style={styles.inputWrapper}>
                    <View style={styles.inputHeader}>
                      <View style={styles.inputLabelContainer}>
                        <View style={styles.labelIcon}>
                          <Feather 
                            name="hash" 
                            size={14} 
                            color={referenceError ? colors.atb.red : colors.atb.primary} 
                          />
                        </View>
                        <Text style={styles.cardLabel}>Référence de votre demande</Text>
                      </View>
                      
                      {referenceCode && !referenceError && (
                        <View style={styles.validationBadge}>
                          <Feather name="check" size={12} color={colors.status.success} />
                          <Text style={styles.validationText}>Valide</Text>
                        </View>
                      )}
                    </View>
                    
                    <View style={[
                      styles.inputCard,
                      isFocused && styles.inputCardFocused,
                      referenceError ? styles.inputCardError : null,
                      referenceCode && !referenceError && !isFocused ? styles.inputCardValid : null
                    ]}>
                      <View style={styles.cardInputContainer}>
                        <TextInput
                          style={styles.cardInput}
                          value={referenceCode}
                          onChangeText={handleReferenceChange}
                          onFocus={() => setIsFocused(true)}
                          onBlur={() => {
                            setIsFocused(false);
                            validateReference(referenceCode);
                          }}
                          placeholder="Saisir la référence de votre demande"
                          placeholderTextColor={colors.neutral.gray400}
                          autoCapitalize="characters"
                          autoCorrect={false}
                          selectionColor={colors.atb.primary}
                        />
                        
                        {referenceCode.length > 0 && (
                          <TouchableOpacity 
                            style={styles.clearButton}
                            onPress={() => setReferenceCode('')}
                          >
                            <Feather name="x" size={16} color={colors.neutral.gray400} />
                          </TouchableOpacity>
                        )}
                      </View>
                      
                      {/* Indicateur de longueur */}
                      {referenceCode.length > 0 && (
                        <View style={styles.lengthIndicator}>
                          <View style={[
                            styles.lengthBar,
                            { width: `${Math.min((referenceCode.length / 20) * 100, 100)}%` },
                            referenceCode.length < 8 ? styles.lengthBarWeak : 
                            referenceCode.length < 12 ? styles.lengthBarMedium : styles.lengthBarStrong
                          ]} />
                        </View>
                      )}
                    </View>
                    
                    <View style={styles.inputFooter}>
                      {referenceError ? (
                        <View style={styles.errorContainer}>
                          <Feather name="alert-circle" size={12} color={colors.atb.red} />
                          <Text style={styles.errorText}>{referenceError}</Text>
                        </View>
                      ) : (
                        <View style={styles.hintContainer}>
                          <Feather name="info" size={10} color={colors.neutral.gray500} />
                          <Text style={styles.hintText}>
                             • Min. 8 caractères
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>

                  {/* Bouton - Style flottant comme dans le code 1 */}
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity
                      style={[styles.continueButton, isLoading ? styles.continueButtonDisabled : null]}
                      onPress={handleResumeRequest}
                      activeOpacity={0.9}
                      disabled={isLoading || !referenceCode || !!referenceError}
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
                            <Text style={styles.continueButtonText}>Recherche en cours...</Text>
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

                {/* Section Informations - Style badge comme dans le code 1 */}
                <View style={styles.infoBadge}>
                  <View style={styles.badgeIcon}>
                    <Text style={styles.badgeIconText}>i</Text>
                  </View>
                  <View style={styles.badgeContent}>
                    <Text style={styles.infoText}>
                      Votre code de référence vous a été envoyé par email ou SMS lors de votre demande initiale.
                    </Text>
                  </View>
                </View>

                {/* Footer avec liens comme dans le code 1 */}
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
  titleSection: {
    marginBottom: 28,
    alignItems: 'center',
  },
  mainTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: colors.neutral.gray900,
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  mainSubtitle: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.atb.primary,
    marginBottom: 6,
    textAlign: 'center',
  },
  instruction: {
    fontSize: 13,
    color: colors.neutral.gray600,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 10,
    fontWeight: '400',
  },
  // FORMULAIRE - STYLE AMÉLIORÉ
  formContainer: {
    backgroundColor: 'transparent',
    marginBottom: 20,
  },
  // Nouveau wrapper pour le champ
  inputWrapper: {
    marginBottom: 16,
  },
  inputHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  inputLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  labelIcon: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: 'rgba(172, 0, 51, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.neutral.gray700,
    letterSpacing: 0.2,
  },
  validationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    gap: 4,
  },
  validationText: {
    fontSize: 10,
    fontWeight: '500',
    color: colors.status.success,
  },
  // Carte de saisie améliorée
  inputCard: {
    backgroundColor: colors.neutral.white,
    borderRadius: 14,
    padding: 16,
    elevation: 3,
    shadowColor: colors.neutral.black,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.neutral.gray200,
  },
  inputCardFocused: {
    borderColor: colors.atb.primary,
    backgroundColor: colors.neutral.white,
    elevation: 6,
    shadowColor: colors.atb.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
  },
  inputCardError: {
    borderColor: colors.atb.red,
    backgroundColor: 'rgba(172, 0, 51, 0.02)',
  },
  inputCardValid: {
    borderColor: colors.status.success,
    backgroundColor: 'rgba(76, 175, 80, 0.02)',
  },
  cardInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardInput: {
    flex: 1,
    fontSize: 17,
    color: colors.neutral.gray900,
    fontWeight: '400',
    paddingVertical: 4,
    height: 32,
    letterSpacing: 0.5,
  },
  clearButton: {
    padding: 4,
    marginLeft: 8,
  },
  // Indicateur de longueur
  lengthIndicator: {
    height: 2,
    backgroundColor: colors.neutral.gray200,
    borderRadius: 1,
    marginTop: 12,
    overflow: 'hidden',
  },
  lengthBar: {
    height: '100%',
    borderRadius: 1,
  },
  lengthBarWeak: {
    backgroundColor: colors.atb.red,
  },
  lengthBarMedium: {
    backgroundColor: colors.atb.orange,
  },
  lengthBarStrong: {
    backgroundColor: colors.status.success,
  },
  // Footer du champ
  inputFooter: {
    marginTop: 8,
    minHeight: 18,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  errorText: {
    fontSize: 12,
    color: colors.atb.red,
    fontWeight: '400',
  },
  hintContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  hintText: {
    fontSize: 11,
    color: colors.neutral.gray500,
    fontStyle: 'italic',
    fontWeight: '400',
  },
  buttonContainer: {
    marginTop: 20,
  },
  continueButton: {
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: colors.atb.red,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  continueButtonDisabled: {
    opacity: 0.6,
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
    borderRadius: 12,
    padding: 16,
    marginBottom: 200,
    borderWidth: 1,
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
  badgeIconText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.neutral.white,
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

export default ResumeWithReferenceScreen;