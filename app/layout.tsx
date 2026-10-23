/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  themeColor: '#090D16',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'BâtiDevis 2026 - Logiciel Devis Facture Artisan',
  description: 'Application mobile de devis et factures pour artisans du bâtiment. Générez des devis conformes aux mentions obligatoires 2026 en 60 secondes depuis votre téléphone.',
  manifest: '/manifest.json',
  icons: {
    icon: '/icon.svg',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: 'Le logiciel devis facture artisan qui comprend votre métier',
    description: 'Générez des devis conformes en 60 secondes depuis votre téléphone. Accès anticipé -50%.',
    type: 'website',
    siteName: 'BâtiDevis',
    locale: 'fr_FR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Le logiciel devis facture artisan qui comprend votre métier',
    description: 'Générez des devis conformes en 60 secondes depuis votre téléphone. Accès anticipé -50%.',
  },
};

const jsonLdGlobal = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'SoftwareApplication',
      '@id': 'https://batidevis.fr/#software',
      'name': 'BâtiDevis',
      'applicationCategory': 'BusinessApplication',
      'operatingSystem': 'iOS, Android, Web (PWA)',
      'description': "Application mobile de devis et factures pour artisans du bâtiment conforme aux 16 mentions obligatoires et à la réforme de la facture électronique Factur-X 2026.",
      'offers': {
        '@type': 'Offer',
        'price': '9.50',
        'priceCurrency': 'EUR',
        'priceValidUntil': '2026-12-31',
        'description': "Tarif cohorte fondateurs à -50% à vie (9,50 € / mois au lieu de 19 € / mois)"
      }
      // Note: Retrait intentionnel du faux avis 'aggregateRating' (4.9/247 reviews) conformément à l'étape 8 du cahier des charges
    },
    {
      '@type': 'FAQPage',
      '@id': 'https://batidevis.fr/#faq',
      'mainEntity': [
        {
          '@type': 'Question',
          'name': 'Quelles sont les mentions obligatoires sur un devis artisan en 2026 ?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': "BâtiDevis intègre automatiquement les 16 mentions obligatoires : identité de l'entreprise (SIRET, décennale complète avec zone géographique et assureur), coordonnées client, désignation détaillée des prestations, prix HT/TTC, taux de TVA (0, 5.5, 10, 20%) ou mention art. 293 B, acompte et date de début estimée."
          }
        },
        {
          '@type': 'Question',
          'name': 'L\'application fonctionne-t-elle hors connexion sur chantier ?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': "Oui, 100%. Vous pouvez créer, modifier et imprimer des devis sans connexion internet grâce au stockage local sécurisé. Tout se synchronise automatiquement dès le retour du réseau."
          }
        },
        {
          '@type': 'Question',
          'name': 'Est-ce prêt pour la réforme de la facturation électronique 2026-2027 ?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': "Absolument. BâtiDevis est conçu pour l'export Factur-X (format hybride PDF + XML normé) compatible avec le Portail Public de Facturation (PPF), sans surcoût ni dépendance."
          }
        },
        {
          '@type': 'Question',
          'name': 'Combien coûte l\'application ?',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': "L'abonnement standard est de 19 €/mois (sans engagement). Les 20 artisans de la cohorte fondateurs bénéficient d'une place gratuite en bêta ou d'un tarif bloqué à -50% à vie (9,50 €/mois)."
          }
        }
      ]
    }
  ]
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700;800;900&display=swap" 
          rel="stylesheet" 
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdGlobal) }}
        />
      </head>
      <body className="bg-white text-slate-900 font-sans antialiased selection:bg-blue-100 selection:text-blue-900">
        {children}
      </body>
    </html>
  );
}
