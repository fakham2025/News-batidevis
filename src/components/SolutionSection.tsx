/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

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
  Lock,
  MessageCircle,
  Mail,
  Clock
} from 'lucide-react';
import { KitsChantierFeature } from './KitsChantierFeature';
import { Kit } from '../services/db';

interface SolutionSectionProps {
  onOpenDemo: () => void;
  onScrollToWaitlist: () => void;
  onOpenDevisBuilder?: (kit?: Kit) => void;
}

export function SolutionSection({ onOpenDemo, onScrollToWaitlist, onOpenDevisBuilder }: SolutionSectionProps) {
  const [isOffline, setIsOffline] = useState(true);

  return (
    <section id="solution" className="py-14 sm:py-28 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-28">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-50 border border-blue-200 text-blue-700 font-mono text-xs font-semibold tracking-wider uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
            <span>[ 02 // L'OUTIL ARTISAN 2026 ]</span>
          </div>

          <h2 className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-[-0.03em]">
            Générez des devis conformes en 60 secondes
          </h2>

          <p className="text-sm sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto font-sans">
            Conçu pour le camion et le chantier des professionnels du bâtiment, pas pour les secrétaires de bureau.
          </p>
        </div>

        {/* Feature 1: Mobile-first & Offline */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
          <div className="lg:col-span-6 space-y-5 text-left order-1 lg:order-1">
            <div className="inline-flex items-center gap-2 font-mono text-xs font-bold text-blue-600 uppercase tracking-widest">
              <span>01. MOBILITÉ TOTALE & HORS-LIGNE</span>
            </div>
            
            <h3 className="text-xl xs:text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
              Mobile-first sur vos chantiers
            </h3>
            
            <p className="text-sm sm:text-lg text-slate-600 leading-relaxed font-sans">
              Créez vos devis directement chez le client, même dans une cave ou en rase campagne sans aucune connexion internet. Synchronisation automatique dès le retour du réseau 4G.
            </p>

            {/* Bullet points with V2 badge & 3-clics */}
            <div className="space-y-3 pt-2 text-sm text-slate-700 font-sans">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-md bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span><strong>100% Hors-ligne :</strong> Vos devis et tarifs sont stockés en mémoire locale chiffrée sur votre téléphone.</span>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-md bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span><strong>Saisie ultra-rapide en 3 clics :</strong> Ajoutez une prestation complète sans devoir taper tout le texte à la main.</span>
                  <div className="mt-1 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-300 text-slate-700 font-mono text-[10px] font-bold">
                    <span>🎙️ V2 en préparation : dictez vos devis à voix haute</span>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-md bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span><strong>Catalogue d'articles & forfaits favoris :</strong> Enregistrez vos prix de fournitures habituels.</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={onOpenDemo}
                className="px-5 py-2.5 rounded-xl border border-slate-300 hover:border-blue-600 text-slate-800 hover:text-blue-600 font-semibold text-sm transition-all flex items-center gap-2 cursor-pointer min-h-[44px]"
              >
                <span>Voir le test hors-ligne en vidéo</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Interactive Offline Tech HUD Card */}
          <div className="lg:col-span-6 order-2 lg:order-2">
            <div className="bg-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-800 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-blue-400 to-transparent" />

              <div className="flex items-center justify-between pb-5 border-b border-slate-800">
                <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                  <span>TERMINAL CHANTIER // STOCKAGE LOCAL</span>
                </div>

                <button
                  type="button"
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

              <div className="py-6 space-y-4 text-left">
                <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400">STATUS DU DEVIS :</span>
                    <span className="text-blue-400 font-bold">PRÊT EN LOCAL (INDEXEDDB)</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    Le devis <strong className="text-white font-mono">#DEV-2026-084</strong> est immédiatement modifiable et consultable sans aucun accès web requis.
                  </p>
                </div>

                <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800 space-y-2.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-mono">Saisi en 3 clics :</span>
                    <span className="text-white font-mono font-bold text-sm">1 865,00 € HT</span>
                  </div>
                  <div className="text-sm font-semibold text-slate-200 font-sans">
                    Remplacement chauffe-eau thermodynamique + raccordements
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-blue-500 h-1.5 rounded-full w-full" />
                  </div>
                  <div className="flex justify-between text-[11px] font-mono text-slate-400 pt-1">
                    <span>Synchronisation cloud automatique</span>
                    <span className="text-blue-400 font-bold">Instantanée ✓</span>
                  </div>
                </div>
              </div>

              <div className="text-xs text-slate-500 font-mono flex items-center justify-between pt-2 border-t border-slate-900">
                <span>INDEXEDDB NATIVE</span>
                <span className="text-slate-400">LATENCE : 0 MS</span>
              </div>
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* NOUVEAU BLOC : KITS CHANTIER & CALCULATEUR (Checklist §6)         */}
        {/* ================================================================= */}
        <KitsChantierFeature
          onOpenDevisBuilder={onOpenDevisBuilder}
          onScrollToWaitlist={onScrollToWaitlist}
        />

        {/* Feature 2: 100% Conforme 2026 & Prêt pour 2027 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          <div className="lg:col-span-6 order-2 lg:order-1">
            <div className="bg-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-800 relative overflow-hidden">
              <div className="flex items-center justify-between pb-5 border-b border-slate-800 mb-5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-mono font-bold text-white">MOTEUR LÉGAL 2026 // ARTISAN FR</div>
                    <div className="text-[10px] text-slate-400">Conformité réglementaire absolue</div>
                  </div>
                </div>
                <span className="font-mono text-xs font-bold text-blue-400 bg-blue-950/80 px-2.5 py-1 rounded-md border border-blue-800/60">
                  16 / 16 VALIDES
                </span>
              </div>

              <div className="space-y-2.5 text-xs text-left font-sans">
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="flex items-center gap-2.5 text-slate-200">
                    <Check className="w-4 h-4 text-blue-400 shrink-0" />
                    <span>Assurance décennale obligatoire & zone de couverture</span>
                  </span>
                  <span className="font-mono text-[11px] text-blue-400 font-bold">AUTO</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="flex items-center gap-2.5 text-slate-200">
                    <Check className="w-4 h-4 text-blue-400 shrink-0" />
                    <span>SIRET + Chambre des Métiers + Mention Art. 293 B ou TVA</span>
                  </span>
                  <span className="font-mono text-[11px] text-blue-400 font-bold">AUTO</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="flex items-center gap-2.5 text-slate-200">
                    <Check className="w-4 h-4 text-blue-400 shrink-0" />
                    <span>Ventilation TVA (10% Rénovation / 5,5% Énergie / 20%)</span>
                  </span>
                  <span className="font-mono text-[11px] text-blue-400 font-bold">AUTO</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="flex items-center gap-2.5 text-slate-200">
                    <Check className="w-4 h-4 text-blue-400 shrink-0" />
                    <span>Prêt pour 2027 : export Factur-X en V1.1 (calendrier TPE)</span>
                  </span>
                  <span className="font-mono text-[11px] text-blue-400 font-bold">V1.1</span>
                </div>
              </div>

              <div className="mt-5 p-3.5 rounded-xl bg-blue-950/40 border border-blue-900/60 text-xs text-slate-300 flex items-center gap-2.5 text-left font-sans">
                <Lock className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Protection juridique totale en cas de contrôle URSSAF ou DGCCRF.</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6 text-left order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 font-mono text-xs font-bold text-blue-600 uppercase tracking-widest">
              <span>02. SÉCURITÉ JURIDIQUE & FISCALE</span>
            </div>
            
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
              100% conforme 2026
            </h3>
            
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-sans">
              Toutes les mentions légales (TVA, assurance décennale, médiation, mentions déchets 7 flux) sont verrouillées automatiquement. Zéro risque de nullité du devis.
            </p>

            <div className="space-y-3 pt-2 text-sm text-slate-700 font-sans">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-md bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span><strong>Assurance décennale obligatoire :</strong> Police et coordonnées assureur inscrites dès la création.</span>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-md bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span><strong>Attestation de TVA réduite :</strong> Taux à 10% (rénovation) ou 5,5% avec clauses légales conformes.</span>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-md bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span><strong>Calendrier officiel facturation :</strong> Réception obligatoire 2026 et émission TPE/micro-entreprises prête pour septembre 2027 via l'export Factur-X en V1.1.</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={onScrollToWaitlist}
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-all shadow-md shadow-blue-600/20 cursor-pointer flex items-center gap-2 min-h-[44px]"
              >
                <span>Bloquer mon tarif -50% à vie</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Feature 3: Envoi immédiat WhatsApp & Email */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          <div className="lg:col-span-6 space-y-6 text-left order-1 lg:order-1">
            <div className="inline-flex items-center gap-2 font-mono text-xs font-bold text-blue-600 uppercase tracking-widest">
              <span>03. SIGNATURE & TRANSMISSION RAPIDE</span>
            </div>
            
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
              Partage WhatsApp & Email direct
            </h3>
            
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-sans">
              Vos clients reçoivent le devis immédiatement par WhatsApp ou Email avec un lien de signature électronique horodatée en 1 clic.
            </p>

            <div className="space-y-3 pt-2 text-sm text-slate-700 font-sans">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-md bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span><strong>Partage WhatsApp natif :</strong> 98% de taux d'ouverture immédiat sans intermédiaire ni frais de SMS surtaxé.</span>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-md bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span><strong>Acceptation électronique tracée et horodatée :</strong> Signature tactile sur smartphone ou lien web opposable en cas de contestation.</span>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-md bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div className="flex items-center gap-2">
                  <span><strong>Acompte 30% en ligne</strong></span>
                  <span className="font-mono text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    Badge à venir V1.1
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={onOpenDemo}
                className="px-5 py-2.5 rounded-xl border border-slate-300 hover:border-blue-600 text-slate-800 hover:text-blue-600 font-semibold text-sm transition-all flex items-center gap-2 cursor-pointer min-h-[44px]"
              >
                <span>Voir la signature en direct</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Visual Card 3: WhatsApp & Signature HUD */}
          <div className="lg:col-span-6 order-2 lg:order-2">
            <div className="bg-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-800 relative overflow-hidden space-y-4">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-blue-400 to-transparent" />

              <div className="flex items-center justify-between text-xs font-mono text-slate-400 pb-3 border-b border-slate-800">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                  <span>TRANSMISSION CLIENT // MULTI-CANAL</span>
                </span>
                <span className="text-blue-400 font-bold bg-blue-950/80 px-2 py-0.5 rounded border border-blue-800/60">
                  INSTANTANÉ
                </span>
              </div>

              {/* WhatsApp preview */}
              <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800 space-y-2 text-left">
                <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-400" /> Partage WhatsApp client
                  </span>
                  <span className="text-slate-500">Envoyé</span>
                </div>
                <div className="bg-emerald-950/40 text-emerald-100 border border-emerald-800/60 rounded-2xl rounded-tl-sm p-3.5 text-xs leading-relaxed font-sans">
                  Bonjour M. Dupont, voici votre devis <strong className="text-white">DEV-2026-084</strong> pour le remplacement du chauffe-eau : <span className="text-emerald-300 font-mono underline font-bold">batidevis.fr/d/78k2</span>. Vous pouvez le signer en 1 clic sur votre écran.
                </div>
              </div>

              {/* Signature status */}
              <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800 space-y-2 text-left">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>Acceptation électronique tracée et horodatée</span>
                  </span>
                  <span className="font-mono text-xs text-blue-400 font-bold">09:42 Horodaté</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  Notification reçue dans votre camionnette : le chantier est officiellement validé avant même de quitter le domicile du client.
                </p>
              </div>

              <div className="pt-2 text-center text-xs font-mono text-slate-400 flex items-center justify-center gap-2 border-t border-slate-900">
                <Check className="w-3.5 h-3.5 text-blue-400" />
                <span>Signature le jour même (vs 6 jours par devis postal ou Word)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bandeau Teaser du Cap (Modif 3) */}
        <div className="mt-12 sm:mt-16 pt-8 border-t border-slate-200/80">
          <div 
            onClick={onScrollToWaitlist}
            className="max-w-4xl mx-auto p-4 sm:p-5 rounded-2xl bg-slate-900 text-slate-300 border border-slate-800 shadow-sm cursor-pointer hover:border-slate-700 transition-colors flex items-center justify-center text-center"
          >
            <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
              🔒 <strong>En préparation — Cohorte Fondateurs :</strong> l'acompte plancher calculé automatiquement sur chaque devis, et la relance conforme (intérêts moratoires, indemnité 40 €) en un bouton. Réservé aux 20 premiers.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
