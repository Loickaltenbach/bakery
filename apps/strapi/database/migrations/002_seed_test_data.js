const fs = require('fs');
const path = require('path');

module.exports = {
  async up(knex) {
    console.log('🌱 Seed: Insertion des catégories et produits de test...');

    try {
      // Charger les données de test
      const categoriesData = JSON.parse(
        fs.readFileSync(path.join(__dirname, '../seeds/categories.json'), 'utf8')
      );
      
      const produitsData = JSON.parse(
        fs.readFileSync(path.join(__dirname, '../seeds/produits.json'), 'utf8')
      );

      // Insérer les catégories
      for (const categorie of categoriesData) {
        await strapi.entityService.findOrCreate('api::categorie.categorie', {
          data: {
            nom: categorie.nom,
            slug: categorie.slug,
            description: categorie.description,
            couleur: categorie.couleur,
            icone: categorie.icone,
            ordre: categorie.ordre,
            disponible: categorie.disponible,
            delaiPreparationDefaut: categorie.delaiPreparationDefaut,
            disponibiliteJours: categorie.disponibiliteJours
          }
        });
      }

      console.log(`✅ ${categoriesData.length} catégories insérées`);

      // Récupérer les catégories créées pour les relations
      const categories = await strapi.entityService.findMany('api::categorie.categorie');
      const categoriesMap = {};
      categories.forEach(cat => {
        categoriesMap[cat.nom] = cat.id;
      });

      // Insérer les produits
      for (const produit of produitsData) {
        const categorieId = categoriesMap[Object.keys(categoriesMap)[produit.categorieId - 1]];
        
        await strapi.entityService.findOrCreate('api::produit.produit', {
          data: {
            nom: produit.nom,
            description: produit.description,
            prix: produit.prix,
            disponible: produit.disponible,
            stock: produit.stock,
            stockMinimum: produit.stockMinimum,
            enRupture: produit.enRupture,
            allergenes: produit.allergenes,
            informationsNutritionnelles: produit.informationsNutritionnelles,
            regimesCompatibles: produit.regimesCompatibles,
            tempsPreparation: produit.tempsPreparation,
            poids: produit.poids,
            unite: produit.unite,
            disponibiliteJours: produit.disponibiliteJours,
            produitSaisonnier: produit.produitSaisonnier,
            dateDebutSaison: produit.dateDebutSaison,
            dateFinSaison: produit.dateFinSaison,
            ordre: produit.ordre,
            nouveaute: produit.nouveaute,
            promotion: produit.promotion,
            categorie: categorieId
          }
        });
      }

      console.log(`✅ ${produitsData.length} produits insérés`);

      // Créer la configuration des horaires par défaut
      const horaireConfig = {
        horairesNormaux: {
          lundi: { 
            ouvert: true, 
            matin: { debut: '07:00', fin: '12:30' }, 
            apresmidi: { debut: '15:00', fin: '19:00' } 
          },
          mardi: { 
            ouvert: true, 
            matin: { debut: '07:00', fin: '12:30' }, 
            apresmidi: { debut: '15:00', fin: '19:00' } 
          },
          mercredi: { 
            ouvert: true, 
            matin: { debut: '07:00', fin: '12:30' }, 
            apresmidi: { debut: '15:00', fin: '19:00' } 
          },
          jeudi: { 
            ouvert: true, 
            matin: { debut: '07:00', fin: '12:30' }, 
            apresmidi: { debut: '15:00', fin: '19:00' } 
          },
          vendredi: { 
            ouvert: true, 
            matin: { debut: '07:00', fin: '12:30' }, 
            apresmidi: { debut: '15:00', fin: '19:00' } 
          },
          samedi: { 
            ouvert: true, 
            matin: { debut: '07:00', fin: '13:00' }, 
            apresmidi: { debut: '', fin: '' } 
          },
          dimanche: { 
            ouvert: false, 
            matin: { debut: '', fin: '' }, 
            apresmidi: { debut: '', fin: '' } 
          }
        },
        configurationCreneaux: {
          intervalleMinutes: 15,
          delaiMinimumMinutes: 30,
          creneauxSimultanes: 3
        },
        delaisPreparation: {
          pains: 30,
          viennoiseries: 45,
          patisseries: 60,
          sandwichs: 15,
          boissons: 5,
          autres: 30
        },
        messagesFermeture: {
          dimanche: 'Fermé le dimanche. Nous vous accueillons du lundi au samedi.',
          conges: 'Fermé pour congés. Réouverture prochainement.',
          exceptionnel: 'Fermé exceptionnellement. Merci de votre compréhension.'
        }
      };

      await strapi.entityService.findOrCreate('api::horaire-ouverture.horaire-ouverture', {
        data: horaireConfig
      });

      console.log('✅ Configuration des horaires créée');
      console.log('🎉 Base de données peuplée avec succès !');

    } catch (error) {
      console.error('❌ Erreur lors du peuplement de la base de données:', error);
      throw error;
    }
  },

  async down(knex) {
    console.log('🗑️  Suppression des données de test...');
    
    // Supprimer les produits
    await strapi.entityService.deleteMany('api::produit.produit', {});
    
    // Supprimer les catégories
    await strapi.entityService.deleteMany('api::categorie.categorie', {});
    
    // Supprimer la configuration des horaires
    await strapi.entityService.deleteMany('api::horaire-ouverture.horaire-ouverture', {});
    
    console.log('✅ Données de test supprimées');
  }
};
