// Utilitaires pour l'interface d'administration

import { 
  DashboardStats, 
  GestionCommande, 
  GestionStock, 
  EvenementCommande,
  TypeEvenementCommande,
  PrioriteCommande 
} from './auth-types';
import { StatutCommande } from './commande-types';

// Simulation de données pour le dashboard
export function obtenirStatsTableauDeBord(): DashboardStats {
  // En production, ces données viendraient de la base de données
  const maintenant = new Date();
  
  return {
    ventesDuJour: {
      nombreCommandes: 23,
      chiffreAffaires: 456.80,
      commandesMoyenneParHeure: 2.1
    },
    ventesDeLaSemaine: {
      evolution: 12.5, // +12.5% par rapport à la semaine précédente
      commandesParJour: [
        { jour: 'Lun', nombre: 18, ca: 342.50 },
        { jour: 'Mar', nombre: 25, ca: 487.90 },
        { jour: 'Mer', nombre: 31, ca: 612.30 },
        { jour: 'Jeu', nombre: 28, ca: 534.60 },
        { jour: 'Ven', nombre: 45, ca: 890.20 },
        { jour: 'Sam', nombre: 52, ca: 1024.80 },
        { jour: 'Dim', nombre: 15, ca: 298.70 }
      ]
    },
    ventesDuMois: {
      objectifMensuel: 15000,
      progression: 68.5,
      commandesParSemaine: [
        { semaine: 'S1', nombre: 142, ca: 2845.90 },
        { semaine: 'S2', nombre: 156, ca: 3124.60 },
        { semaine: 'S3', nombre: 189, ca: 3789.40 },
        { semaine: 'S4', nombre: 178, ca: 3567.20 }
      ]
    },
    produitsPopulaires: [
      { nom: 'Pain de campagne', quantiteVendue: 45, chiffreAffaires: 157.50 },
      { nom: 'Croissant au beurre', quantiteVendue: 38, chiffreAffaires: 49.40 },
      { nom: 'Kougelhopf', quantiteVendue: 12, chiffreAffaires: 96.00 },
      { nom: 'Bretzel', quantiteVendue: 28, chiffreAffaires: 50.40 },
      { nom: 'Tarte flambée', quantiteVendue: 8, chiffreAffaires: 72.00 }
    ],
    creneauxPopulaires: [
      { creneau: '08:00-09:00', nombreCommandes: 18, pourcentage: 32.1 },
      { creneau: '12:00-13:00', nombreCommandes: 15, pourcentage: 26.8 },
      { creneau: '17:00-18:00', nombreCommandes: 12, pourcentage: 21.4 },
      { creneau: '09:00-10:00', nombreCommandes: 8, pourcentage: 14.3 },
      { creneau: '16:00-17:00', nombreCommandes: 3, pourcentage: 5.4 }
    ]
  };
}

