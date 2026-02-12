import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Animated,
  ScrollView,
  Image,
  ImageBackground,
  Modal,
  Linking,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { 
  MaterialIcons, 
  FontAwesome5, 
  Ionicons,
  Feather,
  AntDesign,
  Entypo,
  FontAwesome
} from '@expo/vector-icons';
import colors from '../../constants/colors';

const { width, height } = Dimensions.get('window');

const OnboardingHomeScreen = () => {
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideUpAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const [contactModalVisible, setContactModalVisible] = useState(false);
  const modalSlideAnim = useRef(new Animated.Value(height)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideUpAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 60,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleGetStarted = () => {
    // @ts-ignore
    navigation.navigate('Home');
  };

  const openContactModal = () => {
    setContactModalVisible(true);
    Animated.spring(modalSlideAnim, {
      toValue: 0,
      tension: 80,
      friction: 10,
      useNativeDriver: true,
    }).start();
  };

  const closeContactModal = () => {
    Animated.timing(modalSlideAnim, {
      toValue: height,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      setContactModalVisible(false);
    });
  };

  const handleCall = (phoneNumber: string) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleEmail = () => {
    Linking.openURL('mailto:contact@atb.com.tn');
  };

  const handleWebsite = () => {
    Linking.openURL('https://www.atb.com.tn');
  };
  const advantages: Array<{icon: string, text: string}> = [
    { icon: 'rocket-launch', text: 'Ouverture de compte 100% en ligne' },
    { icon: 'credit-card', text: 'Carte virtuelle gratuite immédiatement' },
    { icon: 'support-agent', text: 'Conseillers disponibles 24/7' },
  ];
  
  const bankFeatures = [
    {
      icon: 'account-balance',
      title: 'Compte Courant',
      description: 'Gérez vos finances quotidiennes',
      color: colors.atb.primary,
    },
    {
      icon: 'savings',
      title: 'Épargne',
      description: 'Faites fructifier votre argent',
      color: colors.status.success,
    },
    {
      icon: 'credit-card',
      title: 'Carte Bancaire',
      description: 'Visa/Mastercard à portée mondiale',
      color: colors.atb.accent,
    },
    {
      icon: 'payments',
      title: 'Paiements',
      description: 'Virements instantanés 24/7',
      color: colors.status.info,
    },
  ];

  const contactData = {
    customerService: "+216 70 026 267",
    email: "contact@atb.com.tn",
    website: "www.atb.com.tn",
  };

  return (
    <SafeAreaView style={styles.container}>
       <StatusBar barStyle="dark-content" backgroundColor={colors.neutral.gray100} />
      
      {/* Header Professionnel */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.logoContainer}>
            <LinearGradient
              colors={[colors.atb.primary, colors.atb.red]}
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
        <TouchableOpacity 
          style={styles.ContactButton} 
          onPress={openContactModal}
        >
          <Text style={styles.ContactText}>Contact</Text>
          <Feather name="chevron-right" size={16} color={colors.neutral.gray600} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero Section */}
        <Animated.View 
          style={[
            styles.heroSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideUpAnim }, { scale: scaleAnim }],
            },
          ]}
        >
          <View style={styles.heroCard}>
            <LinearGradient
              colors={['#FFFFFF', '#f5f2f2']}
              style={styles.heroCardGradient}
            >
              <Text style={styles.heroTitle}>
                Bienvenue à la Banque{' '}
                <Text style={styles.heroTitleHighlight}>Digitale</Text>
              </Text>

              <Text style={styles.heroSubtitle}>
                Un compte bancaire complet, sans agence physique. 
                Géré depuis votre mobile avec la sécurité d'une banque établie.
              </Text>

              <View style={styles.statsRow}>
                <View style={styles.stat}>
                  <Text style={styles.statNumber}>1982</Text>
                  <Text style={styles.statLabel}>Fondation</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.stat}>
                  <Text style={styles.statNumber}>80+</Text>
                  <Text style={styles.statLabel}>Agences</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.stat}>
                  <Text style={styles.statNumber}>2.5K+</Text>
                  <Text style={styles.statLabel}>Employés</Text>
                </View>
              </View>
            </LinearGradient>
          </View>
        </Animated.View>

        {/* 🖼 IMAGE BAND */}
        <View style={styles.imageSection}>
          <ImageBackground
            source={require('../assets/Employee.jpg')}
            style={styles.imageBg}
            imageStyle={{ borderRadius: 24 }}
          >
            <LinearGradient
              colors={['rgba(0,0,0,0.25)', 'rgba(0,0,0,0.6)']}
              style={styles.imageOverlay}
            >
              <Text style={styles.imageText}>
                Votre banque, partout. À tout moment.
              </Text>
            </LinearGradient>
          </ImageBackground>
        </View>

        {/* ✅ AVANTAGES */}
        <View style={styles.section}>
          <Text style={styles.sectionTitleLarge}>Pourquoi choisir ATB Digital ?</Text>

          <View style={styles.QuestionCard}>
            {advantages.map((item, index) => (
              <View key={index} style={styles.securityItem}>
                <View style={styles.securityIcon}>
                  <MaterialIcons name={item.icon as any} size={22} color={colors.atb.red} />
                </View>
                <Text style={styles.securityText}>{item.text}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Features Grid */}
        <View style={styles.section}>
          <Text style={styles.sectionTitleLarge}>Une banque complète dans votre poche</Text>
          <Text style={styles.sectionSubtitle}>
            Tous les services d'une grande banque, optimisés pour le mobile
          </Text>
          
          <View style={styles.featuresGrid}>
            {bankFeatures.map((feature, index) => (
              <View key={index} style={styles.featureCard}>
                <View style={[styles.featureIconContainer, { backgroundColor: `${feature.color}15` }]}>
                  <MaterialIcons name={feature.icon as any} size={20} color={feature.color} />
                </View>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>{feature.description}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Process Section */}
        <View style={styles.section}>
          <View style={styles.processCard}>
            <Text style={styles.processTitle}>Ouvrez votre compte en 3 étapes</Text>
            
            <View style={styles.processSteps}>
              <View style={styles.processStep}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>1</Text>
                </View>
                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>Vérifiez votre identité</Text>
                  <Text style={styles.stepDescription}>
                    Utilisez E-Houwiya ou votre carte d'identité
                  </Text>
                </View>
              </View>
              
              <View style={styles.processStep}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>2</Text>
                </View>
                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>Configurez votre compte</Text>
                  <Text style={styles.stepDescription}>
                    Choisissez vos services et préférences
                  </Text>
                </View>
              </View>
              
              <View style={styles.processStep}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>3</Text>
                </View>
                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>Activez et commencez</Text>
                  <Text style={styles.stepDescription}>
                    Recevez vos identifiants immédiatement
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* 🆕 CTA Section Élégante */}
        <View style={styles.section}>
          <View style={styles.ctaElegantCard}>
            <LinearGradient
              colors={['rgba(139, 21, 56, 0.05)', 'rgba(139, 21, 56, 0.02)']}
              style={styles.ctaElegantGradient}
            >
              <View style={styles.ctaElegantHeader}>
                <View style={styles.ctaIconCircle}>
                  <MaterialIcons name="account-balance-wallet" size={28} color={colors.atb.red} />
                </View>
                <Text style={styles.ctaElegantTitle}>
                  Votre nouvelle expérience bancaire commence ici
                </Text>
              </View>
              
              <Text style={styles.ctaElegantDescription}>
                Rejoignez la communauté ATB Digital et bénéficiez d'une banque moderne, sécurisée et adaptée à votre rythme de vie.
              </Text>
              
              <View style={styles.ctaBenefitsGrid}>
                <View style={styles.ctaBenefit}>
                  <View style={[styles.ctaBenefitIcon, { backgroundColor: colors.status.success + '20' }]}>
                    <Feather name="zap" size={16} color={colors.status.success} />
                  </View>
                  <Text style={styles.ctaBenefitText}>Rapide</Text>
                </View>
                
                <View style={styles.ctaBenefit}>
                  <View style={[styles.ctaBenefitIcon, { backgroundColor: colors.atb.red + '20' }]}>
                    <Feather name="shield" size={16} color={colors.atb.red} />
                  </View>
                  <Text style={styles.ctaBenefitText}>Sécurisé</Text>
                </View>
                
                <View style={styles.ctaBenefit}>
                  <View style={[styles.ctaBenefitIcon, { backgroundColor: colors.atb.accent + '20' }]}>
                    <Text style={{ fontSize: 16, color: colors.atb.accent, fontWeight: 'bold' }}>DT</Text>
                  </View>
                  <Text style={styles.ctaBenefitText}>Économique</Text>
                </View>
              </View>
              
              <TouchableOpacity 
                style={styles.ctaElegantButton}
                activeOpacity={0.9}
                onPress={handleGetStarted}
              >
                <LinearGradient
                  colors={[colors.atb.red, colors.atb.red]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.ctaElegantButtonGradient}
                >
                  <MaterialIcons name="account-circle" size={20} color={colors.neutral.white} />
                  <Text style={styles.ctaElegantButtonText}>Commencer maintenant!</Text>
                  <Entypo name="chevron-right" size={20} color={colors.neutral.white} />
                </LinearGradient>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </View>

        {/* Regulatory Info */}
        <View style={styles.regulatorySection}>
          <View style={styles.regulatoryRow}>
            <MaterialIcons name="verified-user" size={16} color={colors.status.success} />
            <Text style={styles.regulatoryText}>
              Agréé et régulé par la Banque Centrale de Tunisie
            </Text>
          </View>
          <View style={styles.regulatoryRow}>
            <MaterialIcons name="account-balance" size={16} color={colors.status.success} />
            <Text style={styles.regulatoryText}>
              Membre du Fonds de Garantie des Dépôts Bancaires
            </Text>
          </View>
          <View style={styles.regulatoryRow}>
            <MaterialIcons name="shield" size={16} color={colors.status.success} />
            <Text style={styles.regulatoryText}>
              Conformité et réglementations bancaires internationales
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerTitle}>Télécharger l'application ATB Mobile</Text>
          <View style={styles.storeButtons}>
            <TouchableOpacity 
              style={styles.storeButton}
              onPress={() => Linking.openURL('https://apps.apple.com/fr/app/connect/id6756798670')} 
            >
              <FontAwesome name="apple" size={20} color={colors.neutral.white} />
              <View style={styles.storeButtonTextContainer}>
                <Text style={styles.storeButtonSmallText}>Télécharger sur</Text>
                <Text style={styles.storeButtonText}>App Store</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.storeButton}
              onPress={() => Linking.openURL('https://play.google.com/store/apps/details?id=com.atb.atbconnect')} 
            >
              <FontAwesome5 name="google-play" size={18} color={colors.neutral.white} />
              <View style={styles.storeButtonTextContainer}>
                <Text style={styles.storeButtonSmallText}>Disponible sur</Text>
                <Text style={styles.storeButtonText}>Google Play</Text>
              </View>
            </TouchableOpacity>
          </View>
          
          <Text style={styles.footerCopyright}>© 2026 Arab Tunisian Bank. Tous droits réservés.</Text>
        </View>
      </ScrollView>

  
      <Modal
        animationType="none"
        transparent={true}
        visible={contactModalVisible}
        onRequestClose={closeContactModal}
      >
        <View style={styles.modalOverlay}>
          <Animated.View 
            style={[
              styles.modalContainer,
              {
                transform: [{ translateY: modalSlideAnim }],
              }
            ]}
          >
            {/* Header minimaliste */}
            <View style={styles.modalHeader}>
              <View style={styles.modalTitleWrapper}>
                <Feather name="phone-call" size={20} color={colors.atb.red} />
                <Text style={styles.modalTitle}>Contact</Text>
              </View>
              <TouchableOpacity 
                onPress={closeContactModal}
                style={styles.closeButton}
              >
                <Feather name="x" size={22} color={colors.neutral.gray600} />
              </TouchableOpacity>
            </View>

            {/* Ligne de séparation fine */}
            <View style={styles.divider} />

            {/* Message introductif */}
            <View style={styles.modalIntro}>
              <Text style={styles.modalIntroText}>
                Notre équipe est à votre écoute pour vous accompagner
              </Text>
            </View>

            {/* Options de contact minimalistes */}
            <View style={styles.contactOptions}>
              {/* Téléphone */}
              <TouchableOpacity 
                style={styles.contactOption}
                onPress={() => handleCall(contactData.customerService)}
                activeOpacity={0.7}
              >
                <View style={styles.optionIconContainer}>
                  <Feather name="phone" size={20} color={colors.atb.red} />
                </View>
                <View style={styles.optionContent}>
                  <Text style={styles.optionTitle}>Service Client</Text>
                  <Text style={styles.optionValue}>{contactData.customerService}</Text>
                </View>
                <Feather name="chevron-right" size={18} color={colors.neutral.gray400} />
              </TouchableOpacity>

              {/* Email */}
              <TouchableOpacity 
                style={styles.contactOption}
                onPress={handleEmail}
                activeOpacity={0.7}
              >
                <View style={styles.optionIconContainer}>
                  <Feather name="mail" size={20} color={colors.atb.red} />
                </View>
                <View style={styles.optionContent}>
                  <Text style={styles.optionTitle}>Email</Text>
                  <Text style={styles.optionValue}>{contactData.email}</Text>
                </View>
                <Feather name="chevron-right" size={18} color={colors.neutral.gray400} />
              </TouchableOpacity>

              {/* Site Web */}
              <TouchableOpacity 
                style={styles.contactOption}
                onPress={handleWebsite}
                activeOpacity={0.7}
              >
                <View style={styles.optionIconContainer}>
                  <Feather name="globe" size={20} color={colors.atb.red} />
                </View>
                <View style={styles.optionContent}>
                  <Text style={styles.optionTitle}>Site Web</Text>
                  <Text style={styles.optionValue}>{contactData.website}</Text>
                </View>
                <Feather name="chevron-right" size={18} color={colors.neutral.gray400} />
              </TouchableOpacity>
            </View>

            {/* Section disponibilité discrète */}
            <View style={styles.availabilitySection}>
              <Text style={styles.availabilityTitle}>Disponible 7h/24</Text>
              <Text style={styles.availabilitySubtitle}>
                Service client dédié • Réponse sous 24h
              </Text>
            </View>

            {/* Bouton d'action principal */}
            <TouchableOpacity 
              style={styles.primaryAction}
              onPress={() => handleCall(contactData.customerService)}
              activeOpacity={0.8}
            >
              <Feather name="phone-forwarded" size={18} color={colors.neutral.white} />
              <Text style={styles.primaryActionText}>Appeler maintenant</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
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
  ContactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  ContactText: {
    fontSize: 14,
    color: colors.atb.red,
    fontWeight: '500',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  heroSection: {
    paddingHorizontal: 24,
    paddingTop: 4,
    paddingBottom: 10,
  },
  heroCard: {
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: colors.neutral.black,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 8,
  },
  heroCardGradient: {
    padding: 30,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '300',
    color: colors.neutral.gray900,
    lineHeight: 36,
    marginBottom: 16,
    letterSpacing: 0.3,
  },
  heroTitleHighlight: {
    fontWeight: '700',
    color: colors.atb.red,
  },
  heroSubtitle: {
    fontSize: 15,
    color: colors.neutral.gray600,
    lineHeight: 24,
    marginBottom: 32,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.neutral.white,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.neutral.gray200,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.atb.red,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.neutral.gray600,
    fontWeight: '500',
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.neutral.gray200,
  },
  section: {
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  sectionTitleLarge: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.neutral.gray900,
    marginBottom: 24,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  sectionSubtitle: {
    fontSize: 15,
    color: colors.neutral.gray500,
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 22,
  },
  QuestionCard: {
    backgroundColor: colors.neutral.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.neutral.gray200,
    padding: 24,
    gap: 20,
    shadowColor: colors.neutral.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  securityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  securityIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.neutral.gray50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.neutral.gray200,
  },
  securityText: {
    fontSize: 15,
    color: colors.neutral.gray700,
    fontWeight: '500',
    flex: 1,
    lineHeight: 22,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  featureCard: {
    width: (width - 64) / 2,
    backgroundColor: colors.neutral.white,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.neutral.gray200,
    shadowColor: colors.neutral.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  featureIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.neutral.gray900,
    marginBottom: 5,
  },
  featureDescription: {
    fontSize: 13,
    color: colors.neutral.gray600,
    lineHeight: 18,
  },
  processCard: {
    backgroundColor: colors.neutral.white,
    borderRadius: 24,
    padding: 30,
    borderWidth: 1,
    borderColor: colors.neutral.gray200,
    shadowColor: colors.neutral.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  processTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.neutral.gray900,
    marginBottom: 32,
    textAlign: 'center',
  },
  processSteps: {
    gap: 25,
  },
  processStep: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  stepNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.atb.red + '15',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.atb.red + '30',
  },
  stepNumberText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.atb.red,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.neutral.gray900,
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 14,
    color: colors.neutral.gray600,
    lineHeight: 20,
  },
//
  ctaElegantCard: {
    borderRadius: 28,
    overflow: 'hidden',
    shadowColor: colors.atb.red,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 12,
  },
  ctaElegantGradient: {
    padding: 32,
  },
  ctaElegantHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  ctaIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.neutral.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    shadowColor: colors.neutral.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  ctaElegantTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: colors.atb.red,
    flex: 1,
    lineHeight: 28,
  },
  ctaElegantDescription: {
    fontSize: 16,
    color: colors.neutral.gray600,
    lineHeight: 24,
    marginBottom: 28,
    textAlign: 'center',
  },
  ctaBenefitsGrid: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    marginBottom: 32,
  },
  ctaBenefit: {
    alignItems: 'center',
    gap: 8,
  },
  ctaBenefitIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ctaBenefitText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.neutral.gray700,
  },
  ctaElegantButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
  },
  ctaElegantButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 24,
    gap: 12,
  },
  ctaElegantButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.neutral.white,
    flex: 1,
    textAlign: 'center',
  },
  regulatorySection: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    gap: 16,
  },
  regulatoryRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  regulatoryText: {
    fontSize: 13,
    color: colors.neutral.gray600,
    flex: 1,
    lineHeight: 18,
  },
  // Footer
    footer: {
      alignItems: 'center',
      paddingVertical: 20,
    },
    storeButtons: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginBottom: 24,
    },
    storeButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.neutral.black,
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 12,
      marginHorizontal: 6,
      minWidth: 130,
    },
    storeButtonTextContainer: {
      marginLeft: 10,
    },
    storeButtonSmallText: {
      fontSize: 9,
      color: colors.neutral.white,
      opacity: 0.8,
    },
    storeButtonText: {
      fontSize: 13,
      fontWeight: '600',
      color: colors.neutral.white,
    },
    footerCopyright: {
      fontSize: 12,
      color: colors.neutral.gray400,
    },
    footerTitle: {
      color: colors.neutral.black,
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 20,
      textAlign: 'center',
    },
  imageSection: {
    paddingHorizontal: 22,
    marginBottom: 30,
  },
  imageBg: {
    height: 210,
    justifyContent: 'flex-end',
    borderRadius: 24,
  },
  imageOverlay: {
    padding: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  imageText: {
    color: colors.neutral.white,
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: colors.neutral.white,
    borderTopLeftRadius: 29,
    borderTopRightRadius: 29,
    paddingBottom: 29,
    shadowColor: colors.neutral.black,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 15,
  },
  modalTitleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.neutral.gray900,
    letterSpacing: -0.3,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.neutral.gray100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: colors.neutral.gray200,
    marginHorizontal: 24,
  },
  modalIntro: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 20,
  },
  modalIntroText: {
    fontSize: 16,
    color: colors.neutral.gray600,
    lineHeight: 24,
    textAlign: 'center',
    fontFamily: 'System',
  },
  contactOptions: {
    paddingHorizontal: 24,
    marginBottom: 29,
  },
  contactOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.gray100,
  },
  optionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(139, 21, 56, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 15,
    color: colors.neutral.gray700,
    fontWeight: '500',
    marginBottom: 4,
  },
  optionValue: {
    fontSize: 16,
    color: colors.atb.red,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  availabilitySection: {
    paddingHorizontal: 24,
    marginBottom: 20,
    alignItems: 'center',
  },
  availabilityTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.neutral.gray800,
    marginBottom: 4,
  },
  availabilitySubtitle: {
    fontSize: 13,
    color: colors.neutral.gray500,
    textAlign: 'center',
  },
  primaryAction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: colors.atb.red,
    marginHorizontal: 24,
    paddingVertical: 18,
    borderRadius: 14,
    shadowColor: colors.atb.red,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryActionText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.neutral.white,
    letterSpacing: 0.3,
  },
  disclaimer: {
    fontSize: 12,
    color: colors.neutral.gray400,
    textAlign: 'center',
    marginTop: 16,
  },
});

export default OnboardingHomeScreen;