# Guide de Test - Fonctionnalités Avancées

## 🚀 Démarrage du Système

```bash
# Démarrer le système complet
./start-dev.js

# Ou séparément :
cd apps/strapi && pnpm dev
cd apps/web && pnpm dev
```

## 📋 Fonctionnalités à Tester

### 1. Gestion des Produits Avancée

#### ✅ Catégories avec délais de préparation
- **Test :** Créer des produits dans différentes catégories
- **Vérifier :** Délais différents selon la catégorie lors de la commande

#### ✅ Disponibilité par jour
- **Test :** Configurer des produits uniquement disponibles certains jours
- **Exemple :** Sandwichs en semaine seulement
- **Vérifier :** Filtrage automatique selon le jour

#### ✅ Produits saisonniers
- **Test :** Créer des produits avec dates de saison
- **Exemple :** Galette des rois (janvier-février)
- **Vérifier :** Affichage selon la période

#### ✅ Stock en temps réel
- **Test :** Modifier le stock via l'admin
- **Vérifier :** 
  - Rupture automatique si stock ≤ minimum
  - Indisponibilité si stock = 0
  - Alertes dans l'interface admin

#### ✅ Allergènes et nutrition
- **Test :** Consulter les détails d'un produit
- **Vérifier :** Affichage des informations nutritionnelles et allergènes

### 2. Système de Créneaux Avancé

#### ✅ Horaires configurables
- **Test :** Modifier les horaires dans Strapi Admin
- **Vérifier :** Impact sur les créneaux disponibles

#### ✅ Délais par catégorie
- **Test :** Commander différents types de produits
- **Vérifier :** Délais de préparation variables

#### ✅ Fermetures exceptionnelles
- **Test :** Créer une fermeture exceptionnelle
- **Vérifier :** Pas de créneaux disponibles ce jour-là

#### ✅ Occupation des créneaux
- **Test :** Créer plusieurs commandes au même créneau
- **Vérifier :** Limitation selon `creneauxSimultanes`

### 3. API et Endpoints

#### Endpoints à tester :

```bash
# Produits du jour
GET /api/produits/aujourd-hui

# Produits par catégorie et jour
GET /api/produits/aujourd-hui?categorie=pains

# Créneaux disponibles
GET /api/horaires-ouverture/creneaux-disponibles?date=2025-06-30

# Créneaux avec délai spécifique
GET /api/horaires-ouverture/creneaux-disponibles?date=2025-06-30&categorie=patisseries

# Statut d'ouverture
GET /api/horaires-ouverture/aujourd-hui

# Alertes de stock
GET /api/produits/alertes-stock

# Mise à jour du stock
PUT /api/produits/1/stock
Content-Type: application/json
{
  "stock": 15
}
```

### 4. Interface Utilisateur

#### ✅ Filtres avancés
- **Page :** `/` ou pages catégories
- **Tester :**
  - Filtre par jour de la semaine
  - Produits saisonniers seulement
  - Nouveautés seulement
  - En stock seulement

#### ✅ Détails produits
- **Test :** Cliquer sur un produit
- **Vérifier :**
  - Informations nutritionnelles
  - Allergènes avec badges colorés
  - Disponibilité par jour
  - Statut saisonnier

#### ✅ Sélection de créneaux
- **Page :** Processus de commande
- **Tester :**
  - Sélection de date
  - Créneaux disponibles selon l'heure
  - Message si fermé
  - Délais de préparation

#### ✅ Admin - Gestion des stocks
- **Page :** Interface admin
- **Tester :**
  - Alertes de stock automatiques
  - Mise à jour en temps réel
  - Niveaux d'alerte (critique/faible)

## 🎯 Scénarios de Test Complets

### Scénario 1 : Commande avec contraintes
1. Aller sur le site un dimanche
2. Vérifier que les sandwichs ne sont pas disponibles
3. Sélectionner des pâtisseries
4. Observer le délai de préparation plus long (60min vs 30min)
5. Choisir un créneau et valider

### Scénario 2 : Gestion saisonnière
1. Configurer un produit saisonnier hors saison
2. Vérifier qu'il n'apparaît pas dans les produits du jour
3. Modifier les dates pour inclure aujourd'hui
4. Vérifier qu'il réapparaît

### Scénario 3 : Rupture de stock
1. Mettre un produit en stock très faible
2. Vérifier l'alerte dans l'admin
3. Mettre le stock à 0
4. Vérifier qu'il disparaît du catalogue

### Scénario 4 : Fermeture exceptionnelle
1. Créer une fermeture exceptionnelle pour demain
2. Essayer de commander pour demain
3. Vérifier le message de fermeture

## 🐛 Points d'Attention

- **Performance :** Surveiller les temps de réponse avec les filtres
- **Cache :** Vérifier que les modifications apparaissent rapidement
- **Mobile :** Tester sur différentes tailles d'écran
- **États d'erreur :** Tester avec API hors ligne

## 📊 Métriques à Vérifier

- Temps de chargement des produits filtrés < 1s
- Créneaux générés en < 500ms
- Interface responsive sur mobile
- Gestion d'erreurs sans crash

## 🔧 Dépannage

### Problèmes courants :
1. **Pas de créneaux :** Vérifier les horaires d'ouverture
2. **Produits manquants :** Vérifier stock et disponibilité par jour
3. **Erreurs API :** Vérifier que Strapi est bien démarré
4. **Données manquantes :** Exécuter les seeds de test
