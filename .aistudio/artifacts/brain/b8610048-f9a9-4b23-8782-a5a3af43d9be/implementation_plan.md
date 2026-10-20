# 📋 BATIDEVIS — Plan de Développement & Feuille de Route Exécutive

Document de cadrage et plan d'exécution validé à partir du compte-rendu d'équipe du 20/10/2026.  
Ce plan détaille la transformation de l'application en un micro-SaaS vertical pour artisans du bâtiment français (devis conforme 2026 en 60 secondes, mobile-first et offline-first).

---

> [!IMPORTANT]
> **Décisions Validées du Rapport du 20/10/2026 :**
> - **Exclusion volontaire au MVP** : Pas de saisie vocale IA active (teaser "🎙️ V2 en préparation"), pas de LiDAR, pas de multi-devises/comptabilité lourde, pas de module de paiement maintenant (reporté post-bêta avec PayPal/Stripe).
> - **Remplacement** : Remplacement des SMS par **Email natif** + lien de partage **WhatsApp**.
> - **Architecture Offline-First** : IndexedDB / LocalStorage pour saisie chantier en zone blanche (0 réseau) avec synchronisation d'état (`synced_at`).
> - **Programme Fondateurs** : Remplacement des faux avis par le bloc officiel des 20 artisans fondateurs (-50% à vie, accès prioritaire, échange hebdomadaire de 15 min).

---

## 1. Vue d'Ensemble & Positionnement

- **Produit** : **BATIDEVIS** — Micro-SaaS vertical de devis et facturation pour artisans du bâtiment.
- **Cible prioritaire** : Plombiers, électriciens, peintres, carreleurs, maçons, CVC, menuisiers, serruriers/ferronniers, plaquistes.
- **Proposition de valeur** : Devis conforme aux obligations légales 2026 (mentions décennale, SIRET, art. 293 B ou TVA normale) généré en 60 secondes sur smartphone, même sans connexion internet.
- **Killer Feature** : **Calculateur Intelligent + Kits Chantier** (forfaits prédéfinis ajustables en temps réel selon les métrés ou quantités).

```
┌────────────────────────────────────────────────────────────────────────┐
│                        BATIDEVIS ECOSYSTEM                             │
├────────────────────────────────┬───────────────────────────────────────┤
│       LANDING PAGE V2          │          APPLICATION / SAAS           │
│  - Hero "Devis en 60s"         │  - Onboarding 3 étapes (/welcome)     │
│  - Kits Chantier Showcase      │  - DevisBuilder + Kits Chantier       │
│  - 20 Places Fondateurs        │  - Mode Hors-Ligne (IndexedDB/Local)  │
│  - Waitlist Qualifiée (RGPD)   │  - Génération PDF Pro & WhatsApp/Mail │
│  - Modale Démo Loom 90s        │  - Backoffice Admin (/admin)          │
└────────────────────────────────┴───────────────────────────────────────┘
```

---

## 2. Phase 1 — Ajustements Immédiats de la Landing Page (Checklist §6)

1. **Copywriting & Vocal** :
   - Remplacement de la promesse vocale par **« Saisie en 3 clics »** avec badge distinctif : `🎙️ V2 en préparation : dictez vos devis à voix haute`.
2. **Gestion de la Rareté (Cohorte Bêta)** :
   - Mise à jour du compteur : `Cohorte 1 : X/20 places restantes` (synchronisé dynamiquement sur les inscrits réels).
3. **Bloc « Programme Fondateurs »** :
   - Suppression totale des avis génériques.
   - Intégration du bloc dédié : « Devenez l'un des 20 artisans fondateurs » (-50% à vie soit 9,50 €/mois, support direct WhatsApp, en échange de 15 min de feedback/semaine).
4. **Formulaire Waitlist Enrichi & RGPD** :
   - Ajout des champs qualifiants : **Département**, **Statut TVA** (`Auto-entrepreneur sans TVA (Art. 293 B)` / `Assujetti TVA normale`), et tracking de provenance (`source / UTM`).
   - Ajout de la mention de consentement RGPD sous le bouton d'envoi et modale de politique de confidentialité.
   - Envoi temps réel simultané : Supabase / Webhook Google Sheets.
