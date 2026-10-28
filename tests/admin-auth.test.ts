import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert';
import { 
  verifyAdminPin, 
  setAdminSession, 
  isAdminAuthenticated, 
  clearAdminSession,
  getFailedAttemptsCount,
  recordFailedAttempt,
  resetFailedAttempts 
} from '../src/services/adminAuth';

describe('BâtiDevis 2026 — Authentification Sécurisée Portail Administrateur', () => {
  beforeEach(() => {
    clearAdminSession();
    resetFailedAttempts();
  });

  test('Validation exacte du code PIN Maître administrateur', () => {
    assert.strictEqual(verifyAdminPin('202684'), true);
    assert.strictEqual(verifyAdminPin('000000'), false);
    assert.strictEqual(verifyAdminPin(''), false);
    assert.strictEqual(verifyAdminPin('123456'), false);
  });

  test('Persistance et validation de la session administrateur', () => {
    assert.strictEqual(isAdminAuthenticated(), false);

    setAdminSession('token_valid_admin_session_2026');
    assert.strictEqual(isAdminAuthenticated(), true);

    clearAdminSession();
    assert.strictEqual(isAdminAuthenticated(), false);
  });

  test('Protection anti brute-force après plusieurs échecs consécutifs', () => {
    assert.strictEqual(getFailedAttemptsCount(), 0);

    recordFailedAttempt();
    recordFailedAttempt();
    recordFailedAttempt();
    assert.strictEqual(getFailedAttemptsCount(), 3);

    resetFailedAttempts();
    assert.strictEqual(getFailedAttemptsCount(), 0);
  });
});
