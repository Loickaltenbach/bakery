'use client';

import React, { useState } from 'react';
import { Button } from '@workspace/ui/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { Badge } from '@workspace/ui/components/badge';
import { usePaiement } from '../../contexts/PaiementContext';
import { formaterCodePromo } from '../../lib/paiement-utils';
import { formaterPrix } from '../../lib/panier-utils';
import { Tag, X, Check, AlertCircle } from 'lucide-react';

interface CodePromoComponentProps {
  className?: string;
  disabled?: boolean;
}

export function CodePromoComponent({ className = "", disabled = false }: CodePromoComponentProps) {
  const { codePromoActuel, appliquerCodePromo, retirerCodePromo, detailsPaiement } = usePaiement();
  const [codeInput, setCodeInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  const handleAppliquerCode = async () => {
    if (!codeInput.trim()) return;

    setIsLoading(true);
    setErreur(null);

    try {
      const succes = await appliquerCodePromo(codeInput.trim().toUpperCase());
      
      if (succes) {
        setCodeInput('');
        setErreur(null);
      } else {
        setErreur('Code promo invalide ou expiré');
      }
    } catch (error) {
      setErreur('Erreur lors de l\'application du code promo');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetirerCode = () => {
    retirerCodePromo();
    setErreur(null);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAppliquerCode();
    }
  };

  return (
    <Card className={`card-boulangerie ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-boulangerie-bordeaux text-lg">
          <Tag className="w-5 h-5 text-boulangerie-or" />
          Code promotionnel
        </CardTitle>
      </CardHeader>
      <CardContent>
        {codePromoActuel ? (
          // Affichage du code promo appliqué
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-green-800">
                      {codePromoActuel.code}
                    </span>
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      {formaterCodePromo(codePromoActuel)}
                    </Badge>
                  </div>
                  <p className="text-sm text-green-600">
                    {codePromoActuel.description}
                  </p>
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRetirerCode}
                disabled={disabled}
                className="text-green-600 hover:text-green-700 hover:bg-green-100"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Affichage de la réduction */}
            {detailsPaiement && detailsPaiement.reduction > 0 && (
              <div className="text-center p-2 bg-boulangerie-or/10 rounded-lg">
                <span className="text-boulangerie-bordeaux font-medium">
                  Économie : {formaterPrix(detailsPaiement.reduction)}
                </span>
              </div>
            )}
          </div>
        ) : (
          // Formulaire de saisie du code promo
          <div className="space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Entrez votre code promo"
                value={codeInput}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCodeInput(e.target.value.toUpperCase())}
                onKeyPress={handleKeyPress}
                disabled={disabled || isLoading}
                className="flex-1 px-3 py-2 border border-boulangerie-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-boulangerie-or"
              />
              <Button
                onClick={handleAppliquerCode}
                disabled={disabled || isLoading || !codeInput.trim()}
                className="btn-boulangerie-primary"
              >
                {isLoading ? 'Vérification...' : 'Appliquer'}
              </Button>
            </div>

            {erreur && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl">
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                <span className="text-sm text-red-600">{erreur}</span>
              </div>
            )}

            {/* Suggestions de codes promo */}
            <div className="mt-4">
              <p className="text-sm text-boulangerie-bordeaux-light mb-2">
                Codes promo disponibles :
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge 
                  variant="outline" 
                  className="cursor-pointer hover:bg-boulangerie-or/10"
                  onClick={() => setCodeInput('BIENVENUE10')}
                >
                  BIENVENUE10 (-10%)
                </Badge>
                <Badge 
                  variant="outline" 
                  className="cursor-pointer hover:bg-boulangerie-or/10"
                  onClick={() => setCodeInput('WEEK5')}
                >
                  WEEK5 (-5€)
                </Badge>
                <Badge 
                  variant="outline" 
                  className="cursor-pointer hover:bg-boulangerie-or/10"
                  onClick={() => setCodeInput('LIVRAISONOFF')}
                >
                  LIVRAISONOFF (livraison gratuite)
                </Badge>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
