// ============================================================
//  backend/src/customer/onboarding-verification.service.ts
//
//  ✅ VerifPID corrigé :
//     Un utilisateur est considéré comme "client ATB existant"
//     UNIQUEMENT s'il a généré son contrat (statut SUBMITTED ou APPROVED)
//     
//     Les statuts intermédiaires (PENDING_OTP, FATCA_PENDING, 
//     DOCUMENTS_PENDING, PERSONAL_PENDING) ne bloquent PAS
//     car l'utilisateur n'a pas finalisé son inscription
// ============================================================

import {
  Injectable, NotFoundException, BadRequestException, Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, In } from 'typeorm';
import { Customer, CustomerStatus } from './entities/customer.entity';

const axios = require('axios');

export interface VerificationResult {
  success: boolean;
  message: string;
  details?: Record<string, any>;
}

// ── Statuts considérés comme "client ATB actif" ──────────────
// ✅ MODIFICATION : Seuls les statuts de dossier COMPLÈTEMENT finalisé
//    Un client n'est considéré comme "client ATB existant" que si :
//    - SUBMITTED : dossier soumis (contrat généré)
//    - APPROVED  : dossier approuvé
//    
//    Les statuts intermédiaires (PENDING_OTP, FATCA_PENDING, 
//    DOCUMENTS_PENDING, PERSONAL_PENDING) ne comptent PAS
//    car l'utilisateur n'a pas terminé le processus complet
//    (il peut reprendre son dossier là où il s'est arrêté)
const ACTIVE_CLIENT_STATUSES: CustomerStatus[] = [
  CustomerStatus.SUBMITTED,   // ✅ Dossier finalisé et soumis
  CustomerStatus.APPROVED,    // ✅ Dossier approuvé par la banque
  // ❌ SUPPRIMÉ : PENDING_OTP, FATCA_PENDING, DOCUMENTS_PENDING, PERSONAL_PENDING
];

// ── FCM SCAN : mots-clés propres (min 4 chars, trim) ─────────
const FCM_BLOCKED_KEYWORDS: string[] = [
  'ben ali',
  'zine el abidine',
  'trabelsi',
  'gaddafi',
  'moubarak',
  'saddam hussein',
  'bin laden',
  'oussama laden',
  'baghdadi','ghanouchi','tarabouli',
  // Arabes
  'بن علي',
  'زين العابدين',
  'القذافي',
  'بن لادن',
  'صدام حسين',
  'البغدادي','الغنوشي','الترابي',
].map(k => k.trim()).filter(k => k.length >= 4);

// ── SED : CIN interdites de chéquier (simulation) ────────────
const SED_BLOCKED_CIN = ['01830150', '00000002'];

@Injectable()
export class OnboardingVerificationService {
  private readonly logger = new Logger(OnboardingVerificationService.name);

  private readonly USE_STATIC   = process.env.USE_STATIC_RESPONSES !== 'false';
  private readonly FCM_SCAN_URL = process.env.FCM_SCAN_URL || 'http://banking-api/fcm/scan';
  private readonly SED_URL      = process.env.SED_URL      || 'http://banking-api/sed';
  private readonly FCM_RISK_URL = process.env.FCM_RISK_URL || 'http://banking-api/fcm/risk';

  constructor(
    @InjectRepository(Customer)
    private readonly repo: Repository<Customer>,
  ) {}

  private async findOrFail(id: string): Promise<Customer> {
    const c = await this.repo.findOne({ where: { id } });
    if (!c) throw new NotFoundException(`Customer "${id}" introuvable.`);
    return c;
  }

  private normalizeLatin(s: string): string {
    return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
  }

  private toIsoDate(d: string): string {
    if (!d) return '';
    const [dd, mm, yyyy] = d.split('/');
    return `${yyyy}-${mm}-${dd}`;
  }

