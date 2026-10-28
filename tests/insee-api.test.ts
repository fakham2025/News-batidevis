import { test, describe } from 'node:test';
import assert from 'node:assert';
import { 
  computeTvaIntra, 
  parseEntrepriseRecord, 
  type EntrepriseSearchResult 
} from '../src/services/inseeApi';

describe('BâtiDevis 2026 — API Recherche Entreprises & SIRET Gouv.fr', () => {
  test('Calcul automatique de la clé TVA intracommunautaire française', () => {
    // SIREN 849302910: 849302910 % 97 = 10 -> (12 + 3 * 10) % 97 = 42 -> FR42849302910
    const vat = computeTvaIntra('849302910');
    assert.strictEqual(vat, 'FR42849302910');

    // Test avec clé à un chiffre (doit être préfixée par 0)
    // SIREN 443061841 (Google France) -> 443061841 % 97 = 20 -> 12 + 60 = 72 % 97 = 72 -> FR72443061841
    const vat2 = computeTvaIntra('443061841');
    assert.strictEqual(vat2, 'FR64443061841');
  });

  test('Parsing d’une réponse brute de l’API Recherche Entreprises Gouv', () => {
    const rawGouvRecord = {
      siren: '849302910',
      nom_complet: 'MARTIN PLOMBERIE CHAUFFAGE',
      nom_raison_sociale: 'MARTIN PLOMBERIE CHAUFFAGE SAS',
      activite_principale: '43.22A',
      siege: {
        siret: '84930291000028',
        adresse: '12 RUE DES ARTISANS',
        code_postal: '44000',
        commune: 'NANTES'
      }
    };

    const parsed: EntrepriseSearchResult = parseEntrepriseRecord(rawGouvRecord);

    assert.strictEqual(parsed.siren, '849302910');
    assert.strictEqual(parsed.siret, '84930291000028');
    assert.strictEqual(parsed.nom_complet, 'MARTIN PLOMBERIE CHAUFFAGE SAS');
    assert.strictEqual(parsed.code_naf, '43.22A');
    assert.strictEqual(parsed.adresse_complete, '12 RUE DES ARTISANS, 44000 NANTES');
    assert.strictEqual(parsed.code_postal, '44000');
    assert.strictEqual(parsed.commune, 'NANTES');
    assert.strictEqual(parsed.tva_intra, 'FR42849302910');
  });

  test('Gestion robuste des fiches d’entreprises sans nom_raison_sociale', () => {
    const rawCraftsman = {
      siren: '753123456',
      nom_complet: 'DUPONT PIERRE',
      activite_principale: '43.34Z',
      siege: {
        siret: '75312345600019',
        adresse: '5 ROUTE DE PARIS',
        code_postal: '69002',
        commune: 'LYON'
      }
    };

    const parsed = parseEntrepriseRecord(rawCraftsman);
    assert.strictEqual(parsed.nom_complet, 'DUPONT PIERRE');
    assert.strictEqual(parsed.siret, '75312345600019');
    assert.strictEqual(parsed.code_naf, '43.34Z');
  });
});
