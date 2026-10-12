/**
 * Google Sheets & Workspace Integration Service for BâtiDevis 2026 (Backend Mode)
 * Dedicated backend service to collect waitlist inscriptions into Google Sheets.
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  User, 
  signOut 
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App singleton
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);

// Workspace OAuth Scopes
export const WORKSPACE_SCOPES = [
  'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/drive.readonly',
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/spreadsheets.readonly'
];

const provider = new GoogleAuthProvider();
WORKSPACE_SCOPES.forEach((scope) => provider.addScope(scope));

// Default User Google Sheet configured for BâtiDevis 2026
export const DEFAULT_SPREADSHEET_ID = '1Juzs7I9JOi1ECSNvvtkFfWo1TjOZ_3JD';
export const DEFAULT_SPREADSHEET_URL = `https://docs.google.com/spreadsheets/d/${DEFAULT_SPREADSHEET_ID}/edit`;

const STORAGE_KEY_TOKEN = 'batidevis_google_access_token';
const STORAGE_KEY_SPREADSHEET_ID = 'batidevis_admin_spreadsheet_id';
const STORAGE_KEY_SPREADSHEET_URL = 'batidevis_admin_spreadsheet_url';
const STORAGE_KEY_WEBHOOK_URL = 'batidevis_admin_sheets_webhook';
const STORAGE_KEY_LEADS = 'batidevis_leads_db';

// In-memory token cache (hydrated from storage if present)
let cachedAccessToken: string | null = (() => {
  try {
    return sessionStorage.getItem(STORAGE_KEY_TOKEN) || localStorage.getItem(STORAGE_KEY_TOKEN) || null;
  } catch {
    return null;
  }
})();
let isSigningIn = false;

export interface WaitlistRecord {
  id?: string;
  date: string;
  firstName: string;
  email: string;
  trade: string;
  problem: string;
  vipCode: string;
  status: string;
  syncedToSheets?: boolean;
}

export interface DevisRecord {
  quoteNumber: string;
  date: string;
  client: string;
  trade: string;
  amountHT: number;
  vatRate: string;
  amountTTC: number;
  pdpCompliant: string;
  status: string;
}

/**
 * Local Leads Storage for offline & 100% capture resilience
 */
export const getLocalLeads = (): WaitlistRecord[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_LEADS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveLocalLead = (lead: WaitlistRecord): WaitlistRecord[] => {
  try {
    const existing = getLocalLeads();
    const isDuplicate = existing.some(l => l.email === lead.email && l.date === lead.date);
    if (isDuplicate) return existing;

    const updated = [{ ...lead, id: lead.id || `lead_${Date.now()}` }, ...existing];
    localStorage.setItem(STORAGE_KEY_LEADS, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
};

export const markLeadAsSynced = (leadEmail: string) => {
  try {
    const existing = getLocalLeads();
    const updated = existing.map(l => l.email === leadEmail ? { ...l, syncedToSheets: true } : l);
    localStorage.setItem(STORAGE_KEY_LEADS, JSON.stringify(updated));
  } catch {
    // ignore
  }
};

export const getSavedSpreadsheetConfig = () => {
  const storedId = localStorage.getItem(STORAGE_KEY_SPREADSHEET_ID);
  const id = storedId || DEFAULT_SPREADSHEET_ID;
  const storedUrl = localStorage.getItem(STORAGE_KEY_SPREADSHEET_URL);
  const url = storedUrl || (id ? `https://docs.google.com/spreadsheets/d/${id}/edit` : DEFAULT_SPREADSHEET_URL);
  const webhookUrl = localStorage.getItem(STORAGE_KEY_WEBHOOK_URL) || null;

  return { id, url, webhookUrl };
};

export const saveSpreadsheetConfig = (id: string, url: string) => {
  localStorage.setItem(STORAGE_KEY_SPREADSHEET_ID, id);
  localStorage.setItem(STORAGE_KEY_SPREADSHEET_URL, url);
};

export const saveWebhookConfig = (webhookUrl: string) => {
  localStorage.setItem(STORAGE_KEY_WEBHOOK_URL, webhookUrl);
};

/**
 * Initialize auth listener with persistent token recovery
 */
export const initAuth = (
  onAuthSuccess?: (user: User, token: string | null) => void,
  onAuthFailure?: () => void
) => {
  const storedToken = sessionStorage.getItem(STORAGE_KEY_TOKEN) || localStorage.getItem(STORAGE_KEY_TOKEN);
  if (storedToken) cachedAccessToken = storedToken;

  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      const activeToken = cachedAccessToken || sessionStorage.getItem(STORAGE_KEY_TOKEN) || localStorage.getItem(STORAGE_KEY_TOKEN);
      if (onAuthSuccess) onAuthSuccess(user, activeToken || null);
    } else {
      cachedAccessToken = null;
      try {
        sessionStorage.removeItem(STORAGE_KEY_TOKEN);
        localStorage.removeItem(STORAGE_KEY_TOKEN);
      } catch {}
      if (onAuthFailure) onAuthFailure();
    }
  });
};

