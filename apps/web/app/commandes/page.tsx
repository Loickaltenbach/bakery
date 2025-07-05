import { NavbarAvancee } from "@/components/navigation/navbar-avancee"

export default function CommandesPage(): JSX.Element {
  return (
    <>
      <NavbarAvancee />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-boulangerie-marron mb-6">
          Mes Commandes
        </h1>
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">
            Page des commandes en construction...
          </p>
          <p className="text-sm text-gray-500">
            Cette page affichera bientôt l'historique de vos commandes.
          </p>
        </div>
      </div>
    </>
  )
}
