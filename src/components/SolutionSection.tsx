import { useState } from 'react';
import { 
  Smartphone, 
  CheckCircle, 
  Zap, 
  WifiOff, 
  Wifi, 
  ShieldCheck, 
  Send, 
  Check, 
  ArrowRight,
  Sparkles,
  FileCode2,
  Lock
} from 'lucide-react';
import { Button } from './ui/Button';

interface SolutionSectionProps {
  onOpenDemo: () => void;
  onScrollToWaitlist: () => void;
}

export function SolutionSection({ onOpenDemo, onScrollToWaitlist }: SolutionSectionProps) {
  const [isOffline, setIsOffline] = useState(true);
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section id="solution" className="py-14 sm:py-28 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-32">
        
        {/* Section Header (2026 Minimalist Header) */}
        <div className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-50 border border-blue-200 text-blue-700 font-mono text-xs font-semibold tracking-wider uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
            <span>[ 02 // L'OUTIL ARTISAN 2026 ]</span>
          </div>

          <h2 className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-[-0.03em]">
            Générez des devis conformes en 60 secondes
          </h2>

          <p className="text-sm sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Conçu pour les artisans du bâtiment, pas pour les comptables.
          </p>
        </div>

        {/* Feature 1: Mobile-first & Offline */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
          <div className="lg:col-span-6 space-y-5 text-left order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 font-mono text-xs font-bold text-blue-600 uppercase tracking-widest">
              <span>01. MOBILITÉ TOTALE</span>
            </div>
            
            <h3 className="text-xl xs:text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
              Mobile-first
            </h3>
            
            <p className="text-sm sm:text-lg text-slate-600 leading-relaxed">
              Créez vos devis directement sur chantier, même sans connexion internet. Synchronisation automatique au retour.
            </p>

            {/* Bullet points with cohesive styling */}
            <div className="space-y-3 pt-2 text-sm text-slate-700">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-md bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span><strong>Fonctionne en sous-sol ou en rase campagne :</strong> Vos devis s'enregistrent localement sans réseau.</span>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-md bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span><strong>Saisie vocale ou en 3 clics :</strong> Dictez vos lignes de prestations les mains encore poussiéreuses.</span>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-md bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span><strong>Catalogue d'articles sur-mesure :</strong> Enregistrez vos prix et vos fournitures favorites.</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onOpenDemo}
                className="px-5 py-2.5 rounded-xl border border-slate-300 hover:border-blue-600 text-slate-800 hover:text-blue-600 font-semibold text-sm transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Tester le mode chantier</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 2026 Interactive Offline Tech Card (No fake mac buttons, clean architectural HUD) */}
          <div className="lg:col-span-6 order-1 lg:order-2">
            <div className="bg-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-800 relative overflow-hidden">
              {/* Subtle top laser glow */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-blue-400 to-transparent" />

              {/* Header bar of tech terminal */}
              <div className="flex items-center justify-between pb-5 border-b border-slate-800">
                <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                  <span>TERMINAL CHANTIER // LOCAL CACHE</span>
                </div>

                {/* Network toggle button */}
                <button
                  onClick={() => setIsOffline(!isOffline)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer ${
                    isOffline 
                      ? 'bg-blue-900/60 text-blue-300 border border-blue-700' 
                      : 'bg-slate-800 text-slate-300 border border-slate-700'
                  }`}
                >
                  {isOffline ? <WifiOff className="w-3.5 h-3.5" /> : <Wifi className="w-3.5 h-3.5 text-blue-400" />}
                  <span>{isOffline ? 'RÉSEAU : 0 BARRE (SOUS-SOL)' : 'RÉSEAU : 4G CONNECTÉ'}</span>
                </button>
              </div>

              {/* Status display */}
              <div className="py-6 space-y-4">
                <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400">STATUS BUFFER :</span>
                    <span className="text-blue-400 font-bold">100% FONCTIONNEL</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Même sans aucune connexion, le devis <strong className="text-white font-mono">#DEV-2026-084</strong> est instantanément calculé et stocké en mémoire locale chiffrée.
                  </p>
                </div>

                {/* Real-time calculated line item */}
                <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800 space-y-2.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-mono">Ligne ajoutée en 15 sec :</span>
                    <span className="text-white font-mono font-bold text-sm">1 240,00 € HT</span>
                  </div>
                  <div className="text-sm font-semibold text-slate-200">
                    Rénovation tableau électrique 3 rangées + différentiels 30mA
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-blue-500 h-1.5 rounded-full w-full" />
                  </div>
                  <div className="flex justify-between text-[11px] font-mono text-slate-400 pt-1">
                    <span>Synchronisation cloud automatique</span>
                    <span className="text-blue-400 font-bold">Prêt ✓</span>
                  </div>
                </div>
              </div>

              <div className="text-xs text-slate-500 font-mono flex items-center justify-between pt-2 border-t border-slate-900">
                <span>COMPATIBLE IOS & ANDROID</span>
                <span className="text-slate-400">LATENCE : 0 MS</span>
              </div>
            </div>
          </div>
        </div>

        {/* Feature 2: 100% Conforme 2026 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Visual Card 2: 2026 Compliance HUD (Cobalt & Slate) */}
          <div className="lg:col-span-6">
            <div className="bg-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-800 relative overflow-hidden">
              <div className="flex items-center justify-between pb-5 border-b border-slate-800 mb-5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-mono font-bold text-white">MOTEUR LÉGAL FACTUR-X & PDP</div>
                    <div className="text-[10px] text-slate-400">Validation automatique 2026</div>
                  </div>
                </div>
                <span className="font-mono text-xs font-bold text-blue-400 bg-blue-950/80 px-2.5 py-1 rounded-md border border-blue-800/60">
                  16 / 16 VALIDÉES
                </span>
              </div>

              {/* 16 points clean list */}
              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="flex items-center gap-2.5 text-slate-200">
                    <Check className="w-4 h-4 text-blue-400 shrink-0" />
                    <span>Assurance décennale obligatoire & zone géographique</span>
                  </span>
                  <span className="font-mono text-[11px] text-blue-400 font-bold">AUTO</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="flex items-center gap-2.5 text-slate-200">
                    <Check className="w-4 h-4 text-blue-400 shrink-0" />
                    <span>Numéro SIRET + Registre des Métiers + Code NAF</span>
                  </span>
                  <span className="font-mono text-[11px] text-blue-400 font-bold">AUTO</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="flex items-center gap-2.5 text-slate-200">
                    <Check className="w-4 h-4 text-blue-400 shrink-0" />
                    <span>Ventilation TVA (5,5% / 10% / 20%) & Déchets 7 flux</span>
                  </span>
                  <span className="font-mono text-[11px] text-blue-400 font-bold">AUTO</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="flex items-center gap-2.5 text-slate-200">
                    <Check className="w-4 h-4 text-blue-400 shrink-0" />
                    <span>Format hybride Factur-X certifié Plateforme PDP</span>
                  </span>
                  <span className="font-mono text-[11px] text-blue-400 font-bold">CONFORME</span>
                </div>
              </div>

              <div className="mt-5 p-3.5 rounded-xl bg-blue-950/40 border border-blue-900/60 text-xs text-slate-300 flex items-center gap-2.5">
                <Lock className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Protection juridique absolue en cas de contrôle URSSAF ou DGCCRF.</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 font-mono text-xs font-bold text-blue-600 uppercase tracking-widest">
              <span>02. SÉCURITÉ JURIDIQUE</span>
            </div>
            
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
              100% conforme 2026
            </h3>
            
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              Toutes les mentions obligatoires (TVA, assurances, PDP) sont ajoutées automatiquement. Zéro risque.
            </p>

            <div className="space-y-3 pt-2 text-sm text-slate-700">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-md bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span><strong>Assurance décennale intégrée :</strong> Vos coordonnées d'assureur et police sont inscrites automatiquement.</span>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-md bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span><strong>Attestation de TVA réduite :</strong> Taux à 10% (rénovation) ou 5,5% (énergétique) avec validation légale.</span>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-md bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span><strong>Norme PDP & Factur-X :</strong> Vos factures sont prêtes pour la transmission obligatoire à l'État.</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onScrollToWaitlist}
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-all shadow-md shadow-blue-600/20 cursor-pointer flex items-center gap-2"
              >
                <span>Bloquer mon tarif -50% à vie</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Feature 3: Envoi immédiat */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          <div className="lg:col-span-6 space-y-6 text-left order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 font-mono text-xs font-bold text-blue-600 uppercase tracking-widest">
              <span>03. VÉLOCITÉ COMMERCIALE</span>
            </div>
            
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
              Envoi immédiat
            </h3>
            
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              Vos clients reçoivent le devis par SMS et Email avec lien de signature électronique en 1 clic.
            </p>

            <div className="space-y-3 pt-2 text-sm text-slate-700">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-md bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span><strong>Taux d'ouverture SMS 98% :</strong> Le particulier reçoit un lien court sécurisé direct sur son téléphone.</span>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-md bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span><strong>Signature juridique eIDAS :</strong> Signature horodatée sur écran tactile, juridiquement opposable.</span>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-md bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span><strong>Acompte 30% en ligne :</strong> Le client valide et peut régler son acompte immédiatement.</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onOpenDemo}
                className="px-5 py-2.5 rounded-xl border border-slate-300 hover:border-blue-600 text-slate-800 hover:text-blue-600 font-semibold text-sm transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Voir la signature en direct</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Visual Card 3: 2026 SMS & Signature Flow - Unified Dark HUD */}
          <div className="lg:col-span-6 order-1 lg:order-2">
            <div className="bg-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-800 relative overflow-hidden space-y-4">
              {/* Subtle top laser glow */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-blue-400 to-transparent" />

              <div className="flex items-center justify-between text-xs font-mono text-slate-400 pb-3 border-b border-slate-800">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                  <span>DISPATCH MULTI-CANAL // SMS & WEB</span>
                </span>
                <span className="text-blue-400 font-bold bg-blue-950/80 px-2 py-0.5 rounded border border-blue-800/60">
                  TRANSMISSION INSTANTANÉE
                </span>
              </div>

              {/* Modern SMS Preview on dark HUD */}
              <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <Send className="w-3.5 h-3.5 text-blue-400" /> Notification SMS client
                  </span>
                  <span className="text-slate-500">Il y a 10s</span>
                </div>
                <div className="bg-blue-600/20 text-blue-100 border border-blue-500/30 rounded-2xl rounded-tl-sm p-3.5 text-xs leading-relaxed font-sans">
                  Bonjour M. Dupont, voici votre proposition chiffrée pour le chantier : <span className="text-blue-300 font-mono underline font-bold">batidevis.fr/d/78k2</span>. Vous pouvez signer électroniquement en 1 clic.
                </div>
              </div>

              {/* Status Box: Signature confirmed */}
              <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-400" />
                    <span>Devis validé & signé par le client</span>
                  </span>
                  <span className="font-mono text-xs text-blue-400 font-bold">09:42 Horodaté</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  Notification push reçue sur votre téléphone dans le camion : le chantier est officiellement validé avant même d'avoir quitté l'adresse.
                </p>
              </div>

              <div className="pt-2 text-center text-xs font-mono text-slate-400 flex items-center justify-center gap-2 border-t border-slate-900">
                <Check className="w-3.5 h-3.5 text-blue-400" />
                <span>Délai moyen de signature : 3 heures (vs 6 jours par devis papier)</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
