import { useState } from 'react'
import { toast } from 'sonner'
import { useCreateUserMutation, useCreateClinicaMutation } from '@/lib/api'
import { useFunis } from './use-funis'

interface OnboardingData {
  name: string
  email: string
  clinicaName: string
  avatarUrl?: string
}

export function useOnboarding() {
  const [isLoading, setIsLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState<string>('')
  
  const [createUser] = useCreateUserMutation()
  const [createClinica] = useCreateClinicaMutation()
  const { createFunilWithStages } = useFunis()

  const completeOnboarding = async (data: OnboardingData) => {
    setIsLoading(true)
    
    try {
      // 1. Criar usuário
      setCurrentStep('Criando perfil...')
      await new Promise(resolve => setTimeout(resolve, 300)) // Pequeno delay para UX
      
      const userData = {
        name: data.name,
        email: data.email,
        avatarUrl: data.avatarUrl
      }
      
      const user = await createUser(userData).unwrap()
      toast.success("Perfil criado com sucesso!")

      // 2. Criar escritório
      setCurrentStep('Criando escritório...')
      await new Promise(resolve => setTimeout(resolve, 200))
      
      const clinicaData = {
        name: data.clinicaName
      }
      
      const clinica = await createClinica(clinicaData).unwrap()
      toast.success("Escritório criado com sucesso!")

      // 3. Criar funil padrão com estágios
      setCurrentStep('Configurando funil...')
      await new Promise(resolve => setTimeout(resolve, 200))
      
      const funilData = {
        name: "Funil Comercial",
        description: "Funil principal de vendas"
      }
      
      const estagiosPadrao = [
        { name: "Novo Lead", color: "#FF5733", order: 0, description: "Primeiro contato com o cliente" },
        { name: "Interessado", color: "#FFA500", order: 1, description: "Cliente demonstrou interesse" },
        { name: "Agendado", color: "#33FF57", order: 2, description: "Consulta agendada" },
        { name: "Consulta Realizada", color: "#3357FF", order: 3, description: "Consulta foi realizada" },
        { name: "Fechado", color: "#8A2BE2", order: 4, description: "Venda finalizada" }
      ]

      setCurrentStep('Criando funil e estágios...')
      const { funil, estagios } = await createFunilWithStages(funilData, estagiosPadrao)

      setCurrentStep('Finalizando configuração...')
      toast.success("Onboarding completo!")

      return {
        user,
        clinica,
        funil,
        estagios
      }

    } catch (error: any) {
      console.error('Erro no onboarding:', error)
      toast.error(error.message || "Erro durante o onboarding")
      throw error
    } finally {
      setIsLoading(false)
      setCurrentStep('')
    }
  }

  return {
    completeOnboarding,
    isLoading,
    currentStep
  }
}
