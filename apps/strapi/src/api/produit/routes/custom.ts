export default {
  routes: [
    {
      method: 'GET',
      path: '/produits/aujourd-hui',
      handler: 'produit.aujourdhui',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'PUT',
      path: '/produits/:id/stock',
      handler: 'produit.updateStock',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/produits/alertes-stock',
      handler: 'produit.alertesStock',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
