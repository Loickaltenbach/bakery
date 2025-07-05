'use client';

import React from 'react';
import { Button } from '@workspace/ui/components/button';
import { useCommande } from '../../contexts/CommandeContext';
import { EtapeCommande } from '../../lib/commande-types';
import { ArrowLeft, ArrowRight, CreditCard } from 'lucide-react';

interface NavigationButtonsProps {
  onClose: () => void;
}

export const NavigationButtons: React.FC<NavigationButtonsProps> = ({ onClose }) => {
  const { 
    processus, 
    peutAvancer, 
    peutReculer, 
    etapeSuivante, 
    etapePrecedente,
    finaliserCommande
  } = useCommande();

  const handleSuivant = async () => {
    if (processus.etapeActuelle === EtapeCommande.PAIEMENT) {
      try {
        await finaliserCommande();
      } catch (error) {
        console.error('Erreur lors de la finalisation de la commande:', error);
      }
    } else {
      etapeSuivante();
    }
  };

  const getTexteBoutonSuivant = () => {
    switch (processus.etapeActuelle) {
      case EtapeCommande.CRENEAU:
        return 'Mes informations';
      case EtapeCommande.INFORMATIONS_CLIENT:
        return 'Récapitulatif';
      case EtapeCommande.RECAPITULATIF:
        return 'Paiement';
      case EtapeCommande.PAIEMENT:
        return 'Finaliser la commande';
      default:
        return 'Suivant';
    }
  };

  const getIconeBoutonSuivant = () => {
    if (processus.etapeActuelle === EtapeCommande.PAIEMENT) {
      return <CreditCard className="w-4 h-4 ml-2" />;
    }
    return <ArrowRight className="w-4 h-4 ml-2" />;
  };

  return (
    <div className="flex items-center justify-between">
      {/* Bouton Précédent */}
      <div className="flex gap-3">
        {peutReculer() && (
          <Button
            variant="secondary"
            onClick={etapePrecedente}
            className="bg-boulangerie-bordeaux-light text-white font-medium px-6 py-3"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Précédent
          </Button>
        )}
        
        <Button
          variant="secondary"
          onClick={onClose}
          className="bg-gray-500 text-white font-medium px-6 py-3"
        >
          Annuler
        </Button>
      </div>

      {/* Résumé des totaux */}
      <div className="text-center">
        <div className="text-sm text-boulangerie-bordeaux-light">
          Total de la commande
        </div>
        <div className="text-2xl font-bold text-boulangerie-or">
          {processus.totaux.total.toFixed(2)} €
        </div>
      </div>

      {/* Bouton Suivant */}
      <Button
        onClick={handleSuivant}
        disabled={!peutAvancer()}
        className={`
          font-medium px-6 py-3 min-w-[200px]
          ${processus.etapeActuelle === EtapeCommande.PAIEMENT 
            ? 'btn-boulangerie-primary text-lg' 
            : 'btn-boulangerie-primary'
          }
        `}
      >
        {getTexteBoutonSuivant()}
        {getIconeBoutonSuivant()}
      </Button>
    </div>
  );
};
