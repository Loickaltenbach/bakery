"use client"

import React, { useState } from 'react'
import { 
  Zap, 
  ShoppingCart, 
  Edit2, 
  Trash2, 
  Plus, 
  Star,
  Clock,
  TrendingUp,
  Save,
  X,
  Check
} from 'lucide-react'
import { useCommandesRapides } from '@/contexts/CommandesRapidesContext'
import { usePanier } from '@/contexts/PanierContext'
import { cn } from '@workspace/ui/lib/utils'

export function CommandesRapidesPage() {
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
      // Vider le panier actuel et ajouter les produits de la commande rapide
      viderPanier()
      commandeUtilisee.produits.forEach((produit: any) => {
        // Simuler un produit complet pour l'ajout au panier
        const produitComplet = {
          id: produit.id,
          nom: produit.nom,
          prix: produit.prix,
          // Ajouter d'autres propriétés nécessaires...
        }
        ajouterProduit(produitComplet, produit.quantite)
      })
    }
  }

  const handleSauvegarderPanierActuel = () => {
    if (panier.items.length > 0) {
      // Ici vous pouvez implémenter la logique pour sauvegarder le panier actuel
      // en tant que commande rapide
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

  return (
    <div className="container mx-auto px-4 py-8">
      {/* En-tête */}
      <div className="mb-8">
        <h1 className="text-3xl font-artisan font-bold text-boulangerie-marron mb-4 dark:text-amber-100">
          Commandes Rapides
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Sauvegardez vos commandes favorites pour les repasser rapidement
        </p>
      </div>

      {/* Actions rapides */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-boulangerie-gold/10 to-amber-500/10 rounded-xl p-6 border border-boulangerie-gold/20 dark:border-amber-500/20">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-boulangerie-marron mb-2 dark:text-amber-100">
                Panier actuel
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                {panier.items.length} article{panier.items.length !== 1 ? 's' : ''} - {panier.totalPrice.toFixed(2)} €
              </p>
            </div>
            {panier.items.length > 0 && (
              <button
                onClick={handleSauvegarderPanierActuel}
                className="flex items-center gap-2 px-4 py-2 bg-boulangerie-gold text-white rounded-lg hover:bg-boulangerie-gold/90 transition-colors"
              >
                <Save className="h-4 w-4" />
                Sauvegarder comme commande rapide
              </button>
            )}
          </div>
        </div>
      </div>

      {commandesRapides.length === 0 ? (
        /* État vide */
        <div className="text-center py-16">
          <Zap className="mx-auto h-16 w-16 text-gray-300 mb-4 dark:text-gray-600" />
          <h2 className="text-xl font-medium text-gray-900 mb-2 dark:text-gray-100">
            Aucune commande rapide pour le moment
          </h2>
          <p className="text-gray-500 mb-6 dark:text-gray-400">
            Ajoutez des produits à votre panier et sauvegardez-le comme commande rapide
          </p>
          <button
            onClick={() => window.location.href = '/produits'}
            className="inline-flex items-center px-6 py-3 bg-boulangerie-gold text-white rounded-lg hover:bg-boulangerie-gold/90 transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" />
            Découvrir nos produits
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Commandes populaires */}
          {commandesPopulaires.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-boulangerie-marron mb-4 flex items-center gap-2 dark:text-amber-100">
                <TrendingUp className="h-5 w-5" />
                Vos commandes les plus utilisées
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {commandesPopulaires.map((commande) => (
                  <div
                    key={commande.id}
                    className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4 dark:from-amber-900/20 dark:to-orange-900/20 dark:border-amber-800/30"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-medium text-gray-900 dark:text-gray-100">
                        {commande.nom}
                      </h3>
                      <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                        <Star className="h-4 w-4 fill-current" />
                        <span className="text-sm">{commande.utilisations}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3 dark:text-gray-300">
                      {commande.produits.length} article{commande.produits.length !== 1 ? 's' : ''} • {commande.total.toFixed(2)} €
                    </p>
                    <button
                      onClick={() => handleUtiliser(commande)}
                      className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-boulangerie-gold text-white rounded-lg hover:bg-boulangerie-gold/90 transition-colors text-sm"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      Utiliser
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Toutes les commandes */}
          <div>
            <h2 className="text-xl font-semibold text-boulangerie-marron mb-4 dark:text-amber-100">
              Toutes mes commandes rapides
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {commandesRapides.map((commande) => (
                <div
                  key={commande.id}
                  className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow dark:bg-gray-800 dark:border-gray-700"
                >
                  {/* En-tête de la commande */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      {editingId === commande.id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            className="flex-1 px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-boulangerie-gold focus:border-transparent dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSaveEdit()
                              if (e.key === 'Escape') handleCancelEdit()
                            }}
                            autoFocus
                          />
                          <button
                            onClick={handleSaveEdit}
                            className="p-1 text-green-600 hover:bg-green-50 rounded dark:hover:bg-green-900/30"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="p-1 text-gray-500 hover:bg-gray-50 rounded dark:hover:bg-gray-700"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                          {commande.nom}
                        </h3>
                      )}
                    </div>
                    
                    {editingId !== commande.id && (
                      <div className="flex items-center gap-2 ml-4">
                        <button
                          onClick={() => handleEdit(commande)}
                          className="p-2 text-gray-500 hover:bg-gray-50 rounded-lg transition-colors dark:hover:bg-gray-700 dark:text-gray-400"
                          aria-label="Modifier le nom"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => supprimerCommandeRapide(commande.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors dark:hover:bg-red-900/30"
                          aria-label="Supprimer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Métadonnées */}
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {formatDate(commande.dernierAcces)}
                    </span>
                    <span className="flex items-center gap-1">
                      <TrendingUp className="h-4 w-4" />
                      {commande.utilisations} utilisation{commande.utilisations !== 1 ? 's' : ''}
                    </span>
                  </div>

                  {/* Produits */}
                  <div className="space-y-2 mb-4">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">
                      Produits ({commande.produits.length})
                    </h4>
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {commande.produits.map((produit, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between text-sm py-1"
                        >
                          <span className="text-gray-700 dark:text-gray-300">
                            {produit.nom}
                          </span>
                          <span className="text-gray-500 dark:text-gray-400">
                            {produit.quantite}x {produit.prix.toFixed(2)}€
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Total et actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-600">
                    <span className="text-lg font-semibold text-boulangerie-gold">
                      Total: {commande.total.toFixed(2)} €
                    </span>
                    <button
                      onClick={() => handleUtiliser(commande)}
                      className="flex items-center gap-2 px-4 py-2 bg-boulangerie-gold text-white rounded-lg hover:bg-boulangerie-gold/90 transition-colors"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      Utiliser
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
