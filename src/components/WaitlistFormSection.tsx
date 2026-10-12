import { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Lock, 
  Sparkles, 
  Send, 
  CheckCircle2, 
  ShieldCheck, 
  Copy, 
  Check, 
  AlertCircle,
  Clock,
  Flame
} from 'lucide-react';
import { Button } from './ui/Button';

interface FormData {
  firstName: string;
  email: string;
  trade: string;
  problem: string;
}

interface FormErrors {
  firstName?: string;
  email?: string;
  trade?: string;
}

export function WaitlistFormSection() {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    email: '',
    trade: '',
    problem: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [queueNumber, setQueueNumber] = useState(248);

  const trades = [
    "Plombier",
    "Électricien",
    "Menuisier",
    "Paysagiste",
    "Maçon",
    "Peintre",
    "Couvreur / Charpentier",
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);

    const payload = {
      ...formData,
      timestamp: new Date().toISOString(),
      source: "Landing Page SaaS Artisan 2026",
      vipCode: "ARTISAN50"
    };

    try {
      // Send to webhook placeholder requested by user
      await fetch('https://hooks.zapier.com/hooks/catch/123456/abcdef/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        mode: 'no-cors', // handle cross-origin webhook gracefully
        body: JSON.stringify(payload)
      });
    } catch {
      // gracefully continue if mock webhook URL is unreachable in dev
    }

    // Simulate fast processing
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      setQueueNumber(248);

      // Trigger Confetti effect
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // ignore if canvas-confetti context error
      }
    }, 800);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText("ARTISAN50");
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <section id="waitlist" className="py-20 sm:py-28 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-14 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-50 border border-blue-200 text-blue-700 font-mono text-xs font-semibold tracking-wider uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
            <span>[ 06 // ACCÈS ANTICIPÉ 2026 ]</span>
          </div>

          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-[-0.03em]">
            Prêt à ne plus jamais perdre de temps sur vos devis ?
          </h2>
          
          <p className="font-sans text-base sm:text-lg text-slate-600 leading-relaxed">
            Rejoignez la liste d'attente et bénéficiez de <strong className="text-blue-600 font-bold">-50% à vie</strong> sur votre abonnement (9,50€/mois au lieu de 19€).
          </p>
        </div>

        {/* Form Card Container */}
        <div className="max-w-[540px] mx-auto">
          <div className="bg-slate-50/80 rounded-3xl p-7 sm:p-10 shadow-xl border border-slate-200/90 relative overflow-hidden transition-all duration-300">
            
            {/* Top Counter Bar */}
            <div className="flex items-center justify-between pb-5 mb-6 border-b border-slate-200 text-xs">
              <div className="flex items-center gap-1.5 text-slate-600 font-sans">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                <span>Ouverture officielle : <strong>Novembre 2026</strong></span>
              </div>
              <div className="bg-blue-950 text-blue-300 font-mono text-[11px] font-bold px-2.5 py-0.5 rounded-md border border-blue-800/80">
                Place #248 disponible
              </div>
            </div>

            {!isSuccess ? (
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                {/* Prénom */}
                <div>
                  <label htmlFor="firstName" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 font-sans">
                    Prénom <span className="text-red-500">*</span>
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
                    className={`w-full px-4 py-3.5 sm:py-3 rounded-xl border text-base sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all font-sans ${
                      errors.firstName
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-200 bg-red-50/20'
                        : 'border-slate-300 focus:border-blue-600 focus:ring-blue-100 bg-white'
                    }`}
                  />
                  {errors.firstName && (
                    <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1 font-sans">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.firstName}</span>
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 font-sans">
                    Adresse Email professionnelle <span className="text-red-500">*</span>
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
                    className={`w-full px-4 py-3.5 sm:py-3 rounded-xl border text-base sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all font-sans ${
                      errors.email
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-200 bg-red-50/20'
                        : 'border-slate-300 focus:border-blue-600 focus:ring-blue-100 bg-white'
                    }`}
                  />
                  {errors.email && (
                    <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1 font-sans">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.email}</span>
                    </p>
                  )}
                </div>

                {/* Métier dropdown */}
                <div>
                  <label htmlFor="trade" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 font-sans">
                    Votre Métier principal <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      id="trade"
                      required
                      value={formData.trade}
                      onChange={(e) => {
                        setFormData({ ...formData, trade: e.target.value });
                        if (errors.trade) setErrors({ ...errors, trade: undefined });
                      }}
                      className={`w-full px-4 py-3.5 sm:py-3 rounded-xl border text-base sm:text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 appearance-none transition-all font-sans ${
                        errors.trade
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-200 bg-red-50/20'
                          : 'border-slate-300 focus:border-blue-600 focus:ring-blue-100'
                      }`}
                    >
                      <option value="">Sélectionnez votre métier...</option>
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
                    <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.trade}</span>
                    </p>
                  )}
                </div>

                {/* Message optionnel */}
                <div>
                  <label htmlFor="problem" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Quel est votre plus gros problème avec vos devis actuels ? <span className="text-gray-400 font-normal lowercase">(optionnel)</span>
                  </label>
                  <textarea
                    id="problem"
                    rows={3}
                    placeholder="Ex : Trop long le soir, peur des mentions obligatoires, calcul de la TVA rénovation 10%..."
                    value={formData.problem}
                    onChange={(e) => setFormData({ ...formData, problem: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 resize-none bg-white transition-all"
                  />
                </div>

                {/* Submit button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  variant="default"
                  size="lg"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold shadow-lg shadow-blue-600/20 cursor-pointer pt-3.5 pb-3.5"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Réservation de votre place en cours...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      Réserver mon accès anticipé (-50% à vie)
                    </span>
                  )}
                </Button>

                {/* Micro-copy & Trust */}
                <div className="pt-2 text-center text-xs text-gray-500 flex items-center justify-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-gray-400" />
                  <span>🔒 Vos données sont protégées. Pas de spam, promis.</span>
                </div>
              </form>
            ) : (
              /* Success Confirmation Card */
              <div className="text-center py-4 space-y-6 animate-in fade-in zoom-in-95 duration-300">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-inner">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-gray-900">
                    Félicitations {formData.firstName} ! 🎉
                  </h3>
                  <p className="text-sm text-gray-600">
                    Votre accès VIP est réservé. Vous faites partie des <strong>300 pionniers</strong> qui bénéficient de la réduction permanente.
                  </p>
                </div>

                {/* VIP Pass summary card */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50/60 p-5 rounded-2xl border border-blue-200 text-left space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-blue-900 border-b border-blue-200/60 pb-2">
                    <span>VOTRE PASS ACCÈS ANTICIPÉ</span>
                    <span className="bg-blue-600 text-white px-2 py-0.5 rounded text-[10px]">CONFIRMÉ</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <div className="text-gray-500">Numéro de file :</div>
                      <div className="font-extrabold text-blue-950 text-base">#{queueNumber} / 300</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Tarif bloqué à vie :</div>
                      <div className="font-extrabold text-blue-600 text-base">9,50 € / mois</div>
                    </div>
                  </div>

                  {/* Promo code copy box */}
                  <div className="pt-2 border-t border-blue-200/60 flex items-center justify-between bg-white p-2.5 rounded-xl border border-blue-100">
                    <div>
                      <div className="text-[10px] text-gray-500 font-semibold uppercase">Code privilège</div>
                      <div className="font-mono font-bold text-blue-800 text-sm">ARTISAN50</div>
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

                <div className="text-xs text-gray-500 leading-relaxed">
                  Un email de confirmation vient d'être envoyé à <strong className="text-gray-800">{formData.email}</strong> avec vos identifiants bêta dès l'ouverture des accès.
                </div>

                <button
                  type="button"
                  onClick={() => setIsSuccess(false)}
                  className="text-xs text-blue-600 hover:underline font-semibold"
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
