# BâtiDevis SaaS — Plan d'Implémentation Complet

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construire l'application complète BâtiDevis 2026 comprenant le générateur de devis en mode libre sans compte, la signature tactile locale et à distance par lien public WhatsApp, le moteur de conversion en facture d'acompte (30%) et de solde (70%), le tableau de bord artisan et la mise à jour de la landing page.

**Architecture:** Application modulaire basée sur React 19 et `react-router-dom` au-dessus de Vite 8 et Tailwind CSS 4. Backend PostgreSQL hébergé sur Supabase Paris (`eu-west-3`) avec Row Level Security, fonctions stockées pour les tokens de partage et l'authentification artisan via Supabase Auth. Export PDF et signature tactile 100% exécutés côté client sans dépendance serveur payante.

**Tech Stack:** React 19, TypeScript, Vite 8, Tailwind CSS 4, `react-router-dom`, `@supabase/supabase-js`, Lucide React, Canvas Confetti.

**Spec:** `docs/superpowers/specs/2026-10-28-batidevis-saas-design.md`

## Global Constraints
* Framework : Vite 8 + React 19 SPA (déployable sur Vercel avec `vercel.json` rewrite `/(.*) -> /index.html`).
* Backend : Supabase PostgreSQL en région `eu-west-3` (Paris, France), URL `https://njnlnltawzujhgfvqdkw.supabase.co`.
* Zero-friction : `/creer-devis` doit permettre de tester et créer un devis sans aucune authentification préalable.
* Fiscalité française 2026 : Support strict des taux de TVA 5.5% (éco-rénovation), 10% (rénovation courante), 20% (neuf/fournitures), avec ventilation précise au centime d'euro.
* Signature : Canvas HTML5 réactif sur mobile (tactile) et desktop (souris).
* Distribution : Liens natifs `wa.me`, `mailto:`, `sms:` et `navigator.share` sans coût d'API tiers.

## Review Focus
1. **Lien de signature client non authentifié (`/valider/:token`)** : Le client final ne doit jamais être bloqué par un écran de connexion Supabase ; il doit pouvoir lire et signer son devis avec son seul token public.
2. **Déduction exacte de l'acompte sur la facture de solde** : La facture de solde doit explicitement soustraire l'acompte de 30% déjà facturé et afficher un Net à Payer de 70% TTC exact, sans déséquilibre de TVA.
3. **Persistance temporaire en mode libre** : Si l'artisan recharge la page `/creer-devis` avant de créer son compte, ses lignes saisies doivent être conservées en mémoire locale temporaire pour ne pas perdre son travail.
4. **Numérotation séquentielle par artisan** : Deux artisans différents doivent pouvoir émettre leur propre `FAC-2026-001` sans collision en base de données.
5. **Ergonomie mobile 375px** : Les pads de signature et boutons d'action rapide doivent être pleinement utilisables à une main sur smartphone sur chantier.

---

### Task 1: Schéma Supabase & Migrations SQL (Factures, Signatures, Tokens)

**Files:**
- Modify: `src/lib/supabase.ts` (Ajout des types `Invoice`, `QuoteSignature`)
- Test: `tests/database-schema.test.ts`

**Interfaces:**
- Produces: Tables `public.invoices` et colonnes `share_token`, `client_signature_data`, `client_signed_at` sur `public.quotes`.
- Produces: Types TypeScript `InvoiceRecord`, `QuoteSignatureData`.

- [ ] **Step 1: Write the failing test for Invoice Types & Interface contract**
Créer `tests/database-schema.test.ts` vérifiant la cohérence des structures de données `InvoiceRecord` (colonnes obligatoires : `invoice_number`, `deposit_deducted`, `net_to_pay`, `user_id`).

- [ ] **Step 2: Run test to verify it fails**
Run: `npx tsx --test tests/database-schema.test.ts`
Expected: FAIL avec types manquants.

- [ ] **Step 3: Execute SQL migrations on Supabase and update `src/lib/supabase.ts`**
Exécuter via MCP la création de la table `invoices` avec RLS et l'ajout de `share_token` (génération automatique hex 16 octets) sur `quotes`. Exporter les interfaces TypeScript dans `src/lib/supabase.ts`.