// Simulation des commandes en gestion
let commandesEnGestion: GestionCommande[] = [
  {
    id: 'cmd-001',
    numeroCommande: 'BL-001',
    statut: StatutCommande.EN_ATTENTE,
    modeRecuperation: 'RETRAIT' as any,
    creneauChoisi: {
      id: 'creneau-1',
      debut: new Date(Date.now() + 2 * 60 * 60 * 1000), // Dans 2h
      fin: new Date(Date.now() + 2.5 * 60 * 60 * 1000),
      disponible: true,
      type: 'RETRAIT' as any
    },
    client: {
      nom: 'Dupont',
      prenom: 'Marie',
      telephone: '06 12 34 56 78',
      email: 'marie.dupont@email.com'
    },
    articles: [
      {
        produit: { 
          id: 1, 
          nom: 'Pain de campagne', 
          prix: 3.50, 
          description: '', 
          categorie: { id: 1, nom: 'Pains' } as any,
          image: [] as any
        } as any,
        quantite: 2,
        prixUnitaire: 3.50,
        sousTotal: 7.00
      }
    ],
    sousTotal: 7.00,
    taxes: 0.39,
    total: 7.39,
    dateCreation: new Date(Date.now() - 30 * 60 * 1000), // Il y a 30 min
    dateMiseAJour: new Date(),
    tempsPassed: 30,
    priorite: PrioriteCommande.NORMALE
  },
  {
    id: 'cmd-002',
    numeroCommande: 'BL-002',
    statut: StatutCommande.PREPARATION,
    modeRecuperation: 'RETRAIT' as any,
    creneauChoisi: {
      id: 'creneau-2',
      debut: new Date(Date.now() + 1 * 60 * 60 * 1000), // Dans 1h
      fin: new Date(Date.now() + 1.5 * 60 * 60 * 1000),
      disponible: true,
      type: 'RETRAIT' as any
    },
    client: {
      nom: 'Martin',
      prenom: 'Pierre',
      telephone: '06 98 76 54 32',
      email: 'pierre.martin@email.com'
    },
    articles: [
      {
        produit: { 
          id: 2, 
          nom: 'Croissant', 
          prix: 1.30, 
          description: '', 
          categorie: { id: 2, nom: 'Viennoiseries' } as any,
          image: [] as any
        } as any,
        quantite: 4,
        prixUnitaire: 1.30,
        sousTotal: 5.20
      }
    ],
    sousTotal: 5.20,
    taxes: 0.29,
    total: 5.49,
    dateCreation: new Date(Date.now() - 45 * 60 * 1000), // Il y a 45 min
    dateMiseAJour: new Date(),
    tempsPassed: 45,
    priorite: PrioriteCommande.URGENTE,
    employeAssigne: 'Marie Schmidt'
  }
];

// Gestion des commandes
export function obtenirCommandesEnGestion(): GestionCommande[] {
  return [...commandesEnGestion].sort((a, b) => {
    // Trier par priorité puis par temps passé
    if (a.priorite !== b.priorite) {
      const priorites = [PrioriteCommande.RETARD, PrioriteCommande.URGENTE, PrioriteCommande.NORMALE];
      return priorites.indexOf(a.priorite) - priorites.indexOf(b.priorite);
    }
    return b.tempsPassed - a.tempsPassed;
  });
}

export function mettreAJourStatutCommande(
  commandeId: string, 
  nouveauStatut: StatutCommande,
  employeId?: string,
  notes?: string
): boolean {
  const index = commandesEnGestion.findIndex(c => c.id === commandeId);
  if (index === -1) return false;

  const commande = commandesEnGestion[index]!;
  commandesEnGestion[index] = {
    ...commande,
    statut: nouveauStatut,
    dateMiseAJour: new Date(),
    employeAssigne: employeId || commande.employeAssigne,
    notesPreparation: notes || commande.notesPreparation
  };

  // Émettre un événement
  emettrEvenementCommande({
    type: TypeEvenementCommande.COMMANDE_CONFIRMEE,
    commandeId,
    timestamp: new Date(),
    details: { nouveauStatut, employeId },
    employeId
  });

  return true;
}

export function assignerCommande(commandeId: string, employeId: string): boolean {
  const index = commandesEnGestion.findIndex(c => c.id === commandeId);
  if (index === -1) return false;

  const commande = commandesEnGestion[index]!;
  commandesEnGestion[index] = {
    ...commande,
    employeAssigne: employeId,
    dateMiseAJour: new Date()
  };

  return true;
}

export function definirPrioriteCommande(commandeId: string, priorite: PrioriteCommande): boolean {
  const index = commandesEnGestion.findIndex(c => c.id === commandeId);
  if (index === -1) return false;

  const commande = commandesEnGestion[index]!;
  commandesEnGestion[index] = {
    ...commande,
    priorite,
    dateMiseAJour: new Date()
  };

  return true;
}

// Fonctions supplémentaires pour la gestion des commandes

