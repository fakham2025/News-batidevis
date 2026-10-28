import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileCheck2, 
  Menu, 
  X, 
  ArrowRight, 
  ShieldCheck, 
  Play, 
  PlusCircle, 
  UserCheck 
} from 'lucide-react';

interface NavbarProps {
  onOpenDemo: () => void;
  onOpenDeployGuide?: () => void;
}

export function Navbar({ onOpenDemo }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showMobileBottomBar, setShowMobileBottomBar] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      setShowMobileBottomBar(window.scrollY > 350);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Top Banner Notice - 2026 Sleek Cobalt & Slate */}
      <div className="bg-slate-950 text-white text-xs font-mono py-2 px-3 sm:px-4 border-b border-slate-800 text-center">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap">
          <span className="text-slate-300 text-[11px] sm:text-xs">
            Tarif VIP <strong className="text-white font-bold">9,50 € / mois à vie</strong> (-50%) réservé aux 300 premiers artisans.
          </span>
          <button
            onClick={() => scrollToSection('waitlist')}
            className="inline-flex items-center gap-1 font-bold text-blue-400 hover:text-blue-300 transition-colors ml-1 cursor-pointer text-[11px] sm:text-xs"
          >
            Bloquer ma place <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Main Navigation */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-slate-950/95 backdrop-blur-md shadow-lg border-b border-slate-800 py-2.5 sm:py-3 text-white'
            : 'bg-slate-950 py-3 sm:py-5 border-b border-slate-900 text-white'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-2.5 sm:gap-3 group focus:outline-none"
              aria-label="BâtiDevis Accueil"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:bg-blue-700 transition-colors shrink-0">
                <FileCheck2 className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-heading font-extrabold text-lg sm:text-xl tracking-tight text-white">
                    Bâti<span className="text-blue-500">Devis</span>
                  </span>
                  <span className="bg-blue-950 text-blue-300 text-[9px] sm:text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border border-blue-800/80 flex items-center gap-0.5">
                    <ShieldCheck className="w-2.5 h-2.5" /> 2026
                  </span>
                </div>
                <span className="text-[10px] sm:text-[11px] text-slate-400 font-sans hidden sm:block">
                  L'app devis & facture des artisans
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-7 lg:gap-8 font-sans">
              <button
                onClick={() => scrollToSection('probleme')}
                className="text-sm font-medium text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                Pourquoi ?
              </button>
              <button
                onClick={() => scrollToSection('solution')}
                className="text-sm font-medium text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                Fonctionnalités
              </button>
              <button
                onClick={() => scrollToSection('comparaison')}
                className="text-sm font-medium text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                Comparatif
              </button>
              <button
                onClick={() => scrollToSection('temoignages')}
                className="text-sm font-medium text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                Avis Artisans
              </button>
              <button
                onClick={() => scrollToSection('faq')}
                className="text-sm font-medium text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                FAQ
              </button>
            </nav>

            {/* Desktop Action buttons */}
            <div className="hidden sm:flex items-center gap-3">
              <Link
                to="/app/dashboard"
                className="px-3.5 py-2 text-xs font-heading font-semibold text-slate-200 hover:text-white bg-slate-900 border border-slate-700/80 rounded-xl hover:border-slate-500 transition-all flex items-center gap-1.5"
              >
                <UserCheck className="w-3.5 h-3.5 text-blue-400" />
                <span>Espace Artisan</span>
              </Link>
              <Link
                to="/creer-devis"
                className="px-4 py-2 text-xs font-heading font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-600/30 rounded-xl transition-all flex items-center gap-1.5"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Créer un devis en 60s</span>
              </Link>
            </div>

            {/* Mobile Actions: 1-Tap CTA + Hamburger */}
            <div className="flex items-center gap-2 md:hidden">
              <Link
                to="/creer-devis"
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-heading font-bold text-xs shadow-sm transition-all flex items-center gap-1"
              >
                <PlusCircle className="w-3 h-3" />
                <span>Devis 60s</span>
              </Link>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-slate-200 hover:text-white rounded-lg bg-slate-900 border border-slate-800 focus:outline-none cursor-pointer"
                aria-label="Menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-800/80 bg-slate-950 px-4 pt-3 pb-6 space-y-3 text-slate-200 shadow-2xl animate-in slide-in-from-top-2 duration-200">
            <Link
              to="/creer-devis"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-heading font-bold text-sm shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Créer mon premier devis (Sans compte)</span>
            </Link>

            <Link
              to="/app/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 font-heading font-semibold text-sm flex items-center justify-center gap-2"
            >
              <UserCheck className="w-4 h-4 text-blue-400" />
              <span>Mon Espace Artisan & Factures</span>
            </Link>

            <button
              onClick={() => scrollToSection('probleme')}
              className="block w-full text-left py-2 text-sm font-heading font-medium text-slate-200 hover:text-blue-400 border-b border-slate-900"
            >
              Pourquoi changer ?
            </button>
            <button
              onClick={() => scrollToSection('solution')}
              className="block w-full text-left py-2 text-sm font-heading font-medium text-slate-200 hover:text-blue-400 border-b border-slate-900"
            >
              Fonctionnalités & Factures 2026
            </button>
            <button
              onClick={() => scrollToSection('comparaison')}
              className="block w-full text-left py-2 text-sm font-heading font-medium text-slate-200 hover:text-blue-400 border-b border-slate-900"
            >
              Tableau comparatif
            </button>
            <button
              onClick={() => scrollToSection('temoignages')}
              className="block w-full text-left py-2 text-sm font-heading font-medium text-slate-200 hover:text-blue-400 border-b border-slate-900"
            >
              Avis Artisans
            </button>
            <button
              onClick={() => scrollToSection('faq')}
              className="block w-full text-left py-2 text-sm font-heading font-medium text-slate-200 hover:text-blue-400 border-b border-slate-900"
            >
              Questions fréquentes
            </button>
            
            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenDemo();
                }}
                className="w-full py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 font-heading text-xs flex items-center justify-center gap-2"
              >
                <Play className="w-3.5 h-3.5 fill-blue-400 text-blue-400" />
                <span>Tester la démo guidée (60s)</span>
              </button>
              <button
                onClick={() => scrollToSection('waitlist')}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-heading font-bold text-xs shadow-md shadow-blue-600/30 flex items-center justify-center gap-2"
              >
                <span>Bloquer tarif VIP 9,50 € / mois (-50%)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </header>

      {/* 2026 MOBILE STICKY BOTTOM CONVERSION BAR */}
      <div 
        className={`fixed bottom-0 left-0 right-0 z-50 md:hidden bg-slate-950/95 backdrop-blur-md border-t border-slate-800 p-3 shadow-2xl transition-all duration-300 ${
          showMobileBottomBar ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="text-left min-w-0">
            <div className="font-heading font-bold text-white text-xs truncate">
              Tarif VIP : <span className="text-blue-400 font-mono">9,50 € / mois</span>
            </div>
            <div className="text-[10px] text-slate-400 font-sans truncate">
              Sans engagement • Sans carte bancaire
            </div>
          </div>

          <Link
            to="/creer-devis"
            className="shrink-0 px-4 py-2.5 rounded-xl bg-emerald-600 active:bg-emerald-700 text-white font-heading font-bold text-xs shadow-md shadow-emerald-600/30 flex items-center gap-1.5"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Devis en 60s</span>
          </Link>
        </div>
      </div>
    </>
  );
}
