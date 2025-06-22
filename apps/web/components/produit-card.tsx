'use client';

import React from 'react';
import Image from 'next/image';
import { Button } from '@workspace/ui/components/button';
import { Badge } from '@workspace/ui/components/badge';
import { Produit } from '../lib/api';
import { usePanier } from '../contexts/PanierContext';
import { formaterPrix } from '../lib/panier-utils';
import { Plus, Check, Minus } from 'lucide-react';

interface ProduitCardProps {
  produit: Produit;
}

export function ProduitCard({ produit }: ProduitCardProps): React.JSX.Element {
  const { nom, description, prix, image } = produit;
  const { ajouterProduit, isInPanier, getQuantite, modifierQuantite, retirerProduit } = usePanier();

  // Construction de l'URL de l'image
  const imageUrl = image?.[0]?.url
    ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${image[0].url}`
    : '/placeholder-product.svg';

  const quantiteActuelle = getQuantite(produit.id);
  const estDansPanier = isInPanier(produit.id);

  const handleAjouterAuPanier = () => {
    ajouterProduit(produit, 1);
  };

  const handleModifierQuantite = (delta: number) => {
    const nouvelleQuantite = quantiteActuelle + delta;
    
    if (nouvelleQuantite > 0) {
      modifierQuantite(produit.id, nouvelleQuantite);
    } else {
      // Si la quantité devient 0 ou moins, retirer le produit du panier
      retirerProduit(produit.id);
    }
  };

  return (
    <div className="group overflow-hidden rounded-xl card-boulangerie transition-all duration-300 hover:shadow-elevation">
      <div className="p-0">
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={imageUrl}
            alt={image?.[0]?.alternativeText || nom}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {/* Badge quantité si dans le panier */}
          {estDansPanier && (
            <div className="absolute top-3 right-3 bg-boulangerie-or text-boulangerie-bordeaux-dark px-3 py-1 rounded-full font-bold text-sm shadow-or">
              {quantiteActuelle}
            </div>
          )}
        </div>
      </div>
      
      <div className="p-6">
        {/* Badge de catégorie */}
        {produit.categorie && (
          <Badge 
            className="mb-3 px-3 py-1 rounded-full font-medium text-xs border"
            style={{ 
              backgroundColor: `${produit.categorie.couleur}15`,
              color: produit.categorie.couleur,
              borderColor: `${produit.categorie.couleur}40`
            }}
          >
            {produit.categorie.nom}
          </Badge>
        )}
        
        <h3 className="text-xl font-artisan font-bold text-boulangerie-bordeaux leading-tight line-clamp-1 mb-3">
          {nom}
        </h3>
        <p className="line-clamp-3 text-sm text-boulangerie-bordeaux-light font-alsacien leading-relaxed mb-6">
          {description}
        </p>
        <div className="flex items-center justify-between mb-4">
          <span className="text-3xl font-bold text-boulangerie-or">
            {prix?.toFixed(2)} €
          </span>
        </div>
      </div>
      
      <div className="p-6 pt-0">
        {!estDansPanier ? (
          <Button 
            onClick={handleAjouterAuPanier}
            className="w-full btn-boulangerie-primary font-medium py-3 text-base"
          >
            <Plus className="text-white w-4 h-4 mr-2" />
            Ajouter au panier
          </Button>
        ) : (
          <div className="flex items-center justify-between bg-boulangerie-beige rounded-xl p-3">
            <Button
              onClick={() => handleModifierQuantite(-1)}
              variant="secondary"
              size="sm"
              className="h-10 w-10 bg-boulangerie-bordeaux-light"
            >
              <Minus className="text-white w-4 h-4" />
            </Button>
            
            <span className="text-lg font-bold text-boulangerie-bordeaux px-4">
              {quantiteActuelle}
            </span>
            
            <Button
              onClick={() => handleModifierQuantite(1)}
              variant="secondary"
              size="sm"
              className="h-10 w-10 bg-boulangerie-bordeaux-light"
            >
              <Plus className="text-white w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
