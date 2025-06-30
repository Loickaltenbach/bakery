import { useState, useEffect } from 'react';
import { strapiApi } from '@/lib/strapi-api';

// Types pour l'analytics
interface ChiffreAffairesData {
  periode: string;
  montant: number;
}

interface ProduitPopulaire {
  id: string;
  nom: string;
  categorie: string;
  quantite: number;
  chiffreAffaires: number;
}

interface AnalyseCreneaux {
  heuresPointe: Array<{ heure: string; commandes: number }>;
  joursPopulaires: Array<{ jour: string; commandes: number }>;
  repartitionCreneaux: { [key: string]: number };
  totalCommandes: number;
}

interface StatistiquesGenerales {
  totalCommandes: number;
  commandesConfirmees: number;
  commandesAnnulees: number;
  chiffreAffairesTotal: number;
  panierMoyen: number;
  tauxConfirmation: number;
  tauxAnnulation: number;
}

interface Satisfaction {
  noteMoyenne: number;
  totalEvaluations: number;
  repartitionNotes: { [key: string]: number };
  tauxRecommandation: number;
  satisfactionParCritere: { [key: string]: number };
}

interface DashboardData {
  periode: { debut: Date; fin: Date };
  chiffreAffaires: ChiffreAffairesData[];
  produitsPopulaires: ProduitPopulaire[];
  analyseCreneaux: AnalyseCreneaux;
  statistiques: StatistiquesGenerales;
  tendances: any;
  satisfaction: Satisfaction;
  genereLe: Date;
}

// Hook pour le dashboard analytics
export const useAnalyticsDashboard = (dateDebut?: string, dateFin?: string, periode: string = 'jour') => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const params = new URLSearchParams();
        if (dateDebut) params.append('dateDebut', dateDebut);
        if (dateFin) params.append('dateFin', dateFin);
        params.append('periode', periode);

        const response = await strapiApi.get(`/analytics/dashboard?${params.toString()}`);
        setData(response);
      } catch (err) {
        console.error('Erreur lors de la récupération du dashboard:', err);
        setError('Erreur lors de la récupération des données');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboard();
  }, [dateDebut, dateFin, periode]);

  return { data, isLoading, error, refetch: () => {
    setIsLoading(true);
    setError(null);
    // Relancer le useEffect
  }};
};

// Hook pour le chiffre d'affaires
export const useChiffreAffaires = (dateDebut?: string, dateFin?: string, groupBy: string = 'jour') => {
  const [data, setData] = useState<{
    periode: { debut: string; fin: string; groupBy: string };
    donnees: ChiffreAffairesData[];
    total: number;
    moyenne: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChiffreAffaires = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const params = new URLSearchParams();
        if (dateDebut) params.append('dateDebut', dateDebut);
        if (dateFin) params.append('dateFin', dateFin);
        params.append('groupBy', groupBy);

        const response = await strapiApi.get(`/analytics/chiffre-affaires?${params.toString()}`);
        setData(response);
      } catch (err) {
        console.error('Erreur lors de la récupération du chiffre d\'affaires:', err);
        setError('Erreur lors de la récupération des données');
      } finally {
        setIsLoading(false);
      }
    };

    fetchChiffreAffaires();
  }, [dateDebut, dateFin, groupBy]);

  return { data, isLoading, error };
};

// Hook pour les produits populaires
export const useProduitsPopulaires = (dateDebut?: string, dateFin?: string, limite: number = 10) => {
  const [data, setData] = useState<{
    periode: { debut: string; fin: string };
    produits: ProduitPopulaire[];
    total: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduitsPopulaires = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const params = new URLSearchParams();
        if (dateDebut) params.append('dateDebut', dateDebut);
        if (dateFin) params.append('dateFin', dateFin);
        params.append('limite', limite.toString());

        const response = await strapiApi.get(`/analytics/produits-populaires?${params.toString()}`);
        setData(response);
      } catch (err) {
        console.error('Erreur lors de la récupération des produits populaires:', err);
        setError('Erreur lors de la récupération des données');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduitsPopulaires();
  }, [dateDebut, dateFin, limite]);

  return { data, isLoading, error };
};

