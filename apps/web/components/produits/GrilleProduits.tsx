import React from "react"
import { motion } from "framer-motion"
import { ProduitCard } from "./ProduitCard"
import { type Produit } from "@/lib/boulangerie-api"

interface GrilleProduits {
  produits: Produit[]
}

export function GrilleProduits({ produits }: GrilleProduits) {
  if (produits.length === 0) {
    return (
      <motion.div 
        className="text-center py-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <p className="text-gray-500 text-lg">
          Aucun produit trouvé pour cette recherche.
        </p>
      </motion.div>
    )
  }

  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
    >
      {produits.map((produit, index) => (
        <ProduitCard key={produit.id} produit={produit} index={index} />
      ))}
    </motion.div>
  )
}
