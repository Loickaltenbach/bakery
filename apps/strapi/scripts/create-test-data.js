#!/usr/bin/env node

/**
 * Script pour créer des codes promo de test
 * Usage: node create-test-data.js
 */

const fetch = require('node-fetch');

const STRAPI_URL = 'http://localhost:1337';

const codesPromo = [
  {
    code: 'BIENVENUE10',
    nom: 'Réduction première commande',
    description: '10% de réduction sur votre première commande',
    typeReduction: 'POURCENTAGE',
    valeurReduction: 10,
    montantMinimum: 15,
    dateDebut: new Date('2024-01-01'),
    dateFin: new Date('2025-12-31'),
    utilisationsMax: 1000,
    utilisationsActuelles: 0,
    actif: true,
    premiereCommande: true
  },
  {
    code: 'WEEK5',
    nom: 'Réduction week-end',
    description: '5€ de réduction le week-end',
    typeReduction: 'MONTANT_FIXE',
    valeurReduction: 5,
    montantMinimum: 25,
    dateDebut: new Date('2024-01-01'),
    dateFin: new Date('2025-12-31'),
    utilisationsActuelles: 0,
    actif: true
  },
  {
    code: 'NOEL20',
    nom: 'Promotion de Noël',
    description: '20% de réduction pour les fêtes',
    typeReduction: 'POURCENTAGE',
    valeurReduction: 20,
    montantMinimum: 30,
    dateDebut: new Date('2024-12-01'),
    dateFin: new Date('2025-01-31'),
    utilisationsMax: 500,
    utilisationsActuelles: 0,
    actif: true
  }
];

async function createTestData() {
  console.log('🌱 Création des données de test...');
  
  try {
    // Attendre que Strapi soit démarré
    console.log('⏳ Vérification que Strapi est démarré...');
    let strapiReady = false;
    let attempts = 0;
    
    while (!strapiReady && attempts < 30) {
      try {
        const response = await fetch(`${STRAPI_URL}/admin`);
        if (response.status < 500) {
          strapiReady = true;
        }
      } catch (error) {
        // Strapi pas encore démarré
      }
      
      if (!strapiReady) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        attempts++;
        console.log(`   ... tentative ${attempts}/30`);
      }
    }
    
    if (!strapiReady) {
      console.error('❌ Strapi n\'est pas accessible après 60 secondes');
      process.exit(1);
    }
    
    console.log('✅ Strapi est accessible!');
    
    // Créer les codes promo
    for (const codePromo of codesPromo) {
      try {
        // Vérifier si le code existe déjà
        const checkResponse = await fetch(
          `${STRAPI_URL}/api/codes-promo/valider/${codePromo.code}`,
          { method: 'GET' }
        );
        
        if (checkResponse.status === 404) {
          // Le code n'existe pas, on peut le créer
          const createResponse = await fetch(`${STRAPI_URL}/api/codes-promo`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ data: codePromo }),
          });
          
          if (createResponse.ok) {
            console.log(`✅ Code promo "${codePromo.code}" créé`);
          } else {
            console.log(`⚠️  Erreur lors de la création du code "${codePromo.code}"`);
          }
        } else {
          console.log(`ℹ️  Code promo "${codePromo.code}" existe déjà`);
        }
      } catch (error) {
        console.log(`❌ Erreur avec le code "${codePromo.code}":`, error.message);
      }
    }
    
    console.log('🎉 Création des données de test terminée!');
    console.log('');
    console.log('📋 Codes promo disponibles:');
    codesPromo.forEach(code => {
      console.log(`   - ${code.code}: ${code.description}`);
    });
    
  } catch (error) {
    console.error('❌ Erreur lors de la création des données:', error);
    process.exit(1);
  }
}

// Vérifier si ce script est exécuté directement
if (require.main === module) {
  createTestData();
}

module.exports = createTestData;
