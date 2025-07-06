"use client"

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { LogoIcon } from './logo-icon'
import { cn } from '@workspace/ui/lib/utils'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'default' | 'white' | 'dark'
  className?: string
  showText?: boolean
  href?: string
}

const sizeClasses = {
  sm: 'h-8 w-8',
  md: 'h-12 w-12',
  lg: 'h-16 w-16',
  xl: 'h-24 w-24'
}

const textSizeClasses = {
  sm: 'text-lg',
  md: 'text-xl',
  lg: 'text-2xl',
  xl: 'text-3xl'
}

export function Logo({ 
  size = 'md', 
  variant = 'default', 
  className = '', 
  showText = true,
  href = '/'
}: LogoProps) {
  const [imageError, setImageError] = useState(false)
  
  const logoContent = (
    <div className={cn(
      "flex items-center gap-3",
      className
    )}>
      {/* Logo Image ou Fallback SVG */}
      <div className={cn(
        "relative rounded-lg overflow-hidden shadow-md flex items-center justify-center",
        sizeClasses[size]
      )}>
        {!imageError ? (
          <Image
            src="/images/logo-fabrice.png"
            alt="Logo Boulangerie Fabrice"
            fill
            className="object-cover"
            priority
            onError={() => setImageError(true)}
          />
        ) : (
          <LogoIcon 
            size={size === 'sm' ? 32 : size === 'md' ? 48 : size === 'lg' ? 64 : 96}
            className="w-full h-full"
          />
        )}
      </div>
      
      {/* Text */}
      {showText && (
        <div className="flex flex-col">
          <span className={cn(
            "font-artisan font-bold leading-tight",
            textSizeClasses[size],
            variant === 'white' ? 'text-white' : 
            variant === 'dark' ? 'text-boulangerie-bordeaux-dark' : 
            'text-boulangerie-bordeaux'
          )}>
            Boulangerie
          </span>
          <span className={cn(
            "font-artisan font-medium leading-tight",
            size === 'sm' ? 'text-sm' :
            size === 'md' ? 'text-base' :
            size === 'lg' ? 'text-lg' : 'text-xl',
            variant === 'white' ? 'text-boulangerie-or-light' : 
            variant === 'dark' ? 'text-boulangerie-or-dark' : 
            'text-boulangerie-or'
          )}>
            Fabrice
          </span>
        </div>
      )}
    </div>
  )

  if (href) {
    return (
      <Link 
        href={href}
        className="transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-boulangerie-or focus:ring-offset-2 rounded-lg"
      >
        {logoContent}
      </Link>
    )
  }

  return logoContent
}
