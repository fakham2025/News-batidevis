import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert';
import { 
  saveClientContact, 
  getClientContacts, 
  searchClientContacts, 
  findClientByPhoneOrEmail,
  clearClientsStorage,
  type ClientContact 
} from '../src/services/clientCrm';

describe('BâtiDevis 2026 — Carnet de Clients & Mini-CRM BTP', () => {
  beforeEach(() => {
    clearClientsStorage();
  });

  test('Enregistrement et persistance d’une nouvelle fiche client artisan', () => {
    const saved = saveClientContact({
      name: 'M. Jean Dupont',
      email: 'jean.dupont@orange.fr',
      phone: '06 12 34 56 78',
      address: '28 avenue de la République, 44200 Nantes'
    });

    assert.ok(saved.id.startsWith('cli_'));
    assert.strictEqual(saved.name, 'M. Jean Dupont');
    assert.strictEqual(saved.email, 'jean.dupont@orange.fr');
    assert.strictEqual(saved.phone, '06 12 34 56 78');

    const all = getClientContacts();
    assert.strictEqual(all.length, 1);
    assert.strictEqual(all[0].name, 'M. Jean Dupont');
  });

  test('Mise à jour sans doublon lors du ré-enregistrement avec le même téléphone', () => {
    saveClientContact({
      name: 'Pierre Martin',
      phone: '06 99 88 77 66',
      address: '1 rue de Paris'
    });

    // Deuxième sauvegarde avec le même numéro mais adresse mise à jour
    const updated = saveClientContact({
      name: 'Pierre Martin',
      phone: '06 99 88 77 66',
      address: '15 avenue des Lilas, 69002 Lyon'
    });

    const all = getClientContacts();
    assert.strictEqual(all.length, 1, 'Ne doit pas créer de doublon de fiche client');
    assert.strictEqual(all[0].address, '15 avenue des Lilas, 69002 Lyon');
  });

  test('Recherche multi-critères instantanée dans le carnet client', () => {
    saveClientContact({ name: 'Laurent Plomberie Test', phone: '06 11 22 33 44' });
    saveClientContact({ name: 'Sophie Bernard', email: 'sophie.bernard@free.fr', phone: '07 55 44 33 22' });
    saveClientContact({ name: 'Marc Electricité', address: '44000 Nantes' });

    const results = searchClientContacts('Bernard');
    assert.strictEqual(results.length, 1);
    assert.strictEqual(results[0].name, 'Sophie Bernard');

    const resultsNantes = searchClientContacts('Nantes');
    assert.strictEqual(resultsNantes.length, 1);
    assert.strictEqual(resultsNantes[0].name, 'Marc Electricité');

    const byPhone = searchClientContacts('06 11');
    assert.strictEqual(byPhone.length, 1);
    assert.strictEqual(byPhone[0].name, 'Laurent Plomberie Test');
  });
});
