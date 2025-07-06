import React from 'react';
import { ChefHat } from 'lucide-react';

interface Categorie {
  id: string;
  nom: string;
  icon: any;
}

interface CategoriesFiltreProps {
  categories: Categorie[];
  categorieActive: string;
  setCategorieActive: (id: string) => void;
}

export function CategoriesFiltre({ categories, categorieActive, setCategorieActive }: CategoriesFiltreProps) {
  return (
    <div className="flex flex-wrap justify-center gap-3 mb-8">
      {categories.map((categorie) => (
        <button
          key={categorie.id}
          onClick={() => setCategorieActive(categorie.id)}
          className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all ${
            categorieActive === categorie.id
              ? "bg-boulangerie-bordeaux text-white shadow-lg"
              : "bg-white text-gray-600 hover:bg-boulangerie-beige border border-gray-200"
          }`}
        >
          {typeof categorie.icon === "string" ? (
            <span className="text-lg">{categorie.icon}</span>
          ) : categorie.icon === "ChefHat" ? (
            <ChefHat className="w-4 h-4" />
          ) : (
            <categorie.icon className="w-4 h-4" />
          )}
          {categorie.nom}
        </button>
      ))}
    </div>
  );
}