- [ ] **Step 4: Run test to verify it passes**
Run: `npx tsx --test tests/database-schema.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**
```bash
git add src/lib/supabase.ts tests/database-schema.test.ts
git commit -m "feat(db): schema factures et tokens de signature securises Supabase"
```

---

### Task 2: Moteur Comptable & Calcul des Factures (Acompte 30% & Solde 70%)

**Files:**
- Create: `src/services/invoices.ts`
- Test: `tests/invoices.test.ts`

**Interfaces:**
- Consumes: `calculateQuoteTotals`, `QuotePayload` depuis `src/services/quotes.ts`.
- Produces: `generateDepositInvoice(quote, depositPercent: 30) -> InvoiceRecord`
- Produces: `generateFinalInvoice(quote, existingDepositInvoice?) -> InvoiceRecord`

- [ ] **Step 1: Write the failing unit tests for invoice generation**
Créer `tests/invoices.test.ts` :
- Test 1 : Acompte 30% sur devis de 1000€ HT (1100€ TTC à 10%) donne 330€ TTC net à payer.
- Test 2 : Facture de solde déduisant l'acompte de 330€ donne un net à payer de 770€ TTC (70%).
- Test 3 : Mention obligatoire de déduction d'acompte avec référence à la facture d'acompte.

- [ ] **Step 2: Run test to verify it fails**
Run: `npx tsx --test tests/invoices.test.ts`
Expected: FAIL avec module `src/services/invoices.ts` non défini.

- [ ] **Step 3: Implement `src/services/invoices.ts`**
Coder la génération d'acompte (30% proratisé sur la TVA) et de solde (déduction de l'acompte perçu avec calcul du net à payer).

- [ ] **Step 4: Run test to verify it passes**
Run: `npx tsx --test tests/invoices.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**
```bash
git add src/services/invoices.ts tests/invoices.test.ts
git commit -m "feat(accounting): moteur factures acompte 30% et solde conforme"
```

---

### Task 3: Configuration de `react-router-dom` & Architecture des Routes

**Files:**
- Create: `src/pages/HomePage.tsx` (Encapsule la landing page actuelle)
- Create: `src/pages/QuoteBuilderPage.tsx` (Studio devis en mode libre)
- Create: `src/pages/PublicSignPage.tsx` (Signature client en ligne)
- Create: `src/pages/DashboardPage.tsx` (Espace artisan devis & factures)
- Modify: `src/App.tsx` (Déclaration des routes)
- Modify: `package.json` (Installation de `react-router-dom`)

**Interfaces:**
- Produces: Système de routing SPA complet (`/`, `/creer-devis`, `/valider/:token`, `/app/dashboard`).

- [ ] **Step 1: Install `react-router-dom`**
Run: `npm install react-router-dom`

- [ ] **Step 2: Create Page components shells**
Créer `src/pages/HomePage.tsx`, `src/pages/QuoteBuilderPage.tsx`, `src/pages/PublicSignPage.tsx`, `src/pages/DashboardPage.tsx`.

- [ ] **Step 3: Wire router in `src/App.tsx`**
Configurer `<BrowserRouter>` avec les 4 routes principales.

- [ ] **Step 4: Test and verify build**
Run: `npm run build && npx tsc --noEmit`
Expected: PASS (0 erreurs).

- [ ] **Step 5: Commit**
```bash
git add package.json package-lock.json src/App.tsx src/pages/
git commit -m "feat(routes): mise en place du routeur react-router-dom pour le SaaS"
```

---

### Task 4: Composant `SignaturePad` Réactif (HTML5 Canvas Mobile & Desktop)

**Files:**
- Create: `src/components/signature/SignaturePad.tsx`
- Test: `tests/signature.test.ts`

**Interfaces:**
- Produces: `<SignaturePad onSave={(dataUrl: string) => void} onClear={() => void} />`
- Support tactile complet (`pointerdown`, `pointermove`, `pointerup` avec `touch-action: none`).

- [ ] **Step 1: Write helper test for base64 signature validation**
Créer `tests/signature.test.ts` vérifiant que l'utilitaire d'extraction et validation de format PNG dataUrl fonctionne correctement.

- [ ] **Step 2: Run test to verify it fails**
Run: `npx tsx --test tests/signature.test.ts`
Expected: FAIL.

- [ ] **Step 3: Implement `SignaturePad.tsx`**
Composant Canvas avec tracé fluide (épaisseur adaptée, bouton Effacer, bouton Valider, aperçu tactile).

