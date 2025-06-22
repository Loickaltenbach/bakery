'use client';

import React from 'react';
import Image from 'next/image';
import { Button } from '@workspace/ui/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { usePanier } from '../contexts/PanierContext';
import { useCommande } from '../contexts/CommandeContext';
import { convertirPanierEnArticles } from '../lib/commande-utils';
import { formaterPrix } from '../lib/panier-utils';
import { X, Plus, Minus, ShoppingCart, Trash2 } from 'lucide-react';

interface PanierDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onStartCommande: () => void;
}

export const PanierDrawer: React.FC<PanierDrawerProps> = ({ isOpen, onClose, onStartCommande }) => {
  const { panier, modifierQuantite, retirerProduit, viderPanier } = usePanier();
  const { initialiserCommande } = useCommande();

  const handleQuantiteChange = (produitId: number, delta: number) => {
    const currentQuantite = panier.items.find(item => item.produit.id === produitId)?.quantite || 0;
    const nouvelleQuantite = currentQuantite + delta;
    
    if (nouvelleQuantite > 0) {
      modifierQuantite(produitId, nouvelleQuantite);
    } else {
      retirerProduit(produitId);
    }
  };

  const handleCommander = () => {
    // Convertir les articles du panier en articles de commande
    const articles = convertirPanierEnArticles(panier.items);
    initialiserCommande(articles);
    onClose(); // Fermer le panier
    onStartCommande(); // Ouvrir le processus de commande
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
              className="fixed inset-0 bg-boulangerie-bordeaux-light bg-opacity-60 z-40 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-96 bg-boulangerie-cream z-50 shadow-elevation drawer-slide-in border-l-4 border-boulangerie-or">
        <div className="flex flex-col h-full">
          {/* Header */}
                  <div className="bg-boulangerie-or p-6 relative">
            <div className="absolute inset-0 bg-pattern-alsacien opacity-20"></div>
            <div className="relative z-10 flex items-center justify-between">
              <h2 className="text-xl font-artisan font-bold text-white flex items-center gap-3">
                <ShoppingCart className="h-6 w-6" />
                Mon Panier ({panier.totalItems})
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-10 w-10 p-0 text-white hover:bg-white/20 rounded-full"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Contenu */}
          <div className="flex-1 overflow-y-auto p-6">
            {panier.items.length === 0 ? (
              <div className="text-center py-12">
                <div className="bg-boulangerie-beige rounded-2xl p-8 shadow-or">
                  <div className="text-6xl mb-4">🛒</div>
                  <p className="text-boulangerie-bordeaux font-alsacien font-semibold text-lg mb-2">
                    Votre panier est vide
                  </p>
                  <p className="text-sm text-boulangerie-bordeaux-light">
                    Découvrez nos délicieuses spécialités
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {panier.items.map((item) => {
                  const { produit, quantite, sousTotal } = item;
                  const imageUrl = produit.image?.[0]?.url
                    ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${produit.image[0].url}`
                    : '/placeholder-product.svg';

                  return (
                    <Card key={produit.id} className="card-boulangerie p-4 hover:shadow-or transition-all duration-300">
                      <div className="flex gap-4">
                        {/* Image */}
                        <div className="flex-shrink-0">
                          <div className="relative w-16 h-16 rounded-xl overflow-hidden shadow-or">
                            <Image
                              src={imageUrl}
                              alt={produit.nom}
                              fill
                              className="object-cover"
                            />
                          </div>
                        </div>

                        {/* Contenu */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-artisan font-bold text-boulangerie-bordeaux text-sm leading-tight mb-1">
                            {produit.nom}
                          </h3>
                          <p className="text-xs text-boulangerie-bordeaux-light font-alsacien mb-3">
                            {formaterPrix(produit.prix)} × {quantite}
                          </p>
                          
                          {/* Contrôles quantité */}
                          <div className="flex items-center gap-2">
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => handleQuantiteChange(produit.id, -1)}
                              className="h-10 w-10 bg-boulangerie-bordeaux-light"
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            
                            <span className="text-sm font-bold text-boulangerie-bordeaux w-6 text-center">
                              {quantite}
                            </span>
                            
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => handleQuantiteChange(produit.id, 1)}
                              className="h-10 w-10 bg-boulangerie-bordeaux-light"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>

                        {/* Prix total */}
                        <div className="text-right">
                          <p className="font-bold text-boulangerie-or text-sm">
                            {formaterPrix(sousTotal)}
                          </p>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          {panier.items.length > 0 && (
            <div className="border-t-2 border-boulangerie-or bg-boulangerie-beige p-6 space-y-4">
              {/* Total */}
              <div className="flex justify-between items-center">
                <span className="text-xl font-artisan font-bold text-boulangerie-bordeaux">Total :</span>
                <span className="text-2xl font-bold text-boulangerie-or">{formaterPrix(panier.totalPrice)}</span>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <Button 
                  className="w-full btn-boulangerie-primary text-lg font-medium py-4 shadow-elevation"
                  onClick={handleCommander}
                >
                  Commander ({formaterPrix(panier.totalPrice)})
                </Button>
                
                <Button
                  variant="secondary"
                  className="w-full bg-boulangerie-bordeaux-light py-3 font-medium"
                  onClick={viderPanier}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Vider le panier
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
