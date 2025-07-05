import { 
  CodePromo, 
  DetailsPaiement, 
  TypeReduction, 
  Paiement, 
  StatutPaiement,
  MethodePaiement,
  Facture,
  StatutFacture,
  ReponsePaiement,
  DonneesPaiementCarte
} from './paiement-types';

// Configuration par défaut
export const CONFIGURATION_PAIEMENT = {
  tvaDefaut: 0.055, // 5.5% pour les produits alimentaires
  fraisServiceFixe: 0, // Pas de frais fixe
  fraisServicePourcentage: 0, // Pas de frais de service
  deviseDefaut: 'EUR',
  montantMinimumPaiement: 1.00,
  delaiExpiration: 15 * 60 * 1000 // 15 minutes en ms
};

// Validation des codes promo
export function validerCodePromo(code: CodePromo, sousTotal: number, categoriesCommande: number[] = []): boolean {
  const maintenant = new Date();
  
  // Vérifications de base
  if (!code.actif) return false;
  if (maintenant < code.dateDebut || maintenant > code.dateFin) return false;
  if (code.utilisationsMax && code.utilisationsActuelles >= code.utilisationsMax) return false;
  
  // Montant minimum
  if (code.montantMinimum && sousTotal < code.montantMinimum) return false;
  
  // Catégories éligibles
  if (code.categoriesEligibles && code.categoriesEligibles.length > 0) {
    const hasCategorie = categoriesCommande.some(cat => code.categoriesEligibles!.includes(cat));
    if (!hasCategorie) return false;
  }
  
  return true;
}

// Calculer la réduction
export function calculerReduction(code: CodePromo, sousTotal: number): number {
  switch (code.typeReduction) {
    case TypeReduction.POURCENTAGE:
      return sousTotal * (code.valeurReduction / 100);
    
    case TypeReduction.MONTANT_FIXE:
      return Math.min(code.valeurReduction, sousTotal);
    
    case TypeReduction.LIVRAISON_GRATUITE:
      return 0; // Géré séparément pour les frais de livraison
    
    default:
      return 0;
  }
}

// Calculer les totaux avec promo
export function calculerTotauxAvecPromo(
  sousTotal: number, 
  codePromo?: CodePromo,
  fraisLivraison: number = 0
): DetailsPaiement {
  let reduction = 0;
  let fraisLivraisonFinal = fraisLivraison;
  
  if (codePromo) {
    if (codePromo.typeReduction === TypeReduction.LIVRAISON_GRATUITE) {
      fraisLivraisonFinal = 0;
    } else {
      reduction = calculerReduction(codePromo, sousTotal);
    }
  }
  
  const sousTotalAjuste = sousTotal - reduction + fraisLivraisonFinal;
  const montantTVA = sousTotalAjuste * CONFIGURATION_PAIEMENT.tvaDefaut;
  const total = sousTotalAjuste + montantTVA;
  
  return {
    sousTotal: sousTotalAjuste,
    reduction,
    codePromoApplique: codePromo,
    montantTVA,
    fraisService: 0,
    total
  };
}

// Générer un numéro de facture
export function genererNumeroFacture(): string {
  const date = new Date();
  const annee = date.getFullYear();
  const mois = String(date.getMonth() + 1).padStart(2, '0');
  const numero = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  
  return `FACT-${annee}${mois}-${numero}`;
}

