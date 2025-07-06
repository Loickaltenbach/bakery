'use client';

import React, { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { RoleUtilisateur } from '@/lib/auth-types';
import { Button } from '@workspace/ui/components/button';
import { Card, CardContent } from '@workspace/ui/components/card';
import { Shield, LogIn, AlertTriangle } from 'lucide-react';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { utilisateur, isAuthenticated, isLoading } = useAuth();

  // Affichage de chargement
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card>
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>Vérification des droits d'accès...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Utilisateur non connecté
  if (!isAuthenticated || !utilisateur) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card>
          <CardContent className="p-12 text-center">
            <LogIn className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h2 className="text-xl font-semibold mb-2">Accès restreint</h2>
            <p className="text-gray-600 mb-6">
              Vous devez être connecté pour accéder à l'administration.
            </p>
            <Button onClick={() => window.location.href = '/test-auth'}>
              Se connecter
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Vérifier les permissions (admin ou employé)
  const aAccesAdmin = 
    utilisateur.role === RoleUtilisateur.ADMIN || 
    utilisateur.role === RoleUtilisateur.EMPLOYE;

  if (!aAccesAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card>
          <CardContent className="p-12 text-center">
            <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-red-500" />
            <h2 className="text-xl font-semibold mb-2">Accès refusé</h2>
            <p className="text-gray-600 mb-6">
              Vous n'avez pas les permissions nécessaires pour accéder à l'administration.
              <br />
              Seuls les administrateurs et employés peuvent accéder à cette section.
            </p>
            <div className="space-x-2">
              <Button 
                variant="outline"
                onClick={() => window.location.href = '/'}
              >
                Retour à l'accueil
              </Button>
              <Button onClick={() => window.location.href = '/test-auth'}>
                Changer de compte
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Utilisateur autorisé
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Barre d'information utilisateur */}
      <div className="bg-white border-b border-gray-200 px-6 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Shield className="h-4 w-4" />
            <span>Interface d'administration</span>
            <span className="text-gray-400">•</span>
            <span>Connecté en tant que {utilisateur.prenom} {utilisateur.nom}</span>
            <span className="text-gray-400">•</span>
            <span className="font-medium text-blue-600">
              {utilisateur.role === RoleUtilisateur.ADMIN ? 'Administrateur' : 'Employé'}
            </span>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => window.location.href = '/test-auth'}
          >
            Retour aux tests
          </Button>
        </div>
      </div>
      {children}
    </div>
  );
}
