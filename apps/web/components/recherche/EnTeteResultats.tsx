import React from 'react';

interface EnTeteResultatsProps {
  nombreResultats: number;
  recherche: string;
}

export function EnTeteResultats({ nombreResultats, recherche }: EnTeteResultatsProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      <h2 className="text-2xl font-artisan font-bold text-boulangerie-bordeaux">
        {nombreResultats} résultat{nombreResultats > 1 ? "s" : ""} trouvé{nombreResultats > 1 ? "s" : ""}
        {recherche && ` pour "${recherche}"`}
      </h2>
    </div>
  );
}
