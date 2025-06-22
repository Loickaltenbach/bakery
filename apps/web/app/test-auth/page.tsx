'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ModalAuth } from '@/components/auth/ModalAuth';
import { ProfilUtilisateur } from '@/components/auth/ProfilUtilisateur';
import { HistoriqueCommandes } from '@/components/auth/HistoriqueCommandes';
import { RoleUtilisateur } from '@/lib/auth-types';
import { Button } from '@workspace/ui/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { Badge } from '@workspace/ui/components/badge';
import { 
  User, 
  Shield, 
  UserCheck, 
  LogIn, 
  LogOut, 
  Settings,
  History,
  ShoppingCart
} from 'lucide-react';

type SectionTest = 'overview' | 'profile' | 'history';

export default function TestAuthPage() {
  const { 
    utilisateurActuel, 
    estConnecte, 
    deconnexion
  } = useAuth();
  
  const [afficherModal, setAfficherModal] = useState(false);
  const [sectionActive, setSectionActive] = useState<SectionTest>('overview');

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

  const getRoleLabel = (role: RoleUtilisateur) => {
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

  const getRoleVariant = (role: RoleUtilisateur) => {
    switch (role) {
      case RoleUtilisateur.ADMIN:
        return 'destructive';
      case RoleUtilisateur.EMPLOYE:
        return 'secondary';
      case RoleUtilisateur.CLIENT:
        return 'default';
      default:
        return 'default';
    }
  };

  const simulerChangementRole = (nouveauRole: RoleUtilisateur) => {
    // Pour le test, nous simulerons un changement de rôle via les utilitaires d'authentification
    // En production, ceci serait fait via une API sécurisée
    console.log(`Simulation du changement de rôle vers: ${nouveauRole}`);
    alert(`Changement de rôle simulé vers: ${nouveauRole}. Rechargez la page pour tester.`);
  };

  const renderContenu = () => {
    if (!estConnecte || !utilisateurActuel) {
      return (
        <Card>
          <CardContent className="p-12 text-center">
            <User className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold mb-2">Non connecté</h3>
            <p className="text-gray-600 mb-4">
              Vous devez être connecté pour accéder à cette section.
            </p>
            <Button onClick={() => setAfficherModal(true)}>
              <LogIn className="h-4 w-4 mr-2" />
              Se connecter
            </Button>
          </CardContent>
        </Card>
      );
    }

    switch (sectionActive) {
      case 'profile':
        return <ProfilUtilisateur />;
      case 'history':
        return <HistoriqueCommandes />;
      default:
        return (
          <div className="space-y-6">
            {/* Informations utilisateur */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Informations utilisateur</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Nom complet</label>
                    <p className="text-lg">{utilisateurActuel.prenom} {utilisateurActuel.nom}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Email</label>
                    <p className="text-lg">{utilisateurActuel.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Téléphone</label>
                    <p className="text-lg">{utilisateurActuel.telephone}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Rôle</label>
                    <div className="flex items-center space-x-2">
                      <Badge variant={getRoleVariant(utilisateurActuel.role)}>
                        {(() => {
                          const Icon = getRoleIcon(utilisateurActuel.role);
                          return (
                            <span className="flex items-center space-x-1">
                              <Icon className="h-3 w-3" />
                              <span>{getRoleLabel(utilisateurActuel.role)}</span>
                            </span>
                          );
                        })()}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Simulation de changement de rôle */}
            <Card>
              <CardHeader>
                <CardTitle>Test des rôles (Simulation)</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Changez de rôle pour tester les différentes permissions :
                </p>
                <div className="flex space-x-2">
                  <Button 
                    variant={utilisateurActuel.role === RoleUtilisateur.CLIENT ? "default" : "outline"}
                    size="sm"
                    onClick={() => simulerChangementRole(RoleUtilisateur.CLIENT)}
                  >
                    <User className="h-4 w-4 mr-1" />
                    Client
                  </Button>
                  <Button 
                    variant={utilisateurActuel.role === RoleUtilisateur.EMPLOYE ? "default" : "outline"}
                    size="sm"
                    onClick={() => simulerChangementRole(RoleUtilisateur.EMPLOYE)}
                  >
                    <UserCheck className="h-4 w-4 mr-1" />
                    Employé
                  </Button>
                  <Button 
                    variant={utilisateurActuel.role === RoleUtilisateur.ADMIN ? "default" : "outline"}
                    size="sm"
                    onClick={() => simulerChangementRole(RoleUtilisateur.ADMIN)}
                  >
                    <Shield className="h-4 w-4 mr-1" />
                    Administrateur
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Actions rapides */}
            <Card>
              <CardHeader>
                <CardTitle>Actions rapides</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button 
                    variant="outline" 
                    className="h-20 flex-col"
                    onClick={() => setSectionActive('profile')}
                  >
                    <Settings className="h-6 w-6 mb-2" />
                    Gérer le profil
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-20 flex-col"
                    onClick={() => setSectionActive('history')}
                  >
                    <History className="h-6 w-6 mb-2" />
                    Historique
                  </Button>
                  {(utilisateurActuel.role === RoleUtilisateur.ADMIN || 
                    utilisateurActuel.role === RoleUtilisateur.EMPLOYE) && (
                    <Button 
                      variant="outline" 
                      className="h-20 flex-col"
                      onClick={() => window.location.href = '/admin'}
                    >
                      <ShoppingCart className="h-6 w-6 mb-2" />
                      Administration
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* En-tête */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Test d'Authentification</h1>
            <p className="text-gray-600">
              Interface de test pour l'authentification et la gestion des utilisateurs
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            {estConnecte && utilisateurActuel ? (
              <>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Connecté en tant que</p>
                  <p className="font-medium">{utilisateurActuel.prenom} {utilisateurActuel.nom}</p>
                </div>
                <Button 
                  variant="outline" 
                  onClick={deconnexion}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Déconnexion
                </Button>
              </>
            ) : (
              <Button onClick={() => setAfficherModal(true)}>
                <LogIn className="h-4 w-4 mr-2" />
                Se connecter
              </Button>
            )}
          </div>
        </div>

        {/* Navigation */}
        {estConnecte && utilisateurActuel && (
          <div className="flex space-x-4 mb-6">
            <Button 
              variant={sectionActive === 'overview' ? "default" : "outline"}
              onClick={() => setSectionActive('overview')}
            >
              Vue d'ensemble
            </Button>
            <Button 
              variant={sectionActive === 'profile' ? "default" : "outline"}
              onClick={() => setSectionActive('profile')}
            >
              Profil
            </Button>
            <Button 
              variant={sectionActive === 'history' ? "default" : "outline"}
              onClick={() => setSectionActive('history')}
            >
              Historique
            </Button>
          </div>
        )}

        {/* Contenu */}
        {renderContenu()}
      </div>

      {/* Modal d'authentification */}
      <ModalAuth 
        isOpen={afficherModal}
        onClose={() => setAfficherModal(false)}
      />
    </div>
  );
}
