'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { Button } from '@workspace/ui/components/button';
import { useCommande } from '../../contexts/CommandeContext';
import { usePaiement } from '../../contexts/PaiementContext';
import { CodePromoComponent } from './CodePromoComponent';
import { PaiementComponent } from './PaiementComponent';
import { FactureComponent } from './FactureComponent';
import { formaterPrix } from '../../lib/panier-utils';
import { Euro, CreditCard, Receipt } from 'lucide-react';

export function PaiementStep() {
  const { processus, etapeSuivante, etapePrecedente } = useCommande();
  const { initialiserPaiement, paiementEnCours, detailsPaiement } = usePaiement();
  const [etapePaiement, setEtapePaiement] = useState<'promo' | 'paiement' | 'facture'>('promo');
  const [transactionId, setTransactionId] = useState<string | null>(null);

  useEffect(() => {
    // Initialiser le paiement avec le montant total de la commande
    if (processus.totaux && !paiementEnCours) {
      initialiserPaiement(
        `temp-${Date.now()}`,
        processus.totaux.total
      );
    }
  }, [processus.totaux, paiementEnCours, initialiserPaiement]);

  const handlePaiementReussi = (txId: string) => {
    setTransactionId(txId);
    setEtapePaiement('facture');
  };

  const handleFinirCommande = () => {
    // Marquer la commande comme payée et passer à l'étape suivante
    etapeSuivante();
  };

  if (!processus.totaux || !processus.informationsClient) {
    return (
      <Card className="card-boulangerie">
        <CardContent className="p-6 text-center">
          <p className="text-boulangerie-bordeaux">
            Informations de commande incomplètes
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-artisan font-bold text-boulangerie-bordeaux mb-3">
          Paiement et facturation
        </h3>
        <p className="text-boulangerie-bordeaux-light font-alsacien">
          {etapePaiement === 'promo' && 'Codes promo et finalisation du montant'}
          {etapePaiement === 'paiement' && 'Paiement sécurisé de votre commande'}
          {etapePaiement === 'facture' && 'Facture et confirmation'}
        </p>
      </div>

      {/* Indicateur d'étapes */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${
            etapePaiement === 'promo' ? 'bg-boulangerie-or text-white' : 
            ['paiement', 'facture'].includes(etapePaiement) ? 'bg-green-100 text-green-700' : 
            'bg-gray-100 text-gray-500'
          }`}>
            <Euro className="w-4 h-4" />
            <span className="text-sm font-medium">1. Montant</span>
          </div>

          <div className="w-8 h-0.5 bg-gray-200"></div>

          <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${
            etapePaiement === 'paiement' ? 'bg-boulangerie-or text-white' : 
            etapePaiement === 'facture' ? 'bg-green-100 text-green-700' : 
            'bg-gray-100 text-gray-500'
          }`}>
            <CreditCard className="w-4 h-4" />
            <span className="text-sm font-medium">2. Paiement</span>
          </div>

          <div className="w-8 h-0.5 bg-gray-200"></div>

          <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${
            etapePaiement === 'facture' ? 'bg-boulangerie-or text-white' : 
            'bg-gray-100 text-gray-500'
          }`}>
            <Receipt className="w-4 h-4" />
            <span className="text-sm font-medium">3. Facture</span>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Étape 1: Code promo et récapitulatif */}
        {etapePaiement === 'promo' && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <CodePromoComponent />
              </div>
              
              <div>
                <Card className="card-boulangerie">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-boulangerie-bordeaux">
                      <Euro className="w-5 h-5 text-boulangerie-or" />
                      Récapitulatif
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-boulangerie-bordeaux">Sous-total :</span>
                        <span className="text-boulangerie-bordeaux">
                          {formaterPrix(processus.totaux.sousTotal)}
                        </span>
                      </div>
                      
                      {detailsPaiement?.reduction && detailsPaiement.reduction > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>Réduction :</span>
                          <span>-{formaterPrix(detailsPaiement.reduction)}</span>
                        </div>
                      )}
                      
                      <div className="flex justify-between text-sm">
                        <span className="text-boulangerie-bordeaux-light">TVA :</span>
                        <span className="text-boulangerie-bordeaux-light">
                          {formaterPrix(detailsPaiement?.montantTVA || processus.totaux.taxes)}
                        </span>
                      </div>
                      
                      <div className="border-t pt-3 flex justify-between items-center">
                        <span className="text-lg font-bold text-boulangerie-bordeaux">Total :</span>
                        <span className="text-xl font-bold text-boulangerie-or">
                          {formaterPrix(detailsPaiement?.total || processus.totaux.total)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={etapePrecedente}
                className="flex-1"
              >
                Retour
              </Button>
              
              <Button
                onClick={() => setEtapePaiement('paiement')}
                className="flex-1 btn-boulangerie-primary"
              >
                Procéder au paiement
              </Button>
            </div>
          </>
        )}

        {/* Étape 2: Paiement */}
        {etapePaiement === 'paiement' && (
          <>
            <PaiementComponent
              onSuccess={handlePaiementReussi}
              onCancel={() => setEtapePaiement('promo')}
            />
          </>
        )}

        {/* Étape 3: Facture */}
        {etapePaiement === 'facture' && processus.informationsClient && (
          <>
            <FactureComponent
              commandeId={paiementEnCours?.commandeId || ''}
              emailClient={processus.informationsClient.email}
            />

            <div className="text-center">
              <Button
                onClick={handleFinirCommande}
                className="btn-boulangerie-primary text-lg px-8 py-3"
              >
                Finaliser ma commande
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
