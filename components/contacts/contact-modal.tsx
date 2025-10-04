'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Loader2, User, Phone, Mail, Camera } from 'lucide-react'
import { useContatos } from '@/hooks/use-contatos'
import type { Contato, CreateContatoRequest, UpdateContatoRequest } from '@/lib/api'

interface ContactModalProps {
  isOpen: boolean
  onClose: () => void
  contato?: Contato | null
  mode: 'create' | 'edit'
}

export function ContactModal({ isOpen, onClose, contato, mode }: ContactModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    photoUrl: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const { handleCreateContato, handleUpdateContato } = useContatos()

  // Preencher formulário quando editando
  useEffect(() => {
    if (mode === 'edit' && contato) {
      setFormData({
        name: contato.name,
        phone: contato.phone,
        email: contato.email || '',
        photoUrl: contato.photoUrl || ''
      })
    } else {
      setFormData({
        name: '',
        phone: '',
        email: '',
        photoUrl: ''
      })
    }
  }, [mode, contato, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (mode === 'create') {
        const data: CreateContatoRequest = {
          name: formData.name,
          phone: formData.phone,
          email: formData.email || '',
          photoUrl: formData.photoUrl || ''
        }
        await handleCreateContato(data)
      } else if (contato) {
        const data: UpdateContatoRequest = {
          name: formData.name,
          phone: formData.phone,
          email: formData.email || '',
          photoUrl: formData.photoUrl || ''
        }
        await handleUpdateContato(contato.id, data)
      }
      
      onClose()
    } catch (error) {
      console.error('Erro ao salvar contato:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      onClose()
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {mode === 'create' ? 'Novo Contato' : 'Editar Contato'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create' 
              ? 'Adicione um novo contato ao seu CRM' 
              : 'Atualize as informações do contato'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Nome completo"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Telefone *</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="+55 11 99999-9999"
                className="pl-10"
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="email@exemplo.com"
                className="pl-10"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="photoUrl">URL da Foto</Label>
            <div className="relative">
              <Camera className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="photoUrl"
                value={formData.photoUrl}
                onChange={(e) => handleInputChange('photoUrl', e.target.value)}
                placeholder="https://exemplo.com/foto.jpg"
                className="pl-10"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !formData.name || !formData.phone}
              className="flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <User className="h-4 w-4" />
                  {mode === 'create' ? 'Criar Contato' : 'Salvar Alterações'}
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
