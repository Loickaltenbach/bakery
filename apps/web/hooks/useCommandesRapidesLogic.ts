import { useState } from 'react'
import { useCommandesRapides } from '@/contexts/CommandesRapidesContext'
import { usePanier } from '@/contexts/PanierContext'

export function useCommandesRapidesLogic() {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState('')
  const [isCreating, setIsCreating] = useState(false)

  const { 
    commandesRapides, 
    supprimerCommandeRapide, 
    utiliserCommandeRapide, 
    renommerCommandeRapide,
    getCommandesPopulaires 
  } = useCommandesRapides()
  
  const { panier, viderPanier, ajouterProduit } = usePanier()

  const commandesPopulaires = getCommandesPopulaires(3)

  const handleEdit = (commande: any) => {
    setEditingId(commande.id)
    setEditingName(commande.nom)
  }

  const handleSaveEdit = () => {
    if (editingId && editingName.trim()) {
      renommerCommandeRapide(editingId, editingName.trim())
      setEditingId(null)
      setEditingName('')
    }
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditingName('')
  }

  const handleUtiliser = (commande: any) => {
    const commandeUtilisee = utiliserCommandeRapide(commande.id)
    if (commandeUtilisee) {
      viderPanier()
      commandeUtilisee.produits.forEach((produit: any) => {
        // Créer un produit complet avec toutes les propriétés requises
        const produitComplet = {
          ...produit,
          documentId: produit.id,
          description: produit.description || '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          publishedAt: new Date().toISOString(),
        }
        ajouterProduit(produitComplet, produit.quantite)
      })
    }
  }

  const handleSauvegarderPanierActuel = () => {
    if (panier.items.length > 0) {
      setIsCreating(true)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  return {
    // State
    editingId,
    editingName,
    setEditingName,
    isCreating,
    setIsCreating,
    
    // Data
    commandesRapides,
    commandesPopulaires,
    panier,
    
    // Actions
    handleEdit,
    handleSaveEdit,
    handleCancelEdit,
    handleUtiliser,
    handleSauvegarderPanierActuel,
    supprimerCommandeRapide,
    formatDate
  }
}
