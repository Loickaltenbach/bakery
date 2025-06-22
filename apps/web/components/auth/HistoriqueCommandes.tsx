'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@workspace/ui/components/card';
import { Button } from '@workspace/ui/components/button';
import { useAuth } from '../../contexts/AuthContext';
import { CommandeUtilisateur } from '../../lib/auth-types';
import { StatutCommande } from '../../lib/commande-types';
import { formaterPrix } from '../../lib/panier-utils';
import { 
  ShoppingBag, 
  Calendar, 
  Clock, 
  Star, 
  ChevronDown, 
  ChevronUp,
  Filter,
  Search,
  Download
} from 'lucide-react';

export const HistoriqueCommandes: React.FC = () => {
  const { obtenirHistorique, utilisateurActuel } = useAuth();
  const [filtreStatut, setFiltreStatut] = useState<StatutCommande | 'TOUS'>('TOUS');
  const [recherche, setRecherche] = useState('');
  const [commandeDepliee, setCommandeDepliee] = useState<string | null>(null);
  const [periodeFiltre, setPeriodeFiltre] = useState<'30' | '90' | '365' | 'tous'>('tous');

  if (!utilisateurActuel) {
    return <div>Veuillez vous connecter pour voir votre historique</div>;
  }

  const historique = obtenirHistorique();

  // Filtrer les commandes
  const commandesFiltrees = historique.commandes.filter(commande => {
    const respecteStatut = filtreStatut === 'TOUS' || commande.statut === filtreStatut;
    const respecteRecherche = recherche === '' || 
      commande.numeroCommande.toLowerCase().includes(recherche.toLowerCase()) ||
      commande.articles.some(article => 
        article.produit.nom.toLowerCase().includes(recherche.toLowerCase())
      );
    
    let respectePeriode = true;
    if (periodeFiltre !== 'tous') {
      const maintenant = new Date();
      const joursLimite = parseInt(periodeFiltre);
      const dateLimite = new Date(maintenant.getTime() - joursLimite * 24 * 60 * 60 * 1000);
      respectePeriode = new Date(commande.dateCreation) >= dateLimite;
    }
    
    return respecteStatut && respecteRecherche && respectePeriode;
  });

  const obtenirCouleurStatut = (statut: StatutCommande): string => {
    switch (statut) {
      case StatutCommande.EN_ATTENTE:
        return 'bg-yellow-100 text-yellow-800';
      case StatutCommande.CONFIRMATION:
        return 'bg-blue-100 text-blue-800';
      case StatutCommande.PREPARATION:
        return 'bg-orange-100 text-orange-800';
      case StatutCommande.PRETE:
        return 'bg-green-100 text-green-800';
      case StatutCommande.TERMINEE:
        return 'bg-gray-100 text-gray-800';
      case StatutCommande.ANNULEE:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const obtenirLibelleStatut = (statut: StatutCommande): string => {
    switch (statut) {
      case StatutCommande.EN_ATTENTE:
        return 'En attente';
      case StatutCommande.CONFIRMATION:
        return 'Confirmée';
      case StatutCommande.PREPARATION:
        return 'En préparation';
      case StatutCommande.PRETE:
        return 'Prête';
      case StatutCommande.TERMINEE:
        return 'Terminée';
      case StatutCommande.ANNULEE:
        return 'Annulée';
      default:
        return statut;
    }
  };

  const toggleCommande = (commandeId: string) => {
    setCommandeDepliee(commandeDepliee === commandeId ? null : commandeId);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* En-tête avec statistiques */}
      <div className="bg-boulangerie-or p-6 rounded-2xl text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern-alsacien opacity-20"></div>
        <div className="relative z-10">
          <h1 className="text-2xl font-artisan font-bold mb-4">
            Historique des commandes
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white/20 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold">{historique.statistiques.nombreCommandesTotales}</div>
              <div className="text-sm opacity-80">Commandes totales</div>
            </div>
            <div className="bg-white/20 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold">{formaterPrix(historique.statistiques.montantTotalDepense)}</div>
              <div className="text-sm opacity-80">Montant total</div>
            </div>
            <div className="bg-white/20 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold">
                {historique.statistiques.commandeMoyenneParMois.toFixed(1)}
              </div>
              <div className="text-sm opacity-80">Commandes/mois</div>
            </div>
            <div className="bg-white/20 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold">
                {historique.statistiques.derniere_commande
                  ? historique.statistiques.derniere_commande.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })
                  : '-'
                }
              </div>
              <div className="text-sm opacity-80">Dernière commande</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filtres et recherche */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              {/* Recherche */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-boulangerie-bordeaux-light" />
                <input
                  type="text"
                  value={recherche}
                  onChange={(e) => setRecherche(e.target.value)}
                  placeholder="Rechercher par numéro ou produit..."
                  className="w-full pl-10 pr-4 py-2 border border-boulangerie-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-boulangerie-or"
                />
              </div>

              {/* Filtre par statut */}
              <select
                value={filtreStatut}
                onChange={(e) => setFiltreStatut(e.target.value as StatutCommande | 'TOUS')}
                className="px-4 py-2 border border-boulangerie-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-boulangerie-or"
              >
                <option value="TOUS">Tous les statuts</option>
                <option value={StatutCommande.EN_ATTENTE}>En attente</option>
                <option value={StatutCommande.CONFIRMATION}>Confirmées</option>
                <option value={StatutCommande.PREPARATION}>En préparation</option>
                <option value={StatutCommande.PRETE}>Prêtes</option>
                <option value={StatutCommande.TERMINEE}>Terminées</option>
                <option value={StatutCommande.ANNULEE}>Annulées</option>
              </select>

              {/* Filtre par période */}
              <select
                value={periodeFiltre}
                onChange={(e) => setPeriodeFiltre(e.target.value as '30' | '90' | '365' | 'tous')}
                className="px-4 py-2 border border-boulangerie-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-boulangerie-or"
              >
                <option value="tous">Toute la période</option>
                <option value="30">30 derniers jours</option>
                <option value="90">3 derniers mois</option>
                <option value="365">Dernière année</option>
              </select>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button className="btn-boulangerie-secondary">
                <Download className="w-4 h-4 mr-2" />
                Exporter
              </Button>
            </div>
          </div>
          
          <div className="mt-4 text-sm text-boulangerie-bordeaux-light">
            {commandesFiltrees.length} commande(s) trouvée(s)
          </div>
        </CardContent>
      </Card>

      {/* Liste des commandes */}
      <div className="space-y-4">
        {commandesFiltrees.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <ShoppingBag className="w-16 h-16 text-boulangerie-bordeaux-light mx-auto mb-4" />
              <h3 className="text-lg font-medium text-boulangerie-bordeaux mb-2">
                Aucune commande trouvée
              </h3>
              <p className="text-boulangerie-bordeaux-light">
                {recherche || filtreStatut !== 'TOUS' || periodeFiltre !== 'tous'
                  ? 'Aucune commande ne correspond à vos critères de recherche.'
                  : 'Vous n\'avez pas encore passé de commande.'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          commandesFiltrees.map((commande) => (
            <Card key={commande.id} className="overflow-hidden">
              <CardContent className="p-0">
                {/* En-tête de la commande */}
                <div 
                  className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => toggleCommande(commande.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-boulangerie-or/10 rounded-full flex items-center justify-center">
                        <ShoppingBag className="w-6 h-6 text-boulangerie-or" />
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-medium text-boulangerie-bordeaux">
                            #{commande.numeroCommande}
                          </h3>
                          <span className={`px-2 py-1 text-xs rounded-full ${obtenirCouleurStatut(commande.statut)}`}>
                            {obtenirLibelleStatut(commande.statut)}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-boulangerie-bordeaux-light">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(commande.dateCreation).toLocaleDateString('fr-FR', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric'
                            })}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {new Date(commande.creneauChoisi.debut).toLocaleTimeString('fr-FR', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                          <div>
                            {commande.articles.length} article(s)
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-lg font-bold text-boulangerie-bordeaux">
                          {formaterPrix(commande.total)}
                        </div>
                        {commande.evaluee && commande.noteEvaluation && (
                          <div className="flex items-center gap-1 justify-end">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className="text-sm text-boulangerie-bordeaux-light">
                              {commande.noteEvaluation}/5
                            </span>
                          </div>
                        )}
                      </div>
                      
                      {commandeDepliee === commande.id ? (
                        <ChevronUp className="w-5 h-5 text-boulangerie-bordeaux-light" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-boulangerie-bordeaux-light" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Détails de la commande (dépliables) */}
                {commandeDepliee === commande.id && (
                  <div className="border-t border-gray-100">
                    <div className="p-6 bg-gray-50">
                      {/* Articles commandés */}
                      <div className="mb-6">
                        <h4 className="font-medium text-boulangerie-bordeaux mb-3">
                          Articles commandés
                        </h4>
                        <div className="space-y-2">
                          {commande.articles.map((article, index) => (
                            <div key={index} className="flex items-center justify-between py-2 px-3 bg-white rounded-lg">
                              <div className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-boulangerie-or rounded-full"></div>
                                <span className="text-boulangerie-bordeaux">
                                  {article.produit.nom}
                                </span>
                                <span className="text-sm text-boulangerie-bordeaux-light">
                                  x{article.quantite}
                                </span>
                              </div>
                              <span className="text-boulangerie-bordeaux font-medium">
                                {formaterPrix(article.sousTotal)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Résumé financier */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium text-boulangerie-bordeaux mb-3">
                            Détails de la commande
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-boulangerie-bordeaux-light">Sous-total :</span>
                              <span className="text-boulangerie-bordeaux">{formaterPrix(commande.sousTotal)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-boulangerie-bordeaux-light">TVA :</span>
                              <span className="text-boulangerie-bordeaux">{formaterPrix(commande.taxes)}</span>
                            </div>
                            <div className="flex justify-between font-medium pt-2 border-t">
                              <span className="text-boulangerie-bordeaux">Total :</span>
                              <span className="text-boulangerie-bordeaux">{formaterPrix(commande.total)}</span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium text-boulangerie-bordeaux mb-3">
                            Informations de retrait
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div>
                              <span className="text-boulangerie-bordeaux-light">Mode :</span>
                              <span className="text-boulangerie-bordeaux ml-2">Retrait en magasin</span>
                            </div>
                            <div>
                              <span className="text-boulangerie-bordeaux-light">Date :</span>
                              <span className="text-boulangerie-bordeaux ml-2">
                                {new Date(commande.creneauChoisi.debut).toLocaleDateString('fr-FR', {
                                  weekday: 'long',
                                  day: 'numeric',
                                  month: 'long'
                                })}
                              </span>
                            </div>
                            <div>
                              <span className="text-boulangerie-bordeaux-light">Horaire :</span>
                              <span className="text-boulangerie-bordeaux ml-2">
                                {new Date(commande.creneauChoisi.debut).toLocaleTimeString('fr-FR', {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })} - {new Date(commande.creneauChoisi.fin).toLocaleTimeString('fr-FR', {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Actions sur la commande */}
                      <div className="mt-6 pt-4 border-t border-gray-200">
                        <div className="flex flex-wrap gap-2">
                          {commande.statut === StatutCommande.TERMINEE && !commande.evaluee && (
                            <Button className="btn-boulangerie-primary">
                              <Star className="w-4 h-4 mr-2" />
                              Évaluer la commande
                            </Button>
                          )}
                          <Button className="btn-boulangerie-secondary">
                            Recommander
                          </Button>
                          <Button className="btn-boulangerie-secondary">
                            Télécharger le reçu
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
