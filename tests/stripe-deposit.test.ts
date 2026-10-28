import { test, describe } from 'node:test';
import assert from 'node:assert';
import { 
  computeDepositAmountCents, 
  generateDepositPaymentSession,
  formatStripePrice,
  type StripeDepositParams 
} from '../src/services/stripe';

describe('BâtiDevis 2026 — Paiement d’Acompte 30% Stripe en Ligne', () => {
  test('Conversion précise du montant d’acompte en centimes d’euro pour Stripe', () => {
    // Devis 1 094,50 € TTC -> acompte 30% = 328,35 € -> 32835 centimes
    const cents = computeDepositAmountCents(1094.50, 30);
    assert.strictEqual(cents, 32835);

    // Devis 2 450,00 € TTC -> acompte 30% = 735,00 € -> 73500 centimes
    const cents2 = computeDepositAmountCents(2450.00, 30);
    assert.strictEqual(cents2, 73500);

    // Test arrondi sans dérive flottante
    const cents3 = computeDepositAmountCents(100.33, 30);
    // 100.33 * 0.30 = 30.099 -> arrondi 30.10 € = 3010 centimes
    assert.strictEqual(cents3, 3010);
  });

  test('Formatage lisible du prix en euros', () => {
    assert.strictEqual(formatStripePrice(32835), '328,35 €');
    assert.strictEqual(formatStripePrice(73500), '735,00 €');
  });

  test('Génération de la session de paiement d’acompte sécurisée', () => {
    const params: StripeDepositParams = {
      quoteNumber: 'DEV-2026-084',
      depositInvoiceNumber: 'FAC-ACOMPTE-2026-084',
      totalQuoteTtc: 1094.50,
      depositPercent: 30,
      clientName: 'M. Jean Dupont',
      clientEmail: 'jean.dupont@orange.fr',
      successUrl: 'https://batidevis.fr/valider/tok_xyz98?payment=success',
      cancelUrl: 'https://batidevis.fr/valider/tok_xyz98?payment=cancel'
    };

    const session = generateDepositPaymentSession(params);

    assert.strictEqual(session.amount_cents, 32835);
    assert.strictEqual(session.amount_euros, 328.35);
    assert.strictEqual(session.currency, 'eur');
    assert.ok(session.checkout_url.includes('checkout'));
    assert.strictEqual(session.metadata.quote_number, 'DEV-2026-084');
    assert.strictEqual(session.metadata.invoice_number, 'FAC-ACOMPTE-2026-084');
    assert.strictEqual(session.customer_email, 'jean.dupont@orange.fr');
  });
});
