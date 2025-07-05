"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { PanierProvider } from "@/contexts/PanierContext"
import { CommandeProvider } from "@/contexts/CommandeContext"
import { PaiementProvider } from "@/contexts/PaiementContext"
import { AuthProvider } from "@/contexts/AuthContext"
import { ThemeProvider } from "@/contexts/ThemeContext"
import { FavorisProvider } from "@/contexts/FavorisContext"
import { CommandesRapidesProvider } from "@/contexts/CommandesRapidesContext"
import { OfflineProvider } from "@/contexts/OfflineContext"
import { AccessibilityProvider } from "@/components/ui/accessibility"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      enableColorScheme
    >
      <AccessibilityProvider>
        <ThemeProvider>
          <AuthProvider>
            <OfflineProvider>
              <FavorisProvider>
                <CommandesRapidesProvider>
                  <PanierProvider>
                    <PaiementProvider>
                      <CommandeProvider>
                        {children}
                      </CommandeProvider>
                    </PaiementProvider>
                  </PanierProvider>
                </CommandesRapidesProvider>
              </FavorisProvider>
            </OfflineProvider>
          </AuthProvider>
        </ThemeProvider>
      </AccessibilityProvider>
    </NextThemesProvider>
  )
}
