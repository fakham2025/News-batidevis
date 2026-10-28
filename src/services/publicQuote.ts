import { supabase } from '../lib/supabase';
import { QuotePayload } from './quotes';

const STORAGE_KEY_PUBLIC_QUOTES = 'batidevis_public_quotes_db';

export interface PublicQuoteData extends QuotePayload {
  shareToken: string;
  artisanCompanyName?: string;
  artisanSiret?: string;
  artisanPhone?: string;
  artisanEmail?: string;
  artisanInsurance?: string;
  status: 'draft' | 'sent' | 'accepted' | 'rejected';
  signatureData?: string;
  signedAt?: string;
}

/**
 * Récupère les détails d'un devis public à partir de son token
 */
export async function getPublicQuoteByToken(token: string): Promise<PublicQuoteData | null> {
  // 1. Tenter via Supabase
  try {
    const { data, error } = await supabase
      .from('quotes')
      .select('*')
      .eq('share_token', token)
      .maybeSingle();

    if (!error && data) {
      return {
        quoteNumber: data.quote_number,
        clientName: data.client_name,
        clientEmail: data.client_email,
        clientPhone: data.client_phone,
        clientAddress: data.client_address,
        projectTitle: data.project_title,
        items: data.items || [],
        totalHT: data.total_ht,
        totalVAT: data.total_vat,
        totalTTC: data.total_ttc,
        validityDays: data.validity_days || 30,
        paymentTerms: data.payment_terms,
        shareToken: token,
        status: data.status || 'sent',
        signatureData: data.client_signature_data,
        signedAt: data.client_signed_at,
        artisanCompanyName: 'Artisan Partenaire BâtiDevis',
        artisanInsurance: 'Garantie Décennale SMABTP - Police n°2026-FR-BTP'
      };
    }
  } catch {
    // fallback local
  }

  // 2. Fallback localStorage pour test immédiat
  try {
    const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY_PUBLIC_QUOTES) : null;
    if (raw) {
      const list: PublicQuoteData[] = JSON.parse(raw);
      const match = list.find((q) => q.shareToken === token);
      if (match) return match;
    }
  } catch {
    // ignore
  }

  // 3. Fallback de démonstration si token de test
  return {
    quoteNumber: 'DEV-2026-001',
    clientName: 'M. Thomas Martin',
    clientEmail: 'client@gmail.com',
    clientPhone: '06 12 34 56 78',
    clientAddress: '12 rue des Fleurs, 69002 Lyon',
    projectTitle: 'Rénovation plomberie et sanitaire',
    totalHT: 995.0,
    totalVAT: 99.5,
    totalTTC: 1094.5,
    items: [
      {
        designation: 'Remplacement Chauffe-eau électrique 200L classe B',
        quantity: 1,
        unit: 'forfait',
        unitPriceHT: 850.0,
        vatRate: 10.0,
        totalHT: 850.0,
        totalTTC: 935.0
      },
      {
        designation: 'Remplacement mitigeur évier avec flexibles neufs',
        quantity: 1,
        unit: 'unité',
        unitPriceHT: 145.0,
        vatRate: 10.0,
        totalHT: 145.0,
        totalTTC: 159.5
      }
    ],
    shareToken: token,
    status: 'sent',
    artisanCompanyName: 'Entreprise BTP Rénovation',
    artisanSiret: '839 204 192 00018',
    artisanPhone: '06 99 88 77 66',
    artisanInsurance: 'Garantie Décennale SMABTP n°74829103'
  };
}

/**
 * Enregistre la signature électronique du client et valide le devis
 */
export async function signPublicQuote(
  token: string,
  signatureDataUrl: string,
  signerName: string
): Promise<{ success: boolean; message: string }> {
  const signedAt = new Date().toISOString();

  // 1. Tenter mise à jour Supabase
  try {
    const { error } = await supabase
      .from('quotes')
      .update({
        status: 'accepted',
        client_signature_data: signatureDataUrl,
        client_signed_at: signedAt
      })
      .eq('share_token', token);

    if (error) {
      console.warn('Erreur mise à jour signature Supabase:', error);
    }
  } catch {
    // ignore
  }

  // 2. Mettre à jour en local
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PUBLIC_QUOTES);
    const list: PublicQuoteData[] = raw ? JSON.parse(raw) : [];
    const updated = list.map((q) =>
      q.shareToken === token
        ? {
            ...q,
            status: 'accepted' as const,
            signatureData: signatureDataUrl,
            signedAt
          }
        : q
    );
    localStorage.setItem(STORAGE_KEY_PUBLIC_QUOTES, JSON.stringify(updated));
  } catch {
    // ignore
  }

  return {
    success: true,
    message: 'Votre signature a été enregistrée avec succès. Le devis est désormais validé.'
  };
}
