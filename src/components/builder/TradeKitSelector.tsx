import React, { useState, useEffect } from 'react';
import { Wrench, Zap, Paintbrush, Hammer, Home, Plus, Sparkles } from 'lucide-react';
import { getKitsByTrade } from '../../services/quotes';
import { DevisKitItem } from '../../lib/supabase';

interface TradeKitSelectorProps {
  onSelectItem: (item: {
    designation: string;
    quantity: number;
    unit: string;
    unitPriceHT: number;
    vatRate: number;
  }) => void;
}

const TRADES = [
  { name: 'Plombier', icon: Wrench, color: 'text-sky-600 bg-sky-50 border-sky-200' },
  { name: 'Électricien', icon: Zap, color: 'text-amber-600 bg-amber-50 border-amber-200' },
  { name: 'Peintre', icon: Paintbrush, color: 'text-purple-600 bg-purple-50 border-purple-200' },
  { name: 'Menuisier', icon: Home, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
  { name: 'Maçon', icon: Hammer, color: 'text-stone-600 bg-stone-50 border-stone-200' }
];

export function TradeKitSelector({ onSelectItem }: TradeKitSelectorProps) {
  const [activeTrade, setActiveTrade] = useState('Plombier');
  const [kits, setKits] = useState<DevisKitItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    getKitsByTrade(activeTrade).then((data) => {
      if (isMounted) {
        setKits(data);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [activeTrade]);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
            Kits Métiers BTP (Ajout 1 Clic)
          </h2>
        </div>
        <span className="text-[11px] font-mono text-slate-500">Mentions 2026 incluses</span>
      </div>

      {/* Trade selector pill tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {TRADES.map((t) => {
          const Icon = t.icon;
          const isActive = activeTrade === t.name;
          return (
            <button
              key={t.name}
              type="button"
              onClick={() => setActiveTrade(t.name)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 scale-[1.02]'
                  : 'bg-slate-100 hover:bg-slate-200/70 text-slate-700'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{t.name}</span>
            </button>
          );
        })}
      </div>

      {/* Kit suggestions grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {loading ? (
          <div className="col-span-full py-6 text-center text-xs text-slate-400">
            Chargement des ouvrages {activeTrade}...
          </div>
        ) : kits.length > 0 ? (
          kits.map((kit) => (
            <button
              key={kit.id}
              type="button"
              onClick={() =>
                onSelectItem({
                  designation: kit.name,
                  quantity: 1,
                  unit: kit.unit,
                  unitPriceHT: kit.default_price_ht,
                  vatRate: kit.default_vat_rate
                })
              }
              className="text-left p-3 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/40 transition-all flex items-start justify-between gap-2 group cursor-pointer"
            >
              <div className="space-y-1">
                <div className="text-xs font-semibold text-slate-900 group-hover:text-blue-700 leading-tight">
                  {kit.name}
                </div>
                <div className="text-[11px] text-slate-500">
                  <span className="font-mono font-bold text-slate-800">{kit.default_price_ht} € HT</span> / {kit.unit} (TVA {kit.default_vat_rate}%)
                </div>
              </div>
              <span className="p-1 rounded-lg bg-slate-100 group-hover:bg-blue-600 group-hover:text-white transition-colors text-slate-400 shrink-0">
                <Plus className="w-3.5 h-3.5" />
              </span>
            </button>
          ))
        ) : (
          <div className="col-span-full py-4 text-center text-xs text-slate-400">
            Aucun ouvrage prédéfini pour ce métier. Utilisez l'ajout libre ci-dessous.
          </div>
        )}
      </div>
    </div>
  );
}
