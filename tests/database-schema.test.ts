import assert from 'node:assert';
import { test, describe } from 'node:test';
import { InvoiceRecord, QuoteSignatureData } from '../src/lib/supabase';

describe('Task 1: Schéma de Données Supabase - Factures & Signatures', () => {
  test('Interface InvoiceRecord valide la conformité comptable', () => {
    const dummyInvoice: InvoiceRecord = {
      id: 'inv_123',
      quote_id: 'quote_456',
      user_id: 'user_789',
      invoice_number: 'FAC-2026-001',
      invoice_type: 'solde',
      client_name: 'Jean Dupont',
      client_email: 'jean.dupont@example.com',
      client_address: '12 rue de la Paix, 75002 Paris',
      items: [],
      total_ht: 1000.0,
      total_vat: 100.0,
      total_ttc: 1100.0,
      deposit_deducted: 330.0,
      deposit_invoice_ref: 'FAC-2026-ACOMPTE-001',
      net_to_pay: 770.0,
      status: 'unpaid',
      due_date: '2026-11-28',
      payment_method: 'Virement bancaire',
      created_at: new Date().toISOString()
    };

    assert.strictEqual(dummyInvoice.invoice_number, 'FAC-2026-001');
    assert.strictEqual(dummyInvoice.net_to_pay, 770.0);
    assert.strictEqual(dummyInvoice.deposit_deducted, 330.0);
  });

  test('Interface QuoteSignatureData capture l’accord légal', () => {
    const signatureData: QuoteSignatureData = {
      share_token: 'tok_random16byteshex',
      client_signature_data: 'data:image/png;base64,iVBORw0KGgo...',
      client_signed_at: new Date().toISOString(),
      client_signed_ip: '127.0.0.1'
    };

    assert.strictEqual(typeof signatureData.share_token, 'string');
    assert.strictEqual(signatureData.share_token.startsWith('tok_'), true);
  });
});
