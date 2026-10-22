/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { 
  ArrowLeft, 
  Check, 
  X, 
  ShieldCheck, 
  Sparkles, 
  Lock, 
  AlertTriangle,
  ArrowRight,
  ChevronRight,
  Building2,
  FileText
} from 'lucide-react';
import { COMPARATIFS, ComparatifData } from '../data/comparatifs';
import { WaitlistFormSection } from './WaitlistFormSection';

interface ComparatifPageViewProps {
  slug: string;
  onBackToHome: () => void;
  onNavigateToSlug: (slug: string) => void;
  token?: string | null;
  onOpenPrivacy?: () => void;
}

export function ComparatifPageView({
  slug,
  onBackToHome,
  onNavigateToSlug,
  token,
  onOpenPrivacy
}: ComparatifPageViewProps) {
  const data: ComparatifData | undefined = COMPARATIFS[slug];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (data) {
      document.title = `${data.title} | BâtiDevis`;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', data.meta_description);
      }
    }
  }, [slug, data]);

  if (!data) {
    return (
      <div className="min-h-screen bg-white py-24 px-4 text-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-4">Page de comparatif introuvable</h1>
        <p className="text-slate-600 mb-6">Le comparatif demandé n'existe pas ou a été déplacé.</p>
        <button
          onClick={onBackToHome}
          className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-bold cursor-pointer"
        >
          Retour à l'accueil
        </button>
      </div>
    );
  }

  // Schema.org JSON-LD Article + FAQPage
  const jsonLdArticle = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    'headline': data.h1,
    'description': data.meta_description,
    'datePublished': data.publishedDate,
    'dateModified': data.modifiedDate,
    'mainEntityOfPage': data.canonical,
    'author': {
      '@type': 'Organization',
      'name': 'BâtiDevis',
      'url': 'https://batidevis.fr'
    },
    'publisher': {
      '@type': 'Organization',
      'name': 'BâtiDevis',
      'logo': {
        '@type': 'ImageObject',
        'url': 'https://batidevis.fr/icon.svg'
      }
    }
  };

  const jsonLdFaq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': data.faq.map(item => ({
      '@type': 'Question',
      'name': item.question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': item.answer
      }
    }))
  };

  const allSlugs = Object.keys(COMPARATIFS);
  const otherComparatifs = allSlugs.filter(s => s !== slug);

  return (
    <article className="min-h-screen bg-white text-slate-900 font-sans">
      {/* HTML Commentaire TODO HUMAIN obligatoire */}
      <div dangerouslySetInnerHTML={{ __html: data.todoHumanNotice }} />

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdArticle) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
      />

      {/* Top Breadcrumb & Return Bar */}
      <nav aria-label="Fil d'Ariane" className="border-b border-slate-200 bg-slate-50/80 sticky top-0 z-30 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between text-xs sm:text-sm">
          <ol className="flex items-center gap-1.5 text-slate-500 overflow-x-auto whitespace-nowrap">
            <li>
              <button 
                onClick={onBackToHome}
                className="hover:text-blue-600 transition-colors flex items-center gap-1 font-medium cursor-pointer"
              >
                <span>Accueil</span>
              </button>
            </li>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <li className="text-slate-500 font-medium">Comparatifs</li>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <li aria-current="page" className="text-slate-900 font-bold truncate max-w-[200px] sm:max-w-none">
              {data.concurrentName}
            </li>
          </ol>

          <button
            onClick={onBackToHome}
            className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors cursor-pointer shrink-0 ml-3"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Retour à l'accueil</span>
          </button>
        </div>
      </nav>

      {/* Header Container */}
      <header className="bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 text-white py-14 sm:py-20 border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 font-mono text-xs font-bold uppercase tracking-wider">
            <span>⚖️ Comparatif Indépendant 2026</span>
          </div>

          {/* Unique H1 */}
          <h1 className="font-heading text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-[-0.03em] leading-tight">
            {data.h1}
          </h1>

          {/* Lead Paragraph */}
          <p className="text-sm sm:text-lg text-slate-300 leading-relaxed max-w-3xl mx-auto font-sans">
            {data.intro}
          </p>

          {/* Tags */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
            {data.mots_cles.map((kw, idx) => (
              <span key={idx} className="text-[11px] font-mono px-2.5 py-0.5 rounded-md bg-slate-800/80 text-slate-400 border border-slate-700/60">
                #{kw}
              </span>
            ))}
          </div>
        </div>
      </header>

      {/* Main Editorial Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-12 sm:space-y-16">
        
        {/* Ordered H2 Sections */}
        {data.sections.map((sec, idx) => (
          <section key={idx} className="space-y-4">
            <h2 className="font-heading text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3 border-b border-slate-100 pb-3">
              <span className="text-blue-600 font-mono text-base font-bold">0{idx + 1}.</span>
              <span>{sec.h2}</span>
            </h2>

            <div className="space-y-4 text-slate-700 leading-relaxed text-sm sm:text-base font-sans">
              {sec.content.map((p, pIdx) => (
                <p key={pIdx} className="leading-relaxed">
                  {p}
                </p>
              ))}
            </div>

            {/* If section 3, display the Comparison Table right under Section 3 */}
            {idx === 2 && (
              <div className="pt-6">
                <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  <span>Tableau comparatif détaillé case par case</span>
                </div>

                {data.multiActorTableData ? (
                  /* Multi-actor 4-col table */
                  <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm bg-white">
                    <table className="w-full text-left border-collapse text-xs sm:text-sm">
                      <thead>
                        <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-800 font-heading">
                          <th className="py-3 px-3 sm:px-4 font-bold">Critère d'analyse</th>
                          <th className="py-3 px-3 font-semibold text-slate-600">Quotepro</th>
                          <th className="py-3 px-3 font-semibold text-slate-600">Estimapro</th>
                          <th className="py-3 px-3 font-semibold text-slate-600">Turbotravaux</th>
                          <th className="py-3 px-3 sm:px-4 font-bold text-blue-700 bg-blue-50/80">BATIDEVIS</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {data.multiActorTableData.map((row, rIdx) => (
                          <tr key={rIdx} className={rIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                            <td className="py-3 px-3 sm:px-4 font-medium text-slate-900">{row.critere}</td>
                            <td className="py-3 px-3 text-slate-600">{row.quotepro}</td>
                            <td className="py-3 px-3 text-slate-600">{row.estimapro}</td>
                            <td className="py-3 px-3 text-slate-600">{row.turbotravaux}</td>
                            <td className="py-3 px-3 sm:px-4 font-semibold text-blue-900 bg-blue-50/50">{row.batidevis}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  /* Standard 3-col honest table */
                  <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm bg-white">
                    <table className="w-full text-left border-collapse text-xs sm:text-sm">
                      <thead>
                        <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-800 font-heading">
                          <th className="py-3.5 px-4 font-bold">Critère métier</th>
                          <th className="py-3.5 px-4 font-semibold text-slate-600">{data.concurrentName}</th>
                          <th className="py-3.5 px-4 font-bold text-blue-700 bg-blue-50/80">BATIDEVIS</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {data.tableData.map((row, rIdx) => (
                          <tr key={rIdx} className={rIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                            <td className="py-3.5 px-4 font-medium text-slate-900">{row.critere}</td>
                            <td className="py-3.5 px-4 text-slate-600">{row.concurrent}</td>
                            <td className="py-3.5 px-4 font-semibold text-blue-900 bg-blue-50/50">{row.batidevis}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                <p className="text-[11px] text-slate-400 mt-2 font-sans italic">
                  * Données indicatives recueillies auprès des retours terrain et informations publiques. Placeholders [[...]] vérifiables avant engagement.
                </p>
              </div>
            )}
          </section>
        ))}

        {/* Nuanced Verdict Box */}
        <section className="bg-slate-900 text-white rounded-3xl p-6 sm:p-9 border border-slate-800 space-y-6">
          <div className="flex items-center gap-2.5 text-blue-400 font-mono text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Synthèse & Recommandation objective</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1">
            <div className="bg-slate-950/80 rounded-2xl p-5 border border-slate-800/80 space-y-2">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <span>Quand choisir {data.concurrentName} ?</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                {data.verdict.pourQuiConcurrent}
              </p>
            </div>

            <div className="bg-blue-950/40 rounded-2xl p-5 border border-blue-800/60 space-y-2">
              <h3 className="font-bold text-blue-200 text-base flex items-center gap-2">
                <span>Quand choisir BATIDEVIS ?</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                {data.verdict.pourQuiBatidevis}
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800 text-center">
            <p className="text-sm font-semibold text-slate-200 font-sans">
              💡 {data.verdict.conclusion}
            </p>
          </div>
        </section>

        {/* FAQ Section */}
        {data.faq.length > 0 && (
          <section className="space-y-4 pt-4">
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-slate-900">
              Questions fréquentes sur ce comparatif
            </h2>
            <div className="space-y-3">
              {data.faq.map((item, fIdx) => (
                <div key={fIdx} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5">
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base mb-1.5">
                    {item.question}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Other Comparatifs Internal Links (Mesh SEO) */}
        <section className="pt-6 border-t border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
              Autres comparatifs logiciels devis 2026
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {otherComparatifs.map(otherSlug => {
              const other = COMPARATIFS[otherSlug];
              return (
                <button
                  key={otherSlug}
                  onClick={() => onNavigateToSlug(otherSlug)}
                  className="p-3.5 rounded-xl border border-slate-200 hover:border-blue-500 bg-white hover:bg-blue-50/30 text-left transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <span className="font-bold text-xs text-slate-900 group-hover:text-blue-600 transition-colors">
                    vs {other.concurrentName}
                  </span>
                  <span className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                    {other.title}
                  </span>
                  <span className="text-[11px] font-mono text-blue-600 mt-2 flex items-center gap-1 font-semibold">
                    Lire le comparatif <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
              );
            })}
          </div>
        </section>

      </main>

      {/* Final Call to Action : Exact Waitlist Form Section with Dual Offer */}
      <section id="waitlist" className="bg-slate-50 border-t border-slate-200 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 font-mono text-xs font-bold mb-2">
            Rejoindre les artisans qui ont choisi BATIDEVIS
          </div>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900">
            Testez BATIDEVIS sans engagement sur vos prochains devis
          </h2>
        </div>

        <WaitlistFormSection
          token={token}
          onOpenPrivacy={onOpenPrivacy}
        />
      </section>
    </article>
  );
}
