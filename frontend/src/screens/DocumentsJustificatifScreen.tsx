import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Alert,
  Image,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { AntDesign, Feather, MaterialIcons, Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import colors from '../../constants/colors';
import { NavigationProp } from '../types/navigation';

interface UploadedDocument {
  name: string;
  size: number;
  type: string;
}

type DocumentsJustificatifScreenProps = {
  navigation: NavigationProp<'DocumentsJustificatif'>;
};

const DocumentsJustificatifsScreen: React.FC<DocumentsJustificatifScreenProps> = ({ navigation }) => {
  const [cinRectoDocument, setCinRectoDocument] = useState<UploadedDocument | null>(null);
  const [cinVersoDocument, setCinVersoDocument] = useState<UploadedDocument | null>(null);
  const [passportDocument, setPassportDocument] = useState<UploadedDocument | null>(null);
  const [usePassport, setUsePassport] = useState(false);

  const handleDocumentPick = async (type: 'cinRecto' | 'cinVerso' | 'passport') => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['image/png', 'image/jpeg', 'application/pdf'],
        copyToCacheDirectory: true,
      });

      if (result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        const documentData = {
          name: file.name,
          size: file.size || 0,
          type: file.mimeType || 'unknown',
        };

        switch (type) {
          case 'cinRecto':
            setCinRectoDocument(documentData);
            break;
          case 'cinVerso':
            setCinVersoDocument(documentData);
            break;
          case 'passport':
            setPassportDocument(documentData);
            break;
        }
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de sélectionner le document');
    }
  };

  const handleRemoveDocument = (type: 'cinRecto' | 'cinVerso' | 'passport') => {
    switch (type) {
      case 'cinRecto':
        setCinRectoDocument(null);
        break;
      case 'cinVerso':
        setCinVersoDocument(null);
        break;
      case 'passport':
        setPassportDocument(null);
        break;
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const toggleUsePassport = () => {
    setUsePassport(!usePassport);
    if (!usePassport) {
      setCinRectoDocument(null);
      setCinVersoDocument(null);
    }
  };

  const canContinue = () => {
    if (usePassport) {
      return passportDocument !== null;
    }
    return cinRectoDocument !== null && cinVersoDocument !== null;
  };

  const handleContinue = () => {
    if (!canContinue()) {
      Alert.alert('Information', usePassport 
        ? 'Veuillez télécharger votre passeport.' 
        : 'Veuillez télécharger les deux côtés de votre Carte Nationale d\'Identité.'
      );
      return;
    }

    // Navigation vers l'écran suivant
    navigation.navigate('Personaldataform'); 
  };
  const handleBack = () => {
    navigation.goBack();
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
                  <Text style={styles.title}>Documents d'identité</Text>
                  <Text style={styles.subtitle}>
                    Veuillez renseigner le formulaire d'identification.
                  </Text>
                </View>
                
              </View>
            </View>

            {/* Introduction Card */}
            <View style={[styles.card, styles.introCard]}>
              <View style={styles.introHeader}>
                <LinearGradient
                  colors={[colors.atb.red, colors.atb.red]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.introIconContainer}
                >
                  <Ionicons name="document-text" size={20} color={colors.neutral.white} />
                </LinearGradient>
                <View>
                  <Text style={styles.introTitle}>Vérification d'identité</Text>
                  <Text style={styles.introSubtitle}>Conformité réglementaire</Text>
                </View>
              </View>
              <Text style={styles.introText}>
                Pour finaliser votre inscription, nous avons besoin de vérifier votre identité.
                Cette étape est obligatoire pour se conformer aux réglementations bancaires.
              </Text>
            </View>

            {/* Main Content Card */}
            <View style={styles.card}>
              {/* Section Carte d'identité Nationale */}
              {!usePassport && (
                <View style={styles.documentSection}>
                  <View style={styles.sectionHeader}>
                    <LinearGradient
                      colors={[colors.atb.red, colors.atb.red]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.sectionNumber}
                    >
                      <Text style={styles.sectionNumberText}>1</Text>
                    </LinearGradient>
                    <View style={styles.sectionTitleContainer}>
                      <Text style={styles.sectionTitle}>Carte Nationale d'Identité</Text>
                      
                    </View>
                  </View>

                  <View style={styles.reservedNotice}>
                    <Text style={styles.reservedText}>
                      Veuillez télécharger une copie lisible des deux côtés de votre Carte Nationale d'Identité.
                    </Text>
                    <Text style={styles.instructionText}>
                      Assurez-vous que toutes les informations soient clairement visibles et que le document soit valide.
                    </Text>
                  </View>

                  {/* Upload Area CIN Front */}
                  <View style={styles.uploadContainer}>
                    <View style={styles.uploadHeader}>
                      <View style={styles.uploadLabelContainer}>
                        <MaterialIcons name="badge" size={18} color={colors.atb.red} />
                        <Text style={styles.uploadLabel}>
                          Face avant de la CIN
                        </Text>
                      </View>
                      <View style={styles.requiredIndicator}>
                        <Text style={styles.requiredStar}>*</Text>
                        <Text style={styles.requiredText}>Requis</Text>
                      </View>
                    </View>

                    {cinRectoDocument ? (
                      <View style={[styles.uploadedFileCard, styles.frontCard]}>
                        <View style={styles.fileInfo}>
                          <View style={styles.fileIconContainer}>
                            <MaterialIcons name="badge" size={28} color={colors.atb.red} />
                          </View>
                          <View style={styles.fileDetails}>
                            <View style={styles.fileHeader}>
                              <Text style={styles.fileName} numberOfLines={1}>{cinRectoDocument.name}</Text>
                              <View style={styles.fileStatusBadge}>
                                <AntDesign name="check-circle" size={12} color={colors.status.success} />
                                <Text style={styles.fileStatusText}>Validé</Text>
                              </View>
                            </View>
                            <View style={styles.fileMeta}>
                              <Text style={styles.fileSize}>{formatFileSize(cinRectoDocument.size)}</Text>
                              <View style={styles.fileTypeIndicator}>
                                <Text style={styles.fileTypeText}>Face avant</Text>
                              </View>
                            </View>
                          </View>
                        </View>
                        <TouchableOpacity
                          onPress={() => handleRemoveDocument('cinRecto')}
                          style={styles.removeButton}
                        >
                          <AntDesign name="close-circle" size={22} color={colors.neutral.gray500} />
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <TouchableOpacity 
                        style={[styles.uploadBox, styles.frontBox]}
                        onPress={() => handleDocumentPick('cinRecto')}
                        activeOpacity={0.7}
                      >
                        <View style={styles.uploadIconContainer}>
                          <LinearGradient
                            colors={[colors.atb.red + '20', colors.atb.red + '10']}
                            style={styles.uploadIconCircle}
                          >
                            <Feather name="upload" size={28} color={colors.atb.red} />
                          </LinearGradient>
                        </View>
                        <Text style={styles.uploadText}>Télécharger la face avant</Text>
                        <Text style={styles.uploadHint}>Format : PNG, JPG ou PDF (max 5MB)</Text>
                      </TouchableOpacity>
                    )}
                  </View>

                  {/* Upload Area CIN Back */}
                  <View style={styles.uploadContainer}>
                    <View style={styles.uploadHeader}>
                      <View style={styles.uploadLabelContainer}>
                        <MaterialIcons name="badge" size={18} color={colors.atb.red} />
                        <Text style={styles.uploadLabel}>
                          Face arrière de la CIN
                        </Text>
                      </View>
                      <View style={styles.requiredIndicator}>
                        <Text style={styles.requiredStar}>*</Text>
                        <Text style={styles.requiredText}>Requis</Text>
                      </View>
                    </View>

                    {cinVersoDocument ? (
                      <View style={[styles.uploadedFileCard, styles.backCard]}>
                        <View style={styles.fileInfo}>
                          <View style={styles.fileIconContainer}>
                            <MaterialIcons name="badge" size={28} color={colors.atb.red} />
                          </View>
                          <View style={styles.fileDetails}>
                            <View style={styles.fileHeader}>
                              <Text style={styles.fileName} numberOfLines={1}>{cinVersoDocument.name}</Text>
                              <View style={styles.fileStatusBadge}>
                                <AntDesign name="check-circle" size={12} color={colors.status.success} />
                                <Text style={styles.fileStatusText}>Validé</Text>
                              </View>
                            </View>
                            <View style={styles.fileMeta}>
                              <Text style={styles.fileSize}>{formatFileSize(cinVersoDocument.size)}</Text>
                              <View style={styles.fileTypeIndicator}>
                                <Text style={styles.fileTypeText}>Face arrière</Text>
                              </View>
                            </View>
                          </View>
                        </View>
                        <TouchableOpacity
                          onPress={() => handleRemoveDocument('cinVerso')}
                          style={styles.removeButton}
                        >
                          <AntDesign name="close-circle" size={22} color={colors.neutral.gray500} />
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <TouchableOpacity 
                        style={[styles.uploadBox, styles.backBox]}
                        onPress={() => handleDocumentPick('cinVerso')}
                        activeOpacity={0.7}
                      >
                        <View style={styles.uploadIconContainer}>
                          <LinearGradient
                            colors={[colors.atb.red + '20', colors.atb.red + '10']}
                            style={styles.uploadIconCircle}
                          >
                            <Feather name="upload" size={28} color={colors.atb.red} />
                          </LinearGradient>
                        </View>
                        <Text style={styles.uploadText}>Télécharger la face arrière</Text>
                        <Text style={styles.uploadHint}>Format : PNG, JPG ou PDF (max 5MB)</Text>
                      </TouchableOpacity>
                    )}
                  </View>

                  {/* Progress Indicator */}
                  <View style={styles.progressSection}>
                    <View style={styles.progressBar}>
                      <View 
                        style={[
                          styles.progressFill, 
                          { width: `${((cinRectoDocument ? 1 : 0) + (cinVersoDocument ? 1 : 0)) * 50}%` }
                        ]} 
                      />
                    </View>
                    <View style={styles.progressLabels}>
                      <Text style={styles.progressLabel}>
                        {cinRectoDocument && cinVersoDocument ? 'Complète' : 'En cours'}
                      </Text>
                      <Text style={styles.progressCount}>
                        {cinRectoDocument ? 1 : 0}/{cinVersoDocument ? 1 : 0} sur 2
                      </Text>
                    </View>
                  </View>

                  {/* Alternative Option */}
                  <TouchableOpacity 
                    style={styles.alternativeOption}
                    onPress={toggleUsePassport}
                  >
                    <View style={styles.alternativeIcon}>
                      <MaterialIcons name="card-travel" size={20} color={colors.neutral.gray600} />
                    </View>
                    <View style={styles.alternativeContent}>
                      <Text style={styles.alternativeTitle}>Utiliser un passeport</Text>
                      <Text style={styles.alternativeSubtitle}>
                        Si vous n'avez pas de CIN, utilisez votre passeport
                      </Text>
                    </View>
                    <AntDesign name="right" size={18} color={colors.neutral.gray500} />
                  </TouchableOpacity>
                </View>
              )}

              {/* Section Passeport (alternative à la CIN) */}
              {usePassport && (
                <View style={styles.documentSection}>
                  <View style={styles.sectionHeader}>
                    <LinearGradient
                      colors={[colors.atb.red, colors.atb.red]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.sectionNumber}
                    >
                      <Text style={styles.sectionNumberText}>1</Text>
                    </LinearGradient>
                    <View style={styles.sectionTitleContainer}>
                      <Text style={styles.sectionTitle}>Passeport</Text>
              
                    </View>
                  </View>

                  <View style={styles.reservedNotice}>
                    <Text style={styles.reservedText}>
                      Téléchargez une copie lisible de la page principale de votre passeport.
                    </Text>
                    <Text style={styles.instructionText}>
                      Assurez-vous que la photo et les informations personnelles soient clairement visibles.
                    </Text>
                  </View>

                  {/* Upload Area Passeport */}
                  <View style={styles.uploadContainer}>
                    <View style={styles.uploadHeader}>
                      <View style={styles.uploadLabelContainer}>
                        <MaterialIcons name="card-travel" size={18} color={colors.neutral.gray600} />
                        <Text style={styles.uploadLabel}>
                          Page principale du passeport
                        </Text>
                      </View>
                      <View style={styles.requiredIndicator}>
                        <Text style={styles.requiredStar}>*</Text>
                        <Text style={styles.requiredText}>Requis</Text>
                      </View>
                    </View>

                    {passportDocument ? (
                      <View style={[styles.uploadedFileCard, styles.passportCard]}>
                        <View style={styles.fileInfo}>
                          <View style={styles.fileIconContainer}>
                            <MaterialIcons name="card-travel" size={28} color={colors.neutral.gray600} />
                          </View>
                          <View style={styles.fileDetails}>
                            <View style={styles.fileHeader}>
                              <Text style={styles.fileName} numberOfLines={1}>{passportDocument.name}</Text>
                              <View style={styles.fileStatusBadge}>
                                <AntDesign name="check-circle" size={12} color={colors.status.success} />
                                <Text style={styles.fileStatusText}>Validé</Text>
                              </View>
                            </View>
                            <View style={styles.fileMeta}>
                              <Text style={styles.fileSize}>{formatFileSize(passportDocument.size)}</Text>
                              <View style={styles.fileTypeIndicator}>
                                <Text style={styles.fileTypeText}>Passeport</Text>
                              </View>
                            </View>
                          </View>
                        </View>
                        <TouchableOpacity
                          onPress={() => handleRemoveDocument('passport')}
                          style={styles.removeButton}
                        >
                          <AntDesign name="close-circle" size={22} color={colors.neutral.gray500} />
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <TouchableOpacity 
                        style={[styles.uploadBox, styles.passportBox]}
                        onPress={() => handleDocumentPick('passport')}
                        activeOpacity={0.7}
                      >
                        <View style={styles.uploadIconContainer}>
                          <LinearGradient
                            colors={[colors.neutral.gray600 + '20', colors.neutral.gray600 + '10']}
                            style={styles.uploadIconCircle}
                          >
                            <Feather name="upload" size={28} color={colors.neutral.gray600} />
                          </LinearGradient>
                        </View>
                        <Text style={styles.uploadText}>Télécharger le passeport</Text>
                        <Text style={styles.uploadHint}>Format : PNG, JPG ou PDF (max 5MB)</Text>
                      </TouchableOpacity>
                    )}
                  </View>

                  {/* Alternative Option */}
                  <TouchableOpacity 
                    style={styles.alternativeOption}
                    onPress={toggleUsePassport}
                  >
                    <View style={styles.alternativeIcon}>
                      <MaterialIcons name="badge" size={20} color={colors.atb.red} />
                    </View>
                    <View style={styles.alternativeContent}>
                      <Text style={styles.alternativeTitle}>Utiliser une CIN</Text>
                      <Text style={styles.alternativeSubtitle}>
                        Retourner à la Carte Nationale d'Identité
                      </Text>
                    </View>
                    <AntDesign name="right" size={18} color={colors.neutral.gray500} />
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* Action Buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={handleBack}
                style={styles.backButton}
              >
                <AntDesign name="arrow-left" size={18} color={colors.neutral.gray700} />
                <Text style={styles.backButtonText}>Retour</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.continueButton,
                  !canContinue() && styles.continueButtonDisabled
                ]}
                disabled={!canContinue()}
                onPress={handleContinue}
              >
                <LinearGradient
                  colors={canContinue() ? [colors.atb.red, colors.atb.red] : [colors.neutral.gray300, colors.neutral.gray400]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.continueGradient}
                >
                  <Text style={styles.continueButtonText}>Vérifier et continuer</Text>
                  <AntDesign name="arrow-right" size={18} color={colors.neutral.white} />
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <View style={styles.footerLegal}>
                <Text style={styles.footerLegalText}>
                  <Ionicons name="shield" size={12} color={colors.neutral.gray400} /> CONFIDENTIEL
                </Text>
                <Text style={styles.footerDivider}>•</Text>
                <Text style={styles.footerLegalText}>
                  <Ionicons name="lock-closed" size={12} color={colors.neutral.gray400} /> SÉCURISÉ
                </Text>
                <Text style={styles.footerDivider}>•</Text>
                <Text style={styles.footerLegalText}>
                  <Ionicons name="checkmark-circle" size={12} color={colors.neutral.gray400} /> CONFORME
                </Text>
              </View>
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
    marginBottom: 8,
  },
  titleHeader: {
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
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
    shadowColor: colors.neutral.gray900,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  introCard: {
    padding: 20,
    marginBottom: 16,
  },
  introHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  introIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  introTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.neutral.gray900,
    marginBottom: 2,
  },
  introSubtitle: {
    fontSize: 12,
    color: colors.neutral.gray500,
    fontWeight: '500',
  },
  introText: {
    fontSize: 13,
    color: colors.neutral.gray700,
    lineHeight: 20,
    fontWeight: '400',
  },
  documentSection: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
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
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.neutral.gray900,
    marginRight: 12,
  },
  reservedNotice: {
    marginBottom: 24,
    backgroundColor: colors.neutral.offWhite,
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: colors.atb.red,
  },
  reservedText: {
    fontSize: 14,
    color: colors.neutral.gray800,
    fontWeight: '600',
    lineHeight: 20,
    marginBottom: 8,
  },
  instructionText: {
    fontSize: 12,
    color: colors.neutral.gray600,
    lineHeight: 18,
    fontWeight: '400',
  },
  uploadContainer: {
    marginBottom: 20,
  },
  uploadHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  uploadLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  uploadLabel: {
    fontSize: 15,
    color: colors.neutral.gray800,
    fontWeight: '600',
  },
  requiredIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  requiredStar: {
    color: colors.atb.red,
    fontSize: 16,
    fontWeight: 'bold',
  },
  requiredText: {
    fontSize: 12,
    color: colors.neutral.gray500,
    fontWeight: '500',
  },
  uploadBox: {
    borderWidth: 2,
    borderColor: colors.neutral.gray200,
    borderStyle: 'dashed',
    borderRadius: 10,
    padding: 28,
    alignItems: 'center',
    backgroundColor: colors.neutral.offWhite,
    minHeight: 150,
    justifyContent: 'center',
  },
  frontBox: {
    borderColor: colors.atb.red + '80',
  },
  backBox: {
    borderColor: colors.atb.red + '80',
  },
  passportBox: {
    borderColor: colors.neutral.gray600 + '80',
  },
  uploadIconContainer: {
    marginBottom: 16,
  },
  uploadIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadText: {
    fontSize: 16,
    color: colors.neutral.gray900,
    fontWeight: '600',
    marginBottom: 6,
    textAlign: 'center',
  },
  uploadHint: {
    fontSize: 13,
    color: colors.neutral.gray500,
    textAlign: 'center',
    lineHeight: 18,
  },
  uploadedFileCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.neutral.offWhite,
    borderWidth: 1.5,
    borderRadius: 10,
    padding: 16,
  },
  frontCard: {
    borderColor: colors.atb.red,
  },
  backCard: {
    borderColor: colors.atb.red,
  },
  passportCard: {
    borderColor: colors.neutral.gray600,
  },
  fileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  fileIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 10,
    backgroundColor: colors.neutral.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 1,
    borderColor: colors.neutral.gray200,
  },
  fileDetails: {
    flex: 1,
  },
  fileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  fileName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.neutral.gray900,
    flex: 1,
    marginRight: 8,
  },
  fileStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.status.success + '15',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  fileStatusText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.status.success,
  },
  fileMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fileSize: {
    fontSize: 12,
    color: colors.neutral.gray600,
  },
  fileTypeIndicator: {
    backgroundColor: colors.neutral.gray200,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  fileTypeText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.neutral.gray700,
  },
  removeButton: {
    padding: 4,
  },
  progressSection: {
    marginTop: 24,
    marginBottom: 20,
  },
  progressBar: {
    height: 6,
    backgroundColor: colors.neutral.gray200,
    borderRadius: 3,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.atb.red,
    borderRadius: 3,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressLabel: {
    fontSize: 13,
    color: colors.neutral.gray700,
    fontWeight: '600',
  },
  progressCount: {
    fontSize: 12,
    color: colors.neutral.gray500,
    fontWeight: '500',
  },
  alternativeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: colors.neutral.gray300,
    borderRadius: 10,
    backgroundColor: colors.neutral.white,
  },
  alternativeIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.neutral.gray100,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  alternativeContent: {
    flex: 1,
  },
  alternativeTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.neutral.gray900,
    marginBottom: 2,
  },
  alternativeSubtitle: {
    fontSize: 12,
    color: colors.neutral.gray600,
    lineHeight: 16,
  },
  
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
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
    justifyContent: 'center',
    gap: 8,
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.neutral.gray700,
  },
  continueButton: {
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
  continueButtonDisabled: {
    shadowColor: colors.neutral.gray400,
  },
  continueGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    paddingHorizontal: 24,
    gap: 8,
  },
  continueButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.neutral.white,
  },
  footer: {
    alignItems: 'center',
    paddingTop: 20,
  },
  footerLegal: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  footerLegalText: {
    fontSize: 10,
    color: colors.neutral.gray400,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  footerDivider: {
    fontSize: 10,
    color: colors.neutral.gray400,
    marginHorizontal: 8,
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

export default DocumentsJustificatifsScreen;