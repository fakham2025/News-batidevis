/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { COMPARATIFS } from '@/src/data/comparatifs';
import { ComparatifPageView } from '@/src/components/ComparatifPageView';

interface PageProps {
  params: {
    slug: string;
  };
}

/**
 * Next.js 14 App Router: Pre-generate the 4 SEO conquest pages at build time.
 * This guarantees 100% static output for instant loading and optimal crawling.
 */
export async function generateStaticParams() {
  return Object.keys(COMPARATIFS).map((slug) => ({
    slug,
  }));
}

/**
 * Dynamic Next.js 14 SEO Metadata generator with canonical, OpenGraph, and Twitter tags.
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const data = COMPARATIFS[params.slug];
  if (!data) {
    return {
      title: 'Comparatif non trouvé | BâtiDevis',
      description: 'Page de comparatif introuvable.'
    };
  }

  return {
    title: `${data.title} | BâtiDevis`,
    description: data.meta_description,
    keywords: data.mots_cles,
    alternates: {
      canonical: data.canonical,
    },
    openGraph: {
      title: data.title,
      description: data.meta_description,
      url: data.canonical,
      siteName: 'BâtiDevis',
      locale: 'fr_FR',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: data.title,
      description: data.meta_description,
    },
  };
}

export default function ComparatifPage({ params }: PageProps) {
  const data = COMPARATIFS[params.slug];
  if (!data) {
    notFound();
  }

  return <ComparatifPageView slug={params.slug} />;
}
