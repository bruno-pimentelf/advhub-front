import { useCallback } from 'react'

export const useSmoothScroll = () => {
  const scrollToElement = useCallback((elementId: string) => {
    const element = document.querySelector(elementId)
    if (element) {
      const headerHeight = 80 // Altura aproximada do header
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
      const offsetPosition = elementPosition - headerHeight

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
  }, [])

  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }, [])

  return { scrollToElement, scrollToTop }
}
