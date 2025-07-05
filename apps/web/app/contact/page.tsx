"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import { NavbarAvancee } from "@/components/navigation/navbar-avancee"
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send,
  MessageCircle,
  Star,
  ChefHat,
  Heart
} from "lucide-react"

const horaires = [
  { jour: "Lundi", heures: "6h00 - 19h30" },
  { jour: "Mardi", heures: "6h00 - 19h30" },
  { jour: "Mercredi", heures: "6h00 - 19h30" },
  { jour: "Jeudi", heures: "6h00 - 19h30" },
  { jour: "Vendredi", heures: "6h00 - 19h30" },
  { jour: "Samedi", heures: "6h00 - 19h00" },
  { jour: "Dimanche", heures: "7h00 - 13h00" }
]

const avis = [
  {
    nom: "Marie L.",
    note: 5,
    commentaire: "La meilleure boulangerie de Strasbourg ! Le kouglof est exceptionnel.",
    date: "Il y a 2 jours"
  },
  {
    nom: "Pierre M.", 
    note: 5,
    commentaire: "Accueil chaleureux et produits toujours frais. Je recommande vivement !",
    date: "Il y a 1 semaine"
  },
  {
    nom: "Sophie K.",
    note: 4,
    commentaire: "Très bonne qualité, les croissants sont parfaits pour le petit-déjeuner.",
    date: "Il y a 2 semaines"
  }
]

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
}

export default function ContactPage(): JSX.Element {
  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    sujet: "",
    message: ""
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Ici vous pourrez ajouter la logique d'envoi
    console.log("Message envoyé:", formData)
    alert("Message envoyé ! Nous vous répondrons rapidement.")
    setFormData({ nom: "", email: "", sujet: "", message: "" })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

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
              Contactez-nous
            </motion.h1>
            <motion.p 
              className="text-xl opacity-90 max-w-2xl mx-auto"
              {...fadeInUp}
              transition={{ delay: 0.2 }}
            >
              Une question ? Une commande spéciale ? Nous sommes là pour vous aider !
            </motion.p>
          </div>
        </motion.section>

        <div className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-3 gap-12">
              {/* Informations de contact */}
              <motion.div 
                className="lg:col-span-1 space-y-8"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                {/* Coordonnées */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h2 className="text-2xl font-artisan font-bold text-boulangerie-bordeaux mb-6">
                    Informations pratiques
                  </h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <MapPin className="w-6 h-6 text-boulangerie-bordeaux mt-1" />
                      <div>
                        <h3 className="font-semibold text-boulangerie-bordeaux">Adresse</h3>
                        <p className="text-gray-600">
                          123 Rue de la Boulangerie<br />
                          67000 Strasbourg<br />
                          France
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <Phone className="w-6 h-6 text-boulangerie-bordeaux mt-1" />
                      <div>
                        <h3 className="font-semibold text-boulangerie-bordeaux">Téléphone</h3>
                        <p className="text-gray-600">03 88 XX XX XX</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <Mail className="w-6 h-6 text-boulangerie-bordeaux mt-1" />
                      <div>
                        <h3 className="font-semibold text-boulangerie-bordeaux">Email</h3>
                        <p className="text-gray-600">contact@boulangerie-alsacienne.fr</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Horaires */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <Clock className="w-6 h-6 text-boulangerie-bordeaux" />
                    <h2 className="text-2xl font-artisan font-bold text-boulangerie-bordeaux">
                      Horaires d'ouverture
                    </h2>
                  </div>
                  
                  <div className="space-y-3">
                    {horaires.map((horaire, index) => (
                      <div 
                        key={index}
                        className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0"
                      >
                        <span className="font-medium text-gray-700">{horaire.jour}</span>
                        <span className="text-boulangerie-bordeaux font-medium">{horaire.heures}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Avis clients */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <Heart className="w-6 h-6 text-boulangerie-bordeaux" />
                    <h2 className="text-2xl font-artisan font-bold text-boulangerie-bordeaux">
                      Avis clients
                    </h2>
                  </div>
                  
                  <div className="space-y-4">
                    {avis.map((avis, index) => (
                      <div key={index} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i}
                                className={`w-4 h-4 ${
                                  i < avis.note 
                                    ? "fill-yellow-400 text-yellow-400" 
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="font-medium text-sm text-gray-700">{avis.nom}</span>
                        </div>
                        <p className="text-gray-600 text-sm mb-1">{avis.commentaire}</p>
                        <p className="text-xs text-gray-400">{avis.date}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Formulaire de contact */}
              <motion.div 
                className="lg:col-span-2"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <div className="flex items-center gap-3 mb-8">
                    <MessageCircle className="w-6 h-6 text-boulangerie-bordeaux" />
                    <h2 className="text-2xl font-artisan font-bold text-boulangerie-bordeaux">
                      Envoyez-nous un message
                    </h2>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-2">
                          Nom complet *
                        </label>
                        <input
                          type="text"
                          id="nom"
                          name="nom"
                          required
                          value={formData.nom}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-boulangerie-or focus:border-transparent"
                          placeholder="Votre nom"
                        />
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-boulangerie-or focus:border-transparent"
                          placeholder="votre@email.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="sujet" className="block text-sm font-medium text-gray-700 mb-2">
                        Sujet *
                      </label>
                      <select
                        id="sujet"
                        name="sujet"
                        required
                        value={formData.sujet}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-boulangerie-or focus:border-transparent"
                      >
                        <option value="">Choisissez un sujet</option>
                        <option value="commande">Question sur une commande</option>
                        <option value="produits">Informations produits</option>
                        <option value="livraison">Livraison</option>
                        <option value="evenement">Commande pour événement</option>
                        <option value="autre">Autre</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                        Message *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        required
                        rows={6}
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-boulangerie-or focus:border-transparent resize-none"
                        placeholder="Décrivez votre demande..."
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-boulangerie-bordeaux hover:bg-boulangerie-bordeaux-dark text-white font-medium py-4 px-6 rounded-lg flex items-center justify-center gap-3 transition-colors"
                    >
                      <Send className="w-5 h-5" />
                      Envoyer le message
                    </button>
                  </form>
                </div>

                {/* Carte (placeholder) */}
                <div className="bg-white rounded-2xl shadow-lg p-8 mt-8">
                  <div className="flex items-center gap-3 mb-6">
                    <MapPin className="w-6 h-6 text-boulangerie-bordeaux" />
                    <h2 className="text-2xl font-artisan font-bold text-boulangerie-bordeaux">
                      Nous trouver
                    </h2>
                  </div>
                  
                  <div className="aspect-video bg-gradient-to-br from-boulangerie-beige to-boulangerie-cream rounded-xl flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="w-12 h-12 text-boulangerie-bordeaux mx-auto mb-4" />
                      <p className="text-gray-600 font-medium">Carte interactive</p>
                      <p className="text-sm text-gray-500">À intégrer prochainement</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
