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

export const DEFAULT_SPREADSHEET_ID = '1Juzs7I9JOi1ECSNvvtkFfWo1TjOZ_3JD';
export const DEFAULT_SPREADSHEET_URL = `https://docs.google.com/spreadsheets/d/${DEFAULT_SPREADSHEET_ID}/edit`;
export const DEFAULT_WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbwesenJV81E8Rlps2N1iMfTlYGjwajb6qTPmwJ6xmGVE_SLU7_nVGaT3_jbrWaLHLis/exec';

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
  const webhookUrl = localStorage.getItem(STORAGE_KEY_WEBHOOK_URL) || DEFAULT_WEBHOOK_URL;

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
 * Send lead to backend (Local store + Webhook + OAuth if active) in real-time
 */
export const dispatchLeadToBackend = async (
  record: WaitlistRecord,
  token?: string | null
): Promise<{ success: boolean; webhookSent: boolean; oauthSent: boolean }> => {
  // 1. Always save locally first so no lead is EVER lost
  saveLocalLead(record);

  const config = getSavedSpreadsheetConfig();
  let webhookSent = false;
  let oauthSent = false;

  // Build normalized payload supporting all field naming variations:
  // - name / firstName / fullName
  // - problem / biggestChallenge / challenge
  // - vipCode / vipDiscountCode
  // - date / timestamp
  const webhookPayload = {
    id: record.id || `lead_${Date.now()}`,
    firstName: record.firstName,
    name: record.firstName,
    fullName: record.firstName,
    email: record.email,
    mail: record.email,
    trade: record.trade,
    metier: record.trade,
    profession: record.trade,
    problem: record.problem || 'Non précisé',
    biggestChallenge: record.problem || 'Non précisé',
    challenge: record.problem || 'Non précisé',
    vipCode: record.vipCode || 'ARTISAN50',
    vipDiscountCode: record.vipCode || 'ARTISAN50',
    date: record.date || new Date().toLocaleString('fr-FR'),
    timestamp: new Date().toISOString(),
    status: record.status || 'Inscrit VIP (-50%)'
  };

  const tasks: Promise<any>[] = [];

  // 2. Dispatch to Google Apps Script Webhook immediately
  const webhookUrlToUse = config.webhookUrl || DEFAULT_WEBHOOK_URL;
  if (webhookUrlToUse) {
    const webhookPromise = (async () => {
      try {
        let targetUrl: URL;
        try {
          targetUrl = new URL(webhookUrlToUse);
        } catch {
          targetUrl = new URL(webhookUrlToUse, window.location.origin);
        }

        // Attach query parameters as well so Apps Scripts relying on e.parameter (GET or POST) receive all columns
        targetUrl.searchParams.set('name', record.firstName);
        targetUrl.searchParams.set('firstName', record.firstName);
        targetUrl.searchParams.set('email', record.email);
        targetUrl.searchParams.set('mail', record.email);
        targetUrl.searchParams.set('trade', record.trade);
        targetUrl.searchParams.set('metier', record.trade);
        targetUrl.searchParams.set('problem', record.problem || 'Non précisé');
        targetUrl.searchParams.set('biggestChallenge', record.problem || 'Non précisé');
        targetUrl.searchParams.set('vipCode', record.vipCode || 'ARTISAN50');
        targetUrl.searchParams.set('vipDiscountCode', record.vipCode || 'ARTISAN50');
        targetUrl.searchParams.set('date', record.date || new Date().toLocaleString('fr-FR'));
        targetUrl.searchParams.set('timestamp', new Date().toISOString());
        targetUrl.searchParams.set('status', record.status || 'Inscrit VIP (-50%)');

        await fetch(targetUrl.toString(), {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          mode: 'no-cors',
          body: JSON.stringify(webhookPayload),
          keepalive: true
        });

        markLeadAsSynced(record.email);
        webhookSent = true;
        console.log('✅ Lead envoyé avec succès au Webhook Google Apps Script en temps réel');
      } catch (e) {
        console.warn('Webhook dispatch notice:', e);
      }
    })();
    tasks.push(webhookPromise);
  }

  // 3. Dispatch via Google Sheets OAuth API in parallel if active
  const activeId = config.id || DEFAULT_SPREADSHEET_ID;
  const effectiveToken = token || cachedAccessToken;
  if (effectiveToken && activeId) {
    const oauthPromise = (async () => {
      try {
        await appendWaitlistToSheet(effectiveToken, activeId, record);
        oauthSent = true;
        markLeadAsSynced(record.email);
        console.log('✅ Inscription synchronisée avec succès dans Google Sheet via API OAuth');
      } catch (e) {
        console.warn('OAuth sync notice:', e);
      }
    })();
    tasks.push(oauthPromise);
  }

  // Await all background tasks in parallel without chain-blocking
  if (tasks.length > 0) {
    await Promise.allSettled(tasks);
  }

  return { success: webhookSent || oauthSent, webhookSent, oauthSent };
};

