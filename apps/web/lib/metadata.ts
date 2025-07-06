import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    default: 'Boulangerie Fabrice - Souffelweyersheim',
    template: '%s | Boulangerie Fabrice'
  },
  description: 'Boulangerie artisanale alsacienne à Souffelweyersheim. Pain traditionnel, viennoiseries et pâtisseries fraîches. Savoir-faire artisanal depuis 1985.',
  keywords: [
    'boulangerie',
    'artisanale',
    'Souffelweyersheim',
    'Alsace',
    'pain traditionnel',
    'viennoiseries',
    'pâtisseries',
    'Fabrice',
    'artisan boulanger'
  ],
  authors: [{ name: 'Boulangerie Fabrice' }],
  creator: 'Boulangerie Fabrice',
  publisher: 'Boulangerie Fabrice',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://votre-domaine.fr'), // À remplacer par votre vrai domaine
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://votre-domaine.fr',
    title: 'Boulangerie Fabrice - Souffelweyersheim',
    description: 'Boulangerie artisanale alsacienne à Souffelweyersheim. Pain traditionnel, viennoiseries et pâtisseries fraîches.',
    siteName: 'Boulangerie Fabrice',
    images: [
      {
        url: '/images/logo-fabrice.png',
        width: 800,
        height: 600,
        alt: 'Logo Boulangerie Fabrice',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Boulangerie Fabrice - Souffelweyersheim',
    description: 'Boulangerie artisanale alsacienne à Souffelweyersheim. Pain traditionnel, viennoiseries et pâtisseries fraîches.',
    images: ['/images/logo-fabrice.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/images/logo-fabrice.png',
    apple: '/images/logo-fabrice.png',
  },
  manifest: '/manifest.json',
}