  // ════════════════════════════════════════════════════════════
  //  API #1 — verifyOnboarding  (Écran 1)
  //  VerifPID → FCM SCAN → SED
  // ════════════════════════════════════════════════════════════
  async verifyOnboarding(customerId: string): Promise<VerificationResult> {
    const customer = await this.findOrFail(customerId);

    this.logger.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    this.logger.log(`[VERIFY-ONBOARDING] Démarrage`);
    this.logger.log(`  customerId  : ${customerId}`);
    this.logger.log(`  CIN         : ${customer.idCardNumber}`);
    this.logger.log(`  Nom         : ${customer.firstName} ${customer.lastName}`);
    this.logger.log(`  Nom arabe   : ${customer.firstNameArabic ?? ''} ${customer.lastNameArabic ?? ''}`);
    this.logger.log(`  Statut actuel : ${customer.status}`);
    this.logger.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    // ─── 1. VerifPID ─────────────────────────────────────────
    //
    // ✅ NOUVELLE LOGIQUE CORRIGÉE :
    //   Un client est considéré comme "client ATB existant" UNIQUEMENT
    //   s'il a terminé TOUT le processus d'ouverture de compte :
    //   - SUBMITTED : dossier soumis (contrat généré)
    //   - APPROVED  : dossier approuvé
    //
    //   Si un utilisateur a un statut intermédiaire :
    //   - PENDING_OTP      : n'a pas validé son OTP
    //   - FATCA_PENDING    : n'a pas rempli FATCA
    //   - DOCUMENTS_PENDING: n'a pas uploadé les docs
    //   - PERSONAL_PENDING : n'a pas rempli le formulaire perso
    //   
    //   → Ces statuts NE BLOQUENT PAS car l'utilisateur n'a pas
    //     finalisé son inscription → il peut reprendre son dossier
    //
    this.logger.log('[VerifPID] Recherche dans la BDD...');
    this.logger.log(`[VerifPID] Statuts "client actif" recherchés : ${ACTIVE_CLIENT_STATUSES.join(', ')}`);
    this.logger.log(`[VerifPID] ⚠️ Les statuts intermédiaires (PENDING_OTP, FATCA_PENDING, etc.) ne bloquent PAS`);
    
    {
      // Rechercher un client existant avec la même CIN
      // ET qui a COMPLÈTEMENT finalisé son dossier (SUBMITTED ou APPROVED)
      const existingClient = await this.repo.findOne({
        where: {
          idCardNumber: customer.idCardNumber,
          id:     Not(customerId),          // exclure le customer courant
          status: In(ACTIVE_CLIENT_STATUSES), // ✅ UNIQUEMENT les statuts finalisés
        },
      });

      if (existingClient) {
        this.logger.warn(`[VerifPID] ❌ BLOQUÉ — Client ATB existant trouvé en BDD (dossier finalisé)`);
        this.logger.warn(`  ID trouvé  : ${existingClient.id}`);
        this.logger.warn(`  Statut     : ${existingClient.status} (dossier finalisé)`);
        this.logger.warn(`  Nom        : ${existingClient.firstName} ${existingClient.lastName}`);
        return {
          success: false,
          message: 'Cette carte d\'identité est déjà associée à un compte ATB. Il n\'est pas possible d\'ouvrir un deuxième compte.',
          details: {
            step:               'VERIF_PID',
            blocked:            true,
            existingCustomerId: existingClient.id,
            existingStatus:     existingClient.status,
          },
        };
      }

      // Vérifier les dossiers non finalisés avec la même CIN
      // (PENDING_OTP, FATCA_PENDING, DOCUMENTS_PENDING, PERSONAL_PENDING)
      const intermediateStatuses: CustomerStatus[] = [
        CustomerStatus.PENDING_OTP,
        CustomerStatus.FATCA_PENDING,
        CustomerStatus.DOCUMENTS_PENDING,
        CustomerStatus.PERSONAL_PENDING,
      ];
      
      const existingDraft = await this.repo.findOne({
        where: {
          idCardNumber: customer.idCardNumber,
          id:     Not(customerId),
          status: In(intermediateStatuses),
        },
      });

      if (existingDraft) {
        this.logger.log(`[VerifPID] ℹ️  Un dossier non finalisé avec la même CIN existe`);
        this.logger.log(`[VerifPID]    → ID: ${existingDraft.id}`);
        this.logger.log(`[VerifPID]    → Statut: ${existingDraft.status} (processus non terminé)`);
        this.logger.log(`[VerifPID]    → L'utilisateur a quitté le processus avant finalisation`);
        this.logger.log(`[VerifPID]    → On laisse passer pour qu'il puisse créer un NOUVEAU dossier`);
      }

      this.logger.log('[VerifPID] ✅ OK — Aucun client ATB existant avec cette CIN');
    }

    // ─── 2. FCM SCAN ─────────────────────────────────────────
    this.logger.log('[FCM SCAN] Vérification des noms...');
    {
      let blocked   = false;
      let matchedKw = '';

      if (this.USE_STATIC) {
        const latinFull  = this.normalizeLatin(`${customer.firstName} ${customer.lastName}`);
        const arabicFull = `${customer.firstNameArabic ?? ''} ${customer.lastNameArabic ?? ''}`.trim();

        this.logger.log(`[FCM SCAN] Nom latin normalisé : "${latinFull}"`);
        this.logger.log(`[FCM SCAN] Nom arabe           : "${arabicFull}"`);
        this.logger.log(`[FCM SCAN] Nb mots-clés testés : ${FCM_BLOCKED_KEYWORDS.length}`);

        for (const kw of FCM_BLOCKED_KEYWORDS) {
          const isArabic = /[\u0600-\u06FF]/.test(kw);
          if (isArabic) {
            if (arabicFull.includes(kw)) {
              blocked = true; matchedKw = kw;
              this.logger.warn(`[FCM SCAN] ❌ Match arabe : "${kw}" dans "${arabicFull}"`);
              break;
            }
          } else {
            const nkw = this.normalizeLatin(kw);
            if (latinFull.includes(nkw)) {
              blocked = true; matchedKw = kw;
              this.logger.warn(`[FCM SCAN] ❌ Match latin : "${nkw}" dans "${latinFull}"`);
              break;
            }
          }
        }

        if (!blocked) {
          this.logger.log('[FCM SCAN] ✅ OK — Aucun mot-clé ne correspond');
        }

      } else {
        const { data } = await axios.post(this.FCM_SCAN_URL, {
          incorporation_country: 'TN', organization_code: 'AG',
          tax_registration_code: customer.idCardNumber,
          entity_type: 'individual',
          birth_date: this.toIsoDate(customer.birthDate),
          country: 'TN', type: 'string', value: 'string',
          first_name: customer.firstName,
          full_name: `${customer.firstName} ${customer.lastName}`,
          language: 'en', last_name: customer.lastName,
          relation_type: 'string', gateway: 'ONBOARDING',
          mandator: 'TN0010002', requester: 'CUSTOMER', version: '1.0',
        }, { timeout: 10000 }).catch((e: any) => {
          throw new BadRequestException(`FCM SCAN: ${e.message}`);
        });
        blocked = data?.scan_response?.status !== 'OK';
        this.logger.log(`[FCM SCAN] Réponse API : status=${data?.scan_response?.status}`);
      }

      if (blocked) {
        return {
          success: false,
          message: 'Votre dossier ne peut pas être traité en ligne. Veuillez vous présenter directement en agence ATB muni de vos documents d\'identité.',
          details: { step: 'FCM_SCAN', blocked: true, matchedKeyword: matchedKw },
        };
      }
    }

    // ─── 3. SED ──────────────────────────────────────────────
    this.logger.log('[SED] Vérification interdiction chéquier...');
    {
      let blocked = false;

      if (this.USE_STATIC) {
        blocked = SED_BLOCKED_CIN.includes(customer.idCardNumber);
        this.logger.log(`[SED] CIN="${customer.idCardNumber}" dans SED_BLOCKED_CIN : ${blocked}`);
      } else {
        const { data } = await axios.post(
          this.SED_URL, { cin: customer.idCardNumber }, { timeout: 10000 },
        ).catch((e: any) => { throw new BadRequestException(`SED: ${e.message}`); });
        const cci = data?.Bct_Reponse?.[0]?.domaine_cci ?? [];
        blocked   = data?.Bct_code_ret !== 'BCTWS000' || cci.length > 0;
        this.logger.log(`[SED] Bct_code_ret=${data?.Bct_code_ret} domaine_cci.length=${cci.length}`);
      }

      if (blocked) {
        this.logger.warn('[SED] ❌ BLOQUÉ — Restriction bancaire détectée');
        return {
          success: false,
          message: 'Votre dossier présente une restriction bancaire. Veuillez contacter votre agence ATB pour régulariser votre situation.',
          details: { step: 'SED', blocked: true },
        };
      }

      this.logger.log('[SED] ✅ OK — Aucune restriction');
    }

    this.logger.log('[VERIFY-ONBOARDING] ✅ TOUTES LES VÉRIFICATIONS PASSÉES');
    this.logger.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    return {
      success: true,
      message: 'Vérification réussie. Vous pouvez continuer votre demande.',
      details: { verifPid: 'OK', fcmScan: 'OK', sed: 'OK' },
    };
  }

