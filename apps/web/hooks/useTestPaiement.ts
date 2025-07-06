'use client';

import { useState } from 'react';
import { codesPromoAPI, paiementAPI, factureAPI } from '@/lib/paiement-api';

interface Resultat {
  test: string;
  resultat: any;
  timestamp: Date;
}

export function useTestPaiement() {
  const [resultats, setResultats] = useState<Resultat[]>([]);
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

  return {
    // États
    resultats,
    loading,
    
    // Actions
    testCodePromo,
    testPaiement,
    testFacture,
    viderResultats
  };
}
