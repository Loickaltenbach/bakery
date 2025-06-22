'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@workspace/ui/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { 
  Package, 
  AlertTriangle, 
  Plus, 
  Minus, 
  RefreshCw,
  Search,
  Filter,
  TrendingDown,
  TrendingUp,
  Warehouse
} from 'lucide-react';
import { 
  obtenirGestionStocks, 
  mettreAJourStock,
  obtenirCouleurStock
} from '@/lib/admin-utils';
import { GestionStock } from '@/lib/auth-types';
import { formatCurrency, formatDateTime } from '@/lib/format-utils';

export default function GestionStocks() {
  const [stocks, setStocks] = useState<GestionStock[]>([]);
  const [stocksFiltered, setStocksFiltered] = useState<GestionStock[]>([]);
  const [recherche, setRecherche] = useState<string>('');
  const [filtrageStatut, setFiltrageStatut] = useState<string>('tous');
  const [chargement, setChargement] = useState<boolean>(false);
  const [stockEnEdition, setStockEnEdition] = useState<string | null>(null);
  const [nouvelleQuantite, setNouvelleQuantite] = useState<number>(0);

  // Charger les stocks
  useEffect(() => {
    chargerStocks();
  }, []);

  // Filtrage et recherche
  useEffect(() => {
    let stocksFiltres = [...stocks];

    // Filtrage par statut
    if (filtrageStatut === 'rupture') {
      stocksFiltres = stocksFiltres.filter(stock => stock.enRupture);
    } else if (filtrageStatut === 'faible') {
      stocksFiltres = stocksFiltres.filter(stock => 
        !stock.enRupture && stock.quantiteDisponible <= stock.quantiteMinimum
      );
    } else if (filtrageStatut === 'normal') {
      stocksFiltres = stocksFiltres.filter(stock => 
        !stock.enRupture && stock.quantiteDisponible > stock.quantiteMinimum
      );
    }

    // Recherche par nom de produit
    if (recherche.trim()) {
      const termesRecherche = recherche.toLowerCase().trim();
      stocksFiltres = stocksFiltres.filter(stock =>
        stock.nom.toLowerCase().includes(termesRecherche)
      );
    }

    setStocksFiltered(stocksFiltres);
  }, [stocks, filtrageStatut, recherche]);

  const chargerStocks = () => {
    setChargement(true);
    try {
      const nouveauxStocks = obtenirGestionStocks();
      setStocks(nouveauxStocks);
    } catch (error) {
      console.error('Erreur lors du chargement des stocks:', error);
    } finally {
      setChargement(false);
    }
  };

  const modifierStock = (stockId: string, quantite: number) => {
    try {
      const success = mettreAJourStock(stockId, quantite, 'admin-user-id');
      if (success) {
        chargerStocks(); // Recharger les stocks
        setStockEnEdition(null);
      }
    } catch (error) {
      console.error('Erreur lors de la modification du stock:', error);
    }
  };

  const commencerEdition = (stock: GestionStock) => {
    setStockEnEdition(stock.produitId);
    setNouvelleQuantite(stock.quantiteDisponible);
  };

  const annulerEdition = () => {
    setStockEnEdition(null);
    setNouvelleQuantite(0);
  };

  const confirmerModification = () => {
    if (stockEnEdition && nouvelleQuantite >= 0) {
      modifierStock(stockEnEdition, nouvelleQuantite);
    }
  };

  const getStatutStock = (stock: GestionStock) => {
    if (stock.enRupture) {
      return { label: 'Rupture', variant: 'destructive', icon: AlertTriangle };
    } else if (stock.quantiteDisponible <= stock.quantiteMinimum) {
      return { label: 'Stock faible', variant: 'warning', icon: TrendingDown };
    } else {
      return { label: 'Stock normal', variant: 'success', icon: TrendingUp };
    }
  };

  const getVariantClass = (variant: string) => {
    switch (variant) {
      case 'destructive':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'warning':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'success':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Statistiques
  const stats = {
    total: stocks.length,
    enRupture: stocks.filter(s => s.enRupture).length,
    stockFaible: stocks.filter(s => !s.enRupture && s.quantiteDisponible <= s.quantiteMinimum).length,
    normal: stocks.filter(s => !s.enRupture && s.quantiteDisponible > s.quantiteMinimum).length
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Gestion des Stocks</h2>
          <p className="text-gray-600">
            Suivi et gestion des niveaux de stock en temps réel
          </p>
        </div>
        <Button onClick={chargerStocks} disabled={chargement}>
          <RefreshCw className={`h-4 w-4 mr-2 ${chargement ? 'animate-spin' : ''}`} />
          Actualiser
        </Button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Warehouse className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total produits</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-sm text-gray-600">En rupture</p>
                <p className="text-2xl font-bold text-red-600">{stats.enRupture}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingDown className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">Stock faible</p>
                <p className="text-2xl font-bold text-orange-600">{stats.stockFaible}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Stock normal</p>
                <p className="text-2xl font-bold text-green-600">{stats.normal}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres et recherche */}
      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par nom de produit..."
              value={recherche}
              onChange={(e) => setRecherche(e.target.value)}
              className="pl-9 w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <select
            value={filtrageStatut}
            onChange={(e) => setFiltrageStatut(e.target.value)}
            className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="tous">Tous les produits</option>
            <option value="rupture">En rupture</option>
            <option value="faible">Stock faible</option>
            <option value="normal">Stock normal</option>
          </select>
        </div>
      </div>

      {/* Liste des stocks */}
      <div className="grid gap-4">
        {stocksFiltered.map((stock) => {
          const statut = getStatutStock(stock);
          const StatutIcon = statut.icon;
          
          return (
            <Card key={stock.produitId} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Package className="h-8 w-8 text-gray-400" />
                    <div>
                      <h3 className="font-semibold text-lg">{stock.nom}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getVariantClass(statut.variant)}`}>
                          <StatutIcon className="h-3 w-3 mr-1" />
                          {statut.label}
                        </span>
                        <span className="text-sm text-gray-600">
                          Dernière modification: {formatDateTime(stock.dateDerniereModification)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6">
                    {/* Quantités */}
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Disponible</p>
                      <p className="text-2xl font-bold">{stock.quantiteDisponible}</p>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Minimum</p>
                      <p className="text-lg">{stock.quantiteMinimum}</p>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Maximum</p>
                      <p className="text-lg">{stock.quantiteMaximum}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2">
                      {stockEnEdition === stock.produitId ? (
                        <div className="flex items-center space-x-2">
                          <input
                            type="number"
                            min="0"
                            value={nouvelleQuantite}
                            onChange={(e) => setNouvelleQuantite(parseInt(e.target.value) || 0)}
                            className="w-20 p-1 border border-gray-300 rounded text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          <Button
                            size="sm"
                            onClick={confirmerModification}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            ✓
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={annulerEdition}
                          >
                            ✕
                          </Button>
                        </div>
                      ) : (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => modifierStock(stock.produitId, stock.quantiteDisponible - 1)}
                            disabled={stock.quantiteDisponible <= 0}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => commencerEdition(stock)}
                          >
                            Modifier
                          </Button>
                          
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => modifierStock(stock.produitId, stock.quantiteDisponible + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Barre de progression du stock */}
                <div className="mt-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Niveau de stock</span>
                    <span>{stock.quantiteDisponible} / {stock.quantiteMaximum}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        stock.enRupture 
                          ? 'bg-red-500' 
                          : stock.quantiteDisponible <= stock.quantiteMinimum 
                            ? 'bg-orange-500' 
                            : 'bg-green-500'
                      }`}
                      style={{ 
                        width: `${Math.min((stock.quantiteDisponible / stock.quantiteMaximum) * 100, 100)}%` 
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {stocksFiltered.length === 0 && !chargement && (
          <Card>
            <CardContent className="p-12 text-center">
              <Package className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold mb-2">Aucun produit trouvé</h3>
              <p className="text-gray-600">
                {recherche.trim() || filtrageStatut !== 'tous' 
                  ? 'Aucun produit ne correspond à vos critères de recherche.' 
                  : 'Il n\'y a actuellement aucun produit en stock.'}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
