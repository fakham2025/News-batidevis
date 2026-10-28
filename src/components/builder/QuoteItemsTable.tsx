import React from 'react';
import { Trash2, Plus, Calculator } from 'lucide-react';
import { QuoteLineItem } from '../../services/quotes';
import { Button } from '../ui/Button';

interface QuoteItemsTableProps {
  items: QuoteLineItem[];
  onChangeItems: (items: QuoteLineItem[]) => void;
  totalHT: number;
  totalVAT: number;
  totalTTC: number;
}

export function QuoteItemsTable({
  items,
  onChangeItems,
  totalHT,
  totalVAT,
  totalTTC
}: QuoteItemsTableProps) {
  const handleItemChange = (index: number, field: keyof QuoteLineItem, value: any) => {
    const updated = [...items];
    updated[index] = {
      ...updated[index],
      [field]: value
    };
    onChangeItems(updated);
  };

  const handleRemoveItem = (index: number) => {
    const updated = items.filter((_, i) => i !== index);
    onChangeItems(updated);
  };

  const handleAddCustomLine = () => {
    const newItem: QuoteLineItem = {
      designation: '',
      quantity: 1,
      unit: 'u',
      unitPriceHT: 0,
      vatRate: 10.0,
      totalHT: 0,
      totalTTC: 0
    };
    onChangeItems([...items, newItem]);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-6 shadow-sm space-y-5">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <Calculator className="w-4 h-4 text-blue-600" />
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
            Lignes et Prestations du Devis
          </h2>
        </div>
        <Button
          type="button"
          onClick={handleAddCustomLine}
          size="sm"
          variant="outline"
          className="text-xs flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 text-blue-600" />
          <span>Ajouter une ligne</span>
        </Button>
      </div>

      {items.length === 0 ? (
        <div className="py-12 text-center text-slate-400 text-sm border-2 border-dashed border-slate-200 rounded-xl">
          Votre devis est vide. Cliquez sur un ouvrage ci-dessus ou ajoutez une ligne libre.
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/40 hover:bg-white transition-all space-y-2.5 sm:space-y-0 sm:flex sm:items-center sm:gap-3"
            >
              {/* Designation */}
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Désignation de la prestation ou fourniture..."
                  value={item.designation}
                  onChange={(e) => handleItemChange(idx, 'designation', e.target.value)}
                  className="w-full text-xs sm:text-sm font-medium text-slate-900 bg-transparent border-b border-transparent focus:border-blue-500 focus:outline-none placeholder-slate-400 py-1"
                />
              </div>

              {/* Quantity & Unit */}
              <div className="flex items-center gap-2">
                <div className="w-20">
                  <input
                    type="number"
                    min="0.1"
                    step="any"
                    value={item.quantity || ''}
                    onChange={(e) => handleItemChange(idx, 'quantity', parseFloat(e.target.value) || 0)}
                    placeholder="Qté"
                    className="w-full px-2 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-center font-mono focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div className="w-20">
                  <select
                    value={item.unit}
                    onChange={(e) => handleItemChange(idx, 'unit', e.target.value)}
                    className="w-full px-2 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-mono focus:border-blue-500 focus:outline-none"
                  >
                    <option value="u">u</option>
                    <option value="forfait">forfait</option>
                    <option value="m²">m²</option>
                    <option value="ml">ml</option>
                    <option value="heure">heure</option>
                    <option value="jour">jour</option>
                    <option value="kg">kg</option>
                  </select>
                </div>
              </div>

              {/* Unit price HT */}
              <div className="flex items-center gap-1.5 w-28">
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={item.unitPriceHT || ''}
                  onChange={(e) => handleItemChange(idx, 'unitPriceHT', parseFloat(e.target.value) || 0)}
                  placeholder="Prix HT"
                  className="w-full px-2 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-mono text-right focus:border-blue-500 focus:outline-none"
                />
                <span className="text-xs text-slate-500 font-bold">€</span>
              </div>

              {/* VAT rate */}
              <div className="w-24">
                <select
                  value={item.vatRate}
                  onChange={(e) => handleItemChange(idx, 'vatRate', parseFloat(e.target.value) || 10)}
                  className="w-full px-2 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-mono font-bold text-blue-900 focus:border-blue-500 focus:outline-none"
                >
                  <option value={10}>10 % (Rénov)</option>
                  <option value={5.5}>5.5 % (Éco)</option>
                  <option value={20}>20 % (Neuf)</option>
                </select>
              </div>

              {/* Line Total HT */}
              <div className="w-24 text-right font-mono font-bold text-xs text-slate-800">
                {(Math.round((item.quantity * item.unitPriceHT) * 100) / 100).toFixed(2)} €
              </div>

              {/* Delete button */}
              <button
                type="button"
                onClick={() => handleRemoveItem(idx)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                title="Supprimer la ligne"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Totals Summary Card */}
      <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="text-xs text-slate-500 space-y-1">
          <p>Conforme aux 16 mentions obligatoires DGCCRF 2026.</p>
          <p className="font-semibold text-slate-700">TVA ventilée selon réglementation bâtiment en vigueur.</p>
        </div>

        <div className="bg-white rounded-xl p-3 border border-slate-200 shadow-sm space-y-1.5 min-w-[220px]">
          <div className="flex justify-between text-xs text-slate-600">
            <span>Total HT :</span>
            <span className="font-mono font-bold text-slate-900">{totalHT.toFixed(2)} €</span>
          </div>
          <div className="flex justify-between text-xs text-slate-600 border-b border-slate-100 pb-1">
            <span>Total TVA :</span>
            <span className="font-mono font-bold text-slate-900">{totalVAT.toFixed(2)} €</span>
          </div>
          <div className="flex justify-between text-sm font-extrabold text-blue-950 pt-1">
            <span>Total TTC :</span>
            <span className="font-mono text-base text-blue-600">{totalTTC.toFixed(2)} €</span>
          </div>
        </div>
      </div>
    </div>
  );
}
