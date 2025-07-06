import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { CodePromoComponent } from '@/components/paiement/CodePromoComponent';
import { PaiementComponent } from '@/components/paiement/PaiementComponent';
import { FactureComponent } from '@/components/paiement/FactureComponent';

export function ComposantsPaiement() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Composants de Paiement</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-2">Code Promo</h3>
          <CodePromoComponent />
        </div>

        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-2">Paiement</h3>
          <PaiementComponent 
            onSuccess={(txId: string) => console.log('Paiement réussi:', txId)}
            onCancel={() => console.log('Paiement annulé')}
          />
        </div>

        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-2">Facture</h3>
          <FactureComponent 
            commandeId="test-commande-123"
            emailClient="test@example.com"
            onFactureGenerated={(facture: any) => console.log('Facture générée:', facture)}
          />
        </div>
      </CardContent>
    </Card>
  );
}
