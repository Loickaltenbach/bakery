'use client';

import React from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { Badge } from '@workspace/ui/components/badge';
import { useCommande } from '../../contexts/CommandeContext';
import { ModeRecuperation } from '../../lib/commande-types';
import { formaterCreneau } from '../../lib/commande-utils';
import { formaterPrix } from '../../lib/panier-utils';
import { 
  ShoppingCart, 
  Store, 
  Truck, 
  Calendar, 
  User, 
  Mail, 
  Phone, 
  MapPin,
  Clock,
  Euro
} from 'lucide-react';

export const RecapitulatifStep: React.FC = () => {
  const { processus } = useCommande();

  if (!processus.modeRecuperation || !processus.creneauChoisi || !processus.informationsClient) {
    return (
      <div className="text-center py-20">
        <p className="text-boulangerie-bordeaux-light">
          Informations de commande incomplètes
        </p>
      </div>
    );
  }

  const { modeRecuperation, creneauChoisi, informationsClient, articles, totaux } = processus;
  const estLivraison = modeRecuperation === ModeRecuperation.LIVRAISON;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-artisan font-bold text-boulangerie-bordeaux mb-3">
          Récapitulatif de votre commande
        </h3>
        <p className="text-boulangerie-bordeaux-light font-alsacien">
          Vérifiez les détails avant de finaliser votre commande
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Colonne de gauche - Articles et informations */}
        <div className="lg:col-span-2 space-y-6">
          {/* Articles commandés */}
          <Card className="card-boulangerie">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-boulangerie-bordeaux">
                <ShoppingCart className="w-5 h-5 text-boulangerie-or" />
                Articles commandés ({articles.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {articles.map((article) => {
                  const imageUrl = article.produit.image?.[0]?.url
                    ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${article.produit.image[0].url}`
                    : '/placeholder-product.svg';

                  return (
                    <div key={article.produit.id} className="flex gap-4 p-4 bg-boulangerie-beige rounded-xl">
                      {/* Image */}
                      <div className="flex-shrink-0">
                        <div className="relative w-20 h-20 rounded-xl overflow-hidden shadow-or">
                          <Image
                            src={imageUrl}
                            alt={article.produit.nom}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </div>

                      {/* Informations */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-artisan font-bold text-boulangerie-bordeaux mb-1">
                          {article.produit.nom}
                        </h4>
                        
                        {article.produit.categorie && (
                          <Badge 
                            className="mb-2 text-xs"
                            style={{ 
                              backgroundColor: `${article.produit.categorie.couleur}15`,
                              color: article.produit.categorie.couleur,
                              borderColor: `${article.produit.categorie.couleur}40`
                            }}
                          >
                            {article.produit.categorie.nom}
                          </Badge>
                        )}
                        
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-boulangerie-bordeaux-light">
                            {formaterPrix(article.prixUnitaire)} × {article.quantite}
                          </div>
                          <div className="font-bold text-boulangerie-or">
                            {formaterPrix(article.sousTotal)}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Mode de récupération */}
          <Card className="card-boulangerie">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-boulangerie-bordeaux">
                {estLivraison ? <Truck className="w-5 h-5 text-boulangerie-or" /> : <Store className="w-5 h-5 text-boulangerie-or" />}
                {estLivraison ? 'Livraison à domicile' : 'Retrait en magasin'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 mb-4">
                <Calendar className="w-5 h-5 text-boulangerie-or" />
                <div>
                  <div className="font-medium text-boulangerie-bordeaux">
                    {formaterCreneau(creneauChoisi)}
                  </div>
                </div>
              </div>

              {estLivraison && informationsClient.adresse ? (
                <div className="flex items-start gap-3 p-4 bg-boulangerie-beige rounded-xl">
                  <MapPin className="w-5 h-5 text-boulangerie-or flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium text-boulangerie-bordeaux mb-1">
                      Adresse de livraison
                    </div>
                    <div className="text-sm text-boulangerie-bordeaux-light">
                      {informationsClient.adresse.rue}
                      {informationsClient.adresse.complement && (
                        <>
                          <br />
                          {informationsClient.adresse.complement}
                        </>
                      )}
                      <br />
                      {informationsClient.adresse.codePostal} {informationsClient.adresse.ville}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-3 p-4 bg-boulangerie-beige rounded-xl">
                  <Store className="w-5 h-5 text-boulangerie-or flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium text-boulangerie-bordeaux mb-1">
                      Boulangerie Alsacienne
                    </div>
                    <div className="text-sm text-boulangerie-bordeaux-light">
                      123 rue de la Paix<br />
                      67000 Strasbourg
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Informations client */}
          <Card className="card-boulangerie">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-boulangerie-bordeaux">
                <User className="w-5 h-5 text-boulangerie-or" />
                Vos informations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-boulangerie-or" />
                  <span className="text-boulangerie-bordeaux">
                    {informationsClient.prenom} {informationsClient.nom}
                  </span>
                </div>
                
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-boulangerie-or" />
                  <span className="text-boulangerie-bordeaux">
                    {informationsClient.email}
                  </span>
                </div>
                
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-boulangerie-or" />
                  <span className="text-boulangerie-bordeaux">
                    {informationsClient.telephone}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Colonne de droite - Récapitulatif des prix */}
        <div className="lg:col-span-1">
          <Card className="card-boulangerie sticky top-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-boulangerie-bordeaux">
                <Euro className="w-5 h-5 text-boulangerie-or" />
                Total de la commande
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Sous-total */}
                <div className="flex justify-between items-center">
                  <span className="text-boulangerie-bordeaux">Sous-total</span>
                  <span className="font-medium text-boulangerie-bordeaux">
                    {formaterPrix(totaux.sousTotal)}
                  </span>
                </div>

                {/* TVA */}
                <div className="flex justify-between items-center">
                  <span className="text-boulangerie-bordeaux-light text-sm">TVA (5,5%)</span>
                  <span className="text-sm text-boulangerie-bordeaux-light">
                    {formaterPrix(totaux.taxes)}
                  </span>
                </div>

                {/* Frais de livraison */}
                {estLivraison && (
                  <div className="flex justify-between items-center">
                    <span className="text-boulangerie-bordeaux">Livraison</span>
                    <span className="font-medium text-boulangerie-bordeaux">
                      {totaux.fraisLivraison === 0 ? (
                        <span className="text-green-600">Gratuit</span>
                      ) : (
                        formaterPrix(totaux.fraisLivraison)
                      )}
                    </span>
                  </div>
                )}

                {/* Ligne de séparation */}
                <hr className="border-boulangerie-beige" />

                {/* Total */}
                <div className="flex justify-between items-center">
                  <span className="text-lg font-artisan font-bold text-boulangerie-bordeaux">
                    Total
                  </span>
                  <span className="text-2xl font-bold text-boulangerie-or">
                    {formaterPrix(totaux.total)}
                  </span>
                </div>

                {/* Informations sur la livraison gratuite */}
                {estLivraison && totaux.fraisLivraison === 0 && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-xl">
                    <div className="text-sm text-green-700 text-center">
                      🎉 Livraison gratuite !
                    </div>
                  </div>
                )}

                {/* Temps de préparation estimé */}
                <div className="mt-6 p-4 bg-boulangerie-beige rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-boulangerie-or" />
                    <span className="font-medium text-boulangerie-bordeaux text-sm">
                      Temps de préparation
                    </span>
                  </div>
                  <p className="text-sm text-boulangerie-bordeaux-light">
                    Votre commande sera prête dans environ 30 minutes.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
