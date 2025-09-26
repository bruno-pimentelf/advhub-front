"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Progress } from '@/components/ui/progress'
import { Card, CardContent } from '@/components/ui/card'
import { Highlighter } from '@/components/ui/highlighter'
import { CheckCircle, ArrowRight, ArrowLeft, User, Building2, TrendingUp, MessageSquare } from 'lucide-react'
import { sendApplicationEmail } from '@/lib/email-service'

const steps = [
  {
    id: 1,
    title: "Informações Pessoais",
    description: "Vamos começar com seus dados básicos",
    icon: User
  },
  {
    id: 2,
    title: "Dados da Clínica",
    description: "Conte-nos sobre sua clínica",
    icon: Building2
  },
  {
    id: 3,
    title: "Informações Financeiras",
    description: "Entenda melhor seu negócio",
    icon: TrendingUp
  },
  {
    id: 4,
    title: "Expectativas",
    description: "O que você espera do Ailum?",
    icon: MessageSquare
  }
]

const revenueRanges = [
  { value: "0-20k", label: "R$ 0 - R$ 20.000" },
  { value: "20k-50k", label: "R$ 20.000 - R$ 50.000" },
  { value: "50k-100k", label: "R$ 50.000 - R$ 100.000" },
  { value: "100k-500k", label: "R$ 100.000 - R$ 500.000" },
  { value: "500k+", label: "Acima de R$ 500.000" }
]

interface FormData {
  // Step 1
  name: string
  email: string
  phone: string
  
  // Step 2
  clinicName: string
  specialties: string
  monthlyAppointments: string
  hasSecretary: string
  
  // Step 3
  paidMedia: string
  monthlyInvestment: string
  monthlyRevenue: string
  
  // Step 4
  mainChallenges: string
  improvements: string
  whySelected: string
}

interface MultiStepApplicationFormProps {
  isOpen: boolean
  onClose: () => void
}

