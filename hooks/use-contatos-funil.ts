import { useState, useMemo } from 'react'
import { toast } from 'sonner'
import {
  useGetContatosByFunilQuery,
  useGetFunisByContatoQuery,
  useGetContatosQuery,
  useAddContatoToFunilMutation,
  useMoveContatoInFunilMutation,
  useRemoveContatoFromFunilMutation,
  type ContatoFunil,
  type ContatoFunilWithContato,
  type AddContatoToFunilRequest,
  type MoveContatoInFunilRequest,
} from '@/lib/api'

// Hook para gerenciar contatos de um funil
export function useContatosFunil(funilId?: string) {
  const {
    data: contatosFunilResponse,
    isLoading: isLoadingContatosFunil,
    error: contatosFunilError,
    refetch: refetchContatosFunil
  } = useGetContatosByFunilQuery(funilId!, {
    skip: !funilId
  })

  // A API retorna um array direto, não um objeto com contatosFunil
  const contatosFunilRaw = contatosFunilResponse || []

  // Buscar todos os contatos para combinar com os dados do funil
  const {
    data: contatosData,
    isLoading: isLoadingContatos,
    error: contatosError
  } = useGetContatosQuery({ page: 1, limit: 1000 }, {
    skip: !funilId || !contatosFunilRaw.length
  })

  // Combinar dados do ContatoFunil com dados do Contato
  const contatosFunil: ContatoFunilWithContato[] = useMemo(() => {
    if (!contatosFunilRaw.length || !contatosData?.contatos) {
      return []
    }

    return contatosFunilRaw.map(cf => {
      const contato = contatosData.contatos.find(c => c.id === cf.contatoId)
      return {
        ...cf,
        contato: contato || {
          id: cf.contatoId,
          clinicaId: '', // Placeholder
          name: 'Contato Desconhecido',
          phone: 'N/A',
          status: 'active',
          lastContactAt: { _seconds: 0, _nanoseconds: 0 },
          createdAt: { _seconds: 0, _nanoseconds: 0 },
          updatedAt: { _seconds: 0, _nanoseconds: 0 },
        }
      }
    })
  }, [contatosFunilRaw, contatosData?.contatos])

  const total = contatosFunilRaw.length

  const [addContatoToFunil, { isLoading: isAddingContato }] = useAddContatoToFunilMutation()
  const [moveContatoInFunil, { isLoading: isMovingContato }] = useMoveContatoInFunilMutation()
  const [removeContatoFromFunil, { isLoading: isRemovingContato }] = useRemoveContatoFromFunilMutation()

  const handleAddContatoToFunil = async (contatoId: string, data: AddContatoToFunilRequest) => {
    try {
      const contatoFunil = await addContatoToFunil({ contatoId, data }).unwrap()
      toast.success("Contato adicionado ao funil com sucesso!")
      return contatoFunil
    } catch (error: any) {
      console.error('Erro ao adicionar contato ao funil:', error)
      toast.error(error.message || "Erro ao adicionar contato ao funil")
      throw error
    }
  }

  const handleMoveContatoInFunil = async (contatoId: string, funilId: string, data: MoveContatoInFunilRequest) => {
    try {
      const contatoFunil = await moveContatoInFunil({ contatoId, funilId, data }).unwrap()
      // Não mostrar toast de sucesso - movimento é visual imediato
      return contatoFunil
    } catch (error: any) {
      console.error('Erro ao mover contato no funil:', error)
      toast.error(error.message || "Erro ao mover contato no funil")
      throw error
    }
  }

  const handleRemoveContatoFromFunil = async (contatoId: string, funilId: string) => {
    try {
      await removeContatoFromFunil({ contatoId, funilId }).unwrap()
      toast.success("Contato removido do funil com sucesso!")
    } catch (error: any) {
      console.error('Erro ao remover contato do funil:', error)
      toast.error(error.message || "Erro ao remover contato do funil")
      throw error
    }
  }

  // Agrupar contatos por estágio
  const contatosByEstagio = useMemo(() => {
    return contatosFunil.reduce((acc, contatoFunil) => {
      const estagioId = contatoFunil.estagioId
      if (!acc[estagioId]) {
        acc[estagioId] = []
      }
      acc[estagioId].push(contatoFunil)
      return acc
    }, {} as Record<string, ContatoFunilWithContato[]>)
  }, [contatosFunil])

  return {
    // Data
    contatosFunil,
    contatosByEstagio,
    total,
    
    // Loading states
    isLoadingContatosFunil: isLoadingContatosFunil || isLoadingContatos,
    isAddingContato,
    isMovingContato,
    isRemovingContato,
    
    // Errors
    contatosFunilError: contatosFunilError || contatosError,
    
    // Actions
    handleAddContatoToFunil,
    handleMoveContatoInFunil,
    handleRemoveContatoFromFunil,
    refetchContatosFunil
  }
}

