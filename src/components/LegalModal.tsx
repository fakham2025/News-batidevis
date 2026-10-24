'use client';

import { X, ShieldCheck, Mail } from 'lucide-react';

interface LegalModalProps {
  type: 'mentions' | 'cgu' | 'privacy' | 'contact' | null;
  onClose: () => void;
}

export function LegalModal({ type, onClose }: LegalModalProps) {
  if (!type) return null;

  const content = {
    mentions: {
      title: "Mentions Légales",
      text: (
        <div className="space-y-4 text-xs sm:text-sm text-gray-600 leading-relaxed">
          <p><strong>Éditeur du site :</strong> BâtiDevis SAS au capital de 10 000 €, immatriculée au RCS de Nantes sous le numéro 928 349 102.</p>
          <p><strong>Siège social :</strong> 15 Rue de Strasbourg, 44000 Nantes, France.</p>
          <p><strong>Directeur de la publication :</strong> Équipe Produit BâtiDevis (contact@batidevis.fr).</p>
          <p><strong>Hébergement :</strong> Serveurs sécurisés situés au sein de l'Union Européenne (France), conformément aux exigences du RGPD et des standards de sécurité bancaire et fiscale (ISO 27001).</p>
          <p><strong>Conformité Facturation 2026 :</strong> L'application BâtiDevis intègre les spécifications de l'ordonnance n° 2021-1190 et prépare l'interopérabilité avec les Plateformes de Dématérialisation Partenaires (PDP) et le Portail Public de Facturation (PPF).</p>
        </div>
      )
    },
    cgu: {
      title: "Conditions Générales d'Utilisation (CGU)",
      text: (
        <div className="space-y-4 text-xs sm:text-sm text-gray-600 leading-relaxed">
          <p><strong>1. Objet :</strong> Les présentes CGU encadrent l'inscription à la liste d'attente d'accès anticipé du service BâtiDevis.</p>
          <p><strong>2. Offre Accès Anticipé :</strong> Les utilisateurs inscrits sur la liste d'attente bénéficient d'une remise contractuelle de -50% à vie sur le tarif de l'abonnement mensuel de base (soit 9,50 € TTC/mois au lieu de 19 € TTC/mois) dès le lancement public de l'application.</p>
          <p><strong>3. Sans Engagement :</strong> L'inscription à la liste d'attente n'implique aucune obligation d'achat ni prélèvement bancaire immédiat.</p>
          <p><strong>4. Responsabilité :</strong> L'artisan demeure responsable de la conformité des données techniques et montants chiffrés saisis dans ses devis.</p>
        </div>
      )
    },
    privacy: {
      title: "Politique de Confidentialité & RGPD",
      text: (
        <div className="space-y-4 text-xs sm:text-sm text-gray-600 leading-relaxed">
          <p><strong>Protection des données personnelles :</strong> Vos informations (prénom, adresse email, corps d'état) sont collectées exclusivement dans le cadre de la réservation de votre accès anticipé et de l'envoi d'informations sur le lancement de BâtiDevis.</p>
          <p><strong>Aucune revente :</strong> Vos données ne seront jamais vendues, louées ou cédées à des tiers publicitaires. Pas de spam, promis.</p>
          <p><strong>Vos droits (CNIL) :</strong> Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez d'un droit d'accès, de rectification et de suppression de vos données en envoyant un email à dpo@batidevis.fr.</p>
        </div>
      )
    },
    contact: {
      title: "Contact & Support Dédié BTP",
      text: (
        <div className="space-y-4 text-xs sm:text-sm text-gray-600 leading-relaxed">
          <p>Une question sur la compatibilité de votre métier ou sur la réforme de la facture électronique 2026 ? Notre équipe vous répond rapidement :</p>
          <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 space-y-2">
            <div className="flex items-center gap-2 font-bold text-blue-900">
              <Mail className="w-4 h-4 text-blue-600" /> contact@batidevis.fr
            </div>
            <p className="text-xs text-blue-800">
              Permanence téléphonique et WhatsApp pour les artisans du bâtiment du lundi au vendredi de 7h30 à 19h00.
            </p>
          </div>
        </div>
      )
    }
  };

  const active = content[type];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl max-w-lg w-full shadow-2xl p-6 sm:p-8 border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-bold text-gray-900">{active.title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto pr-2">
          {active.text}
        </div>

        <div className="mt-6 pt-4 border-t border-gray-100 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
