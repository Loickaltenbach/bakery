// Types pour la gestion des utilisateurs et authentification

import { Commande } from './commande-types';

export interface Utilisateur {
  id: string;
  email: string;
  motDePasse?: string; // Ne pas stocker en plain text en production
  nom: string;
  prenom: string;
  telephone: string;
  dateCreation: Date;
  dateMiseAJour: Date;
  role: RoleUtilisateur;
  statut: StatutUtilisateur;
  preferences?: PreferencesUtilisateur;
  adressesSauvegardees: AdresseUtilisateur[];
}

export enum RoleUtilisateur {
  CLIENT = 'CLIENT',
  EMPLOYE = 'EMPLOYE',
  ADMIN = 'ADMIN'
}

export enum StatutUtilisateur {
  ACTIF = 'ACTIF',
  INACTIF = 'INACTIF',
  SUSPENDU = 'SUSPENDU'
}

export interface PreferencesUtilisateur {
  allergies: string[];
  regimeAlimentaire?: RegimeAlimentaire;
  preferencesNotification: PreferencesNotification;
  languePreferee: string;
}

export enum RegimeAlimentaire {
  OMNIVORE = 'OMNIVORE',
  VEGETARIEN = 'VEGETARIEN',
  VEGAN = 'VEGAN',
  SANS_GLUTEN = 'SANS_GLUTEN',
  HALAL = 'HALAL',
  CASHER = 'CASHER'
}

export interface PreferencesNotification {
  email: boolean;
  sms: boolean;
  commandeReady: boolean;
  promotions: boolean;
  nouveauxProduits: boolean;
}

export interface AdresseUtilisateur {
  id: string;
  nom: string; // ex: "Maison", "Travail"
  rue: string;
  codePostal: string;
  ville: string;
  pays: string;
  estPrincipale: boolean;
  instructions?: string; // Instructions de livraison spéciales
}

// Types pour l'authentification
export interface SessionUtilisateur {
  utilisateur: Utilisateur;
  token: string;
  dateExpiration: Date;
}

export interface InformationsConnexion {
  email: string;
  motDePasse: string;
  seSouvenirDeMoi?: boolean;
}

export interface InformationsInscription {
  email: string;
  motDePasse: string;
  confirmationMotDePasse: string;
  nom: string;
  prenom: string;
  telephone: string;
  accepteConditions: boolean;
  accepteNewsletter?: boolean;
}

// Types pour l'historique des commandes
export interface HistoriqueCommande {
  commandes: CommandeUtilisateur[];
  statistiques: StatistiquesUtilisateur;
}

export interface CommandeUtilisateur extends Omit<Commande, 'client'> {
  evaluee?: boolean;
  noteEvaluation?: number;
  commentaireEvaluation?: string;
}

export interface StatistiquesUtilisateur {
  nombreCommandesTotales: number;
  montantTotalDepense: number;
  commandeMoyenneParMois: number;
  produitPrefere?: string;
  derniere_commande?: Date;
  premiereCommande?: Date;
}

// Types pour l'administration
export interface DashboardStats {
  ventesDuJour: {
    nombreCommandes: number;
    chiffreAffaires: number;
    commandesMoyenneParHeure: number;
  };
  ventesDeLaSemaine: {
    evolution: number; // pourcentage par rapport à la semaine précédente
    commandesParJour: { jour: string; nombre: number; ca: number }[];
  };
  ventesDuMois: {
    objectifMensuel: number;
    progression: number;
    commandesParSemaine: { semaine: string; nombre: number; ca: number }[];
  };
  produitsPopulaires: {
    nom: string;
    quantiteVendue: number;
    chiffreAffaires: number;
  }[];
  creneauxPopulaires: {
    creneau: string;
    nombreCommandes: number;
    pourcentage: number;
  }[];
}

export interface GestionCommande extends Commande {
  tempsPassed: number; // en minutes depuis création
  priorite: PrioriteCommande;
  notesPreparation?: string;
  employeAssigne?: string;
}

export enum PrioriteCommande {
  NORMALE = 'NORMALE',
  URGENTE = 'URGENTE',
  RETARD = 'RETARD'
}

export enum StatutPreparation {
  EN_ATTENTE = 'EN_ATTENTE',
  EN_PREPARATION = 'EN_PREPARATION',
  PRET = 'PRET',
  RECUPERE = 'RECUPERE',
  ANNULE = 'ANNULE'
}

export interface GestionStock {
  produitId: string;
  nom: string;
  quantiteDisponible: number;
  quantiteMinimum: number;
  quantiteMaximum: number;
  enRupture: boolean;
  dateDerniereModification: Date;
  employeModificateur: string;
}

// Types pour les événements en temps réel
export interface EvenementCommande {
  type: TypeEvenementCommande;
  commandeId: string;
  timestamp: Date;
  details: any;
  employeId?: string;
}

export enum TypeEvenementCommande {
  NOUVELLE_COMMANDE = 'NOUVELLE_COMMANDE',
  COMMANDE_CONFIRMEE = 'COMMANDE_CONFIRMEE',
  PREPARATION_COMMENCEE = 'PREPARATION_COMMENCEE',
  COMMANDE_PRETE = 'COMMANDE_PRETE',
  COMMANDE_RECUPEREE = 'COMMANDE_RECUPEREE',
  COMMANDE_ANNULEE = 'COMMANDE_ANNULEE',
  STOCK_MODIFIE = 'STOCK_MODIFIE'
}
