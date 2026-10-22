<!-- TODO HUMAIN : remplacer les placeholders par les données réelles vérifiées avant publication. Ne jamais inventer un prix concurrent. -->

import React from 'react';
import { COMPARATIFS } from '@/src/data/comparatifs';
import { ComparatifPageView } from '@/src/components/ComparatifPageView';

export const metadata = {
  title: 'BATIDEVIS vs Quotepro : le logiciel devis artisan qui calcule ta marge et ton acompte',
  description: 'Comparatif honnête BATIDEVIS et Quotepro : conformité 2026, usage mobile sur chantier, mode hors-ligne, calcul de marge. Ce que Quotepro fait bien, et où BATIDEVIS déplace la valeur.',
  keywords: ['logiciel devis quotepro', 'génération automatique devis', 'devis artisan en ligne', 'quotepro alternative'],
  alternates: {
    canonical: 'https://batidevis.fr/comparatif/quotepro',
  },
};

export default function QuoteproComparatifPage() {
  return (
    <ComparatifPageView
      slug="quotepro"
      onBackToHome={() => {
        if (typeof window !== 'undefined') window.location.href = '/';
      }}
      onNavigateToSlug={(newSlug) => {
        if (typeof window !== 'undefined') window.location.href = `/comparatif/${newSlug}`;
      }}
    />
  );
}
