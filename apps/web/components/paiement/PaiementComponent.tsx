'use client';

import React, { useState } from 'react';
import { Button } from '@workspace/ui/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { usePaiement } from '../../contexts/PaiementContext';
import { MethodePaiement, DonneesPaiementCarte } from '../../lib/paiement-types';
import { validerNumeroCarte, masquerNumeroCarte } from '../../lib/paiement-utils';
import { formaterPrix } from '../../lib/panier-utils';
import { 
  CreditCard, 
  Shield, 
  Lock, 
  AlertCircle, 
  CheckCircle, 
  Loader2 
} from 'lucide-react';

interface PaiementComponentProps {
  onSuccess: (transactionId: string) => void;
  onCancel: () => void;
  disabled?: boolean;
}

export function PaiementComponent({ onSuccess, onCancel, disabled = false }: PaiementComponentProps) {
  const { paiementEnCours, detailsPaiement, traiterPaiement } = usePaiement();
  const [methodePaiement, setMethodePaiement] = useState<MethodePaiement>(MethodePaiement.CARTE_BANCAIRE);
  const [isProcessing, setIsProcessing] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  
  // État pour les données de carte
  const [donneesCarte, setDonneesCarte] = useState<DonneesPaiementCarte>({
    numeroCard: '',
    expirationMois: 1,
    expirationAnnee: new Date().getFullYear(),
    cvv: '',
    nomPorteur: ''
  });

  const [erreursCarte, setErreursCarte] = useState<{[key: string]: string}>({});

  if (!paiementEnCours || !detailsPaiement) {
    return (
      <Card className="card-boulangerie">
        <CardContent className="p-6 text-center">
          <AlertCircle className="w-12 h-12 text-boulangerie-bordeaux-light mx-auto mb-4" />
          <p className="text-boulangerie-bordeaux">
            Aucun paiement en cours
          </p>
        </CardContent>
      </Card>
    );
  }

  const validerDonneesCarte = (): boolean => {
    const erreurs: {[key: string]: string} = {};

    if (!validerNumeroCarte(donneesCarte.numeroCard)) {
      erreurs.numeroCard = 'Numéro de carte invalide';
    }

    if (donneesCarte.expirationMois < 1 || donneesCarte.expirationMois > 12) {
      erreurs.expirationMois = 'Mois d\'expiration invalide';
    }

    if (donneesCarte.expirationAnnee < new Date().getFullYear()) {
      erreurs.expirationAnnee = 'Année d\'expiration invalide';
    }

    if (!/^\d{3,4}$/.test(donneesCarte.cvv)) {
      erreurs.cvv = 'CVV invalide';
    }

    if (!donneesCarte.nomPorteur.trim()) {
      erreurs.nomPorteur = 'Nom du porteur requis';
    }

    setErreursCarte(erreurs);
    return Object.keys(erreurs).length === 0;
  };

  const handlePaiement = async () => {
    if (methodePaiement === MethodePaiement.CARTE_BANCAIRE && !validerDonneesCarte()) {
      return;
    }

    setIsProcessing(true);
    setErreur(null);

    try {
      const succes = await traiterPaiement(
        methodePaiement, 
        methodePaiement === MethodePaiement.CARTE_BANCAIRE ? donneesCarte : null
      );

      if (succes && paiementEnCours.transactionId) {
        onSuccess(paiementEnCours.transactionId);
      } else {
        setErreur('Le paiement a échoué. Veuillez réessayer.');
      }
    } catch (error) {
      setErreur('Erreur lors du traitement du paiement');
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  return (
    <div className="space-y-6">
      {/* Résumé du montant */}
      <Card className="card-boulangerie">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-boulangerie-bordeaux">
            <Shield className="w-5 h-5 text-boulangerie-or" />
            Paiement sécurisé
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-boulangerie-bordeaux">Sous-total :</span>
              <span className="text-boulangerie-bordeaux">
                {formaterPrix(detailsPaiement.sousTotal)}
              </span>
            </div>
            
            {detailsPaiement.reduction > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Réduction :</span>
                <span>-{formaterPrix(detailsPaiement.reduction)}</span>
              </div>
            )}
            
            <div className="flex justify-between text-sm">
              <span className="text-boulangerie-bordeaux-light">TVA (5,5%) :</span>
              <span className="text-boulangerie-bordeaux-light">
                {formaterPrix(detailsPaiement.montantTVA)}
              </span>
            </div>
            
            <div className="border-t pt-3 flex justify-between items-center">
              <span className="text-lg font-bold text-boulangerie-bordeaux">Total :</span>
              <span className="text-xl font-bold text-boulangerie-or">
                {formaterPrix(detailsPaiement.total)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Méthodes de paiement */}
      <Card className="card-boulangerie">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-boulangerie-bordeaux">
            <CreditCard className="w-5 h-5 text-boulangerie-or" />
            Méthode de paiement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Sélecteur de méthode */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <button
                onClick={() => setMethodePaiement(MethodePaiement.CARTE_BANCAIRE)}
                className={`p-4 border-2 rounded-xl transition-colors ${
                  methodePaiement === MethodePaiement.CARTE_BANCAIRE
                    ? 'border-boulangerie-or bg-boulangerie-or/10'
                    : 'border-boulangerie-beige hover:border-boulangerie-or/50'
                }`}
                disabled={disabled || isProcessing}
              >
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-boulangerie-or" />
                  <span className="font-medium text-boulangerie-bordeaux">
                    Carte bancaire
                  </span>
                </div>
              </button>

              <button
                onClick={() => setMethodePaiement(MethodePaiement.PAYPAL)}
                className={`p-4 border-2 rounded-xl transition-colors ${
                  methodePaiement === MethodePaiement.PAYPAL
                    ? 'border-boulangerie-or bg-boulangerie-or/10'
                    : 'border-boulangerie-beige hover:border-boulangerie-or/50'
                }`}
                disabled={disabled || isProcessing}
              >
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-blue-600 rounded"></div>
                  <span className="font-medium text-boulangerie-bordeaux">
                    PayPal
                  </span>
                </div>
              </button>
            </div>

            {/* Formulaire de carte bancaire */}
            {methodePaiement === MethodePaiement.CARTE_BANCAIRE && (
              <div className="space-y-4 mt-6">
                <div>
                  <label className="block text-sm font-medium text-boulangerie-bordeaux mb-2">
                    Numéro de carte
                  </label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    value={formatCardNumber(donneesCarte.numeroCard)}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                      setDonneesCarte(prev => ({ 
                        ...prev, 
                        numeroCard: e.target.value.replace(/\s/g, '') 
                      }))
                    }
                    disabled={disabled || isProcessing}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-boulangerie-or ${
                      erreursCarte.numeroCard ? 'border-red-300' : 'border-boulangerie-beige'
                    }`}
                    maxLength={19}
                  />
                  {erreursCarte.numeroCard && (
                    <p className="text-sm text-red-600 mt-1">{erreursCarte.numeroCard}</p>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-boulangerie-bordeaux mb-2">
                      Mois
                    </label>
                    <select
                      value={donneesCarte.expirationMois}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
                        setDonneesCarte(prev => ({ 
                          ...prev, 
                          expirationMois: parseInt(e.target.value) 
                        }))
                      }
                      disabled={disabled || isProcessing}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-boulangerie-or ${
                        erreursCarte.expirationMois ? 'border-red-300' : 'border-boulangerie-beige'
                      }`}
                    >
                      {Array.from({ length: 12 }, (_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {String(i + 1).padStart(2, '0')}
                        </option>
                      ))}
                    </select>
                    {erreursCarte.expirationMois && (
                      <p className="text-sm text-red-600 mt-1">{erreursCarte.expirationMois}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-boulangerie-bordeaux mb-2">
                      Année
                    </label>
                    <select
                      value={donneesCarte.expirationAnnee}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
                        setDonneesCarte(prev => ({ 
                          ...prev, 
                          expirationAnnee: parseInt(e.target.value) 
                        }))
                      }
                      disabled={disabled || isProcessing}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-boulangerie-or ${
                        erreursCarte.expirationAnnee ? 'border-red-300' : 'border-boulangerie-beige'
                      }`}
                    >
                      {Array.from({ length: 10 }, (_, i) => {
                        const year = new Date().getFullYear() + i;
                        return (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        );
                      })}
                    </select>
                    {erreursCarte.expirationAnnee && (
                      <p className="text-sm text-red-600 mt-1">{erreursCarte.expirationAnnee}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-boulangerie-bordeaux mb-2">
                      CVV
                    </label>
                    <input
                      type="text"
                      placeholder="123"
                      value={donneesCarte.cvv}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                        setDonneesCarte(prev => ({ 
                          ...prev, 
                          cvv: e.target.value.replace(/\D/g, '') 
                        }))
                      }
                      disabled={disabled || isProcessing}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-boulangerie-or ${
                        erreursCarte.cvv ? 'border-red-300' : 'border-boulangerie-beige'
                      }`}
                      maxLength={4}
                    />
                    {erreursCarte.cvv && (
                      <p className="text-sm text-red-600 mt-1">{erreursCarte.cvv}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-boulangerie-bordeaux mb-2">
                    Nom du porteur
                  </label>
                  <input
                    type="text"
                    placeholder="Jean Dupont"
                    value={donneesCarte.nomPorteur}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                      setDonneesCarte(prev => ({ 
                        ...prev, 
                        nomPorteur: e.target.value 
                      }))
                    }
                    disabled={disabled || isProcessing}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-boulangerie-or ${
                      erreursCarte.nomPorteur ? 'border-red-300' : 'border-boulangerie-beige'
                    }`}
                  />
                  {erreursCarte.nomPorteur && (
                    <p className="text-sm text-red-600 mt-1">{erreursCarte.nomPorteur}</p>
                  )}
                </div>
              </div>
            )}

            {/* Message d'erreur général */}
            {erreur && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl">
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                <span className="text-sm text-red-600">{erreur}</span>
              </div>
            )}

            {/* Sécurité */}
            <div className="flex items-center gap-2 text-sm text-boulangerie-bordeaux-light">
              <Lock className="w-4 h-4" />
              <span>Paiement sécurisé par SSL</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-3">
        <Button
          variant="secondary"
          onClick={onCancel}
          disabled={isProcessing}
          className="flex-1"
        >
          Annuler
        </Button>
        
        <Button
          onClick={handlePaiement}
          disabled={disabled || isProcessing}
          className="flex-1 btn-boulangerie-primary"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Traitement...
            </>
          ) : (
            <>
              <Lock className="w-4 h-4 mr-2" />
              Payer {formaterPrix(detailsPaiement.total)}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
