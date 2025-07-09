import React from 'react'
import { ShoppingCart, Heart } from 'lucide-react'
import { cn } from '@workspace/ui/lib/utils'

interface FavoriCardProps {
  produit: any
  retirerFavori: (id: string) => void
  handleAjouterAuPanier: (produit: any) => void
  isInPanier: (id: string) => boolean
}

export function FavoriCard({ produit, retirerFavori, handleAjouterAuPanier, isInPanier }: FavoriCardProps) {
  return (
    <div className="group bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 dark:bg-gray-800 dark:border-gray-700">
      <div className="relative overflow-hidden rounded-t-xl">
        <img
          src={produit.image || '/placeholder-product.svg'}
          alt={produit.nom}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <button
          onClick={() => retirerFavori(produit.id)}
          className="absolute top-3 right-3 p-2 bg-white/90 rounded-full shadow-md hover:bg-red-50 hover:text-red-600 transition-colors"
          aria-label="Retirer des favoris"
        >
          <Heart className="h-5 w-5 fill-red-500 text-red-500" />
        </button>
      </div>
      <div className="p-4">
        <h3 className="font-medium text-gray-900 mb-1 dark:text-gray-100">
          {produit.nom}
        </h3>
        {produit.description && (
          <p className="text-sm text-gray-500 mb-2 line-clamp-2 dark:text-gray-400">
            {produit.description}
          </p>
        )}
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold text-boulangerie-gold">
            {produit.prix.toFixed(2)} €
          </span>
          <button
            onClick={() => handleAjouterAuPanier(produit)}
            disabled={isInPanier(produit.id)}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
              isInPanier(produit.id)
                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                : "bg-boulangerie-gold text-white hover:bg-boulangerie-gold/90"
            )}
          >
            <ShoppingCart className="h-4 w-4" />
            {isInPanier(produit.id) ? 'Ajouté' : 'Ajouter'}
          </button>
        </div>
      </div>
    </div>
  )
}
