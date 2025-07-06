"use client"

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Facebook, 
  Instagram,
  Heart 
} from 'lucide-react'
import { Logo } from '@/components/ui/logo'

export function Footer() {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    navigation: [
      { label: 'Accueil', href: '/' },
      { label: 'Nos produits', href: '/produits' },
      { label: 'Commandes rapides', href: '/commandes-rapides' },
      { label: 'Favoris', href: '/favoris' },
      { label: 'Contact', href: '/contact' },
    ],
    legal: [
      { label: 'Mentions légales', href: '/mentions-legales' },
      { label: 'Politique de confidentialité', href: '/confidentialite' },
      { label: 'CGV', href: '/cgv' },
      { label: 'Plan du site', href: '/sitemap' },
    ]
  }

  const contactInfo = {
    address: "2 rue du centre\n67460 Souffelweyersheim",
    phone: "03 88 20 09 89",
    email: "fabricebk@yahoo.fr",
    hours: "Lun-Ven: 6h00 - 19h00\nSamedi: 6h00 - 13h00"
  }

  return (
    <footer className="bg-boulangerie-bordeaux-dark text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo et description */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <Logo size="lg" variant="white" showText={true} />
            </div>
            <p className="text-boulangerie-or-light text-sm mb-4">
              Boulangerie artisanale alsacienne depuis 1985. 
              Savoir-faire traditionnel et passion pour l'excellence.
            </p>
            <div className="flex space-x-4">
              <motion.a
                href="#"
                whileHover={{ scale: 1.1 }}
                className="p-2 bg-boulangerie-or rounded-full hover:bg-boulangerie-or-dark transition-colors"
              >
                <Facebook className="h-4 w-4 text-white" />
              </motion.a>
              <motion.a
                href="#"
                whileHover={{ scale: 1.1 }}
                className="p-2 bg-boulangerie-or rounded-full hover:bg-boulangerie-or-dark transition-colors"
              >
                <Instagram className="h-4 w-4 text-white" />
              </motion.a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-boulangerie-or">
              Navigation
            </h3>
            <ul className="space-y-2">
              {footerLinks.navigation.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-300 hover:text-boulangerie-or-light transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Informations de contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-boulangerie-or">
              Contact
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-boulangerie-or mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-300 whitespace-pre-line">
                  {contactInfo.address}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-boulangerie-or flex-shrink-0" />
                <a
                  href={`tel:${contactInfo.phone.replace(/\s/g, '')}`}
                  className="text-sm text-gray-300 hover:text-boulangerie-or-light transition-colors"
                >
                  {contactInfo.phone}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-boulangerie-or flex-shrink-0" />
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="text-sm text-gray-300 hover:text-boulangerie-or-light transition-colors"
                >
                  {contactInfo.email}
                </a>
              </div>
            </div>
          </div>

          {/* Horaires */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-boulangerie-or">
              Horaires
            </h3>
            <div className="flex items-start gap-2">
              <Clock className="h-4 w-4 text-boulangerie-or mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-300 whitespace-pre-line">
                {contactInfo.hours}
              </p>
            </div>
            <div className="mt-4">
              <span className="inline-flex items-center gap-1 text-xs text-green-400">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                Ouvert aujourd'hui
              </span>
            </div>
          </div>
        </div>

        {/* Séparateur */}
        <div className="border-t border-boulangerie-bordeaux-light mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex flex-wrap gap-4 mb-4 md:mb-0">
              {footerLinks.legal.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-xs text-gray-400 hover:text-boulangerie-or-light transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <span>© {currentYear} Boulangerie Fabrice. Fait avec</span>
              <Heart className="h-3 w-3 text-red-400" />
              <span>en Alsace</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
