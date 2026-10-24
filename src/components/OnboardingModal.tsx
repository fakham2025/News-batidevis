'use client';

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { 
  X, 
  ArrowRight, 
  Check, 
  ShieldCheck, 
  Building2, 
  Percent, 
  Sparkles, 
  Wrench, 
  Zap, 
  Paintbrush, 
  Hammer 
} from 'lucide-react';
import { Profile, saveProfile, getSavedProfile, PRESET_KITS, Kit } from '../services/db';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (recommendedKit?: Kit) => void;
}

export function OnboardingModal({ isOpen, onClose, onComplete }: OnboardingModalProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [formData, setFormData] = useState<Profile>(() => getSavedProfile());

  if (!isOpen) return null;

  const handleNext = () => {
    if (step < 3) {
      setStep((step + 1) as any);
    } else {
      // Sauvegarder le profil
      saveProfile(formData);

      // Trouver le kit recommandé selon le métier
      let recommendedKit = PRESET_KITS[0];
      const tradeLower = (formData.trade || '').toLowerCase();
      if (tradeLower.includes('elec') || tradeLower.includes('élec')) {
        recommendedKit = PRESET_KITS.find(k => k.category === 'Électricité') || PRESET_KITS[0];
      } else if (tradeLower.includes('peint') || tradeLower.includes('fini') || tradeLower.includes('carr')) {
        recommendedKit = PRESET_KITS.find(k => k.category === 'Peinture & Finitions') || PRESET_KITS[0];
      } else if (tradeLower.includes('menuis') || tradeLower.includes('bois') || tradeLower.includes('alu')) {
        recommendedKit = PRESET_KITS.find(k => k.category === 'Menuiserie & Agencement') || PRESET_KITS[0];
      } else if (tradeLower.includes('maçon') || tradeLower.includes('gros')) {
        recommendedKit = PRESET_KITS.find(k => k.category === 'Gros Œuvre & Maçonnerie') || PRESET_KITS[0];
      }

      onComplete(recommendedKit);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden text-left">
        
        {/* Header */}
        <div className="bg-slate-950 text-white p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="font-mono text-[10px] font-bold text-blue-400 uppercase tracking-wider">
                Bienvenue sur BâtiDevis • Onboarding 3 étapes
              </div>
              <h3 className="font-heading font-extrabold text-base sm:text-lg">
                Configuration de votre entreprise
              </h3>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step indicator */}
        <div className="px-6 pt-4 pb-3 border-b border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500">
          <div className={`flex items-center gap-1.5 ${step >= 1 ? 'text-blue-600 font-bold' : ''}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-slate-200'}`}>1</span>
            <span>Identité</span>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-slate-300" />
          <div className={`flex items-center gap-1.5 ${step >= 2 ? 'text-blue-600 font-bold' : ''}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-slate-200'}`}>2</span>
            <span>TVA & Décennale</span>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-slate-300" />
          <div className={`flex items-center gap-1.5 ${step >= 3 ? 'text-blue-600 font-bold' : ''}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-slate-200'}`}>3</span>
            <span>Kit Chantier</span>
          </div>
        </div>

        {/* Step 1 : Identité */}
        {step === 1 && (
          <div className="p-6 space-y-4">
            <div className="space-y-1">
              <h4 className="font-heading font-bold text-base text-slate-900">
                1. Vos coordonnées professionnelles
              </h4>
              <p className="text-xs text-slate-500">
                Ces mentions figureront automatiquement en tête de tous vos devis légaux 2026.
              </p>
            </div>

            <div className="space-y-3 font-sans text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Nom commercial de votre entreprise *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Martin Plomberie Chauffage"
                  value={formData.company_name}
                  onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Numéro SIRET (14 chiffres) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="849 204 892 00018"
                  value={formData.siret || ''}
                  onChange={(e) => setFormData({ ...formData, siret: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm font-mono focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Métier principal *
                </label>
                <select
                  value={formData.trade}
                  onChange={(e) => setFormData({ ...formData, trade: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm bg-white"
                >
                  <option value="Plomberie & Chauffage">Plomberie & Chauffage</option>
                  <option value="Électricité">Électricité BTP</option>
                  <option value="Peinture & Revêtements">Peinture & Finitions</option>
                  <option value="Menuiserie & Agencement">Menuiserie & Fermetures</option>
                  <option value="Maçonnerie & Gros Œuvre">Maçonnerie & Gros Œuvre</option>
                  <option value="Autre corps d'état">Autre corps d'état</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Adresse & Ville *
                </label>
                <input
                  type="text"
                  placeholder="14 Rue des Artisans, 44000 Nantes"
                  value={formData.address || ''}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2 : Statut TVA & Décennale */}
        {step === 2 && (
          <div className="p-6 space-y-4">
            <div className="space-y-1">
              <h4 className="font-heading font-bold text-base text-slate-900">
                2. Régime Fiscal & Assurance Décennale
              </h4>
              <p className="text-xs text-slate-500">
                Protection juridique totale contre les sanctions DGCCRF et litiges clients.
              </p>
            </div>

            <div className="space-y-4 font-sans text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Êtes-vous assujetti à la TVA ?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, is_tva_subject: true })}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                      formData.is_tva_subject
                        ? 'border-blue-600 bg-blue-50 text-blue-950 font-bold'
                        : 'border-slate-200 bg-white text-slate-700'
                    }`}
                  >
                    <div className="text-xs">Oui (TVA 10% / 20%)</div>
                    <div className="text-[10px] text-slate-500 font-normal">Société ou AE avec TVA</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, is_tva_subject: false })}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                      !formData.is_tva_subject
                        ? 'border-blue-600 bg-blue-50 text-blue-950 font-bold'
                        : 'border-slate-200 bg-white text-slate-700'
                    }`}
                  >
                    <div className="text-xs">Non (Franchise 293 B)</div>
                    <div className="text-[10px] text-slate-500 font-normal">Auto-entrepreneur sans TVA</div>
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Mention Décennale (Assureur & N° de police) *
                </label>
                <textarea
                  rows={2}
                  placeholder="Ex: Assurance décennale AXA n° 849204/B, couverture France métropolitaine"
                  value={formData.insurance_info || ''}
                  onChange={(e) => setFormData({ ...formData, insurance_info: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs resize-none"
                />
                <span className="text-[10px] text-slate-400">
                  Obligatoire en France depuis la loi Pinel. Inscrit d'office en bas de devis.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Step 3 : Kit Chantier prêt */}
        {step === 3 && (
          <div className="p-6 space-y-4">
            <div className="text-center py-2 space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-inner">
                <Check className="w-8 h-8" />
              </div>
              <h4 className="font-heading font-extrabold text-lg text-slate-900">
                Profil configuré avec succès !
              </h4>
              <p className="text-xs text-slate-600 max-w-sm mx-auto">
                Votre entreprise <strong>{formData.company_name}</strong> est prête à émettre des devis conformes 2026.
              </p>
            </div>

            <div className="bg-blue-50 p-4 rounded-2xl border border-blue-200 text-xs space-y-2">
              <div className="font-heading font-bold text-blue-950 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>Kit Chantier initial sélectionné pour votre métier :</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-blue-100 font-sans">
                <div className="font-bold text-slate-900">
                  {formData.trade.includes('Élec') ? 'Rénovation Tableau Électrique 3 Rangées' : 'Chauffe-eau 200L Thermodynamique'}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Fournitures + Main d'œuvre dissociée + Recyclage BSD automatique.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer actions */}
        <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((step - 1) as any)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              ← Retour
            </button>
          ) : (
            <div />
          )}

          <button
            type="button"
            onClick={handleNext}
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-heading font-bold text-xs flex items-center gap-2 shadow-md shadow-blue-600/25 cursor-pointer"
          >
            <span>{step === 3 ? 'Ouvrir mon premier devis' : 'Continuer'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
