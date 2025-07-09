import React from "react"
import { NavbarAvancee } from "@/components/navigation/navbar-avancee"
import { FavorisPage } from "@/components/favoris/favoris-page"
import { RequireRole } from '@/components/auth/RequireRole'

export default function Favoris(): React.ReactElement {
  return (
    <RequireRole role="user">
      <NavbarAvancee />
      <FavorisPage />
    </RequireRole>
  )
}
