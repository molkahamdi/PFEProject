// ============================================================
//  frontend/screens/ContractScreen.tsx
//  ✅ Affiche le PDF via PDF.js dans WebView (compatible iOS)
//  ✅ Fonctionne en réseau local sans Google
//  ✅ Boutons téléchargement activés après lecture
// ============================================================
import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  Image, StatusBar, Alert, ActivityIndicator, Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';
import colors from '../../constants/colors';
import { NavigationProp, RouteProp } from '../types/navigation';

type Props = {
  navigation: NavigationProp<'ContractScreen'>;
  route: RouteProp<'ContractScreen'>;
};

const BASE_URL = 'http://172.20.10.2:3000';

// ── Header ────────────────────────────────────────────────────
const Header: React.FC = () => (
  <View style={styles.header}>
    <View style={styles.headerLeft}>
      <LinearGradient colors={[colors.atb.red, colors.atb.red]} style={styles.logoGradient}>
        <Image source={require('../assets/atb.png')} style={styles.logo} resizeMode="contain" />
      </LinearGradient>
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

// ── PhaseIndicator ────────────────────────────────────────────
const PhaseIndicator: React.FC = () => {
  const phases = [
    { id: 1, label: 'Données personnelles' },
    { id: 2, label: 'Documents justificatifs' },
    { id: 3, label: 'Résumé de la demande' },
    { id: 4, label: 'Envoi de la demande' },
    { id: 5, label: 'Signature électronique' },
  ];
  return (
    <View style={styles.phaseContainer}>
      {phases.map((phase, index) => (
        <React.Fragment key={phase.id}>
          <View style={styles.phaseItem}>
            <View style={[
              styles.phaseRadioOuter,
              phase.id < 4 && styles.phaseRadioCompleted,
              phase.id === 4 && styles.phaseRadioActive,
            ]}>
              {phase.id < 4
                ? <Text style={styles.phaseRadioCheck}>✓</Text>
                : <View style={[styles.phaseRadioInner, phase.id === 4 && styles.phaseRadioInnerActive]} />
              }
            </View>
            <Text style={[
              styles.phaseLabel,
              phase.id === 4 && styles.phaseLabelActive,
              phase.id < 4  && styles.phaseLabelCompleted,
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

// ── Composant principal ───────────────────────────────────────
const ContractScreen: React.FC<Props> = ({ navigation, route }) => {
  const { customerId } = route.params;

  const [pdfBase64,         setPdfBase64]         = useState<string | null>(null);// PDF encodé en base64 pour affichage dans WebView
  const [isLoadingPdf,      setIsLoadingPdf]      = useState(true);// Indique si le PDF est en cours de chargement
  const [loadError,         setLoadError]         = useState(false);
  const [hasRead,           setHasRead]           = useState(false);
  const [isDownloadingPdf,  setIsDownloadingPdf]  = useState(false);
  const [isDownloadingDocx, setIsDownloadingDocx] = useState(false);

  const pdfUrl  = `${BASE_URL}/customer/${customerId}/contract/pdf`;
  const docxUrl = `${BASE_URL}/customer/${customerId}/contract/docx`;

  // ── Charger le PDF et le convertir en base64 ─────────────
  useEffect(() => {
    loadPdf();
  }, [customerId]);

  const loadPdf = async () => { 
    setIsLoadingPdf(true);
    setLoadError(false);
    setPdfBase64(null);
    try {
      const response = await fetch(pdfUrl);// Récupérer le PDF depuis le backend
      if (!response.ok) throw new Error(`Erreur serveur : ${response.status}`);
      const arrayBuffer = await response.arrayBuffer();
      const base64      = arrayBufferToBase64(arrayBuffer);
      setPdfBase64(base64);
    } catch (err: any) {
      console.error('[ContractScreen] Erreur chargement PDF:', err);
      setLoadError(true);
    } finally {
      setIsLoadingPdf(false);
    }
  };

  // ── ArrayBuffer → base64 (compatible iOS/Android) ──────── 
  // arrayBufferToBase64 est nécessaire pour afficher le PDF dans WebView sans passer par un URL, ce qui garantit la compatibilité iOS (qui bloque souvent les URLs locales) et évite les problèmes de CORS.
  //arrayBuffer est la réponse brute du fetch du PDF, et base64 est la chaîne encodée que nous injectons dans le HTML de la WebView pour que PDF.js puisse l'afficher.
  const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {// Convertit un ArrayBuffer en chaîne base64 pour affichage dans WebView
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  // ── HTML avec PDF.js pour afficher le PDF ────────────────
  // PDF.js est chargé depuis CDN — compatible iOS WebView
  //CDN est un réseau de serveurs qui distribue des fichiers statiques (comme des bibliothèques JavaScript) pour les rendre plus rapides à charger. En utilisant PDF.js depuis un CDN, nous évitons d'avoir à l'inclure dans notre projet et nous assurons que la dernière version stable est utilisée.
  const getPdfJsHtml = (base64: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { width: 100%; height: 100%; background: #525659; overflow: hidden; }
    #pdf-container {
      width: 100%;
      height: 100%;
      overflow-y: auto;
      overflow-x: hidden;
      -webkit-overflow-scrolling: touch;
    }
    canvas {
      display: block;
      margin: 8px auto;
      box-shadow: 0 2px 8px rgba(0,0,0,0.4);
      max-width: 100%;
    }
    #loading {
      color: white;
      text-align: center;
      padding: 40px;
      font-family: sans-serif;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div id="pdf-container">
    <div id="loading">Chargement du contrat...</div>
  </div>

  <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
  <script>
    pdfjsLib.GlobalWorkerOptions.workerSrc =
      'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

    const base64 = '${base64}';
    const binary = atob(base64);
    const bytes  = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);

    pdfjsLib.getDocument({ data: bytes }).promise.then(function(pdf) {
      document.getElementById('loading').remove();
      const container = document.getElementById('pdf-container');
      const totalPages = pdf.numPages;
      let pagesRendered = 0;

      for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
        pdf.getPage(pageNum).then(function(page) {
          const viewport = page.getViewport({ scale: window.devicePixelRatio || 1.5 });
          const canvas   = document.createElement('canvas');
          canvas.width   = viewport.width;
          canvas.height  = viewport.height;
          canvas.style.width  = '100%';
          canvas.style.height = 'auto';
          container.appendChild(canvas);

          page.render({
            canvasContext: canvas.getContext('2d'),
            viewport: viewport,
          }).promise.then(function() {
            pagesRendered++;
            // Notifier React Native que le PDF est chargé
            if (pagesRendered === totalPages && window.ReactNativeWebView) {
              window.ReactNativeWebView.postMessage('PDF_LOADED');
            }
          });
        });
      }
    }).catch(function(err) {
      document.getElementById('loading').textContent = 'Erreur : ' + err.message;
    });

    // Détecter le scroll pour activer les boutons
    document.getElementById('pdf-container').addEventListener('scroll', function() {
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage('PDF_SCROLLED');
      }
    });
  </script>
</body>
</html>
  `;

  // ── Télécharger PDF ──────────────────────────────────────
  const handleDownloadPdf = async () => {
    setIsDownloadingPdf(true);
    try {
      const supported = await Linking.canOpenURL(pdfUrl);
      if (!supported) throw new Error("Impossible d'ouvrir ce lien.");
      await Linking.openURL(pdfUrl);
    } catch (err: any) {
      Alert.alert('Erreur', err.message || 'Impossible de télécharger.', [{ text: 'OK' }]);
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  // ── Télécharger DOCX ─────────────────────────────────────
  const handleDownloadDocx = async () => {
    setIsDownloadingDocx(true);
    try {
      const supported = await Linking.canOpenURL(docxUrl);
      if (!supported) throw new Error("Impossible d'ouvrir ce lien.");
      await Linking.openURL(docxUrl);
    } catch (err: any) {
      Alert.alert('Erreur', err.message || 'Impossible de télécharger.', [{ text: 'OK' }]);
    } finally {
      setIsDownloadingDocx(false);
    }
  };

  // ── Messages du WebView ──────────────────────────────────
  const handleWebViewMessage = (event: any) => {
    const msg = event.nativeEvent.data;
    if (msg === 'PDF_SCROLLED' || msg === 'PDF_LOADED') {
      setHasRead(true);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.neutral.gray100} />
      <Header />

      {/* ── Titre + Phase ── */}
      <View style={styles.titleSection}>
        <Text style={styles.title}>Votre convention DIGIPACK</Text>
        <Text style={styles.subtitle}>
          Lisez attentivement votre contrat avant de le télécharger.
        </Text>
        <PhaseIndicator />
      </View>

      {/* ── Bandeau instruction ── */}
      <View style={styles.readBanner}>
        <Ionicons name="eye-outline" size={16} color={colors.atb.red} />
        <Text style={styles.readBannerText}>
          Faites défiler pour lire l'intégralité du contrat
        </Text>
      </View>

      {/* ── Zone contrat ── */}
      <View style={styles.webViewContainer}>

        {/* Chargement initial */}
        {isLoadingPdf && (
          <View style={styles.centerBox}>
            <ActivityIndicator size="large" color={colors.atb.red} />
            <Text style={styles.centerText}>Préparation de votre contrat...</Text>
            <Text style={styles.centerSubText}>Cela peut prendre quelques secondes</Text>
          </View>
        )}

        {/* Erreur */}
        {!isLoadingPdf && loadError && (
          <View style={styles.centerBox}>
            <Ionicons name="alert-circle-outline" size={52} color={colors.neutral.gray400} />
            <Text style={styles.errorTitle}>Impossible d'afficher le contrat</Text>
            <Text style={styles.errorText}>
              Vérifiez que le backend est démarré et réessayez.
            </Text>
            <TouchableOpacity style={styles.retryButton} onPress={loadPdf}>
              <Text style={styles.retryText}>Réessayer</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* PDF via PDF.js */}
        {!isLoadingPdf && !loadError && pdfBase64 && (
          <WebView
            source={{ html: getPdfJsHtml(pdfBase64) }}
            style={styles.webView}
            onMessage={handleWebViewMessage}
            javaScriptEnabled
            domStorageEnabled
            scrollEnabled
            originWhitelist={['*']}
          />
        )}
      </View>

      {/* ── Barre du bas — boutons ── */}
      <View style={styles.bottomBar}>
        {!hasRead && !isLoadingPdf && !loadError && (
          <View style={styles.scrollHint}>
            <Ionicons name="arrow-down-outline" size={13} color={colors.neutral.gray500} />
            <Text style={styles.scrollHintText}>
              Faites défiler le contrat pour activer le téléchargement
            </Text>
          </View>
        )}

        <View style={styles.downloadRow}>
          {/* PDF */}
          <TouchableOpacity
            onPress={handleDownloadPdf}
            style={styles.downloadBtnPdf}
            disabled={isDownloadingPdf || !hasRead}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={hasRead ? [colors.atb.red, '#C41E3A'] : ['#ccc', '#aaa']}
              style={styles.downloadBtnGradient}
            >
              {isDownloadingPdf
                ? <ActivityIndicator color="#fff" size="small" />
                : <>
                    <Ionicons name="document-outline" size={20} color="#fff" />
                    <Text style={styles.downloadBtnText}>Télécharger PDF</Text>
                  </>
              }
            </LinearGradient>
          </TouchableOpacity>

          {/* DOCX */}
          <TouchableOpacity
            onPress={handleDownloadDocx}
            style={[
              styles.downloadBtnDocx,
              !hasRead && { borderColor: colors.neutral.gray300 },
            ]}
            disabled={isDownloadingDocx || !hasRead}
            activeOpacity={0.85}
          >
            {isDownloadingDocx
              ? <ActivityIndicator color={colors.atb.red} size="small" />
              : <>
                  <Ionicons
                    name="logo-windows"
                    size={20}
                    color={hasRead ? colors.atb.red : colors.neutral.gray400}
                  />
                  <Text style={[
                    styles.downloadBtnDocxText,
                    !hasRead && { color: colors.neutral.gray400 },
                  ]}>
                    Word
                  </Text>
                </>
            }
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

// ── Styles ────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.neutral.white },

  header:       { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.neutral.gray300, backgroundColor: colors.neutral.gray100 },
  headerLeft:   { flexDirection: 'row', alignItems: 'center', gap: 12 },
  logo:         { width: 38, height: 38 },
  logoGradient: { width: 42, height: 42, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  bankName:     { fontSize: 15, fontWeight: '700', color: colors.atb.red },
  bankSubtitle: { fontSize: 10, color: colors.neutral.gray500, marginTop: 2 },
  digipackBadge:{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: 4 },
  digipackText: { fontSize: 10, fontWeight: '800', color: '#fff', letterSpacing: 2 },

  titleSection: { paddingHorizontal: 20, paddingTop: 14, paddingBottom: 10 },
  title:        { fontSize: 20, fontWeight: '700', color: colors.neutral.gray900, marginBottom: 4 },
  subtitle:     { fontSize: 12, color: colors.neutral.gray600, marginBottom: 10 },

  phaseContainer:       { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', paddingVertical: 4 },
  phaseItem:            { alignItems: 'center', flex: 1 },
  phaseRadioOuter:      { width: 18, height: 18, borderRadius: 9, borderWidth: 2, borderColor: colors.neutral.gray400, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  phaseRadioInner:      { width: 8, height: 8, borderRadius: 4, backgroundColor: 'transparent' },
  phaseRadioInnerActive:{ backgroundColor: colors.atb.red },
  phaseRadioActive:     { borderColor: colors.atb.red },
  phaseRadioCompleted:  { borderColor: colors.atb.red, backgroundColor: colors.atb.red },
  phaseRadioCheck:      { fontSize: 10, color: '#fff', fontWeight: 'bold' },
  phaseLabel:           { fontSize: 9, color: colors.neutral.gray600, fontWeight: '500', textAlign: 'center' },
  phaseLabelActive:     { color: colors.atb.red, fontWeight: '700' },
  phaseLabelCompleted:  { color: colors.neutral.gray800, fontWeight: '600' },
  phaseConnector:       { width: 16, height: 2, backgroundColor: colors.neutral.gray300, alignSelf: 'center', marginTop: -8 },

  readBanner:     { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 20, paddingVertical: 10, backgroundColor: 'rgba(200,35,51,0.05)', borderTopWidth: 1, borderBottomWidth: 1, borderColor: 'rgba(200,35,51,0.15)' },
  readBannerText: { flex: 1, fontSize: 12, color: colors.atb.red, fontWeight: '600' },

  webViewContainer: { flex: 1 },
  webView:          { flex: 1 },

  centerBox:     { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32, gap: 14 },
  centerText:    { fontSize: 15, fontWeight: '600', color: colors.neutral.gray700 },
  centerSubText: { fontSize: 12, color: colors.neutral.gray500 },
  errorTitle:    { fontSize: 16, fontWeight: '700', color: colors.neutral.gray800 },
  errorText:     { fontSize: 13, color: colors.neutral.gray600, textAlign: 'center', lineHeight: 19 },
  retryButton:   { marginTop: 4, paddingHorizontal: 28, paddingVertical: 12, backgroundColor: colors.atb.red, borderRadius: 8 },
  retryText:     { fontSize: 14, fontWeight: '700', color: '#fff' },

  bottomBar:      { paddingHorizontal: 16, paddingTop: 10, paddingBottom: 16, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: colors.neutral.gray200, shadowColor: '#000', shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 8 },
  scrollHint:     { flexDirection: 'row', alignItems: 'center', gap: 6, justifyContent: 'center', marginBottom: 8 },
  scrollHintText: { fontSize: 11, color: colors.neutral.gray500 },

  downloadRow:         { flexDirection: 'row', gap: 10 },
  downloadBtnPdf:      { flex: 1, borderRadius: 10, overflow: 'hidden', shadowColor: colors.atb.red, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.25, shadowRadius: 6, elevation: 4 },
  downloadBtnGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16 },
  downloadBtnText:     { fontSize: 14, fontWeight: '700', color: '#fff' },
  downloadBtnDocx:     { flex: 1, borderRadius: 10, borderWidth: 2, borderColor: colors.atb.red, backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16 },
  downloadBtnDocxText: { fontSize: 14, fontWeight: '700', color: colors.atb.red },
});

export default ContractScreen;