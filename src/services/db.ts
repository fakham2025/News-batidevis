/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// ============================================================================
// MODÈLE DE DONNÉES CONFORME AU SCHÉMA SUPABASE & STOCKAGE OFFLINE-FIRST (P0)
// ============================================================================

export interface Profile {
  id: string;
  company_name: string;
  siret?: string;
  address?: string;
  phone?: string;
  email?: string;
  tva_number?: string;
  insurance_info?: string; // ex: "Assurance décennale AXA n° 849204..."
  is_tva_subject: boolean; // false = mention art. 293 B du CGI
  trade: string; // Métier principal (Plomberie, Électricité, etc.)
  logo_url?: string; // Data URL ou image de l'entreprise
  document_prefix?: string; // ex: "DEV-2026-"
  created_at: string;
}

export interface Client {
  id: string;
  user_id: string;
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  created_at: string;
}

export interface Item {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  unit_price: number;
  unit: 'heure' | 'm²' | 'ml' | 'forfait' | 'unité';
  created_at: string;
}

export interface Kit {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  category: 'Plomberie & CVC' | 'Électricité' | 'Peinture & Finitions' | 'Menuiserie & Agencement' | 'Gros Œuvre & Maçonnerie';
  is_active: boolean;
  items: KitItem[];
  created_at: string;
}

export interface KitItem {
  id: string;
  kit_id: string;
  item_id?: string;
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
  unit?: string;
}

export type DocumentType = 'devis' | 'facture';
export type DocumentStatus = 'brouillon' | 'brouillon_local' | 'envoye' | 'accepte' | 'paye' | 'refuse';

export interface DocumentItem {
  id: string;
  document_id: string;
  kit_id?: string | null;
  description: string;
  quantity: number;
  unit_price: number;
  unit?: string;
  tva_rate: number; // 0, 5.5, 10, 20
  total: number;
  position: number;
}

export interface TvaBreakdownItem {
  rate: number;
  base_ht: number;
  tva_amount: number;
}

export interface Document {
  id: string;
  user_id: string;
  client_id: string;
  client_name: string;
  client_address?: string;
  client_email?: string;
  client_phone?: string;
  type: DocumentType;
  document_number: string;
  date: string;
  due_date?: string;
  status: DocumentStatus;
  notes?: string;
  footer?: string; // Mentions légales auto (art 293 B ou décennale)
  logo_url?: string;
  tva_rate_default: number; // 10% par défaut pour réno, ou 0% si franchise
  discount_type?: 'percent' | 'fixed';
  discount_value?: number;
  discount_amount?: number;
  deposit_rate?: number; // ex: 30%
  deposit_amount?: number;
  balance_due?: number;
  validity_days?: number; // ex: 30 jours
  work_start_date?: string;
  tva_breakdown?: TvaBreakdownItem[];
  total_ht: number;
  total_tva: number;
  total_ttc: number;
  signed_at?: string | null;
  signature_svg?: string | null;
  synced_at?: string | null; // null = créé hors-ligne sur chantier
  created_at: string;
  items: DocumentItem[];
}

export interface WaitlistEntry {
  id: string;
  prenom: string;
  email: string;
  metier: string;
  departement: string;
  statut_tva: 'ae_sans_tva' | 'tva_normale';
  probleme: string;
  source: string; // utm_source
  created_at: string;
  plan: 'beta' | 'fondateur' | 'standard';
  status: 'active' | 'en_attente';
  quota_category: 'plomberie' | 'electricite' | 'finitions' | 'gros_oeuvre';
}

export interface Subscription {
  id: string;
  user_id: string;
  email: string;
  artisan_name: string;
  company_name: string;
  siret?: string;
  trade: string;
  plan: 'beta' | 'fondateur' | 'standard';
  status: 'active' | 'en_attente' | 'resilie';
  monthly_price: number; // 0 (bêta), 9.50 (fondateur), 19.00 (standard)
  notes?: string;
  created_at: string;
}

export interface UserSession {
  role: 'artisan' | 'admin';
  userEmail: string;
  companyName: string;
  plan: 'beta' | 'fondateur' | 'standard';
  isLoggedIn: boolean;
}

export interface ArtisanReportingStats {
  totalRevenueHt: number;
  totalRevenueTtc: number;
  pendingQuotesCount: number;
  pendingQuotesAmount: number;
  acceptedQuotesCount: number;
  acceptedQuotesAmount: number;
  paidInvoicesCount: number;
  paidInvoicesAmount: number;
  depositsCollected: number;
  conversionRate: number;
  statusDistribution: {
    brouillon: number;
    brouillon_local: number;
    envoye: number;
    accepte: number;
    paye: number;
    refuse: number;
  };
}

// Clés de persistance locale offline-first
const STORAGE_PREFIX = 'batidevis_';
const KEY_PROFILE = `${STORAGE_PREFIX}profile`;
const KEY_DOCUMENTS = `${STORAGE_PREFIX}documents`;
const KEY_CLIENTS = `${STORAGE_PREFIX}clients`;
const KEY_KITS = `${STORAGE_PREFIX}kits`;
const KEY_WAITLIST = `${STORAGE_PREFIX}waitlist_v2`;
const KEY_ONLINE_MODE = `${STORAGE_PREFIX}simulated_network`;
const KEY_SUBSCRIPTIONS = `${STORAGE_PREFIX}subscriptions`;
const KEY_SESSION = `${STORAGE_PREFIX}current_session`;

