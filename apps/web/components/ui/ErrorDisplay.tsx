import React from 'react';
import { Button } from "@workspace/ui/components/button";

interface ErrorDisplayProps {
  error: string;
  onRetry?: () => void;
}

export function ErrorDisplay({ error, onRetry }: ErrorDisplayProps) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <p className="text-lg text-destructive mb-4">{error}</p>
        {onRetry && (
          <Button onClick={onRetry}>
            Réessayer
          </Button>
        )}
      </div>
    </div>
  );
}
