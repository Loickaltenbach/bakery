import { Produit } from './api';

// Types pour le panier
export interface PanierItem {
  produit: Produit;
  quantite: number;
  sousTotal: number; // prix * quantité
}

export interface Panier {
  items: PanierItem[];
  totalItems: number;
  totalPrice: number;
  updatedAt: Date;
  isOpen: boolean; // Pour le drawer
}

export interface PanierContextType {
  panier: Panier;
  ajouterProduit: (produit: Produit, quantite?: number) => void;
  retirerProduit: (produitId: number) => void;
  modifierQuantite: (produitId: number, nouvelleQuantite: number) => void;
  viderPanier: () => void;
  isInPanier: (produitId: number) => boolean;
  getQuantite: (produitId: number) => number;
  ouvrirPanier: () => void;
  fermerPanier: () => void;
  togglePanier: () => void;
}
