'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@workspace/ui/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Shield, 
  UserCheck, 
  UserX,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  RefreshCw
} from 'lucide-react';
import { 
  Utilisateur, 
  RoleUtilisateur, 
  StatutUtilisateur 
} from '@/lib/auth-types';
import { formatDate } from '@/lib/format-utils';
import { ErreurReseau } from '../ui/ErreurReseau';
import { boulangerieAPI } from '@/lib/boulangerie-api';

// Données de test pour les utilisateurs (supprimé)

const getRoleLabel = (role: RoleUtilisateur): string => {
  switch (role) {
    case RoleUtilisateur.ADMIN:
      return 'Administrateur';
    case RoleUtilisateur.EMPLOYE:
      return 'Employé';
    case RoleUtilisateur.CLIENT:
      return 'Client';
    default:
      return role;
  }
};

const getStatutLabel = (statut: StatutUtilisateur): string => {
  switch (statut) {
    case StatutUtilisateur.ACTIF:
      return 'Actif';
    case StatutUtilisateur.INACTIF:
      return 'Inactif';
    case StatutUtilisateur.SUSPENDU:
      return 'Suspendu';
    default:
      return statut;
  }
};

const getRoleIcon = (role: RoleUtilisateur) => {
  switch (role) {
    case RoleUtilisateur.ADMIN:
      return Shield;
    case RoleUtilisateur.EMPLOYE:
      return UserCheck;
    case RoleUtilisateur.CLIENT:
      return User;
    default:
      return User;
  }
};

const getStatutVariant = (statut: StatutUtilisateur) => {
  switch (statut) {
    case StatutUtilisateur.ACTIF:
      return 'success';
    case StatutUtilisateur.INACTIF:
      return 'secondary';
    case StatutUtilisateur.SUSPENDU:
      return 'destructive';
    default:
      return 'secondary';
  }
};

const getRoleVariant = (role: RoleUtilisateur) => {
  switch (role) {
    case RoleUtilisateur.ADMIN:
      return 'destructive';
    case RoleUtilisateur.EMPLOYE:
      return 'warning';
    case RoleUtilisateur.CLIENT:
      return 'default';
    default:
      return 'default';
  }
};

const getVariantClass = (variant: string) => {
  switch (variant) {
    case 'destructive':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'warning':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'success':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'secondary':
      return 'bg-gray-100 text-gray-800 border-gray-200';
    default:
      return 'bg-blue-100 text-blue-800 border-blue-200';
  }
};

