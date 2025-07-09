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
      // Appel API réel KISS
      const data = await boulangerieAPI.categories.getAll()
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
        ...(Array.isArray(data) ? data : [])
      ]
      setCategories(toutesCategories)
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
