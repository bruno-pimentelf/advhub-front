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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, Trash2, Palette } from 'lucide-react'
import { useFunis, useFunilTemplates } from '@/hooks/use-funis'
import { AnimatedGroup } from '@/components/ui/animated-group'

interface CreateFunnelModalProps {
  isOpen: boolean
  onClose: () => void
}

interface EstagioForm {
  name: string
  description: string
  color: string
  order: number
}

const coresDisponiveis = [
  '#FF5733', '#FFA500', '#33FF57', '#3357FF', '#8A2BE2',
  '#FF1493', '#00CED1', '#FFD700', '#FF6347', '#32CD32',
  '#1E90FF', '#FF69B4', '#20B2AA', '#FF4500', '#9370DB'
]

export function CreateFunnelModal({ isOpen, onClose }: CreateFunnelModalProps) {
  const [step, setStep] = useState<'template' | 'custom'>('template')
  const [selectedTemplate, setSelectedTemplate] = useState<string>('')
  const [funilData, setFunilData] = useState({
    name: '',
    description: ''
  })
  const [estagios, setEstagios] = useState<EstagioForm[]>([])
  const [isCreating, setIsCreating] = useState(false)

  const { createFunilWithStages, isCreatingFunil } = useFunis()
  const { getAllTemplates, getTemplate } = useFunilTemplates()

  const templates = getAllTemplates()

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId)
    const template = getTemplate(templateId)
    if (template) {
      setFunilData({
        name: template.name,
        description: template.description
      })
      setEstagios(template.estagios)
    }
  }

  const handleCreateFromTemplate = async () => {
    if (!selectedTemplate) return

    setIsCreating(true)
    try {
      await createFunilWithStages(funilData, estagios)
      onClose()
      resetForm()
    } catch (error) {
      console.error('Erro ao criar funil:', error)
    } finally {
      setIsCreating(false)
    }
  }

  const handleCreateCustom = async () => {
    if (!funilData.name.trim() || estagios.length === 0) return

    setIsCreating(true)
    try {
      await createFunilWithStages(funilData, estagios)
      onClose()
      resetForm()
    } catch (error) {
      console.error('Erro ao criar funil:', error)
    } finally {
      setIsCreating(false)
    }
  }

  const addEstagio = () => {
    const newEstagio: EstagioForm = {
      name: '',
      description: '',
      color: coresDisponiveis[estagios.length % coresDisponiveis.length],
      order: estagios.length
    }
    setEstagios([...estagios, newEstagio])
  }

  const removeEstagio = (index: number) => {
    const newEstagios = estagios.filter((_, i) => i !== index)
      .map((estagio, i) => ({ ...estagio, order: i }))
    setEstagios(newEstagios)
  }

  const updateEstagio = (index: number, field: keyof EstagioForm, value: string | number) => {
    const newEstagios = [...estagios]
    newEstagios[index] = { ...newEstagios[index], [field]: value }
    setEstagios(newEstagios)
  }

  const resetForm = () => {
    setStep('template')
    setSelectedTemplate('')
    setFunilData({ name: '', description: '' })
    setEstagios([])
  }

  const handleClose = () => {
    onClose()
    resetForm()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Criar Novo Funil</DialogTitle>
          <DialogDescription>
            Escolha um template ou crie um funil personalizado
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Step Selector */}
          <div className="flex gap-2">
            <Button
              variant={step === 'template' ? 'default' : 'outline'}
              onClick={() => setStep('template')}
              className="flex-1"
            >
              Usar Template
            </Button>
            <Button
              variant={step === 'custom' ? 'default' : 'outline'}
              onClick={() => setStep('custom')}
              className="flex-1"
            >
              Personalizado
            </Button>
          </div>

          {step === 'template' && (
            <div className="space-y-4">
              <Label>Templates Disponíveis</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {templates.map((template) => (
                  <Card
                    key={template.id}
                    className={`cursor-pointer transition-all ${
                      selectedTemplate === template.id
                        ? 'ring-2 ring-primary border-primary'
                        : 'hover:border-primary/50'
                    }`}
                    onClick={() => handleTemplateSelect(template.id)}
                  >
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {template.description}
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {template.estagios.map((estagio, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs"
                            style={{ backgroundColor: `${estagio.color}20`, color: estagio.color }}
                          >
                            {estagio.name}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {selectedTemplate && (
                <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
                  <h3 className="font-semibold">Preview do Funil</h3>
                  <div className="space-y-2">
                    <div>
                      <Label>Nome do Funil</Label>
                      <Input
                        value={funilData.name}
                        onChange={(e) => setFunilData({ ...funilData, name: e.target.value })}
                        placeholder="Nome do funil"
                      />
                    </div>
                    <div>
                      <Label>Descrição</Label>
                      <Textarea
                        value={funilData.description}
                        onChange={(e) => setFunilData({ ...funilData, description: e.target.value })}
                        placeholder="Descrição do funil"
                        rows={2}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Estágios</Label>
                    <div className="space-y-2">
                      {estagios.map((estagio, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 border rounded">
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: estagio.color }}
                          />
                          <span className="flex-1 text-sm">{estagio.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {estagio.description}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button
                    onClick={handleCreateFromTemplate}
                    disabled={isCreating || !funilData.name.trim()}
                    className="w-full"
                  >
                    {isCreating ? 'Criando...' : 'Criar Funil'}
                  </Button>
                </div>
              )}
            </div>
          )}

          {step === 'custom' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Nome do Funil</Label>
                <Input
                  value={funilData.name}
                  onChange={(e) => setFunilData({ ...funilData, name: e.target.value })}
                  placeholder="Ex: Funil Comercial"
                />
              </div>

              <div className="space-y-2">
                <Label>Descrição</Label>
                <Textarea
                  value={funilData.description}
                  onChange={(e) => setFunilData({ ...funilData, description: e.target.value })}
                  placeholder="Descreva o propósito deste funil"
                  rows={3}
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Estágios do Funil</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addEstagio}
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Adicionar Estágio
                  </Button>
                </div>

                <div className="space-y-3">
                  {estagios.map((estagio, index) => (
                    <Card key={index} className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-6 h-6 rounded-full border-2 border-white shadow-sm cursor-pointer"
                            style={{ backgroundColor: estagio.color }}
                            onClick={() => {
                              const currentIndex = coresDisponiveis.indexOf(estagio.color)
                              const nextIndex = (currentIndex + 1) % coresDisponiveis.length
                              updateEstagio(index, 'color', coresDisponiveis[nextIndex])
                            }}
                          />
                          <span className="text-sm font-medium text-muted-foreground">
                            {index + 1}
                          </span>
                        </div>

                        <div className="flex-1 space-y-2">
                          <Input
                            value={estagio.name}
                            onChange={(e) => updateEstagio(index, 'name', e.target.value)}
                            placeholder="Nome do estágio"
                            className="font-medium"
                          />
                          <Textarea
                            value={estagio.description}
                            onChange={(e) => updateEstagio(index, 'description', e.target.value)}
                            placeholder="Descrição do estágio"
                            rows={2}
                            className="text-sm"
                          />
                        </div>

                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeEstagio(index)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>

                {estagios.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>Nenhum estágio adicionado ainda.</p>
                    <p className="text-sm">Clique em "Adicionar Estágio" para começar.</p>
                  </div>
                )}

                <Button
                  onClick={handleCreateCustom}
                  disabled={isCreating || !funilData.name.trim() || estagios.length === 0}
                  className="w-full"
                >
                  {isCreating ? 'Criando...' : 'Criar Funil Personalizado'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
