import { Star, Quote, CheckCircle, Wrench, Zap, Hammer } from 'lucide-react';
import { Card } from './ui/Card';

export function TestimonialsSection() {
  const testimonials = [
    {
      initials: "MD",
      name: "Marc D.",
      role: "Plombier Chauffagiste",
      location: "Lyon (69)",
      icon: Wrench,
      quote: "Enfin une app qui comprend que je suis sur un chantier, pas dans un bureau. Je fais mes devis entre deux interventions directement dans le camion.",
      benefit: "Devis signé le jour même"
    },
    {
      initials: "SL",
      name: "Sophie L.",
      role: "Électricienne Bâtiment & Tertiaire",
      location: "Marseille (13)",
      icon: Zap,
      quote: "J'ai gagné 5h par semaine. Et surtout, je ne rate plus aucun chantier à cause de devis envoyés trop tard. Mes clients apprécient la signature par SMS.",
      benefit: "+5 heures libres par semaine"
    },
    {
      initials: "TR",
      name: "Thomas R.",
      role: "Menuisier Agenceur",
      location: "Bordeaux (33)",
      icon: Hammer,
      quote: "La conformité automatique, c'est un soulagement. Je n'ai plus peur des contrôles ni des oublis de décennale. Tout est carré dès la première ligne.",
      benefit: "Sérénité juridique totale"
    }
  ];

  return (
    <section id="temoignages" className="py-14 sm:py-28 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4 mb-10 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-50 border border-blue-200 text-blue-700 font-mono text-xs font-semibold tracking-wider uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
            <span>[ 04 // RETOURS D'EXPÉRIENCE ]</span>
          </div>

          <h2 className="font-heading text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-[-0.03em]">
            Ils testent l'app en avant-première
          </h2>

          <p className="font-sans text-sm sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Découvrez pourquoi les artisans qui ont rejoint les premiers tests ne reviendront jamais en arrière.
          </p>
        </div>

        {/* Testimonials Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-8">
          {testimonials.map((t, index) => {
            return (
              <div
                key={index}
                className="p-6 sm:p-8 flex flex-col justify-between hover:shadow-xl hover:border-blue-400/80 transition-all duration-300 relative bg-white border border-slate-200 rounded-3xl"
              >
                <div>
                  {/* Rating stars & Quote icon */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-1 text-blue-600">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-blue-600" />
                      ))}
                    </div>
                    <Quote className="w-8 h-8 text-slate-200 shrink-0" />
                  </div>

                  {/* Quote text */}
                  <blockquote className="font-sans text-base text-slate-800 font-medium leading-relaxed mb-6 italic">
                    "{t.quote}"
                  </blockquote>
                </div>

                {/* Author Info */}
                <div className="pt-6 border-t border-slate-100 flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-slate-900 text-white font-mono font-extrabold text-sm flex items-center justify-center shrink-0 shadow-sm">
                    {t.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-heading font-bold text-slate-900 text-sm truncate">{t.name}</span>
                      <CheckCircle className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    </div>
                    <div className="font-sans text-xs text-slate-500 truncate">{t.role}</div>
                    <div className="font-sans text-[11px] text-slate-400">{t.location}</div>
                  </div>
                </div>

                {/* Unified Cobalt result pill (no random green) */}
                <div className="mt-5 bg-blue-50/80 text-blue-900 text-xs font-semibold px-3 py-1.5 rounded-xl border border-blue-200/80 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                  <span className="font-sans">Résultat : <strong>{t.benefit}</strong></span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Trust badge footer */}
        <div className="mt-14 text-center font-sans text-xs text-slate-500">
          <strong className="text-slate-800 font-heading">Note moyenne 4.9/5</strong> basée sur 247 retours d'artisans en phase de pré-lancement.
        </div>

      </div>
    </section>
  );
}
