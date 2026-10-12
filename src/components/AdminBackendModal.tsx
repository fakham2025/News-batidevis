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
  ShieldAlert
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
  DEFAULT_SPREADSHEET_ID, 
  DEFAULT_SPREADSHEET_URL, 
  WaitlistRecord 
} from '../services/googleSheets';
import { User } from 'firebase/auth';

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
  const [activeTab, setActiveTab] = useState<'leads' | 'webhook' | 'config'>('leads');
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

    const config = getSavedSpreadsheetConfig();
    const activeId = config.id || DEFAULT_SPREADSHEET_ID;
    const activeUrl = config.url || `https://docs.google.com/spreadsheets/d/${activeId}/edit`;

    setCurrentSheetId(activeId);
    setCurrentSheetUrl(activeUrl);
    setCustomSheetUrl(activeUrl);
    if (config.webhookUrl) setCustomWebhookUrl(config.webhookUrl);
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
    if (!token || !currentSheetId) {
      setMsgError("Connectez votre compte Google ci-dessous pour lancer la synchronisation API directe.");
      return;
    }

    setIsSyncing(true);
    setMsgError(null);
    try {
      let count = 0;
      for (const lead of leads) {
        if (!lead.syncedToSheets) {
          await appendWaitlistToSheet(token, currentSheetId, lead);
          count++;
        }
      }
      setLeads(getLocalLeads());
      setMsgSuccess(`${count} inscription(s) synchronisée(s) vers votre Google Sheet.`);
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

  const handleAddTestLead = () => {
    const testLead: WaitlistRecord = {
      id: `lead_${Date.now()}`,
      date: new Date().toLocaleDateString('fr-FR', {
        day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
      }),
      firstName: 'Artisan Test',
      email: `artisan.test.${Math.floor(Math.random() * 900)}@batidevis.fr`,
      trade: 'Électricien',
      problem: 'Test direct de réception dans la base de données',
      vipCode: 'ARTISAN50',
      status: 'Test Admin',
      syncedToSheets: false
    };

    saveLocalLead(testLead);
    setLeads(getLocalLeads());
    setMsgSuccess('Inscription test ajoutée à la base de données.');
    setTimeout(() => setMsgSuccess(null), 2500);
  };

  if (!isOpen) return null;

  const scriptSnippet = `// ============================================================================
// GOOGLE APPS SCRIPT POUR BÂTIDEVIS 2026
// ID du Sheet configuré : ${currentSheetId}
// ============================================================================
function doPost(e) {
  try {
    var ss = SpreadsheetApp.openById("${currentSheetId}");
    var sheet = ss.getSheetByName("Inscriptions") || ss.getActiveSheet();
    
    // Si la feuille est vide, créer la ligne d'en-tête
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Date Inscription",
        "Prénom Artisan",
        "Email Professionnel",
        "Corps de Métier",
        "Problème Devis Exprimé",
        "Code VIP Appliqué",
        "Statut"
      ]);
      sheet.getRange(1, 1, 1, 7).setFontWeight("bold").setBackground("#f1f5f9");
    }
    
    var data = {};
    if (e && e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch(err) {
        data = e.parameter || {};
      }
    } else if (e && e.parameter) {
      data = e.parameter;
    }
    
    sheet.appendRow([
      data.date || new Date().toLocaleString("fr-FR"),
      data.firstName || "",
      data.email || "",
      data.trade || "",
      data.problem || "Non précisé",
      data.vipCode || "ARTISAN50",
      data.status || "Inscrit VIP"
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({ status: "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch(err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({ status: "ok", sheetId: "${currentSheetId}" }))
    .setMimeType(ContentService.MimeType.JSON);
}`;

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
            <div className="px-5 sm:px-7 pt-4 border-b border-slate-200 flex gap-2">
              <button
                onClick={() => setActiveTab('leads')}
                className={`pb-3 px-3 text-xs font-heading font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'leads'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Inscriptions Reçues ({leads.length})</span>
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
                <span>Activer le Webhook (Automatique 24h/24)</span>
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
                <span>Paramètres & Sécurité</span>
              </button>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">
              {activeTab === 'leads' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <p className="text-xs text-slate-600 font-sans">
                      Toutes les inscriptions soumises par les artisans sur la landing page :
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleAddTestLead}
                        className="px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
                      >
                        + Ajouter un lead test
                      </button>
                      {token && currentSheetId && (
                        <button
                          onClick={handleSyncToSheets}
                          disabled={isSyncing}
                          className="px-3 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg flex items-center gap-1 cursor-pointer"
                        >
                          <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
                          <span>Synchroniser vers Google Sheet</span>
                        </button>
                      )}
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
                            <th className="py-3 px-4">Code VIP</th>
                            <th className="py-3 px-4">Statut</th>
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
                                <td className="py-3 px-4 font-mono font-bold text-blue-600">{lead.vipCode}</td>
                                <td className="py-3 px-4">
                                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
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
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                    <label className="block text-xs font-bold text-slate-800">
                      URL de l'Application Web / Webhook Apps Script :
                    </label>
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
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors shrink-0"
                      >
                        Activer
                      </button>
                    </div>

                    {customWebhookUrl && (
                      <div className="pt-1 flex items-center justify-between">
                        <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Webhook actif et prêt à recevoir les inscriptions
                        </span>
                        <button
                          onClick={handleTestWebhook}
                          disabled={isTestingWebhook}
                          className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                        >
                          <Send className="w-3 h-3" />
                          <span>{isTestingWebhook ? 'Envoi test...' : 'Envoyer un test au Webhook'}</span>
                        </button>
                      </div>
                    )}
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
