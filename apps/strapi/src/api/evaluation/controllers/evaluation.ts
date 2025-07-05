/**
 * evaluation controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::evaluation.evaluation' as any, ({ strapi }) => ({
  // POST /api/evaluations
  async create(ctx: any) {
    try {
      const data = ctx.request.body.data;
      
      // Vérifier que la commande existe et qu'elle n'a pas déjà d'évaluation
      const commande = await strapi.entityService.findOne('api::commande.commande' as any, data.commande, {
        populate: ['evaluation'] as any
      });

      if (!commande) {
        return ctx.badRequest('Commande introuvable');
      }

      if ((commande as any).evaluation) {
        return ctx.badRequest('Cette commande a déjà été évaluée');
      }

      // Valider la note
      if (data.note < 1 || data.note > 5) {
        return ctx.badRequest('La note doit être comprise entre 1 et 5');
      }

      // Ajouter la date d'évaluation
      data.dateEvaluation = new Date();

      const evaluation = await strapi.entityService.create('api::evaluation.evaluation' as any, {
        data,
        populate: ['commande']
      });

      ctx.body = evaluation;
    } catch (error) {
      console.error('Erreur lors de la création de l\'évaluation:', error);
      ctx.throw(500, 'Erreur lors de la création de l\'évaluation');
    }
  },

  // GET /api/evaluations/stats
  async stats(ctx: any) {
    try {
      const { dateDebut, dateFin } = ctx.query;
      
      const maintenant = new Date();
      const debut = dateDebut ? new Date(dateDebut) : new Date(maintenant.getFullYear(), maintenant.getMonth(), 1);
      const fin = dateFin ? new Date(dateFin) : maintenant;

      const evaluations = await strapi.entityService.findMany('api::evaluation.evaluation' as any, {
        filters: {
          dateEvaluation: { $gte: debut, $lte: fin }
        },
        populate: ['commande']
      });

      if (evaluations.length === 0) {
        return ctx.body = {
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

      ctx.body = {
        periode: { debut, fin },
        noteMoyenne: Math.round(noteMoyenne * 10) / 10,
        totalEvaluations: evaluations.length,
        repartitionNotes,
        tauxRecommandation: Math.round(tauxRecommandation * 10) / 10,
        satisfactionParCritere
      };

    } catch (error) {
      console.error('Erreur lors du calcul des statistiques:', error);
      ctx.throw(500, 'Erreur lors du calcul des statistiques');
    }
  }
}));
