import React from "react"
import { motion } from "framer-motion"

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
}

export function HeroCommandes() {
  return (
    <motion.section 
      className="bg-gradient-bordeaux-or text-white py-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="container mx-auto px-4 text-center">
        <motion.h1 
          className="text-4xl md:text-5xl font-artisan font-bold mb-4"
          {...fadeInUp}
        >
          Mes Commandes
        </motion.h1>
        <motion.p 
          className="text-xl opacity-90 max-w-2xl mx-auto"
          {...fadeInUp}
          transition={{ delay: 0.2 }}
        >
          Suivez l'état de vos commandes et consultez votre historique d'achats
        </motion.p>
      </div>
    </motion.section>
  )
}
