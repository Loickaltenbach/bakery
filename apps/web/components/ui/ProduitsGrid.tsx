import React from 'react';
import { ProduitCard } from "../produit-card";
import { Produit } from "../../lib/api";

interface ProduitsGridProps {
  produits: Produit[];
}

export function ProduitsGrid({ produits }: ProduitsGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {produits.map((produit) => (
        <ProduitCard
          key={produit.id}
          produit={produit}
        />
      ))}
    </div>
  );
}
