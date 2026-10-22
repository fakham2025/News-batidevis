import { Clock, AlertTriangle, TrendingDown, ArrowDownRight, Wallet } from 'lucide-react';

export function ProblemSection() {
  const problems = [
    {
      code: "01 // TEMPS",
      icon: Clock,
      title: "2h perdues chaque soir",
      description: "Vous bricolez encore vos devis sur Word ou Excel, en espérant ne rien oublier.",
      metric: "-10h",
      metricUnit: "par semaine",
      impact: "Soirées passées à ressaisir des chiffres au lieu de déconnecter."
    },
    {
      code: "02 // CONFORMITÉ",
      icon: AlertTriangle,
      title: "Peur des amendes",
      description: "Les mentions obligatoires changent, et un oubli peut vous coûter cher.",
      metric: "15 € à 750 €",
      metricUnit: "d'amende par devis",
      impact: "Sanctions DGCCRF & rejets de TVA pour une simple mention oubliée."
    },
    {
      code: "03 // CONVERSION",
      icon: TrendingDown,
      title: "Chantiers perdus",
      description: "Vos clients n'attendent pas. Un devis envoyé trop tard = un chantier perdu.",
      metric: "-35%",
      metricUnit: "de taux de signature",
      impact: "Le client signe chez le premier artisan qui lui a envoyé une proposition claire."
    },
    {
      code: "04 // TRÉSORERIE",
      icon: Wallet,
      title: "Vous courez après l'argent",
      description: "Vous avez fait le devis, fait le chantier, avancé le matériel. Maintenant vous attendez, pendant que les salaires tombent. Une entreprise n'est pas une banque.",
      metric: "30 à 60j",
      metricUnit: "d'attente moyenne",
      impact: "L'artisan fait la banque sur ses fonds propres sans oser relancer."
    }
  ];

  return (
    <section id="probleme" className="py-14 sm:py-28 bg-slate-50/70 border-b border-slate-200/80 bg-tech-grid relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header (2026 Minimalist Technical Header) */}
        <div className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4 mb-10 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-200/70 border border-slate-300 text-slate-700 font-mono text-xs font-semibold tracking-wider uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
            <span>[ 01 // LE CONSTAT SUR LE TERRAIN ]</span>
          </div>

          <h2 className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-[-0.03em]">
            Vous êtes artisan, pas comptable
          </h2>

          <p className="text-sm sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            On sait que votre temps, c'est sur le chantier qu'il compte, pas derrière un écran.
          </p>
        </div>

        {/* 4 Bento Cards Grid - Cohesive 3-Color Palette (Slate, Cobalt Blue, White) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {problems.map((problem, index) => {
            const Icon = problem.icon;
            return (
              <div
                key={index}
                className="group relative bg-white rounded-3xl p-7 sm:p-8 border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-blue-400/80 transition-all duration-300 flex flex-col justify-between overflow-hidden"
              >
                {/* Subtle top laser highlight on hover */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-600 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div>
                  {/* Card top bar */}
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                    <span className="font-mono text-xs font-bold text-slate-400 tracking-wider">
                      {problem.code}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 group-hover:bg-blue-600 group-hover:text-white transition-all flex items-center justify-center">
                      <Icon className="w-5 h-5 transition-transform group-hover:scale-110" />
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3 tracking-tight group-hover:text-blue-600 transition-colors">
                    {problem.title}
                  </h3>

                  <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6">
                    {problem.description}
                  </p>
                </div>

                {/* 2026 Precision Data Box */}
                <div className="pt-5 border-t border-slate-100 mt-auto bg-slate-50/60 -mx-7 -mb-7 sm:-mx-8 sm:-mb-8 p-6 sm:p-7">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tracking-tight">
                      {problem.metric}
                    </span>
                    <span className="text-xs font-mono font-medium text-slate-500 uppercase">
                      {problem.metricUnit}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 leading-normal">
                    {problem.impact}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Technical Transition */}
        <div className="mt-14 text-center">
          <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700 bg-white px-5 py-2.5 rounded-full border border-slate-200/80 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-blue-600" />
            <span>La solution : une application mobile taillée pour votre camionnette et vos chantiers</span>
            <ArrowDownRight className="w-4 h-4 text-blue-600" />
          </div>
        </div>

      </div>
    </section>
  );
}
