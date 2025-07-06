import React from "react"

interface ErreurChargementProps {
  erreur: string
  onReessayer: () => void
}

export function ErreurChargement({ erreur, onReessayer }: ErreurChargementProps) {
  return (
    <div className="text-center py-12">
      <p className="text-red-600 mb-4">{erreur}</p>
      <button 
        onClick={onReessayer}
        className="bg-boulangerie-bordeaux text-white px-4 py-2 rounded-lg hover:bg-boulangerie-bordeaux-dark transition-colors"
      >
        Réessayer
      </button>
    </div>
  )
}
