import React from "react"
import { HomePage } from "@/components/home/home-page"
import { NavbarAvancee } from "@/components/navigation/navbar-avancee"

export default function Page(): React.ReactElement {
  return (
    <>
      <NavbarAvancee />
      <HomePage />
    </>
  )
}
