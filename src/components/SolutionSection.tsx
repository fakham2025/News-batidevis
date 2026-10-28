import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Check, 
  ArrowRight, 
  WifiOff, 
  Wifi, 
  ShieldCheck, 
  Send, 
  Lock,
  PlusCircle,
  Receipt,
  UserCheck,
  FileCheck2,
  Sparkles
} from 'lucide-react';

interface SolutionSectionProps {
  onOpenDemo: () => void;
  onScrollToWaitlist: () => void;
}

export function SolutionSection({ onOpenDemo, onScrollToWaitlist }: SolutionSectionProps) {
  const [isOffline, setIsOffline] = useState(true);

  return (
    <section id="solution" className="py-14 sm:py-28 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-32">
        
        {/* Section Header (2026 Minimalist Header) */}
        <div className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-50 border border-blue-200 text-blue-700 font-mono text-xs font-semibold tracking-wider uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
            <span>[ 02 // LA SOLUTION ARTISAN 2026 ]</span>
          </div>

          <h2 className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-[-0.03em]">
            De la prise de cotes à la facture de solde
          </h2>

          <p className="text-sm sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Chiffrez en 60s avec vos kits métiers, faites signer en direct ou par lien WhatsApp, et convertissez en factures d'acompte (30%) et de solde en 1 clic.
          </p>
        </div>

        {/* Feature 1: Mobile-first & Kits Métiers */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
          <div className="lg:col-span-6 space-y-5 text-left order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 font-mono text-xs font-bold text-emerald-600 uppercase tracking-widest">
              <span>01. CHIFFRAGE EXPRESS & KITS MÉTIERS</span>
            </div>
            
            <h3 className="text-xl xs:text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
              Mode libre immédiat & Kits BTP
            </h3>
            
            <p className="text-sm sm:text-lg text-slate-600 leading-relaxed">
              Créez votre devis sans inscription obligatoire. Sélectionnez votre corps d'état et chargez en 1 clic des prestations pré-remplies conformes à vos tarifs.
            </p>

            <div className="space-y-3 pt-2 text-sm text-slate-700">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span><strong>5 kits métiers intégrés :</strong> Plomberie-chauffage, Électricité générale, Peinture & sols, Menuiserie-isolation, Maçonnerie & gros œuvre.</span>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span><strong>Zéro friction d'inscription :</strong> Démarrez le chiffrage immédiatement. Votre compte est créé en 3 champs quand vous êtes prêt à l'envoyer.</span>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span><strong>100% Hors-ligne :</strong> Fonctionne en sous-sol ou sans réseau 4G. Sauvegarde locale persistante sans perte de données.</span>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap gap-3">
              <Link
                to="/creer-devis"
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow-md shadow-emerald-600/25 transition-all flex items-center gap-2 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Créer mon devis en 60s (Gratuit)</span>
              </Link>
              <button
                onClick={onOpenDemo}
                className="px-4 py-2.5 rounded-xl border border-slate-300 hover:border-slate-400 text-slate-700 text-sm font-medium transition-all"
              >
                Voir la démo
              </button>
            </div>
          </div>

          {/* Interactive Offline Tech Card */}
          <div className="lg:col-span-6 order-1 lg:order-2">
            <div className="bg-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-800 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-transparent" />

              <div className="flex items-center justify-between pb-5 border-b border-slate-800">
                <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>STUDIO DEVIS // LOCAL CACHE REACTIF</span>
                </div>

                <button
                  onClick={() => setIsOffline(!isOffline)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer ${
                    isOffline 
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-700' 
                      : 'bg-slate-800 text-slate-300 border border-slate-700'
                  }`}
                >
                  {isOffline ? <WifiOff className="w-3.5 h-3.5" /> : <Wifi className="w-3.5 h-3.5 text-emerald-400" />}
                  <span>{isOffline ? 'RÉSEAU : 0 BARRE (SOUS-SOL)' : 'RÉSEAU : 4G CONNECTÉ'}</span>
                </button>
              </div>

              <div className="py-6 space-y-4">
                <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400">STATUS DU BROUILLON :</span>
                    <span className="text-emerald-400 font-bold">ENREGISTRÉ EN LOCAL</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Même sans connexion internet, votre devis <strong className="text-white font-mono">#DEV-2026-084</strong> est prêt à être imprimé ou signé directement sur votre smartphone.
                  </p>
                </div>

                <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800 space-y-2.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-mono">Kit Plomberie sélectionné :</span>
                    <span className="text-white font-mono font-bold text-sm">995,00 € HT</span>
                  </div>
                  <div className="text-sm font-semibold text-slate-200">
                    Remplacement chauffe-eau 200L + raccords isolés + groupe de sécurité
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-emerald-500 h-1.5 rounded-full w-full" />
                  </div>
                  <div className="flex justify-between text-[11px] font-mono text-slate-400 pt-1">
                    <span>Ventilation TVA 10% (Rénovation)</span>
                    <span className="text-emerald-400 font-bold">1 094,50 € TTC ✓</span>
                  </div>
                </div>
              </div>

              <div className="text-xs text-slate-500 font-mono flex items-center justify-between pt-2 border-t border-slate-900">
                <span>COMPATIBLE MOBILE, TABLETTE & PC</span>
                <span className="text-slate-400">LATENCE : 0 MS</span>
              </div>
            </div>
          </div>
        </div>

        {/* Feature 2: 100% Conforme 2026 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          <div className="lg:col-span-6">
            <div className="bg-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-800 relative overflow-hidden">
              <div className="flex items-center justify-between pb-5 border-b border-slate-800 mb-5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-mono font-bold text-white">MOTEUR LÉGAL FACTUR-X & DÉCENNALE</div>
                    <div className="text-[10px] text-slate-400">Validation automatique 2026</div>
                  </div>
                </div>
                <span className="font-mono text-xs font-bold text-blue-400 bg-blue-950/80 px-2.5 py-1 rounded-md border border-blue-800/60">
                  16 / 16 MENTIONS
                </span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="flex items-center gap-2.5 text-slate-200">
                    <Check className="w-4 h-4 text-blue-400 shrink-0" />
                    <span>Assurance décennale (Assureur SMABTP/AXA, Police, Zone)</span>
                  </span>
                  <span className="font-mono text-[11px] text-blue-400 font-bold">AUTO</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="flex items-center gap-2.5 text-slate-200">
                    <Check className="w-4 h-4 text-blue-400 shrink-0" />
                    <span>SIRET 14 chiffres + RCS/RM + Code NAF</span>
                  </span>
                  <span className="font-mono text-[11px] text-blue-400 font-bold">AUTO</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="flex items-center gap-2.5 text-slate-200">
                    <Check className="w-4 h-4 text-blue-400 shrink-0" />
                    <span>Ventilation TVA (5,5% énergétique / 10% rénov. / 20%)</span>
                  </span>
                  <span className="font-mono text-[11px] text-blue-400 font-bold">AUTO</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="flex items-center gap-2.5 text-slate-200">
                    <Check className="w-4 h-4 text-blue-400 shrink-0" />
                    <span>Format hybride Factur-X certifié Plateforme PDP 2026</span>
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
              100% conforme Loi 2026
            </h3>
            
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              Toutes les mentions légales obligatoires sont ajoutées automatiquement sans que vous ayez à y penser.
            </p>

            <div className="space-y-3 pt-2 text-sm text-slate-700">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-md bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span><strong>Assurance décennale intégrée :</strong> Nom de la compagnie d'assurance, numéro de police et couverture géographique.</span>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-md bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span><strong>Attestation de TVA réduite :</strong> Taux à 10% (amélioration logement) ou 5,5% (efficacité énergétique).</span>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-md bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span><strong>Paiement sécurisé par virement :</strong> IBAN et conditions de règlement imprimés en bas de chaque pièce.</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onScrollToWaitlist}
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-all shadow-md shadow-blue-600/20 cursor-pointer flex items-center gap-2"
              >
                <span>Bloquer mon tarif VIP 9,50 € / mois à vie</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Feature 3: Signature WhatsApp & Moteur Facture */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          <div className="lg:col-span-6 space-y-6 text-left order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 font-mono text-xs font-bold text-emerald-600 uppercase tracking-widest">
              <span>03. SIGNATURE WHATSAPP & FACTURATION 1-CLIC</span>
            </div>
            
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
              Signature immédiate & Factures automatiques
            </h3>
            
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              Faites signer votre client sur votre écran ou partagez un lien sécurisé par WhatsApp, SMS et Email. Dès accord, convertissez en facture d'acompte (30%) puis en facture de solde.
            </p>

            <div className="space-y-3 pt-2 text-sm text-slate-700">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span><strong>Signature tactile ou lien WhatsApp :</strong> Le client valide directement sur votre téléphone ou ouvre le lien public sur son propre mobile sans créer de compte.</span>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span><strong>Facture d'acompte 30% en 1 clic :</strong> Encaissez vos 30% au démarrage du chantier avec une facture officielle générée instantanément.</span>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span><strong>Facture de solde finale automatique :</strong> L'acompte déjà payé est automatiquement déduit du total TTC avec la mention légale obligatoire (Net à payer 70%).</span>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap gap-3">
              <Link
                to="/app/dashboard"
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm border border-slate-700 shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <UserCheck className="w-4 h-4 text-blue-400" />
                <span>Accéder à l'espace facturation</span>
              </Link>
              <Link
                to="/creer-devis"
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow-md shadow-emerald-600/25 transition-all flex items-center gap-2 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Créer un devis en 60s</span>
              </Link>
            </div>
          </div>

          {/* Visual Card 3: WhatsApp & Facture Flow */}
          <div className="lg:col-span-6 order-1 lg:order-2">
            <div className="bg-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-800 relative overflow-hidden space-y-4">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-blue-500 to-transparent" />

              <div className="flex items-center justify-between text-xs font-mono text-slate-400 pb-3 border-b border-slate-800">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>TRANSMISSION MULTICANAL // WHATSAPP, SMS, WEB</span>
                </span>
                <span className="text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/60">
                  SIGNATURE 1-CLIC
                </span>
              </div>

              {/* WhatsApp preview */}
              <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <Send className="w-3.5 h-3.5 text-emerald-400" /> Lien direct WhatsApp client
                  </span>
                  <span className="text-slate-500">Instantané</span>
                </div>
                <div className="bg-emerald-950/60 text-emerald-100 border border-emerald-800/60 rounded-2xl rounded-tl-sm p-3.5 text-xs leading-relaxed font-sans">
                  Bonjour M. Dupont, voici votre devis <strong className="text-white">DEV-2026-084</strong> (1 094,50 € TTC). Vous pouvez le consulter et le signer en un clic ici : <span className="text-emerald-300 font-mono underline font-bold">batidevis.fr/valider/tok_xyz98</span>
                </div>
              </div>

              {/* Invoice Conversion Flow Card */}
              <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white flex items-center gap-2">
                    <Receipt className="w-4 h-4 text-blue-400" />
                    <span>Facturation automatique du chantier</span>
                  </span>
                  <span className="font-mono text-xs text-emerald-400 font-bold">1-CLIC</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 space-y-1">
                    <div className="text-[10px] text-slate-400 font-mono">1. FACTURE D'ACOMPTE</div>
                    <div className="font-bold text-blue-400 font-mono">328,35 € TTC</div>
                    <div className="text-[10px] text-slate-500">30% au démarrage</div>
                  </div>

                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 space-y-1">
                    <div className="text-[10px] text-slate-400 font-mono">2. FACTURE DE SOLDE</div>
                    <div className="font-bold text-emerald-400 font-mono">766,15 € TTC</div>
                    <div className="text-[10px] text-slate-500">Acompte déduit (70%)</div>
                  </div>
                </div>
              </div>

              <div className="pt-2 text-center text-xs font-mono text-slate-400 flex items-center justify-center gap-2 border-t border-slate-900">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Mentions d'acompte légalement reportées selon le Code de Commerce</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