  // ════════════════════════════════════════════════════════════
  //  API #2 — verifyRisk  (Écran 2)
  //  FCM RISK : toujours LR statique pour le PFE
  // ════════════════════════════════════════════════════════════
  async verifyRisk(customerId: string): Promise<VerificationResult> {
    const customer = await this.findOrFail(customerId);

    this.logger.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    this.logger.log(`[VERIFY-RISK] Démarrage pour customer=${customerId}`);

    let riskStatus = 'LR';

    if (this.USE_STATIC) {
      riskStatus = 'LR';
      this.logger.log('[FCM RISK][STATIC] riskStatus=LR — passe toujours');
    } else {
      const title = customer.gender === 'M' ? 'Mr' : 'Mrs';
      const { data } = await axios.post(this.FCM_RISK_URL, {
        application: 'FCM', bankId2: '1001', birthCountry: 'TN',
        birthDate: `${this.toIsoDate(customer.birthDate)} 00:00:00`,
        branch: 'TN0010002', careOf: 'false', closed: 'false',
        company: 'TN0010002',
        coreData1: '0.5', coreData2: '0.5', coreData3: '0.5',
        coreData4: '0.5', coreData5: '0.5',
        country: customer.countryOfResidence === 'Tunisie' ? 'TN' : customer.countryOfResidence,
        customerId: '-1',
        firstName: `${customer.firstName} ${customer.lastName}`,
        name: `${customer.firstName} ${customer.lastName}`,
        nationalId: customer.idCardNumber, occupation: '1111',
        pep: 'false', segmentCode: '1001',
        telephoneNumberFix: customer.phoneNumber || '00000000',
        telephoneNumberMobile: customer.phoneNumber || '00000000',
        title, typeId: 'T24', natCountry: 'TN',
      }, { timeout: 10000 })
      .catch((e: any) => { throw new BadRequestException(`FCM RISK: ${e.message}`); });
      riskStatus = data?.riskStatus;
      this.logger.log(`[FCM RISK] riskStatus=${riskStatus}`);
    }

    if (riskStatus !== 'LR') {
      this.logger.warn(`[FCM RISK] ❌ BLOQUÉ — riskStatus=${riskStatus}`);
      return {
        success: false,
        message: 'Votre profil ne répond pas aux critères d\'éligibilité pour l\'ouverture d\'un compte en ligne. Veuillez vous rendre en agence ATB.',
        details: { step: 'FCM_RISK', blocked: true, riskStatus },
      };
    }

    this.logger.log('[VERIFY-RISK] ✅ Low Risk — dossier éligible');
    this.logger.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    return {
      success: true,
      message: 'Évaluation du risque réussie. Votre dossier est éligible.',
      details: { fcmRisk: 'OK', riskStatus: 'LR', riskLevel: 0 },
    };
  }
}