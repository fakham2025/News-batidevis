/**
 * WaitlistManagerTable.tsx — Gestion de la waitlist artisans avec export CSV
 */
import React, { useState, useMemo } from 'react';
import { type WaitlistEntry, type WaitlistStatut, generateWaitlistCsv, downloadCsv } from '../../services/exportCsv';

interface Props {
  entries: WaitlistEntry[];
  onStatusChange?: (id: string, statut: WaitlistStatut) => void;
}

const STATUT_OPTIONS: { value: WaitlistStatut | 'all'; label: string; color: string }[] = [
  { value: 'all',        label: 'Tous',       color: 'text-gray-600' },
  { value: 'en_attente', label: 'En attente', color: 'text-blue-600' },
  { value: 'contacte',   label: 'Contacté',   color: 'text-yellow-600' },
  { value: 'converti',   label: 'Converti',   color: 'text-green-600' },
  { value: 'abandonne',  label: 'Abandonné',  color: 'text-red-500' },
];

const STATUT_BADGE: Record<WaitlistStatut, string> = {
  en_attente: 'bg-blue-100 text-blue-700',
  contacte:   'bg-yellow-100 text-yellow-700',
  converti:   'bg-green-100 text-green-700',
  abandonne:  'bg-red-100 text-red-600',
};

const STATUT_LABEL: Record<WaitlistStatut, string> = {
  en_attente: 'En attente',
  contacte:   'Contacté',
  converti:   'Converti ✅',
  abandonne:  'Abandonné',
};

export function WaitlistManagerTable({ entries, onStatusChange }: Props) {
  const [search, setSearch]             = useState('');
  const [filterStatut, setFilterStatut] = useState<WaitlistStatut | 'all'>('all');

  const filtered = useMemo(() => {
    return entries.filter(e => {
      const q = search.toLowerCase();
      const matchSearch = !q
        || e.nom.toLowerCase().includes(q)
        || e.email.toLowerCase().includes(q)
        || e.metier.toLowerCase().includes(q)
        || e.departement.includes(q);
      const matchStatut = filterStatut === 'all' || e.statut === filterStatut;
      return matchSearch && matchStatut;
    });
  }, [entries, search, filterStatut]);

  const handleExport = () => {
    const csv = generateWaitlistCsv(filtered);
    const date = new Date().toISOString().slice(0, 10);
    downloadCsv(csv, `waitlist-batidevis-${date}.csv`);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {/* En-tête */}
      <div className="p-4 border-b bg-gray-50 flex flex-wrap gap-3 items-center">
        <h3 className="font-bold text-gray-700 text-base">📋 Waitlist artisans</h3>

        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="🔍 Nom, email, métier, département…"
          className="flex-1 min-w-[200px] border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <select
          value={filterStatut}
          onChange={e => setFilterStatut(e.target.value as WaitlistStatut | 'all')}
          className="border rounded-lg px-3 py-2 text-sm bg-white"
        >
          {STATUT_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>

        <button
          onClick={handleExport}
          className="ml-auto flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition"
        >
          ⬇️ Exporter CSV
          <span className="bg-green-800 rounded px-1.5 text-xs">{filtered.length}</span>
        </button>
      </div>

      {/* Statistiques rapides */}
      <div className="flex gap-4 px-4 py-2 bg-gray-50 border-b text-xs text-gray-500">
        {STATUT_OPTIONS.filter(o => o.value !== 'all').map(opt => {
          const count = entries.filter(e => e.statut === opt.value).length;
          return (
            <span key={opt.value} className={opt.color}>
              {opt.label}: <strong>{count}</strong>
            </span>
          );
        })}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
            <tr>
              <th className="px-4 py-3 text-left">Nom</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Téléphone</th>
              <th className="px-4 py-3 text-left">Métier</th>
              <th className="px-4 py-3 text-center">Dép.</th>
              <th className="px-4 py-3 text-left">Inscrit le</th>
              <th className="px-4 py-3 text-center">Statut</th>
              {onStatusChange && <th className="px-4 py-3 text-center">Action</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-gray-400">
                  Aucune entrée dans la waitlist
                </td>
              </tr>
            )}
            {filtered.map(entry => (
              <tr key={entry.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-medium text-gray-800">{entry.nom}</td>
                <td className="px-4 py-3 text-blue-600">
                  <a href={`mailto:${entry.email}`} className="hover:underline">{entry.email}</a>
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {entry.telephone ? (
                    <a href={`tel:${entry.telephone}`} className="hover:underline">{entry.telephone}</a>
                  ) : '—'}
                </td>
                <td className="px-4 py-3 text-gray-600">{entry.metier}</td>
                <td className="px-4 py-3 text-center font-bold text-gray-700">{entry.departement}</td>
                <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                  {new Date(entry.date_inscription).toLocaleDateString('fr-FR')}
                </td>
                <td className="px-4 py-3 text-center">
                  <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUT_BADGE[entry.statut]}`}>
                    {STATUT_LABEL[entry.statut]}
                  </span>
                </td>
                {onStatusChange && (
                  <td className="px-4 py-3 text-center">
                    <select
                      value={entry.statut}
                      onChange={e => onStatusChange(entry.id, e.target.value as WaitlistStatut)}
                      className="text-xs border rounded px-2 py-1 bg-white"
                    >
                      <option value="en_attente">En attente</option>
                      <option value="contacte">Contacté</option>
                      <option value="converti">Converti</option>
                      <option value="abandonne">Abandonné</option>
                    </select>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
