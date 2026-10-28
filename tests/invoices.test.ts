import assert from 'node:assert';
import { test, describe } from 'node:test';
import { generateDepositInvoice, generateFinalInvoice } from '../src/services/invoices';
import { QuotePayload } from '../src/services/quotes';

describe('Task 2: Moteur Comptable - Factures d’Acompte et de Solde', () => {
  const dummyQuote: QuotePayload = {
    quoteNumber: 'DEV-2026-042',
    clientName: 'M. et Mme Martin',
    clientEmail: 'martin@example.fr',
    clientAddress: '15 avenue des Chantiers, 69002 Lyon',
    projectTitle: 'Rénovation complète plomberie et sanitaire',
    totalHT: 2000.0,
    totalVAT: 200.0, // TVA 10%
    totalTTC: 2200.0,
    items: [
      {
        designation: 'Chauffe-eau thermodynamique 200L',
        quantity: 1,
        unit: 'forfait',
        unitPriceHT: 1500.0,
        vatRate: 10.0,
        totalHT: 1500.0,
        totalTTC: 1650.0
      },
      {
        designation: 'Raccordements et mise en service',
        quantity: 1,
        unit: 'forfait',
        unitPriceHT: 500.0,
        vatRate: 10.0,
        totalHT: 500.0,
        totalTTC: 550.0
      }
    ]
  };

  test('Facture d’acompte 30% calcule exactement 30% HT, TVA et TTC', () => {
    const depositInv = generateDepositInvoice(dummyQuote, 30, 'FAC-2026-001');

    assert.strictEqual(depositInv.invoice_number, 'FAC-2026-001');
    assert.strictEqual(depositInv.invoice_type, 'acompte_30');
    assert.strictEqual(depositInv.total_ht, 600.0); // 30% de 2000
    assert.strictEqual(depositInv.total_vat, 60.0); // 30% de 200
    assert.strictEqual(depositInv.total_ttc, 660.0); // 30% de 2200
    assert.strictEqual(depositInv.deposit_deducted, 0);
    assert.strictEqual(depositInv.net_to_pay, 660.0);
    assert.strictEqual(depositInv.items[0].designation.includes('Acompte 30%'), true);
  });

  test('Facture de solde déduit automatiquement l’acompte de 30% avec net à payer de 70%', () => {
    const depositInv = generateDepositInvoice(dummyQuote, 30, 'FAC-2026-001');
    const finalInv = generateFinalInvoice(dummyQuote, depositInv, 'FAC-2026-002');

    assert.strictEqual(finalInv.invoice_number, 'FAC-2026-002');
    assert.strictEqual(finalInv.invoice_type, 'solde');
    assert.strictEqual(finalInv.total_ht, 2000.0);
    assert.strictEqual(finalInv.total_vat, 200.0);
    assert.strictEqual(finalInv.total_ttc, 2200.0);
    assert.strictEqual(finalInv.deposit_deducted, 660.0);
    assert.strictEqual(finalInv.deposit_invoice_ref, 'FAC-2026-001');
    assert.strictEqual(finalInv.net_to_pay, 1540.0); // 2200 - 660 = 1540 (70%)
  });

  test('Facture de solde directe sans acompte préalable facture 100%', () => {
    const directFinalInv = generateFinalInvoice(dummyQuote, null, 'FAC-2026-003');

    assert.strictEqual(directFinalInv.deposit_deducted, 0);
    assert.strictEqual(directFinalInv.net_to_pay, 2200.0);
  });
});
