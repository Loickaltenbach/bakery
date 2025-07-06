import React from "react"
import { TableauDeBordAdmin } from './TableauDeBordAdmin'
import GestionCommandes from './GestionCommandes'
import GestionStocks from './GestionStocks'
import GestionUtilisateurs from './GestionUtilisateurs'
import { SectionAdmin } from './AdminNavigation'

interface AdminContentProps {
  sectionActive: SectionAdmin
}

// Composants de contenu simples pour l'instant
function StatistiquesAdmin() {
  return <div className="p-4">Statistiques - En développement</div>
}

function ParametresAdmin() {
  return <div className="p-4">Paramètres - En développement</div>
}

export function AdminContent({ sectionActive }: AdminContentProps) {
  const renderContenu = () => {
    switch (sectionActive) {
      case 'dashboard':
        return <TableauDeBordAdmin />
      case 'commandes':
        return <GestionCommandes />
      case 'stocks':
        return <GestionStocks />
      case 'utilisateurs':
        return <GestionUtilisateurs />
      case 'statistiques':
        return <StatistiquesAdmin />
      case 'parametres':
        return <ParametresAdmin />
      default:
        return <TableauDeBordAdmin />
    }
  }

  return (
    <div className="flex-1 p-6 overflow-auto">
      {renderContenu()}
    </div>
  )
}
