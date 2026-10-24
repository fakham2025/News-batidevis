'use client';

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  BarChart3, 
  FileText, 
  Settings, 
  Plus, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  Coins, 
  ShieldCheck, 
  Upload, 
  Share2, 
  Printer, 
  MessageCircle, 
  Mail, 
  Search, 
  Filter, 
  Smartphone, 
  Building2, 
  Percent, 
  Zap, 
  Wifi, 
  WifiOff,
  ExternalLink,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { 
  Document, 
  Profile, 
  getSavedProfile, 
  saveProfile, 
  getSavedDocuments, 
  saveSingleDocument,
  calculateArtisanReporting, 
  ArtisanReportingStats,
  getCurrentSession,
  saveCurrentSession,
  UserSession
} from '../services/db';

interface ArtisanDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenDevisBuilder: (doc?: Document) => void;
  onOpenAdmin?: () => void;
}

export function ArtisanDashboardModal({
  isOpen,
  onClose,
  onOpenDevisBuilder,
  onOpenAdmin
}: ArtisanDashboardModalProps) {
  const [activeTab, setActiveTab] = useState<'reporting' | 'quotes' | 'settings'>('reporting');
  const [profile, setProfile] = useState<Profile>(getSavedProfile());
  const [documents, setDocuments] = useState<Document[]>([]);
  const [stats, setStats] = useState<ArtisanReportingStats | null>(null);
  const [session, setSession] = useState<UserSession>(getCurrentSession());
  
  // Search & filter for quotes tab
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [notification, setNotification] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const loadData = () => {
    const p = getSavedProfile();
    const docs = getSavedDocuments();
    const sess = getCurrentSession();
    setProfile(p);
    setDocuments(docs);
    setSession(sess);
    setStats(calculateArtisanReporting(docs));
  };

  if (!isOpen) return null;

  const showNotify = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  // Logo upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("L'image ne doit pas dépasser 2 Mo.");
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

  const handleSaveProfileChanges = (field: keyof Profile, value: any) => {
    const updated = { ...profile, [field]: value };
    setProfile(updated);
    saveProfile(updated);
  };

  // Filtered documents
  const filteredDocs = documents.filter(doc => {
    const matchesSearch = 
      doc.document_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (doc.client_phone && doc.client_phone.includes(searchTerm));
    
    const matchesStatus = statusFilter === 'all' || doc.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: Document['status']) => {
    switch (status) {
      case 'brouillon':
        return <span className="text-slate-600 bg-slate-100 px-2 py-0.5 rounded text-[10px] font-bold">Brouillon</span>;
      case 'brouillon_local':
        return <span className="text-amber-800 bg-amber-100 px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1"><WifiOff className="w-2.5 h-2.5" /> Local</span>;
      case 'envoye':
        return <span className="text-blue-800 bg-blue-100 px-2 py-0.5 rounded text-[10px] font-bold">Envoyé</span>;
      case 'accepte':
        return <span className="text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1"><CheckCircle2 className="w-2.5 h-2.5" /> Signé</span>;
      case 'paye':
        return <span className="text-purple-800 bg-purple-100 px-2 py-0.5 rounded text-[10px] font-bold">Payé</span>;
      case 'refuse':
        return <span className="text-red-800 bg-red-100 px-2 py-0.5 rounded text-[10px] font-bold">Refusé</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="relative bg-white rounded-2xl sm:rounded-3xl max-w-5xl w-full max-h-[96vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden text-left">
        
        {/* Top Header */}
        <div className="bg-slate-950 text-white px-4 sm:px-6 py-3.5 sm:py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {profile.logo_url ? (
              <img src={profile.logo_url} alt="Logo" className="w-10 h-10 object-contain rounded-xl bg-white p-1 border border-slate-700" />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold font-heading text-lg shadow-md">
                {profile.company_name.charAt(0)}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-extrabold text-base sm:text-lg text-white">
                  {profile.company_name}
                </h3>
                <span className="font-mono text-[10px] font-bold text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800/80">
                  Plan {session.plan === 'fondateur' ? 'Fondateur (-50% à vie)' : session.plan === 'beta' ? 'Bêta Testeur (0€)' : 'Standard (19€/m)'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-sans flex items-center gap-2">
                <span>{profile.trade}</span>
                <span>•</span>
                <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                  <ShieldCheck className="w-3 h-3" /> Décennale valide
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onOpenDevisBuilder();
              }}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-heading font-bold text-xs shadow-md shadow-blue-600/30 transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Nouveau Devis</span>
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

        {/* Tab Navigation Bar */}
        <div className="bg-slate-100 border-b border-slate-200 px-4 sm:px-6 pt-3 flex items-center justify-between flex-wrap gap-2 text-xs">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('reporting')}
              className={`pb-3 px-3 text-xs font-heading font-bold flex items-center gap-1.5 transition-colors border-b-2 cursor-pointer ${
                activeTab === 'reporting'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Tableau de Bord & e-Reporting</span>
            </button>

            <button
              onClick={() => setActiveTab('quotes')}
              className={`pb-3 px-3 text-xs font-heading font-bold flex items-center gap-1.5 transition-colors border-b-2 cursor-pointer ${
                activeTab === 'quotes'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Mes Devis & Factures ({documents.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`pb-3 px-3 text-xs font-heading font-bold flex items-center gap-1.5 transition-colors border-b-2 cursor-pointer ${
                activeTab === 'settings'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Paramètres de mon Entreprise</span>
            </button>
          </div>

          {/* Quick link to admin if requested */}
          {onOpenAdmin && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenAdmin();
              }}
              className="text-[11px] text-slate-500 hover:text-slate-900 pb-2.5 font-medium underline cursor-pointer"
            >
              Super-Dashboard Admin SaaS →
            </button>
          )}
        </div>

        {notification && (
          <div className="bg-emerald-600 text-white text-xs px-4 py-2 font-medium flex items-center justify-between animate-in fade-in">
            <span>{notification}</span>
            <button onClick={() => setNotification(null)} className="cursor-pointer">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* TAB 1: E-REPORTING & ACTIVITÉ */}
          {activeTab === 'reporting' && stats && (
            <div className="space-y-6 max-w-4xl mx-auto">
              
              {/* 4 Financial KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* CA Total Validé */}
                <div className="bg-slate-900 text-white p-4 rounded-2xl border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-slate-400 text-xs">
                    <span>Chiffre d'Affaires</span>
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="font-mono text-2xl font-extrabold text-white tabular-nums">
                    {stats.totalRevenueTtc.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Net HT : <span className="font-mono">{stats.totalRevenueHt.toFixed(2)} €</span>
                  </p>
                </div>

                {/* Devis en cours */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                    <span>Devis en cours</span>
                    <Clock className="w-4 h-4 text-amber-500" />
                  </div>
                  <div className="font-mono text-2xl font-extrabold text-slate-900 tabular-nums">
                    {stats.pendingQuotesCount}
                  </div>
                  <p className="text-[11px] text-slate-600 font-mono font-medium">
                    Montant potentiel : {stats.pendingQuotesAmount.toFixed(2)} €
                  </p>
                </div>

                {/* Acomptes sécurisés */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                    <span>Acomptes 30% perçus</span>
                    <Coins className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="font-mono text-2xl font-extrabold text-blue-900 tabular-nums">
                    {stats.depositsCollected.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
                  </div>
                  <p className="text-[11px] text-emerald-700 font-medium">
                    Trésorerie d'avance sécurisée
                  </p>
                </div>

                {/* Taux de signature */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                    <span>Taux de conversion</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="font-mono text-2xl font-extrabold text-emerald-700 tabular-nums">
                    {stats.conversionRate} %
                  </div>
                  <p className="text-[11px] text-slate-500">
                    {stats.acceptedQuotesCount} devis signé(s) sur chantier
                  </p>
                </div>
              </div>

              {/* Status Distribution Visual Bar */}
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-heading font-bold text-sm text-slate-900">
                    Répartition de l'Activité Devis & Factures
                  </span>
                  <span className="text-xs text-slate-500 font-mono">
                    {documents.length} pièce(s) commerciale(s)
                  </span>
                </div>

                {/* Multi-segment bar */}
                <div className="h-3 w-full rounded-full bg-slate-100 overflow-hidden flex">
                  <div 
                    style={{ width: `${(stats.statusDistribution.accepte / Math.max(1, documents.length)) * 100}%` }}
                    className="bg-emerald-500 h-full"
                    title={`Signés : ${stats.statusDistribution.accepte}`}
                  />
                  <div 
                    style={{ width: `${(stats.statusDistribution.envoye / Math.max(1, documents.length)) * 100}%` }}
                    className="bg-blue-500 h-full"
                    title={`Envoyés : ${stats.statusDistribution.envoye}`}
                  />
                  <div 
                    style={{ width: `${((stats.statusDistribution.brouillon + stats.statusDistribution.brouillon_local) / Math.max(1, documents.length)) * 100}%` }}
                    className="bg-amber-400 h-full"
                    title={`Brouillons : ${stats.statusDistribution.brouillon + stats.statusDistribution.brouillon_local}`}
                  />
                  <div 
                    style={{ width: `${(stats.statusDistribution.paye / Math.max(1, documents.length)) * 100}%` }}
                    className="bg-purple-500 h-full"
                    title={`Payés : ${stats.statusDistribution.paye}`}
                  />
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-600 flex-wrap">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span>Signés ({stats.statusDistribution.accepte})</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                    <span>Envoyés ({stats.statusDistribution.envoye})</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <span>Brouillons / Hors-ligne ({stats.statusDistribution.brouillon + stats.statusDistribution.brouillon_local})</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                    <span>Payés ({stats.statusDistribution.paye})</span>
                  </span>
                </div>
              </div>

              {/* Recent Activity List with 1-Click Actions */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-heading font-bold text-sm text-slate-900">
                    Dernières Pièces Commerciales
                  </span>
                  <button
                    onClick={() => setActiveTab('quotes')}
                    className="text-xs text-blue-600 font-bold hover:underline"
                  >
                    Voir tout ({documents.length}) →
                  </button>
                </div>

                <div className="space-y-2">
                  {documents.slice(0, 3).map((doc) => (
                    <div
                      key={doc.id}
                      className="bg-slate-50 hover:bg-blue-50/50 p-3.5 rounded-xl border border-slate-200 transition flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center font-bold text-slate-800 text-xs shrink-0">
                          {doc.type === 'devis' ? 'DEV' : 'FAC'}
                        </div>
                        <div className="min-w-0 text-left">
                          <p className="text-xs font-bold text-slate-900 truncate flex items-center gap-2">
                            <span>{doc.document_number}</span>
                            <span className="font-normal text-slate-500">•</span>
                            <span className="truncate">{doc.client_name}</span>
                          </p>
                          <p className="text-[11px] text-slate-500">
                            {new Date(doc.date).toLocaleDateString('fr-FR')} • {doc.items.length} prestation(s)
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-right">
                          <div className="font-mono text-xs font-bold text-slate-900">
                            {doc.total_ttc.toFixed(2)} € TTC
                          </div>
                          <div>{getStatusBadge(doc.status)}</div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            onOpenDevisBuilder(doc);
                          }}
                          className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-white border border-slate-300 hover:border-blue-500 text-slate-700 hover:text-blue-600 transition shadow-2xs"
                        >
                          Ouvrir
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: MES DEVIS & FACTURES */}
          {activeTab === 'quotes' && (
            <div className="space-y-4 max-w-4xl mx-auto text-left">
              
              {/* Search & Filter Toolbar */}
              <div className="flex items-center justify-between flex-wrap gap-2.5 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Rechercher par n°, client ou téléphone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-medium focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Filter className="w-3.5 h-3.5 text-slate-500" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-medium"
                  >
                    <option value="all">Tous les statuts</option>
                    <option value="accepte">Signés / Acceptés</option>
                    <option value="envoye">Envoyés</option>
                    <option value="brouillon">Brouillons</option>
                    <option value="paye">Payés</option>
                  </select>

                  <button
                    onClick={() => {
                      onClose();
                      onOpenDevisBuilder();
                    }}
                    className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1 shadow-xs cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Créer un devis</span>
                  </button>
                </div>
              </div>

              {/* Quotes Data Table */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 border-b border-slate-200 font-heading font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                      <tr>
                        <th className="py-2.5 px-3">Numéro</th>
                        <th className="py-2.5 px-3">Client & Chantier</th>
                        <th className="py-2.5 px-3">Date</th>
                        <th className="py-2.5 px-3 text-right">Total HT</th>
                        <th className="py-2.5 px-3 text-right">Total TTC</th>
                        <th className="py-2.5 px-3 text-center">Statut</th>
                        <th className="py-2.5 px-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-sans">
                      {filteredDocs.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-8 text-center text-slate-500 text-xs">
                            Aucun devis ne correspond aux critères de recherche.
                          </td>
                        </tr>
                      ) : (
                        filteredDocs.map((doc) => (
                          <tr key={doc.id} className="hover:bg-slate-50/80 transition">
                            <td className="py-2.5 px-3 font-mono font-bold text-blue-900">
                              {doc.document_number}
                            </td>
                            <td className="py-2.5 px-3">
                              <div className="font-bold text-slate-900">{doc.client_name}</div>
                              <div className="text-[11px] text-slate-500 truncate max-w-xs">{doc.client_address || doc.client_phone || 'Sans adresse'}</div>
                            </td>
                            <td className="py-2.5 px-3 text-slate-600 font-mono text-[11px]">
                              {new Date(doc.date).toLocaleDateString('fr-FR')}
                            </td>
                            <td className="py-2.5 px-3 text-right font-mono text-slate-700">
                              {doc.total_ht.toFixed(2)} €
                            </td>
                            <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                              {doc.total_ttc.toFixed(2)} €
                            </td>
                            <td className="py-2.5 px-3 text-center">
                              {getStatusBadge(doc.status)}
                            </td>
                            <td className="py-2.5 px-3 text-right">
                              <button
                                onClick={() => {
                                  onClose();
                                  onOpenDevisBuilder(doc);
                                }}
                                className="px-2.5 py-1 text-xs font-semibold rounded bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white transition cursor-pointer"
                              >
                                Éditer / Imprimer
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: PARAMÈTRES DE MON ENTREPRISE */}
          {activeTab === 'settings' && (
            <div className="space-y-6 max-w-3xl mx-auto text-left">
              
              {/* Logo & Identity Card */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                <span className="font-heading font-bold text-sm text-slate-900 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-blue-600" />
                  <span>Logo & Identité Visuelle de l'Entreprise</span>
                </span>

                <div className="flex items-center gap-4">
                  {profile.logo_url ? (
                    <div className="relative group">
                      <img src={profile.logo_url} alt="Logo" className="w-20 h-20 object-contain rounded-xl bg-white p-2 border border-slate-300" />
                      <button
                        onClick={handleRemoveLogo}
                        className="mt-1 text-[11px] text-red-600 hover:underline block"
                      >
                        Supprimer le logo
                      </button>
                    </div>
                  ) : (
                    <div className="w-20 h-20 rounded-xl border-2 border-dashed border-slate-300 bg-white flex items-center justify-center text-slate-400">
                      <Upload className="w-6 h-6" />
                    </div>
                  )}

                  <div className="space-y-1.5">
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
                      className="px-3.5 py-2 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition shadow-xs cursor-pointer flex items-center gap-1.5"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{profile.logo_url ? 'Changer de logo' : 'Téléverser mon logo'}</span>
                    </button>
                    <p className="text-[11px] text-slate-500">
                      PNG ou JPG max 2 Mo. Ce logo apparaîtra automatiquement en haut de vos devis et factures.
                    </p>
                  </div>
                </div>
              </div>

              {/* Legal & Fiscal Info */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                <span className="font-heading font-bold text-sm text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Informations Légales & Conformité BTP 2026</span>
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Raison sociale :</label>
                    <input
                      type="text"
                      value={profile.company_name}
                      onChange={(e) => handleSaveProfileChanges('company_name', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-bold text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Corps de métier principal :</label>
                    <input
                      type="text"
                      value={profile.trade}
                      onChange={(e) => handleSaveProfileChanges('trade', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Numéro SIRET :</label>
                    <input
                      type="text"
                      value={profile.siret || ''}
                      onChange={(e) => handleSaveProfileChanges('siret', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-mono text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Téléphone mobile :</label>
                    <input
                      type="text"
                      value={profile.phone || ''}
                      onChange={(e) => handleSaveProfileChanges('phone', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-900"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="font-semibold text-slate-700 block mb-1">Adresse du siège social :</label>
                    <input
                      type="text"
                      value={profile.address || ''}
                      onChange={(e) => handleSaveProfileChanges('address', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-900"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="font-semibold text-slate-700 block mb-1">
                      Assurance Décennale obligatoire (Mention légale) :
                    </label>
                    <input
                      type="text"
                      value={profile.insurance_info || ''}
                      onChange={(e) => handleSaveProfileChanges('insurance_info', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Préfixe de numérotation :</label>
                    <input
                      type="text"
                      value={profile.document_prefix || 'DEV-2026-'}
                      onChange={(e) => handleSaveProfileChanges('document_prefix', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-mono text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Régime TVA :</label>
                    <select
                      value={profile.is_tva_subject ? 'normal' : 'franchise'}
                      onChange={(e) => handleSaveProfileChanges('is_tva_subject', e.target.value === 'normal')}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 font-medium"
                    >
                      <option value="normal">Assujetti à la TVA (10% rénovation / 5,5% / 20%)</option>
                      <option value="franchise">Franchise de TVA (Art. 293 B du CGI - Auto-entrepreneur)</option>
                    </select>
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Bottom Bar */}
        <div className="bg-slate-50 border-t border-slate-200 px-4 sm:px-6 py-3 flex items-center justify-between text-xs text-slate-500 font-sans">
          <span>
            BâtiDevis Espace Artisan • Données sécurisées & synchronisées localement
          </span>
          <button
            onClick={() => {
              onClose();
              onOpenDevisBuilder();
            }}
            className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition cursor-pointer"
          >
            Lancer le DevisBuilder →
          </button>
        </div>

      </div>
    </div>
  );
}
