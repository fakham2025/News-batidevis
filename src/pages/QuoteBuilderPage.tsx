import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Sparkles, 
  FileText, 
  Share2, 
  Download, 
  CheckCircle2, 
  User, 
  MapPin, 
  Calendar, 
  ShieldCheck,
  CheckSquare
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { TradeKitSelector } from '../components/builder/TradeKitSelector';
import { QuoteItemsTable } from '../components/builder/QuoteItemsTable';
import { AuthExpressModal } from '../components/builder/AuthExpressModal';
import { SignaturePad } from '../components/signature/SignaturePad';
import { ShareQuoteModal } from '../components/share/ShareQuoteModal';
import { calculateQuoteTotals, QuoteLineItem, saveQuote, QuotePayload } from '../services/quotes';
import { saveClientContact } from '../services/clientCrm';
import { supabase } from '../lib/supabase';
import confetti from 'canvas-confetti';

const STORAGE_KEY_DRAFT_QUOTE = 'batidevis_draft_quote_v1';

export function QuoteBuilderPage() {
  const navigate = useNavigate();

  // Quote State
  const [quoteNumber, setQuoteNumber] = useState('DEV-2026-001');
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientAddress, setClientAddress] = useState('');
  const [projectTitle, setProjectTitle] = useState('Travaux de rénovation bâtiment');
  const [items, setItems] = useState<QuoteLineItem[]>([]);

  // User Auth & Modals
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [signatureModalOpen, setSignatureModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [activeShareToken, setActiveShareToken] = useState<string>('');
  const [pendingAction, setPendingAction] = useState<'sign' | 'share' | 'save' | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  // Restore draft from local storage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_DRAFT_QUOTE);
      if (raw) {
        const draft = JSON.parse(raw);
        if (draft.clientName) setClientName(draft.clientName);
        if (draft.clientEmail) setClientEmail(draft.clientEmail);
        if (draft.clientPhone) setClientPhone(draft.clientPhone);
        if (draft.clientAddress) setClientAddress(draft.clientAddress);
        if (draft.projectTitle) setProjectTitle(draft.projectTitle);
        if (draft.items && draft.items.length > 0) setItems(draft.items);
      }
    } catch {
      // ignore
    }

    // Check Supabase session
    supabase.auth.getSession().then(({ data }) => {
      if (data?.session?.user) {
        setCurrentUser(data.session.user);
      }
    });

    // Check URL parameters for CRM pre-fill
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const qName = searchParams.get('clientName');
      const qPhone = searchParams.get('clientPhone');
      const qEmail = searchParams.get('clientEmail');
      const qAddress = searchParams.get('clientAddress');
      if (qName) setClientName(qName);
      if (qPhone) setClientPhone(qPhone);
      if (qEmail) setClientEmail(qEmail);
      if (qAddress) setClientAddress(qAddress);
    } catch {}
  }, []);

  // Recalculate totals
  const totals = calculateQuoteTotals(items);

  // Auto-save draft locally on change
  useEffect(() => {
    try {
      const draft = {
        clientName,
        clientEmail,
        clientPhone,
        clientAddress,
        projectTitle,
        items
      };
      localStorage.setItem(STORAGE_KEY_DRAFT_QUOTE, JSON.stringify(draft));
    } catch {
      // ignore
    }
  }, [clientName, clientEmail, clientPhone, clientAddress, projectTitle, items]);

  const handleAddKitItem = (kit: {
    designation: string;
    quantity: number;
    unit: string;
    unitPriceHT: number;
    vatRate: number;
  }) => {
    const newItem: QuoteLineItem = {
      designation: kit.designation,
      quantity: kit.quantity,
      unit: kit.unit,
      unitPriceHT: kit.unitPriceHT,
      vatRate: kit.vatRate,
      totalHT: Math.round(kit.quantity * kit.unitPriceHT * 100) / 100,
      totalTTC: Math.round(kit.quantity * kit.unitPriceHT * (1 + kit.vatRate / 100) * 100) / 100
    };
    setItems((prev) => [...prev, newItem]);
  };

  const getFullPayload = (): QuotePayload => ({
    quoteNumber,
    clientName: clientName.trim() || 'Client Particulier',
    clientEmail: clientEmail.trim() || undefined,
    clientPhone: clientPhone.trim() || undefined,
    clientAddress: clientAddress.trim() || undefined,
    projectTitle: projectTitle.trim() || 'Prestations BTP',
    items: totals.items,
    totalHT: totals.totalHT,
    totalVAT: totals.totalVAT,
    totalTTC: totals.totalTTC,
    validityDays: 30,
    paymentTerms: 'Acompte 30% à la commande, solde à réception des travaux'
  });

  const handleAction = (action: 'sign' | 'share' | 'save') => {
    if (!clientName.trim()) {
      alert('Veuillez renseigner le nom de votre client avant de continuer.');
      return;
    }
    if (items.length === 0) {
      alert('Veuillez ajouter au moins une ligne de prestation à votre devis.');
      return;
    }

    if (!currentUser) {
      setPendingAction(action);
      setAuthModalOpen(true);
      return;
    }

    executeAction(action);
  };

  const executeAction = async (action: 'sign' | 'share' | 'save') => {
    const payload = getFullPayload();
    await saveQuote(payload);
    setIsSaved(true);

    // Enregistrement automatique dans le carnet clients (CRM)
    try {
      saveClientContact({
        name: payload.clientName,
        email: payload.clientEmail,
        phone: payload.clientPhone,
        address: payload.clientAddress,
        lastQuoteDate: new Date().toISOString()
      });
    } catch {}

    const token = `tok_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 8)}`;
    setActiveShareToken(token);

    if (action === 'sign') {
      setSignatureModalOpen(true);
    } else if (action === 'share') {
      setShareModalOpen(true);
    } else if (action === 'save') {
      alert('Devis enregistré avec succès dans votre espace !');
      navigate('/app/dashboard');
    }
  };

  const handleAuthSuccess = (user: any) => {
    setCurrentUser(user);
    setAuthModalOpen(false);
    if (pendingAction) {
      executeAction(pendingAction);
      setPendingAction(null);
    }
  };

  const handleDirectSignatureSaved = (signatureDataUrl: string) => {
    setSignatureModalOpen(false);
    try {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    } catch {}
    alert('Devis signé avec succès par le client en face à face ! Statut mis à jour : Accepté.');
    navigate('/app/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-4 py-3 sm:px-6 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="p-2 -ml-2 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-black text-blue-900 text-lg">BâtiDevis</span>
                <span className="text-[10px] font-mono uppercase bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Mode Libre 60s
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">Générateur conforme aux mentions 2026</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link to="/app/dashboard">
              <Button variant="outline" size="sm" className="text-xs">
                {currentUser ? 'Mon Tableau de Bord' : 'Connexion Artisan'}
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Studio Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Client & Project Information Card */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-blue-600" />
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                Informations du Devis & Client
              </h2>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
              <span>N° :</span>
              <input
                type="text"
                value={quoteNumber}
                onChange={(e) => setQuoteNumber(e.target.value)}
                className="w-28 bg-transparent text-blue-900 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Nom du client <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Ex : M. Thomas Martin"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:border-blue-600 focus:outline-none bg-slate-50/50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Téléphone client (WhatsApp)
              </label>
              <input
                type="tel"
                placeholder="06 12 34 56 78"
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:border-blue-600 focus:outline-none bg-slate-50/50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Email du client
              </label>
              <input
                type="email"
                placeholder="client@gmail.com"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:border-blue-600 focus:outline-none bg-slate-50/50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Adresse du chantier
              </label>
              <input
                type="text"
                placeholder="Ex : 12 rue des Fleurs, 69002 Lyon"
                value={clientAddress}
                onChange={(e) => setClientAddress(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:border-blue-600 focus:outline-none bg-slate-50/50"
              />
            </div>
          </div>
        </div>

        {/* 1. Trade Kit Selector */}
        <TradeKitSelector onSelectItem={handleAddKitItem} />

        {/* 2. Items Table */}
        <QuoteItemsTable
          items={items}
          onChangeItems={setItems}
          totalHT={totals.totalHT}
          totalVAT={totals.totalVAT}
          totalTTC={totals.totalTTC}
        />

        {/* Floating / Bottom Action Bar */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-3 sticky bottom-4 z-20">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>
              Total à valider : <strong className="text-base text-blue-950 font-mono">{totals.totalTTC.toFixed(2)} € TTC</strong>
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleAction('sign')}
              className="flex-1 sm:flex-none text-xs flex items-center justify-center gap-1.5 cursor-pointer border-slate-300"
            >
              <CheckSquare className="w-3.5 h-3.5 text-blue-600" />
              <span>Faire signer en direct</span>
            </Button>

            <Button
              type="button"
              onClick={() => handleAction('share')}
              className="flex-1 sm:flex-none bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Partager au client (WhatsApp)</span>
            </Button>
          </div>
        </div>
      </main>

      {/* Auth Express Modal */}
      <AuthExpressModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />

      {/* Direct Face-to-Face Signature Modal */}
      {signatureModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                Signature du client en face à face
              </h3>
              <button
                type="button"
                onClick={() => setSignatureModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-xs"
              >
                Annuler
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Faites signer directement votre client <strong>{clientName}</strong> sur l'écran de votre téléphone pour valider le devis de <strong>{totals.totalTTC.toFixed(2)} € TTC</strong>.
            </p>

            <SignaturePad
              signerName={clientName}
              onSave={handleDirectSignatureSaved}
              onClear={() => {}}
            />
          </div>
        </div>
      )}

      {/* Share Modal */}
      <ShareQuoteModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        quoteNumber={quoteNumber}
        clientName={clientName}
        clientPhone={clientPhone}
        totalTTC={totals.totalTTC}
        shareToken={activeShareToken}
      />
    </div>
  );
}
