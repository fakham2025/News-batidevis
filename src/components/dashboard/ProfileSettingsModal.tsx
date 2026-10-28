import React, { useState, useEffect } from 'react';
import { X, Building2, ShieldCheck, CreditCard, Save, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';
import { SiretAutocomplete } from '../common/SiretAutocomplete';

interface ProfileSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (profile: any) => void;
}

const STORAGE_KEY_ARTISAN_PROFILE = 'batidevis_artisan_profile_v1';

export function ProfileSettingsModal({ isOpen, onClose, onSave }: ProfileSettingsModalProps) {
  const [companyName, setCompanyName] = useState('Mon Entreprise BTP');
  const [siret, setSiret] = useState('839 204 192 00018');
  const [phone, setPhone] = useState('06 12 34 56 78');
  const [email, setEmail] = useState('artisan@votre-entreprise.fr');
  const [address, setAddress] = useState('10 rue des Artisans, 75011 Paris');
  const [insurer, setInsurer] = useState('SMABTP');
  const [policyNumber, setPolicyNumber] = useState('POL-2026-99482');
  const [iban, setIban] = useState('FR76 3000 4000 5000 6000 7000 123');

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_ARTISAN_PROFILE);
      if (raw) {
        const p = JSON.parse(raw);
        if (p.companyName) setCompanyName(p.companyName);
        if (p.siret) setSiret(p.siret);
        if (p.phone) setPhone(p.phone);
        if (p.email) setEmail(p.email);
        if (p.address) setAddress(p.address);
        if (p.insurer) setInsurer(p.insurer);
        if (p.policyNumber) setPolicyNumber(p.policyNumber);
        if (p.iban) setIban(p.iban);
      }
    } catch {
      // ignore
    }
  }, []);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const profile = {
      companyName,
      siret,
      phone,
      email,
      address,
      insurer,
      policyNumber,
      iban
    };
    try {
      localStorage.setItem(STORAGE_KEY_ARTISAN_PROFILE, JSON.stringify(profile));
    } catch {
      // ignore
    }
    onSave(profile);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-5 relative max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              Profil Entreprise & Mentions Légales 2026
            </h3>
            <p className="text-xs text-slate-500">
              Ces informations seront automatiquement injectées sur vos devis et factures.
            </p>
          </div>
        </div>

        {/* Recherche instantanée SIRET */}
        <div className="p-3.5 bg-blue-50/70 rounded-2xl border border-blue-200/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-950 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Remplissage automatique via l'API Gouv.fr</span>
            </span>
            <span className="text-[10px] font-mono text-blue-700 font-semibold bg-white px-1.5 py-0.5 rounded border border-blue-200">
              INSEE / RNE
            </span>
          </div>
          <SiretAutocomplete
            placeholder="Tapez le nom de votre entreprise ou votre SIRET..."
            onSelect={(ent) => {
              setCompanyName(ent.nom_complet);
              setSiret(ent.siret);
              if (ent.adresse_complete) setAddress(ent.adresse_complete);
            }}
          />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Raison sociale / Nom commercial <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:border-blue-600 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Numéro SIRET <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={siret}
                onChange={(e) => setSiret(e.target.value)}
                placeholder="14 chiffres"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm font-mono focus:border-blue-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Téléphone professionnel
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:border-blue-600 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Adresse complète du siège
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:border-blue-600 focus:outline-none"
            />
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Assurance Décennale Obligatoire (Loi Spinetta)</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Assureur</label>
                <input
                  type="text"
                  value={insurer}
                  onChange={(e) => setInsurer(e.target.value)}
                  placeholder="Ex: SMABTP, AXA, MAAF"
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">N° Police d'assurance</label>
                <input
                  type="text"
                  value={policyNumber}
                  onChange={(e) => setPolicyNumber(e.target.value)}
                  placeholder="Ex: POL-2026-XXXX"
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-mono"
                />
              </div>
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
              <CreditCard className="w-4 h-4 text-blue-600" />
              <span>Coordonnées bancaires pour règlement des factures</span>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">IBAN</label>
              <input
                type="text"
                value={iban}
                onChange={(e) => setIban(e.target.value)}
                placeholder="FR76 ...."
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-mono uppercase"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="text-xs"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-blue-600/20"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Enregistrer mes coordonnées</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
