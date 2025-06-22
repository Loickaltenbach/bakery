import { useState, useEffect, useMemo } from 'react';
import { useApi } from './useApi';
import { produitsAPI, Produit } from '../lib/api';
import { produitsTest } from '../lib/test-data';

export function useProduits() {
  const [useTestData, setUseTestData] = useState(false);
  const { data: produits, loading, error, execute } = useApi<Produit[]>();

  const fetchProduits = async () => {
    try {
      const response = await produitsAPI.getAll();
      
      if (response.data.length === 0) {
        throw new Error('Aucun produit disponible dans Strapi');
      }
      
      return response.data;
    } catch (error) {
      // Fallback vers les données de test
      setUseTestData(true);
      return produitsTest;
    }
  };

  useEffect(() => {
    execute(fetchProduits);
  }, [execute]);

  // Fonction pour filtrer les produits par catégorie
  const getProduitsParCategorie = useMemo(() => {
    return (categorieId: number | null) => {
      if (!produits) return [];
      if (categorieId === null) return produits;
      return produits.filter(produit => produit.categorie?.id === categorieId);
    };
  }, [produits]);

  // Calculer le nombre de produits par catégorie
  const getProduitsCountByCategory = useMemo(() => {
    if (!produits) return {};
    
    return produits.reduce((acc, produit) => {
      const categorieId = produit.categorie?.id;
      if (categorieId) {
        acc[categorieId] = (acc[categorieId] || 0) + 1;
      }
      return acc;
    }, {} as Record<number, number>);
  }, [produits]);

  return {
    produits: produits || [],
    loading,
    error,
    useTestData,
    getProduitsParCategorie,
    getProduitsCountByCategory,
    refetch: () => execute(fetchProduits),
  };
}
