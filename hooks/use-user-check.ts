import { useEffect, useState } from 'react'
import { useCheckUserExistsQuery } from '@/lib/api'
import { useAuth } from '@/contexts/auth-context'
import { useRouter } from 'next/navigation'

export function useUserCheck() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [shouldCheckUser, setShouldCheckUser] = useState(false)
  
  const { 
    data: userExistsData, 
    isLoading: checkingUser, 
    error: userCheckError 
  } = useCheckUserExistsQuery(undefined, {
    skip: !shouldCheckUser || !user
  })

  useEffect(() => {
    if (!authLoading && user) {
      setShouldCheckUser(true)
    }
  }, [authLoading, user])

  useEffect(() => {
    if (userExistsData && !checkingUser) {
      if (!userExistsData.exists) {
        // Usuário não existe no backend, redirecionar para onboarding
        router.push('/signup')
      } else {
        // Usuário existe, pode acessar o dashboard
        // O AuthWrapper já gerencia isso
      }
    }
  }, [userExistsData, checkingUser, router])

  return {
    userExists: userExistsData?.exists,
    checkingUser: checkingUser || authLoading,
    userCheckError
  }
}
