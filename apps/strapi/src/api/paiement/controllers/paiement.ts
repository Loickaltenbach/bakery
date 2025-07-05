import { factories } from '@strapi/strapi';

// Fonctions de validation simple
function validerInitierPaiement(data: any) {
  const erreurs = [];
  
  if (!data.commande_id || typeof data.commande_id !== 'string') {
    erreurs.push('commande_id requis et doit être une chaîne');
  }
  
  if (!data.montant || typeof data.montant !== 'number' || data.montant <= 0) {
    erreurs.push('montant requis et doit être un nombre positif');
  }
  
  if (!data.email_client || typeof data.email_client !== 'string' || !data.email_client.includes('@')) {
    erreurs.push('email_client requis et doit être un email valide');
  }
  
  if (!data.nom_client || typeof data.nom_client !== 'string') {
    erreurs.push('nom_client requis et doit être une chaîne');
  }
  
  if (!data.methode_paiement || !['carte_bancaire', 'paypal', 'virement', 'especes'].includes(data.methode_paiement)) {
    erreurs.push('methode_paiement requis et doit être une méthode valide');
  }
  
  if (erreurs.length > 0) {
    throw new Error(`Données invalides: ${erreurs.join(', ')}`);
  }
  
  return data;
}

function validerTraiterPaiement(data: any) {
  const erreurs = [];
  
  if (!data.transaction_id || typeof data.transaction_id !== 'string') {
    erreurs.push('transaction_id requis');
  }
  
  if (!data.statut || !['reussi', 'echoue'].includes(data.statut)) {
    erreurs.push('statut requis et doit être "reussi" ou "echoue"');
  }
  
  if (erreurs.length > 0) {
    throw new Error(`Données invalides: ${erreurs.join(', ')}`);
  }
  
  return data;
}

