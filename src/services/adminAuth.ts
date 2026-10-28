/**
 * Service d'authentification sécurisé pour l'Espace Administrateur BâtiDevis
 * Protection par Code PIN Maître avec session horodatée et limitation anti brute-force.
 */

const DEFAULT_ADMIN_PIN = '202684';
const STORAGE_KEY_ADMIN_SESSION = 'batidevis_admin_session_token';
const STORAGE_KEY_ADMIN_EXPIRY = 'batidevis_admin_session_expiry';

let inMemoryToken: string | null = null;
let inMemoryExpiry: number | null = null;
let failedAttemptsCount = 0;
let lockUntilTimestamp: number | null = null;

/**
 * Récupère le code PIN configuré (variable d'environnement ou défaut)
 */
export function getExpectedAdminPin(): string {
  if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_ADMIN_MASTER_PIN) {
    return import.meta.env.VITE_ADMIN_MASTER_PIN;
  }
  return DEFAULT_ADMIN_PIN;
}

/**
 * Vérifie si le portail est actuellement verrouillé à cause de tentatives répétées
 */
export function isBruteForceLocked(): boolean {
  if (!lockUntilTimestamp) return false;
  if (Date.now() > lockUntilTimestamp) {
    lockUntilTimestamp = null;
    failedAttemptsCount = 0;
    return false;
  }
  return true;
}

export function getFailedAttemptsCount(): number {
  return failedAttemptsCount;
}

export function recordFailedAttempt(): void {
  failedAttemptsCount += 1;
  if (failedAttemptsCount >= 5) {
    lockUntilTimestamp = Date.now() + 30000; // 30 secondes de verrouillage
  }
}

export function resetFailedAttempts(): void {
  failedAttemptsCount = 0;
  lockUntilTimestamp = null;
}

/**
 * Valide le code PIN saisi par l'administrateur
 */
export function verifyAdminPin(enteredPin: string): boolean {
  if (isBruteForceLocked()) return false;
  if (!enteredPin || enteredPin.length < 4) return false;

  const expected = getExpectedAdminPin();
  const valid = enteredPin.trim() === expected;

  if (valid) {
    resetFailedAttempts();
  } else {
    recordFailedAttempt();
  }

  return valid;
}

/**
 * Enregistre une session administrateur valide (durée 8 heures)
 */
export function setAdminSession(token: string): void {
  const expiry = Date.now() + 8 * 60 * 60 * 1000;
  inMemoryToken = token;
  inMemoryExpiry = expiry;

  try {
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem(STORAGE_KEY_ADMIN_SESSION, token);
      sessionStorage.setItem(STORAGE_KEY_ADMIN_EXPIRY, expiry.toString());
    }
  } catch {}
}

/**
 * Vérifie si une session administrateur active et non expirée existe
 */
export function isAdminAuthenticated(): boolean {
  // 1. Vérification en mémoire
  if (inMemoryToken && inMemoryExpiry && Date.now() < inMemoryExpiry) {
    return true;
  }

  // 2. Vérification sessionStorage
  try {
    if (typeof sessionStorage !== 'undefined') {
      const token = sessionStorage.getItem(STORAGE_KEY_ADMIN_SESSION);
      const expiry = sessionStorage.getItem(STORAGE_KEY_ADMIN_EXPIRY);
      if (token && expiry) {
        const expNum = parseInt(expiry, 10);
        if (Date.now() < expNum) {
          inMemoryToken = token;
          inMemoryExpiry = expNum;
          return true;
        }
      }
    }
  } catch {}

  return false;
}

/**
 * Déconnecte l'administrateur
 */
export function clearAdminSession(): void {
  inMemoryToken = null;
  inMemoryExpiry = null;
  try {
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.removeItem(STORAGE_KEY_ADMIN_SESSION);
      sessionStorage.removeItem(STORAGE_KEY_ADMIN_EXPIRY);
    }
  } catch {}
}
