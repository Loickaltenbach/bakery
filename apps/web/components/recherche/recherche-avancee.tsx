'use client'

import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  X, 
  Clock, 
  Star, 
  Heart,
  ChevronDown,
  SlidersHorizontal
} from 'lucide-react';
import { useRechercheAvancee } from '@/hooks/useRechercheAvancee';
import { useFavoris } from '@/contexts/FavorisContext';
import { useTheme } from '@/contexts/ThemeContext';

interface RechercheAvanceeProps {
  produits: any[];
  onResultatsChange: (produits: any[]) => void;
  categories: any[];
}

const RechercheAvancee: React.FC<RechercheAvanceeProps> = ({
  produits,
  onResultatsChange,
  categories = []
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showHistorique, setShowHistorique] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  const { actualTheme } = useTheme();
  const { favoris } = useFavoris();
  
  const {
    filtres,
    produitsFiltrés,
    historique,
    suggestions,
    setTexte,
    setCategories,
    setPrix,
    setDisponibleAujourdhui,
    setSeulement,
    setTri,
    reinitialiserFiltres,
    supprimerHistorique,
    nombreResultats
  } = useRechercheAvancee(produits);

  // Notifier les changements de résultats
  useEffect(() => {
    onResultatsChange(produitsFiltrés);
  }, [produitsFiltrés, onResultatsChange]);

  // Gérer les clics en dehors pour fermer les suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchInputRef.current && !searchInputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
        setShowHistorique(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchInput = (value: string) => {
    setTexte(value);
    setShowSuggestions(value.length > 0);
    setShowHistorique(value.length === 0);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setTexte(suggestion);
    setShowSuggestions(false);
    setShowHistorique(false);
  };

  const handleHistoriqueClick = (terme: string) => {
    setTexte(terme);
    setShowHistorique(false);
  };

  const optionsTri = [
    { value: 'nom', label: 'Nom A-Z' },
    { value: 'prix-asc', label: 'Prix croissant' },
    { value: 'prix-desc', label: 'Prix décroissant' },
    { value: 'popularite', label: 'Popularité' },
    { value: 'note', label: 'Mieux notés' }
  ];

  const optionsAffichage = [
    { value: 'tous', label: 'Tous les produits' },
    { value: 'favoris', label: `Mes favoris (${favoris.length})` },
    { value: 'nouveautes', label: 'Nouveautés' },
    { value: 'promotions', label: 'Promotions' }
  ];

  return (
    <div className={`relative w-full ${actualTheme === 'dark' ? 'dark' : ''}`}>
      {/* Barre de recherche principale */}
      <div className="relative">
        <div className="relative flex items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              ref={searchInputRef}
              type="text"
              value={filtres.texte}
              onChange={(e) => handleSearchInput(e.target.value)}
              onFocus={() => {
                if (filtres.texte.length === 0) {
                  setShowHistorique(true);
                } else {
                  setShowSuggestions(true);
                }
              }}
              placeholder="Rechercher un produit, catégorie..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                         bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         transition-all duration-200"
              aria-label="Rechercher des produits"
            />
            
            {filtres.texte && (
              <button
                onClick={() => {
                  setTexte('');
                  setShowSuggestions(false);
                  setShowHistorique(false);
                }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                aria-label="Effacer la recherche"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Bouton filtres */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`ml-3 p-3 rounded-lg border transition-all duration-200 ${
              showFilters 
                ? 'bg-blue-500 text-white border-blue-500' 
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
            aria-label="Ouvrir les filtres"
          >
            <SlidersHorizontal className="h-4 w-4" />
          </button>
        </div>

        {/* Suggestions et historique */}
        {(showSuggestions || showHistorique) && (
          <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-64 overflow-y-auto">
            {showSuggestions && suggestions.length > 0 && (
              <div className="p-2">
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Suggestions</div>
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                  >
                    <Search className="inline h-3 w-3 mr-2 text-gray-400" />
                    {suggestion}
                  </button>
                ))}
              </div>
            )}

            {showHistorique && historique.length > 0 && (
              <div className="p-2">
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Recherches récentes</div>
                {historique.map((terme, index) => (
                  <div key={index} className="flex items-center justify-between group">
                    <button
                      onClick={() => handleHistoriqueClick(terme)}
                      className="flex-1 text-left px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                    >
                      <Clock className="inline h-3 w-3 mr-2 text-gray-400" />
                      {terme}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        supprimerHistorique(terme);
                      }}
                      className="p-1 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-all"
                      aria-label={`Supprimer "${terme}" de l'historique`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Résumé des résultats */}
      <div className="flex items-center justify-between mt-3 text-sm text-gray-600 dark:text-gray-400">
        <span>
          {nombreResultats} produit{nombreResultats > 1 ? 's' : ''} trouvé{nombreResultats > 1 ? 's' : ''}
        </span>
        
        {/* Tri rapide */}
        <div className="flex items-center gap-2">
          <span className="text-xs">Trier par:</span>
          <select
            value={filtres.tri}
            onChange={(e) => setTri(e.target.value as any)}
            className="text-xs bg-transparent border-none focus:ring-0 cursor-pointer"
          >
            {optionsTri.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Filtres avancés */}
      {showFilters && (
        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 animate-in slide-in-from-top duration-200">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            
            {/* Catégories */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Catégories
              </label>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {categories.map(categorie => (
                  <label key={categorie.id} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filtres.categories.includes(categorie.slug)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setCategories([...filtres.categories, categorie.slug]);
                        } else {
                          setCategories(filtres.categories.filter(c => c !== categorie.slug));
                        }
                      }}
                      className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      {categorie.nom}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Prix */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Fourchette de prix
              </label>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={filtres.prixMin}
                    onChange={(e) => setPrix(Number(e.target.value), filtres.prixMax)}
                    min="0"
                    step="0.1"
                    className="w-20 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                  <span className="text-sm text-gray-500">à</span>
                  <input
                    type="number"
                    value={filtres.prixMax}
                    onChange={(e) => setPrix(filtres.prixMin, Number(e.target.value))}
                    min="0"
                    step="0.1"
                    className="w-20 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                  <span className="text-sm text-gray-500">€</span>
                </div>
              </div>
            </div>

            {/* Options d'affichage */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Afficher
              </label>
              <select
                value={filtres.seulement}
                onChange={(e) => setSeulement(e.target.value as any)}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                {optionsAffichage.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Disponibilité */}
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filtres.disponibleAujourdhui}
                  onChange={(e) => setDisponibleAujourdhui(e.target.checked)}
                  className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Disponible aujourd'hui
                </span>
              </label>
            </div>

          </div>

          {/* Actions des filtres */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={reinitialiserFiltres}
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            >
              Réinitialiser les filtres
            </button>
            
            <button
              onClick={() => setShowFilters(false)}
              className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
            >
              Appliquer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RechercheAvancee;
