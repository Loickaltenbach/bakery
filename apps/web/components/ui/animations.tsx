"use client"

import React from 'react'
import { motion, AnimatePresence, useInView, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

// Variantes d'animation pour les éléments
export const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -60 }
}

export const fadeInLeft = {
  initial: { opacity: 0, x: -60 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 60 }
}

export const fadeInRight = {
  initial: { opacity: 0, x: 60 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -60 }
}

export const scaleIn = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.8 }
}

export const slideIn = {
  initial: { opacity: 0, y: 100 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -100 }
}

export const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
}

export const bounceIn = {
  initial: { opacity: 0, scale: 0.3 },
  animate: { 
    opacity: 1, 
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20
    }
  },
  exit: { opacity: 0, scale: 0.3 }
}

// Hook pour détecter si un élément est visible
export function useAnimateOnView(threshold = 0.1) {
  const ref = useRef(null)
  const isInView = useInView(ref, { 
    amount: threshold, 
    once: true, 
    margin: "-100px 0px" 
  })
  
  return { ref, isInView }
}

// Composant wrapper pour les animations au scroll
export function AnimateOnView({ 
  children, 
  variant = fadeInUp, 
  duration = 0.6, 
  delay = 0,
  threshold = 0.1 
}: {
  children: React.ReactNode
  variant?: any
  duration?: number
  delay?: number
  threshold?: number
}) {
  const { ref, isInView } = useAnimateOnView(threshold)

  return (
    <motion.div
      ref={ref}
      initial="initial"
      animate={isInView ? "animate" : "initial"}
      variants={variant}
      transition={{ duration, delay }}
    >
      {children}
    </motion.div>
  )
}

// Composant pour les transitions de page
export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  )
}

// Composant pour les animations de hover sur les cartes
export function HoverCard({ 
  children, 
  scale = 1.02, 
  duration = 0.2,
  className = ""
}: {
  children: React.ReactNode
  scale?: number
  duration?: number
  className?: string
}) {
  return (
    <motion.div
      className={className}
      whileHover={{ 
        scale,
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration }}
    >
      {children}
    </motion.div>
  )
}

// Composant pour les boutons avec animations
export function AnimatedButton({ 
  children, 
  onClick, 
  className = "", 
  disabled = false,
  loading = false,
  variant = "primary"
}: {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  disabled?: boolean
  loading?: boolean
  variant?: "primary" | "secondary" | "outline"
}) {
  const baseClasses = "relative overflow-hidden px-6 py-3 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"
  
  const variantClasses = {
    primary: "bg-boulangerie-gold text-white hover:bg-boulangerie-gold/90 focus:ring-boulangerie-gold",
    secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600",
    outline: "border-2 border-boulangerie-gold text-boulangerie-gold hover:bg-boulangerie-gold hover:text-white focus:ring-boulangerie-gold"
  }

  return (
    <motion.button
      className={`${baseClasses} ${variantClasses[variant]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center"
          >
            <motion.div
              className="w-5 h-5 border-2 border-current border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>
        ) : (
          <motion.span
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center"
          >
            {children}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  )
}

// Composant pour les notifications toast avec animations
export function Toast({ 
  message, 
  type = "success", 
  onClose 
}: {
  message: string
  type?: "success" | "error" | "warning" | "info"
  onClose: () => void
}) {
  const bgColors = {
    success: "bg-green-500",
    error: "bg-red-500",
    warning: "bg-yellow-500",
    info: "bg-blue-500"
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
      className={`${bgColors[type]} text-white px-6 py-3 rounded-lg shadow-lg flex items-center justify-between min-w-80`}
      layout
    >
      <span>{message}</span>
      <motion.button
        onClick={onClose}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="ml-4 text-white/80 hover:text-white"
      >
        ✕
      </motion.button>
    </motion.div>
  )
}

// Composant pour les modales avec animations
export function AnimatedModal({ 
  isOpen, 
  onClose, 
  children 
}: {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.7, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.7, y: 50 }}
            transition={{ type: "spring", damping: 25, stiffness: 500 }}
            className="bg-white rounded-xl p-6 w-full max-w-md dark:bg-gray-800"
            onClick={(e) => e.stopPropagation()}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Composant pour les listes animées
export function AnimatedList({ 
  children, 
  className = "" 
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <motion.div
      className={className}
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      {React.Children.map(children, (child, index) => (
        <motion.div
          key={index}
          variants={fadeInUp}
          transition={{ duration: 0.4 }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  )
}

// Composant pour les animations de parallax
export function ParallaxContainer({ 
  children, 
  offset = 50 
}: {
  children: React.ReactNode
  offset?: number
}) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })
  
  const y = useTransform(scrollYProgress, [0, 1], [offset, -offset])

  return (
    <motion.div ref={ref} style={{ y }}>
      {children}
    </motion.div>
  )
}

// Hook pour créer un système de notification
export function useToast() {
  const [toasts, setToasts] = React.useState<Array<{
    id: string
    message: string
    type: "success" | "error" | "warning" | "info"
  }>>([])

  const addToast = (message: string, type: "success" | "error" | "warning" | "info" = "success") => {
    const id = Math.random().toString(36)
    setToasts(prev => [...prev, { id, message, type }])
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      removeToast(id)
    }, 5000)
  }

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  const ToastContainer = () => (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  )

  return { addToast, ToastContainer }
}
