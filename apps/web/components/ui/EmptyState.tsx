import React from 'react';
import { Button } from "@workspace/ui/components/button";

interface EmptyStateProps {
  selectedCategoryId: number | null;
  onClearSelection: () => void;
}

export function EmptyState({ selectedCategoryId, onClearSelection }: EmptyStateProps) {
  return (
    <div className="text-center py-16">
      <div className="bg-boulangerie-beige rounded-2xl p-12 shadow-or border border-boulangerie-or-light">
        <div className="text-6xl mb-6">🥖</div>
        <p className="text-xl text-boulangerie-bordeaux font-alsacien font-semibold mb-6">
          {selectedCategoryId !== null 
            ? "Aucun produit disponible dans cette catégorie pour le moment"
            : "Aucun produit disponible pour le moment"
          }
        </p>
        {selectedCategoryId !== null && (
          <Button 
            onClick={onClearSelection}
            className="btn-boulangerie-primary font-medium px-8 py-3 text-lg"
          >
            Voir tous nos produits
          </Button>
        )}
      </div>
    </div>
  );
}
