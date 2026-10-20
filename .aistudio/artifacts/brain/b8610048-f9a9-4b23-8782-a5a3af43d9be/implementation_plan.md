# 📋 BATIDEVIS — Plan d'Exécution : DevisBuilder Avancé & PWA Mobile 100% Hors-Ligne

Feuille de route technique et fonctionnelle pour le sprint de développement priorisé par l'équipe : personnalisation complète des devis pour artisans du bâtiment français et transformation en Progressive Web App (PWA) installable sur smartphone avec fonctionnement 100% autonome hors-connexion.

---

## 🎯 Choix Stratégiques Validés

> [!IMPORTANT]
> **Décisions actées pour ce sprint :**
> 1. **Priorité Métier** : Approfondir le **DevisBuilder** et la **personnalisation des devis** (logo de l'entreprise, remise commerciale globale ou à la ligne, ventilation TVA multi-taux 0% / 5,5% / 10% / 20%, conditions d'acompte à 30%, mentions légales spécifiques au corps d'état, export et impression A4 haute fidélité).
> 2. **Mode de Déploiement Bêta** : **PWA (Progressive Web App) installable** sur smartphone (iOS Safari & Android Chrome) avec Service Worker de mise en cache, Web App Manifest autonome (`standalone`), bouton d'installation in-app intelligent et bandeau d'état réseau en temps réel.

---

## 1. 🏗️ Les 4 Grandes Étapes de Réalisation

```
┌────────────────────────────────────────────────────────────────────────┐
│                        FEUILLE DE ROUTE DU SPRINT                      │
│                                                                        │
│   ÉTAPE 1 : MOTEUR PWA & INSTALLABILITÉ MOBILE                         │
│   ├── Composant PWAInstallButton (Android / Chrome & guide iOS Safari) │
│   ├── Composant OfflineIndicator (Écoute réseau online/offline)        │
│   └── Intégration dans Navbar & Footer                                 │
│                                                                        │
│   ÉTAPE 2 : PERSONNALISATION ARTISAN DU DEVISBUILDER                   │
│   ├── Téléversement et mémorisation du Logo de l'entreprise            │
│   ├── Numérotation et préfixes personnalisables                        │
│   └── Informations légales & décennale modifiables en direct           │
│                                                                        │
│   ÉTAPE 3 : MOTEUR FINANCIER & MULTI-TVA CHANTIER                      │
│   ├── Ventilation TVA multi-taux (0% art. 293 B, 5.5%, 10%, 20%)      │
│   ├── Remise commerciale globale (% ou €)                              │
│   └── Échéancier d'acompte (30% à la commande, solde à réception)      │
│                                                                        │
│   ÉTAPE 4 : APERÇU HAUTE FIDÉLITÉ & PARTAGE DIRECT                     │
│   ├── Rendu CSS print A4 professionnel pour export PDF direct          │
│   ├── Signature tactile tracée et horodatée                            │
│   └── Partage WhatsApp et Email avec nouveaux totaux chiffrés          │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. 📱 Détail des Composants & Architecture

### Étape 1 : PWA & Expérience Mobile
* `src/components/PWAInstallButton.tsx` : Bouton discret dans la barre de navigation et le footer.
  * Sur Android/Chrome : Déclenche l'invite native d'installation `beforeinstallprompt`.
  * Sur iOS Safari : Affiche une modale illustrée expliquant l'ajout sur l'écran d'accueil (*Partager > Sur l'écran d'accueil*).
  * Se masque automatiquement si l'application est déjà exécutée en mode autonome (`display-mode: standalone`).
* `src/components/OfflineIndicator.tsx` : Toast discret en bas d'écran informant l'artisan lorsque le smartphone n'a plus de réseau : *« Mode Hors-ligne actif — vos devis sont sauvegardés sur votre téléphone »*.

### Étape 2 & 3 : DevisBuilder Avancé & Multi-TVA
* **Logo d'entreprise** : Upload d'image avec conversion locale base64 et persistance dans le profil.
* **Ventilation TVA automatique** :
  * Calcul séparé de la base HT à 5,5% (travaux énergétiques éligibles).
  * Calcul de la base HT à 10% (rénovation générale de plus de 2 ans).
  * Calcul de la base HT à 20% (neuf ou fournitures non éligibles).
  * Exonération 0% avec insertion automatique de la mention obligatoire de l'article 293 B du CGI.
* **Remise commerciale** : Choix entre pourcentage (%) ou montant déduit en euros (€), avec impact direct sur la base imposable et le TTC.
* **Acompte 30%** : Calcul automatique du montant de l'acompte exigible à la signature et du solde restant dû lors de la réception des travaux.

### Étape 4 : Export A4 & Partage
* Feuille de style dédiée à l'impression `@media print` pour un rendu A4 impeccable lors de l'export PDF sur mobile ou desktop.
* Partage en 1 clic via WhatsApp et Email intégrant les mentions d'acompte et le total TTC.

---

## 3. 🛡️ Validation & Compilation
* Test complet avec `compile_applet` et vérification syntaxique `lint_applet`.
* Validation du cycle offline : création, modification et signature d'un devis en simulation hors-connexion.
