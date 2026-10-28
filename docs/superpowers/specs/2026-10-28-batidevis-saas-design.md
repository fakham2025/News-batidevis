# Document de Conception — BâtiDevis SaaS 2026
**Date :** 28 octobre 2026  
**Statut :** En attente de validation  
**Projet :** Application Complète de Création de Devis, Signature Électronique et Facturation Artisan  
**Auteur :** Antigravity & fakham2025  

---

## 1. Contexte & Vision Produit

### 1.1 Le Problème Métier
Les artisans du bâtiment (plombiers, électriciens, peintres, maçons, menuisiers) passent en moyenne 4 à 8 heures par semaine le soir et le week-end à rédiger des devis sur Excel ou Word. Beaucoup perdent des chantiers parce qu'ils mettent plusieurs jours à envoyer leur devis, ou risquent des amendes pour non-respect des 16 mentions obligatoires imposées par la législation française et la réforme de la facture électronique 2026.

### 1.2 La Solution BâtiDevis
BâtiDevis est une application mobile-first permettant à un artisan sur chantier ou dans son véhicule :
1. De créer un devis professionnel conforme 2026 en **60 secondes**.
2. De tester et générer son premier devis **immédiatement en mode libre, sans inscription préalable**.
3. De faire signer son client **en direct sur l'écran tactile du smartphone**, ou d'envoyer un **lien sécurisé par WhatsApp / Email** pour signature électronique à distance en 1 clic.
4. De convertir le devis accepté en **facture d'acompte (30%) ou facture de solde en 1 clic**.
5. D'exporter et partager le document en **PDF officiel aux normes françaises**.

---

## 2. Objectifs, Non-Objectifs & Anti-Objectifs

### 2.1 Objectifs (Goals)
* **Temps de création :** Moins de 60 secondes pour un devis standard via les kits métiers prédéfinis.
* **Zéro friction initiale (Product-Led Growth) :** L'artisan accède à `/creer-devis` sans login, tape ses lignes, et ne crée son compte qu'au moment d'enregistrer, d'envoyer ou de faire signer le devis.
* **Signature multicanale :**
  * Signature tactile locale sur écran (canvas HTML5).
  * Envoi d'un lien public `/valider/:token` (WhatsApp / SMS / Email) permettant au client de signer en 1 clic.
