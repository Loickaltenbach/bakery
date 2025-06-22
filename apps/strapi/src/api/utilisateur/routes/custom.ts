/**
 * Custom routes for utilisateur API
 */

export default {
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
