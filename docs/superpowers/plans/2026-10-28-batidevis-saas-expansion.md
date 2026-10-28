# BâtiDevis SaaS Expansion — Plan d'Implémentation Global

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Compléter le développement du SaaS BâtiDevis 2026 de A à Z avec les deux volets séquentiels : le volet conversion artisan BTP (SIRET gouv, acompte Stripe, relance WhatsApp, CRM clients) et le volet administrateur complet (`/admin`, métriques MRR, gestion des artisans, export CSV leads et abonnements).

**Architecture:** Architecture modulaire Full-Stack React 19 + TypeScript + Vite 8 + Tailwind CSS 4 sur backend Supabase PostgreSQL, connectée à l'API publique ouverte Recherche Entreprises du gouvernement français et à Stripe.

**Tech Stack:** React 19, TypeScript, Vite 8, Tailwind CSS 4, Supabase (PostgreSQL / RLS), API Recherche Entreprises (Gouv.fr), Stripe, Lucide Icons, Node.js test runner (`tsx --test`).

**Spec:** `docs/superpowers/specs/2026-10-28-batidevis-saas-expansion-design.md`

## Global Constraints
- Conforme à la réglementation française BTP 2026 (mentions légales obligatoires, ventilation TVA 5.5%, 10%, 20%, décennale SMABTP/AXA).
- Zéro dépendance API payante pour la recherche SIRET (utilisation de l'API officielle gouv.fr gratuite).
- Mobile-first résilient hors-ligne pour les artisans sur chantier.
- 0 erreur TypeScript (`tsc --noEmit`) et tous les tests automatisés passants à chaque étape.

---

### Task 1: API Recherche Entreprises Gouv.fr & Auto-complétion SIRET

**Files:**
- Create: `src/services/inseeApi.ts`
- Create: `src/components/common/SiretAutocomplete.tsx`
- Test: `tests/insee-api.test.ts`
- Modify: `src/components/dashboard/ProfileSettingsModal.tsx`

- [ ] **Step 1: Write unit test for INSEE / Gouv API parser**
  Test du parsing des réponses JSON gouvernementales, extraction du SIRET 14 chiffres, de la raison sociale, de l'adresse et du code NAF.
  Run: `npx tsx --test tests/insee-api.test.ts`
  Expected: FAIL (module non implémenté).

- [ ] **Step 2: Implement `inseeApi.ts`**
  Fonctions `searchEntreprises(query: string)` et `formatEntrepriseDetails(result)`.

- [ ] **Step 3: Implement `SiretAutocomplete.tsx`**
  Champ de recherche réactif avec debouncing (300ms), liste déroulante d'entreprises trouvées et bouton de sélection 1-clic.

- [ ] **Step 4: Integrate into `ProfileSettingsModal.tsx`**
  Remplissage automatique du profil artisan lors du choix d'une entreprise dans la recherche.

- [ ] **Step 5: Verify build & tests**
  Run: `npx tsx --test tests/insee-api.test.ts && npm run build`
  Expected: PASS.

- [ ] **Step 6: Commit**
  ```bash
  git add src/services/inseeApi.ts src/components/common/SiretAutocomplete.tsx src/components/dashboard/ProfileSettingsModal.tsx tests/insee-api.test.ts
  git commit -m "feat(insee): auto-completion SIRET et entreprises francaises via api gouv"
  ```

---

### Task 2: Module de Relance Commerciale WhatsApp & SMS (J+3, J+7)

**Files:**
- Create: `src/services/followUp.ts`
- Create: `src/components/dashboard/FollowUpModal.tsx`
- Test: `tests/follow-up.test.ts`
- Modify: `src/components/dashboard/QuoteCard.tsx`

- [ ] **Step 1: Write unit test for follow-up message templates and URI encoding**
  Test des formats de relance courtoise (J+3) et planning d'intervention (J+7) avec encodage WhatsApp (`wa.me`) et SMS.
  Run: `npx tsx --test tests/follow-up.test.ts`
  Expected: FAIL.

- [ ] **Step 2: Implement `src/services/followUp.ts`**
  Génération des textes BTP percutants et des liens profonds WhatsApp/SMS incluant le lien de consultation du devis.

- [ ] **Step 3: Implement `src/components/dashboard/FollowUpModal.tsx`**
  Modale permettant à l'artisan de choisir le modèle de relance, prévisualiser le texte, le copier ou déclencher WhatsApp en un clic.

- [ ] **Step 4: Add follow-up button to `QuoteCard.tsx`**
  Bouton vert "Relancer" actif sur les devis en attente (`sent`).

- [ ] **Step 5: Verify build & tests**
  Run: `npx tsx --test tests/follow-up.test.ts && npm run build`
  Expected: PASS.

- [ ] **Step 6: Commit**
  ```bash
  git add src/services/followUp.ts src/components/dashboard/FollowUpModal.tsx src/components/dashboard/QuoteCard.tsx tests/follow-up.test.ts
  git commit -m "feat(followup): module de relance whatsapp et sms 1-clic pour devis sans reponse"
  ```

---

### Task 3: Paiement d'Acompte 30% en Ligne (Intégration Stripe)

**Files:**
- Create: `src/services/stripe.ts`
- Create: `src/components/public/StripeDepositButton.tsx`
- Test: `tests/stripe-deposit.test.ts`
- Modify: `src/components/public/PublicQuoteView.tsx`

- [ ] **Step 1: Write test for Stripe deposit checkout generation**
  Calcul du montant exact en centimes d'euro, validation des métadonnées (quoteNumber, clientEmail, depositInvoiceId).
  Run: `npx tsx --test tests/stripe-deposit.test.ts`
  Expected: FAIL.

- [ ] **Step 2: Implement `src/services/stripe.ts`**
  Fonction `createDepositCheckoutUrl()` avec support mode Test (sandbox sécurisée) et mode Live.

- [ ] **Step 3: Implement `StripeDepositButton.tsx`**
  Bouton sécurisé avec logo Stripe, cadenas SSL, affichant le montant exact de l'acompte (ex: 328,35 €) et déclenchant la redirection.

- [ ] **Step 4: Integrate into `PublicQuoteView.tsx`**
  Affichage immédiat dès que le devis est signé par le client.

- [ ] **Step 5: Verify build & tests**
  Run: `npx tsx --test tests/stripe-deposit.test.ts && npm run build`
  Expected: PASS.

- [ ] **Step 6: Commit**
  ```bash
  git add src/services/stripe.ts src/components/public/StripeDepositButton.tsx src/components/public/PublicQuoteView.tsx tests/stripe-deposit.test.ts
  git commit -m "feat(stripe): paiement d acompte 30% par carte bancaire sur devis signe"
  ```

---

### Task 4: Carnet de Clients (Mini-CRM BTP) & Bibliothèque d'Ouvrages

**Files:**
- Create: `src/services/clientCrm.ts`
- Create: `src/components/dashboard/ClientCrmModal.tsx`
- Test: `tests/crm.test.ts`
- Modify: `src/pages/DashboardPage.tsx`
- Modify: `src/pages/QuoteBuilderPage.tsx`

- [ ] **Step 1: Write test for Client CRM service**
  Enregistrement, dédoublonnage par email/téléphone et récupération de l'historique des chantiers.
  Run: `npx tsx --test tests/crm.test.ts`
  Expected: FAIL.

- [ ] **Step 2: Implement `src/services/clientCrm.ts`**
  Gestion du stockage local et synchronisation des fiches clients avec leurs devis associés.

- [ ] **Step 3: Implement `src/components/dashboard/ClientCrmModal.tsx`**
  Interface de gestion du carnet clients (recherche par nom, contact rapide, création de devis pour ce client).

- [ ] **Step 4: Connect auto-fill in `QuoteBuilderPage.tsx`**
  Sélecteur de clients existants pour pré-remplir l'adresse de chantier en un clic.

- [ ] **Step 5: Verify build & tests**
  Run: `npx tsx --test tests/crm.test.ts && npm run build`
  Expected: PASS.

- [ ] **Step 6: Commit**
  ```bash
  git add src/services/clientCrm.ts src/components/dashboard/ClientCrmModal.tsx src/pages/DashboardPage.tsx src/pages/QuoteBuilderPage.tsx tests/crm.test.ts
  git commit -m "feat(crm): carnet de clients et pre-remplissage rapide des chantiers"
  ```

---

### Task 5: Authentification Sécurisée du Portail Administrateur (`/admin`)

**Files:**
- Create: `src/services/adminAuth.ts`
- Create: `src/components/admin/AdminLoginModal.tsx`
- Test: `tests/admin-auth.test.ts`

- [ ] **Step 1: Write test for Admin Auth**
  Validation du code PIN Maître administrateur, gestion du token de session et expiration automatique.
  Run: `npx tsx --test tests/admin-auth.test.ts`
  Expected: FAIL.

- [ ] **Step 2: Implement `src/services/adminAuth.ts`**
  Vérification de sécurité, stockage session sécurisé `sessionStorage` et méthode `logoutAdmin()`.

- [ ] **Step 3: Implement `AdminLoginModal.tsx`**
  Interface de saisie du PIN à 6 chiffres avec pavé numérique sécurisé et protection contre les tentatives excessives.

- [ ] **Step 4: Verify build & tests**
  Run: `npx tsx --test tests/admin-auth.test.ts && npm run build`
  Expected: PASS.

- [ ] **Step 5: Commit**
  ```bash
  git add src/services/adminAuth.ts src/components/admin/AdminLoginModal.tsx tests/admin-auth.test.ts
  git commit -m "feat(admin-auth): portail d authentification maitre administrateur securise"
  ```

---

### Task 6: Moteur de Métriques SaaS & KPIs en Direct (MRR, Volume, Conversion)

**Files:**
- Create: `src/services/adminMetrics.ts`
- Create: `src/components/admin/AdminMetricsOverview.tsx`
- Test: `tests/admin-metrics.test.ts`

- [ ] **Step 1: Write unit tests for SaaS metrics calculations**
  Calcul du MRR (Revenu Récurrent Mensuel), ARR, volume d'affaires total chiffré, volume encaissé et taux de transformation.
  Run: `npx tsx --test tests/admin-metrics.test.ts`
  Expected: FAIL.

- [ ] **Step 2: Implement `src/services/adminMetrics.ts`**
  Agrégation des données depuis Supabase (`quotes`, `invoices`, `waitlist`, `profiles`).

- [ ] **Step 3: Implement `AdminMetricsOverview.tsx`**
  Cartes graphiques avec badges de progression : MRR Récurrent, Total Chiffré, Acomptes Encaissés, Artisans Inscrits, Taux de Signature.

- [ ] **Step 4: Verify build & tests**
  Run: `npx tsx --test tests/admin-metrics.test.ts && npm run build`
  Expected: PASS.

- [ ] **Step 5: Commit**
  ```bash
  git add src/services/adminMetrics.ts src/components/admin/AdminMetricsOverview.tsx tests/admin-metrics.test.ts
  git commit -m "feat(admin-metrics): moteur d agregation et tableau de bord des kpis saas"
  ```

---

### Task 7: Gestion des Artisans, Plans d'Abonnement (VIP 9,50€ & Pro)

**Files:**
- Create: `src/components/admin/ArtisansManagerTable.tsx`
- Create: `src/components/admin/SubscriptionBadge.tsx`
- Modify: `src/services/adminMetrics.ts`

- [ ] **Step 1: Implement `SubscriptionBadge.tsx`**
  Badges visuels soignés pour les forfaits : `Gratuit (3 devis)`, `VIP Pionnier (9,50 €/mois)`, `Pro (19 €/mois)`.

- [ ] **Step 2: Implement `ArtisansManagerTable.tsx`**
  Tableau complet avec barre de recherche, filtres par plan et par corps d'état, affichage du volume chiffré par artisan et bouton d'action pour modifier le forfait.

- [ ] **Step 3: Verify build**
  Run: `npm run build && npx tsc --noEmit`
  Expected: PASS.

- [ ] **Step 4: Commit**
  ```bash
  git add src/components/admin/ArtisansManagerTable.tsx src/components/admin/SubscriptionBadge.tsx src/services/adminMetrics.ts
  git commit -m "feat(admin-artisans): table de gestion et moderation des artisans et abonnements"
  ```

---

### Task 8: Gestion de la Waitlist (247+ Leads) & Export CSV Commercial

**Files:**
- Create: `src/services/exportCsv.ts`
- Create: `src/components/admin/WaitlistManagerTable.tsx`
- Test: `tests/export-csv.test.ts`

- [ ] **Step 1: Write test for CSV exporter**
  Formatage correct des délimiteurs virgule/point-virgule, encodage UTF-8 avec BOM pour compatibilité Excel, protection contre les caractères spéciaux.
  Run: `npx tsx --test tests/export-csv.test.ts`
  Expected: FAIL.

- [ ] **Step 2: Implement `src/services/exportCsv.ts`**
  Export des colonnes : Nom, Email, Téléphone, Métier, Département, Date d'inscription, Statut.

- [ ] **Step 3: Implement `WaitlistManagerTable.tsx`**
  Table des leads avec compteurs, filtres rapides et gros bouton "Télécharger l'Export CSV".

- [ ] **Step 4: Verify build & tests**
  Run: `npx tsx --test tests/export-csv.test.ts && npm run build`
  Expected: PASS.

- [ ] **Step 5: Commit**
  ```bash
  git add src/services/exportCsv.ts src/components/admin/WaitlistManagerTable.tsx tests/export-csv.test.ts
  git commit -m "feat(admin-leads): gestion de la waitlist et export csv commercial 1-clic"
  ```

---

### Task 9: Page Complète `/admin` & Navigation Sécurisée

**Files:**
- Create: `src/pages/AdminDashboardPage.tsx`
- Modify: `src/App.tsx`
- Modify: `src/components/Navbar.tsx`

- [ ] **Step 1: Implement `AdminDashboardPage.tsx`**
  Page maîtresse assemblant l'authentification PIN, les KPIs, l'onglet Artisans, l'onglet Waitlist/Leads et les paramètres Stripe/Plateforme.

- [ ] **Step 2: Add route `/admin` in `App.tsx`**
  Routage direct vers `AdminDashboardPage`.

- [ ] **Step 3: Add discreet admin shortcut in `Navbar.tsx` & `Footer.tsx`**
  Accès fluide pour vous tout en restant discret pour le grand public.

- [ ] **Step 4: Verify full build**
  Run: `npm run build && npx tsc --noEmit`
  Expected: PASS.

- [ ] **Step 5: Commit**
  ```bash
  git add src/pages/AdminDashboardPage.tsx src/App.tsx src/components/Navbar.tsx
  git commit -m "feat(admin-page): page maitresse du tableau de bord administrateur saas"
  ```

---

### Task 10: Validation de Bout en Bout, Suite Complète de Tests & Déploiement

**Files:**
- Create: `tests/e2e-full-saas.test.ts`

- [ ] **Step 1: Write and run end-to-end integration test**
  Vérification de la chaîne complète :
  1. Recherche d'entreprise SIRET gouv.
  2. Émission et signature devis avec acompte Stripe.
  3. Relance WhatsApp.
  4. Répercussion dans les métriques et l'export CSV du dashboard Admin.
  Run: `npx tsx --test tests/e2e-full-saas.test.ts`
  Expected: PASS.

- [ ] **Step 2: Run all tests in the project**
  Run: `npm test`
  Expected: All test suites PASS (100%).

- [ ] **Step 3: Run final production build**
  Run: `npm run build && npx tsc --noEmit`
  Expected: 0 errors.

- [ ] **Step 4: Commit and push readiness**
  ```bash
  git add tests/e2e-full-saas.test.ts
  git commit -m "test(e2e): validation complete du cycle saas artisan et administration"
  ```
