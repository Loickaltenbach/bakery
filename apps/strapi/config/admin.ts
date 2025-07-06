export default ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET'),
  },
  apiToken: {
    salt: env('API_TOKEN_SALT'),
  },
  transfer: {
    token: {
      salt: env('TRANSFER_TOKEN_SALT'),
    },
  },
  secrets: {
    encryptionKey: env('ENCRYPTION_KEY'),
  },
  flags: {
    nps: env.bool('FLAG_NPS', true),
    promoteEE: env.bool('FLAG_PROMOTE_EE', true),
  },
  // Configuration du logo personnalisé
  logo: {
    url: "/uploads/logo-fabrice.png",
  },
  // Configuration du favicon
  favicon: "/favicon.png",
  // Titre de l'administration
  title: "Boulangerie Fabrice - Administration",
});
