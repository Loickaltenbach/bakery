"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import { NavbarAvancee } from "@/components/navigation/navbar-avancee"
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  Package, 
  Calendar,
  MapPin,
  Phone,
  Eye,
  RotateCcw
} from "lucide-react"

const commandesExemples = [
  {
    id: "CMD-2024-001",
    date: "2024-01-15",
    statut: "livree",
    total: 24.80,
    items: [
      { nom: "Croissants x6", prix: 7.20 },
      { nom: "Pain de campagne", prix: 3.50 },
      { nom: "Kouglof alsacien", prix: 8.90 },
      { nom: "Tarte aux pommes", prix: 5.20 }
    ],
    livraison: {
      type: "retrait",
      adresse: "Boulangerie - 123 Rue de la Boulangerie",
      creneau: "8h30 - 9h00"
    }
  },
  {
    id: "CMD-2024-002", 
    date: "2024-01-20",
    statut: "en_preparation",
    total: 18.40,
    items: [
      { nom: "Pain aux noix", prix: 4.20 },
      { nom: "Bretzels x4", prix: 6.80 },
      { nom: "Éclair au chocolat x2", prix: 7.40 }
    ],
    livraison: {
      type: "livraison",
      adresse: "15 Avenue des Vosges, 67000 Strasbourg",
      creneau: "14h00 - 16h00"
    }
  },
  {
    id: "CMD-2024-003",
    date: "2024-01-22",
    statut: "confirmee",
    total: 32.10,
    items: [
      { nom: "Assortiment viennoiseries x12", prix: 18.00 },
      { nom: "Tarte à la rhubarbe", prix: 9.50 },
      { nom: "Pain de mie complet", prix: 4.60 }
    ],
    livraison: {
      type: "retrait",
      adresse: "Boulangerie - 123 Rue de la Boulangerie", 
      creneau: "16h30 - 17h00"
    }
  }
]

const statutsConfig = {
  confirmee: {
    label: "Confirmée",
    icon: CheckCircle,
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200"
  },
  en_preparation: {
    label: "En préparation",
    icon: Clock,
    color: "text-orange-600", 
    bg: "bg-orange-50",
    border: "border-orange-200"
  },
  prete: {
    label: "Prête",
    icon: Package,
    color: "text-green-600",
    bg: "bg-green-50", 
    border: "border-green-200"
  },
  livree: {
    label: "Livrée",
    icon: CheckCircle,
    color: "text-green-700",
    bg: "bg-green-100",
    border: "border-green-300"
  },
  annulee: {
    label: "Annulée",
    icon: XCircle,
    color: "text-red-600",
    bg: "bg-red-50",
    border: "border-red-200"
  }
}

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
}

export default function CommandesPage(): JSX.Element {
  const [filtreStatut, setFiltreStatut] = useState("tous")

  const commandesFiltrees = commandesExemples.filter(commande => 
    filtreStatut === "tous" || commande.statut === filtreStatut
  )

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long", 
      year: "numeric"
    })
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
          <div className="container mx-auto px-4">
            <motion.h1 
              className="text-4xl md:text-5xl font-artisan font-bold mb-4"
              {...fadeInUp}
            >
              Mes Commandes
            </motion.h1>
            <motion.p 
              className="text-xl opacity-90"
              {...fadeInUp}
              transition={{ delay: 0.2 }}
            >
              Suivez l'état de vos commandes et retrouvez votre historique
            </motion.p>
          </div>
        </motion.section>

        {/* Filtres */}
        <motion.section 
          className="py-6 bg-white shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setFiltreStatut("tous")}
                className={`px-4 py-2 rounded-full font-medium transition-all ${
                  filtreStatut === "tous"
                    ? "bg-boulangerie-bordeaux text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Toutes les commandes
              </button>
              {Object.entries(statutsConfig).map(([statut, config]) => (
                <button
                  key={statut}
                  onClick={() => setFiltreStatut(statut)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all ${
                    filtreStatut === statut
                      ? "bg-boulangerie-bordeaux text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <config.icon className="w-4 h-4" />
                  {config.label}
                </button>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Liste des commandes */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="space-y-6">
              {commandesFiltrees.map((commande, index) => {
                const statutConfig = statutsConfig[commande.statut as keyof typeof statutsConfig]
                
                return (
                  <motion.div
                    key={commande.id}
                    className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="p-6">
                      {/* En-tête de commande */}
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
                        <div className="flex items-center gap-4 mb-4 lg:mb-0">
                          <div>
                            <h3 className="text-xl font-artisan font-bold text-boulangerie-bordeaux">
                              {commande.id}
                            </h3>
                            <div className="flex items-center gap-2 text-gray-600">
                              <Calendar className="w-4 h-4" />
                              <span>{formatDate(commande.date)}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${statutConfig.bg} ${statutConfig.border} border`}>
                            <statutConfig.icon className={`w-4 h-4 ${statutConfig.color}`} />
                            <span className={`font-medium ${statutConfig.color}`}>
                              {statutConfig.label}
                            </span>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-boulangerie-bordeaux">
                              {commande.total.toFixed(2)} €
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Détails de livraison */}
                      <div className="bg-boulangerie-beige rounded-xl p-4 mb-6">
                        <div className="flex items-start gap-3">
                          <MapPin className="w-5 h-5 text-boulangerie-bordeaux mt-0.5" />
                          <div className="flex-1">
                            <h4 className="font-semibold text-boulangerie-bordeaux mb-1">
                              {commande.livraison.type === "retrait" ? "Retrait en magasin" : "Livraison à domicile"}
                            </h4>
                            <p className="text-gray-700 mb-2">{commande.livraison.adresse}</p>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Clock className="w-4 h-4" />
                              <span>Créneau : {commande.livraison.creneau}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Articles commandés */}
                      <div className="space-y-3 mb-6">
                        <h4 className="font-semibold text-boulangerie-bordeaux">Articles commandés :</h4>
                        {commande.items.map((item, itemIndex) => (
                          <div key={itemIndex} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                            <span className="text-gray-700">{item.nom}</span>
                            <span className="font-medium text-boulangerie-bordeaux">{item.prix.toFixed(2)} €</span>
                          </div>
                        ))}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-3 pt-4 border-t border-gray-100">
                        <button className="flex items-center gap-2 px-4 py-2 bg-boulangerie-bordeaux text-white rounded-lg hover:bg-boulangerie-bordeaux-dark transition-colors">
                          <Eye className="w-4 h-4" />
                          Voir détails
                        </button>
                        {commande.statut === "livree" && (
                          <button className="flex items-center gap-2 px-4 py-2 border border-boulangerie-bordeaux text-boulangerie-bordeaux rounded-lg hover:bg-boulangerie-bordeaux hover:text-white transition-colors">
                            <RotateCcw className="w-4 h-4" />
                            Recommander
                          </button>
                        )}
                        {commande.statut === "livree" && (
                          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors">
                            <Phone className="w-4 h-4" />
                            Support
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {commandesFiltrees.length === 0 && (
              <motion.div 
                className="text-center py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg mb-2">
                  Aucune commande trouvée
                </p>
                <p className="text-gray-400">
                  {filtreStatut === "tous" 
                    ? "Vous n'avez pas encore passé de commande"
                    : `Aucune commande avec le statut "${statutsConfig[filtreStatut as keyof typeof statutsConfig]?.label}"`
                  }
                </p>
              </motion.div>
            )}
          </div>
        </section>
      </div>
    </>
  )
}
