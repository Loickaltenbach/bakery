'use client';

import React from 'react';
import { useCommande } from '../../contexts/CommandeContext';
import { EtapeCommande } from '../../lib/commande-types';
import { Check } from 'lucide-react';

const etapes = [
  { id: EtapeCommande.CRENEAU, nom: 'Créneau', description: 'Date et heure' },
  { id: EtapeCommande.INFORMATIONS_CLIENT, nom: 'Informations', description: 'Vos coordonnées' },
  { id: EtapeCommande.RECAPITULATIF, nom: 'Récapitulatif', description: 'Vérification' }
];

export const ProgressIndicator: React.FC = () => {
  const { processus } = useCommande();
  
  const getEtapeIndex = (etape: EtapeCommande): number => {
    return etapes.findIndex(e => e.id === etape);
  };
  
  const indexActuel = getEtapeIndex(processus.etapeActuelle);
  
  return (
    <div className="flex items-center justify-between">
      {etapes.map((etape, index) => {
        const estActuelle = etape.id === processus.etapeActuelle;
        const estTerminee = index < indexActuel;
        const estActive = estActuelle || estTerminee;
        
        return (
          <div key={etape.id} className="flex-1 flex items-center">
            {/* Cercle de l'étape */}
            <div className="flex flex-col items-center">
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300
                ${estTerminee 
                  ? 'bg-white text-boulangerie-or shadow-or' 
                  : estActuelle 
                    ? 'bg-white text-boulangerie-or shadow-or ring-4 ring-white/30' 
                    : 'bg-white/30 text-white'
                }
              `}>
                {estTerminee ? (
                  <Check className="w-5 h-5" />
                ) : (
                  index + 1
                )}
              </div>
              
              {/* Texte de l'étape */}
              <div className="mt-2 text-center min-w-0">
                <div className={`
                  text-sm font-medium
                  ${estActive ? 'text-white' : 'text-white/70'}
                `}>
                  {etape.nom}
                </div>
                <div className={`
                  text-xs mt-1 leading-tight
                  ${estActive ? 'text-white/90' : 'text-white/50'}
                `}>
                  {etape.description}
                </div>
              </div>
            </div>
            
            {/* Ligne de connexion */}
            {index < etapes.length - 1 && (
              <div className={`
                flex-1 h-1 mx-4 mt-5 rounded-full transition-all duration-300
                ${index < indexActuel ? 'bg-white' : 'bg-white/30'}
              `} />
            )}
          </div>
        );
      })}
    </div>
  );
};
