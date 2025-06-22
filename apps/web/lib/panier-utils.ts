import { Panier, PanierItem } from './panier-types';
import { Produit } from './api';

// Calcul des totaux du panier
export const calculerTotaux = (items: PanierItem[]): { totalItems: number; totalPrice: number } => {
  const totalItems = items.reduce((total, item) => total + item.quantite, 0);
  const totalPrice = items.reduce((total, item) => total + item.sousTotal, 0);
  
  return { totalItems, totalPrice };
};

// Créer un item de panier à partir d'un produit
export const creerPanierItem = (produit: Produit, quantite: number): PanierItem => {
  const prix = produit.prix; // Strapi 5 : plus d'attributes
  return {
    produit,
    quantite,
    sousTotal: prix * quantite
  };
};

// Panier vide par défaut
export const panierVide: Panier = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
  updatedAt: new Date(),
  isOpen: false
};

// Clés pour localStorage
const PANIER_STORAGE_KEY = 'boulangerie-panier';

// Sauvegarder le panier dans localStorage
export const sauvegarderPanier = (panier: Panier): void => {
  try {
    const panierJson = JSON.stringify({
      ...panier,
      updatedAt: panier.updatedAt.toISOString()
    });
    localStorage.setItem(PANIER_STORAGE_KEY, panierJson);
  } catch (error) {
    console.error('Erreur lors de la sauvegarde du panier:', error);
  }
};

// Charger le panier depuis localStorage
export const chargerPanier = (): Panier => {
  try {
    const panierJson = localStorage.getItem(PANIER_STORAGE_KEY);
    if (!panierJson) return panierVide;
    
    const panierData = JSON.parse(panierJson);
    return {
      ...panierData,
      updatedAt: new Date(panierData.updatedAt)
    };
  } catch (error) {
    console.error('Erreur lors du chargement du panier:', error);
    return panierVide;
  }
};

// Vider le localStorage du panier
export const viderStoragePanier = (): void => {
  try {
    localStorage.removeItem(PANIER_STORAGE_KEY);
  } catch (error) {
    console.error('Erreur lors de la suppression du panier:', error);
  }
};

// Formatage du prix en euros
export const formaterPrix = (prix: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2
  }).format(prix);
};
