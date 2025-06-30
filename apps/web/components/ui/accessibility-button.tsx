"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Accessibility, Settings, X } from 'lucide-react'
import { AccessibilityPanel } from './accessibility'

export function AccessibilityButton() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Bouton flottant d'accessibilité */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 left-4 z-40 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Options d'accessibilité"
        title="Options d'accessibilité"
      >
        <Accessibility className="w-6 h-6 mx-auto" />
      </motion.button>

      {/* Panneau d'accessibilité */}
      <AccessibilityPanel isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}
