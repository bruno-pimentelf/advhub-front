"use client"

import { useEffect, useRef, useState } from "react"
import type React from "react"
import { useInView } from "motion/react"
import { annotate } from "rough-notation"
import { type RoughAnnotation } from "rough-notation/lib/model"

type AnnotationAction =
  | "highlight"
  | "underline"
  | "box"
  | "circle"
  | "strike-through"
  | "crossed-off"
  | "bracket"

interface HighlighterProps {
  children: React.ReactNode
  action?: AnnotationAction
  color?: string
  strokeWidth?: number
  animationDuration?: number
  iterations?: number
  padding?: number
  multiline?: boolean
  isView?: boolean
}

export function Highlighter({
  children,
  action = "highlight",
  color = "#ffd1dc",
  strokeWidth = 1.5,
  animationDuration = 600,
  iterations = 2,
  padding = 2,
  multiline = true,
  isView = false,
}: HighlighterProps) {
  const elementRef = useRef<HTMLSpanElement>(null)
  const annotationRef = useRef<RoughAnnotation | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  const isInView = useInView(elementRef, {
    once: true,
    margin: "-10%",
  })

  // If isView is false, always show. If isView is true, wait for inView
  const shouldShow = !isView || isInView

  // Detect mobile devices
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    if (!shouldShow) return

    const element = elementRef.current
    if (!element) return

    // On mobile, use a simpler approach with CSS instead of rough-notation
    if (isMobile) {
      return
    }

    const annotationConfig = {
      type: action,
      color,
      strokeWidth,
      animationDuration,
      iterations,
      padding,
      multiline,
    }

    const annotation = annotate(element, annotationConfig)

    annotationRef.current = annotation
    annotationRef.current.show()

    // Use a more conservative resize observer approach
    let resizeTimeout: NodeJS.Timeout
    const resizeObserver = new ResizeObserver(() => {
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(() => {
        if (annotationRef.current) {
          annotationRef.current.hide()
          setTimeout(() => {
            if (annotationRef.current) {
              annotationRef.current.show()
            }
          }, 50)
        }
      }, 100)
    })

    resizeObserver.observe(element)

    return () => {
      clearTimeout(resizeTimeout)
      if (element && annotationRef.current) {
        annotationRef.current.remove()
        resizeObserver.disconnect()
      }
    }
  }, [
    shouldShow,
    action,
    color,
    strokeWidth,
    animationDuration,
    iterations,
    padding,
    multiline,
    isMobile,
  ])

  // Mobile fallback with CSS styling
  const getMobileStyle = () => {
    if (!isMobile) return {}
    
    const baseStyle = {
      display: 'inline-block',
      position: 'relative' as const,
      zIndex: 1,
      wordBreak: 'break-word' as const,
      hyphens: 'auto' as const,
    }
    
    switch (action) {
      case "highlight":
        return {
          ...baseStyle,
          backgroundColor: color,
          padding: `${padding}px`,
          borderRadius: '4px',
          lineHeight: '1.2'
        }
      case "underline":
        return {
          ...baseStyle,
          borderBottom: `3px solid ${color}`,
          paddingBottom: '2px',
          textDecoration: 'none'
        }
      case "box":
        return {
          ...baseStyle,
          border: `2px solid ${color}`,
          padding: `${padding}px`,
          borderRadius: '4px'
        }
      default:
        return {
          ...baseStyle,
          backgroundColor: color,
          padding: `${padding}px`,
          borderRadius: '4px',
          lineHeight: '1.2'
        }
    }
  }

  return (
    <span 
      ref={elementRef} 
      className="relative inline-block bg-transparent break-words"
      style={getMobileStyle()}
    >
      {children}
    </span>
  )
}
