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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, CreditCard, DollarSign, Tag } from 'lucide-react'
import { useCards } from '@/hooks/use-cards'
import type { Card } from '@/lib/api'

interface EditCardModalProps {
  isOpen: boolean
  onClose: () => void
  card: Card | null
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

export function EditCardModal({ isOpen, onClose, card }: EditCardModalProps) {
  const [formData, setFormData] = useState<{
    title: string;
    priority: 'baixa' | 'média' | 'alta';
    estimatedValue: string;
    serviceOfInterest: string;
    channel: 'Indicação' | 'Redes Sociais' | 'Google' | 'Comercial de TV' | 'Outdoor' | 'Outro';
  }>({
    title: '',
    priority: 'média',
    estimatedValue: '',
    serviceOfInterest: '',
    channel: 'Indicação'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const { handleUpdateCard } = useCards()

  // Preencher form com dados do card quando modal abre
  useEffect(() => {
    if (isOpen && card) {
      setFormData({
        title: card.title,
        priority: card.priority,
        estimatedValue: card.estimatedValue.toString(),
        serviceOfInterest: card.serviceOfInterest || '',
        channel: card.channel
      })
    }
  }, [isOpen, card])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!card) return
    
    setIsSubmitting(true)

    try {
      const updateData = {
        title: formData.title,
        priority: formData.priority,
        estimatedValue: parseFloat(formData.estimatedValue) || 0,
        serviceOfInterest: formData.serviceOfInterest || '',
        channel: formData.channel
      }
      
      await handleUpdateCard(card.id, updateData)
      onClose()
    } catch (error) {
      console.error('Erro ao atualizar card:', error)
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

  if (!card) return null

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Editar Card
          </DialogTitle>
          <DialogDescription>
            Edite as informações do card "{card.title}"
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
                  Salvando...
                </>
              ) : (
                <>
                  <CreditCard className="h-4 w-4" />
                  Salvar Alterações
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
