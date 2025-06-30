"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

// Types pour l'accessibilité
interface AccessibilityContextType {
  announcements: string[]
  announce: (message: string) => void
  highContrast: boolean
  toggleHighContrast: () => void
  reducedMotion: boolean
  toggleReducedMotion: () => void
  fontSize: 'normal' | 'large' | 'xl'
  setFontSize: (size: 'normal' | 'large' | 'xl') => void
  keyboardNavigation: boolean
  setKeyboardNavigation: (enabled: boolean) => void
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined)

// Hook pour utiliser le contexte d'accessibilité
export function useAccessibility() {
  const context = useContext(AccessibilityContext)
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider')
  }
  return context
}

// Provider d'accessibilité
export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [announcements, setAnnouncements] = useState<string[]>([])
  const [highContrast, setHighContrast] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xl'>('normal')
  const [keyboardNavigation, setKeyboardNavigation] = useState(false)

  // Charger les préférences depuis localStorage
  useEffect(() => {
    const savedContrast = localStorage.getItem('highContrast') === 'true'
    const savedMotion = localStorage.getItem('reducedMotion') === 'true'
    const savedFontSize = localStorage.getItem('fontSize') as 'normal' | 'large' | 'xl' || 'normal'
    
    setHighContrast(savedContrast)
    setReducedMotion(savedMotion)
    setFontSize(savedFontSize)

    // Détecter les préférences système
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      setReducedMotion(true)
    }
  }, [])

  // Appliquer les changements au document
  useEffect(() => {
    document.documentElement.classList.toggle('high-contrast', highContrast)
    document.documentElement.classList.toggle('reduced-motion', reducedMotion)
    document.documentElement.classList.toggle('font-large', fontSize === 'large')
    document.documentElement.classList.toggle('font-xl', fontSize === 'xl')
    
    localStorage.setItem('highContrast', highContrast.toString())
    localStorage.setItem('reducedMotion', reducedMotion.toString())
    localStorage.setItem('fontSize', fontSize)
  }, [highContrast, reducedMotion, fontSize])

  // Détection de la navigation au clavier
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        setKeyboardNavigation(true)
      }
    }

    const handleMouseDown = () => {
      setKeyboardNavigation(false)
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('mousedown', handleMouseDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('mousedown', handleMouseDown)
    }
  }, [])

  const announce = (message: string) => {
    setAnnouncements(prev => [...prev, message])
    
    // Supprimer l'annonce après 5 secondes
    setTimeout(() => {
      setAnnouncements(prev => prev.slice(1))
    }, 5000)
  }

  const toggleHighContrast = () => {
    setHighContrast(prev => !prev)
    announce(highContrast ? 'Mode contraste élevé désactivé' : 'Mode contraste élevé activé')
  }

  const toggleReducedMotion = () => {
    setReducedMotion(prev => !prev)
    announce(reducedMotion ? 'Animations réactivées' : 'Animations réduites')
  }

  return (
    <AccessibilityContext.Provider value={{
      announcements,
      announce,
      highContrast,
      toggleHighContrast,
      reducedMotion,
      toggleReducedMotion,
      fontSize,
      setFontSize,
      keyboardNavigation,
      setKeyboardNavigation
    }}>
      {children}
      <LiveRegion announcements={announcements} />
    </AccessibilityContext.Provider>
  )
}

// Composant pour les annonces ARIA
function LiveRegion({ announcements }: { announcements: string[] }) {
  return createPortal(
    <div
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
    >
      {announcements.map((announcement, index) => (
        <div key={index}>{announcement}</div>
      ))}
    </div>,
    document.body
  )
}

// Composant Skip Links
export function SkipLinks() {
  return (
    <div className="sr-only focus:not-sr-only focus:fixed focus:top-0 focus:left-0 focus:z-50 focus:p-4 focus:bg-white focus:text-black focus:border-2 focus:border-black">
      <a href="#main-content" className="mr-4 underline">
        Aller au contenu principal
      </a>
      <a href="#navigation" className="mr-4 underline">
        Aller à la navigation
      </a>
      <a href="#footer" className="underline">
        Aller au pied de page
      </a>
    </div>
  )
}

