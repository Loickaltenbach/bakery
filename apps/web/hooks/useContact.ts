import { useState } from 'react'
import { boulangerieAPI } from '@/lib/boulangerie-api'

export function useContact() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const envoyerMessage = async (message: {
    nom: string
    email: string
    sujet: string
    message: string
  }) => {
    try {
      setLoading(true)
      setError(null)
      setSuccess(false)
      // Appel API réel KISS
      await boulangerieAPI.contact.send(message)
      setSuccess(true)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de l\'envoi'
      setError(message)
      console.error('Erreur contact:', err)
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setError(null)
    setSuccess(false)
    setLoading(false)
  }

  return {
    loading,
    error,
    success,
    envoyerMessage,
    reset
  }
}
