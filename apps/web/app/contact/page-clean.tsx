"use client"

import React from "react"
import { motion } from "framer-motion"
import { NavbarAvancee } from "@/components/navigation/navbar-avancee"
import { HeroContact } from "@/components/contact/HeroContact"
import { FormulaireContact } from "@/components/contact/FormulaireContact"
import { MapPin, Phone, Clock, Mail } from "lucide-react"

const informationsContact = [
  {
    icon: MapPin,
    titre: "Adresse",
    contenu: "15 Rue de la Boulangerie\n67000 Strasbourg, France"
  },
  {
    icon: Phone,
    titre: "Téléphone",
    contenu: "+33 3 88 XX XX XX"
  },
  {
    icon: Mail,
    titre: "Email",
    contenu: "contact@boulangerie-tradition.fr"
  },
  {
    icon: Clock,
    titre: "Horaires",
    contenu: "Lun-Sam: 7h00 - 19h00\nDimanche: 7h00 - 13h00"
  }
]

export default function ContactPage(): JSX.Element {
  return (
    <>
      <NavbarAvancee />
      <div className="min-h-screen bg-boulangerie-cream">
        <HeroContact />

        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Formulaire de contact */}
              <div>
                <h2 className="text-2xl font-artisan font-bold text-boulangerie-bordeaux mb-6">
                  Envoyez-nous un message
                </h2>
                <FormulaireContact />
              </div>

              {/* Informations de contact */}
              <div>
                <h2 className="text-2xl font-artisan font-bold text-boulangerie-bordeaux mb-6">
                  Nos coordonnées
                </h2>
                <div className="space-y-6">
                  {informationsContact.map((info, index) => (
                    <motion.div
                      key={info.titre}
                      className="bg-white rounded-lg shadow-md p-6 flex items-start gap-4"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="bg-boulangerie-beige p-3 rounded-lg">
                        <info.icon className="w-6 h-6 text-boulangerie-bordeaux" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">{info.titre}</h3>
                        <p className="text-gray-600 whitespace-pre-line">{info.contenu}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Carte (placeholder) */}
                <motion.div 
                  className="mt-8 bg-white rounded-lg shadow-md p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <h3 className="font-semibold text-gray-900 mb-4">Nous trouver</h3>
                  <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">Carte à intégrer</p>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
