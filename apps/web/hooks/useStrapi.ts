// Hook pour utiliser l'API Strapi au lieu des données simulées
'use client'

import { useState, useEffect } from 'react';
import { strapiApi } from '@/lib/strapi-api';

export function useCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await strapiApi.get('/categories');
      setCategories(data.data || []);
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement des catégories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return { categories, loading, error, refetch: fetchCategories };
}

export function useProduits(categorieSlug?: string, filtres?: {
  jour?: string;
  saisonniers?: boolean;
  disponibles?: boolean;
  nouveautes?: boolean;
}) {
  const [produits, setProduits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProduits = async () => {
    try {
      setLoading(true);
      let url = '/produits?populate=*';
      
      if (categorieSlug) {
        url += `&filters[categorie][slug][$eq]=${categorieSlug}`;
      }

      // Filtres additionnels
      if (filtres?.disponibles) {
        url += '&filters[disponible][$eq]=true&filters[enRupture][$eq]=false';
      }

      if (filtres?.nouveautes) {
        url += '&filters[nouveaute][$eq]=true';
      }

      if (filtres?.jour) {
        url += `&filters[disponibiliteJours][${filtres.jour}][$eq]=true`;
      }

      if (filtres?.saisonniers !== undefined) {
        url += `&filters[produitSaisonnier][$eq]=${filtres.saisonniers}`;
      }
      
      const data = await strapiApi.get(url);
      setProduits(data.data || []);
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement des produits');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduits();
  }, [categorieSlug, JSON.stringify(filtres)]);

  return { produits, loading, error, refetch: fetchProduits };
}

// Hook pour les horaires et créneaux
export function useHoraires() {
  const [horaires, setHoraires] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHoraires = async () => {
    try {
      setLoading(true);
      const data = await strapiApi.get('/horaires-ouverture/aujourd-hui');
      setHoraires(data);
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement des horaires');
    } finally {
      setLoading(false);
    }
  };

  const getCreneauxDisponibles = async (date: string, categorie?: string) => {
    try {
      let url = `/horaires-ouverture/creneaux-disponibles?date=${date}`;
      if (categorie) {
        url += `&categorie=${categorie}`;
      }
      const data = await strapiApi.get(url);
      return data;
    } catch (err: any) {
      throw new Error(err.message || 'Erreur lors du chargement des créneaux');
    }
  };

  useEffect(() => {
    fetchHoraires();
  }, []);

  return { 
    horaires, 
    loading, 
    error, 
    refetch: fetchHoraires,
    getCreneauxDisponibles 
  };
}

// Hook pour la gestion du stock
export function useStockManagement() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateStock = async (produitId: string, nouvelleQuantite: number) => {
    try {
      setLoading(true);
      setError(null);
      await strapiApi.put(`/produits/${produitId}/stock`, { stock: nouvelleQuantite });
      return true;
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la mise à jour du stock');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getAlertes = async () => {
    try {
      const data = await strapiApi.get('/produits/alertes-stock');
      return data.data || [];
    } catch (err: any) {
      throw new Error(err.message || 'Erreur lors du chargement des alertes');
    }
  };

  return { updateStock, getAlertes, loading, error };
}

export function useCommandes(filters?: any) {
  const [commandes, setCommandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCommandes = async () => {
    try {
      setLoading(true);
      let url = '/commandes?populate=*';
      
      if (filters) {
        const params = new URLSearchParams();
        Object.keys(filters).forEach(key => {
          if (filters[key] !== undefined && filters[key] !== '') {
            params.append(key, filters[key]);
          }
        });
        if (params.toString()) {
          url += `&${params.toString()}`;
        }
      }
      
      const data = await strapiApi.get(url);
      setCommandes(data.data || []);
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement des commandes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommandes();
  }, [filters]);

  const updateCommandeStatut = async (id: string, statut: string) => {
    try {
      await strapiApi.put(`/commandes/${id}/statut`, { statut });
      // Recharger les commandes
      fetchCommandes();
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la mise à jour du statut');
      throw err;
    }
  };

  return { 
    commandes, 
    loading, 
    error, 
    updateStatut: updateCommandeStatut,
    refetch: fetchCommandes 
  };
}
