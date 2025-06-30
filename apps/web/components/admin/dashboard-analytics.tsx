'use client'

import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  ShoppingCart, 
  DollarSign, 
  Star,
  Clock,
  Download
} from 'lucide-react';
import { 
  useAnalyticsDashboard, 
  useSatisfaction,
  usePrevisions,
  useExportDonnees
} from '@/hooks/useAnalytics';

// Composant pour afficher une métrique avec tendance
const MetriqueCard = ({ 
  titre, 
  valeur, 
  tendance, 
  icon: Icon, 
  format = 'number' 
}: {
  titre: string;
  valeur: number;
  tendance?: number;
  icon: any;
  format?: 'number' | 'currency' | 'percentage';
}) => {
  const formatValue = (val: number) => {
    switch (format) {
      case 'currency':
        return `${val.toFixed(2)} €`;
      case 'percentage':
        return `${val.toFixed(1)} %`;
      default:
        return val.toLocaleString();
    }
  };

  const getTendanceColor = (tend?: number) => {
    if (!tend) return 'text-gray-500';
    return tend > 0 ? 'text-green-600' : 'text-red-600';
  };

  const getTendanceIcon = (tend?: number) => {
    if (!tend) return null;
    return tend > 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />;
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-600">{titre}</h3>
        <Icon className="h-5 w-5 text-gray-400" />
      </div>
      <div className="text-2xl font-bold text-gray-900">{formatValue(valeur)}</div>
      {tendance !== undefined && (
        <div className={`flex items-center text-xs mt-1 ${getTendanceColor(tendance)}`}>
          {getTendanceIcon(tendance)}
          <span className="ml-1">
            {tendance > 0 ? '+' : ''}{tendance.toFixed(1)}% vs période précédente
          </span>
        </div>
      )}
    </div>
  );
};

