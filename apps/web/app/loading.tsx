"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { Logo } from '@/components/ui/logo'

export function LoadingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-boulangerie-cream via-boulangerie-beige to-boulangerie-cream flex items-center justify-center">
      <div className="text-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Logo size="xl" showText={true} href={undefined} />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="space-y-4"
        >
          <h2 className="text-2xl font-artisan font-bold text-boulangerie-bordeaux">
            Chargement en cours...
          </h2>
          <p className="text-boulangerie-bordeaux-light">
            Préparation de votre expérience boulangerie
          </p>
        </motion.div>

        {/* Animation de chargement */}
        <motion.div
          className="mt-8 flex justify-center space-x-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-3 h-3 bg-boulangerie-or rounded-full"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.7, 1, 0.7],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </motion.div>
      </div>
    </div>
  )
}

export default LoadingPage
