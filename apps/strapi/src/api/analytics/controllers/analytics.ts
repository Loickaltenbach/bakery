/**
 * analytics controller
 */

// Interfaces pour le typage
interface ChiffreAffairesData {
  periode: string;
  montant: number;
}

interface ProduitPopulaire {
  id: string;
  nom: string;
  categorie: string;
  quantite: number;
  chiffreAffaires: number;
}

interface AnalyseCreneaux {
  heuresPointe: Array<{ heure: string; commandes: number }>;
  joursPopulaires: Array<{ jour: string; commandes: number }>;
  repartitionCreneaux: { [key: string]: number };
  totalCommandes: number;
}

interface StatistiquesGenerales {
  totalCommandes: number;
  commandesConfirmees: number;
  commandesAnnulees: number;
  chiffreAffairesTotal: number;
  panierMoyen: number;
  tauxConfirmation: number;
  tauxAnnulation: number;
}

// Fonctions utilitaires
const getWeekNumber = (date: Date): number => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
};

const getChiffreAffaires = async (strapi: any, debut: Date, fin: Date, groupBy: string): Promise<ChiffreAffairesData[]> => {
  const commandes = await strapi.entityService.findMany('api::commande.commande', {
    filters: {
      createdAt: { $gte: debut, $lte: fin },
      statut: { $in: ['confirmee', 'prete', 'recuperee'] }
    },
    populate: ['produits']
  });

  // Grouper par période
  const donneesGroupees: { [key: string]: number } = {};
  
  commandes.forEach((commande: any) => {
    const date = new Date(commande.createdAt);
    let cle: string;
    
    switch (groupBy) {
      case 'heure':
        cle = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:00`;
        break;
      case 'jour':
        cle = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        break;
      case 'semaine':
        const semaine = getWeekNumber(date);
        cle = `${date.getFullYear()}-S${semaine}`;
        break;
      case 'mois':
        cle = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        break;
      default:
        cle = date.toISOString().split('T')[0];
    }
    
    donneesGroupees[cle] = (donneesGroupees[cle] || 0) + commande.montantTotal;
  });

  return Object.entries(donneesGroupees)
    .map(([periode, montant]) => ({ periode, montant }))
    .sort((a, b) => a.periode.localeCompare(b.periode));
};

const getProduitsPopulaires = async (strapi: any, debut: Date, fin: Date, limite: number = 10): Promise<ProduitPopulaire[]> => {
  const commandes = await strapi.entityService.findMany('api::commande.commande', {
    filters: {
      createdAt: { $gte: debut, $lte: fin },
      statut: { $in: ['confirmee', 'prete', 'recuperee'] }
    },
    populate: ['produits.produit']
  });

  const produitsStats: { [key: string]: ProduitPopulaire } = {};

  commandes.forEach((commande: any) => {
    commande.produits?.forEach((item: any) => {
      const produitId = item.produit?.id;
      const produitNom = item.produit?.nom || 'Produit supprimé';
      const categorie = item.produit?.categorie?.nom || 'Sans catégorie';
      
      if (!produitsStats[produitId]) {
        produitsStats[produitId] = {
          id: produitId,
          nom: produitNom,
          categorie,
          quantite: 0,
          chiffreAffaires: 0
        };
      }
      
      produitsStats[produitId].quantite += item.quantite;
      produitsStats[produitId].chiffreAffaires += item.quantite * item.prixUnitaire;
    });
  });

  return Object.values(produitsStats)
    .sort((a, b) => b.quantite - a.quantite)
    .slice(0, limite);
};

const getAnalyseCreneaux = async (strapi: any, debut: Date, fin: Date): Promise<AnalyseCreneaux> => {
  const commandes = await strapi.entityService.findMany('api::commande.commande', {
    filters: {
      createdAt: { $gte: debut, $lte: fin }
    }
  });

  const creneauxStats: { [key: string]: number } = {};
  const joursStats: { [key: string]: number } = {};

  commandes.forEach((commande: any) => {
    if (commande.creneauRetrait) {
      const dateRetrait = new Date(commande.creneauRetrait);
      const heure = `${String(dateRetrait.getHours()).padStart(2, '0')}:${String(Math.floor(dateRetrait.getMinutes() / 30) * 30).padStart(2, '0')}`;
      const jour = dateRetrait.toLocaleDateString('fr-FR', { weekday: 'long' });
      
      creneauxStats[heure] = (creneauxStats[heure] || 0) + 1;
      joursStats[jour] = (joursStats[jour] || 0) + 1;
    }
  });

  const heuresPointe = Object.entries(creneauxStats)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([heure, commandes]) => ({ heure, commandes }));

  const joursPopulaires = Object.entries(joursStats)
    .sort(([,a], [,b]) => b - a)
    .map(([jour, commandes]) => ({ jour, commandes }));

  return {
    heuresPointe,
    joursPopulaires,
    repartitionCreneaux: creneauxStats,
    totalCommandes: commandes.length
  };
};

const getStatistiquesGenerales = async (strapi: any, debut: Date, fin: Date): Promise<StatistiquesGenerales> => {
  const commandes = await strapi.entityService.findMany('api::commande.commande', {
    filters: {
      createdAt: { $gte: debut, $lte: fin }
    }
  });

  const totalCommandes = commandes.length;
  const commandesConfirmees = commandes.filter((c: any) => c.statut === 'confirmee').length;
  const commandesAnnulees = commandes.filter((c: any) => c.statut === 'annulee').length;
  const chiffreAffairesTotal = commandes
    .filter((c: any) => ['confirmee', 'prete', 'recuperee'].includes(c.statut))
    .reduce((sum: number, c: any) => sum + (c.montantTotal || 0), 0);
  
  const panierMoyen = totalCommandes > 0 ? chiffreAffairesTotal / totalCommandes : 0;
  const tauxConfirmation = totalCommandes > 0 ? (commandesConfirmees / totalCommandes) * 100 : 0;
  const tauxAnnulation = totalCommandes > 0 ? (commandesAnnulees / totalCommandes) * 100 : 0;

  return {
    totalCommandes,
    commandesConfirmees,
    commandesAnnulees,
    chiffreAffairesTotal,
    panierMoyen,
    tauxConfirmation,
    tauxAnnulation
  };
};

const getTendances = async (strapi: any, debut: Date, fin: Date, periode: string) => {
  // Calculer la période précédente pour comparaison
  const duree = fin.getTime() - debut.getTime();
  const debutPrecedent = new Date(debut.getTime() - duree);
  const finPrecedent = new Date(fin.getTime() - duree);

  const [actuel, precedent] = await Promise.all([
    getStatistiquesGenerales(strapi, debut, fin),
    getStatistiquesGenerales(strapi, debutPrecedent, finPrecedent)
  ]);

  const calculerTendance = (actuel: number, precedent: number) => {
    if (precedent === 0) return actuel > 0 ? 100 : 0;
    return ((actuel - precedent) / precedent) * 100;
  };

  return {
    chiffreAffaires: {
      actuel: actuel.chiffreAffairesTotal,
      precedent: precedent.chiffreAffairesTotal,
      tendance: calculerTendance(actuel.chiffreAffairesTotal, precedent.chiffreAffairesTotal)
    },
    commandes: {
      actuel: actuel.totalCommandes,
      precedent: precedent.totalCommandes,
      tendance: calculerTendance(actuel.totalCommandes, precedent.totalCommandes)
    },
    panierMoyen: {
      actuel: actuel.panierMoyen,
      precedent: precedent.panierMoyen,
      tendance: calculerTendance(actuel.panierMoyen, precedent.panierMoyen)
    }
  };
};

const getSatisfaction = async (strapi: any, debut: Date, fin: Date) => {
  const evaluations = await strapi.entityService.findMany('api::evaluation.evaluation', {
    filters: {
      dateEvaluation: { $gte: debut, $lte: fin }
    },
    populate: ['commande']
  });

  if (evaluations.length === 0) {
    return {
      noteMoyenne: 0,
      totalEvaluations: 0,
      repartitionNotes: {},
      tauxRecommandation: 0,
      satisfactionParCritere: {}
    };
  }

  const noteMoyenne = evaluations.reduce((sum: number, evaluation: any) => sum + evaluation.note, 0) / evaluations.length;
  const tauxRecommandation = (evaluations.filter((evaluation: any) => evaluation.recommandation).length / evaluations.length) * 100;
  
  const repartitionNotes: { [key: string]: number } = {};
  evaluations.forEach((evaluation: any) => {
    repartitionNotes[evaluation.note] = (repartitionNotes[evaluation.note] || 0) + 1;
  });

  // Analyse des critères détaillés
  const satisfactionParCritere: { [key: string]: number } = {};
  evaluations.forEach((evaluation: any) => {
    if (evaluation.criteres) {
      Object.entries(evaluation.criteres).forEach(([critere, note]: [string, any]) => {
        if (!satisfactionParCritere[critere]) {
          satisfactionParCritere[critere] = 0;
        }
        satisfactionParCritere[critere] += note;
      });
    }
  });

  // Moyenner les critères
  Object.keys(satisfactionParCritere).forEach(critere => {
    satisfactionParCritere[critere] = satisfactionParCritere[critere] / evaluations.length;
  });

  return {
    noteMoyenne,
    totalEvaluations: evaluations.length,
    repartitionNotes,
    tauxRecommandation,
    satisfactionParCritere
  };
};

const generatePrevisions = async (strapi: any, type: string, horizon: number = 30) => {
  const maintenant = new Date();
  const debutHistorique = new Date(maintenant.getTime() - (365 * 24 * 60 * 60 * 1000)); // 1 an d'historique
  
  const commandes = await strapi.entityService.findMany('api::commande.commande', {
    filters: {
      createdAt: { $gte: debutHistorique, $lte: maintenant },
      statut: { $in: ['confirmee', 'prete', 'recuperee'] }
    },
    populate: ['produits.produit']
  });

  if (type === 'ventes') {
    // Prévision du chiffre d'affaires
    const ventesParJour: { [key: string]: number } = {};
    
    commandes.forEach((commande: any) => {
      const date = new Date(commande.createdAt).toISOString().split('T')[0];
      ventesParJour[date] = (ventesParJour[date] || 0) + commande.montantTotal;
    });

    const ventes = Object.values(ventesParJour);
    const moyenneMobile = ventes.slice(-30).reduce((sum, val) => sum + val, 0) / 30;
    
    // Tendance simple basée sur la moyenne mobile
    const tendance = ventes.length > 60 ? 
      (ventes.slice(-30).reduce((sum, val) => sum + val, 0) - ventes.slice(-60, -30).reduce((sum, val) => sum + val, 0)) / 30 :
      0;

    const previsions = [];
    for (let i = 1; i <= horizon; i++) {
      const datePrevision = new Date(maintenant.getTime() + (i * 24 * 60 * 60 * 1000));
      const valeurfPrevue = moyenneMobile + (tendance * i);
      previsions.push({
        date: datePrevision.toISOString().split('T')[0],
        valeur: Math.max(0, valeurfPrevue),
        confiance: Math.max(0.3, 1 - (i / horizon) * 0.7) // Confiance décroissante
      });
    }

    return {
      type: 'chiffre_affaires',
      horizon,
      moyenneMobile,
      tendance,
      previsions
    };
  }

  return { message: 'Type de prévision non supporté' };
};

export default {
  // GET /api/analytics/dashboard
  async dashboard(ctx: any) {
    try {
      const { dateDebut, dateFin, periode = 'jour' } = ctx.query;
      
      const maintenant = new Date();
      const debut = dateDebut ? new Date(dateDebut) : new Date(maintenant.getFullYear(), maintenant.getMonth(), 1);
      const fin = dateFin ? new Date(dateFin) : maintenant;

      // Chiffre d'affaires
      const chiffreAffaires = await getChiffreAffaires(strapi, debut, fin, periode);
      
      // Produits les plus vendus
      const produitsPopulaires = await getProduitsPopulaires(strapi, debut, fin);
      
      // Analyse des créneaux
      const analyseCreneaux = await getAnalyseCreneaux(strapi, debut, fin);
      
      // Statistiques générales
      const statistiques = await getStatistiquesGenerales(strapi, debut, fin);
      
      // Tendances
      const tendances = await getTendances(strapi, debut, fin, periode);

      // Satisfaction
      const satisfaction = await getSatisfaction(strapi, debut, fin);

      ctx.body = {
        periode: { debut, fin },
        chiffreAffaires,
        produitsPopulaires,
        analyseCreneaux,
        statistiques,
        tendances,
        satisfaction,
        genereLe: new Date()
      };

    } catch (error) {
      console.error('Erreur lors de la génération du dashboard:', error);
      ctx.throw(500, 'Erreur lors de la génération du dashboard');
    }
  },

  // GET /api/analytics/chiffre-affaires
  async chiffreAffaires(ctx: any) {
    try {
      const { dateDebut, dateFin, groupBy = 'jour' } = ctx.query;
      
      const maintenant = new Date();
      const debut = dateDebut ? new Date(dateDebut) : new Date(maintenant.getFullYear(), maintenant.getMonth(), 1);
      const fin = dateFin ? new Date(dateFin) : maintenant;

      const donnees = await getChiffreAffaires(strapi, debut, fin, groupBy);
      
      ctx.body = {
        periode: { debut, fin, groupBy },
        donnees,
        total: donnees.reduce((sum: number, item: any) => sum + item.montant, 0),
        moyenne: donnees.length > 0 ? donnees.reduce((sum: number, item: any) => sum + item.montant, 0) / donnees.length : 0
      };

    } catch (error) {
      console.error('Erreur lors du calcul du chiffre d\'affaires:', error);
      ctx.throw(500, 'Erreur lors du calcul du chiffre d\'affaires');
    }
  },

  // GET /api/analytics/produits-populaires
  async produitsPopulaires(ctx: any) {
    try {
      const { dateDebut, dateFin, limite = 10 } = ctx.query;
      
      const maintenant = new Date();
      const debut = dateDebut ? new Date(dateDebut) : new Date(maintenant.getFullYear(), maintenant.getMonth(), 1);
      const fin = dateFin ? new Date(dateFin) : maintenant;

      const produits = await getProduitsPopulaires(strapi, debut, fin, parseInt(limite));
      
      ctx.body = {
        periode: { debut, fin },
        produits,
        total: produits.reduce((sum: number, item: any) => sum + item.quantite, 0)
      };

    } catch (error) {
      console.error('Erreur lors du calcul des produits populaires:', error);
      ctx.throw(500, 'Erreur lors du calcul des produits populaires');
    }
  },

  // GET /api/analytics/creneaux
  async analyseCreneaux(ctx: any) {
    try {
      const { dateDebut, dateFin } = ctx.query;
      
      const maintenant = new Date();
      const debut = dateDebut ? new Date(dateDebut) : new Date(maintenant.getFullYear(), maintenant.getMonth(), 1);
      const fin = dateFin ? new Date(dateFin) : maintenant;

      const analyse = await getAnalyseCreneaux(strapi, debut, fin);
      
      ctx.body = {
        periode: { debut, fin },
        ...analyse
      };

    } catch (error) {
      console.error('Erreur lors de l\'analyse des créneaux:', error);
      ctx.throw(500, 'Erreur lors de l\'analyse des créneaux');
    }
  },

  // GET /api/analytics/satisfaction
  async satisfaction(ctx: any) {
    try {
      const { dateDebut, dateFin } = ctx.query;
      
      const maintenant = new Date();
      const debut = dateDebut ? new Date(dateDebut) : new Date(maintenant.getFullYear(), maintenant.getMonth(), 1);
      const fin = dateFin ? new Date(dateFin) : maintenant;

      const satisfaction = await getSatisfaction(strapi, debut, fin);
      
      ctx.body = {
        periode: { debut, fin },
        ...satisfaction
      };

    } catch (error) {
      console.error('Erreur lors du calcul de la satisfaction:', error);
      ctx.throw(500, 'Erreur lors du calcul de la satisfaction');
    }
  },

  // GET /api/analytics/tendances
  async tendances(ctx: any) {
    try {
      const { dateDebut, dateFin, periode = 'jour' } = ctx.query;
      
      const maintenant = new Date();
      const debut = dateDebut ? new Date(dateDebut) : new Date(maintenant.getFullYear(), maintenant.getMonth(), 1);
      const fin = dateFin ? new Date(dateFin) : maintenant;

      const tendances = await getTendances(strapi, debut, fin, periode);
      
      ctx.body = {
        periode: { debut, fin },
        ...tendances
      };

    } catch (error) {
      console.error('Erreur lors du calcul des tendances:', error);
      ctx.throw(500, 'Erreur lors du calcul des tendances');
    }
  },

  // GET /api/analytics/previsions
  async previsions(ctx: any) {
    try {
      const { type = 'ventes', horizon = 30 } = ctx.query;

      const previsions = await generatePrevisions(strapi, type, parseInt(horizon));
      
      ctx.body = previsions;

    } catch (error) {
      console.error('Erreur lors de la génération des prévisions:', error);
      ctx.throw(500, 'Erreur lors de la génération des prévisions');
    }
  },

  // GET /api/analytics/export/:format
  async exportDonnees(ctx: any) {
    try {
      const { format } = ctx.params; // 'excel' ou 'pdf'
      const { dateDebut, dateFin, type = 'ventes' } = ctx.query;
      
      const maintenant = new Date();
      const debut = dateDebut ? new Date(dateDebut) : new Date(maintenant.getFullYear(), maintenant.getMonth(), 1);
      const fin = dateFin ? new Date(dateFin) : maintenant;

      if (format === 'excel') {
        // Pour l'instant, retourner un JSON avec les données
        const donnees = await getChiffreAffaires(strapi, debut, fin, 'jour');
        ctx.set('Content-Type', 'application/json');
        ctx.body = {
          format: 'excel',
          type,
          periode: { debut, fin },
          donnees,
          message: 'Export Excel sera implémenté avec la bibliothèque exceljs'
        };
      } else if (format === 'pdf') {
        // Pour l'instant, retourner un JSON avec les données
        const donnees = await getChiffreAffaires(strapi, debut, fin, 'jour');
        ctx.set('Content-Type', 'application/json');
        ctx.body = {
          format: 'pdf',
          type,
          periode: { debut, fin },
          donnees,
          message: 'Export PDF sera implémenté avec la bibliothèque pdfkit'
        };
      } else {
        ctx.badRequest('Format non supporté. Utilisez "excel" ou "pdf".');
      }

    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
      ctx.throw(500, 'Erreur lors de l\'export des données');
    }
  }
};
