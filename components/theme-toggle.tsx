'use client'
import React, { useCallback, useEffect, useState } from "react"
import { useTheme } from 'next-themes'
import { ThemeToggleButton } from "@/components/ui/shadcn-io/theme-toggle-button"

export function ThemeToggle() {
  const { setTheme, theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleThemeToggle = useCallback(() => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    
    // Use View Transitions API for smooth animation
    if ('startViewTransition' in document) {
      (document as any).startViewTransition(() => {
        setTheme(newTheme)
      })
    } else {
      setTheme(newTheme)
    }
  }, [theme, setTheme])

  const currentTheme = theme === 'system' ? 'light' : theme as 'light' | 'dark'

  if (!mounted) {
    return null
  }

  return (
    <ThemeToggleButton 
      theme={currentTheme}
      onClick={handleThemeToggle}
      variant="gif"
      url="https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExaHcybGt3ZWl2dmtramltYzlrYWgwZmgwaWZvMnJnYTBrd241dHl6dyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/YSZhVD5sOR7N0yjoy9/giphy.gif"
      className="hover:bg-primary-100 dark:bg-primary-900/30"
    />
  )
}
