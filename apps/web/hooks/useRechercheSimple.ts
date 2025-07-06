'use client';

import { useState } from 'react';
import { ChefHat } from 'lucide-react';

// Types
interface Produit {
  id: number;
  nom: string;
  prix: number;
  description: string;
  categorie: string;
  note: number;
  temps_preparation: string;
  populaire?: boolean;
  nouveau?: boolean;
  tags: string[];
}

interface FiltresPrix {
  min: number;
  max: number;
}

interface Categorie {
  id: string;
  nom: string;
  icon: any;
}

// Données statiques
const categories: Categorie[] = [
  { id: "tous", nom: "Tous", icon: ChefHat },
  { id: "pain", nom: "Pains", icon: "🍞" },
  { id: "viennoiserie", nom: "Viennoiseries", icon: "🥐" },
  { id: "patisserie", nom: "Pâtisseries", icon: "🧁" },
  { id: "special", nom: "Spécialités", icon: "🥨" }
];

const produitsExemples: Produit[] = [
  {
    id: 1,
    nom: "Croissant Artisanal",
    prix: 1.20,
    description: "Croissant pur beurre, feuilletage traditionnel",
    categorie: "viennoiserie",
    note: 4.8,
    temps_preparation: "15min",
    populaire: true,
    tags: ["pur beurre", "traditionnel", "croustillant"]
  },
  {
    id: 2,
    nom: "Pain de Campagne au Levain",
    prix: 3.50,
    description: "Pain au levain naturel, croûte dorée",
    categorie: "pain",
    note: 4.9,
    temps_preparation: "24h",
    nouveau: true,
    tags: ["levain", "artisanal", "bio"]
  },
  {
    id: 3,
    nom: "Kouglof Alsacien Traditionnel",
    prix: 8.90,
    description: "Spécialité alsacienne aux raisins et amandes",
    categorie: "special",
    note: 4.7,
    temps_preparation: "3h",
    tags: ["alsacien", "raisins", "amandes", "tradition"]
  },
  {
    id: 4,
    nom: "Éclair au Chocolat",
    prix: 4.20,
    description: "Pâte à choux, crème pâtissière, glaçage chocolat",
    categorie: "patisserie",
    note: 4.6,
    temps_preparation: "30min",
    tags: ["chocolat", "crème", "classique"]
  },
  {
    id: 5,
    nom: "Bretzel Traditionnel",
    prix: 1.80,
    description: "Bretzel alsacien au gros sel",
    categorie: "special",
    note: 4.5,
    temps_preparation: "45min",
    tags: ["alsacien", "salé", "tradition"]
  }
];

const recherchesPopulaires = [
  "croissant", "pain", "kouglof", "bretzel", "tarte", "chocolat"
];

export function useRechercheSimple() {
  // États de la recherche
  const [recherche, setRecherche] = useState("");
  const [categorieActive, setCategorieActive] = useState("tous");
  const [filtresPrix, setFiltresPrix] = useState<FiltresPrix>({ min: 0, max: 20 });
  const [filtresNote, setFiltresNote] = useState(0);
  const [afficherFiltres, setAfficherFiltres] = useState(false);

  // Logique de filtrage
  const produitsFiltres = produitsExemples.filter(produit => {
    const matchRecherche = produit.nom.toLowerCase().includes(recherche.toLowerCase()) ||
                          produit.description.toLowerCase().includes(recherche.toLowerCase()) ||
                          produit.tags.some(tag => tag.toLowerCase().includes(recherche.toLowerCase()));
    
    const matchCategorie = categorieActive === "tous" || produit.categorie === categorieActive;
    const matchPrix = produit.prix >= filtresPrix.min && produit.prix <= filtresPrix.max;
    const matchNote = produit.note >= filtresNote;

    return matchRecherche && matchCategorie && matchPrix && matchNote;
  });

  // Actions
  const reinitialiserFiltres = () => {
    setFiltresPrix({ min: 0, max: 20 });
    setFiltresNote(0);
    setCategorieActive("tous");
  };

  const selectionnerRecherchePopulaire = (terme: string) => {
    setRecherche(terme);
  };

  const toggleFiltres = () => {
    setAfficherFiltres(!afficherFiltres);
  };

  return {
    // États
    recherche,
    categorieActive,
    filtresPrix,
    filtresNote,
    afficherFiltres,
    
    // Données
    categories,
    recherchesPopulaires,
    produitsFiltres,
    
    // Actions
    setRecherche,
    setCategorieActive,
    setFiltresPrix,
    setFiltresNote,
    reinitialiserFiltres,
    selectionnerRecherchePopulaire,
    toggleFiltres
  };
}
