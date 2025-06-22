/**
 * utilisateur controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::utilisateur.utilisateur', ({ strapi }) => ({
  // GET /api/utilisateurs/me - Récupérer le profil de l'utilisateur connecté
  async me(ctx) {
    try {
      const userId = ctx.state.user?.id;
      if (!userId) {
        return ctx.unauthorized('Utilisateur non authentifié');
      }

      // Récupérer l'utilisateur étendu via la relation
      const user = await strapi.entityService.findOne('plugin::users-permissions.user', userId, {
        populate: {
          utilisateur: {
            populate: ['commandes']
          }
        }
      });

      if (!user?.utilisateur) {
        return ctx.notFound('Profil utilisateur non trouvé');
      }

      // Nettoyer les données sensibles
      const { password, resetPasswordToken, confirmationToken, ...sanitizedUser } = user as any;
      
      ctx.body = {
        user: sanitizedUser,
        profile: (user as any).utilisateur
      };
    } catch (error) {
      ctx.throw(500, 'Erreur lors de la récupération du profil');
    }
  },

  // PUT /api/utilisateurs/me - Mettre à jour le profil
  async updateMe(ctx) {
    try {
      const userId = ctx.state.user?.id;
      if (!userId) {
        return ctx.unauthorized('Utilisateur non authentifié');
      }

      const { email, nom, prenom, telephone, allergies, regimeAlimentaire, preferencesNotification, adressesSauvegardees } = ctx.request.body;

      // Mettre à jour l'utilisateur users-permissions
      if (email) {
        await strapi.entityService.update('plugin::users-permissions.user', userId, {
          data: { email }
        });
      }

      // Mettre à jour le profil utilisateur étendu
      const user = await strapi.entityService.findOne('plugin::users-permissions.user', userId, {
        populate: ['utilisateur']
      });

      if ((user as any)?.utilisateur) {
        await strapi.entityService.update('api::utilisateur.utilisateur', (user as any).utilisateur.id, {
          data: {
            nom,
            prenom,
            telephone,
            allergies,
            regimeAlimentaire,
            preferencesNotification,
            adressesSauvegardees
          }
        });
      }

      ctx.body = { message: 'Profil mis à jour avec succès' };
    } catch (error) {
      ctx.throw(500, 'Erreur lors de la mise à jour du profil');
    }
  },

  // GET /api/utilisateurs/historique - Récupérer l'historique des commandes
  async historique(ctx) {
    try {
      const userId = ctx.state.user?.id;
      if (!userId) {
        return ctx.unauthorized('Utilisateur non authentifié');
      }

      const user = await strapi.entityService.findOne('plugin::users-permissions.user', userId, {
        populate: ['utilisateur']
      });

      if (!(user as any)?.utilisateur) {
        return ctx.notFound('Profil utilisateur non trouvé');
      }

      const commandes = await strapi.entityService.findMany('api::commande.commande', {
        filters: {
          utilisateur: (user as any).utilisateur.id
        },
        sort: { dateCreation: 'desc' },
        populate: ['utilisateur']
      });

      ctx.body = commandes;
    } catch (error) {
      ctx.throw(500, 'Erreur lors de la récupération de l\'historique');
    }
  }
}));
