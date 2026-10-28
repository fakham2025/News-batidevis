import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShieldCheck, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { PublicQuoteView } from '../components/public/PublicQuoteView';
import { getPublicQuoteByToken, PublicQuoteData } from '../services/publicQuote';

export function PublicSignPage() {
  const { token } = useParams<{ token: string }>();
  const [quote, setQuote] = useState<PublicQuoteData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchQuote = async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    const data = await getPublicQuoteByToken(token);
    setQuote(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchQuote();
  }, [token]);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      <header className="bg-white border-b border-slate-200 px-4 py-3 sm:px-6 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link to="/" className="font-heading font-black text-blue-900 text-lg hover:opacity-90">
              BâtiDevis
            </Link>
            <span className="text-[11px] font-mono bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200">
              Espace Client Sécurisé
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="hidden sm:inline">Conforme Factur-X & Mentions DGCCRF 2026</span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full p-4 sm:p-6 lg:p-8">
        {loading ? (
          <div className="py-24 text-center space-y-3">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
            <p className="text-xs text-slate-500 font-medium">Chargement de votre devis sécurisé...</p>
          </div>
        ) : !quote ? (
          <div className="bg-white rounded-3xl p-8 sm:p-12 text-center max-w-md mx-auto space-y-4 shadow-sm border border-slate-200">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Devis introuvable</h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              Ce lien de devis est expiré ou le jeton de sécurité est invalide. Veuillez contacter directement votre artisan pour obtenir un nouveau lien.
            </p>
            <Link
              to="/"
              className="inline-flex items-center justify-center text-xs text-blue-600 font-bold hover:underline pt-2"
            >
              Retour à l'accueil
            </Link>
          </div>
        ) : (
          <PublicQuoteView quote={quote} onSigned={fetchQuote} />
        )}
      </main>

      <footer className="py-6 border-t border-slate-200 text-center text-xs text-slate-400">
        <p>BâtiDevis 2026 — Plateforme sécurisée de devis et facturation bâtiment.</p>
      </footer>
    </div>
  );
}
