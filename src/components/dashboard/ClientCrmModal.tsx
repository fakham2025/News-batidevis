import React, { useState, useEffect } from 'react';
import { 
  X, 
  Users, 
  Search, 
  UserPlus, 
  Phone, 
  Mail, 
  MapPin, 
  PlusCircle, 
  Check, 
  Save, 
  Building2 
} from 'lucide-react';
import { Button } from '../ui/Button';
import { 
  getClientContacts, 
  saveClientContact, 
  searchClientContacts, 
  type ClientContact 
} from '../../services/clientCrm';

interface ClientCrmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectClientForQuote?: (client: ClientContact) => void;
}

export function ClientCrmModal({ isOpen, onClose, onSelectClientForQuote }: ClientCrmModalProps) {
  const [clients, setClients] = useState<ClientContact[]>([]);
  const [search, setSearch] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');

  const refreshClients = () => {
    const list = search ? searchClientContacts(search) : getClientContacts();
    setClients(list);
  };

  useEffect(() => {
    if (isOpen) {
      refreshClients();
    }
  }, [isOpen, search]);

  if (!isOpen) return null;

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    saveClientContact({
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      address: address.trim(),
      notes: notes.trim()
    });

    setName('');
    setPhone('');
    setEmail('');
    setAddress('');
    setNotes('');
    setShowAddForm(false);
    refreshClients();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-5 relative max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Carnet de Clients Artisan (CRM)
              </h3>
              <p className="text-xs text-slate-500">
                {clients.length} contact{clients.length > 1 ? 's' : ''} enregistré{clients.length > 1 ? 's' : ''}
              </p>
            </div>
          </div>

          <Button
            type="button"
            size="sm"
            onClick={() => setShowAddForm(!showAddForm)}
            className="text-xs bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>{showAddForm ? 'Fermer l\'ajout' : 'Ajouter un client'}</span>
          </Button>
        </div>

        {/* Formulaire d'ajout rapide */}
        {showAddForm && (
          <form onSubmit={handleAddSubmit} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 animate-in fade-in-50 duration-150">
            <h4 className="text-xs font-bold text-slate-900 uppercase">
              Nouveau client
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                  Nom & Prénom <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="M. Marc Dupont"
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Téléphone mobile</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="06 12 34 56 78"
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Adresse email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="client@gmail.com"
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Adresse du chantier</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="14 rue des Lilas, 69003 Lyon"
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white"
                />
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <Button type="submit" size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5">
                <Save className="w-3.5 h-3.5" />
                <span>Enregistrer la fiche client</span>
              </Button>
            </div>
          </form>
        )}

        {/* Barre de recherche */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par nom, téléphone, ville..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Liste des fiches clients */}
        <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
          {clients.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-xs">
              Aucun client trouvé dans votre carnet.
            </div>
          ) : (
            clients.map((client) => (
              <div
                key={client.id}
                className="p-3.5 rounded-2xl border border-slate-200/90 hover:border-slate-300 bg-white shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all"
              >
                <div className="space-y-1 min-w-0">
                  <h4 className="font-heading font-bold text-xs sm:text-sm text-slate-900 truncate">
                    {client.name}
                  </h4>

                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 font-sans">
                    {client.phone && (
                      <span className="flex items-center gap-1 font-mono text-slate-700">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span>{client.phone}</span>
                      </span>
                    )}

                    {client.email && (
                      <span className="flex items-center gap-1">
                        <Mail className="w-3 h-3 text-slate-400" />
                        <span className="truncate">{client.email}</span>
                      </span>
                    )}
                  </div>

                  {client.address && (
                    <div className="flex items-center gap-1 text-[11px] text-slate-500 truncate">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="truncate">{client.address}</span>
                    </div>
                  )}
                </div>

                {onSelectClientForQuote && (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => onSelectClientForQuote(client)}
                    className="text-xs border-blue-200 text-blue-700 hover:bg-blue-50 flex items-center gap-1 cursor-pointer shrink-0 self-start sm:self-auto"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Créer un devis</span>
                  </Button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
