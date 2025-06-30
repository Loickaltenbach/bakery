"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { 
  ShoppingCart, 
  Heart, 
  Star, 
  ChefHat, 
  Clock, 
  Award,
  MapPin,
  Phone,
  ArrowRight,
  Sparkles
} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@workspace/ui/lib/utils'

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
}

const staggerChildren = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

export function HomePage() {
  const produitsMisEnAvant = [
    {
      id: 1,
      nom: "Croissant Artisanal",
      prix: 1.20,
      image: "/images/croissant.jpg",
      description: "Croissant pur beurre, feuilletage traditionnel",
      nouveau: true
    },
    {
      id: 2,
      nom: "Pain de Campagne",
      prix: 3.50,
      image: "/images/pain-campagne.jpg", 
      description: "Pain au levain naturel, croûte dorée",
      populaire: true
    },
    {
      id: 3,
      nom: "Tarte aux Fruits",
      prix: 18.00,
      image: "/images/tarte-fruits.jpg",
      description: "Pâte sablée, crème pâtissière, fruits de saison",
      nouveau: false
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Section Hero */}
      <section className="relative bg-gradient-to-br from-boulangerie-cream via-amber-50 to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/pattern-bread.svg')] opacity-5"></div>
        
        <div className="relative container mx-auto px-4 py-16 sm:py-24 lg:py-32">
          <motion.div 
            className="max-w-4xl mx-auto text-center"
            initial="initial"
            animate="animate"
            variants={staggerChildren}
          >
            <motion.div
              variants={fadeInUp}
              className="mb-6"
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-boulangerie-gold/10 text-boulangerie-gold rounded-full text-sm font-medium border border-boulangerie-gold/20">
                <Sparkles className="h-4 w-4" />
                Tradition artisanale depuis 1985
              </span>
            </motion.div>

            <motion.h1 
              variants={fadeInUp}
              className="text-4xl sm:text-5xl lg:text-6xl font-artisan font-bold text-boulangerie-marron mb-6 dark:text-amber-100"
            >
              L'Art du Pain
              <span className="block text-boulangerie-gold">au Cœur de l'Alsace</span>
            </motion.h1>

            <motion.p 
              variants={fadeInUp}
              className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto dark:text-gray-300"
            >
              Découvrez nos créations artisanales, pétries avec passion et 
              savoir-faire traditionnel. Chaque jour, nous sélectionnons les 
              meilleurs ingrédients pour vous offrir le goût authentique de l'Alsace.
            </motion.p>

            <motion.div 
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/produits"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-boulangerie-gold text-white rounded-xl font-semibold hover:bg-boulangerie-gold/90 transition-colors shadow-lg hover:shadow-xl"
                >
                  <ShoppingCart className="h-5 w-5" />
                  Découvrir nos produits
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-8 py-4 border-2 border-boulangerie-gold text-boulangerie-gold rounded-xl font-semibold hover:bg-boulangerie-gold hover:text-white transition-colors"
                >
                  <MapPin className="h-5 w-5" />
                  Nous trouver
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        {/* Image décorative */}
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 hidden lg:block"
        >
          <div className="w-64 h-64 bg-gradient-to-br from-boulangerie-gold/20 to-amber-500/20 rounded-full blur-3xl"></div>
        </motion.div>
      </section>

      {/* Section Caractéristiques */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-artisan font-bold text-boulangerie-marron mb-4 dark:text-amber-100">
              Pourquoi nous choisir ?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto dark:text-gray-300">
              Notre engagement envers la qualité et la tradition fait de chaque visite une expérience unique
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerChildren}
          >
            {[
              {
                icon: ChefHat,
                title: "Savoir-faire artisanal",
                description: "Techniques traditionnelles transmises de génération en génération"
              },
              {
                icon: Clock,
                title: "Fraîcheur quotidienne",
                description: "Produits fabriqués chaque matin avec des ingrédients sélectionnés"
              },
              {
                icon: Award,
                title: "Qualité reconnue",
                description: "Récompensés par les concours professionnels alsaciens"
              },
              {
                icon: Heart,
                title: "Service personnalisé",
                description: "Une équipe passionnée à votre écoute depuis plus de 35 ans"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="text-center group"
              >
                <motion.div 
                  className="mx-auto w-16 h-16 bg-gradient-to-br from-boulangerie-gold to-amber-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
                  whileHover={{ rotate: 5 }}
                >
                  <feature.icon className="h-8 w-8 text-white" />
                </motion.div>
                <h3 className="text-lg font-semibold text-boulangerie-marron mb-2 dark:text-amber-100">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm dark:text-gray-300">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Section Produits mis en avant */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-amber-50/30 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-artisan font-bold text-boulangerie-marron mb-4 dark:text-amber-100">
              Nos spécialités du moment
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto dark:text-gray-300">
              Découvrez une sélection de nos créations les plus appréciées
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerChildren}
          >
            {produitsMisEnAvant.map((produit) => (
              <motion.div
                key={produit.id}
                variants={fadeInUp}
                whileHover={{ y: -8 }}
                className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group dark:bg-gray-800"
              >
                <div className="relative">
                  <div className="w-full h-48 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30"></div>
                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex gap-2">
                    {produit.nouveau && (
                      <span className="px-2 py-1 bg-green-500 text-white text-xs font-medium rounded-full">
                        Nouveau
                      </span>
                    )}
                    {produit.populaire && (
                      <span className="px-2 py-1 bg-red-500 text-white text-xs font-medium rounded-full flex items-center gap-1">
                        <Star className="h-3 w-3 fill-current" />
                        Populaire
                      </span>
                    )}
                  </div>
                  
                  {/* Bouton favori */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="absolute top-3 right-3 p-2 bg-white/90 rounded-full shadow-md hover:bg-white transition-colors dark:bg-gray-800/90"
                  >
                    <Heart className="h-5 w-5 text-gray-600 hover:text-red-500 transition-colors dark:text-gray-300" />
                  </motion.button>
                </div>

                <div className="p-6">
                  <h3 className="text-lg font-semibold text-boulangerie-marron mb-2 dark:text-amber-100">
                    {produit.nom}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 dark:text-gray-300">
                    {produit.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-boulangerie-gold">
                      {produit.prix.toFixed(2)} €
                    </span>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-2 px-4 py-2 bg-boulangerie-gold text-white rounded-lg hover:bg-boulangerie-gold/90 transition-colors text-sm font-medium"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      Ajouter
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center mt-12"
          >
            <Link
              href="/produits"
              className="inline-flex items-center gap-2 px-6 py-3 border-2 border-boulangerie-gold text-boulangerie-gold rounded-lg hover:bg-boulangerie-gold hover:text-white transition-colors font-medium"
            >
              Voir tous nos produits
              <ArrowRight className="h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Section Contact/Infos */}
      <section className="py-16 bg-boulangerie-marron text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-artisan font-bold mb-4">
                Venez nous rendre visite
              </h2>
              <p className="text-amber-100 mb-6">
                Retrouvez-nous dans notre boulangerie traditionnelle au cœur de Strasbourg. 
                Notre équipe vous accueille chaleureusement du mardi au dimanche.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-boulangerie-gold mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">Adresse</h3>
                    <p className="text-amber-100 text-sm">
                      42 Rue des Boulangers<br />
                      67000 Strasbourg
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-boulangerie-gold mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">Téléphone</h3>
                    <p className="text-amber-100 text-sm">
                      03 88 32 14 75
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-boulangerie-gold mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">Horaires</h3>
                    <p className="text-amber-100 text-sm">
                      Mar-Dim: 6h30 - 19h30<br />
                      Fermé le lundi
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
            >
              <h3 className="text-lg font-semibold mb-4">Suivez-nous</h3>
              <p className="text-amber-100 text-sm mb-4">
                Restez informé de nos nouveautés et promotions
              </p>
              <div className="space-y-3">
                <button className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-sm font-medium">
                  Facebook
                </button>
                <button className="w-full px-4 py-2 bg-pink-600 hover:bg-pink-700 rounded-lg transition-colors text-sm font-medium">
                  Instagram
                </button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
