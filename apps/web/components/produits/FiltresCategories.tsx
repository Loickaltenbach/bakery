import React from "react"
import { type Categorie } from "@/lib/boulangerie-api"

interface FiltresCategoriesProps {
  categories: Categorie[]
  categorieActive: string
  onCategorieChange: (categorieId: string) => void
}

export function FiltresCategories({ categories, categorieActive, onCategorieChange }: FiltresCategoriesProps) {
  return (
    <div className="flex flex-wrap justify-center gap-3">
      {categories.map((categorie) => (
        <button
          key={categorie.id}
          onClick={() => onCategorieChange(categorie.id)}
          className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all ${
            categorieActive === categorie.id
              ? "bg-boulangerie-bordeaux text-white shadow-lg"
              : "bg-white text-gray-600 hover:bg-boulangerie-beige border border-gray-200"
          }`}
        >
          <span className="text-lg">{categorie.icon}</span>
          {categorie.nom}
        </button>
      ))}
    </div>
  )
}