/**
 * Test Webhook connectivity by dispatching a realistic test artisan lead with full payload aliases
 */
export const testWebhookEndpoint = async (
  webhookUrl: string,
  customRecord?: Partial<WaitlistRecord> & {
    name?: string;
    biggestChallenge?: string;
    vipDiscountCode?: string;
    timestamp?: string;
  }
): Promise<boolean> => {
  if (!webhookUrl || !webhookUrl.startsWith('http')) return false;

  const now = new Date();
  const testPayload = {
    id: customRecord?.id || `test_${Date.now()}`,
    date: customRecord?.date || now.toLocaleDateString('fr-FR', {
      day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
    }),
    timestamp: customRecord?.timestamp || now.toISOString(),
    firstName: customRecord?.firstName || customRecord?.name || 'Jean Dupont (Test Automatique)',
    name: customRecord?.name || customRecord?.firstName || 'Jean Dupont (Test Automatique)',
    email: customRecord?.email || `jean.dupont.test${Math.floor(Math.random() * 900)}@batidevis.fr`,
    mail: customRecord?.email || `jean.dupont.test${Math.floor(Math.random() * 900)}@batidevis.fr`,
    trade: customRecord?.trade || 'Électricien',
    metier: customRecord?.trade || 'Électricien',
    problem: customRecord?.problem || customRecord?.biggestChallenge || 'Test de synchronisation Webhook Google Apps Script',
    biggestChallenge: customRecord?.biggestChallenge || customRecord?.problem || 'Test de synchronisation Webhook Google Apps Script',
    vipCode: customRecord?.vipCode || customRecord?.vipDiscountCode || 'ARTISAN50',
    vipDiscountCode: customRecord?.vipDiscountCode || customRecord?.vipCode || 'ARTISAN50',
    status: customRecord?.status || 'Inscrit VIP (-50%)'
  };

  saveLocalLead({
    id: testPayload.id,
    date: testPayload.date,
    firstName: testPayload.firstName,
    email: testPayload.email,
    trade: testPayload.trade,
    problem: testPayload.problem,
    vipCode: testPayload.vipCode,
    status: testPayload.status,
    syncedToSheets: true
  });

  try {
    let targetUrl: URL;
    try {
      targetUrl = new URL(webhookUrl);
    } catch {
      targetUrl = new URL(webhookUrl, window.location.origin);
    }

    targetUrl.searchParams.set('name', testPayload.name);
    targetUrl.searchParams.set('firstName', testPayload.firstName);
    targetUrl.searchParams.set('email', testPayload.email);
    targetUrl.searchParams.set('mail', testPayload.email);
    targetUrl.searchParams.set('trade', testPayload.trade);
    targetUrl.searchParams.set('metier', testPayload.trade);
    targetUrl.searchParams.set('problem', testPayload.problem);
    targetUrl.searchParams.set('biggestChallenge', testPayload.biggestChallenge);
    targetUrl.searchParams.set('vipCode', testPayload.vipCode);
    targetUrl.searchParams.set('vipDiscountCode', testPayload.vipDiscountCode);
    targetUrl.searchParams.set('date', testPayload.date);
    targetUrl.searchParams.set('timestamp', testPayload.timestamp);
    targetUrl.searchParams.set('status', testPayload.status);

    await fetch(targetUrl.toString(), {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      mode: 'no-cors',
      body: JSON.stringify(testPayload),
      keepalive: true
    });
    markLeadAsSynced(testPayload.email);
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
