'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { AlertTriangle, Trash2, Loader2, CreditCard, DollarSign, Tag } from 'lucide-react'
import { useCards } from '@/hooks/use-cards'
import type { Card } from '@/lib/api'

interface DeleteCardModalProps {
  isOpen: boolean
  onClose: () => void
  card: Card | null
}

const getPriorityColor = (priority: Card['priority']) => {
  switch (priority) {
    case 'alta':
      return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800/50'
    case 'média':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800/50'
    case 'baixa':
      return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800/50'
    default:
      return 'bg-muted text-muted-foreground border-border'
  }
}

export function DeleteCardModal({ isOpen, onClose, card }: DeleteCardModalProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const { handleDeleteCard } = useCards()

  const handleDelete = async () => {
    if (!card) return

    setIsDeleting(true)
    try {
      await handleDeleteCard(card.id)
      onClose()
    } catch (error) {
      console.error('Erro ao deletar card:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleClose = () => {
    if (!isDeleting) {
      onClose()
    }
  }

  if (!card) return null

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <Trash2 className="h-5 w-5" />
            Deletar Card
          </DialogTitle>
          <DialogDescription>
            Esta ação não pode ser desfeita. O card será removido permanentemente.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Atenção:</strong> Você está prestes a deletar o card "{card.title}".
              <br />
              <br />
              <strong>Isso irá:</strong>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Remover o card do funil</li>
                <li>Apagar o histórico de movimentações</li>
                <li>Perder todas as informações do card</li>
              </ul>
            </AlertDescription>
          </Alert>

          <div className="bg-muted p-3 rounded-lg">
            <p className="text-sm font-medium mb-2">Card a ser deletado:</p>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">{card.title}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Badge className={`${getPriorityColor(card.priority)} border text-xs`}>
                  {card.priority}
                </Badge>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <DollarSign className="h-3 w-3" />
                  R$ {card.estimatedValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
              </div>
              
              {card.serviceOfInterest && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Tag className="h-3 w-3" />
                  {card.serviceOfInterest}
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isDeleting}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex items-center gap-2"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Deletando...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4" />
                  Deletar Card
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
