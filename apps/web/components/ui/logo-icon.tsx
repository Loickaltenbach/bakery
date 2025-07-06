"use client"

import React from 'react'
import { cn } from '@workspace/ui/lib/utils'

interface LogoIconProps {
  size?: number
  className?: string
}

export function LogoIcon({ size = 24, className }: LogoIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("text-boulangerie-or", className)}
      aria-label="Logo Boulangerie Fabrice"
    >
      {/* Fond bordeaux */}
      <rect 
        width="100" 
        height="100" 
        rx="12" 
        fill="currentColor" 
        className="text-boulangerie-bordeaux"
      />
      
      {/* Lettre F stylisée en or */}
      <path
        d="M25 25 L25 75 L30 75 L30 52 L60 52 L60 47 L30 47 L30 30 L65 30 L65 25 Z"
        fill="currentColor"
        className="text-boulangerie-or"
        strokeWidth="1"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Détail décoratif */}
      <circle
        cx="70"
        cy="40"
        r="3"
        fill="currentColor"
        className="text-boulangerie-or opacity-60"
      />
    </svg>
  )
}

// Variante simplifiée pour favicon
export function LogoIconSimple({ size = 16, className }: LogoIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("text-boulangerie-or", className)}
    >
      <rect 
        width="24" 
        height="24" 
        rx="4" 
        fill="#5D1E26"
      />
      <path
        d="M6 6 L6 18 L8 18 L8 13 L16 13 L16 11 L8 11 L8 8 L17 8 L17 6 Z"
        fill="#B8941F"
      />
    </svg>
  )
}
