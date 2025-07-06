"use client"

import React from 'react'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'

// Import dynamique pour éviter les erreurs SSR avec Leaflet
const MapWithNoSSR = dynamic(() => import('@/components/contact/MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center animate-pulse">
      <p className="text-gray-500">Chargement de la carte...</p>
    </div>
  )
})

interface CarteLocalisationProps {
  className?: string
}

export function CarteLocalisation({ className = "" }: CarteLocalisationProps) {
  return (
    <motion.div 
      className={`bg-white rounded-lg shadow-md p-6 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <h3 className="font-semibold text-boulangerie-bordeaux mb-4 text-lg">
        Nous trouver
      </h3>
      <div className="aspect-video rounded-lg overflow-hidden shadow-sm">
        <MapWithNoSSR />
      </div>
      <div className="mt-4 p-4 bg-boulangerie-cream rounded-lg">
        <h4 className="font-medium text-boulangerie-bordeaux mb-2">
          Boulangerie Fabrice's
        </h4>
        <p className="text-sm text-gray-600">
          2 rue du centre<br />
          67460 Souffelweyersheim, France
        </p>
        <p className="text-xs text-gray-500 mt-2">
          Parking disponible à proximité
        </p>
      </div>
    </motion.div>
  )
}
