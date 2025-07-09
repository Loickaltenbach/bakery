import { 
  Utilisateur, 
  SessionUtilisateur, 
  InformationsConnexion, 
  InformationsInscription,
  RoleUtilisateur,
  StatutUtilisateur,
  HistoriqueCommande,
  StatistiquesUtilisateur,
  CommandeUtilisateur
} from './auth-types';
import { validerEmail, validerPassword, validerNomPrenom, validerTelephone } from './validation-utils';

// Configuration par défaut
const SESSION_STORAGE_KEY = 'boulangerie_session';
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 heures

// Simulation d'une base de données en mémoire (à remplacer par une vraie DB)
let utilisateursDB: Utilisateur[] = [
  // Utilisateur admin par défaut
  {
    id: 'admin-1',
    email: 'admin@boulangerie-alsacienne.fr',
    password: 'admin123', // En production, utilisez un hash
    nom: 'Müller',
    prenom: 'Hans',
    telephone: '+33 3 88 12 34 56',
    dateCreation: new Date('2024-01-01'),
    dateMiseAJour: new Date(),
    role: RoleUtilisateur.ADMIN,
    statut: StatutUtilisateur.ACTIF,
    adressesSauvegardees: []
  },
  // Utilisateur employé par défaut
  {
    id: 'employe-1',
    email: 'marie@boulangerie-alsacienne.fr',
    password: 'employe123',
    nom: 'Schmidt',
    prenom: 'Marie',
    telephone: '+33 3 88 12 34 57',
    dateCreation: new Date('2024-01-15'),
    dateMiseAJour: new Date(),
    role: RoleUtilisateur.EMPLOYE,
    statut: StatutUtilisateur.ACTIF,
    adressesSauvegardees: []
  }
];

let sessionsActives: Map<string, SessionUtilisateur> = new Map();

// Fonctions d'authentification
export function genererToken(): string {
  return Math.random().toString(36).substr(2) + Date.now().toString(36);
}

export function hashpassword(password: string): string {
  // Simulation - en production, utilisez bcrypt ou similar
  return btoa(password + 'salt_boulangerie');
}

export function verifierpassword(password: string, hash: string): boolean {
  return hashpassword(password) === hash;
}

// Validation des données
export function validerInformationsInscription(infos: InformationsInscription): { valide: boolean; erreurs: string[] } {
  const erreurs: string[] = [];

  // Validation email
  const validationEmail = validerEmail(infos.email);
  if (!validationEmail.valide) {
    erreurs.push(validationEmail.erreur!);
  }

  // Vérifier si l'email existe déjà
  if (utilisateursDB.find(u => u.email === infos.email)) {
    erreurs.push('Cet email est déjà utilisé');
  }

  // Validation mot de passe
  const validationMdp = validerPassword(infos.password);
  if (!validationMdp.valide) {
    erreurs.push(...validationMdp.erreurs);
  }

  // Confirmation mot de passe
  if (infos.password !== infos.confirmationpassword) {
    erreurs.push('Les mots de passe ne correspondent pas');
  }

  // Champs obligatoires
  const validationNomPrenom = validerNomPrenom(infos.nom, infos.prenom);
  if (!validationNomPrenom.valide) {
    erreurs.push(...validationNomPrenom.erreurs);
  }
  const validationTel = validerTelephone(infos.telephone);
  if (!validationTel.valide) {
    erreurs.push(validationTel.erreur!);
  }
  if (!infos.accepteConditions) erreurs.push('Vous devez accepter les conditions d\'utilisation');

  return { valide: erreurs.length === 0, erreurs };
}

// Gestion des sessions
export function creerSession(utilisateur: Utilisateur): SessionUtilisateur {
  const token = genererToken();
  const dateExpiration = new Date(Date.now() + SESSION_DURATION);
  
  const session: SessionUtilisateur = {
    utilisateur: { ...utilisateur, password: undefined }, // Ne pas exposer le mot de passe
    token,
    dateExpiration
  };
  
  sessionsActives.set(token, session);
  
  // Sauvegarder en localStorage
  if (typeof window !== 'undefined') {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
  }
  
  return session;
}

export function obtenirSessionActuelle(): SessionUtilisateur | null {
  if (typeof window === 'undefined') return null;
  
  const sessionData = localStorage.getItem(SESSION_STORAGE_KEY);
  if (!sessionData) return null;
  
  try {
    const session = JSON.parse(sessionData) as SessionUtilisateur;
    session.dateExpiration = new Date(session.dateExpiration);
    
    // Vérifier si la session n'est pas expirée
    if (session.dateExpiration < new Date()) {
      supprimerSession();
      return null;
    }
    
    return session;
  } catch {
    return null;
  }
}

