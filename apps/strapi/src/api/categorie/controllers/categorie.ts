/**
 * categorie controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::categorie.categorie', ({ strapi }) => ({
  // Méthode pour récupérer toutes les catégories avec leurs produits
  async find(ctx) {
    const { query } = ctx;
    
    const entity = await strapi.entityService.findMany('api::categorie.categorie', {
      ...query,
      populate: {
        image: true,
        produits: {
          populate: {
            image: true
          }
        }
      },
      sort: { ordre: 'asc', nom: 'asc' }
    });

    const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
    return this.transformResponse(sanitizedEntity);
  },

  // Méthode pour récupérer une catégorie spécifique
  async findOne(ctx) {
    const { id } = ctx.params;
    const { query } = ctx;

    const entity = await strapi.entityService.findOne('api::categorie.categorie', id, {
      ...query,
      populate: {
        image: true,
        produits: {
          populate: {
            image: true
          }
        }
      }
    });

    const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
    return this.transformResponse(sanitizedEntity);
  },

  // Méthode personnalisée pour récupérer les catégories avec le nombre de produits
  async findWithCount(ctx) {
    try {
      const categories = await strapi.entityService.findMany('api::categorie.categorie', {
        populate: {
          image: true
        },
        sort: { ordre: 'asc', nom: 'asc' }
      });

      const sanitizedEntity = await this.sanitizeOutput(categories, ctx);
      return this.transformResponse(sanitizedEntity);
    } catch (err) {
      ctx.throw(500, err);
    }
  }
}));
