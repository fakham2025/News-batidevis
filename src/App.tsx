/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ProblemSection } from './components/ProblemSection';
import { SolutionSection } from './components/SolutionSection';
import { ComparisonSection } from './components/ComparisonSection';
import { FoundersSection } from './components/FoundersSection';
import { FaqSection } from './components/FaqSection';
import { WaitlistFormSection } from './components/WaitlistFormSection';
import { Footer } from './components/Footer';
import { DemoModal } from './components/DemoModal';
import { DevisBuilderModal } from './components/DevisBuilderModal';
import { OnboardingModal } from './components/OnboardingModal';
import { LegalModal } from './components/LegalModal';
import { VercelDeployGuideModal } from './components/VercelDeployGuideModal';
import { AdminBackendModal } from './components/AdminBackendModal';
import { OfflineIndicator } from './components/OfflineIndicator';
import { initAuth } from './services/googleSheets';
import { Kit } from './services/db';

export default function App() {
  const [demoOpen, setDemoOpen] = useState(false);
  const [devisBuilderOpen, setDevisBuilderOpen] = useState(false);
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const [initialKitForBuilder, setInitialKitForBuilder] = useState<Kit | null>(null);
  const [legalType, setLegalType] = useState<'mentions' | 'cgu' | 'privacy' | 'contact' | null>(null);
  const [deployGuideOpen, setDeployGuideOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);

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

    return () => {
      unsubscribe();
      window.removeEventListener('hashchange', handleHash);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const scrollToWaitlist = () => {
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
    if (window.location.hash === '#admin') {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
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

        {/* 2. SECTION PROBLÈME (3 cartes) */}
        <ProblemSection />

        {/* 3. SECTION SOLUTION (3 features + Killer Feature Kits Chantier) */}
        <SolutionSection
          onOpenDemo={() => setDemoOpen(true)}
          onScrollToWaitlist={scrollToWaitlist}
          onOpenDevisBuilder={handleOpenDevisBuilderWithKit}
        />

        {/* 4. SECTION COMPARAISON (Tableau 2 colonnes) */}
        <ComparisonSection
          onScrollToWaitlist={scrollToWaitlist}
        />

        {/* 5. SECTION PROGRAMME FONDATEURS (remplace faux témoignages, quota 20 artisans) */}
        <FoundersSection
          onScrollToWaitlist={scrollToWaitlist}
        />

        {/* 6. SECTION FAQ (Accordion interactif avec Kits Chantier & Hors-ligne) */}
        <FaqSection />

        {/* 7. SECTION FORMULAIRE WAITLIST (Département, TVA, UTM, RGPD) */}
        <WaitlistFormSection 
          token={token} 
          onOpenPrivacy={() => setLegalType('privacy')}
        />
      </main>

      {/* 8. FOOTER avec déclencheur discret d'accès Admin */}
      <Footer
        onOpenLegal={(type) => setLegalType(type)}
        onOpenDeployGuide={() => setDeployGuideOpen(true)}
        onOpenAdmin={() => setAdminOpen(true)}
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
