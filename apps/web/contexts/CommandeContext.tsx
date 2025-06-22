'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { 
  ProcessusCommande, 
  EtapeCommande, 
  ModeRecuperation, 
  CreneauHoraire, 
  InformationsClient,
  Commande,
  ArticleCommande
} from '../lib/commande-types';
import { 
  convertirPanierEnArticles, 
  calculerTotauxCommande,
  creerCommande,
  sauvegarderCommande 
} from '../lib/commande-utils';
import { usePanier } from './PanierContext';

// Actions du reducer
type CommandeAction =
  | { type: 'INITIALISER_COMMANDE'; payload: { articles: ArticleCommande[] } }
  | { type: 'CHANGER_ETAPE'; payload: { etape: EtapeCommande } }
  | { type: 'DEFINIR_MODE_RECUPERATION'; payload: { mode: ModeRecuperation } }
  | { type: 'DEFINIR_CRENEAU'; payload: { creneau: CreneauHoraire } }
  | { type: 'DEFINIR_INFORMATIONS_CLIENT'; payload: { informations: InformationsClient } }
  | { type: 'RECALCULER_TOTAUX' }
  | { type: 'REINITIALISER_COMMANDE' }
  | { type: 'FINALISER_COMMANDE'; payload: { commande: Commande } };

// État initial
const etatInitial: ProcessusCommande = {
  etapeActuelle: EtapeCommande.CRENEAU, // Commencer directement au choix du créneau
  articles: [],
  totaux: {
    sousTotal: 0,
    taxes: 0,
    total: 0
  }
};

// Reducer pour gérer le processus de commande
const commandeReducer = (state: ProcessusCommande, action: CommandeAction): ProcessusCommande => {
  switch (action.type) {
    case 'INITIALISER_COMMANDE':
      const { articles } = action.payload;
      const totauxInitiaux = calculerTotauxCommande(articles);
      return {
        ...etatInitial,
        articles,
        totaux: totauxInitiaux
      };

    case 'CHANGER_ETAPE':
      return {
        ...state,
        etapeActuelle: action.payload.etape
      };

    case 'DEFINIR_MODE_RECUPERATION':
      const { mode } = action.payload;
      const nouveauxTotaux = calculerTotauxCommande(state.articles);
      return {
        ...state,
        modeRecuperation: mode,
        totaux: nouveauxTotaux
      };

    case 'DEFINIR_CRENEAU':
      return {
        ...state,
        creneauChoisi: action.payload.creneau
      };

    case 'DEFINIR_INFORMATIONS_CLIENT':
      const { informations } = action.payload;
      const totauxMisAJour = calculerTotauxCommande(state.articles);
      
      return {
        ...state,
        informationsClient: informations,
        totaux: totauxMisAJour
      };

    case 'RECALCULER_TOTAUX':
      const totauxRecalcules = calculerTotauxCommande(state.articles);
      
      return {
        ...state,
        totaux: totauxRecalcules
      };

    case 'REINITIALISER_COMMANDE':
      return etatInitial;

    case 'FINALISER_COMMANDE':
      return {
        ...state,
        etapeActuelle: EtapeCommande.CONFIRMATION
      };

    default:
      return state;
  }
};

// Type du contexte
interface CommandeContextType {
  processus: ProcessusCommande;
  initialiserCommande: (articles: ArticleCommande[]) => void;
  changerEtape: (etape: EtapeCommande) => void;
  definirModeRecuperation: (mode: ModeRecuperation) => void;
  definirCreneau: (creneau: CreneauHoraire) => void;
  definirInformationsClient: (informations: InformationsClient) => void;
  recalculerTotaux: () => void;
  reinitialiserCommande: () => void;
  finaliserCommande: () => Promise<Commande>;
  peutAvancer: () => boolean;
  peutReculer: () => boolean;
  etapeSuivante: () => void;
  etapePrecedente: () => void;
}

// Créer le contexte
const CommandeContext = createContext<CommandeContextType | undefined>(undefined);

// Hook pour utiliser le contexte
export const useCommande = (): CommandeContextType => {
  const context = useContext(CommandeContext);
  if (!context) {
    throw new Error('useCommande doit être utilisé dans un CommandeProvider');
  }
  return context;
};