export function obtenirCommandesEnCours(): GestionCommande[] {
  return obtenirCommandesEnGestion().filter(commande => 
    commande.statut === StatutCommande.CONFIRMATION ||
    commande.statut === StatutCommande.PREPARATION ||
    commande.statut === StatutCommande.PRETE
  );
}

export function obtenirToutesLesCommandes(): GestionCommande[] {
  return obtenirCommandesEnGestion();
}

export function changerStatutCommande(commandeId: string, nouveauStatut: StatutCommande): Promise<boolean> {
  return Promise.resolve(mettreAJourStatutCommande(commandeId, nouveauStatut));
}

export function obtenirDetailsCommande(commandeId: string): Promise<GestionCommande | null> {
  const commande = commandesEnGestion.find(c => c.id === commandeId);
  return Promise.resolve(commande || null);
}

export function attribuerCommandeEmploye(commandeId: string, employeId: string): Promise<boolean> {
  return Promise.resolve(assignerCommande(commandeId, employeId));
}

export function calculerTempsRestant(dateRetrait: Date | string): string {
  const maintenant = new Date();
  const retrait = new Date(dateRetrait);
  const diffMs = retrait.getTime() - maintenant.getTime();
  
  if (diffMs <= 0) return 'En retard';
  
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const heures = Math.floor(diffMinutes / 60);
  const minutes = diffMinutes % 60;
  
  if (heures > 0) {
    return `${heures}h ${minutes}min`;
  }
  return `${minutes}min`;
}

export function obtenirEvenementsCommande(commandeId: string): EvenementCommande[] {
  // Simulation d'événements
  return [
    {
      type: TypeEvenementCommande.NOUVELLE_COMMANDE,
      commandeId,
      timestamp: new Date(),
      details: { message: 'Commande créée' }
    }
  ];
}

// Gestion des stocks
let stocksDB: GestionStock[] = [
  {
    produitId: '1',
    nom: 'Pain de campagne',
    quantiteDisponible: 25,
    quantiteMinimum: 10,
    quantiteMaximum: 50,
    enRupture: false,
    dateDerniereModification: new Date(),
    employeModificateur: 'Système'
  },
  {
    produitId: '2',
    nom: 'Croissant au beurre',
    quantiteDisponible: 5,
    quantiteMinimum: 15,
    quantiteMaximum: 40,
    enRupture: false,
    dateDerniereModification: new Date(),
    employeModificateur: 'Marie Schmidt'
  },
  {
    produitId: '3',
    nom: 'Kougelhopf',
    quantiteDisponible: 0,
    quantiteMinimum: 5,
    quantiteMaximum: 15,
    enRupture: true,
    dateDerniereModification: new Date(),
    employeModificateur: 'Hans Müller'
  }
];

export function obtenirGestionStocks(): GestionStock[] {
  return [...stocksDB].sort((a, b) => {
    // Afficher d'abord les produits en rupture ou en stock faible
    if (a.enRupture !== b.enRupture) return a.enRupture ? -1 : 1;
    
    const aStockFaible = a.quantiteDisponible <= a.quantiteMinimum;
    const bStockFaible = b.quantiteDisponible <= b.quantiteMinimum;
    if (aStockFaible !== bStockFaible) return aStockFaible ? -1 : 1;
    
    return a.nom.localeCompare(b.nom);
  });
}

export function mettreAJourStock(
  produitId: string, 
  nouvelleQuantite: number, 
  employeId: string
): boolean {
  const index = stocksDB.findIndex(s => s.produitId === produitId);
  if (index === -1) return false;

  const stock = stocksDB[index]!;
  stocksDB[index] = {
    ...stock,
    quantiteDisponible: nouvelleQuantite,
    enRupture: nouvelleQuantite === 0,
    dateDerniereModification: new Date(),
    employeModificateur: employeId
  };

  // Émettre un événement
  emettrEvenementCommande({
    type: TypeEvenementCommande.STOCK_MODIFIE,
    commandeId: produitId,
    timestamp: new Date(),
    details: { 
      produit: stock.nom,
      ancienneQuantite: stock.quantiteDisponible,
      nouvelleQuantite,
      enRupture: nouvelleQuantite === 0
    },
    employeId
  });

  return true;
}

