import assert from 'node:assert';
import { test, describe } from 'node:test';
import { calculateQuoteTotals, QuoteLineItem } from '../src/services/quotes';

describe('BâtiDevis 2026 - Moteur de Calcul Fiscal & Devis', () => {
  test('Calcul devis vide donne 0 HT, 0 TVA, 0 TTC', () => {
    const result = calculateQuoteTotals([]);
    assert.strictEqual(result.totalHT, 0);
    assert.strictEqual(result.totalVAT, 0);
    assert.strictEqual(result.totalTTC, 0);
    assert.strictEqual(result.items.length, 0);
  });

  test('Calcul TVA rénovation standard (10%) sur chauffe-eau', () => {
    const items: QuoteLineItem[] = [
      {
        designation: 'Remplacement Chauffe-eau 200L',
        quantity: 1,
        unit: 'forfait',
        unitPriceHT: 850.00,
        vatRate: 10.00,
        totalHT: 0,
        totalTTC: 0
      }
    ];

    const result = calculateQuoteTotals(items);
    assert.strictEqual(result.totalHT, 850.00);
    assert.strictEqual(result.totalVAT, 85.00);
    assert.strictEqual(result.totalTTC, 935.00);
  });

  test('Calcul multi-taux (5.5% isolation + 10% plomberie + 20% matériel neuf)', () => {
    const items: QuoteLineItem[] = [
      {
        designation: 'Fenêtre double vitrage isolant (TVA 5.5%)',
        quantity: 2,
        unit: 'unité',
        unitPriceHT: 600.00, // 1200 HT -> TVA 5.5% = 66
        vatRate: 5.5,
        totalHT: 0,
        totalTTC: 0
      },
      {
        designation: 'Robinetterie rénovation (TVA 10%)',
        quantity: 1,
        unit: 'forfait',
        unitPriceHT: 150.00, // 150 HT -> TVA 10% = 15
        vatRate: 10.0,
        totalHT: 0,
        totalTTC: 0
      },
      {
        designation: 'Aménagement neuf extension (TVA 20%)',
        quantity: 1,
        unit: 'forfait',
        unitPriceHT: 500.00, // 500 HT -> TVA 20% = 100
        vatRate: 20.0,
        totalHT: 0,
        totalTTC: 0
      }
    ];

    const result = calculateQuoteTotals(items);
    assert.strictEqual(result.totalHT, 1850.00);
    assert.strictEqual(result.totalVAT, 181.00); // 66 + 15 + 100 = 181
    assert.strictEqual(result.totalTTC, 2031.00); // 1850 + 181 = 2031
  });

  test('Arrondi comptable précis sans artefact virgule flottante', () => {
    const items: QuoteLineItem[] = [
      {
        designation: 'Fourniture visserie et chevilles',
        quantity: 3,
        unit: 'boîte',
        unitPriceHT: 14.33, // 42.99 HT
        vatRate: 10.0, // 4.299 -> 4.30 TVA
        totalHT: 0,
        totalTTC: 0
      }
    ];

    const result = calculateQuoteTotals(items);
    assert.strictEqual(result.totalHT, 42.99);
    assert.strictEqual(result.totalVAT, 4.30);
    assert.strictEqual(result.totalTTC, 47.29);
  });
});
