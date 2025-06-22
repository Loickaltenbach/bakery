# 🗄️ Guide de Migration vers PostgreSQL/Strapi

Ce guide explique comment migrer de données simulées vers une vraie base de données PostgreSQL avec Strapi.

## 📋 Prérequis

1. **PostgreSQL installé et démarré**
   ```bash
   # Sur macOS avec Homebrew
   brew install postgresql
   brew services start postgresql
   ```

2. **Base de données créée**
   ```bash
   psql postgres -c "CREATE DATABASE boulangerie;"
   ```

## 🚀 Démarrage du système

### Option 1: Script automatique
```bash
./start-system.sh
```

### Option 2: Démarrage manuel

1. **Démarrer Strapi (Terminal 1)**
   ```bash
   cd apps/strapi
   pnpm dev
   ```

2. **Démarrer Next.js (Terminal 2)**
   ```bash
   cd apps/web
   pnpm dev
   ```

## 🔧 Configuration initiale

### 1. Premier démarrage de Strapi
- Accéder à http://localhost:1337/admin
- Créer un compte administrateur
- Les modèles seront automatiquement créés

### 2. Configurer les permissions
Dans l'admin Strapi:
1. Aller dans **Settings > Users & Permissions plugin > Roles**
2. Modifier le rôle **Authenticated**:
   - **Utilisateur**: `me`, `updateMe`, `historique`
   - **Commande**: `find`, `create`, `stats`
   - **Produit**: `find`, `findOne`
   - **Categorie**: `find`, `findOne`

3. Modifier le rôle **Public**:
   - **Produit**: `find`, `findOne`
   - **Categorie**: `find`, `findOne`

## 📊 Données de test

### Créer des catégories
```json
[
  {
    "nom": "Pains",
    "slug": "pains",
    "description": "Nos pains artisanaux",
    "couleur": "#8B4513"
  },
  {
    "nom": "Viennoiseries", 
    "slug": "viennoiseries",
    "description": "Croissants, pains au chocolat...",
    "couleur": "#DAA520"
  },
  {
    "nom": "Pâtisseries",
    "slug": "patisseries", 
    "description": "Nos créations sucrées",
    "couleur": "#FF69B4"
  }
]
```

### Créer des produits
```json
[
  {
    "nom": "Baguette Tradition",
    "description": "Notre baguette artisanale",
    "prix": 1.20,
    "disponible": true,
    "stock": 50,
    "allergenes": ["gluten"],
    "regimesCompatibles": ["omnivore"],
    "tempsPreparation": 15,
    "poids": 250,
    "unite": "piece",
    "categorie": 1
  },
  {
    "nom": "Croissant",
    "description": "Croissant au beurre",
    "prix": 1.50,
    "disponible": true,
    "stock": 30,
    "allergenes": ["gluten", "lactose"],
    "regimesCompatibles": ["omnivore"],
    "tempsPreparation": 20,
    "poids": 80,
    "unite": "piece",
    "categorie": 2
  }
]
```

## 🔐 Test de l'authentification

### 1. Inscription
```bash
# Via l'interface ou API
POST http://localhost:1337/api/auth/local/register
{
  "email": "test@boulangerie.fr",
  "password": "motdepasse123",
  "nom": "Dupont",
  "prenom": "Jean",
  "telephone": "0123456789"
}
```

### 2. Connexion
```bash
POST http://localhost:1337/api/auth/local
{
  "identifier": "test@boulangerie.fr",
  "password": "motdepasse123"
}
```

### 3. Récupérer le profil
```bash
GET http://localhost:1337/api/utilisateurs/me
Authorization: Bearer YOUR_JWT_TOKEN
```

## 🛒 Test des commandes

### 1. Créer une commande
```bash
POST http://localhost:1337/api/commandes
Authorization: Bearer YOUR_JWT_TOKEN
{
  "produits": [
    {
      "produitId": "1",
      "nom": "Baguette Tradition", 
      "quantite": 2,
      "prixUnitaire": 1.20
    }
  ],
  "informationsClient": {
    "nom": "Dupont",
    "prenom": "Jean",
    "telephone": "0123456789",
    "email": "test@boulangerie.fr"
  },
  "creneauRetrait": {
    "date": "2025-06-23",
    "heure": "10:00"
  },
  "commentaires": "Bien cuit SVP"
}
```

### 2. Récupérer l'historique
```bash
GET http://localhost:1337/api/utilisateurs/historique
Authorization: Bearer YOUR_JWT_TOKEN
```

## 🔄 Migration des hooks existants

Les hooks ont été mis à jour pour utiliser Strapi :

### Avant (données simulées)
```typescript
import { useCategories } from '@/hooks/useCategories';
```

### Après (API Strapi)
```typescript
import { useCategories } from '@/hooks/useStrapi';
```

### Hooks disponibles
- `useCategories()` - Récupérer les catégories
- `useProduits(categorieSlug?)` - Récupérer les produits
- `useCommandes(filters?)` - Récupérer les commandes
- `useStats(dateDebut?, dateFin?)` - Statistiques
- `useUtilisateurs()` - Gestion des utilisateurs (admin)

## 📈 Interface d'administration

L'interface admin Next.js utilise maintenant les vraies données :

1. **Dashboard** : Statistiques en temps réel
2. **Commandes** : Gestion des statuts via API
3. **Stocks** : Mise à jour via Strapi
4. **Utilisateurs** : Gestion des rôles et permissions

## 🐛 Dépannage

### Erreur de connexion PostgreSQL
```bash
brew services restart postgresql
psql postgres -c "ALTER USER postgres PASSWORD 'password';"
```

### Erreur CORS
Vérifier le fichier `apps/strapi/config/middlewares.ts` :
```typescript
origin: ['http://localhost:3000']
```

### Erreur d'authentification
1. Vérifier les permissions dans l'admin Strapi
2. Vérifier le token JWT dans localStorage
3. Vérifier les headers Authorization

## 🔒 Sécurité en production

1. **Variables d'environnement**
   ```bash
   # .env
   DATABASE_URL=postgresql://user:password@host:port/database
   JWT_SECRET=your-super-secret-jwt-key
   API_TOKEN_SALT=your-api-token-salt
   ```

2. **HTTPS obligatoire**
3. **Validation des données côté serveur** 
4. **Rate limiting**
5. **Sanitisation des entrées**

## ✅ Checklist de migration

- [ ] PostgreSQL installé et configuré
- [ ] Strapi démarré avec modèles créés
- [ ] Admin Strapi configuré
- [ ] Permissions utilisateurs définies
- [ ] Données de test créées
- [ ] Authentification testée
- [ ] Commandes testées
- [ ] Interface admin testée
- [ ] Frontend mis à jour avec nouveaux hooks
- [ ] Tests end-to-end validés
