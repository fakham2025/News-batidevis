import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, FileText, CheckCircle2, TrendingUp, Settings } from 'lucide-react';
import { Button } from '../components/ui/Button';

export function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-4 py-3 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="p-2 -ml-2 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <span className="font-heading font-black text-blue-900 text-lg">BâtiDevis</span>
              <span className="ml-2 text-xs text-slate-500 font-medium">Tableau de Bord</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/creer-devis">
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white text-xs flex items-center gap-1.5">
                <Plus className="w-4 h-4" />
                <span>Nouveau Devis</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8">
        <div className="text-center py-12">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">
            Espace Facturation & Devis
          </h1>
          <p className="text-slate-600 max-w-md mx-auto text-sm">
            Retrouvez tous vos devis envoyés, signés, et générez vos factures d'acompte et de solde.
          </p>
        </div>
      </main>
    </div>
  );
}
