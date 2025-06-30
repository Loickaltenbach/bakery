'use client';

import React, { useState, useEffect } from 'react';
import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { 
  AlertTriangle, 
  Package, 
  TrendingDown, 
  TrendingUp, 
  RefreshCw 
} from 'lucide-react';
import { useStockManagement } from '@/hooks/useStrapi';

export function GestionStock() {
  const [alertes, setAlertes] = useState([]);
  const [loadingAlertes, setLoadingAlertes] = useState(true);
  const [stockUpdates, setStockUpdates] = useState<{ [key: string]: number }>({});

  const { updateStock, getAlertes, loading, error } = useStockManagement();

  const fetchAlertes = async () => {
    setLoadingAlertes(true);
    try {
      const alertesData = await getAlertes();
      setAlertes(alertesData);
    } catch (error) {
      console.error('Erreur lors du chargement des alertes:', error);
    } finally {
      setLoadingAlertes(false);
    }
  };

  useEffect(() => {
    fetchAlertes();
  }, []);

  const handleStockChange = (produitId: string, value: string) => {
    const numValue = parseInt(value) || 0;
    setStockUpdates(prev => ({
      ...prev,
      [produitId]: numValue
    }));
  };

  const handleUpdateStock = async (produitId: string, currentStock: number) => {
    const newStock = stockUpdates[produitId] ?? currentStock;
    
    try {
      const success = await updateStock(produitId, newStock);
      if (success) {
        // Refresh les alertes après mise à jour
        fetchAlertes();
        // Reset la valeur locale
        setStockUpdates(prev => {
          const newUpdates = { ...prev };
          delete newUpdates[produitId];
          return newUpdates;
        });
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
    }
  };

  const getBadgeVariant = (niveau: string) => {
    switch (niveau) {
      case 'critique': return 'destructive';
      case 'faible': return 'secondary';
      default: return 'outline';
    }
  };

  const getIconByNiveau = (niveau: string) => {
    switch (niveau) {
      case 'critique': return <AlertTriangle className="w-4 h-4" />;
      case 'faible': return <TrendingDown className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  if (loadingAlertes) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="w-8 h-8 animate-spin text-gray-400" />
            <span className="ml-2">Chargement des alertes stock...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Résumé des alertes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total alertes</p>
                <p className="text-2xl font-bold">{alertes.length}</p>
              </div>
              <Package className="w-8 h-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Stock critique</p>
                <p className="text-2xl font-bold text-red-600">
                  {alertes.filter((a: any) => a.niveau === 'critique').length}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Stock faible</p>
                <p className="text-2xl font-bold text-orange-600">
                  {alertes.filter((a: any) => a.niveau === 'faible').length}
                </p>
              </div>
              <TrendingDown className="w-8 h-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Liste des alertes */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Alertes de stock
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchAlertes}
            disabled={loadingAlertes}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loadingAlertes ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
        </CardHeader>
        <CardContent>
          {alertes.length === 0 ? (
            <div className="text-center py-8">
              <Package className="w-12 h-12 text-green-400 mx-auto mb-3" />
              <p className="text-gray-600">Aucune alerte de stock</p>
              <p className="text-sm text-gray-500">Tous les produits sont bien approvisionnés</p>
            </div>
          ) : (
            <div className="space-y-4">
              {alertes.map((alerte: any) => (
                <div 
                  key={alerte.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    {getIconByNiveau(alerte.niveau)}
                    <div>
                      <h4 className="font-medium">{alerte.nom}</h4>
                      <p className="text-sm text-gray-600">
                        Catégorie: {alerte.categorie}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge variant={getBadgeVariant(alerte.niveau)}>
                      {alerte.niveau}
                    </Badge>
                    
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        Stock: {alerte.stock} / min: {alerte.stockMinimum}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="0"
                        value={stockUpdates[alerte.id] ?? alerte.stock}
                        onChange={(e) => handleStockChange(alerte.id, e.target.value)}
                        className="w-20 px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-boulangerie-or"
                      />
                      <Button
                        size="sm"
                        onClick={() => handleUpdateStock(alerte.id, alerte.stock)}
                        disabled={loading}
                        className="min-w-[80px]"
                      >
                        {loading ? (
                          <RefreshCw className="w-3 h-3 animate-spin" />
                        ) : (
                          <>
                            <TrendingUp className="w-3 h-3 mr-1" />
                            MAJ
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
