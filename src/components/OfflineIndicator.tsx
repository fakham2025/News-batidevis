/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { WifiOff, Wifi, RefreshCw, CheckCircle2, ShieldCheck } from 'lucide-react';
import { getSavedDocuments } from '../services/db';

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'offline' | 'online'>('offline');
  const [unsyncedCount, setUnsyncedCount] = useState(0);

  useEffect(() => {
    const updateUnsynced = () => {
      const docs = getSavedDocuments();
      const unsynced = docs.filter(d => !d.synced_at || d.status === 'brouillon_local').length;
      setUnsyncedCount(unsynced);
    };

    updateUnsynced();

    const handleOnline = () => {
      setIsOnline(true);
      setToastType('online');
      setToastMessage('Connexion rétablie — synchronisation automatique effectuée.');
      setShowToast(true);
      updateUnsynced();
      setTimeout(() => setShowToast(false), 4500);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setToastType('offline');
      setToastMessage('Mode Hors-ligne actif — vos devis et kits restent 100% accessibles et sauvegardés.');
      setShowToast(true);
      updateUnsynced();
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial check
    if (!navigator.onLine) {
      handleOffline();
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline && !showToast) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-40 transition-all duration-300 animate-slide-up">
      <div className={`p-3.5 rounded-2xl shadow-xl backdrop-blur-md border flex items-center justify-between gap-3 ${
        toastType === 'offline'
          ? 'bg-amber-950/90 text-amber-100 border-amber-600/40 shadow-amber-950/50'
          : 'bg-emerald-950/90 text-emerald-100 border-emerald-600/40 shadow-emerald-950/50'
      }`}>
        <div className="flex items-center gap-2.5 min-w-0">
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
            toastType === 'offline' ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'
          }`}>
            {toastType === 'offline' ? (
              <WifiOff className="w-4 h-4 animate-pulse" />
            ) : (
              <CheckCircle2 className="w-4 h-4" />
            )}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold leading-tight flex items-center gap-1.5">
              <span>{toastType === 'offline' ? 'Hors connexion sur chantier' : 'En ligne'}</span>
              {unsyncedCount > 0 && toastType === 'offline' && (
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-500/30 text-amber-200">
                  {unsyncedCount} devis local
                </span>
              )}
            </p>
            <p className="text-[11px] opacity-80 truncate">{toastMessage}</p>
          </div>
        </div>

        {toastType === 'offline' && (
          <button
            onClick={() => setShowToast(false)}
            className="text-[11px] font-semibold underline px-2 py-1 text-amber-300 hover:text-white shrink-0"
          >
            Masquer
          </button>
        )}
      </div>
    </div>
  );
}
