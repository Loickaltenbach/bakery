import { useState, useEffect } from 'react'

export function useRecherche() {
  const [terme, setTerme] = useState('')
  const [resultats, setResultats] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const rechercher = async (termeRecherche: string) => {
    if (!termeRecherche.trim()) {
      setResultats([])
      return
    }

    try {
      setLoading(true)
      setError(null)
      
      // Simulation d'une recherche API
      await new Promise(resolve => setTimeout(resolve, 300))
      
      // Ici vous pouvez implémenter la logique de recherche réelle
      setResultats([])
      
    } catch (err) {
      setError('Erreur lors de la recherche')
    } finally {
      setLoading(false)
    }
  }

  // Debounce de la recherche
  useEffect(() => {
    const timer = setTimeout(() => {
      rechercher(terme)
    }, 300)

    return () => clearTimeout(timer)
  }, [terme])

  const reset = () => {
    setTerme('')
    setResultats([])
    setError(null)
  }

  return {
    terme,
    setTerme,
    resultats,
    loading,
    error,
    rechercher,
    reset
  }
}
