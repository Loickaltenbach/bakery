import React from "react"
import { 
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  BarChart3,
  Settings
} from 'lucide-react'

export type SectionAdmin = 
  | 'dashboard'
  | 'commandes'
  | 'stocks'
  | 'utilisateurs'
  | 'statistiques'
  | 'parametres'

export interface NavigationItem {
  id: SectionAdmin
  label: string
  icon: React.ComponentType<any>
  description: string
}

export const navigationItems: NavigationItem[] = [
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
    description: 'Inventaire et produits'
  },
  {
    id: 'utilisateurs',
    label: 'Utilisateurs',
    icon: Users,
    description: 'Gestion des comptes clients'
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
]
