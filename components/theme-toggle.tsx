'use client'
import React, { useCallback, useEffect, useState } from "react"
import { useTheme } from 'next-themes'
import { ThemeToggleButton, useThemeTransition } from "@/components/ui/shadcn-io/theme-toggle-button"

export function ThemeToggle() {
  const { setTheme, theme } = useTheme()
  const { startTransition } = useThemeTransition()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleThemeToggle = useCallback(() => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    
    startTransition(() => {
      setTheme(newTheme)
    })
  }, [theme, setTheme, startTransition])

  const currentTheme = theme === 'system' ? 'light' : theme as 'light' | 'dark'

  if (!mounted) {
    return null
  }

  return (
    <ThemeToggleButton 
      theme={currentTheme}
      onClick={handleThemeToggle}
      variant="circle"
      start="center"
      className="hover:bg-primary-100 dark:bg-primary-900/30"
    />
  )
}
