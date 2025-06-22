/**
 * commande router
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::commande.commande');

// Routes personnalisées
const customRoutes = {
  routes: [
    {
      method: 'PUT',
      path: '/commandes/:id/statut',
      handler: 'commande.updateStatut',
      config: {
        auth: {
          scope: ['authenticated']
        }
      }
    },
    {
      method: 'GET',
      path: '/commandes/stats',
      handler: 'commande.stats',
      config: {
        auth: {
          scope: ['authenticated']
        }
      }
    }
  ]
};

export { customRoutes };