// Hook pour l'analyse des créneaux
export const useAnalyseCreneaux = (dateDebut?: string, dateFin?: string) => {
  const [data, setData] = useState<{
    periode: { debut: string; fin: string };
  } & AnalyseCreneaux | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalyseCreneaux = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const params = new URLSearchParams();
        if (dateDebut) params.append('dateDebut', dateDebut);
        if (dateFin) params.append('dateFin', dateFin);

        const response = await strapiApi.get(`/analytics/creneaux?${params.toString()}`);
        setData(response);
      } catch (err) {
        console.error('Erreur lors de l\'analyse des créneaux:', err);
        setError('Erreur lors de la récupération des données');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalyseCreneaux();
  }, [dateDebut, dateFin]);

  return { data, isLoading, error };
};

// Hook pour la satisfaction client
export const useSatisfaction = (dateDebut?: string, dateFin?: string) => {
  const [data, setData] = useState<{
    periode: { debut: string; fin: string };
  } & Satisfaction | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSatisfaction = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const params = new URLSearchParams();
        if (dateDebut) params.append('dateDebut', dateDebut);
        if (dateFin) params.append('dateFin', dateFin);

        const response = await strapiApi.get(`/analytics/satisfaction?${params.toString()}`);
        setData(response);
      } catch (err) {
        console.error('Erreur lors de la récupération de la satisfaction:', err);
        setError('Erreur lors de la récupération des données');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSatisfaction();
  }, [dateDebut, dateFin]);

  return { data, isLoading, error };
};

// Hook pour les prévisions
export const usePrevisions = (type: string = 'ventes', horizon: number = 30) => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrevisions = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const params = new URLSearchParams();
        params.append('type', type);
        params.append('horizon', horizon.toString());

        const response = await strapiApi.get(`/analytics/previsions?${params.toString()}`);
        setData(response);
      } catch (err) {
        console.error('Erreur lors de la génération des prévisions:', err);
        setError('Erreur lors de la récupération des données');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrevisions();
  }, [type, horizon]);

  return { data, isLoading, error };
};

// Hook pour l'export de données
export const useExportDonnees = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const exportData = async (
    format: 'excel' | 'pdf',
    type: string = 'ventes',
    dateDebut?: string,
    dateFin?: string
  ) => {
    try {
      setIsExporting(true);
      setError(null);

      const params = new URLSearchParams();
      params.append('type', type);
      if (dateDebut) params.append('dateDebut', dateDebut);
      if (dateFin) params.append('dateFin', dateFin);

      const response = await strapiApi.get(`/analytics/export/${format}?${params.toString()}`);

      // Pour l'instant, juste logger la réponse car l'export n'est pas encore implémenté côté serveur
      console.log('Export response:', response);
      
      return true;
    } catch (err) {
      console.error('Erreur lors de l\'export:', err);
      setError('Erreur lors de l\'export des données');
      return false;
    } finally {
      setIsExporting(false);
    }
  };

  return { exportData, isExporting, error };
};

// Hook pour soumettre une évaluation
export const useEvaluation = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitEvaluation = async (evaluationData: {
    commande: string;
    note: number;
    commentaire?: string;
    criteres?: { [key: string]: number };
    recommandation?: boolean;
  }) => {
    try {
      setIsSubmitting(true);
      setError(null);

      const response = await strapiApi.post('/evaluations', {
        data: evaluationData
      });

      return response;
    } catch (err: any) {
      console.error('Erreur lors de la soumission de l\'évaluation:', err);
      setError(err.message || 'Erreur lors de la soumission');
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { submitEvaluation, isSubmitting, error };
};
