/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Download, Smartphone, X, Check, Share, PlusSquare } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  variant?: 'navbar' | 'footer' | 'banner';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ variant = 'navbar' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);

  // Si l'application est déjà exécutée en mode autonome (PWA installée), on masque le bouton
  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      const ok = await install();
      if (ok) {
        setInstallSuccess(true);
        setTimeout(() => setInstallSuccess(false), 3000);
      }
    } else if (isIOS) {
      setShowIOSGuide(true);
    }
  };

  // Rendu selon l'emplacement
  if (variant === 'navbar') {
    return (
      <>
        <button
          type="button"
          onClick={handleInstallClick}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-blue-400 hover:text-blue-300 border border-blue-500/30 text-xs font-heading font-semibold transition-all cursor-pointer shadow-xs"
          title="Installer BâtiDevis sur votre smartphone (100% hors-ligne)"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Installer l'App</span>
          <span className="sm:hidden">App PWA</span>
        </button>

        {/* Modale d'instructions pour iPhone / iPad Safari */}
        {showIOSGuide && (
          <div className="fixed inset-0 z-60 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl border border-slate-200 text-left">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <h4 className="font-heading font-bold text-sm text-slate-900">
                    Installer sur iPhone / iPad
                  </h4>
                </div>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs text-slate-600 font-sans leading-relaxed">
                Sur Safari iOS, l'installation se fait en 2 pressions sans passer par l'App Store :
              </p>

              <div className="space-y-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs text-slate-800 font-sans">
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                    1
                  </span>
                  <span>
                    Touchez l'icône <strong>Partager</strong> <Share className="w-3.5 h-3.5 inline text-blue-600" /> dans la barre de Safari (en bas sur iPhone, en haut sur iPad).
                  </span>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                    2
                  </span>
                  <span>
                    Faites défiler et sélectionnez <strong>« Sur l'écran d'accueil »</strong> <PlusSquare className="w-3.5 h-3.5 inline text-blue-600" />.
                  </span>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                    3
                  </span>
                  <span>
                    Touchez <strong>Ajouter</strong> en haut à droite. L'icône BâtiDevis apparaîtra directement avec vos applications !
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowIOSGuide(false)}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-heading font-bold text-xs transition-colors cursor-pointer"
              >
                J'ai compris
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Footer variant
  return (
    <>
      <button
        type="button"
        onClick={handleInstallClick}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800"
      >
        <Smartphone className="w-3.5 h-3.5 text-blue-400" />
        <span>Installer l'application PWA (Hors-ligne)</span>
      </button>

      {showIOSGuide && (
        <div className="fixed inset-0 z-60 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl border border-slate-200 text-left">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h4 className="font-heading font-bold text-sm text-slate-900">
                Installation iPhone / iPad
              </h4>
              <button onClick={() => setShowIOSGuide(false)} className="text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Dans Safari, touchez le bouton <strong>Partager</strong> puis <strong>« Sur l'écran d'accueil »</strong> pour lancer l'appli sans barre d'adresse même sans internet.
            </p>
            <button
              onClick={() => setShowIOSGuide(false)}
              className="w-full py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </>
  );
};
