import React from "react"
import { motion } from "framer-motion"
import { Heart, ShoppingCart, Star } from "lucide-react"
import { type Produit } from "@/lib/boulangerie-api"

interface ProduitCardProps {
  produit: Produit
  index: number
}

export function ProduitCard({ produit, index }: ProduitCardProps) {
  return (
    <motion.div
      className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <div className="relative">
        <div className="aspect-square bg-gradient-to-br from-boulangerie-beige to-boulangerie-cream flex items-center justify-center">
          {produit.image ? (
            <img src={produit.image} alt={produit.nom} className="w-full h-full object-cover" />
          ) : (
            <>
              <span className="text-4xl">📸</span>
              <p className="absolute bottom-2 text-xs text-gray-500">Image à venir</p>
            </>
          )}
        </div>
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {produit.nouveau && (
            <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              Nouveau
            </span>
          )}
          {produit.populaire && (
            <span className="bg-boulangerie-or text-white px-2 py-1 rounded-full text-xs font-medium">
              Populaire
            </span>
          )}
          {!produit.disponible && (
            <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              Épuisé
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="bg-white/90 hover:bg-white p-2 rounded-full shadow-md">
            <Heart className="w-4 h-4 text-gray-600 hover:text-red-500" />
          </button>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm text-gray-600">{produit.note}</span>
          </div>
          {produit.stock !== undefined && (
            <span className="text-xs text-gray-500">
              Stock: {produit.stock}
            </span>
          )}
        </div>
        
        <h3 className="font-artisan font-semibold text-lg text-boulangerie-bordeaux mb-2">
          {produit.nom}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {produit.description}
        </p>
        
        {/* Tags */}
        {produit.tags && produit.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {produit.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="px-2 py-1 bg-boulangerie-beige text-boulangerie-bordeaux text-xs rounded-full">
                {tag}
              </span>
            ))}
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-boulangerie-bordeaux">
            {produit.prix.toFixed(2)} €
          </span>
          <button 
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
              produit.disponible 
                ? "bg-boulangerie-bordeaux hover:bg-boulangerie-bordeaux-dark text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            disabled={!produit.disponible}
          >
            <ShoppingCart className="w-4 h-4" />
            {produit.disponible ? "Ajouter" : "Épuisé"}
          </button>
        </div>
      </div>
    </motion.div>
  )
}
