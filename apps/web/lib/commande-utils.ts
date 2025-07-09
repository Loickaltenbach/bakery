import { 
  Commande, 
  ProcessusCommande, 
  ConfigurationCommande, 
  StatutCommande, 
  ModeRecuperation, 
  CreneauHoraire,
  ArticleCommande,
  InformationsClient,
  EtapeCommande
} from './commande-types';
import { PanierItem } from './panier-types';
import { formaterPrix } from './panier-utils';
import { validerEmail, validerTelephone, validerNomPrenom } from './validation-utils';

// Configuration par défaut
export const CONFIGURATION_DEFAUT: ConfigurationCommande = {
  tauxTVA: 0.055, // 5.5% pour les produits alimentaires
  horairesOuverture: {
    lundi: { ouvert: true, debut: '06:00', fin: '19:00' },
    mardi: { ouvert: true, debut: '06:00', fin: '19:00' },
    mercredi: { ouvert: true, debut: '06:00', fin: '19:00' },
    jeudi: { ouvert: true, debut: '06:00', fin: '19:00' },
    vendredi: { ouvert: true, debut: '06:00', fin: '19:00' },
    samedi: { ouvert: true, debut: '06:00', fin: '13:00' },
    dimanche: { ouvert: false, debut: '00:00', fin: '00:00' }
  },
  delaiPreparation: 30
};

// Convertir les articles du panier en articles de commande
export function convertirPanierEnArticles(items: PanierItem[]): ArticleCommande[] {
  return items.map(item => ({
    produit: item.produit,
    quantite: item.quantite,
    prixUnitaire: item.produit.prix,
    sousTotal: item.sousTotal
  }));
}

// Calculer les totaux d'une commande
export function calculerTotauxCommande(
  articles: ArticleCommande[]
): { sousTotal: number; taxes: number; total: number } {
  const sousTotal = articles.reduce((sum, article) => sum + article.sousTotal, 0);
  const taxes = sousTotal * CONFIGURATION_DEFAUT.tauxTVA;
  const total = sousTotal + taxes;
  
  return { sousTotal, taxes, total };
}

// Générer un numéro de commande unique
export function genererNumeroCommande(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 5);
  return `BL-${timestamp}-${random}`.toUpperCase();
}

// Générer les créneaux horaires disponibles
export function genererCreneauxDisponibles(
  type: ModeRecuperation,
  nombreJours: number = 7
): CreneauHoraire[] {
  const creneaux: CreneauHoraire[] = [];
  const maintenant = new Date();
  
  for (let i = 0; i < nombreJours; i++) {
    const date = new Date(maintenant);
    date.setDate(date.getDate() + i);
    
    const jourSemaine = date.toLocaleDateString('fr-FR', { weekday: 'long' });
    const horaires = CONFIGURATION_DEFAUT.horairesOuverture[jourSemaine];
    
    if (!horaires || !horaires.ouvert) continue;
    
    // Créneaux du matin
    const [heureDebut, minuteDebut] = horaires.debut.split(':').map(Number);
    const [heurePause, minutePause] = (horaires.pauseDebut || '12:30').split(':').map(Number);
    
    if (heureDebut !== undefined && heurePause !== undefined) {
      for (let h = heureDebut; h < heurePause; h++) {
        for (let m = 0; m < 60; m += 30) { // Créneaux de 30 min
          const debut = new Date(date);
          debut.setHours(h, m, 0, 0);
          
          const fin = new Date(debut);
          fin.setMinutes(fin.getMinutes() + 30);
          
          // Vérifier si le créneau est dans le futur avec délai de préparation
          const delaiMinimum = new Date(maintenant);
          delaiMinimum.setMinutes(delaiMinimum.getMinutes() + CONFIGURATION_DEFAUT.delaiPreparation);
          
          if (debut > delaiMinimum) {
            creneaux.push({
              id: `${date.toISOString().split('T')[0]}-${h.toString().padStart(2, '0')}${m.toString().padStart(2, '0')}`,
              debut,
              fin,
              disponible: true,
              type
            });
          }
        }
      }
    }
    
    // Créneaux de l'après-midi (si pas de pause ou après la pause)
    if (horaires.pauseFin) {
      const [heureFin, minuteFin] = horaires.fin.split(':').map(Number);
      const [heureReprise, minuteReprise] = horaires.pauseFin.split(':').map(Number);
      
      if (heureFin !== undefined && heureReprise !== undefined && minuteReprise !== undefined) {
        for (let h = heureReprise; h < heureFin; h++) {
          for (let m = (h === heureReprise ? minuteReprise : 0); m < 60; m += 30) {
            const debut = new Date(date);
            debut.setHours(h, m, 0, 0);
            
            const fin = new Date(debut);
            fin.setMinutes(fin.getMinutes() + 30);
            
            const delaiMinimum = new Date(maintenant);
            delaiMinimum.setMinutes(delaiMinimum.getMinutes() + CONFIGURATION_DEFAUT.delaiPreparation);
            
            if (debut > delaiMinimum && debut.getHours() < heureFin) {
              creneaux.push({
                id: `${date.toISOString().split('T')[0]}-${h.toString().padStart(2, '0')}${m.toString().padStart(2, '0')}`,
                debut,
                fin,
                disponible: true,
                type
              });
            }
          }
        }
      }
    }
  }
  
  return creneaux;
}

