'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@workspace/ui/components/card';
import { Button } from '@workspace/ui/components/button';
import { useCommande } from '../../contexts/CommandeContext';
import { CreneauHoraire, ModeRecuperation } from '../../lib/commande-types';
import { genererCreneauxDisponibles, formaterCreneau } from '../../lib/commande-utils';
import { Calendar, Clock, ChevronLeft, ChevronRight } from 'lucide-react';

export const CreneauStep: React.FC = () => {
  const { processus, definirCreneau } = useCommande();
  const [creneauxDisponibles, setCreneauxDisponibles] = useState<CreneauHoraire[]>([]);
  const [jourSelectionne, setJourSelectionne] = useState<string>('');
  const [loading, setLoading] = useState(true);

  // Charger les créneaux disponibles
  useEffect(() => {
    setLoading(true);
    const creneaux = genererCreneauxDisponibles(ModeRecuperation.RETRAIT, 7);
    setCreneauxDisponibles(creneaux);
    
    // Sélectionner le premier jour disponible
    if (creneaux.length > 0 && !jourSelectionne) {
      const premierCreneau = creneaux[0];
      if (premierCreneau) {
        const premierJour = premierCreneau.debut.toISOString().split('T')[0];
        if (premierJour) {
          setJourSelectionne(premierJour);
        }
      }
    }
    setLoading(false);
  }, [jourSelectionne]);

  // Grouper les créneaux par jour
  const creneauxParJour = creneauxDisponibles.reduce((acc, creneau) => {
    const jour = creneau.debut.toISOString().split('T')[0];
    if (jour) {
      if (!acc[jour]) {
        acc[jour] = [];
      }
      acc[jour].push(creneau);
    }
    return acc;
  }, {} as Record<string, CreneauHoraire[]>);

  const joursDisponibles = Object.keys(creneauxParJour).sort();
  const creneauxDuJour = jourSelectionne ? (creneauxParJour[jourSelectionne] || []) : [];

  const handleSelectionCreneau = (creneau: CreneauHoraire) => {
    definirCreneau(creneau);
  };

  const formaterJour = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });
  };

  const formaterHeure = (creneau: CreneauHoraire) => {
    return `${creneau.debut.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} - ${creneau.fin.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
  };

  const naviguerJour = (direction: 'prev' | 'next') => {
    const indexActuel = joursDisponibles.indexOf(jourSelectionne);
    let nouvelIndex = indexActuel;
    
    if (direction === 'prev' && indexActuel > 0) {
      nouvelIndex = indexActuel - 1;
    } else if (direction === 'next' && indexActuel < joursDisponibles.length - 1) {
      nouvelIndex = indexActuel + 1;
    }
    
    if (nouvelIndex !== indexActuel) {
      const nouveauJour = joursDisponibles[nouvelIndex];
      if (nouveauJour) {
        setJourSelectionne(nouveauJour);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-boulangerie-or border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-boulangerie-bordeaux-light">
            Chargement des créneaux disponibles...
          </p>
        </div>
      </div>
    );
  }

  if (creneauxDisponibles.length === 0) {
    return (
      <div className="text-center py-20">
        <Calendar className="w-16 h-16 text-boulangerie-bordeaux-light mx-auto mb-6" />
        <h3 className="text-xl font-artisan font-bold text-boulangerie-bordeaux mb-3">
          Aucun créneau disponible
        </h3>
        <p className="text-boulangerie-bordeaux-light font-alsacien">
          Nous sommes désolés, aucun créneau n&apos;est disponible pour le retrait en magasin.
          Veuillez réessayer plus tard.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-artisan font-bold text-boulangerie-bordeaux mb-3">
          Choisissez votre créneau
        </h3>
        <p className="text-boulangerie-bordeaux-light font-alsacien">
          Sélectionnez quand vous souhaitez récupérer votre commande en magasin
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sélecteur de jour */}
        <div className="lg:col-span-1">
          <Card className="card-boulangerie">
            <CardContent className="p-6">
              <h4 className="text-lg font-artisan font-bold text-boulangerie-bordeaux mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-boulangerie-or" />
                Choisir un jour
              </h4>
              
              <div className="space-y-2">
                {joursDisponibles.map((jour) => (
                  <button
                    key={jour}
                    onClick={() => setJourSelectionne(jour)}
                    className={`
                      w-full p-3 rounded-xl text-left transition-all duration-300
                      ${jourSelectionne === jour 
                        ? 'bg-boulangerie-or text-white shadow-or' 
                        : 'bg-boulangerie-beige text-boulangerie-bordeaux hover:bg-boulangerie-or/10'
                      }
                    `}
                  >
                    <div className="font-medium capitalize">
                      {formaterJour(jour)}
                    </div>
                    <div className="text-sm opacity-75">
                      {creneauxParJour[jour]?.length || 0} créneaux
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Créneaux horaires du jour sélectionné */}
        <div className="lg:col-span-2">
          <Card className="card-boulangerie">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-artisan font-bold text-boulangerie-bordeaux flex items-center gap-2">
                  <Clock className="w-5 h-5 text-boulangerie-or" />
                  Créneaux disponibles
                </h4>
                
                {/* Navigation rapide */}
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => naviguerJour('prev')}
                    disabled={joursDisponibles.indexOf(jourSelectionne) === 0}
                    className="bg-boulangerie-beige text-boulangerie-bordeaux"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => naviguerJour('next')}
                    disabled={joursDisponibles.indexOf(jourSelectionne) === joursDisponibles.length - 1}
                    className="bg-boulangerie-beige text-boulangerie-bordeaux"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {jourSelectionne && (
                <div className="mb-4 p-3 bg-boulangerie-beige rounded-lg">
                  <p className="text-sm text-boulangerie-bordeaux font-medium capitalize">
                    {formaterJour(jourSelectionne)}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
                {creneauxDuJour.map((creneau) => {
                  const estSelectionne = processus.creneauChoisi?.id === creneau.id;
                  
                  return (
                    <button
                      key={creneau.id}
                      onClick={() => handleSelectionCreneau(creneau)}
                      disabled={!creneau.disponible}
                      className={`
                        p-3 rounded-xl text-center transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed
                        ${estSelectionne 
                          ? 'bg-boulangerie-or text-white shadow-or ring-4 ring-boulangerie-or/30' 
                          : creneau.disponible
                            ? 'bg-boulangerie-beige text-boulangerie-bordeaux hover:bg-boulangerie-or/10 hover:border-boulangerie-or border border-transparent'
                            : 'bg-gray-100 text-gray-400'
                        }
                      `}
                    >
                      <div className="font-medium text-sm">
                        {formaterHeure(creneau)}
                      </div>
                      {!creneau.disponible && (
                        <div className="text-xs mt-1">
                          Complet
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {creneauxDuJour.length === 0 && (
                <div className="text-center py-8">
                  <Clock className="w-12 h-12 text-boulangerie-bordeaux-light mx-auto mb-3" />
                  <p className="text-boulangerie-bordeaux-light">
                    Aucun créneau disponible pour ce jour
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Créneau sélectionné */}
      {processus.creneauChoisi && (
        <div className="mt-6 p-6 bg-boulangerie-or/10 rounded-xl border-2 border-boulangerie-or">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-boulangerie-or rounded-full flex items-center justify-center">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div>
              <h5 className="font-artisan font-bold text-boulangerie-bordeaux">
                Créneau sélectionné
              </h5>
              <p className="text-boulangerie-bordeaux-light">
                {formaterCreneau(processus.creneauChoisi)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
