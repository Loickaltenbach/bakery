'use client'

import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi, type RegisterData, type LoginData, type AuthResponse } from '@/lib/strapi-api';
import type { 
  Utilisateur, 
  PreferencesUtilisateur, 
  AdresseUtilisateur,
  InformationsConnexion
} from '@/lib/auth-types';
import { RoleUtilisateur } from '@/lib/auth-types';
import type { Commande, CommandeStrapi } from '@/lib/commande-types';

interface AuthContextType {
  // État d'authentification
  utilisateur: Utilisateur | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  // Actions d'authentification
  connexion: (formData: InformationsConnexion) => Promise<void>;
  inscription: (donnees: DonneesInscription) => Promise<void>;
  deconnexion: () => void;

  // Gestion du profil
  mettreAJourProfil: (donnees: Partial<Utilisateur>) => Promise<void>;
  
  // Historique des commandes
  historique: CommandeStrapi[];
  rafraichirHistorique: () => Promise<void>;

  // Gestion des erreurs
  erreur: string | null;
  viderErreur: () => void;

  // Gestion des permissions
  aLesPermissions: (permissions: string[]) => boolean;
  estAdmin: () => boolean;
  estEmploye: () => boolean;
}

interface DonneesInscription {
  email: string;
  password: string;
  nom: string;
  prenom: string;
  telephone: string;
  preferences?: Partial<PreferencesUtilisateur>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [utilisateur, setUtilisateur] = useState<Utilisateur | null>(null);
  const [historique, setHistorique] = useState<CommandeStrapi[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [erreur, setErreur] = useState<string | null>(null);

  // Fonction pour mapper les données Strapi vers notre type Utilisateur
  const mapStrapiUser = (strapiData: any): Utilisateur | null => {
    if (!strapiData?.user || !strapiData?.profile) {
      return null;
    }

    const { user, profile } = strapiData;
    
    return {
      id: profile.id?.toString() || user.id?.toString(),
      email: user.email,
      nom: profile.nom || '',
      prenom: profile.prenom || '',
      telephone: profile.telephone || '',
      dateCreation: new Date(profile.createdAt || Date.now()),
      dateMiseAJour: new Date(profile.updatedAt || Date.now()),
      role: profile.role as RoleUtilisateur || RoleUtilisateur.CLIENT,
      statut: profile.statut || 'ACTIF',
      preferences: profile.preferencesNotification ? {
        allergies: profile.allergies || [],
        regimeAlimentaire: profile.regimeAlimentaire,
        preferencesNotification: profile.preferencesNotification,
        languePreferee: profile.languePreferee || 'fr'
      } : undefined,
      adressesSauvegardees: profile.adressesSauvegardees || []
    };
  };

  // Vérifier l'authentification au chargement
  useEffect(() => {
    const verifierAuthentification = async () => {
      try {
        if (authApi.isAuthenticated()) {
          const profil = await authApi.getProfile();
          const utilisateurMapped = mapStrapiUser(profil);
          setUtilisateur(utilisateurMapped);
        }
      } catch (error) {
        console.error('Erreur lors de la vérification de l\'authentification:', error);
        // Token invalide, on déconnecte
        authApi.logout();
      } finally {
        setIsLoading(false);
      }
    };

    verifierAuthentification();
  }, []);

  // Connexion
  const connexion = async (formData: InformationsConnexion) => {
    try {
      setIsLoading(true);
      setErreur(null);

      const loginData: LoginData = {
        identifier: formData.email,
        password: formData.password
      };

      const response = await authApi.login(loginData);
      
      // Si pas de profil étendu, on récupère les données complètes
      let profilComplet = response;
      if (!response.user.profile) {
        profilComplet = await authApi.getProfile();
      }

      const utilisateurMapped = mapStrapiUser(profilComplet);
      setUtilisateur(utilisateurMapped);

      // Charger l'historique
      await rafraichirHistorique();
    } catch (error: any) {
      setErreur(error.message || 'Erreur lors de la connexion');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Inscription
  const inscription = async (donnees: DonneesInscription) => {
    try {
      setIsLoading(true);
      setErreur(null);

      const registerData: RegisterData = {
        email: donnees.email,
        password: donnees.password,
        nom: donnees.nom,
        prenom: donnees.prenom,
        telephone: donnees.telephone
      };

      const response = await authApi.register(registerData);
      
      // Récupérer le profil complet
      const profilComplet = await authApi.getProfile();
      const utilisateurMapped = mapStrapiUser(profilComplet);
      setUtilisateur(utilisateurMapped);

    } catch (error: any) {
      setErreur(error.message || 'Erreur lors de l\'inscription');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Déconnexion
  const deconnexion = () => {
    authApi.logout();
    setUtilisateur(null);
    setHistorique([]);
    setErreur(null);
  };

  // Mettre à jour le profil
  const mettreAJourProfil = async (donnees: Partial<Utilisateur>) => {
    try {
      setErreur(null);
      
      await authApi.updateProfile(donnees);
      
      // Recharger le profil
      const profilComplet = await authApi.getProfile();
      const utilisateurMapped = mapStrapiUser(profilComplet);
      setUtilisateur(utilisateurMapped);

    } catch (error: any) {
      setErreur(error.message || 'Erreur lors de la mise à jour du profil');
      throw error;
    }
  };

  // Rafraîchir l'historique des commandes
  const rafraichirHistorique = async () => {
    try {
      if (utilisateur || authApi.isAuthenticated()) {
        const commandesStrapi = await authApi.getHistorique();
        
        // Mapper les commandes Strapi vers notre type
        const commandesMapped: CommandeStrapi[] = commandesStrapi.map((cmd: any) => ({
          id: cmd.id?.toString(),
          numero: cmd.numero,
          statut: cmd.statut,
          modeRetrait: cmd.modeRetrait || 'RETRAIT',
          produits: cmd.produits || [],
          prixTotal: parseFloat(cmd.prixTotal) || 0,
          informationsClient: cmd.informationsClient || {},
          creneauRetrait: cmd.creneauRetrait || {},
          commentaires: cmd.commentaires,
          dateCreation: new Date(cmd.dateCreation),
          dateMiseAJour: cmd.dateMiseAJour ? new Date(cmd.dateMiseAJour) : undefined,
          dateRetiree: cmd.dateRetiree ? new Date(cmd.dateRetiree) : undefined,
          paiement: {
            statut: cmd.paiementStatut || 'EN_ATTENTE',
            methode: cmd.paiementMethode,
            reference: cmd.paiementReference
          }
        }));

        setHistorique(commandesMapped);
      }
    } catch (error) {
      console.error('Erreur lors du rafraîchissement de l\'historique:', error);
    }
  };

  // Vider l'erreur
  const viderErreur = () => {
    setErreur(null);
  };

  // Vérifier les permissions
  const aLesPermissions = (permissions: string[]): boolean => {
    if (!utilisateur) return false;
    
    const rolePermissions = {
      [RoleUtilisateur.CLIENT]: ['commande:create', 'profil:read', 'profil:update'],
      [RoleUtilisateur.EMPLOYE]: [
        'commande:create', 'commande:read', 'commande:update',
        'profil:read', 'profil:update',
        'admin:commandes', 'admin:stocks'
      ],
      [RoleUtilisateur.ADMIN]: [
        'commande:create', 'commande:read', 'commande:update', 'commande:delete',
        'profil:read', 'profil:update', 'profil:delete',
        'admin:commandes', 'admin:stocks', 'admin:utilisateurs', 'admin:dashboard'
      ]
    };

    const userPermissions = rolePermissions[utilisateur.role] || [];
    return permissions.every(permission => userPermissions.includes(permission));
  };

  // Vérifier si l'utilisateur est admin
  const estAdmin = (): boolean => {
    return utilisateur?.role === RoleUtilisateur.ADMIN;
  };

  // Vérifier si l'utilisateur est employé ou admin
  const estEmploye = (): boolean => {
    return utilisateur?.role === RoleUtilisateur.EMPLOYE || estAdmin();
  };

  const isAuthenticated = !!utilisateur && authApi.isAuthenticated();

  const valeur: AuthContextType = {
    // État
    utilisateur,
    isLoading,
    isAuthenticated,
    
    // Actions d'authentification
    connexion,
    inscription,
    deconnexion,
    
    // Gestion du profil
    mettreAJourProfil,
    
    // Historique
    historique,
    rafraichirHistorique,
    
    // Erreurs
    erreur,
    viderErreur,
    
    // Permissions
    aLesPermissions,
    estAdmin,
    estEmploye
  };

  return (
    <AuthContext.Provider value={valeur}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Hook pour les permissions
export function usePermissions() {
  const { utilisateur, isAuthenticated } = useAuth();
  
  return {
    peutVoirAdmin: () => {
      if (!isAuthenticated || !utilisateur) return false;
      return utilisateur.role === RoleUtilisateur.ADMIN || 
             utilisateur.role === RoleUtilisateur.EMPLOYE;
    },
    
    estAdmin: () => {
      if (!isAuthenticated || !utilisateur) return false;
      return utilisateur.role === RoleUtilisateur.ADMIN;
    },
    
    estEmploye: () => {
      if (!isAuthenticated || !utilisateur) return false;
      return utilisateur.role === RoleUtilisateur.EMPLOYE;
    },
    
    estClient: () => {
      if (!isAuthenticated || !utilisateur) return false;
      return utilisateur.role === RoleUtilisateur.CLIENT;
    },
    
    peutGererCommandes: () => {
      if (!isAuthenticated || !utilisateur) return false;
      return utilisateur.role === RoleUtilisateur.ADMIN || 
             utilisateur.role === RoleUtilisateur.EMPLOYE;
    },
    
    peutGererStocks: () => {
      if (!isAuthenticated || !utilisateur) return false;
      return utilisateur.role === RoleUtilisateur.ADMIN || 
             utilisateur.role === RoleUtilisateur.EMPLOYE;
    },
    
    peutGererUtilisateurs: () => {
      if (!isAuthenticated || !utilisateur) return false;
      return utilisateur.role === RoleUtilisateur.ADMIN;
    }
  };
}

// Hook pour les actions rapides d'authentification
export function useAuthActions() {
  const { connexion, inscription, deconnexion, viderErreur } = useAuth();
  
  return {
    seConnecter: connexion,
    sInscrire: inscription,
    seDeconnecter: deconnexion,
    effacerErreur: viderErreur
  };
}
