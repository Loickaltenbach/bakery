/**
 * produit controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::produit.produit', ({ strapi }) => ({
  // Endpoint public pour récupérer tous les produits
  async find(ctx) {
    // Populate automatiquement les images et la catégorie
    ctx.query = {
      ...ctx.query,
      populate: {
        image: true,
        categorie: {
          populate: {
            image: true
          }
        }
      }
    };
    
    return super.find(ctx);
  },

  // Endpoint public pour récupérer un produit par ID
  async findOne(ctx) {
    ctx.query = {
      ...ctx.query,
      populate: {
        image: true,
        categorie: {
          populate: {
            image: true
          }
        }
      }
    };
    
    return super.findOne(ctx);
  }
}));