// Composant Focus Trap pour les modales
export function FocusTrap({ 
  children, 
  active = true 
}: { 
  children: React.ReactNode
  active?: boolean 
}) {
  const containerRef = React.useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!active || !containerRef.current) return

    const container = containerRef.current
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )

    const firstElement = focusableElements[0] as HTMLElement
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault()
          lastElement?.focus()
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault()
          firstElement?.focus()
        }
      }
    }

    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        // Fermer la modale ou revenir à l'élément précédent
        firstElement?.blur()
      }
    }

    document.addEventListener('keydown', handleTabKey)
    document.addEventListener('keydown', handleEscapeKey)

    // Focus initial
    firstElement?.focus()

    return () => {
      document.removeEventListener('keydown', handleTabKey)
      document.removeEventListener('keydown', handleEscapeKey)
    }
  }, [active])

  return (
    <div ref={containerRef}>
      {children}
    </div>
  )
}

// Composant pour le panneau d'accessibilité
export function AccessibilityPanel({ 
  isOpen, 
  onClose 
}: { 
  isOpen: boolean
  onClose: () => void 
}) {
  const { 
    highContrast, 
    toggleHighContrast, 
    reducedMotion, 
    toggleReducedMotion,
    fontSize,
    setFontSize,
    announce
  } = useAccessibility()

  if (!isOpen) return null

  return (
    <FocusTrap active={isOpen}>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
        role="dialog"
        aria-modal="true"
        aria-labelledby="accessibility-title"
      >
        <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl dark:bg-gray-800">
          <div className="flex items-center justify-between mb-6">
            <h2 id="accessibility-title" className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Options d'accessibilité
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 rounded-lg dark:text-gray-400 dark:hover:text-gray-200"
              aria-label="Fermer le panneau d'accessibilité"
            >
              ✕
            </button>
          </div>

          <div className="space-y-6">
            {/* Contraste élevé */}
            <div className="flex items-center justify-between">
              <label htmlFor="high-contrast" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Contraste élevé
              </label>
              <button
                id="high-contrast"
                onClick={toggleHighContrast}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  highContrast ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'
                }`}
                role="switch"
                aria-checked={highContrast}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    highContrast ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Animations réduites */}
            <div className="flex items-center justify-between">
              <label htmlFor="reduced-motion" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Réduire les animations
              </label>
              <button
                id="reduced-motion"
                onClick={toggleReducedMotion}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  reducedMotion ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'
                }`}
                role="switch"
                aria-checked={reducedMotion}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    reducedMotion ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Taille de police */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-3 block dark:text-gray-300">
                Taille de police
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['normal', 'large', 'xl'] as const).map((size) => (
                  <button
                    key={size}
                    onClick={() => {
                      setFontSize(size)
                      announce(`Taille de police changée à ${size === 'normal' ? 'normale' : size === 'large' ? 'grande' : 'très grande'}`)
                    }}
                    className={`px-3 py-2 text-sm rounded-lg border-2 transition-colors ${
                      fontSize === size
                        ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
                        : 'border-gray-300 hover:border-gray-400 dark:border-gray-600 dark:hover:border-gray-500'
                    }`}
                  >
                    {size === 'normal' ? 'Normal' : size === 'large' ? 'Grand' : 'Très grand'}
                  </button>
                ))}
              </div>
            </div>

            {/* Instructions de navigation clavier */}
            <div className="bg-gray-50 p-4 rounded-lg dark:bg-gray-700">
              <h3 className="text-sm font-medium text-gray-900 mb-2 dark:text-gray-100">
                Navigation clavier
              </h3>
              <ul className="text-xs text-gray-600 space-y-1 dark:text-gray-400">
                <li><kbd className="px-1 py-0.5 bg-gray-200 rounded text-xs dark:bg-gray-600">Tab</kbd> : Navigation entre les éléments</li>
                <li><kbd className="px-1 py-0.5 bg-gray-200 rounded text-xs dark:bg-gray-600">Enter/Espace</kbd> : Activer un élément</li>
                <li><kbd className="px-1 py-0.5 bg-gray-200 rounded text-xs dark:bg-gray-600">Échap</kbd> : Fermer les modales</li>
                <li><kbd className="px-1 py-0.5 bg-gray-200 rounded text-xs dark:bg-gray-600">Flèches</kbd> : Navigation dans les menus</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </FocusTrap>
  )
}
