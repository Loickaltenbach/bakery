import React from 'react';
import { Button } from '@workspace/ui/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card';

interface PanelTestsProps {
  loading: boolean;
  testCodePromo: () => void;
  testPaiement: () => void;
  testFacture: () => void;
  viderResultats: () => void;
}

export function PanelTests({
  loading,
  testCodePromo,
  testPaiement,
  testFacture,
  viderResultats
}: PanelTestsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tests API</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={testCodePromo} 
          disabled={loading}
          className="w-full"
        >
          Tester Codes Promo
        </Button>
        
        <Button 
          onClick={testPaiement} 
          disabled={loading}
          className="w-full"
        >
          Tester Paiements
        </Button>
        
        <Button 
          onClick={testFacture} 
          disabled={loading}
          className="w-full"
        >
          Tester Factures
        </Button>
        
        <Button 
          onClick={viderResultats} 
          variant="outline"
          className="w-full"
        >
          Vider Résultats
        </Button>
      </CardContent>
    </Card>
  );
}
