'use client';

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Download, Smartphone, X, Check, Share, PlusSquare } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

interface PWAInstallButtonProps {
  className?: string;
  variant?: 'navbar' | 'footer' | 'banner';
}

export function PWAInstallButton({ className = '', variant = 'navbar' }: PWAInstallButtonProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Vérifier si l'app est déjà en mode standalone (déjà installée)
    const isStandaloneMode = 
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;
    setIsStandalone(isStandaloneMode);

    // Détecter iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    // Écouter l'événement standard beforeinstallprompt (Android, Chrome, Edge)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    // Écouter si l'application vient d'être installée
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else if (isIOS) {
      setShowIOSModal(true);
    } else {
      // Fallback pour navigateurs desktop ou non supportés
      setShowIOSModal(true);
    }
  };

  // Ne pas afficher si déjà en mode standalone
  if (isStandalone || isInstalled) {
    return null;
  }

  return (
    <>
      {variant === 'navbar' && (
        <button
          onClick={handleInstallClick}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 shadow-sm ${
            deferredPrompt || isIOS
              ? 'bg-amber-400/10 text-amber-300 border border-amber-400/30 hover:bg-amber-400/20 active:scale-95'
              : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
          } ${className}`}
          title="Installer l'application sur votre smartphone"
        >
          <Download className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">Installer l'App</span>
          <span className="sm:hidden">App PWA</span>
        </button>
      )}

      {variant === 'footer' && (
        <button
          onClick={handleInstallClick}
          className={`inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition shadow-sm ${className}`}
        >
          <Smartphone className="w-4 h-4 text-amber-400" />
          <span>Installer l'application PWA (iOS & Android)</span>
        </button>
      )}

      {variant === 'banner' && (
        <div className={`bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/15 border border-amber-500/30 rounded-xl p-3 sm:p-4 flex items-center justify-between gap-3 ${className}`}>
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0">
              <Smartphone className="w-5 h-5 text-amber-400" />
            </div>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-bold text-white truncate">Installer BâtiDevis sur votre smartphone</p>
              <p className="text-[11px] text-slate-400 truncate">Accès instantané 1-clic depuis votre écran d'accueil, même hors-ligne</p>
            </div>
          </div>
          <button
            onClick={handleInstallClick}
            className="shrink-0 px-3.5 py-2 text-xs font-bold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm transition active:scale-95 flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Installer</span>
          </button>
        </div>
      )}

      {/* Modale d'instructions pour iOS Safari / Navigateurs alternatifs */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl text-left">
            <button
              onClick={() => setShowIOSModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Installer sur smartphone</h3>
                <p className="text-xs text-slate-400">Application PWA 100% hors-ligne</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              BâtiDevis fonctionne comme une application native sans passer par l'App Store. Suivez ces 2 étapes simples sur Safari ou votre navigateur mobile :
            </p>

            <div className="space-y-3 bg-slate-950/60 border border-slate-800 rounded-xl p-4 mb-5 text-xs">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-amber-400 text-slate-950 font-bold flex items-center justify-center shrink-0 text-xs">
                  1
                </div>
                <div>
                  <p className="text-slate-200 font-medium">Touchez le bouton Partager</p>
                  <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                    L'icône <Share className="w-3.5 h-3.5 text-blue-400 inline" /> située en bas de votre écran sur Safari
                  </p>
                </div>
              </div>

              <div className="h-px bg-slate-800/80 my-1"></div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-amber-400 text-slate-950 font-bold flex items-center justify-center shrink-0 text-xs">
                  2
                </div>
                <div>
                  <p className="text-slate-200 font-medium">Sélectionnez « Sur l'écran d'accueil »</p>
                  <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                    Faites défiler puis touchez <PlusSquare className="w-3.5 h-3.5 text-emerald-400 inline" /> « Sur l'écran d'accueil »
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl mb-5 text-[11px] text-emerald-300">
              <Check className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>L'icône BâtiDevis s'ajoutera à votre téléphone et fonctionnera même sans connexion internet !</span>
            </div>

            <button
              onClick={() => setShowIOSModal(false)}
              className="w-full py-2.5 text-xs font-bold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-xl transition"
            >
              J'ai compris
            </button>
          </div>
        </div>
      )}
    </>
  );
}
