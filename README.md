# Boulangerie - Monorepo Next.js + Strapi

## 🏗️ Architecture

Ce monorepo contient :
- **`apps/web`** : Application Next.js 15 avec interface produits
- **`apps/strapi`** : CMS Strapi pour la gestion des produits
- **`packages/ui`** : Composants UI partagés basés sur ShadCN
- **`packages/eslint-config`** : Configuration ESLint partagée
- **`packages/typescript-config`** : Configuration TypeScript partagée

## 🚀 Démarrage rapide

### 1. Installation des dépendances
```bash
pnpm install
```

### 2. Lancement des applications

#### Lancer Next.js seulement (avec données de test)
```bash
pnpm run dev:web
```
→ Interface disponible sur http://localhost:3000

#### Lancer Strapi seulement
```bash
pnpm run dev:strapi
```
→ Admin Strapi disponible sur http://localhost:1337/admin

#### Lancer les deux en parallèle
```bash
pnpm run dev:all
```

## 📱 Fonctionnalités

### Interface Next.js (Port 3000)
- ✅ Grille de produits responsive
- ✅ Cartes produits avec ShadCN UI
- ✅ Données de test intégrées (mode démo)
- ✅ Gestion d'état de chargement
- ✅ Connexion API Strapi automatique

### CMS Strapi (Port 1337)
- ✅ Modèle Produit (nom, description, prix, image)
- ✅ API REST publique
- ✅ Upload d'images
- ✅ CORS configuré pour Next.js

## Adding components

To add components to your app, run the following command at the root of your `web` app:

```bash
pnpm dlx shadcn@latest add button -c apps/web
```

This will place the ui components in the `packages/ui/src/components` directory.

## Tailwind

Your `tailwind.config.ts` and `globals.css` are already set up to use the components from the `ui` package.

## Using components

To use the components in your app, import them from the `ui` package.

```tsx
import { Button } from "@workspace/ui/components/button"
```
