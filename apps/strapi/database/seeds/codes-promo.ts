/**
 * Seed script pour les codes promo
 */

export default async () => {
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
      code: 'LIVRAISONOFF',
      nom: 'Livraison gratuite',
      description: 'Livraison gratuite sans minimum',
      typeReduction: 'LIVRAISON_GRATUITE',
      valeurReduction: 0,
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
    },
    {
      code: 'PATISSERIE15',
      nom: 'Spécial pâtisseries',
      description: '15% sur toutes les pâtisseries',
      typeReduction: 'POURCENTAGE',
      valeurReduction: 15,
      montantMinimum: 20,
      dateDebut: new Date('2024-01-01'),
      dateFin: new Date('2025-12-31'),
      utilisationsActuelles: 0,
      actif: true
    }
  ];

  for (const codePromo of codesPromo) {
    try {
      // Vérifier si le code existe déjà
      const existing = await strapi.entityService.findMany('api::code-promo.code-promo' as any, {
        filters: { code: codePromo.code }
      });

      if (existing && (existing as any[]).length === 0) {
        await strapi.entityService.create('api::code-promo.code-promo' as any, {
          data: codePromo
        });
        strapi.log.info(`✅ Code promo "${codePromo.code}" créé`);
      } else {
        strapi.log.info(`ℹ️  Code promo "${codePromo.code}" existe déjà`);
      }
    } catch (error) {
      strapi.log.error(`❌ Erreur lors de la création du code promo "${codePromo.code}":`, error);
    }
  }

  strapi.log.info('🎉 Seed des codes promo terminé');
};
