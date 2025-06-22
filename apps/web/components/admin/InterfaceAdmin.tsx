'use client';

import React, { useState } from 'react';
import { Button } from '@workspace/ui/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { 
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  BarChart3,
  Settings,
  Bell,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { TableauDeBordAdmin } from './TableauDeBordAdmin';
import GestionCommandes from './GestionCommandes';
import GestionStocks from './GestionStocks';
import GestionUtilisateurs from './GestionUtilisateurs';

export type SectionAdmin = 
  | 'dashboard'
  | 'commandes'
  | 'stocks'
  | 'utilisateurs'
  | 'statistiques'
  | 'parametres';

interface NavigationItem {
  id: SectionAdmin;
  label: string;
  icon: React.ComponentType<any>;
  description: string;
}

const navigationItems: NavigationItem[] = [
  {
    id: 'dashboard',
    label: 'Tableau de bord',
    icon: LayoutDashboard,
    description: 'Vue d\'ensemble et statistiques'
  },
  {
    id: 'commandes',
    label: 'Commandes',
    icon: ShoppingCart,
    description: 'Gestion des commandes en cours'
  },
  {
    id: 'stocks',
    label: 'Stocks',
    icon: Package,
    description: 'Gestion des niveaux de stock'
  },
  {
    id: 'utilisateurs',
    label: 'Utilisateurs',
    icon: Users,
    description: 'Administration des comptes'
  },
  {
    id: 'statistiques',
    label: 'Statistiques',
    icon: BarChart3,
    description: 'Analyses et rapports'
  },
  {
    id: 'parametres',
    label: 'Paramètres',
    icon: Settings,
    description: 'Configuration système'
  }
];

export default function InterfaceAdmin() {
  const [sectionActive, setSectionActive] = useState<SectionAdmin>('dashboard');
  const [sidebarOuverte, setSidebarOuverte] = useState<boolean>(true);
  const [notifications] = useState<number>(3); // Simulation de notifications

  const renderContenu = () => {
    switch (sectionActive) {
      case 'dashboard':
        return <TableauDeBordAdmin />;
      case 'commandes':
        return <GestionCommandes />;
      case 'stocks':
        return <GestionStocks />;
      case 'utilisateurs':
        return <GestionUtilisateurs />;
      case 'statistiques':
        return <StatistiquesAdmin />;
      case 'parametres':
        return <ParametresAdmin />;
      default:
        return <TableauDeBordAdmin />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`bg-white shadow-lg transition-all duration-300 ${
        sidebarOuverte ? 'w-64' : 'w-16'
      }`}>
        {/* En-tête sidebar */}
        <div className="flex items-center justify-between p-4 border-b">
          {sidebarOuverte && (
            <div>
              <h1 className="text-xl font-bold text-gray-900">Administration</h1>
              <p className="text-sm text-gray-600">Boulangerie Alsacienne</p>
            </div>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSidebarOuverte(!sidebarOuverte)}
            className="p-2"
          >
            {sidebarOuverte ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="mt-4">
          <div className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const estActif = sectionActive === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => setSectionActive(item.id)}
                  className={`w-full flex items-center px-4 py-3 text-left transition-colors ${
                    estActif
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  title={!sidebarOuverte ? item.label : undefined}
                >
                  <Icon className={`h-5 w-5 ${estActif ? 'text-blue-700' : 'text-gray-400'}`} />
                  {sidebarOuverte && (
                    <div className="ml-3">
                      <div className="font-medium">{item.label}</div>
                      <div className="text-xs text-gray-500">{item.description}</div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Pied de sidebar */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              title={!sidebarOuverte ? 'Notifications' : undefined}
            >
              <Bell className="h-4 w-4" />
              {sidebarOuverte && (
                <span className="ml-2">
                  Notifications
                  {notifications > 0 && (
                    <span className="ml-1 bg-red-500 text-white text-xs rounded-full px-1">
                      {notifications}
                    </span>
                  )}
                </span>
              )}
            </Button>
            {sidebarOuverte && (
              <Button
                variant="outline"
                size="sm"
                title="Déconnexion"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="flex-1 overflow-hidden">
        {/* Barre de navigation supérieure */}
        <header className="bg-white shadow-sm border-b">
          <div className="flex items-center justify-between px-6 py-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {navigationItems.find(item => item.id === sectionActive)?.label}
              </h2>
              <p className="text-sm text-gray-600">
                {navigationItems.find(item => item.id === sectionActive)?.description}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {new Date().toLocaleDateString('fr-FR', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
          </div>
        </header>

        {/* Zone de contenu */}
        <main className="flex-1 overflow-y-auto p-6">
          {renderContenu()}
        </main>
      </div>
    </div>
  );
}

// Composant temporaire pour les statistiques
function StatistiquesAdmin() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Statistiques et Analyses</h2>
        <p className="text-gray-600">
          Analyses détaillées des ventes et de l'activité
        </p>
      </div>
      
      <Card>
        <CardContent className="p-12 text-center">
          <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold mb-2">Module en cours de développement</h3>
          <p className="text-gray-600">
            Les statistiques avancées et les rapports détaillés seront disponibles prochainement.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

// Composant temporaire pour les paramètres
function ParametresAdmin() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Paramètres Système</h2>
        <p className="text-gray-600">
          Configuration et paramètres de l'application
        </p>
      </div>
      
      <Card>
        <CardContent className="p-12 text-center">
          <Settings className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold mb-2">Module en cours de développement</h3>
          <p className="text-gray-600">
            Les paramètres de configuration seront disponibles prochainement.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
