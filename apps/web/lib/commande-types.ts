import { Produit } from './api';

// Enums pour les statuts et modes
export enum StatutCommande {
  EN_ATTENTE = 'EN_ATTENTE',
  CONFIRMATION = 'CONFIRMATION',
  PREPARATION = 'PREPARATION',
  PRETE = 'PRETE',
  TERMINEE = 'TERMINEE',
  ANNULEE = 'ANNULEE'
}

export enum ModeRecuperation {
  RETRAIT = 'RETRAIT'
}

// Types pour les créneaux horaires
export interface CreneauHoraire {
  id: string;
  debut: Date;
  fin: Date;
  disponible: boolean;
  type: ModeRecuperation;
}

// Types pour les informations client
export interface InformationsClient {
  nom: string;
  prenom: string;
  telephone: string;
  email: string;
}

export interface AdresseClient {
  rue: string;
  ville: string;
  codePostal: string;
  complement?: string;
}

// Types pour les articles commandés
export interface ArticleCommande {
  produit: Produit;
  quantite: number;
  prixUnitaire: number;
  sousTotal: number;
}

// Type principal pour une commande
export interface Commande {
  id: string;
  numeroCommande: string;
  statut: StatutCommande;
  modeRecuperation: ModeRecuperation;
  creneauChoisi: CreneauHoraire;
  client: InformationsClient;
  articles: ArticleCommande[];
  sousTotal: number;
  taxes: number;
  total: number;
  dateCreation: Date;
  dateMiseAJour: Date;
  notes?: string;
}

// Type pour les commandes depuis l'API Strapi
export interface CommandeStrapi {
  id: string;
  numero: string;
  statut: string;
  modeRetrait: string;
  produits: any[];
  prixTotal: number;
  informationsClient: any;
  creneauRetrait: any;
  commentaires?: string;
  dateCreation: Date;
  dateMiseAJour?: Date;
  dateRetiree?: Date;
  paiement?: {
    statut: string;
    methode?: string;
    reference?: string;
  };
}

// Étapes du processus de commande
export enum EtapeCommande {
  PANIER = 'PANIER',
  MODE_RECUPERATION = 'MODE_RECUPERATION',
  CRENEAU = 'CRENEAU',
  INFORMATIONS_CLIENT = 'INFORMATIONS_CLIENT',
  RECAPITULATIF = 'RECAPITULATIF',
  CONFIRMATION = 'CONFIRMATION'
}

// État du processus de commande
export interface ProcessusCommande {
  etapeActuelle: EtapeCommande;
  modeRecuperation?: ModeRecuperation;
  creneauChoisi?: CreneauHoraire;
  informationsClient?: InformationsClient;
  articles: ArticleCommande[];
  totaux: {
    sousTotal: number;
    taxes: number;
    total: number;
  };
}

// Configuration des frais et taxes
export interface ConfigurationCommande {
  tauxTVA: number; // ex: 0.055 pour 5.5%
  horairesOuverture: {
    [key: string]: { // jour de la semaine
      ouvert: boolean;
      debut: string; // HH:mm
      fin: string; // HH:mm
      pauseDebut?: string;
      pauseFin?: string;
    };
  };
  delaiPreparation: number; // en minutes
}
