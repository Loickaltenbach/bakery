'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@workspace/ui/components/card';
import { Button } from '@workspace/ui/components/button';
import { useAuth, usePermissions } from '../../contexts/AuthContext';
import { 
  obtenirStatsTableauDeBord, 
  obtenirCommandesEnGestion, 
  obtenirGestionStocks,
  obtenirEvenementsRecents,
  formaterDuree
} from '../../lib/admin-utils';
import { formaterPrix } from '../../lib/panier-utils';
import { 
  TrendingUp, 
  TrendingDown, 
  ShoppingBag, 
  Users, 
  Euro, 
  Clock,
  Package,
  AlertTriangle,
  Activity,
  Calendar,
  Target,
  BarChart3
} from 'lucide-react';

export const TableauDeBordAdmin: React.FC = () => {
  const { utilisateurActuel } = useAuth();
  const { peutVoirAdmin } = usePermissions();
  const [stats, setStats] = useState(obtenirStatsTableauDeBord());
  const [commandesEnCours, setCommandesEnCours] = useState(obtenirCommandesEnGestion());
  const [stocks, setStocks] = useState(obtenirGestionStocks());
  const [evenements, setEvenements] = useState(obtenirEvenementsRecents(10));
  const [periodeSelectionnee, setPeriodeSelectionnee] = useState<'jour' | 'semaine' | 'mois'>('jour');

  // Actualiser les données périodiquement
  useEffect(() => {
    const interval = setInterval(() => {
      setCommandesEnCours(obtenirCommandesEnGestion());
      setStocks(obtenirGestionStocks());
      setEvenements(obtenirEvenementsRecents(10));
    }, 30000); // Actualiser toutes les 30 secondes

    return () => clearInterval(interval);
  }, []);

  if (!peutVoirAdmin()) {
    return (
      <div className="flex items-center justify-center h-96">
        <Card>
          <CardContent className="p-8 text-center">
            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-boulangerie-bordeaux mb-2">
              Accès non autorisé
            </h2>
            <p className="text-boulangerie-bordeaux-light">
              Vous n'avez pas les permissions nécessaires pour accéder à cette page.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const stocksEnAlerte = stocks.filter(s => s.enRupture || s.quantiteDisponible <= s.quantiteMinimum);
  const commandesUrgentes = commandesEnCours.filter(c => c.tempsPassed > 60 || c.priorite === 'URGENTE');

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* En-tête */}
      <div className="bg-boulangerie-or p-6 rounded-2xl text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern-alsacien opacity-20"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-artisan font-bold mb-2">
                Tableau de bord administrateur
              </h1>
              <p className="text-white/80">
                Bonjour {utilisateurActuel?.prenom}, voici l'état de votre boulangerie
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="text-right text-sm">
                <div className="text-white/60">Dernière actualisation</div>
                <div className="font-medium">{new Date().toLocaleTimeString('fr-FR')}</div>
              </div>
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Alertes importantes */}
      {(commandesUrgentes.length > 0 || stocksEnAlerte.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {commandesUrgentes.length > 0 && (
            <Card className="border-l-4 border-l-red-500">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  <div>
                    <h3 className="font-medium text-red-800">
                      {commandesUrgentes.length} commande(s) urgente(s)
                    </h3>
                    <p className="text-sm text-red-600">
                      Nécessitent votre attention immédiate
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          {stocksEnAlerte.length > 0 && (
            <Card className="border-l-4 border-l-orange-500">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Package className="w-5 h-5 text-orange-500" />
                  <div>
                    <h3 className="font-medium text-orange-800">
                      {stocksEnAlerte.length} produit(s) en alerte
                    </h3>
                    <p className="text-sm text-orange-600">
                      Stock faible ou rupture
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Métriques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Commandes du jour */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-boulangerie-bordeaux-light mb-1">
                  Commandes aujourd'hui
                </p>
                <p className="text-2xl font-bold text-boulangerie-bordeaux">
                  {stats.ventesDuJour.nombreCommandes}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-600">+12%</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Chiffre d'affaires */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-boulangerie-bordeaux-light mb-1">
                  CA aujourd'hui
                </p>
                <p className="text-2xl font-bold text-boulangerie-bordeaux">
                  {formaterPrix(stats.ventesDuJour.chiffreAffaires)}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-600">+8%</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Euro className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Commandes en cours */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-boulangerie-bordeaux-light mb-1">
                  En préparation
                </p>
                <p className="text-2xl font-bold text-boulangerie-bordeaux">
                  {commandesEnCours.length}
                </p>
                <p className="text-sm text-boulangerie-bordeaux-light mt-1">
                  {commandesUrgentes.length} urgente(s)
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Objectif mensuel */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-boulangerie-bordeaux-light mb-1">
                  Objectif mensuel
                </p>
                <p className="text-2xl font-bold text-boulangerie-bordeaux">
                  {stats.ventesDuMois.progression.toFixed(1)}%
                </p>
                <p className="text-sm text-boulangerie-bordeaux-light mt-1">
                  {formaterPrix(stats.ventesDuMois.objectifMensuel)} objectif
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Graphiques et données détaillées */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ventes de la semaine */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-artisan font-bold text-boulangerie-bordeaux">
                Ventes de la semaine
              </h3>
              <div className="flex items-center gap-1 text-sm">
                {stats.ventesDeLaSemaine.evolution > 0 ? (
                  <>
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-green-600">+{stats.ventesDeLaSemaine.evolution}%</span>
                  </>
                ) : (
                  <>
                    <TrendingDown className="w-4 h-4 text-red-500" />
                    <span className="text-red-600">{stats.ventesDeLaSemaine.evolution}%</span>
                  </>
                )}
              </div>
            </div>
            
            <div className="space-y-3">
              {stats.ventesDeLaSemaine.commandesParJour.map((jour, index) => (
                <div key={jour.jour} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-sm font-medium text-boulangerie-bordeaux w-8">
                      {jour.jour}
                    </div>
                    <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-32">
                      <div 
                        className="bg-boulangerie-or h-2 rounded-full transition-all"
                        style={{ 
                          width: `${(jour.nombre / Math.max(...stats.ventesDeLaSemaine.commandesParJour.map(j => j.nombre))) * 100}%` 
                        }}
                      />
                    </div>
                  </div>
                  <div className="text-right text-sm">
                    <div className="font-medium text-boulangerie-bordeaux">{jour.nombre}</div>
                    <div className="text-boulangerie-bordeaux-light">{formaterPrix(jour.ca)}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Produits populaires */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-artisan font-bold text-boulangerie-bordeaux mb-4">
              Produits populaires
            </h3>
            
            <div className="space-y-3">
              {stats.produitsPopulaires.map((produit, index) => (
                <div key={produit.nom} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-boulangerie-or/10 rounded-full flex items-center justify-center text-sm font-medium text-boulangerie-or">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium text-boulangerie-bordeaux">{produit.nom}</div>
                      <div className="text-sm text-boulangerie-bordeaux-light">
                        {produit.quantiteVendue} vendus
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-boulangerie-bordeaux">
                      {formaterPrix(produit.chiffreAffaires)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Commandes en cours et événements récents */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Commandes en cours */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-artisan font-bold text-boulangerie-bordeaux">
                  Commandes en cours
                </h3>
                <Button className="btn-boulangerie-secondary text-sm">
                  Voir toutes
                </Button>
              </div>
              
              {commandesEnCours.length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="w-12 h-12 text-boulangerie-bordeaux-light mx-auto mb-2" />
                  <p className="text-boulangerie-bordeaux-light">Aucune commande en cours</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {commandesEnCours.slice(0, 5).map((commande) => (
                    <div key={commande.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${
                          commande.tempsPassed > 60 ? 'bg-red-500' :
                          commande.tempsPassed > 30 ? 'bg-orange-500' : 'bg-green-500'
                        }`} />
                        <div>
                          <div className="font-medium text-boulangerie-bordeaux">
                            #{commande.numeroCommande}
                          </div>
                          <div className="text-sm text-boulangerie-bordeaux-light">
                            {commande.client.prenom} {commande.client.nom}
                          </div>
                        </div>
                      </div>
                      <div className="text-right text-sm">
                        <div className="font-medium text-boulangerie-bordeaux">
                          {formaterPrix(commande.total)}
                        </div>
                        <div className="text-boulangerie-bordeaux-light">
                          {formaterDuree(commande.tempsPassed)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Événements récents */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-artisan font-bold text-boulangerie-bordeaux mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Activité récente
            </h3>
            
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {evenements.map((evenement, index) => (
                <div key={index} className="flex items-start gap-3 text-sm">
                  <div className="w-2 h-2 bg-boulangerie-or rounded-full mt-2 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="text-boulangerie-bordeaux">
                      {evenement.type === 'NOUVELLE_COMMANDE' && 'Nouvelle commande reçue'}
                      {evenement.type === 'COMMANDE_CONFIRMEE' && 'Commande confirmée'}
                      {evenement.type === 'STOCK_MODIFIE' && 'Stock modifié'}
                      {evenement.type === 'COMMANDE_PRETE' && 'Commande prête'}
                    </div>
                    <div className="text-boulangerie-bordeaux-light">
                      {evenement.timestamp.toLocaleTimeString('fr-FR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions rapides */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-artisan font-bold text-boulangerie-bordeaux mb-4">
            Actions rapides
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button className="btn-boulangerie-primary h-auto py-4 flex-col gap-2">
              <ShoppingBag className="w-6 h-6" />
              <span>Gestion commandes</span>
            </Button>
            
            <Button className="btn-boulangerie-secondary h-auto py-4 flex-col gap-2">
              <Package className="w-6 h-6" />
              <span>Gestion stocks</span>
            </Button>
            
            <Button className="btn-boulangerie-secondary h-auto py-4 flex-col gap-2">
              <BarChart3 className="w-6 h-6" />
              <span>Rapports</span>
            </Button>
            
            <Button className="btn-boulangerie-secondary h-auto py-4 flex-col gap-2">
              <Users className="w-6 h-6" />
              <span>Utilisateurs</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
