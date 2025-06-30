'use client';

import React, { useState, useEffect } from 'react';
import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { Calendar, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import { useHoraires } from '@/hooks/useStrapi';

interface SelectionCreneauProps {
  categorieSlug?: string;
  onCreneauSelected: (creneau: any) => void;
  selectedCreneau?: any;
}

export function SelectionCreneau({ 
  categorieSlug, 
  onCreneauSelected, 
  selectedCreneau 
}: SelectionCreneauProps) {
  const [dateSelectionnee, setDateSelectionnee] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [creneauxDisponibles, setCreneauxDisponibles] = useState([]);
  const [loadingCreneaux, setLoadingCreneaux] = useState(false);
  const [errorCreneaux, setErrorCreneaux] = useState<string | null>(null);

  const { horaires, getCreneauxDisponibles } = useHoraires();

  const fetchCreneaux = async () => {
    if (!dateSelectionnee) return;
    
    setLoadingCreneaux(true);
    setErrorCreneaux(null);
    
    try {
      const result = await getCreneauxDisponibles(dateSelectionnee, categorieSlug);
      setCreneauxDisponibles(result.creneaux || []);
      
      if (result.fermetureExceptionnelle || result.ferme) {
        setErrorCreneaux(result.message || 'Aucun créneau disponible ce jour-là');
      }
    } catch (error: any) {
      setErrorCreneaux(error.message || 'Erreur lors du chargement des créneaux');
      setCreneauxDisponibles([]);
    } finally {
      setLoadingCreneaux(false);
    }
  };

  useEffect(() => {
    fetchCreneaux();
  }, [dateSelectionnee, categorieSlug]);

  // Générer les dates disponibles (7 prochains jours)
  const datesDisponibles = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return {
      value: date.toISOString().split('T')[0],
      label: date.toLocaleDateString('fr-FR', { 
        weekday: 'long', 
        day: 'numeric', 
        month: 'long' 
      }),
      isToday: i === 0
    };
  });

  return (
    <div className="space-y-6">
      {/* Statut d'ouverture actuel */}
      {horaires && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              {horaires.statut === 'ouvert' ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <AlertCircle className="w-5 h-5 text-orange-500" />
              )}
              <div>
                <p className="font-medium">
                  {horaires.statut === 'ouvert' ? 'Ouvert actuellement' : 'Fermé actuellement'}
                </p>
                <p className="text-sm text-gray-600">{horaires.message}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sélection de la date */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Choisir une date de retrait
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {datesDisponibles.map((date) => (
              <Button
                key={date.value}
                variant={dateSelectionnee === date.value ? 'default' : 'outline'}
                onClick={() => setDateSelectionnee(date.value)}
                className="h-auto p-3 text-left justify-start"
              >
                <div>
                  <div className="font-medium">{date.label}</div>
                  {date.isToday && (
                    <Badge variant="secondary" className="mt-1 text-xs">
                      Aujourd&apos;hui
                    </Badge>
                  )}
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Sélection du créneau */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Choisir un créneau horaire
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loadingCreneaux ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-boulangerie-or"></div>
              <p className="mt-2 text-sm text-gray-600">Chargement des créneaux...</p>
            </div>
          ) : errorCreneaux ? (
            <div className="text-center py-8">
              <AlertCircle className="w-12 h-12 text-orange-500 mx-auto mb-3" />
              <p className="text-red-600 mb-4">{errorCreneaux}</p>
              <Button variant="outline" onClick={fetchCreneaux}>
                Réessayer
              </Button>
            </div>
          ) : creneauxDisponibles.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">Aucun créneau disponible pour cette date</p>
              <p className="text-sm text-gray-500 mt-1">
                Essayez une autre date ou contactez-nous directement
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-4">
                {creneauxDisponibles.map((creneau: any) => (
                  <Button
                    key={creneau.dateHeure}
                    variant={
                      selectedCreneau?.dateHeure === creneau.dateHeure 
                        ? 'default' 
                        : 'outline'
                    }
                    onClick={() => onCreneauSelected(creneau)}
                    className="h-auto p-3"
                    disabled={!creneau.disponible}
                  >
                    <div className="text-center">
                      <div className="font-medium">{creneau.heure}</div>
                      {creneau.minutesRestantes < 120 && (
                        <div className="text-xs text-orange-600 mt-1">
                          Dans {creneau.minutesRestantes}min
                        </div>
                      )}
                    </div>
                  </Button>
                ))}
              </div>

              <div className="text-sm text-gray-600 space-y-1">
                <p>• Les créneaux sont disponibles par intervalles de 15-30 minutes</p>
                <p>• Délai minimum de préparation requis selon le type de produit</p>
                {categorieSlug && (
                  <p>• Délai spécifique pour la catégorie sélectionnée</p>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Créneau sélectionné */}
      {selectedCreneau && (
        <Card className="border-boulangerie-or bg-yellow-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <div>
                <p className="font-medium">Créneau sélectionné</p>
                <p className="text-sm text-gray-600">
                  {new Date(selectedCreneau.dateHeure).toLocaleDateString('fr-FR', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long'
                  })} à {selectedCreneau.heure}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
