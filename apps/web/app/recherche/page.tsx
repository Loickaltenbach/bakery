"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import { NavbarAvancee } from "@/components/navigation/navbar-avancee"
import { 
  Search, 
  Filter, 
  SlidersHorizontal,
  Star,
  Heart,
  ShoppingCart,
  ChefHat,
  Clock,
  TrendingUp
} from "lucide-react"

const categories = [
  { id: "tous", nom: "Tous", icon: ChefHat },
  { id: "pain", nom: "Pains", icon: "🍞" },
  { id: "viennoiserie", nom: "Viennoiseries", icon: "🥐" },
  { id: "patisserie", nom: "Pâtisseries", icon: "🧁" },
  { id: "special", nom: "Spécialités", icon: "🥨" }
]

const produitsExemples = [
  {
    id: 1,
    nom: "Croissant Artisanal",
    prix: 1.20,
    description: "Croissant pur beurre, feuilletage traditionnel",
    categorie: "viennoiserie",
    note: 4.8,
    temps_preparation: "15min",
    populaire: true,
    tags: ["pur beurre", "traditionnel", "croustillant"]
  },
  {
    id: 2,
    nom: "Pain de Campagne au Levain",
    prix: 3.50,
    description: "Pain au levain naturel, croûte dorée",
    categorie: "pain",
    note: 4.9,
    temps_preparation: "24h",
    nouveau: true,
    tags: ["levain", "artisanal", "bio"]
  },
  {
    id: 3,
    nom: "Kouglof Alsacien Traditionnel",
    prix: 8.90,
    description: "Spécialité alsacienne aux raisins et amandes",
    categorie: "special",
    note: 4.7,
    temps_preparation: "3h",
    tags: ["alsacien", "raisins", "amandes", "tradition"]
  },
  {
    id: 4,
    nom: "Éclair au Chocolat",
    prix: 4.20,
    description: "Pâte à choux, crème pâtissière, glaçage chocolat",
    categorie: "patisserie",
    note: 4.6,
    temps_preparation: "30min",
    tags: ["chocolat", "crème", "classique"]
  },
  {
    id: 5,
    nom: "Bretzel Traditionnel",
    prix: 1.80,
    description: "Bretzel alsacien au gros sel",
    categorie: "special",
    note: 4.5,
    temps_preparation: "45min",
    tags: ["alsacien", "salé", "tradition"]
  }
]

const recherchesPopulaires = [
  "croissant", "pain", "kouglof", "bretzel", "tarte", "chocolat"
]

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
}

