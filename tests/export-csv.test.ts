/**
 * Tests TDD — Export CSV Waitlist (Task 8)
 * npx tsx --test tests/export-csv.test.ts
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { generateWaitlistCsv, type WaitlistEntry } from '../src/services/exportCsv.ts';

const mockEntries: WaitlistEntry[] = [
  {
    id: '1',
    nom: 'Dupont Jean',
    email: 'jean.dupont@example.com',
    telephone: '0612345678',
    metier: 'Maçon',
    departement: '75',
    date_inscription: '2026-10-01T10:00:00Z',
    statut: 'en_attente',
  },
  {
    id: '2',
    nom: 'Martin "Élise"',
    email: 'elise.martin@example.com',
    telephone: '0798765432',
    metier: 'Électricien',
    departement: '13',
    date_inscription: '2026-10-15T08:30:00Z',
    statut: 'contacte',
  },
  {
    id: '3',
    nom: 'Bertrand; Pierre',
    email: 'pierre@example.com',
    telephone: '',
    metier: 'Plombier',
    departement: '69',
    date_inscription: '2026-10-20T14:00:00Z',
    statut: 'converti',
  },
];

describe('generateWaitlistCsv', () => {
  it('commence avec un BOM UTF-8', () => {
    const csv = generateWaitlistCsv(mockEntries);
    assert.ok(csv.startsWith('\uFEFF'), 'Le CSV doit commencer par un BOM UTF-8');
  });

  it('contient les en-têtes corrects', () => {
    const csv = generateWaitlistCsv(mockEntries);
    const firstLine = csv.split('\n')[0];
    assert.ok(firstLine.includes('Nom'));
    assert.ok(firstLine.includes('Email'));
    assert.ok(firstLine.includes('Telephone'));
    assert.ok(firstLine.includes('Metier'));
    assert.ok(firstLine.includes('Departement'));
    assert.ok(firstLine.includes('Date inscription'));
    assert.ok(firstLine.includes('Statut'));
  });

  it('échappe les guillemets doubles dans les valeurs', () => {
    const csv = generateWaitlistCsv(mockEntries);
    // "Élise" dans le nom doit être échappé avec double guillemet
    assert.ok(csv.includes('""Élise""'), 'Les guillemets doivent être doublés');
  });

  it('échappe les valeurs contenant des points-virgules', () => {
    const csv = generateWaitlistCsv(mockEntries);
    // "Bertrand; Pierre" doit être entouré de guillemets
    assert.ok(csv.includes('"Bertrand; Pierre"'), 'Les valeurs avec ; doivent être entre guillemets');
  });

  it('contient le bon nombre de lignes (en-tête + données)', () => {
    const csv = generateWaitlistCsv(mockEntries);
    const lines = csv.split('\n').filter(l => l.trim() !== '');
    assert.strictEqual(lines.length, 4); // 1 header + 3 data
  });

  it('formate la date en français lisible', () => {
    const csv = generateWaitlistCsv(mockEntries);
    assert.ok(csv.includes('01/10/2026'), 'La date doit être au format DD/MM/YYYY');
  });
});
