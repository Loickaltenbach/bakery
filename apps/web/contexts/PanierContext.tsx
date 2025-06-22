'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Produit } from '../lib/api';
import {
    Panier,
    PanierItem,
    PanierContextType
} from '../lib/panier-types';
import {
    calculerTotaux,
    creerPanierItem,
    panierVide,
    sauvegarderPanier,
    chargerPanier
} from '../lib/panier-utils';

// Actions du reducer
type PanierAction =
    | { type: 'CHARGER_PANIER'; payload: Panier }
    | { type: 'AJOUTER_PRODUIT'; payload: { produit: Produit; quantite: number } }
    | { type: 'RETIRER_PRODUIT'; payload: { produitId: number } }
    | { type: 'MODIFIER_QUANTITE'; payload: { produitId: number; quantite: number } }
    | { type: 'VIDER_PANIER' }
    | { type: 'OUVRIR_PANIER' }
    | { type: 'FERMER_PANIER' }
    | { type: 'TOGGLE_PANIER' };

// Reducer pour gérer l'état du panier
const panierReducer = (state: Panier, action: PanierAction): Panier => {
    switch (action.type) {
        case 'CHARGER_PANIER':
            return action.payload;

        case 'AJOUTER_PRODUIT': {
            const { produit, quantite } = action.payload;
            const existingItemIndex = state.items.findIndex(
                item => item.produit.id === produit.id
            );

            let newItems: PanierItem[];

            if (existingItemIndex >= 0) {
                // Produit déjà dans le panier, augmenter la quantité
                newItems = state.items.map((item, index) =>
                    index === existingItemIndex
                        ? {
                            ...item,
                            quantite: item.quantite + quantite,
                            sousTotal: (item.quantite + quantite) * produit.prix
                        }
                        : item
                );
            } else {
                // Nouveau produit
                newItems = [...state.items, creerPanierItem(produit, quantite)];
            }

            const { totalItems, totalPrice } = calculerTotaux(newItems);

            return {
                ...state,
                items: newItems,
                totalItems,
                totalPrice,
                updatedAt: new Date(),
                isOpen: true // Ouvrir le panier après ajout
            };
        }

        case 'RETIRER_PRODUIT': {
            const { produitId } = action.payload;
            const newItems = state.items.filter(item => item.produit.id !== produitId);
            const { totalItems, totalPrice } = calculerTotaux(newItems);

            return {
                ...state,
                items: newItems,
                totalItems,
                totalPrice,
                updatedAt: new Date()
            };
        }

        case 'MODIFIER_QUANTITE': {
            const { produitId, quantite } = action.payload;

            if (quantite <= 0) {
                // Si quantité <= 0, supprimer le produit
                return panierReducer(state, { type: 'RETIRER_PRODUIT', payload: { produitId } });
            }

            const newItems = state.items.map(item =>
                item.produit.id === produitId
                    ? {
                        ...item,
                        quantite,
                        sousTotal: quantite * item.produit.prix
                    }
                    : item
            );

            const { totalItems, totalPrice } = calculerTotaux(newItems);

            return {
                ...state,
                items: newItems,
                totalItems,
                totalPrice,
                updatedAt: new Date()
            };
        }

        case 'VIDER_PANIER':
            return {
                ...panierVide,
                isOpen: state.isOpen // Conserver l'état d'ouverture
            };

        case 'OUVRIR_PANIER':
            return {
                ...state,
                isOpen: true
            };

        case 'FERMER_PANIER':
            return {
                ...state,
                isOpen: false
            };

        case 'TOGGLE_PANIER':
            return {
                ...state,
                isOpen: !state.isOpen
            };

        default:
            return state;
    }
};

// Créer le contexte
const PanierContext = createContext<PanierContextType | undefined>(undefined);

// Hook pour utiliser le contexte
export const usePanier = (): PanierContextType => {
    const context = useContext(PanierContext);
    if (!context) {
        throw new Error('usePanier doit être utilisé dans un PanierProvider');
    }
    return context;
};

// Props du provider
interface PanierProviderProps {
    children: ReactNode;
}

// Provider du contexte
export const PanierProvider: React.FC<PanierProviderProps> = ({ children }) => {
    const [panier, dispatch] = useReducer(panierReducer, panierVide);

    // Charger le panier depuis localStorage au montage
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const panierSauvegarde = chargerPanier();
            dispatch({ type: 'CHARGER_PANIER', payload: panierSauvegarde });
        }
    }, []);

    // Sauvegarder le panier dans localStorage à chaque changement
    useEffect(() => {
        if (typeof window !== 'undefined' && panier.items.length >= 0) {
            sauvegarderPanier(panier);
        }
    }, [panier]);

    // Actions
    const ajouterProduit = (produit: Produit, quantite: number = 1) => {
        dispatch({ type: 'AJOUTER_PRODUIT', payload: { produit, quantite } });
    };

    const retirerProduit = (produitId: number) => {
        dispatch({ type: 'RETIRER_PRODUIT', payload: { produitId } });
    };

    const modifierQuantite = (produitId: number, nouvelleQuantite: number) => {
        dispatch({ type: 'MODIFIER_QUANTITE', payload: { produitId, quantite: nouvelleQuantite } });
    };

    const viderPanier = () => {
        dispatch({ type: 'VIDER_PANIER' });
    };

    const ouvrirPanier = () => {
        dispatch({ type: 'OUVRIR_PANIER' });
    };

    const fermerPanier = () => {
        dispatch({ type: 'FERMER_PANIER' });
    };

    const togglePanier = () => {
        dispatch({ type: 'TOGGLE_PANIER' });
    };

    // Utilitaires
    const isInPanier = (produitId: number): boolean => {
        return panier.items.some(item => item.produit.id === produitId);
    };

    const getQuantite = (produitId: number): number => {
        const item = panier.items.find(item => item.produit.id === produitId);
        return item ? item.quantite : 0;
    };

    // Valeur du contexte
    const contextValue: PanierContextType = {
        panier,
        ajouterProduit,
        retirerProduit,
        modifierQuantite,
        viderPanier,
        isInPanier,
        getQuantite,
        ouvrirPanier,
        fermerPanier,
        togglePanier
    };

    return (
        <PanierContext.Provider value={contextValue}>
            {children}
        </PanierContext.Provider>
    );
};