/**
 * Google Sign In for Admin
 */
export const googleSignIn = async (): Promise<{ user: User; accessToken: string }> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error("Impossible d'obtenir le jeton d'accès Google.");
    }
    cachedAccessToken = credential.accessToken;
    try {
      sessionStorage.setItem(STORAGE_KEY_TOKEN, credential.accessToken);
      localStorage.setItem(STORAGE_KEY_TOKEN, credential.accessToken);
    } catch {}
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error('Erreur de connexion Google:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

/**
 * Sign out
 */
export const googleSignOut = async () => {
  await signOut(auth);
  cachedAccessToken = null;
  try {
    sessionStorage.removeItem(STORAGE_KEY_TOKEN);
    localStorage.removeItem(STORAGE_KEY_TOKEN);
  } catch {}
};

/**
 * Get cached access token with persistent fallback
 */
export const getAccessToken = async (): Promise<string | null> => {
  if (cachedAccessToken) return cachedAccessToken;
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY_TOKEN) || localStorage.getItem(STORAGE_KEY_TOKEN);
    if (stored) {
      cachedAccessToken = stored;
      return stored;
    }
  } catch {}
  return null;
};

/**
 * Ensure sharing permission so the spreadsheet opens in browser without "Impossible d'ouvrir"
 */
export const grantDriveOpenPermission = async (token: string, fileId: string) => {
  try {
    await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}/permissions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        role: 'writer',
        type: 'anyone'
      })
    });
  } catch (err) {
    console.warn('Notice permission:', err);
  }
};

/**
 * Ensure database spreadsheet exists and has required structure
 */
