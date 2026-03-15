// ============================================================
//  frontend/components/common/OcrResultBadge.tsx
//  ✅ Affichage utilisateur épuré — ZERO score, ZERO détail technique
//  ✅ Logique 3 tentatives max avec message d'alerte fraude
//  ✅ Les scores/détails restent dans les logs dev (console) UNIQUEMENT
// ============================================================
import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { OcrScanResult } from '../../services/ocrApi';

interface Props {
  isScanning:   boolean;
  result:       OcrScanResult | null;
  attemptCount: number;   // nombre de tentatives effectuées pour CE document
  maxAttempts?: number;   // défaut : 3
}

const MAX_DEFAULT = 3;

export const OcrResultBadge: React.FC<Props> = ({
  isScanning,
  result,
  attemptCount,
  maxAttempts = MAX_DEFAULT,
}) => {
  // ── Scan en cours ────────────────────────────────────────
  if (isScanning) {
    return (
      <View style={[styles.badge, styles.scanningBadge]}>
        <ActivityIndicator size="small" color="#c82333" />
        <Text style={styles.scanningText}>Vérification du document en cours…</Text>
      </View>
    );
  }

  // ── Aucun résultat ────────────────────────────────────────
  if (!result) return null;

  // ── Dépassement de tentatives ────────────────────────────
  const attemptsLeft = maxAttempts - attemptCount;
  const isBlocked    = attemptCount >= maxAttempts && !isDocumentValid(result);

  if (isBlocked) {
    return (
      <View style={[styles.badge, styles.blockedBadge]}>
        <Text style={styles.blockedIcon}>🚫</Text>
        <View style={styles.col}>
          <Text style={styles.blockedTitle}>Vérification bloquée</Text>
          <Text style={styles.blockedDesc}>
            Nombre maximal de tentatives atteint.{'\n'}
            Votre dossier a été signalé pour vérification manuelle.
          </Text>
        </View>
      </View>
    );
  }

  // ── Document valide ───────────────────────────────────────
  if (isDocumentValid(result)) {
    return (
      <View style={[styles.badge, styles.validBadge]}>
        <Text style={styles.validIcon}>✅</Text>
        <View style={styles.col}>
          <Text style={styles.validTitle}>Document vérifié</Text>
          <Text style={styles.validDesc}>Votre identité a été confirmée avec succès.</Text>
        </View>
      </View>
    );
  }

  // ── Document invalide — tentatives restantes ──────────────
  return (
    <View style={[styles.badge, styles.invalidBadge]}>
      <Text style={styles.invalidIcon}>❌</Text>
      <View style={styles.col}>
        <Text style={styles.invalidTitle}>Document non reconnu</Text>
        <Text style={styles.invalidDesc}>
          Les informations du document ne correspondent pas à votre dossier.{'\n'}
          Veuillez reprendre une photo nette et lisible.
        </Text>
        {attemptsLeft > 0 && (
          <View style={styles.attemptsRow}>
            <Text style={styles.attemptsText}>
              {attemptsLeft === 1
                ? '⚠️  Dernière tentative disponible'
                : `Tentatives restantes : ${attemptsLeft}`}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

// ── Helper : document valide ? ────────────────────────────────
function isDocumentValid(result: OcrScanResult): boolean {
  return (
    result.matchStatus === 'MATCH' ||
    (result.matchStatus === 'PARTIAL' && result.canProceed === true)
  );
}

// ── Styles ────────────────────────────────────────────────────
const styles = StyleSheet.create({
  badge: {
    marginTop:    10,
    padding:      14,
    borderRadius: 10,
    borderWidth:  1,
    flexDirection: 'row',
    alignItems:   'flex-start',
    gap:          12,
  },
  col: { flex: 1 },

  // Scanning
  scanningBadge: {
    alignItems:      'center',
    borderColor:     '#e5e7eb',
    backgroundColor: '#f9fafb',
  },
  scanningText: { fontSize: 13, color: '#6b7280', marginLeft: 4 },

  // Valide
  validBadge: {
    borderColor:     '#16a34a40',
    backgroundColor: '#f0fdf4',
  },
  validIcon:  { fontSize: 22, marginTop: 1 },
  validTitle: { fontSize: 14, fontWeight: '700', color: '#15803d', marginBottom: 3 },
  validDesc:  { fontSize: 12, color: '#166534', lineHeight: 18 },

  // Invalide
  invalidBadge: {
    borderColor:     '#dc262640',
    backgroundColor: '#fef2f2',
  },
  invalidIcon:  { fontSize: 22, marginTop: 1 },
  invalidTitle: { fontSize: 14, fontWeight: '700', color: '#b91c1c', marginBottom: 3 },
  invalidDesc:  { fontSize: 12, color: '#991b1b', lineHeight: 18 },
  attemptsRow:  { marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: '#fca5a540' },
  attemptsText: { fontSize: 12, fontWeight: '600', color: '#b45309' },

  // Bloqué
  blockedBadge: {
    borderColor:     '#7c3aed40',
    backgroundColor: '#faf5ff',
  },
  blockedIcon:  { fontSize: 22, marginTop: 1 },
  blockedTitle: { fontSize: 14, fontWeight: '700', color: '#6d28d9', marginBottom: 3 },
  blockedDesc:  { fontSize: 12, color: '#5b21b6', lineHeight: 18 },
});