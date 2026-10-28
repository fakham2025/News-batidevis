/**
 * AdminDashboardPage.tsx — Portail administrateur BâtiDevis 2026
 * Route : /admin
 * Accès : protégé par PIN (AdminLoginModal)
 * PIN par défaut : 202684 (configurable via VITE_ADMIN_MASTER_PIN)
 */
import React, { useState, useEffect, useCallback } from 'react';
import { AdminLoginModal } from '../components/admin/AdminLoginModal';
import { AdminMetricsOverview } from '../components/admin/AdminMetricsOverview';
import { ArtisansManagerTable } from '../components/admin/ArtisansManagerTable';
import { WaitlistManagerTable } from '../components/admin/WaitlistManagerTable';
import { computeSaasMetrics, type ArtisanRecord, type ArtisanStatus } from '../services/adminMetrics';
import { type WaitlistEntry, type WaitlistStatut } from '../services/exportCsv';
import { isAdminAuthenticated, clearAdminSession } from '../services/adminAuth';

// ─── Données de démo (à remplacer par des appels Supabase) ───────────────────
const DEMO_ARTISANS: ArtisanRecord[] = [
  { id: '1', email: 'marc.dupont@btp.fr',     plan: 'pro',     monthly_fee: 19,  created_at: '2026-08-15', status: 'active',    quotes_count: 28, company_name: 'Dupont Maçonnerie', siret: '84930291000018', department: '75' },
  { id: '2', email: 'sarah.martin@elec.fr',   plan: 'vip',     monthly_fee: 9.5, created_at: '2026-09-01', status: 'active',    quotes_count: 12, company_name: 'Martin Électricité', department: '13' },
  { id: '3', email: 'pierre.robert@plomb.fr', plan: 'gratuit', monthly_fee: 0,   created_at: '2026-10-01', status: 'trial',     quotes_count: 3,  company_name: 'Robert Plomberie', department: '69' },
  { id: '4', email: 'ahmed.benali@carrel.fr', plan: 'pro',     monthly_fee: 19,  created_at: '2026-07-20', status: 'active',    quotes_count: 41, company_name: 'Benali Carrelage', siret: '75183920400015', department: '06' },
  { id: '5', email: 'claire.leclerc@peintr.fr', plan: 'vip',  monthly_fee: 9.5, created_at: '2026-09-15', status: 'churned',   quotes_count: 2,  company_name: 'Leclerc Peinture', department: '33' },
  { id: '6', email: 'thomas.henry@charp.fr',  plan: 'gratuit', monthly_fee: 0,   created_at: '2026-10-20', status: 'trial',     quotes_count: 1,  company_name: 'Henry Charpente', department: '44' },
];

const DEMO_WAITLIST: WaitlistEntry[] = [
  { id: 'w1', nom: 'Julien Fabre',     email: 'julien.fabre@gmail.com',   telephone: '0612345678', metier: 'Menuisier',    departement: '34', date_inscription: '2026-10-10T09:00:00Z', statut: 'en_attente' },
  { id: 'w2', nom: 'Nathalie Giraud',  email: 'nathalie.g@hotmail.fr',    telephone: '0698765432', metier: 'Peintre',      departement: '31', date_inscription: '2026-10-12T11:30:00Z', statut: 'contacte' },
  { id: 'w3', nom: 'Karim Meziani',    email: 'k.meziani@orange.fr',      telephone: '0745678901', metier: 'Maçon',        departement: '93', date_inscription: '2026-10-18T14:00:00Z', statut: 'en_attente' },
  { id: 'w4', nom: 'Isabelle Fournier',email: 'ifournier@artisan-btp.fr', telephone: '0612309876', metier: 'Électricien',  departement: '59', date_inscription: '2026-10-20T16:00:00Z', statut: 'converti' },
  { id: 'w5', nom: 'Pascal Morin',     email: 'p.morin@sfr.fr',           telephone: '',           metier: 'Plombier',     departement: '76', date_inscription: '2026-10-22T08:45:00Z', statut: 'abandonne' },
];

type AdminTab = 'kpis' | 'artisans' | 'waitlist' | 'parametres';

const TABS: { id: AdminTab; label: string; icon: string }[] = [
  { id: 'kpis',        label: 'Vue d\'ensemble', icon: '📊' },
  { id: 'artisans',    label: 'Artisans',         icon: '👷' },
  { id: 'waitlist',    label: 'Waitlist',          icon: '📋' },
  { id: 'parametres',  label: 'Paramètres',        icon: '⚙️' },
];

