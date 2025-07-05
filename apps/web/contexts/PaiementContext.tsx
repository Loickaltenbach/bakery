'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { 
  PaiementContextType, 
  Paiement, 
  CodePromo, 
  DetailsPaiement, 
  StatutPaiement,
  MethodePaiement,
  Facture,
  ReponsePaiement,
  DonneesPaiementCarte
} from '../lib/paiement-types';
import { 
  calculerTotauxAvecPromo, 
  validerCodePromo, 
  simulerPaiementCarte, 
  simulerPaiementPayPal, 
  creerFacture,
  CODES_PROMO_TEST
} from '../lib/paiement-utils';

interface PaiementState {
  paiementEnCours: Paiement | null;
  codePromoActuel: CodePromo | null;
  detailsPaiement: DetailsPaiement | null;
  isLoading: boolean;
  erreur: string | null;
}

type PaiementAction = 
  | { type: 'INITIALISER_PAIEMENT'; payload: { commandeId: string; montant: number } }
  | { type: 'APPLIQUER_CODE_PROMO'; payload: CodePromo }
  | { type: 'RETIRER_CODE_PROMO' }
  | { type: 'METTRE_A_JOUR_DETAILS'; payload: DetailsPaiement }
  | { type: 'TRAITEMENT_EN_COURS' }
  | { type: 'PAIEMENT_REUSSI'; payload: { transactionId: string } }
  | { type: 'PAIEMENT_ECHEC'; payload: string }
  | { type: 'ANNULER_PAIEMENT' }
  | { type: 'REINITIALISER' };

const initialState: PaiementState = {
  paiementEnCours: null,
  codePromoActuel: null,
  detailsPaiement: null,
  isLoading: false,
  erreur: null
};

function paiementReducer(state: PaiementState, action: PaiementAction): PaiementState {
  switch (action.type) {
    case 'INITIALISER_PAIEMENT':
      const { commandeId, montant } = action.payload;
      return {
        ...state,
        paiementEnCours: {
          id: `paiement-${Date.now()}`,
          commandeId,
          montant,
          statut: StatutPaiement.EN_ATTENTE,
          methodePaiement: MethodePaiement.CARTE_BANCAIRE,
          dateCreation: new Date()
        },
        detailsPaiement: calculerTotauxAvecPromo(montant, state.codePromoActuel || undefined),
        erreur: null
      };

    case 'APPLIQUER_CODE_PROMO':
      return {
        ...state,
        codePromoActuel: action.payload,
        detailsPaiement: state.paiementEnCours 
          ? calculerTotauxAvecPromo(state.paiementEnCours.montant, action.payload)
          : null,
        erreur: null
      };

    case 'RETIRER_CODE_PROMO':
      return {
        ...state,
        codePromoActuel: null,
        detailsPaiement: state.paiementEnCours 
          ? calculerTotauxAvecPromo(state.paiementEnCours.montant, undefined)
          : null
      };

    case 'METTRE_A_JOUR_DETAILS':
      return {
        ...state,
        detailsPaiement: action.payload
      };

    case 'TRAITEMENT_EN_COURS':
      return {
        ...state,
        isLoading: true,
        erreur: null,
        paiementEnCours: state.paiementEnCours ? {
          ...state.paiementEnCours,
          statut: StatutPaiement.EN_COURS
        } : null
      };

    case 'PAIEMENT_REUSSI':
      return {
        ...state,
        isLoading: false,
        paiementEnCours: state.paiementEnCours ? {
          ...state.paiementEnCours,
          statut: StatutPaiement.VALIDE,
          transactionId: action.payload.transactionId,
          dateValidation: new Date()
        } : null,
        erreur: null
      };

    case 'PAIEMENT_ECHEC':
      return {
        ...state,
        isLoading: false,
        paiementEnCours: state.paiementEnCours ? {
          ...state.paiementEnCours,
          statut: StatutPaiement.REFUSE
        } : null,
        erreur: action.payload
      };

    case 'ANNULER_PAIEMENT':
      return {
        ...state,
        paiementEnCours: state.paiementEnCours ? {
          ...state.paiementEnCours,
          statut: StatutPaiement.ANNULE
        } : null,
        isLoading: false
      };

    case 'REINITIALISER':
      return initialState;

    default:
      return state;
  }
}

const PaiementContext = createContext<PaiementContextType | null>(null);

