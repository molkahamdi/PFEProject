// ============================================================
//  frontend/components/common/DocumentScanGuide.tsx
//  Guide visuel professionnel pour photographier un document
// ============================================================
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import colors from '../../../constants/colors';

interface Props {
  docType: 'cin' | 'passport';
}

export const DocumentScanGuide: React.FC<Props> = ({ docType }) => {
  const tips = [
    { icon: 'sun', text: 'Éclairage uniforme sans ombre' },
    { icon: 'maximize', text: 'Document centré et bien cadré' },
    { icon: 'smartphone', text: docType === 'passport' ? 'Format paysage recommandé' : 'Format paysage recommandé' },
    { icon: 'camera', text: 'Photo nette et sans flou' },
  ];

  return (
    <View style={styles.container}>
      {/* En-tête sobre */}
      <View style={styles.header}>
        <Feather name="camera" size={18} color={colors.atb.primary} />
        <Text style={styles.title}>
          {docType === 'passport' ? 'Capture du passeport' : 'Capture de la pièce d\'identité'}
        </Text>
      </View>

      {/* Cadre visuel épuré */}
      <View style={styles.frameContainer}>
        <View style={[styles.docFrame, docType === 'passport' ? styles.passportFrame : styles.cinFrame]}>
          <View style={styles.cornerTL} />
          <View style={styles.cornerTR} />
          <View style={styles.cornerBL} />
          <View style={styles.cornerBR} />
          <Feather name="crop" size={32} color={colors.neutral.gray300} />
          <Text style={styles.frameText}>
            {docType === 'passport' ? 'Passeport' : 'Carte d\'identité'}
          </Text>
        </View>
      </View>

      {/* Instructions minimales */}
      <View style={styles.instructions}>
        {tips.map((tip, i) => (
          <View key={i} style={styles.instructionItem}>
            <View style={styles.bulletPoint} />
            <Text style={styles.instructionText}>{tip.text}</Text>
          </View>
        ))}
      </View>

      {/* Note discrète */}
      <View style={styles.note}>
        <Feather name="info" size={14} color={colors.neutral.gray500} />
        <Text style={styles.noteText}>
          La qualité de l'image impacte la vérification automatique des données.
        </Text>
      </View>
    </View>
  );
};

const CORNER_SIZE = 20;
const CORNER_WIDTH = 2;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.neutral.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.neutral.gray200,
    padding: 20,
    marginBottom: 20,
    shadowColor: colors.neutral.gray900,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.gray100,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.neutral.gray900,
    marginLeft: 8,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  frameContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  docFrame: {
    borderWidth: 1,
    borderColor: colors.neutral.gray200,
    borderRadius: 8,
    backgroundColor: colors.neutral.gray50,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  passportFrame: {
    width: 240,
    height: 160,
  },
  cinFrame: {
    width: 200,
    height: 140,
  },
  frameText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.neutral.gray400,
    marginTop: 8,
    letterSpacing: 0.5,
  },
  cornerTL: {
    position: 'absolute',
    top: 8,
    left: 8,
    width: CORNER_SIZE,
    height: CORNER_SIZE,
    borderTopWidth: CORNER_WIDTH,
    borderLeftWidth: CORNER_WIDTH,
    borderColor: colors.atb.primary,
    borderTopLeftRadius: 4,
  },
  cornerTR: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: CORNER_SIZE,
    height: CORNER_SIZE,
    borderTopWidth: CORNER_WIDTH,
    borderRightWidth: CORNER_WIDTH,
    borderColor: colors.atb.  primary,
    borderTopRightRadius: 4,
  },
  cornerBL: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    width: CORNER_SIZE,
    height: CORNER_SIZE,
    borderBottomWidth: CORNER_WIDTH,
    borderLeftWidth: CORNER_WIDTH,
    borderColor: colors.atb.primary,
    borderBottomLeftRadius: 4,
  },
  cornerBR: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: CORNER_SIZE,
    height: CORNER_SIZE,
    borderBottomWidth: CORNER_WIDTH,
    borderRightWidth: CORNER_WIDTH,
    borderColor: colors.atb.primary,
    borderBottomRightRadius: 4,
  },
  instructions: {
    marginBottom: 16,
    gap: 12,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bulletPoint: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.neutral.gray400,
    marginRight: 12,
    marginLeft: 4,
  },
  instructionText: {
    fontSize: 13,
    color: colors.neutral.gray700,
    fontWeight: '400',
    flex: 1,
    lineHeight: 18,
  },
  note: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.neutral.gray50,
    borderRadius: 6,
    padding: 10,
  },
  noteText: {
    fontSize: 11,
    color: colors.neutral.gray600,
    fontWeight: '400',
    flex: 1,
    lineHeight: 16,
    fontStyle: 'italic',
  },
});