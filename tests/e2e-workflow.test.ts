/**
 * Test E2E d'intégration du cycle complet BâtiDevis 2026 :
 * 1. Chiffrage devis métier (Plomberie)
 * 2. Signature électronique avec capture d'accord
 * 3. Génération de la Facture d'acompte (30%)
 * 4. Génération de la Facture de solde avec déduction légale automatique de l'acompte (70%)
 */

import { test, describe } from 'node:test';
import assert from 'node:assert';
import { calculateQuoteTotals, type QuotePayload, type QuoteLineItem } from '../src/services/quotes';
import { generateDepositInvoice, generateFinalInvoice } from '../src/services/invoices';
import { isValidSignatureData } from '../src/components/signature/signatureUtils';

describe('BâtiDevis 2026 — Cycle Complet Devis, Signature et Facturation BTP', () => {
  const clientInfo = {
    clientName: 'M. Jean Dupont',
    clientEmail: 'jean.dupont@orange.fr',
    clientPhone: '06 98 76 54 32',
    clientAddress: '28 avenue de la République, 44200 Nantes'
  };

  test('Étape 1: Chiffrage d’un devis avec kit plomberie et ventilation TVA', () => {
    const rawItems: QuoteLineItem[] = [
      {
        designation: 'Chauffe-eau thermodynamique 200L classe A+',
        quantity: 1,
        unit: 'u',
        unitPriceHT: 850.00,
        vatRate: 10,
        totalHT: 0,
        totalTTC: 0
      },
      {
        designation: 'Pose & raccordements cuivre isolés + groupe de sécurité NF',
        quantity: 1,
        unit: 'forfait',
        unitPriceHT: 145.00,
        vatRate: 10,
        totalHT: 0,
        totalTTC: 0
      }
    ];

    const totals = calculateQuoteTotals(rawItems);
    assert.strictEqual(totals.totalHT, 995.00, 'Total HT doit être 995,00 €');
    assert.strictEqual(totals.totalVAT, 99.50, 'Total TVA 10% doit être 99,50 €');
    assert.strictEqual(totals.totalTTC, 1094.50, 'Total TTC doit être 1 094,50 €');
    assert.strictEqual(totals.items.length, 2);
  });

  test('Étape 2: Signature électronique client et capture horodatée', () => {
    const validSignaturePng = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
    
    assert.strictEqual(isValidSignatureData(validSignaturePng), true, 'La signature tactile capturée doit être un PNG valide');

    const signatureData = {
      signature_data_url: validSignaturePng,
      signer_name: 'Jean Dupont',
      signed_at: new Date().toISOString(),
      signer_ip: '90.112.45.12'
    };

    assert.ok(signatureData.signed_at, 'La date de signature horodatée doit être renseignée');
    assert.strictEqual(signatureData.signer_name, 'Jean Dupont');
  });

  test('Étape 3: Génération 1-clic de la facture d’acompte 30%', () => {
    const quote: QuotePayload = {
      quoteNumber: 'DEV-2026-084',
      clientName: clientInfo.clientName,
      clientEmail: clientInfo.clientEmail,
      clientPhone: clientInfo.clientPhone,
      clientAddress: clientInfo.clientAddress,
      projectTitle: 'Remplacement chauffe-eau thermodynamique',
      items: [
        {
          designation: 'Chauffe-eau thermodynamique 200L classe A+',
          quantity: 1,
          unit: 'u',
          unitPriceHT: 850.00,
          vatRate: 10,
          totalHT: 850.00,
          totalTTC: 935.00
        },
        {
          designation: 'Pose & raccordements cuivre isolés',
          quantity: 1,
          unit: 'forfait',
          unitPriceHT: 145.00,
          vatRate: 10,
          totalHT: 145.00,
          totalTTC: 159.50
        }
      ],
      totalHT: 995.00,
      totalVAT: 99.50,
      totalTTC: 1094.50
    };

    const depositInvoice = generateDepositInvoice(quote, 30, 'FAC-ACOMPTE-2026-084');

    assert.strictEqual(depositInvoice.invoice_type, 'acompte_30');
    assert.strictEqual(depositInvoice.total_ht, 298.50, 'Acompte HT = 30% de 995€ = 298.50€');
    assert.strictEqual(depositInvoice.total_vat, 29.85, 'Acompte TVA = 30% de 99.50€ = 29.85€');
    assert.strictEqual(depositInvoice.total_ttc, 328.35, 'Acompte TTC = 30% de 1094.50€ = 328.35€');
    assert.strictEqual(depositInvoice.deposit_deducted, 0);
    assert.strictEqual(depositInvoice.net_to_pay, 328.35);
    assert.strictEqual(depositInvoice.invoice_number, 'FAC-ACOMPTE-2026-084');
  });

  test('Étape 4: Génération de la facture de solde finale avec déduction automatique des 30%', () => {
    const quote: QuotePayload = {
      quoteNumber: 'DEV-2026-084',
      clientName: clientInfo.clientName,
      clientEmail: clientInfo.clientEmail,
      clientPhone: clientInfo.clientPhone,
      clientAddress: clientInfo.clientAddress,
      projectTitle: 'Remplacement chauffe-eau thermodynamique',
      items: [
        {
          designation: 'Chauffe-eau thermodynamique 200L classe A+',
          quantity: 1,
          unit: 'u',
          unitPriceHT: 850.00,
          vatRate: 10,
          totalHT: 850.00,
          totalTTC: 935.00
        },
        {
          designation: 'Pose & raccordements cuivre isolés',
          quantity: 1,
          unit: 'forfait',
          unitPriceHT: 145.00,
          vatRate: 10,
          totalHT: 145.00,
          totalTTC: 159.50
        }
      ],
      totalHT: 995.00,
      totalVAT: 99.50,
      totalTTC: 1094.50
    };

    const depositInvoice = generateDepositInvoice(quote, 30, 'FAC-ACOMPTE-2026-084');
    const finalInvoice = generateFinalInvoice(quote, depositInvoice, 'FAC-SOLDE-2026-084');

    assert.strictEqual(finalInvoice.invoice_type, 'solde');
    assert.strictEqual(finalInvoice.total_ht, 995.00, 'Total des prestations HT = 995€');
    assert.strictEqual(finalInvoice.total_vat, 99.50, 'Total TVA = 99.50€');
    assert.strictEqual(finalInvoice.total_ttc, 1094.50, 'Total des prestations TTC = 1094.50€');
    assert.strictEqual(finalInvoice.deposit_deducted, 328.35, 'Acompte déduit = 328.35€ TTC');
    assert.strictEqual(finalInvoice.net_to_pay, 766.15, 'Net à payer de solde = 1094.50 - 328.35 = 766.15€ TTC (70%)');
    assert.strictEqual(finalInvoice.invoice_number, 'FAC-SOLDE-2026-084');
  });
});