export default function MultiStepApplicationForm({ isOpen, onClose }: MultiStepApplicationFormProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    clinicName: '',
    specialties: '',
    monthlyAppointments: '',
    hasSecretary: '',
    paidMedia: '',
    monthlyInvestment: '',
    monthlyRevenue: '',
    mainChallenges: '',
    improvements: '',
    whySelected: ''
  })

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      const success = await sendApplicationEmail(formData)
      
      if (success) {
        setSubmitStatus('success')
        console.log('Formulário enviado com sucesso!')
        // Fechar o modal após 2 segundos
        setTimeout(() => {
          onClose()
          // Reset form
          setFormData({
            name: '',
            email: '',
            phone: '',
            clinicName: '',
            specialties: '',
            monthlyAppointments: '',
            hasSecretary: '',
            paidMedia: '',
            monthlyInvestment: '',
            monthlyRevenue: '',
            mainChallenges: '',
            improvements: '',
            whySelected: ''
          })
          setCurrentStep(1)
          setSubmitStatus('idle')
        }, 2000)
      } else {
        setSubmitStatus('error')
      }
    } catch (error) {
      console.error('Erro ao enviar formulário:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return formData.name && formData.email && formData.phone
      case 2:
        return formData.clinicName && formData.specialties && formData.monthlyAppointments && formData.hasSecretary
      case 3:
        return formData.paidMedia && formData.monthlyRevenue
      case 4:
        return formData.mainChallenges && formData.improvements && formData.whySelected
      default:
        return false
    }
  }

  const progress = (currentStep / steps.length) * 100

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nome completo *</Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                  className="border-[#04CDD4]/20 focus:border-[#04CDD4]"
                  placeholder="Seu nome completo"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                  className="border-[#04CDD4]/20 focus:border-[#04CDD4]"
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telefone/WhatsApp *</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                required
                className="border-[#04CDD4]/20 focus:border-[#04CDD4]"
                placeholder="(11) 99999-9999"
              />
            </div>
          </motion.div>
        )

      case 2:
        return (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="clinicName">Nome da clínica/consultório *</Label>
                <Input
                  id="clinicName"
                  type="text"
                  value={formData.clinicName}
                  onChange={(e) => handleInputChange('clinicName', e.target.value)}
                  required
                  className="border-[#04CDD4]/20 focus:border-[#04CDD4]"
                  placeholder="Nome da sua clínica"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="monthlyAppointments">Atendimentos por mês *</Label>
                <Input
                  id="monthlyAppointments"
                  type="number"
                  value={formData.monthlyAppointments}
                  onChange={(e) => handleInputChange('monthlyAppointments', e.target.value)}
                  required
                  className="border-[#04CDD4]/20 focus:border-[#04CDD4]"
                  placeholder="Ex: 150"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialties">Especialidades *</Label>
              <Input
                id="specialties"
                type="text"
                value={formData.specialties}
                onChange={(e) => handleInputChange('specialties', e.target.value)}
                required
                placeholder="Ex: Cardiologia, Odontologia, Estética..."
                className="border-[#04CDD4]/20 focus:border-[#04CDD4]"
              />
            </div>

            <div className="space-y-3">
              <Label>Possui secretária? *</Label>
              <RadioGroup
                value={formData.hasSecretary}
                onValueChange={(value) => handleInputChange('hasSecretary', value)}
                required
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="sim" id="secretary-sim" />
                  <Label htmlFor="secretary-sim">Sim</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="nao" id="secretary-nao" />
                  <Label htmlFor="secretary-nao">Não</Label>
                </div>
              </RadioGroup>
            </div>
          </motion.div>
        )

      case 3:
        return (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label>Investe em mídia paga? *</Label>
                <RadioGroup
                  value={formData.paidMedia}
                  onValueChange={(value) => handleInputChange('paidMedia', value)}
                  required
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="sim" id="paid-media-sim" />
                    <Label htmlFor="paid-media-sim">Sim</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="nao" id="paid-media-nao" />
                    <Label htmlFor="paid-media-nao">Não</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="monthlyInvestment">Faixa de investimento mensal</Label>
                <Input
                  id="monthlyInvestment"
                  type="text"
                  value={formData.monthlyInvestment}
                  onChange={(e) => handleInputChange('monthlyInvestment', e.target.value)}
                  placeholder="Ex: R$ 2.000 - R$ 5.000"
                  className="border-[#04CDD4]/20 focus:border-[#04CDD4]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="monthlyRevenue">Qual é a média de faturamento mensal do seu consultório? *</Label>
              <Select
                value={formData.monthlyRevenue}
                onValueChange={(value) => handleInputChange('monthlyRevenue', value)}
                required
              >
                <SelectTrigger className="border-[#04CDD4]/20 focus:border-[#04CDD4]">
                  <SelectValue placeholder="Selecione uma faixa" />
                </SelectTrigger>
                <SelectContent>
                  {revenueRanges.map((range) => (
                    <SelectItem key={range.value} value={range.value}>
                      {range.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </motion.div>
        )

      case 4:
        return (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="mainChallenges">Principais dores e desafios *</Label>
                <Textarea
                  id="mainChallenges"
                  value={formData.mainChallenges}
                  onChange={(e) => handleInputChange('mainChallenges', e.target.value)}
                  required
                  rows={5}
                  className="border-[#04CDD4]/20 focus:border-[#04CDD4]"
                  placeholder="Descreva os principais desafios da sua clínica..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="improvements">O que gostaria de melhorar com o Ailum? *</Label>
                <Textarea
                  id="improvements"
                  value={formData.improvements}
                  onChange={(e) => handleInputChange('improvements', e.target.value)}
                  required
                  rows={5}
                  className="border-[#04CDD4]/20 focus:border-[#04CDD4]"
                  placeholder="O que você espera melhorar na sua clínica..."
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="whySelected">Por que sua clínica deve ser selecionada para ter acesso ao Ailum? *</Label>
              <Textarea
                id="whySelected"
                value={formData.whySelected}
                onChange={(e) => handleInputChange('whySelected', e.target.value)}
                required
                rows={4}
                className="border-[#04CDD4]/20 focus:border-[#04CDD4]"
                placeholder="Conte-nos por que sua clínica merece ter acesso ao Ailum..."
              />
            </div>
          </motion.div>
        )

      default:
        return null
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl w-[90vw] max-h-[90vh] overflow-y-auto p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-center">
            <Highlighter color="#04CDD4" action="highlight">Aplique-se</Highlighter> para ter acesso ao Ailum
          </DialogTitle>
        </DialogHeader>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Passo {currentStep} de {steps.length}</span>
            <span>{Math.round(progress)}% concluído</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Indicator */}
        <div className="flex flex-wrap justify-center gap-2 py-4 px-4">
          {steps.map((step) => (
            <div
              key={step.id}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 ${
                currentStep === step.id
                  ? 'bg-[#04CDD4]/10 text-[#04CDD4] border border-[#04CDD4]/20'
                  : currentStep > step.id
                  ? 'bg-green-100 text-green-600'
                  : 'bg-gray-100 text-gray-500'
              }`}
            >
              {currentStep > step.id ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <step.icon className="w-4 h-4" />
              )}
              <span className="text-sm font-medium hidden md:block">{step.title}</span>
            </div>
          ))}
        </div>

        {/* Current Step Info */}
        <div className="text-center py-4">
          <h3 className="text-xl font-semibold text-foreground mb-2">
            {steps[currentStep - 1].title}
          </h3>
          <p className="text-muted-foreground">
            {steps[currentStep - 1].description}
          </p>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="max-w-4xl mx-auto px-4">
            <AnimatePresence mode="wait">
              {renderStepContent()}
            </AnimatePresence>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6 border-t px-4">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Anterior</span>
            </Button>

            {currentStep < steps.length ? (
              <Button
                type="button"
                onClick={nextStep}
                disabled={!isStepValid(currentStep)}
                className="flex items-center space-x-2 bg-gradient-to-r from-[#04CDD4] to-[#03a8a8] hover:from-[#03a8a8] hover:to-[#04CDD4]"
              >
                <span>Próximo</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={!isStepValid(currentStep) || isSubmitting}
                className="flex items-center space-x-2 bg-gradient-to-r from-[#04CDD4] to-[#03a8a8] hover:from-[#03a8a8] hover:to-[#04CDD4]"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>ENVIANDO...</span>
                  </>
                ) : submitStatus === 'success' ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span>ENVIADO!</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span>APLIQUE-SE</span>
                  </>
                )}
              </Button>
            )}
          </div>
        </form>

        {/* Status Messages */}
        {submitStatus === 'error' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mx-4">
            <p className="text-sm text-red-600 text-center">
              <strong>Erro ao enviar aplicação.</strong> Tente novamente ou entre em contato conosco.
            </p>
          </div>
        )}

        {submitStatus === 'success' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mx-4">
            <p className="text-sm text-green-600 text-center">
              <strong>Aplicação enviada com sucesso!</strong> Entraremos em contato em breve.
            </p>
          </div>
        )}

        {/* Info Text */}
        <div className="bg-gradient-to-r from-[#04CDD4]/5 to-[#03a8a8]/5 rounded-lg p-4 border border-[#04CDD4]/20 mx-4">
          <p className="text-sm text-muted-foreground text-center">
            O <strong>AILUM</strong> foi criado para clínicas que desejam elevar seus resultados. 
            Avaliamos cuidadosamente cada aplicação para garantir que sua clínica tenha o perfil ideal.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
