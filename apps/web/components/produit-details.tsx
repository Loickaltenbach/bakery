'use client';

import React from 'react';
import { Badge } from '@workspace/ui/components/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { 
  AlertTriangle, 
  Calendar, 
  Clock, 
  Info, 
  Leaf, 
  Scale,
  Star,
  Zap 
} from 'lucide-react';

interface ProduitDetailsProps {
  produit: any;
}

export function ProduitDetails({ produit }: ProduitDetailsProps) {
  const {
    allergenes = [],
    informationsNutritionnelles = {},
    regimesCompatibles = [],
    disponibiliteJours = {},
    produitSaisonnier,
    dateDebutSaison,
    dateFinSaison,
    nouveaute,
    promotion,
    poids,
    unite,
    tempsPreparation
  } = produit;

  const joursDisponibles = Object.entries(disponibiliteJours)
    .filter(([_, disponible]) => disponible)
    .map(([jour]) => jour);

  const allergenesListe = Array.isArray(allergenes) ? allergenes : [];
  const regimesListe = Array.isArray(regimesCompatibles) ? regimesCompatibles : [];

  return (
    <div className="space-y-6">
      {/* Badges de statut */}
      <div className="flex flex-wrap gap-2">
        {nouveaute && (
          <Badge variant="default" className="bg-yellow-500 text-white flex items-center gap-1">
            <Star className="w-3 h-3" />
            Nouveauté
          </Badge>
        )}
        {produitSaisonnier && (
          <Badge variant="outline" className="border-green-500 text-green-700 flex items-center gap-1">
            <Leaf className="w-3 h-3" />
            Saisonnier
          </Badge>
        )}
        {promotion?.active && (
          <Badge variant="default" className="bg-red-500 text-white flex items-center gap-1">
            <Zap className="w-3 h-3" />
            Promotion {promotion.pourcentage}%
          </Badge>
        )}
      </div>

      {/* Informations de base */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="w-5 h-5" />
            Informations produit
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {poids && (
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-gray-500" />
              <span className="text-sm">
                Poids : {poids} {unite === 'gramme' ? 'g' : unite === 'kilogramme' ? 'kg' : unite === 'litre' ? 'L' : 'pièce'}
              </span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-500" />
            <span className="text-sm">
              Temps de préparation : {tempsPreparation} minutes
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Disponibilité */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Disponibilité
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <h4 className="text-sm font-medium mb-2">Jours de disponibilité :</h4>
              <div className="flex flex-wrap gap-1">
                {joursDisponibles.length > 0 ? (
                  joursDisponibles.map((jour) => (
                    <Badge key={jour} variant="secondary" className="text-xs">
                      {jour.charAt(0).toUpperCase() + jour.slice(1)}
                    </Badge>
                  ))
                ) : (
                  <span className="text-sm text-gray-500">Disponible tous les jours</span>
                )}
              </div>
            </div>

            {produitSaisonnier && dateDebutSaison && dateFinSaison && (
              <div>
                <h4 className="text-sm font-medium mb-2">Période saisonnière :</h4>
                <p className="text-sm text-gray-600">
                  Du {new Date(dateDebutSaison).toLocaleDateString('fr-FR')} 
                  au {new Date(dateFinSaison).toLocaleDateString('fr-FR')}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Allergènes et régimes */}
      {(allergenesListe.length > 0 || regimesListe.length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Allergènes & Régimes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {allergenesListe.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2 text-red-600">Contient :</h4>
                <div className="flex flex-wrap gap-1">
                  {allergenesListe.map((allergene) => (
                    <Badge key={allergene} variant="destructive" className="text-xs">
                      {allergene}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {regimesListe.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2 text-green-600">Compatible avec :</h4>
                <div className="flex flex-wrap gap-1">
                  {regimesListe.map((regime) => (
                    <Badge key={regime} variant="outline" className="text-xs border-green-500 text-green-700">
                      {regime}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Informations nutritionnelles */}
      {informationsNutritionnelles && Object.keys(informationsNutritionnelles).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Valeurs nutritionnelles (pour 100g)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {informationsNutritionnelles.calories && (
                <div className="flex justify-between">
                  <span>Calories :</span>
                  <span className="font-medium">{informationsNutritionnelles.calories} kcal</span>
                </div>
              )}
              {informationsNutritionnelles.proteines && (
                <div className="flex justify-between">
                  <span>Protéines :</span>
                  <span className="font-medium">{informationsNutritionnelles.proteines} g</span>
                </div>
              )}
              {informationsNutritionnelles.glucides && (
                <div className="flex justify-between">
                  <span>Glucides :</span>
                  <span className="font-medium">{informationsNutritionnelles.glucides} g</span>
                </div>
              )}
              {informationsNutritionnelles.lipides && (
                <div className="flex justify-between">
                  <span>Lipides :</span>
                  <span className="font-medium">{informationsNutritionnelles.lipides} g</span>
                </div>
              )}
              {informationsNutritionnelles.fibres && (
                <div className="flex justify-between">
                  <span>Fibres :</span>
                  <span className="font-medium">{informationsNutritionnelles.fibres} g</span>
                </div>
              )}
              {informationsNutritionnelles.sel && (
                <div className="flex justify-between">
                  <span>Sel :</span>
                  <span className="font-medium">{informationsNutritionnelles.sel} g</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
