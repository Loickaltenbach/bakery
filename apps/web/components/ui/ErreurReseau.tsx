// apps/web/components/ui/ErreurReseau.tsx
import React from 'react';

interface ErreurReseauProps {
  message?: string;
  onRetry?: () => void;
}

export function ErreurReseau({ message = "Impossible de charger les données. Veuillez réessayer.", onRetry }: ErreurReseauProps) {
  return (
    <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 text-center">
      <p className="mb-2">{message}</p>
      {onRetry && (
        <button
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          onClick={onRetry}
        >
          Réessayer
        </button>
      )}
    </div>
  );
}
