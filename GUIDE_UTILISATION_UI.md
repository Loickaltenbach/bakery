# Guide d'Utilisation - Interface Utilisateur Avancée

## 🚀 Démarrage de l'Application

### Prérequis
- Node.js 18+ installé
- pnpm installé (`npm install -g pnpm`)

### Commandes de démarrage
```bash
# Naviguer vers le projet
cd /Users/loickaltenbach/Desktop/boulangerie

# Installer les dépendances (si nécessaire)
pnpm install

# Démarrer en mode développement
pnpm dev

# Ou utiliser le script personnalisé
node start-dev.js
```

L'application sera accessible à l'adresse : `http://localhost:3000`

## 🎯 Fonctionnalités à Tester

### 1. Interface Responsive
- ✅ **Desktop** : Interface complète avec navigation horizontale
- ✅ **Tablette** : Adaptation des grilles et navigation optimisée  
- ✅ **Mobile** : Menu hamburger et interface tactile

**Comment tester :**
- Redimensionner la fenêtre du navigateur
- Utiliser les outils de développement (F12) pour simuler différents appareils
- Tester l'orientation portrait/paysage sur mobile

### 2. Mode Sombre/Clair
- ✅ **Sélecteur de thème** dans la barre de navigation (icône Soleil/Lune)
- ✅ **Options** : Clair, Sombre, Système
- ✅ **Persistance** : Le choix est sauvegardé automatiquement

**Comment tester :**
1. Cliquer sur l'icône de thème en haut à droite
2. Sélectionner différents modes
3. Recharger la page pour vérifier la persistance

### 3. Accessibilité Avancée
- ✅ **Bouton d'accessibilité** flottant (coin inférieur gauche)
- ✅ **Navigation clavier** : Tab, Enter, Espace, Échap
- ✅ **Contraste élevé** disponible
- ✅ **Tailles de police** ajustables

**Comment tester :**
1. Cliquer sur le bouton d'accessibilité (icône bleue en bas à gauche)
2. Tester les options : contraste élevé, tailles de police, animations réduites
3. Naviguer au clavier avec Tab
4. Utiliser un lecteur d'écran pour tester les labels ARIA

### 4. Animations et Transitions
- ✅ **Animations fluides** avec Framer Motion
- ✅ **Hover effects** sur les cartes et boutons
- ✅ **Transitions de page** fluides
- ✅ **Respect des préférences** d'animation réduites

**Comment tester :**
1. Survoler les éléments interactifs pour voir les effets
2. Faire défiler la page pour voir les animations d'apparition
3. Désactiver les animations dans le panneau d'accessibilité

### 5. Favoris et Liste de Souhaits
- ✅ **Page dédiée** : `/favoris`
- ✅ **Ajout/Suppression** via les icônes cœur
- ✅ **Filtres et tri** des favoris
- ✅ **Vues** grille et liste

**Comment tester :**
1. Aller sur la page d'accueil
2. Cliquer sur les icônes cœur des produits
3. Naviguer vers `/favoris` via la navigation
4. Tester les filtres et les vues

### 6. Commandes Rapides
- ✅ **Page dédiée** : `/commandes-rapides`
- ✅ **Sauvegarde** de paniers
- ✅ **Utilisation rapide** des commandes favorites
- ✅ **Gestion** (renommer, supprimer)

**Comment tester :**
1. Ajouter des produits au panier
2. Sauvegarder comme commande rapide
3. Aller sur `/commandes-rapides`
4. Utiliser une commande rapide

### 7. Recherche Avancée
- ✅ **Page dédiée** : `/recherche`
- ✅ **Filtres multiples** : catégorie, prix, favoris
- ✅ **Suggestions** basées sur l'historique
- ✅ **Tri** des résultats

**Comment tester :**
1. Aller sur `/recherche`
2. Utiliser la barre de recherche
3. Appliquer différents filtres
4. Tester les suggestions et l'historique

### 8. Mode Hors Ligne
- ✅ **Détection automatique** de l'état de connexion
- ✅ **Stockage local** des données
- ✅ **Synchronisation** au retour en ligne
- ✅ **Indicateurs visuels** d'état

**Comment tester :**
1. Couper la connexion internet
2. Observer l'indicateur "Hors ligne" dans la navigation
3. Effectuer des actions (favoris, panier)
4. Rétablir la connexion pour voir la synchronisation

## 🎨 Personnalisation et Thèmes

### Variables CSS Personnalisables
```css
:root {
  --boulangerie-gold: #eeb135;
  --boulangerie-marron: #8b4513;
  --boulangerie-cream: #faf7f2;
}
```

### Classes Utilitaires Disponibles
- `.high-contrast` : Mode contraste élevé
- `.reduced-motion` : Animations réduites
- `.font-large` / `.font-xl` : Tailles de police augmentées
- `.grid-auto-fit` : Grilles responsives avancées

## 📱 Fonctionnalités Mobile

### Navigation Mobile
- Menu hamburger accessible
- Boutons adaptatifs pleine largeur
- Interactions tactiles optimisées
- Viewport configuré pour PWA

### Responsive Design
- Breakpoints : 480px, 640px, 768px, 1024px
- Container queries pour les composants
- Aspect ratios optimisés
- Images adaptatives

## 🔧 Architecture Technique

### Contextes React Disponibles
1. **ThemeContext** : Gestion des thèmes
2. **FavorisContext** : Liste de souhaits
3. **CommandesRapidesContext** : Commandes sauvegardées
4. **OfflineContext** : Mode hors ligne
5. **PanierContext** : Gestion du panier
6. **AuthContext** : Authentification
7. **AccessibilityContext** : Options d'accessibilité

### Composants Réutilisables
- `AnimateOnView` : Animations au scroll
- `HoverCard` : Cartes avec effets hover
- `AnimatedButton` : Boutons avec animations
- `FocusTrap` : Gestion du focus pour modales
- `AccessibilityPanel` : Panneau d'options

## 🐛 Dépannage

### Problèmes Courants

**Les animations ne fonctionnent pas :**
- Vérifier si les animations réduites sont activées
- S'assurer que Framer Motion est installé : `pnpm add framer-motion`

**Le thème ne persiste pas :**
- Vérifier que localStorage est disponible
- S'assurer que les cookies ne sont pas bloqués

**La navigation au clavier ne fonctionne pas :**
- Vérifier que les éléments ont les bons attributs `tabindex`
- S'assurer que les `aria-label` sont présents

**Les favoris ne se sauvegardent pas :**
- Vérifier la console pour les erreurs localStorage
- S'assurer que le contexte FavorisProvider est bien intégré

### Performance

**Optimisations implémentées :**
- Lazy loading des composants
- Memoization avec React.memo
- Debounce sur les recherches
- Images optimisées avec aspect ratios

## 📊 Métriques de Qualité

### Accessibilité (WCAG)
- ✅ Niveau AA de contraste
- ✅ Navigation clavier complète
- ✅ Labels ARIA appropriés
- ✅ Support lecteurs d'écran

### Performance
- ✅ Optimisations React
- ✅ CSS critique inline
- ✅ Images lazy-loaded
- ✅ Bundle splitting

### SEO
- ✅ Meta tags appropriés
- ✅ Structure sémantique
- ✅ URLs clean
- ✅ Schema markup préparé

L'interface utilisateur avancée est maintenant prête pour la production avec toutes les fonctionnalités modernes attendues ! 🎉
