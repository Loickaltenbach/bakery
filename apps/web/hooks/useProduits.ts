import { useState, useEffect } from 'react'
import { boulangerieAPI, type Produit } from '@/lib/boulangerie-api'

export interface UseProduitsOptions {
  categorie?: string
  recherche?: string
  autoLoad?: boolean
}

export function useProduits(options: UseProduitsOptions = {}) {
  const [produits, setProduits] = useState<Produit[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const chargerProduits = async (filtres?: {
    categorie?: string
    recherche?: string
    disponible?: boolean
  }) => {
    try {
      setLoading(true)
      setError(null)
      // Appel API réel KISS
      const data = await boulangerieAPI.produits.getAll(filtres)
      setProduits(Array.isArray(data) ? data : [])
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors du chargement'
      setError(message)
      console.error('Erreur produits:', err)
    } finally {
      setLoading(false)
    }
  }

  const filtrerProduits = (produits: Produit[], categorie?: string, recherche?: string) => {
    return produits.filter(produit => {
      const matchCategorie = !categorie || categorie === "tous" || produit.categorie === categorie
      const matchRecherche = !recherche || 
        produit.nom.toLowerCase().includes(recherche.toLowerCase()) ||
        produit.description.toLowerCase().includes(recherche.toLowerCase()) ||
        produit.tags.some(tag => tag.toLowerCase().includes(recherche.toLowerCase()))
      
      return matchCategorie && matchRecherche
    })
  }

  useEffect(() => {
    if (options.autoLoad !== false) {
      chargerProduits({
        categorie: options.categorie,
        recherche: options.recherche,
        disponible: true
      })
    }
  }, [options.categorie, options.recherche, options.autoLoad])

  return {
    produits,
    loading,
    error,
    chargerProduits,
    filtrerProduits,
    refetch: () => chargerProduits()
  }
}
