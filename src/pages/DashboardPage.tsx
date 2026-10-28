import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Plus, 
  FileText, 
  CheckCircle2, 
  TrendingUp, 
  Settings, 
  Receipt, 
  Clock, 
  Building2,
  Share2
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { QuoteCard } from '../components/dashboard/QuoteCard';
import { InvoiceCard } from '../components/dashboard/InvoiceCard';
import { ProfileSettingsModal } from '../components/dashboard/ProfileSettingsModal';
import { ShareQuoteModal } from '../components/share/ShareQuoteModal';
import { FollowUpModal } from '../components/dashboard/FollowUpModal';
import { QuotePayload } from '../services/quotes';
import { InvoiceRecord } from '../lib/supabase';
import { generateDepositInvoice, generateFinalInvoice, saveInvoice, getInvoices } from '../services/invoices';
import confetti from 'canvas-confetti';

const STORAGE_KEY_QUOTES = 'batidevis_quotes_local_list';

export function DashboardPage() {
  const [activeTab, setActiveTab] = useState<'quotes' | 'invoices'>('quotes');
  const [quotes, setQuotes] = useState<Array<QuotePayload & { status?: string; shareToken?: string }>>([]);
  const [invoices, setInvoices] = useState<InvoiceRecord[]>([]);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [selectedQuoteForShare, setSelectedQuoteForShare] = useState<any>(null);
  const [followUpModalOpen, setFollowUpModalOpen] = useState(false);
  const [selectedQuoteForFollowUp, setSelectedQuoteForFollowUp] = useState<any>(null);

  // Load quotes and invoices
  const loadData = async () => {
    // 1. Load invoices
    const invList = await getInvoices();
    setInvoices(invList);

    // 2. Load quotes from storage
    try {
      const raw = localStorage.getItem(STORAGE_KEY_QUOTES);
      if (raw) {
        setQuotes(JSON.parse(raw));
      } else {
        // Sample starter quotes for immediate experience
        const defaultQuotes: Array<QuotePayload & { status: string; shareToken: string }> = [
          {
            quoteNumber: 'DEV-2026-001',
            clientName: 'M. Thomas Martin',
            clientEmail: 'client@gmail.com',
            clientPhone: '06 12 34 56 78',
            clientAddress: '12 rue des Fleurs, 69002 Lyon',
            projectTitle: 'Rénovation plomberie et sanitaire',
            totalHT: 995.0,
            totalVAT: 99.5,
            totalTTC: 1094.5,
            status: 'accepted',
            shareToken: 'tok_demo_accepted_1',
            items: [
              {
                designation: 'Remplacement Chauffe-eau électrique 200L classe B',
                quantity: 1,
                unit: 'forfait',
                unitPriceHT: 850.0,
                vatRate: 10.0,
                totalHT: 850.0,
                totalTTC: 935.0
              },
              {
                designation: 'Remplacement mitigeur évier avec flexibles',
                quantity: 1,
                unit: 'unité',
                unitPriceHT: 145.0,
                vatRate: 10.0,
                totalHT: 145.0,
                totalTTC: 159.5
              }
            ]
          },
          {
            quoteNumber: 'DEV-2026-002',
            clientName: 'Mme Sophie Bernard',
            clientPhone: '06 88 77 66 55',
            clientAddress: '45 avenue Jean Jaurès, 69007 Lyon',
            projectTitle: 'Mise en sécurité tableau électrique 3 rangées',
            totalHT: 1450.0,
            totalVAT: 145.0,
            totalTTC: 1595.0,
            status: 'sent',
            shareToken: 'tok_demo_pending_2',
            items: [
              {
                designation: 'Remplacement tableau électrique 3 rangées conforme NF C 15-100',
                quantity: 1,
                unit: 'forfait',
                unitPriceHT: 1450.0,
                vatRate: 10.0,
                totalHT: 1450.0,
                totalTTC: 1595.0
              }
            ]
          }
        ];
        setQuotes(defaultQuotes);
        localStorage.setItem(STORAGE_KEY_QUOTES, JSON.stringify(defaultQuotes));
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // 1-Click Conversion: Facture d'acompte (30%)
  const handleConvertDeposit = async (quote: QuotePayload) => {
    const nextNum = `FAC-2026-${(invoices.length + 1).toString().padStart(3, '0')}`;
    const depositInv = generateDepositInvoice(quote, 30, nextNum);
    await saveInvoice(depositInv);
    await loadData();
    setActiveTab('invoices');

    try {
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
    } catch {}
    alert(`Facture d'acompte 30% (${depositInv.net_to_pay.toFixed(2)} € TTC) générée avec succès !`);
  };

  // 1-Click Conversion: Facture de solde finale (70% restant avec déduction de l'acompte)
  const handleConvertFinal = async (quote: QuotePayload) => {
    // Chercher si un acompte existe pour ce devis
    const existingDeposit = invoices.find(
      (inv) => inv.quote_id === quote.quoteNumber && inv.invoice_type === 'acompte_30'
    );

    const nextNum = `FAC-2026-${(invoices.length + 1).toString().padStart(3, '0')}`;
    const finalInv = generateFinalInvoice(quote, existingDeposit || null, nextNum);
    await saveInvoice(finalInv);
    await loadData();
    setActiveTab('invoices');

    try {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    } catch {}

    if (existingDeposit) {
      alert(
        `Facture de solde générée avec succès ! L'acompte de ${existingDeposit.total_ttc.toFixed(2)} € a été déduit automatiquement. Net à payer : ${finalInv.net_to_pay.toFixed(2)} € TTC.`
      );
    } else {
      alert(`Facture finale générée avec succès ! Montant : ${finalInv.net_to_pay.toFixed(2)} € TTC.`);
    }
  };

  const handleTogglePaid = async (inv: InvoiceRecord) => {
    const newStatus = inv.status === 'paid' ? 'unpaid' : 'paid';
    const updated = { ...inv, status: newStatus as any };
    await saveInvoice(updated);
    await loadData();
  };

  const handleOpenShare = (quote: any) => {
    setSelectedQuoteForShare(quote);
    setShareModalOpen(true);
  };

  const handleOpenFollowUp = (quote: any) => {
    setSelectedQuoteForFollowUp(quote);
    setFollowUpModalOpen(true);
  };

  // Financial Stats
  const totalInvoiced = invoices.reduce((acc, curr) => acc + curr.net_to_pay, 0);
  const totalAcceptedQuotes = quotes.filter((q) => q.status === 'accepted').length;

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
                <span className="text-[11px] font-mono bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-bold border border-blue-200">
                  Espace Artisan
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">Tableau de bord de gestion & facturation BTP</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setSettingsOpen(true)}
              className="text-xs flex items-center gap-1.5 cursor-pointer text-slate-700"
            >
              <Settings className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden sm:inline">Paramètres Entreprise</span>
            </Button>

            <Link to="/creer-devis">
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-blue-600/20">
                <Plus className="w-4 h-4" />
                <span>Nouveau Devis</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Dashboard Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8 space-y-6">
        {/* KPI Header Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase">Devis enregistrés</div>
              <div className="text-2xl font-black text-slate-900">{quotes.length}</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase">Devis signés / validés</div>
              <div className="text-2xl font-black text-emerald-700">{totalAcceptedQuotes}</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase">Total Facturé Net</div>
              <div className="text-2xl font-black text-blue-950 font-mono">
                {totalInvoiced.toFixed(2)} €
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <button
            type="button"
            onClick={() => setActiveTab('quotes')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'quotes'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Mes Devis ({quotes.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('invoices')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'invoices'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Receipt className="w-4 h-4" />
            <span>Mes Factures ({invoices.length})</span>
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'quotes' ? (
          <div className="space-y-4">
            {quotes.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-3">
                <FileText className="w-8 h-8 text-slate-300 mx-auto" />
                <h3 className="text-base font-bold text-slate-800">Aucun devis créé pour l'instant</h3>
                <p className="text-xs text-slate-500">Créez votre premier devis conforme en moins de 60 secondes.</p>
                <Link to="/creer-devis" className="inline-block pt-2">
                  <Button size="sm" className="bg-blue-600 text-white text-xs">
                    Créer mon premier devis
                  </Button>
                </Link>
              </div>
            ) : (
              quotes.map((quote, idx) => (
                <QuoteCard
                  key={idx}
                  quote={quote}
                  onConvertDeposit={handleConvertDeposit}
                  onConvertFinal={handleConvertFinal}
                  onShare={handleOpenShare}
                  onFollowUp={handleOpenFollowUp}
                />
              ))
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {invoices.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-3">
                <Receipt className="w-8 h-8 text-slate-300 mx-auto" />
                <h3 className="text-base font-bold text-slate-800">Aucune facture émise</h3>
                <p className="text-xs text-slate-500">
                  Cliquez sur « Facture Acompte 30% » ou « Facture Solde 70% » sur l'un de vos devis acceptés pour générer votre première facture.
                </p>
              </div>
            ) : (
              invoices.map((inv, idx) => (
                <InvoiceCard
                  key={idx}
                  invoice={inv}
                  onTogglePaid={handleTogglePaid}
                />
              ))
            )}
          </div>
        )}
      </main>

      {/* Profile Settings Modal */}
      <ProfileSettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        onSave={() => alert('Profil et mentions légales enregistrés avec succès !')}
      />

      {/* Share Modal */}
      {selectedQuoteForShare && (
        <ShareQuoteModal
          isOpen={shareModalOpen}
          onClose={() => setShareModalOpen(false)}
          quoteNumber={selectedQuoteForShare.quoteNumber}
          clientName={selectedQuoteForShare.clientName}
          clientPhone={selectedQuoteForShare.clientPhone}
          totalTTC={selectedQuoteForShare.totalTTC}
          shareToken={selectedQuoteForShare.shareToken || 'tok_share_default'}
        />
      )}

      {/* Follow-up WhatsApp / SMS Modal */}
      {selectedQuoteForFollowUp && (
        <FollowUpModal
          isOpen={followUpModalOpen}
          onClose={() => setFollowUpModalOpen(false)}
          params={{
            clientName: selectedQuoteForFollowUp.clientName,
            clientPhone: selectedQuoteForFollowUp.clientPhone || '06 12 34 56 78',
            projectTitle: selectedQuoteForFollowUp.projectTitle,
            quoteNumber: selectedQuoteForFollowUp.quoteNumber,
            totalTtc: selectedQuoteForFollowUp.totalTTC,
            quoteUrl: `${window.location.origin}/valider/${selectedQuoteForFollowUp.shareToken || 'tok_share_default'}`
          }}
        />
      )}
    </div>
  );
}
