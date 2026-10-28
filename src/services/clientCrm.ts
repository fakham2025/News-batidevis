/**
 * Service Mini-CRM BTP — Carnet de Clients Artisan
 * Sauvegarde, recherche multi-critères et synchronisation des fiches clients.
 */

export interface ClientContact {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  notes?: string;
  totalQuotes?: number;
  totalInvoiced?: number;
  lastQuoteDate?: string;
  createdAt: string;
}

const STORAGE_KEY_CLIENTS = 'batidevis_crm_clients_v1';
let inMemoryClients: ClientContact[] = [];

/**
 * Vide le cache pour les tests unitaires
 */
export function clearClientsStorage(): void {
  inMemoryClients = [];
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY_CLIENTS);
    }
  } catch {}
}

/**
 * Récupère tous les contacts clients enregistrés
 */
export function getClientContacts(): ClientContact[] {
  try {
    if (typeof localStorage !== 'undefined') {
      const raw = localStorage.getItem(STORAGE_KEY_CLIENTS);
      if (raw) {
        return JSON.parse(raw);
      }
    }
  } catch {}
  return [...inMemoryClients];
}

/**
 * Trouve un client par téléphone ou email
 */
export function findClientByPhoneOrEmail(phone?: string, email?: string): ClientContact | undefined {
  const all = getClientContacts();
  const cleanPhone = phone?.replace(/[\s.-]/g, '');

  return all.find((c) => {
    if (cleanPhone && c.phone && c.phone.replace(/[\s.-]/g, '') === cleanPhone) {
      return true;
    }
    if (email && c.email && c.email.toLowerCase() === email.toLowerCase()) {
      return true;
    }
    return false;
  });
}

/**
 * Enregistre ou met à jour une fiche client
 */
export function saveClientContact(
  clientData: Omit<ClientContact, 'id' | 'createdAt'> & { id?: string }
): ClientContact {
  const all = getClientContacts();
  const existing = clientData.id 
    ? all.find((c) => c.id === clientData.id) 
    : findClientByPhoneOrEmail(clientData.phone, clientData.email);

  let result: ClientContact;

  if (existing) {
    result = {
      ...existing,
      name: clientData.name || existing.name,
      email: clientData.email || existing.email,
      phone: clientData.phone || existing.phone,
      address: clientData.address || existing.address,
      notes: clientData.notes || existing.notes,
      totalQuotes: clientData.totalQuotes ?? existing.totalQuotes,
      totalInvoiced: clientData.totalInvoiced ?? existing.totalInvoiced,
      lastQuoteDate: clientData.lastQuoteDate || existing.lastQuoteDate
    };

    const index = all.findIndex((c) => c.id === existing.id);
    all[index] = result;
  } else {
    result = {
      ...clientData,
      id: clientData.id || `cli_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString()
    };
    all.unshift(result);
  }

  inMemoryClients = all;

  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_CLIENTS, JSON.stringify(all));
    }
  } catch {}

  return result;
}

/**
 * Recherche multi-critères dans le carnet clients
 */
export function searchClientContacts(query: string): ClientContact[] {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return getClientContacts();

  const all = getClientContacts();
  return all.filter((c) => {
    const matchName = c.name?.toLowerCase().includes(trimmed);
    const matchEmail = c.email?.toLowerCase().includes(trimmed);
    const matchPhone = c.phone?.replace(/[\s.-]/g, '').includes(trimmed.replace(/[\s.-]/g, ''));
    const matchAddress = c.address?.toLowerCase().includes(trimmed);
    return matchName || matchEmail || matchPhone || matchAddress;
  });
}