// Props du provider
interface CommandeProviderProps {
  children: ReactNode;
}

// Provider du contexte
export const CommandeProvider: React.FC<CommandeProviderProps> = ({ children }) => {
  const [processus, dispatch] = useReducer(commandeReducer, etatInitial);

  // Actions
  const initialiserCommande = (articles: ArticleCommande[]) => {
    dispatch({ type: 'INITIALISER_COMMANDE', payload: { articles } });
    // Définir automatiquement le mode retrait
    dispatch({ type: 'DEFINIR_MODE_RECUPERATION', payload: { mode: ModeRecuperation.RETRAIT } });
  };

  const changerEtape = (etape: EtapeCommande) => {
    dispatch({ type: 'CHANGER_ETAPE', payload: { etape } });
  };

  const definirModeRecuperation = (mode: ModeRecuperation) => {
    dispatch({ type: 'DEFINIR_MODE_RECUPERATION', payload: { mode } });
  };

  const definirCreneau = (creneau: CreneauHoraire) => {
    dispatch({ type: 'DEFINIR_CRENEAU', payload: { creneau } });
  };

  const definirInformationsClient = (informations: InformationsClient) => {
    dispatch({ type: 'DEFINIR_INFORMATIONS_CLIENT', payload: { informations } });
  };

  const recalculerTotaux = () => {
    dispatch({ type: 'RECALCULER_TOTAUX' });
  };

  const reinitialiserCommande = () => {
    dispatch({ type: 'REINITIALISER_COMMANDE' });
  };

  const finaliserCommande = async (): Promise<Commande> => {
    if (!processus.creneauChoisi || !processus.informationsClient) {
      throw new Error('Informations manquantes pour finaliser la commande');
    }

    const commande = creerCommande(processus);
    
    // Sauvegarder la commande
    sauvegarderCommande(commande);
    
    // Marquer comme finalisée
    dispatch({ type: 'FINALISER_COMMANDE', payload: { commande } });
    
    return commande;
  };

  // Utilitaires de navigation
  const peutAvancer = (): boolean => {
    switch (processus.etapeActuelle) {
      case EtapeCommande.CRENEAU:
        return !!processus.creneauChoisi;
      case EtapeCommande.INFORMATIONS_CLIENT:
        return !!processus.informationsClient;
      case EtapeCommande.RECAPITULATIF:
        return true;
      default:
        return false;
    }
  };

  const peutReculer = (): boolean => {
    return processus.etapeActuelle !== EtapeCommande.CRENEAU && 
           processus.etapeActuelle !== EtapeCommande.CONFIRMATION;
  };

  const etapeSuivante = () => {
    if (!peutAvancer()) return;

    const etapes = [
      EtapeCommande.CRENEAU,
      EtapeCommande.INFORMATIONS_CLIENT,
      EtapeCommande.RECAPITULATIF
    ];

    const indexActuel = etapes.indexOf(processus.etapeActuelle);
    if (indexActuel >= 0 && indexActuel < etapes.length - 1) {
      const prochaineEtape = etapes[indexActuel + 1];
      if (prochaineEtape) {
        changerEtape(prochaineEtape);
      }
    }
  };

  const etapePrecedente = () => {
    if (!peutReculer()) return;

    const etapes = [
      EtapeCommande.CRENEAU,
      EtapeCommande.INFORMATIONS_CLIENT,
      EtapeCommande.RECAPITULATIF
    ];

    const indexActuel = etapes.indexOf(processus.etapeActuelle);
    if (indexActuel > 0) {
      const etapePrecedente = etapes[indexActuel - 1];
      if (etapePrecedente) {
        changerEtape(etapePrecedente);
      }
    }
  };

  // Valeur du contexte
  const contextValue: CommandeContextType = {
    processus,
    initialiserCommande,
    changerEtape,
    definirModeRecuperation,
    definirCreneau,
    definirInformationsClient,
    recalculerTotaux,
    reinitialiserCommande,
    finaliserCommande,
    peutAvancer,
    peutReculer,
    etapeSuivante,
    etapePrecedente
  };

  return (
    <CommandeContext.Provider value={contextValue}>
      {children}
    </CommandeContext.Provider>
  );
};
