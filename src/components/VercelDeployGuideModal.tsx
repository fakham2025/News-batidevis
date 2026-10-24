'use client';

import { useState } from 'react';
import { X, Copy, Check, Terminal, ExternalLink, FileCode, CheckCircle2 } from 'lucide-react';

interface VercelDeployGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function VercelDeployGuideModal({ isOpen, onClose }: VercelDeployGuideModalProps) {
  const [copiedTab, setCopiedTab] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTab(id);
    setTimeout(() => setCopiedTab(null), 2000);
  };

  const nextJsPageCode = `// app/page.tsx - Next.js 14 App Router
import { HeroSection } from "@/components/HeroSection";
import { ProblemSection } from "@/components/ProblemSection";
import { SolutionSection } from "@/components/SolutionSection";
import { ComparisonSection } from "@/components/ComparisonSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { FaqSection } from "@/components/FaqSection";
import { WaitlistFormSection } from "@/components/WaitlistFormSection";
import { Footer } from "@/components/Footer";

export const metadata = {
  title: "Logiciel Devis Facture Artisan | App Mobile Conforme 2026",
  description: "Application mobile de devis et factures pour artisans du bâtiment. Générez des devis conformes aux mentions obligatoires 2026 en 60 secondes depuis votre téléphone. Accès anticipé -50%.",
  openGraph: {
    title: "Le logiciel devis facture artisan qui comprend votre métier",
    description: "Générez des devis conformes en 60 secondes depuis votre téléphone. Accès anticipé -50%.",
    type: "website",
    locale: "fr_FR",
  },
};

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <ComparisonSection />
      <TestimonialsSection />
      <FaqSection />
      <WaitlistFormSection />
      <Footer />
    </main>
  );
}`;

  const tailwindConfig = `// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#2563eb",
          hover: "#1d4ed8",
        },
        secondary: "#f97316",
        success: "#22c55e",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl max-w-3xl w-full shadow-2xl p-6 sm:p-8 border border-gray-200 animate-in fade-in zoom-in-95 duration-200 max-h-[85vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-black text-white flex items-center justify-center font-bold">
              ▲
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Guide de déploiement Next.js 14 & Vercel
              </h3>
              <p className="text-xs text-gray-500">
                Prêt pour Vercel en 1 clic sans aucune variable d'environnement obligatoire
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="flex-1 overflow-y-auto space-y-6 pt-4 text-xs sm:text-sm text-gray-700">
          {/* Step 1: Vercel deploy steps */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-gray-900 text-sm flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs">1</span>
              Déploiement direct sur Vercel (Recommandé)
            </h4>
            <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 space-y-2 text-xs">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Poussez le projet sur GitHub / GitLab.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Rendez-vous sur <strong>vercel.com/new</strong> et importez votre dépôt.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Framework Preset détecté automatiquement : <strong>Vite</strong> ou <strong>Next.js</strong>.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Cliquez sur <strong>Deploy</strong> (aucune variable d'environnement requise pour le build).</span>
              </div>
            </div>
          </div>

          {/* Step 2: Next.js 14 Architecture */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-extrabold text-gray-900 text-sm flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs">2</span>
                Structure Next.js 14 (App Router)
              </h4>
              <button
                onClick={() => copyToClipboard(nextJsPageCode, 'page')}
                className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
              >
                {copiedTab === 'page' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Copier app/page.tsx</span>
              </button>
            </div>
            <pre className="p-3 bg-gray-950 text-gray-200 rounded-xl font-mono text-[11px] overflow-x-auto">
              {nextJsPageCode}
            </pre>
          </div>

          {/* Step 3: Tailwind Config */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-extrabold text-gray-900 text-sm flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs">3</span>
                Configuration tailwind.config.ts
              </h4>
              <button
                onClick={() => copyToClipboard(tailwindConfig, 'tailwind')}
                className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
              >
                {copiedTab === 'tailwind' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Copier config</span>
              </button>
            </div>
            <pre className="p-3 bg-gray-950 text-gray-200 rounded-xl font-mono text-[11px] overflow-x-auto">
              {tailwindConfig}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 mt-4 border-t border-gray-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold"
          >
            Fermer le guide
          </button>
        </div>

      </div>
    </div>
  );
}