export default factories.createCoreController('api::paiement.paiement' as any, ({ strapi }) => ({
  /**
   * Initier un nouveau paiement
   */
  async initierPaiement(ctx) {
    try {
      const { data } = ctx.request.body;
      
      // Validation des données
      const validatedData = validerInitierPaiement(data);
      
      // Générer un ID de transaction unique
      const transactionId = `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Vérifier et appliquer le code promo si fourni
      let codePromoUtilise = null;
      let montantFinal = validatedData.montant;
      
      if (validatedData.code_promo_id) {
        const codePromo = await strapi.entityService.findOne('api::code-promo.code-promo' as any, validatedData.code_promo_id);
        
        if (codePromo && codePromo.actif && new Date(codePromo.date_expiration) > new Date()) {
          codePromoUtilise = codePromo;
          
          if (codePromo.type_reduction === 'pourcentage') {
            montantFinal = validatedData.montant * (1 - codePromo.valeur / 100);
          } else if (codePromo.type_reduction === 'montant_fixe') {
            montantFinal = Math.max(0, validatedData.montant - codePromo.valeur);
          }
        }
      }
      
      // Créer l'enregistrement de paiement
      const paiement = await strapi.entityService.create('api::paiement.paiement' as any, {
        data: {
          transaction_id: transactionId,
          commande_id: validatedData.commande_id,
          montant: montantFinal,
          devise: 'EUR',
          statut: 'en_attente',
          methode_paiement: validatedData.methode_paiement,
          email_client: validatedData.email_client,
          nom_client: validatedData.nom_client,
          adresse_facturation: validatedData.adresse_facturation,
          code_promo_utilise: codePromoUtilise?.id,
          facture_envoyee: false
        }
      });
      
      ctx.body = {
        success: true,
        data: {
          transaction_id: transactionId,
          montant_original: validatedData.montant,
          montant_final: montantFinal,
          reduction_appliquee: validatedData.montant - montantFinal,
          code_promo: codePromoUtilise ? {
            code: codePromoUtilise.code,
            description: codePromoUtilise.description,
            reduction: codePromoUtilise.valeur,
            type: codePromoUtilise.type_reduction
          } : null,
          paiement_id: paiement.id
        }
      };
      
    } catch (error) {
      strapi.log.error('Erreur lors de l\'initiation du paiement:', error);
      ctx.throw(400, error.message || 'Erreur lors de l\'initiation du paiement');
    }
  },

  /**
   * Traiter un paiement (simulation ou appel API réel)
   */
  async traiterPaiement(ctx) {
    try {
      const { data } = ctx.request.body;
      const validatedData = validerTraiterPaiement(data);
      
      // Trouver le paiement
      const paiements = await strapi.entityService.findMany('api::paiement.paiement' as any, {
        filters: { transaction_id: validatedData.transaction_id }
      });
      
      if (!paiements || paiements.length === 0) {
        ctx.throw(404, 'Transaction non trouvée');
      }
      
      const paiement = paiements[0];
      
      if (paiement.statut !== 'en_attente' && paiement.statut !== 'en_cours') {
        ctx.throw(400, 'Cette transaction ne peut plus être modifiée');
      }
      
      // Simuler le traitement du paiement
      // En production, ici on ferait appel à Stripe, PayPal, etc.
      const reussite = Math.random() > 0.1; // 90% de réussite en simulation
      const nouveauStatut = reussite ? 'reussi' : 'echoue';
      
      // Mettre à jour le paiement
      const paiementMisAJour = await strapi.entityService.update('api::paiement.paiement' as any, paiement.id, {
        data: {
          statut: nouveauStatut,
          donnees_paiement: data.donnees_paiement || {}
        }
      });
      
      // Si le paiement est réussi et qu'un code promo a été utilisé, marquer comme utilisé
      if (nouveauStatut === 'reussi' && paiement.code_promo_utilise) {
        await strapi.entityService.update('api::code-promo.code-promo' as any, paiement.code_promo_utilise, {
          data: {
            nombre_utilisations: paiement.code_promo_utilise.nombre_utilisations + 1
          }
        });
      }
      
      ctx.body = {
        success: true,
        data: {
          transaction_id: validatedData.transaction_id,
          statut: nouveauStatut,
          paiement_reussi: reussite
        }
      };
      
    } catch (error) {
      strapi.log.error('Erreur lors du traitement du paiement:', error);
      ctx.throw(400, error.message || 'Erreur lors du traitement du paiement');
    }
  },

  /**
   * Confirmer un paiement (pour webhook ou confirmation manuelle)
   */
  async confirmerPaiement(ctx) {
    try {
      const { transaction_id } = ctx.request.body;
      
      if (!transaction_id) {
        ctx.throw(400, 'Transaction ID requis');
      }
      
      const paiements = await strapi.entityService.findMany('api::paiement.paiement' as any, {
        filters: { transaction_id }
      });
      
      if (!paiements || paiements.length === 0) {
        ctx.throw(404, 'Transaction non trouvée');
      }
      
      const paiement = paiements[0];
      
      await strapi.entityService.update('api::paiement.paiement' as any, paiement.id, {
        data: { statut: 'reussi' }
      });
      
      ctx.body = {
        success: true,
        message: 'Paiement confirmé avec succès'
      };
      
    } catch (error) {
      strapi.log.error('Erreur lors de la confirmation du paiement:', error);
      ctx.throw(400, error.message || 'Erreur lors de la confirmation du paiement');
    }
  },

  /**
   * Obtenir le statut d'un paiement
   */
  async obtenirStatut(ctx) {
    try {
      const { transactionId } = ctx.params;
      
      const paiements = await strapi.entityService.findMany('api::paiement.paiement' as any, {
        filters: { transaction_id: transactionId },
        populate: ['code_promo_utilise']
      });
      
      if (!paiements || paiements.length === 0) {
        ctx.throw(404, 'Transaction non trouvée');
      }
      
      const paiement = paiements[0];
      
      ctx.body = {
        success: true,
        data: {
          transaction_id: paiement.transaction_id,
          statut: paiement.statut,
          montant: paiement.montant,
          devise: paiement.devise,
          methode_paiement: paiement.methode_paiement,
          facture_envoyee: paiement.facture_envoyee,
          date_creation: paiement.createdAt,
          code_promo: paiement.code_promo_utilise ? {
            code: paiement.code_promo_utilise.code,
            reduction: paiement.code_promo_utilise.valeur,
            type: paiement.code_promo_utilise.type_reduction
          } : null
        }
      };
      
    } catch (error) {
      strapi.log.error('Erreur lors de la récupération du statut:', error);
      ctx.throw(400, error.message || 'Erreur lors de la récupération du statut');
    }
  },

  /**
   * Générer une facture
   */
  async genererFacture(ctx) {
    try {
      const { transaction_id } = ctx.request.body;
      
      const paiements = await strapi.entityService.findMany('api::paiement.paiement' as any, {
        filters: { transaction_id },
        populate: ['code_promo_utilise']
      });
      
      if (!paiements || paiements.length === 0) {
        ctx.throw(404, 'Transaction non trouvée');
      }
      
      const paiement = paiements[0];
      
      if (paiement.statut !== 'reussi') {
        ctx.throw(400, 'Le paiement doit être réussi pour générer une facture');
      }
      
      // Générer le numéro de facture
      const numeroFacture = `FAC-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;
      
      // Structure de la facture
      const facture = {
        numero: numeroFacture,
        date_emission: new Date().toISOString(),
        transaction_id: paiement.transaction_id,
        client: {
          nom: paiement.nom_client,
          email: paiement.email_client,
          adresse: paiement.adresse_facturation
        },
        montant_ht: (paiement.montant / 1.2).toFixed(2), // Supposer 20% TVA
        tva: (paiement.montant * 0.2 / 1.2).toFixed(2),
        montant_ttc: paiement.montant.toFixed(2),
        devise: paiement.devise,
        methode_paiement: paiement.methode_paiement,
        code_promo: paiement.code_promo_utilise ? {
          code: paiement.code_promo_utilise.code,
          reduction: paiement.code_promo_utilise.valeur,
          type: paiement.code_promo_utilise.type_reduction
        } : null
      };
      
      ctx.body = {
        success: true,
        data: facture
      };
      
    } catch (error) {
      strapi.log.error('Erreur lors de la génération de la facture:', error);
      ctx.throw(400, error.message || 'Erreur lors de la génération de la facture');
    }
  },

  /**
   * Envoyer une facture par email
   */
  async envoyerFacture(ctx) {
    try {
      const { transaction_id, facture } = ctx.request.body;
      
      const paiements = await strapi.entityService.findMany('api::paiement.paiement' as any, {
        filters: { transaction_id }
      });
      
      if (!paiements || paiements.length === 0) {
        ctx.throw(404, 'Transaction non trouvée');
      }
      
      const paiement = paiements[0];
      
      // Simuler l'envoi d'email
      // En production, utiliser un service d'email comme SendGrid, Mailgun, etc.
      console.log(`📧 Envoi de facture à ${paiement.email_client}:`, facture);
      
      // Marquer la facture comme envoyée
      await strapi.entityService.update('api::paiement.paiement' as any, paiement.id, {
        data: {
          facture_envoyee: true,
          date_facture: new Date()
        }
      });
      
      ctx.body = {
        success: true,
        message: 'Facture envoyée avec succès',
        email_envoye_a: paiement.email_client
      };
      
    } catch (error) {
      strapi.log.error('Erreur lors de l\'envoi de la facture:', error);
      ctx.throw(400, error.message || 'Erreur lors de l\'envoi de la facture');
    }
  }
}));
