"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { 
  Heart, 
  ShoppingCart, 
  Star, 
  Filter, 
  SortAsc, 
  Grid, 
  List,
  Search,
  X,
  ChevronDown
} from 'lucide-react'
import { useFavoris } from '@/contexts/FavorisContext'
import { usePanier } from '@/contexts/PanierContext'
import { useApi } from '@/hooks/useApi'
import { cn } from '@workspace/ui/lib/utils'

interface SortOption {
  value: string
  label: string
}

const sortOptions: SortOption[] = [
  { value: 'nom', label: 'Nom' },
  { value: 'prix-asc', label: 'Prix croissant' },
  { value: 'prix-desc', label: 'Prix décroissant' },
  { value: 'date', label: 'Ajouté récemment' },
  { value: 'popularite', label: 'Popularité' }
]

const categories = [
  'Tous',
  'Pain',
  'Viennoiserie', 
  'Pâtisserie',
  'Biscuits',
  'Spécialités'
]

export function FavorisPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Tous')
  const [sortBy, setSortBy] = useState('date')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const { favoris, retirerFavori } = useFavoris()
  const { ajouterProduit, isInPanier } = usePanier()
  
  // Mock data pour les produits - à remplacer par un vrai appel API
  const [produits, setProduits] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Simuler le chargement des produits
  React.useEffect(() => {
    const loadProduits = async () => {
      try {
        // Ici vous pouvez appeler votre API
        // const response = await fetch('/api/produits')
        // const data = await response.json()
        
        // Mock data temporaire
        const mockProduits = [
          {
            id: '1',
            nom: 'Croissant au beurre',
            prix: 1.20,
            categorie: 'Viennoiserie',
            description: 'Croissant traditionnel au beurre AOP',
            image: '/images/croissant.jpg',
            popularite: 5
          },
          {
            id: '2', 
            nom: 'Pain de campagne',
            prix: 3.50,
            categorie: 'Pain',
            description: 'Pain traditionnel au levain',
            image: '/images/pain-campagne.jpg',
            popularite: 4
          }
        ]
        setProduits(mockProduits)
      } catch (error) {
        console.error('Erreur lors du chargement des produits:', error)
      } finally {
        setLoading(false)
      }
    }

    loadProduits()
  }, [])

  // Filtrer les produits favoris
  const produitsFavoris = produits.filter((p: any) => favoris.includes(p.id))

  // Appliquer les filtres et le tri
  const produitsFiltrés = React.useMemo(() => {
    let résultat = [...produitsFavoris]

    // Filtre par recherche
    if (searchTerm) {
      résultat = résultat.filter(produit =>
        produit.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        produit.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filtre par catégorie
    if (selectedCategory !== 'Tous') {
      résultat = résultat.filter(produit => produit.categorie === selectedCategory)
    }

    // Tri
    résultat.sort((a, b) => {
      switch (sortBy) {
        case 'nom':
          return a.nom.localeCompare(b.nom)
        case 'prix-asc':
          return a.prix - b.prix
        case 'prix-desc':
          return b.prix - a.prix
        case 'date':
          // Tri par ordre d'ajout aux favoris (plus récent en premier)
          const indexA = favoris.indexOf(a.id)
          const indexB = favoris.indexOf(b.id)
          return indexB - indexA
        case 'popularite':
          return (b.popularite || 0) - (a.popularite || 0)
        default:
          return 0
      }
    })

    return résultat
  }, [produitsFavoris, searchTerm, selectedCategory, sortBy, favoris])

  const handleAjouterAuPanier = (produit: any) => {
    ajouterProduit(produit, 1)
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6 dark:bg-gray-700"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-lg dark:bg-gray-700"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* En-tête */}
      <div className="mb-8">
        <h1 className="text-3xl font-artisan font-bold text-boulangerie-marron mb-4 dark:text-amber-100">
          Mes Favoris
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          {favoris.length} produit{favoris.length !== 1 ? 's' : ''} dans votre liste de souhaits
        </p>
      </div>

      {favoris.length === 0 ? (
        /* État vide */
        <div className="text-center py-16">
          <Heart className="mx-auto h-16 w-16 text-gray-300 mb-4 dark:text-gray-600" />
          <h2 className="text-xl font-medium text-gray-900 mb-2 dark:text-gray-100">
            Aucun favori pour le moment
          </h2>
          <p className="text-gray-500 mb-6 dark:text-gray-400">
            Parcourez nos produits et ajoutez vos préférés à votre liste de souhaits
          </p>
          <Link
            href="/produits"
            className="inline-flex items-center px-6 py-3 bg-boulangerie-gold text-white rounded-lg hover:bg-boulangerie-gold/90 transition-colors"
          >
            Découvrir nos produits
          </Link>
        </div>
      ) : (
        <>
          {/* Barre de recherche et filtres */}
          <div className="mb-6 space-y-4">
            {/* Recherche */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher dans vos favoris..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-boulangerie-gold focus:border-transparent dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                aria-label="Rechercher dans les favoris"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  aria-label="Effacer la recherche"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>

            {/* Filtres et contrôles */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {/* Filtres catégories */}
                <div className="relative">
                  <button
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700 dark:text-white"
                  >
                    <Filter className="h-4 w-4" />
                    {selectedCategory}
                    <ChevronDown className="h-4 w-4" />
                  </button>

                  {isFilterOpen && (
                    <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10 dark:bg-gray-800 dark:border-gray-700">
                      {categories.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => {
                            setSelectedCategory(cat)
                            setIsFilterOpen(false)
                          }}
                          className={cn(
                            "block w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700",
                            selectedCategory === cat && "bg-boulangerie-gold/10 text-boulangerie-gold dark:bg-amber-500/20 dark:text-amber-300"
                          )}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Tri */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg bg-white dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  aria-label="Trier par"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Mode d'affichage */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    "p-2 rounded-lg",
                    viewMode === 'grid'
                      ? "bg-boulangerie-gold text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                  )}
                  aria-label="Vue grille"
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={cn(
                    "p-2 rounded-lg",
                    viewMode === 'list'
                      ? "bg-boulangerie-gold text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                  )}
                  aria-label="Vue liste"
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Résultats */}
          {produitsFiltrés.length === 0 ? (
            <div className="text-center py-12">
              <Search className="mx-auto h-12 w-12 text-gray-300 mb-4 dark:text-gray-600" />
              <h3 className="text-lg font-medium text-gray-900 mb-2 dark:text-gray-100">
                Aucun résultat trouvé
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Essayez de modifier vos critères de recherche
              </p>
            </div>
          ) : (
            <div className={cn(
              "transition-all duration-300",
              viewMode === 'grid'
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "space-y-4"
            )}>
              {produitsFiltrés.map((produit) => (
                <div
                  key={produit.id}
                  className={cn(
                    "group bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 dark:bg-gray-800 dark:border-gray-700",
                    viewMode === 'list' && "flex items-center p-4"
                  )}
                >
                  {viewMode === 'grid' ? (
                    /* Vue grille */
                    <>
                      <div className="relative overflow-hidden rounded-t-xl">
                        <img
                          src={produit.image || '/placeholder-product.svg'}
                          alt={produit.nom}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <button
                          onClick={() => retirerFavori(produit.id)}
                          className="absolute top-3 right-3 p-2 bg-white/90 rounded-full shadow-md hover:bg-red-50 hover:text-red-600 transition-colors"
                          aria-label="Retirer des favoris"
                        >
                          <Heart className="h-5 w-5 fill-red-500 text-red-500" />
                        </button>
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium text-gray-900 mb-1 dark:text-gray-100">
                          {produit.nom}
                        </h3>
                        {produit.description && (
                          <p className="text-sm text-gray-500 mb-2 line-clamp-2 dark:text-gray-400">
                            {produit.description}
                          </p>
                        )}
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-semibold text-boulangerie-gold">
                            {produit.prix.toFixed(2)} €
                          </span>
                          <button
                            onClick={() => handleAjouterAuPanier(produit)}
                            disabled={isInPanier(produit.id)}
                            className={cn(
                              "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                              isInPanier(produit.id)
                                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                                : "bg-boulangerie-gold text-white hover:bg-boulangerie-gold/90"
                            )}
                          >
                            <ShoppingCart className="h-4 w-4" />
                            {isInPanier(produit.id) ? 'Ajouté' : 'Ajouter'}
                          </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    /* Vue liste */
                    <>
                      <img
                        src={produit.image || '/placeholder-product.svg'}
                        alt={produit.nom}
                        className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                      />
                      <div className="ml-4 flex-1">
                        <h3 className="font-medium text-gray-900 dark:text-gray-100">
                          {produit.nom}
                        </h3>
                        {produit.description && (
                          <p className="text-sm text-gray-500 mt-1 dark:text-gray-400">
                            {produit.description}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-lg font-semibold text-boulangerie-gold">
                          {produit.prix.toFixed(2)} €
                        </span>
                        <button
                          onClick={() => retirerFavori(produit.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors dark:hover:bg-red-900/30"
                          aria-label="Retirer des favoris"
                        >
                          <Heart className="h-5 w-5 fill-current" />
                        </button>
                        <button
                          onClick={() => handleAjouterAuPanier(produit)}
                          disabled={isInPanier(produit.id)}
                          className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                            isInPanier(produit.id)
                              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                              : "bg-boulangerie-gold text-white hover:bg-boulangerie-gold/90"
                          )}
                        >
                          <ShoppingCart className="h-4 w-4" />
                          {isInPanier(produit.id) ? 'Ajouté' : 'Ajouter'}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
