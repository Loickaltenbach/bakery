/**
 * produit controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::produit.produit', ({ strapi }) => ({
  // GET /api/produits - Récupérer les produits avec logique de disponibilité
  async find(ctx) {
    try {
      const { categorie, disponible, saisonnier, nouveautes } = ctx.query;
      
      const filters: any = {};
      
      // Filtrer par catégorie
      if (categorie) {
        filters.categorie = { slug: categorie };
      }
      
      // Filtrer par disponibilité
      if (disponible !== undefined) {
        filters.disponible = disponible === 'true';
      }
      
      // Filtrer les ruptures de stock
      filters.enRupture = false;
      
      const produits = await strapi.entityService.findMany('api::produit.produit' as any, {
        filters,
        sort: { ordre: 'asc', nom: 'asc' } as any,
        populate: ['categorie', 'images'] as any
      } as any);

      // Logique de disponibilité par jour
      const aujourdhui = new Date();
      const jourSemaine = aujourdhui.toLocaleDateString('fr-FR', { weekday: 'long' });
      
      const produitsFiltrés = produits.filter((produit: any) => {
        // Vérifier disponibilité par jour
        if (produit.disponibiliteJours && !produit.disponibiliteJours[jourSemaine]) {
          return false;
        }
        
        // Vérifier saisonnalité
        if (produit.produitSaisonnier) {
          const dateDebut = new Date(produit.dateDebutSaison);
          const dateFin = new Date(produit.dateFinSaison);
          const maintenant = new Date();
          
          if (maintenant < dateDebut || maintenant > dateFin) {
            return false;
          }
        }
        
        return true;
      });

      // Filtrer les nouveautés si demandé
      if (nouveautes === 'true') {
        return ctx.send(produitsFiltrés.filter((p: any) => p.nouveaute));
      }

      ctx.body = produitsFiltrés;
    } catch (error) {
      ctx.throw(500, 'Erreur lors de la récupération des produits');
    }
  },

  // GET /api/produits/aujourd-hui
  async aujourdhui(ctx: any) {
    try {
      const maintenant = new Date();
      const jourSemaine = maintenant.toLocaleDateString('fr-FR', { weekday: 'long' });
      
      // Filtres de base
      const filters: any = {
        disponible: true,
        enRupture: false,
        [`disponibiliteJours.${jourSemaine}`]: true
      };

      // Filtre par catégorie si spécifié
      if (ctx.query.categorie) {
        filters['categorie.slug'] = ctx.query.categorie;
      }

      // Filtre pour les produits saisonniers
      const dateAujourdhui = maintenant.toISOString().split('T')[0];
      
      const produits = await strapi.entityService.findMany('api::produit.produit' as any, {
        filters,
        populate: ['categorie', 'images'] as any
      } as any) as any[];

      // Filtrer les produits saisonniers selon la date
      const produitsDisponibles = produits.filter((produit: any) => {
        if (!produit.produitSaisonnier) {
          return true; // Produit non saisonnier, toujours disponible
        }

        if (!produit.dateDebutSaison || !produit.dateFinSaison) {
          return false; // Produit saisonnier sans dates configurées
        }

        const dateDebut = new Date(produit.dateDebutSaison);
        const dateFin = new Date(produit.dateFinSaison);
        const dateActuelle = new Date(dateAujourdhui);

        return dateActuelle >= dateDebut && dateActuelle <= dateFin;
      });

      ctx.body = {
        data: produitsDisponibles,
        meta: {
          total: produitsDisponibles.length,
          jour: jourSemaine,
          date: dateAujourdhui
        }
      };

    } catch (error) {
      console.error('Erreur lors de la récupération des produits du jour:', error);
      ctx.throw(500, 'Erreur lors de la récupération des produits du jour');
    }
  },

  // PUT /api/produits/:id/stock
  async updateStock(ctx: any) {
    try {
      const { id } = ctx.params;
      const { stock } = ctx.request.body;

      if (typeof stock !== 'number' || stock < 0) {
        return ctx.badRequest('Stock invalide');
      }

      const produit = await strapi.entityService.findOne('api::produit.produit' as any, id) as any;
      
      if (!produit) {
        return ctx.notFound('Produit non trouvé');
      }

      // Mettre à jour le stock et vérifier les ruptures
      const enRupture = stock <= produit.stockMinimum;

      const produitMisAJour = await strapi.entityService.update('api::produit.produit' as any, id, {
        data: {
          stock,
          enRupture,
          disponible: stock > 0 // Indisponible si stock à 0
        }
      });

      ctx.body = {
        data: produitMisAJour,
        message: enRupture ? 'Attention: produit en rupture de stock' : 'Stock mis à jour'
      };

    } catch (error) {
      console.error('Erreur lors de la mise à jour du stock:', error);
      ctx.throw(500, 'Erreur lors de la mise à jour du stock');
    }
  },

  // GET /api/produits/alertes-stock
  async alertesStock(ctx: any) {
    try {
      const produits = await strapi.entityService.findMany('api::produit.produit' as any, {
        filters: {
          $or: [
            { enRupture: true },
            { stock: { $lte: strapi.db.connection.raw('stock_minimum') } }
          ]
        },
        populate: ['categorie']
      }) as any[];

      const alertes = produits.map((produit: any) => ({
        id: produit.id,
        nom: produit.nom,
        stock: produit.stock,
        stockMinimum: produit.stockMinimum,
        enRupture: produit.enRupture,
        categorie: produit.categorie?.nom,
        niveau: produit.stock === 0 ? 'critique' : produit.enRupture ? 'faible' : 'attention'
      }));

      ctx.body = {
        data: alertes,
        meta: {
          total: alertes.length,
          critique: alertes.filter(a => a.niveau === 'critique').length,
          faible: alertes.filter(a => a.niveau === 'faible').length
        }
      };

    } catch (error) {
      console.error('Erreur lors de la récupération des alertes stock:', error);
      ctx.throw(500, 'Erreur lors de la récupération des alertes stock');
    }
  }
}));