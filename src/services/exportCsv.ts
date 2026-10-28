/**
 * exportCsv.ts — Export CSV UTF-8 BOM de la waitlist artisans
 * Compatible Excel français (délimiteur ; et BOM UTF-8)
 */

export type WaitlistStatut = 'en_attente' | 'contacte' | 'converti' | 'abandonne';

export interface WaitlistEntry {
  id: string;
  nom: string;
  email: string;
  telephone: string;
  metier: string;
  departement: string;
  date_inscription: string;   // ISO 8601
  statut: WaitlistStatut;
  notes?: string;
}

const STATUT_LABEL: Record<WaitlistStatut, string> = {
  en_attente: 'En attente',
  contacte:   'Contacté',
  converti:   'Converti',
  abandonne:  'Abandonné',
};

/**
 * Échappe une valeur CSV : entoure de guillemets si elle contient ; , " ou \n
 * et double les guillemets internes.
 */
function escapeCsvValue(value: string): string {
  const needsQuote = value.includes(';') || value.includes('"') || value.includes('\n') || value.includes(',');
  const escaped = value.replace(/"/g, '""');
  return needsQuote ? `"${escaped}"` : escaped;
}

/**
 * Formate une date ISO en DD/MM/YYYY (fuseau Paris)
 */
function formatDate(iso: string): string {
  const d = new Date(iso);
  const day   = String(d.getUTCDate()).padStart(2, '0');
  const month = String(d.getUTCMonth() + 1).padStart(2, '0');
  const year  = d.getUTCFullYear();
  return `${day}/${month}/${year}`;
}

/**
 * Génère un CSV UTF-8 BOM avec délimiteur ; pour Excel français
 */
export function generateWaitlistCsv(entries: WaitlistEntry[]): string {
  const BOM = '\uFEFF';
  const SEP = ';';

  const headers = ['Nom', 'Email', 'Telephone', 'Metier', 'Departement', 'Date inscription', 'Statut', 'Notes'];

  const rows = entries.map(e => [
    escapeCsvValue(e.nom),
    escapeCsvValue(e.email),
    escapeCsvValue(e.telephone),
    escapeCsvValue(e.metier),
    escapeCsvValue(e.departement),
    escapeCsvValue(formatDate(e.date_inscription)),
    escapeCsvValue(STATUT_LABEL[e.statut] ?? e.statut),
    escapeCsvValue(e.notes ?? ''),
  ].join(SEP));

  const lines = [headers.join(SEP), ...rows];
  return BOM + lines.join('\n');
}

/**
 * Déclenche le téléchargement du CSV dans le navigateur
 */
export function downloadCsv(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href     = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
