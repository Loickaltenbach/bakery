/**
 * evaluation router
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreRouter('api::evaluation.evaluation' as any, {
  config: {
    create: {
      policies: [],
      middlewares: [],
    },
    update: {
      policies: [],
      middlewares: [],
    },
    delete: {
      policies: [],
      middlewares: [],
    },
  }
});
