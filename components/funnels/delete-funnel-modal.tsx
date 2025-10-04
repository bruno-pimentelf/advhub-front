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
import { AlertTriangle, Trash2, Loader2 } from 'lucide-react'
import { useFunis } from '@/hooks/use-funis'
import type { Funil } from '@/lib/api'

interface DeleteFunnelModalProps {
  isOpen: boolean
  onClose: () => void
  funil: Funil | null
}

export function DeleteFunnelModal({ isOpen, onClose, funil }: DeleteFunnelModalProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const { handleDeleteFunil } = useFunis()

  const handleDelete = async () => {
    if (!funil) return

    setIsDeleting(true)
    try {
      await handleDeleteFunil(funil.id)
      onClose()
    } catch (error) {
      console.error('Erro ao deletar funil:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleClose = () => {
    if (!isDeleting) {
      onClose()
    }
  }

  if (!funil) return null

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <Trash2 className="h-5 w-5" />
            Deletar Funil
          </DialogTitle>
          <DialogDescription>
            Esta ação não pode ser desfeita. Todos os dados relacionados a este funil serão perdidos permanentemente.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Atenção:</strong> Você está prestes a deletar o funil "{funil.name}".
              <br />
              <br />
              <strong>Isso irá:</strong>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Deletar todos os estágios deste funil</li>
                <li>Remover todos os cards/leads associados</li>
                <li>Apagar o histórico de movimentações</li>
              </ul>
            </AlertDescription>
          </Alert>

          <div className="bg-muted p-3 rounded-lg">
            <p className="text-sm font-medium">Funil a ser deletado:</p>
            <p className="text-sm text-muted-foreground">{funil.name}</p>
            {funil.description && (
              <p className="text-xs text-muted-foreground mt-1">{funil.description}</p>
            )}
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
                  Deletar Funil
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
