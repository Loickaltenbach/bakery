'use client';

import React, { useState, useEffect } from 'react';
import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { 
  Search, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Eye,
  RefreshCw,
  Phone,
  Mail,
  Package,
  Filter
} from 'lucide-react';
import { 
  obtenirCommandesEnGestion, 
  mettreAJourStatutCommande,
  assignerCommande,
  obtenirCouleurPriorite
} from '@/lib/admin-utils';
import { StatutCommande } from '@/lib/commande-types';
import { GestionCommande, PrioriteCommande } from '@/lib/auth-types';
import { formatDate, formatTime, formatCurrency } from '@/lib/format-utils';

const getStatutBadgeVariant = (statut: StatutCommande) => {
  switch (statut) {
    case StatutCommande.CONFIRMATION:
      return 'default';
    case StatutCommande.PREPARATION:
      return 'secondary';
    case StatutCommande.PRETE:
      return 'secondary';
    case StatutCommande.TERMINEE:
      return 'default';
    case StatutCommande.ANNULEE:
      return 'destructive';
    default:
      return 'default';
  }
};

const getStatutIcon = (statut: StatutCommande) => {
  switch (statut) {
    case StatutCommande.CONFIRMATION:
      return <Clock className="h-4 w-4" />;
    case StatutCommande.PREPARATION:
      return <Package className="h-4 w-4" />;
    case StatutCommande.PRETE:
      return <CheckCircle className="h-4 w-4" />;
    case StatutCommande.TERMINEE:
      return <CheckCircle className="h-4 w-4" />;
    case StatutCommande.ANNULEE:
      return <XCircle className="h-4 w-4" />;
    default:
      return <Clock className="h-4 w-4" />;
  }
};

const getPrioriteBadgeVariant = (priorite: PrioriteCommande) => {
  switch (priorite) {
    case PrioriteCommande.RETARD:
      return 'destructive';
    case PrioriteCommande.URGENTE:
      return 'secondary';
    case PrioriteCommande.NORMALE:
      return 'outline';
    default:
      return 'outline';
  }
};

