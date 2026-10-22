# 📋 BATIDEVIS — Plan de Développement : Espace Artisan (Dashboard & e-reporting) & Super-Dashboard Administrateur SaaS

Plan d'architecture et de développement pour la mise en place de la double expérience applicative BâtiDevis :
1. **L'Espace Client / Artisan** accessible immédiatement après inscription : Dashboard analytique d'e-reporting (chiffre d'affaires HT/TTC, acomptes encaissés, taux de signature), paramètres de l'entreprise (SIRET, logo, TVA, décennale) et accès direct au générateur de devis & factures.
2. **Le Super-Dashboard Administrateur** pour le fondateur / équipe : Gestion globale des abonnements (bêta, fondateur, standard), suivi et édition des profils artisans, activation en 1 clic des accès, suivi des quotas métiers et métriques de monétisation SaaS.

---

## 🎯 Validation Utilisateur & Décisions Clés

> [!IMPORTANT]
> **Choix d'architecture proposés pour validation :**
> 1. **Accès & Redirection Post-Inscription** : Dès qu'un artisan soumet le formulaire d'accès ou se connecte, une session artisan est automatiquement initialisée avec redirection vers son **Espace Artisan dédié** (`/dashboard`). Un sélecteur de session permet de basculer en un clic entre l'expérience **Artisan** et le **Super-Admin**.
> 2. **E-reporting Artisan BTP** : Métriques concrètes orientées métier :
>    - CA Facturé & Encaissé (TTC & HT).
>    - Devis en cours vs devis signés (taux de concrétisation).
>    - Volume des acomptes à 30% perçus et soldes à recouvrer.
>    - Journal des activités récentes avec filtres par statut.
> 3. **Super-Dashboard Administrateur** :
>    - Table de pilotage des abonnements avec changement de statut en 1 clic (`beta` / `fondateur 9,50€` / `standard 19€`).
>    - Annuaire centralisé des profils d'entreprises (SIRET, décennale, corps de métier, contact direct).
>    - Tableau de bord des revenus SaaS (MRR prévisionnel, places fondateurs restantes par quota métier).

---

## 1. 🏗️ Présentation Générale & Expérience Utilisateur

### A. Espace Artisan (`/dashboard`)
* **Header & Statut Réseau** : Identité de l'artisan, logo d'entreprise, statut d'abonnement (badge Fondateur ou Bêta), témoin de synchronisation offline.
* **Barre d'actions rapides** :
  * *Nouveau devis en 60s* (ouvre le DevisBuilder pré-rempli).
  * *Ajouter un client*.
  * *Paramètres de mon entreprise*.
* **E-reporting & Indicateurs clés** :
  * 4 cartes de performance financières : Chiffre d'affaires global, Devis en attente de signature, Devis signés/validés, Total des acomptes 30% perçus.
  * Graphique de ventilation par statut (Brouillon, Envoyé WhatsApp/Email, Signé tactile, Payé).
  * Liste interactive des devis récents avec actions directes (voir, éditer, signer, exporter PDF A4, partager WhatsApp/Email).
* **Onglet Paramètres Entreprise** :
  * Raison sociale, SIRET, métier, adresse, coordonnées.
  * Upload/suppression du logo d'entreprise.
  * Régime fiscal (Art. 293 B ou assujetti TVA) et contrat d'assurance décennale.
  * Préférences de numérotation (`DEV-2026-`).

### B. Super-Dashboard Administrateur (`/admin`)
* **Vue Synthétique SaaS** :
  * Nombre total d'artisans inscrits et actifs.
  * Répartition des abonnements (`beta`, `fondateur`, `standard`).
  * Quotas fondateurs en temps réel (5 plomberie, 5 électricité, 5 finitions, 5 gros œuvre).
* **Gestionnaire des Abonnements & Profils** :
  * Tableau complet des utilisateurs avec filtres et recherche par email, nom ou SIRET.
  * Actions administrateur : activer le plan Fondateur, révoquer un accès, modifier les notes internes, exporter la liste en CSV.
* **Console Supabase & Données** :
  * Visualisation de l'état de persistance et script SQL complet copiable.

---

## 2. 📐 Architecture Technique & Diagramme ASCII

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                           ARCHITECTURE DUAL-SPACE                                │
│                                                                                  │
│   [ Formulaire Waitlist / Inscription ]  ───►  [ Onboarding 3 étapes / Session ] │
│                                                              │                   │
│                                                              ▼                   │
│   ┌──────────────────────────────────────────────────────────────────────────┐   │
│   │                          ESPACE ARTISAN (CLIENT)                         │   │
│   │                                                                          │   │
│   │   ┌───────────────────┐  ┌───────────────────┐  ┌────────────────────┐   │   │
│   │   │   E-REPORTING     │  │   DEVISBUILDER    │  │   MON ENTREPRISE   │   │   │
│   │   │ ───────────────── │  │ ───────────────── │  │ ────────────────── │   │   │
│   │   │ • CA HT & TTC     │  │ • Création devis  │  │ • Logo entreprise  │   │   │
│   │   │ • Acomptes 30%    │  │ • Kits Chantier   │  │ • SIRET & Coordon. │   │   │
│   │   │ • Taux conversion │  │ • Multi-TVA       │  │ • Décennale AXA/SMA│   │   │
│   │   │ • Devis en cours  │  │ • Signature touch │  │ • Préfixe numéros  │   │   │
│   │   └───────────────────┘  └───────────────────┘  └────────────────────┘   │   │
│   └──────────────────────────────────────────────────────────────────────────┘   │
│                                      │                                           │
│   ┌──────────────────────────────────┴───────────────────────────────────────┐   │
│   │                 SUPER-DASHBOARD ADMINISTRATEUR (FONDATEUR)               │   │
│   │                                                                          │   │
│   │   ┌───────────────────┐  ┌───────────────────┐  ┌────────────────────┐   │   │
│   │   │   ABONNEMENTS     │  │  PROFILS ARTISANS │  │  MÉTRIQUES SAAS    │   │   │
│   │   │ ───────────────── │  │ ───────────────── │  │ ────────────────── │   │   │
│   │   │ • Switch plan 1-cl│  │ • Vérif. SIRET    │  │ • MRR calculé      │   │   │
│   │   │ • Quotas /20      │  │ • Coordonnées     │  │ • Taux d'activité  │   │   │
│   │   │ • Export CSV      │  │ • Devis générés   │  │ • Script Supabase  │   │   │
│   │   └───────────────────┘  └───────────────────┘  └────────────────────┘   │   │
│   └──────────────────────────────────────────────────────────────────────────┘   │
│                                      │                                           │
│                                      ▼                                           │
│            [ Base de données locale & Synchronisation Supabase SQL ]              │
└──────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. 🛠️ Découpage des Étapes de Réalisation

### Étape 1 : Modèle de Données & Gestionnaire de Session
* Extension du modèle dans `src/services/db.ts` pour supporter la session courante (Artisan connecté vs Super-Admin).
* Calculs analytiques d'e-reporting automatiques : total CA HT, total TTC, montant des acomptes encaissés, ventilation des devis par statut.

### Étape 2 : Composant `ArtisanDashboardModal.tsx`
* Interface moderne et claire, adaptée aux smartphones et écrans d'ordinateurs.
* 4 indicateurs de performance financiers au format chiffres tabulaires (`tabular-nums`).
* Graphique visuel de répartition des devis par statut (brouillons, envoyés, signés, payés).
* Liste interactive des pièces commerciales avec boutons d'accès rapide (ouvrir dans le DevisBuilder, télécharger le PDF A4, renvoyer sur WhatsApp).
* Onglet dédié « Paramètres de mon entreprise » : téléversement de logo, édition du SIRET, coordonnées et assurance décennale.

### Étape 3 : Composant `SuperAdminDashboard.tsx`
* Tableau de bord pour l'administrateur avec métriques de monétisation SaaS.
* Gestion fine des abonnements : passer un artisan en plan `beta`, `fondateur` (9,50€/mois) ou `standard` (19€/mois).
* Visualisation et recherche multicritères parmi tous les profils d'artisans enregistrés.
* Export CSV certifié de tous les utilisateurs et souscriptions.

### Étape 4 : Intégration Navigation & Flux Utilisateur
* Mise à jour de `Navbar.tsx` et `App.tsx` :
  * Si l'artisan s'inscrit : ouverture immédiate de son Dashboard avec message de bienvenue.
  * Bouton d'accès « Mon Espace Artisan » pour ouvrir le dashboard à tout moment.
  * Bouton d'accès sécurisé « Super-Admin » pour le pilotage de la plateforme.
* Vérification avec `compile_applet` et `lint_applet`.
