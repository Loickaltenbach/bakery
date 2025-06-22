import React from 'react';
import { Categorie } from "../../lib/api";

interface ProduitsCounterProps {
  produitsCount: number;
  selectedCategoryId: number | null;
  categories: Categorie[];
}

export function ProduitsCounter({ produitsCount, selectedCategoryId, categories }: ProduitsCounterProps) {
  const selectedCategorie = categories.find(cat => cat.id === selectedCategoryId);

  return (
    <div className="mt-16 text-center">
      <div className="inline-block px-6 py-3 bg-boulangerie-beige rounded-full border border-boulangerie-or shadow-or">
        <p className="text-boulangerie-bordeaux font-alsacien font-medium">
          {produitsCount} produit{produitsCount > 1 ? 's' : ''} affiché{produitsCount > 1 ? 's' : ''}
          {selectedCategorie && (
            <span className="text-boulangerie-or-dark font-semibold"> • {selectedCategorie.nom}</span>
          )}
        </p>
      </div>
    </div>
  );
}
