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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, CreditCard, DollarSign, Tag, MessageSquare } from 'lucide-react'
import { useCards } from '@/hooks/use-cards'
import { useFunis } from '@/hooks/use-funis'
import type { CreateCardRequest } from '@/lib/api'

interface CreateCardModalProps {
  isOpen: boolean
  onClose: () => void
  contatoId: string
  funilId: string
}

const PRIORITY_OPTIONS = [
  { value: 'baixa', label: 'Baixa' },
  { value: 'média', label: 'Média' },
  { value: 'alta', label: 'Alta' }
] as const

const CHANNEL_OPTIONS = [
  { value: 'Indicação', label: 'Indicação' },
  { value: 'Redes Sociais', label: 'Redes Sociais' },
  { value: 'Google', label: 'Google' },
  { value: 'Comercial de TV', label: 'Comercial de TV' },
  { value: 'Outdoor', label: 'Outdoor' },
  { value: 'Outro', label: 'Outro' }
] as const

export function CreateCardModal({ isOpen, onClose, contatoId, funilId }: CreateCardModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    priority: 'média' as const,
    estimatedValue: '',
    serviceOfInterest: '',
    channel: 'Indicação' as const
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const { handleCreateCard } = useCards()
  const { funis } = useFunis()

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        title: '',
        priority: 'média',
        estimatedValue: '',
        serviceOfInterest: '',
        channel: 'Indicação'
      })
    }
  }, [isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const data: CreateCardRequest = {
        contatoId,
        funilId,
        title: formData.title,
        priority: formData.priority,
        estimatedValue: parseFloat(formData.estimatedValue) || 0,
        serviceOfInterest: formData.serviceOfInterest || '',
        channel: formData.channel
      }
      
      await handleCreateCard(data)
      onClose()
    } catch (error) {
      console.error('Erro ao criar card:', error)
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

  const selectedFunil = funis.find(f => f.id === funilId)

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Novo Card
          </DialogTitle>
          <DialogDescription>
            Crie um novo card para este contato no funil "{selectedFunil?.name || 'Selecionado'}"
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título do Card *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Ex: Consulta Cardiológica - João Silva"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Prioridade *</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => handleInputChange('priority', value)}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PRIORITY_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="estimatedValue">Valor Estimado *</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="estimatedValue"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.estimatedValue}
                  onChange={(e) => handleInputChange('estimatedValue', e.target.value)}
                  placeholder="0,00"
                  className="pl-10"
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="serviceOfInterest">Serviço de Interesse</Label>
            <div className="relative">
              <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="serviceOfInterest"
                value={formData.serviceOfInterest}
                onChange={(e) => handleInputChange('serviceOfInterest', e.target.value)}
                placeholder="Ex: Consulta Cardiológica"
                className="pl-10"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="channel">Canal de Origem *</Label>
            <Select
              value={formData.channel}
              onValueChange={(value) => handleInputChange('channel', value)}
              disabled={isSubmitting}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CHANNEL_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
              disabled={isSubmitting || !formData.title || !formData.estimatedValue}
              className="flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Criando...
                </>
              ) : (
                <>
                  <CreditCard className="h-4 w-4" />
                  Criar Card
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
