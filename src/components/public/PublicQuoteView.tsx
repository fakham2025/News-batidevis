import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, Download, Printer, Check, Clock, Building2, Phone, Calendar } from 'lucide-react';
import { PublicQuoteData, signPublicQuote } from '../../services/publicQuote';
import { SignaturePad } from '../signature/SignaturePad';
import { StripeDepositButton } from './StripeDepositButton';
import { Button } from '../ui/Button';
import confetti from 'canvas-confetti';

interface PublicQuoteViewProps {
  quote: PublicQuoteData;
  onSigned: () => void;
}

export function PublicQuoteView({ quote, onSigned }: PublicQuoteViewProps) {
  const [agreed, setAgreed] = useState(false);
  const [signingOpen, setSigningOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isAlreadySigned = quote.status === 'accepted';

  const handleSaveSignature = async (signatureDataUrl: string) => {
    setIsSubmitting(true);
    await signPublicQuote(quote.shareToken, signatureDataUrl, quote.clientName);
    setIsSubmitting(false);
    setSigningOpen(false);

    try {
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
    } catch {}

    onSigned();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Status */}
      {isAlreadySigned ? (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-3 text-emerald-900 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold">Devis Accepté et Signé</h2>
              <p className="text-xs text-emerald-700">
                Signé électroniquement {quote.signedAt ? `le ${new Date(quote.signedAt).toLocaleDateString('fr-FR')}` : 'avec succès'}.
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handlePrint}
            className="text-xs border-emerald-300 text-emerald-800 hover:bg-emerald-100 flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Imprimer / PDF</span>
          </Button>
        </div>
      ) : (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-blue-950 shadow-xs">
          <div className="flex items-center gap-2.5">
            <Clock className="w-5 h-5 text-blue-600 shrink-0" />
            <div className="text-xs sm:text-sm">
              <span className="font-bold">Devis en attente de votre validation :</span>{' '}
              <span>Consultez le détail ci-dessous et signez en 1 clic.</span>
            </div>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handlePrint}
            className="text-xs border-blue-200 text-blue-900 hover:bg-blue-100 flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Télécharger PDF</span>
          </Button>
        </div>
      )}

      {/* Module de Paiement d'Acompte 30% Stripe (actif dès acceptation) */}
      {isAlreadySigned && (
        <StripeDepositButton
          params={{
            quoteNumber: quote.quoteNumber,
            depositInvoiceNumber: `FAC-ACOMPTE-${quote.quoteNumber.replace('DEV-', '')}`,
            totalQuoteTtc: quote.totalTTC,
            depositPercent: 30,
            clientName: quote.clientName,
            clientEmail: quote.clientEmail,
            successUrl: typeof window !== 'undefined' ? window.location.href : '',
            cancelUrl: typeof window !== 'undefined' ? window.location.href : ''
          }}
        />
      )}

      {/* Official A4 French Quote Layout */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-lg p-6 sm:p-10 space-y-8 printable-content">
        {/* Header: Artisan Info vs Client Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-b border-slate-200 pb-8">
          {/* Artisan Company */}
          <div className="space-y-2">
            <div className="inline-block bg-blue-950 text-white font-mono font-bold text-xs px-2.5 py-1 rounded-md">
              ÉMETTEUR DU DEVIS
            </div>
            <h3 className="text-lg font-black text-slate-900">
              {quote.artisanCompanyName || 'Entreprise Artisanale BTP'}
            </h3>
            <div className="text-xs text-slate-600 space-y-1">
              <p>SIRET : <span className="font-mono">{quote.artisanSiret || '839 204 192 00018'}</span></p>
              <p>Tél : {quote.artisanPhone || '06 12 34 56 78'}</p>
              <p className="text-slate-500 font-medium">{quote.artisanInsurance || 'Assurance Décennale SMABTP n°2026-BTP'}</p>
            </div>
          </div>

          {/* Client Details */}
          <div className="space-y-2 sm:text-right">
            <div className="inline-block bg-slate-100 text-slate-700 font-mono font-bold text-xs px-2.5 py-1 rounded-md">
              CLIENT DESTINATAIRE
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              {quote.clientName}
            </h3>
            <div className="text-xs text-slate-600 space-y-1">
              {quote.clientAddress && <p>{quote.clientAddress}</p>}
              {quote.clientPhone && <p>Tél : {quote.clientPhone}</p>}
              {quote.clientEmail && <p>Email : {quote.clientEmail}</p>}
            </div>
          </div>
        </div>

        {/* Quote Title & Reference */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <div className="text-xs font-mono uppercase text-slate-400 font-bold">Projet de travaux</div>
            <h4 className="text-base sm:text-lg font-extrabold text-blue-950">
              {quote.projectTitle}
            </h4>
          </div>
          <div className="sm:text-right">
            <div className="text-xs font-mono text-slate-500">Devis N° : <strong className="text-slate-900 font-mono">{quote.quoteNumber}</strong></div>
            <div className="text-xs text-slate-500">Validité : 30 jours à date d'émission</div>
          </div>
        </div>

        {/* Items Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b-2 border-slate-200 text-slate-600 uppercase text-[11px] font-bold">
                <th className="py-2.5">Désignation des prestations</th>
                <th className="py-2.5 text-center">Qté</th>
                <th className="py-2.5 text-center">Unité</th>
                <th className="py-2.5 text-right">Prix Unit. HT</th>
                <th className="py-2.5 text-center">Taux TVA</th>
                <th className="py-2.5 text-right">Montant HT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {quote.items.map((it, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50">
                  <td className="py-3 font-medium text-slate-900 pr-2">{it.designation}</td>
                  <td className="py-3 text-center font-mono">{it.quantity}</td>
                  <td className="py-3 text-center text-slate-500">{it.unit}</td>
                  <td className="py-3 text-right font-mono">{it.unitPriceHT.toFixed(2)} €</td>
                  <td className="py-3 text-center font-mono text-blue-800 font-bold">{it.vatRate} %</td>
                  <td className="py-3 text-right font-mono font-bold text-slate-900">
                    {(Math.round(it.quantity * it.unitPriceHT * 100) / 100).toFixed(2)} €
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals & Fiscal Breakdown */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-t-2 border-slate-200 pt-6">
          <div className="text-xs text-slate-500 space-y-1.5 max-w-sm">
            <p className="font-bold text-slate-700">Modalités de règlement :</p>
            <p>{quote.paymentTerms || 'Acompte 30% à la commande, solde à réception des travaux.'}</p>
            <p className="text-[11px] text-slate-400">
              En cas de retard de paiement, indemnité forfaitaire légale pour frais de recouvrement de 40 € (art. L. 441-10 du Code de commerce).
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 min-w-[260px] space-y-2">
            <div className="flex justify-between text-xs text-slate-600">
              <span>Total Général HT :</span>
              <span className="font-mono font-bold text-slate-900">{quote.totalHT.toFixed(2)} €</span>
            </div>
            <div className="flex justify-between text-xs text-slate-600 border-b border-slate-200 pb-2">
              <span>Montant TVA :</span>
              <span className="font-mono font-bold text-slate-900">{quote.totalVAT.toFixed(2)} €</span>
            </div>
            <div className="flex justify-between text-base font-black text-blue-950 pt-1">
              <span>TOTAL TTC :</span>
              <span className="font-mono text-lg text-blue-600">{quote.totalTTC.toFixed(2)} €</span>
            </div>
          </div>
        </div>

        {/* Signature Area */}
        <div className="border-t border-slate-200 pt-6">
          {isAlreadySigned ? (
            <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="text-xs font-bold text-emerald-900 uppercase tracking-wide flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Signature électronique certifiée</span>
                </div>
                <p className="text-xs text-slate-600">
                  Mention légale : <em>« Bon pour accord et exécution des travaux »</em>
                </p>
                <p className="text-[11px] font-mono text-slate-400">
                  Horodatage de validation : {new Date(quote.signedAt || Date.now()).toLocaleString('fr-FR')}
                </p>
              </div>

              {quote.signatureData && (
                <div className="border border-slate-200 bg-white rounded-xl p-2 shadow-2xs">
                  <img
                    src={quote.signatureData}
                    alt="Signature du client"
                    className="h-16 max-w-[180px] object-contain"
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
              <div className="flex items-start gap-2.5">
                <input
                  id="agree-terms"
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-1 w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                />
                <label htmlFor="agree-terms" className="text-xs text-slate-700 leading-relaxed cursor-pointer select-none">
                  Je soussigné(e) <strong>{quote.clientName}</strong>, certifie avoir pris connaissance du devis{' '}
                  <strong>{quote.quoteNumber}</strong> et donne mon <strong>bon pour accord et exécution des travaux</strong> selon les conditions énoncées.
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button
                  type="button"
                  disabled={!agreed}
                  onClick={() => setSigningOpen(true)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm px-6 py-3 rounded-xl shadow-lg shadow-emerald-600/20 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4 mr-1.5" />
                  <span>Signer et valider ce devis</span>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Signature Modal */}
      {signingOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-5">
            <div className="text-center space-y-1">
              <h3 className="text-lg font-bold text-slate-900">
                Signature électronique du devis
              </h3>
              <p className="text-xs text-slate-500">
                Apposez votre signature avec le doigt sur votre écran ou à la souris.
              </p>
            </div>

            <SignaturePad
              signerName={quote.clientName}
              onSave={handleSaveSignature}
              onClear={() => {}}
            />

            <div className="text-center pt-1">
              <button
                type="button"
                onClick={() => setSigningOpen(false)}
                className="text-xs text-slate-400 hover:text-slate-600 font-semibold"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
