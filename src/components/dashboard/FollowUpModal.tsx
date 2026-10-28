import { useState } from 'react';
import { 
  X, 
  MessageSquare, 
  Send, 
  Copy, 
  Check, 
  Clock, 
  Calendar, 
  AlertTriangle,
  ExternalLink 
} from 'lucide-react';
import { Button } from '../ui/Button';
import { 
  generateFollowUpMessage, 
  generateWhatsAppLink, 
  generateSmsLink, 
  type FollowUpParams, 
  type FollowUpTemplateType 
} from '../../services/followUp';

interface FollowUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  params: FollowUpParams;
}

export function FollowUpModal({ isOpen, onClose, params }: FollowUpModalProps) {
  const [templateType, setTemplateType] = useState<FollowUpTemplateType>('courtesy_j3');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const message = generateFollowUpMessage(params, templateType);
  const waLink = generateWhatsAppLink(params, templateType);
  const smsLink = generateSmsLink(params, templateType);

  const handleCopy = () => {
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-100 space-y-5 relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              Relancer mon devis en 1 clic
            </h3>
            <p className="text-xs text-slate-500">
              {params.clientName} • Devis {params.quoteNumber}
            </p>
          </div>
        </div>

        {/* Choix du modèle de relance */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-700 uppercase">
            Stratégie de relance
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setTemplateType('courtesy_j3')}
              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                templateType === 'courtesy_j3'
                  ? 'border-emerald-500 bg-emerald-50/70 text-emerald-950 font-bold shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 text-slate-700'
              }`}
            >
              <div className="flex items-center gap-1.5 text-xs">
                <Clock className="w-3.5 h-3.5 text-emerald-600" />
                <span>J+3</span>
              </div>
              <div className="text-[10px] text-slate-500 mt-1 font-normal">
                Courtoise & écoute
              </div>
            </button>

            <button
              type="button"
              onClick={() => setTemplateType('planning_j7')}
              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                templateType === 'planning_j7'
                  ? 'border-emerald-500 bg-emerald-50/70 text-emerald-950 font-bold shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 text-slate-700'
              }`}
            >
              <div className="flex items-center gap-1.5 text-xs">
                <Calendar className="w-3.5 h-3.5 text-blue-600" />
                <span>J+7</span>
              </div>
              <div className="text-[10px] text-slate-500 mt-1 font-normal">
                Planning chantier
              </div>
            </button>

            <button
              type="button"
              onClick={() => setTemplateType('expiry_warning')}
              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                templateType === 'expiry_warning'
                  ? 'border-emerald-500 bg-emerald-50/70 text-emerald-950 font-bold shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 text-slate-700'
              }`}
            >
              <div className="flex items-center gap-1.5 text-xs">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                <span>Urgence</span>
              </div>
              <div className="text-[10px] text-slate-500 mt-1 font-normal">
                Tarifs matériaux
              </div>
            </button>
          </div>
        </div>

        {/* Aperçu du message */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Aperçu du texte envoyé au client :</span>
            <button
              type="button"
              onClick={handleCopy}
              className="text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copié !' : 'Copier'}</span>
            </button>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-900 text-slate-100 text-xs font-sans leading-relaxed border border-slate-800">
            {message}
          </div>
        </div>

        {/* Actions directes WhatsApp & SMS */}
        <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-600/25 transition-all text-center"
          >
            <Send className="w-4 h-4" />
            <span>Envoyer sur WhatsApp</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-80" />
          </a>

          <a
            href={smsLink}
            className="py-3 px-4 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-800 font-bold text-xs flex items-center justify-center gap-2 transition-all text-center"
          >
            <MessageSquare className="w-4 h-4 text-blue-600" />
            <span>Par SMS</span>
          </a>
        </div>
      </div>
    </div>
  );
}
