import React from 'react';
import { Button } from "@workspace/ui/components/button";
import { ShoppingCart } from "lucide-react";
import { usePanier } from "../../contexts/PanierContext";

export function PanierButton() {
  const { panier, togglePanier } = usePanier();

  return (
    <Button
      onClick={togglePanier}
          className="fixed top-4 right-4 z-30 h-14 w-14 rounded-full p-0 shadow-elevation bg-boulangerie-bordeaux-light hover:scale-105 transition-all duration-300"
      size="sm"
    >
      <ShoppingCart className="h-6 w-6 text-white" />
      {panier.totalItems > 0 && (
        <span className="absolute -top-2 -right-2 h-7 w-7 rounded-full bg-boulangerie-or text-boulangerie-bordeaux-dark text-xs font-bold flex items-center justify-center border-2 border-white shadow-or animate-pulse">
          {panier.totalItems}
        </span>
      )}
    </Button>
  );
}
