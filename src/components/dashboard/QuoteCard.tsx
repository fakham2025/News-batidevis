import React from 'react';
import { FileText, CheckCircle2, Clock, Share2, Receipt, ArrowRight, Printer } from 'lucide-react';
import { QuotePayload } from '../../services/quotes';
import { Button } from '../ui/Button';

interface QuoteCardProps {
  quote: QuotePayload & { status?: string; shareToken?: string; signedAt?: string };
  onConvertDeposit: (quote: QuotePayload) => void;
  onConvertFinal: (quote: QuotePayload) => void;
  onShare: (quote: QuotePayload) => void;
}

export function QuoteCard({
  quote,
  onConvertDeposit,
  onConvertFinal,
  onShare
}: QuoteCardProps) {
  const isAccepted = quote.status === 'accepted';

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm hover:shadow-md transition-all space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-xs text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              {quote.quoteNumber}
            </span>
            {isAccepted ? (
              <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>Signé & Accepté</span>
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                <Clock className="w-3 h-3 text-amber-600" />
                <span>En attente de signature</span>
              </span>
            )}
          </div>
          <h3 className="text-base font-extrabold text-slate-900 leading-snug">
            {quote.projectTitle}
          </h3>
          <p className="text-xs text-slate-500">
            Client : <strong className="text-slate-800">{quote.clientName}</strong>
            {quote.clientAddress ? ` • ${quote.clientAddress}` : ''}
          </p>
        </div>

        <div className="text-right">
          <div className="text-xs text-slate-400 font-medium">Montant TTC</div>
          <div className="text-lg font-black text-blue-950 font-mono">
            {quote.totalTTC.toFixed(2)} €
          </div>
          <div className="text-[11px] text-slate-400 font-mono">
            ({quote.totalHT.toFixed(2)} € HT)
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onShare(quote)}
            className="text-xs flex items-center gap-1.5 cursor-pointer text-slate-700"
          >
            <Share2 className="w-3.5 h-3.5 text-blue-600" />
            <span>Partager / Lien</span>
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => window.print()}
            className="text-xs flex items-center gap-1 cursor-pointer text-slate-500 hover:text-slate-800"
          >
            <Printer className="w-3.5 h-3.5" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onConvertDeposit(quote)}
            className="text-xs bg-amber-50/70 text-amber-900 border-amber-200 hover:bg-amber-100 flex items-center gap-1 cursor-pointer font-bold"
          >
            <Receipt className="w-3.5 h-3.5 text-amber-700" />
            <span>Facture Acompte 30%</span>
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={() => onConvertFinal(quote)}
            className="text-xs bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center gap-1 cursor-pointer shadow-xs"
          >
            <span>Facture Solde 70%</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