- [ ] **Step 4: Run test to verify it passes**
Run: `npx tsx --test tests/signature.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**
```bash
git add src/components/signature/ tests/signature.test.ts
git commit -m "feat(ui): composant SignaturePad tactile responsive HTML5"
```

---

### Task 5: Studio de Devis en Mode Libre (`/creer-devis`) & Onboarding Express

**Files:**
- Create: `src/components/builder/TradeKitSelector.tsx` (Boutons d'ajout rapide par métier)
- Create: `src/components/builder/QuoteItemsTable.tsx` (Tableau réactif d'articles avec taux TVA)
- Create: `src/components/builder/AuthExpressModal.tsx` (Modale inscription 3 champs lors du premier enregistrement)
- Modify: `src/pages/QuoteBuilderPage.tsx`

**Interfaces:**
- Consumes: `getKitsByTrade`, `calculateQuoteTotals`, `saveQuote` depuis `src/services/quotes.ts`.
- Consumes: `SignaturePad` depuis `src/components/signature/SignaturePad.tsx`.
- Produces: Création de devis en 60 secondes en accès libre + persistance locale temporaire.

- [ ] **Step 1: Implement `TradeKitSelector.tsx`**
Boutons des corps de métier BTP qui injectent les ouvrages types en 1 clic.

- [ ] **Step 2: Implement `QuoteItemsTable.tsx`**
Tableau réactif avec ajout libre (désignation, qté, unité, prix unitaire HT, TVA 5.5/10/20%), suppression et calculs temps réel.

- [ ] **Step 3: Implement `AuthExpressModal.tsx`**
Modale compacte (Email, Mot de passe, Nom d'entreprise) se connectant à Supabase Auth (`supabase.auth.signUp`).

- [ ] **Step 4: Assemble `QuoteBuilderPage.tsx`**
Intégration du formulaire, de la prévisualisation A4 en direct, du bouton "Faire signer en direct" et "Partager".

- [ ] **Step 5: Verify build**
Run: `npm run build && npx tsc --noEmit`
Expected: PASS.

- [ ] **Step 6: Commit**
```bash
git add src/components/builder/ src/pages/QuoteBuilderPage.tsx
git commit -m "feat(builder): studio de devis en acces libre 60s avec kits metiers"
```

---

### Task 6: Modale de Partage Smartphone (WhatsApp, SMS, Email, Lien)

**Files:**
- Create: `src/components/share/ShareQuoteModal.tsx`
- Modify: `src/pages/QuoteBuilderPage.tsx`

**Interfaces:**
- Consumes: `share_token` du devis pour générer l'URL `https://batidevis.fr/valider/:token`.
- Produces: Liens profonds `wa.me/?text=...`, `mailto:`, `sms:`, et copie presse-papier.

- [ ] **Step 1: Implement `ShareQuoteModal.tsx`**
Boutons visuels :
- "Partager sur WhatsApp" (`window.open('https://wa.me/?text=' + encodeURIComponent(message))`)
- "Envoyer par SMS" (`sms:?body=...`)
- "Envoyer par Email" (`mailto:?subject=...&body=...`)
- "Copier le lien sécurisé" (`navigator.clipboard.writeText`)

- [ ] **Step 2: Connect share modal to QuoteBuilderPage**
Déclenchement du partage après sauvegarde du devis.

- [ ] **Step 3: Verify build**
Run: `npm run build && npx tsc --noEmit`
Expected: PASS.

- [ ] **Step 4: Commit**
```bash
git add src/components/share/ src/pages/QuoteBuilderPage.tsx
git commit -m "feat(share): modale de distribution directe WhatsApp, SMS et Email"
```

---

### Task 7: Portail Client de Consultation & Signature en Ligne (`/valider/:token`)

**Files:**
- Create: `src/services/publicQuote.ts` (Lecture publique sécurisée par token)
- Create: `src/components/public/PublicQuoteView.tsx` (Fiche devis client avec téléchargement PDF)
- Modify: `src/pages/PublicSignPage.tsx`

**Interfaces:**
- Consumes: URL token paramètre `:token`.
- Produces: Consultation sans compte pour le client, signature tactile avec horodatage, mise à jour du statut du devis vers `accepted`.

