import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Image,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Checkbox } from 'react-native-paper';
import colors from 'constants/colors';

type NavigationProp = {
  goBack: () => void;
  navigate: (screen: string) => void;
  reset: (config: any) => void;
};

type DigigoScreenProps = {
  navigation: NavigationProp;
};

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
              phase.id === currentPhase && styles.phaseRadioActive
            ]}>
              {phase.id < currentPhase ? (
                <Text style={styles.phaseRadioCheck}>✓</Text>
              ) : (
                <View style={[
                  styles.phaseRadioInner,
                  phase.id === currentPhase && styles.phaseRadioInnerActive
                ]} />
              )}
            </View>
            <Text style={[
              styles.phaseLabel,
              phase.id === currentPhase && styles.phaseLabelActive,
              phase.id < currentPhase && styles.phaseLabelCompleted
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

const DigigoScreen: React.FC<DigigoScreenProps> = ({ navigation }) => {
  const [hasDigigo, setHasDigigo] = useState<'yes' | 'no'>('no');
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Phase actuelle (4 pour cet écran - Envoi)
  const currentPhase = 4;

  const handleSaveAndExit = () => {
    Alert.alert(
      'Enregistrer et quitter',
      'Votre progression sera sauvegardée. Vous pourrez reprendre plus tard.',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Confirmer', onPress: () => navigation.goBack() }
      ]
    );
  };

  const handleSubmit = () => {
    if (!termsAccepted) {
      Alert.alert('Attention', 'Veuillez accepter les termes et conditions.');
      return;
    }

    if (hasDigigo === 'yes') {
      // Navigation vers l'écran de signature Digigo
      navigation.navigate('DigigoSignature');
    } else {
      // Envoi à la banque et redirection vers le suivi
      Alert.alert(
        'Demande envoyée',
        'Votre demande a été envoyée à la banque. Vous serez contacté(e) par l\'agence pour finaliser la démarche.',
        [
          {
            text: 'OK',
            onPress: () => {
              navigation.reset({
                index: 0,
                routes: [{ name: 'Dashboard' }],
              });
            }
          }
        ]
      );
    }
  };

  const renderStep = (step: any) => (
    <View key={step.id} style={styles.stepContainer}>
      <View style={styles.stepCircleContainer}>
        <LinearGradient
          colors={step.current ? [colors.atb.red, colors.atb.red] : 
                  step.completed ? [colors.status.success, colors.status.success] : 
                  [colors.neutral.gray300, colors.neutral.gray300]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[
            styles.stepCircle,
            step.current && styles.currentStepCircle
          ]}
        >
          <Text style={[
            styles.stepNumber,
            step.completed && styles.completedStepNumber,
            step.current && styles.currentStepNumber
          ]}>
            {step.completed ? '✓' : step.id}
          </Text>
        </LinearGradient>
      </View>
      <Text style={[
        styles.stepTitle,
        step.current && styles.currentStepTitle,
        step.completed && styles.completedStepTitle
      ]}>
        {step.title}
      </Text>
    </View>
  );

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
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            {/* ── Titre ── */}
            <View style={styles.titleSection}>
              {/* pageNumber SUPPRIMÉ */}
              <Text style={styles.title}>Envoi de la demande</Text>
              <Text style={styles.subtitle}>
                Finalisez votre demande de souscription Digipack
              </Text>
              
              {/* progressContainer SUPPRIMÉ */}

              {/* Indicateur de phase horizontal */}
              <View style={styles.phaseIndicatorWrapper}>
                <PhaseIndicator currentPhase={currentPhase} />
              </View>
            </View>

            {/* Section Digigo */}
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
                <Text style={styles.sectionTitle}>
                  Choix de Digigo et acceptation des termes et conditions
                </Text>
              </View>

              <Text style={styles.sectionDescription}>
                En cliquant sur "Soumettre", vous reconnaissez avoir lu et accepté les Termes et Conditions.
              </Text>

              {/* Choix Digigo - Boutons Radio */}
              <View style={styles.digigoChoiceContainer}>
                <Text style={styles.digigoQuestion}>
                  Est-ce que vous disposez d'un Digigo?
                </Text>
                
                <View style={styles.radioButtonsContainer}>
                  <TouchableOpacity
                    style={styles.radioOption}
                    onPress={() => setHasDigigo('yes')}
                  >
                    <View style={styles.radioOuter}>
                      {hasDigigo === 'yes' && <View style={styles.radioInner} />}
                    </View>
                    <Text style={styles.radioLabel}>Oui</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.radioOption}
                    onPress={() => setHasDigigo('no')}
                  >
                    <View style={styles.radioOuter}>
                      {hasDigigo === 'no' && <View style={styles.radioInner} />}
                    </View>
                    <Text style={styles.radioLabel}>Non</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Description Digigo */}
              <View style={styles.digigoInfoBox}>
                <Text style={styles.digigoInfoTitle}>Digigo</Text>
                <Text style={styles.digigoInfoText}>
                  Digigo est le service de signature électronique mis en place par l'Agence Nationale de Certification Electronique qui vous permet de signer électroniquement des documents en toute sécurité.
                </Text>
              </View>

              {/* Explications */}
              <View style={styles.explanationContainer}>
                <View style={styles.explanationItem}>
                  <View style={styles.explanationIcon}>
                    <Text style={styles.explanationIconText}>✓</Text>
                  </View>
                  <Text style={styles.explanationText}>
                    En choisissant "Oui", vous pourrez saisir vos identifiants Digigo pour signer vos documents dans les étapes à suivre et finaliser la démarche 100% en ligne.
                  </Text>
                </View>

                <View style={styles.explanationItem}>
                  <View style={styles.explanationIcon}>
                    <Text style={styles.explanationIconText}>✗</Text>
                  </View>
                  <Text style={styles.explanationText}>
                    En choisissant "Non", votre demande sera envoyée à la banque et vous serez invité(e) à vous présenter à l'agence déjà sélectionnée pour finaliser la démarche de souscription.
                  </Text>
                </View>
              </View>

              {/* Acceptation des termes */}
              <TouchableOpacity
                style={styles.termsContainer}
                onPress={() => setTermsAccepted(!termsAccepted)}
              >
                <View style={styles.checkboxContainer}>
                  <Checkbox.Android
                    status={termsAccepted ? 'checked' : 'unchecked'}
                    onPress={() => setTermsAccepted(!termsAccepted)}
                    color={colors.atb.red}
                  />
                </View>
                <Text style={styles.termsText}>
                  J'accepte les{' '}
                  <Text style={styles.termsLink}>Termes et Conditions</Text>
                  {' '}et la{' '}
                  <Text style={styles.termsLink}>Politique de Confidentialité</Text>
                </Text>
              </TouchableOpacity>
            </View>

            {/* Boutons d'action */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={handleSaveAndExit}
                style={styles.saveButton}
              >
                <Text style={styles.saveButtonText}>Enregistrer et quitter</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleSubmit}
                style={[
                  styles.submitButton,
                  !termsAccepted && styles.submitButtonDisabled
                ]}
                disabled={!termsAccepted}
              >
                <LinearGradient
                  colors={termsAccepted ? [colors.atb.red, colors.atb.red] : 
                          [colors.neutral.gray400, colors.neutral.gray400]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.submitGradient}
                >
                  <Text style={styles.submitButtonText}>Soumettre</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

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
    paddingBottom: 20,
  },
  content: {
    padding: 24,
  },

  // Styles pour PhaseIndicator
  phaseIndicatorWrapper: { marginTop: 2 },
  phaseContainer: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', paddingVertical: 8 },
  phaseItem: { alignItems: 'center', flex: 1 },
  phaseRadioOuter: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: colors.neutral.gray400, alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  phaseRadioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: 'transparent' },
  phaseRadioInnerActive: { backgroundColor: colors.atb.red },
  phaseRadioActive: { borderColor: colors.atb.red },
  phaseRadioCompleted: { borderColor: colors.atb.red, backgroundColor: colors.atb.red },
  phaseRadioCheck: { fontSize: 12, color: colors.neutral.white, fontWeight: 'bold' },
  phaseLabel: { fontSize: 10, color: colors.neutral.gray600, fontWeight: '500', textAlign: 'center' },
  phaseLabelActive: { color: colors.atb.red, fontWeight: '700' },
  phaseLabelCompleted: { color: colors.neutral.gray800, fontWeight: '600' },
  phaseConnector: { width: 20, height: 2, backgroundColor: colors.neutral.gray300, alignSelf: 'center', marginTop: -10 },

  titleSection: {
    marginBottom: 12,
  },
  // pageNumber SUPPRIMÉ
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
    marginBottom: 12,
  },
  // progressContainer SUPPRIMÉ
  // progressBarBackground SUPPRIMÉ
  // progressBarFill SUPPRIMÉ
  // progressText SUPPRIMÉ
  
  card: {
    backgroundColor: colors.neutral.white,
    borderRadius: 12,
    marginBottom: 20,
    paddingVertical: 24,
    paddingHorizontal: 20,
    shadowColor: colors.neutral.gray900,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.beige,
  },
  sectionNumber: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  sectionNumberText: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.neutral.white,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.neutral.gray900,
    letterSpacing: 0.1,
    flex: 1,
    lineHeight: 24,
  },
  sectionDescription: {
    fontSize: 14,
    color: colors.neutral.gray700,
    lineHeight: 20,
    marginBottom: 24,
    backgroundColor: colors.neutral.offWhite,
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: colors.atb.red,
  },
  digigoChoiceContainer: {
    marginBottom: 24,
  },
  digigoQuestion: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.neutral.gray800,
    marginBottom: 16,
  },
  radioButtonsContainer: {
    flexDirection: 'row',
    gap: 32,
    alignContent: 'center',
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.neutral.gray400,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.atb.red,
  },
  radioLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.neutral.gray800,
  },
  digigoInfoBox: {
    backgroundColor: colors.neutral.offWhite,
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.neutral.beige,
  },
  digigoInfoTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.atb.red,
    marginBottom: 8,
  },
  digigoInfoText: {
    fontSize: 14,
    color: colors.neutral.gray700,
    lineHeight: 20,
  },
  explanationContainer: {
    marginBottom: 24,
  },
  explanationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  explanationIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.atb.red + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  explanationIconText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.atb.red,
  },
  explanationText: {
    flex: 1,
    fontSize: 14,
    color: colors.neutral.gray700,
    lineHeight: 20,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: colors.neutral.beige,
  },
  checkboxContainer: {
    marginRight: 12,
    marginTop: 2,
  },
  termsText: {
    flex: 1,
    fontSize: 14,
    color: colors.neutral.gray700,
    lineHeight: 20,
  },
  termsLink: {
    color: colors.atb.red,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  saveButton: {
    flex: 1,
    height: 52,
    backgroundColor: colors.neutral.white,
    borderWidth: 1.5,
    borderColor: colors.neutral.gray300,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.neutral.gray700,
  },
  submitButton: {
    flex: 1,
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
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    paddingHorizontal: 24,
  },
  submitButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.neutral.white,
  },
  footer: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 8,
  },
  footerDivider: {
    width: 50,
    height: 2,
    backgroundColor: colors.neutral.gray300,
    borderRadius: 1,
    marginBottom: 12,
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
  // Styles pour les étapes (gardés pour référence)
  stepsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  stepContainer: {
    alignItems: 'center',
    flex: 1,
  },
  stepCircleContainer: {
    marginBottom: 8,
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  currentStepCircle: {
    shadowColor: colors.atb.red,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.neutral.white,
  },
  completedStepNumber: {
    fontSize: 16,
  },
  currentStepNumber: {
    fontSize: 14,
  },
  stepTitle: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.neutral.gray500,
    textAlign: 'center',
    marginTop: 4,
  },
  currentStepTitle: {
    color: colors.atb.red,
    fontWeight: '700',
  },
  completedStepTitle: {
    color: colors.status.success,
  },
});

export default DigigoScreen;