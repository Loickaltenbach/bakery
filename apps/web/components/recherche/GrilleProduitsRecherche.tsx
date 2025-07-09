import React, { Suspense } from 'react';
import { motion } from 'framer-motion';
import { Star, Clock, Heart, ShoppingCart } from 'lucide-react';

const ProduitCardRecherche = React.lazy(() => import('./ProduitCardRecherche').then(m => ({ default: m.ProduitCardRecherche })))

interface Produit {
  id: number;
  nom: string;
  prix: number;
  description: string;
  categorie: string;
  note: number;
  temps_preparation: string;
  populaire?: boolean;
  nouveau?: boolean;
  tags: string[];
}

interface GrilleProduitsRechercheProps {
  produits: Produit[];
}

export function GrilleProduitsRecherche({ produits }: GrilleProduitsRechercheProps) {
  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
    >
      <Suspense fallback={<div className="py-12 text-center">Chargement...</div>}>
        {produits.map((produit, index) => (
          <ProduitCardRecherche key={produit.id} produit={produit} index={index} />
        ))}
      </Suspense>
    </motion.div>
  );
}
