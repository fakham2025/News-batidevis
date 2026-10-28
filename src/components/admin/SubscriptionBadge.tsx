/**
 * SubscriptionBadge.tsx — Badge coloré pour le plan d'abonnement d'un artisan
 */
import React from 'react';
import { type ArtisanPlan } from '../../services/adminMetrics';

interface Props {
  plan: ArtisanPlan;
}

const PLAN_CONFIG: Record<ArtisanPlan, { label: string; color: string }> = {
  gratuit: { label: 'Gratuit',       color: 'bg-gray-100 text-gray-600 border-gray-300' },
  vip:     { label: 'VIP 9,50 €',   color: 'bg-yellow-50 text-yellow-700 border-yellow-400' },
  pro:     { label: 'Pro 19 €',      color: 'bg-blue-50 text-blue-700 border-blue-400' },
};

export function SubscriptionBadge({ plan }: Props) {
  const config = PLAN_CONFIG[plan] ?? PLAN_CONFIG.gratuit;
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${config.color}`}>
      {config.label}
    </span>
  );
}
