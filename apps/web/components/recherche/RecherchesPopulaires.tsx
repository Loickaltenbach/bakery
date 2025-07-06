import React from 'react';
import { TrendingUp } from 'lucide-react';

interface RecherchesPopulairesProps {
  recherchesPopulaires: string[];
  selectionnerRecherchePopulaire: (terme: string) => void;
  recherche: string;
}

export function RecherchesPopulaires({ 
  recherchesPopulaires, 
  selectionnerRecherchePopulaire,
  recherche 
}: RecherchesPopulairesProps) {
  if (recherche) return null;

  return (
    <div className="text-center mb-8">
      <p className="text-gray-600 mb-4">Recherches populaires :</p>
      <div className="flex flex-wrap justify-center gap-2">
        {recherchesPopulaires.map((terme) => (
          <button
            key={terme}
            onClick={() => selectionnerRecherchePopulaire(terme)}
            className="px-4 py-2 bg-boulangerie-beige text-boulangerie-bordeaux rounded-full text-sm hover:bg-boulangerie-or hover:text-white transition-colors"
          >
            <TrendingUp className="w-3 h-3 inline mr-1" />
            {terme}
          </button>
        ))}
      </div>
    </div>
  );
}
