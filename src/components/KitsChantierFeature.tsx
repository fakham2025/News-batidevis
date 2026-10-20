/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { 
  Layers, 
  Sparkles, 
  Calculator, 
  ArrowRight, 
  Check, 
  Plus, 
  Flame, 
  Zap, 
  Paintbrush, 
  Hammer, 
  Building2 
} from 'lucide-react';
import { PRESET_KITS, Kit } from '../services/db';

interface KitsChantierFeatureProps {
  onOpenDevisBuilder?: (initialKit?: Kit) => void;
  onScrollToWaitlist: () => void;
}

export function KitsChantierFeature({ onOpenDevisBuilder, onScrollToWaitlist }: KitsChantierFeatureProps) {
  const [selectedKitIndex, setSelectedKitIndex] = useState<number>(0);
  const [surfaceMultiplier, setSurfaceMultiplier] = useState<number>(1);
  const [selectedTvaRate, setSelectedTvaRate] = useState<number>(10); // 10% réno par défaut

  const currentKit = PRESET_KITS[selectedKitIndex] || PRESET_KITS[0];

  // Recalcul en temps réel avec le multiplicateur
  const calculatedItems = currentKit.items.map(item => {
    const qty = Math.round(item.quantity * surfaceMultiplier * 10) / 10;
    const total = Math.round(qty * item.unit_price * 100) / 100;
    return { ...item, quantity: qty, total };
  });

  const totalHT = calculatedItems.reduce((acc, it) => acc + it.total, 0);
  const totalTVA = Math.round((totalHT * (selectedTvaRate / 100)) * 100) / 100;
  const totalTTC = Math.round((totalHT + totalTVA) * 100) / 100;

  const categoryIcons = [
    { name: 'Plomberie & CVC', icon: Flame },
    { name: 'Électricité', icon: Zap },
    { name: 'Peinture & Finitions', icon: Paintbrush },
    { name: 'Menuiserie & Agencement', icon: Hammer },
    { name: 'Gros Œuvre & Maçonnerie', icon: Building2 },
  ];

  return (
    <div className="pt-12 sm:pt-20 border-t border-slate-200/80">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
        
        {/* Left Side: Explanations */}
        <div className="lg:col-span-5 space-y-5 text-left order-1">
          <div className="inline-flex items-center gap-2 font-mono text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-md border border-blue-200">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>KILLER FEATURE // LE CALCULATEUR CHANTIER</span>
          </div>

          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Les Kits Chantier : <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              vos forfaits recalculés en 1 clic
            </span>
          </h3>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Fini la saisie fastidieuse vis par vis ou tuyau par tuyau. Sélectionnez votre prestation type, saisissez la dimension ou le nombre d'unités : les fournitures, la main d'œuvre et la TVA se recalculent <strong>instantanément</strong>.
          </p>

          <div className="space-y-3 pt-2 text-sm text-slate-700 font-sans">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-md bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-3.5 h-3.5" />
              </div>
              <span><strong>Kits calibrés par corps de métier :</strong> Plomberie, électricité, finitions, gros œuvre, menuiserie.</span>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-md bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-3.5 h-3.5" />
              </div>
              <span><strong>Main d'œuvre & fournitures dissociées :</strong> Conforme aux exigences de contrôle fiscal et d'assurance.</span>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-md bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-3.5 h-3.5" />
              </div>
              <span><strong>100% personnalisable :</strong> Enregistrez vos propres prix de gros et vos marges habituelles.</span>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap gap-3">
            {onOpenDevisBuilder && (
              <button
                type="button"
                onClick={() => onOpenDevisBuilder(currentKit)}
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-600/25 transition-all cursor-pointer flex items-center gap-2"
              >
                <Calculator className="w-4 h-4" />
                <span>Tester dans le DevisBuilder</span>
              </button>
            )}
            <button
              type="button"
              onClick={onScrollToWaitlist}
              className="px-5 py-3 rounded-xl border border-slate-300 hover:border-blue-600 text-slate-800 hover:text-blue-600 font-semibold text-sm transition-all cursor-pointer"
            >
              Bloquer mon accès -50%
            </button>
          </div>
        </div>

        {/* Right Side: Live Interactive Calculator HUD */}
        <div className="lg:col-span-7 order-2">
          <div className="bg-slate-950 text-white rounded-3xl p-5 sm:p-7 shadow-2xl border border-slate-800 relative overflow-hidden space-y-4">
            {/* Top decorative glow */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-transparent" />

            {/* Header */}
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-800 text-xs font-mono">
              <span className="flex items-center gap-2 text-slate-400">
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                <span>SIMULATEUR DE KITS EN DIRECT</span>
              </span>
              <span className="bg-blue-950 text-blue-300 px-2 py-0.5 rounded border border-blue-800 text-[10px] font-bold">
                CALCUL EN TEMPS RÉEL (0 MS)
              </span>
            </div>

            {/* Trade / Kit Selector Tabs */}
            <div className="space-y-2">
              <label className="text-[11px] font-mono uppercase font-bold text-slate-400">
                1. Choisissez un kit métier prédéfini :
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                {PRESET_KITS.map((k, idx) => {
                  const isSelected = idx === selectedKitIndex;
                  return (
                    <button
                      key={k.id}
                      type="button"
                      onClick={() => {
                        setSelectedKitIndex(idx);
                        setSurfaceMultiplier(1);
                      }}
                      className={`p-2.5 rounded-xl text-left transition-all cursor-pointer border ${
                        isSelected
                          ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                          : 'bg-slate-900/90 text-slate-300 border-slate-800 hover:border-slate-600'
                      }`}
                    >
                      <div className="text-[10px] font-mono opacity-80 truncate">{k.category}</div>
                      <div className="text-xs font-bold truncate mt-0.5">{k.name}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Multiplier Slider (Surface / Quantité) */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between text-xs font-sans">
                <span className="font-bold text-slate-300">
                  2. Ajustez la dimension du chantier :
                </span>
                <span className="font-mono font-bold text-blue-400 bg-blue-950/80 px-2.5 py-1 rounded-lg border border-blue-800/80">
                  Facteur d'échelle : x{surfaceMultiplier}
                </span>
              </div>
              <input
                type="range"
                min="0.5"
                max="3"
                step="0.5"
                value={surfaceMultiplier}
                onChange={(e) => setSurfaceMultiplier(parseFloat(e.target.value))}
                className="w-full accent-blue-500 cursor-pointer h-2 bg-slate-800 rounded-lg appearance-none"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span>Chantier standard (x1)</span>
                <span>Chantier double (x2)</span>
                <span>Grand chantier (x3)</span>
              </div>
            </div>

            {/* Generated Item Breakdown */}
            <div className="bg-slate-900/60 rounded-2xl p-3.5 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-mono font-bold text-slate-400 pb-1.5 border-b border-slate-800">
                <span>Désignation & Lignes automatiques</span>
                <span>Total HT</span>
              </div>
              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                {calculatedItems.map((it) => (
                  <div key={it.id} className="flex justify-between items-center text-xs py-1">
                    <div className="min-w-0 pr-3">
                      <div className="text-slate-200 font-medium truncate">{it.description}</div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {it.quantity} {it.unit || 'u.'} × {it.unit_price.toFixed(2)} €
                      </div>
                    </div>
                    <span className="font-mono font-bold text-white whitespace-nowrap">
                      {it.total.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total Recap Box */}
            <div className="bg-gradient-to-br from-blue-950/80 to-slate-900 p-4 rounded-2xl border border-blue-900/60 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Total Matériel & Main d'œuvre HT :</span>
                <span className="font-mono font-bold text-white">
                  {totalHT.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} € HT
                </span>
              </div>

              {/* TVA selector */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-slate-400">Régime TVA :</span>
                <div className="flex gap-1.5 font-mono text-[10px]">
                  <button
                    type="button"
                    onClick={() => setSelectedTvaRate(10)}
                    className={`px-2 py-0.5 rounded cursor-pointer ${selectedTvaRate === 10 ? 'bg-blue-600 text-white font-bold' : 'bg-slate-800 text-slate-400'}`}
                  >
                    10% (Rénov)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedTvaRate(5.5)}
                    className={`px-2 py-0.5 rounded cursor-pointer ${selectedTvaRate === 5.5 ? 'bg-blue-600 text-white font-bold' : 'bg-slate-800 text-slate-400'}`}
                  >
                    5.5% (Énergie)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedTvaRate(0)}
                    className={`px-2 py-0.5 rounded cursor-pointer ${selectedTvaRate === 0 ? 'bg-blue-600 text-white font-bold' : 'bg-slate-800 text-slate-400'}`}
                  >
                    0% (Art. 293 B)
                  </button>
                </div>
              </div>

              <div className="flex justify-between text-slate-400">
                <span>Montant TVA ({selectedTvaRate}%) :</span>
                <span className="font-mono text-slate-300">
                  {totalTVA.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
                </span>
              </div>

              <div className="flex justify-between text-sm sm:text-base font-bold text-white pt-2 border-t border-slate-800">
                <span className="font-heading">NET À PAYER TTC :</span>
                <span className="font-mono text-blue-400 font-extrabold text-base sm:text-lg">
                  {totalTTC.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} € TTC
                </span>
              </div>
            </div>

            {/* Bottom notification */}
            <div className="text-[11px] text-slate-400 font-mono text-center pt-1">
              ✓ Ajouté en 1 clic dans votre devis • Mentions légales générées automatiquement
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
