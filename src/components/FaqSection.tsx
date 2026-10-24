'use client';

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { ChevronDown, Sparkles } from 'lucide-react';

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "Comment fonctionnent les Kits Chantier et le Calculateur Intelligent ?",
      answer: "Les Kits Chantier sont la killer feature de BâtiDevis : ce sont des forfaits types créés spécialement pour chaque corps de métier (ex : remplacement chauffe-eau, rénovation tableau électrique 3 rangées, fourniture et pose de fenêtres, peinture au m², dalle béton...). Dès que vous sélectionnez un kit ou modifiez la quantité ou surface, l'application recalcule en direct et en temps réel le détail des fournitures, la main d'œuvre dissociée, la TVA applicable (10%, 5,5% ou franchise art. 293 B) et les mentions de traitement des déchets."
    },
    {
      question: "Comment fonctionne le mode hors-ligne sans aucune connexion internet ?",
      answer: "BâtiDevis est conçu avec une architecture offline-first (IndexedDB local chiffré). Que vous soyez dans une cave, un parking souterrain, un sous-sol ou en zone blanche en rase campagne, vous pouvez créer, modifier et même faire signer vos devis sur l'écran tactile. Dès que votre smartphone capte à nouveau la 4G, la 5G ou un réseau Wi-Fi, toutes vos données se synchronisent automatiquement avec votre base sécurisée sans aucun conflit."
    },
    {
      question: "Quelles sont les mentions obligatoires sur un devis artisan en 2026 ?",
      answer: "Notre application intègre automatiquement les 16 mentions obligatoires : identité de l'entreprise (SIRET, adresse, assurance décennale et RC Pro avec coordonnées complètes de l'assureur et zone géographique), coordonnées du client, description détaillée des prestations et fournitures, prix HT/TTC, attestation simplifiée de TVA (taux réduit rénovation 10%, énergétique 5,5% ou mention art. 293 B du CGI pour micro-entrepreneurs), date de validité, conditions de règlement et médiation de la consommation."
    },
    {
      question: "Où en est la réforme de la facture électronique (Factur-X et PDP) ?",
      answer: "BâtiDevis suit scrupuleusement le calendrier officiel fixé par l'administration fiscale française : l'obligation de réception s'applique en 2026, et l'obligation d'émission pour les TPE et micro-entreprises du bâtiment est prévue pour septembre 2027. L'export au format hybride Factur-X et la compatibilité PDP / Portail Public de Facturation sont déjà programmés dans la version V1.1 de l'application."
    },
    {
      question: "Comment fonctionne la cohorte des 20 artisans fondateurs et le tarif -50% ?",
      answer: "Le tarif public au lancement officiel sera de 19 € / mois (sans engagement de durée). En rejoignant la première cohorte bêta de 20 artisans fondateurs, vous bénéficiez de l'application 100% gratuite pendant la période de test bêta, puis d'un tarif préférentiel bloqué à vie de 9,50 € / mois (soit -50% garanti). En contrepartie, vous participez à un court point de 15 minutes par semaine pour nous faire vos retours réels du terrain."
    },
    {
      question: "Puis-je importer mes données et anciens tarifs depuis Excel ou CSV ?",
      answer: "Oui, un importateur CSV/Excel universel est prévu dans la mise à jour V1.1. Vous pourrez importer votre fichier clients, votre liste de tarifs de main-d'œuvre et vos articles favoris sans avoir à tout ressaisir."
    }
  ];

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-14 sm:py-28 bg-slate-50/70 border-b border-slate-200/80 bg-tech-grid">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center space-y-3 sm:space-y-4 mb-10 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-50 border border-blue-200 text-blue-700 font-mono text-xs font-semibold tracking-wider uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
            <span>[ 05 // QUESTIONS FRÉQUENTES ]</span>
          </div>

          <h2 className="font-heading text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-[-0.03em]">
            Questions fréquentes des artisans
          </h2>

          <p className="font-sans text-sm sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Kits Chantier, fonctionnement hors-ligne, mentions légales et calendrier de la réforme.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3 text-left">
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
                  <span className="font-heading text-sm sm:text-base font-bold text-slate-900 leading-snug">
                    {faq.question}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen ? 'bg-blue-600 text-white rotate-180' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-5 pt-1 font-sans text-sm text-slate-600 leading-relaxed border-t border-slate-100 mt-1">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Question Footer Note */}
        <div className="mt-10 p-5 rounded-2xl bg-white border border-slate-200 text-center font-sans text-sm text-slate-600 flex flex-col sm:flex-row items-center justify-center gap-2">
          <span>Vous avez une question sur votre métier spécifique ?</span>
          <a
            href="mailto:contact@batidevis.fr"
            className="text-blue-600 font-bold hover:underline inline-flex items-center gap-1 font-heading"
          >
            Écrivez directement à l'équipe BâtiDevis →
          </a>
        </div>

      </div>
    </section>
  );
}
