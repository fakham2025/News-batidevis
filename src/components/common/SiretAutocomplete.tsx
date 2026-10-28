import { useState, useEffect, useRef } from 'react';
import { Search, Loader2, Building2, Check, MapPin, Hash } from 'lucide-react';
import { searchEntreprisesGouv, type EntrepriseSearchResult } from '../../services/inseeApi';

interface SiretAutocompleteProps {
  onSelect: (entreprise: EntrepriseSearchResult) => void;
  placeholder?: string;
}

export function SiretAutocomplete({ 
  onSelect, 
  placeholder = "Rechercher votre entreprise (Nom, SIRET 14 chiffres, ville...)" 
}: SiretAutocompleteProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<EntrepriseSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Fermer la liste déroulante au clic externe
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Recherche avec debouncing
  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const data = await searchEntreprisesGouv(trimmed);
        setResults(data);
        setIsOpen(data.length > 0);
      } catch (err) {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (ent: EntrepriseSearchResult) => {
    onSelect(ent);
    setQuery(ent.nom_complet);
    setIsOpen(false);
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
          ) : (
            <Search className="w-4 h-4 text-slate-400" />
          )}
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-9 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-sans"
        />

        <div className="absolute inset-y-0 right-0 pr-2 flex items-center">
          <span className="text-[10px] font-mono font-bold bg-blue-950 text-blue-300 border border-blue-800/80 px-1.5 py-0.5 rounded">
            API GOUV
          </span>
        </div>
      </div>

      {/* Dropdown des résultats */}
      {isOpen && results.length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden divide-y divide-slate-800/80 animate-in fade-in-50 duration-150">
          <div className="px-3 py-2 bg-slate-900/90 text-[10px] font-mono text-slate-400 flex items-center justify-between">
            <span>ENTREPRISES OFFICIELLES TROUVÉES</span>
            <span className="text-blue-400 font-bold">{results.length} résultats</span>
          </div>

          <div className="max-h-64 overflow-y-auto">
            {results.map((item, idx) => (
              <button
                key={`${item.siret}-${idx}`}
                type="button"
                onClick={() => handleSelect(item)}
                className="w-full px-3.5 py-2.5 text-left hover:bg-slate-900 transition-colors flex items-start justify-between gap-3 group cursor-pointer"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                    <span className="font-heading font-bold text-xs text-white group-hover:text-blue-300 truncate">
                      {item.nom_complet}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                    <span className="flex items-center gap-1">
                      <Hash className="w-3 h-3 text-slate-500" />
                      <span>SIRET : {item.siret}</span>
                    </span>
                    <span className="text-slate-600">•</span>
                    <span className="text-blue-400 font-semibold">{item.code_naf}</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-sans truncate">
                    <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                    <span className="truncate">{item.adresse_complete}</span>
                  </div>
                </div>

                <span className="shrink-0 p-1.5 rounded-lg bg-blue-600/10 text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Check className="w-3.5 h-3.5" />
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
