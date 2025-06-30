# Analytics & Reporting - Système de Boulangerie

## Vue d'ensemble

Le module Analytics & Reporting fournit un tableau de bord complet pour analyser les performances de la boulangerie, incluant les ventes, la satisfaction client, les prévisions et les exports de données.

## Fonctionnalités Implémentées

### 🎯 Tableau de Bord Principal

Le dashboard analytics (`/admin/analytics`) offre une vue d'ensemble des performances :

#### Métriques Clés
- **Chiffre d'affaires** : journalier/mensuel avec tendances
- **Nombre de commandes** : total et évolution
- **Panier moyen** : valeur moyenne par commande
- **Taux de confirmation** : pourcentage de commandes confirmées

#### Analyses Avancées
- **Produits populaires** : top 5 des produits les plus vendus
- **Heures de pointe** : créneaux les plus demandés
- **Jours populaires** : répartition par jour de la semaine
- **Satisfaction client** : note moyenne et taux de recommandation

### 📊 API Analytics (Strapi)

#### Endpoints Disponibles

```
GET /api/analytics/dashboard
```
Tableau de bord complet avec toutes les métriques

**Paramètres :**
- `dateDebut` : Date de début (ISO string)
- `dateFin` : Date de fin (ISO string)  
- `periode` : Groupement ('heure', 'jour', 'semaine', 'mois')

**Réponse :**
```json
{
  "periode": { "debut": "2024-01-01", "fin": "2024-01-31" },
  "chiffreAffaires": [
    { "periode": "2024-01-01", "montant": 250.50 }
  ],
  "produitsPopulaires": [
    {
      "id": "1",
      "nom": "Croissant",
      "categorie": "Viennoiseries",
      "quantite": 45,
      "chiffreAffaires": 90.00
    }
  ],
  "analyseCreneaux": {
    "heuresPointe": [
      { "heure": "08:00", "commandes": 12 }
    ],
    "joursPopulaires": [
      { "jour": "samedi", "commandes": 35 }
    ]
  },
  "statistiques": {
    "totalCommandes": 128,
    "chiffreAffairesTotal": 3250.80,
    "panierMoyen": 25.40,
    "tauxConfirmation": 92.5
  },
  "tendances": {
    "chiffreAffaires": {
      "actuel": 3250.80,
      "precedent": 2980.50,
      "tendance": 9.1
    }
  },
  "satisfaction": {
    "noteMoyenne": 4.3,
    "tauxRecommandation": 87.5,
    "totalEvaluations": 24
  }
}
```

```
GET /api/analytics/chiffre-affaires
```
Analyse détaillée du chiffre d'affaires

```
GET /api/analytics/produits-populaires  
```
Top des produits les plus vendus

```
GET /api/analytics/creneaux
```
Analyse des créneaux de retrait

```
GET /api/analytics/satisfaction
```
Métriques de satisfaction client

```
GET /api/analytics/previsions
```
Prévisions basées sur l'historique

```
GET /api/analytics/export/:format
```
Export des données (excel/pdf) - *En cours d'implémentation*

### ⭐ Système d'Évaluation

#### Modèle Evaluation (Strapi)

```json
{
  "commande": "relation oneToOne vers Commande",
  "note": "integer (1-5)",
  "commentaire": "text optionnel",
  "criteres": {
    "qualite": 4,
    "service": 5,
    "delai": 3,
    "presentation": 4
  },
  "recommandation": "boolean",
  "dateEvaluation": "datetime"
}
```

#### API Évaluation

```
POST /api/evaluations
```
Créer une nouvelle évaluation

```
GET /api/evaluations/stats
```
Statistiques des évaluations sur une période

### 📈 Prévisions & Tendances

Le système génère des prévisions simples basées sur :
- **Moyenne mobile** des 30 derniers jours
- **Calcul de tendance** (évolution récente)
- **Projection** sur X jours avec niveau de confiance

#### Algorithme de Prévision

```javascript
// Moyenne mobile des 30 derniers jours
const moyenneMobile = historiqueVentes.slice(-30).reduce((sum, val) => sum + val, 0) / 30;

// Tendance (évolution récente vs période précédente)
const tendance = (periode_récente - periode_precedente) / 30;

// Projection avec confiance décroissante
for (let i = 1; i <= horizon; i++) {
  const valeurPrevue = moyenneMobile + (tendance * i);
  const confiance = Math.max(0.3, 1 - (i / horizon) * 0.7);
  
  previsions.push({
    date: dateFuture,
    valeur: Math.max(0, valeurPrevue),
    confiance
  });
}
```

## 🛠 Hooks React

### useAnalyticsDashboard
```typescript
const { data, isLoading, error } = useAnalyticsDashboard(dateDebut, dateFin, periode);
```

