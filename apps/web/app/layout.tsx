import { Geist, Geist_Mono, Crimson_Text, Playfair_Display } from "next/font/google"

import "@workspace/ui/globals.css"
import "../styles/boulangerie-theme.css"
import "../styles/boulangerie-theme-improved.css"
import "../styles/accessibility.css"
import "leaflet/dist/leaflet.css"
import "../styles/leaflet-custom.css"
import { Providers } from "@/components/providers"
import { SkipLinks } from "@/components/ui/accessibility"
import { AccessibilityButton } from "@/components/ui/accessibility-button"
import { Footer } from "@/components/layout/footer"

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

const fontAlsacien = Crimson_Text({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-alsacien",
})

const fontArtisan = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-artisan",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>): React.ReactElement {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#5D1E26" />
        <meta name="description" content="Boulangerie artisanale alsacienne - Pain traditionnel, viennoiseries et pâtisseries fraîches" />
        <meta property="og:image" content="/icon" />
        <meta property="og:image:alt" content="Logo Boulangerie Fabrice" />
        <meta name="twitter:image" content="/icon" />
        <link rel="icon" href="/icon" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-icon" />
        <title>Boulangerie Fabrice - Souffelweyersheim</title>
      </head>
      <body
        className={`${fontSans.variable} ${fontMono.variable} ${fontAlsacien.variable} ${fontArtisan.variable} font-sans antialiased bg-boulangerie-cream`}
      >
        <SkipLinks />
        <Providers>
          <div className="min-h-screen flex flex-col">
            <main id="main-content" className="flex-1">
              {children}
            </main>
            <Footer />
            <AccessibilityButton />
          </div>
        </Providers>
      </body>
    </html>
  )
}