export function AdminDashboardPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [activeTab, setActiveTab]         = useState<AdminTab>('kpis');
  const [artisans, setArtisans]           = useState<ArtisanRecord[]>(DEMO_ARTISANS);
  const [waitlist, setWaitlist]           = useState<WaitlistEntry[]>(DEMO_WAITLIST);
  const [stripeKey, setStripeKey]         = useState(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ?? '');
  const [savedMsg, setSavedMsg]           = useState('');

  useEffect(() => {
    setAuthenticated(isAdminAuthenticated());
  }, []);

  const handleLogin = useCallback(() => setAuthenticated(true), []);

  const handleLogout = useCallback(() => {
    clearAdminSession();
    setAuthenticated(false);
  }, []);

  const handleArtisanStatusChange = useCallback((id: string, newStatus: ArtisanStatus) => {
    setArtisans(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
  }, []);

  const handleWaitlistStatusChange = useCallback((id: string, statut: WaitlistStatut) => {
    setWaitlist(prev => prev.map(e => e.id === id ? { ...e, statut } : e));
  }, []);

  const handleSaveStripe = () => {
    // En prod, écrire dans .env via API sécurisée ou Supabase secrets
    setSavedMsg('✅ Clé enregistrée (redémarrez le serveur pour appliquer)');
    setTimeout(() => setSavedMsg(''), 4000);
  };

  const metrics = computeSaasMetrics(artisans);

  if (!authenticated) {
    return <AdminLoginModal onSuccess={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Topbar Admin */}
      <header className="bg-gray-900 text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center text-xl">🛡️</div>
            <div>
              <span className="font-bold text-lg tracking-tight">BâtiDevis</span>
              <span className="ml-2 text-xs bg-blue-700 text-blue-200 px-2 py-0.5 rounded font-mono">ADMIN</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-400 hover:text-white transition flex items-center gap-1"
          >
            🚪 Déconnexion
          </button>
        </div>

        {/* Navigation onglets */}
        <nav className="max-w-7xl mx-auto px-4 flex gap-1 pb-0 overflow-x-auto">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-t-lg transition whitespace-nowrap
                ${activeTab === tab.id
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'}
              `}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </header>

      {/* Contenu principal */}
      <main className="max-w-7xl mx-auto px-4 py-8 space-y-6">

        {/* ─── Onglet KPIs ─── */}
        {activeTab === 'kpis' && (
          <AdminMetricsOverview metrics={metrics} />
        )}

        {/* ─── Onglet Artisans ─── */}
        {activeTab === 'artisans' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-700">👷 Gestion des artisans</h2>
              <span className="text-sm text-gray-500">{artisans.length} artisans au total</span>
            </div>
            <ArtisansManagerTable
              artisans={artisans}
              onStatusChange={handleArtisanStatusChange}
            />
          </div>
        )}

        {/* ─── Onglet Waitlist ─── */}
        {activeTab === 'waitlist' && (
          <WaitlistManagerTable
            entries={waitlist}
            onStatusChange={handleWaitlistStatusChange}
          />
        )}

        {/* ─── Onglet Paramètres ─── */}
        {activeTab === 'parametres' && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-gray-700">⚙️ Paramètres SaaS</h2>

            {/* Stripe */}
            <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
              <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                💳 Clé publique Stripe
              </h3>
              <p className="text-sm text-gray-500">
                Clé publishable Stripe pour activer les paiements d'acompte 30%.
                Elle commence par <code className="bg-gray-100 px-1 rounded">pk_live_</code> ou <code className="bg-gray-100 px-1 rounded">pk_test_</code>.
              </p>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={stripeKey}
                  onChange={e => setStripeKey(e.target.value)}
                  placeholder="pk_live_xxxxxxxxxxxxxxxxxxxx"
                  className="flex-1 border rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button
                  onClick={handleSaveStripe}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition"
                >
                  Enregistrer
                </button>
              </div>
              {savedMsg && <p className="text-sm text-green-600 font-medium">{savedMsg}</p>}
            </div>

            {/* PIN Admin */}
            <div className="bg-white rounded-xl shadow-sm p-6 space-y-3">
              <h3 className="font-semibold text-gray-700 flex items-center gap-2">🔐 PIN Administrateur</h3>
              <p className="text-sm text-gray-500">
                Le PIN par défaut est <strong>202684</strong>. Pour le changer, définissez la variable d'environnement{' '}
                <code className="bg-gray-100 px-1 rounded">VITE_ADMIN_MASTER_PIN</code> dans votre fichier <code className="bg-gray-100 px-1 rounded">.env</code>.
              </p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
                ⚠️ Ne jamais partager ce PIN. Changez-le avant la mise en production.
              </div>
            </div>

            {/* Infos système */}
            <div className="bg-white rounded-xl shadow-sm p-6 space-y-3">
              <h3 className="font-semibold text-gray-700">ℹ️ Informations système</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-gray-400 text-xs">Version</p>
                  <p className="font-bold text-gray-700">BâtiDevis 2026 v1.0</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-gray-400 text-xs">Stack</p>
                  <p className="font-bold text-gray-700">React 19 + Vite + Supabase</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-gray-400 text-xs">Stripe</p>
                  <p className={`font-bold ${stripeKey.startsWith('pk_live') ? 'text-green-600' : 'text-yellow-600'}`}>
                    {stripeKey.startsWith('pk_live') ? '✅ Mode Production' : '🟡 Mode Sandbox'}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-gray-400 text-xs">MRR actuel</p>
                  <p className="font-bold text-blue-700">{metrics.mrr.toFixed(2)} €/mois</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer discret */}
      <footer className="text-center py-6 text-xs text-gray-400">
        BâtiDevis Admin · Accès réservé · {new Date().getFullYear()}
      </footer>
    </div>
  );
}
