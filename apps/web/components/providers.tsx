"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { PanierProvider } from "@/contexts/PanierContext"
import { CommandeProvider } from "@/contexts/CommandeContext"
import { AuthProvider } from "@/contexts/AuthContext"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      enableColorScheme
    >
      <AuthProvider>
        <PanierProvider>
          <CommandeProvider>
            {children}
          </CommandeProvider>
        </PanierProvider>
      </AuthProvider>
    </NextThemesProvider>
  )
}
