"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import { NavbarAvancee } from "@/components/navigation/navbar-avancee"
import { Search, Filter, Heart, ShoppingCart, Star, ChefHat } from "lucide-react"

const categories = [
  { id: "tous", nom: "Tous nos produits", icon: ChefHat },
  { id: "pain", nom: "Pains", icon: "🍞" },
  { id: "viennoiserie", nom: "Viennoiseries", icon: "🥐" },
  { id: "patisserie", nom: "Pâtisseries", icon: "🧁" },
  { id: "special", nom: "Spécialités alsaciennes", icon: "🥨" }
]

const produitsExemples = [
  {
    id: 1,
    nom: "Croissant Artisanal",
    prix: 1.20,
    image: "/images/croissant.jpg",
    description: "Croissant pur beurre, feuilletage traditionnel",
    categorie: "viennoiserie",
    nouveau: true,
    note: 4.8
  },
  {
    id: 2,
    nom: "Pain de Campagne",
    prix: 3.50,
    image: "/images/pain-campagne.jpg",
    description: "Pain au levain naturel, croûte dorée",
    categorie: "pain",
    populaire: true,
    note: 4.9
  },
  {
    id: 3,
    nom: "Kouglof Traditionnel",
    prix: 8.90,
    image: "/images/kouglof.jpg",
    description: "Spécialité alsacienne aux raisins et amandes",
    categorie: "special",
    note: 4.7
  },
  {
    id: 4,
    nom: "Tarte aux Mirabelles",
    prix: 12.50,
    image: "/images/tarte-mirabelles.jpg",
    description: "Pâte sablée, mirabelles de Lorraine",
    categorie: "patisserie",
    note: 4.6
  }
]

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
}

export default function ProduitsPage(): JSX.Element {
  const [categorieActive, setCategorieActive] = useState("tous")
  const [recherche, setRecherche] = useState("")

  const produitsFiltres = produitsExemples.filter(produit => {
    const matchCategorie = categorieActive === "tous" || produit.categorie === categorieActive
    const matchRecherche = produit.nom.toLowerCase().includes(recherche.toLowerCase())
    return matchCategorie && matchRecherche
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
              Nos Produits Artisanaux
            </motion.h1>
            <motion.p 
              className="text-xl opacity-90 max-w-2xl mx-auto"
              {...fadeInUp}
              transition={{ delay: 0.2 }}
            >
              Découvrez notre sélection de pains, viennoiseries et pâtisseries 
              confectionnés avec passion selon les traditions alsaciennes
            </motion.p>
          </div>
        </motion.section>

        {/* Filtres et Recherche */}
        <motion.section 
          className="py-8 bg-white shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="container mx-auto px-4">
            {/* Barre de recherche */}
            <div className="relative max-w-md mx-auto mb-8">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher un produit..."
                value={recherche}
                onChange={(e) => setRecherche(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-boulangerie-or focus:border-transparent"
              />
            </div>

            {/* Catégories */}
            <div className="flex flex-wrap justify-center gap-3">
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

        {/* Grille des produits */}
        <section className="py-12">
          <div className="container mx-auto px-4">
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
                      <p className="absolute bottom-2 text-xs text-gray-500">Image à venir</p>
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
                    <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="bg-white/90 hover:bg-white p-2 rounded-full shadow-md">
                        <Heart className="w-4 h-4 text-gray-600 hover:text-red-500" />
                      </button>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm text-gray-600">{produit.note}</span>
                      </div>
                    </div>
                    
                    <h3 className="font-artisan font-semibold text-lg text-boulangerie-bordeaux mb-2">
                      {produit.nom}
                    </h3>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {produit.description}
                    </p>
                    
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

            {produitsFiltres.length === 0 && (
              <motion.div 
                className="text-center py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <p className="text-gray-500 text-lg">
                  Aucun produit trouvé pour cette recherche.
                </p>
              </motion.div>
            )}
          </div>
        </section>
      </div>
    </>
  )
}