// Composant principal du Dashboard Analytics
const DashboardAnalytics = () => {
  const [dateDebut, setDateDebut] = useState('');
  const [dateFin, setDateFin] = useState('');
  const [periode, setPeriode] = useState('jour');

  // Hooks pour les données
  const { data: dashboard, isLoading: dashboardLoading, error: dashboardError } = 
    useAnalyticsDashboard(dateDebut, dateFin, periode);
  
  const { data: satisfaction } = useSatisfaction(dateDebut, dateFin);
  const { data: previsions } = usePrevisions('ventes', 30);
  const { exportData, isExporting } = useExportDonnees();

  // Gestion de l'export
  const handleExport = async (format: 'excel' | 'pdf') => {
    const success = await exportData(format, 'ventes', dateDebut, dateFin);
    if (success) {
      alert(`Export ${format.toUpperCase()} réussi !`);
    }
  };

  if (dashboardLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Chargement du dashboard...</div>
        </div>
      </div>
    );
  }

  if (dashboardError) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-red-600">Erreur: {dashboardError}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* En-tête avec filtres */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics & Reporting</h1>
          <p className="text-gray-600 mt-1">
            Tableau de bord des performances de votre boulangerie
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <input
            type="date"
            value={dateDebut}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDateDebut(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="date"
            value={dateFin}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDateFin(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={periode}
            onChange={(e) => setPeriode(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="heure">Par heure</option>
            <option value="jour">Par jour</option>
            <option value="semaine">Par semaine</option>
            <option value="mois">Par mois</option>
          </select>
        </div>
      </div>

      {/* Métriques principales */}
      {dashboard && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <MetriqueCard
            titre="Chiffre d'Affaires"
            valeur={dashboard.statistiques.chiffreAffairesTotal}
            tendance={dashboard.tendances.chiffreAffaires.tendance}
            icon={DollarSign}
            format="currency"
          />
          <MetriqueCard
            titre="Commandes"
            valeur={dashboard.statistiques.totalCommandes}
            tendance={dashboard.tendances.commandes.tendance}
            icon={ShoppingCart}
          />
          <MetriqueCard
            titre="Panier Moyen"
            valeur={dashboard.statistiques.panierMoyen}
            tendance={dashboard.tendances.panierMoyen.tendance}
            icon={Users}
            format="currency"
          />
          <MetriqueCard
            titre="Taux de Confirmation"
            valeur={dashboard.statistiques.tauxConfirmation}
            icon={TrendingUp}
            format="percentage"
          />
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {/* Produits populaires */}
        {dashboard?.produitsPopulaires && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Produits les Plus Vendus</h2>
            <p className="text-sm text-gray-600 mb-4">Top 5 des produits sur la période</p>
            <div className="space-y-4">
              {dashboard.produitsPopulaires.slice(0, 5).map((produit, index) => (
                <div key={produit.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                  <div className="flex items-center space-x-3">
                    <span className="flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-medium text-gray-900">{produit.nom}</p>
                      <p className="text-sm text-gray-500">{produit.categorie}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{produit.quantite} unités</p>
                    <p className="text-sm text-gray-500">
                      {produit.chiffreAffaires.toFixed(2)} €
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Analyse des créneaux */}
        {dashboard?.analyseCreneaux && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Heures de Pointe</h2>
            <p className="text-sm text-gray-600 mb-4">Créneaux les plus demandés</p>
            <div className="space-y-3">
              {dashboard.analyseCreneaux.heuresPointe.map((creneau, index) => (
                <div key={creneau.heure} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                  <div className="flex items-center space-x-3">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="font-medium text-gray-900">{creneau.heure}</span>
                  </div>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                    {creneau.commandes} commandes
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Satisfaction client */}
      {satisfaction && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Satisfaction Client</h2>
          <p className="text-sm text-gray-600 mb-4">Évaluations et recommandations</p>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="flex items-center space-x-3">
              <Star className="h-8 w-8 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{satisfaction.noteMoyenne}/5</p>
                <p className="text-sm text-gray-500">Note moyenne</p>
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{satisfaction.tauxRecommandation}%</p>
              <p className="text-sm text-gray-500">Taux de recommandation</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{satisfaction.totalEvaluations}</p>
              <p className="text-sm text-gray-500">Évaluations totales</p>
            </div>
          </div>
        </div>
      )}

      {/* Prévisions */}
      {previsions && previsions.previsions && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Prévisions</h2>
          <p className="text-sm text-gray-600 mb-4">Projection du chiffre d'affaires sur 30 jours</p>
          <div className="space-y-3">
            <div className="flex justify-between p-3 bg-gray-50 rounded-md">
              <span className="text-gray-600">Moyenne mobile (30j):</span>
              <span className="font-medium text-gray-900">{previsions.moyenneMobile.toFixed(2)} €/jour</span>
            </div>
            <div className="flex justify-between p-3 bg-gray-50 rounded-md">
              <span className="text-gray-600">Tendance:</span>
              <span className={`font-medium ${previsions.tendance > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {previsions.tendance > 0 ? '+' : ''}{previsions.tendance.toFixed(2)} €/jour
              </span>
            </div>
            <div className="flex justify-between p-3 bg-gray-50 rounded-md">
              <span className="text-gray-600">Projection 7 jours:</span>
              <span className="font-medium text-gray-900">
                {previsions.previsions.slice(0, 7).reduce((sum: number, p: any) => sum + p.valeur, 0).toFixed(2)} €
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Actions d'export */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Exports & Rapports</h2>
        <p className="text-sm text-gray-600 mb-4">Télécharger les données au format Excel ou PDF</p>
        <div className="flex space-x-4">
          <button 
            onClick={() => handleExport('excel')} 
            disabled={isExporting}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="h-4 w-4 mr-2" />
            Export Excel
          </button>
          <button 
            onClick={() => handleExport('pdf')} 
            disabled={isExporting}
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardAnalytics;
