"use client"

import React from 'react'
import { cn } from '@workspace/ui/lib/utils'

interface FabriceLogoProps {
  size?: number
  className?: string
  variant?: 'default' | 'white' | 'dark'
}

export function FabriceLogo({ size = 64, className, variant = 'default' }: FabriceLogoProps) {
  const bordeauxColor = variant === 'white' ? '#FFFFFF' : '#5D1E26'
  const orColor = variant === 'white' ? '#D4AF37' : variant === 'dark' ? '#9D7E1A' : '#B8941F'
  const accentColor = variant === 'white' ? '#F5F1E8' : '#FAF7F0'
  
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("drop-shadow-lg", className)}
      aria-label="Logo Boulangerie Fabrice"
    >
      {/* Dégradé de fond bordeaux */}
      <defs>
        <linearGradient id={`gradient-bg-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={bordeauxColor} />
          <stop offset="100%" stopColor={variant === 'white' ? '#E5E5E5' : '#4A1A20'} />
        </linearGradient>
        
        <linearGradient id={`gradient-f-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={orColor} />
          <stop offset="50%" stopColor={variant === 'white' ? '#F4E47B' : '#D4AF37'} />
          <stop offset="100%" stopColor={orColor} />
        </linearGradient>
        
        <filter id={`shadow-${size}`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="2" dy="4" stdDeviation="3" floodColor={bordeauxColor} floodOpacity="0.3"/>
        </filter>
        
        <filter id={`inner-shadow-${size}`}>
          <feOffset dx="1" dy="1"/>
          <feGaussianBlur stdDeviation="1" result="offset-blur"/>
          <feFlood floodColor="#000000" floodOpacity="0.2"/>
          <feComposite in2="offset-blur" operator="in"/>
        </filter>
      </defs>

      {/* Cercle de fond avec dégradé */}
      <circle
        cx="60"
        cy="60"
        r="55"
        fill={`url(#gradient-bg-${size})`}
        filter={`url(#shadow-${size})`}
      />
      
      {/* Cercle intérieur décoratif */}
      <circle
        cx="60"
        cy="60"
        r="48"
        fill="none"
        stroke={accentColor}
        strokeWidth="0.5"
        opacity="0.3"
      />

      {/* Lettre F élégante */}
      <g transform="translate(60, 60)">
        {/* Corps principal du F */}
        <path
          d="M-18 -25 L-18 25 L-12 25 L-12 4 L12 4 L12 -2 L-12 -2 L-12 -19 L18 -19 L18 -25 Z"
          fill={`url(#gradient-f-${size})`}
          filter={`url(#inner-shadow-${size})`}
        />
        
        {/* Barre centrale décorative */}
        <rect
          x="-12"
          y="1"
          width="20"
          height="6"
          fill={`url(#gradient-f-${size})`}
          rx="2"
        />
        
        {/* Détails décoratifs */}
        <circle cx="20" cy="-12" r="2" fill={orColor} opacity="0.7" />
        <circle cx="22" cy="8" r="1.5" fill={orColor} opacity="0.5" />
        
        {/* Élément de style boulangerie (épis de blé stylisés) */}
        <g transform="translate(15, -20)" opacity="0.6">
          <path
            d="M0 0 L2 -3 L1 -6 L-1 -6 L-2 -3 Z M3 1 L5 -2 L4 -5 L2 -5 L1 -2 Z"
            fill={orColor}
            className="animate-pulse"
          />
        </g>
      </g>
      
      {/* Texte subtil en bas (optionnel) */}
      {size >= 80 && (
        <text
          x="60"
          y="100"
          textAnchor="middle"
          className="font-sans text-xs font-medium"
          fill={orColor}
          opacity="0.7"
        >
          FABRICE
        </text>
      )}
    </svg>
  )
}

// Version simplifiée pour les petites tailles
export function FabriceLogoSimple({ size = 32, className, variant = 'default' }: FabriceLogoProps) {
  const bordeauxColor = variant === 'white' ? '#FFFFFF' : '#5D1E26'
  const orColor = variant === 'white' ? '#D4AF37' : '#B8941F'
  
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("drop-shadow-md", className)}
    >
      <circle cx="24" cy="24" r="22" fill={bordeauxColor} />
      <path
        d="M14 14 L14 34 L17 34 L17 26 L28 26 L28 23 L17 23 L17 17 L31 17 L31 14 Z"
        fill={orColor}
      />
      <circle cx="32" cy="20" r="1.5" fill={orColor} opacity="0.6" />
    </svg>
  )
}