// Formater un créneau horaire pour l'affichage
export function formaterCreneau(creneau: CreneauHoraire): string {
  const date = creneau.debut.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  });
  
  const heureDebut = creneau.debut.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  });
  
  const heureFin = creneau.fin.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  });
  
  return `${date} de ${heureDebut} à ${heureFin}`;
}

// Valider les informations client
export function validerInformationsClient(
  infos: Partial<InformationsClient>
): { valide: boolean; erreurs: string[] } {
  const erreurs: string[] = [];

  if (!infos.nom || !infos.prenom) {
    const validationNomPrenom = validerNomPrenom(infos.nom || '', infos.prenom || '');
    if (!validationNomPrenom.valide) erreurs.push(...validationNomPrenom.erreurs);
  }
  if (!infos.telephone) {
    erreurs.push('Le téléphone est obligatoire');
  } else {
    const validationTel = validerTelephone(infos.telephone);
    if (!validationTel.valide) erreurs.push(validationTel.erreur!);
  }
  if (!infos.email) {
    erreurs.push("L'email est obligatoire");
  } else {
    const validationEmail = validerEmail(infos.email);
    if (!validationEmail.valide) erreurs.push(validationEmail.erreur!);
  }

  return { valide: erreurs.length === 0, erreurs };
}

// Créer une commande complète
export function creerCommande(processus: ProcessusCommande): Commande {
  if (!processus.creneauChoisi || !processus.informationsClient) {
    throw new Error('Informations manquantes pour créer la commande');
  }
  
  const numeroCommande = genererNumeroCommande();
  const maintenant = new Date();
  
  return {
    id: numeroCommande,
    numeroCommande,
    statut: StatutCommande.EN_ATTENTE,
    modeRecuperation: ModeRecuperation.RETRAIT,
    creneauChoisi: processus.creneauChoisi,
    client: processus.informationsClient,
    articles: processus.articles,
    sousTotal: processus.totaux.sousTotal,
    taxes: processus.totaux.taxes,
    total: processus.totaux.total,
    dateCreation: maintenant,
    dateMiseAJour: maintenant
  };
}

// Sauvegarder une commande en localStorage (temporaire)
export function sauvegarderCommande(commande: Commande): void {
  if (typeof window === 'undefined') return;
  
  try {
    const commandes = chargerCommandes();
    const index = commandes.findIndex(c => c.id === commande.id);
    
    if (index >= 0) {
      commandes[index] = { ...commande, dateMiseAJour: new Date() };
    } else {
      commandes.push(commande);
    }
    
    localStorage.setItem('boulangerie_commandes', JSON.stringify(commandes));
  } catch (error) {
    console.error('Erreur lors de la sauvegarde de la commande:', error);
  }
}

// Charger les commandes depuis localStorage
export function chargerCommandes(): Commande[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem('boulangerie_commandes');
    if (!stored) return [];
    
    const commandes = JSON.parse(stored);
    // Reconstituer les dates
    return commandes.map((c: any) => ({
      ...c,
      dateCreation: new Date(c.dateCreation),
      dateMiseAJour: new Date(c.dateMiseAJour),
      creneauChoisi: {
        ...c.creneauChoisi,
        debut: new Date(c.creneauChoisi.debut),
        fin: new Date(c.creneauChoisi.fin)
      }
    }));
  } catch (error) {
    console.error('Erreur lors du chargement des commandes:', error);
    return [];
  }
}

// Formater le statut pour l'affichage
export function formaterStatut(statut: StatutCommande): string {
  const statuts = {
    [StatutCommande.EN_ATTENTE]: 'En attente',
    [StatutCommande.CONFIRMATION]: 'Confirmation',
    [StatutCommande.PREPARATION]: 'En préparation',
    [StatutCommande.PRETE]: 'Prête',
    [StatutCommande.TERMINEE]: 'Terminée',
    [StatutCommande.ANNULEE]: 'Annulée'
  };
  return statuts[statut];
}

// Obtenir la couleur du statut
export function getCouleurStatut(statut: StatutCommande): string {
  const couleurs = {
    [StatutCommande.EN_ATTENTE]: '#f59e0b', // amber
    [StatutCommande.CONFIRMATION]: '#3b82f6', // blue
    [StatutCommande.PREPARATION]: '#8b5cf6', // violet
    [StatutCommande.PRETE]: '#10b981', // emerald
    [StatutCommande.TERMINEE]: '#6b7280', // gray
    [StatutCommande.ANNULEE]: '#ef4444' // red
  };
  return couleurs[statut];
}