- [ ] **Step 1: Write RPC Supabase pour lecture et signature par token**
Créer la fonction Postgres sécurisée `get_quote_by_token(p_token)` et `sign_quote_by_token(p_token, p_signature, p_signer_name)` avec `SECURITY DEFINER` (zéro fuite de données d'autres artisans).

- [ ] **Step 2: Implement `src/services/publicQuote.ts`**
Appel des fonctions RPC depuis le client.

- [ ] **Step 3: Implement `PublicQuoteView.tsx` & `PublicSignPage.tsx`**
Interface claire pour le client sur mobile, bouton d'acceptation, capture de signature, téléchargement du devis signé en PDF.

- [ ] **Step 4: Verify build**
Run: `npm run build && npx tsc --noEmit`
Expected: PASS.

- [ ] **Step 5: Commit**
```bash
git add src/services/publicQuote.ts src/components/public/ src/pages/PublicSignPage.tsx
git commit -m "feat(client-portal): portail de signature client en ligne 1 clic par token"
```

---

### Task 8: Tableau de Bord Artisan & Conversion Devis ➔ Facture (`/app/dashboard`)

**Files:**
- Create: `src/components/dashboard/QuoteCard.tsx` (Fiche devis avec badge de statut et bouton "Facturer")
- Create: `src/components/dashboard/InvoiceCard.tsx` (Fiche facture avec état impayée/payée)
- Create: `src/components/dashboard/ProfileSettingsModal.tsx` (Configuration SIRET, assurance, IBAN)
- Modify: `src/pages/DashboardPage.tsx`

**Interfaces:**
- Consumes: `generateDepositInvoice`, `generateFinalInvoice` depuis `src/services/invoices.ts`.
- Produces: Gestion centralisée des devis et facturation en 1 clic pour l'artisan connecté.

- [ ] **Step 1: Implement `QuoteCard.tsx` with 1-click Invoice actions**
Bouton "Convertir en Facture d'acompte (30%)" et "Facture de solde (70%)".

- [ ] **Step 2: Implement `InvoiceCard.tsx`**
Affichage des montants HT, TVA, Acompte déduit, Net à payer TTC et bouton Télécharger PDF.

- [ ] **Step 3: Implement `ProfileSettingsModal.tsx`**
Formulaire profil artisan : SIRET, raison sociale, adresse, nom de l'assurance décennale, numéro de police, IBAN.

- [ ] **Step 4: Assemble `DashboardPage.tsx`**
Gestion de session Supabase Auth, chargement des devis et factures de l'artisan, totaux financiers du mois.

- [ ] **Step 5: Verify build**
Run: `npm run build && npx tsc --noEmit`
Expected: PASS.

- [ ] **Step 6: Commit**
```bash
git add src/components/dashboard/ src/pages/DashboardPage.tsx
git commit -m "feat(dashboard): tableau de bord artisan et conversion devis en facture 1 clic"
```

---

### Task 9: Mise à Jour de la Landing Page (`/`) & Navigation Globale

**Files:**
- Modify: `src/components/Navbar.tsx` (Ajout bouton "Créer mon devis (Gratuit)" et "Mon Espace")
- Modify: `src/components/HeroSection.tsx` (Nouveaux CTA orientés vers `/creer-devis`)
- Modify: `src/components/SolutionSection.tsx` (Mise en avant du cycle complet Devis ➔ Signature ➔ Facture 30%)
- Modify: `src/components/Footer.tsx`

**Interfaces:**
- Produces: Landing page synchronisée avec la proposition de valeur complète (Devis + Factures).

- [ ] **Step 1: Update Navbar & Hero Section CTA**
Remplacer les boutons de démo générique par des liens vers `/creer-devis` ("Créer un devis en 60s - Gratuit") et un lien vers `/app/dashboard` ("Connexion artisan").

- [ ] **Step 2: Update Solution Section**
Mettre à jour les 3 piliers :
1. Devis conforme en 60 secondes sur mobile.
2. Signature immédiate en direct ou par lien WhatsApp.
3. Facture d'acompte (30%) et de solde en 1 clic.

- [ ] **Step 3: Run full test suite & production build**
Run: `npm test && npm run build && npx tsc --noEmit`
Expected: All tests pass, build 0 error.

- [ ] **Step 4: Commit**
```bash
git add src/components/ src/pages/HomePage.tsx
git commit -m "feat(landing): mise a jour de la promesse complete devis et factures artisan"
```

---

### Task 10: Validation de Bout en Bout & Déploiement Vercel

**Files:**
- Test: `tests/e2e-workflow.test.ts` (Test d'intégration du cycle de vie complet Devis ➔ Signature ➔ Acompte ➔ Solde)

- [ ] **Step 1: Write and run end-to-end integration test**
Vérifier l'enchaînement complet :
1. Calcul devis avec kits plomberie.
2. Signature du devis.
3. Émission facture d'acompte 30%.
4. Émission facture de solde déduisant l'acompte (net 70%).
Run: `npx tsx --test tests/e2e-workflow.test.ts`
Expected: PASS.

- [ ] **Step 2: Final Git review and push readiness**
Run: `git status && git log -n 5 --oneline`
Vérification que l'arbre de travail est propre et prêt pour le déploiement.
