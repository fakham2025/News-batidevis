/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { 
  X, 
  Plus, 
  Trash2, 
  Check, 
  Send, 
  Share2, 
  FileText, 
  Printer, 
  PenTool, 
  ShieldCheck, 
  Sparkles, 
  Layers, 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  Clock, 
  MessageCircle, 
  Mail, 
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { 
  Document, 
  DocumentItem, 
  Profile, 
  Kit, 
  getSavedProfile, 
  getSavedKits, 
  getSavedDocuments, 
  saveSingleDocument, 
  deleteDocument,
  DEFAULT_PROFILE 
} from '../services/db';

interface DevisBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialKit?: Kit | null;
  onGoToWaitlist: () => void;
}

export function DevisBuilderModal({
  isOpen,
  onClose,
  initialKit,
  onGoToWaitlist
}: DevisBuilderModalProps) {
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [currentDoc, setCurrentDoc] = useState<Document | null>(null);
  const [kits, setKits] = useState<Kit[]>([]);
  const [isSimulatedOffline, setIsSimulatedOffline] = useState(false);
  const [showSignaturePad, setShowSignaturePad] = useState(false);
  const [signatureName, setSignatureName] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const p = getSavedProfile();
      setProfile(p);
      const docs = getSavedDocuments();
      setDocuments(docs);
      const k = getSavedKits();
      setKits(k);

      if (docs.length > 0) {
        setCurrentDoc(docs[0]);
      } else {
        handleCreateNewDoc();
      }

      // Si un kit a été passé depuis la landing page, l'insérer
      if (initialKit) {
        applyKitToCurrentDoc(initialKit);
      }
    }
  }, [isOpen, initialKit]);

  if (!isOpen) return null;

  const showNotify = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleCreateNewDoc = () => {
    const nextNum = documents.length + 86;
    const today = new Date().toISOString().slice(0, 10);
    const inOneMonth = new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString().slice(0, 10);

    const newDoc: Document = {
      id: `doc_${Date.now()}`,
      user_id: profile.id,
      client_id: `cli_${Date.now()}`,
      client_name: 'M. Jean Lefort',
      client_address: '42 Rue Gambetta,  Nantes',
      client_email: 'jean.lefort@gmail.com',
      client_phone: '06 11 22 33 44',
      type: 'devis',
      document_number: `DEV-2026-0${nextNum}`,
      date: today,
      due_date: inOneMonth,
      status: isSimulatedOffline ? 'brouillon_local' : 'brouillon',
      notes: 'TVA intermédiaire à 10% appliquée sur travaux d\'amélioration et rénovation dans un logement de plus de 2 ans.',
      footer: profile.is_tva_subject 
        ? `TVA 10% selon art. 279-0 bis du CGI. ${profile.insurance_info}`
        : `Dispensé d'immatriculation au RCS et de TVA selon l'article 293 B du Code Général des Impôts. ${profile.insurance_info}`,
      tva_rate_default: profile.is_tva_subject ? 10 : 0,
      total_ht: 0,
      total_tva: 0,
      total_ttc: 0,
      synced_at: isSimulatedOffline ? null : new Date().toISOString(),
      created_at: new Date().toISOString(),
      items: [
        {
          id: `item_${Date.now()}_1`,
          document_id: `doc_${Date.now()}`,
          description: 'Fourniture & Pose équipement principal',
          quantity: 1,
          unit_price: 650.00,
          unit: 'forfait',
          tva_rate: profile.is_tva_subject ? 10 : 0,
          total: 650.00,
          position: 0
        },
        {
          id: `item_${Date.now()}_2`,
          document_id: `doc_${Date.now()}`,
          description: 'Main d\'œuvre raccordements et mise en service',
          quantity: 3,
          unit_price: 60.00,
          unit: 'heure',
          tva_rate: profile.is_tva_subject ? 10 : 0,
          total: 180.00,
          position: 1
        }
      ]
    };

    recalculateTotals(newDoc);
  };

  const recalculateTotals = (doc: Document) => {
    const total_ht = doc.items.reduce((acc, it) => acc + (it.quantity * it.unit_price), 0);
    const total_tva = doc.items.reduce((acc, it) => acc + (it.quantity * it.unit_price * (it.tva_rate / 100)), 0);
    const total_ttc = total_ht + total_tva;

    const updated: Document = {
      ...doc,
      total_ht: Math.round(total_ht * 100) / 100,
      total_tva: Math.round(total_tva * 100) / 100,
      total_ttc: Math.round(total_ttc * 100) / 100
    };

    setCurrentDoc(updated);
    const updatedDocs = saveSingleDocument(updated);
    setDocuments(updatedDocs);
  };

  const handleAddItem = () => {
    if (!currentDoc) return;
    const newItem: DocumentItem = {
      id: `it_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      document_id: currentDoc.id,
      description: 'Nouvelle prestation / fourniture',
      quantity: 1,
      unit_price: 100.00,
      unit: 'unité',
      tva_rate: currentDoc.tva_rate_default,
      total: 100.00,
      position: currentDoc.items.length
    };

    const docUpdated = {
      ...currentDoc,
      items: [...currentDoc.items, newItem]
    };
    recalculateTotals(docUpdated);
  };

  const handleUpdateItem = (itemId: string, field: keyof DocumentItem, val: any) => {
    if (!currentDoc) return;
    const updatedItems = currentDoc.items.map(it => {
      if (it.id === itemId) {
        const itemCopy = { ...it, [field]: val };
        itemCopy.total = Math.round(itemCopy.quantity * itemCopy.unit_price * 100) / 100;
        return itemCopy;
      }
      return it;
    });

    const docUpdated = { ...currentDoc, items: updatedItems };
    recalculateTotals(docUpdated);
  };

  const handleDeleteItem = (itemId: string) => {
    if (!currentDoc) return;
    const updatedItems = currentDoc.items.filter(it => it.id !== itemId);
    const docUpdated = { ...currentDoc, items: updatedItems };
    recalculateTotals(docUpdated);
  };

  const applyKitToCurrentDoc = (kit: Kit) => {
    if (!currentDoc) return;
    const kitDocumentItems: DocumentItem[] = kit.items.map((ki, idx) => ({
      id: `it_k_${Date.now()}_${idx}`,
      document_id: currentDoc.id,
      kit_id: kit.id,
      description: ki.description,
      quantity: ki.quantity,
      unit_price: ki.unit_price,
      unit: ki.unit || 'unité',
      tva_rate: currentDoc.tva_rate_default,
      total: ki.total,
      position: currentDoc.items.length + idx
    }));

    const docUpdated = {
      ...currentDoc,
      items: [...currentDoc.items, ...kitDocumentItems]
    };
    recalculateTotals(docUpdated);
    showNotify(`Kit "${kit.name}" ajouté avec succès au devis !`);
  };

  const handleSignDocument = () => {
    if (!currentDoc) return;
    const name = signatureName.trim() || currentDoc.client_name;
    const updated: Document = {
      ...currentDoc,
      status: 'accepte',
      signed_at: new Date().toISOString(),
      signature_svg: `Bon pour accord - ${name}`
    };
    saveSingleDocument(updated);
    setCurrentDoc(updated);
    setShowSignaturePad(false);
    showNotify('✅ Devis signé avec succès ! Mention horodatée enregistrée.');
  };

  const handleSyncToCloud = () => {
    if (!currentDoc) return;
    const updated: Document = {
      ...currentDoc,
      status: currentDoc.status === 'brouillon_local' ? 'brouillon' : currentDoc.status,
      synced_at: new Date().toISOString()
    };
    saveSingleDocument(updated);
    setCurrentDoc(updated);
    showNotify('☁️ Synchronisation cloud réussie (0 conflit) !');
  };

  const handlePrint = () => {
    window.print();
  };

  const getStatusBadge = (status: Document['status']) => {
    switch (status) {
      case 'brouillon':
        return <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] font-bold">Brouillon</span>;
      case 'brouillon_local':
        return <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1"><WifiOff className="w-2.5 h-2.5" /> Hors-ligne</span>;
      case 'envoye':
        return <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-[10px] font-bold">Envoyé</span>;
      case 'accepte':
        return <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1"><Check className="w-2.5 h-2.5" /> Signé / Accepté</span>;
      case 'paye':
        return <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded text-[10px] font-bold">Payé</span>;
      case 'refuse':
        return <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded text-[10px] font-bold">Refusé</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="relative bg-white rounded-3xl max-w-5xl w-full max-h-[95vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Top Header */}
        <div className="bg-slate-950 text-white px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-extrabold text-base sm:text-lg">
                  DevisBuilder 2026
                </h3>
                <span className="font-mono text-[10px] font-bold text-blue-300 bg-blue-950 px-2 py-0.5 rounded border border-blue-800">
                  MVP Chantier
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-sans hidden sm:block">
                Créez, modifiez et faites signer vos devis et factures conformes en temps réel.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Offline toggle simulation */}
            <button
              type="button"
              onClick={() => setIsSimulatedOffline(!isSimulatedOffline)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer transition-colors ${
                isSimulatedOffline 
                  ? 'bg-amber-950 text-amber-300 border border-amber-800' 
                  : 'bg-slate-800 text-slate-300 border border-slate-700'
              }`}
              title="Basculer la simulation de réseau (hors-ligne / 4G)"
            >
              {isSimulatedOffline ? <WifiOff className="w-3.5 h-3.5 text-amber-400" /> : <Wifi className="w-3.5 h-3.5 text-blue-400" />}
              <span className="hidden sm:inline">{isSimulatedOffline ? 'Mode Hors-ligne (0 barre)' : 'Connecté 4G'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-900 transition-colors cursor-pointer"
              aria-label="Fermer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Sub-bar: Actions & Document Switcher */}
        <div className="bg-slate-100 border-b border-slate-200 px-4 sm:px-6 py-2.5 flex items-center justify-between flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-slate-700">Documents récents :</span>
            {documents.slice(0, 3).map(d => (
              <button
                key={d.id}
                type="button"
                onClick={() => setCurrentDoc(d)}
                className={`px-2.5 py-1 rounded-lg font-mono text-[11px] font-bold cursor-pointer transition-all ${
                  currentDoc?.id === d.id
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
                }`}
              >
                {d.document_number} ({d.client_name.split(' ')[0]})
              </button>
            ))}
            <button
              type="button"
              onClick={handleCreateNewDoc}
              className="px-2.5 py-1 rounded-lg bg-white border border-dashed border-blue-400 text-blue-700 hover:bg-blue-50 font-bold flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3 h-3" />
              <span>Nouveau</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {currentDoc && !currentDoc.synced_at && (
              <button
                type="button"
                onClick={handleSyncToCloud}
                className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold flex items-center gap-1 shadow-xs cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Sync Cloud</span>
              </button>
            )}

            <button
              type="button"
              onClick={handlePrint}
              className="px-2.5 py-1 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Imprimer / PDF</span>
            </button>

            <button
              type="button"
              onClick={() => setShowShareModal(true)}
              className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center gap-1 shadow-sm cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Partager</span>
            </button>
          </div>
        </div>

        {notification && (
          <div className="bg-emerald-600 text-white text-xs px-4 py-2 font-medium flex items-center justify-between animate-in fade-in">
            <span>{notification}</span>
            <button onClick={() => setNotification(null)} className="cursor-pointer">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Modal Main Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {currentDoc && (
            <div className="space-y-6 max-w-4xl mx-auto">
              
              {/* Document Header (Enterprise + Client) */}
              <div className="bg-slate-50 rounded-2xl p-4 sm:p-6 border border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
                {/* Enterprise Info */}
                <div className="space-y-1.5 text-left">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] uppercase font-bold text-slate-500">
                      ÉMETTEUR (VOTRE ENTREPRISE)
                    </span>
                    <span className="text-[10px] text-blue-600 font-semibold">16 mentions conformes</span>
                  </div>
                  <div className="font-heading font-extrabold text-sm text-slate-900">
                    {profile.company_name}
                  </div>
                  <div className="text-slate-600">SIRET : {profile.siret} • RCS {profile.address?.split(',')[1] || 'Nantes'}</div>
                  <div className="text-slate-600">{profile.address} • Tél : {profile.phone}</div>
                  <div className="text-emerald-700 font-semibold flex items-center gap-1 pt-0.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{profile.insurance_info}</span>
                  </div>
                </div>

                {/* Client Info & Document Meta */}
                <div className="space-y-2 text-left md:border-l md:border-slate-200 md:pl-5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] uppercase font-bold text-slate-500">
                      DESTINATAIRE (CLIENT)
                    </span>
                    {getStatusBadge(currentDoc.status)}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-slate-500 block font-semibold">Nom du client :</label>
                      <input
                        type="text"
                        value={currentDoc.client_name}
                        onChange={(e) => {
                          const updated = { ...currentDoc, client_name: e.target.value };
                          setCurrentDoc(updated);
                          saveSingleDocument(updated);
                        }}
                        className="w-full px-2 py-1 rounded-md border border-slate-300 text-xs font-bold text-slate-900 bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 block font-semibold">Téléphone mobile :</label>
                      <input
                        type="text"
                        value={currentDoc.client_phone || ''}
                        onChange={(e) => {
                          const updated = { ...currentDoc, client_phone: e.target.value };
                          setCurrentDoc(updated);
                          saveSingleDocument(updated);
                        }}
                        className="w-full px-2 py-1 rounded-md border border-slate-300 text-xs text-slate-900 bg-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 block font-semibold">Adresse du chantier :</label>
                    <input
                      type="text"
                      value={currentDoc.client_address || ''}
                      onChange={(e) => {
                        const updated = { ...currentDoc, client_address: e.target.value };
                        setCurrentDoc(updated);
                        saveSingleDocument(updated);
                      }}
                      className="w-full px-2 py-1 rounded-md border border-slate-300 text-xs text-slate-900 bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Kit Insert Quick Strip */}
              <div className="bg-blue-50/80 rounded-2xl p-3 border border-blue-200 flex items-center justify-between flex-wrap gap-2 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-blue-950">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span>Insérer un Kit Chantier pré-configuré :</span>
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {kits.map(k => (
                    <button
                      key={k.id}
                      type="button"
                      onClick={() => applyKitToCurrentDoc(k)}
                      className="px-2.5 py-1 rounded-lg bg-white hover:bg-blue-600 hover:text-white border border-blue-300 text-blue-900 font-semibold text-[11px] transition-colors cursor-pointer"
                    >
                      + {k.name.split(' ')[0]} {k.name.split(' ')[1]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Lines Table */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 border-b border-slate-200 font-heading font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                      <tr>
                        <th className="py-2.5 px-3">Désignation des Prestations & Matériaux</th>
                        <th className="py-2.5 px-3 w-20 text-center">Quantité</th>
                        <th className="py-2.5 px-3 w-20 text-center">Unité</th>
                        <th className="py-2.5 px-3 w-24 text-right">Prix Unit. HT</th>
                        <th className="py-2.5 px-3 w-20 text-center">TVA</th>
                        <th className="py-2.5 px-3 w-24 text-right">Total HT</th>
                        <th className="py-2.5 px-2 w-10 text-center"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-sans">
                      {currentDoc.items.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50/60">
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={item.description}
                              onChange={(e) => handleUpdateItem(item.id, 'description', e.target.value)}
                              className="w-full px-2 py-1 rounded border border-transparent hover:border-slate-300 focus:border-blue-500 focus:bg-white text-slate-900 font-medium"
                            />
                          </td>
                          <td className="py-2 px-3 text-center">
                            <input
                              type="number"
                              min="0.1"
                              step="0.5"
                              value={item.quantity}
                              onChange={(e) => handleUpdateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                              className="w-16 px-1.5 py-1 text-center font-mono rounded border border-slate-200 focus:border-blue-500"
                            />
                          </td>
                          <td className="py-2 px-3 text-center">
                            <select
                              value={item.unit || 'unité'}
                              onChange={(e) => handleUpdateItem(item.id, 'unit', e.target.value)}
                              className="px-1 py-1 rounded border border-slate-200 text-[11px] bg-white"
                            >
                              <option value="unité">u.</option>
                              <option value="heure">h.</option>
                              <option value="m²">m²</option>
                              <option value="ml">ml</option>
                              <option value="forfait">forfait</option>
                            </select>
                          </td>
                          <td className="py-2 px-3 text-right">
                            <input
                              type="number"
                              min="0"
                              step="1"
                              value={item.unit_price}
                              onChange={(e) => handleUpdateItem(item.id, 'unit_price', parseFloat(e.target.value) || 0)}
                              className="w-20 px-1.5 py-1 text-right font-mono rounded border border-slate-200 focus:border-blue-500 font-bold"
                            />
                          </td>
                          <td className="py-2 px-3 text-center">
                            <select
                              value={item.tva_rate}
                              onChange={(e) => handleUpdateItem(item.id, 'tva_rate', parseFloat(e.target.value))}
                              className="px-1 py-1 rounded border border-slate-200 text-[11px] font-mono bg-white"
                            >
                              <option value={10}>10%</option>
                              <option value={5.5}>5.5%</option>
                              <option value={20}>20%</option>
                              <option value={0}>0%</option>
                            </select>
                          </td>
                          <td className="py-2 px-3 text-right font-mono font-bold text-slate-900">
                            {item.total.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
                          </td>
                          <td className="py-2 px-2 text-center">
                            <button
                              type="button"
                              onClick={() => handleDeleteItem(item.id)}
                              className="text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                              title="Supprimer cette ligne"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:border-blue-500 text-slate-700 hover:text-blue-600 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Ajouter une ligne manuelle</span>
                  </button>

                  <span className="text-[11px] text-slate-500 font-mono">
                    {currentDoc.items.length} ligne(s) au devis
                  </span>
                </div>
              </div>

              {/* Totals & Legal Footer Strip */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                {/* Left: Legal mentions & signature state */}
                <div className="md:col-span-7 bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2.5 text-xs text-left">
                  <div className="font-heading font-bold text-slate-900 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                    <span>Mentions légales obligatoires 2026 :</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed font-sans">
                    {currentDoc.footer}
                  </p>
                  
                  {/* Signature block */}
                  <div className="pt-2 border-t border-slate-200">
                    {currentDoc.status === 'accepte' ? (
                      <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-between">
                        <div>
                          <div className="font-bold flex items-center gap-1">
                            <Check className="w-4 h-4 text-emerald-600" />
                            <span>Devis officiellement signé par le client</span>
                          </div>
                          <div className="text-[10px] text-emerald-700 font-mono mt-0.5">
                            Horodaté le {new Date(currentDoc.signed_at || '').toLocaleDateString('fr-FR')} • {currentDoc.signature_svg}
                          </div>
                        </div>
                        <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-200/60 px-2 py-0.5 rounded">
                          VALIDE
                        </span>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setShowSignaturePad(true)}
                        className="w-full py-2.5 px-3 rounded-xl bg-white border border-blue-300 hover:bg-blue-50 text-blue-800 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
                      >
                        <PenTool className="w-4 h-4 text-blue-600" />
                        <span>Faire signer le client sur votre écran (1-clic)</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Right: Calculations Totals Box */}
                <div className="md:col-span-5 bg-slate-950 text-white rounded-2xl p-4 sm:p-5 border border-slate-800 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Total Brut HT :</span>
                    <span className="font-mono text-white font-bold">
                      {currentDoc.total_ht.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
                    </span>
                  </div>

                  <div className="flex justify-between text-slate-400">
                    <span>Total TVA collectée :</span>
                    <span className="font-mono text-slate-300">
                      {currentDoc.total_tva.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
                    </span>
                  </div>

                  <div className="flex justify-between text-base font-bold text-white pt-2.5 border-t border-slate-800">
                    <span className="font-heading">NET À PAYER TTC :</span>
                    <span className="font-mono text-blue-400 text-lg font-extrabold">
                      {currentDoc.total_ttc.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
                    </span>
                  </div>

                  <div className="pt-2 flex gap-2">
                    <button
                      type="button"
                      onClick={() => setShowShareModal(true)}
                      className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-heading font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-blue-600/25 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Envoyer au client</span>
                    </button>
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-4 sm:px-6 py-3 flex items-center justify-between text-xs text-slate-500 font-sans">
          <span>
            BâtiDevis Offline-first • {isSimulatedOffline ? 'Mode Local Enregistré' : 'Connecté Cloud Supabase'}
          </span>
          <button
            type="button"
            onClick={() => {
              onClose();
              onGoToWaitlist();
            }}
            className="text-blue-600 font-bold hover:underline cursor-pointer"
          >
            Réserver mon accès anticipé (-50% à vie) →
          </button>
        </div>

      </div>

      {/* Signature Modal */}
      {showSignaturePad && (
        <div className="fixed inset-0 z-60 bg-black/70 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 text-left shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h4 className="font-heading font-bold text-base text-slate-900 flex items-center gap-2">
                <PenTool className="w-4 h-4 text-blue-600" />
                Signature du client sur écran
              </h4>
              <button onClick={() => setShowSignaturePad(false)} className="cursor-pointer text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Faites signer le client du bout du doigt ou confirmez son accord verbal pour marquer le devis comme <strong>Accepté</strong> avec valeur juridique tracée.
            </p>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Nom complet du signataire :
              </label>
              <input
                type="text"
                placeholder={currentDoc?.client_name || 'M. Marc Dupont'}
                value={signatureName}
                onChange={(e) => setSignatureName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-semibold"
              />
            </div>

            <div className="h-28 rounded-xl border-2 border-dashed border-blue-400 bg-blue-50/50 flex items-center justify-center text-blue-900 font-serif italic text-lg select-none">
              ✍️ "Bon pour accord et exécution des travaux"
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowSignaturePad(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleSignDocument}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/25 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Valider la signature</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal (WhatsApp & Direct Email) */}
      {showShareModal && currentDoc && (
        <div className="fixed inset-0 z-60 bg-black/70 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 text-left shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h4 className="font-heading font-bold text-base text-slate-900 flex items-center gap-2">
                <Share2 className="w-4 h-4 text-blue-600" />
                Transmettre au client ({currentDoc.document_number})
              </h4>
              <button onClick={() => setShowShareModal(false)} className="cursor-pointer text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Choisissez le canal préféré de votre client. Le devis est instantanément consultable sur mobile :
            </p>

            <div className="space-y-2.5">
              {/* WhatsApp direct */}
              <a
                href={`https://wa.me/?text=${encodeURIComponent(
                  `Bonjour ${currentDoc.client_name}, voici votre devis ${currentDoc.document_number} pour un montant de ${currentDoc.total_ttc.toFixed(2)} € TTC. Vous pouvez le consulter et le signer en 1 clic : https://batidevis.fr/d/${currentDoc.id}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  const updated: Document = { ...currentDoc, status: 'envoye' };
                  saveSingleDocument(updated);
                  setCurrentDoc(updated);
                  setShowShareModal(false);
                  showNotify('Devis transmis via WhatsApp ! Statut passé à "Envoyé".');
                }}
                className="w-full p-3.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-950 flex items-center justify-between transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-xs text-slate-900">Envoyer par WhatsApp</div>
                    <div className="text-[11px] text-emerald-700">Taux d'ouverture 98% immédiat</div>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-emerald-700" />
              </a>

              {/* Email direct */}
              <a
                href={`mailto:${currentDoc.client_email || ''}?subject=${encodeURIComponent(
                  `Votre devis ${currentDoc.document_number} - ${profile.company_name}`
                )}&body=${encodeURIComponent(
                  `Bonjour ${currentDoc.client_name},\n\nVeuillez trouver ci-joint votre devis n° ${currentDoc.document_number} d'un montant total de ${currentDoc.total_ttc.toFixed(2)} € TTC.\n\nDescription : ${currentDoc.items.map(i => i.description).join(', ')}\n\nBien cordialement,\n${profile.company_name}\nTél : ${profile.phone}`
                )}`}
                onClick={() => {
                  const updated: Document = { ...currentDoc, status: 'envoye' };
                  saveSingleDocument(updated);
                  setCurrentDoc(updated);
                  setShowShareModal(false);
                  showNotify('Email préparé ! Statut passé à "Envoyé".');
                }}
                className="w-full p-3.5 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-300 text-blue-950 flex items-center justify-between transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-xs text-slate-900">Envoyer par Email direct</div>
                    <div className="text-[11px] text-blue-700">Message pré-rédigé avec mentions</div>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-blue-700" />
              </a>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowShareModal(false)}
                className="w-full py-2.5 rounded-xl border border-slate-300 text-slate-600 text-xs font-semibold"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
