import React from "react"
import { NavbarAvancee } from "@/components/navigation/navbar-avancee"
import { FavorisPage } from "@/components/favoris/favoris-page"

export default function Favoris(): React.ReactElement {
  return (
    <>
      <NavbarAvancee />
      <FavorisPage />
    </>
  )
}
