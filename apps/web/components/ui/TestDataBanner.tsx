import React from 'react';

interface TestDataBannerProps {
  show: boolean;
}

export function TestDataBanner({ show }: TestDataBannerProps) {
  if (!show) return null;

  return (
    <div className="mt-6 p-4 bg-gradient-or-cream border-2 border-boulangerie-or rounded-xl shadow-or">
      <p className="text-sm text-boulangerie-bordeaux-dark font-medium">
        ⚠️ Mode démo - Données de test utilisées (Strapi non connecté)
      </p>
    </div>
  );
}
