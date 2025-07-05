const fs = require('fs');
const path = require('path');

module.exports = {
  async up(knex) {
    console.log('🌱 Migration 002: Préparation pour le seed des données de test...');
    // Cette migration est maintenant désactivée. 
    // Les données de test seront insérées via un script séparé après l'initialisation complète de Strapi.
    console.log('✅ Migration 002 terminée - données de test à insérer manuellement');
  },

  async down(knex) {
    console.log('🗑️  Migration 002 rollback - aucune action nécessaire');
    console.log('✅ Rollback terminé');
  }
};