// Profil artisan par défaut (onboarding ou état initial)
export const DEFAULT_PROFILE: Profile = {
  id: 'usr_artisan_demo',
  company_name: 'BatiPro Rénovation',
  siret: '849 204 892 00018',
  address: '14 Rue des Artisans, 44000 Nantes',
  phone: '06 12 34 56 78',
  email: 'contact@batipro-renov.fr',
  tva_number: 'FR84849204892',
  insurance_info: 'Assurance Décennale SMA BTP n° 294021/A (Zone France entière)',
  is_tva_subject: true,
  trade: 'Plomberie & Chauffage',
  created_at: new Date().toISOString()
};

// Catalogue de Kits Chantier prédéfinis pour les corps de métier français (Killer Feature)
export const PRESET_KITS: Kit[] = [
  {
    id: 'kit_plomb_01',
    user_id: 'usr_artisan_demo',
    name: 'Remplacement Chauffe-eau Thermodynamique 200L',
    category: 'Plomberie & CVC',
    description: 'Forfait complet dépose ancien ballon + fourniture nouveau chauffe-eau avec raccordements et groupe de sécurité neuf',
    is_active: true,
    created_at: '2026-01-15T08:00:00Z',
    items: [
      {
        id: 'ki_1',
        kit_id: 'kit_plomb_01',
        description: 'Chauffe-eau thermodynamique 200L classe A+ (NF Électricité Performance)',
        quantity: 1,
        unit_price: 1380.00,
        unit: 'unité',
        total: 1380.00
      },
      {
        id: 'ki_2',
        kit_id: 'kit_plomb_01',
        description: 'Groupe de sécurité inox + siphon + raccords diélectriques cuivre',
        quantity: 1,
        unit_price: 95.00,
        unit: 'forfait',
        total: 95.00
      },
      {
        id: 'ki_3',
        kit_id: 'kit_plomb_01',
        description: 'Main d\'œuvre qualifiée : dépose, fixation murale, raccordements & mise en eau',
        quantity: 4.5,
        unit_price: 65.00,
        unit: 'heure',
        total: 292.50
      },
      {
        id: 'ki_4',
        kit_id: 'kit_plomb_01',
        description: 'Mise en décharge contrôlée et bordereau de suivi déchets BSD',
        quantity: 1,
        unit_price: 45.00,
        unit: 'forfait',
        total: 45.00
      }
    ]
  },
  {
    id: 'kit_elec_01',
    user_id: 'usr_artisan_demo',
    name: 'Rénovation Tableau Électrique 3 Rangées NF C 15-100',
    category: 'Électricité',
    description: 'Mise en sécurité complète : tableau 3x18 modules, interrupteurs différentiels 30mA et disjoncteurs divisionnaires',
    is_active: true,
    created_at: '2026-01-15T08:00:00Z',
    items: [
      {
        id: 'ki_5',
        kit_id: 'kit_elec_01',
        description: 'Coffret modulaire 3 rangées 54 modules avec porte blanche',
        quantity: 1,
        unit_price: 110.00,
        unit: 'unité',
        total: 110.00
      },
      {
        id: 'ki_6',
        kit_id: 'kit_elec_01',
        description: 'Interrupteurs différentiels 30mA (2x Type AC 40A + 1x Type A 40A)',
        quantity: 3,
        unit_price: 78.00,
        unit: 'unité',
        total: 234.00
      },
      {
        id: 'ki_7',
        kit_id: 'kit_elec_01',
        description: 'Lot disjoncteurs divisionnaires calibrés 10A, 16A, 20A et 32A',
        quantity: 12,
        unit_price: 16.50,
        unit: 'unité',
        total: 198.00
      },
      {
        id: 'ki_8',
        kit_id: 'kit_elec_01',
        description: 'Main d\'œuvre repérage circuits, câblage peignes et mise en service',
        quantity: 6,
        unit_price: 68.00,
        unit: 'heure',
        total: 408.00
      }
    ]
  },
  {
    id: 'kit_peint_01',
    user_id: 'usr_artisan_demo',
    name: 'Peinture Murs & Plafonds (Surface 50 m²)',
    category: 'Peinture & Finitions',
    description: 'Préparation soignée des supports, rebouchage, impression et 2 couches de finition satinée lessivable',
    is_active: true,
    created_at: '2026-01-15T08:00:00Z',
    items: [
      {
        id: 'ki_9',
        kit_id: 'kit_peint_01',
        description: 'Protection intégrale du chantier (bâche polyane, ruban de masquage pro)',
        quantity: 1,
        unit_price: 60.00,
        unit: 'forfait',
        total: 60.00
      },
      {
        id: 'ki_10',
        kit_id: 'kit_peint_01',
        description: 'Préparation des fonds : ponçage, ouverture et rebouchage fissures à l\'enduit',
        quantity: 50,
        unit_price: 9.50,
        unit: 'm²',
        total: 475.00
      },
      {
        id: 'ki_11',
        kit_id: 'kit_peint_01',
        description: 'Fourniture & application sous-couche d\'impression régulatrice',
        quantity: 50,
        unit_price: 7.00,
        unit: 'm²',
        total: 350.00
      },
      {
        id: 'ki_12',
        kit_id: 'kit_peint_01',
        description: 'Fourniture & application 2 couches peinture velours acrylique Ecolabel',
        quantity: 50,
        unit_price: 16.00,
        unit: 'm²',
        total: 800.00
      }
    ]
  },
  {
    id: 'kit_menuis_01',
    user_id: 'usr_artisan_demo',
    name: 'Fourniture & Pose 2 Fenêtres PVC Double Vitrage Uw 1.2',
    category: 'Menuiserie & Agencement',
    description: 'Rénovation thermique conforme crédit d\'impôt : dépose totale, étanchéité compriband et habillages alu',
    is_active: true,
    created_at: '2026-01-15T08:00:00Z',
    items: [
      {
        id: 'ki_13',
        kit_id: 'kit_menuis_01',
        description: 'Fenêtre PVC 2 vantaux oscillo-battante 125x100cm verre isolant gaz Argon',
        quantity: 2,
        unit_price: 490.00,
        unit: 'unité',
        total: 980.00
      },
      {
        id: 'ki_14',
        kit_id: 'kit_menuis_01',
        description: 'Kit de pose thermique : compriband classe 1, calfeutrement silicone et fixations vérin',
        quantity: 2,
        unit_price: 65.00,
        unit: 'forfait',
        total: 130.00
      },
      {
        id: 'ki_15',
        kit_id: 'kit_menuis_01',
        description: 'Dépose ancienne menuiserie bois, pose neuve réglage et habillages intérieurs',
        quantity: 6,
        unit_price: 62.00,
        unit: 'heure',
        total: 372.00
      }
    ]
  },
  {
    id: 'kit_macon_01',
    user_id: 'usr_artisan_demo',
    name: 'Dalle Béton Armé Terrasse (25 m² x 12 cm)',
    category: 'Gros Œuvre & Maçonnerie',
    description: 'Terrassement léger, lit de gravier compacté, ferraillage treillis soudé ST25C et coulage béton C25/30',
    is_active: true,
    created_at: '2026-01-15T08:00:00Z',
    items: [
      {
        id: 'ki_16',
        kit_id: 'kit_macon_01',
        description: 'Préparation fond de forme, nivellement et tout-venant compacté (épaisseur 8cm)',
        quantity: 25,
        unit_price: 18.00,
        unit: 'm²',
        total: 450.00
      },
      {
        id: 'ki_17',
        kit_id: 'kit_macon_01',
        description: 'Coffrage périphérique bois + pose film polyane sous dalle',
        quantity: 20,
        unit_price: 12.00,
        unit: 'ml',
        total: 240.00
      },
      {
        id: 'ki_18',
        kit_id: 'kit_macon_01',
        description: 'Ferraillage treillis soudé ST25C calé sur cales PVC',
        quantity: 25,
        unit_price: 9.50,
        unit: 'm²',
        total: 237.50
      },
      {
        id: 'ki_19',
        kit_id: 'kit_macon_01',
        description: 'Fourniture & coulage béton C25/30 toupie avec finition talochée soignée',
        quantity: 3,
        unit_price: 240.00,
        unit: 'forfait',
        total: 720.00
      }
    ]
  }
];

