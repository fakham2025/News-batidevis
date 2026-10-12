import { FileCheck2, ShieldCheck, Mail, Phone, Lock } from 'lucide-react';

interface FooterProps {
  onOpenLegal: (type: 'mentions' | 'cgu' | 'privacy' | 'contact') => void;
  onOpenDeployGuide?: () => void;
  onOpenAdmin?: () => void;
}

export function Footer({ onOpenLegal, onOpenAdmin }: FooterProps) {
  return (
    <footer className="bg-gray-950 text-gray-400 pt-12 pb-24 sm:py-16 border-t border-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 pb-12 border-b border-gray-800">
          
          {/* Brand & Tagline */}
          <div className="md:col-span-6 space-y-4 text-left">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <span className="font-heading font-extrabold text-2xl tracking-tight text-white">
                Bâti<span className="text-blue-500">Devis</span>
              </span>
              <span className="bg-blue-950 text-blue-300 font-mono text-xs font-bold px-2 py-0.5 rounded border border-blue-800/80">
                2026 Ready
              </span>
            </div>

            <p className="font-sans text-sm text-slate-400 max-w-md leading-relaxed">
              Le logiciel devis facture artisan qui comprend votre métier. Conçu pour faire gagner du temps aux professionnels du bâtiment et garantir une conformité sans faille.
            </p>

            <div className="flex items-center gap-4 text-xs text-slate-500 pt-1 font-sans">
              <span className="flex items-center gap-1.5 text-slate-400">
                <ShieldCheck className="w-4 h-4 text-blue-400" /> Données hébergées en France (RGPD)
              </span>
            </div>
          </div>

          {/* Links & Legal */}
          <div className="md:col-span-3 space-y-3 text-left">
            <div className="text-xs uppercase font-bold tracking-wider text-gray-300">
              Informations légales
            </div>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => onOpenLegal('mentions')}
                  className="hover:text-white hover:underline transition-colors cursor-pointer text-left"
                >
                  Mentions légales
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenLegal('cgu')}
                  className="hover:text-white hover:underline transition-colors cursor-pointer text-left"
                >
                  Conditions Générales d'Utilisation (CGU)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenLegal('privacy')}
                  className="hover:text-white hover:underline transition-colors cursor-pointer text-left"
                >
                  Politique de confidentialité (RGPD)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenLegal('contact')}
                  className="hover:text-white hover:underline transition-colors cursor-pointer text-left"
                >
                  Contact & Support
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Direct & Support */}
          <div className="md:col-span-3 space-y-3 text-left">
            <div className="text-xs uppercase font-bold tracking-wider text-gray-300">
              Assistance & Contact
            </div>
            <div className="space-y-2 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-400" />
                <a href="mailto:contact@batidevis.fr" className="hover:text-white transition-colors">
                  contact@batidevis.fr
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-400" />
                <span>Support artisan basé à Nantes</span>
              </div>
            </div>
          </div>

        </div>

        {/* Copyright bottom line */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-1.5 select-none">
            <span 
              onClick={() => {
                // Secret triple click to open admin
                const now = Date.now();
                const lastClick = (window as any).__lastAdminClick || 0;
                const clickCount = ((window as any).__adminClickCount || 0) + 1;
                (window as any).__lastAdminClick = now;
                
                if (now - lastClick < 600) {
                  (window as any).__adminClickCount = clickCount;
                  if (clickCount >= 3) {
                    (window as any).__adminClickCount = 0;
                    onOpenAdmin?.();
                  }
                } else {
                  (window as any).__adminClickCount = 1;
                }
              }}
              className="cursor-default"
            >
              © 2026 BâtiDevis. Tous droits réservés.
            </span>
            {onOpenAdmin && (
              <button
                type="button"
                onClick={onOpenAdmin}
                tabIndex={-1}
                aria-hidden="true"
                className="w-1.5 h-1.5 rounded-full bg-gray-600/20 hover:bg-gray-500/40 transition-colors cursor-default"
              />
            )}
          </div>
          <div className="flex items-center gap-4 text-gray-500">
            <span>Fait avec fierté pour les artisans de France</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
