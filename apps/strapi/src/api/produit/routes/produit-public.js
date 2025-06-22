module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/produits',
      handler: 'produit.find',
      config: {
        auth: false, // Autoriser l'accès public
      },
    },
    {
      method: 'GET',
      path: '/produits/:id',
      handler: 'produit.findOne',
      config: {
        auth: false, // Autoriser l'accès public
      },
    },
  ],
};
