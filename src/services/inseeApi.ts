/**
 * Service d'interrogation de l'API Recherche Entreprises (Gouvernement Français)
 * Documentation officielle : https://recherche-entreprises.api.gouv.fr/
 * 100% gratuit, sans clé API requise, données certifiées INSEE & Registre National des Entreprises (RNE).
 */

export interface EntrepriseSearchResult {
  siren: string;
  siret: string;
  nom_complet: string;
  raison_sociale?: string;
  code_naf: string;
  libelle_naf?: string;
  adresse_complete: string;
  code_postal?: string;
  commune?: string;
  tva_intra?: string;
}

/**
 * Calcule la clé et le numéro de TVA intracommunautaire officiel français
 * Formule : Clé = (12 + 3 * (SIREN % 97)) % 97
 */
export function computeTvaIntra(siren: string): string {
  const cleanSiren = siren.replace(/\D/g, '');
  if (cleanSiren.length !== 9) return '';

  const sirenNum = parseInt(cleanSiren, 10);
  const key = (12 + 3 * (sirenNum % 97)) % 97;
  const keyStr = key < 10 ? `0${key}` : `${key}`;
  return `FR${keyStr}${cleanSiren}`;
}

/**
 * Parse et normalise une fiche entreprise issue de l'API Gouv
 */
export function parseEntrepriseRecord(record: any): EntrepriseSearchResult {
  const siren = record.siren || '';
  const siege = record.siege || {};
  const siret = siege.siret || (record.matching_etablissements?.[0]?.siret) || `${siren}00010`;
  
  const nom = record.nom_raison_sociale || record.nom_complet || 'Entreprise';
  const code_naf = record.activite_principale || siege.activite_principale || '43.99Z';
  
  const adresseVoie = siege.adresse || '';
  const cp = siege.code_postal || '';
  const ville = siege.commune || '';
  
  const parts = [adresseVoie];
  if (cp || ville) {
    parts.push(`${cp} ${ville}`.trim());
  }
  const adresse_complete = parts.filter(Boolean).join(', ') || 'France';

  return {
    siren,
    siret,
    nom_complet: nom,
    raison_sociale: record.nom_raison_sociale,
    code_naf,
    libelle_naf: record.libelle_activite_principale,
    adresse_complete,
    code_postal: cp,
    commune: ville,
    tva_intra: computeTvaIntra(siren)
  };
}

/**
 * Recherche des entreprises par nom commercial, mot-clé, SIREN ou SIRET
 */
export async function searchEntreprisesGouv(query: string): Promise<EntrepriseSearchResult[]> {
  const trimmed = query.trim();
  if (trimmed.length < 2) return [];

  const url = `https://recherche-entreprises.api.gouv.fr/search?q=${encodeURIComponent(trimmed)}&limite=5`;

  try {
    const res = await fetch(url, {
      headers: {
        Accept: 'application/json'
      }
    });

    if (!res.ok) {
      console.warn(`[INSEE API] Erreur HTTP ${res.status}`);
      return [];
    }

    const data = await res.json();
    const results = data.results || [];
    return results.map(parseEntrepriseRecord);
  } catch (err) {
    console.error('[INSEE API] Échec de la recherche entreprise :', err);
    return [];
  }
}