// Créer une facture
export function creerFacture(
  commandeId: string, 
  montantHT: number, 
  montantTTC: number
): Facture {
  return {
    id: `facture-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    numero: genererNumeroFacture(),
    commandeId,
    dateEmission: new Date(),
    montantHT,
    montantTTC,
    tauxTVA: CONFIGURATION_PAIEMENT.tvaDefaut,
    statut: StatutFacture.EMISE,
    emailEnvoye: false
  };
}

// Simuler un paiement par carte (pour développement)
export async function simulerPaiementCarte(
  montant: number, 
  donneesCarte: DonneesPaiementCarte
): Promise<ReponsePaiement> {
  // Simulation d'un délai de traitement
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Simuler des cas d'échec pour certains numéros de carte
  const numeroTestEchec = ['4000000000000002', '4000000000000119'];
  
  if (numeroTestEchec.includes(donneesCarte.numeroCard)) {
    return {
      succes: false,
      erreur: 'Carte refusée par votre banque',
      statut: StatutPaiement.REFUSE
    };
  }
  
  // Simuler un succès
  return {
    succes: true,
    transactionId: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    montantDebite: montant,
    statut: StatutPaiement.VALIDE
  };
}

// Simuler un paiement PayPal
export async function simulerPaiementPayPal(montant: number): Promise<ReponsePaiement> {
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  return {
    succes: true,
    transactionId: `pp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    montantDebite: montant,
    statut: StatutPaiement.VALIDE
  };
}

// Formatage pour l'affichage
export function formaterCodePromo(code: CodePromo): string {
  switch (code.typeReduction) {
    case TypeReduction.POURCENTAGE:
      return `-${code.valeurReduction}%`;
    
    case TypeReduction.MONTANT_FIXE:
      return `-${code.valeurReduction.toFixed(2)}€`;
    
    case TypeReduction.LIVRAISON_GRATUITE:
      return 'Livraison offerte';
    
    default:
      return 'Réduction';
  }
}

// Vérifier la validité d'une carte de crédit (algorithme de Luhn simplifié)
export function validerNumeroCarte(numero: string): boolean {
  const numeroNettoye = numero.replace(/\s+/g, '');
  
  if (!/^\d{13,19}$/.test(numeroNettoye)) {
    return false;
  }
  
  let somme = 0;
  let alternatif = false;
  
  for (let i = numeroNettoye.length - 1; i >= 0; i--) {
    let chiffre = parseInt(numeroNettoye.charAt(i), 10);
    
    if (alternatif) {
      chiffre *= 2;
      if (chiffre > 9) {
        chiffre = (chiffre % 10) + 1;
      }
    }
    
    somme += chiffre;
    alternatif = !alternatif;
  }
  
  return (somme % 10) === 0;
}

// Masquer un numéro de carte pour l'affichage
export function masquerNumeroCarte(numero: string): string {
  const numeroNettoye = numero.replace(/\s+/g, '');
  if (numeroNettoye.length < 4) return '****';
  
  const derniers4 = numeroNettoye.slice(-4);
  const nombreEtoiles = Math.max(0, numeroNettoye.length - 4);
  
  return '*'.repeat(nombreEtoiles) + derniers4;
}

// Codes promo prédéfinis pour les tests
export const CODES_PROMO_TEST: CodePromo[] = [
  {
    id: 'promo-1',
    code: 'BIENVENUE10',
    nom: 'Réduction première commande',
    description: '10% de réduction sur votre première commande',
    typeReduction: TypeReduction.POURCENTAGE,
    valeurReduction: 10,
    montantMinimum: 15,
    dateDebut: new Date('2024-01-01'),
    dateFin: new Date('2025-12-31'),
    utilisationsMax: 1000,
    utilisationsActuelles: 0,
    actif: true,
    premiereCommande: true
  },
  {
    id: 'promo-2',
    code: 'WEEK5',
    nom: 'Réduction week-end',
    description: '5€ de réduction le week-end',
    typeReduction: TypeReduction.MONTANT_FIXE,
    valeurReduction: 5,
    montantMinimum: 25,
    dateDebut: new Date('2024-01-01'),
    dateFin: new Date('2025-12-31'),
    utilisationsActuelles: 0,
    actif: true
  },
  {
    id: 'promo-3',
    code: 'LIVRAISONOFF',
    nom: 'Livraison gratuite',
    description: 'Livraison gratuite sans minimum',
    typeReduction: TypeReduction.LIVRAISON_GRATUITE,
    valeurReduction: 0,
    dateDebut: new Date('2024-01-01'),
    dateFin: new Date('2025-12-31'),
    utilisationsActuelles: 0,
    actif: true
  }
];
