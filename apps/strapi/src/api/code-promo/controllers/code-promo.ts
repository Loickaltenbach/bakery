/**
 * code-promo controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::code-promo.code-promo' as any, () => ({
  // GET /api/codes-promo/valider/:code - Valider un code promo
  async valider(ctx) {
    try {
      const { code } = ctx.params;
      const { montant, categoriesCommande } = ctx.query;

      if (!code) {
        return ctx.badRequest('Code promo requis');
      }

      // Rechercher le code promo
      const codePromo = await strapi.entityService.findMany('api::code-promo.code-promo' as any, {
        filters: {
          code: { $eqi: code }, // Case insensitive
          actif: true
        },
        populate: ['categoriesEligibles', 'produitsEligibles']
      });

      if (!codePromo || codePromo.length === 0) {
        return ctx.notFound('Code promo introuvable');
      }

      const promo: any = codePromo[0];
      const maintenant = new Date();

      // Vérifications de validité
      if (new Date(promo.dateDebut) > maintenant) {
        return ctx.badRequest('Code promo pas encore valide');
      }

      if (new Date(promo.dateFin) < maintenant) {
        return ctx.badRequest('Code promo expiré');
      }

      if (promo.utilisationsMax && promo.utilisationsActuelles >= promo.utilisationsMax) {
        return ctx.badRequest('Code promo épuisé');
      }

      // Vérification du montant minimum
      if (montant && promo.montantMinimum && parseFloat(montant as string) < promo.montantMinimum) {
        return ctx.badRequest(`Montant minimum de ${promo.montantMinimum}€ requis`);
      }

      // Vérification des catégories éligibles
      if (promo.categoriesEligibles && promo.categoriesEligibles.length > 0 && categoriesCommande) {
        const categoriesArray = (categoriesCommande as string).split(',').map(Number);
        const hasEligibleCategory = promo.categoriesEligibles.some((cat: any) => 
          categoriesArray.includes(cat.id)
        );
        
        if (!hasEligibleCategory) {
          return ctx.badRequest('Ce code promo n\'est pas valide pour les produits sélectionnés');
        }
      }

      // Calculer la réduction
      let reductionCalculee = 0;
      const montantParsed = parseFloat(montant as string) || 0;

      switch (promo.typeReduction) {
        case 'POURCENTAGE':
          reductionCalculee = montantParsed * (promo.valeurReduction / 100);
          break;
        case 'MONTANT_FIXE':
          reductionCalculee = Math.min(promo.valeurReduction, montantParsed);
          break;
        case 'LIVRAISON_GRATUITE':
          reductionCalculee = 0; // Géré côté client
          break;
      }

      ctx.body = {
        valide: true,
        codePromo: {
          id: promo.id,
          code: promo.code,
          nom: promo.nom,
          description: promo.description,
          typeReduction: promo.typeReduction,
          valeurReduction: promo.valeurReduction,
          reductionCalculee,
          montantMinimum: promo.montantMinimum,
          dateDebut: promo.dateDebut,
          dateFin: promo.dateFin,
          premiereCommande: promo.premiereCommande
        }
      };
    } catch (error: any) {
      ctx.throw(500, `Erreur lors de la validation du code promo: ${error.message}`);
    }
  },

  // POST /api/codes-promo/utiliser/:id - Marquer un code promo comme utilisé
  async utiliser(ctx) {
    try {
      const { id } = ctx.params;

      const codePromo: any = await strapi.entityService.findOne('api::code-promo.code-promo' as any, id);

      if (!codePromo) {
        return ctx.notFound('Code promo introuvable');
      }

      // Incrémenter le compteur d'utilisations
      const codePromoMisAJour = await strapi.entityService.update(
        'api::code-promo.code-promo' as any,
        id,
        {
          data: {
            utilisationsActuelles: codePromo.utilisationsActuelles + 1
          }
        }
      );

      ctx.body = {
        succes: true,
        utilisationsActuelles: (codePromoMisAJour as any).utilisationsActuelles
      };
    } catch (error: any) {
      ctx.throw(500, `Erreur lors de l'utilisation du code promo: ${error.message}`);
    }
  },

  // GET /api/codes-promo/actifs - Récupérer les codes promo actifs publics
  async actifs(ctx) {
    try {
      const maintenant = new Date();

      const codesPromo = await strapi.entityService.findMany('api::code-promo.code-promo' as any, {
        filters: {
          actif: true,
          dateDebut: { $lte: maintenant },
          dateFin: { $gte: maintenant }
        },
        fields: ['id', 'code', 'nom', 'description', 'typeReduction', 'valeurReduction', 'montantMinimum']
      });

      ctx.body = {
        codesPromo: (codesPromo as any[]).map(code => ({
          id: code.id,
          code: code.code,
          nom: code.nom,
          description: code.description,
          typeReduction: code.typeReduction,
          valeurReduction: code.valeurReduction,
          montantMinimum: code.montantMinimum
        }))
      };
    } catch (error: any) {
      ctx.throw(500, `Erreur lors de la récupération des codes promo: ${error.message}`);
    }
  }
}));
