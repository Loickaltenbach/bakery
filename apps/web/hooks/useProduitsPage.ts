import { useProduits, useCategories, useCategorieFilter } from './index';

export function useProduitsPage() {
  // Hooks pour les données
  const { 
    produits, 
    loading: produitsLoading, 
    error: produitsError, 
    useTestData: produitsUseTestData,
    getProduitsParCategorie,
    getProduitsCountByCategory 
  } = useProduits();
  
  const { 
    categories, 
    loading: categoriesLoading, 
    error: categoriesError, 
    useTestData: categoriesUseTestData,
    getCategorieById 
  } = useCategories();
  
  // Hook pour le filtrage
  const { selectedCategoryId, selectCategorie, clearSelection } = useCategorieFilter();

  // États dérivés
  const loading = produitsLoading || categoriesLoading;
  const error = produitsError || categoriesError;
  const useTestData = produitsUseTestData || categoriesUseTestData;
  
  // Données filtrées et dérivées
  const produitsFiltres = getProduitsParCategorie(selectedCategoryId);
  const categorieSelectionnee = getCategorieById(selectedCategoryId);
  const produitsCountByCategory = getProduitsCountByCategory;

  return {
    // Données
    produits,
    categories,
    produitsFiltres,
    categorieSelectionnee,
    produitsCountByCategory,
    
    // États
    loading,
    error,
    useTestData,
    
    // Actions de filtrage
    selectedCategoryId,
    selectCategorie,
    clearSelection,
  };
}
