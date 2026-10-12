/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ProblemSection } from './components/ProblemSection';
import { SolutionSection } from './components/SolutionSection';
import { ComparisonSection } from './components/ComparisonSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { FaqSection } from './components/FaqSection';
import { WaitlistFormSection } from './components/WaitlistFormSection';
import { Footer } from './components/Footer';
import { DemoModal } from './components/DemoModal';
import { LegalModal } from './components/LegalModal';
import { VercelDeployGuideModal } from './components/VercelDeployGuideModal';

export default function App() {
  const [demoOpen, setDemoOpen] = useState(false);
  const [legalType, setLegalType] = useState<'mentions' | 'cgu' | 'privacy' | 'contact' | null>(null);
  const [deployGuideOpen, setDeployGuideOpen] = useState(false);

  const scrollToWaitlist = () => {
    const el = document.getElementById('waitlist');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Navigation bar with banner notice */}
      <Navbar
        onOpenDemo={() => setDemoOpen(true)}
        onOpenDeployGuide={() => setDeployGuideOpen(true)}
      />

      <main className="flex-1">
        {/* 1. HERO SECTION */}
        <HeroSection
          onOpenDemo={() => setDemoOpen(true)}
          onScrollToWaitlist={scrollToWaitlist}
        />

        {/* 2. SECTION PROBLÈME (3 cartes) */}
        <ProblemSection />

        {/* 3. SECTION SOLUTION (3 features) */}
        <SolutionSection
          onOpenDemo={() => setDemoOpen(true)}
          onScrollToWaitlist={scrollToWaitlist}
        />

        {/* 4. SECTION COMPARAISON (Tableau 2 colonnes) */}
        <ComparisonSection
          onScrollToWaitlist={scrollToWaitlist}
        />

        {/* 5. SECTION TÉMOIGNAGES (Cards artisans) */}
        <TestimonialsSection />

        {/* 6. SECTION FAQ (Accordion interactif) */}
        <FaqSection />

        {/* 7. SECTION FORMULAIRE (Waitlist conversion >10%) */}
        <WaitlistFormSection />
      </main>

      {/* 8. FOOTER */}
      <Footer
        onOpenLegal={(type) => setLegalType(type)}
        onOpenDeployGuide={() => setDeployGuideOpen(true)}
      />

      {/* Interactive 60s Demo Modal */}
      <DemoModal
        isOpen={demoOpen}
        onClose={() => setDemoOpen(false)}
        onGoToWaitlist={scrollToWaitlist}
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
    </div>
  );
}
