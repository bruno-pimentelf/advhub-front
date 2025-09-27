'use client'

import { useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context'

export function useAuthToken() {
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      // Quando o usuário está logado, define o token nos cookies
      user.getIdToken().then((token) => {
        // Define o cookie com configurações mais permissivas para desenvolvimento
        document.cookie = `auth-token=${token}; path=/; max-age=3600; samesite=lax`
      }).catch((error) => {
        console.error('Erro ao obter token:', error)
      })
    } else {
      // Quando o usuário não está logado, remove o token dos cookies
      document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    }
  }, [user])

  return { user }
}
