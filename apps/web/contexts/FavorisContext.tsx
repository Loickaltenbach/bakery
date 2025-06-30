'use client'

import React, { createContext, useContext, useEffect, useState } from 'react';

interface FavorisContextType {
  favoris: string[];
  ajouterFavori: (produitId: string) => void;
  retirerFavori: (produitId: string) => void;
  estFavori: (produitId: string) => boolean;
  toggleFavori: (produitId: string) => void;
  viderFavoris: () => void;
}

const FavorisContext = createContext<FavorisContextType | undefined>(undefined);

export function FavorisProvider({ children }: { children: React.ReactNode }) {
  const [favoris, setFavoris] = useState<string[]>([]);

  // Charger les favoris depuis localStorage au montage
  useEffect(() => {
    try {
      const savedFavoris = localStorage.getItem('favoris');
      if (savedFavoris) {
        setFavoris(JSON.parse(savedFavoris));
      }
    } catch (error) {
      console.error('Erreur lors du chargement des favoris:', error);
    }
  }, []);

  // Sauvegarder les favoris dans localStorage à chaque changement
  useEffect(() => {
    try {
      localStorage.setItem('favoris', JSON.stringify(favoris));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des favoris:', error);
    }
  }, [favoris]);

  const ajouterFavori = (produitId: string) => {
    setFavoris(prev => {
      if (!prev.includes(produitId)) {
        return [...prev, produitId];
      }
      return prev;
    });
  };

  const retirerFavori = (produitId: string) => {
    setFavoris(prev => prev.filter(id => id !== produitId));
  };

  const estFavori = (produitId: string) => {
    return favoris.includes(produitId);
  };

  const toggleFavori = (produitId: string) => {
    if (estFavori(produitId)) {
      retirerFavori(produitId);
    } else {
      ajouterFavori(produitId);
    }
  };

  const viderFavoris = () => {
    setFavoris([]);
  };

  return (
    <FavorisContext.Provider value={{
      favoris,
      ajouterFavori,
      retirerFavori,
      estFavori,
      toggleFavori,
      viderFavoris
    }}>
      {children}
    </FavorisContext.Provider>
  );
}

export function useFavoris() {
  const context = useContext(FavorisContext);
  if (!context) {
    throw new Error('useFavoris must be used within a FavorisProvider');
  }
  return context;
}
