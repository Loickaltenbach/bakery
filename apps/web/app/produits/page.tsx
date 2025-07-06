"use client"

import React, { useMemo } from "react"
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

export default function ProduitsPage(): JSX.Element {
  // Hooks pour la logique
  const { produits, loading: loadingProduits, error: errorProduits, refetch: refetchProduits } = useProduits()
  const { categories, loading: loadingCategories } = useCategories()
  const { categorieActive, setCategorieActive, recherche, setRecherche, resetFiltres } = useFiltres()

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
                <GrilleProduits produits={produitsFiltres} />
                
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
