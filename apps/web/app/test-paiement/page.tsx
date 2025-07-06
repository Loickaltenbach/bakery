'use client';

import React from 'react';
import { useTestPaiement } from '@/hooks/useTestPaiement';
import { PaiementProvider } from '@/contexts/PaiementContext';
import { PanelTests } from '@/components/test-paiement/PanelTests';
import { ComposantsPaiement } from '@/components/test-paiement/ComposantsPaiement';
import { ResultatsTests } from '@/components/test-paiement/ResultatsTests';

function TestPaiementContent() {
  const {
    resultats,
    loading,
    testCodePromo,
    testPaiement,
    testFacture,
    viderResultats
  } = useTestPaiement();

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-boulangerie-bordeaux mb-8">
        Test du Système de Paiement
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Panel de tests */}
        <div className="space-y-6">
          <PanelTests
            loading={loading}
            testCodePromo={testCodePromo}
            testPaiement={testPaiement}
            testFacture={testFacture}
            viderResultats={viderResultats}
          />

          <ComposantsPaiement />
        </div>

        {/* Résultats des tests */}
        <div>
          <ResultatsTests resultats={resultats} />
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
