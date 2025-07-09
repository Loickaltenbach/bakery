"use client"

import React, { useMemo, useState } from "react"
import { motion } from "framer-motion"
import { NavbarAvancee } from "@/components/navigation/navbar-avancee"
import { useRechercheSimple } from "@/hooks/useRechercheSimple"
import { HeroRecherche } from "@/components/recherche/HeroRecherche"
import { BarreRecherche } from "@/components/recherche/BarreRecherche"
import { RecherchesPopulaires } from "@/components/recherche/RecherchesPopulaires"
import { FiltresAvances } from "@/components/recherche/FiltresAvances"
import { CategoriesFiltre } from "@/components/recherche/CategoriesFiltre"
import { EnTeteResultats } from "@/components/recherche/EnTeteResultats"
import { GrilleProduitsRecherche } from "@/components/recherche/GrilleProduitsRecherche"
import { AucunResultat } from "@/components/recherche/AucunResultat"

const PRODUITS_PAR_PAGE = 12

export default function RechercheePage(): React.ReactElement {
  const {
    // États
    recherche,
    categorieActive,
    filtresPrix,
    filtresNote,
    afficherFiltres,
    
    // Données
    categories,
    recherchesPopulaires,
    produitsFiltres,
    
    // Actions
    setRecherche,
    setCategorieActive,
    setFiltresPrix,
    setFiltresNote,
    reinitialiserFiltres,
    selectionnerRecherchePopulaire,
    toggleFiltres
  } = useRechercheSimple()

  const [page, setPage] = useState(1)

  const produitsPage = useMemo(() => produitsFiltres.slice((page - 1) * PRODUITS_PAR_PAGE, page * PRODUITS_PAR_PAGE), [produitsFiltres, page])
  const totalPages = Math.ceil(produitsFiltres.length / PRODUITS_PAR_PAGE)

  return (
    <>
      <NavbarAvancee />
      <div className="min-h-screen bg-boulangerie-cream">
        <HeroRecherche />
        
        {/* Section de recherche */}
        <motion.section 
          className="py-8 bg-white shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="container mx-auto px-4">
            <BarreRecherche
              recherche={recherche}
              setRecherche={setRecherche}
              afficherFiltres={afficherFiltres}
              toggleFiltres={toggleFiltres}
            />

            <RecherchesPopulaires
              recherchesPopulaires={recherchesPopulaires}
              selectionnerRecherchePopulaire={selectionnerRecherchePopulaire}
              recherche={recherche}
            />

            <FiltresAvances
              afficherFiltres={afficherFiltres}
              filtresPrix={filtresPrix}
              setFiltresPrix={setFiltresPrix}
              filtresNote={filtresNote}
              setFiltresNote={setFiltresNote}
              reinitialiserFiltres={reinitialiserFiltres}
            />

            <CategoriesFiltre
              categories={categories}
              categorieActive={categorieActive}
              setCategorieActive={setCategorieActive}
            />
          </div>
        </motion.section>

        {/* Résultats */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <EnTeteResultats
              nombreResultats={produitsFiltres.length}
              recherche={recherche}
            />
            {produitsFiltres.length > 0 ? (
              <>
                <GrilleProduitsRecherche produits={produitsPage} />
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
              </>
            ) : (
              <AucunResultat />
            )}
          </div>
        </section>
      </div>
    </>
  )
}
