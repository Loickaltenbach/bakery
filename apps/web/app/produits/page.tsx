"use client"

import React, { useMemo, useState } from "react"
import { motion } from "framer-motion"
import { NavbarAvancee } from "@/components/navigation/navbar-avancee"
import { useProduits } from "@/hooks/useProduits"
import { useCategories } from "@/hooks/useCategories"
import { useFiltres } from "@/hooks/useFiltres"
import { HeroProduits } from "@/components/produits/HeroProduits"
import { BarreRecherche } from "@/components/produits/BarreRecherche"
import { FiltresCategories } from "@/components/produits/FiltresCategories"
import { GrilleProduits } from "@/components/produits/GrilleProduits"
import { ChargementProduits } from "@/components/produits/ChargementProduits"
import { ErreurChargement } from "@/components/produits/ErreurChargement"

const PRODUITS_PAR_PAGE = 12

export default function ProduitsPage(): React.ReactElement {
  // Hooks pour la logique
  const { produits, loading: loadingProduits, error: errorProduits, refetch: refetchProduits } = useProduits()
  const { categories, loading: loadingCategories } = useCategories()
  const { categorieActive, setCategorieActive, recherche, setRecherche, resetFiltres } = useFiltres()
  const [page, setPage] = useState(1)

  // Filtrage des produits (logique simple)
  const produitsFiltres = useMemo(() => {
    return produits.filter(produit => {
      const matchCategorie = categorieActive === "tous" || produit.categorie === categorieActive
      const matchRecherche = !recherche || 
        produit.nom.toLowerCase().includes(recherche.toLowerCase()) ||
        produit.description.toLowerCase().includes(recherche.toLowerCase()) ||
        produit.tags.some(tag => tag.toLowerCase().includes(recherche.toLowerCase()))
      
      return matchCategorie && matchRecherche
    })
  }, [produits, categorieActive, recherche])

  const produitsPage = produitsFiltres.slice((page - 1) * PRODUITS_PAR_PAGE, page * PRODUITS_PAR_PAGE)
  const totalPages = Math.ceil(produitsFiltres.length / PRODUITS_PAR_PAGE)

  // Gestion des erreurs
  if (errorProduits) {
    return (
      <>
        <NavbarAvancee />
        <div className="min-h-screen bg-boulangerie-cream flex items-center justify-center">
          <ErreurChargement erreur={errorProduits} onReessayer={refetchProduits} />
        </div>
      </>
    )
  }

  return (
    <>
      <NavbarAvancee />
      <div className="min-h-screen bg-boulangerie-cream">
        <HeroProduits />

        {/* Section Filtres */}
        <motion.section 
          className="py-8 bg-white shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="container mx-auto px-4">
            <BarreRecherche 
              recherche={recherche}
              onRechercheChange={setRecherche}
            />

            {!loadingCategories && categories.length > 0 && (
              <FiltresCategories 
                categories={categories}
                categorieActive={categorieActive}
                onCategorieChange={setCategorieActive}
              />
            )}
          </div>
        </motion.section>

        {/* Section Produits */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            {loadingProduits ? (
              <ChargementProduits />
            ) : (
              <>
                <GrilleProduits produits={produitsPage} />
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-8 gap-2">
                    <button
                      className="px-3 py-1 rounded bg-boulangerie-gold text-white disabled:opacity-50"
                      onClick={() => setPage(page - 1)}
                      disabled={page === 1}
                    >
                      Précédent
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => (
                      <button
                        key={i}
                        className={`px-3 py-1 rounded ${page === i + 1 ? 'bg-boulangerie-bordeaux text-white' : 'bg-white text-boulangerie-bordeaux border'} border-boulangerie-bordeaux`}
                        onClick={() => setPage(i + 1)}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      className="px-3 py-1 rounded bg-boulangerie-gold text-white disabled:opacity-50"
                      onClick={() => setPage(page + 1)}
                      disabled={page === totalPages}
                    >
                      Suivant
                    </button>
                  </div>
                )}

                {produitsFiltres.length === 0 && produits.length > 0 && (
                  <motion.div 
                    className="text-center py-12"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <p className="text-gray-500 text-lg mb-4">
                      Aucun produit trouvé pour cette recherche.
                    </p>
                    <button 
                      onClick={resetFiltres}
                      className="text-boulangerie-bordeaux hover:underline"
                    >
                      Réinitialiser les filtres
                    </button>
                  </motion.div>
                )}
              </>
            )}
          </div>
        </section>
      </div>
    </>
  )
}
