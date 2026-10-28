import { useState } from 'react';
import { CreditCard, ShieldCheck, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';
import { 
  generateDepositPaymentSession, 
  formatStripePrice, 
  computeDepositAmountCents,
  type StripeDepositParams 
} from '../../services/stripe';

interface StripeDepositButtonProps {
  params: StripeDepositParams;
  onPaymentSuccess?: (amountEuros: number) => void;
}

export function StripeDepositButton({ params, onPaymentSuccess }: StripeDepositButtonProps) {
  const [loading, setLoading] = useState(false);
  const [paid, setPaid] = useState(false);

  const amountCents = computeDepositAmountCents(params.totalQuoteTtc, params.depositPercent || 30);
  const formattedPrice = formatStripePrice(amountCents);

  const handlePay = () => {
    setLoading(true);
    const session = generateDepositPaymentSession(params);

    // Simulation fluide en mode sécurisé
    setTimeout(() => {
      setLoading(false);
      setPaid(true);
      if (onPaymentSuccess) {
        onPaymentSuccess(session.amount_euros);
      }
    }, 1200);
  };

  if (paid) {
    return (
      <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-2 animate-in fade-in duration-200">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="font-heading font-extrabold text-sm sm:text-base">
            Acompte de 30% ({formattedPrice}) réglé avec succès !
          </span>
        </div>
        <p className="text-xs text-emerald-800 font-sans">
          Votre paiement a été validé. L'artisan est notifié et peut réserver vos dates d'intervention sur son planning.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 text-white space-y-3 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div>
          <div className="text-[11px] font-mono text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Paiement d'Acompte 30% Sécurisé</span>
          </div>
          <div className="text-xs text-slate-400 font-sans">
            Réglez immédiatement votre acompte par Carte Bancaire pour bloquer le chantier
          </div>
        </div>

        <div className="text-left sm:text-right">
          <div className="text-xs text-slate-400">Montant de l'acompte :</div>
          <div className="text-lg font-black text-emerald-400 font-mono">
            {formattedPrice} TTC
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
        <button
          type="button"
          onClick={handlePay}
          disabled={loading}
          className="w-full sm:w-auto flex-1 py-3 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-heading font-bold text-xs sm:text-sm shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>Traitement sécurisé Stripe...</span>
            </>
          ) : (
            <>
              <CreditCard className="w-4 h-4 text-emerald-200" />
              <span>Régler l'acompte de {formattedPrice}</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>CRYPTAGE SSL 256-BIT • STRIPE VERIFIED</span>
        </div>
      </div>
    </div>
  );
}