export default function GestionCommandes() {
  const [commandes, setCommandes] = useState<GestionCommande[]>([]);
  const [commandesFiltered, setCommandesFiltered] = useState<GestionCommande[]>([]);
  const [commandeSelectionnee, setCommandeSelectionnee] = useState<GestionCommande | null>(null);
  const [filtrageStatut, setFiltrageStatut] = useState<string>('toutes');
  const [recherche, setRecherche] = useState<string>('');
  const [chargement, setChargement] = useState<boolean>(false);
  const [afficherDetails, setAfficherDetails] = useState<boolean>(false);

  // Charger les commandes
  useEffect(() => {
    chargerCommandes();
  }, []);

  // Filtrage et recherche
  useEffect(() => {
    let commandesFiltrees = [...commandes];

    // Filtrage par statut
    if (filtrageStatut !== 'toutes') {
      commandesFiltrees = commandesFiltrees.filter(
        commande => commande.statut === filtrageStatut
      );
    }

    // Recherche par numéro, nom client, email
    if (recherche.trim()) {
      const termesRecherche = recherche.toLowerCase().trim();
      commandesFiltrees = commandesFiltrees.filter(commande =>
        commande.numeroCommande.toLowerCase().includes(termesRecherche) ||
        commande.client.nom.toLowerCase().includes(termesRecherche) ||
        commande.client.prenom.toLowerCase().includes(termesRecherche) ||
        commande.client.email.toLowerCase().includes(termesRecherche)
      );
    }

    // Tri par priorité puis par temps passé
    commandesFiltrees.sort((a, b) => {
      // D'abord par priorité
      const prioriteOrder = { 
        [PrioriteCommande.RETARD]: 3, 
        [PrioriteCommande.URGENTE]: 2, 
        [PrioriteCommande.NORMALE]: 1 
      };
      const prioriteDiff = (prioriteOrder[b.priorite] || 1) - (prioriteOrder[a.priorite] || 1);
      if (prioriteDiff !== 0) return prioriteDiff;

      // Puis par temps passé
      return b.tempsPassed - a.tempsPassed;
    });

    setCommandesFiltered(commandesFiltrees);
  }, [commandes, filtrageStatut, recherche]);

  const chargerCommandes = () => {
    setChargement(true);
    try {
      const nouvellesCommandes = obtenirCommandesEnGestion();
      setCommandes(nouvellesCommandes);
    } catch (error) {
      console.error('Erreur lors du chargement des commandes:', error);
    } finally {
      setChargement(false);
    }
  };

  const changerStatut = (commandeId: string, nouveauStatut: StatutCommande) => {
    try {
      const success = mettreAJourStatutCommande(commandeId, nouveauStatut);
      if (success) {
        chargerCommandes(); // Recharger les commandes
        if (commandeSelectionnee?.id === commandeId) {
          const commandeMiseAJour = commandes.find(c => c.id === commandeId);
          if (commandeMiseAJour) {
            setCommandeSelectionnee({
              ...commandeMiseAJour,
              statut: nouveauStatut
            });
          }
        }
      }
    } catch (error) {
      console.error('Erreur lors du changement de statut:', error);
    }
  };

  const attribuerCommande = (commandeId: string, employeId: string) => {
    try {
      const success = assignerCommande(commandeId, employeId);
      if (success) {
        chargerCommandes();
        if (commandeSelectionnee?.id === commandeId) {
          setCommandeSelectionnee({
            ...commandeSelectionnee,
            employeAssigne: employeId
          });
        }
      }
    } catch (error) {
      console.error('Erreur lors de l\'attribution:', error);
    }
  };

  const voirDetailsCommande = (commande: GestionCommande) => {
    setCommandeSelectionnee(commande);
    setAfficherDetails(true);
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Gestion des Commandes</h2>
          <p className="text-muted-foreground">
            Suivi et gestion des commandes en temps réel
          </p>
        </div>
        <Button onClick={chargerCommandes} disabled={chargement}>
          <RefreshCw className={`h-4 w-4 mr-2 ${chargement ? 'animate-spin' : ''}`} />
          Actualiser
        </Button>
      </div>

      {/* Filtres et recherche */}
      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par numéro, nom ou email..."
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
            <option value="toutes">Tous les statuts</option>
            <option value={StatutCommande.CONFIRMATION}>Confirmation</option>
            <option value={StatutCommande.PREPARATION}>En préparation</option>
            <option value={StatutCommande.PRETE}>Prête</option>
            <option value={StatutCommande.TERMINEE}>Terminée</option>
            <option value={StatutCommande.ANNULEE}>Annulée</option>
          </select>
        </div>
      </div>

      {/* Liste des commandes */}
      <div className="grid gap-4">
        {commandesFiltered.map((commande) => (
          <Card key={commande.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-semibold">{commande.numeroCommande}</h3>
                      <Badge variant={getStatutBadgeVariant(commande.statut)}>
                        <span className="flex items-center gap-1">
                          {getStatutIcon(commande.statut)}
                          {commande.statut.replace('_', ' ')}
                        </span>
                      </Badge>
                      <Badge variant={getPrioriteBadgeVariant(commande.priorite)}>
                        {commande.priorite}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      {commande.client.prenom} {commande.client.nom}
                    </p>
                    <p className="text-xs text-gray-500">
                      Temps écoulé: {commande.tempsPassed} min
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="font-semibold">{formatCurrency(commande.total)}</p>
                    <p className="text-sm text-gray-600">
                      Retrait: {formatTime(commande.creneauChoisi.debut)}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    {/* Actions rapides */}
                    {commande.statut === StatutCommande.CONFIRMATION && (
                      <Button
                        size="sm"
                        onClick={() => changerStatut(commande.id, StatutCommande.PREPARATION)}
                      >
                        Commencer
                      </Button>
                    )}
                    {commande.statut === StatutCommande.PREPARATION && (
                      <Button
                        size="sm"
                        onClick={() => changerStatut(commande.id, StatutCommande.PRETE)}
                      >
                        Marquer prête
                      </Button>
                    )}
                    {commande.statut === StatutCommande.PRETE && (
                      <Button
                        size="sm"
                        onClick={() => changerStatut(commande.id, StatutCommande.TERMINEE)}
                      >
                        Marquer retirée
                      </Button>
                    )}

                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => voirDetailsCommande(commande)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Détails
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {commandesFiltered.length === 0 && !chargement && (
          <Card>
            <CardContent className="p-12 text-center">
              <Package className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold mb-2">Aucune commande trouvée</h3>
              <p className="text-gray-600">
                {recherche.trim() || filtrageStatut !== 'toutes' 
                  ? 'Aucune commande ne correspond à vos critères de recherche.' 
                  : 'Il n\'y a actuellement aucune commande.'}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Modal de détails */}
      {afficherDetails && commandeSelectionnee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                Détails de la commande {commandeSelectionnee.numeroCommande}
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAfficherDetails(false)}
              >
                ✕
              </Button>
            </div>
            
            <div className="space-y-4">
              {/* Informations client */}
              <div>
                <h4 className="font-semibold mb-2">Informations client</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">Nom:</span>
                    <span>{commandeSelectionnee.client.prenom} {commandeSelectionnee.client.nom}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4" />
                    <span>{commandeSelectionnee.client.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4" />
                    <span>{commandeSelectionnee.client.telephone}</span>
                  </div>
                </div>
              </div>

              {/* Détails commande */}
              <div>
                <h4 className="font-semibold mb-2">Détails de la commande</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Date de retrait:</span>
                    <span>{formatDate(commandeSelectionnee.creneauChoisi.debut)} à {formatTime(commandeSelectionnee.creneauChoisi.debut)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Statut:</span>
                    <Badge variant={getStatutBadgeVariant(commandeSelectionnee.statut)}>
                      {commandeSelectionnee.statut.replace('_', ' ')}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Priorité:</span>
                    <Badge variant={getPrioriteBadgeVariant(commandeSelectionnee.priorite)}>
                      {commandeSelectionnee.priorite}
                    </Badge>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>Total:</span>
                    <span>{formatCurrency(commandeSelectionnee.total)}</span>
                  </div>
                </div>
              </div>

              {/* Produits */}
              <div>
                <h4 className="font-semibold mb-2">Produits commandés</h4>
                <div className="space-y-2">
                  {commandeSelectionnee.articles.map((item, index) => (
                    <div key={index} className="flex justify-between items-center text-sm">
                      <span>{item.produit.nom}</span>
                      <div className="flex items-center space-x-2">
                        <span>x{item.quantite}</span>
                        <span className="font-medium">{formatCurrency(item.sousTotal)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-2 pt-4 border-t">
                <select 
                  value={commandeSelectionnee.statut} 
                  onChange={(e) => changerStatut(commandeSelectionnee.id, e.target.value as StatutCommande)}
                  className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={StatutCommande.CONFIRMATION}>Confirmation</option>
                  <option value={StatutCommande.PREPARATION}>En préparation</option>
                  <option value={StatutCommande.PRETE}>Prête</option>
                  <option value={StatutCommande.TERMINEE}>Terminée</option>
                  <option value={StatutCommande.ANNULEE}>Annulée</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