export const ensureDatabaseSpreadsheet = async (
  token: string,
  targetId?: string
): Promise<{ id: string; url: string; title: string }> => {
  const sheetIdToUse = targetId || getSavedSpreadsheetConfig().id || DEFAULT_SPREADSHEET_ID;

  // 1. Try to verify and prepare target sheet
  if (sheetIdToUse) {
    try {
      const checkRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetIdToUse}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (checkRes.ok) {
        const fileMeta = await checkRes.json();
        const fileUrl = `https://docs.google.com/spreadsheets/d/${sheetIdToUse}/edit`;
        
        // Grant permissions to avoid "Impossible d'ouvrir le fichier"
        await grantDriveOpenPermission(token, sheetIdToUse);

        // Check if tab exists or prepare header
        const tabTitles: string[] = (fileMeta.sheets || []).map((s: any) => s.properties?.title);
        const activeTab = tabTitles[0] || 'Sheet1';

        // Check if header exists
        try {
          const headerRes = await fetch(
            `https://sheets.googleapis.com/v4/spreadsheets/${sheetIdToUse}/values/${encodeURIComponent(activeTab)}!A1:G1`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const headerData = await headerRes.json();
          if (!headerData.values || headerData.values.length === 0) {
            // Write headers
            await fetch(
              `https://sheets.googleapis.com/v4/spreadsheets/${sheetIdToUse}/values/${encodeURIComponent(activeTab)}!A1:G1?valueInputOption=USER_ENTERED`,
              {
                method: 'PUT',
                headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  range: `${activeTab}!A1:G1`,
                  majorDimension: 'ROWS',
                  values: [[
                    'Date Inscription',
                    'Prénom Artisan',
                    'Email Professionnel',
                    'Corps de Métier',
                    'Problème Devis Exprimé',
                    'Code VIP Appliqué',
                    'Statut Inscription'
                  ]]
                })
              }
            );
          }
        } catch {
          // ignore
        }

        saveSpreadsheetConfig(sheetIdToUse, fileUrl);
        return {
          id: sheetIdToUse,
          url: fileUrl,
          title: fileMeta.properties?.title || 'BâtiDevis - Base de Données 2026'
        };
      }
    } catch (e) {
      console.warn('Erreur vérification du classeur:', e);
    }
  }

  // 2. Search existing file in Drive
  try {
    const searchUrl = `https://www.googleapis.com/drive/v3/files?q=name = 'BâtiDevis - Base de Données 2026' and mimeType = 'application/vnd.google-apps.spreadsheet' and trashed = false&fields=files(id, name, webViewLink)`;
    const searchRes = await fetch(searchUrl, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (searchRes.ok) {
      const data = await searchRes.json();
      if (data.files && data.files.length > 0) {
        const file = data.files[0];
        const editUrl = `https://docs.google.com/spreadsheets/d/${file.id}/edit`;
        await grantDriveOpenPermission(token, file.id);
        saveSpreadsheetConfig(file.id, editUrl);
        return {
          id: file.id,
          url: editUrl,
          title: file.name
        };
      }
    }
  } catch (e) {
    console.warn('Erreur recherche Drive:', e);
  }

  // 3. Fallback: Create new spreadsheet
  const createRes = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      properties: {
        title: 'BâtiDevis - Base de Données 2026'
      },
      sheets: [
        {
          properties: {
            title: 'Inscriptions',
            gridProperties: { rowCount: 1000, columnCount: 10 }
          }
        }
      ]
    })
  });

  if (!createRes.ok) {
    const errData = await createRes.json().catch(() => ({}));
    throw new Error(errData.error?.message || 'Erreur lors de la création du Google Sheet.');
  }

  const sheetData = await createRes.json();
  const newId = sheetData.spreadsheetId;
  const directEditUrl = `https://docs.google.com/spreadsheets/d/${newId}/edit`;

  await grantDriveOpenPermission(token, newId);

  // Headers
  await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${newId}/values/Inscriptions!A1:G1?valueInputOption=USER_ENTERED`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        range: 'Inscriptions!A1:G1',
        majorDimension: 'ROWS',
        values: [[
          'Date Inscription',
          'Prénom Artisan',
          'Email Professionnel',
          'Corps de Métier',
          'Problème Devis Exprimé',
          'Code VIP Appliqué',
          'Statut Inscription'
        ]]
      })
    }
  );

  saveSpreadsheetConfig(newId, directEditUrl);

  return {
    id: newId,
    url: directEditUrl,
    title: 'BâtiDevis - Base de Données 2026'
  };
};

/**
 * Append Waitlist inscription to Google Sheet dynamically
 */
export const appendWaitlistToSheet = async (
  token: string,
  spreadsheetId: string,
  record: WaitlistRecord
): Promise<boolean> => {
  // Find which tab to use
  let tabName = 'Inscriptions';
  try {
    const metaRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (metaRes.ok) {
      const meta = await metaRes.json();
      const existingTitles: string[] = (meta.sheets || []).map((s: any) => s.properties?.title);
      if (existingTitles.includes('Inscriptions_Waitlist')) {
        tabName = 'Inscriptions_Waitlist';
      } else if (existingTitles.includes('Inscriptions')) {
        tabName = 'Inscriptions';
      } else if (existingTitles.length > 0) {
        tabName = existingTitles[0];
      }
    } else if (metaRes.status === 401) {
      // Token expired
      cachedAccessToken = null;
      try {
        sessionStorage.removeItem(STORAGE_KEY_TOKEN);
        localStorage.removeItem(STORAGE_KEY_TOKEN);
      } catch {}
      throw new Error("Jeton de connexion Google expiré. Veuillez vous reconnecter dans l'espace Admin.");
    }
  } catch (err: any) {
    if (err.message?.includes('expiré')) throw err;
  }

  // Ensure header row exists if sheet is empty
  try {
    const headerCheckRes = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(tabName)}!A1:G1`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (headerCheckRes.ok) {
      const headerData = await headerCheckRes.json();
      if (!headerData.values || headerData.values.length === 0) {
        await fetch(
          `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(tabName)}!A1:G1?valueInputOption=USER_ENTERED`,
          {
            method: 'PUT',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              range: `${tabName}!A1:G1`,
              majorDimension: 'ROWS',
              values: [[
                'Date Inscription',
                'Prénom Artisan',
                'Email Professionnel',
                'Corps de Métier',
                'Problème Devis Exprimé',
                'Code VIP Appliqué',
                'Statut Inscription'
              ]]
            })
          }
        );
      }
    }
  } catch {
    // ignore
  }

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(tabName)}!A:G:append?valueInputOption=USER_ENTERED`;
  
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      range: `${tabName}!A:G`,
      majorDimension: 'ROWS',
      values: [
        [
          record.date,
          record.firstName,
          record.email,
          record.trade,
          record.problem || 'Non précisé',
          record.vipCode,
          record.status
        ]
      ]
    })
  });

  if (!res.ok) {
    if (res.status === 401) {
      cachedAccessToken = null;
      try {
        sessionStorage.removeItem(STORAGE_KEY_TOKEN);
        localStorage.removeItem(STORAGE_KEY_TOKEN);
      } catch {}
      throw new Error("Session Google expirée. Veuillez vous reconnecter dans l'espace Admin.");
    }
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || "Échec de l'enregistrement dans Google Sheets.");
  }

  markLeadAsSynced(record.email);
  return true;
};

/**
 * Send lead to backend (Local store + Webhook + OAuth if active)
 */
export const dispatchLeadToBackend = async (record: WaitlistRecord, token?: string | null) => {
  // 1. Always save locally first so no lead is EVER lost
  saveLocalLead(record);

  const config = getSavedSpreadsheetConfig();

  // 2. If webhook URL configured (Google Apps Script Web App)
  if (config.webhookUrl) {
    try {
      await fetch(config.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        mode: 'no-cors',
        body: JSON.stringify(record)
      });
      markLeadAsSynced(record.email);
      console.log('✅ Lead envoyé avec succès au Webhook Google Apps Script');
    } catch (e) {
      console.warn('Webhook dispatch notice:', e);
    }
  }

  // 3. If OAuth token available (passed in, cached in memory, or in storage)
  const activeId = config.id || DEFAULT_SPREADSHEET_ID;
  const effectiveToken = token || cachedAccessToken || (await getAccessToken());
  if (effectiveToken && activeId) {
    try {
      await appendWaitlistToSheet(effectiveToken, activeId, record);
      console.log('✅ Inscription synchronisée avec succès dans Google Sheet via API OAuth');
    } catch (e) {
      console.warn('OAuth sync notice:', e);
    }
  }
};

/**
 * Test Webhook connectivity
 */
export const testWebhookEndpoint = async (webhookUrl: string): Promise<boolean> => {
  if (!webhookUrl || !webhookUrl.startsWith('http')) return false;

  const testPayload: WaitlistRecord = {
    date: new Date().toLocaleDateString('fr-FR', {
      day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
    }),
    firstName: 'Test Webhook',
    email: 'test.artisan@batidevis.fr',
    trade: 'Électricien',
    problem: 'Test direct de connexion Webhook',
    vipCode: 'TESTWEBHOOK',
    status: 'Test Actif'
  };

  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      mode: 'no-cors',
      body: JSON.stringify(testPayload)
    });
    return true;
  } catch (err) {
    console.error('Test Webhook failed:', err);
    return false;
  }
};

/**
 * Read waitlist rows from Google Sheet
 */
export const fetchWaitlistRows = async (
  token: string,
  spreadsheetId: string
): Promise<WaitlistRecord[]> => {
  let tabName = 'Inscriptions';
  try {
    const metaRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (metaRes.ok) {
      const meta = await metaRes.json();
      const existingTitles: string[] = (meta.sheets || []).map((s: any) => s.properties?.title);
      if (existingTitles.includes('Inscriptions_Waitlist')) tabName = 'Inscriptions_Waitlist';
      else if (existingTitles.includes('Inscriptions')) tabName = 'Inscriptions';
      else if (existingTitles.length > 0) tabName = existingTitles[0];
    }
  } catch {
    // fallback
  }

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(tabName)}!A2:G100`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok) return [];

  const data = await res.json();
  if (!data.values || !Array.isArray(data.values)) return [];

  return data.values.map((row: string[]) => ({
    date: row[0] || '',
    firstName: row[1] || '',
    email: row[2] || '',
    trade: row[3] || '',
    problem: row[4] || '',
    vipCode: row[5] || '',
    status: row[6] || 'Inscrit'
  }));
};
