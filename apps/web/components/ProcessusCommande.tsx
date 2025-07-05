'use client';

import React from 'react';
import { useCommande } from '../contexts/CommandeContext';
import { EtapeCommande } from '../lib/commande-types';
import { CreneauStep } from './commande/CreneauStep';
import { InformationsClientStep } from './commande/InformationsClientStep';
import { RecapitulatifStep } from './commande/RecapitulatifStep';
import { PaiementStep } from './paiement/PaiementStep';
import { ConfirmationStep } from './commande/ConfirmationStep';
import { ProgressIndicator } from './commande/ProgressIndicator';
import { NavigationButtons } from './commande/NavigationButtons';

interface ProcessusCommandeProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProcessusCommande: React.FC<ProcessusCommandeProps> = ({ isOpen, onClose }) => {
  const { processus } = useCommande();

  if (!isOpen) return null;

  const renderEtapeActuelle = () => {
    switch (processus.etapeActuelle) {
      case EtapeCommande.CRENEAU:
        return <CreneauStep />;
      case EtapeCommande.INFORMATIONS_CLIENT:
        return <InformationsClientStep />;
      case EtapeCommande.RECAPITULATIF:
        return <RecapitulatifStep />;
      case EtapeCommande.PAIEMENT:
        return <PaiementStep />;
      case EtapeCommande.CONFIRMATION:
        return <ConfirmationStep onClose={onClose} />;
      default:
        return <CreneauStep />;
    }
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-boulangerie-bordeaux-light bg-opacity-60 z-40 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-4 md:inset-8 lg:inset-16 bg-boulangerie-cream z-50 shadow-elevation rounded-2xl border-4 border-boulangerie-or overflow-hidden">
        <div className="flex flex-col h-full">
          {/* Header avec indicateur de progression */}
          <div className="bg-boulangerie-or p-6 relative">
            <div className="absolute inset-0 bg-pattern-alsacien opacity-20"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-artisan font-bold text-white">
                  Finaliser ma commande
                </h2>
                <button
                  onClick={onClose}
                  className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Indicateur de progression */}
              <ProgressIndicator />
            </div>
          </div>

          {/* Contenu de l'étape */}
          <div className="flex-1 overflow-y-auto p-6">
            {renderEtapeActuelle()}
          </div>

          {/* Navigation */}
          {processus.etapeActuelle !== EtapeCommande.CONFIRMATION && 
           processus.etapeActuelle !== EtapeCommande.PAIEMENT && (
            <div className="border-t-2 border-boulangerie-or bg-boulangerie-beige p-6">
              <NavigationButtons onClose={onClose} />
            </div>
          )}
        </div>
      </div>
    </>
  );
};
