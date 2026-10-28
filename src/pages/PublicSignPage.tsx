import { useParams, Link } from 'react-router-dom';
import { ShieldCheck, CheckCircle2, Download, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';

export function PublicSignPage() {
  const { token } = useParams<{ token: string }>();

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      <header className="bg-white border-b border-slate-200 px-4 py-3 sm:px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-heading font-black text-blue-900 text-lg">BâtiDevis</span>
            <span className="text-[11px] font-mono bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200">
              Portail Client Sécurisé
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Document Certifié Conforme</span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full p-4 sm:p-6 lg:p-8">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 text-center">
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
            Validation de votre Devis
          </h1>
          <p className="text-xs font-mono text-slate-500 mb-6">
            Réf token : {token || 'chargement...'}
          </p>
          <div className="p-8 bg-slate-50 rounded-xl border border-dashed border-slate-300 max-w-md mx-auto text-sm text-slate-600">
            Le devis et le module de signature électronique se chargeront ici.
          </div>
        </div>
      </main>
    </div>
  );
}
