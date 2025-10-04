import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { 
  useGetFunisQuery,
  useGetFunilQuery,
  useCreateFunilMutation,
  useUpdateFunilMutation,
  useDeleteFunilMutation,
  useGetEstagiosByFunilQuery,
  useCreateEstagioMutation,
  useUpdateEstagioMutation,
  useDeleteEstagioMutation,
  type Funil,
  type Estagio,
  type CreateFunilRequest,
  type CreateEstagioRequest
} from '@/lib/api'

// Hook para gerenciar funis
export function useFunis() {
  const [selectedFunilId, setSelectedFunilId] = useState<string | null>(null)
  
  const {
    data: funis = [],
    isLoading: isLoadingFunis,
    error: funisError,
    refetch: refetchFunis
  } = useGetFunisQuery()

  const {
    data: selectedFunil,
    isLoading: isLoadingSelectedFunil,
    error: selectedFunilError
  } = useGetFunilQuery(selectedFunilId!, {
    skip: !selectedFunilId
  })

  const [createFunil, { isLoading: isCreatingFunil }] = useCreateFunilMutation()
  const [updateFunil, { isLoading: isUpdatingFunil }] = useUpdateFunilMutation()
  const [deleteFunil, { isLoading: isDeletingFunil }] = useDeleteFunilMutation()
  const [createEstagio] = useCreateEstagioMutation()

  // Efeito para reagir às mudanças na lista de funis
  useEffect(() => {
    // Se o funil selecionado não existe mais na lista, selecionar outro
    if (selectedFunilId && !funis.find(funil => funil.id === selectedFunilId)) {
      if (funis.length > 0) {
        // Tentar manter a posição, mas com verificações de segurança
        const currentIndex = funis.findIndex(funil => funil.id === selectedFunilId)
        let nextIndex = currentIndex
        
        // Se o índice é inválido, usar o primeiro disponível
        if (nextIndex < 0 || nextIndex >= funis.length) {
          nextIndex = 0
        }
        
        const nextFunil = funis[nextIndex]
        if (nextFunil && nextFunil.id) {
          setSelectedFunilId(nextFunil.id)
        }
      } else {
        setSelectedFunilId(null)
      }
    }
  }, [funis, selectedFunilId])

  const createFunilWithStages = async (funilData: CreateFunilRequest, estagiosData: Omit<CreateEstagioRequest, 'funilId'>[]) => {
    try {
      // 1. Criar funil
      const funil = await createFunil(funilData).unwrap()
      toast.success("Funil criado com sucesso!")

      // 2. Criar estágios
      const estagios = []
      for (const estagioData of estagiosData) {
        const estagio = await createEstagio({
          funilId: funil.id,
          ...estagioData
        }).unwrap()
        estagios.push(estagio)
      }

      toast.success(`${estagios.length} estágios criados com sucesso!`)
      return { funil, estagios }
    } catch (error: any) {
      console.error('Erro ao criar funil:', error)
      toast.error(error.message || "Erro ao criar funil")
      throw error
    }
  }

  const handleCreateFunil = async (data: CreateFunilRequest) => {
    try {
      const funil = await createFunil(data).unwrap()
      toast.success("Funil criado com sucesso!")
      return funil
    } catch (error: any) {
      console.error('Erro ao criar funil:', error)
      toast.error(error.message || "Erro ao criar funil")
      throw error
    }
  }

  const handleUpdateFunil = async (id: string, data: Partial<CreateFunilRequest>) => {
    try {
      const funil = await updateFunil({ id, data }).unwrap()
      toast.success("Funil atualizado com sucesso!")
      return funil
    } catch (error: any) {
      console.error('Erro ao atualizar funil:', error)
      toast.error(error.message || "Erro ao atualizar funil")
      throw error
    }
  }

  const handleDeleteFunil = async (id: string) => {
    try {
      await deleteFunil(id).unwrap()
      toast.success("Funil deletado com sucesso!")
      // O useEffect vai cuidar da seleção automática quando a lista for atualizada
    } catch (error: any) {
      console.error('Erro ao deletar funil:', error)
      toast.error(error.message || "Erro ao deletar funil")
      throw error
    }
  }

  return {
    // Data
    funis,
    selectedFunil,
    selectedFunilId,
    
    // Loading states
    isLoadingFunis,
    isLoadingSelectedFunil,
    isCreatingFunil,
    isUpdatingFunil,
    isDeletingFunil,
    
    // Errors
    funisError,
    selectedFunilError,
    
    // Actions
    setSelectedFunilId,
    createFunilWithStages,
    handleCreateFunil,
    handleUpdateFunil,
    handleDeleteFunil,
    refetchFunis
  }
}