// Documents modèles de départ
export const INITIAL_DOCUMENTS: Document[] = [
  {
    id: 'doc_2026_001',
    user_id: 'usr_artisan_demo',
    client_id: 'cli_01',
    client_name: 'M. Marc Dupont',
    client_address: '14 Rue des Lilas, 69003 Lyon',
    client_email: 'marc.dupont69@gmail.com',
    client_phone: '06 98 76 54 32',
    type: 'devis',
    document_number: 'DEV-2026-084',
    date: '2026-10-18',
    due_date: '2026-11-18',
    status: 'accepte',
    signed_at: '2026-10-18T14:32:00Z',
    signature_svg: 'Bon pour accord - M. Dupont',
    notes: 'Travaux éligibles à la TVA rénovation 10%. Logement achevé depuis plus de 2 ans.',
    footer: 'TVA 10% selon art. 279-0 bis du CGI. Assurance décennale SMA BTP n° 294021/A.',
    tva_rate_default: 10,
    total_ht: 1865.00,
    total_tva: 186.50,
    total_ttc: 2051.50,
    synced_at: '2026-10-18T14:35:00Z',
    created_at: '2026-10-18T14:20:00Z',
    items: [
      {
        id: 'di_1',
        document_id: 'doc_2026_001',
        kit_id: 'kit_plomb_01',
        description: 'Chauffe-eau 200L Thermodynamique classe A+ avec raccords isolés',
        quantity: 1,
        unit_price: 1420.00,
        unit: 'unité',
        tva_rate: 10,
        total: 1420.00,
        position: 0
      },
      {
        id: 'di_2',
        document_id: 'doc_2026_001',
        kit_id: 'kit_plomb_01',
        description: 'Pose & raccordements cuivre avec groupe de sécurité inox neuf',
        quantity: 1,
        unit_price: 380.00,
        unit: 'forfait',
        tva_rate: 10,
        total: 380.00,
        position: 1
      },
      {
        id: 'di_3',
        document_id: 'doc_2026_001',
        kit_id: 'kit_plomb_01',
        description: 'Évacuation anciens matériels et recyclage avec bordereau BSD',
        quantity: 1,
        unit_price: 65.00,
        unit: 'forfait',
        tva_rate: 10,
        total: 65.00,
        position: 2
      }
    ]
  },
  {
    id: 'doc_2026_002',
    user_id: 'usr_artisan_demo',
    client_id: 'cli_02',
    client_name: 'Mme Sophie Laurent',
    client_address: '28 Boulevard Chave, 13005 Marseille',
    client_email: 'sophie.laurent@orange.fr',
    client_phone: '06 45 12 78 90',
    type: 'devis',
    document_number: 'DEV-2026-085',
    date: '2026-10-20',
    due_date: '2026-11-20',
    status: 'envoye',
    notes: 'Devis envoyé par email et WhatsApp. En attente de signature.',
    footer: 'TVA 10% selon art. 279-0 bis du CGI. Assurance décennale SMA BTP n° 294021/A.',
    tva_rate_default: 10,
    total_ht: 950.00,
    total_tva: 95.00,
    total_ttc: 1045.00,
    synced_at: null, // Créé hors-ligne sur chantier !
    created_at: '2026-10-20T09:15:00Z',
    items: [
      {
        id: 'di_4',
        document_id: 'doc_2026_002',
        kit_id: 'kit_elec_01',
        description: 'Mise en conformité différentielle 30mA tableau principal',
        quantity: 1,
        unit_price: 550.00,
        unit: 'forfait',
        tva_rate: 10,
        total: 550.00,
        position: 0
      },
      {
        id: 'di_5',
        document_id: 'doc_2026_002',
        description: 'Création ligne dédiée 32A pour plaque induction sous goulotte',
        quantity: 1,
        unit_price: 400.00,
        unit: 'forfait',
        tva_rate: 10,
        total: 400.00,
        position: 1
      }
    ]
  }
];

