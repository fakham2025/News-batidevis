import { useState } from 'react';
import { Sparkles, ShieldCheck, ArrowRight, Check, X } from 'lucide-react';

interface ComparisonSectionProps {
  onScrollToWaitlist: () => void;
}

export function ComparisonSection({ onScrollToWaitlist }: ComparisonSectionProps) {
  const [mobileTab, setMobileTab] = useState<'ourApp' | 'others'>('ourApp');

  const comparisonRows = [
    {
      feature: "Prise en main",
      others: "❌ Interface complexe, usine à gaz réservée aux secrétaires",
      ourApp: "✅ Simple comme envoyer un SMS, zéro formation requise"
    },
    {
      feature: "Mobilité",
      others: "❌ Desktop uniquement ou appli lourde qui rame sans 5G",
      ourApp: "✅ Mobile-first, conçu pour le chantier, 100% hors-ligne"
    },
    {
      feature: "Conformité légale",
      others: "❌ Mentions à vérifier manuellement, risque d'amendes",
      ourApp: "✅ Conformité automatique 2026 (PDP, Factur-X, 16 mentions)"
    },
    {
      feature: "Prix & Transparence",
      others: "❌ 49€ à 89€/mois + frais cachés par utilisateur",
      ourApp: "✅ 19€/mois tout inclus (9,50€/mois pour la liste d'attente)"
    },
    {
      feature: "Service Client",
      others: "❌ Support lent par ticket, réponses en 48-72h",
      ourApp: "✅ Réponse en < 2h par WhatsApp et téléphone avec un humain"
    }
  ];

  return (
    <section id="comparaison" className="py-16 sm:py-28 bg-slate-50/70 border-b border-slate-200/80 bg-tech-grid">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4 mb-10 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-50 border border-blue-200 text-blue-700 font-mono text-xs font-semibold tracking-wider uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
            <span>[ 03 // ANALYSE COMPARATIVE ]</span>
          </div>

          <h2 className="font-heading text-2xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-[-0.03em]">
            Pourquoi les artisans nous choisissent
          </h2>

          <p className="font-sans text-sm sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Comparez notre approche pensée pour les chantiers face aux logiciels de bureau traditionnels.
          </p>
        </div>

        {/* ============================================================== */}
        {/* MOBILE SPECIFIC UX: Interactive Switcher (Under md breakpoint) */}
        {/* ============================================================== */}
        <div className="md:hidden space-y-4">
          {/* Mobile Segmented Toggle */}
          <div className="grid grid-cols-2 p-1.5 bg-slate-200/80 rounded-2xl gap-1">
            <button
              onClick={() => setMobileTab('ourApp')}
              className={`py-2.5 px-3 rounded-xl font-heading font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${
                mobileTab === 'ourApp'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Notre app (BâtiDevis)</span>
            </button>
            <button
              onClick={() => setMobileTab('others')}
              className={`py-2.5 px-3 rounded-xl font-heading font-semibold text-xs transition-all flex items-center justify-center gap-1.5 ${
                mobileTab === 'others'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Autres logiciels</span>
            </button>
          </div>

          {/* Active Mobile Card */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-lg">
            {mobileTab === 'ourApp' ? (
              <div className="space-y-4">
                <div className="pb-4 border-b border-blue-100 flex items-center justify-between">
                  <div>
                    <span className="font-mono text-[10px] text-blue-600 uppercase font-bold">Nouvelle génération</span>
                    <h3 className="font-heading font-black text-xl text-slate-900 flex items-center gap-1.5">
                      BâtiDevis <ShieldCheck className="w-4 h-4 text-blue-600" />
                    </h3>
                  </div>
                  <span className="bg-blue-50 text-blue-700 font-mono text-[10px] font-bold px-2 py-0.5 rounded border border-blue-200">
                    9,50 € / mois
                  </span>
                </div>

                <div className="divide-y divide-slate-100 space-y-3 font-sans">
                  {comparisonRows.map((row, idx) => (
                    <div key={idx} className="pt-3 first:pt-0 space-y-1">
                      <div className="font-mono text-[11px] font-bold text-blue-800 uppercase tracking-wide">
                        {row.feature}
                      </div>
                      <div className="text-sm font-semibold text-slate-900 leading-snug">
                        {row.ourApp}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <button
                    onClick={onScrollToWaitlist}
                    className="w-full py-3.5 rounded-xl bg-blue-600 active:bg-blue-700 text-white font-heading font-bold text-sm shadow-md shadow-blue-600/25 flex items-center justify-center gap-2"
                  >
                    <span>Profiter de -50% à vie</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="pb-4 border-b border-slate-200">
                  <span className="font-mono text-[10px] text-slate-400 uppercase font-bold">Ancienne méthode</span>
                  <h3 className="font-heading font-bold text-xl text-slate-700">
                    Les autres logiciels
                  </h3>
                  <div className="text-xs text-slate-500 font-sans mt-0.5">Logiciels lourds de comptabilité générale</div>
                </div>

                <div className="divide-y divide-slate-100 space-y-3 font-sans">
                  {comparisonRows.map((row, idx) => (
                    <div key={idx} className="pt-3 first:pt-0 space-y-1">
                      <div className="font-mono text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                        {row.feature}
                      </div>
                      <div className="text-sm text-slate-600 leading-snug">
                        {row.others}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-slate-100 text-center">
                  <button
                    onClick={() => setMobileTab('ourApp')}
                    className="text-xs text-blue-600 font-heading font-bold underline cursor-pointer"
                  >
                    Voir les avantages de BâtiDevis →
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ============================================================== */}
        {/* DESKTOP MATRIX: 2 Columns Side by Side (from md breakpoint) */}
        {/* ============================================================== */}
        <div className="hidden md:block max-w-4xl mx-auto overflow-hidden rounded-3xl border border-slate-200 shadow-xl bg-white">
          <div className="grid grid-cols-2">
            
            {/* Column 1: Other softwares */}
            <div className="bg-slate-50/80 p-7 sm:p-9 border-r border-slate-200 flex flex-col justify-between">
              <div>
                <div className="pb-6 border-b border-slate-200">
                  <div className="font-mono text-xs uppercase font-bold tracking-wider text-slate-400 mb-1">
                    Ancienne méthode
                  </div>
                  <h3 className="font-heading text-2xl font-bold text-slate-700">
                    Les autres logiciels
                  </h3>
                  <p className="font-sans text-xs text-slate-500 mt-1">Logiciels lourds de comptabilité générale</p>
                </div>

                <div className="divide-y divide-slate-200/80 pt-2 font-sans">
                  {comparisonRows.map((row, index) => (
                    <div key={index} className="py-5 space-y-1.5">
                      <div className="font-mono text-xs font-semibold text-slate-400 uppercase tracking-wide">
                        {row.feature}
                      </div>
                      <div className="text-sm sm:text-base font-medium text-slate-600 flex items-start gap-2">
                        <span>{row.others}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-200 text-center text-xs text-slate-400 font-sans">
                Des heures passées le soir au bureau après le travail.
              </div>
            </div>

            {/* Column 2: Our App (Cobalt Blue & Slate unified) */}
            <div className="bg-gradient-to-b from-blue-50/80 via-blue-50/30 to-white p-7 sm:p-9 relative flex flex-col justify-between ring-2 ring-blue-500/30 border-l border-blue-200/60">
              <div className="absolute top-5 right-5 bg-blue-600 text-white text-[11px] font-heading font-extrabold px-3 py-1 rounded-full shadow-md shadow-blue-600/30 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-blue-200" /> Le choix des artisans
              </div>

              <div>
                <div className="pb-6 border-b border-blue-200/80">
                  <div className="font-mono text-xs uppercase font-bold tracking-wider text-blue-600 mb-1">
                    Nouvelle génération
                  </div>
                  <h3 className="font-heading text-2xl font-extrabold text-slate-900 flex items-center gap-2">
                    BâtiDevis <ShieldCheck className="w-5 h-5 text-blue-600" />
                  </h3>
                  <p className="font-sans text-xs text-blue-700 font-semibold mt-1">
                    100% Mobile, pensé pour le chantier et la conformité 2026
                  </p>
                </div>

                <div className="divide-y divide-blue-200/60 pt-2 font-sans">
                  {comparisonRows.map((row, index) => (
                    <div key={index} className="py-5 space-y-1.5">
                      <div className="font-mono text-xs font-bold text-blue-800 uppercase tracking-wide">
                        {row.feature}
                      </div>
                      <div className="text-sm sm:text-base font-bold text-slate-900 flex items-start gap-2">
                        <span>{row.ourApp}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-blue-200">
                <button
                  type="button"
                  onClick={onScrollToWaitlist}
                  className="w-full py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-heading font-bold text-base shadow-md shadow-blue-600/25 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Profiter de l'accès à -50% à vie</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <div className="text-center font-mono text-[11px] text-blue-700 mt-2.5 font-semibold">
                  Soit 9,50€/mois seulement au lieu de 19€
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