### useChiffreAffaires
```typescript
const { data, isLoading, error } = useChiffreAffaires(dateDebut, dateFin, groupBy);
```

### useSatisfaction
```typescript
const { data, isLoading, error } = useSatisfaction(dateDebut, dateFin);
```

### useEvaluation
```typescript
const { submitEvaluation, isSubmitting, error } = useEvaluation();

await submitEvaluation({
  commande: "commande_id",
  note: 4,
  commentaire: "Excellent service !",
  criteres: { qualite: 5, service: 4, delai: 4, presentation: 5 },
  recommandation: true
});
```

### useExportDonnees
```typescript
const { exportData, isExporting } = useExportDonnees();

const success = await exportData('excel', 'ventes', dateDebut, dateFin);
```

## 📱 Composants UI

### DashboardAnalytics
```typescript
import DashboardAnalytics from '@/components/admin/dashboard-analytics';

// Affiche le tableau de bord complet
<DashboardAnalytics />
```

### FormulaireEvaluation
```typescript
import FormulaireEvaluation from '@/components/evaluation/formulaire-evaluation';

<FormulaireEvaluation
  commandeId="123"
  onSuccess={() => console.log('Évaluation soumise')}
  onCancel={() => console.log('Annulé')}
/>
```

## 🚀 Déploiement et Configuration

### 1. Base de Données

Le modèle `evaluation` doit être créé dans Strapi. Le schéma est dans :
```
apps/strapi/src/api/evaluation/content-types/evaluation/schema.json
```

### 2. Routes Analytics

Les routes sont automatiquement créées par :
```
apps/strapi/src/api/analytics/routes/analytics.ts
```

### 3. Permissions Strapi

Configurer les permissions pour :
- `evaluation` : création publique, lecture admin
- `analytics` : lecture admin uniquement

### 4. Variables d'Environnement

```env
# Strapi
STRAPI_URL=http://localhost:1337

# Base de données
DATABASE_URL=postgresql://user:password@localhost:5432/boulangerie
```

## 🔧 Extensions Futures

### 1. Exports Excel/PDF Réels

Installer les dépendances :
```bash
npm install exceljs puppeteer
```

Implémenter dans `analytics.ts` :
```javascript
// Excel
const ExcelJS = require('exceljs');
const workbook = new ExcelJS.Workbook();
// ... génération Excel

// PDF  
const puppeteer = require('puppeteer');
const browser = await puppeteer.launch();
// ... génération PDF
```

### 2. Graphiques et Visualisations

Ajouter Chart.js ou Recharts :
```bash
npm install recharts
```

### 3. Notifications d'Alertes

Système d'alertes pour :
- Baisse significative des ventes
- Stock critique détecté
- Satisfaction client en baisse

### 4. Analyses Avancées

- **Analyse de cohort** (fidélisation client)
- **Saisonnalité** (détection automatique des patterns)
- **Prévisions ML** (avec TensorFlow.js)
- **A/B Testing** (test de stratégies marketing)

## 📊 Métriques de Performance

### Indicateurs Suivis

1. **Ventes**
   - CA journalier/mensuel
   - Évolution vs période précédente
   - Panier moyen

2. **Produits**
   - Top vendeurs
   - Rotation des stocks
   - Marge par catégorie

3. **Opérations**
   - Créneaux populaires
   - Temps de préparation moyen
   - Taux d'annulation

4. **Satisfaction**
   - Note moyenne
   - Taux de recommandation
   - Feedback détaillé

### Alertes Automatiques

- Stock en rupture
- Baisse de CA > 20%
- Satisfaction < 3/5
- Commandes en retard

## 🧪 Tests et Validation

### Test des APIs

```bash
# Dashboard
curl "http://localhost:1337/api/analytics/dashboard?periode=jour"

# Satisfaction
curl "http://localhost:1337/api/analytics/satisfaction"

# Créer évaluation
curl -X POST "http://localhost:1337/api/evaluations" \
  -H "Content-Type: application/json" \
  -d '{"data":{"commande":"1","note":5,"commentaire":"Parfait!"}}'
```

### Test des Hooks

```typescript
// Test d'intégration dans un composant de test
const TestComponent = () => {
  const { data, isLoading } = useAnalyticsDashboard();
  
  if (isLoading) return <div>Loading...</div>;
  return <pre>{JSON.stringify(data, null, 2)}</pre>;
};
```

## 📝 Conclusion

Le système Analytics & Reporting fournit une base solide pour l'analyse des performances de la boulangerie. Il peut être étendu avec des fonctionnalités plus avancées selon les besoins spécifiques de l'entreprise.

Les prochaines étapes recommandées :
1. Implémenter les exports Excel/PDF réels
2. Ajouter des graphiques interactifs
3. Développer un système de notifications
4. Intégrer des analyses prédictives plus sophistiquées
