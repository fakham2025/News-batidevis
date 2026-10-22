<!-- TODO HUMAIN : remplacer les placeholders par les données réelles vérifiées avant publication. Ne jamais inventer un prix concurrent. -->

import React from 'react';
import { COMPARATIFS } from '@/src/data/comparatifs';
import { ComparatifPageView } from '@/src/components/ComparatifPageView';

export const metadata = {
  title: 'Turbotravaux : prix, avis et pourquoi les artisans regardent ailleurs en 2026',
  description: 'Turbotravaux prix et avis vérifiés. Ce que les utilisateurs reprochent, et l\'angle BATIDEVIS : prix transparent sans frais cachés, devis conforme sur mobile, protection de la marge.',
  keywords: ['turbotravaux prix', 'turbotravaux avis', 'devis artisan prix turbotravaux'],
  alternates: {
    canonical: 'https://batidevis.fr/comparatif/turbotravaux',
  },
};

export default function TurbotravauxComparatifPage() {
  return (
    <ComparatifPageView
      slug="turbotravaux"
      onBackToHome={() => {
        if (typeof window !== 'undefined') window.location.href = '/';
      }}
      onNavigateToSlug={(newSlug) => {
        if (typeof window !== 'undefined') window.location.href = `/comparatif/${newSlug}`;
      }}
    />
  );
}
