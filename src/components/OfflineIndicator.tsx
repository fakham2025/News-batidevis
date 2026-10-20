/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi, Check, X } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  });
  const [showReconnected, setShowReconnected] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowReconnected(true);
      const timer = setTimeout(() => setShowReconnected(false), 3500);
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowReconnected(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline && !showReconnected) {
    return null;
  }

  if (showReconnected) {
    return (
      <aside
        aria-label="Statut réseau"
        className="fixed bottom-5 left-4 sm:left-6 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-slate-950/95 text-emerald-400 border border-emerald-500/40 shadow-xl backdrop-blur-md text-xs font-sans animate-in fade-in slide-in-from-bottom-2"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-400" />
        <Wifi className="w-3.5 h-3.5 text-emerald-400" />
        <span className="font-semibold text-white">Connexion rétablie</span>
        <span className="text-slate-400 hidden sm:inline">• Synchronisation cloud active</span>
      </aside>
    );
  }

  return (
    <aside
      aria-label="Statut réseau"
      className="fixed bottom-5 left-4 sm:left-6 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-slate-950/95 text-amber-300 border border-amber-500/40 shadow-xl backdrop-blur-md text-xs font-sans animate-in fade-in slide-in-from-bottom-2 max-w-sm"
    >
      <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shrink-0" />
      <WifiOff className="w-4 h-4 text-amber-400 shrink-0" />
      <div className="text-left leading-snug">
        <div className="font-heading font-bold text-white text-xs">Mode Hors-ligne actif</div>
        <div className="text-[11px] text-slate-300">Vos devis sont enregistrés localement sur votre téléphone.</div>
      </div>
    </aside>
  );
};
