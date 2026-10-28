import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, FileText, Share2, Download, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/Button';

export function QuoteBuilderPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-4 py-3 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="p-2 -ml-2 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-black text-blue-900 text-lg">BâtiDevis</span>
                <span className="text-[10px] font-mono uppercase bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                  Mode Libre 60s
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">Générateur de devis conforme mentions 2026</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/app/dashboard">
              <Button variant="outline" size="sm" className="text-xs">
                Mon Espace Artisan
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8">
        <div className="text-center py-12">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">
            Studio de Création de Devis
          </h1>
          <p className="text-slate-600 max-w-md mx-auto text-sm">
            Préparez votre devis en sélectionnant vos ouvrages types ou saisissez vos lignes libres.
          </p>
        </div>
      </main>
    </div>
  );
}
