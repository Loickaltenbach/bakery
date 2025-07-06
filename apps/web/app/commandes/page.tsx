"use client"

import React from "react"
import { motion } from "framer-motion"
import { NavbarAvancee } from "@/components/navigation/navbar-avancee"
import { useCommandes } from "@/hooks/useCommandes"
import { HeroCommandes } from "@/components/commandes/HeroCommandes"
import { CommandeCard } from "@/components/commandes/CommandeCard"
import { ChargementProduits } from "@/components/produits/ChargementProduits"
import { ErreurChargement } from "@/components/produits/ErreurChargement"

export default function CommandesPage(): JSX.Element {
  const { commandes, loading, error, refetch } = useCommandes()

  if (error) {
    return (
      <>
        <NavbarAvancee />
        <div className="min-h-screen bg-boulangerie-cream flex items-center justify-center">
          <ErreurChargement erreur={error} onReessayer={refetch} />
        </div>
      </>
    )
  }

  return (
    <>
      <NavbarAvancee />
      <div className="min-h-screen bg-boulangerie-cream">
        <HeroCommandes />

        <section className="py-12">
          <div className="container mx-auto px-4">
            {loading ? (
              <ChargementProduits />
            ) : commandes.length === 0 ? (
              <motion.div 
                className="text-center py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <p className="text-gray-500 text-lg mb-4">
                  Vous n'avez pas encore passé de commande.
                </p>
                <a 
                  href="/produits"
                  className="bg-boulangerie-bordeaux text-white px-6 py-3 rounded-lg hover:bg-boulangerie-bordeaux-dark transition-colors"
                >
                  Découvrir nos produits
                </a>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {commandes.map((commande, index) => (
                  <CommandeCard key={commande.id} commande={commande} index={index} />
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  )
}
