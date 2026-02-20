// ============================================================
//  frontend/screens/FATCAScreen.tsx
//  DÉCLARATION FATCA — VERSION FINALE RÉORGANISÉE
// ============================================================

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Image,
  StatusBar,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../constants/colors';
import { NavigationProp, RouteProp } from '../types/navigation';
import { saveFatca } from '../services/customerApi';

// ============================================================
//  TYPES & CONSTANTES
// ============================================================

type Props = {
  navigation: NavigationProp<'FATCA'>;
  route: RouteProp<'FATCA'>;
};

interface FATCAQuestion {
  id: string;
  question: string;
  value: boolean | null;
  category: string;
}

const QUESTIONS: FATCAQuestion[] = [
  { id: '1', question: 'Vous êtes un citoyen américain', value: null, category: 'Identification' },
  { id: '2', question: 'Êtes-vous résident aux États-Unis ?', value: null, category: 'Identification' },
  { id: '3', question: 'Possédez-vous la Green Card américaine ?', value: null, category: 'Statut légal' },
  { id: '4', question: 'Êtes-vous un contribuable américain ?', value: null, category: 'Fiscalité' },
  { id: '5', question: 'Émettez-vous des transferts permanents à destination des États-Unis ?', value: null, category: 'Opérations financières' },
  { id: '6', question: 'Avez-vous un numéro de téléphone américain ?', value: null, category: 'Coordonnées' },
  { id: '7', question: 'Avez-vous mis en place une procuration pour une personne ayant une adresse aux États-Unis ?', value: null, category: 'Représentation' },
  { id: '8', question: 'Êtes-vous ou un de vos proches/associés politiquement exposé(e) ?', value: null, category: 'Conformité PEP' },
];

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

const TitleSection: React.FC<{ answeredCount: number; totalQuestions: number }> = ({ answeredCount, totalQuestions }) => (
  <View style={styles.titleSection}>
    <View style={styles.titleHeader}>
      <View>
        <Text style={styles.title}>Déclaration FATCA</Text>
        <Text style={styles.subtitle}>Formulaire de conformité réglementaire</Text>
      </View>
      <View style={styles.progressIndicator}>
        <Text style={styles.progressText}>{answeredCount}/{totalQuestions}</Text>
      </View>
    </View>
  </View>
);

const IntroCard: React.FC = () => (
  <View style={[styles.card, styles.introCard]}>
    <View style={styles.introHeader}>
      <LinearGradient colors={[colors.atb.red, colors.atb.red]} style={styles.introIconContainer}>
        <Ionicons name="information-circle" size={20} color={colors.neutral.white} />
      </LinearGradient>
      <View>
        <Text style={styles.introTitle}>À propos du FATCA</Text>
        <Text style={styles.introSubtitle}>Foreign Account Tax Compliance Act</Text>
      </View>
    </View>
    <Text style={styles.introText}>
      Cette déclaration est obligatoire pour identifier les personnes ayant des liens avec
      les États-Unis conformément à la réglementation américaine de transparence fiscale.
    </Text>
  </View>
);

const SummaryCard: React.FC<{
  answeredCount: number;
  totalQuestions: number;
  yesCount: number;
  noCount: number;
  pendingCount: number;
  allQuestionsAnswered: boolean;
}> = ({ answeredCount, totalQuestions, yesCount, noCount, pendingCount, allQuestionsAnswered }) => (
  <View style={[styles.card, styles.summaryCard]}>
    <View style={styles.summaryHeader}>
      <View style={styles.summaryTitleContainer}>
        <Ionicons name="stats-chart" size={18} color={colors.atb.red} />
        <Text style={styles.summaryTitle}>Synthèse</Text>
      </View>
      <View style={styles.summaryProgress}>
        <Text style={styles.summaryProgressText}>{answeredCount}/{totalQuestions}</Text>
      </View>
    </View>

    <View style={styles.summaryCompact}>
      {[
        { label: 'Oui', count: yesCount, dotStyle: styles.summaryDotYes },
        { label: 'Non', count: noCount, dotStyle: styles.summaryDotNo },
        { label: 'En attente', count: pendingCount, dotStyle: styles.summaryDotPending, valueStyle: styles.summaryItemValuePending },
      ].map(({ label, count, dotStyle, valueStyle }) => (
        <View key={label} style={styles.summaryItemCompact}>
          <View style={styles.summaryItemHeader}>
            <View style={[styles.summaryDot, dotStyle]} />
            <Text style={styles.summaryItemLabel}>{label}</Text>
          </View>
          <Text style={[styles.summaryItemValue, valueStyle]}>{count}</Text>
        </View>
      ))}
    </View>

    {/* Badge statut */}
    {yesCount > 0 ? (
      <View style={[styles.statusBadge, styles.statusBadgeWarning]}>
        <Ionicons name="warning" size={14} color={colors.status.warning} />
        <Text style={styles.statusBadgeText}>
          {yesCount} réponse(s) nécessite(nt) vérification
        </Text>
      </View>
    ) : !allQuestionsAnswered ? (
      <View style={[styles.statusBadge, styles.statusBadgeInfo]}>
        <Ionicons name="time" size={14} color={colors.status.info} />
        <Text style={styles.statusBadgeText}>
          Veuillez répondre à toutes les questions.
        </Text>
      </View>
    ) : (
      <View style={[styles.statusBadge, styles.statusBadgeSuccess]}>
        <Ionicons name="checkmark-circle" size={14} color={colors.status.success} />
        <Text style={styles.statusBadgeText}>Formulaire complet</Text>
      </View>
    )}
  </View>
);

