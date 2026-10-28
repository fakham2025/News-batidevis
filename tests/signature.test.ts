import assert from 'node:assert';
import { test, describe } from 'node:test';
import { isValidSignatureData } from '../src/components/signature/signatureUtils';

describe('Task 4: Utilitaire et validation de signature électronique', () => {
  test('Signature valide PNG base64 est reconnue', () => {
    const validPng = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
    assert.strictEqual(isValidSignatureData(validPng), true);
  });

  test('Chaîne vide ou format invalide rejeté', () => {
    assert.strictEqual(isValidSignatureData(''), false);
    assert.strictEqual(isValidSignatureData('data:text/plain;base64,abc'), false);
    assert.strictEqual(isValidSignatureData('image.png'), false);
  });
});
