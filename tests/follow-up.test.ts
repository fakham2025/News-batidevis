import { test, describe } from 'node:test';
import assert from 'node:assert';
import { 
  formatFrenchPhoneForWhatsApp, 
  generateFollowUpMessage, 
  generateWhatsAppLink,
  generateSmsLink,
  type FollowUpParams 
} from '../src/services/followUp';

describe('BâtiDevis 2026 — Module de Relance Commerciale WhatsApp & SMS', () => {
  const quoteData: FollowUpParams = {
    clientName: 'M. Jean Dupont',
    clientPhone: '06 12 34 56 78',
    projectTitle: 'Remplacement Chauffe-eau 200L',
    quoteNumber: 'DEV-2026-084',
    totalTtc: 1094.50,
    quoteUrl: 'https://batidevis.fr/valider/tok_xyz98',
    companyName: 'Martin Plomberie Chauffage'
  };

  test('Normalisation du numéro de téléphone mobile français pour WhatsApp', () => {
    assert.strictEqual(formatFrenchPhoneForWhatsApp('06 12 34 56 78'), '33612345678');
    assert.strictEqual(formatFrenchPhoneForWhatsApp('07.98.76.54.32'), '33798765432');
    assert.strictEqual(formatFrenchPhoneForWhatsApp('+33 6 11 22 33 44'), '33611223344');
    assert.strictEqual(formatFrenchPhoneForWhatsApp('0612345678'), '33612345678');
  });

  test('Génération du message de relance J+3 (Courtoise)', () => {
    const msg = generateFollowUpMessage(quoteData, 'courtesy_j3');
    assert.ok(msg.includes('M. Jean Dupont'));
    assert.ok(msg.includes('DEV-2026-084'));
    assert.ok(msg.includes('1 094,50 €'));
    assert.ok(msg.includes('https://batidevis.fr/valider/tok_xyz98'));
    assert.ok(msg.includes('Martin Plomberie Chauffage'));
  });

  test('Génération du message de relance J+7 (Planning & Intervention)', () => {
    const msg = generateFollowUpMessage(quoteData, 'planning_j7');
    assert.ok(msg.includes('planning'));
    assert.ok(msg.includes('Remplacement Chauffe-eau 200L'));
    assert.ok(msg.includes('DEV-2026-084'));
  });

  test('Génération du lien profond WhatsApp conforme RFC 3986', () => {
    const link = generateWhatsAppLink(quoteData, 'courtesy_j3');
    assert.ok(link.startsWith('https://wa.me/33612345678?text='));
    assert.ok(link.includes(encodeURIComponent('DEV-2026-084')));
  });

  test('Génération du lien SMS universel', () => {
    const sms = generateSmsLink(quoteData, 'planning_j7');
    assert.ok(sms.startsWith('sms:0612345678?body='));
  });
});
