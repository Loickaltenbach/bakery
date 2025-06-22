'use client';

import React from 'react';
import { Button } from "@workspace/ui/components/button";
import { CategorieCard } from "./categorie-card";
import { Categorie } from "../lib/api";

interface CategorieFilterProps {
  categories: Categorie[];
  selectedCategoryId?: number | null;
  onCategorySelect: (categoryId: number | null) => void;
  produitsCountByCategory?: Record<number, number>;
}

export function CategorieFilter({ 
  categories, 
  selectedCategoryId, 
  onCategorySelect,
  produitsCountByCategory = {}
}: CategorieFilterProps) {
  return (
    <div className="mb-12">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-artisan font-bold text-boulangerie-bordeaux mb-3">
          Nos Spécialités
        </h2>
        <div className="w-32 h-1 bg-boulangerie-or mx-auto rounded-full"></div>
      </div>
      
      {/* Bouton "Tous les produits" */}
      <div className="flex justify-center mb-8">
        <Button
          onClick={() => onCategorySelect(null)}
          className={`px-8 py-3 rounded-full font-medium text-lg transition-all duration-300 ${
            selectedCategoryId === null 
              ? "btn-boulangerie-primary" 
              : "bg-boulangerie-beige text-boulangerie-bordeaux border-2 border-boulangerie-or hover:bg-boulangerie-or hover:text-white"
          }`}
        >
          Toutes nos spécialités
        </Button>
      </div>

      {/* Grille des catégories */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {categories.map((categorie) => (
          <CategorieCard
            key={categorie.id}
            categorie={categorie}
            produitsCount={produitsCountByCategory[categorie.id]}
            onClick={() => onCategorySelect(categorie.id)}
            isSelected={selectedCategoryId === categorie.id}
          />
        ))}
      </div>
    </div>
  );
}
