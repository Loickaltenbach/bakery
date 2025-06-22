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

export function useProduits(categorieSlug?: string) {
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
  }, [categorieSlug]);

  return { produits, loading, error, refetch: fetchProduits };
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

export function useStats(dateDebut?: string, dateFin?: string) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      let url = '/commandes/stats';
      
      const params = new URLSearchParams();
      if (dateDebut) params.append('dateDebut', dateDebut);
      if (dateFin) params.append('dateFin', dateFin);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const data = await strapiApi.get(url);
      setStats(data);
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement des statistiques');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [dateDebut, dateFin]);

  return { stats, loading, error, refetch: fetchStats };
}

export function useUtilisateurs() {
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUtilisateurs = async () => {
    try {
      setLoading(true);
      const data = await strapiApi.get('/utilisateurs?populate=*');
      setUtilisateurs(data.data || []);
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement des utilisateurs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUtilisateurs();
  }, []);

  return { utilisateurs, loading, error, refetch: fetchUtilisateurs };
}
