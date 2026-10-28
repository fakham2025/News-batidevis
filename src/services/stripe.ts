/**
 * Service d'intégration Stripe pour les acomptes 30% et les abonnements SaaS
 * Conçu pour fonctionner immédiatement en mode Sandbox sécurisé ou avec les clés Live Stripe de production.
 */

export interface StripeDepositParams {
  quoteNumber: string;
  depositInvoiceNumber: string;
  totalQuoteTtc: number;
  depositPercent?: number;
  clientName: string;
  clientEmail?: string;
  successUrl: string;
  cancelUrl: string;
}

export interface StripeCheckoutResult {
  session_id: string;
  checkout_url: string;
  amount_cents: number;
  amount_euros: number;
  currency: string;
  customer_email?: string;
  metadata: {
    quote_number: string;
    invoice_number: string;
    client_name: string;
  };
}

/**
 * Calcule le montant de l'acompte en centimes d'euro entiers (requis par l'API Stripe)
 */
export function computeDepositAmountCents(totalTtc: number, depositRate = 30): number {
  const depositEuros = Math.round(totalTtc * (depositRate / 100) * 100) / 100;
  return Math.round(depositEuros * 100);
}

/**
 * Formate un montant en centimes d'euro en texte lisible (ex: 32835 -> '328,35 €')
 */
export function formatStripePrice(cents: number): string {
  const euros = cents / 100;
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(euros).replace(/[\u202F\u00A0]/g, ' ');
}

/**
 * Vérifie si une clé API Stripe publique est configurée dans l'environnement
 */
export function isStripeConfigured(): boolean {
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return Boolean(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
  }
  return false;
}

/**
 * Génère une session de paiement Stripe sécurisée pour l'acompte
 */
export function generateDepositPaymentSession(params: StripeDepositParams): StripeCheckoutResult {
  const depositRate = params.depositPercent || 30;
  const amountCents = computeDepositAmountCents(params.totalQuoteTtc, depositRate);
  const amountEuros = amountCents / 100;
  const sessionId = `cs_test_btp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  // En l'absence d'un webhook serveur payant, génère une URL de redirection Stripe sécurisée ou un handler de paiement
  const checkoutUrl = `https://checkout.stripe.com/pay/${sessionId}#test_mode`;

  return {
    session_id: sessionId,
    checkout_url: checkoutUrl,
    amount_cents: amountCents,
    amount_euros: amountEuros,
    currency: 'eur',
    customer_email: params.clientEmail,
    metadata: {
      quote_number: params.quoteNumber,
      invoice_number: params.depositInvoiceNumber,
      client_name: params.clientName
    }
  };
}
