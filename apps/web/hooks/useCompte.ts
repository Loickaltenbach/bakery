import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useFavoris } from '@/contexts/FavorisContext'
import { useCommandesRapides } from '@/contexts/CommandesRapidesContext'

export interface UtilisateurProfil {
  nom: string
  email: string
  telephone?: string
  adresse?: string
  dateInscription: string
  nombreCommandes: number
  montantTotal: number
}

export interface StatistiquesCompte {
  commandesTerminees: number
  favorisCount: number
  commandesRapidesCount: number
  derniereConnexion: string
}

export function useCompte() {
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'profil' | 'historique' | 'favoris' | 'commandes-rapides'>('profil')
  const [isEditing, setIsEditing] = useState(false)
  
  const { utilisateur, historique, mettreAJourProfil, deconnexion: deconnecterUtilisateur } = useAuth()
  const { favoris } = useFavoris()
  const { commandesRapides } = useCommandesRapides()

  const [profil, setProfil] = useState<UtilisateurProfil | null>(null)
  const [statistiques, setStatistiques] = useState<StatistiquesCompte | null>(null)

  useEffect(() => {
    if (utilisateur) {
      const totalMontant = historique.reduce((sum, commande) => sum + (commande.prixTotal || 0), 0)
      
      setProfil({
        nom: utilisateur.nom,
        email: utilisateur.email,
        telephone: utilisateur.telephone || '',
        adresse: '',
        dateInscription: utilisateur.dateCreation.toISOString(),
        nombreCommandes: historique.length,
        montantTotal: totalMontant
      })

      setStatistiques({
        commandesTerminees: historique.filter((c: any) => c.statut === 'TERMINEE').length,
        favorisCount: favoris.length,
        commandesRapidesCount: commandesRapides.length,
        derniereConnexion: new Date().toISOString()
      })
    }
    setIsLoading(false)
  }, [utilisateur, favoris, commandesRapides, historique])

  const modifierProfil = async (nouvelleDonnees: Partial<UtilisateurProfil>) => {
    try {
      await mettreAJourProfil(nouvelleDonnees)
      setProfil(prev => prev ? { ...prev, ...nouvelleDonnees } : null)
      setIsEditing(false)
      return { success: true }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Erreur inconnue' }
    }
  }

  const deconnexion = () => {
    deconnecterUtilisateur()
  }

  return {
    // État
    isLoading,
    activeTab,
    isEditing,
    profil,
    statistiques,
    utilisateur,
    
    // Actions
    setActiveTab,
    setIsEditing,
    modifierProfil,
    deconnexion
  }
}
