import React from "react"
import { Search } from "lucide-react"

interface BarreRechercheProps {
  recherche: string
  onRechercheChange: (value: string) => void
  onRechercher?: () => void
}

export function BarreRecherche({ recherche, onRechercheChange, onRechercher }: BarreRechercheProps) {
  return (
    <div className="relative max-w-md mx-auto mb-8">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
      <input
        type="text"
        placeholder="Rechercher un produit..."
        value={recherche}
        onChange={(e) => onRechercheChange(e.target.value)}
        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-boulangerie-or focus:border-transparent"
        onKeyPress={(e) => e.key === 'Enter' && onRechercher?.()}
      />
    </div>
  )
}
