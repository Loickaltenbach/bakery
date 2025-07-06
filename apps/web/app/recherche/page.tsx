"use client"

import React from "react"
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
              <GrilleProduitsRecherche produits={produitsFiltres} />
            ) : (
              <AucunResultat />
            )}
          </div>
        </section>
      </div>
    </>
  )
}
