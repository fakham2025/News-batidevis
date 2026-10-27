import assert from 'node:assert';
import { test, describe } from 'node:test';
import { registerWaitlistLead } from '../src/services/waitlist';

describe('BâtiDevis 2026 - Inscription Waitlist Supabase Backend', () => {
  test('Inscription nouvel artisan retourne succès et numéro de file', async () => {
    const uniqueEmail = `artisan.test.${Date.now()}@batidevis.fr`;
    const result = await registerWaitlistLead({
      first_name: 'Stéphane',
      email: uniqueEmail,
      trade: 'Menuisier',
      problem: 'Génération automatique Factur-X 2026',
      vip_code: 'ARTISAN50'
    });

    assert.strictEqual(result.success, true);
    assert.strictEqual(typeof result.queueNumber, 'number');
    assert.strictEqual(result.queueNumber >= 240, true);
    assert.strictEqual(result.isExisting, false);
  });

  test('Inscription doublon avec même email gérée gracieusement sans crash', async () => {
    const duplicateEmail = `artisan.doublon.${Date.now()}@batidevis.fr`;
    
    // Première inscription
    const firstResult = await registerWaitlistLead({
      first_name: 'Lucas',
      email: duplicateEmail,
      trade: 'Électricien',
      problem: 'Devis le soir trop long'
    });
    assert.strictEqual(firstResult.success, true);
    assert.strictEqual(firstResult.isExisting, false);

    // Deuxième inscription avec même email
    const secondResult = await registerWaitlistLead({
      first_name: 'Lucas',
      email: duplicateEmail,
      trade: 'Électricien',
      problem: 'Devis le soir trop long'
    });

    assert.strictEqual(secondResult.success, true);
    assert.strictEqual(secondResult.isExisting, true);
    assert.strictEqual(secondResult.queueNumber, firstResult.queueNumber);
  });
});
