module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/categories/public',
      handler: 'categorie.find',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/categories/public/:id',
      handler: 'categorie.findOne',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/categories/public/with-count',
      handler: 'categorie.findWithCount',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
  ],
};
