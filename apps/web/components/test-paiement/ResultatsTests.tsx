import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card';

interface Resultat {
  test: string;
  resultat: any;
  timestamp: Date;
}

interface ResultatsTestsProps {
  resultats: Resultat[];
}

export function ResultatsTests({ resultats }: ResultatsTestsProps) {
  return (
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
  );
}
