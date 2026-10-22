<!-- TODO HUMAIN : remplacer les placeholders par les données réelles vérifiées avant publication. Ne jamais inventer un prix concurrent. -->

import React from 'react';
import { COMPARATIFS } from '@/src/data/comparatifs';
import { ComparatifPageView } from '@/src/components/ComparatifPageView';

export const metadata = {
  title: 'Logiciel devis avec génération automatique : le comparatif honnête 2026',
  description: 'Quatre logiciels de devis avec génération automatique comparés sans langue de bois : Quotepro, Estimapro, Turbotravaux, BATIDEVIS. Le piège du devis auto qui oublie les mentions légales.',
  keywords: ['logiciel devis génération automatique', 'devis pour artisans', 'logiciel devis facture artisan', 'comparatif logiciel devis 2026'],
  alternates: {
    canonical: 'https://batidevis.fr/comparatif/logiciel-devis-generation-automatique',
  },
};

export default function LogicielDevisGenerationAutomatiquePage() {
  return (
    <ComparatifPageView
      slug="logiciel-devis-generation-automatique"
      onBackToHome={() => {
        if (typeof window !== 'undefined') window.location.href = '/';
      }}
      onNavigateToSlug={(newSlug) => {
        if (typeof window !== 'undefined') window.location.href = `/comparatif/${newSlug}`;
      }}
    />
  );
}
