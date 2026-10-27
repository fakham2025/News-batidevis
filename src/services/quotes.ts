import { supabase, DevisKitItem } from '../lib/supabase';

export interface QuoteLineItem {
  id?: string;
  designation: string;
  quantity: number;
  unit: string;
  unitPriceHT: number;
  vatRate: number; // 5.5, 10, or 20
  totalHT: number;
  totalTTC: number;
}

export interface QuotePayload {
  quoteNumber: string;
  clientName: string;
  clientEmail?: string;
  clientPhone?: string;
  clientAddress?: string;
  projectTitle: string;
  projectDescription?: string;
  items: QuoteLineItem[];
  totalHT: number;
  totalVAT: number;
  totalTTC: number;
  validityDays?: number;
  paymentTerms?: string;
}

/**
 * Calcule automatiquement les montants HT, TVA par taux et TTC
 */
export function calculateQuoteTotals(items: QuoteLineItem[]) {
  let totalHT = 0;
  let totalVAT = 0;

  const itemsWithTotals = items.map((item) => {
    const lineHT = Math.round(item.quantity * item.unitPriceHT * 100) / 100;
    const lineVAT = Math.round(lineHT * (item.vatRate / 100) * 100) / 100;
    const lineTTC = Math.round((lineHT + lineVAT) * 100) / 100;

    totalHT += lineHT;
    totalVAT += lineVAT;

    return {
      ...item,
      totalHT: lineHT,
      totalTTC: lineTTC
    };
  });

  totalHT = Math.round(totalHT * 100) / 100;
  totalVAT = Math.round(totalVAT * 100) / 100;
  const totalTTC = Math.round((totalHT + totalVAT) * 100) / 100;

  return {
    items: itemsWithTotals,
    totalHT,
    totalVAT,
    totalTTC
  };
}

/**
 * Récupère les ouvrages types par corps de métier depuis Supabase
 */
export async function getKitsByTrade(trade: string): Promise<DevisKitItem[]> {
  try {
    const { data, error } = await supabase
      .from('devis_kits')
      .select('*')
      .eq('trade', trade)
      .order('name');

    if (error) {
      console.warn('Erreur chargement kits métier Supabase:', error);
      return [];
    }

    return (data as DevisKitItem[]) || [];
  } catch (err) {
    console.error('Exception chargement kits métier:', err);
    return [];
  }
}

/**
 * Sauvegarde un nouveau devis conforme 2026 dans Supabase
 */
export async function saveQuote(quote: QuotePayload) {
  try {
    const { data, error } = await supabase
      .from('quotes')
      .insert([
        {
          quote_number: quote.quoteNumber,
          client_name: quote.clientName,
          client_email: quote.clientEmail || null,
          client_phone: quote.clientPhone || null,
          client_address: quote.clientAddress || null,
          project_title: quote.projectTitle,
          project_description: quote.projectDescription || null,
          items: quote.items,
          total_ht: quote.totalHT,
          total_vat: quote.totalVAT,
          total_ttc: quote.totalTTC,
          validity_days: quote.validityDays || 30,
          payment_terms: quote.paymentTerms || 'Acompte 30% à la commande, solde à réception des travaux',
          pdp_compliant: true
        }
      ])
      .select('*')
      .single();

    if (error) {
      console.error('Erreur sauvegarde devis Supabase:', error);
      throw error;
    }

    return { success: true, quote: data };
  } catch (err) {
    console.error('Exception sauvegarde devis:', err);
    return { success: false, error: err };
  }
}
