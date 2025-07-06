import React from "react"
import { motion } from "framer-motion"
import { Clock, MapPin, CreditCard, Package } from "lucide-react"
import { type Commande } from "@/lib/boulangerie-api"

interface CommandeCardProps {
  commande: Commande
  index: number
}

const getStatutColor = (statut: string) => {
  switch (statut) {
    case 'confirmee': return 'bg-blue-100 text-blue-800'
    case 'en_preparation': return 'bg-yellow-100 text-yellow-800'
    case 'prete': return 'bg-green-100 text-green-800'
    case 'livree': return 'bg-gray-100 text-gray-800'
    case 'annulee': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const getStatutTexte = (statut: string) => {
  switch (statut) {
    case 'confirmee': return 'Confirmée'
    case 'en_preparation': return 'En préparation'
    case 'prete': return 'Prête'
    case 'livree': return 'Livrée'
    case 'annulee': return 'Annulée'
    default: return statut
  }
}

export function CommandeCard({ commande, index }: CommandeCardProps) {
  return (
    <motion.div
      className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-semibold text-lg text-boulangerie-bordeaux">
            Commande #{commande.id}
          </h3>
          <p className="text-gray-500 text-sm flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {new Date(commande.date).toLocaleDateString('fr-FR')}
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatutColor(commande.statut)}`}>
          {getStatutTexte(commande.statut)}
        </span>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Package className="w-4 h-4" />
          {commande.articles.length} article(s) - {commande.total.toFixed(2)} €
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MapPin className="w-4 h-4" />
          {commande.livraison.type === 'retrait' ? 'Retrait en magasin' : 'Livraison'} - {commande.livraison.creneau}
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <CreditCard className="w-4 h-4" />
          {commande.paiement.methode} - {commande.paiement.statut}
        </div>
      </div>

      <div className="border-t pt-3">
        <p className="text-sm font-medium text-gray-700 mb-2">Articles :</p>
        <div className="space-y-1">
          {commande.articles.slice(0, 3).map((article, idx) => (
            <div key={idx} className="flex justify-between text-sm text-gray-600">
              <span>{article.quantite}x {article.nom}</span>
              <span>{article.total.toFixed(2)} €</span>
            </div>
          ))}
          {commande.articles.length > 3 && (
            <p className="text-sm text-gray-500">+{commande.articles.length - 3} autre(s) article(s)</p>
          )}
        </div>
      </div>
    </motion.div>
  )
}