// Hook para gerenciar estágios
export function useEstagios(funilId?: string) {
  const {
    data: estagios = [],
    isLoading: isLoadingEstagios,
    error: estagiosError,
    refetch: refetchEstagios
  } = useGetEstagiosByFunilQuery(funilId!, {
    skip: !funilId,
    // Refetch quando o funilId mudar
    refetchOnMountOrArgChange: true
  })

  const [createEstagio, { isLoading: isCreatingEstagio }] = useCreateEstagioMutation()
  const [updateEstagio, { isLoading: isUpdatingEstagio }] = useUpdateEstagioMutation()
  const [deleteEstagio, { isLoading: isDeletingEstagio }] = useDeleteEstagioMutation()

  const handleCreateEstagio = async (data: CreateEstagioRequest) => {
    try {
      const estagio = await createEstagio(data).unwrap()
      toast.success("Estágio criado com sucesso!")
      return estagio
    } catch (error: any) {
      console.error('Erro ao criar estágio:', error)
      toast.error(error.message || "Erro ao criar estágio")
      throw error
    }
  }

  const handleUpdateEstagio = async (id: string, data: Partial<CreateEstagioRequest>) => {
    try {
      const estagio = await updateEstagio({ id, data }).unwrap()
      toast.success("Estágio atualizado com sucesso!")
      return estagio
    } catch (error: any) {
      console.error('Erro ao atualizar estágio:', error)
      toast.error(error.message || "Erro ao atualizar estágio")
      throw error
    }
  }

  const handleDeleteEstagio = async (id: string) => {
    try {
      await deleteEstagio(id).unwrap()
      toast.success("Estágio deletado com sucesso!")
    } catch (error: any) {
      console.error('Erro ao deletar estágio:', error)
      toast.error(error.message || "Erro ao deletar estágio")
      throw error
    }
  }

  const createMultipleEstagios = async (estagiosData: Omit<CreateEstagioRequest, 'funilId'>[]) => {
    try {
      const estagios = []
      for (const estagioData of estagiosData) {
        const estagio = await createEstagio({
          funilId: funilId!,
          ...estagioData
        }).unwrap()
        estagios.push(estagio)
      }
      toast.success(`${estagios.length} estágios criados com sucesso!`)
      return estagios
    } catch (error: any) {
      console.error('Erro ao criar estágios:', error)
      toast.error(error.message || "Erro ao criar estágios")
      throw error
    }
  }

  return {
    // Data
    estagios,
    
    // Loading states
    isLoadingEstagios,
    isCreatingEstagio,
    isUpdatingEstagio,
    isDeletingEstagio,
    
    // Errors
    estagiosError,
    
    // Actions
    handleCreateEstagio,
    handleUpdateEstagio,
    handleDeleteEstagio,
    createMultipleEstagios,
    refetchEstagios
  }
}

// Hook para templates de funis
export function useFunilTemplates() {
  const templates = {
    'vendas-geral': {
      id: 'vendas-geral',
      name: 'Vendas Geral',
      description: 'Funil padrão para vendas B2B',
      estagios: [
        { name: 'Leads', color: '#FF5733', order: 0, description: 'Primeiro contato com o cliente' },
        { name: 'Qualificados', color: '#FFA500', order: 1, description: 'Cliente demonstrou interesse' },
        { name: 'Propostas', color: '#33FF57', order: 2, description: 'Proposta enviada' },
        { name: 'Fechados', color: '#8A2BE2', order: 3, description: 'Venda finalizada' },
      ]
    },
    'ecommerce': {
      id: 'ecommerce',
      name: 'E-commerce',
      description: 'Funil para vendas online',
      estagios: [
        { name: 'Visitantes', color: '#8B5CF6', order: 0, description: 'Visitantes do site' },
        { name: 'Interessados', color: '#A855F7', order: 1, description: 'Visualizaram produtos' },
        { name: 'Carrinho', color: '#C084FC', order: 2, description: 'Adicionaram ao carrinho' },
        { name: 'Checkout', color: '#DDD6FE', order: 3, description: 'Iniciaram checkout' },
        { name: 'Compra', color: '#EDE9FE', order: 4, description: 'Compra finalizada' },
      ]
    },
    'saas': {
      id: 'saas',
      name: 'SaaS',
      description: 'Funil para software como serviço',
      estagios: [
        { name: 'Awareness', color: '#10B981', order: 0, description: 'Conheceram o produto' },
        { name: 'Interest', color: '#34D399', order: 1, description: 'Demonstraram interesse' },
        { name: 'Trial', color: '#6EE7B7', order: 2, description: 'Iniciaram trial' },
        { name: 'Conversion', color: '#A7F3D0', order: 3, description: 'Converteram para pagante' },
        { name: 'Retention', color: '#D1FAE5', order: 4, description: 'Mantiveram assinatura' },
      ]
    },
    'clinica-medica': {
      id: 'clinica-medica',
      name: 'Clínica Médica',
      description: 'Funil específico para clínicas médicas',
      estagios: [
        { name: 'Novo Lead', color: '#FF5733', order: 0, description: 'Primeiro contato com o paciente' },
        { name: 'Interessado', color: '#FFA500', order: 1, description: 'Paciente demonstrou interesse' },
        { name: 'Agendado', color: '#33FF57', order: 2, description: 'Consulta agendada' },
        { name: 'Consulta Realizada', color: '#3357FF', order: 3, description: 'Consulta foi realizada' },
        { name: 'Fechado', color: '#8A2BE2', order: 4, description: 'Tratamento finalizado' },
      ]
    }
  }

  const getTemplate = (templateId: string) => {
    return templates[templateId as keyof typeof templates]
  }

  const getAllTemplates = () => {
    return Object.values(templates)
  }

  return {
    templates,
    getTemplate,
    getAllTemplates
  }
}
