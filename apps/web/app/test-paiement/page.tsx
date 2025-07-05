'use client';

import React, { useState } from 'react';
import { Button } from '@workspace/ui/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { codesPromoAPI, paiementAPI, factureAPI } from '../../lib/paiement-api';
import { CodePromoComponent } from '../../components/paiement/CodePromoComponent';
import { PaiementComponent } from '../../components/paiement/PaiementComponent';
import { FactureComponent } from '../../components/paiement/FactureComponent';
import { PaiementProvider } from '../../contexts/PaiementContext';

function TestPaiementContent() {
  const [resultats, setResultats] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const ajouterResultat = (test: string, resultat: any) => {
    setResultats(prev => [...prev, { test, resultat, timestamp: new Date() }]);
  };

  const testCodePromo = async () => {
    setLoading(true);
    try {
      // Test 1: Valider un code promo valide
      const resultat1 = await codesPromoAPI.valider('NOEL2024', 50);
      ajouterResultat('Validation code NOEL2024', resultat1);

      // Test 2: Valider un code promo invalide
      const resultat2 = await codesPromoAPI.valider('INVALID', 50);
      ajouterResultat('Validation code INVALID', resultat2);

      // Test 3: Utiliser un code promo
      if (resultat1.valide && resultat1.codePromo) {
        const resultat3 = await codesPromoAPI.utiliser(resultat1.codePromo.id);
        ajouterResultat('Utilisation code NOEL2024', resultat3);
      }

    } catch (error) {
      ajouterResultat('Erreur test codes promo', { erreur: error });
    }
    setLoading(false);
  };

  const testPaiement = async () => {
    setLoading(true);
    try {
      // Test 1: Initier un paiement
      const donneesPaiement = {
        commande_id: `test-${Date.now()}`,
        montant: 25.50,
        email_client: 'test@example.com',
        nom_client: 'Client Test',
        methode_paiement: 'carte_bancaire' as const,
        adresse_facturation: {
          nom: 'Test',
          prenom: 'Client',
          adresse: '123 Rue de Test',
          ville: 'Paris',
          code_postal: '75001',
          pays: 'France'
        }
      };

      const resultat1 = await paiementAPI.initier(donneesPaiement);
      ajouterResultat('Initier paiement', resultat1);

      // Test 2: Traiter le paiement
      if (resultat1.succes && resultat1.transaction_id) {
        const resultat2 = await paiementAPI.traiter(resultat1.transaction_id, {
          numeroCard: '4242424242424242',
          cvv: '123',
          expirationMois: 12,
          expirationAnnee: 2025
        });
        ajouterResultat('Traiter paiement', resultat2);

        // Test 3: Vérifier le statut
        const resultat3 = await paiementAPI.obtenirStatut(resultat1.transaction_id);
        ajouterResultat('Statut paiement', resultat3);
      }

    } catch (error) {
      ajouterResultat('Erreur test paiement', { erreur: error });
    }
    setLoading(false);
  };

  const testFacture = async () => {
    setLoading(true);
    try {
      // Créer un paiement d'abord
      const donneesPaiement = {
        commande_id: `facture-test-${Date.now()}`,
        montant: 42.90,
        email_client: 'facture@example.com',
        nom_client: 'Client Facture',
        methode_paiement: 'paypal' as const
      };

      const paiementResult = await paiementAPI.initier(donneesPaiement);
      ajouterResultat('Paiement pour facture', paiementResult);

      if (paiementResult.succes && paiementResult.transaction_id) {
        // Traiter le paiement
        await paiementAPI.traiter(paiementResult.transaction_id, { paypal_id: 'test123' });

        // Générer la facture
        const factureResult = await factureAPI.generer(paiementResult.transaction_id);
        ajouterResultat('Génération facture', factureResult);

        // Envoyer la facture
        if (factureResult.succes && factureResult.facture) {
          const envoi = await factureAPI.envoyer(paiementResult.transaction_id, factureResult.facture);
          ajouterResultat('Envoi facture', envoi);
        }
      }

    } catch (error) {
      ajouterResultat('Erreur test facture', { erreur: error });
    }
    setLoading(false);
  };

  const viderResultats = () => {
    setResultats([]);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-boulangerie-bordeaux mb-8">
        Test du Système de Paiement
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Panel de tests */}
        <div className="space-y-6">
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

          {/* Composants de test */}
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
        </div>

        {/* Résultats des tests */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Résultats des Tests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {resultats.length === 0 ? (
                  <p className="text-gray-500 italic">Aucun test effectué</p>
                ) : (
                  resultats.map((resultat, index) => (
                    <div key={index} className="border rounded-lg p-3">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-sm">{resultat.test}</h4>
                        <span className="text-xs text-gray-500">
                          {resultat.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                        {JSON.stringify(resultat.resultat, null, 2)}
                      </pre>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function TestPaiementPage() {
  return (
    <PaiementProvider>
      <TestPaiementContent />
    </PaiementProvider>
  );
}
