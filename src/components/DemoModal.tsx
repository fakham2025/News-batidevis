import { useState } from 'react';
import { 
  X, 
  Check, 
  Smartphone, 
  ShieldCheck, 
  Send, 
  Sparkles, 
  PenTool, 
  FileText, 
  CheckCircle2, 
  ArrowRight,
  Flame
} from 'lucide-react';
import { Button } from './ui/Button';

interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoToWaitlist: () => void;
}

export function DemoModal({ isOpen, onClose, onGoToWaitlist }: DemoModalProps) {
  const [trade, setTrade] = useState<'plomberie' | 'electricite' | 'menuiserie'>('plomberie');
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [signatureDone, setSignatureDone] = useState(false);
  const [isSent, setIsSent] = useState(false);

  if (!isOpen) return null;

  const tradeData = {
    plomberie: {
      name: "Plomberie Chauffage",
      prestation: "Remplacement chauffe-eau thermodynamique 200L + dépose",
      fournitures: "Groupe de sécurité, raccords diélectriques, fixations murales",
      priceHT: 1850,
      tvaRate: 10,
      client: "M. & Mme Lambert - Lyon 3"
    },
    electricite: {
      name: "Électricité Générale",
      prestation: "Mise en sécurité tableau électrique 3 rangées 18 modules",
      fournitures: "Disjoncteurs différentiels 30mA Type A/AC, parafoudre",
      priceHT: 1290,
      tvaRate: 10,
      client: "SCI Les Peupliers - Marseille 8"
    },
    menuiserie: {
      name: "Menuiserie & Agencement",
      prestation: "Pose de 2 fenêtres PVC double vitrage Uw 1.2 + dépose totale",
      fournitures: "Joints d'étanchéité compriband, fixations verinées, tapées 120mm",
      priceHT: 2150,
      tvaRate: 5.5,
      client: "M. Thomas Roche - Bordeaux Bastide"
    }
  };

  const current = tradeData[trade];
  const tvaAmount = Math.round((current.priceHT * current.tvaRate) / 100);
  const totalTTC = current.priceHT + tvaAmount;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative bg-white rounded-2xl sm:rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden border border-slate-200 my-4 sm:my-8">
        
        {/* Modal Header */}
        <div className="bg-slate-950 text-white p-4 sm:p-6 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shrink-0">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="font-mono text-[10px] sm:text-xs font-bold text-blue-400 uppercase tracking-wider">
                Simulateur en direct • Moins de 60s
              </div>
              <h3 className="font-heading text-lg sm:text-xl font-bold">
                Génération de devis sur chantier
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Fermer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Trade Selector tabs */}
        <div className="p-4 bg-gray-50 border-b border-gray-200 flex flex-wrap gap-2 text-xs font-bold">
          <span className="self-center text-gray-500 mr-1 text-[11px] uppercase">Choisissez votre corps d'état :</span>
          {(['plomberie', 'electricite', 'menuiserie'] as const).map((t) => (
            <button
              key={t}
              onClick={() => {
                setTrade(t);
                setSignatureDone(false);
                setIsSent(false);
              }}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                trade === t
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-blue-300'
              }`}
            >
              {tradeData[t].name}
            </button>
          ))}
        </div>

        {/* Step progress */}
        <div className="px-6 pt-4 flex items-center justify-between text-xs text-gray-500 border-b border-gray-100 pb-3">
          <div className="flex items-center gap-1.5 font-bold text-blue-600">
            <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[11px]">1</span>
            <span>Prestations & Prix</span>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-gray-300" />
          <div className="flex items-center gap-1.5 font-bold text-blue-600">
            <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[11px]">2</span>
            <span>Conformité 2026</span>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-gray-300" />
          <div className="flex items-center gap-1.5 font-bold text-blue-600">
            <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[11px]">3</span>
            <span>Signature & Envoi</span>
          </div>
        </div>

        {/* Body Simulator */}
        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          {/* Devis Paper Container */}
          <div className="bg-white rounded-2xl border-2 border-gray-200 p-5 shadow-xs space-y-4 text-xs">
            <div className="flex justify-between items-start pb-3 border-b border-gray-200">
              <div>
                <div className="font-extrabold text-sm text-gray-900">ENTREPRISE ARTISAN PRO</div>
                <div className="text-gray-500 text-[11px]">SIRET : 849 204 892 00018 • RCS Nantes</div>
                <div className="text-emerald-700 font-semibold text-[11px]">Décennale SMA BTP n° 294021/A</div>
              </div>
              <div className="text-right">
                <span className="bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded text-[10px]">
                  DEVIS N° 2026-042
                </span>
                <div className="text-gray-500 text-[10px] mt-1">Date : 12 Octobre 2026</div>
              </div>
            </div>

            <div>
              <div className="text-gray-500 text-[10px] font-bold uppercase">Client :</div>
              <div className="font-bold text-gray-900">{current.client}</div>
            </div>

            {/* Line items */}
            <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 space-y-2">
              <div className="flex justify-between font-bold text-gray-800 border-b border-gray-200 pb-1">
                <span>Désignation des travaux</span>
                <span>Montant HT</span>
              </div>
              <div className="flex justify-between items-start pt-1">
                <div>
                  <div className="font-semibold text-gray-900">{current.prestation}</div>
                  <div className="text-[10px] text-gray-500">{current.fournitures}</div>
                </div>
                <div className="font-mono font-bold text-gray-900 whitespace-nowrap">
                  {current.priceHT.toLocaleString('fr-FR')} € HT
                </div>
              </div>
            </div>

            {/* Totals */}
            <div className="bg-blue-50/70 p-3 rounded-xl border border-blue-100 space-y-1">
              <div className="flex justify-between text-gray-600">
                <span>Total HT :</span>
                <span className="font-semibold font-mono">{current.priceHT.toLocaleString('fr-FR')} €</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>TVA ({current.tvaRate}%) automatique :</span>
                <span className="font-semibold font-mono">{tvaAmount.toLocaleString('fr-FR')} €</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-blue-950 pt-1 border-t border-blue-200">
                <span>TOTAL TTC :</span>
                <span className="font-mono text-blue-700">{totalTTC.toLocaleString('fr-FR')} €</span>
              </div>
            </div>

            {/* Legal compliance notice 2026 */}
            <div className="bg-blue-50/80 text-blue-900 p-2.5 rounded-xl border border-blue-200/80 text-[11px] flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <strong>16 mentions obligatoires 2026 intégrées :</strong> Attestation TVA réduite, médiation de la consommation, déchets 7 flux et format Factur-X PDP prêt.
              </div>
            </div>

            {/* Signature simulator */}
            <div className="pt-2">
              <div className="text-[11px] font-bold text-gray-700 mb-1 flex items-center justify-between">
                <span>Signature tactile du client :</span>
                <span className="text-[10px] text-blue-600 font-normal">Cliquez pour tester</span>
              </div>
              <div
                onClick={() => setSignatureDone(true)}
                className={`h-14 rounded-xl border-2 border-dashed flex items-center justify-center cursor-pointer transition-all ${
                  signatureDone
                    ? 'border-blue-500 bg-blue-50 text-blue-900'
                    : 'border-gray-300 hover:border-blue-400 bg-gray-50'
                }`}
              >
                {signatureDone ? (
                  <div className="flex items-center gap-2 font-serif italic font-bold">
                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                    « Bon pour accord et exécution des travaux » (Signé le 12/10/2026)
                  </div>
                ) : (
                  <div className="text-gray-500 flex items-center gap-1.5">
                    <PenTool className="w-4 h-4 text-gray-400" />
                    <span>Cliquez ici pour simuler la signature client</span>
                  </div>
                )}
              </div>
            </div>

            {/* Send simulation */}
            {signatureDone && (
              <div className="pt-2">
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => setIsSent(true)}
                  className="w-full bg-blue-600 hover:bg-blue-700 font-bold"
                >
                  {isSent ? (
                    <span className="flex items-center gap-1.5">
                      <Check className="w-4 h-4" /> Devis & Attestation transmis au client par SMS !
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5">
                      <Send className="w-4 h-4" /> Envoyer copie client par SMS & Email en 1-clic
                    </span>
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer CTA */}
        <div className="bg-gray-50 p-5 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-600 text-center sm:text-left">
            <span className="font-bold text-slate-900">Convaincu par la rapidité ?</span> Bloquez l'accès à <strong className="text-blue-600 font-bold">9,50€/mois à vie</strong>.
          </div>
          <Button
            variant="default"
            size="md"
            onClick={() => {
              onClose();
              onGoToWaitlist();
            }}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold cursor-pointer"
          >
            <span>Rejoindre la liste d'attente</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>

      </div>
    </div>
  );
}
