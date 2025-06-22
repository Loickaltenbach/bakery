/**
 * commande controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::commande.commande', ({ strapi }) => ({
  // GET /api/commandes - Récupérer les commandes avec filtres
  async find(ctx) {
    try {
      const { statut, dateDebut, dateFin, utilisateur } = ctx.query;
      
      const filters: any = {};
      
      if (statut) {
        filters.statut = statut;
      }
      
      if (dateDebut || dateFin) {
        filters.dateCreation = {};
        if (dateDebut) filters.dateCreation.$gte = dateDebut;
        if (dateFin) filters.dateCreation.$lte = dateFin;
      }
      
      if (utilisateur) {
        filters.utilisateur = utilisateur;
      }

      const commandes = await strapi.entityService.findMany('api::commande.commande', {
        filters,
        sort: { dateCreation: 'desc' },
        populate: ['utilisateur']
      });

      ctx.body = commandes;
    } catch (error) {
      ctx.throw(500, 'Erreur lors de la récupération des commandes');
    }
  },

  // POST /api/commandes - Créer une nouvelle commande
  async create(ctx) {
    try {
      const { produits, informationsClient, creneauRetrait, commentaires } = ctx.request.body;
      
      // Calculer le prix total
      let prixTotal = 0;
      for (const item of produits) {
        const produit = await strapi.entityService.findOne('api::produit.produit', item.produitId);
        if (produit) {
          prixTotal += produit.prix * item.quantite;
        }
      }

      // Générer un numéro de commande unique
      const numero = `CMD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      const data: any = {
        numero,
        statut: 'EN_ATTENTE',
        modeRetrait: 'RETRAIT',
        produits,
        prixTotal,
        informationsClient,
        creneauRetrait,
        commentaires,
        dateCreation: new Date(),
        paiementStatut: 'EN_ATTENTE'
      };

      // Associer à l'utilisateur connecté si disponible
      if (ctx.state.user?.id) {
        const user = await strapi.entityService.findOne('plugin::users-permissions.user', ctx.state.user.id, {
          populate: ['utilisateur'] as any
        });
        
        if ((user as any)?.utilisateur) {
          data.utilisateur = (user as any).utilisateur.id;
        }
      }

      const commande = await strapi.entityService.create('api::commande.commande', {
        data,
        populate: ['utilisateur']
      });

      ctx.body = commande;
    } catch (error) {
      ctx.throw(500, 'Erreur lors de la création de la commande');
    }
  },

  // PUT /api/commandes/:id/statut - Mettre à jour le statut d'une commande
  async updateStatut(ctx) {
    try {
      const { id } = ctx.params;
      const { statut } = ctx.request.body;

      const data: any = {
        statut,
        dateMiseAJour: new Date()
      };

      if (statut === 'RETIREE') {
        data.dateRetiree = new Date();
      }

      const commande = await strapi.entityService.update('api::commande.commande', id, {
        data,
        populate: ['utilisateur']
      });

      ctx.body = commande;
    } catch (error) {
      ctx.throw(500, 'Erreur lors de la mise à jour du statut');
    }
  },

  // GET /api/commandes/stats - Statistiques des commandes
  async stats(ctx) {
    try {
      const { dateDebut, dateFin } = ctx.query;
      
      const filters: any = {};
      if (dateDebut || dateFin) {
        filters.dateCreation = {};
        if (dateDebut) filters.dateCreation.$gte = dateDebut;
        if (dateFin) filters.dateCreation.$lte = dateFin;
      }

      const commandes = await strapi.entityService.findMany('api::commande.commande', {
        filters
      });

      const stats = {
        total: commandes.length,
        chiffreAffaires: commandes.reduce((sum: number, cmd: any) => sum + parseFloat(cmd.prixTotal || 0), 0),
        parStatut: {} as any,
        parMois: {} as any
      };

      // Grouper par statut
      commandes.forEach((cmd: any) => {
        stats.parStatut[cmd.statut] = (stats.parStatut[cmd.statut] || 0) + 1;
      });

      // Grouper par mois
      commandes.forEach((cmd: any) => {
        const mois = new Date(cmd.dateCreation).toISOString().slice(0, 7);
        stats.parMois[mois] = (stats.parMois[mois] || 0) + 1;
      });

      ctx.body = stats;
    } catch (error) {
      ctx.throw(500, 'Erreur lors du calcul des statistiques');
    }
  }
}));
