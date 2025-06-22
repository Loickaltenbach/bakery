/**
 * utilisateur router
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::utilisateur.utilisateur', {
  config: {
    find: { auth: false },
    findOne: { auth: false },
    create: { auth: false },
    update: { auth: false },
    delete: { auth: false },
  }
});

// Routes personnalisées
const customRoutes = {
  routes: [
    {
      method: 'GET',
      path: '/utilisateurs/me',
      handler: 'utilisateur.me',
      config: {
        auth: {
          scope: ['authenticated']
        }
      }
    },
    {
      method: 'PUT', 
      path: '/utilisateurs/me',
      handler: 'utilisateur.updateMe',
      config: {
        auth: {
          scope: ['authenticated']
        }
      }
    },
    {
      method: 'GET',
      path: '/utilisateurs/historique',
      handler: 'utilisateur.historique',
      config: {
        auth: {
          scope: ['authenticated']
        }
      }
    }
  ]
};

export { customRoutes };
