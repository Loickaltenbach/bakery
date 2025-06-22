/**
 * Custom routes for commande API
 */

export default {
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
