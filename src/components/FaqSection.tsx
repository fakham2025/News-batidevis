import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "Quelles sont les mentions obligatoires sur un devis artisan en 2026 ?",
      answer: "Notre application intègre automatiquement les 16 mentions obligatoires : identité de l'entreprise (SIRET, assurances décennale et RC Pro avec coordonnées complètes de l'assureur), coordonnées du client, description détaillée des prestations, prix HT/TTC, TVA applicable (taux normal, réduit 10% ou 5,5%), date de validité, conditions de règlement, et depuis 2026, la conformité à la facture électronique PDP et au format Factur-X."
    },
    {
      question: "L'application fonctionne-t-elle hors connexion sur chantier ?",
      answer: "Oui, 100%. Vous pouvez créer, modifier et enregistrer des devis sans connexion internet (dans un sous-sol, une cave ou une zone rurale blanche). Tout se synchronise automatiquement avec votre cloud sécurisé dès que votre téléphone récupère du réseau 4G/5G ou Wi-Fi."
    },
    {
      question: "Est-ce conforme à la réforme de la facture électronique PDP 2026 ?",
      answer: "Absolument. Nous sommes en cours de certification PDP (Plateforme de Dématérialisation Partenaire) et votre outil sera 100% conforme dès le calendrier officiel d'application de la réforme (génération native du format Factur-X, transmission sécurisée et annuaire des entreprises)."
    },
    {
      question: "Combien coûte l'application ?",
      answer: "L'abonnement public sera de 19€/mois (sans engagement de durée). En rejoignant la liste d'attente aujourd'hui, vous bénéficiez du tarif pionnier de -50% à vie, soit seulement 9,50€/mois tout inclus (mises à jour, support prioritaire, devis illimités)."
    },
    {
      question: "Puis-je importer mes données depuis Excel ?",
      answer: "Oui, un importateur CSV/Excel automatique est inclus. Vous pouvez importer votre base de clients, vos tarifs de main-d'œuvre, votre catalogue de fournitures et vos anciens devis en quelques clics pour ne rien perdre de votre historique."
    }
  ];

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-14 sm:py-28 bg-slate-50/70 border-b border-slate-200/80 bg-tech-grid">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center space-y-3 sm:space-y-4 mb-10 sm:mb-18">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-50 border border-blue-200 text-blue-700 font-mono text-xs font-semibold tracking-wider uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
            <span>[ 05 // QUESTIONS FRÉQUENTES ]</span>
          </div>

          <h2 className="font-heading text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-[-0.03em]">
            Questions fréquentes
          </h2>

          <p className="font-sans text-sm sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Tout ce que vous devez savoir sur BâtiDevis et la réglementation 2026.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? 'border-blue-300 bg-white shadow-sm'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggle(index)}
                  className="w-full py-4 sm:py-5 px-4 sm:px-6 text-left flex items-center justify-between gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer min-h-[52px]"
                  aria-expanded={isOpen}
                >
                  <span className="font-heading text-sm sm:text-lg font-bold text-slate-900 leading-snug">
                    {faq.question}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen ? 'bg-blue-600 text-white rotate-180' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-1 font-sans text-sm sm:text-base text-slate-600 leading-relaxed border-t border-slate-100 mt-1">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Question Footer Note */}
        <div className="mt-10 p-5 rounded-2xl bg-white border border-slate-200 text-center font-sans text-sm text-slate-600 flex flex-col sm:flex-row items-center justify-center gap-2">
          <span>Vous avez une question spécifique sur votre corps d'état ?</span>
          <a
            href="mailto:contact@batidevis.fr"
            className="text-blue-600 font-bold hover:underline inline-flex items-center gap-1 font-heading"
          >
            Écrivez à notre équipe technique →
          </a>
        </div>

      </div>
    </section>
  );
}
