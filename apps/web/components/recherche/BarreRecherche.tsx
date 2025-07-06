import React from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';

interface BarreRechercheProps {
  recherche: string;
  setRecherche: (value: string) => void;
  afficherFiltres: boolean;
  toggleFiltres: () => void;
}

export function BarreRecherche({ 
  recherche, 
  setRecherche, 
  afficherFiltres, 
  toggleFiltres 
}: BarreRechercheProps) {
  return (
    <div className="relative max-w-2xl mx-auto mb-8">
      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
      <input
        type="text"
        placeholder="Rechercher par nom, description ou ingrédient..."
        value={recherche}
        onChange={(e) => setRecherche(e.target.value)}
        className="w-full pl-12 pr-16 py-4 text-lg border border-gray-200 rounded-2xl focus:ring-2 focus:ring-boulangerie-or focus:border-transparent shadow-sm"
      />
      <button
        onClick={toggleFiltres}
        className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-2 rounded-lg transition-colors ${
          afficherFiltres 
            ? "bg-boulangerie-bordeaux text-white" 
            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
        }`}
      >
        <SlidersHorizontal className="w-5 h-5" />
      </button>
    </div>
  );
}
