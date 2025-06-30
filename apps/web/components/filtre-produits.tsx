'use client';

import React, { useState } from 'react';
import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import { Calendar, Clock, Filter, Star, Leaf } from 'lucide-react';
import { useProduits } from '@/hooks/useStrapi';
import { ProduitCard } from './produit-card';

interface FiltreProduitsProps {
  categorieSlug?: string;
}

export function FiltreProduits({ categorieSlug }: FiltreProduitsProps) {
  const [filtreActif, setFiltreActif] = useState('tous');
  const [jourSelectionne, setJourSelectionne] = useState('');
  const [afficherSaisonniers, setAfficherSaisonniers] = useState(false);
  const [afficherNouveautes, setAfficherNouveautes] = useState(false);
  const [afficherDisponibles, setAfficherDisponibles] = useState(true);

  // Produits du jour (en dur pour le moment)
  const aujourdhui = new Date().toLocaleDateString('fr-FR', { weekday: 'long' });

  // Hook pour les produits avec filtres
  const filtres = filtreActif === 'aujourdhui' 
    ? { jour: aujourdhui, disponibles: true }
    : {
        jour: jourSelectionne,
        saisonniers: afficherSaisonniers || undefined,
        disponibles: afficherDisponibles,
        nouveautes: afficherNouveautes || undefined,
      };

  const { 
    produits, 
    loading, 
    error 
  } = useProduits(categorieSlug, filtres);

  const jours = [
    { value: 'lundi', label: 'Lundi' },
    { value: 'mardi', label: 'Mardi' },
    { value: 'mercredi', label: 'Mercredi' },
    { value: 'jeudi', label: 'Jeudi' },
    { value: 'vendredi', label: 'Vendredi' },
    { value: 'samedi', label: 'Samedi' },
    { value: 'dimanche', label: 'Dimanche' },
  ];

  const resetFiltres = () => {
    setJourSelectionne('');
    setAfficherSaisonniers(false);
    setAfficherNouveautes(false);
    setAfficherDisponibles(true);
    setFiltreActif('tous');
  };

  return (
    <div className="space-y-6">
      {/* Sélecteur de mode d'affichage */}
      <div className="flex flex-wrap gap-3">
        <Button
          variant={filtreActif === 'tous' ? 'default' : 'outline'}
          onClick={() => setFiltreActif('tous')}
          className="flex items-center gap-2"
        >
          <Filter className="w-4 h-4" />
          Tous les produits
        </Button>
        <Button
          variant={filtreActif === 'aujourdhui' ? 'default' : 'outline'}
          onClick={() => setFiltreActif('aujourdhui')}
          className="flex items-center gap-2"
        >
          <Calendar className="w-4 h-4" />
          Disponibles aujourd&apos;hui
        </Button>
      </div>

      {/* Filtres avancés (affichés seulement en mode "tous") */}
      {filtreActif === 'tous' && (
        <div className="bg-white rounded-lg shadow-sm border p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-boulangerie-bordeaux">Filtres</h3>
            <Button variant="ghost" size="sm" onClick={resetFiltres}>
              Réinitialiser
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Sélecteur de jour */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-boulangerie-bordeaux">
                Jour de la semaine
              </label>
              <select 
                value={jourSelectionne} 
                onChange={(e) => setJourSelectionne(e.target.value)}
                className="w-full h-10 px-3 rounded-md border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-boulangerie-or focus:border-transparent"
              >
                <option value="">Tous les jours</option>
                {jours.map((jour) => (
                  <option key={jour.value} value={jour.value}>
                    {jour.label}
                    {jour.value === aujourdhui ? ' (Aujourd\'hui)' : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Switch produits saisonniers */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-boulangerie-bordeaux flex items-center gap-2">
                <Leaf className="w-4 h-4" />
                Produits saisonniers
              </label>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setAfficherSaisonniers(!afficherSaisonniers)}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-boulangerie-or focus:ring-offset-2 ${
                    afficherSaisonniers ? 'bg-boulangerie-or' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow transform ring-0 transition duration-200 ease-in-out ${
                      afficherSaisonniers ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
                <span className="text-sm text-gray-600">
                  {afficherSaisonniers ? 'Activé' : 'Désactivé'}
                </span>
              </div>
            </div>

            {/* Switch nouveautés */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-boulangerie-bordeaux flex items-center gap-2">
                <Star className="w-4 h-4" />
                Nouveautés
              </label>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setAfficherNouveautes(!afficherNouveautes)}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-boulangerie-or focus:ring-offset-2 ${
                    afficherNouveautes ? 'bg-boulangerie-or' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow transform ring-0 transition duration-200 ease-in-out ${
                      afficherNouveautes ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
                <span className="text-sm text-gray-600">
                  {afficherNouveautes ? 'Activé' : 'Désactivé'}
                </span>
              </div>
            </div>

            {/* Switch produits disponibles */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-boulangerie-bordeaux flex items-center gap-2">
                <Clock className="w-4 h-4" />
                En stock seulement
              </label>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setAfficherDisponibles(!afficherDisponibles)}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-boulangerie-or focus:ring-offset-2 ${
                    afficherDisponibles ? 'bg-boulangerie-or' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow transform ring-0 transition duration-200 ease-in-out ${
                      afficherDisponibles ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
                <span className="text-sm text-gray-600">
                  {afficherDisponibles ? 'Activé' : 'Désactivé'}
                </span>
              </div>
            </div>
          </div>

          {/* Indicateurs de filtres actifs */}
          <div className="flex flex-wrap gap-2">
            {jourSelectionne && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {jours.find(j => j.value === jourSelectionne)?.label}
              </Badge>
            )}
            {afficherSaisonniers && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Leaf className="w-3 h-3" />
                Saisonniers
              </Badge>
            )}
            {afficherNouveautes && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Star className="w-3 h-3" />
                Nouveautés
              </Badge>
            )}
            {afficherDisponibles && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                En stock
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* Affichage des produits */}
      <div>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 aspect-square rounded-lg mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-5 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-600">{error}</p>
          </div>
        ) : produits.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Aucun produit trouvé avec ces critères.</p>
            <Button variant="outline" onClick={resetFiltres} className="mt-4">
              Réinitialiser les filtres
            </Button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <p className="text-gray-600">
                {produits.length} produit{produits.length > 1 ? 's' : ''} trouvé{produits.length > 1 ? 's' : ''}
              </p>
              {filtreActif === 'aujourdhui' && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {aujourdhui}
                </Badge>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {produits.map((produit: any) => (
                <ProduitCard key={produit.id} produit={produit} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