export default function GestionUtilisateurs() {
  const [utilisateurs, setUtilisateurs] = useState<Utilisateur[]>([]);
  const [utilisateursFiltered, setUtilisateursFiltered] = useState<Utilisateur[]>([]);
  const [utilisateurSelectionne, setUtilisateurSelectionne] = useState<Utilisateur | null>(null);
  const [recherche, setRecherche] = useState<string>('');
  const [filtrageRole, setFiltrageRole] = useState<string>('tous');
  const [filtrageStatut, setFiltrageStatut] = useState<string>('tous');
  const [chargement, setChargement] = useState<boolean>(false);
  const [afficherDetails, setAfficherDetails] = useState<boolean>(false);
  const [erreurReseau, setErreurReseau] = useState<string | null>(null);

  // Charger les utilisateurs
  useEffect(() => {
    chargerUtilisateurs();
  }, []);

  // Filtrage et recherche
  useEffect(() => {
    let utilisateursFiltres = [...utilisateurs];

    // Filtrage par rôle
    if (filtrageRole !== 'tous') {
      utilisateursFiltres = utilisateursFiltres.filter(
        utilisateur => utilisateur.role === filtrageRole
      );
    }

    // Filtrage par statut
    if (filtrageStatut !== 'tous') {
      utilisateursFiltres = utilisateursFiltres.filter(
        utilisateur => utilisateur.statut === filtrageStatut
      );
    }

    // Recherche par nom, prénom, email
    if (recherche.trim()) {
      const termesRecherche = recherche.toLowerCase().trim();
      utilisateursFiltres = utilisateursFiltres.filter(utilisateur =>
        utilisateur.nom.toLowerCase().includes(termesRecherche) ||
        utilisateur.prenom.toLowerCase().includes(termesRecherche) ||
        utilisateur.email.toLowerCase().includes(termesRecherche)
      );
    }

    // Tri par date de création (plus récent d'abord)
    utilisateursFiltres.sort((a, b) => 
      new Date(b.dateCreation).getTime() - new Date(a.dateCreation).getTime()
    );

    setUtilisateursFiltered(utilisateursFiltres);
  }, [utilisateurs, filtrageRole, filtrageStatut, recherche]);

  const chargerUtilisateurs = async () => {
    setChargement(true);
    setErreurReseau(null);
    try {
      // Appel API réel KISS
      const data = await boulangerieAPI.utilisateurs.getAll();
      // On suppose que l'API retourne un tableau d'utilisateurs
      setUtilisateurs(Array.isArray(data) ? data : []);
      setChargement(false);
    } catch (error: any) {
      setErreurReseau(error.message || 'Erreur réseau : impossible de charger les utilisateurs.');
      setChargement(false);
    }
  };

  const changerStatutUtilisateur = (utilisateurId: string, nouveauStatut: StatutUtilisateur) => {
    try {
      setUtilisateurs(prev => 
        prev.map(u => 
          u.id === utilisateurId 
            ? { ...u, statut: nouveauStatut, dateMiseAJour: new Date() }
            : u
        )
      );
      
      if (utilisateurSelectionne?.id === utilisateurId) {
        setUtilisateurSelectionne(prev => 
          prev ? { ...prev, statut: nouveauStatut, dateMiseAJour: new Date() } : null
        );
      }
    } catch (error) {
      console.error('Erreur lors du changement de statut:', error);
    }
  };

  const changerRoleUtilisateur = (utilisateurId: string, nouveauRole: RoleUtilisateur) => {
    try {
      setUtilisateurs(prev => 
        prev.map(u => 
          u.id === utilisateurId 
            ? { ...u, role: nouveauRole, dateMiseAJour: new Date() }
            : u
        )
      );
      
      if (utilisateurSelectionne?.id === utilisateurId) {
        setUtilisateurSelectionne(prev => 
          prev ? { ...prev, role: nouveauRole, dateMiseAJour: new Date() } : null
        );
      }
    } catch (error) {
      console.error('Erreur lors du changement de rôle:', error);
    }
  };

  const voirDetailsUtilisateur = (utilisateur: Utilisateur) => {
    setUtilisateurSelectionne(utilisateur);
    setAfficherDetails(true);
  };

  // Statistiques
  const stats = {
    total: utilisateurs.length,
    clients: utilisateurs.filter(u => u.role === RoleUtilisateur.CLIENT).length,
    employes: utilisateurs.filter(u => u.role === RoleUtilisateur.EMPLOYE).length,
    admins: utilisateurs.filter(u => u.role === RoleUtilisateur.ADMIN).length,
    actifs: utilisateurs.filter(u => u.statut === StatutUtilisateur.ACTIF).length,
    inactifs: utilisateurs.filter(u => u.statut !== StatutUtilisateur.ACTIF).length
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Gestion des Utilisateurs</h2>
          <p className="text-gray-600">
            Administration des comptes utilisateurs et gestion des rôles
          </p>
        </div>
        <Button onClick={chargerUtilisateurs} disabled={chargement}>
          <RefreshCw className={`h-4 w-4 mr-2 ${chargement ? 'animate-spin' : ''}`} />
          Actualiser
        </Button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-gray-600" />
              <div>
                <p className="text-sm text-gray-600">Clients</p>
                <p className="text-2xl font-bold">{stats.clients}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <UserCheck className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">Employés</p>
                <p className="text-2xl font-bold">{stats.employes}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-sm text-gray-600">Admins</p>
                <p className="text-2xl font-bold">{stats.admins}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <UserCheck className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Actifs</p>
                <p className="text-2xl font-bold">{stats.actifs}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <UserX className="h-5 w-5 text-gray-600" />
              <div>
                <p className="text-sm text-gray-600">Inactifs</p>
                <p className="text-2xl font-bold">{stats.inactifs}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres et recherche */}
      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par nom, prénom ou email..."
              value={recherche}
              onChange={(e) => setRecherche(e.target.value)}
              className="pl-9 w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <select
            value={filtrageRole}
            onChange={(e) => setFiltrageRole(e.target.value)}
            className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="tous">Tous les rôles</option>
            <option value={RoleUtilisateur.CLIENT}>Clients</option>
            <option value={RoleUtilisateur.EMPLOYE}>Employés</option>
            <option value={RoleUtilisateur.ADMIN}>Administrateurs</option>
          </select>
        </div>
        
        <div>
          <select
            value={filtrageStatut}
            onChange={(e) => setFiltrageStatut(e.target.value)}
            className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="tous">Tous les statuts</option>
            <option value={StatutUtilisateur.ACTIF}>Actifs</option>
            <option value={StatutUtilisateur.INACTIF}>Inactifs</option>
            <option value={StatutUtilisateur.SUSPENDU}>Suspendus</option>
          </select>
        </div>
      </div>

      {/* Liste des utilisateurs */}
      <div className="grid gap-4">
        {utilisateursFiltered.map((utilisateur) => {
          const RoleIcon = getRoleIcon(utilisateur.role);
          
          return (
            <Card key={utilisateur.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <RoleIcon className="h-10 w-10 text-gray-400" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-lg">
                          {utilisateur.prenom} {utilisateur.nom}
                        </h3>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getVariantClass(getRoleVariant(utilisateur.role))}`}>
                          {getRoleLabel(utilisateur.role)}
                        </span>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getVariantClass(getStatutVariant(utilisateur.statut))}`}>
                          {getStatutLabel(utilisateur.statut)}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Mail className="h-4 w-4" />
                          <span>{utilisateur.email}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Phone className="h-4 w-4" />
                          <span>{utilisateur.telephone}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Calendar className="h-4 w-4" />
                          <span>Inscrit le {formatDate(utilisateur.dateCreation)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {/* Actions rapides */}
                    {utilisateur.statut === StatutUtilisateur.ACTIF ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => changerStatutUtilisateur(utilisateur.id, StatutUtilisateur.INACTIF)}
                      >
                        Désactiver
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => changerStatutUtilisateur(utilisateur.id, StatutUtilisateur.ACTIF)}
                      >
                        Activer
                      </Button>
                    )}
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => voirDetailsUtilisateur(utilisateur)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Détails
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {utilisateursFiltered.length === 0 && !chargement && (
          <Card>
            <CardContent className="p-12 text-center">
              <User className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold mb-2">Aucun utilisateur trouvé</h3>
              <p className="text-gray-600">
                {recherche.trim() || filtrageRole !== 'tous' || filtrageStatut !== 'tous'
                  ? 'Aucun utilisateur ne correspond à vos critères de recherche.' 
                  : 'Il n\'y a actuellement aucun utilisateur.'}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Modal de détails */}
      {afficherDetails && utilisateurSelectionne && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                Détails de {utilisateurSelectionne.prenom} {utilisateurSelectionne.nom}
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAfficherDetails(false)}
              >
                ✕
              </Button>
            </div>
            
            <div className="space-y-4">
              {/* Informations personnelles */}
              <div>
                <h4 className="font-semibold mb-2">Informations personnelles</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Email:</span>
                    <p>{utilisateurSelectionne.email}</p>
                  </div>
                  <div>
                    <span className="font-medium">Téléphone:</span>
                    <p>{utilisateurSelectionne.telephone}</p>
                  </div>
                  <div>
                    <span className="font-medium">Date d'inscription:</span>
                    <p>{formatDate(utilisateurSelectionne.dateCreation)}</p>
                  </div>
                  <div>
                    <span className="font-medium">Dernière modification:</span>
                    <p>{formatDate(utilisateurSelectionne.dateMiseAJour)}</p>
                  </div>
                </div>
              </div>

              {/* Rôle et statut */}
              <div>
                <h4 className="font-semibold mb-2">Rôle et statut</h4>
                <div className="flex items-center space-x-4">
                  <div>
                    <span className="font-medium">Rôle:</span>
                    <select
                      value={utilisateurSelectionne.role}
                      onChange={(e) => changerRoleUtilisateur(utilisateurSelectionne.id, e.target.value as RoleUtilisateur)}
                      className="ml-2 p-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value={RoleUtilisateur.CLIENT}>Client</option>
                      <option value={RoleUtilisateur.EMPLOYE}>Employé</option>
                      <option value={RoleUtilisateur.ADMIN}>Administrateur</option>
                    </select>
                  </div>
                  <div>
                    <span className="font-medium">Statut:</span>
                    <select
                      value={utilisateurSelectionne.statut}
                      onChange={(e) => changerStatutUtilisateur(utilisateurSelectionne.id, e.target.value as StatutUtilisateur)}
                      className="ml-2 p-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value={StatutUtilisateur.ACTIF}>Actif</option>
                      <option value={StatutUtilisateur.INACTIF}>Inactif</option>
                      <option value={StatutUtilisateur.SUSPENDU}>Suspendu</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fallback erreur réseau KISS */}
      {erreurReseau && (
        <ErreurReseau message={erreurReseau} onRetry={chargerUtilisateurs} />
      )}
    </div>
  );
}
