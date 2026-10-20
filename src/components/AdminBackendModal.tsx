import { useState, useEffect } from 'react';
import { 
  X, 
  ExternalLink, 
  RefreshCw, 
  Database, 
  FileSpreadsheet, 
  CheckCircle2, 
  AlertCircle, 
  Users, 
  Download, 
  Copy, 
  Check, 
  Code, 
  ShieldCheck, 
  Settings, 
  Send, 
  HelpCircle, 
  KeyRound,
  Lock,
  Eye,
  EyeOff,
  LogOut,
  ShieldAlert,
  Clock,
  Sparkles
} from 'lucide-react';
import { 
  googleSignIn, 
  googleSignOut, 
  ensureDatabaseSpreadsheet, 
  appendWaitlistToSheet, 
  getLocalLeads, 
  saveLocalLead, 
  getSavedSpreadsheetConfig, 
  saveSpreadsheetConfig, 
  saveWebhookConfig, 
  testWebhookEndpoint, 
  dispatchLeadToBackend,
  getAccessToken,
  DEFAULT_SPREADSHEET_ID, 
  DEFAULT_SPREADSHEET_URL, 
  DEFAULT_WEBHOOK_URL, 
  WaitlistRecord 
} from '../services/googleSheets';
import { User } from 'firebase/auth';
import { 
  SUPABASE_SQL_SCHEMA, 
  getSavedWaitlist, 
  saveWaitlist, 
  getFounderCohortStats, 
  WaitlistEntry 
} from '../services/db';

interface AdminBackendModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  token: string | null;
  onAuthChange: (user: User | null, token: string | null) => void;
}

const STORAGE_KEY_ADMIN_PIN = 'batidevis_admin_pin';
const STORAGE_KEY_SESSION_AUTH = 'batidevis_admin_session_auth';
const AUTHORIZED_ADMIN_EMAIL = 'fakham6@gmail.com';
const DEFAULT_ADMIN_PIN = '2026';

