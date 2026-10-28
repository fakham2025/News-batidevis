import React, { useState } from 'react';
import { ShieldAlert, Lock, KeyRound, AlertCircle, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { Button } from '../ui/Button';
import { 
  verifyAdminPin, 
  setAdminSession, 
  isBruteForceLocked, 
  getFailedAttemptsCount 
} from '../../services/adminAuth';

interface AdminLoginModalProps {
  isOpen: boolean;
  onSuccess: () => void;
  onClose?: () => void;
}

export function AdminLoginModal({ isOpen, onSuccess, onClose }: AdminLoginModalProps) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showPin, setShowPin] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isBruteForceLocked()) {
      setError('Accès temporairement suspendu (30s) pour des raisons de sécurité.');
      return;
    }

    const isValid = verifyAdminPin(pin);
    if (isValid) {
      const token = `adm_session_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
      setAdminSession(token);
      setError(null);
      onSuccess();
    } else {
      const failed = getFailedAttemptsCount();
      setError(`Code PIN invalide (${failed}/5 tentatives).`);
      setPin('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 w-full max-w-sm rounded-3xl p-6 sm:p-7 border border-slate-800 shadow-2xl text-white space-y-5 text-center relative">
        <div className="w-14 h-14 rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center mx-auto shadow-inner">
          <Lock className="w-7 h-7" />
        </div>

        <div>
          <h3 className="text-lg font-heading font-black tracking-tight text-white">
            Portail Administrateur
          </h3>
          <p className="text-xs text-slate-400 mt-1 font-sans">
            Accès sécurisé réservé à la direction BâtiDevis SaaS
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-950/60 border border-red-800/80 text-red-200 text-xs flex items-center gap-2 text-left">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1 text-left">
            <label className="block text-[11px] font-mono font-bold text-slate-300 uppercase">
              Code PIN Maître (6 chiffres)
            </label>
            <div className="relative">
              <input
                type={showPin ? 'text' : 'password'}
                maxLength={6}
                autoFocus
                required
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                placeholder="••••••"
                className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-center text-xl font-mono tracking-widest text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 cursor-pointer"
              >
                {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-heading font-bold text-sm shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <KeyRound className="w-4 h-4" />
            <span>Déverrouiller le Backoffice</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-[10px] text-slate-500 font-mono pt-1">
          SESSION CHIFFRÉE • PIN PAR DÉFAUT : 202684
        </div>
      </div>
    </div>
  );
}
