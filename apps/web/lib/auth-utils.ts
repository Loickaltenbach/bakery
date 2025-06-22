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

// Configuration par défaut
const SESSION_STORAGE_KEY = 'boulangerie_session';
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 heures

// Simulation d'une base de données en mémoire (à remplacer par une vraie DB)
let utilisateursDB: Utilisateur[] = [
  // Utilisateur admin par défaut
  {
    id: 'admin-1',
    email: 'admin@boulangerie-alsacienne.fr',
    motDePasse: 'admin123', // En production, utilisez un hash
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
    motDePasse: 'employe123',
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

export function hashMotDePasse(motDePasse: string): string {
  // Simulation - en production, utilisez bcrypt ou similar
  return btoa(motDePasse + 'salt_boulangerie');
}

export function verifierMotDePasse(motDePasse: string, hash: string): boolean {
  return hashMotDePasse(motDePasse) === hash;
}

// Validation des données
export function validerEmail(email: string): { valide: boolean; erreur?: string } {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valide: false, erreur: 'Format d\'email invalide' };
  }
  return { valide: true };
}

export function validerMotDePasse(motDePasse: string): { valide: boolean; erreurs: string[] } {
  const erreurs: string[] = [];
  
  if (motDePasse.length < 6) {
    erreurs.push('Le mot de passe doit contenir au moins 6 caractères');
  }
  if (!/[A-Z]/.test(motDePasse)) {
    erreurs.push('Le mot de passe doit contenir au moins une majuscule');
  }
  if (!/[0-9]/.test(motDePasse)) {
    erreurs.push('Le mot de passe doit contenir au moins un chiffre');
  }
  
  return { valide: erreurs.length === 0, erreurs };
}

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
  const validationMdp = validerMotDePasse(infos.motDePasse);
  if (!validationMdp.valide) {
    erreurs.push(...validationMdp.erreurs);
  }
  
  // Confirmation mot de passe
  if (infos.motDePasse !== infos.confirmationMotDePasse) {
    erreurs.push('Les mots de passe ne correspondent pas');
  }
  
  // Champs obligatoires
  if (!infos.nom.trim()) erreurs.push('Le nom est obligatoire');
  if (!infos.prenom.trim()) erreurs.push('Le prénom est obligatoire');
  if (!infos.telephone.trim()) erreurs.push('Le téléphone est obligatoire');
  if (!infos.accepteConditions) erreurs.push('Vous devez accepter les conditions d\'utilisation');
  
  return { valide: erreurs.length === 0, erreurs };
}

// Gestion des sessions
export function creerSession(utilisateur: Utilisateur): SessionUtilisateur {
  const token = genererToken();
  const dateExpiration = new Date(Date.now() + SESSION_DURATION);
  
  const session: SessionUtilisateur = {
    utilisateur: { ...utilisateur, motDePasse: undefined }, // Ne pas exposer le mot de passe
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
  if (utilisateur.motDePasse !== infos.motDePasse) {
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
    motDePasse: infos.motDePasse, // En production, hasher le mot de passe
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
