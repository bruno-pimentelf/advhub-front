'use client'

import { ThemeProvider } from "@/components/theme-provider"

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange
      forcedTheme="light"
    >
      {children}
    </ThemeProvider>
  )
}
