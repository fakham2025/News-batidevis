import React from 'react';
import { Receipt, CheckCircle2, Clock, Printer, Download, ArrowUpRight } from 'lucide-react';
import { InvoiceRecord } from '../../lib/supabase';
import { Button } from '../ui/Button';

interface InvoiceCardProps {
  invoice: InvoiceRecord;
  onTogglePaid: (invoice: InvoiceRecord) => void;
}

export function InvoiceCard({ invoice, onTogglePaid }: InvoiceCardProps) {
  const isPaid = invoice.status === 'paid';
  const isDeposit = invoice.invoice_type === 'acompte_30';

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm hover:shadow-md transition-all space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-xs text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              {invoice.invoice_number}
            </span>
            {isDeposit ? (
              <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                Acompte 30%
              </span>
            ) : (
              <span className="text-[10px] font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                Solde Final
              </span>
            )}
            {isPaid ? (
              <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>Payée</span>
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[11px] font-bold text-orange-700 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200">
                <Clock className="w-3 h-3 text-orange-600" />
                <span>En attente de règlement</span>
              </span>
            )}
          </div>

          <h3 className="text-base font-bold text-slate-900 leading-snug">
            Facture client : {invoice.client_name}
          </h3>
          <p className="text-xs text-slate-500">
            {invoice.deposit_invoice_ref ? (
              <span>Réf acompte déduit : <strong className="font-mono text-slate-700">{invoice.deposit_invoice_ref}</strong> • </span>
            ) : null}
            Échéance : <strong className="text-slate-700">{invoice.due_date}</strong>
          </p>
        </div>

        <div className="text-right space-y-0.5">
          <div className="text-xs text-slate-400 font-medium">Net à Payer TTC</div>
          <div className="text-lg font-black text-blue-950 font-mono">
            {invoice.net_to_pay.toFixed(2)} €
          </div>
          {invoice.deposit_deducted > 0 && (
            <div className="text-[11px] text-emerald-600 font-mono font-medium">
              (Acompte déduit : -{invoice.deposit_deducted.toFixed(2)} €)
            </div>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <div className="text-[11px] text-slate-400 font-mono">
          Émise le {new Date(invoice.created_at || Date.now()).toLocaleDateString('fr-FR')}
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onTogglePaid(invoice)}
            className="text-xs text-slate-600 hover:text-slate-900 cursor-pointer"
          >
            {isPaid ? 'Marquer comme impayée' : 'Marquer comme payée'}
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => window.print()}
            className="text-xs flex items-center gap-1 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Imprimer / PDF</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
