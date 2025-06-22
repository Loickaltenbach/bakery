'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@workspace/ui/components/button';
import { useCommande } from '../../contexts/CommandeContext';
import { usePanier } from '../../contexts/PanierContext';
import { formaterCreneau } from '../../lib/commande-utils';
import { formaterPrix } from '../../lib/panier-utils';
import { 
  CheckCircle, 
  Calendar, 
  Store, 
  Mail, 
  Phone,
  Download,
  Home
} from 'lucide-react';

interface ConfirmationStepProps {
  onClose: () => void;
}

export const ConfirmationStep: React.FC<ConfirmationStepProps> = ({ onClose }) => {
  const { processus, reinitialiserCommande } = useCommande();
  const { viderPanier } = usePanier();
  const [commandeFinalisee, setCommandeFinalisee] = useState(false);

  useEffect(() => {
    // Vider le panier une fois la commande confirmée
    if (processus.etapeActuelle === 'CONFIRMATION' && !commandeFinalisee) {
      viderPanier();
      setCommandeFinalisee(true);
    }
  }, [processus.etapeActuelle, viderPanier, commandeFinalisee]);

  const handleNouvelleCommande = () => {
    reinitialiserCommande();
    onClose();
  };

  const handleRetourAccueil = () => {
    reinitialiserCommande();
    onClose();
  };

  if (!processus.creneauChoisi || !processus.informationsClient) {
    return null;
  }
  
  return (
    <div className="max-w-2xl mx-auto text-center">
      {/* Animation de succès */}
      <div className="mb-8">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
        
        <h3 className="text-3xl font-artisan font-bold text-boulangerie-bordeaux mb-3">
          Commande confirmée !
        </h3>
        
        <p className="text-lg text-boulangerie-bordeaux-light font-alsacien mb-2">
          Merci pour votre commande {processus.informationsClient.prenom} !
        </p>
        
        <p className="text-boulangerie-bordeaux-light">
          Un email de confirmation a été envoyé à{' '}
          <span className="font-medium">{processus.informationsClient.email}</span>
        </p>
      </div>

      {/* Détails de la commande */}
      <div className="bg-boulangerie-beige rounded-2xl p-8 mb-8 text-left">
        <h4 className="text-xl font-artisan font-bold text-boulangerie-bordeaux mb-6 text-center">
          Détails de votre commande
        </h4>

        <div className="space-y-6">
          {/* Mode de récupération et créneau */}
          <div className="flex items-start gap-4 p-4 bg-white rounded-xl">
            <Store className="w-6 h-6 text-boulangerie-or flex-shrink-0 mt-1" />
            <div>
              <h5 className="font-medium text-boulangerie-bordeaux mb-1">
                Retrait en magasin
              </h5>
              <div className="flex items-center gap-2 text-sm text-boulangerie-bordeaux-light">
                <Calendar className="w-4 h-4" />
                {formaterCreneau(processus.creneauChoisi)}
              </div>
            </div>
          </div>

          {/* Total */}
          <div className="flex items-center justify-between p-4 bg-boulangerie-or/10 rounded-xl border-2 border-boulangerie-or">
            <span className="text-lg font-artisan font-bold text-boulangerie-bordeaux">
              Total payé
            </span>
            <span className="text-2xl font-bold text-boulangerie-or">
              {formaterPrix(processus.totaux.total)}
            </span>
          </div>

          {/* Contact */}
          <div className="flex items-start gap-4 p-4 bg-white rounded-xl">
            <div className="w-6 h-6 bg-boulangerie-or rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <Phone className="w-3 h-3 text-white" />
            </div>
            <div>
              <h5 className="font-medium text-boulangerie-bordeaux mb-1">
                Nous vous contacterons
              </h5>
              <div className="text-sm text-boulangerie-bordeaux-light">
                <div className="flex items-center gap-2 mb-1">
                  <Phone className="w-4 h-4" />
                  {processus.informationsClient.telephone}
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {processus.informationsClient.email}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-boulangerie-or/10 rounded-xl p-6 mb-8 border-l-4 border-boulangerie-or">
        <h5 className="font-artisan font-bold text-boulangerie-bordeaux mb-3">
          Prochaines étapes
        </h5>
        
        <ul className="text-sm text-boulangerie-bordeaux-light space-y-2 text-left">
          <li>• Votre commande sera préparée pour le créneau choisi</li>
          <li>• Vous recevrez un SMS quand elle sera prête</li>
          <li>• Présentez-vous à la boulangerie au créneau choisi</li>
          <li>• Paiement sur place en espèces ou par carte</li>
        </ul>
      </div>

      {/* Actions */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={handleNouvelleCommande}
            className="btn-boulangerie-primary px-8 py-3"
          >
            Nouvelle commande
          </Button>
          
          <Button
            onClick={handleRetourAccueil}
            variant="secondary"
            className="bg-boulangerie-bordeaux-light text-white px-8 py-3"
          >
            <Home className="w-4 h-4 mr-2" />
            Retour à l&apos;accueil
          </Button>
        </div>

        {/* Bouton de téléchargement (simulé) */}
        <Button
          variant="secondary"
          className="w-full sm:w-auto bg-boulangerie-beige text-boulangerie-bordeaux"
          onClick={() => {
            // Ici on pourrait générer un PDF de confirmation
            alert('Fonctionnalité de téléchargement à venir !');
          }}
        >
          <Download className="w-4 h-4 mr-2" />
          Télécharger la confirmation
        </Button>
      </div>

      {/* Message de remerciement */}
      <div className="mt-8 p-6 bg-gradient-to-r from-boulangerie-or/10 to-boulangerie-bordeaux/10 rounded-xl">
        <p className="text-boulangerie-bordeaux font-alsacien">
          Merci de faire confiance à notre boulangerie artisanale !<br />
          Nous mettons tout notre savoir-faire au service de votre plaisir gustatif.
        </p>
        <p className="text-sm text-boulangerie-bordeaux-light mt-2">
          — L&apos;équipe de la Boulangerie Alsacienne
        </p>
      </div>
    </div>
  );
};
