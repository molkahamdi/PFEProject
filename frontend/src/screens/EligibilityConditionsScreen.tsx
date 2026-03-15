import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { NavigationProp } from '../types/navigation';
import colors from 'constants/colors';

type EligibilityConditionsScreenProps = {
  navigation: NavigationProp<'EligibilityConditions'>;
};

const EligibilityConditionsScreen: React.FC<EligibilityConditionsScreenProps> = ({ navigation }) => {
  const conditions = [
    {
      id: 1,
      text: "À toute personne physique tunisienne majeure",
    },
    {
      id: 2,
      text: "À toute personne tunisienne résidente en Tunisie",
    },
    {
      id: 3,
      text: "À toute personne tunisienne résidente à l'étranger",
    },
    {
      id: 4,
      text: "Aux usages non professionnels",
    },
    {
      id: 5,
      text: "Aux non clients de l'ATB",
    },
  ];

  const handleContinue = () => {
    navigation.navigate('OnboardingPersonalData');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Header identique au code 1 */}
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
        
        {/* Badge DIGIPACK au lieu de la flèche */}
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
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            {/* Title Section */}
            <View style={styles.titleSection}>
              <View style={styles.titleHeader}>
                <View>
                  <Text style={styles.title}>Conditions d'éligibilité</Text>
                  <Text style={styles.subtitle}>Découvrez les conditions d'éligibilité adaptées à votre situation.</Text>
                </View>
              </View>
            </View>

            {/* Main Content Card */}
            <View style={styles.card}>
              <View style={styles.sectionHeader}>
                <LinearGradient
                  colors={[colors.atb.red, colors.atb.red]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.sectionNumber}
                >
                  <Text style={styles.sectionNumberText}>1</Text>
                </LinearGradient>
                <Text style={styles.sectionTitle}>Conditions requises</Text>
              </View>

              <View style={styles.reservedNotice}>
                <Text style={styles.reservedText}>Cette offre est réservée :</Text>
              </View>

              {/* Conditions List (non cliquable) */}
              <View style={styles.conditionsList}>
                {conditions.map((condition, index) => (
                  <View key={condition.id} style={styles.conditionItem}>
                    <View style={styles.conditionCard}>
                      <View style={styles.conditionIcon}>
                        <LinearGradient
                          colors={[colors.atb.red, colors.atb.red]}
                          style={styles.iconGradient}
                        >
                          <Ionicons 
                            name="checkmark" 
                            size={20} 
                            color={colors.neutral.white} 
                          />
                        </LinearGradient>
                      </View>
                      
                      <View style={styles.conditionTextContainer}>
                        <Text style={styles.conditionText}>
                          {condition.text}
                        </Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>

          
              <View style={styles.disclaimer}>
                <Text style={styles.disclaimerText}>
                  La souscription en ligne à cette offre est effective sous réserve d'acceptation par l'ATB.
                </Text>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.backButton}
              >
                <View style={styles.backArrow} />
                <Text style={styles.backButtonText}>Annuler</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleContinue}
                style={styles.continueButton}
              >
                <LinearGradient
                  colors={[colors.atb.red, colors.atb.red]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.continueGradient}
                >
                  <Text style={styles.continueButtonText}>Commencer</Text>
                  <View style={styles.arrowRight} />
                </LinearGradient>
              </TouchableOpacity>
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
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.gray300,
    backgroundColor: colors.neutral.gray100,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoContainer: {
    shadowColor: colors.atb.red,
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
    color: colors.atb.red,
    letterSpacing: 0.3,
  },
  bankSubtitle: {
    fontSize: 11,
    color: colors.neutral.gray500,
    marginTop: 2,
    fontWeight: '500',
  },
  digipackBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  digipackText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.neutral.white,
    letterSpacing: 2,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    padding: 24,
  },
  titleSection: {
    marginBottom: 15,
  },
  titleHeader: {
    marginBottom: 2,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.neutral.gray900,
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 13,
    color: colors.neutral.gray600,
    fontWeight: '400',
    lineHeight: 19,
  },
  card: {
    backgroundColor: colors.neutral.white,
    borderRadius: 12,
    marginBottom: 20,
    paddingVertical: 24,
    paddingHorizontal: 20,
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
    marginBottom: 20,
    paddingBottom: 13,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.beige,
  },
  sectionNumber: {
    width: 30,
    height: 30,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  sectionNumberText: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.neutral.white,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.neutral.gray900,
    letterSpacing: 0.1,
  },
  reservedNotice: {
    marginBottom: 20,
  },
  reservedText: {
    fontSize: 14,
    color: colors.neutral.gray700,
    fontWeight: '600',
  },
  conditionsList: {
    marginBottom: 10,
  },
  conditionItem: {
    marginBottom: 12,
  },
  conditionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.neutral.white,
    borderWidth: 1.5,
    borderColor: colors.neutral.gray300,
    borderRadius: 8,
    padding: 16,
    minHeight: 80,
  },
  conditionIcon: {
    marginRight: 16,
  },
  iconGradient: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  conditionTextContainer: {
    flex: 1,
  },
  conditionText: {
    fontSize: 14,
    color: colors.neutral.gray800,
    fontWeight: '600',
    lineHeight: 20,
  },
  disclaimer: {
    padding: 16,
    backgroundColor: colors.neutral.offWhite,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.neutral.beige,
  },
  disclaimerText: {
    fontSize: 12,
    color: colors.neutral.gray600,
    lineHeight: 18,
    fontWeight: '500',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  backButton: {
    flex: 1,
    height: 54,
    backgroundColor: colors.neutral.white,
    borderWidth: 1.5,
    borderColor: colors.neutral.gray300,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrow: {
    width: 7,
    height: 7,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    borderColor: colors.neutral.gray700,
    transform: [{ rotate: '45deg' }],
    marginRight: 8,
  },
  backButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.neutral.gray700,
    letterSpacing: 0.3,
  },
  continueButton: {
    flex: 1,
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: colors.atb.burgundy,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  continueGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 54,
    paddingHorizontal: 28,
  },
  continueButtonText: {
    fontSize: 15,
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
    paddingTop: 16,
    paddingBottom: 8,
  },
  footerDivider: {
    width: 50,
    height: 2,
    backgroundColor: colors.neutral.gray300,
    borderRadius: 1,
    marginBottom: 16,
  },
  footerText: {
    fontSize: 11,
    color: colors.neutral.gray500,
    fontWeight: '500',
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 10,
    color: colors.neutral.gray400,
    fontWeight: '400',
  },
});

export default EligibilityConditionsScreen;