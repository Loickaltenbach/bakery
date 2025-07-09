"use client"

import React, { useState, Suspense } from "react"
import { motion } from "framer-motion"
import { NavbarAvancee } from "@/components/navigation/navbar-avancee"
import { useCommandes } from "@/hooks/useCommandes"
import { HeroCommandes } from "@/components/commandes/HeroCommandes"
const CommandeCard = React.lazy(() => import("@/components/commandes/CommandeCard").then(m => ({ default: m.CommandeCard })))
import { ChargementProduits } from "@/components/produits/ChargementProduits"
import { ErreurChargement } from "@/components/produits/ErreurChargement"
import { RequireRole } from '@/components/auth/RequireRole'

const COMMANDES_PAR_PAGE = 6

export default function CommandesPage(): React.ReactElement {
  const { commandes, loading, error, refetch } = useCommandes()
  const [page, setPage] = useState(1)

  const totalPages = Math.ceil(commandes.length / COMMANDES_PAR_PAGE)
  const commandesPage = commandes.slice((page - 1) * COMMANDES_PAR_PAGE, page * COMMANDES_PAR_PAGE)

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
    <RequireRole role="user">
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
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Suspense fallback={<ChargementProduits />}>
                      {commandesPage.map((commande, index) => (
                        <CommandeCard key={commande.id} commande={commande} index={index} />
                      ))}
                    </Suspense>
                  </div>
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
              )}
            </div>
          </section>
        </div>
      </>
    </RequireRole>
  )
}
