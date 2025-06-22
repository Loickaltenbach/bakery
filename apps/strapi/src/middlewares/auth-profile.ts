/**
 * Custom authentication middleware pour créer automatiquement 
 * un profil utilisateur étendu lors de l'inscription
 */

export default () => {
  return async (ctx: any, next: any) => {
    await next();
    
    // Si c'est une inscription réussie via users-permissions
    if (ctx.request.url === '/api/auth/local/register' && ctx.request.method === 'POST' && ctx.response.status === 200) {
      try {
        const responseBody = ctx.response.body;
        
        if (responseBody?.user?.id) {
          const { nom, prenom, telephone } = ctx.request.body;
          
          // Créer le profil utilisateur étendu
          await strapi.entityService.create('api::utilisateur.utilisateur', {
            data: {
              email: responseBody.user.email,
              nom: nom || '',
              prenom: prenom || '',
              telephone: telephone || '',
              role: 'CLIENT',
              statut: 'ACTIF',
              users_permissions_user: responseBody.user.id,
              allergies: [],
              preferencesNotification: {
                email: true,
                sms: false,
                push: false,
                commande: true,
                promotions: false,
                nouveautes: false
              },
              languePreferee: 'fr',
              adressesSauvegardees: []
            }
          });
        }
      } catch (error) {
        console.error('Erreur lors de la création du profil utilisateur étendu:', error);
        // On continue sans faire échouer la requête
      }
    }
  };
};
