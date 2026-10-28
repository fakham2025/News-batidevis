# Document de Conception Technique — BâtiDevis SaaS Expansion 2026
**Date :** 28 Octobre 2026  
**Auteur :** Antigravity (Expert SaaS & BTP France)  
**Projet :** BâtiDevis 2026 — Plateforme SaaS Devis & Factures pour Artisans du Bâtiment  
**Statut :** Validé par l'Administrateur  

---

## 1. Contexte & Vision Métier

BâtiDevis 2026 dispose désormais d'un socle éprouvé : chiffrage rapide en mode libre, kits métiers, signature tactile, conversion devis ➔ facture d'acompte 30% et de solde 70%, avec 17 tests automatisés passants et déploiement Vercel.

Pour finaliser le produit en un **véritable SaaS BTP de référence sur le marché français**, deux volets essentiels doivent être déployés de manière séquentielle :
1. **Volet Artisan (Conversion & Réalité BTP)** :
   - Suppression du frein de saisie administrative : **Auto-complétion SIRET** via l'API officielle publique du gouvernement français (`recherche-entreprises.api.gouv.fr`).
   - Trésorerie sans délai : **Paiement d'acompte 30% en ligne par Stripe** intégré au portail public de devis.
   - Vélocité commerciale : **Module de Relance WhatsApp 1-clic** pour relancer les devis sans réponse à J+3 et J+7.
   - Fidélisation : **Mini-CRM Clients & Catalogue personnel** pour réutiliser les coordonnées et les prix favoris.
2. **Volet Administrateur SaaS (`/admin`)** :
   - Console de pilotage pour le gérant du SaaS : Métriques en temps réel (**MRR**, volume d'affaires total chiffré et facturé, taux de signature).
   - Gestion et modération des artisans inscrits (plan gratuit, VIP 9,50 €/mois, Pro 19 €/mois).
   - Exploitation commerciale de la **Waitlist (247+ leads)** avec filtres métiers/régions et **export CSV 1-clic**.
   - Paramétrage de la monétisation Stripe et des communications globales.

---

## 2. Approches Évaluées & Choix Retenu

- **Approche A (Retenue et Validée)** : Architecture Full-Stack Native Supabase + API Gouv + Stripe.
  - Zéro coût d'infrastructure externe.
  - Utilisation de l'API Recherche Entreprises de l'État français (gratuite, sans clé API, < 200ms).
  - Intégration Stripe (Payment Links & Checkout).
  - Backoffice `/admin` directement connecté à PostgreSQL Supabase avec authentification Master PIN.
- **Approche B (Rejetée)** : Micro-serveur Node/Express séparé. Rejetée car complexifie le déploiement et ajoute des points de panne inutiles sur chantier.
- **Approche C (Rejetée)** : Minimaliste sans centralisation. Rejetée car elle prive l'administrateur du pilotage commercial et des métriques MRR.

---

## 3. Architecture Détaillée

### 3.1 Volet 1 : Conversion & Ergonomie Artisan BTP

#### A. Recherche SIRET / API Recherche Entreprises
- **Service :** `src/services/inseeApi.ts`
- **Endpoint officiel :** `https://recherche-entreprises.api.gouv.fr/search?q={query}&limite=5`
- **Données extraites automatiquement :**
  - Nom / Raison sociale (`nom_raison_sociale`)
  - Numéro SIRET 14 chiffres (`siege.siret`)
  - Code NAF / APE (`activite_principale`) et libellé métier
  - Adresse complète du siège (numéro, voie, code postal, commune)
  - Numéro TVA Intracommunautaire calculé automatiquement (`FR + clé + SIREN`)
- **Intégration UI :** Composant `SiretAutocomplete.tsx` intégré dans `ProfileSettingsModal.tsx` et dans le studio de devis.

#### B. Paiement d'Acompte 30% en Ligne (Stripe)
- **Service :** `src/services/stripe.ts`
- Intégration sur le portail public client (`PublicQuoteView.tsx`) :
  - Dès que le client a signé le devis, un bouton d'action vert apparaît : *"Régler l'acompte de 30% par Carte Bancaire (Sécurisé Stripe)"*.
  - Génération dynamique ou ouverture du lien de paiement Stripe correspondant au montant TTC exact de l'acompte.
  - Mise à jour automatique du statut du devis et de la facture d'acompte (`paid`).

#### C. Relance WhatsApp 1-Clic
- **Service :** `src/services/followUp.ts`
- Modèles de relances calibrés pour le BTP :
  - **Relance J+3 (Courtoise)** : *"Bonjour [Client], suite à notre visite pour [Chantier], avez-vous pu consulter notre devis [Réf] ? Je reste disponible pour ajuster le projet."*
  - **Relance J+7 (Planning)** : *"Bonjour [Client], nous finalisons notre planning d'intervention pour les prochaines semaines. Souhaitez-vous bloquer votre date pour [Chantier] ?"*
- Génération d'un lien profond `https://wa.me/{phone}?text=...` qui ouvre WhatsApp avec le message prêt à partir.

#### D. Carnet de Clients & Prestations Personnalisées
- Stockage local et synchronisation Supabase pour mémoriser :
  - Liste des clients récurrents (Nom, Téléphone, Adresse chantier).
  - Ouvrages personnalisés sauvegardés par l'artisan (ex: taux horaire main d'œuvre, forfait déplacement).

