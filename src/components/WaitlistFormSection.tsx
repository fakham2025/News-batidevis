/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Lock, 
  Sparkles, 
  CheckCircle2, 
  Copy, 
  Check, 
  AlertCircle, 
  Clock, 
  ShieldCheck, 
  Users 
} from 'lucide-react';
import { Button } from './ui/Button';
import { 
  addWaitlistEntry, 
  getFounderCohortStats,
  saveProfile,
  getSavedProfile,
  saveCurrentSession,
  getSavedSubscriptions,
  saveSubscriptions,
  Subscription
} from '../services/db';

interface FormData {
  firstName: string;
  email: string;
  trade: string;
  department: string;
  tvaStatus: 'ae_sans_tva' | 'tva_normale';
  problem: string;
  source: string;
}

interface FormErrors {
  firstName?: string;
  email?: string;
  trade?: string;
  department?: string;
}

interface WaitlistFormSectionProps {
  token?: string | null;
  onOpenPrivacy?: () => void;
  onOpenArtisanDashboard?: () => void;
}

export function WaitlistFormSection({ token, onOpenPrivacy, onOpenArtisanDashboard }: WaitlistFormSectionProps) {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    email: '',
    trade: '',
    department: '',
    tvaStatus: 'tva_normale',
    problem: '',
    source: 'organique_btp'
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [cohortStats, setCohortStats] = useState(() => getFounderCohortStats());

  // Extraction automatique de la source UTM dans l'URL
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const utmSource = params.get('utm_source') || params.get('source') || 'organique_btp';
      setFormData(prev => ({ ...prev, source: utmSource }));
    } catch (e) {
      // ignore
    }
  }, []);

  const trades = [
    "Plombier Chauffagiste",
    "Électricien BTP",
    "Peintre en bâtiment",
    "Carreleur",
    "Menuisier / Agenceur",
    "Maçon / Gros Œuvre",
    "Couvreur / Charpentier",
    "Climaticien / CVC",
    "Ferronnier / Métallier",
    "Autre artisan du BTP"
  ];

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "Veuillez renseigner votre prénom.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Veuillez renseigner votre adresse email.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = "Format d'adresse email invalide.";
    }

    if (!formData.trade) {
      newErrors.trade = "Veuillez sélectionner votre corps de métier.";
    }

    if (!formData.department.trim()) {
      newErrors.department = "Veuillez indiquer votre département (ex: 69, 75, 44...).";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);

    const nowFormatted = new Date().toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const enrichedProblem = `${formData.problem.trim() || 'Non précisé'} [Dép: ${formData.department.trim()} | TVA: ${formData.tvaStatus} | UTM: ${formData.source}]`;

    // 1. Sauvegarde dans le schéma Supabase local / IndexedDB
    addWaitlistEntry({
      prenom: formData.firstName.trim(),
      email: formData.email.trim(),
      metier: formData.trade,
      departement: formData.department.trim(),
      statut_tva: formData.tvaStatus,
      probleme: enrichedProblem,
      source: formData.source
    });

    // 1b. Mise à jour automatique de la session artisan & profil
    const currentProfile = getSavedProfile();
    const companyDisplayName = formData.firstName.includes('(') ? formData.firstName : `Entreprise ${formData.firstName}`;
    const updatedProfile = {
      ...currentProfile,
      company_name: companyDisplayName,
      email: formData.email.trim(),
      trade: formData.trade,
      is_tva_subject: formData.tvaStatus === 'tva_normale'
    };
    saveProfile(updatedProfile);

    saveCurrentSession({
      role: 'artisan',
      userEmail: formData.email.trim(),
      companyName: companyDisplayName,
      plan: 'fondateur',
      isLoggedIn: true
    });

    // 1c. Ajout de la souscription active dans le Super-Dashboard Admin
    const subs = getSavedSubscriptions();
    const newSub: Subscription = {
      id: `sub_${Date.now()}`,
      user_id: `usr_${Date.now()}`,
      email: formData.email.trim(),
      artisan_name: formData.firstName.trim(),
      company_name: companyDisplayName,
      trade: formData.trade,
      plan: 'fondateur',
      status: 'active',
      monthly_price: 9.50,
      notes: `Inscrit via formulaire cohorte (Dép: ${formData.department})`,
      created_at: new Date().toISOString()
    };
    saveSubscriptions([newSub, ...subs]);

    // 2. Rafraîchir les statistiques de cohorte en temps réel
    setCohortStats(getFounderCohortStats());

    // 3. Affichage immédiat du succès
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);

      try {
        confetti({
          particleCount: 110,
          spread: 75,
          origin: { y: 0.6 }
        });
      } catch {
        // ignore
      }
    }, 150);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText("FONDATEUR50");
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <section id="waitlist" className="py-20 sm:py-28 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-14 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-50 border border-blue-200 text-blue-700 font-mono text-xs font-semibold tracking-wider uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
            <span>[ 06 // CANDIDATURE COHORTE FONDATEURS ]</span>
          </div>

          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-[-0.03em]">
            Rejoignez la cohorte des 20 artisans fondateurs
          </h2>
          
          <p className="font-sans text-base sm:text-lg text-slate-600 leading-relaxed">
            Profitez de la bêta gratuite et réservez votre tarif bloqué à <strong className="text-blue-600 font-bold">-50% à vie</strong> (9,50 € / mois au lieu de 19 €).
          </p>
        </div>

        {/* Form Card Container */}
        <div className="max-w-[560px] mx-auto">
          <div className="bg-slate-50/90 rounded-3xl p-6 sm:p-9 shadow-xl border border-slate-200/90 relative overflow-hidden transition-all duration-300">
            
            {/* Top Cohort Counter Bar (Checklist §6 : Vrai chiffre cohorte 1) */}
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-200 text-xs">
              <div className="flex items-center gap-1.5 text-slate-700 font-sans">
                <Users className="w-3.5 h-3.5 text-blue-600" />
                <span>Cohorte Bêta 1 : <strong>{cohortStats.remainingTotal} / {cohortStats.maxTotal} places restantes</strong></span>
              </div>
              <div className="bg-blue-950 text-blue-300 font-mono text-[11px] font-bold px-2.5 py-0.5 rounded-md border border-blue-800/80">
                Place réservée sous 48h
              </div>
            </div>

            {!isSuccess ? (
              <form onSubmit={handleSubmit} noValidate className="space-y-4 text-left">
                {/* Hidden source UTM field */}
                <input type="hidden" name="source" value={formData.source} />

                {/* Prénom */}
                <div>
                  <label htmlFor="firstName" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 font-sans">
                    Prénom de l'artisan <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    required
                    autoComplete="given-name"
                    placeholder="Ex : Marc, Sophie, Julien..."
                    value={formData.firstName}
                    onChange={(e) => {
                      setFormData({ ...formData, firstName: e.target.value });
                      if (errors.firstName) setErrors({ ...errors, firstName: undefined });
                    }}
                    className={`w-full px-4 py-3 rounded-xl border text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all font-sans ${
                      errors.firstName
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-200 bg-red-50/20'
                        : 'border-slate-300 focus:border-blue-600 focus:ring-blue-100 bg-white'
                    }`}
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-xs text-red-600 flex items-center gap-1 font-sans">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.firstName}</span>
                    </p>
                  )}
                </div>

                {/* Email Professionnel */}
                <div>
                  <label htmlFor="email" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 font-sans">
                    Email professionnel (pour les accès bêta) <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    required
                    placeholder="artisan@votre-entreprise.fr"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      if (errors.email) setErrors({ ...errors, email: undefined });
                    }}
                    className={`w-full px-4 py-3 rounded-xl border text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all font-sans ${
                      errors.email
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-200 bg-red-50/20'
                        : 'border-slate-300 focus:border-blue-600 focus:ring-blue-100 bg-white'
                    }`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-600 flex items-center gap-1 font-sans">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.email}</span>
                    </p>
                  )}
                </div>

                {/* Corps de métier */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label htmlFor="trade" className="block text-xs font-bold text-slate-700 uppercase tracking-wider font-sans">
                      Votre Corps de métier principal <span className="text-red-500">*</span>
                    </label>
                    <span className="text-[10px] text-blue-600 font-medium">1 clic</span>
                  </div>

                  {/* 1-Tap Quick Chips */}
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {["Plombier Chauffagiste", "Électricien BTP", "Peintre en bâtiment", "Menuisier / Agenceur", "Maçon / Gros Œuvre"].map((quickTrade) => (
                      <button
                        key={quickTrade}
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, trade: quickTrade });
                          if (errors.trade) setErrors({ ...errors, trade: undefined });
                        }}
                        className={`text-xs py-1.5 px-2.5 rounded-lg border font-medium transition-all cursor-pointer min-h-[32px] flex items-center gap-1 ${
                          formData.trade === quickTrade
                            ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-blue-400'
                        }`}
                      >
                        {formData.trade === quickTrade && <Check className="w-3 h-3 text-white" />}
                        <span>{quickTrade.split(' ')[0]}</span>
                      </button>
                    ))}
                  </div>

                  <div className="relative">
                    <select
                      id="trade"
                      required
                      value={formData.trade}
                      onChange={(e) => {
                        setFormData({ ...formData, trade: e.target.value });
                        if (errors.trade) setErrors({ ...errors, trade: undefined });
                      }}
                      className={`w-full px-4 py-2.5 rounded-xl border text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 appearance-none transition-all font-sans ${
                        errors.trade
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-200 bg-red-50/20'
                          : 'border-slate-300 focus:border-blue-600 focus:ring-blue-100'
                      }`}
                    >
                      <option value="">Sélectionnez votre métier précis...</option>
                      {trades.map((t, idx) => (
                        <option key={idx} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500 text-xs">
                      ▼
                    </div>
                  </div>
                  {errors.trade && (
                    <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.trade}</span>
                    </p>
                  )}
                </div>

                {/* Grid 2 cols : Département + Statut TVA (Checklist §6) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {/* Département */}
                  <div>
                    <label htmlFor="department" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 font-sans">
                      Département chantier <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="department"
                      type="text"
                      maxLength={3}
                      placeholder="Ex: 69, 75, 44..."
                      value={formData.department}
                      onChange={(e) => {
                        setFormData({ ...formData, department: e.target.value.trim() });
                        if (errors.department) setErrors({ ...errors, department: undefined });
                      }}
                      className={`w-full px-3 py-2.5 rounded-xl border text-sm text-slate-900 placeholder-slate-400 focus:outline-none font-mono ${
                        errors.department
                          ? 'border-red-300 focus:border-red-500 bg-red-50/20'
                          : 'border-slate-300 focus:border-blue-600 bg-white'
                      }`}
                    />
                    {errors.department && (
                      <p className="mt-1 text-[11px] text-red-600">{errors.department}</p>
                    )}
                  </div>

                  {/* Statut TVA */}
                  <div>
                    <label htmlFor="tvaStatus" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 font-sans">
                      Régime TVA <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="tvaStatus"
                      value={formData.tvaStatus}
                      onChange={(e) => setFormData({ ...formData, tvaStatus: e.target.value as any })}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white focus:outline-none focus:border-blue-600"
                    >
                      <option value="tva_normale">Assujetti TVA (10% / 20%)</option>
                      <option value="ae_sans_tva">Auto-entrep. (Art. 293 B sans TVA)</option>
                    </select>
                  </div>
                </div>

                {/* Problème / Verbatim brut */}
                <div>
                  <label htmlFor="problem" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Quel est votre plus gros calvaire avec vos devis ? <span className="text-slate-400 font-normal lowercase">(optionnel)</span>
                  </label>
                  <textarea
                    id="problem"
                    rows={2}
                    placeholder="Ex : Perte de 2h le soir, peur des mentions de décennale, calcul des m² et TVA rénov..."
                    value={formData.problem}
                    onChange={(e) => setFormData({ ...formData, problem: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 resize-none bg-white transition-all font-sans"
                  />
                </div>

                {/* Submit button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  variant="default"
                  size="lg"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold shadow-lg shadow-blue-600/20 cursor-pointer pt-3.5 pb-3.5 min-h-[50px]"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Réservation de votre place...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      Réserver ma place de Fondateur (-50% à vie)
                    </span>
                  )}
                </Button>

                {/* RGPD explicit notice right under button (Checklist §6) */}
                <div className="pt-2 text-center text-xs text-slate-500 space-y-1.5 font-sans">
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    🔒 <strong>Protection des données (RGPD) :</strong> Vos informations sont exclusivement utilisées pour la gestion de votre accès à la cohorte bêta. Zéro spam, zéro revente.{' '}
                    <button
                      type="button"
                      onClick={onOpenPrivacy}
                      className="text-blue-600 underline font-medium hover:text-blue-800 cursor-pointer"
                    >
                      Consulter notre politique de confidentialité
                    </button>
                    .
                  </p>

                  <div className="pt-1 flex items-center justify-center gap-3 text-[11px] text-slate-400">
                    <span>Sans engagement de durée</span>
                    <span>•</span>
                    <span className="text-blue-600 font-semibold">9,50 € / mois bloqué à vie</span>
                    <span>•</span>
                    <span>Hébergement sécurisé France</span>
                  </div>

                  <div className="pt-1 text-center">
                    <button
                      type="button"
                      onClick={() => {
                        const randomId = Math.floor(Math.random() * 900) + 100;
                        setFormData({
                          firstName: 'Jean (Artisan Test)',
                          email: `jean.artisan.${randomId}@gmail.com`,
                          trade: 'Plombier Chauffagiste',
                          department: '44',
                          tvaStatus: 'tva_normale',
                          problem: 'Trop long le soir, chiffrage des forfaits chaudières et TVA 10%',
                          source: 'organique_btp'
                        });
                        setErrors({});
                      }}
                      className="text-[11px] text-slate-400 hover:text-blue-600 transition-colors cursor-pointer"
                    >
                      ⚡ Pré-remplir des données tests d'artisan
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              /* Success Confirmation Card */
              <div className="text-center py-4 space-y-5 animate-in fade-in zoom-in-95 duration-300">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-inner">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-slate-900">
                    Félicitations {formData.firstName} ! 🎉
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Votre candidature pour la <strong>Cohorte Fondateurs</strong> est pré-enregistrée pour le département <strong>{formData.department}</strong>.
                  </p>
                </div>

                {/* VIP Pass summary card */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50/70 p-4 sm:p-5 rounded-2xl border border-blue-200 text-left space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-blue-900 border-b border-blue-200/60 pb-2">
                    <span>PASS ARTISAN FONDATEUR</span>
                    <span className="bg-blue-600 text-white px-2 py-0.5 rounded text-[10px]">VALIDÉ</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <div className="text-slate-500">Statut du dossier :</div>
                      <div className="font-extrabold text-blue-950 text-sm">Cohorte Bêta 1</div>
                    </div>
                    <div>
                      <div className="text-slate-500">Tarif bloqué à vie :</div>
                      <div className="font-extrabold text-blue-600 text-sm">9,50 € / mois (-50%)</div>
                    </div>
                  </div>

                  {/* Promo code copy box */}
                  <div className="pt-2 border-t border-blue-200/60 flex items-center justify-between bg-white p-2.5 rounded-xl border border-blue-100">
                    <div>
                      <div className="text-[10px] text-slate-500 font-semibold uppercase">Code privilège</div>
                      <div className="font-mono font-bold text-blue-800 text-sm">FONDATEUR50</div>
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyCode}
                      className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      {copiedCode ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-blue-600" />
                          <span>Copié !</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copier</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="text-xs text-slate-500 leading-relaxed font-sans">
                  Un email de confirmation vient d'être envoyé à <strong className="text-slate-800">{formData.email}</strong>. Vos accès immédiats sont configurés.
                </div>

                {/* Bouton direct vers le Dashboard Artisan & e-reporting */}
                {onOpenArtisanDashboard && (
                  <button
                    type="button"
                    onClick={onOpenArtisanDashboard}
                    className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Accéder à mon Espace Artisan & Tableau de bord →</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setIsSuccess(false)}
                  className="text-xs text-blue-600 hover:underline font-semibold block mx-auto"
                >
                  Inscrire un confrère artisan
                </button>
              </div>
            )}

          </div>
        </div>

      </div>
    </section>
  );
}