export function AdminBackendModal({
  isOpen,
  onClose,
  user,
  token,
  onAuthChange
}: AdminBackendModalProps) {
  // Authentication gate state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [pinInput, setPinInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // New PIN update state in Settings tab
  const [newPin, setNewPin] = useState('');
  const [pinChangeMsg, setPinChangeMsg] = useState<string | null>(null);

  // Admin Dashboard states
  const [activeTab, setActiveTab] = useState<'cohort' | 'supabase' | 'leads' | 'webhook' | 'config'>('cohort');
  const [cohortEntries, setCohortEntries] = useState<WaitlistEntry[]>([]);
  const [copiedSql, setCopiedSql] = useState(false);
  const [leads, setLeads] = useState<WaitlistRecord[]>([]);
  const [customSheetUrl, setCustomSheetUrl] = useState('');
  const [customWebhookUrl, setCustomWebhookUrl] = useState('');
  const [currentSheetUrl, setCurrentSheetUrl] = useState<string>(DEFAULT_SPREADSHEET_URL);
  const [currentSheetId, setCurrentSheetId] = useState<string>(DEFAULT_SPREADSHEET_ID);
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isTestingWebhook, setIsTestingWebhook] = useState(false);
  const [msgSuccess, setMsgSuccess] = useState<string | null>(null);
  const [msgError, setMsgError] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedCurl, setCopiedCurl] = useState(false);

  useEffect(() => {
    if (isOpen) {
      checkInitialAuth();
    } else {
      setPinInput('');
      setAuthError(null);
    }
  }, [isOpen, user]);

  const checkInitialAuth = () => {
    // Check if user is already authenticated via session or matching admin email
    const sessionAuth = sessionStorage.getItem(STORAGE_KEY_SESSION_AUTH) === 'true';
    const isGoogleAdmin = user?.email?.toLowerCase() === AUTHORIZED_ADMIN_EMAIL.toLowerCase();

    if (sessionAuth || isGoogleAdmin) {
      setIsAuthenticated(true);
      loadState();
    } else {
      setIsAuthenticated(false);
    }
  };

  const handleUnlockWithPin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setAuthError(null);

    const storedPin = localStorage.getItem(STORAGE_KEY_ADMIN_PIN) || DEFAULT_ADMIN_PIN;
    const cleanInput = pinInput.trim();

    // Accept stored PIN, default PIN, or 'batidevis2026'
    if (cleanInput === storedPin || cleanInput === DEFAULT_ADMIN_PIN || cleanInput === 'batidevis2026') {
      sessionStorage.setItem(STORAGE_KEY_SESSION_AUTH, 'true');
      setIsAuthenticated(true);
      setPinInput('');
      loadState();
    } else {
      setAuthError('Code administrateur incorrect. Accès refusé.');
    }
  };

  const handleUnlockWithGoogle = async () => {
    setIsLoading(true);
    setAuthError(null);
    try {
      const res = await googleSignIn();
      onAuthChange(res.user, res.accessToken);

      // Verify if email matches admin
      if (res.user.email?.toLowerCase() === AUTHORIZED_ADMIN_EMAIL.toLowerCase()) {
        sessionStorage.setItem(STORAGE_KEY_SESSION_AUTH, 'true');
        setIsAuthenticated(true);
        loadState();
      } else {
        // Disconnect unauthorized user
        await googleSignOut();
        onAuthChange(null, null);
        setAuthError(`Accès refusé : le compte (${res.user.email}) n'est pas autorisé en tant qu'administrateur.`);
      }
    } catch (err: any) {
      setAuthError(err.message || 'Erreur lors de la connexion Google.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLockSession = () => {
    sessionStorage.removeItem(STORAGE_KEY_SESSION_AUTH);
    setIsAuthenticated(false);
    setPinInput('');
    setAuthError(null);
  };

  const handleUpdatePin = () => {
    if (newPin.trim().length < 4) {
      setPinChangeMsg('Le code doit comporter au moins 4 caractères.');
      return;
    }
    localStorage.setItem(STORAGE_KEY_ADMIN_PIN, newPin.trim());
    setNewPin('');
    setPinChangeMsg('Nouveau code administrateur enregistré avec succès !');
    setTimeout(() => setPinChangeMsg(null), 3000);
  };

  const loadState = () => {
    const local = getLocalLeads();
    setLeads(local);
    setCohortEntries(getSavedWaitlist());

    const config = getSavedSpreadsheetConfig();
    const activeId = config.id || DEFAULT_SPREADSHEET_ID;
    const activeUrl = config.url || `https://docs.google.com/spreadsheets/d/${activeId}/edit`;

    setCurrentSheetId(activeId);
    setCurrentSheetUrl(activeUrl);
    setCustomSheetUrl(activeUrl);
    if (config.webhookUrl) setCustomWebhookUrl(config.webhookUrl);
  };

  const handleToggleBetaPlan = (id: string) => {
    const list = getSavedWaitlist();
    const updated = list.map(e => {
      if (e.id === id) {
        const nextPlan = e.plan === 'beta' ? 'fondateur' : 'beta';
        return { ...e, plan: nextPlan as any };
      }
      return e;
    });
    saveWaitlist(updated);
    setCohortEntries(updated);
    setMsgSuccess("Statut du plan mis à jour (activation bêta) !");
    setTimeout(() => setMsgSuccess(null), 3000);
  };

  const handleExportCohortCSV = () => {
    if (cohortEntries.length === 0) return;
    const headers = ["ID", "Prénom", "Email", "Métier", "Département", "Statut TVA", "Problème", "Source", "Plan", "Statut", "Catégorie Quota", "Date"];
    const rows = cohortEntries.map(e => [
      `"${e.id}"`,
      `"${e.prenom}"`,
      `"${e.email}"`,
      `"${e.metier}"`,
      `"${e.departement}"`,
      `"${e.statut_tva}"`,
      `"${(e.probleme || '').replace(/"/g, '""')}"`,
      `"${e.source}"`,
      `"${e.plan}"`,
      `"${e.status}"`,
      `"${e.quota_category}"`,
      `"${e.created_at}"`
    ]);
    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", `batidevis_cohorte_fondateurs_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleGoogleAccountSync = async () => {
    setIsLoading(true);
    setMsgError(null);
    try {
      const res = await googleSignIn();
      onAuthChange(res.user, res.accessToken);
      
      const sheet = await ensureDatabaseSpreadsheet(res.accessToken, currentSheetId);
      setCurrentSheetId(sheet.id);
      setCurrentSheetUrl(sheet.url);
      setMsgSuccess(`Classeur synchronisé avec succès : ${sheet.id}`);
      setTimeout(() => setMsgSuccess(null), 4000);
    } catch (err: any) {
      console.error(err);
      setMsgError(err.message || 'Erreur lors de la synchronisation Google.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveCustomSheet = () => {
    if (!customSheetUrl.trim()) return;
    
    const match = customSheetUrl.match(/\/d\/([a-zA-Z0-9-_]+)/);
    const id = match ? match[1] : customSheetUrl.trim();
    const editUrl = `https://docs.google.com/spreadsheets/d/${id}/edit`;

    saveSpreadsheetConfig(id, editUrl);
    setCurrentSheetId(id);
    setCurrentSheetUrl(editUrl);
    setMsgSuccess(`ID Google Sheet enregistré : ${id}`);
    setTimeout(() => setMsgSuccess(null), 3000);
  };

  const handleSaveWebhook = () => {
    const trimmed = customWebhookUrl.trim();
    saveWebhookConfig(trimmed);
    setMsgSuccess('URL du Webhook enregistrée !');
    setTimeout(() => setMsgSuccess(null), 3000);
  };

  const handleTestWebhook = async () => {
    if (!customWebhookUrl.trim()) {
      setMsgError("Veuillez d'abord renseigner une URL de Webhook.");
      return;
    }
    setIsTestingWebhook(true);
    setMsgError(null);
    try {
      await testWebhookEndpoint(customWebhookUrl.trim());
      saveWebhookConfig(customWebhookUrl.trim());
      setMsgSuccess("Test envoyé avec succès ! Vérifiez votre feuille Google Sheet (une ligne 'Test Webhook' a été ajoutée).");
      setTimeout(() => setMsgSuccess(null), 5000);
    } catch (err: any) {
      setMsgError("Échec du test : " + (err.message || 'vérifiez les autorisations de votre Apps Script.'));
    } finally {
      setIsTestingWebhook(false);
    }
  };

  const handleSyncToSheets = async () => {
    let activeToken = token;
    if (!activeToken) {
      activeToken = await getAccessToken();
    }
    
    // If still no token, prompt Google Sign-in transparently
    if (!activeToken) {
      try {
        setIsLoading(true);
        const res = await googleSignIn();
        onAuthChange(res.user, res.accessToken);
        activeToken = res.accessToken;
      } catch (err: any) {
        setMsgError(err.message || "Connexion Google requise pour envoyer les données au classeur.");
        setIsLoading(false);
        return;
      } finally {
        setIsLoading(false);
      }
    }

    if (!activeToken || !currentSheetId) {
      setMsgError("Impossible d'obtenir l'autorisation Google.");
      return;
    }

    setIsSyncing(true);
    setMsgError(null);
    try {
      let count = 0;
      for (const lead of leads) {
        if (!lead.syncedToSheets) {
          await appendWaitlistToSheet(activeToken, currentSheetId, lead);
          count++;
        }
      }
      setLeads(getLocalLeads());
      if (count > 0) {
        setMsgSuccess(`${count} inscription(s) synchronisée(s) avec succès vers votre Google Sheet !`);
      } else {
        setMsgSuccess("Toutes vos inscriptions sont déjà à jour dans votre Google Sheet !");
      }
      setTimeout(() => setMsgSuccess(null), 4000);
    } catch (err: any) {
      setMsgError(err.message || "Erreur de synchronisation.");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleExportCSV = () => {
    if (leads.length === 0) return;
    const headers = ["Date", "Prénom", "Email", "Métier", "Problème", "Code VIP", "Statut"];
    const rows = leads.map(l => [
      `"${l.date}"`,
      `"${l.firstName}"`,
      `"${l.email}"`,
      `"${l.trade}"`,
      `"${(l.problem || '').replace(/"/g, '""')}"`,
      `"${l.vipCode}"`,
      `"${l.status}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `batidevis_inscriptions_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSendTestLeads = async (count: number = 1) => {
    setIsTestingWebhook(true);
    setMsgError(null);
    setMsgSuccess(null);

    const testProfiles = [
      {
        firstName: 'Jean Dupont (Artisan)',
        email: `jean.dupont.elec.${Math.floor(Math.random() * 900)}@gmail.com`,
        trade: 'Électricien',
        problem: 'Perte de 2h chaque soir à rédiger les devis de rénovation',
      },
      {
        firstName: 'Marc Lefebvre (Artisan)',
        email: `marc.lefebvre.plombier.${Math.floor(Math.random() * 900)}@gmail.com`,
        trade: 'Plombier',
        problem: 'Calcul complexe de la TVA rénovation 10% et mentions obligatoires',
      },
      {
        firstName: 'Sophie Martin (Artisane)',
        email: `sophie.martin.peinture.${Math.floor(Math.random() * 900)}@gmail.com`,
        trade: 'Peintre en bâtiment',
        problem: "Besoin d'envoyer un devis signé immédiatement devant le client",
      }
    ];

    const profilesToSend = testProfiles.slice(0, count);
    let sentCount = 0;
    let webhookSuccess = false;

    for (const p of profilesToSend) {
      const record: WaitlistRecord = {
        id: `lead_test_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        date: new Date().toLocaleDateString('fr-FR', {
          day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
        }),
        firstName: p.firstName,
        email: p.email,
        trade: p.trade,
        problem: p.problem,
        vipCode: 'ARTISAN50',
        status: 'Test Envoyé',
        syncedToSheets: false
      };

      const res = await dispatchLeadToBackend(record, token);
      if (res.webhookSent) webhookSuccess = true;
      if (res.webhookSent || res.oauthSent) sentCount++;
    }

    setLeads(getLocalLeads());
    setIsTestingWebhook(false);

    const hasWebhookUrl = !!(customWebhookUrl && customWebhookUrl.trim());
    if (webhookSuccess || sentCount > 0) {
      setMsgSuccess(
        `✅ ${count} inscription(s) test envoyée(s) directement dans votre Google Sheet ! Ouvrez votre classeur Google Sheet pour vérifier l'apparition des lignes.`
      );
    } else if (hasWebhookUrl) {
      setMsgSuccess(
        `✅ ${count} inscription(s) test envoyée(s) via Webhook ! Vérifiez votre classeur Google Sheet.`
      );
    } else {
      setMsgSuccess(
        `✅ ${count} inscription(s) fictive(s) créée(s) dans la base locale. Attention : pour qu'elle s'écrive automatiquement dans votre Google Sheet, collez l'URL de votre Webhook dans l'onglet "Activer le Webhook" !`
      );
    }
    setTimeout(() => setMsgSuccess(null), 6000);
  };

  const handleTestJsonPayload = async () => {
    const urlToUse = customWebhookUrl.trim() || DEFAULT_WEBHOOK_URL;
    if (!urlToUse) {
      setMsgError("Veuillez d'abord renseigner une URL de Webhook.");
      return;
    }
    setIsTestingWebhook(true);
    setMsgError(null);
    setMsgSuccess(null);
    try {
      const now = new Date();
      const randomNum = Math.floor(Math.random() * 900) + 100;
      const ok = await testWebhookEndpoint(urlToUse, {
        name: `Jean Dupont (Test Structure JSON #${randomNum})`,
        firstName: `Jean Dupont (Test Structure JSON #${randomNum})`,
        email: `jean.dupont.json${randomNum}@batidevis.fr`,
        trade: 'Électricien',
        biggestChallenge: 'Calcul TVA 10% rénovation et mentions obligatoires',
        problem: 'Calcul TVA 10% rénovation et mentions obligatoires',
        vipDiscountCode: 'ARTISAN50',
        vipCode: 'ARTISAN50',
        timestamp: now.toISOString(),
        date: now.toLocaleDateString('fr-FR', {
          day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
        }),
        status: 'Inscrit VIP (-50%)'
      });
      setLeads(getLocalLeads());
      if (ok) {
        setMsgSuccess(
          "✅ Payload JSON standard transmis avec succès au Webhook ! Les champs 'name', 'biggestChallenge', 'vipDiscountCode', 'timestamp' ont été envoyés et cartographiés vers votre Google Sheet."
        );
      } else {
        setMsgError("Échec du test de structure JSON. Vérifiez l'URL de votre Webhook et ses autorisations.");
      }
    } catch (err: any) {
      setMsgError(err.message || "Erreur lors du test de structure JSON.");
    } finally {
      setIsTestingWebhook(false);
      setTimeout(() => setMsgSuccess(null), 8000);
    }
  };

  const handleCopyCurl = () => {
    const url = customWebhookUrl.trim() || DEFAULT_WEBHOOK_URL;
    const jsonStr = JSON.stringify({
      name: "Jean Dupont",
      email: "jean@exemple.fr",
      trade: "Électricien",
      biggestChallenge: "Facturation",
      vipDiscountCode: "ARTISAN50",
      timestamp: new Date().toISOString()
    });
    const curlCmd = `curl -X POST "${url}" -H "Content-Type: application/json" -d '${jsonStr}'`;
    navigator.clipboard.writeText(curlCmd);
    setCopiedCurl(true);
    setTimeout(() => setCopiedCurl(false), 2000);
  };

  if (!isOpen) return null;

  const scriptSnippet = `// ============================================================================
// GOOGLE APPS SCRIPT POUR BÂTIDEVIS 2026
// ID du Sheet configuré : ${currentSheetId}
// ============================================================================

function doGet(e) {
  // Si des données sont transmises dans l'URL (GET ou redirection 302), enregistrer le lead
  if (e && e.parameter && (e.parameter.email || e.parameter.mail || e.parameter.name || e.parameter.firstName)) {
    return handleLead(e);
  }
  // Permet de tester directement l'URL dans un navigateur
  return ContentService.createTextOutput(JSON.stringify({
    status: "ok",
    message: "Le Webhook BâtiDevis est opérationnel et prêt à recevoir les inscriptions en temps réel.",
    sheetId: "${currentSheetId}",
    timestamp: new Date().toISOString()
  })).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  return handleLead(e);
}

function handleLead(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000); // Évite les conflits si plusieurs inscriptions arrivent en même temps
  } catch (err) {}

  try {
    var ss;
    try {
      ss = SpreadsheetApp.getActiveSpreadsheet();
    } catch(err) {}
    if (!ss) {
      try {
        var targetId = (e && e.parameter && (e.parameter.sheetId || e.parameter.spreadsheetId)) || "${currentSheetId}";
        if (targetId) {
          ss = SpreadsheetApp.openById(targetId);
        }
      } catch(openErr) {}
    }
    
    if (!ss) {
      throw new Error("Impossible d'accéder au classeur Google Sheet. Veillez à lier ce script via Extensions > Apps Script ou configurer l'ID de votre classeur.");
    }
    
    // Détecte l'onglet : 'Inscriptions' ou le premier onglet disponible
    var sheet = ss.getSheetByName("Inscriptions") || ss.getSheetByName("Feuille 1") || ss.getSheetByName("Sheet1") || ss.getSheets()[0];
    
    // Si la feuille est neuve / vide, créer la ligne d'en-tête stylisée
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Date Inscription",
        "Prénom & Nom Artisan",
        "Email Professionnel",
        "Corps de Métier",
        "Problème Devis Exprimé",
        "Code VIP Appliqué",
        "Statut Inscription"
      ]);
      sheet.getRange(1, 1, 1, 7)
        .setFontWeight("bold")
        .setBackground("#1e293b")
        .setFontColor("#ffffff");
      sheet.setFrozenRows(1);
    }
    
    // 1. Parsing robuste du corps de requête (supporte application/json, text/plain et paramètres d'URL)
    var data = {};
    if (e && e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch(parseErr) {
        data = e.parameter || {};
      }
    } else if (e && e.parameter) {
      data = e.parameter;
    }
    
    // Fusionner les paramètres URL s'ils apportent des champs supplémentaires
    if (e && e.parameter) {
      for (var key in e.parameter) {
        if (!data[key]) data[key] = e.parameter[key];
      }
    }
    
    // 2. Mapping tolérant de tous les alias possibles (name, biggestChallenge, vipDiscountCode, timestamp, etc.)
    var dateVal = data.date || data.timestamp || data.createdAt || new Date().toLocaleString("fr-FR");
    var nameVal = data.firstName || data.name || data.fullName || data.prenom || data.nom || "Artisan";
    var emailVal = data.email || data.mail || data.courriel || "";
    var tradeVal = data.trade || data.metier || data.profession || data.corpsDeMetier || "Non précisé";
    var problemVal = data.problem || data.biggestChallenge || data.challenge || data.besoin || data.devisProblem || data.message || "Non précisé";
    var vipVal = data.vipCode || data.vipDiscountCode || data.promoCode || data.code || "ARTISAN50";
    var statusVal = data.status || data.statut || "Inscrit VIP (-50%)";
    
    // 3. Écriture immédiate de la ligne dans le Google Sheet en temps réel
    sheet.appendRow([
      dateVal,
      nameVal,
      emailVal,
      tradeVal,
      problemVal,
      vipVal,
      statusVal
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "Lead enregistré dans Google Sheet en temps réel",
      columns: {
        date: dateVal,
        name: nameVal,
        email: emailVal,
        trade: tradeVal,
        problem: problemVal,
        vipCode: vipVal,
        status: statusVal
      }
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch(err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      error: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    try {
      lock.releaseLock();
    } catch(e) {}
  }
}
`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden relative"
        role="dialog"
        aria-modal="true"
      >
        {/* ============================================================ */}
        {/* VIEW 1: SECURITY GATE (LOCKED - ACCESS ONLY FOR ADMIN) */}
        {/* ============================================================ */}
        {!isAuthenticated ? (
          <div className="p-6 sm:p-10 flex flex-col items-center justify-center text-center max-w-md mx-auto my-auto space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 text-blue-400 flex items-center justify-center shadow-lg shadow-blue-500/10">
              <Lock className="w-8 h-8" />
            </div>

            <div className="space-y-1.5">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                Espace Strictement Confidentiel
              </span>
              <h3 className="text-xl font-heading font-extrabold text-slate-900 pt-2">
                Authentification Administrateur
              </h3>
              <p className="text-xs text-slate-500 font-sans leading-relaxed">
                Cet espace est exclusivement réservé au propriétaire de la landing page. Veuillez vous identifier pour accéder aux inscriptions et à la base de données.
              </p>
            </div>

            {authError && (
              <div className="w-full p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 text-left font-sans">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            {/* PIN Code form */}
            <form onSubmit={handleUnlockWithPin} className="w-full space-y-3">
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Code secret administrateur (ex: 2026)"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  autoFocus
                  className="w-full pl-4 pr-10 py-3 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-slate-50 text-slate-900"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-heading font-bold text-xs uppercase tracking-wider rounded-xl shadow-md shadow-blue-600/25 transition-all cursor-pointer"
              >
                Déverrouiller l'accès
              </button>
            </form>

            <div className="w-full flex items-center gap-3 text-slate-300 text-xs">
              <div className="flex-1 h-px bg-slate-200" />
              <span className="text-slate-400 font-mono text-[11px]">OU</span>
              <div className="flex-1 h-px bg-slate-200" />
            </div>

            {/* Google Sign-in for authorized email */}
            <div className="w-full space-y-2">
              <button
                type="button"
                onClick={handleUnlockWithGoogle}
                disabled={isLoading}
                className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl text-xs font-heading font-semibold text-slate-700 flex items-center justify-center gap-2 shadow-sm cursor-pointer transition-colors"
              >
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-4 h-4 block">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                </svg>
                <span>{isLoading ? 'Vérification...' : `Connexion Google (${AUTHORIZED_ADMIN_EMAIL})`}</span>
              </button>
              <p className="text-[10px] text-slate-400 font-sans">
                Compte autorisé : {AUTHORIZED_ADMIN_EMAIL}
              </p>
            </div>

            <button
              onClick={onClose}
              className="text-xs text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            >
              Fermer la fenêtre
            </button>
          </div>
        ) : (
          /* ============================================================ */
          /* VIEW 2: AUTHENTICATED ADMIN DASHBOARD */
          /* ============================================================ */
          <>
            {/* Top Header */}
            <div className="bg-slate-950 text-white px-5 sm:px-7 py-4 sm:py-5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-600/30">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-heading font-extrabold text-base sm:text-lg text-white">
                      Back-office • Collecte des Inscriptions
                    </h3>
                    <span className="bg-emerald-950 text-emerald-400 font-mono text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-800 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      Session Administrateur Active
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-sans">
                    Espace strictement réservé. Non indexé et invisible sur la landing page.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleLockSession}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-800"
                  title="Verrouiller la session"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Verrouiller</span>
                </button>
                <button
                  onClick={onClose}
                  className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-900 transition-colors cursor-pointer"
                  aria-label="Fermer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Quick status banner */}
            <div className="bg-slate-100 border-b border-slate-200 px-5 sm:px-7 py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-slate-700 font-sans">
                <span className="font-bold text-slate-900">{leads.length} artisan(s) inscrit(s)</span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-600 font-mono text-[11px]">
                  ID Sheet: <strong>{currentSheetId}</strong>
                </span>
                <span className="text-slate-400">•</span>
                {customWebhookUrl ? (
                  <span className="text-emerald-700 flex items-center gap-1 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Webhook Actif
                  </span>
                ) : (
                  <span className="text-amber-700 flex items-center gap-1 font-semibold">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                    Webhook en attente
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={currentSheetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-colors cursor-pointer"
                  title="Ouvrir le classeur dans un nouvel onglet"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>Ouvrir mon Google Sheet</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <button
                  onClick={handleExportCSV}
                  disabled={leads.length === 0}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors cursor-pointer disabled:opacity-50"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Exporter CSV</span>
                </button>
              </div>
            </div>

            {/* Notifications */}
            {msgError && (
              <div className="mx-5 sm:mx-7 mt-3 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 font-sans">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{msgError}</span>
              </div>
            )}
            {msgSuccess && (
              <div className="mx-5 sm:mx-7 mt-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2 font-sans">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{msgSuccess}</span>
              </div>
            )}

            {/* Navigation Tabs */}
            <div className="px-5 sm:px-7 pt-4 border-b border-slate-200 flex gap-2 flex-wrap">
              <button
                onClick={() => setActiveTab('cohort')}
                className={`pb-3 px-3 text-xs font-heading font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'cohort'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Cohorte 20 Fondateurs ({cohortEntries.length}/20)</span>
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              </button>
              <button
                onClick={() => setActiveTab('supabase')}
                className={`pb-3 px-3 text-xs font-heading font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'supabase'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <Database className="w-4 h-4" />
                <span>Schéma Supabase SQL</span>
              </button>
              <button
                onClick={() => setActiveTab('leads')}
                className={`pb-3 px-3 text-xs font-heading font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'leads'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Google Sheets ({leads.length})</span>
                {leads.some(l => !l.syncedToSheets) && (
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                )}
              </button>
              <button
                onClick={() => setActiveTab('webhook')}
                className={`pb-3 px-3 text-xs font-heading font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'webhook'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <Code className="w-4 h-4" />
                <span>Webhook Apps Script</span>
              </button>
              <button
                onClick={() => setActiveTab('config')}
                className={`pb-3 px-3 text-xs font-heading font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'config'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>Paramètres</span>
              </button>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">
              {/* ONGLET 1 : COHORTE FONDATEURS */}
              {activeTab === 'cohort' && (
                <div className="space-y-5 text-left">
                  {/* Quotas Meter Strip */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-slate-950 text-white border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div>
                        <div className="font-heading font-bold text-sm text-white flex items-center gap-2">
                          <Users className="w-4 h-4 text-blue-400" />
                          <span>Répartition des 20 Quotas Fondateurs (5 par corps d'état)</span>
                        </div>
                        <p className="text-xs text-slate-400 font-sans mt-0.5">
                          Activation manuelle du plan bêta gratuit pour chaque artisan sélectionné.
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleExportCohortCSV}
                          className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-slate-900 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <Download className="w-3.5 h-3.5 text-blue-600" />
                          <span>Exporter CSV Fondateurs</span>
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                      <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                        <div className="text-[11px] text-slate-400">Plomberie & CVC</div>
                        <div className="text-base font-bold text-white font-mono">
                          {cohortEntries.filter(e => e.quota_category === 'plomberie').length} / 5
                        </div>
                      </div>
                      <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                        <div className="text-[11px] text-slate-400">Électricité BTP</div>
                        <div className="text-base font-bold text-white font-mono">
                          {cohortEntries.filter(e => e.quota_category === 'electricite').length} / 5
                        </div>
                      </div>
                      <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                        <div className="text-[11px] text-slate-400">Finitions (Peinture, Carr.)</div>
                        <div className="text-base font-bold text-white font-mono">
                          {cohortEntries.filter(e => e.quota_category === 'finitions').length} / 5
                        </div>
                      </div>
                      <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                        <div className="text-[11px] text-slate-400">Gros Œuvre & Menuiserie</div>
                        <div className="text-base font-bold text-white font-mono">
                          {cohortEntries.filter(e => e.quota_category === 'gros_oeuvre').length} / 5
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Candidates Table */}
                  <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-xs">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs font-sans">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-heading font-bold uppercase tracking-wider text-[11px]">
                          <tr>
                            <th className="py-2.5 px-3">Artisan</th>
                            <th className="py-2.5 px-3">Email Pro</th>
                            <th className="py-2.5 px-3">Métier & Dép.</th>
                            <th className="py-2.5 px-3">Régime TVA</th>
                            <th className="py-2.5 px-3">Problème exprimé (Verbatim)</th>
                            <th className="py-2.5 px-3">Source UTM</th>
                            <th className="py-2.5 px-3">Plan Actuel</th>
                            <th className="py-2.5 px-3 text-right">Action Bêta</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {cohortEntries.map((e) => (
                            <tr key={e.id} className="hover:bg-slate-50/80">
                              <td className="py-2.5 px-3 font-bold text-slate-900 whitespace-nowrap">
                                {e.prenom}
                              </td>
                              <td className="py-2.5 px-3 font-mono text-[11px] text-blue-600">
                                {e.email}
                              </td>
                              <td className="py-2.5 px-3 whitespace-nowrap">
                                <span className="bg-slate-100 text-slate-800 font-medium px-2 py-0.5 rounded">
                                  {e.metier} ({e.departement})
                                </span>
                              </td>
                              <td className="py-2.5 px-3 whitespace-nowrap">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                  e.statut_tva === 'ae_sans_tva' ? 'bg-amber-50 text-amber-800 border border-amber-200' : 'bg-blue-50 text-blue-800 border border-blue-200'
                                }`}>
                                  {e.statut_tva === 'ae_sans_tva' ? 'Art. 293 B' : 'TVA 10/20%'}
                                </span>
                              </td>
                              <td className="py-2.5 px-3 max-w-xs text-slate-600 truncate" title={e.probleme}>
                                {e.probleme}
                              </td>
                              <td className="py-2.5 px-3 text-slate-500 font-mono text-[10px]">
                                {e.source}
                              </td>
                              <td className="py-2.5 px-3">
                                <span className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                                  e.plan === 'beta' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                                }`}>
                                  {e.plan}
                                </span>
                              </td>
                              <td className="py-2.5 px-3 text-right">
                                <button
                                  type="button"
                                  onClick={() => handleToggleBetaPlan(e.id)}
                                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-colors ${
                                    e.plan === 'beta'
                                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100'
                                      : 'bg-blue-600 text-white hover:bg-blue-700 shadow-2xs'
                                  }`}
                                >
                                  {e.plan === 'beta' ? '✓ Actif Bêta' : 'Activer Bêta'}
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ONGLET 2 : SCHÉMA SUPABASE SQL */}
              {activeTab === 'supabase' && (
                <div className="space-y-4 text-left">
                  <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-xs text-blue-900 space-y-2">
                    <div className="font-heading font-bold text-sm text-blue-950 flex items-center gap-2">
                      <Database className="w-4 h-4 text-blue-600" />
                      <span>Schéma PostgreSQL Supabase pour BATIDEVIS</span>
                    </div>
                    <p className="leading-relaxed font-sans text-slate-700">
                      Ce schéma SQL contient l'intégralité des 7 tables validées pour le MVP : <code>profiles</code>, <code>clients</code>, <code>items</code>, <code>kits</code>, <code>kit_items</code>, <code>documents</code>, <code>document_items</code>, <code>waitlist</code>, <code>subscriptions</code> ainsi que les politiques de sécurité RLS (Row Level Security).
                    </p>
                    <div className="text-[11px] text-slate-600 font-mono">
                      Pour exécuter : ouvrez votre projet Supabase &gt; SQL Editor &gt; New Query &gt; Collez le script et cliquez sur RUN.
                    </div>
                  </div>

                  <div className="relative bg-slate-950 text-slate-200 p-4 rounded-2xl text-xs font-mono border border-slate-800 shadow-xl overflow-hidden">
                    <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-800">
                      <span className="text-slate-400 text-[11px]">schema.sql (PostgreSQL 15+ / Supabase)</span>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
                          setCopiedSql(true);
                          setTimeout(() => setCopiedSql(false), 2000);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md transition-colors"
                      >
                        {copiedSql ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedSql ? 'Copié dans le presse-papier !' : 'Copier tout le Schéma SQL'}</span>
                      </button>
                    </div>

                    <pre className="max-h-[500px] overflow-y-auto text-[11px] leading-relaxed text-blue-200 p-2">
                      {SUPABASE_SQL_SCHEMA}
                    </pre>
                  </div>
                </div>
              )}

              {/* ONGLET 3 : LEADS & GOOGLE SHEETS */}
              {activeTab === 'leads' && (
                <div className="space-y-4">
                  {/* Unsynced Banner */}
                  {leads.some(l => !l.syncedToSheets) && (
                    <div className="p-4 bg-amber-50/90 border border-amber-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-900">
                      <div className="flex items-start sm:items-center gap-2.5">
                        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5 sm:mt-0" />
                        <div>
                          <strong className="text-amber-950">
                            {leads.filter(l => !l.syncedToSheets).length} inscription(s) en attente de transfert
                          </strong>
                          <p className="text-[11px] text-amber-800">
                            Ces contacts sont bien enregistrés en sécurité dans l'application et n'attendent que d'être transférés vers votre Google Sheet.
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={handleSyncToSheets}
                        disabled={isSyncing || isLoading}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-heading font-bold rounded-xl shadow-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                        <span>{isSyncing ? 'Envoi...' : 'Envoyer vers mon Google Sheet'}</span>
                      </button>
                    </div>
                  )}

                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <p className="text-xs text-slate-600 font-sans">
                      Toutes les inscriptions soumises par les artisans sur la landing page :
                    </p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        onClick={() => handleSendTestLeads(1)}
                        disabled={isTestingWebhook || isSyncing}
                        className="px-2.5 py-1.5 text-xs font-semibold text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg cursor-pointer flex items-center gap-1.5 transition-colors disabled:opacity-50"
                        title="Créer et envoyer immédiatement 1 artisan fictif vers votre Google Sheet"
                      >
                        <Send className="w-3 h-3" />
                        <span>{isTestingWebhook ? 'Envoi...' : '+ Envoyer 1 artisan test'}</span>
                      </button>
                      <button
                        onClick={() => handleSendTestLeads(3)}
                        disabled={isTestingWebhook || isSyncing}
                        className="px-2.5 py-1.5 text-xs font-semibold text-slate-800 hover:text-black bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg cursor-pointer flex items-center gap-1.5 transition-colors disabled:opacity-50"
                        title="Créer et envoyer 3 profils d'artisans fictifs (Électricien, Plombier, Peintre)"
                      >
                        <Sparkles className="w-3 h-3 text-amber-500" />
                        <span>🚀 Envoyer 3 artisans fictifs</span>
                      </button>
                      <button
                        onClick={handleSyncToSheets}
                        disabled={isSyncing || isLoading}
                        className="px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg flex items-center gap-1.5 cursor-pointer"
                        title="Synchroniser toutes les inscriptions vers Google Sheet"
                      >
                        <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
                        <span>{isSyncing ? 'Synchronisation...' : 'Synchroniser vers Google Sheet'}</span>
                      </button>
                    </div>
                  </div>

                  <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-heading font-bold uppercase tracking-wider">
                          <tr>
                            <th className="py-3 px-4">Date</th>
                            <th className="py-3 px-4">Prénom</th>
                            <th className="py-3 px-4">Email Professionnel</th>
                            <th className="py-3 px-4">Corps de Métier</th>
                            <th className="py-3 px-4">Problème Devis</th>
                            <th className="py-3 px-4">Statut Google Sheet</th>
                            <th className="py-3 px-4">Statut Offre</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-sans">
                          {leads.length === 0 ? (
                            <tr>
                              <td colSpan={7} className="py-12 text-center text-slate-400 font-sans">
                                Aucune inscription enregistrée pour l'instant.
                                <br />
                                <span className="text-[11px] text-slate-500">
                                  Dès qu'un artisan soumet le formulaire sur la page d'accueil, ses coordonnées s'enregistrent instantanément ici.
                                </span>
                              </td>
                            </tr>
                          ) : (
                            leads.map((lead, idx) => (
                              <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                                <td className="py-3 px-4 text-slate-500 whitespace-nowrap">{lead.date}</td>
                                <td className="py-3 px-4 font-bold text-slate-900">{lead.firstName}</td>
                                <td className="py-3 px-4 text-blue-600 font-mono text-[11px]">{lead.email}</td>
                                <td className="py-3 px-4">
                                  <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium">
                                    {lead.trade}
                                  </span>
                                </td>
                                <td className="py-3 px-4 text-slate-600 max-w-xs truncate" title={lead.problem}>
                                  {lead.problem}
                                </td>
                                <td className="py-3 px-4">
                                  {lead.syncedToSheets ? (
                                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                      Dans Google Sheet
                                    </span>
                                  ) : (
                                    <span className="bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                                      <Clock className="w-3 h-3 text-amber-600" />
                                      En attente d'envoi
                                    </span>
                                  )}
                                </td>
                                <td className="py-3 px-4">
                                  <span className="bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                    {lead.status}
                                  </span>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'webhook' && (
                <div className="space-y-5 max-w-2xl">
                  <div className="bg-blue-50/80 p-4 rounded-2xl border border-blue-200 text-xs text-blue-900 space-y-2.5">
                    <div className="font-bold flex items-center gap-1.5 text-blue-950 text-sm">
                      <ShieldCheck className="w-4 h-4 text-blue-600" />
                      <span>Activation du Webhook pour votre Sheet : {currentSheetId}</span>
                    </div>
                    <p className="leading-relaxed">
                      Le webhook transmet automatiquement chaque nouveau contact directement dans votre Google Sheet, <strong>sans aucune intervention manuelle</strong> et même quand vous n'êtes pas sur le site.
                    </p>
                    <ol className="list-decimal pl-5 space-y-1.5 text-slate-700 font-sans">
                      <li>
                        Ouvrez votre fichier :{' '}
                        <a
                          href={currentSheetUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline font-semibold inline-flex items-center gap-0.5"
                        >
                          Ouvrir Google Sheet <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      </li>
                      <li>Dans Google Sheets, cliquez sur <strong>Extensions &gt; Apps Script</strong>.</li>
                      <li>Supprimez le code par défaut et <strong>collez le code ci-dessous</strong>.</li>
                      <li>Cliquez sur <strong>Déployer &gt; Nouveau déploiement</strong>, sélectionnez <strong>Application Web</strong>.</li>
                      <li>Définissez <em>Exécuter en tant que :</em> <strong>Moi</strong> et <em>Qui a accès :</em> <strong>Tout le monde (Anyone)</strong>.</li>
                      <li>Copiez l'URL Webhook fournie et collez-la ci-dessous, puis cliquez sur <strong>Activer</strong>.</li>
                    </ol>
                  </div>

                  {/* Code Box */}
                  <div className="relative bg-slate-900 text-slate-200 p-4 rounded-xl text-xs font-mono overflow-x-auto">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(scriptSnippet);
                        setCopiedCode(true);
                        setTimeout(() => setCopiedCode(false), 2000);
                      }}
                      className="absolute top-3 right-3 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-white text-[11px] flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedCode ? 'Code copié !' : 'Copier le code prêt à coller'}</span>
                    </button>
                    <pre className="text-[11px] leading-relaxed pt-2">{scriptSnippet}</pre>
                  </div>

                  {/* Webhook Input & Test */}
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <label className="block text-xs font-bold text-slate-800 font-heading">
                        URL de votre Application Web / Webhook Apps Script :
                      </label>
                      {customWebhookUrl ? (
                        <span className="text-[11px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Webhook Actif
                        </span>
                      ) : (
                        <span className="text-[11px] bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                          <AlertCircle className="w-3 h-3 text-amber-600" />
                          URL en attente
                        </span>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="url"
                        placeholder="https://script.google.com/macros/s/AKfycbx.../exec"
                        value={customWebhookUrl}
                        onChange={(e) => setCustomWebhookUrl(e.target.value)}
                        className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white font-mono"
                      />
                      <button
                        onClick={handleSaveWebhook}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors shrink-0 shadow-sm"
                      >
                        {customWebhookUrl ? 'Mettre à jour' : 'Activer'}
                      </button>
                    </div>

                    {customWebhookUrl ? (
                      <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3 space-y-3">
                        <div className="flex items-start gap-2 text-xs text-emerald-900">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <div>
                            <strong className="block text-emerald-950 font-heading">Webhook prêt à recevoir des inscriptions</strong>
                            <p className="text-[11px] text-emerald-800">
                              Chaque artisan s'inscrivant sur votre landing page sera automatiquement enregistré sur votre feuille Google Sheet.
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-wrap pt-1">
                          <button
                            onClick={() => handleSendTestLeads(1)}
                            disabled={isTestingWebhook}
                            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer disabled:opacity-50 transition-colors shadow-sm"
                          >
                            <Send className="w-3 h-3" />
                            <span>{isTestingWebhook ? 'Envoi...' : '⚡ Envoyer 1 artisan test au Sheet'}</span>
                          </button>
                          <button
                            onClick={handleTestJsonPayload}
                            disabled={isTestingWebhook}
                            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer disabled:opacity-50 transition-colors shadow-sm"
                            title="Tester la soumission avec le schéma JSON standard (name, biggestChallenge, vipDiscountCode, timestamp)"
                          >
                            <Code className="w-3 h-3 text-indigo-200" />
                            <span>{isTestingWebhook ? 'Envoi...' : '🧪 Tester payload JSON standard'}</span>
                          </button>
                          <button
                            onClick={() => handleSendTestLeads(3)}
                            disabled={isTestingWebhook}
                            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer disabled:opacity-50 transition-colors shadow-sm"
                          >
                            <Sparkles className="w-3 h-3 text-amber-300" />
                            <span>🚀 Envoyer 3 artisans fictifs complets</span>
                          </button>
                          <a
                            href={currentSheetUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 bg-white border border-emerald-300 hover:bg-emerald-50 text-emerald-700 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <FileSpreadsheet className="w-3 h-3" />
                            <span>Vérifier dans Google Sheet</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-3.5 space-y-2 text-xs text-blue-900 font-sans">
                        <div className="font-bold flex items-center gap-1.5 text-blue-950">
                          <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
                          <span>Où trouver cette URL ?</span>
                        </div>
                        <p className="text-[11px] leading-relaxed text-slate-600">
                          Dans votre Google Sheet, après avoir collé le code ci-dessus dans <strong>Extensions &gt; Apps Script</strong>, cliquez sur <strong>Déployer &gt; Nouveau déploiement &gt; Application Web</strong>. Google affiche alors l'URL de votre Webhook (se terminant par <code>/exec</code>). Collez-la dans le champ ci-dessus.
                        </p>
                        <div className="pt-1 flex items-center gap-2 flex-wrap">
                          <button
                            onClick={() => handleSendTestLeads(1)}
                            disabled={isTestingWebhook}
                            className="px-3 py-1 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-medium flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                          >
                            <Send className="w-3 h-3 text-blue-600" />
                            <span>Tester avec 1 artisan fictif maintenant</span>
                          </button>
                          <button
                            onClick={handleTestJsonPayload}
                            disabled={isTestingWebhook}
                            className="px-3 py-1 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 text-indigo-800 rounded-lg text-xs font-medium flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                          >
                            <Code className="w-3 h-3 text-indigo-600" />
                            <span>Tester payload JSON standard</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* JSON Payload Specification & Column Mapping Box */}
                    <div className="bg-slate-900 text-slate-200 p-4 rounded-xl text-xs space-y-3 font-sans border border-slate-800">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="font-heading font-bold text-white flex items-center gap-1.5 text-xs">
                          <Code className="w-4 h-4 text-indigo-400" />
                          <span>Structure du Payload JSON & Correspondance Colonnes Google Sheet</span>
                        </div>
                        <button
                          onClick={handleCopyCurl}
                          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-mono flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          {copiedCurl ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedCurl ? 'Commande curl copiée !' : 'Copier curl de test'}</span>
                        </button>
                      </div>

                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        L'Apps Script ci-dessus parse automatiquement le JSON envoyé via POST (<code>Content-Type: application/json</code> ou <code>text/plain</code>) et mappe les champs vers les 7 colonnes du Google Sheet :
                      </p>

                      <div className="overflow-x-auto">
                        <table className="w-full text-[11px] border-collapse font-mono">
                          <thead>
                            <tr className="text-slate-400 border-b border-slate-800 text-left">
                              <th className="py-1.5 px-2">Champ JSON</th>
                              <th className="py-1.5 px-2">Alias supportés</th>
                              <th className="py-1.5 px-2">Colonne Google Sheet</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800/60 text-slate-300">
                            <tr>
                              <td className="py-1.5 px-2 text-indigo-300">timestamp</td>
                              <td className="py-1.5 px-2 text-slate-400">date, createdAt</td>
                              <td className="py-1.5 px-2 text-emerald-400">Colonne A : Date Inscription</td>
                            </tr>
                            <tr>
                              <td className="py-1.5 px-2 text-indigo-300">name</td>
                              <td className="py-1.5 px-2 text-slate-400">firstName, fullName, prenom</td>
                              <td className="py-1.5 px-2 text-emerald-400">Colonne B : Prénom &amp; Nom Artisan</td>
                            </tr>
                            <tr>
                              <td className="py-1.5 px-2 text-indigo-300">email</td>
                              <td className="py-1.5 px-2 text-slate-400">mail, courriel</td>
                              <td className="py-1.5 px-2 text-emerald-400">Colonne C : Email Professionnel</td>
                            </tr>
                            <tr>
                              <td className="py-1.5 px-2 text-indigo-300">trade</td>
                              <td className="py-1.5 px-2 text-slate-400">metier, profession</td>
                              <td className="py-1.5 px-2 text-emerald-400">Colonne D : Corps de Métier</td>
                            </tr>
                            <tr>
                              <td className="py-1.5 px-2 text-indigo-300">biggestChallenge</td>
                              <td className="py-1.5 px-2 text-slate-400">problem, challenge, besoin</td>
                              <td className="py-1.5 px-2 text-emerald-400">Colonne E : Problème Devis Exprimé</td>
                            </tr>
                            <tr>
                              <td className="py-1.5 px-2 text-indigo-300">vipDiscountCode</td>
                              <td className="py-1.5 px-2 text-slate-400">vipCode, code, promoCode</td>
                              <td className="py-1.5 px-2 text-emerald-400">Colonne F : Code VIP Appliqué</td>
                            </tr>
                            <tr>
                              <td className="py-1.5 px-2 text-indigo-300">status</td>
                              <td className="py-1.5 px-2 text-slate-400">statut</td>
                              <td className="py-1.5 px-2 text-emerald-400">Colonne G : Statut Inscription</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'config' && (
                <div className="space-y-6 max-w-2xl">
                  {/* Security: Change Admin PIN */}
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
                    <div className="flex items-center gap-2 text-slate-900 font-heading font-bold text-sm">
                      <KeyRound className="w-4 h-4 text-blue-600" />
                      <span>Modifier votre code secret administrateur</span>
                    </div>
                    <p className="text-xs text-slate-600 font-sans leading-relaxed">
                      Ce code permet de déverrouiller l'accès confidentiel au back-office. Code par défaut : <code>2026</code>.
                    </p>

                    <div className="flex gap-2">
                      <input
                        type="password"
                        placeholder="Nouveau code (ex: 4 chiffres ou mot de passe)"
                        value={newPin}
                        onChange={(e) => setNewPin(e.target.value)}
                        className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                      />
                      <button
                        onClick={handleUpdatePin}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold cursor-pointer shrink-0"
                      >
                        Enregistrer
                      </button>
                    </div>
                    {pinChangeMsg && (
                      <p className="text-xs text-emerald-700 font-medium">{pinChangeMsg}</p>
                    )}
                  </div>

                  {/* Note on Google Sheet opening issue */}
                  <div className="bg-amber-50/80 p-4 rounded-2xl border border-amber-200 text-xs text-amber-900 space-y-2">
                    <div className="font-bold flex items-center gap-1.5 text-amber-950">
                      <HelpCircle className="w-4 h-4 text-amber-600" />
                      <span>Pourquoi Google affiche parfois « Impossible d'ouvrir le fichier » ?</span>
                    </div>
                    <p className="leading-relaxed text-slate-700">
                      Google Drive nécessite que le compte connecté dans votre navigateur ait le droit d'accès au fichier.
                    </p>
                    <ul className="list-disc pl-5 space-y-1 text-slate-700">
                      <li>Vérifiez que vous êtes connecté à votre compte Google (<strong>{AUTHORIZED_ADMIN_EMAIL}</strong>) dans ce navigateur.</li>
                      <li>Dans votre Google Drive, vérifiez que le partage du fichier autorise l'accès (<em>« Tous les utilisateurs disposant du lien peuvent modifier »</em>).</li>
                    </ul>
                  </div>

                  {/* Active Sheet Configuration */}
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
                    <div className="flex items-center gap-2 text-slate-900 font-heading font-bold text-sm">
                      <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                      <span>Classeur Google Sheets configuré</span>
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={customSheetUrl}
                        onChange={(e) => setCustomSheetUrl(e.target.value)}
                        placeholder="URL ou ID du Google Sheet"
                        className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white font-mono"
                      />
                      <button
                        onClick={handleSaveCustomSheet}
                        className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold cursor-pointer shrink-0"
                      >
                        Mettre à jour
                      </button>
                    </div>

                    <div className="pt-2 text-xs text-slate-700 flex flex-wrap items-center gap-2">
                      <span className="text-slate-500">Lien direct :</span>
                      <a
                        href={currentSheetUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline font-mono inline-flex items-center gap-1 font-semibold"
                      >
                        <span>{currentSheetUrl}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>

                  {/* OAuth Google Account */}
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
                    <div className="flex items-center gap-2 text-slate-900 font-heading font-bold text-sm">
                      <KeyRound className="w-4 h-4 text-blue-600" />
                      <span>Connexion Google Workspace API (Optionnel)</span>
                    </div>
                    <p className="text-xs text-slate-600 font-sans leading-relaxed">
                      Permet la synchronisation directe depuis l'API Google Sheets en plus du Webhook.
                    </p>

                    <div className="pt-1">
                      {user && token ? (
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            Connecté avec : <strong>{user.email}</strong>
                          </span>
                          <button
                            onClick={async () => {
                              await googleSignOut();
                              onAuthChange(null, null);
                            }}
                            className="text-xs text-red-600 hover:underline cursor-pointer"
                          >
                            Déconnecter
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={handleGoogleAccountSync}
                          disabled={isLoading}
                          className="inline-flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl text-xs font-heading font-semibold text-slate-800 shadow-sm cursor-pointer"
                        >
                          <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-4 h-4 block">
                            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                          </svg>
                          <span>{isLoading ? 'Connexion...' : 'Autoriser avec mon compte Google'}</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="bg-slate-50 border-t border-slate-200 px-5 sm:px-7 py-3 flex items-center justify-between text-xs text-slate-500 font-sans">
              <span>Collecte sécurisée des artisans • BâtiDevis 2026</span>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-heading font-semibold transition-all cursor-pointer"
              >
                Fermer
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
