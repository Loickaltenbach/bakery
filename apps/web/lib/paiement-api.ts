import { CodePromo, Paiement, Facture, StatutFacture } from './paiement-types';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

// API pour les codes promo
export const codesPromoAPI = {
  // Valider un code promo
  async valider(code: string, montant?: number, categoriesCommande?: number[]): Promise<{
    valide: boolean;
    codePromo?: CodePromo;
    erreur?: string;
  }> {
    try {
      const params = new URLSearchParams();
      if (montant) params.append('montant', montant.toString());
      if (categoriesCommande && categoriesCommande.length > 0) {
        params.append('categoriesCommande', categoriesCommande.join(','));
      }

      const response = await fetch(
        `${STRAPI_URL}/api/codes-promo/valider/${encodeURIComponent(code)}?${params}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        return {
          valide: false,
          erreur: errorData?.error?.message || 'Code promo invalide'
        };
      }

      const data = await response.json();
      return {
        valide: data.valide,
        codePromo: data.codePromo ? {
          id: data.codePromo.id,
          code: data.codePromo.code,
          nom: data.codePromo.nom,
          description: data.codePromo.description,
          typeReduction: data.codePromo.typeReduction,
          valeurReduction: data.codePromo.valeurReduction,
          montantMinimum: data.codePromo.montantMinimum,
          dateDebut: new Date(data.codePromo.dateDebut),
          dateFin: new Date(data.codePromo.dateFin),
          utilisationsMax: data.codePromo.utilisationsMax,
          utilisationsActuelles: data.codePromo.utilisationsActuelles || 0,
          actif: true,
          premiereCommande: data.codePromo.premiereCommande || false
        } : undefined
      };
    } catch (error) {
      console.error('Erreur lors de la validation du code promo:', error);
      return {
        valide: false,
        erreur: 'Erreur de connexion'
      };
    }
  },

  // Utiliser un code promo (incrémenter le compteur)
  async utiliser(codePromoId: string): Promise<boolean> {
    try {
      const response = await fetch(
        `${STRAPI_URL}/api/codes-promo/utiliser/${codePromoId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        return false;
      }

      const data = await response.json();
      return data.succes;
    } catch (error) {
      console.error('Erreur lors de l\'utilisation du code promo:', error);
      return false;
    }
  },

  // Récupérer les codes promo actifs publics
  async getActifs(): Promise<CodePromo[]> {
    try {
      const response = await fetch(`${STRAPI_URL}/api/codes-promo/actifs`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        return [];
      }

      const data = await response.json();
      return data.codesPromo.map((code: any) => ({
        id: code.id,
        code: code.code,
        nom: code.nom,
        description: code.description,
        typeReduction: code.typeReduction,
        valeurReduction: code.valeurReduction,
        montantMinimum: code.montantMinimum,
        dateDebut: new Date(),
        dateFin: new Date(),
        utilisationsActuelles: 0,
        actif: true
      }));
    } catch (error) {
      console.error('Erreur lors de la récupération des codes promo:', error);
      return [];
    }
  }
};

// API pour les paiements
export const paiementAPI = {
  // Initier un paiement
  async initier(donneesPaiement: {
    commande_id: string;
    montant: number;
    email_client: string;
    nom_client: string;
    methode_paiement: 'carte_bancaire' | 'paypal' | 'virement' | 'especes';
    code_promo_id?: string;
    adresse_facturation?: {
      nom: string;
      prenom: string;
      adresse: string;
      ville: string;
      code_postal: string;
      pays?: string;
    };
  }): Promise<{
    succes: boolean;
    transaction_id?: string;
    montant_original?: number;
    montant_final?: number;
    reduction_appliquee?: number;
    code_promo?: any;
    erreur?: string;
  }> {
    try {
      const response = await fetch(`${STRAPI_URL}/api/paiements/initier`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: donneesPaiement }),
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          succes: false,
          erreur: result.error?.message || 'Erreur lors de l\'initiation du paiement'
        };
      }

      return {
        succes: result.success,
        transaction_id: result.data.transaction_id,
        montant_original: result.data.montant_original,
        montant_final: result.data.montant_final,
        reduction_appliquee: result.data.reduction_appliquee,
        code_promo: result.data.code_promo
      };
    } catch (error) {
      return {
        succes: false,
        erreur: 'Erreur de connexion'
      };
    }
  },

  // Traiter un paiement
  async traiter(transaction_id: string, donnees_paiement: any): Promise<{
    succes: boolean;
    paiement_reussi?: boolean;
    erreur?: string;
  }> {
    try {
      const response = await fetch(`${STRAPI_URL}/api/paiements/traiter`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: {
            transaction_id,
            donnees_paiement,
            statut: 'reussi' // Simulation
          }
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          succes: false,
          erreur: result.error?.message || 'Erreur lors du traitement du paiement'
        };
      }

      return {
        succes: result.success,
        paiement_reussi: result.data.paiement_reussi
      };
    } catch (error) {
      return {
        succes: false,
        erreur: 'Erreur de traitement'
      };
    }
  },

  // Obtenir le statut d'un paiement
  async obtenirStatut(transaction_id: string): Promise<{
    succes: boolean;
    statut?: string;
    montant?: number;
    facture_envoyee?: boolean;
    erreur?: string;
  }> {
    try {
      const response = await fetch(`${STRAPI_URL}/api/paiements/statut/${transaction_id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          succes: false,
          erreur: result.error?.message || 'Transaction non trouvée'
        };
      }

      return {
        succes: result.success,
        statut: result.data.statut,
        montant: result.data.montant,
        facture_envoyee: result.data.facture_envoyee
      };
    } catch (error) {
      return {
        succes: false,
        erreur: 'Erreur de connexion'
      };
    }
  }
};

// API pour les factures
export const factureAPI = {
  // Générer une facture
  async generer(transaction_id: string): Promise<{
    succes: boolean;
    facture?: Facture;
    erreur?: string;
  }> {
    try {
      const response = await fetch(`${STRAPI_URL}/api/paiements/generer-facture`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ transaction_id }),
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          succes: false,
          erreur: result.error?.message || 'Erreur lors de la génération de la facture'
        };
      }

      // Adapter les données de Strapi au format Facture
      const factureStrapi = result.data;
      const facture: Facture = {
        id: factureStrapi.numero,
        numero: factureStrapi.numero,
        commandeId: factureStrapi.transaction_id, // Utiliser transaction_id comme commandeId
        dateEmission: new Date(factureStrapi.date_emission),
        montantHT: parseFloat(factureStrapi.montant_ht),
        montantTTC: parseFloat(factureStrapi.montant_ttc),
        tauxTVA: parseFloat(factureStrapi.tva) / parseFloat(factureStrapi.montant_ht),
        statut: StatutFacture.EMISE,
        emailEnvoye: false
      };

      return {
        succes: true,
        facture
      };
    } catch (error) {
      return {
        succes: false,
        erreur: 'Erreur lors de la génération de la facture'
      };
    }
  },

  // Envoyer une facture par email
  async envoyer(transaction_id: string, facture: Facture): Promise<{
    succes: boolean;
    email_envoye_a?: string;
    erreur?: string;
  }> {
    try {
      const response = await fetch(`${STRAPI_URL}/api/paiements/envoyer-facture`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ transaction_id, facture }),
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          succes: false,
          erreur: result.error?.message || 'Erreur lors de l\'envoi de la facture'
        };
      }

      return {
        succes: result.success,
        email_envoye_a: result.email_envoye_a
      };
    } catch (error) {
      return {
        succes: false,
        erreur: 'Erreur lors de l\'envoi de la facture'
      };
    }
  }
};