export function ajusterStockAutomatique(produitId: string, quantiteConsommee: number): void {
  const index = stocksDB.findIndex(s => s.produitId === produitId);
  if (index === -1) return;

  const stock = stocksDB[index]!;
  const nouvelleQuantite = Math.max(0, stock.quantiteDisponible - quantiteConsommee);
  
  stocksDB[index] = {
    ...stock,
    quantiteDisponible: nouvelleQuantite,
    enRupture: nouvelleQuantite === 0,
    dateDerniereModification: new Date(),
    employeModificateur: 'Système'
  };
}

// Gestion des événements temps réel
let evenements: EvenementCommande[] = [];

function emettrEvenementCommande(evenement: EvenementCommande): void {
  evenements.unshift(evenement);
  
  // Garder seulement les 100 derniers événements
  if (evenements.length > 100) {
    evenements = evenements.slice(0, 100);
  }
}

export function obtenirEvenementsRecents(limite: number = 20): EvenementCommande[] {
  return evenements.slice(0, limite);
}

// Utilitaires de formatage
export function formaterDuree(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const heures = Math.floor(minutes / 60);
  const min = minutes % 60;
  return min > 0 ? `${heures}h ${min}min` : `${heures}h`;
}

export function obtenirCouleurPriorite(priorite: PrioriteCommande): string {
  switch (priorite) {
    case PrioriteCommande.RETARD:
      return 'bg-red-100 text-red-800';
    case PrioriteCommande.URGENTE:
      return 'bg-orange-100 text-orange-800';
    case PrioriteCommande.NORMALE:
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

export function obtenirCouleurStock(stock: GestionStock): string {
  if (stock.enRupture) return 'bg-red-100 text-red-800';
  if (stock.quantiteDisponible <= stock.quantiteMinimum) return 'bg-orange-100 text-orange-800';
  return 'bg-green-100 text-green-800';
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(new Date(date));
}

export function formatTime(date: Date | string): string {
  return new Intl.DateTimeFormat('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount);
}

// Analytics et rapports
export function genererRapportVentes(periode: 'jour' | 'semaine' | 'mois'): any {
  // Simulation - en production, requête à la base de données
  const stats = obtenirStatsTableauDeBord();
  
  switch (periode) {
    case 'jour':
      return {
        periode: 'Aujourd\'hui',
        commandes: stats.ventesDuJour.nombreCommandes,
        chiffreAffaires: stats.ventesDuJour.chiffreAffaires,
        ticketMoyen: stats.ventesDuJour.chiffreAffaires / stats.ventesDuJour.nombreCommandes
      };
    case 'semaine':
      const totalSemaine = stats.ventesDeLaSemaine.commandesParJour.reduce(
        (acc, jour) => ({ commandes: acc.commandes + jour.nombre, ca: acc.ca + jour.ca }),
        { commandes: 0, ca: 0 }
      );
      return {
        periode: 'Cette semaine',
        commandes: totalSemaine.commandes,
        chiffreAffaires: totalSemaine.ca,
        ticketMoyen: totalSemaine.ca / totalSemaine.commandes,
        evolution: stats.ventesDeLaSemaine.evolution
      };
    case 'mois':
      const totalMois = stats.ventesDuMois.commandesParSemaine.reduce(
        (acc, semaine) => ({ commandes: acc.commandes + semaine.nombre, ca: acc.ca + semaine.ca }),
        { commandes: 0, ca: 0 }
      );
      return {
        periode: 'Ce mois',
        commandes: totalMois.commandes,
        chiffreAffaires: totalMois.ca,
        ticketMoyen: totalMois.ca / totalMois.commandes,
        objectif: stats.ventesDuMois.objectifMensuel,
        progression: stats.ventesDuMois.progression
      };
  }
}
