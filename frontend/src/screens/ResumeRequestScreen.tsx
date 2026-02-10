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
  Modal,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, MaterialIcons, Ionicons } from '@expo/vector-icons';
import colors from 'constants/colors';

type NavigationProp = {
  goBack: () => void;
  navigate: (screen: string) => void;
};

type ResumeRequestScreenProps = {
  navigation: NavigationProp;
};

const ResumeRequestScreen: React.FC<ResumeRequestScreenProps> = ({ navigation }) => {
  const [username, setUsername] = useState('37****89');
  const [password, setPassword] = useState('*****');
  const [showPassword, setShowPassword] = useState(false);
  const [contactModalVisible, setContactModalVisible] = useState(false);
  const handleStart = () => {
    if (!username || !password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }
    Alert.alert(
      'Connexion réussie',
      'Reprise de votre demande en cours...',
      [
        {
          text: 'OK',
          onPress: () => navigation.navigate('IdentityVerification'),
        }
      ]
    );
  };

  const handleForgotPassword = () => {
    navigation.navigate('ForgotPassword');
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
                  <Text style={styles.mainTitle}>Reprendre ma demande</Text>
                  <Text style={styles.mainSubtitle}>
                    Connectez-vous pour bénéficier de services bancaires transparents, 
                    à tout moment et en tout lieu.
                  </Text>
                </View>

                {/* FORMULAIRE - STYLE CARTES SÉPARÉES */}
                <View style={styles.formContainer}>
                  
                  {/* Carte Nom d'utilisateur */}
                  <View style={styles.inputCard}>
                    <Text style={styles.cardLabel}>Nom d'utilisateur</Text>
                    <View style={styles.cardInputContainer}>
                      <TextInput
                        style={styles.cardInput}
                        value={username}
                        onChangeText={setUsername}
                        placeholder="Saisissez votre identifiant"
                        placeholderTextColor={colors.neutral.gray400}
                        autoCapitalize="none"
                        keyboardType="default"
                      />
                    </View>
                  </View>

                  {/* Carte Mot de passe */}
                  <View style={styles.inputCard}>
                    <View style={styles.cardHeader}>
                      <Text style={styles.cardLabel}>Mot de passe temporaire</Text>
                      <TouchableOpacity onPress={handleForgotPassword}>
                        <Text style={styles.forgotPasswordText}>Mot de passe oublié?</Text>
                      </TouchableOpacity>
                    </View>
                    <View style={styles.cardInputContainer}>
                      <TextInput
                        style={styles.cardInput}
                        value={password}
                        onChangeText={setPassword}
                        placeholder="Saisissez votre code temporaire"
                        placeholderTextColor={colors.neutral.gray400}
                        secureTextEntry={!showPassword}
                        autoCapitalize="none"
                      />
                      <TouchableOpacity
                        style={styles.visibilityButton}
                        onPress={() => setShowPassword(!showPassword)}
                      >
                        <Text style={styles.visibilityText}>
                          {showPassword ? 'Masquer' : 'Afficher'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Bouton - Style flottant */}
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity
                      style={styles.startButton}
                      onPress={handleStart}
                      activeOpacity={0.9}
                    >
                      <LinearGradient
                        colors={[colors.atb.red, colors.atb.red]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.buttonGradient}
                      >
                        <Text style={styles.startButtonText}>Commencer</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Section Informations - Style badge */}
                <View style={styles.infoBadge}>
                  <View style={styles.badgeIcon}>
                    <Text style={styles.badgeIconText}>i</Text>
                  </View>
                  <View style={styles.badgeContent}>
                    <Text style={styles.infoText}>
                      En cas d'oubli de vos identifiants, utilisez l'option "Mot de passe oublié".
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
  // FORMULAIRE - STYLE CARTES SÉPARÉES
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.neutral.gray700,
    letterSpacing: 0.3,
  },
  forgotPasswordText: {
    fontSize: 12,
    color: colors.atb.red,
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  cardInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardInput: {
    flex: 1,
    fontSize: 16,
    color: colors.neutral.gray900,
    fontWeight: '400',
    paddingVertical: 8,
    height: 32,
  },
  visibilityButton: {
    marginLeft: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: colors.neutral.gray100,
    borderRadius: 6,
  },
  visibilityText: {
    fontSize: 11,
    color: colors.neutral.gray600,
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  buttonContainer: {
    marginTop: 15,
  },
  startButton: {
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: colors.atb.red,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  buttonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.neutral.white,
    letterSpacing: 0.5,
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
  additionalInfo: {
    marginTop: 5,
  },
  additionalTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.neutral.gray900,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  
});

export default ResumeRequestScreen;