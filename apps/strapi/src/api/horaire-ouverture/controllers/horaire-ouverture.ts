/**
 * horaire-ouverture controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::horaire-ouverture.horaire-ouverture' as any, ({ strapi }) => ({
  // GET /api/horaires-ouverture/creneaux-disponibles
  async creneauxDisponibles(ctx: any) {
    try {
      const { date, categorie } = ctx.query;
      
      if (!date) {
        return ctx.badRequest('Date requise');
      }

      const dateRetrait = new Date(date as string);
      const maintenant = new Date();

      // Récupérer la configuration des horaires
      const config = await strapi.entityService.findOne('api::horaire-ouverture.horaire-ouverture' as any, 1) as any;
      
      if (!config) {
        return ctx.notFound('Configuration des horaires non trouvée');
      }

      // Vérifier les fermetures exceptionnelles
      const fermetures = await strapi.entityService.findMany('api::fermeture-exceptionnelle.fermeture-exceptionnelle' as any, {
        filters: {
          dateDebut: { $lte: dateRetrait },
          dateFin: { $gte: dateRetrait },
          actif: true
        }
      }) as any[];

      if (fermetures.length > 0) {
        const fermeture = fermetures[0];
        if (fermeture.fermetureComplete) {
          return ctx.send({
            creneaux: [],
            message: fermeture.messageClient || 'Boulangerie fermée ce jour-là',
            fermetureExceptionnelle: true
          });
        }
      }

      // Récupérer les horaires du jour
      const jourSemaine = dateRetrait.toLocaleDateString('fr-FR', { weekday: 'long' });
      const horairesJour = config.horairesNormaux[jourSemaine];

      if (!horairesJour || !horairesJour.ouvert) {
        return ctx.send({
          creneaux: [],
          message: 'Boulangerie fermée le ' + jourSemaine,
          ferme: true
        });
      }

      // Calculer le délai de préparation
      let delaiPreparation = config.delaisPreparation.autres;
      if (categorie && config.delaisPreparation[categorie as string]) {
        delaiPreparation = config.delaisPreparation[categorie as string];
      }

      // Générer les créneaux disponibles
      const creneaux: any[] = [];
      const intervalleMinutes = config.configurationCreneaux.intervalleMinutes;
      const delaiMinimum = config.configurationCreneaux.delaiMinimumMinutes;

      // Créneaux du matin
      if (horairesJour.matin.debut && horairesJour.matin.fin) {
        const [heureDebutMatin, minuteDebutMatin] = horairesJour.matin.debut.split(':').map(Number);
        const [heureFinMatin, minuteFinMatin] = horairesJour.matin.fin.split(':').map(Number);
        
        const debutMatin = new Date(dateRetrait);
        debutMatin.setHours(heureDebutMatin, minuteDebutMatin, 0, 0);
        
        const finMatin = new Date(dateRetrait);
        finMatin.setHours(heureFinMatin, minuteFinMatin, 0, 0);

        creneaux.push(...genererCreneauxPeriode(debutMatin, finMatin, intervalleMinutes, maintenant, delaiMinimum, delaiPreparation));
      }

      // Créneaux de l'après-midi
      if (horairesJour.apresmidi.debut && horairesJour.apresmidi.fin) {
        const [heureDebutAM, minuteDebutAM] = horairesJour.apresmidi.debut.split(':').map(Number);
        const [heureFinAM, minuteFinAM] = horairesJour.apresmidi.fin.split(':').map(Number);
        
        const debutAM = new Date(dateRetrait);
        debutAM.setHours(heureDebutAM, minuteDebutAM, 0, 0);
        
        const finAM = new Date(dateRetrait);
        finAM.setHours(heureFinAM, minuteFinAM, 0, 0);

        creneaux.push(...genererCreneauxPeriode(debutAM, finAM, intervalleMinutes, maintenant, delaiMinimum, delaiPreparation));
      }

      // Vérifier la disponibilité de chaque créneau
      const creneauxAvecDisponibilite = await Promise.all(
        creneaux.map(async (creneau) => {
          const commandesExistantes = await strapi.entityService.findMany('api::commande.commande' as any, {
            filters: {
              'creneauRetrait.dateHeure': creneau.dateHeure,
              statut: { $ne: 'ANNULEE' }
            }
          }) as any[];

          return {
            ...creneau,
            disponible: commandesExistantes.length < config.configurationCreneaux.creneauxSimultanes,
            nombreCommandes: commandesExistantes.length
          };
        })
      );

      ctx.body = {
        creneaux: creneauxAvecDisponibilite.filter(c => c.disponible),
        totalCreneaux: creneauxAvecDisponibilite.length,
        date: dateRetrait.toISOString().split('T')[0],
        delaiPreparation,
        fermetureExceptionnelle: false
      };

    } catch (error) {
      console.error('Erreur lors de la génération des créneaux:', error);
      ctx.throw(500, 'Erreur lors de la génération des créneaux');
    }
  },

  // GET /api/horaires-ouverture/aujourd-hui
  async aujourdhui(ctx: any) {
    try {
      const maintenant = new Date();
      const jourSemaine = maintenant.toLocaleDateString('fr-FR', { weekday: 'long' });

      const config = await strapi.entityService.findOne('api::horaire-ouverture.horaire-ouverture' as any, 1) as any;
      
      if (!config) {
        return ctx.notFound('Configuration des horaires non trouvée');
      }

      const horairesJour = config.horairesNormaux[jourSemaine];

      // Vérifier les fermetures exceptionnelles
      const fermetures = await strapi.entityService.findMany('api::fermeture-exceptionnelle.fermeture-exceptionnelle' as any, {
        filters: {
          dateDebut: { $lte: maintenant },
          dateFin: { $gte: maintenant },
          actif: true
        }
      }) as any[];

      let statutOuverture = 'ferme';
      let messageStatut = 'Fermé';

      if (fermetures.length > 0) {
        const fermeture = fermetures[0];
        if (fermeture.fermetureComplete) {
          messageStatut = fermeture.messageClient || 'Fermé exceptionnellement';
        }
      } else if (horairesJour && horairesJour.ouvert) {
        const heureActuelle = maintenant.getHours() * 60 + maintenant.getMinutes();
        
        // Vérifier matin
        if (horairesJour.matin.debut && horairesJour.matin.fin) {
          const [hDebutM, mDebutM] = horairesJour.matin.debut.split(':').map(Number);
          const [hFinM, mFinM] = horairesJour.matin.fin.split(':').map(Number);
          const debutMatin = hDebutM * 60 + mDebutM;
          const finMatin = hFinM * 60 + mFinM;

          if (heureActuelle >= debutMatin && heureActuelle <= finMatin) {
            statutOuverture = 'ouvert';
            messageStatut = `Ouvert jusqu'à ${horairesJour.matin.fin}`;
          }
        }

        // Vérifier après-midi
        if (horairesJour.apresmidi.debut && horairesJour.apresmidi.fin) {
          const [hDebutA, mDebutA] = horairesJour.apresmidi.debut.split(':').map(Number);
          const [hFinA, mFinA] = horairesJour.apresmidi.fin.split(':').map(Number);
          const debutAM = hDebutA * 60 + mDebutA;
          const finAM = hFinA * 60 + mFinA;

          if (heureActuelle >= debutAM && heureActuelle <= finAM) {
            statutOuverture = 'ouvert';
            messageStatut = `Ouvert jusqu'à ${horairesJour.apresmidi.fin}`;
          } else if (statutOuverture === 'ferme' && heureActuelle < debutAM) {
            statutOuverture = 'pause';
            messageStatut = `Réouverture à ${horairesJour.apresmidi.debut}`;
          }
        }
      }

      ctx.body = {
        statut: statutOuverture,
        message: messageStatut,
        horaires: horairesJour,
        jour: jourSemaine,
        fermetureExceptionnelle: fermetures.length > 0
      };

    } catch (error) {
      ctx.throw(500, 'Erreur lors de la récupération du statut');
    }
  }
}));

// Fonction utilitaire pour générer les créneaux d'une période
function genererCreneauxPeriode(debut: Date, fin: Date, intervalle: number, maintenant: Date, delaiMinimum: number, delaiPreparation: number) {
  const creneaux = [];
  const current = new Date(debut);
  
  while (current < fin) {
    // Vérifier que le créneau est dans le futur avec délai minimum
    const tempsRestant = current.getTime() - maintenant.getTime();
    const minutesRestantes = tempsRestant / (1000 * 60);
    
    if (minutesRestantes >= (delaiMinimum + delaiPreparation)) {
      creneaux.push({
        heure: current.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        dateHeure: current.toISOString(),
        minutesRestantes: Math.floor(minutesRestantes)
      });
    }
    
    current.setMinutes(current.getMinutes() + intervalle);
  }
  
  return creneaux;
}
