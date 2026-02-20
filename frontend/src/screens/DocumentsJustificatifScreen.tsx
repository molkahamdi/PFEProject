// ============================================================
//  frontend/screens/DocumentsJustificatifsScreen.tsx
//  UPLOAD DOCUMENTS — VERSION FINALE RÉORGANISÉE
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
  Alert,
  Image,
  StatusBar,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { AntDesign, Feather, MaterialIcons, Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import colors from '../../constants/colors';
import { NavigationProp, RouteProp } from '../types/navigation';
import { saveDocuments } from '../services/customerApi';

// ============================================================
//  TYPES & CONSTANTES
// ============================================================

type Props = {
  navigation: NavigationProp<'DocumentsJustificatif'>;
  route: RouteProp<'DocumentsJustificatif'>;
};

interface UploadedDocument {
  name: string;
  size: number;
  type: string;
  uri?: string;
}

type UploadType = 'cinRecto' | 'cinVerso' | 'passport';

// ============================================================
//  SOUS-COMPOSANTS
// ============================================================

const Header: React.FC = () => (
  <View style={styles.header}>
    <View style={styles.headerLeft}>
      <View style={styles.logoContainer}>
        <LinearGradient colors={[colors.atb.red, '#C41E3A']} style={styles.logoGradient}>
          <Image source={require('../assets/atb.png')} style={styles.logo} resizeMode="contain" />
        </LinearGradient>
      </View>
      <View>
        <Text style={styles.bankName}>Arab Tunisian Bank</Text>
        <Text style={styles.bankSubtitle}>البنك العربي التونسي</Text>
      </View>
    </View>
    <LinearGradient colors={[colors.atb.red, '#C41E3A']} style={styles.digipackBadge}>
      <Text style={styles.digipackText}>DIGIPACK</Text>
    </LinearGradient>
  </View>
);

const TitleSection: React.FC = () => (
  <View style={styles.titleSection}>
    <Text style={styles.title}>Documents d'identité</Text>
    <Text style={styles.subtitle}>
      Veuillez renseigner le formulaire d'identification.
    </Text>
  </View>
);

const IntroCard: React.FC = () => (
  <View style={[styles.card, styles.introCard]}>
    <View style={styles.introHeader}>
      <LinearGradient colors={[colors.atb.red, '#C41E3A']} style={styles.introIconContainer}>
        <MaterialIcons name="verified-user" size={20} color={colors.neutral.white} />
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
);

const UploadBox: React.FC<{
  type: UploadType;
  label: string;
  document: UploadedDocument | null;
  borderColor: string;
  onUpload: (type: UploadType) => void;
  onRemove: (type: UploadType) => void;
}> = ({ type, label, document, borderColor, onUpload, onRemove }) => {
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <View style={styles.uploadContainer}>
      <View style={styles.uploadHeader}>
        <Text style={styles.uploadLabel}>{label}</Text>
        <View style={styles.requiredIndicator}>
          <Text style={styles.requiredStar}>*</Text>
          <Text style={styles.requiredText}>Requis</Text>
        </View>
      </View>

      {document ? (
        <View style={[styles.uploadedFileCard, { borderColor }]}>
          <View style={styles.fileInfo}>
            <View style={styles.fileIconContainer}>
              {document.uri ? (
                <Image source={{ uri: document.uri }} style={{ width: 40, height: 40, borderRadius: 6 }} resizeMode="cover" />
              ) : (
                <AntDesign name="file" size={24} color={borderColor} />
              )}
            </View>
            <View style={styles.fileDetails}>
              <View style={styles.fileHeader}>
                <Text style={styles.fileName} numberOfLines={1}>{document.name}</Text>
                <View style={styles.fileStatusBadge}>
                  <Feather name="check-circle" size={10} color={colors.status.success} />
                  <Text style={styles.fileStatusText}>Validé</Text>
                </View>
              </View>
              <View style={styles.fileMeta}>
                <Text style={styles.fileSize}>{formatFileSize(document.size)}</Text>
                <View style={styles.fileTypeIndicator}>
                  <Text style={styles.fileTypeText}>{label}</Text>
                </View>
              </View>
            </View>
          </View>
          <TouchableOpacity onPress={() => onRemove(type)} style={styles.removeButton}>
            <Feather name="x" size={20} color={colors.neutral.gray500} />
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          onPress={() => onUpload(type)}
          style={[styles.uploadBox, { borderColor: borderColor + '80' }]}
          activeOpacity={0.7}
        >
          <LinearGradient
            colors={[borderColor + '15', borderColor + '25']}
            style={styles.uploadIconCircle}
          >
            <MaterialIcons name="add-a-photo" size={28} color={borderColor} />
          </LinearGradient>
          <Text style={styles.uploadText}>Ajouter {label.toLowerCase()}</Text>
          <Text style={styles.uploadHint}>
            Photographier ou choisir depuis la galerie{'\n'}Format : PNG, JPG ou PDF (max 5MB)
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const ProgressBar: React.FC<{ count: number; total: number }> = ({ count, total }) => (
  <View style={styles.progressSection}>
    <View style={styles.progressBar}>
      <View style={[styles.progressFill, { flex: count / total }]} />
    </View>
    <View style={styles.progressLabels}>
      <Text style={styles.progressLabel}>{count === total ? 'Complète' : 'En cours'}</Text>
      <Text style={styles.progressCount}>{count} sur {total}</Text>
    </View>
  </View>
);

const Footer: React.FC = () => (
  <View style={styles.footer}>
    <View style={styles.footerLegal}>
      <Text style={styles.footerLegalText}>CONFIDENTIEL</Text>
      <Text style={styles.footerDivider}> • </Text>
      <Text style={styles.footerLegalText}>SÉCURISÉ</Text>
    </View>
    <Text style={styles.footerText}>© 2026 Arab Tunisian Bank · Tous droits réservés</Text>
    <Text style={styles.footerSubtext}>Service client : 71 143 000</Text>
  </View>
);

const UploadModal: React.FC<{
  visible: boolean;
  onClose: () => void;
  onTakePhoto: () => void;
  onPickDocument: () => void;
  documentType: string;
}> = ({ visible, onClose, onTakePhoto, onPickDocument, documentType }) => (
  <Modal
    visible={visible}
    transparent
    animationType="slide"
    onRequestClose={onClose}
  >
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Ajouter {documentType}</Text>
          <TouchableOpacity onPress={onClose}>
            <Feather name="x" size={24} color={colors.neutral.gray600} />
          </TouchableOpacity>
        </View>

        <View style={styles.modalBody}>
          <TouchableOpacity
            style={styles.modalOption}
            onPress={onTakePhoto}
          >
            <LinearGradient colors={[colors.atb.red + '15', colors.atb.red + '25']} style={styles.modalOptionIcon}>
              <Feather name="camera" size={28} color={colors.atb.red} />
            </LinearGradient>
            <View style={styles.modalOptionContent}>
              <Text style={styles.modalOptionTitle}>Prendre une photo</Text>
              <Text style={styles.modalOptionDescription}>
                Utilisez votre caméra pour photographier le document
              </Text>
            </View>
            <Feather name="chevron-right" size={20} color={colors.neutral.gray400} />
          </TouchableOpacity>

          <View style={styles.modalDivider} />

          <TouchableOpacity
            style={styles.modalOption}
            onPress={onPickDocument}
          >
            <LinearGradient colors={[colors.neutral.gray600 + '15', colors.neutral.gray600 + '25']} style={styles.modalOptionIcon}>
              <Feather name="folder" size={28} color={colors.neutral.gray600} />
            </LinearGradient>
            <View style={styles.modalOptionContent}>
              <Text style={styles.modalOptionTitle}>Choisir depuis la galerie</Text>
              <Text style={styles.modalOptionDescription}>
                Sélectionnez une photo ou un PDF existant
              </Text>
            </View>
            <Feather name="chevron-right" size={20} color={colors.neutral.gray400} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.modalCancelButton} onPress={onClose}>
          <Text style={styles.modalCancelText}>Annuler</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

// ============================================================
//  COMPOSANT PRINCIPAL
// ============================================================

const DocumentsJustificatifsScreen: React.FC<Props> = ({ navigation, route }) => {
  const { customerId } = route.params;

  // États
  const [cinRectoDocument, setCinRectoDocument] = useState<UploadedDocument | null>(null);
  const [cinVersoDocument, setCinVersoDocument] = useState<UploadedDocument | null>(null);
  const [passportDocument, setPassportDocument] = useState<UploadedDocument | null>(null);
  const [usePassport, setUsePassport] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [currentUploadType, setCurrentUploadType] = useState<UploadType | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // ── Helpers ───────────────────────────────────────────────
  const getDocumentTypeLabel = (type: UploadType): string => {
    if (type === 'cinRecto') return 'face avant de la CIN';
    if (type === 'cinVerso') return 'face arrière de la CIN';
    return 'passeport';
  };

  const setDocument = (type: UploadType, doc: UploadedDocument | null) => {
    if (type === 'cinRecto') setCinRectoDocument(doc);
    if (type === 'cinVerso') setCinVersoDocument(doc);
    if (type === 'passport') setPassportDocument(doc);
  };

  const canContinue = (): boolean =>
    usePassport ? passportDocument !== null : cinRectoDocument !== null && cinVersoDocument !== null;

  // ── Permissions caméra ────────────────────────────────────
  const requestCameraPermission = async (): Promise<boolean> => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission requise',
        "L'accès à la caméra est nécessaire pour prendre des photos de vos documents.",
      );
      return false;
    }
    return true;
  };

  // ── Prendre une photo ──────────────────────────────────────
  const handleTakePhoto = async (type: UploadType) => {
    const ok = await requestCameraPermission();
    if (!ok) return;

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const photo = result.assets[0];
        setDocument(type, {
          name: `photo_${type}_${Date.now()}.jpg`,
          size: photo.fileSize || 0,
          type: 'image/jpeg',
          uri: photo.uri,
        });
        setShowUploadModal(false);
        Alert.alert('Succès', 'Photo capturée avec succès !');
      }
    } catch {
      Alert.alert('Erreur', 'Impossible de prendre la photo');
    }
  };

  // ── Sélectionner depuis la galerie ────────────────────────
  const handleDocumentPick = async (type: UploadType) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['image/png', 'image/jpeg', 'application/pdf'],
        copyToCacheDirectory: true,
      });

      if (result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        setDocument(type, {
          name: file.name,
          size: file.size || 0,
          type: file.mimeType || 'unknown',
          uri: file.uri,
        });
        setShowUploadModal(false);
        Alert.alert('Succès', 'Document sélectionné avec succès !');
      }
    } catch {
      Alert.alert('Erreur', 'Impossible de sélectionner le document');
    }
  };

  const openUploadOptions = (type: UploadType) => {
    setCurrentUploadType(type);
    setShowUploadModal(true);
  };

  const toggleUsePassport = () => {
    if (!usePassport) {
      setCinRectoDocument(null);
      setCinVersoDocument(null);
    }
    setUsePassport(prev => !prev);
  };

  // ── Soumettre ─────────────────────────────────────────────
  const handleContinue = async () => {
    if (!canContinue()) {
      Alert.alert(
        'Information',
        usePassport
          ? 'Veuillez télécharger ou photographier votre passeport.'
          : 'Veuillez télécharger les deux côtés de votre CIN.',
      );
      return;
    }

    setIsLoading(true);
    try {
      await saveDocuments(customerId, {
        usePassport,
        idCardFrontPath: cinRectoDocument?.uri ?? null,
        idCardBackPath: cinVersoDocument?.uri ?? null,
        passportPath: passportDocument?.uri ?? null,
      });
      // @ts-ignore
      navigation.navigate('Personaldataform', { customerId });
    } catch (error: any) {
      Alert.alert('Erreur', error.message || 'Erreur lors de la sauvegarde des documents.');
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
      <View style={styles.flex}>

        {/* Header */}
        <Header />

        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <View style={styles.content}>

              {/* Titre */}
              <TitleSection />

              {/* Introduction */}
              <IntroCard />

              {/* Document principal */}
              <View style={styles.card}>
                <View style={styles.documentSection}>
                  <View style={styles.sectionHeader}>
                    <LinearGradient
                      colors={usePassport ? [colors.neutral.gray600, colors.neutral.gray700] : [colors.atb.red, '#C41E3A']}
                      style={styles.sectionNumber}
                    >
                      <Text style={styles.sectionNumberText}>1</Text>
                    </LinearGradient>
                    <Text style={styles.sectionTitle}>
                      {usePassport ? 'Passeport' : "Carte d'Identité Nationale"}
                    </Text>
                  </View>

                  <View style={styles.reservedNotice}>
                    <Text style={styles.reservedText}>
                      {usePassport
                        ? "Téléchargez ou photographiez une copie lisible de la page principale de votre passeport."
                        : "Veuillez télécharger ou photographier une copie lisible des deux côtés de votre Carte Nationale d'Identité."}
                    </Text>
                    <Text style={styles.instructionText}>
                      Assurez-vous que toutes les informations soient clairement visibles et que
                      le document soit valide.
                    </Text>
                  </View>

                  {/* Zones d'upload */}
                  {!usePassport ? (
                    <>
                      <UploadBox
                        type="cinRecto"
                        label="Face avant de la CIN"
                        document={cinRectoDocument}
                        borderColor={colors.atb.red}
                        onUpload={openUploadOptions}
                        onRemove={() => setCinRectoDocument(null)}
                      />
                      <UploadBox
                        type="cinVerso"
                        label="Face arrière de la CIN"
                        document={cinVersoDocument}
                        borderColor={colors.atb.red}
                        onUpload={openUploadOptions}
                        onRemove={() => setCinVersoDocument(null)}
                      />

                      {/* Barre de progression */}
                      <ProgressBar
                        count={(cinRectoDocument ? 1 : 0) + (cinVersoDocument ? 1 : 0)}
                        total={2}
                      />
                    </>
                  ) : (
                    <UploadBox
                      type="passport"
                      label="Page principale du passeport"
                      document={passportDocument}
                      borderColor={colors.neutral.gray600}
                      onUpload={openUploadOptions}
                      onRemove={() => setPassportDocument(null)}
                    />
                  )}

                  {/* Bouton basculer */}
                  <TouchableOpacity style={styles.alternativeOption} onPress={toggleUsePassport} activeOpacity={0.7}>
                    <View style={styles.alternativeIcon}>
                      <Ionicons name="swap-horizontal" size={20} color={colors.neutral.gray600} />
                    </View>
                    <View style={styles.alternativeContent}>
                      <Text style={styles.alternativeTitle}>
                        {usePassport ? 'Utiliser une CIN' : 'Utiliser un passeport'}
                      </Text>
                      <Text style={styles.alternativeSubtitle}>
                        {usePassport
                          ? "Retourner à la Carte d'Identité Nationale"
                          : "Si vous n'avez pas de CIN, utilisez votre passeport"}
                      </Text>
                    </View>
                    <Feather name="chevron-right" size={20} color={colors.neutral.gray400} />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Boutons */}
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                  <Feather name="arrow-left" size={18} color={colors.neutral.gray700} />
                  <Text style={styles.backButtonText}>Retour</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.continueButton, !canContinue() && styles.continueButtonDisabled]}
                  onPress={handleContinue}
                  disabled={!canContinue() || isLoading}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={canContinue() ? [colors.atb.red, '#C41E3A'] : [colors.neutral.gray300, colors.neutral.gray400]}
                    style={styles.continueGradient}
                  >
                    <Text style={styles.continueButtonText}>
                      {isLoading ? 'Envoi...' : 'Vérifier et continuer'}
                    </Text>
                    {!isLoading && <Feather name="arrow-right" size={18} color={colors.neutral.white} />}
                  </LinearGradient>
                </TouchableOpacity>
              </View>

              {/* Footer */}
              <Footer />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>

        {/* Modal choix upload */}
        <UploadModal
          visible={showUploadModal}
          onClose={() => setShowUploadModal(false)}
          onTakePhoto={() => currentUploadType && handleTakePhoto(currentUploadType)}
          onPickDocument={() => currentUploadType && handleDocumentPick(currentUploadType)}
          documentType={currentUploadType ? getDocumentTypeLabel(currentUploadType) : ''}
        />
      </View>
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
    borderRadius: 4
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
  titleSection: { marginBottom: 16 },
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

  // Cards
  card: {
    backgroundColor: colors.neutral.white,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: colors.neutral.gray900,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2
  },
  introCard: { padding: 20, marginBottom: 16 },
  introHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12
  },
  introIconContainer: {
    width: 40,
    height: 40,
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

  documentSection: { padding: 20 },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20
  },
  sectionNumber: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12
  },
  sectionNumberText: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.neutral.white
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.neutral.gray900
  },

  reservedNotice: {
    marginBottom: 24,
    backgroundColor: colors.neutral.offWhite,
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: colors.atb.red
  },
  reservedText: {
    fontSize: 14,
    color: colors.neutral.gray800,
    fontWeight: '600',
    lineHeight: 20,
    marginBottom: 8
  },
  instructionText: {
    fontSize: 12,
    color: colors.neutral.gray600,
    lineHeight: 18,
    fontWeight: '400'
  },

  uploadContainer: { marginBottom: 20 },
  uploadHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  uploadLabel: {
    fontSize: 15,
    color: colors.neutral.gray800,
    fontWeight: '600'
  },
  requiredIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  requiredStar: {
    color: colors.atb.red,
    fontSize: 16,
    fontWeight: 'bold'
  },
  requiredText: {
    fontSize: 12,
    color: colors.neutral.gray500,
    fontWeight: '500'
  },
  uploadBox: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 10,
    padding: 28,
    alignItems: 'center',
    backgroundColor: colors.neutral.offWhite,
    minHeight: 150,
    justifyContent: 'center'
  },
  uploadIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16
  },
  uploadText: {
    fontSize: 16,
    color: colors.neutral.gray900,
    fontWeight: '600',
    marginBottom: 6,
    textAlign: 'center'
  },
  uploadHint: {
    fontSize: 13,
    color: colors.neutral.gray500,
    textAlign: 'center',
    lineHeight: 18
  },

  uploadedFileCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.neutral.offWhite,
    borderWidth: 1.5,
    borderRadius: 10,
    padding: 16
  },
  fileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
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
    borderColor: colors.neutral.gray200
  },
  fileDetails: { flex: 1 },
  fileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6
  },
  fileName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.neutral.gray900,
    flex: 1,
    marginRight: 8
  },
  fileStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.status.success + '15',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4
  },
  fileStatusText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.status.success
  },
  fileMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  fileSize: {
    fontSize: 12,
    color: colors.neutral.gray600
  },
  fileTypeIndicator: {
    backgroundColor: colors.neutral.gray200,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4
  },
  fileTypeText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.neutral.gray700
  },
  removeButton: { padding: 4 },

  progressSection: { marginTop: 24, marginBottom: 20 },
  progressBar: {
    height: 6,
    backgroundColor: colors.neutral.gray200,
    borderRadius: 3,
    marginBottom: 8,
    overflow: 'hidden',
    flexDirection: 'row'
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.atb.red,
    borderRadius: 3
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  progressLabel: {
    fontSize: 13,
    color: colors.neutral.gray700,
    fontWeight: '600'
  },
  progressCount: {
    fontSize: 12,
    color: colors.neutral.gray500,
    fontWeight: '500'
  },

  alternativeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: colors.neutral.gray300,
    borderRadius: 10,
    backgroundColor: colors.neutral.white
  },
  alternativeIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.neutral.gray100,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12
  },
  alternativeContent: { flex: 1 },
  alternativeTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.neutral.gray900,
    marginBottom: 2
  },
  alternativeSubtitle: {
    fontSize: 12,
    color: colors.neutral.gray600,
    lineHeight: 16
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
    justifyContent: 'center',
    gap: 8
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.neutral.gray700
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
  continueButtonDisabled: { shadowColor: colors.neutral.gray400 },
  continueGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    paddingHorizontal: 24,
    gap: 8
  },
  continueButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.neutral.white
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

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end'
  },
  modalContent: {
    backgroundColor: colors.neutral.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    paddingHorizontal: 24
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.neutral.gray900,
    flex: 1
  },
  modalBody: { marginBottom: 16 },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16
  },
  modalOptionIcon: {
    width: 56,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16
  },
  modalOptionContent: { flex: 1 },
  modalOptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.neutral.gray900,
    marginBottom: 4
  },
  modalOptionDescription: {
    fontSize: 13,
    color: colors.neutral.gray600,
    lineHeight: 18
  },
  modalDivider: {
    height: 1,
    backgroundColor: colors.neutral.gray200,
    marginVertical: 8
  },
  modalCancelButton: {
    height: 52,
    backgroundColor: colors.neutral.gray100,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalCancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.neutral.gray700
  },
});

export default DocumentsJustificatifsScreen;