export function supprimerSession(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(SESSION_STORAGE_KEY);
  }
}

// Fonctions principales d'authentification
export async function seConnecter(infos: InformationsConnexion): Promise<SessionUtilisateur> {
  const utilisateur = utilisateursDB.find(u => u.email === infos.email);
  
  if (!utilisateur) {
    throw new Error('Email ou mot de passe incorrect');
  }
  
  if (utilisateur.statut !== StatutUtilisateur.ACTIF) {
    throw new Error('Compte désactivé. Contactez l\'administration.');
  }
  
  // En production, vérifier le hash du mot de passe
  if (utilisateur.password !== infos.password) {
    throw new Error('Email ou mot de passe incorrect');
  }
  
  return creerSession(utilisateur);
}

export async function sInscrire(infos: InformationsInscription): Promise<SessionUtilisateur> {
  const validation = validerInformationsInscription(infos);
  if (!validation.valide) {
    throw new Error(validation.erreurs.join(', '));
  }
  
  const nouvelUtilisateur: Utilisateur = {
    id: `user-${Date.now()}`,
    email: infos.email,
    password: infos.password, // En production, hasher le mot de passe
    nom: infos.nom,
    prenom: infos.prenom,
    telephone: infos.telephone,
    dateCreation: new Date(),
    dateMiseAJour: new Date(),
    role: RoleUtilisateur.CLIENT,
    statut: StatutUtilisateur.ACTIF,
    adressesSauvegardees: [],
    preferences: {
      allergies: [],
      preferencesNotification: {
        email: infos.accepteNewsletter || false,
        sms: false,
        commandeReady: true,
        promotions: infos.accepteNewsletter || false,
        nouveauxProduits: infos.accepteNewsletter || false
      },
      languePreferee: 'fr'
    }
  };
  
  utilisateursDB.push(nouvelUtilisateur);
  
  return creerSession(nouvelUtilisateur);
}

export function seDeconnecter(): void {
  supprimerSession();
}

// Gestion des utilisateurs
export function obtenirUtilisateur(id: string): Utilisateur | null {
  return utilisateursDB.find(u => u.id === id) || null;
}

export function mettreAJourUtilisateur(id: string, modifications: Partial<Omit<Utilisateur, 'id' | 'dateCreation'>>): Utilisateur {
  const index = utilisateursDB.findIndex(u => u.id === id);
  if (index === -1) {
    throw new Error('Utilisateur non trouvé');
  }
  
  const utilisateurExistant = utilisateursDB[index]!;
  const utilisateurMisAJour = {
    ...utilisateurExistant,
    ...modifications,
    id: utilisateurExistant.id,
    dateCreation: utilisateurExistant.dateCreation,
    dateMiseAJour: new Date()
  } as Utilisateur;
  
  utilisateursDB[index] = utilisateurMisAJour;
  
  return utilisateurMisAJour;;
}

// Historique des commandes (simulation)
export function obtenirHistoriqueCommandes(utilisateurId: string): HistoriqueCommande {
  // Simulation - en production, requête à la base de données
  const commandes: CommandeUtilisateur[] = []; // Récupérer les commandes de l'utilisateur
  
  const statistiques: StatistiquesUtilisateur = {
    nombreCommandesTotales: commandes.length,
    montantTotalDepense: commandes.reduce((total, cmd) => total + cmd.total, 0),
    commandeMoyenneParMois: commandes.length / 12, // Approximation
    derniere_commande: commandes.length > 0 ? new Date(commandes[0]!.dateCreation) : undefined,
    premiereCommande: commandes.length > 0 ? new Date(commandes[commandes.length - 1]!.dateCreation) : undefined
  };
  
  return { commandes, statistiques };
}

// Utilitaires pour les rôles
export function estAdmin(utilisateur: Utilisateur): boolean {
  return utilisateur.role === RoleUtilisateur.ADMIN;
}

export function estEmploye(utilisateur: Utilisateur): boolean {
  return utilisateur.role === RoleUtilisateur.EMPLOYE || estAdmin(utilisateur);
}

export function estClient(utilisateur: Utilisateur): boolean {
  return utilisateur.role === RoleUtilisateur.CLIENT;
}

// Export des données pour les tests
export function getUtilisateursDB() {
  return [...utilisateursDB];
}

export function resetUtilisateursDB() {
  utilisateursDB = utilisateursDB.filter(u => u.role === RoleUtilisateur.ADMIN || u.role === RoleUtilisateur.EMPLOYE);
}
