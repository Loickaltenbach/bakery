import { useState, useEffect } from 'react';
import { useApi } from './useApi';
import { categoriesAPI, Categorie } from '../lib/api';
import { categoriesTest } from '../lib/test-data';

export function useCategories() {
  const [useTestData, setUseTestData] = useState(false);
  const { data: categories, loading, error, execute } = useApi<Categorie[]>();

  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.getAll();
      
      if (response.data.length === 0) {
        throw new Error('Aucune catégorie disponible dans Strapi');
      }
      
      return response.data;
    } catch (error) {
      // Fallback vers les données de test
      setUseTestData(true);
      return categoriesTest;
    }
  };

  useEffect(() => {
    execute(fetchCategories);
  }, [execute]);

  // Fonction pour trouver une catégorie par ID
  const getCategorieById = (id: number | null) => {
    if (!categories || id === null) return null;
    return categories.find(cat => cat.id === id) || null;
  };

  return {
    categories: categories || [],
    loading,
    error,
    useTestData,
    getCategorieById,
    refetch: () => execute(fetchCategories),
  };
}
