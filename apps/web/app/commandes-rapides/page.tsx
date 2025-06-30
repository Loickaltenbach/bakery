import React from "react"
import { NavbarAvancee } from "@/components/navigation/navbar-avancee"
import { CommandesRapidesPage } from "@/components/commande/commandes-rapides-page"

export default function CommandesRapides(): React.ReactElement {
  return (
    <>
      <NavbarAvancee />
      <CommandesRapidesPage />
    </>
  )
}
