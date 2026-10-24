'use client';

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */


import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { Navbar } from './Navbar';
import { HeroSection } from './HeroSection';
import { ProblemSection } from './ProblemSection';
import { SolutionSection } from './SolutionSection';
import { ComparisonSection } from './ComparisonSection';
import { FoundersSection } from './FoundersSection';
import { FaqSection } from './FaqSection';
import { WaitlistFormSection } from './WaitlistFormSection';
import { Footer } from './Footer';
import { DemoModal } from './DemoModal';
import { DevisBuilderModal } from './DevisBuilderModal';
import { OnboardingModal } from './OnboardingModal';
import { LegalModal } from './LegalModal';
import { VercelDeployGuideModal } from './VercelDeployGuideModal';
import { AdminBackendModal } from './AdminBackendModal';
import { ArtisanDashboardModal } from './ArtisanDashboardModal';
import { OfflineIndicator } from './OfflineIndicator';
import { initAuth } from '../services/googleSheets';
import { Kit } from '../services/db';

export function LandingPage() {
  const [demoOpen, setDemoOpen] = useState(false);
  const [devisBuilderOpen, setDevisBuilderOpen] = useState(false);
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const [initialKitForBuilder, setInitialKitForBuilder] = useState<Kit | null>(null);
  const [legalType, setLegalType] = useState<'mentions' | 'cgu' | 'privacy' | 'contact' | null>(null);
  const [deployGuideOpen, setDeployGuideOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [artisanDashboardOpen, setArtisanDashboardOpen] = useState(false);

  // Authentication & Google Workspace token state (admin / owner only)
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Initialize Firebase Auth listener for Google Workspace session
  useEffect(() => {
    const unsubscribe = initAuth(
      (currentUser, currentToken) => {
        setUser(currentUser);
        if (currentToken) {
          setToken(currentToken);
        }
      },
      () => {
        setUser(null);
        setToken(null);
      }
    );

    // Support opening admin via #admin hash or keyboard shortcut Ctrl+Shift+A
    const handleHash = () => {
      if (typeof window === 'undefined') return;
      const hash = window.location.hash;
      if (hash === '#admin') {
        setAdminOpen(true);
      } else if (hash === '#builder' || hash === '#devis') {
        setDevisBuilderOpen(true);
      } else if (hash === '#welcome' || hash === '#onboarding') {
        setOnboardingOpen(true);
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        setAdminOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    // Register service worker for offline capabilities
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(() => {});
      });
    }

    return () => {
      unsubscribe();
      window.removeEventListener('hashchange', handleHash);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const scrollToWaitlist = () => {
    if (typeof document === 'undefined') return;
    const el = document.getElementById('waitlist');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenDevisBuilderWithKit = (kit?: Kit) => {
    if (kit) {
      setInitialKitForBuilder(kit);
    }
    setDevisBuilderOpen(true);
  };

  const handleCloseAdmin = () => {
    setAdminOpen(false);
    if (typeof window !== 'undefined' && window.location.hash === '#admin') {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  };

  const handleNavigateToComparatif = (slug: string) => {
    if (typeof window !== 'undefined') {
      window.location.href = `/comparatif/${slug}`;
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* 100% Clean Customer-Facing Navigation Bar */}
      <Navbar
        onOpenDemo={() => setDemoOpen(true)}
        onOpenDevisBuilder={() => setDevisBuilderOpen(true)}
        onOpenOnboarding={() => setOnboardingOpen(true)}
        onOpenDeployGuide={() => setDeployGuideOpen(true)}
      />

      <main className="flex-1">
        {/* 1. HERO SECTION */}
        <HeroSection
          onOpenDemo={() => setDemoOpen(true)}
          onScrollToWaitlist={scrollToWaitlist}
          onOpenDevisBuilder={() => setDevisBuilderOpen(true)}
          onOpenOnboarding={() => setOnboardingOpen(true)}
        />

        {/* 2. SECTION PROBLÈME (4 cartes avec trésorerie) */}
        <ProblemSection />

        {/* 3. SECTION SOLUTION (3 features + bandeau teaser cap acompte/relance + Kits Chantier) */}
        <SolutionSection
          onOpenDemo={() => setDemoOpen(true)}
          onScrollToWaitlist={scrollToWaitlist}
          onOpenDevisBuilder={handleOpenDevisBuilderWithKit}
        />

        {/* 4. SECTION COMPARAISON (Tableau 2 colonnes + accès comparatifs SEO) */}
        <ComparisonSection
          onScrollToWaitlist={scrollToWaitlist}
          onNavigateToComparatif={handleNavigateToComparatif}
        />

        {/* 5. SECTION PROGRAMME FONDATEURS (quota 20 artisans) */}
        <FoundersSection
          onScrollToWaitlist={scrollToWaitlist}
        />

        {/* 6. SECTION FAQ (Accordion interactif avec Kits Chantier & Hors-ligne) */}
        <FaqSection />

        {/* 7. SECTION FORMULAIRE WAITLIST (avec choix d'offre gratuit / -50% à vie) */}
        <WaitlistFormSection 
          token={token} 
          onOpenPrivacy={() => setLegalType('privacy')}
          onOpenArtisanDashboard={() => setArtisanDashboardOpen(true)}
        />
      </main>

      {/* 8. FOOTER avec déclencheur discret d'accès Admin et liens SEO comparatifs */}
      <Footer
        onOpenLegal={(type) => setLegalType(type)}
        onOpenDeployGuide={() => setDeployGuideOpen(true)}
        onOpenAdmin={() => setAdminOpen(true)}
        onNavigateToComparatif={handleNavigateToComparatif}
      />

      {/* Interactive Loom 90s Demo Modal */}
      <DemoModal
        isOpen={demoOpen}
        onClose={() => setDemoOpen(false)}
        onGoToWaitlist={scrollToWaitlist}
        onOpenDevisBuilder={() => setDevisBuilderOpen(true)}
      />

      {/* Cœur Produit MVP : DevisBuilder Modal avec Kits Chantier & Offline */}
      <DevisBuilderModal
        isOpen={devisBuilderOpen}
        onClose={() => {
          setDevisBuilderOpen(false);
          setInitialKitForBuilder(null);
        }}
        initialKit={initialKitForBuilder}
        onGoToWaitlist={scrollToWaitlist}
      />

      {/* Onboarding 3 étapes (/welcome) */}
      <OnboardingModal
        isOpen={onboardingOpen}
        onClose={() => setOnboardingOpen(false)}
        onComplete={(recommendedKit) => {
          setOnboardingOpen(false);
          handleOpenDevisBuilderWithKit(recommendedKit);
        }}
      />

      {/* E-Reporting Dashboard Modal Artisan */}
      <ArtisanDashboardModal
        isOpen={artisanDashboardOpen}
        onClose={() => setArtisanDashboardOpen(false)}
        onOpenDevisBuilder={() => {
          setArtisanDashboardOpen(false);
          setDevisBuilderOpen(true);
        }}
      />

      {/* Dedicated Private Admin & Google Sheets Backend Modal (For Owner Only) */}
      <AdminBackendModal
        isOpen={adminOpen}
        onClose={handleCloseAdmin}
        user={user}
        token={token}
        onAuthChange={(newUser, newToken) => {
          setUser(newUser);
          setToken(newToken);
        }}
      />

      {/* Legal & Privacy Modal */}
      <LegalModal
        type={legalType}
        onClose={() => setLegalType(null)}
      />

      {/* Next.js 14 & Vercel Deploy Guide Modal */}
      <VercelDeployGuideModal
        isOpen={deployGuideOpen}
        onClose={() => setDeployGuideOpen(false)}
      />

      {/* Offline Indicator & Connectivity Toast */}
      <OfflineIndicator />
    </div>
  );
}