export function PaiementProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(paiementReducer, initialState);

  // Actions
  const appliquerCodePromo = async (code: string): Promise<boolean> => {
    try {
      // Rechercher le code promo
      const codePromo = CODES_PROMO_TEST.find(promo => 
        promo.code.toLowerCase() === code.toLowerCase()
      );

      if (!codePromo) {
        return false;
      }

      // Valider le code promo
      const montantBase = state.paiementEnCours?.montant || 0;
      if (!validerCodePromo(codePromo, montantBase)) {
        return false;
      }

      dispatch({ type: 'APPLIQUER_CODE_PROMO', payload: codePromo });
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'application du code promo:', error);
      return false;
    }
  };

  const retirerCodePromo = () => {
    dispatch({ type: 'RETIRER_CODE_PROMO' });
  };

  const initialiserPaiement = (commandeId: string, montant: number) => {
    dispatch({ type: 'INITIALISER_PAIEMENT', payload: { commandeId, montant } });
  };

  const traiterPaiement = async (
    methodePaiement: MethodePaiement, 
    donneesPaiement: any
  ): Promise<boolean> => {
    if (!state.paiementEnCours || !state.detailsPaiement) {
      return false;
    }

    dispatch({ type: 'TRAITEMENT_EN_COURS' });

    try {
      let reponse: ReponsePaiement;

      switch (methodePaiement) {
        case MethodePaiement.CARTE_BANCAIRE:
          reponse = await simulerPaiementCarte(
            state.detailsPaiement.total,
            donneesPaiement as DonneesPaiementCarte
          );
          break;

        case MethodePaiement.PAYPAL:
          reponse = await simulerPaiementPayPal(state.detailsPaiement.total);
          break;

        default:
          throw new Error('Méthode de paiement non supportée');
      }

      if (reponse.succes && reponse.transactionId) {
        dispatch({ 
          type: 'PAIEMENT_REUSSI', 
          payload: { transactionId: reponse.transactionId } 
        });
        return true;
      } else {
        dispatch({ 
          type: 'PAIEMENT_ECHEC', 
          payload: reponse.erreur || 'Erreur de paiement inconnue' 
        });
        return false;
      }
    } catch (error) {
      const messageErreur = error instanceof Error ? error.message : 'Erreur de paiement';
      dispatch({ type: 'PAIEMENT_ECHEC', payload: messageErreur });
      return false;
    }
  };

  const confirmerPaiement = (transactionId: string) => {
    dispatch({ type: 'PAIEMENT_REUSSI', payload: { transactionId } });
  };

  const annulerPaiement = () => {
    dispatch({ type: 'ANNULER_PAIEMENT' });
  };

  const calculerTotauxAvecPromoWrapper = (
    sousTotal: number, 
    codePromo?: CodePromo
  ): DetailsPaiement => {
    return calculerTotauxAvecPromo(sousTotal, codePromo);
  };

  const genererFacture = async (commandeId: string): Promise<Facture> => {
    if (!state.detailsPaiement) {
      throw new Error('Détails de paiement manquants');
    }

    const facture = creerFacture(
      commandeId,
      state.detailsPaiement.sousTotal - state.detailsPaiement.montantTVA,
      state.detailsPaiement.total
    );

    return facture;
  };

  const envoyerFacture = async (factureId: string, email: string): Promise<boolean> => {
    // Simulation de l'envoi d'email
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log(`Facture ${factureId} envoyée à ${email}`);
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la facture:', error);
      return false;
    }
  };

  const contextValue: PaiementContextType = {
    paiementEnCours: state.paiementEnCours,
    codePromoActuel: state.codePromoActuel,
    detailsPaiement: state.detailsPaiement,
    appliquerCodePromo,
    retirerCodePromo,
    initialiserPaiement,
    traiterPaiement,
    confirmerPaiement,
    annulerPaiement,
    calculerTotauxAvecPromo: calculerTotauxAvecPromoWrapper,
    genererFacture,
    envoyerFacture
  };

  return (
    <PaiementContext.Provider value={contextValue}>
      {children}
    </PaiementContext.Provider>
  );
}

export function usePaiement(): PaiementContextType {
  const context = useContext(PaiementContext);
  if (!context) {
    throw new Error('usePaiement doit être utilisé dans un PaiementProvider');
  }
  return context;
}