// Helper : Calcul financier certifié BTP (multi-TVA, remises, et acompte 30%)
export function calculateDocumentFinancials(
  items: DocumentItem[],
  isTvaSubject: boolean,
  discountType: 'none' | 'percent' | 'fixed' = 'none',
  discountValue: number = 0,
  depositRate: number = 30
): {
  raw_total_ht: number;
  discount_amount: number;
  net_total_ht: number;
  tva_breakdown: TvaBreakdownItem[];
  total_tva: number;
  total_ttc: number;
  deposit_amount: number;
  balance_due: number;
} {
  const raw_total_ht = Math.round(
    items.reduce((acc, it) => acc + (it.quantity * it.unit_price), 0) * 100
  ) / 100;

  let discount_amount = 0;
  if (discountType === 'percent' && discountValue > 0) {
    discount_amount = Math.round(raw_total_ht * (Math.min(100, Math.max(0, discountValue)) / 100) * 100) / 100;
  } else if (discountType === 'fixed' && discountValue > 0) {
    discount_amount = Math.round(Math.min(raw_total_ht, Math.max(0, discountValue)) * 100) / 100;
  }

  const net_total_ht = Math.round(Math.max(0, raw_total_ht - discount_amount) * 100) / 100;

  // Si l'artisan n'est pas assujetti à la TVA (art. 293 B)
  if (!isTvaSubject) {
    const total_ttc = net_total_ht;
    const deposit_amount = Math.round(total_ttc * (Math.max(0, Math.min(100, depositRate)) / 100) * 100) / 100;
    const balance_due = Math.round((total_ttc - deposit_amount) * 100) / 100;

    return {
      raw_total_ht,
      discount_amount,
      net_total_ht,
      tva_breakdown: [{ rate: 0, base_ht: net_total_ht, tva_amount: 0 }],
      total_tva: 0,
      total_ttc,
      deposit_amount,
      balance_due
    };
  }

  // Ventilation TVA proportionnelle
  const discountRatio = raw_total_ht > 0 ? (net_total_ht / raw_total_ht) : 1;
  const ratesMap = new Map<number, number>();

  items.forEach(it => {
    const rate = Number(it.tva_rate) || 0;
    const itemHt = it.quantity * it.unit_price;
    const currentBase = ratesMap.get(rate) || 0;
    ratesMap.set(rate, currentBase + itemHt);
  });

  const tva_breakdown: TvaBreakdownItem[] = [];
  let total_tva = 0;

  // Taux standards français ordonnés
  const standardRates = [0, 5.5, 10, 20];
  standardRates.forEach(rate => {
    if (ratesMap.has(rate)) {
      const grossBase = ratesMap.get(rate)!;
      const netBase = Math.round(grossBase * discountRatio * 100) / 100;
      const tva = Math.round(netBase * (rate / 100) * 100) / 100;
      tva_breakdown.push({
        rate,
        base_ht: netBase,
        tva_amount: tva
      });
      total_tva += tva;
    }
  });

  total_tva = Math.round(total_tva * 100) / 100;
  const total_ttc = Math.round((net_total_ht + total_tva) * 100) / 100;
  const deposit_amount = Math.round(total_ttc * (Math.max(0, Math.min(100, depositRate)) / 100) * 100) / 100;
  const balance_due = Math.round((total_ttc - deposit_amount) * 100) / 100;

  return {
    raw_total_ht,
    discount_amount,
    net_total_ht,
    tva_breakdown,
    total_tva,
    total_ttc,
    deposit_amount,
    balance_due
  };
}

// Helper : Initialisation ou lecture du profil artisan
export function getSavedProfile(): Profile {
  if (typeof window === 'undefined') return DEFAULT_PROFILE;
  try {
    const raw = localStorage.getItem(KEY_PROFILE);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Erreur lecture profil local:', e);
  }
  return DEFAULT_PROFILE;
}

export function saveProfile(profile: Profile): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(KEY_PROFILE, JSON.stringify(profile));
  } catch (e) {
    console.error('Erreur sauvegarde profil:', e);
  }
}

