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
import { AlertTriangle, Trash2, Loader2, User } from 'lucide-react'
import { useContatos } from '@/hooks/use-contatos'
import type { Contato } from '@/lib/api'

interface DeleteContactModalProps {
  isOpen: boolean
  onClose: () => void
  contato: Contato | null
}

export function DeleteContactModal({ isOpen, onClose, contato }: DeleteContactModalProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const { handleDeleteContato } = useContatos()

  const handleDelete = async () => {
    if (!contato) return

    setIsDeleting(true)
    try {
      await handleDeleteContato(contato.id)
      onClose()
    } catch (error) {
      console.error('Erro ao deletar contato:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleClose = () => {
    if (!isDeleting) {
      onClose()
    }
  }

  if (!contato) return null

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <Trash2 className="h-5 w-5" />
            Deletar Contato
          </DialogTitle>
          <DialogDescription>
            Esta ação não pode ser desfeita. Todos os dados relacionados a este contato serão perdidos permanentemente.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Atenção:</strong> Você está prestes a deletar o contato "{contato.name}".
              <br />
              <br />
              <strong>Isso irá:</strong>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Deletar todas as informações do contato</li>
                <li>Remover todos os cards associados</li>
                <li>Apagar o histórico de interações</li>
              </ul>
            </AlertDescription>
          </Alert>

          <div className="bg-muted p-3 rounded-lg">
            <p className="text-sm font-medium">Contato a ser deletado:</p>
            <div className="flex items-center gap-3 mt-2">
              <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">{contato.name}</p>
                <p className="text-xs text-muted-foreground">{contato.phone}</p>
                {contato.email && (
                  <p className="text-xs text-muted-foreground">{contato.email}</p>
                )}
              </div>
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
                  Deletar Contato
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
