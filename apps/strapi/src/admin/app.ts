export default {
  config: {
    locales: ['fr', 'en'],
    translations: {
      fr: {
        'app.components.LeftMenu.navbrand.title': 'Boulangerie Admin',
        'app.components.LeftMenu.navbrand.workplace': 'Administration',
        'Auth.form.welcome.title': 'Bienvenue dans l\'administration',
        'Auth.form.welcome.subtitle': 'Connectez-vous à votre compte',
      },
    },
    auth: {
      logo: '/favicon.png',
    },
    menu: {
      logo: '/favicon.png',
    },
    head: {
      favicon: '/favicon.png',
    },
    theme: {
      colors: {
        primary100: '#f3f0e6',
        primary200: '#e6d9b3',
        primary500: '#8B4513',
        primary600: '#7a3e11',
        primary700: '#68360f',
        danger700: '#b72b1a',
      },
    },
  },
  bootstrap() {},
};