// Helper : Documents (Devis & Factures unifiés avec statuts)
export function getSavedDocuments(): Document[] {
  if (typeof window === 'undefined') return INITIAL_DOCUMENTS;
  try {
    const raw = localStorage.getItem(KEY_DOCUMENTS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Erreur lecture documents locaux:', e);
  }
  // Sauvegarde des documents par défaut
  saveDocuments(INITIAL_DOCUMENTS);
  return INITIAL_DOCUMENTS;
}

export function saveDocuments(docs: Document[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(KEY_DOCUMENTS, JSON.stringify(docs));
  } catch (e) {
    console.error('Erreur sauvegarde documents:', e);
  }
}

export function saveSingleDocument(doc: Document): Document[] {
  const all = getSavedDocuments();
  const idx = all.findIndex(d => d.id === doc.id);
  let updated: Document[];
  if (idx >= 0) {
    updated = [...all];
    updated[idx] = doc;
  } else {
    updated = [doc, ...all];
  }
  saveDocuments(updated);
  return updated;
}

export function deleteDocument(docId: string): Document[] {
  const all = getSavedDocuments();
  const updated = all.filter(d => d.id !== docId);
  saveDocuments(updated);
  return updated;
}

// Helper : Kits Chantier (Killer Feature)
export function getSavedKits(): Kit[] {
  if (typeof window === 'undefined') return PRESET_KITS;
  try {
    const raw = localStorage.getItem(KEY_KITS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Erreur lecture kits locaux:', e);
  }
  saveKits(PRESET_KITS);
  return PRESET_KITS;
}

export function saveKits(kits: Kit[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(KEY_KITS, JSON.stringify(kits));
  } catch (e) {
    console.error('Erreur sauvegarde kits:', e);
  }
}

// Helper : Cohorte Fondateurs & Waitlist
export function getSavedWaitlist(): WaitlistEntry[] {
  if (typeof window === 'undefined') {
    return [
      {
        id: 'fnd_1',
        prenom: 'Julien M.',
        email: 'julien.plomberie.nantes@gmail.com',
        metier: 'Plombier Chauffagiste',
        departement: '44',
        statut_tva: 'tva_normale',
        probleme: 'Perte de temps le soir',
        source: 'linkedin',
        created_at: '2026-10-14T10:12:00Z',
        plan: 'beta',
        status: 'active',
        quota_category: 'plomberie'
      }
    ];
  }
  try {
    const raw = localStorage.getItem(KEY_WAITLIST);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Erreur lecture waitlist:', e);
  }

  // 6 fondateurs pré-inscrits réalistes pour amorcer le compteur (14 places restantes sur 20)
  const initialCohort: WaitlistEntry[] = [
    {
      id: 'fnd_1',
      prenom: 'Julien M.',
      email: 'julien.plomberie.nantes@gmail.com',
      metier: 'Plombier Chauffagiste',
      departement: '44',
      statut_tva: 'tva_normale',
      probleme: 'Perte de 1h30 tous les soirs à chercher les références sur catalogue et chiffrer la main d\'œuvre.',
      source: 'linkedin',
      created_at: '2026-10-14T10:12:00Z',
      plan: 'beta',
      status: 'active',
      quota_category: 'plomberie'
    },
    {
      id: 'fnd_2',
      prenom: 'Alexandre T.',
      email: 'alexandre.elec69@gmail.com',
      metier: 'Électricien BTP',
      departement: '69',
      statut_tva: 'tva_normale',
      probleme: 'Mes devis sur Word ne comportent jamais les bonnes mentions de décennale et la TVA 10%.',
      source: 'facebook_groupe_btp',
      created_at: '2026-10-15T15:20:00Z',
      plan: 'beta',
      status: 'active',
      quota_category: 'electricite'
    },
    {
      id: 'fnd_3',
      prenom: 'Benoît D.',
      email: 'benoit.peinture33@outlook.fr',
      metier: 'Peintre en bâtiment',
      departement: '33',
      statut_tva: 'ae_sans_tva',
      probleme: 'Calculer les surfaces au m² et appliquer la bonne mention art. 293 B sans me tromper.',
      source: 'forum_construire',
      created_at: '2026-10-16T18:05:00Z',
      plan: 'beta',
      status: 'active',
      quota_category: 'finitions'
    },
    {
      id: 'fnd_4',
      prenom: 'Karim B.',
      email: 'karim.cvc.idf@gmail.com',
      metier: 'Climaticien / CVC',
      departement: '92',
      statut_tva: 'tva_normale',
      probleme: 'Besoin d\'un outil qui fonctionne dans les parkings souterrains sans réseau 4G.',
      source: 'facebook_groupe_btp',
      created_at: '2026-10-17T11:40:00Z',
      plan: 'beta',
      status: 'active',
      quota_category: 'plomberie'
    },
    {
      id: 'fnd_5',
      prenom: 'Sébastien L.',
      email: 'sebastien.maconnerie@free.fr',
      metier: 'Maçon Gros Œuvre',
      departement: '35',
      statut_tva: 'tva_normale',
      probleme: 'Faire signer le devis par le client sur le capot de la camionnette avant de commencer.',
      source: 'organique',
      created_at: '2026-10-18T09:30:00Z',
      plan: 'beta',
      status: 'active',
      quota_category: 'gros_oeuvre'
    },
    {
      id: 'fnd_6',
      prenom: 'David R.',
      email: 'david.carrelage13@gmail.com',
      metier: 'Carreleur',
      departement: '13',
      statut_tva: 'ae_sans_tva',
      probleme: 'Trop de temps passé à faire des devis qui ne sont pas acceptés.',
      source: 'forum_construire',
      created_at: '2026-10-19T14:10:00Z',
      plan: 'beta',
      status: 'active',
      quota_category: 'finitions'
    }
  ];

  saveWaitlist(initialCohort);
  return initialCohort;
}

export function saveWaitlist(list: WaitlistEntry[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(KEY_WAITLIST, JSON.stringify(list));
  } catch (e) {
    console.error('Erreur sauvegarde waitlist:', e);
  }
}

export function addWaitlistEntry(entry: Omit<WaitlistEntry, 'id' | 'created_at' | 'plan' | 'status' | 'quota_category'>): WaitlistEntry {
  const current = getSavedWaitlist();
  
  // Catégorisation du quota
  let quotaCategory: WaitlistEntry['quota_category'] = 'finitions';
  const tradeLower = entry.metier.toLowerCase();
  if (tradeLower.includes('plomb') || tradeLower.includes('chauff') || tradeLower.includes('cvc') || tradeLower.includes('clim')) {
    quotaCategory = 'plomberie';
  } else if (tradeLower.includes('élec') || tradeLower.includes('elec')) {
    quotaCategory = 'electricite';
  } else if (tradeLower.includes('maçon') || tradeLower.includes('gros') || tradeLower.includes('couvr') || tradeLower.includes('charp')) {
    quotaCategory = 'gros_oeuvre';
  }

  const newEntry: WaitlistEntry = {
    ...entry,
    id: `wlt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    created_at: new Date().toISOString(),
    plan: 'beta',
    status: 'active',
    quota_category: quotaCategory
  };

  const updated = [newEntry, ...current];
  saveWaitlist(updated);
  return newEntry;
}

// Calcul des quotas de la cohorte fondateurs (20 places : 5 par corps de métier)
export function getFounderCohortStats() {
  const list = getSavedWaitlist();
  const maxTotal = 20;
  const maxPerCategory = 5;

  const plomberie = list.filter(e => e.quota_category === 'plomberie').length;
  const electricite = list.filter(e => e.quota_category === 'electricite').length;
  const finitions = list.filter(e => e.quota_category === 'finitions').length;
  const gros_oeuvre = list.filter(e => e.quota_category === 'gros_oeuvre').length;

  const totalRegistered = list.length;
  const remainingTotal = Math.max(0, maxTotal - totalRegistered);

  return {
    totalRegistered,
    maxTotal,
    remainingTotal,
    categories: {
      plomberie: { name: 'Plomberie & CVC', current: plomberie, max: maxPerCategory, remaining: Math.max(0, maxPerCategory - plomberie) },
      electricite: { name: 'Électricité BTP', current: electricite, max: maxPerCategory, remaining: Math.max(0, maxPerCategory - electricite) },
      finitions: { name: 'Finitions (Peinture, Carrelage)', current: finitions, max: maxPerCategory, remaining: Math.max(0, maxPerCategory - finitions) },
      gros_oeuvre: { name: 'Gros Œuvre & Menuiserie', current: gros_oeuvre, max: maxPerCategory, remaining: Math.max(0, maxPerCategory - gros_oeuvre) },
    }
  };
}

// ============================================================================
// CALCULS D'E-REPORTING ARTISAN & ANALYTIQUE FINANCIÈRE BTP
// ============================================================================

export function calculateArtisanReporting(docs: Document[]): ArtisanReportingStats {
  let totalRevenueHt = 0;
  let totalRevenueTtc = 0;
  let pendingQuotesCount = 0;
  let pendingQuotesAmount = 0;
  let acceptedQuotesCount = 0;
  let acceptedQuotesAmount = 0;
  let paidInvoicesCount = 0;
  let paidInvoicesAmount = 0;
  let depositsCollected = 0;

  const statusDistribution = {
    brouillon: 0,
    brouillon_local: 0,
    envoye: 0,
    accepte: 0,
    paye: 0,
    refuse: 0
  };

  docs.forEach(doc => {
    // Distribution
    if (doc.status in statusDistribution) {
      statusDistribution[doc.status as keyof typeof statusDistribution]++;
    }

    if (doc.status === 'accepte' || doc.status === 'paye') {
      totalRevenueHt += doc.total_ht || 0;
      totalRevenueTtc += doc.total_ttc || 0;
      if (doc.deposit_amount) {
        depositsCollected += doc.deposit_amount;
      }
    }

    if (doc.status === 'envoye' || doc.status === 'brouillon' || doc.status === 'brouillon_local') {
      pendingQuotesCount++;
      pendingQuotesAmount += doc.total_ttc || 0;
    } else if (doc.status === 'accepte') {
      acceptedQuotesCount++;
      acceptedQuotesAmount += doc.total_ttc || 0;
    } else if (doc.status === 'paye') {
      paidInvoicesCount++;
      paidInvoicesAmount += doc.total_ttc || 0;
    }
  });

  const sentOrSigned = acceptedQuotesCount + paidInvoicesCount + statusDistribution.envoye + statusDistribution.refuse;
  const conversionRate = sentOrSigned > 0 
    ? Math.round(((acceptedQuotesCount + paidInvoicesCount) / sentOrSigned) * 100) 
    : (docs.length > 0 ? 67 : 0);

  return {
    totalRevenueHt: Math.round(totalRevenueHt * 100) / 100,
    totalRevenueTtc: Math.round(totalRevenueTtc * 100) / 100,
    pendingQuotesCount,
    pendingQuotesAmount: Math.round(pendingQuotesAmount * 100) / 100,
    acceptedQuotesCount,
    acceptedQuotesAmount: Math.round(acceptedQuotesAmount * 100) / 100,
    paidInvoicesCount,
    paidInvoicesAmount: Math.round(paidInvoicesAmount * 100) / 100,
    depositsCollected: Math.round(depositsCollected * 100) / 100,
    conversionRate,
    statusDistribution
  };
}

// ============================================================================
// GESTIONNAIRE DES ABONNEMENTS SAAS (ADMIN DASHBOARD)
// ============================================================================

export const INITIAL_SUBSCRIPTIONS: Subscription[] = [
  {
    id: 'sub_artisan_demo',
    user_id: 'usr_artisan_demo',
    email: 'contact@batipro-renov.fr',
    artisan_name: 'Stéphane BatiPro',
    company_name: 'BatiPro Rénovation',
    siret: '849 204 892 00018',
    trade: 'Plomberie & Chauffage',
    plan: 'fondateur',
    status: 'active',
    monthly_price: 9.50,
    notes: 'Artisan Fondateur cohorte 1 Nantes - Feedback actif',
    created_at: '2026-10-15T09:00:00Z'
  },
  {
    id: 'sub_fnd_1',
    user_id: 'fnd_1',
    email: 'thierry.plomberie44@gmail.com',
    artisan_name: 'Thierry L.',
    company_name: 'TL Plomberie Chauffage',
    siret: '752 918 340 00021',
    trade: 'Plombier Chauffagiste',
    plan: 'beta',
    status: 'active',
    monthly_price: 0,
    notes: 'Accès bêta testeur gratuit activé',
    created_at: '2026-10-16T10:14:00Z'
  },
  {
    id: 'sub_fnd_2',
    user_id: 'fnd_2',
    email: 'laurent.elec35@orange.fr',
    artisan_name: 'Laurent M.',
    company_name: 'Armor Élec 35',
    siret: '811 405 690 00014',
    trade: 'Électricien BTP',
    plan: 'fondateur',
    status: 'active',
    monthly_price: 9.50,
    notes: 'Tarif fondateur garanti à vie 9,50€',
    created_at: '2026-10-16T14:22:00Z'
  },
  {
    id: 'sub_fnd_3',
    user_id: 'fnd_3',
    email: 'contact@pro-peinture49.fr',
    artisan_name: 'Karim B.',
    company_name: 'Pro Peinture Anjou',
    siret: '890 123 456 00019',
    trade: 'Peintre en bâtiment',
    plan: 'fondateur',
    status: 'active',
    monthly_price: 9.50,
    notes: 'Très intéressé par les kits m²',
    created_at: '2026-10-17T08:45:00Z'
  },
  {
    id: 'sub_fnd_4',
    user_id: 'fnd_4',
    email: 'alain.clim.bordeaux@gmail.com',
    artisan_name: 'Alain V.',
    company_name: 'Gironde Froid & Clim',
    siret: '840 987 654 00022',
    trade: 'Chauffagiste / CVC',
    plan: 'standard',
    status: 'active',
    monthly_price: 19.00,
    notes: 'Passage en formule standard',
    created_at: '2026-10-17T16:05:00Z'
  },
  {
    id: 'sub_fnd_5',
    user_id: 'fnd_5',
    email: 'sebastien.maconnerie@free.fr',
    artisan_name: 'Sébastien D.',
    company_name: 'Dalle & Murs Bretons',
    siret: '802 334 112 00011',
    trade: 'Maçon Gros Œuvre',
    plan: 'beta',
    status: 'active',
    monthly_price: 0,
    notes: 'Test intensif du mode hors ligne',
    created_at: '2026-10-18T09:30:00Z'
  }
];

export function getSavedSubscriptions(): Subscription[] {
  if (typeof window === 'undefined') return INITIAL_SUBSCRIPTIONS;
  try {
    const raw = localStorage.getItem(KEY_SUBSCRIPTIONS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Erreur lecture abonnements:', e);
  }
  saveSubscriptions(INITIAL_SUBSCRIPTIONS);
  return INITIAL_SUBSCRIPTIONS;
}

export function saveSubscriptions(subs: Subscription[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(KEY_SUBSCRIPTIONS, JSON.stringify(subs));
  } catch (e) {
    console.error('Erreur sauvegarde abonnements:', e);
  }
}

export function updateSubscriptionPlan(
  subId: string, 
  plan: 'beta' | 'fondateur' | 'standard',
  status?: 'active' | 'en_attente' | 'resilie'
): Subscription[] {
  const all = getSavedSubscriptions();
  const prices = { beta: 0, fondateur: 9.50, standard: 19.00 };
  
  const updated = all.map(s => {
    if (s.id === subId) {
      return {
        ...s,
        plan,
        monthly_price: prices[plan],
        status: status || s.status
      };
    }
    return s;
  });

  saveSubscriptions(updated);
  return updated;
}

// ============================================================================
// GESTIONNAIRE DE SESSION (ARTISAN vs SUPER-ADMIN)
// ============================================================================

export const DEFAULT_SESSION: UserSession = {
  role: 'artisan',
  userEmail: 'contact@batipro-renov.fr',
  companyName: 'BatiPro Rénovation',
  plan: 'fondateur',
  isLoggedIn: true
};

export function getCurrentSession(): UserSession {
  if (typeof window === 'undefined') return DEFAULT_SESSION;
  try {
    const raw = localStorage.getItem(KEY_SESSION);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Erreur lecture session:', e);
  }
  saveCurrentSession(DEFAULT_SESSION);
  return DEFAULT_SESSION;
}

export function saveCurrentSession(session: UserSession): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(KEY_SESSION, JSON.stringify(session));
  } catch (e) {
    console.error('Erreur sauvegarde session:', e);
  }
}

// Le script SQL complet de Supabase à afficher et copier dans l'admin
export const SUPABASE_SQL_SCHEMA = `-- ============================================================================
-- SCHÉMA SUPABASE COMPLET POUR BATIDEVIS (MICRO-SAAS ARTISAN BTP)
-- Validé selon le Dossier de Développement du 20/10/2026
-- ============================================================================

-- 1. PROFILS ARTISANS
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  company_name text not null,
  siret text,
  address text,
  phone text,
  email text,
  tva_number text,
  insurance_info text,              -- "Assurance décennale AXA n° 849204..."
  is_tva_subject boolean default false,  -- false = mention obligatoire art. 293 B du CGI
  trade text,                        -- métier principal
  created_at timestamptz default now()
);

-- 2. CLIENTS
create table if not exists clients (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade not null,
  name text not null,
  address text,
  phone text,
  email text,
  created_at timestamptz default now()
);

-- 3. CATALOGUE ARTICLES
create table if not exists items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade not null,
  name text not null,
  description text,
  unit_price decimal(10,2) not null default 0,
  unit text default 'unité',         -- heure | m² | ml | forfait | unité
  created_at timestamptz default now()
);

-- 4. KITS CHANTIER (Killer Feature - Forfaits recalculés en temps réel)
create table if not exists kits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade not null,
  name text not null,
  description text,
  category text,                     -- Plomberie | Électricité | Peinture...
  is_active boolean default true,
  created_at timestamptz default now()
);

create table if not exists kit_items (
  id uuid primary key default gen_random_uuid(),
  kit_id uuid references kits(id) on delete cascade not null,
  item_id uuid references items(id) on delete set null,
  description text not null,
  quantity decimal(10,2) not null default 1,
  unit_price decimal(10,2) not null default 0,
  total decimal(10,2) generated always as (quantity * unit_price) stored
);

-- 5. DOCUMENTS (devis + factures unifiés)
create table if not exists documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade not null,
  client_id uuid references clients(id) on delete cascade not null,
  type text not null check (type in ('devis','facture')),
  document_number text not null,
  date date not null default current_date,
  due_date date,
  status text not null default 'brouillon'
    check (status in ('brouillon','brouillon_local','envoye','accepte','paye','refuse')),
  notes text,
  footer text,                       -- mentions légales automatiques (décennale, TVA, etc.)
  total_ht decimal(10,2) default 0,
  total_tva decimal(10,2) default 0,
  total_ttc decimal(10,2) default 0,
  signed_at timestamptz,             -- horodatage juridique acceptation
  signature_svg text,                -- tracé tactile
  synced_at timestamptz,             -- null = créé hors-ligne sur chantier, pas encore sync
  created_at timestamptz default now()
);

