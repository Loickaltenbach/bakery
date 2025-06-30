/**
 * analytics router
 */

export default {
  routes: [
    {
      method: 'GET',
      path: '/analytics/dashboard',
      handler: 'analytics.dashboard',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/analytics/chiffre-affaires',
      handler: 'analytics.chiffreAffaires',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/analytics/produits-populaires',
      handler: 'analytics.produitsPopulaires',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/analytics/creneaux',
      handler: 'analytics.analyseCreneaux',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/analytics/export/:format',
      handler: 'analytics.exportDonnees',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/analytics/tendances',
      handler: 'analytics.tendances',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/analytics/satisfaction',
      handler: 'analytics.satisfaction',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/analytics/previsions',
      handler: 'analytics.previsions',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