---

### 3.2 Volet 2 : Backoffice Administrateur (`/admin`)

#### A. Sécurisation de l'Accès Admin
- Route dédiée : `/admin`
- Protection par code PIN Maître administrateur (stocké en variable d'environnement ou hash sécurisé `BATIDEVIS_ADMIN_PIN`).
- Session admin persistante en sessionStorage avec horodatage.

#### B. Tableau de Bord des KPIs SaaS
- **Compteurs en direct :**
  - **Nombre d'artisans actifs** (inscrits et utilisateurs récurrents).
  - **Nombre de devis & factures générés**.
  - **Volume d'affaires global (€)** : Montant total chiffré sur la plateforme et montants d'acomptes réglés.
  - **MRR (Monthly Recurring Revenue)** : Revenu mensuel récurrent basé sur les abonnements payants (9,50 € et 19 €).
  - **Taux de conversion** : Ratio de devis passés au statut `accepted`.

#### C. Gestion des Artisans & Modération
- Table interactive avec recherche et filtres :
  - Nom artisan, raison sociale, métier, département, email, téléphone.
  - Nombre de devis créés.
  - Formule d'abonnement : `Freemium (3 devis)`, `VIP Pionnier (9,50 €/mois)`, `Pro (19 €/mois)`.
  - Actions admin : changer le plan, offrir l'accès illimité, envoyer un email de support.

#### D. Gestion de la Waitlist & Export Commercial
- Consultation des 247+ leads inscrits via le formulaire de pré-lancement.
- Filtres par métier (plomberie, électricité, maçonnerie...) et zone géographique.
- **Bouton d'Export CSV** : Téléchargement instantané d'un fichier `.csv` conforme pour campagnes d'emailing (Brevo, Mailchimp) ou prospection téléphonique.

#### E. Configuration de la Plateforme
- Clés publiques/secrètes Stripe (Bascule Test / Production).
- Éditeur de message d'annonce globale (diffusé en haut de l'espace artisan).

---

## 4. Schéma de Données & Tables Supabase

Extension du modèle existant dans `src/lib/supabase.ts` :
- Table `clients` : `id`, `artisan_id`, `name`, `email`, `phone`, `address`, `created_at`
- Table `custom_items` : `id`, `artisan_id`, `trade`, `designation`, `unit`, `unit_price_ht`, `vat_rate`
- Table `saas_settings` : `id`, `mrr_target`, `announcement_banner`, `stripe_mode`
- Table `profiles` : ajout des champs `subscription_plan` (`free`, `vip_9`, `pro_19`), `subscription_status` (`active`, `trial`, `canceled`).

---

## 5. Stratégie de Test & Validation
- **Tests unitaires :**
  - `tests/insee-api.test.ts` : Parsing des réponses API Entreprises, formatage SIRET et code NAF.
  - `tests/follow-up.test.ts` : Génération des liens profonds WhatsApp avec encodage URI conforme.
  - `tests/admin-metrics.test.ts` : Calcul précis du MRR, du volume d'affaires et des taux de conversion.
- **Tests d'intégration & E2E :**
  - Workflow complet artisan (SIRET auto ➔ Devis ➔ Relance ➔ Signature).
  - Workflow admin (Connexion code PIN ➔ Consultation KPIs ➔ Export CSV leads).
- **Contrôles de compilation :**
  - `npx tsc --noEmit` : 0 erreur de typage.
  - `npm run build` : Bundle Vite < 5 secondes.
  - `npm test` : 100% pass.
