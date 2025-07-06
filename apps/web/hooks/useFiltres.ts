import { useState } from 'react'

export function useFiltres() {
  const [categorieActive, setCategorieActive] = useState("tous")
  const [recherche, setRecherche] = useState("")

  const resetFiltres = () => {
    setCategorieActive("tous")
    setRecherche("")
  }

  return {
    categorieActive,
    setCategorieActive,
    recherche,
    setRecherche,
    resetFiltres
  }
}