create table if not exists document_items (
  id uuid primary key default gen_random_uuid(),
  document_id uuid references documents(id) on delete cascade not null,
  kit_id uuid references kits(id) on delete set null,  -- traçabilité kit
  description text not null,
  quantity decimal(10,2) not null default 1,
  unit_price decimal(10,2) not null default 0,
  total decimal(10,2) generated always as (quantity * unit_price) stored,
  position int default 0
);

-- 6. WAITLIST (landing page & cohorte 20 fondateurs)
create table if not exists waitlist (
  id uuid primary key default gen_random_uuid(),
  prenom text not null,
  email text not null unique,
  metier text not null,
  departement text,
  statut_tva text,                   -- 'ae_sans_tva' | 'tva_normale'
  probleme text,                     -- verbatim brut (trésor pour le copywriting)
  source text,                       -- utm_source
  created_at timestamptz default now()
);

-- 7. ABONNEMENTS (activation manuelle plan='beta' pour les 20 fondateurs)
create table if not exists subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) unique on delete cascade not null,
  plan text not null default 'beta',       -- beta | fondateur | standard
  status text not null default 'active',   -- active | inactive
  notes text,
  created_at timestamptz default now()
);

-- Politiques de sécurité RLS (Row Level Security)
alter table profiles enable row level security;
alter table clients enable row level security;
alter table items enable row level security;
alter table kits enable row level security;
alter table kit_items enable row level security;
alter table documents enable row level security;
alter table document_items enable row level security;
alter table subscriptions enable row level security;

-- L'artisan accède uniquement à ses propres documents et clients
create policy "Les artisans voient uniquement leur profil" on profiles for all using (auth.uid() = id);
create policy "Les artisans voient uniquement leurs clients" on clients for all using (auth.uid() = user_id);
create policy "Les artisans voient uniquement leurs items" on items for all using (auth.uid() = user_id);
create policy "Les artisans voient uniquement leurs kits" on kits for all using (auth.uid() = user_id);
create policy "Les artisans voient uniquement leurs documents" on documents for all using (auth.uid() = user_id);
`;
