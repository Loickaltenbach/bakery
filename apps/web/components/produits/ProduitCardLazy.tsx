import React from "react"
import { motion } from "framer-motion"
import { type Produit } from "@/lib/boulangerie-api"

interface ProduitCardLazyProps {
  produit: Produit
  index: number
}

export function ProduitCardLazy({ produit, index }: ProduitCardLazyProps) {
  // ...on peut réutiliser le code de ProduitCard ou l'importer si factorisé...
  return (
    <motion.div
      className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      {/* ...reprendre le contenu de ProduitCard... */}
    </motion.div>
  )
}
