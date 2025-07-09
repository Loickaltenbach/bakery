import { useState, useEffect } from 'react'
import { boulangerieAPI, type Commande } from '@/lib/boulangerie-api'

export function useCommandes() {
  const [commandes, setCommandes] = useState<Commande[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const chargerCommandes = async (filtres?: {
    statut?: string
    client?: string
    dateDebut?: string
    dateFin?: string
  }) => {
    try {
      setLoading(true)
      setError(null)
      // Appel API réel KISS
      const data = await boulangerieAPI.commandes.getAll(filtres)
      setCommandes(Array.isArray(data) ? data : [])
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors du chargement'
      setError(message)
      console.error('Erreur commandes:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    chargerCommandes()
  }, [])

  return {
    commandes,
    loading,
    error,
    chargerCommandes,
    refetch: chargerCommandes
  }
}
