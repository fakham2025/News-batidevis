/**
 * AdminMetricsOverview.tsx — Cartes KPI SaaS pour le portail Admin
 */
import React from 'react';
import { type SaasMetrics, formatMrr } from '../../services/adminMetrics';

interface Props {
  metrics: SaasMetrics;
}

interface KpiCardProps {
  label: string;
  value: string | number;
  sub?: string;
  color: string;
  icon: string;
}

function KpiCard({ label, value, sub, color, icon }: KpiCardProps) {
  return (
    <div className={`bg-white rounded-xl shadow-sm border-l-4 ${color} p-5 flex items-start gap-4`}>
      <div className="text-3xl">{icon}</div>
      <div>
        <p className="text-xs font-semibold uppercase text-gray-400 tracking-wider">{label}</p>
        <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
        {sub && <p className="text-xs text-gray-500 mt-1">{sub}</p>}
      </div>
    </div>
  );
}

export function AdminMetricsOverview({ metrics }: Props) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-gray-700">📊 Tableau de bord SaaS</h2>

      {/* Ligne 1 — revenus */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard
          icon="💶"
          label="MRR"
          value={formatMrr(metrics.mrr)}
          sub="Revenus récurrents mensuels"
          color="border-green-500"
        />
        <KpiCard
          icon="👷"
          label="Artisans actifs"
          value={metrics.activeArtisans}
          sub={`${metrics.trialArtisans} en période d'essai`}
          color="border-blue-500"
        />
        <KpiCard
          icon="📄"
          label="Devis générés"
          value={metrics.totalQuotes}
          sub={`Moy. ${metrics.avgQuotesPerArtisan} / artisan`}
          color="border-orange-400"
        />
        <KpiCard
          icon="📉"
          label="Taux de churn"
          value={`${metrics.churnRate} %`}
          sub={`${metrics.totalArtisans} artisans au total`}
          color="border-red-400"
        />
      </div>

      {/* Ligne 2 — répartition plans */}
      <div className="bg-white rounded-xl shadow-sm p-5">
        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Répartition des plans</p>
        <div className="flex flex-wrap gap-4">
          <PlanBadge plan="Gratuit" count={metrics.planBreakdown.gratuit} color="bg-gray-100 text-gray-600" />
          <PlanBadge plan="VIP 9,50 €/mois" count={metrics.planBreakdown.vip} color="bg-yellow-100 text-yellow-700" />
          <PlanBadge plan="Pro 19 €/mois" count={metrics.planBreakdown.pro} color="bg-blue-100 text-blue-700" />
        </div>
      </div>
    </div>
  );
}

function PlanBadge({ plan, count, color }: { plan: string; count: number; color: string }) {
  return (
    <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${color} font-medium text-sm`}>
      <span>{plan}</span>
      <span className="bg-white rounded-full px-2 py-0.5 text-xs font-bold">{count}</span>
    </div>
  );
}
