import { NavbarAvancee } from "@/components/navigation/navbar-avancee"

export default function ContactPage(): JSX.Element {
  return (
    <>
      <NavbarAvancee />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-boulangerie-marron mb-6">
          Contact
        </h1>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Informations</h2>
            <div className="space-y-3">
              <p>
                <strong>Adresse :</strong><br />
                123 Rue de la Boulangerie<br />
                67000 Strasbourg
              </p>
              <p>
                <strong>Téléphone :</strong><br />
                03 88 XX XX XX
              </p>
              <p>
                <strong>Email :</strong><br />
                contact@boulangerie-alsacienne.fr
              </p>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-4">Horaires</h2>
            <div className="space-y-2">
              <p><strong>Lundi - Vendredi :</strong> 6h00 - 19h30</p>
              <p><strong>Samedi :</strong> 6h00 - 19h00</p>
              <p><strong>Dimanche :</strong> 7h00 - 13h00</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
