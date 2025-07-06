import { useState, useEffect } from 'react'
import { boulangerieAPI, type Categorie } from '@/lib/boulangerie-api'

export function useCategories() {
  const [categories, setCategories] = useState<Categorie[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const chargerCategories = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await boulangerieAPI.categories.getAll()
      
      if ((response as any).success) {
        // Ajouter la catégorie "Tous"
        const toutesCategories = [
          { 
            id: "tous", 
            nom: "Tous nos produits", 
            icon: "🍽️", 
            description: "", 
            produits_count: 0, 
            actif: true 
          },
          ...(response as any).data
        ]
        setCategories(toutesCategories)
      } else {
        throw new Error('Erreur lors du chargement des catégories')
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors du chargement'
      setError(message)
      console.error('Erreur catégories:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    chargerCategories()
  }, [])

  return {
    categories,
    loading,
    error,
    refetch: chargerCategories
  }
}
