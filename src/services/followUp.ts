/**
 * Service de relance commerciale BTP multicanale (WhatsApp & SMS)
 * Optimisé pour convertir les devis non signés sans harceler le client.
 */

export type FollowUpTemplateType = 'courtesy_j3' | 'planning_j7' | 'expiry_warning';

export interface FollowUpParams {
  clientName: string;
  clientPhone?: string;
  projectTitle: string;
  quoteNumber: string;
  totalTtc: number;
  quoteUrl: string;
  companyName?: string;
}

/**
 * Normalise un numéro de mobile français pour WhatsApp (E.164 sans le +)
 * Ex: 06 12 34 56 78 -> 33612345678
 */
export function formatFrenchPhoneForWhatsApp(phone: string): string {
  if (!phone) return '';
  let cleaned = phone.replace(/[\s.-]/g, '');

  if (cleaned.startsWith('+')) {
    cleaned = cleaned.substring(1);
  } else if (cleaned.startsWith('00')) {
    cleaned = cleaned.substring(2);
  } else if (cleaned.startsWith('0')) {
    cleaned = `33${cleaned.substring(1)}`;
  }

  return cleaned;
}

/**
 * Formate un montant en euros français (ex: 1 094,50 €)
 */
function formatEuros(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount).replace(/[\u202F\u00A0]/g, ' ');
}

/**
 * Génère le message de relance selon le profil sélectionné
 */
export function generateFollowUpMessage(
  params: FollowUpParams,
  type: FollowUpTemplateType = 'courtesy_j3'
): string {
  const company = params.companyName || 'Notre entreprise';
  const formattedTtc = formatEuros(params.totalTtc);

  switch (type) {
    case 'courtesy_j3':
      return `Bonjour ${params.clientName}, suite à notre visite pour ${params.projectTitle}, avez-vous pu consulter notre devis ${params.quoteNumber} (${formattedTtc}) ? Vous pouvez le consulter et le signer directement ici : ${params.quoteUrl}. Restant à votre disposition, ${company}.`;

    case 'planning_j7':
      return `Bonjour ${params.clientName}, nous finalisons actuellement notre planning de chantiers pour les prochaines semaines. Avez-vous eu l'opportunité de valider le devis ${params.quoteNumber} pour ${params.projectTitle} ? Lien direct : ${params.quoteUrl}. Bien cordialement, ${company}.`;

    case 'expiry_warning':
      return `Bonjour ${params.clientName}, notre proposition chiffrée ${params.quoteNumber} (${params.projectTitle}) arrive bientôt à expiration de validité des tarifs fournisseurs. Vous pouvez valider en 1 clic ici : ${params.quoteUrl}. Cordialement, ${company}.`;
  }
}

/**
 * Génère un lien direct WhatsApp
 */
export function generateWhatsAppLink(
  params: FollowUpParams,
  type: FollowUpTemplateType = 'courtesy_j3'
): string {
  const phone = formatFrenchPhoneForWhatsApp(params.clientPhone || '');
  const message = generateFollowUpMessage(params, type);
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

/**
 * Génère un lien SMS universel
 */
export function generateSmsLink(
  params: FollowUpParams,
  type: FollowUpTemplateType = 'courtesy_j3'
): string {
  const phone = params.clientPhone?.replace(/[\s.-]/g, '') || '';
  const message = generateFollowUpMessage(params, type);
  return `sms:${phone}?body=${encodeURIComponent(message)}`;
}
