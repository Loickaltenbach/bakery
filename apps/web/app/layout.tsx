import { Geist, Geist_Mono, Crimson_Text, Playfair_Display } from "next/font/google"

import "@workspace/ui/globals.css"
import "../styles/boulangerie-theme.css"
import { Providers } from "@/components/providers"

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
      </head>
      <body
        className={`${fontSans.variable} ${fontMono.variable} ${fontAlsacien.variable} ${fontArtisan.variable} font-sans antialiased bg-boulangerie-cream`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
