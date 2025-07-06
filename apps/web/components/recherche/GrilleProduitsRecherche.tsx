import React from 'react';
import { motion } from 'framer-motion';
import { Star, Clock, Heart, ShoppingCart } from 'lucide-react';

interface Produit {
  id: number;
  nom: string;
  prix: number;
  description: string;
  categorie: string;
  note: number;
  temps_preparation: string;
  populaire?: boolean;
  nouveau?: boolean;
  tags: string[];
}

interface GrilleProduitsRechercheProps {
  produits: Produit[];
}

export function GrilleProduitsRecherche({ produits }: GrilleProduitsRechercheProps) {
  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
    >
      {produits.map((produit, index) => (
        <motion.div
          key={produit.id}
          className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden group"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <div className="relative">
            <div className="aspect-square bg-gradient-to-br from-boulangerie-beige to-boulangerie-cream flex items-center justify-center">
              <span className="text-4xl">📸</span>
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
            </div>

            {/* Actions */}
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="bg-white/90 hover:bg-white p-2 rounded-full shadow-md">
                <Heart className="w-4 h-4 text-gray-600 hover:text-red-500" />
              </button>
            </div>
          </div>

          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm text-gray-600">{produit.note}</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Clock className="w-3 h-3" />
                {produit.temps_preparation}
              </div>
            </div>
            
            <h3 className="font-artisan font-semibold text-lg text-boulangerie-bordeaux mb-2">
              {produit.nom}
            </h3>
            
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {produit.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1 mb-4">
              {produit.tags.slice(0, 2).map((tag) => (
                <span key={tag} className="px-2 py-1 bg-boulangerie-beige text-boulangerie-bordeaux text-xs rounded-full">
                  {tag}
                </span>
              ))}
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-xl font-bold text-boulangerie-bordeaux">
                {produit.prix.toFixed(2)} €
              </span>
              <button className="bg-boulangerie-bordeaux hover:bg-boulangerie-bordeaux-dark text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                <ShoppingCart className="w-4 h-4" />
                Ajouter
              </button>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
