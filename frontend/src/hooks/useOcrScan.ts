
// ── Hook personnalisé pour gérer les scans OCR avec suivi des tentatives et blocage ───────────────────────────────
import { useState, useCallback } from 'react';
import {scanDocument, OcrScanResult, OcrFormData, DocType,} from '../services/ocrApi';

// Clés de suivi des tentatives (une par document soumis à OCR)
export type OcrDocKey = 'cinRecto' | 'passport';

const MAX_ATTEMPTS = 3;

interface OcrState {
  isScanning:      boolean;
  currentScanType: string | null;
  result:          OcrScanResult | null;
  error:           string | null;
}

export interface OcrAttempts {
  cinRecto: number;
  passport: number;
}

export function useOcrScan() {
  const [ocrState, setOcrState] = useState<OcrState>({
    isScanning: false, currentScanType: null, result: null, error: null,
  });

  // Compteur de tentatives par clé document
  const [attempts, setAttempts] = useState<OcrAttempts>({ cinRecto: 0, passport: 0 });

  // ── Vérifier si un document est bloqué ───────────────────
  const isBlocked = useCallback((key: OcrDocKey): boolean => {
    return attempts[key] >= MAX_ATTEMPTS;
  }, [attempts]);

  // ── Scan principal ────────────────────────────────────────
  const scanFile = useCallback(async (params: {
    uri:         string;
    name:        string;
    mimeType:    string;
    docType:     DocType;
    formData:    OcrFormData;
    customerId?: string;
  }): Promise<OcrScanResult | null> => {

    // Déterminer la clé tentative
    const key: OcrDocKey = params.docType === 'PASSPORT' ? 'passport' : 'cinRecto';

    // Vérifier si déjà bloqué
    if (attempts[key] >= MAX_ATTEMPTS) {
      console.warn(`[OCR] ⛔ Document bloqué (${key}) — ${MAX_ATTEMPTS} tentatives atteintes`);
      return null;
    }

    setOcrState({ isScanning: true, currentScanType: params.docType, result: null, error: null });

    // Incrémenter AVANT le scan (empêche double-clic)
    const newCount = attempts[key] + 1;
    setAttempts(prev => ({ ...prev, [key]: newCount }));

    try {
      const result = await scanDocument(
        params.uri, params.name, params.mimeType,
        params.docType, params.formData, params.customerId,
      );

      // ── Logs détaillés côté DEV uniquement ───────────────
      const isCin      = params.docType === 'CIN_RECTO';
      const isPassport = params.docType === 'PASSPORT';
      const p          = result.parsedData;
      const f          = params.formData;

      // Tableau comparatif : champ | valeur formulaire | valeur OCR | match
      const compareRows: { champ: string; formulaire: string; ocr: string; ok: boolean }[] = [];

      if (isCin) {
        compareRows.push(
          { champ: 'N° CIN',            formulaire: f.idCardNumber      ?? '—', ocr: p.idCardNumber      ?? '—', ok: result.matchDetails['idCardNumber']    ?? false },
          { champ: 'Nom (arabe)',        formulaire: f.lastName          ?? '—', ocr: p.lastNameArabic    ?? '—', ok: result.matchDetails['lastName']        ?? false },
          { champ: 'Prénom (arabe)',     formulaire: f.firstName         ?? '—', ocr: p.firstNameArabic   ?? '—', ok: result.matchDetails['firstName']       ?? false },
          { champ: 'Date naissance',     formulaire: f.birthDate         ?? '—', ocr: p.birthDate         ?? '—', ok: result.matchDetails['birthDate']       ?? false },
        );
      } else if (isPassport) {
        compareRows.push(
          { champ: 'N° CIN (passeport)', formulaire: f.idCardNumber      ?? '—', ocr: p.nationalId        ?? '—', ok: result.matchDetails['idCardNumber']    ?? false },
          { champ: 'Nom (latin)',         formulaire: f.lastNameLatin     ?? '—', ocr: p.lastName          ?? '—', ok: result.matchDetails['lastNameLatin']   ?? false },
          { champ: 'Prénom (latin)',      formulaire: f.firstNameLatin    ?? '—', ocr: p.firstName         ?? '—', ok: result.matchDetails['firstNameLatin']  ?? false },
          { champ: 'Date naissance',      formulaire: f.birthDate         ?? '—', ocr: p.birthDate         ?? '—', ok: result.matchDetails['birthDate']       ?? false },
        );
      }

      console.log(`[OCR DEV] ════════════════════════════════════════`);
      console.log(`[OCR DEV]  DocType    : ${params.docType}`);
      console.log(`[OCR DEV]  Status     : ${result.matchStatus}  (score: ${Math.round(result.matchScore * 100)}%)`);
      console.log(`[OCR DEV]   Qualité    : ${Math.round(result.confidence * 100)}%`);
      console.log(`[OCR DEV]  CanProceed : ${result.canProceed}`);
      console.log(`[OCR DEV] Tentative  : ${newCount}/${MAX_ATTEMPTS}`);
      console.log(`[OCR DEV] ────────────────────────────────────────`);
      console.log(`[OCR DEV] 🔍 COMPARAISON CHAMP PAR CHAMP :`);
      compareRows.forEach(({ champ, formulaire, ocr, ok }) => {
        const icon = ok ? '✅' : '❌';
        console.log(`[OCR DEV]   ${icon}  ${champ.padEnd(20)} | FORM: "${formulaire}"  →  OCR: "${ocr}"`);
      });

      // Champs supplémentaires extraits par l'OCR (non comparés, juste pour info)
      console.log(`[OCR DEV] ────────────────────────────────────────`);
      console.log(`[OCR DEV] DONNÉES BRUTES OCR (non comparées) :`);
      if (p.idIssueDate) console.log(`[OCR DEV]    Date émission   : "${p.idIssueDate}"`);
      if ((p as any).expiryDate) console.log(`[OCR DEV]    Date expiration : "${(p as any).expiryDate}"`);
      if (p.gender)     console.log(`[OCR DEV]    Genre           : "${p.gender}"`);

      console.log(`[OCR DEV] ════════════════════════════════════════`);
      // ─────────────────────────────────────────────────────

      setOcrState({ isScanning: false, currentScanType: null, result, error: null });
      return result;

    } catch (err: any) {
      const msg = err.message || 'Erreur de vérification OCR';
      console.error(`[OCR DEV] ❌ Erreur scan (tentative ${newCount}/${MAX_ATTEMPTS}):`, msg);
      setOcrState({ isScanning: false, currentScanType: null, result: null, error: msg });
      // On décrémente si erreur réseau (pas une vraie tentative de fraude)
      setAttempts(prev => ({ ...prev, [key]: Math.max(0, prev[key] - 1) }));
      return null;
    }
  }, [attempts]);

  // ── Reset complet (ex: toggle CIN↔Passeport) ─────────────
  const resetOcr = useCallback(() => {
    setOcrState({ isScanning: false, currentScanType: null, result: null, error: null });
  }, []);

  // ── Reset tentatives d'un seul document ──────────────────
  // À N'UTILISER QUE PAR UN ADMIN / en dev — jamais exposé à l'UI
  const resetAttempts = useCallback((key: OcrDocKey) => {
    console.warn(`[OCR DEV] ⚠️  Reset tentatives forcé pour : ${key}`);
    setAttempts(prev => ({ ...prev, [key]: 0 }));
  }, []);

  return {
    ocrState,
    attempts,
    maxAttempts: MAX_ATTEMPTS,
    isBlocked,
    scanFile,
    resetOcr,
    resetAttempts,  
  };
}