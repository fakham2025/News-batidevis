'use client';

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
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
  Wifi, 
  WifiOff, 
  RefreshCw, 
  Clock, 
  MessageCircle, 
  Mail, 
  ArrowRight,
  ExternalLink,
  Upload,
  Image as ImageIcon,
  Percent,
  Coins,
  Settings2,
  Calendar,
  Building2,
  Receipt,
  FileCheck
} from 'lucide-react';
import { 
  Document, 
  DocumentItem, 
  Profile, 
  Kit, 
  getSavedProfile, 
  saveProfile,
  getSavedKits, 
  getSavedDocuments, 
  saveSingleDocument, 
  deleteDocument,
  DEFAULT_PROFILE,
  calculateDocumentFinancials,
  TvaBreakdownItem 
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
  const [showEnterpriseSettings, setShowEnterpriseSettings] = useState(false);

  // Remise & Acompte states
  const [discountType, setDiscountType] = useState<'none' | 'percent' | 'fixed'>('none');
  const [discountValue, setDiscountValue] = useState<number>(0);
  const [depositEnabled, setDepositEnabled] = useState<boolean>(true);
  const [depositRate, setDepositRate] = useState<number>(30); // 30% FFB/CAPEB

  // Canvas Signature Touch Pad
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignatureDrawn, setHasSignatureDrawn] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      const p = getSavedProfile();
      setProfile(p);
      const docs = getSavedDocuments();
      setDocuments(docs);
      const k = getSavedKits();
      setKits(k);

      if (docs.length > 0) {
        const doc = docs[0];
        setCurrentDoc(doc);
        setDiscountType(doc.discount_type === 'percent' ? 'percent' : doc.discount_type === 'fixed' ? 'fixed' : 'none');
        setDiscountValue(doc.discount_value || 0);
        setDepositRate(doc.deposit_rate ?? 30);
        setDepositEnabled((doc.deposit_rate ?? 30) > 0);
      } else {
        handleCreateNewDoc();
      }

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

  // Recalcul des totaux avec multi-TVA, remise et acompte
  const recalculateAndSave = (
    doc: Document, 
    items: DocumentItem[],
    dType = discountType,
    dVal = discountValue,
    depRate = depositEnabled ? depositRate : 0
  ) => {
    const fin = calculateDocumentFinancials(
      items,
      profile.is_tva_subject,
      dType,
      dVal,
      depRate
    );

    const updated: Document = {
      ...doc,
      items,
      discount_type: dType === 'none' ? undefined : dType,
      discount_value: dVal,
      discount_amount: fin.discount_amount,
      deposit_rate: depRate,
      deposit_amount: fin.deposit_amount,
      balance_due: fin.balance_due,
      tva_breakdown: fin.tva_breakdown,
      total_ht: fin.net_total_ht,
      total_tva: fin.total_tva,
      total_ttc: fin.total_ttc
    };

    setCurrentDoc(updated);
    const updatedDocs = saveSingleDocument(updated);
    setDocuments(updatedDocs);
  };

  const handleCreateNewDoc = () => {
    const nextNum = documents.length + 86;
    const today = new Date().toISOString().slice(0, 10);
    const inOneMonth = new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString().slice(0, 10);

    const initialItems: DocumentItem[] = [
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
    ];

    const fin = calculateDocumentFinancials(
      initialItems, 
      profile.is_tva_subject, 
      'none', 
      0, 
      30
    );

    const newDoc: Document = {
      id: `doc_${Date.now()}`,
      user_id: profile.id,
      client_id: `cli_${Date.now()}`,
      client_name: 'M. Jean Lefort',
      client_address: '42 Rue Gambetta, 44000 Nantes',
      client_email: 'jean.lefort@gmail.com',
      client_phone: '06 11 22 33 44',
      type: 'devis',
      document_number: `${profile.document_prefix || 'DEV-2026-'}${nextNum}`,
      date: today,
      due_date: inOneMonth,
      status: isSimulatedOffline ? 'brouillon_local' : 'brouillon',
      notes: 'TVA intermédiaire à 10% appliquée sur travaux de rénovation et amélioration dans un logement achevé depuis plus de 2 ans.',
      footer: profile.is_tva_subject 
        ? `TVA selon réglementation en vigueur (art. 279-0 bis du CGI). ${profile.insurance_info}`
        : `Dispensé d'immatriculation au RCS et de TVA selon l'article 293 B du CGI. ${profile.insurance_info}`,
      tva_rate_default: profile.is_tva_subject ? 10 : 0,
      discount_type: undefined,
      discount_value: 0,
      discount_amount: 0,
      deposit_rate: 30,
      deposit_amount: fin.deposit_amount,
      balance_due: fin.balance_due,
      tva_breakdown: fin.tva_breakdown,
      total_ht: fin.net_total_ht,
      total_tva: fin.total_tva,
      total_ttc: fin.total_ttc,
      synced_at: isSimulatedOffline ? null : new Date().toISOString(),
      created_at: new Date().toISOString(),
      items: initialItems
    };

    setDiscountType('none');
    setDiscountValue(0);
    setDepositEnabled(true);
    setDepositRate(30);

    setCurrentDoc(newDoc);
    const updatedDocs = saveSingleDocument(newDoc);
    setDocuments(updatedDocs);
    showNotify('Nouveau devis généré avec succès.');
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
      tva_rate: profile.is_tva_subject ? currentDoc.tva_rate_default : 0,
      total: 100.00,
      position: currentDoc.items.length
    };

    const newItems = [...currentDoc.items, newItem];
    recalculateAndSave(currentDoc, newItems);
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

    recalculateAndSave(currentDoc, updatedItems);
  };

  const handleDeleteItem = (itemId: string) => {
    if (!currentDoc) return;
    const updatedItems = currentDoc.items.filter(it => it.id !== itemId);
    recalculateAndSave(currentDoc, updatedItems);
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
      tva_rate: profile.is_tva_subject ? currentDoc.tva_rate_default : 0,
      total: ki.total,
      position: currentDoc.items.length + idx
    }));

    const newItems = [...currentDoc.items, ...kitDocumentItems];
    recalculateAndSave(currentDoc, newItems);
    showNotify(`Kit "${kit.name}" ajouté avec succès !`);
  };

  // Upload Logo Artisan
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("L'image est trop lourde (maximum 2 Mo).");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      const updatedProfile: Profile = {
        ...profile,
        logo_url: base64
      };
      setProfile(updatedProfile);
      saveProfile(updatedProfile);
      showNotify("Logo d'entreprise enregistré avec succès !");
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    const updatedProfile: Profile = {
      ...profile,
      logo_url: undefined
    };
    setProfile(updatedProfile);
    saveProfile(updatedProfile);
    showNotify("Logo retiré.");
  };

  // Canvas signature helpers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#1e3a8a';
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
    setHasSignatureDrawn(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignatureDrawn(false);
  };

  const handleSaveSignature = () => {
    if (!currentDoc) return;
    const name = signatureName.trim() || currentDoc.client_name;
    const canvas = canvasRef.current;
    const signatureDataUrl = canvas ? canvas.toDataURL('image/png') : null;

    const updated: Document = {
      ...currentDoc,
      status: 'accepte',
      signed_at: new Date().toISOString(),
      signature_svg: signatureDataUrl || `Bon pour accord tactile - ${name}`
    };

    saveSingleDocument(updated);
    setCurrentDoc(updated);
    setShowSignaturePad(false);
    showNotify('Devis signé et horodaté avec traçabilité juridique !');
  };

  const handlePrint = () => {
    window.print();
  };

  const getStatusBadge = (status: Document['status']) => {
    switch (status) {
      case 'brouillon':
        return <span className="bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full text-[10px] font-bold">Brouillon</span>;
      case 'brouillon_local':
        return <span className="bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1"><WifiOff className="w-2.5 h-2.5" /> Hors-ligne</span>;
      case 'envoye':
        return <span className="bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full text-[10px] font-bold">Envoyé</span>;
      case 'accepte':
        return <span className="bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1"><Check className="w-2.5 h-2.5" /> Signé / Accepté</span>;
      case 'paye':
        return <span className="bg-purple-100 text-purple-800 px-2.5 py-0.5 rounded-full text-[10px] font-bold">Payé</span>;
      case 'refuse':
        return <span className="bg-red-100 text-red-800 px-2.5 py-0.5 rounded-full text-[10px] font-bold">Refusé</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-1 sm:p-4 animate-in fade-in duration-200">
      
      {/* Printable Sheet Wrapper */}
      <div className="relative bg-white rounded-2xl sm:rounded-3xl max-w-5xl w-full max-h-[96vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden text-left">
        
        {/* Top Header (Hidden in Print) */}
        <div className="print:hidden bg-slate-950 text-white px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-extrabold text-base sm:text-lg">
                  DevisBuilder Pro 2026
                </h3>
                <span className="font-mono text-[10px] font-bold text-blue-300 bg-blue-950 px-2 py-0.5 rounded border border-blue-800">
                  PWA Offline-First
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-sans hidden sm:block">
                Devis & Factures conformes, multi-TVA BTP, remise, acompte 30% et signature tactile.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Toggle Profil / Logo Settings */}
            <button
              type="button"
              onClick={() => setShowEnterpriseSettings(!showEnterpriseSettings)}
              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition cursor-pointer"
              title="Personnaliser logo, décennale et mentions"
            >
              <Settings2 className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden sm:inline">Mon Entreprise</span>
            </button>

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
              {isSimulatedOffline ? <WifiOff className="w-3.5 h-3.5 text-amber-400" /> : <Wifi className="w-3.5 h-3.5 text-emerald-400" />}
              <span className="hidden sm:inline">{isSimulatedOffline ? 'Hors-ligne' : 'En ligne'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-900 transition cursor-pointer"
              aria-label="Fermer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Sub-bar: Actions & Document Switcher (Hidden in Print) */}
        <div className="print:hidden bg-slate-100 border-b border-slate-200 px-4 sm:px-6 py-2.5 flex items-center justify-between flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-slate-700">Documents :</span>
            {documents.slice(0, 4).map(d => (
              <button
                key={d.id}
                type="button"
                onClick={() => {
                  setCurrentDoc(d);
                  setDiscountType(d.discount_type === 'percent' ? 'percent' : d.discount_type === 'fixed' ? 'fixed' : 'none');
                  setDiscountValue(d.discount_value || 0);
                  setDepositRate(d.deposit_rate ?? 30);
                  setDepositEnabled((d.deposit_rate ?? 30) > 0);
                }}
                className={`px-2.5 py-1 rounded-lg font-mono text-[11px] font-bold cursor-pointer transition-all ${
                  currentDoc?.id === d.id
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
                }`}
              >
                {d.document_number}
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
            <button
              type="button"
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-800 hover:bg-slate-50 font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span>Imprimer / PDF A4</span>
            </button>

            <button
              type="button"
              onClick={() => setShowShareModal(true)}
              className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Partager</span>
            </button>
          </div>
        </div>

        {/* Enterprise Settings Drawer */}
        {showEnterpriseSettings && (
          <div className="print:hidden bg-slate-900 text-white p-4 sm:p-6 border-b border-slate-800 animate-in slide-in-from-top-2">
            <div className="max-w-4xl mx-auto space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-amber-400" />
                  <h4 className="text-sm font-bold">Personnalisation Entreprise & Mentions Légales</h4>
                </div>
                <button
                  onClick={() => setShowEnterpriseSettings(false)}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Fermer
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                {/* Logo section */}
                <div className="space-y-2 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                  <label className="font-bold text-slate-300 block">Logo de l'entreprise :</label>
                  {profile.logo_url ? (
                    <div className="flex items-center gap-3">
                      <img src={profile.logo_url} alt="Logo" className="w-14 h-14 object-contain bg-white rounded-lg p-1 border" />
                      <div>
                        <button
                          onClick={handleRemoveLogo}
                          className="text-[11px] text-red-400 hover:underline block"
                        >
                          Supprimer le logo
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleLogoUpload} 
                        accept="image/*" 
                        className="hidden" 
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full py-2.5 border border-dashed border-slate-700 hover:border-amber-400 rounded-lg text-slate-400 hover:text-amber-300 flex items-center justify-center gap-2 transition"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Téléverser mon logo</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Raison sociale & SIRET */}
                <div className="space-y-2 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                  <div>
                    <label className="font-bold text-slate-300 block mb-0.5">Raison sociale :</label>
                    <input
                      type="text"
                      value={profile.company_name}
                      onChange={(e) => {
                        const p = { ...profile, company_name: e.target.value };
                        setProfile(p);
                        saveProfile(p);
                      }}
                      className="w-full px-2 py-1 bg-slate-900 border border-slate-700 rounded text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-300 block mb-0.5">N° SIRET :</label>
                    <input
                      type="text"
                      value={profile.siret || ''}
                      onChange={(e) => {
                        const p = { ...profile, siret: e.target.value };
                        setProfile(p);
                        saveProfile(p);
                      }}
                      className="w-full px-2 py-1 bg-slate-900 border border-slate-700 rounded text-xs text-white"
                    />
                  </div>
                </div>

                {/* Assurance Décennale */}
                <div className="space-y-2 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                  <div>
                    <label className="font-bold text-slate-300 block mb-0.5">Assurance Décennale obligatoire :</label>
                    <textarea
                      rows={2}
                      value={profile.insurance_info || ''}
                      onChange={(e) => {
                        const p = { ...profile, insurance_info: e.target.value };
                        setProfile(p);
                        saveProfile(p);
                      }}
                      className="w-full px-2 py-1 bg-slate-900 border border-slate-700 rounded text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-300 block mb-0.5">Préfixe de numérotation :</label>
                    <input
                      type="text"
                      placeholder="DEV-2026-"
                      value={profile.document_prefix || 'DEV-2026-'}
                      onChange={(e) => {
                        const p = { ...profile, document_prefix: e.target.value };
                        setProfile(p);
                        saveProfile(p);
                      }}
                      className="w-full px-2 py-1 bg-slate-900 border border-slate-700 rounded text-xs text-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {notification && (
          <div className="print:hidden bg-emerald-600 text-white text-xs px-4 py-2 font-medium flex items-center justify-between animate-in fade-in">
            <span>{notification}</span>
            <button onClick={() => setNotification(null)} className="cursor-pointer">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Modal Main Content / Printable Sheet */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6 print:p-0 print:overflow-visible">
          {currentDoc && (
            <div className="space-y-6 max-w-4xl mx-auto print:max-w-none print:w-full print:space-y-4">
              
              {/* Document Header (Enterprise + Client) */}
              <div className="bg-slate-50 rounded-2xl p-4 sm:p-6 border border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans print:bg-white print:border-slate-300 print:p-4">
                {/* Enterprise Info */}
                <div className="space-y-2 text-left">
                  <div className="flex items-center gap-3">
                    {profile.logo_url ? (
                      <img src={profile.logo_url} alt="Logo Entreprise" className="h-12 max-w-[120px] object-contain rounded" />
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold font-heading text-lg">
                        {profile.company_name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <div className="font-heading font-extrabold text-base text-slate-900">
                        {profile.company_name}
                      </div>
                      <div className="text-[11px] text-blue-600 font-semibold">{profile.trade}</div>
                    </div>
                  </div>

                  <div className="text-slate-600 space-y-0.5 pt-1">
                    <div>SIRET : {profile.siret} • {profile.address}</div>
                    <div>Tél : {profile.phone} • Email : {profile.email}</div>
                    {profile.is_tva_subject ? (
                      <div>N° TVA Intracommunautaire : {profile.tva_number || 'FR84849204892'}</div>
                    ) : (
                      <div className="text-amber-800 font-medium">Franchise en base de TVA (Art. 293 B du CGI)</div>
                    )}
                  </div>

                  <div className="text-emerald-700 font-semibold flex items-center gap-1.5 pt-1 bg-emerald-50/60 p-2 rounded-lg border border-emerald-200">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="text-[11px]">{profile.insurance_info}</span>
                  </div>
                </div>

                {/* Client Info & Document Meta */}
                <div className="space-y-2 text-left md:border-l md:border-slate-200 md:pl-5 print:border-l print:border-slate-300">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] uppercase font-bold text-slate-500">
                      DESTINATAIRE (CLIENT)
                    </span>
                    <div className="print:hidden">
                      {getStatusBadge(currentDoc.status)}
                    </div>
                  </div>

                  {/* Document Number & Date */}
                  <div className="grid grid-cols-2 gap-2 bg-white p-2.5 rounded-xl border border-slate-200 print:bg-slate-50">
                    <div>
                      <span className="text-[10px] text-slate-500 block font-semibold">Devis n° :</span>
                      <input
                        type="text"
                        value={currentDoc.document_number}
                        onChange={(e) => {
                          const updated = { ...currentDoc, document_number: e.target.value };
                          setCurrentDoc(updated);
                          saveSingleDocument(updated);
                        }}
                        className="w-full font-mono font-extrabold text-blue-900 text-xs bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block font-semibold">Date d'émission :</span>
                      <input
                        type="date"
                        value={currentDoc.date}
                        onChange={(e) => {
                          const updated = { ...currentDoc, date: e.target.value };
                          setCurrentDoc(updated);
                          saveSingleDocument(updated);
                        }}
                        className="w-full text-xs font-semibold text-slate-800 bg-transparent"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div>
                      <label className="text-[10px] text-slate-500 block font-semibold">Nom & Prénom du client :</label>
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
                    <div className="grid grid-cols-2 gap-2">
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
                      <div>
                        <label className="text-[10px] text-slate-500 block font-semibold">Email client :</label>
                        <input
                          type="email"
                          value={currentDoc.client_email || ''}
                          onChange={(e) => {
                            const updated = { ...currentDoc, client_email: e.target.value };
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
              </div>

              {/* Kit Insert Quick Strip (Hidden in Print) */}
              <div className="print:hidden bg-blue-50/80 rounded-2xl p-3 border border-blue-200 flex items-center justify-between flex-wrap gap-2 text-xs">
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
                      className="px-2.5 py-1 rounded-lg bg-white hover:bg-blue-600 hover:text-white border border-blue-300 text-blue-900 font-semibold text-[11px] transition cursor-pointer shadow-2xs"
                    >
                      + {k.name.split(' ')[0]} {k.name.split(' ')[1]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Lines Table */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-xs print:border-slate-300">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 border-b border-slate-200 font-heading font-bold text-slate-700 uppercase tracking-wider text-[11px] print:bg-slate-100">
                      <tr>
                        <th className="py-2.5 px-3">Désignation des Prestations & Matériaux</th>
                        <th className="py-2.5 px-3 w-20 text-center">Qté</th>
                        <th className="py-2.5 px-3 w-20 text-center">Unité</th>
                        <th className="py-2.5 px-3 w-24 text-right">P.U. HT</th>
                        {profile.is_tva_subject && (
                          <th className="py-2.5 px-3 w-24 text-center">TVA</th>
                        )}
                        <th className="py-2.5 px-3 w-24 text-right">Total HT</th>
                        <th className="print:hidden py-2.5 px-2 w-10 text-center"></th>
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
                          {profile.is_tva_subject && (
                            <td className="py-2 px-3 text-center">
                              <select
                                value={item.tva_rate}
                                onChange={(e) => handleUpdateItem(item.id, 'tva_rate', parseFloat(e.target.value))}
                                className="px-1.5 py-1 rounded border border-slate-200 text-[11px] font-mono font-bold bg-white text-blue-900"
                              >
                                <option value={10}>10% (Réno)</option>
                                <option value={5.5}>5.5% (Énerg.)</option>
                                <option value={20}>20% (Neuf)</option>
                                <option value={0}>0% (Exo)</option>
                              </select>
                            </td>
                          )}
                          <td className="py-2 px-3 text-right font-mono font-bold text-slate-900">
                            {item.total.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
                          </td>
                          <td className="print:hidden py-2 px-2 text-center">
                            <button
                              type="button"
                              onClick={() => handleDeleteItem(item.id)}
                              className="text-slate-400 hover:text-red-600 transition cursor-pointer"
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

                <div className="print:hidden p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:border-blue-500 text-slate-700 hover:text-blue-600 font-semibold text-xs flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Ajouter une ligne manuelle</span>
                  </button>

                  <span className="text-[11px] text-slate-500 font-mono">
                    {currentDoc.items.length} ligne(s)
                  </span>
                </div>
              </div>

              {/* Options Financières : Remise & Acompte (Interactive bar) */}
              <div className="print:hidden bg-slate-100 p-4 rounded-2xl border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {/* Remise Commerciale */}
                <div className="space-y-1.5">
                  <span className="font-bold text-slate-700 flex items-center gap-1">
                    <Percent className="w-3.5 h-3.5 text-blue-600" />
                    <span>Remise commerciale :</span>
                  </span>
                  <div className="flex items-center gap-2">
                    <select
                      value={discountType}
                      onChange={(e) => {
                        const newType = e.target.value as 'none' | 'percent' | 'fixed';
                        setDiscountType(newType);
                        recalculateAndSave(currentDoc, currentDoc.items, newType, discountValue);
                      }}
                      className="px-2 py-1.5 bg-white border border-slate-300 rounded-lg font-medium text-xs"
                    >
                      <option value="none">Aucune remise</option>
                      <option value="percent">Pourcentage (%)</option>
                      <option value="fixed">Montant fixe (€)</option>
                    </select>

                    {discountType !== 'none' && (
                      <input
                        type="number"
                        min="0"
                        step={discountType === 'percent' ? 1 : 10}
                        placeholder={discountType === 'percent' ? '5%' : '100 €'}
                        value={discountValue || ''}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value) || 0;
                          setDiscountValue(val);
                          recalculateAndSave(currentDoc, currentDoc.items, discountType, val);
                        }}
                        className="w-24 px-2 py-1.5 bg-white border border-slate-300 rounded-lg font-mono font-bold text-xs"
                      />
                    )}
                  </div>
                </div>

                {/* Échéancier Acompte 30% */}
                <div className="space-y-1.5">
                  <span className="font-bold text-slate-700 flex items-center gap-1">
                    <Coins className="w-3.5 h-3.5 text-amber-600" />
                    <span>Acompte à la commande :</span>
                  </span>
                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-1.5 cursor-pointer font-medium text-slate-700">
                      <input
                        type="checkbox"
                        checked={depositEnabled}
                        onChange={(e) => {
                          const en = e.target.checked;
                          setDepositEnabled(en);
                          recalculateAndSave(currentDoc, currentDoc.items, discountType, discountValue, en ? depositRate : 0);
                        }}
                        className="rounded text-blue-600"
                      />
                      <span>Exiger un acompte</span>
                    </label>

                    {depositEnabled && (
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          min="5"
                          max="80"
                          step="5"
                          value={depositRate}
                          onChange={(e) => {
                            const r = parseFloat(e.target.value) || 30;
                            setDepositRate(r);
                            recalculateAndSave(currentDoc, currentDoc.items, discountType, discountValue, r);
                          }}
                          className="w-16 px-2 py-1 bg-white border border-slate-300 rounded-lg font-mono font-bold text-xs text-center"
                        />
                        <span className="text-slate-500 font-bold">% (Standard BTP: 30%)</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Totals & Multi-TVA Breakdown Strip */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                
                {/* Left: Multi-TVA Table & Legal Mentions */}
                <div className="md:col-span-7 bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3 text-xs text-left print:bg-white print:border-slate-300">
                  
                  {/* Tableau de ventilation TVA */}
                  {profile.is_tva_subject && currentDoc.tva_breakdown && currentDoc.tva_breakdown.length > 0 && (
                    <div className="space-y-1.5">
                      <span className="font-heading font-bold text-slate-800 text-[11px] uppercase tracking-wider block">
                        Ventilation de la TVA (Obligation 2026) :
                      </span>
                      <table className="w-full text-[11px] border border-slate-200 rounded-lg overflow-hidden bg-white">
                        <thead className="bg-slate-100 text-slate-600 font-bold">
                          <tr>
                            <th className="py-1 px-2.5">Taux TVA</th>
                            <th className="py-1 px-2.5 text-right">Base HT nette</th>
                            <th className="py-1 px-2.5 text-right">Montant TVA</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-mono">
                          {currentDoc.tva_breakdown.map((b) => (
                            <tr key={b.rate}>
                              <td className="py-1 px-2.5 font-bold text-slate-900">{b.rate} %</td>
                              <td className="py-1 px-2.5 text-right text-slate-700">{b.base_ht.toFixed(2)} €</td>
                              <td className="py-1 px-2.5 text-right font-bold text-blue-900">{b.tva_amount.toFixed(2)} €</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Mentions Légales */}
                  <div className="space-y-1 pt-1">
                    <div className="font-heading font-bold text-slate-900 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-blue-600" />
                      <span>Mentions légales & conformité :</span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed font-sans">
                      {currentDoc.footer}
                    </p>
                  </div>

                  {/* Signature Block */}
                  <div className="pt-3 border-t border-slate-200 print:pt-4">
                    {currentDoc.status === 'accepte' ? (
                      <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="font-bold flex items-center gap-1.5 text-emerald-800">
                            <Check className="w-4 h-4 text-emerald-600" />
                            <span>Devis officiellement accepté & signé par le client</span>
                          </div>
                          <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-200/70 px-2 py-0.5 rounded">
                            VALIDE
                          </span>
                        </div>
                        {currentDoc.signature_svg && currentDoc.signature_svg.startsWith('data:image') ? (
                          <div className="bg-white p-2 rounded-lg border border-emerald-200 inline-block">
                            <img src={currentDoc.signature_svg} alt="Signature Client" className="h-16 object-contain" />
                          </div>
                        ) : (
                          <div className="font-serif italic text-emerald-950 text-sm">
                            "{currentDoc.signature_svg}"
                          </div>
                        )}
                        <div className="text-[10px] text-emerald-700 font-mono">
                          Horodatage : {new Date(currentDoc.signed_at || '').toLocaleString('fr-FR')} • Traçabilité IP & empreinte locale validée
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setSignatureName(currentDoc.client_name);
                          setShowSignaturePad(true);
                        }}
                        className="print:hidden w-full py-2.5 px-3 rounded-xl bg-white border border-blue-300 hover:bg-blue-50 text-blue-800 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition shadow-2xs"
                      >
                        <PenTool className="w-4 h-4 text-blue-600" />
                        <span>Faire signer le client au doigt sur l'écran</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Right: Calculations Totals Box */}
                <div className="md:col-span-5 bg-slate-950 text-white rounded-2xl p-4 sm:p-5 border border-slate-800 space-y-2.5 text-xs print:bg-white print:text-slate-900 print:border-slate-300">
                  <div className="flex justify-between text-slate-400 print:text-slate-600">
                    <span>Total Brut HT :</span>
                    <span className="font-mono text-white print:text-slate-900 font-bold">
                      {(currentDoc.total_ht + (currentDoc.discount_amount || 0)).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
                    </span>
                  </div>

                  {currentDoc.discount_amount && currentDoc.discount_amount > 0 ? (
                    <div className="flex justify-between text-emerald-400 font-medium">
                      <span>Remise commerciale {currentDoc.discount_type === 'percent' ? `(${currentDoc.discount_value}%)` : ''} :</span>
                      <span className="font-mono font-bold">
                        - {currentDoc.discount_amount.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
                      </span>
                    </div>
                  ) : null}

                  <div className="flex justify-between text-slate-300 font-semibold pt-1 border-t border-slate-800 print:border-slate-200">
                    <span>Total Net HT :</span>
                    <span className="font-mono text-white print:text-slate-900 font-bold">
                      {currentDoc.total_ht.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
                    </span>
                  </div>

                  <div className="flex justify-between text-slate-400 print:text-slate-600">
                    <span>Total TVA collectée :</span>
                    <span className="font-mono text-slate-300 print:text-slate-800">
                      {currentDoc.total_tva.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
                    </span>
                  </div>

                  <div className="flex justify-between text-base font-bold text-white print:text-slate-950 pt-2 border-t border-slate-800 print:border-slate-300">
                    <span className="font-heading">NET À PAYER TTC :</span>
                    <span className="font-mono text-blue-400 print:text-blue-900 text-lg font-extrabold">
                      {currentDoc.total_ttc.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
                    </span>
                  </div>

                  {/* Acompte & Solde */}
                  {currentDoc.deposit_amount && currentDoc.deposit_amount > 0 ? (
                    <div className="mt-2 pt-2 border-t border-slate-800/80 print:border-slate-200 space-y-1 bg-slate-900/60 print:bg-slate-50 p-2.5 rounded-xl">
                      <div className="flex justify-between text-amber-300 print:text-amber-800 font-bold text-[11px]">
                        <span>Acompte {currentDoc.deposit_rate}% à la commande :</span>
                        <span className="font-mono">{currentDoc.deposit_amount.toFixed(2)} €</span>
                      </div>
                      <div className="flex justify-between text-slate-400 print:text-slate-600 text-[11px]">
                        <span>Solde à réception des travaux :</span>
                        <span className="font-mono font-bold text-white print:text-slate-900">{currentDoc.balance_due?.toFixed(2)} €</span>
                      </div>
                    </div>
                  ) : null}

                  <div className="print:hidden pt-2 flex gap-2">
                    <button
                      type="button"
                      onClick={() => setShowShareModal(true)}
                      className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-heading font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-blue-600/25 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Transmettre au client</span>
                    </button>
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>

        {/* Modal Bottom Bar (Hidden in Print) */}
        <div className="print:hidden bg-slate-50 border-t border-slate-200 px-4 sm:px-6 py-3 flex items-center justify-between text-xs text-slate-500 font-sans">
          <span className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${isSimulatedOffline ? 'bg-amber-500' : 'bg-emerald-500'}`} />
            <span>BâtiDevis PWA • {isSimulatedOffline ? 'Stockage Local Garanti (0 connexion)' : 'Synchronisé Cloud'}</span>
          </span>
          <button
            type="button"
            onClick={() => {
              onClose();
              onGoToWaitlist();
            }}
            className="text-blue-600 font-bold hover:underline cursor-pointer"
          >
            Réserver mon accès Fondateur (-50% à vie) →
          </button>
        </div>

      </div>

      {/* Signature Modal with Interactive Drawing Canvas */}
      {showSignaturePad && (
        <div className="fixed inset-0 z-60 bg-black/80 flex items-center justify-center p-3 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 sm:p-6 space-y-4 text-left shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h4 className="font-heading font-bold text-base text-slate-900 flex items-center gap-2">
                <PenTool className="w-4 h-4 text-blue-600" />
                Signature tactile sur smartphone
              </h4>
              <button onClick={() => setShowSignaturePad(false)} className="cursor-pointer text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Faites signer le client directement au doigt. La signature sera incrustée sur le devis avec horodatage et mention légale.
            </p>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Nom du signataire :
              </label>
              <input
                type="text"
                placeholder={currentDoc?.client_name || 'M. Marc Dupont'}
                value={signatureName}
                onChange={(e) => setSignatureName(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-semibold"
              />
            </div>

            {/* Interactive HTML5 Drawing Canvas */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-[11px] text-slate-500">
                <span>Signez dans l'encadré ci-dessous :</span>
                <button
                  type="button"
                  onClick={clearCanvas}
                  className="text-blue-600 hover:underline font-semibold"
                >
                  Effacer
                </button>
              </div>

              <div className="relative border-2 border-dashed border-blue-400 bg-slate-50 rounded-xl overflow-hidden touch-none h-36">
                <canvas
                  ref={canvasRef}
                  width={400}
                  height={144}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                  className="w-full h-full cursor-crosshair bg-white"
                />
                {!hasSignatureDrawn && (
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center text-slate-400 text-xs italic select-none">
                    ✍️ Tracez votre signature avec le doigt ou la souris
                  </div>
                )}
              </div>
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
                onClick={handleSaveSignature}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/25 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Valider et horodater</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal (WhatsApp & Direct Email with enriched financial breakdown) */}
      {showShareModal && currentDoc && (
        <div className="fixed inset-0 z-60 bg-black/80 flex items-center justify-center p-3 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 sm:p-6 space-y-4 text-left shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h4 className="font-heading font-bold text-base text-slate-900 flex items-center gap-2">
                <Share2 className="w-4 h-4 text-blue-600" />
                Transmettre le devis ({currentDoc.document_number})
              </h4>
              <button onClick={() => setShowShareModal(false)} className="cursor-pointer text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1">
              <div className="font-bold text-slate-900">Synthèse chiffrée transmise :</div>
              <div className="flex justify-between text-slate-600">
                <span>Total Net TTC :</span>
                <span className="font-bold text-blue-900">{currentDoc.total_ttc.toFixed(2)} €</span>
              </div>
              {currentDoc.deposit_amount && currentDoc.deposit_amount > 0 && (
                <div className="flex justify-between text-amber-800">
                  <span>Acompte {currentDoc.deposit_rate}% :</span>
                  <span className="font-bold">{currentDoc.deposit_amount.toFixed(2)} €</span>
                </div>
              )}
            </div>

            <div className="space-y-2.5">
              {/* WhatsApp direct */}
              <a
                href={`https://wa.me/?text=${encodeURIComponent(
                  `Bonjour ${currentDoc.client_name}, voici votre devis ${currentDoc.document_number} de ${profile.company_name} d'un montant de ${currentDoc.total_ttc.toFixed(2)} € TTC${currentDoc.deposit_amount ? ` (Acompte 30% : ${currentDoc.deposit_amount.toFixed(2)} €)` : ''}. Vous pouvez le consulter et le signer en 1 clic : https://batidevis.fr/d/${currentDoc.id}`
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
                className="w-full p-3.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-950 flex items-center justify-between transition cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-xs text-slate-900">Envoyer par WhatsApp</div>
                    <div className="text-[11px] text-emerald-700">Ouverture instantanée sur smartphone</div>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-emerald-700" />
              </a>

              {/* Email direct */}
              <a
                href={`mailto:${currentDoc.client_email || ''}?subject=${encodeURIComponent(
                  `Votre devis ${currentDoc.document_number} - ${profile.company_name}`
                )}&body=${encodeURIComponent(
                  `Bonjour ${currentDoc.client_name},\n\nVeuillez trouver ci-joint votre devis n° ${currentDoc.document_number} d'un montant total de ${currentDoc.total_ttc.toFixed(2)} € TTC.\n\nPrestations :\n${currentDoc.items.map(i => `• ${i.description} (${i.quantity} ${i.unit || 'u.'}) : ${i.total.toFixed(2)} € HT`).join('\n')}\n\n${currentDoc.deposit_amount ? `Conditions de règlement : Acompte de ${currentDoc.deposit_rate}% à la commande (${currentDoc.deposit_amount.toFixed(2)} € TTC), solde à réception des travaux.\n\n` : ''}Conformité réglementaire et assurance décennale : ${profile.insurance_info}\n\nBien cordialement,\n${profile.company_name}\nTél : ${profile.phone}`
                )}`}
                onClick={() => {
                  const updated: Document = { ...currentDoc, status: 'envoye' };
                  saveSingleDocument(updated);
                  setCurrentDoc(updated);
                  setShowShareModal(false);
                  showNotify('Email préparé ! Statut passé à "Envoyé".');
                }}
                className="w-full p-3.5 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-300 text-blue-950 flex items-center justify-between transition cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-xs text-slate-900">Envoyer par Email direct</div>
                    <div className="text-[11px] text-blue-700">Détail des postes et conditions d'acompte</div>
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
