import React, { useState } from 'react';
import { X, MessageSquare, Mail, Smartphone, Copy, Check, ExternalLink, ShieldCheck } from 'lucide-react';
import { Button } from '../ui/Button';

interface ShareQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  quoteNumber: string;
  clientName: string;
  clientPhone?: string;
  totalTTC: number;
  shareToken: string;
}

export function ShareQuoteModal({
  isOpen,
  onClose,
  quoteNumber,
  clientName,
  clientPhone,
  totalTTC,
  shareToken
}: ShareQuoteModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://batidevis.fr';
  const shareUrl = `${origin}/valider/${shareToken}`;

  const messageText = `Bonjour ${clientName || 'Monsieur/Madame'},\n\nVoici votre devis ${quoteNumber} (${totalTTC.toFixed(2)} € TTC) pour vos travaux.\nVous pouvez le consulter et le signer directement en 1 clic ici :\n${shareUrl}\n\nRestant à votre entière disposition,\nVotre artisan BâtiDevis`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const cleanPhone = (clientPhone || '').replace(/[^0-9]/g, '');
  const internationalPhone = cleanPhone.startsWith('0') ? '33' + cleanPhone.substring(1) : cleanPhone;

  const handleWhatsApp = () => {
    const waUrl = internationalPhone
      ? `https://wa.me/${internationalPhone}?text=${encodeURIComponent(messageText)}`
      : `https://wa.me/?text=${encodeURIComponent(messageText)}`;
    window.open(waUrl, '_blank');
  };

  const handleSMS = () => {
    const smsUrl = `sms:${cleanPhone}?body=${encodeURIComponent(messageText)}`;
    window.location.href = smsUrl;
  };

  const handleEmail = () => {
    const subject = encodeURIComponent(`Votre devis ${quoteNumber} - BâtiDevis`);
    const mailtoUrl = `mailto:?subject=${subject}&body=${encodeURIComponent(messageText)}`;
    window.location.href = mailtoUrl;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-5 relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
            <MessageSquare className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">
            Envoyer le devis à votre client
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Le client pourra ouvrir son devis et le signer électroniquement en 1 clic sans créer de compte.
          </p>
        </div>

        {/* Copyable Share URL preview */}
        <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 flex items-center justify-between gap-2">
          <div className="truncate text-xs font-mono text-blue-900 font-medium select-all">
            {shareUrl}
          </div>
          <button
            type="button"
            onClick={handleCopyLink}
            className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1 shrink-0 cursor-pointer shadow-2xs"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Copié</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copier</span>
              </>
            )}
          </button>
        </div>

        {/* Direct Send Buttons */}
        <div className="space-y-2.5 pt-1">
          <Button
            type="button"
            onClick={handleWhatsApp}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-emerald-600/20"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Envoyer sur WhatsApp en 1 clic</span>
          </Button>

          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleSMS}
              className="text-xs flex items-center justify-center gap-1.5 py-2.5 cursor-pointer border-slate-300"
            >
              <Smartphone className="w-4 h-4 text-blue-600" />
              <span>SMS Direct</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={handleEmail}
              className="text-xs flex items-center justify-center gap-1.5 py-2.5 cursor-pointer border-slate-300"
            >
              <Mail className="w-4 h-4 text-blue-600" />
              <span>Email</span>
            </Button>
          </div>
        </div>

        <div className="pt-2 text-center text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Lien sécurisé et horodaté conforme Factur-X 2026</span>
        </div>
      </div>
    </div>
  );
}
