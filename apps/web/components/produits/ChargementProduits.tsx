import React from "react"
import { Loader2 } from "lucide-react"

export function ChargementProduits() {
  return (
    <div className="flex justify-center items-center py-12">
      <Loader2 className="w-8 h-8 animate-spin text-boulangerie-bordeaux" />
      <span className="ml-2 text-boulangerie-bordeaux">Chargement des produits...</span>
    </div>
  )
}
