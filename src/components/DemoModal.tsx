/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { 
  X, 
  Play, 
  Pause, 
  RotateCcw, 
  Smartphone, 
  ShieldCheck, 
  ArrowRight, 
  Check, 
  Sparkles, 
  Clock, 
  Video, 
  Calculator,
  MessageCircle
} from 'lucide-react';
import { Button } from './ui/Button';

interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoToWaitlist: () => void;
  onOpenDevisBuilder?: () => void;
}

export function DemoModal({ isOpen, onClose, onGoToWaitlist, onOpenDevisBuilder }: DemoModalProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(12);
  const totalDuration = 90; // 90 secondes chrono Loom
  const [activeTab, setActiveTab] = useState<'video' | 'interactive'>('video');

  // Loom chapters
  const chapters = [
    { start: 0, label: "00:00 - Introduction Chantier" },
    { start: 20, label: "00:20 - Sélection d'un Kit Chantier" },
    { start: 45, label: "00:45 - Calculateur & TVA auto" },
    { start: 68, label: "01:08 - Signature tactile & WhatsApp" }
  ];

  useEffect(() => {
    let interval: any;
    if (isOpen && isPlaying && activeTab === 'video') {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= totalDuration) {
            setIsPlaying(false);
            return totalDuration;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isOpen, isPlaying, activeTab]);

  if (!isOpen) return null;

  const currentChapter = chapters.slice().reverse().find(c => currentTime >= c.start) || chapters[0];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden text-left my-4 sm:my-8">
        
        {/* Top Header */}
        <div className="bg-slate-950 text-white p-4 sm:p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-md">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] font-bold text-blue-400 uppercase tracking-wider">
                  DÉMO PROTOTYPE LOOM • 90 SECONDES
                </span>
                <span className="bg-emerald-950 text-emerald-400 text-[9px] font-bold px-1.5 py-0.5 rounded border border-emerald-800">
                  OFFLINE-FIRST
                </span>
              </div>
              <h3 className="font-heading text-base sm:text-lg font-bold">
                Comment générer un devis conforme en 60 secondes sur chantier
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 transition-colors cursor-pointer"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Screen / Player Container */}
        <div className="relative bg-slate-950 text-white overflow-hidden aspect-video flex flex-col justify-between p-4 sm:p-6 select-none border-b border-slate-800">
          {/* Subtle Grid & Backdrop */}
          <div className="absolute inset-0 bg-tech-grid-dark opacity-30 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent pointer-events-none" />

          {/* Top Player Info */}
          <div className="relative z-10 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-1 rounded-full border border-slate-700/80 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-slate-300 font-bold">LOOM PROTOTYPE V1</span>
              <span className="text-slate-500">•</span>
              <span className="text-blue-400">{currentChapter.label}</span>
            </div>

            <div className="bg-slate-900/80 px-2.5 py-1 rounded-full border border-slate-700 text-slate-300">
              {String(Math.floor(currentTime / 60)).padStart(2, '0')}:{String(currentTime % 60).padStart(2, '0')} / 01:30
            </div>
          </div>

          {/* Central Mock Screen Simulation */}
          <div className="relative z-10 max-w-md mx-auto my-auto w-full p-4 rounded-2xl bg-slate-900/90 border border-slate-700 shadow-2xl backdrop-blur-md text-center space-y-3">
            {currentTime < 20 && (
              <div className="space-y-2 animate-in fade-in">
                <span className="text-xs font-mono text-blue-400 font-bold uppercase tracking-wider">
                  01. Saisie sur chantier sans réseau
                </span>
                <p className="text-sm font-heading font-extrabold text-white">
                  "L'artisan ouvre l'app dans le sous-sol : zéro temps de chargement, stockage local immédiat."
                </p>
                <div className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-mono bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                  <Check className="w-3.5 h-3.5" /> 100% Hors-ligne garanti
                </div>
              </div>
            )}

            {currentTime >= 20 && currentTime < 45 && (
              <div className="space-y-2 animate-in fade-in">
                <span className="text-xs font-mono text-blue-400 font-bold uppercase tracking-wider">
                  02. Le Kit Chantier se déploie
                </span>
                <p className="text-sm font-heading font-extrabold text-white">
                  "1 clic sur 'Chauffe-eau thermodynamique' : ballon, raccords, groupe inox et main d'œuvre s'insèrent déjà chiffrés."
                </p>
                <div className="inline-flex items-center gap-1.5 text-xs text-blue-300 font-mono bg-blue-950/60 px-2 py-0.5 rounded border border-blue-800">
                  <Calculator className="w-3.5 h-3.5" /> 4 lignes créées en 3 secondes
                </div>
              </div>
            )}

            {currentTime >= 45 && currentTime < 68 && (
              <div className="space-y-2 animate-in fade-in">
                <span className="text-xs font-mono text-blue-400 font-bold uppercase tracking-wider">
                  03. Mentions 2026 & TVA 10%
                </span>
                <p className="text-sm font-heading font-extrabold text-white">
                  "TVA rénovation calculée automatiquement, décennale SMA BTP et mentions légales 2026 verrouillées."
                </p>
                <div className="inline-flex items-center gap-1.5 text-xs text-blue-300 font-mono bg-blue-950/60 px-2 py-0.5 rounded border border-blue-800">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-400" /> Zéro risque d'amende DGCCRF
                </div>
              </div>
            )}

            {currentTime >= 68 && (
              <div className="space-y-2 animate-in fade-in">
                <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">
                  04. Signature tactile & WhatsApp
                </span>
                <p className="text-sm font-heading font-extrabold text-white">
                  "Le client signe sur l'écran tactile, copie PDF transmise par WhatsApp avant même de redémarrer le camion !"
                </p>
                <div className="inline-flex items-center gap-1.5 text-xs text-emerald-300 font-mono bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                  <MessageCircle className="w-3.5 h-3.5" /> Devis accepté sur place
                </div>
              </div>
            )}
          </div>

          {/* Bottom Player Controls */}
          <div className="relative z-10 space-y-2">
            {/* Timeline scrubber bar */}
            <div 
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const pos = (e.clientX - rect.left) / rect.width;
                setCurrentTime(Math.round(pos * totalDuration));
              }}
              className="w-full bg-slate-800 h-2 rounded-full overflow-hidden cursor-pointer relative group"
            >
              <div
                className="bg-blue-500 h-full rounded-full transition-all duration-300 group-hover:bg-blue-400"
                style={{ width: `${(currentTime / totalDuration) * 100}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white cursor-pointer transition-colors"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCurrentTime(0);
                    setIsPlaying(true);
                  }}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer transition-colors"
                  title="Recommencer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <span className="text-slate-400 font-mono text-[11px] hidden sm:inline">
                  {isPlaying ? 'Lecture en cours...' : 'En pause'}
                </span>
              </div>

              {onOpenDevisBuilder && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenDevisBuilder();
                  }}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-heading font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Tester le DevisBuilder vous-même</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 4 Chapters Pills */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          {chapters.map((ch, idx) => {
            const isPassed = currentTime >= ch.start;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setCurrentTime(ch.start);
                  setIsPlaying(true);
                }}
                className={`p-2 rounded-xl text-left transition-all cursor-pointer border ${
                  currentTime >= ch.start && currentTime < (chapters[idx + 1]?.start || 999)
                    ? 'bg-blue-600 text-white border-blue-600 font-bold shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300'
                }`}
              >
                <div className="text-[10px] font-mono opacity-80">{ch.label.split(' - ')[0]}</div>
                <div className="truncate text-[11px] font-semibold mt-0.5">{ch.label.split(' - ')[1]}</div>
              </button>
            );
          })}
        </div>

        {/* Modal Footer CTA */}
        <div className="p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-sans">
          <div className="text-slate-600 text-center sm:text-left">
            Convaincu par la démonstration ? Bloquez la réduction permanente à <strong className="text-blue-600 font-bold">9,50 € / mois à vie</strong>.
          </div>
          <Button
            variant="default"
            size="md"
            onClick={() => {
              onClose();
              onGoToWaitlist();
            }}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold cursor-pointer min-h-[44px]"
          >
            <span>Rejoindre la cohorte fondateurs (-50%)</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>

      </div>
    </div>
  );
}
