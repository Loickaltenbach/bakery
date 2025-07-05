const fs = require('fs');
const path = require('path');

/**
 * Script de seed pour peupler la base de données avec des données de test
 * À exécuter après que Strapi soit démarré et les tables créées
 */

async function seedDatabase() {
  console.log('🌱 Seed: Insertion des catégories et produits de test...');

  try {
    // Vérifier que Strapi est disponible
    if (!strapi) {
      console.error('❌ Strapi n\'est pas disponible. Assurez-vous que ce script s\'exécute dans le contexte de Strapi.');
      return;
    }

    // Charger les données de test
    const categoriesData = JSON.parse(
      fs.readFileSync(path.join(__dirname, '../database/seeds/categories.json'), 'utf8')
    );
    
    const produitsData = JSON.parse(
      fs.readFileSync(path.join(__dirname, '../database/seeds/produits.json'), 'utf8')
    );

    // Insérer les catégories
    let categoriesCreated = 0;
    for (const categorie of categoriesData) {
      // Vérifier si la catégorie existe déjà
      const existingCategorie = await strapi.entityService.findMany('api::categorie.categorie', {
        filters: { slug: categorie.slug },
        limit: 1
      });

      if (!existingCategorie || existingCategorie.length === 0) {
        await strapi.entityService.create('api::categorie.categorie', {
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
        categoriesCreated++;
      }
    }

    console.log(`✅ ${categoriesCreated} nouvelles catégories insérées`);

    // Récupérer les catégories créées pour les relations
    const categories = await strapi.entityService.findMany('api::categorie.categorie');
    const categoriesMap = {};
    categories.forEach(cat => {
      categoriesMap[cat.nom] = cat.id;
    });

    // Insérer les produits
    let produitsCreated = 0;
    for (const produit of produitsData) {
      const categorieId = categoriesMap[Object.keys(categoriesMap)[produit.categorieId - 1]];
      
      // Vérifier si le produit existe déjà
      const existingProduit = await strapi.entityService.findMany('api::produit.produit', {
        filters: { nom: produit.nom },
        limit: 1
      });

      if (!existingProduit || existingProduit.length === 0) {
        await strapi.entityService.create('api::produit.produit', {
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
        produitsCreated++;
      }
    }

    console.log(`✅ ${produitsCreated} nouveaux produits insérés`);

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

    // Vérifier si la configuration des horaires existe déjà
    const existingHoraires = await strapi.entityService.findMany('api::horaire-ouverture.horaire-ouverture', {
      limit: 1
    });

    if (!existingHoraires || existingHoraires.length === 0) {
      await strapi.entityService.create('api::horaire-ouverture.horaire-ouverture', {
        data: horaireConfig
      });
      console.log('✅ Configuration des horaires créée');
    } else {
      console.log('ℹ️ Configuration des horaires déjà existante');
    }

    console.log('🎉 Base de données peuplée avec succès !');

  } catch (error) {
    console.error('❌ Erreur lors du peuplement de la base de données:', error);
    throw error;
  }
}

module.exports = {
  seedDatabase
};

// Si le script est exécuté directement
if (require.main === module) {
  console.log('Ce script doit être exécuté dans le contexte de Strapi.');
  console.log('Utilisez: npm run strapi script scripts/seed-database.js');
}
