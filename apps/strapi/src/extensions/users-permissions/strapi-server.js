// Extension du contrôleur auth pour gérer l'inscription personnalisée
module.exports = (plugin) => {
  // Override du contrôleur register
  plugin.controllers.auth.register = async (ctx) => {
    const { email, password, nom, prenom, telephone } = ctx.request.body;

    try {
      // Validation des champs requis
      if (!email || !password || !nom || !prenom || !telephone) {
        return ctx.badRequest('Tous les champs sont requis');
      }

      // Créer l'utilisateur users-permissions
      const newUser = await strapi.plugins['users-permissions'].services.user.add({
        email,
        password,
        username: email,
        confirmed: true,
        role: 1 // Role "Authenticated" par défaut
      });

      // Créer le profil utilisateur étendu
      const utilisateur = await strapi.entityService.create('api::utilisateur.utilisateur', {
        data: {
          email,
          nom,
          prenom,
          telephone,
          role: 'CLIENT',
          statut: 'ACTIF',
          users_permissions_user: newUser.id,
          preferencesNotification: {
            email: true,
            sms: false,
            push: false,
            commande: true,
            promotions: false,
            nouveautes: false
          },
          adressesSauvegardees: []
        }
      });

      // Générer le JWT
      const jwt = strapi.plugins['users-permissions'].services.jwt.issue({
        id: newUser.id,
      });

      // Retourner les données utilisateur
      ctx.body = {
        jwt,
        user: {
          id: newUser.id,
          email: newUser.email,
          confirmed: newUser.confirmed,
          blocked: newUser.blocked,
          role: newUser.role,
          profile: utilisateur
        }
      };
    } catch (error) {
      if (error.details?.errors?.[0]?.path?.includes('email')) {
        return ctx.badRequest('Cet email est déjà utilisé');
      }
      return ctx.badRequest('Erreur lors de l\'inscription');
    }
  };

  // Override du contrôleur login pour inclure le profil
  plugin.controllers.auth.callback = async (ctx) => {
    const { email, password } = ctx.request.body;

    try {
      // Authentifier l'utilisateur
      const user = await strapi.plugins['users-permissions'].services.user.validatePassword(email, password);
      
      if (!user) {
        return ctx.badRequest('Email ou mot de passe incorrect');
      }

      if (user.blocked) {
        return ctx.badRequest('Compte bloqué');
      }

      // Récupérer le profil étendu
      const userWithProfile = await strapi.entityService.findOne('plugin::users-permissions.user', user.id, {
        populate: ['utilisateur']
      });

      // Générer le JWT
      const jwt = strapi.plugins['users-permissions'].services.jwt.issue({
        id: user.id,
      });

      ctx.body = {
        jwt,
        user: {
          id: user.id,
          email: user.email,
          confirmed: user.confirmed,
          blocked: user.blocked,
          role: user.role,
          profile: userWithProfile?.utilisateur
        }
      };
    } catch (error) {
      return ctx.badRequest('Erreur lors de la connexion');
    }
  };

  return plugin;
};