export default function RechercheePage(): React.ReactElement {
  const [recherche, setRecherche] = useState("")
  const [categorieActive, setCategorieActive] = useState("tous")
  const [filtresPrix, setFiltresPrix] = useState({ min: 0, max: 20 })
  const [filtresNote, setFiltresNote] = useState(0)
  const [afficherFiltres, setAfficherFiltres] = useState(false)

  const produitsFiltres = produitsExemples.filter(produit => {
    const matchRecherche = produit.nom.toLowerCase().includes(recherche.toLowerCase()) ||
                          produit.description.toLowerCase().includes(recherche.toLowerCase()) ||
                          produit.tags.some(tag => tag.toLowerCase().includes(recherche.toLowerCase()))
    
    const matchCategorie = categorieActive === "tous" || produit.categorie === categorieActive
    const matchPrix = produit.prix >= filtresPrix.min && produit.prix <= filtresPrix.max
    const matchNote = produit.note >= filtresNote

    return matchRecherche && matchCategorie && matchPrix && matchNote
  })

  return (
    <>
      <NavbarAvancee />
      <div className="min-h-screen bg-boulangerie-cream">
        {/* Hero Section */}
        <motion.section 
          className="bg-gradient-bordeaux-or text-white py-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="container mx-auto px-4 text-center">
            <motion.h1 
              className="text-4xl md:text-5xl font-artisan font-bold mb-4"
              {...fadeInUp}
            >
              Recherche Avancée
            </motion.h1>
            <motion.p 
              className="text-xl opacity-90 max-w-2xl mx-auto"
              {...fadeInUp}
              transition={{ delay: 0.2 }}
            >
              Trouvez exactement ce que vous cherchez parmi notre sélection artisanale
            </motion.p>
          </div>
        </motion.section>

        {/* Section de recherche */}
        <motion.section 
          className="py-8 bg-white shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="container mx-auto px-4">
            {/* Barre de recherche principale */}
            <div className="relative max-w-2xl mx-auto mb-8">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
              <input
                type="text"
                placeholder="Rechercher par nom, description ou ingrédient..."
                value={recherche}
                onChange={(e) => setRecherche(e.target.value)}
                className="w-full pl-12 pr-16 py-4 text-lg border border-gray-200 rounded-2xl focus:ring-2 focus:ring-boulangerie-or focus:border-transparent shadow-sm"
              />
              <button
                onClick={() => setAfficherFiltres(!afficherFiltres)}
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-2 rounded-lg transition-colors ${
                  afficherFiltres 
                    ? "bg-boulangerie-bordeaux text-white" 
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <SlidersHorizontal className="w-5 h-5" />
              </button>
            </div>

            {/* Recherches populaires */}
            {!recherche && (
              <div className="text-center mb-8">
                <p className="text-gray-600 mb-4">Recherches populaires :</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {recherchesPopulaires.map((terme) => (
                    <button
                      key={terme}
                      onClick={() => setRecherche(terme)}
                      className="px-4 py-2 bg-boulangerie-beige text-boulangerie-bordeaux rounded-full text-sm hover:bg-boulangerie-or hover:text-white transition-colors"
                    >
                      <TrendingUp className="w-3 h-3 inline mr-1" />
                      {terme}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Filtres avancés */}
            {afficherFiltres && (
              <motion.div 
                className="bg-boulangerie-beige rounded-2xl p-6 mb-8"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <h3 className="text-lg font-semibold text-boulangerie-bordeaux mb-6">Filtres avancés</h3>
                
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Filtre prix */}
                  <div>
                    <label className="block text-sm font-medium text-boulangerie-bordeaux mb-3">
                      Prix (€)
                    </label>
                    <div className="space-y-3">
                      <div className="flex gap-3">
                        <input
                          type="number"
                          placeholder="Min"
                          value={filtresPrix.min}
                          onChange={(e) => setFiltresPrix(prev => ({ ...prev, min: Number(e.target.value) }))}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                        <input
                          type="number"
                          placeholder="Max"
                          value={filtresPrix.max}
                          onChange={(e) => setFiltresPrix(prev => ({ ...prev, max: Number(e.target.value) }))}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Filtre note */}
                  <div>
                    <label className="block text-sm font-medium text-boulangerie-bordeaux mb-3">
                      Note minimum
                    </label>
                    <div className="flex gap-2">
                      {[0, 1, 2, 3, 4].map((note) => (
                        <button
                          key={note}
                          onClick={() => setFiltresNote(note)}
                          className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm transition-colors ${
                            filtresNote === note
                              ? "bg-boulangerie-bordeaux text-white"
                              : "bg-white text-gray-600 hover:bg-gray-100"
                          }`}
                        >
                          <Star className="w-3 h-3" />
                          {note === 0 ? "Toutes" : `${note}+`}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Réinitialiser */}
                  <div className="flex items-end">
                    <button
                      onClick={() => {
                        setFiltresPrix({ min: 0, max: 20 })
                        setFiltresNote(0)
                        setCategorieActive("tous")
                      }}
                      className="w-full px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Réinitialiser
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Catégories */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {categories.map((categorie) => (
                <button
                  key={categorie.id}
                  onClick={() => setCategorieActive(categorie.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all ${
                    categorieActive === categorie.id
                      ? "bg-boulangerie-bordeaux text-white shadow-lg"
                      : "bg-white text-gray-600 hover:bg-boulangerie-beige border border-gray-200"
                  }`}
                >
                  {typeof categorie.icon === "string" ? (
                    <span className="text-lg">{categorie.icon}</span>
                  ) : (
                    <categorie.icon className="w-4 h-4" />
                  )}
                  {categorie.nom}
                </button>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Résultats */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            {/* En-tête des résultats */}
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-artisan font-bold text-boulangerie-bordeaux">
                {produitsFiltres.length} résultat{produitsFiltres.length > 1 ? "s" : ""} trouvé{produitsFiltres.length > 1 ? "s" : ""}
                {recherche && ` pour "${recherche}"`}
              </h2>
            </div>

            {/* Grille de produits */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {produitsFiltres.map((produit, index) => (
                <motion.div
                  key={produit.id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden group"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="relative">
                    <div className="aspect-square bg-gradient-to-br from-boulangerie-beige to-boulangerie-cream flex items-center justify-center">
                      <span className="text-4xl">📸</span>
                    </div>
                    
                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                      {produit.nouveau && (
                        <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                          Nouveau
                        </span>
                      )}
                      {produit.populaire && (
                        <span className="bg-boulangerie-or text-white px-2 py-1 rounded-full text-xs font-medium">
                          Populaire
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="bg-white/90 hover:bg-white p-2 rounded-full shadow-md">
                        <Heart className="w-4 h-4 text-gray-600 hover:text-red-500" />
                      </button>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm text-gray-600">{produit.note}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        {produit.temps_preparation}
                      </div>
                    </div>
                    
                    <h3 className="font-artisan font-semibold text-lg text-boulangerie-bordeaux mb-2">
                      {produit.nom}
                    </h3>
                    
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {produit.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {produit.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="px-2 py-1 bg-boulangerie-beige text-boulangerie-bordeaux text-xs rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-boulangerie-bordeaux">
                        {produit.prix.toFixed(2)} €
                      </span>
                      <button className="bg-boulangerie-bordeaux hover:bg-boulangerie-bordeaux-dark text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                        <ShoppingCart className="w-4 h-4" />
                        Ajouter
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Message si aucun résultat */}
            {produitsFiltres.length === 0 && (
              <motion.div 
                className="text-center py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg mb-2">
                  Aucun produit trouvé
                </p>
                <p className="text-gray-400">
                  Essayez de modifier vos critères de recherche ou vos filtres
                </p>
              </motion.div>
            )}
          </div>
        </section>
      </div>
    </>
  )
}
