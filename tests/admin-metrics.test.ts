/**
 * Tests TDD — Moteur Métriques SaaS Admin (Task 6)
 * npx tsx --test tests/admin-metrics.test.ts
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { computeSaasMetrics, type ArtisanRecord } from '../src/services/adminMetrics.ts';

const mockArtisans: ArtisanRecord[] = [
  { id: '1', email: 'alice@example.com', plan: 'pro',     monthly_fee: 19,   created_at: '2026-09-01', status: 'active',    quotes_count: 12 },
  { id: '2', email: 'bob@example.com',   plan: 'vip',     monthly_fee: 9.5,  created_at: '2026-09-15', status: 'active',    quotes_count: 5 },
  { id: '3', email: 'carol@example.com', plan: 'gratuit', monthly_fee: 0,    created_at: '2026-10-01', status: 'active',    quotes_count: 2 },
  { id: '4', email: 'dave@example.com',  plan: 'pro',     monthly_fee: 19,   created_at: '2026-08-01', status: 'churned',   quotes_count: 0 },
  { id: '5', email: 'eve@example.com',   plan: 'vip',     monthly_fee: 9.5,  created_at: '2026-10-20', status: 'trial',     quotes_count: 1 },
];

describe('computeSaasMetrics', () => {
  it('calcule le MRR correctement (actifs payants uniquement)', () => {
    const metrics = computeSaasMetrics(mockArtisans);
    // alice (19) + bob (9.5) = 28.5 (carol gratuit, dave churned, eve trial)
    assert.strictEqual(metrics.mrr, 28.5);
  });

  it('compte les artisans par plan', () => {
    const metrics = computeSaasMetrics(mockArtisans);
    assert.strictEqual(metrics.planBreakdown.pro,     1); // alice active
    assert.strictEqual(metrics.planBreakdown.vip,     1); // bob active
    assert.strictEqual(metrics.planBreakdown.gratuit, 1); // carol active
  });

  it('calcule le taux de churn', () => {
    const metrics = computeSaasMetrics(mockArtisans);
    // 1 churned / 5 total = 20%
    assert.strictEqual(metrics.churnRate, 20);
  });

  it('calcule le total devis générés', () => {
    const metrics = computeSaasMetrics(mockArtisans);
    assert.strictEqual(metrics.totalQuotes, 20); // 12+5+2+0+1
  });

  it('retourne le nombre total artisans', () => {
    const metrics = computeSaasMetrics(mockArtisans);
    assert.strictEqual(metrics.totalArtisans, 5);
    assert.strictEqual(metrics.activeArtisans, 3); // active seulement
    assert.strictEqual(metrics.trialArtisans, 1);
  });
});
