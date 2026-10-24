'use client';

import { useState } from 'react';
import { 
  Wifi, 
  Battery, 
  Send, 
  Check, 
  ShieldCheck, 
  Clock, 
  Smartphone,
  PenTool,
  Zap,
  ArrowUpRight
} from 'lucide-react';

interface PhoneMockupProps {
  onOpenDemo?: () => void;
  interactive?: boolean;
}

export function PhoneMockup({ onOpenDemo, interactive = true }: PhoneMockupProps) {
  const [signed, setSigned] = useState(false);
  const [sentStatus, setSentStatus] = useState(false);
  const [activeTab, setActiveTab] = useState<'devis' | 'mentions'>('devis');

  const handleSign = () => {
    setSigned(true);
  };

  const handleSend = () => {
    setSentStatus(true);
    setTimeout(() => setSentStatus(false), 3500);
  };

  return (
    <div className="relative mx-auto max-w-[340px] sm:max-w-[380px] w-full select-none">
      {/* 2026 Ambient glow - Pure cobalt electric backlight */}
      <div className="absolute -inset-6 bg-gradient-to-tr from-blue-600/25 via-blue-500/15 to-slate-900/10 rounded-[56px] blur-3xl -z-10 pointer-events-none" />
      
      {/* Precision Floating Tags */}
      <div className="hidden lg:flex items-center gap-3 absolute -left-12 top-20 bg-slate-900/90 text-white backdrop-blur-xl px-4 py-2.5 rounded-2xl shadow-2xl border border-slate-700/60 text-xs z-20">
        <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center font-mono font-bold text-white text-[11px]">
          48s
        </div>
        <div>
          <div className="font-bold text-white flex items-center gap-1.5">
            Chrono chantier
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping" />
          </div>
          <div className="text-slate-400 font-mono text-[10px]">Devis chiffré & validé</div>
        </div>
      </div>

      <div className="hidden lg:flex items-center gap-3 absolute -right-12 bottom-28 bg-white/95 backdrop-blur-xl px-4 py-2.5 rounded-2xl shadow-xl border border-slate-200/80 text-xs text-slate-900 z-20">
        <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center">
          <ShieldCheck className="w-4 h-4 text-blue-600" />
        </div>
        <div>
          <div className="font-bold text-slate-900">Norme PDP 2026</div>
          <div className="text-blue-700 font-mono text-[10px] font-semibold">16 mentions conformes ✓</div>
        </div>
      </div>

      {/* 2026 Smartphone Titanium Shell */}
      <div className="relative rounded-[48px] p-3.5 bg-slate-950 shadow-[0_25px_60px_-15px_rgba(15,23,42,0.35)] ring-1 ring-white/10 border-4 border-slate-800">
        
        {/* Dynamic Notch */}
        <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-30 flex items-center justify-between px-3">
          <span className="w-2 h-2 rounded-full bg-blue-950" />
          <span className="w-2 h-2 rounded-full bg-slate-900 border border-slate-800" />
        </div>

        {/* Screen Content Frame */}
        <div className="relative rounded-[36px] overflow-hidden bg-white border border-slate-200/70 flex flex-col h-[620px] text-slate-900">
          
          {/* iOS Status Bar */}
          <div className="pt-3 px-6 pb-2 flex items-center justify-between text-xs font-semibold text-slate-800 bg-slate-50/80 border-b border-slate-100">
            <span className="font-mono text-[11px] font-bold">09:41</span>
            <div className="flex items-center gap-2 text-slate-600">
              <span className="text-[10px] bg-blue-100/80 text-blue-800 font-mono font-bold px-1.5 py-0.5 rounded">MODE CHANTIER</span>
              <Wifi className="w-3.5 h-3.5 text-slate-700" />
              <Battery className="w-4 h-4 text-slate-700" />
            </div>
          </div>

          {/* App Header */}
          <div className="bg-white px-4 py-3 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                BD
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5 font-mono">
                  DEV-2026-084
                </div>
                <div className="text-[10px] text-slate-500">M. Marc Dupont • Rénovation</div>
              </div>
            </div>

            <span className="text-[10px] font-mono font-semibold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md border border-blue-200">
              PRÊT
            </span>
          </div>

          {/* Segmented control tabs */}
          <div className="grid grid-cols-2 p-1 bg-slate-100 mx-3 mt-2 rounded-xl text-[11px] font-semibold text-slate-600">
            <button
              onClick={() => setActiveTab('devis')}
              className={`py-1.5 rounded-lg text-center transition-all cursor-pointer ${
                activeTab === 'devis' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
              }`}
            >
              Lignes de devis
            </button>
            <button
              onClick={() => setActiveTab('mentions')}
              className={`py-1.5 rounded-lg text-center transition-all cursor-pointer flex items-center justify-center gap-1 ${
                activeTab === 'mentions' ? 'bg-white text-blue-700 shadow-xs' : 'hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" /> Mentions 2026
            </button>
          </div>

          {/* Scrollable Document Area */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-2.5 text-left">
            {activeTab === 'devis' ? (
              <>
                {/* Client Box */}
                <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-200/80 text-[11px]">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-bold text-slate-900">M. Marc Dupont</div>
                      <div className="text-slate-500">14 Rue des Lilas, 69003 Lyon</div>
                    </div>
                    <span className="font-mono text-[10px] text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200/60 font-semibold">
                      Client particulier
                    </span>
                  </div>
                </div>

                {/* Items */}
                <div className="bg-white rounded-xl p-3 border border-slate-200/80 shadow-2xs space-y-2 text-[11px]">
                  <div className="flex justify-between font-bold text-slate-700 pb-1 border-b border-slate-100 text-[10px] uppercase tracking-wider">
                    <span>Prestation & Matériel</span>
                    <span>Montant HT</span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-semibold text-slate-900">Chauffe-eau 200L Thermodynamique</div>
                        <div className="text-[10px] text-slate-500">Fourniture avec raccords isolés & groupe</div>
                      </div>
                      <div className="font-mono font-bold text-slate-900 whitespace-nowrap">1 420,00 €</div>
                    </div>

                    <div className="flex justify-between items-start pt-1.5 border-t border-slate-100">
                      <div>
                        <div className="font-semibold text-slate-900">Dépose & Raccordement cuivre</div>
                        <div className="text-[10px] text-slate-500">Main d'œuvre qualifiée (4h)</div>
                      </div>
                      <div className="font-mono font-bold text-slate-900 whitespace-nowrap">380,00 €</div>
                    </div>

                    <div className="flex justify-between items-start pt-1.5 border-t border-slate-100">
                      <div>
                        <div className="font-semibold text-slate-900">Évacuation & recyclage déchets</div>
                        <div className="text-[10px] text-blue-700 font-mono">Bordereau BSD conforme 2026</div>
                      </div>
                      <div className="font-mono font-bold text-slate-900 whitespace-nowrap">65,00 €</div>
                    </div>
                  </div>
                </div>

                {/* Calculation Total Box */}
                <div className="bg-slate-900 text-white rounded-xl p-3 space-y-1 text-[11px]">
                  <div className="flex justify-between text-slate-400">
                    <span>Total Brut HT</span>
                    <span className="font-mono text-white">1 865,00 €</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>TVA Rénovation (10,0%)</span>
                    <span className="font-mono text-white">186,50 €</span>
                  </div>
                  <div className="flex justify-between text-xs font-bold text-white pt-1.5 border-t border-slate-800">
                    <span>NET À PAYER TTC</span>
                    <span className="font-mono text-blue-400 text-sm font-extrabold">2 051,50 €</span>
                  </div>
                </div>

                {/* Signature Block */}
                <div className="bg-white rounded-xl p-2.5 border border-slate-200/80 shadow-2xs">
                  <div className="flex items-center justify-between text-[11px] mb-1.5">
                    <span className="font-bold text-slate-800 flex items-center gap-1">
                      <PenTool className="w-3 h-3 text-blue-600" /> Signature client sur écran
                    </span>
                    <span className="text-[10px] text-blue-600 font-mono">Légal eIDAS</span>
                  </div>

                  <div 
                    onClick={interactive ? handleSign : undefined}
                    className={`h-14 rounded-lg border-2 border-dashed flex items-center justify-center cursor-pointer transition-all ${
                      signed 
                        ? 'border-blue-500 bg-blue-50/60 text-blue-900' 
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-500'
                    }`}
                  >
                    {signed ? (
                      <div className="flex items-center gap-1.5 text-xs font-bold font-serif italic text-blue-950">
                        <Check className="w-4 h-4 text-blue-600" /> "Bon pour accord - M. Dupont" (12/10/2026)
                      </div>
                    ) : (
                      <div className="text-[11px] font-medium flex items-center gap-1.5 text-slate-600">
                        <span>👉 Touchez du doigt pour signer</span>
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              /* Mentions 2026 Tab */
              <div className="space-y-2 text-[11px]">
                <div className="bg-white rounded-xl p-3 border border-slate-200 space-y-2">
                  <div className="flex items-center gap-1.5 text-blue-800 font-bold text-xs">
                    <ShieldCheck className="w-4 h-4 text-blue-600" /> Pack légal 2026 appliqué
                  </div>
                  <ul className="space-y-1.5 text-slate-700 text-[10px]">
                    <li className="flex items-start gap-1.5">
                      <Check className="w-3 h-3 text-blue-600 shrink-0 mt-0.5" />
                      <span><strong>Décennale :</strong> SMABTP Police 984021 validée</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <Check className="w-3 h-3 text-blue-600 shrink-0 mt-0.5" />
                      <span><strong>Format Factur-X :</strong> Norme EN 16931 PDP 2026</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <Check className="w-3 h-3 text-blue-600 shrink-0 mt-0.5" />
                      <span><strong>Attestation TVA :</strong> Logement achevé &gt; 2 ans</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <Check className="w-3 h-3 text-blue-600 shrink-0 mt-0.5" />
                      <span><strong>Médiation :</strong> CM2C (art. L.612-1 conso)</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <Check className="w-3 h-3 text-blue-600 shrink-0 mt-0.5" />
                      <span><strong>Gestion déchets :</strong> Déchèterie pro & tri 7 flux</span>
                    </li>
                  </ul>
                  <div className="p-2 bg-blue-50/80 rounded-lg text-blue-900 text-[10px] font-medium border border-blue-100">
                    Certificat d'intégrité numérique horodaté.
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Bar */}
          <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center gap-2">
            <button
              onClick={handleSend}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md shadow-blue-600/25 active:scale-95 transition-all cursor-pointer"
            >
              {sentStatus ? (
                <>
                  <Check className="w-3.5 h-3.5 text-white" />
                  <span>Envoyé par SMS & Email !</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Envoyer au client (1-clic)</span>
                </>
              )}
            </button>
            <button
              onClick={onOpenDemo}
              title="Tester la démo"
              className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:text-blue-600 hover:border-blue-300 transition-colors cursor-pointer"
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
