import { useState, useEffect, useMemo } from 'react';
import { useFavoris } from '@/contexts/FavorisContext';

interface FiltresRecherche {
  texte: string;
  categories: string[];
  prixMin: number;
  prixMax: number;
  disponibleAujourdhui: boolean;
  seulement: 'tous' | 'favoris' | 'nouveautes' | 'promotions';
  allergenes: string[];
  nutrition: {
    sansGluten: boolean;
    vegan: boolean;
    bio: boolean;
  };
  tri: 'nom' | 'prix-asc' | 'prix-desc' | 'popularite' | 'note';
}

const filtresParDefaut: FiltresRecherche = {
  texte: '',
  categories: [],
  prixMin: 0,
  prixMax: 100,
  disponibleAujourdhui: false,
  seulement: 'tous',
  allergenes: [],
  nutrition: {
    sansGluten: false,
    vegan: false,
    bio: false
  },
  tri: 'nom'
};

export function useRechercheAvancee(produits: any[] = []) {
  const [filtres, setFiltres] = useState<FiltresRecherche>(filtresParDefaut);
  const [historique, setHistorique] = useState<string[]>([]);
  const { favoris } = useFavoris();

  // Charger l'historique de recherche
  useEffect(() => {
    try {
      const saved = localStorage.getItem('historiqueRecherche');
      if (saved) {
        setHistorique(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Erreur lors du chargement de l\'historique:', error);
    }
  }, []);

  // Sauvegarder l'historique
  useEffect(() => {
    try {
      localStorage.setItem('historiqueRecherche', JSON.stringify(historique));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de l\'historique:', error);
    }
  }, [historique]);

  // Ajouter une recherche à l'historique
  const ajouterAHistorique = (terme: string) => {
    if (terme.trim() && !historique.includes(terme.trim())) {
      setHistorique(prev => [terme.trim(), ...prev.slice(0, 9)]); // Garder les 10 derniers
    }
  };

  // Filtrer et trier les produits
  const produitsFiltrés = useMemo(() => {
    let résultats = [...produits];

    // Filtre par texte de recherche
    if (filtres.texte.trim()) {
      const termes = filtres.texte.toLowerCase().split(' ');
      résultats = résultats.filter(produit => {
        const texteProduit = `${produit.nom} ${produit.description || ''} ${produit.categorie?.nom || ''}`.toLowerCase();
        return termes.every(terme => texteProduit.includes(terme));
      });
    }

    // Filtre par catégories
    if (filtres.categories.length > 0) {
      résultats = résultats.filter(produit => 
        filtres.categories.includes(produit.categorie?.slug || produit.categorie?.id)
      );
    }

    // Filtre par prix
    résultats = résultats.filter(produit => 
      produit.prix >= filtres.prixMin && produit.prix <= filtres.prixMax
    );

    // Filtre disponibilité aujourd'hui
    if (filtres.disponibleAujourdhui) {
      const aujourdhui = new Date();
      const jourSemaine = aujourdhui.toLocaleDateString('fr-FR', { weekday: 'long' });
      
      résultats = résultats.filter(produit => {
        // Vérifier disponibilité par jour
        if (produit.disponibiliteJours && !produit.disponibiliteJours[jourSemaine]) {
          return false;
        }
        
        // Vérifier saisonnalité
        if (produit.produitSaisonnier) {
          const dateDebut = new Date(produit.dateDebutSaison);
          const dateFin = new Date(produit.dateFinSaison);
          const maintenant = new Date();
          
          if (maintenant < dateDebut || maintenant > dateFin) {
            return false;
          }
        }
        
        return !produit.enRupture && produit.disponible;
      });
    }

    // Filtre par type
    switch (filtres.seulement) {
      case 'favoris':
        résultats = résultats.filter(produit => favoris.includes(produit.id));
        break;
      case 'nouveautes':
        résultats = résultats.filter(produit => produit.nouveaute);
        break;
      case 'promotions':
        résultats = résultats.filter(produit => produit.promotion);
        break;
    }

    // Filtre par allergènes
    if (filtres.allergenes.length > 0) {
      résultats = résultats.filter(produit => {
        const allergenesProduit = produit.allergenes || [];
        return !filtres.allergenes.some(allergene => allergenesProduit.includes(allergene));
      });
    }

    // Filtre nutritionnel
    if (filtres.nutrition.sansGluten) {
      résultats = résultats.filter(produit => produit.sansGluten);
    }
    if (filtres.nutrition.vegan) {
      résultats = résultats.filter(produit => produit.vegan);
    }
    if (filtres.nutrition.bio) {
      résultats = résultats.filter(produit => produit.bio);
    }

    // Tri
    switch (filtres.tri) {
      case 'prix-asc':
        résultats.sort((a, b) => a.prix - b.prix);
        break;
      case 'prix-desc':
        résultats.sort((a, b) => b.prix - a.prix);
        break;
      case 'popularite':
        résultats.sort((a, b) => (b.ventesTotales || 0) - (a.ventesTotales || 0));
        break;
      case 'note':
        résultats.sort((a, b) => (b.noteMoyenne || 0) - (a.noteMoyenne || 0));
        break;
      default: // nom
        résultats.sort((a, b) => a.nom.localeCompare(b.nom));
    }

    return résultats;
  }, [produits, filtres, favoris]);

  // Méthodes pour modifier les filtres
  const setTexte = (texte: string) => {
    setFiltres(prev => ({ ...prev, texte }));
    if (texte.trim()) {
      ajouterAHistorique(texte);
    }
  };

  const setCategories = (categories: string[]) => {
    setFiltres(prev => ({ ...prev, categories }));
  };

  const setPrix = (min: number, max: number) => {
    setFiltres(prev => ({ ...prev, prixMin: min, prixMax: max }));
  };

  const setDisponibleAujourdhui = (disponible: boolean) => {
    setFiltres(prev => ({ ...prev, disponibleAujourdhui: disponible }));
  };

  const setSeulement = (seulement: FiltresRecherche['seulement']) => {
    setFiltres(prev => ({ ...prev, seulement }));
  };

  const setAllergenes = (allergenes: string[]) => {
    setFiltres(prev => ({ ...prev, allergenes }));
  };

  const setNutrition = (nutrition: Partial<FiltresRecherche['nutrition']>) => {
    setFiltres(prev => ({ 
      ...prev, 
      nutrition: { ...prev.nutrition, ...nutrition }
    }));
  };

  const setTri = (tri: FiltresRecherche['tri']) => {
    setFiltres(prev => ({ ...prev, tri }));
  };

  const reinitialiserFiltres = () => {
    setFiltres(filtresParDefaut);
  };

  const supprimerHistorique = (terme: string) => {
    setHistorique(prev => prev.filter(t => t !== terme));
  };

  const viderHistorique = () => {
    setHistorique([]);
  };

  // Suggestions de recherche basées sur les produits
  const suggestions = useMemo(() => {
    if (!filtres.texte.trim()) return [];
    
    const terme = filtres.texte.toLowerCase();
    const suggestions = new Set<string>();
    
    produits.forEach(produit => {
      // Noms de produits
      if (produit.nom.toLowerCase().includes(terme)) {
        suggestions.add(produit.nom);
      }
      
      // Catégories
      if (produit.categorie?.nom.toLowerCase().includes(terme)) {
        suggestions.add(produit.categorie.nom);
      }        // Mots-clés dans la description
        if (produit.description) {
          const mots = produit.description.toLowerCase().split(' ');
          mots.forEach((mot: string) => {
            if (mot.includes(terme) && mot.length > 2) {
              suggestions.add(mot);
            }
          });
        }
    });
    
    return Array.from(suggestions).slice(0, 5);
  }, [filtres.texte, produits]);

  return {
    filtres,
    produitsFiltrés,
    historique,
    suggestions,
    setTexte,
    setCategories,
    setPrix,
    setDisponibleAujourdhui,
    setSeulement,
    setAllergenes,
    setNutrition,
    setTri,
    reinitialiserFiltres,
    supprimerHistorique,
    viderHistorique,
    nombreResultats: produitsFiltrés.length
  };
}
