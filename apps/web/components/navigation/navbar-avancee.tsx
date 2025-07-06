"use client"

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Search, 
  Heart, 
  ShoppingCart, 
  User, 
  Menu, 
  X, 
  Sun, 
  Moon, 
  Monitor,
  Zap,
  WifiOff,
  Check,
  AlertCircle
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { useFavoris } from '@/contexts/FavorisContext'
import { useCommandesRapides } from '@/contexts/CommandesRapidesContext'
import { useOffline } from '@/contexts/OfflineContext'
import { usePanier } from '@/contexts/PanierContext'
import { Logo } from '@/components/ui/logo'
import { cn } from '@workspace/ui/lib/utils'

interface NavItem {
  label: string
  href: string
  icon?: React.ComponentType<{ className?: string }>
}

const navItems: NavItem[] = [
  { label: 'Accueil', href: '/' },
  { label: 'Produits', href: '/produits' },
  { label: 'Commandes', href: '/commandes' },
  { label: 'Contact', href: '/contact' }
]

export function NavbarAvancee() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false)
  const [isCommandesRapidesOpen, setIsCommandesRapidesOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const { favoris } = useFavoris()
  const { commandesRapides } = useCommandesRapides()
  const { isOnline, offlineData, syncData } = useOffline()
  const { panier } = usePanier()

  // Éviter les problèmes d'hydratation
  useEffect(() => {
    setMounted(true)
  }, [])

  const themeMenuRef = useRef<HTMLDivElement>(null)
  const commandesMenuRef = useRef<HTMLDivElement>(null)

  // Fermer les menus au clic à l'extérieur
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (themeMenuRef.current && !themeMenuRef.current.contains(event.target as Node)) {
        setIsThemeMenuOpen(false)
      }
      if (commandesMenuRef.current && !commandesMenuRef.current.contains(event.target as Node)) {
        setIsCommandesRapidesOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Gestion clavier pour l'accessibilité
  const handleKeyDown = (event: React.KeyboardEvent, action: () => void) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      action()
    }
  }

  const totalItems = mounted ? panier.items.reduce((sum: number, item: any) => sum + item.quantite, 0) : 0
  const actionsEnAttenteCount = mounted ? offlineData.commandesEnAttente.length : 0

  // Ne pas rendre avant l'hydratation
  if (!mounted) {
    return (
      <nav className="sticky top-0 z-50 w-full border-b border-boulangerie-or/30 bg-boulangerie-cream/95 backdrop-blur-sm transition-all duration-300 dark:border-boulangerie-bordeaux-light/40 dark:bg-boulangerie-bordeaux-dark/95">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Logo 
              size="sm" 
              showText={false}
              className="sm:hidden"
            />
            
            <Logo 
              size="md" 
              showText={true}
              className="hidden sm:flex"
            />

            {/* Navigation desktop */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-boulangerie-or dark:hover:text-boulangerie-or-light",
                    pathname === item.href
                      ? "text-boulangerie-or dark:text-boulangerie-or-light font-semibold"
                      : "text-boulangerie-bordeaux dark:text-boulangerie-cream"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Actions skeleton */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="rounded-full p-2">
                <Search className="h-5 w-5" />
              </div>
              <div className="rounded-full p-2">
                <Heart className="h-5 w-5" />
              </div>
              <div className="rounded-full p-2">
                <ShoppingCart className="h-5 w-5" />
              </div>
              <div className="rounded-full p-2">
                <User className="h-5 w-5" />
              </div>
              <button className="md:hidden rounded-full p-2">
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>
    )
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-boulangerie-or/30 bg-boulangerie-cream/95 backdrop-blur-sm transition-all duration-300 dark:border-boulangerie-bordeaux-light/40 dark:bg-boulangerie-bordeaux-dark/95">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center space-x-2 text-boulangerie-bordeaux transition-colors hover:text-boulangerie-or dark:text-boulangerie-cream dark:hover:text-boulangerie-or-light"
            aria-label="Retour à l'accueil"
          >
            <div className="h-8 w-8 rounded-full bg-gradient-bordeaux-or flex items-center justify-center shadow-bordeaux">
              <span className="text-white font-bold text-sm">B</span>
            </div>
            <span className="hidden font-artisan text-xl font-semibold sm:block">
              Boulangerie Artisanale
            </span>
          </Link>

          {/* Navigation desktop */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-boulangerie-or dark:hover:text-boulangerie-or-light",
                  pathname === item.href
                    ? "text-boulangerie-or dark:text-boulangerie-or-light font-semibold"
                    : "text-boulangerie-bordeaux dark:text-boulangerie-cream"
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Indicateur hors ligne */}
            {!isOnline && (
              <div className="flex items-center space-x-1 rounded-full bg-orange-100 px-2 py-1 text-xs text-orange-700 dark:bg-orange-900/30 dark:text-orange-300">
                <WifiOff className="h-3 w-3" />
                <span className="hidden sm:inline">Hors ligne</span>
                {actionsEnAttenteCount > 0 && (
                  <span className="ml-1 rounded-full bg-orange-500 px-1.5 py-0.5 text-xs text-white">
                    {actionsEnAttenteCount}
                  </span>
                )}
              </div>
            )}

            {/* Actions en attente - bouton de synchronisation */}
            {actionsEnAttenteCount > 0 && isOnline && (
              <button
                onClick={syncData}
                className="flex items-center space-x-1 rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-700 transition-colors hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50"
                aria-label={`Synchroniser ${actionsEnAttenteCount} action(s) en attente`}
              >
                <AlertCircle className="h-3 w-3" />
                <span className="hidden sm:inline">Sync</span>
                <span className="rounded-full bg-blue-500 px-1.5 py-0.5 text-xs text-white">
                  {actionsEnAttenteCount}
                </span>
              </button>
            )}

            {/* Recherche */}
            <Link 
              href="/recherche"
              className="rounded-full p-2 text-boulangerie-bordeaux transition-colors hover:bg-boulangerie-or/10 hover:text-boulangerie-or dark:text-boulangerie-cream dark:hover:bg-boulangerie-bordeaux-light/20 dark:hover:text-boulangerie-or-light"
              aria-label="Rechercher des produits"
            >
              <Search className="h-5 w-5" />
            </Link>

            {/* Commandes rapides */}
            <div className="relative" ref={commandesMenuRef}>
              <button
                onClick={() => setIsCommandesRapidesOpen(!isCommandesRapidesOpen)}
                onKeyDown={(e) => handleKeyDown(e, () => setIsCommandesRapidesOpen(!isCommandesRapidesOpen))}
                className="relative rounded-full p-2 text-boulangerie-bordeaux transition-colors hover:bg-boulangerie-or/10 hover:text-boulangerie-or dark:text-boulangerie-cream dark:hover:bg-boulangerie-bordeaux-light/20 dark:hover:text-boulangerie-or-light"
                aria-label="Commandes rapides"
                aria-expanded={isCommandesRapidesOpen}
              >
                <Zap className="h-5 w-5" />
                {commandesRapides.length > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-boulangerie-or text-xs text-white">
                    {commandesRapides.length}
                  </span>
                )}
              </button>

              {/* Menu commandes rapides */}
              {isCommandesRapidesOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 rounded-lg border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-800">
                  <h3 className="mb-2 font-medium text-gray-900 dark:text-gray-100">
                    Commandes rapides
                  </h3>
                  {commandesRapides.length === 0 ? (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Aucune commande rapide sauvegardée
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {commandesRapides.slice(0, 3).map((commande) => (
                        <div
                          key={commande.id}
                          className="flex items-center justify-between rounded-md bg-gray-50 p-2 dark:bg-gray-700"
                        >
                          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {commande.nom}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {commande.produits.length} article(s)
                          </span>
                        </div>
                      ))}
                      <Link
                        href="/commandes-rapides"
                        className="block text-center text-sm text-boulangerie-or hover:underline dark:text-boulangerie-or-light"
                      >
                        Voir toutes
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Favoris */}
            <Link
              href="/favoris"
              className="relative rounded-full p-2 text-boulangerie-bordeaux transition-colors hover:bg-boulangerie-or/10 hover:text-boulangerie-or dark:text-boulangerie-cream dark:hover:bg-boulangerie-bordeaux-light/20 dark:hover:text-boulangerie-or-light"
              aria-label="Mes favoris"
            >
              <Heart className="h-5 w-5" />
              {favoris.length > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                  {favoris.length}
                </span>
              )}
            </Link>

            {/* Panier */}
            <Link
              href="/panier"
              className="relative rounded-full p-2 text-boulangerie-bordeaux transition-colors hover:bg-boulangerie-or/10 hover:text-boulangerie-or dark:text-boulangerie-cream dark:hover:bg-boulangerie-bordeaux-light/20 dark:hover:text-boulangerie-or-light"
              aria-label="Mon panier"
            >
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-boulangerie-or text-xs text-white">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Sélecteur de thème */}
            <div className="relative" ref={themeMenuRef}>
              <button
                onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
                onKeyDown={(e) => handleKeyDown(e, () => setIsThemeMenuOpen(!isThemeMenuOpen))}
                className="rounded-full p-2 text-boulangerie-bordeaux transition-colors hover:bg-boulangerie-or/10 hover:text-boulangerie-or dark:text-boulangerie-cream dark:hover:bg-boulangerie-bordeaux-light/20 dark:hover:text-boulangerie-or-light"
                aria-label="Changer le thème"
                aria-expanded={isThemeMenuOpen}
              >
                {theme === 'dark' ? (
                  <Moon className="h-5 w-5" />
                ) : theme === 'light' ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Monitor className="h-5 w-5" />
                )}
              </button>

              {/* Menu thème */}
              {isThemeMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-40 rounded-lg border border-gray-200 bg-white p-2 shadow-lg dark:border-gray-700 dark:bg-gray-800">
                  {[
                    { key: 'light', label: 'Clair', icon: Sun },
                    { key: 'dark', label: 'Sombre', icon: Moon },
                    { key: 'system', label: 'Système', icon: Monitor },
                  ].map(({ key, label, icon: Icon }) => (
                    <button
                      key={key}
                      onClick={() => {
                        setTheme(key)
                        setIsThemeMenuOpen(false)
                      }}
                      className="flex w-full items-center space-x-2 rounded-md px-3 py-2 text-sm transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <Icon className="h-4 w-4" />
                      <span>{label}</span>
                      {theme === key && <Check className="ml-auto h-4 w-4" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Compte utilisateur */}
            <Link
              href="/compte"
              className="rounded-full p-2 text-boulangerie-bordeaux transition-colors hover:bg-boulangerie-or/10 hover:text-boulangerie-or dark:text-boulangerie-cream dark:hover:bg-boulangerie-bordeaux-light/20 dark:hover:text-boulangerie-or-light"
              aria-label="Mon compte"
            >
              <User className="h-5 w-5" />
            </Link>

            {/* Menu mobile */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="rounded-full p-2 text-boulangerie-bordeaux transition-colors hover:bg-boulangerie-or/10 hover:text-boulangerie-or md:hidden dark:text-boulangerie-cream dark:hover:bg-boulangerie-bordeaux-light/20 dark:hover:text-boulangerie-or-light"
              aria-label="Ouvrir le menu"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Menu mobile */}
        {isMenuOpen && (
          <div className="border-t border-gray-200 py-4 md:hidden dark:border-gray-700">
            <div className="space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={cn(
                    "block px-3 py-2 text-base font-medium transition-colors",
                    pathname === item.href
                      ? "text-boulangerie-or dark:text-boulangerie-or-light"
                      : "text-boulangerie-bordeaux hover:text-boulangerie-or dark:text-boulangerie-cream dark:hover:text-boulangerie-or-light"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
