/**
 * ArtisansManagerTable.tsx — Table de gestion des artisans pour le portail Admin
 * Fonctionnalités : recherche, filtre par plan/statut, tri, actions (suspend/activer)
 */
import React, { useState, useMemo } from 'react';
import { type ArtisanRecord, type ArtisanPlan, type ArtisanStatus } from '../../services/adminMetrics';
import { SubscriptionBadge } from './SubscriptionBadge';

interface Props {
  artisans: ArtisanRecord[];
  onStatusChange?: (id: string, newStatus: ArtisanStatus) => void;
}

const STATUS_LABEL: Record<ArtisanStatus, string> = {
  active:    '✅ Actif',
  trial:     '🟡 Essai',
  churned:   '❌ Churné',
  suspended: '🚫 Suspendu',
};

const STATUS_COLOR: Record<ArtisanStatus, string> = {
  active:    'text-green-700',
  trial:     'text-yellow-600',
  churned:   'text-red-600',
  suspended: 'text-gray-500',
};

export function ArtisansManagerTable({ artisans, onStatusChange }: Props) {
  const [search, setSearch]         = useState('');
  const [filterPlan, setFilterPlan] = useState<ArtisanPlan | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<ArtisanStatus | 'all'>('all');
  const [sortBy, setSortBy]         = useState<'created_at' | 'quotes_count' | 'plan'>('created_at');

  const filtered = useMemo(() => {
    return artisans
      .filter(a => {
        const q = search.toLowerCase();
        const matchSearch = !q || a.email.toLowerCase().includes(q) ||
          (a.company_name ?? '').toLowerCase().includes(q) ||
          (a.siret ?? '').includes(q);
        const matchPlan   = filterPlan === 'all'   || a.plan   === filterPlan;
        const matchStatus = filterStatus === 'all' || a.status === filterStatus;
        return matchSearch && matchPlan && matchStatus;
      })
      .sort((a, b) => {
        if (sortBy === 'created_at')   return b.created_at.localeCompare(a.created_at);
        if (sortBy === 'quotes_count') return b.quotes_count - a.quotes_count;
        if (sortBy === 'plan') {
          const order = { pro: 0, vip: 1, gratuit: 2 };
          return (order[a.plan] ?? 3) - (order[b.plan] ?? 3);
        }
        return 0;
      });
  }, [artisans, search, filterPlan, filterStatus, sortBy]);

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {/* Barre de filtres */}
      <div className="p-4 border-b flex flex-wrap gap-3 items-center bg-gray-50">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="🔍 Rechercher email, société, SIRET…"
          className="flex-1 min-w-[200px] border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <select
          value={filterPlan}
          onChange={e => setFilterPlan(e.target.value as ArtisanPlan | 'all')}
          className="border rounded-lg px-3 py-2 text-sm bg-white"
        >
          <option value="all">Tous les plans</option>
          <option value="gratuit">Gratuit</option>
          <option value="vip">VIP</option>
          <option value="pro">Pro</option>
        </select>

        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value as ArtisanStatus | 'all')}
          className="border rounded-lg px-3 py-2 text-sm bg-white"
        >
          <option value="all">Tous les statuts</option>
          <option value="active">Actifs</option>
          <option value="trial">Essai</option>
          <option value="churned">Churnés</option>
          <option value="suspended">Suspendus</option>
        </select>

        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value as typeof sortBy)}
          className="border rounded-lg px-3 py-2 text-sm bg-white"
        >
          <option value="created_at">Tri : Date</option>
          <option value="quotes_count">Tri : Devis</option>
          <option value="plan">Tri : Plan</option>
        </select>

        <span className="text-sm text-gray-500 ml-auto">{filtered.length} résultat(s)</span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
            <tr>
              <th className="px-4 py-3 text-left">Email / Société</th>
              <th className="px-4 py-3 text-left">Plan</th>
              <th className="px-4 py-3 text-left">Statut</th>
              <th className="px-4 py-3 text-left">Dép.</th>
              <th className="px-4 py-3 text-center">Devis</th>
              <th className="px-4 py-3 text-left">Inscrit le</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                  Aucun artisan trouvé
                </td>
              </tr>
            )}
            {filtered.map(artisan => (
              <tr key={artisan.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <div className="font-medium text-gray-800">{artisan.email}</div>
                  {artisan.company_name && (
                    <div className="text-xs text-gray-500">{artisan.company_name}</div>
                  )}
                  {artisan.siret && (
                    <div className="text-xs text-gray-400 font-mono">{artisan.siret}</div>
                  )}
                </td>
                <td className="px-4 py-3">
                  <SubscriptionBadge plan={artisan.plan} />
                  <div className="text-xs text-gray-400 mt-1">
                    {artisan.monthly_fee > 0 ? `${artisan.monthly_fee} €/mois` : 'Gratuit'}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`font-medium ${STATUS_COLOR[artisan.status]}`}>
                    {STATUS_LABEL[artisan.status]}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-600">{artisan.department ?? '—'}</td>
                <td className="px-4 py-3 text-center font-bold text-gray-700">{artisan.quotes_count}</td>
                <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                  {new Date(artisan.created_at).toLocaleDateString('fr-FR')}
                </td>
                <td className="px-4 py-3 text-center">
                  {onStatusChange && (
                    <div className="flex gap-1 justify-center">
                      {artisan.status !== 'active' && (
                        <button
                          onClick={() => onStatusChange(artisan.id, 'active')}
                          className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition"
                        >
                          Activer
                        </button>
                      )}
                      {artisan.status !== 'suspended' && (
                        <button
                          onClick={() => onStatusChange(artisan.id, 'suspended')}
                          className="text-xs px-2 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 transition"
                        >
                          Suspendre
                        </button>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
