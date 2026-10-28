import { Link } from 'react-router-dom';
import { FileCheck2, ShieldCheck, Mail, Phone, PlusCircle, UserCheck } from 'lucide-react';

interface FooterProps {
  onOpenLegal: (type: 'mentions' | 'cgu' | 'privacy' | 'contact') => void;
  onOpenDeployGuide?: () => void;
}

export function Footer({ onOpenLegal }: FooterProps) {
  return (
    <footer className="bg-gray-950 text-gray-400 py-12 sm:py-16 border-t border-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 pb-12 border-b border-gray-800">
          
          {/* Brand & Tagline */}
          <div className="md:col-span-5 space-y-4 text-left">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <span className="font-heading font-extrabold text-2xl tracking-tight text-white">
                BÃ¢ti<span className="text-blue-500">Devis</span>
              </span>
              <span className="bg-blue-950 text-blue-300 font-mono text-xs font-bold px-2 py-0.5 rounded border border-blue-800/80">
                2026 Ready
              </span>
            </div>

            <p className="font-sans text-sm text-slate-400 max-w-md leading-relaxed">
              Le logiciel devis facture artisan qui comprend votre mÃ©tier. ConÃ§u pour faire gagner du temps aux professionnels du bÃ¢timent et garantir une conformitÃ© sans faille.
            </p>

            <div className="flex items-center gap-4 text-xs text-slate-500 pt-1 font-sans">
              <span className="flex items-center gap-1.5 text-slate-400">
                <ShieldCheck className="w-4 h-4 text-blue-400" /> DonnÃ©es chiffrÃ©es & hÃ©bergÃ©es en France (RGPD)
              </span>
            </div>
          </div>

          {/* Quick App Navigation */}
          <div className="md:col-span-2 space-y-3 text-left">
            <div className="text-xs uppercase font-bold tracking-wider text-gray-300 font-mono">
              Application
            </div>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  to="/creer-devis"
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 text-left text-slate-300"
                >
                  <PlusCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span>CrÃ©er un devis</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/app/dashboard"
                  className="hover:text-blue-400 transition-colors flex items-center gap-1.5 text-left text-slate-300"
                >
                  <UserCheck className="w-3.5 h-3.5 text-blue-400" />
                  <span>Espace factures</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Links & Legal */}
          <div className="md:col-span-2 space-y-3 text-left">
            <div className="text-xs uppercase font-bold tracking-wider text-gray-300 font-mono">
              LÃ©gal
            </div>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => onOpenLegal('mentions')}
                  className="hover:text-white hover:underline transition-colors cursor-pointer text-left"
                >
                  Mentions lÃ©gales
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenLegal('cgu')}
                  className="hover:text-white hover:underline transition-colors cursor-pointer text-left"
                >
                  CGU & Vente
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenLegal('privacy')}
                  className="hover:text-white hover:underline transition-colors cursor-pointer text-left"
                >
                  ConfidentialitÃ©
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenLegal('contact')}
                  className="hover:text-white hover:underline transition-colors cursor-pointer text-left"
                >
                  Contact support
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Direct */}
          <div className="md:col-span-3 space-y-3 text-left">
            <div className="text-xs uppercase font-bold tracking-wider text-gray-300 font-mono">
              Support direct
            </div>
            <div className="space-y-2 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <a href="mailto:contact@batidevis.fr" className="hover:text-white transition-colors">
                  contact@batidevis.fr
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Support artisan basÃ© Ã  Nantes</span>
              </div>
            </div>
          </div>

        </div>

        {/* Copyright bottom line */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          {/* Lien admin discret â€” visible uniquement si on sait qu'il existe */}
          <div>
            Â© 2026 BÃ¢tiDevis. Tous droits rÃ©servÃ©s.
          </div>
          <div className="flex items-center gap-1 text-gray-500"><span>Conçu avec fierté pour les artisans de France</span><Link to="/admin" className="opacity-0 hover:opacity-30 ml-2 transition-opacity">·</Link></div>
        </div>

      </div>
    </footer>
  );
}