// Hook para gerenciar funis de um contato
export function useFunisByContato(contatoId?: string) {
  const {
    data: funisContato = [],
    isLoading: isLoadingFunisContato,
    error: funisContatoError,
    refetch: refetchFunisContato
  } = useGetFunisByContatoQuery(contatoId!, {
    skip: !contatoId
  })

  const [addContatoToFunil, { isLoading: isAddingContato }] = useAddContatoToFunilMutation()
  const [moveContatoInFunil, { isLoading: isMovingContato }] = useMoveContatoInFunilMutation()
  const [removeContatoFromFunil, { isLoading: isRemovingContato }] = useRemoveContatoFromFunilMutation()

  const handleAddContatoToFunil = async (data: AddContatoToFunilRequest) => {
    if (!contatoId) return
    
    try {
      const contatoFunil = await addContatoToFunil({ contatoId, data }).unwrap()
      toast.success("Contato adicionado ao funil com sucesso!")
      return contatoFunil
    } catch (error: any) {
      console.error('Erro ao adicionar contato ao funil:', error)
      toast.error(error.message || "Erro ao adicionar contato ao funil")
      throw error
    }
  }

  const handleMoveContatoInFunil = async (funilId: string, data: MoveContatoInFunilRequest) => {
    if (!contatoId) return
    
    try {
      const contatoFunil = await moveContatoInFunil({ contatoId, funilId, data }).unwrap()
      toast.success("Contato movido com sucesso!")
      return contatoFunil
    } catch (error: any) {
      console.error('Erro ao mover contato no funil:', error)
      toast.error(error.message || "Erro ao mover contato no funil")
      throw error
    }
  }

  const handleRemoveContatoFromFunil = async (funilId: string) => {
    if (!contatoId) return
    
    try {
      await removeContatoFromFunil({ contatoId, funilId }).unwrap()
      toast.success("Contato removido do funil com sucesso!")
    } catch (error: any) {
      console.error('Erro ao remover contato do funil:', error)
      toast.error(error.message || "Erro ao remover contato do funil")
      throw error
    }
  }

  return {
    // Data
    funisContato,
    
    // Loading states
    isLoadingFunisContato,
    isAddingContato,
    isMovingContato,
    isRemovingContato,
    
    // Errors
    funisContatoError,
    
    // Actions
    handleAddContatoToFunil,
    handleMoveContatoInFunil,
    handleRemoveContatoFromFunil,
    refetchFunisContato
  }
}

// Utilitários para trabalhar com ContatoFunil
export const groupContatosByEstagio = (contatosFunil: ContatoFunilWithContato[]) => {
  return contatosFunil.reduce((acc, contatoFunil) => {
    const estagioId = contatoFunil.estagioId
    if (!acc[estagioId]) {
      acc[estagioId] = []
    }
    acc[estagioId].push(contatoFunil)
    return acc
  }, {} as Record<string, ContatoFunilWithContato[]>)
}

export const filterContatosByFunil = (
  contatosFunil: ContatoFunilWithContato[], 
  funilId: string
) => {
  return contatosFunil.filter(cf => cf.funilId === funilId)
}

export const searchContatosInFunil = (
  contatosFunil: ContatoFunilWithContato[],
  searchTerm: string
) => {
  return contatosFunil.filter(cf => {
    const contato = cf.contato
    return contato?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           contato?.phone.includes(searchTerm) ||
           contato?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  })
}