5. **Nouveau Bloc « Kits Chantier & Calculateur Intelligent »** :
   - Positionné entre la section Mobile-First et Conforme 2026.
   - Démonstration interactive du calcul instantané (ex: Remplacement chauffe-eau, Rénovation salle d'eau au m², Tableau électrique).
6. **Mise à jour des Engagements Réglementaires** :
   - Remplacement de "eIDAS" par **« Acceptation électronique tracée et horodatée »**.
   - Badge **« À venir en V1.1 »** sur l'acompte 30%.
   - Positionnement clair sur la réforme 2027 : **« Prêt pour 2027 : export Factur-X en V1.1 »** (calendrier légal TPE sept. 2027).
7. **Modale Vidéo Démo Loom 90s** :
   - Intégration d'un lecteur démo interactif au clic sur "Voir la démo".
8. **Enrichissement FAQ** :
   - Ajout des questions spécifiques sur le fonctionnement des **Kits Chantier** et le **mode hors-ligne**.

---

## 3. Phase 2 — Données & Modèle Supabase (Offline-Ready)

Mise en place de la structure de données locale et distante selon le schéma SQL validé :

```
┌─────────────────┐       ┌─────────────────┐       ┌──────────────────┐
│    profiles     │──────<│    documents    │>──────│  document_items  │
│ (Artisan/Siret) │       │ (Devis/Facture) │       │ (Lignes / Post.) │
└────────┬────────┘       └────────┬────────┘       └────────┬─────────┘
         │                         │                         │
         │                         │                         │
┌────────┴────────┐       ┌────────┴────────┐       ┌────────┴─────────┐
│     clients     │       │  subscriptions  │       │   kits & items   │
│(Nom/Adresse/Tel)│       │ (beta/fondateur)│       │(Forfaits/Articles│
└─────────────────┘       └─────────────────┘       └──────────────────┘
```

- **Synchronisation Offline** :
  - Stockage local prioritaire avec champ `synced_at` : les devis créés dans un sous-sol ou sans 4G sont enregistrés avec `status = 'brouillon_local'`.
  - Indicateur visuel d'état de synchronisation (connecté / hors-ligne / en attente de synchronisation).

---

## 4. Phase 3 — Expérience Produit & DevisBuilder

1. **Onboarding 3 Étapes (`/welcome`)** :
   - Étape 1 : Identité de l'entreprise (Nom, Métier, SIRET, Adresse, Téléphone).
   - Étape 2 : Régime fiscal (TVA standard 10%/20% ou franchise Art. 293 B) & Assurance décennale.
   - Étape 3 : Choix des premiers Kits Chantier selon le métier (plomberie, électricité, peinture, etc.).
2. **DevisBuilder Mobile-First** :
   - Sélection client rapide ou création en 1 clic.
   - Insertion d'articles individuels ou de **Kits Chantier** complets.
   - Recalcul temps réel du HT, TVA et TTC avec détection automatique de la mention légale requise.
3. **Génération & Partage Instantané** :
   - Prévisualisation PDF épurée (optimisée noir & blanc pour impression chantier).
   - Bouton **WhatsApp Direct** : message pré-rempli avec lien et récapitulatif.
   - Bouton **Email Direct** (remplaçant les SMS comme validé par l'équipe).
   - Passage automatique du statut à `envoyé`.

---

## 5. Phase 4 — Backoffice Admin (`/admin`)

- Vue d'ensemble des 20 places bêta (gestion des quotas par corps de métier : 5 plomberie, 5 élec, 5 finitions, 5 gros œuvre).
- Activation en 1 clic du statut `plan = 'beta'` pour les artisans sélectionnés.
- Visualisation en temps réel des inscrits waitlist (avec filtres par département, métier, statut TVA).
- Export CSV direct des contacts.

---

## 6. Prochaines Étapes Immédiates

Dès réception de votre **« GO DEV »**, le déploiement se fera dans l'ordre suivant :
1. Application de tous les ajustements de la **Landing Page v2** (copywriting, badges, programme fondateurs, kits chantier, RGPD).
2. Mise à niveau du formulaire d'inscription et intégration du schéma Supabase & stockage local offline.
3. Intégration du flux **Onboarding 3 étapes** et du prototype interactif **DevisBuilder + Kits Chantier**.
4. Déploiement de l'espace **Backoffice Admin** pour la gestion de la cohorte des 20 fondateurs.