* **Transformation Devis -> Facture :** Bouton "Convertir en facture" générant automatiquement la facture correspondante (numérotation continue, date d'échéance, mentions légales).
* **Conformité 2026 :** 16 mentions obligatoires (SIRET, assurance décennale, TVA 5.5% / 10% / 20%, validité 30 jours, pénalités de retard).
* **Backend Supabase :** Données stockées en PostgreSQL en région Paris (`eu-west-3`), sécurisées par Row Level Security (RLS).
* **Mise à jour Landing Page :** Intégration de la promesse "Devis & Facture artisan" et CTA orientés vers l'essai immédiat.

### 2.2 Non-Objectifs (Non-Goals pour la V1)
* Dictée vocale IA (repoussée en V2).
* Connexion bancaire directe (Stripe Connect / Chorus Pro PDP direct en V2).
* Gestion des stocks de fournitures et multi-salariés.

### 2.3 Anti-Objectifs
* Ne jamais bloquer l'artisan par un formulaire d'inscription de 10 étapes avant qu'il n'ait vu son devis.
* Ne jamais perdre les données saisies par un artisan s'il recharge sa page avant de créer son compte (persistance temporaire locale).
* Ne pas forcer le client final à installer une application ou créer un compte pour signer son devis.

---

## 3. Approches Architecturales Comparées

| Critère | Option 1 : Modales dans SPA | Option 2 : Modulaire avec Routeur (Retenue) | Option 3 : Refonte Next.js SSR |
|---|---|---|---|
| **Structure** | 1 seule page, états modaux | Routeur léger (`react-router-dom`) | Framework Next.js App Router |
| **Lien de signature client** | Paramètre complexe `?sign=id` | URL claire : `batidevis.fr/valider/:token` | URL serveur `/valider/:token` |
| **Essai libre sans compte** | Modale popup | Page dédiée `/creer-devis` | Page `/creer-devis` |
| **Stabilité du build** | Élevée | Élevée (Vite 8, build 6s) | Risque de conflits Tailwind 4 |
| **Vitesse de livraison** | Rapide | Rapide & Pérenne | Lente (refonte nécessaire) |

**Choix validé :** **Option 2**.

---

## 4. Spécifications Détaillées des Parcours Utilisateurs

### 4.1 Parcours 1 — Création Immédiate en Mode Libre (`/creer-devis`)
1. L'artisan arrive sur `/creer-devis` (depuis la landing page ou directement).
2. **Étape 1 : Coordonnées chantier** (Nom client, adresse des travaux, date).
3. **Étape 2 : Lignes de devis** :
   * Boutons d'ajout rapide par corps de métier (Plomberie, Électricité, Peinture, Menuiserie, Maçonnerie).
   * Ajout libre de prestation (Désignation, Quantité, Unité, Prix HT, Taux TVA 5.5%, 10% ou 20%).
4. **Calculs automatiques en temps réel** : Total HT, détail TVA ventilée par taux, Total TTC.
5. **Prévisualisation interactive** du devis formatté aux normes 2026.
6. Actions disponibles :
   * **« Faire signer en direct »** (ouvre le pad de signature tactile).
   * **« Envoyer au client »** (WhatsApp / Email).
   * **« Télécharger PDF »**.
7. Si l'artisan n'est pas connecté, une modale rapide s'affiche :  
   *« Pour enregistrer vos coordonnées d'entreprise (SIRET, Assurance) et sauvegarder ce devis, créez votre compte en 10 secondes. »*
8. Après création de compte / connexion, le devis est immédiatement enregistré dans Supabase sous son compte.

### 4.2 Parcours 2 — Signature Client en Ligne (`/valider/:token`)
1. Le client reçoit un lien (ex: `https://batidevis.fr/valider/tok_abc123`).
2. Sur son smartphone, le devis s'affiche de manière claire, lisible et professionnelle.
3. Le client peut télécharger le devis en PDF.
4. En bas de page, un bouton vert : **« Accepter et Signer le devis »**.
5. Le client dessine sa signature avec son doigt, coche la mention légale *« Bon pour accord et exécution des travaux »*, et valide.
6. Le devis passe instantanément en statut **`accepted`** dans Supabase. L'artisan voit l'accord en direct.

### 4.3 Parcours 3 — Tableau de Bord Artisan (`/app/dashboard`)
1. Vue synthétique : Devis en cours, devis acceptés, total facturé.
2. Pour chaque devis signé :
   * Bouton **« Convertir en Facture d'acompte (30%) »**.
   * Bouton **« Convertir en Facture de solde (70% restant ou 100%) »**.
3. **Logique comptable automatisée :**
   * **Facture d'acompte (30%) :** Génère une facture officielle avec la mention légale *« Facture d'acompte de 30% relative au devis réf: DEV-2026-XXX »*.
   * **Facture de solde finale :** Récapitule les prestations du devis, ventile la TVA, et **déduit automatiquement les 30% d'acompte déjà perçus** avec la ligne négative *« Déduction acompte (Facture réf. FAC-2026-XXX) »*, faisant ressortir un **Net à payer de 70% TTC**.
   * **Numérotation continue :** Chaque facture reçoit un numéro séquentiel incrémenté automatiquement par artisan (ex: `FAC-2026-001`, `FAC-2026-002`).
   * **Coordonnées de règlement :** Mentions obligatoires, date d'échéance et IBAN de l'artisan.

### 4.4 Parcours 4 — Mise à Jour de la Landing Page (`/`)
* **H1 / Hero :** « Le logiciel Devis & Factures artisan qui comprend votre métier ».
* **CTA Principal :** « Créer mon premier devis en 60s (Gratuit, sans inscription) » pointant vers `/creer-devis`.
* **CTA Secondaire :** « Découvrir la démo » / « Accès anticipé -50% ».
* **Nouvelle section :** Présentation du cycle complet : **Devis en 60s ➔ Signature en 1 clic ➔ Facture d'acompte automatique**.

---

## 5. Architecture des Données & Tables Supabase

### 5.1 Tables existantes
* `waitlist_leads` (opérationnelle)
* `devis_kits` (12 ouvrages pré-remplis)
* `artisan_profiles` (SIRET, décennale, coordonnées)
* `quotes` (devis conformes)

### 5.2 Extensions de Schéma requises
1. **Table `invoices` (Factures conformes 2026) :**
   * `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`
   * `quote_id UUID REFERENCES public.quotes(id) ON DELETE SET NULL`
   * `user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE`
   * `invoice_number TEXT NOT NULL` (numérotation continue par artisan, ex: `FAC-2026-001`)
   * `UNIQUE(user_id, invoice_number)`
   * `deposit_deducted NUMERIC(10,2) DEFAULT 0.00` (déduction de l'acompte sur la facture de solde)
   * `deposit_invoice_ref TEXT` (référence de la facture d'acompte le cas échéant)
   * `invoice_type TEXT NOT NULL DEFAULT 'solde'` (`acompte_30`, `solde`, `acompte_custom`)
   * `client_name TEXT NOT NULL`
   * `client_email TEXT`
   * `client_address TEXT`
   * `items JSONB NOT NULL DEFAULT '[]'::jsonb`
   * `total_ht NUMERIC(10,2) NOT NULL`
   * `total_vat NUMERIC(10,2) NOT NULL`
   * `total_ttc NUMERIC(10,2) NOT NULL`
   * `net_to_pay NUMERIC(10,2) NOT NULL` (Total TTC déduit de l'acompte perçu)
   * `status TEXT NOT NULL DEFAULT 'unpaid'` (`unpaid`, `paid`, `cancelled`)
   * `due_date DATE NOT NULL`
   * `payment_method TEXT DEFAULT 'Virement bancaire'`
   * `created_at TIMESTAMPTZ DEFAULT now()`

2. **Table `quote_signatures` / colonnes sur `quotes` :**
   * `share_token TEXT UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(16), 'hex')`
   * `client_signature_data TEXT` (image base64 signature)
   * `client_signed_at TIMESTAMPTZ`
   * `client_signed_ip TEXT`

---

## 6. Moteur PDF, Signature & Distribution

* **Distribution Directe Smartphone :** Le partage du lien client `/valider/:token` s'effectue via les protocoles natifs de l'appareil de l'artisan (`wa.me/?text=...` pour WhatsApp, `mailto:` pour email, `sms:` et Web Share API `navigator.share()`). Cela garantit que le message provient directement du numéro/email de l'artisan, sans intermédiaire, sans coût d'API et avec délivrabilité 100%.
* **Signature :** Composant `SignaturePad` réactif utilisant l'API HTML5 Canvas (compatible tactile iOS/Android et souris desktop).
* **Génération PDF :** Modèle HTML professionnel épuré aux normes françaises A4 (16 mentions légales, SIRET, assurance décennale, détail TVA, conditions de paiement), imprimable et exportable sans dépendance serveur.
* **Onboarding Express :** Le mode libre génère le devis avec des coordonnées provisoires. Lors du clic sur "Envoyer / Faire signer", une modale en 3 champs (Email, Mot de passe, Nom d'entreprise) crée le compte Supabase et associe immédiatement le devis. Les détails supplémentaires (SIRET, police décennale, IBAN) peuvent être complétés en 1 clic dans les réglages du tableau de bord.

---

## 7. Ce qui est délégué au développeur (Builder Freedom)
* Choix exact des micro-animations et transitions UI (Lucide Icons, Tailwind transitions).
* Mise en page fine du tableau de bord (cartes vs tableau réactif sur petit écran).
* Palette de couleurs secondaires pour les badges de statut (Devis créé, Envoyé, Signé, Facturé).
