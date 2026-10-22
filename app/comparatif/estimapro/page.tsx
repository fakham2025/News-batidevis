<!-- TODO HUMAIN : remplacer les placeholders par les données réelles vérifiées avant publication. Ne jamais inventer un prix concurrent. -->

import React from 'react';
import { COMPARATIFS } from '@/src/data/comparatifs';
import { ComparatifPageView } from '@/src/components/ComparatifPageView';

export const metadata = {
  title: 'Alternative à Estimapro : devis conformes 2026 sur mobile, même sans réseau',
  description: 'Estimapro est solide au bureau, mais l\'artisan est sur le chantier. Comparatif BATIDEVIS vs Estimapro : mobile-first, hors-ligne, mentions légales auto, calcul de marge.',
  keywords: ['logiciel devis estimapro', 'estimapro alternative', 'devis artisan prix', 'suite rapide devis'],
  alternates: {
    canonical: 'https://batidevis.fr/comparatif/estimapro',
  },
};

export default function EstimaproComparatifPage() {
  return (
    <ComparatifPageView
      slug="estimapro"
      onBackToHome={() => {
        if (typeof window !== 'undefined') window.location.href = '/';
      }}
      onNavigateToSlug={(newSlug) => {
        if (typeof window !== 'undefined') window.location.href = `/comparatif/${newSlug}`;
      }}
    />
  );
}
