'use client'

import { Loader2, AlertCircle, RefreshCw } from 'lucide-react'
import { Button } from './button'
import { Alert, AlertDescription } from './alert'

interface LoadingStateProps {
  message?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function LoadingState({ 
  message = "Carregando...", 
  size = 'md',
  className = ""
}: LoadingStateProps) {
  const sizeClasses = {
    sm: 'h-16',
    md: 'h-32',
    lg: 'h-64'
  }

  return (
    <div className={`flex items-center justify-center ${sizeClasses[size]} ${className}`}>
      <div className="flex items-center gap-2 text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-sm">{message}</span>
      </div>
    </div>
  )
}

interface ErrorStateProps {
  title?: string
  message?: string
  onRetry?: () => void
  retryLabel?: string
  className?: string
}

export function ErrorState({ 
  title = "Algo deu errado",
  message = "Ocorreu um erro inesperado. Tente novamente.",
  onRetry,
  retryLabel = "Tentar novamente",
  className = ""
}: ErrorStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center h-64 text-center ${className}`}>
      <Alert variant="destructive" className="max-w-md">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <div className="space-y-2">
            <p className="font-medium">{title}</p>
            <p className="text-sm">{message}</p>
            {onRetry && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRetry}
                className="mt-2"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                {retryLabel}
              </Button>
            )}
          </div>
        </AlertDescription>
      </Alert>
    </div>
  )
}

interface EmptyStateProps {
  title?: string
  message?: string
  actionLabel?: string
  onAction?: () => void
  icon?: React.ReactNode
  className?: string
}

export function EmptyState({ 
  title = "Nenhum item encontrado",
  message = "Não há dados para exibir no momento.",
  actionLabel,
  onAction,
  icon,
  className = ""
}: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center h-64 text-center ${className}`}>
      <div className="text-muted-foreground mb-4">
        {icon && <div className="mb-4 flex justify-center">{icon}</div>}
        <p className="text-lg font-medium">{title}</p>
        <p className="text-sm">{message}</p>
      </div>
      {actionLabel && onAction && (
        <Button onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
