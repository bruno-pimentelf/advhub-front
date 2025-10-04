'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

interface AuthCheckButtonProps {
  children: React.ReactNode
  className?: string
  size?: "default" | "sm" | "lg" | "icon"
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  asChild?: boolean
}

export function AuthCheckButton({ 
  children, 
  className, 
  size = "sm",
  variant = "outline",
  asChild = false,
  ...props 
}: AuthCheckButtonProps) {
  const [isChecking, setIsChecking] = useState(false)
  const { user, loading } = useAuth()
  const router = useRouter()

  const handleClick = async () => {
    if (loading) return // Se ainda está carregando, não faz nada
    
    setIsChecking(true)
    
    // Pequeno delay para mostrar o loading
    await new Promise(resolve => setTimeout(resolve, 500))
    
    if (user) {
      // Usuário já está logado, redireciona para a plataforma
      router.push('/calendar')
    } else {
      // Usuário não está logado, redireciona para login
      router.push('/login')
    }
    
    setIsChecking(false)
  }

  if (asChild) {
    return (
      <Button
        onClick={handleClick}
        disabled={loading || isChecking}
        className={className}
        size={size}
        variant={variant}
        {...props}
      >
        {isChecking ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Verificando...
          </>
        ) : (
          children
        )}
      </Button>
    )
  }

  return (
    <Button
      onClick={handleClick}
      disabled={loading || isChecking}
      className={className}
      size={size}
      variant={variant}
      {...props}
    >
      {isChecking ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Verificando...
        </>
      ) : (
        children
      )}
    </Button>
  )
}
