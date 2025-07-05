// Types pour le système de paiement
export interface Paiement {
  id: string;
  commandeId: string;
  montant: number;
  statut: StatutPaiement;
  methodePaiement: MethodePaiement;
  dateCreation: Date;
  dateValidation?: Date;
  transactionId?: string;
  codePromo?: CodePromo;
  facture?: Facture;
}

export enum StatutPaiement {
  EN_ATTENTE = 'EN_ATTENTE',
  EN_COURS = 'EN_COURS',
  VALIDE = 'VALIDE',
  REFUSE = 'REFUSE',
  REMBOURSE = 'REMBOURSE',
  ANNULE = 'ANNULE'
}

export enum MethodePaiement {
  CARTE_BANCAIRE = 'CARTE_BANCAIRE',
  PAYPAL = 'PAYPAL',
  APPLE_PAY = 'APPLE_PAY',
  GOOGLE_PAY = 'GOOGLE_PAY',
  ESPECES = 'ESPECES' // Pour retrait en magasin
}

export interface CodePromo {
  id: string;
  code: string;
  nom: string;
  description: string;
  typeReduction: TypeReduction;
  valeurReduction: number; // Pourcentage ou montant fixe
  montantMinimum?: number;
  dateDebut: Date;
  dateFin: Date;
  utilisationsMax?: number;
  utilisationsActuelles: number;
  actif: boolean;
  categoriesEligibles?: number[]; // IDs des catégories
  produitsEligibles?: number[]; // IDs des produits
  premiereCommande?: boolean; // Réservé aux nouveaux clients
}

export enum TypeReduction {
  POURCENTAGE = 'POURCENTAGE',
  MONTANT_FIXE = 'MONTANT_FIXE',
  LIVRAISON_GRATUITE = 'LIVRAISON_GRATUITE'
}

export interface Facture {
  id: string;
  numero: string;
  commandeId: string;
  dateEmission: Date;
  montantHT: number;
  montantTTC: number;
  tauxTVA: number;
  statut: StatutFacture;
  emailEnvoye: boolean;
  dateEnvoi?: Date;
  lienTelechargement?: string;
}

export enum StatutFacture {
  BROUILLON = 'BROUILLON',
  EMISE = 'EMISE',
  ENVOYEE = 'ENVOYEE',
  PAYEE = 'PAYEE'
}

export interface DetailsPaiement {
  sousTotal: number;
  reduction: number;
  codePromoApplique?: CodePromo;
  montantTVA: number;
  fraisService?: number;
  total: number;
}

export interface PaiementContextType {
  paiementEnCours: Paiement | null;
  codePromoActuel: CodePromo | null;
  detailsPaiement: DetailsPaiement | null;
  
  // Actions codes promo
  appliquerCodePromo: (code: string) => Promise<boolean>;
  retirerCodePromo: () => void;
  
  // Actions paiement
  initialiserPaiement: (commandeId: string, montant: number) => void;
  traiterPaiement: (methodePaiement: MethodePaiement, donneesPaiement: any) => Promise<boolean>;
  confirmerPaiement: (transactionId: string) => void;
  annulerPaiement: () => void;
  
  // Calculs
  calculerTotauxAvecPromo: (sousTotal: number, codePromo?: CodePromo) => DetailsPaiement;
  
  // Factures
  genererFacture: (commandeId: string) => Promise<Facture>;
  envoyerFacture: (factureId: string, email: string) => Promise<boolean>;
}

// Configuration Stripe/Paiement
export interface ConfigurationPaiement {
  stripePublicKey: string;
  paypalClientId: string;
  deviseDefaut: string;
  fraisServiceFixe: number;
  fraisServicePourcentage: number;
  tvaDefaut: number;
}

// Interface pour les données de paiement par carte
export interface DonneesPaiementCarte {
  numeroCard: string;
  expirationMois: number;
  expirationAnnee: number;
  cvv: string;
  nomPorteur: string;
}

// Interface pour la réponse de l'API de paiement
export interface ReponsePaiement {
  succes: boolean;
  transactionId?: string;
  erreur?: string;
  montantDebite?: number;
  statut: StatutPaiement;
}
