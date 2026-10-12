import { useState } from 'react';
import { 
  ArrowRight, 
  Play, 
  ShieldCheck, 
  Clock, 
  Check, 
  Sparkles, 
  PenTool, 
  Wifi, 
  Battery, 
  Send,
  Layers,
  ArrowUpRight
} from 'lucide-react';

interface HeroSectionProps {
  onOpenDemo: () => void;
  onScrollToWaitlist: () => void;
}

export function HeroSection({ onOpenDemo, onScrollToWaitlist }: HeroSectionProps) {
  const [deviceSigned, setDeviceSigned] = useState(false);
  const [deviceSent, setDeviceSent] = useState(false);

  const handleDeviceSign = () => {
    setDeviceSigned(true);
  };

  const handleDeviceSend = () => {
    setDeviceSent(true);
    setTimeout(() => setDeviceSent(false), 3000);
  };

  return (
    <section 
      style={{ backgroundColor: '#090D16' }}
      className="relative overflow-hidden pt-10 pb-20 sm:pt-16 sm:pb-28 lg:pt-20 lg:pb-36 text-white border-b border-slate-800/80"
    >
      {/* Background Architectural Grid Pattern */}
      <div className="absolute inset-0 bg-tech-grid-dark pointer-events-none opacity-80" />

      {/* Subtle Atmospheric Gradients: Cobalt Blue toward Slate Gray (Ardoise) */}
      <div className="absolute top-[-10%] left-[-5%] w-[650px] h-[650px] bg-gradient-to-br from-blue-600/25 via-blue-900/15 to-transparent rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-[20%] right-[-10%] w-[700px] h-[600px] bg-gradient-to-bl from-slate-700/25 via-blue-700/20 to-transparent rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[30%] w-[500px] h-[400px] bg-gradient-to-t from-blue-500/15 via-slate-800/15 to-transparent rounded-full blur-[120px] pointer-events-none" />

      {/* Decorative floating 3D geometric wireframes in background */}
      <div className="absolute top-28 left-8 w-16 h-16 rounded-2xl border border-blue-500/25 bg-blue-500/5 backdrop-blur-xs rotate-12 -z-0 pointer-events-none hidden xl:block animate-float-slow" />
      <div className="absolute bottom-24 right-12 w-20 h-20 rounded-3xl border border-slate-600/30 bg-slate-800/15 backdrop-blur-xs -rotate-6 -z-0 pointer-events-none hidden xl:block animate-float-reverse" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        
        {/* Asymmetrical 2026 Layout Grid: 7 cols (Text & Actions) / 5 cols (3D Floating Stage) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          
          {/* ============================================================== */}
          {/* LEFT COLUMN: Asymmetric Typography & Action Anchor */}
          {/* ============================================================== */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-7 sm:space-y-8">
            
            {/* 3D Glass Badge - Cobalt to Slate border */}
            <div className="inline-flex items-center gap-3 p-1 pr-4 rounded-full bg-slate-900/90 border border-blue-500/35 shadow-[0_4px_20px_rgba(37,99,235,0.2)] backdrop-blur-xl">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-600 text-white shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-blue-200" />
              </span>
              <span className="font-heading font-semibold text-xs sm:text-sm tracking-wide text-white">
                🚀 Accès anticipé -50% à vie
              </span>
              <span className="h-3 w-px bg-slate-700 hidden sm:inline" />
              <span className="font-mono text-[10px] text-blue-400 font-bold uppercase tracking-wider hidden sm:inline">
                PIONNIER 2026
              </span>
            </div>

            {/* H1 Headline in Plus Jakarta Sans */}
            <h1 className="font-heading text-[30px] xs:text-[34px] sm:text-5xl lg:text-[55px] font-extrabold text-white tracking-[-0.035em] leading-[1.15] sm:leading-[1.12]">
              Le logiciel devis facture artisan{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-200 to-slate-200 block sm:inline">
                qui comprend votre métier
              </span>
            </h1>

            {/* Subtitle in Inter */}
            <p className="font-sans text-sm sm:text-lg lg:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-normal">
              Générez des devis conformes aux mentions obligatoires 2026 en 60 secondes, directement depuis votre téléphone sur chantier. Fini les erreurs Word et les oublis.
            </p>

            {/* Action Group: Dual Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 sm:gap-4 pt-1">
              <button
                onClick={onScrollToWaitlist}
                className="w-full sm:w-auto px-7 sm:px-8 py-3.5 sm:py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white font-heading font-bold text-base sm:text-lg flex items-center justify-center gap-3 shadow-[0_0_35px_-5px_rgba(37,99,235,0.6)] border-t border-white/20 transition-all active:scale-[0.98] cursor-pointer group min-h-[52px]"
              >
                <span>Rejoindre la liste d'attente</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
              </button>

              <button
                onClick={onOpenDemo}
                className="w-full sm:w-auto px-6 sm:px-7 py-3.5 sm:py-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700/90 hover:border-slate-500 font-heading font-semibold text-base flex items-center justify-center gap-2.5 backdrop-blur-md transition-all active:scale-[0.98] cursor-pointer shadow-lg shadow-black/40 min-h-[52px]"
              >
                <div className="w-6 h-6 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">
                  <Play className="w-3 h-3 fill-blue-400" />
                </div>
                <span>Voir la démo</span>
              </button>
            </div>

            {/* Mobile-first Quick Trust Badges Strip (visible on mobile only) */}
            <div className="grid grid-cols-3 gap-2 pt-1 sm:hidden">
              <div className="bg-slate-900/90 border border-slate-800 py-2 px-2 rounded-xl text-center">
                <div className="font-mono text-blue-400 font-bold text-xs">⚡ 48s</div>
                <div className="text-[10px] text-slate-400">Chiffrage express</div>
              </div>
              <div className="bg-slate-900/90 border border-slate-800 py-2 px-2 rounded-xl text-center">
                <div className="font-mono text-blue-400 font-bold text-xs">🛡️ 2026</div>
                <div className="text-[10px] text-slate-400">16 mentions PDP</div>
              </div>
              <div className="bg-slate-900/90 border border-slate-800 py-2 px-2 rounded-xl text-center">
                <div className="font-mono text-blue-400 font-bold text-xs">✍️ eIDAS</div>
                <div className="text-[10px] text-slate-400">Signature SMS</div>
              </div>
            </div>

            {/* Social Proof & Micro-copy in Inter font */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 sm:gap-6 text-xs sm:text-sm text-slate-400 font-sans">
              <div className="flex items-center gap-2.5">
                {/* 3D Stacked Avatars */}
                <div className="flex -space-x-2.5">
                  <div className="w-8 h-8 rounded-full bg-slate-800 border-2 border-slate-950 text-blue-400 font-mono font-bold flex items-center justify-center text-[10px] shadow-sm">
                    MD
                  </div>
                  <div className="w-8 h-8 rounded-full bg-blue-900 border-2 border-slate-950 text-blue-200 font-mono font-bold flex items-center justify-center text-[10px] shadow-sm">
                    SL
                  </div>
                  <div className="w-8 h-8 rounded-full bg-slate-700 border-2 border-slate-950 text-slate-200 font-mono font-bold flex items-center justify-center text-[10px] shadow-sm">
                    TR
                  </div>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-slate-800 border-2 border-slate-950 text-white font-mono font-bold flex items-center justify-center text-[10px] shadow-sm">
                    +240
                  </div>
                </div>

                <div className="text-left">
                  <div className="font-heading font-bold text-white text-xs sm:text-sm">
                    Déjà 247 artisans inscrits
                  </div>
                  <div className="text-[11px] text-slate-400 font-sans">
                    artisans du BTP en France
                  </div>
                </div>
              </div>

              <div className="h-4 w-px bg-slate-800 hidden sm:block" />

              <div className="flex items-center gap-2 font-medium text-slate-300">
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                <span>Sans engagement</span>
              </div>
            </div>

            {/* Asymmetric Technical Specs Strip */}
            <div className="pt-6 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-3 gap-3.5 text-left font-sans">
              <div className="flex items-center gap-2.5 text-xs text-slate-300">
                <div className="w-6 h-6 rounded-lg bg-blue-950/90 text-blue-400 border border-blue-800/60 flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>100% Hors-ligne chantier</span>
              </div>
              
              <div className="flex items-center gap-2.5 text-xs text-slate-300">
                <div className="w-6 h-6 rounded-lg bg-blue-950/90 text-blue-400 border border-blue-800/60 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
                <span>Conforme Factur-X & PDP</span>
              </div>

              <div className="flex items-center gap-2.5 text-xs text-slate-300 col-span-2 sm:col-span-1">
                <div className="w-6 h-6 rounded-lg bg-blue-950/90 text-blue-400 border border-blue-800/60 flex items-center justify-center shrink-0">
                  <Layers className="w-3.5 h-3.5" />
                </div>
                <span>16 mentions auto</span>
              </div>
            </div>

          </div>

          {/* ============================================================== */}
          {/* RIGHT COLUMN: Asymmetrical 3D Floating Stage with Depth */}
          {/* ============================================================== */}
          <div className="lg:col-span-5 relative flex justify-center items-center perspective-1000 select-none">
            
            {/* 3D Floating Element #1: Top-Left Elevated Glassmorphism Badge */}
            <div className="absolute -left-6 sm:-left-12 -top-6 z-30 animate-float-slow hidden sm:flex items-center gap-3 p-3.5 rounded-2xl bg-gradient-to-r from-slate-900/95 to-slate-950/90 border border-blue-500/40 shadow-[0_20px_40px_rgba(0,0,0,0.7)] backdrop-blur-xl">
              <div className="w-9 h-9 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center shadow-inner">
                <ShieldCheck className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <div className="font-heading font-extrabold text-xs text-white flex items-center gap-1.5">
                  Conforme Factur-X 2026
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                </div>
                <div className="font-mono text-[10px] text-slate-400">
                  16 mentions certifiées PDP
                </div>
              </div>
            </div>

            {/* 3D Floating Element #2: Top-Right Chronometer Capsule */}
            <div className="absolute -right-4 sm:-right-8 top-12 z-30 animate-float-reverse hidden sm:flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-slate-900/90 border border-slate-700/80 shadow-[0_15px_35px_rgba(0,0,0,0.6)] backdrop-blur-xl">
              <div className="w-7 h-7 rounded-lg bg-blue-950 text-blue-400 flex items-center justify-center font-mono font-bold text-xs">
                <Clock className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="font-heading font-bold text-white text-xs">Chrono : 48 sec</div>
                <div className="font-mono text-[10px] text-blue-400 font-semibold">Devis prêt à signer</div>
              </div>
            </div>

            {/* 3D Floating Element #3: Bottom-Left Haptic Signature Pill */}
            <div className="absolute -left-4 sm:-left-10 bottom-20 z-30 animate-float-reverse hidden sm:flex items-center gap-2.5 p-3 rounded-2xl bg-slate-900/90 border border-blue-500/30 shadow-[0_20px_40px_rgba(0,0,0,0.7)] backdrop-blur-xl">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-slate-800 text-white flex items-center justify-center">
                <PenTool className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="font-heading font-bold text-xs text-white">Signature tactile</div>
                <div className="font-mono text-[10px] text-slate-400">Valeur juridique eIDAS</div>
              </div>
            </div>

            {/* 3D Floating Element #4: Bottom-Right Early Bird Voucher Pill */}
            <div className="absolute -right-4 sm:-right-10 bottom-8 z-30 animate-float-slow hidden sm:flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl bg-gradient-to-br from-blue-950 to-slate-900 border border-blue-500/40 shadow-[0_20px_40px_rgba(37,99,235,0.25)] backdrop-blur-xl">
              <span className="font-mono font-extrabold text-blue-300 text-xs">-50% À VIE</span>
              <span className="text-[11px] text-slate-300 font-heading font-semibold">9,50 € / mois</span>
            </div>

            {/* The 3D Asymmetric Device Frame with Isometric Rotation on desktop, pristine crisp on mobile */}
            <div className="relative w-full max-w-[310px] xs:max-w-[340px] sm:max-w-[370px] transform transition-transform duration-500 hover:rotate-0 sm:rotate-y-[-4deg] sm:rotate-x-[3deg] sm:preserve-3d">
              
              {/* Backlight halo glow */}
              <div className="absolute -inset-4 bg-gradient-to-tr from-blue-600/30 via-slate-600/20 to-blue-400/20 rounded-[52px] blur-2xl -z-10 opacity-80" />

              {/* Smartphone Shell (Titanium & Slate border with 3D bevels) */}
              <div className="relative rounded-[46px] p-3 sm:p-3.5 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 shadow-[0_30px_70px_rgba(0,0,0,0.85)] ring-1 ring-white/10 border-4 border-slate-800">
                
                {/* Dynamic Notch */}
                <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-40 flex items-center justify-between px-3">
                  <span className="w-2 h-2 rounded-full bg-blue-950" />
                  <span className="w-2 h-2 rounded-full bg-slate-900 border border-slate-800" />
                </div>

                {/* Smartphone Screen Canvas */}
                <div className="relative rounded-[34px] overflow-hidden bg-white text-slate-900 flex flex-col h-[525px] sm:h-[590px] border border-slate-200">
                  
                  {/* Status Bar */}
                  <div className="pt-3 px-6 pb-2 flex items-center justify-between text-xs font-semibold text-slate-800 bg-slate-50 border-b border-slate-100 font-mono">
                    <span className="text-[11px] font-bold">09:41</span>
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <span className="text-[9px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.5 rounded">4G CHANTIER</span>
                      <Wifi className="w-3.5 h-3.5" />
                      <Battery className="w-4 h-4 text-slate-800" />
                    </div>
                  </div>

                  {/* App Navigation */}
                  <div className="bg-white px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-blue-600 text-white font-heading font-black text-xs flex items-center justify-center">
                        BD
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 font-mono">
                          DEV-2026-084
                        </div>
                        <div className="text-[10px] text-slate-500 font-sans">M. Marc Dupont</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200">
                      CONFORME 2026
                    </span>
                  </div>

                  {/* Document Body */}
                  <div className="flex-1 overflow-y-auto p-3.5 space-y-2.5 text-left font-sans">
                    
                    {/* Client info */}
                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/80 text-[11px]">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-heading font-bold text-slate-900">M. Marc Dupont</div>
                          <div className="text-slate-500 text-[10px]">14 Rue des Lilas, 69003 Lyon</div>
                        </div>
                        <span className="font-mono text-[9px] text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded font-semibold">
                          Particulier
                        </span>
                      </div>
                    </div>

                    {/* Prestations */}
                    <div className="bg-white rounded-xl p-3 border border-slate-200 shadow-2xs space-y-2 text-[11px]">
                      <div className="flex justify-between font-mono font-bold text-slate-700 pb-1 border-b border-slate-100 text-[10px] uppercase">
                        <span>Prestation & Matériel</span>
                        <span>Montant HT</span>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-semibold text-slate-900">Chauffe-eau 200L Thermodynamique</div>
                            <div className="text-[10px] text-slate-500">Fourniture avec raccords isolés & groupe</div>
                          </div>
                          <div className="font-mono font-bold text-slate-900 whitespace-nowrap">1 420,00 €</div>
                        </div>

                        <div className="flex justify-between items-start pt-1.5 border-t border-slate-100">
                          <div>
                            <div className="font-semibold text-slate-900">Pose & raccordements cuivre</div>
                            <div className="text-[10px] text-slate-500">Main d'œuvre qualifiée (4h)</div>
                          </div>
                          <div className="font-mono font-bold text-slate-900 whitespace-nowrap">380,00 €</div>
                        </div>

                        <div className="flex justify-between items-start pt-1.5 border-t border-slate-100">
                          <div>
                            <div className="font-semibold text-slate-900">Évacuation déchets & recyclage</div>
                            <div className="text-[10px] text-blue-700 font-mono">Bordereau BSD inclus</div>
                          </div>
                          <div className="font-mono font-bold text-slate-900 whitespace-nowrap">65,00 €</div>
                        </div>
                      </div>
                    </div>

                    {/* Calculation Box */}
                    <div className="bg-slate-900 text-white rounded-xl p-3 space-y-1 text-[11px]">
                      <div className="flex justify-between text-slate-400">
                        <span>Total Brut HT :</span>
                        <span className="font-mono text-white">1 865,00 €</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>TVA Rénovation (10%) :</span>
                        <span className="font-mono text-white">186,50 €</span>
                      </div>
                      <div className="flex justify-between text-xs font-bold text-white pt-1.5 border-t border-slate-800">
                        <span>NET À PAYER TTC :</span>
                        <span className="font-mono text-blue-400 text-sm font-extrabold">2 051,50 €</span>
                      </div>
                    </div>

                    {/* Interactive Signature Area */}
                    <div className="bg-white rounded-xl p-2.5 border border-slate-200">
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className="font-heading font-bold text-slate-800 flex items-center gap-1">
                          <PenTool className="w-3 h-3 text-blue-600" /> Signature client
                        </span>
                        <span className="text-[10px] text-blue-600 font-mono">Sur écran</span>
                      </div>

                      <div
                        onClick={handleDeviceSign}
                        className={`h-12 rounded-lg border-2 border-dashed flex items-center justify-center cursor-pointer transition-all ${
                          deviceSigned
                            ? 'border-blue-500 bg-blue-50 text-blue-900'
                            : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-500'
                        }`}
                      >
                        {deviceSigned ? (
                          <div className="flex items-center gap-1.5 text-xs font-bold font-serif italic text-blue-950">
                            <Check className="w-3.5 h-3.5 text-blue-600" /> "Bon pour accord - M. Dupont"
                          </div>
                        ) : (
                          <div className="text-[10px] font-medium flex items-center gap-1 text-slate-500">
                            <span>👉 Touchez pour tester la signature</span>
                          </div>
                        )}
                      </div>
                    </div>

                  </div>

                  {/* Bottom Action inside phone */}
                  <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center gap-2">
                    <button
                      onClick={handleDeviceSend}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-heading font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md shadow-blue-600/25 active:scale-95 transition-all cursor-pointer"
                    >
                      {deviceSent ? (
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
                      className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:text-blue-600 transition-colors cursor-pointer"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
