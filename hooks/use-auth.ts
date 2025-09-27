'use client'

import { useAuth as useAuthContext } from '@/contexts/auth-context'

export function useAuth() {
  const { user, loading } = useAuthContext()

  return {
    // Estados básicos
    isAuthenticated: !!user,
    isLoading: loading,
    authUser: user,
    
    // Estados computados (baseados no Trillo Web)
    needsOnboarding: false, // Por enquanto, não temos onboarding
    isFullyAuthenticated: !!user && !false, // user && !needsOnboarding
    
    // Estado de inicialização
    hasJustOpened: loading, // Simplificado para este caso
  }
}