const Footer: React.FC = () => (
  <View style={styles.footer}>
    <View style={styles.footerLegal}>
      <Ionicons name="shield" size={12} color={colors.neutral.gray400} />
      <Text style={styles.footerLegalText}> CONFIDENTIEL</Text>
      <Text style={styles.footerDivider}> • </Text>
      <Ionicons name="lock-closed" size={12} color={colors.neutral.gray400} />
      <Text style={styles.footerLegalText}> SÉCURISÉ</Text>
    </View>
    <Text style={styles.footerText}>© 2026 Arab Tunisian Bank · Tous droits réservés</Text>
    <Text style={styles.footerSubtext}>Service client : 71 143 000</Text>
  </View>
);

// ============================================================
//  COMPOSANT PRINCIPAL
// ============================================================

const FATCAScreen: React.FC<Props> = ({ navigation, route }) => {
  const { customerId } = route.params;
  const [isLoading, setIsLoading] = useState(false);
  const [questions, setQuestions] = useState<FATCAQuestion[]>(QUESTIONS);

  // ── Calculs dérivés ────────────────────────────────────────
  const questionsByCategory = questions.reduce((acc, q) => {
    if (!acc[q.category]) acc[q.category] = [];
    acc[q.category].push(q);
    return acc;
  }, {} as Record<string, FATCAQuestion[]>);

  const categories = Object.keys(questionsByCategory);
  const allQuestionsAnswered = questions.every(q => q.value !== null);
  const answeredCount = questions.filter(q => q.value !== null).length;
  const yesCount = questions.filter(q => q.value === true).length;
  const noCount = questions.filter(q => q.value === false).length;
  const pendingCount = questions.length - answeredCount;

  // ── Handlers ─────────────────────────────────────────────
  const handleAnswer = (questionId: string, answer: boolean) => {
    setQuestions(prev =>
      prev.map(q => (q.id === questionId ? { ...q, value: answer } : q))
    );
  };

  const handleContinue = async () => {
    if (!allQuestionsAnswered) return;

    setIsLoading(true);
    try {
      await saveFatca(customerId, {
        isUsCitizen: questions.find(q => q.id === '1')?.value ?? false,
        isUsResident: questions.find(q => q.id === '2')?.value ?? false,
        hasGreenCard: questions.find(q => q.id === '3')?.value ?? false,
        isUsTaxpayer: questions.find(q => q.id === '4')?.value ?? false,
        hasUsTransfers: questions.find(q => q.id === '5')?.value ?? false,
        hasUsPhone: questions.find(q => q.id === '6')?.value ?? false,
        hasUsProxy: questions.find(q => q.id === '7')?.value ?? false,
        isPoliticallyExposed: questions.find(q => q.id === '8')?.value ?? false,
      });
      // @ts-ignore
      navigation.navigate('DocumentsJustificatif', { customerId });
    } catch (error: any) {
      Alert.alert('Erreur', error.message || 'Erreur lors de la sauvegarde FATCA.');
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================================
  //  RENDU
  // ============================================================
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.neutral.gray100} />

      {/* Header */}
      <Header />

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
        <ScrollView style={styles.flex} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>

            {/* Titre */}
            <TitleSection answeredCount={answeredCount} totalQuestions={questions.length} />

            {/* Introduction */}
            <IntroCard />

            {/* Questions par catégorie */}
            <View style={styles.formContainer}>
              {categories.map((category, catIndex) => (
                <View key={category} style={styles.categorySection}>
                  {/* En-tête catégorie */}
                  <View style={styles.categoryHeader}>
                    <View style={styles.categoryHeaderLeft}>
                      <LinearGradient colors={[colors.atb.red, colors.atb.red]} style={styles.categoryNumber}>
                        <Text style={styles.categoryNumberText}>{catIndex + 1}</Text>
                      </LinearGradient>
                      <Text style={styles.categoryTitle}>{category}</Text>
                    </View>
                    <View style={styles.categoryStats}>
                      <Text style={styles.categoryStatsText}>
                        {questionsByCategory[category].filter(q => q.value !== null).length}/
                        {questionsByCategory[category].length}
                      </Text>
                    </View>
                  </View>

                  {/* Liste de questions */}
                  <View style={styles.questionsList}>
                    {questionsByCategory[category].map((question, qIndex) => (
                      <View
                        key={question.id}
                        style={[
                          styles.questionItem,
                          qIndex === questionsByCategory[category].length - 1 && { borderBottomWidth: 0 },
                        ]}
                      >
                        <View style={styles.questionContent}>
                          <View style={styles.questionNumberContainer}>
                            <Text style={styles.questionNumber}>{qIndex + 1}</Text>
                          </View>
                          <Text style={styles.questionText}>{question.question}</Text>
                        </View>

                        <View style={styles.answerContainer}>
                          {/* Non */}
                          <TouchableOpacity
                            style={styles.radioButton}
                            onPress={() => handleAnswer(question.id, false)}
                            activeOpacity={0.7}
                          >
                            <View style={styles.radioOuter}>
                              <View style={[styles.radioInner, question.value === false && styles.radioInnerSelected]}>
                                {question.value === false && <View style={styles.radioDot} />}
                              </View>
                            </View>
                            <Text style={[styles.radioLabel, question.value === false && styles.radioLabelSelected]}>
                              Non
                            </Text>
                          </TouchableOpacity>

                          {/* Oui */}
                          <TouchableOpacity
                            style={styles.radioButton}
                            onPress={() => handleAnswer(question.id, true)}
                            activeOpacity={0.7}
                          >
                            <View style={styles.radioOuter}>
                              <View style={[styles.radioInner, question.value === true && styles.radioInnerSelected]}>
                                {question.value === true && <View style={styles.radioDot} />}
                              </View>
                            </View>
                            <Text style={[styles.radioLabel, question.value === true && styles.radioLabelSelected]}>
                              Oui
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    ))}
                  </View>
                </View>
              ))}
            </View>

            {/* Synthèse */}
            <SummaryCard
              answeredCount={answeredCount}
              totalQuestions={questions.length}
              yesCount={yesCount}
              noCount={noCount}
              pendingCount={pendingCount}
              allQuestionsAnswered={allQuestionsAnswered}
            />

            {/* Boutons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Ionicons name="arrow-back" size={18} color={colors.neutral.gray700} />
                <Text style={styles.backButtonText}>Retour</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleContinue}
                style={styles.continueButton}
                disabled={!allQuestionsAnswered || isLoading}
              >
                <LinearGradient
                  colors={allQuestionsAnswered && !isLoading
                    ? [colors.atb.red, colors.atb.red]
                    : [colors.neutral.gray300, colors.neutral.gray400]}
                  style={styles.continueGradient}
                >
                  <Ionicons name="document-text" size={18} color={colors.neutral.white} />
                  <Text style={styles.continueButtonText}>
                    {isLoading ? 'Envoi...' : allQuestionsAnswered ? 'Soumettre et continuer' : 'Continuer'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {/* Footer */}
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

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.gray300,
    backgroundColor: colors.neutral.gray100
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  logoContainer: {
    shadowColor: colors.atb.red,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6
  },
  logo: { width: 40, height: 40 },
  logoGradient: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center'
  },
  bankName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.atb.red,
    letterSpacing: 0.3
  },
  bankSubtitle: {
    fontSize: 11,
    color: colors.neutral.gray500,
    marginTop: 2,
    fontWeight: '500'
  },
  digipackBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center'
  },
  digipackText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.neutral.white,
    letterSpacing: 2
  },

  scrollContent: { flexGrow: 1 },
  content: { padding: 24 },

  // Titre
  titleSection: { marginBottom: 4 },
  titleHeader: {
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.neutral.gray900,
    marginBottom: 6,
    letterSpacing: -0.3
  },
  subtitle: {
    fontSize: 13,
    color: colors.neutral.gray600,
    fontWeight: '400',
    lineHeight: 19
  },
  progressIndicator: {
    backgroundColor: colors.neutral.beige,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.atb.red
  },

  // Cards
  card: {
    backgroundColor: colors.neutral.white,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: colors.neutral.gray900,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2
  },
  introCard: { padding: 20, marginBottom: 15 },
  introHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16
  },
  introIconContainer: {
    width: 25,
    height: 28,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12
  },
  introTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.neutral.gray900,
    marginBottom: 2
  },
  introSubtitle: {
    fontSize: 12,
    color: colors.neutral.gray500,
    fontWeight: '500'
  },
  introText: {
    fontSize: 13,
    color: colors.neutral.gray700,
    lineHeight: 20,
    fontWeight: '400'
  },

  formContainer: { gap: 16 },
  categorySection: { marginBottom: 5 },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 4
  },
  categoryHeaderLeft: { flexDirection: 'row', alignItems: 'center' },
  categoryNumber: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10
  },
  categoryNumberText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.neutral.white
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.neutral.gray900
  },
  categoryStats: {
    backgroundColor: colors.neutral.beige,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10
  },
  categoryStatsText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.neutral.gray700
  },

  questionsList: {
    backgroundColor: colors.neutral.white,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: colors.neutral.gray200
  },
  questionItem: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.gray100,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  questionContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
    marginRight: 16
  },
  questionNumberContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.neutral.gray100,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12
  },
  questionNumber: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.neutral.gray600
  },
  questionText: {
    flex: 1,
    fontSize: 14,
    color: colors.neutral.gray800,
    fontWeight: '500',
    lineHeight: 20
  },
  answerContainer: {
    flexDirection: 'row',
    gap: 20,
    alignItems: 'center'
  },

  radioButton: { flexDirection: 'row', alignItems: 'center' },
  radioOuter: { marginRight: 8 },
  radioInner: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.neutral.gray400,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.neutral.white
  },
  radioInnerSelected: { borderColor: colors.atb.red },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.atb.red
  },
  radioLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.neutral.gray700
  },
  radioLabelSelected: {
    color: colors.atb.red,
    fontWeight: '600'
  },

  // Summary Card
  summaryCard: { padding: 16, marginBottom: 24 },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  summaryTitleContainer: { flexDirection: 'row', alignItems: 'center' },
  summaryTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.neutral.gray900,
    marginLeft: 8
  },
  summaryProgress: {
    backgroundColor: colors.neutral.beige,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12
  },
  summaryProgressText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.atb.red
  },
  summaryCompact: { marginBottom: 16 },
  summaryItemCompact: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.gray100
  },
  summaryItemHeader: { flexDirection: 'row', alignItems: 'center' },
  summaryDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10
  },
  summaryDotYes: { backgroundColor: colors.atb.red },
  summaryDotNo: { backgroundColor: colors.neutral.gray400 },
  summaryDotPending: { backgroundColor: colors.neutral.gray300 },
  summaryItemLabel: {
    fontSize: 13,
    color: colors.neutral.gray700,
    fontWeight: '500'
  },
  summaryItemValue: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.atb.red
  },
  summaryItemValuePending: { color: colors.neutral.gray500 },

  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8
  },
  statusBadgeWarning: { backgroundColor: colors.status.warningLight },
  statusBadgeInfo: { backgroundColor: colors.status.infoLight },
  statusBadgeSuccess: { backgroundColor: colors.status.successLight },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 6,
    color: colors.neutral.gray700
  },

  // Boutons
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32
  },
  backButton: {
    flex: 1,
    height: 52,
    backgroundColor: colors.neutral.white,
    borderWidth: 1.5,
    borderColor: colors.neutral.gray300,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.neutral.gray700,
    marginLeft: 8
  },
  continueButton: {
    flex: 1,
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: colors.atb.red,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4
  },
  continueGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    paddingHorizontal: 24
  },
  continueButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.neutral.white,
    marginLeft: 8
  },

  // Footer
  footer: {
    alignItems: 'center',
    paddingTop: 20
  },
  footerLegal: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12
  },
  footerLegalText: {
    fontSize: 10,
    color: colors.neutral.gray400,
    fontWeight: '600',
    letterSpacing: 0.5
  },
  footerDivider: {
    fontSize: 10,
    color: colors.neutral.gray400
  },
  footerText: {
    fontSize: 11,
    color: colors.neutral.gray500,
    fontWeight: '500',
    marginBottom: 4
  },
  footerSubtext: {
    fontSize: 10,
    color: colors.neutral.gray400,
    fontWeight: '400'
  },
});

export default FATCAScreen;