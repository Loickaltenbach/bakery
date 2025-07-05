import { factories } from '@strapi/strapi';

export default factories.createCoreService('api::paiement.paiement' as any, ({ strapi }) => ({
  /**
   * Créer un nouveau paiement avec validation
   */
  async creerPaiement(data: any) {
    try {
      return await strapi.entityService.create('api::paiement.paiement' as any, { data });
    } catch (error) {
      strapi.log.error('Erreur lors de la création du paiement:', error);
      throw error;
    }
  },

  /**
   * Trouver un paiement par transaction ID
   */
  async trouverParTransactionId(transactionId: string) {
    try {
      const paiements = await strapi.entityService.findMany('api::paiement.paiement' as any, {
        filters: { transaction_id: transactionId },
        populate: ['code_promo_utilise']
      });
      
      return paiements && paiements.length > 0 ? paiements[0] : null;
    } catch (error) {
      strapi.log.error('Erreur lors de la recherche du paiement:', error);
      throw error;
    }
  },

  /**
   * Mettre à jour le statut d'un paiement
   */
  async mettreAJourStatut(paiementId: number, nouveauStatut: string, donnees?: any) {
    try {
      const updateData: any = { statut: nouveauStatut };
      
      if (donnees) {
        updateData.donnees_paiement = donnees;
      }
      
      return await strapi.entityService.update('api::paiement.paiement' as any, paiementId, {
        data: updateData
      });
    } catch (error) {
      strapi.log.error('Erreur lors de la mise à jour du statut:', error);
      throw error;
    }
  },

  /**
   * Calculer le montant final avec code promo
   */
  calculerMontantAvecPromo(montantOriginal: number, codePromo: any) {
    if (!codePromo || !codePromo.actif) {
      return montantOriginal;
    }

    // Vérifier la date d'expiration
    if (new Date(codePromo.date_expiration) <= new Date()) {
      return montantOriginal;
    }

    // Appliquer la réduction
    if (codePromo.type_reduction === 'pourcentage') {
      return montantOriginal * (1 - codePromo.valeur / 100);
    } else if (codePromo.type_reduction === 'montant_fixe') {
      return Math.max(0, montantOriginal - codePromo.valeur);
    }

    return montantOriginal;
  },

  /**
   * Générer un ID de transaction unique
   */
  genererTransactionId() {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9);
    return `tx_${timestamp}_${random}`;
  },

  /**
   * Valider les données de paiement
   */
  validerDonneesPaiement(data: any) {
    const erreurs = [];

    if (!data.commande_id) {
      erreurs.push('ID de commande requis');
    }

    if (!data.montant || data.montant <= 0) {
      erreurs.push('Montant invalide');
    }

    if (!data.email_client || !validerEmail(data.email_client)) {
      erreurs.push('Email client invalide');
    }

    if (!data.nom_client) {
      erreurs.push('Nom du client requis');
    }

    if (!data.methode_paiement || !['carte_bancaire', 'paypal', 'virement', 'especes'].includes(data.methode_paiement)) {
      erreurs.push('Méthode de paiement invalide');
    }

    return {
      valide: erreurs.length === 0,
      erreurs
    };
  },

  /**
   * Formater les données de facture
   */
  formaterFacture(paiement: any) {
    const numeroFacture = `FAC-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;
    const montantHT = (paiement.montant / 1.2);
    const montantTVA = (paiement.montant - montantHT);

    return {
      numero: numeroFacture,
      date_emission: new Date().toISOString(),
      transaction_id: paiement.transaction_id,
      client: {
        nom: paiement.nom_client,
        email: paiement.email_client,
        adresse: paiement.adresse_facturation
      },
      montant_ht: montantHT.toFixed(2),
      tva: montantTVA.toFixed(2),
      montant_ttc: paiement.montant.toFixed(2),
      devise: paiement.devise || 'EUR',
      methode_paiement: paiement.methode_paiement,
      code_promo: paiement.code_promo_utilise ? {
        code: paiement.code_promo_utilise.code,
        reduction: paiement.code_promo_utilise.valeur,
        type: paiement.code_promo_utilise.type_reduction
      } : null,
      details_commande: {
        commande_id: paiement.commande_id,
        date_commande: paiement.createdAt
      }
    };
  },

  /**
   * Simuler un paiement (à remplacer par l'intégration réelle)
   */
  async simulerPaiement(methodePaiement: string, montant: number, donnees: any) {
    // Simuler un délai de traitement
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Simuler différents taux de réussite selon la méthode
    let tauxReussite = 0.9; // 90% par défaut

    switch (methodePaiement) {
      case 'carte_bancaire':
        tauxReussite = 0.95;
        break;
      case 'paypal':
        tauxReussite = 0.98;
        break;
      case 'virement':
        tauxReussite = 0.99;
        break;
      case 'especes':
        tauxReussite = 1.0;
        break;
    }

    const reussite = Math.random() < tauxReussite;

    return {
      reussi: reussite,
      code_erreur: reussite ? null : 'PAIEMENT_REFUSE',
      message: reussite ? 'Paiement traité avec succès' : 'Paiement refusé par la banque',
      donnees_reponse: {
        transaction_externe_id: `ext_${Date.now()}`,
        methode: methodePaiement,
        montant: montant,
        timestamp: new Date().toISOString()
      }
    };
  }
}));

/**
 * Valider une adresse email
 */
function validerEmail(email: string) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}
