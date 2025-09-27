'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { useAuthToken } from '@/hooks/use-auth-token'

interface AuthWrapperProps {
  children: React.ReactNode
}

export function AuthWrapper({ children }: AuthWrapperProps) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [hasJustOpened, setHasJustOpened] = useState(true)
  
  // Gerencia o token de autenticação nos cookies
  useAuthToken()

  // Estados computados baseados no Trillo Web
  const isAuthenticated = !!user
  const isLoading = loading
  const needsOnboarding = false // Por enquanto, não temos onboarding
  const isFullyAuthenticated = isAuthenticated && !needsOnboarding

  // Classificação de rotas
  const authRoutes = ['/login']
  const isAuthRoute = authRoutes.includes(pathname)
  const isOnboardingRoute = pathname.startsWith('/onboarding')
  const isProtectedRoute = pathname.startsWith('/calendar') || 
                          pathname.startsWith('/chats') || 
                          pathname.startsWith('/contacts') ||
                          pathname.startsWith('/funnel-explorer') ||
                          pathname.startsWith('/funnels') ||
                          pathname.startsWith('/messages') ||
                          pathname.startsWith('/settings')

  // Lógica de redirecionamento baseada no Trillo Web
  useEffect(() => {
    // Não redireciona durante loading ou inicialização
    if (isLoading || hasJustOpened) return

    if (isFullyAuthenticated) {
      // Usuário totalmente autenticado
      if (isAuthRoute) {
        router.push('/calendar')
      } else if (isOnboardingRoute) {
        router.push('/calendar')
      }
      // Se estiver em rotas protegidas, permanece lá
    } else if (isAuthenticated && needsOnboarding) {
      // Usuário autenticado mas precisa de onboarding
      if (!isOnboardingRoute) {
        router.push('/onboarding')
      }
    } else if (!isAuthenticated) {
      // Usuário não autenticado
      if (isProtectedRoute || isOnboardingRoute) {
        router.push('/login')
      }
    }
  }, [isAuthenticated, needsOnboarding, isFullyAuthenticated, pathname, isLoading, hasJustOpened, router])

  // Controla o estado de inicialização
  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        setHasJustOpened(false)
      }, 100) // Pequeno delay para evitar flash
      
      return () => clearTimeout(timer)
    }
  }, [isLoading])

  // Mostra loading durante inicialização
  if (isLoading || hasJustOpened) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return <>{children}</>
}
