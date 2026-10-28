/**
 * adminMetrics.ts — Moteur de calcul des métriques SaaS BâtiDevis
 * Agrège les données artisans pour les KPIs du portail Admin
 */

export type ArtisanPlan = 'gratuit' | 'vip' | 'pro';
export type ArtisanStatus = 'active' | 'trial' | 'churned' | 'suspended';

export interface ArtisanRecord {
  id: string;
  email: string;
  plan: ArtisanPlan;
  monthly_fee: number;      // 0 | 9.5 | 19
  created_at: string;       // ISO date
  status: ArtisanStatus;
  quotes_count: number;
  company_name?: string;
  siret?: string;
  phone?: string;
  department?: string;      // ex: "75", "13"
}

export interface SaasMetrics {
  mrr: number;              // Monthly Recurring Revenue (€)
  totalArtisans: number;
  activeArtisans: number;   // status === 'active'
  trialArtisans: number;    // status === 'trial'
  churnRate: number;        // % churned / total
  planBreakdown: {
    gratuit: number;
    vip: number;
    pro: number;
  };
  totalQuotes: number;
  avgQuotesPerArtisan: number;
}

/**
 * Calcule toutes les métriques SaaS à partir d'un tableau d'artisans.
 * Les artisans "churned" ou "suspended" ne comptent pas dans le MRR.
 */
export function computeSaasMetrics(artisans: ArtisanRecord[]): SaasMetrics {
  const total = artisans.length;
  const active = artisans.filter(a => a.status === 'active');
  const trial  = artisans.filter(a => a.status === 'trial');
  const churned = artisans.filter(a => a.status === 'churned' || a.status === 'suspended');

  // MRR = somme des frais mensuels des artisans actifs uniquement
  const mrr = active.reduce((sum, a) => sum + a.monthly_fee, 0);

  // Breakdown par plan (artisans actifs uniquement)
  const planBreakdown = {
    gratuit: active.filter(a => a.plan === 'gratuit').length,
    vip:     active.filter(a => a.plan === 'vip').length,
    pro:     active.filter(a => a.plan === 'pro').length,
  };

  // Churn rate (% du total)
  const churnRate = total > 0 ? Math.round((churned.length / total) * 100) : 0;

  // Devis totaux (tous artisans confondus)
  const totalQuotes = artisans.reduce((sum, a) => sum + (a.quotes_count ?? 0), 0);
  const avgQuotesPerArtisan = total > 0 ? Math.round((totalQuotes / total) * 10) / 10 : 0;

  return {
    mrr: Math.round(mrr * 100) / 100,
    totalArtisans: total,
    activeArtisans: active.length,
    trialArtisans: trial.length,
    churnRate,
    planBreakdown,
    totalQuotes,
    avgQuotesPerArtisan,
  };
}

/**
 * Formate une valeur MRR en euros (ex: 285.00 → "285,00 €")
 */
export function formatMrr(value: number): string {
  return value.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });
}
