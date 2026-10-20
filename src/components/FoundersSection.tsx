/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Users, Sparkles, Check, Clock, ShieldCheck, MessageSquare, ArrowRight } from 'lucide-react';
import { getFounderCohortStats } from '../services/db';

interface FoundersSectionProps {
  onScrollToWaitlist: () => void;
}

export function FoundersSection({ onScrollToWaitlist }: FoundersSectionProps) {
  const stats = getFounderCohortStats();

  return (
    <section id="temoignages" className="py-16 sm:py-28 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4 mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-50 border border-blue-200 text-blue-700 font-mono text-xs font-semibold tracking-wider uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
            <span>[ 04 // PROGRAMME FONDATEURS 2026 ]</span>
          </div>

          <h2 className="font-heading text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-[-0.03em]">
            Devenez l'un des 20 artisans fondateurs
          </h2>

          <p className="font-sans text-sm sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Pas de faux avis créés de toutes pièces : nous co-construisons BâtiDevis avec une première cohorte restreinte de 20 professionnels du terrain avant le lancement national.
          </p>
        </div>

        {/* Cohort Progress Meter & Quotas Card */}
        <div className="max-w-4xl mx-auto mb-12 bg-slate-950 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl relative overflow-hidden">
          {/* Laser Glow */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-blue-400 to-transparent" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 gap-4">
            <div>
              <span className="text-blue-400 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                <Users className="w-4 h-4" /> Cohorte Bêta 1 : Recrutement en cours
              </span>
              <h3 className="font-heading text-xl sm:text-2xl font-bold text-white mt-1">
                {stats.remainingTotal} places fondateurs restantes sur {stats.maxTotal}
              </h3>
            </div>
            <div className="bg-blue-900/60 border border-blue-700 px-4 py-2 rounded-xl text-left sm:text-right shrink-0">
              <div className="text-[11px] text-blue-300 font-mono uppercase font-semibold">Tarif bloqué garanti</div>
              <div className="font-heading font-extrabold text-white text-lg sm:text-xl text-blue-300">
                9,50 € / mois <span className="text-xs font-normal text-slate-400 font-sans">à vie</span>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="pt-6 pb-4">
            <div className="flex justify-between text-xs font-mono text-slate-400 mb-2">
              <span>Remplissage de la promotion : {stats.totalRegistered} / {stats.maxTotal} artisans</span>
              <span className="text-blue-400 font-bold">{Math.round((stats.totalRegistered / stats.maxTotal) * 100)}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden p-0.5 border border-slate-700">
              <div
                className="bg-gradient-to-r from-blue-600 to-blue-400 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(stats.totalRegistered / stats.maxTotal) * 100}%` }}
              />
            </div>
          </div>

          {/* 4 Métier Quotas (5 per category) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
            {Object.entries(stats.categories).map(([key, cat]) => (
              <div key={key} className="bg-slate-900/90 rounded-2xl p-3.5 border border-slate-800">
                <div className="text-xs font-semibold text-slate-300 truncate mb-1">
                  {cat.name}
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="font-mono text-base font-extrabold text-white">
                    {cat.current} / {cat.max}
                  </span>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                    cat.remaining > 0 ? 'bg-blue-950 text-blue-400 border border-blue-800/60' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {cat.remaining > 0 ? `${cat.remaining} restante(s)` : 'Complet'}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-5 mt-5 border-t border-slate-900 text-xs text-slate-400 font-sans flex items-center justify-between flex-wrap gap-2">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-blue-400" />
              Lancement de la cohorte bêta fermée : <strong>17 Novembre 2026</strong>
            </span>
            <span className="text-slate-500">
              Activation manuelle de chaque artisan par l'équipe
            </span>
          </div>
        </div>

        {/* The 3 Concrete Commitments */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
          {/* Card 1 */}
          <div className="p-7 rounded-3xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:shadow-xl hover:border-blue-300 transition-all duration-300 space-y-4 text-left">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-blue-500/20">
              -50%
            </div>
            <h4 className="font-heading font-extrabold text-lg text-slate-900">
              Tarif Fondateur à vie
            </h4>
            <p className="text-sm text-slate-600 leading-relaxed font-sans">
              Votre tarif reste bloqué à <strong>9,50 €/mois</strong> (au lieu de 19 €/mois standard), même lors des futures évolutions de l'outil et de l'intégration Factur-X.
            </p>
            <div className="pt-2 text-xs text-blue-700 font-semibold flex items-center gap-1.5">
              <Check className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Économie de plus de 114 € chaque année</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="p-7 rounded-3xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:shadow-xl hover:border-blue-300 transition-all duration-300 space-y-4 text-left">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 text-blue-400 flex items-center justify-center font-bold text-lg shadow-md">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h4 className="font-heading font-extrabold text-lg text-slate-900">
              Ligne directe WhatsApp avec les créateurs
            </h4>
            <p className="text-sm text-slate-600 leading-relaxed font-sans">
              Un bug sur chantier ? Une fonction manquante pour votre métier spécifique ? Vous écrivez directement aux développeurs, avec réponse garantie en moins de 2h.
            </p>
            <div className="pt-2 text-xs text-blue-700 font-semibold flex items-center gap-1.5">
              <Check className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Priorité absolue sur vos suggestions métier</span>
            </div>
          </div>

          {/* Card 3: The reciprocal agreement */}
          <div className="p-7 rounded-3xl border-2 border-blue-200 bg-blue-50/40 hover:shadow-xl transition-all duration-300 space-y-4 text-left">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-lg">
              <Clock className="w-6 h-6 text-blue-700" />
            </div>
            <h4 className="font-heading font-extrabold text-lg text-slate-900">
              La contrepartie : 15 min de feedback / semaine
            </h4>
            <p className="text-sm text-slate-600 leading-relaxed font-sans">
              En échange de cette gratuité bêta et de ce tarif pionnier, vous vous engagez à tester l'application sur vos vrais chantiers et à nous donner un retour franc chaque semaine.
            </p>
            <div className="pt-2 text-xs text-blue-900 font-semibold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Bêta 100% offerte pendant la période de test</span>
            </div>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="mt-12 text-center">
          <button
            onClick={onScrollToWaitlist}
            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-heading font-bold text-base shadow-lg shadow-blue-600/25 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Postuler pour l'une des 20 places fondateurs</span>
            <ArrowRight className="w-5 h-5" />
          </button>
          <div className="text-xs text-slate-500 mt-3 font-sans">
            Sélection selon votre corps de métier • Inscription sans engagement ni carte bancaire
          </div>
        </div>

      </div>
    </section>
  );
}
