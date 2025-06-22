import React from 'react';
import { Categorie } from "../../lib/api";

interface CategorieHeaderProps {
  categorie: Categorie | null;
  produitsCount: number;
}

export function CategorieHeader({ categorie, produitsCount }: CategorieHeaderProps) {
  if (!categorie) return null;

  return (
    <div className="mb-8 text-center">
          <div className="inline-block p-6 bg-boulangerie-bordeaux-light rounded-2xl shadow-elevation">
        <h2 className="text-3xl font-artisan font-bold text-white mb-2">
          {categorie.nom}
        </h2>
        <p className="text-boulangerie-cream font-medium">
          {produitsCount} produit{produitsCount > 1 ? 's' : ''} dans cette catégorie
        </p>
      </div>
    </div>
  );
}
