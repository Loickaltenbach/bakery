import React from "react"
import { NavbarAvancee } from "@/components/navigation/navbar-avancee"
import RechercheAvancee from "@/components/recherche/recherche-avancee"

export default function Recherche(): React.ReactElement {
  return (
    <>
      <NavbarAvancee />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-artisan font-bold text-boulangerie-marron mb-8 dark:text-amber-100">
          Recherche avancée
        </h1>
        <RechercheAvancee />
      </div>
    </>
  )
}
