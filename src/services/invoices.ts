import { supabase, InvoiceRecord } from '../lib/supabase';
import { QuotePayload } from './quotes';

const STORAGE_KEY_INVOICES = 'batidevis_invoices_local';

/**
 * Génère une facture d'acompte (par défaut 30%) à partir d'un devis
 */
export function generateDepositInvoice(
  quote: QuotePayload,
  depositPercent = 30,
  invoiceNumber = 'FAC-2026-001'
): InvoiceRecord {
  const ratio = depositPercent / 100;
  const depositHT = Math.round(quote.totalHT * ratio * 100) / 100;
  const depositVAT = Math.round(quote.totalVAT * ratio * 100) / 100;
  const depositTTC = Math.round((depositHT + depositVAT) * 100) / 100;

  // Due date = today + 15 days
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 15);

  const depositItem = {
    designation: `Acompte ${depositPercent}% à la commande - Réf devis ${quote.quoteNumber} : ${quote.projectTitle}`,
    quantity: 1,
    unit: 'forfait',
    unitPriceHT: depositHT,
    vatRate: quote.items[0]?.vatRate || 10.0,
    totalHT: depositHT,
    totalTTC: depositTTC
  };

  return {
    quote_id: quote.quoteNumber,
    invoice_number: invoiceNumber,
    invoice_type: 'acompte_30',
    client_name: quote.clientName,
    client_email: quote.clientEmail,
    client_address: quote.clientAddress,
    items: [depositItem],
    total_ht: depositHT,
    total_vat: depositVAT,
    total_ttc: depositTTC,
    deposit_deducted: 0,
    net_to_pay: depositTTC,
    status: 'unpaid',
    due_date: dueDate.toISOString().split('T')[0],
    payment_method: 'Virement bancaire',
    created_at: new Date().toISOString()
  };
}

/**
 * Génère la facture de solde finale en déduisant automatiquement l'acompte perçu
 */
export function generateFinalInvoice(
  quote: QuotePayload,
  depositInvoice: InvoiceRecord | null,
  invoiceNumber = 'FAC-2026-002'
): InvoiceRecord {
  const depositDeducted = depositInvoice ? depositInvoice.total_ttc : 0;
  const netToPay = Math.round((quote.totalTTC - depositDeducted) * 100) / 100;

  // Due date = today + 30 days
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 30);

  const finalItems = quote.items.map((item) => ({
    designation: item.designation,
    quantity: item.quantity,
    unit: item.unit,
    unitPriceHT: item.unitPriceHT,
    vatRate: item.vatRate,
    totalHT: item.totalHT,
    totalTTC: item.totalTTC
  }));

  return {
    quote_id: quote.quoteNumber,
    invoice_number: invoiceNumber,
    invoice_type: 'solde',
    client_name: quote.clientName,
    client_email: quote.clientEmail,
    client_address: quote.clientAddress,
    items: finalItems,
    total_ht: quote.totalHT,
    total_vat: quote.totalVAT,
    total_ttc: quote.totalTTC,
    deposit_deducted: depositDeducted,
    deposit_invoice_ref: depositInvoice ? depositInvoice.invoice_number : undefined,
    net_to_pay: netToPay,
    status: 'unpaid',
    due_date: dueDate.toISOString().split('T')[0],
    payment_method: 'Virement bancaire',
    created_at: new Date().toISOString()
  };
}

/**
 * Sauvegarde une facture dans Supabase avec résilience locale
 */
export async function saveInvoice(invoice: InvoiceRecord): Promise<{ success: boolean; invoice: InvoiceRecord }> {
  try {
    // 1. Sauvegarde locale immédiate
    const existingRaw = localStorage.getItem(STORAGE_KEY_INVOICES);
    const existing: InvoiceRecord[] = existingRaw ? JSON.parse(existingRaw) : [];
    const updated = [invoice, ...existing.filter((inv) => inv.invoice_number !== invoice.invoice_number)];
    localStorage.setItem(STORAGE_KEY_INVOICES, JSON.stringify(updated));

    // 2. Persistance Supabase si disponible
    try {
      const { data, error } = await supabase
        .from('invoices')
        .insert([
          {
            quote_id: invoice.quote_id,
            invoice_number: invoice.invoice_number,
            invoice_type: invoice.invoice_type,
            client_name: invoice.client_name,
            client_email: invoice.client_email,
            client_address: invoice.client_address,
            items: invoice.items,
            total_ht: invoice.total_ht,
            total_vat: invoice.total_vat,
            total_ttc: invoice.total_ttc,
            deposit_deducted: invoice.deposit_deducted,
            deposit_invoice_ref: invoice.deposit_invoice_ref,
            net_to_pay: invoice.net_to_pay,
            status: invoice.status,
            due_date: invoice.due_date,
            payment_method: invoice.payment_method
          }
        ])
        .select('*')
        .single();

      if (!error && data) {
        return { success: true, invoice: { ...invoice, id: data.id } };
      }
    } catch {
      // ignore network errors for offline-first resilience
    }

    return { success: true, invoice };
  } catch (err) {
    console.error('Erreur saveInvoice:', err);
    return { success: true, invoice };
  }
}

/**
 * Récupère les factures de l'artisan
 */
export async function getInvoices(): Promise<InvoiceRecord[]> {
  try {
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data && data.length > 0) {
      return data as InvoiceRecord[];
    }
  } catch {
    // ignore
  }

  try {
    const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY_INVOICES) : null;
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
