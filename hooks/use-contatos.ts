import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import {
  useGetContatosQuery,
  useGetContatoQuery,
  useCreateContatoMutation,
  useUpdateContatoMutation,
  useDeleteContatoMutation,
  type Contato,
  type CreateContatoRequest,
  type UpdateContatoRequest,
} from '@/lib/api'

// Hook para gerenciar contatos
export function useContatos(page: number = 1, limit: number = 20) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  
  const {
    data: contatosResponse,
    isLoading: isLoadingContatos,
    error: contatosError,
    refetch: refetchContatos
  } = useGetContatosQuery({ page, limit })

  const [createContato, { isLoading: isCreatingContato }] = useCreateContatoMutation()
  const [updateContato, { isLoading: isUpdatingContato }] = useUpdateContatoMutation()
  const [deleteContato, { isLoading: isDeletingContato }] = useDeleteContatoMutation()

  const contatos = contatosResponse?.contatos || []
  const total = contatosResponse?.total || 0

  // Filtrar contatos localmente
  const filteredContatos = contatos.filter((contato: Contato) => {
    const matchesSearch = contato.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contato.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contato.phone.includes(searchTerm)
    const matchesFilter = filterStatus === 'all' || contato.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const handleCreateContato = async (data: CreateContatoRequest) => {
    try {
      const contato = await createContato(data).unwrap()
      toast.success("Contato criado com sucesso!")
      return contato
    } catch (error: any) {
      console.error('Erro ao criar contato:', error)
      toast.error(error.message || "Erro ao criar contato")
      throw error
    }
  }

  const handleUpdateContato = async (id: string, data: UpdateContatoRequest) => {
    try {
      const contato = await updateContato({ id, data }).unwrap()
      toast.success("Contato atualizado com sucesso!")
      return contato
    } catch (error: any) {
      console.error('Erro ao atualizar contato:', error)
      toast.error(error.message || "Erro ao atualizar contato")
      throw error
    }
  }

  const handleDeleteContato = async (id: string) => {
    try {
      await deleteContato(id).unwrap()
      toast.success("Contato deletado com sucesso!")
    } catch (error: any) {
      console.error('Erro ao deletar contato:', error)
      toast.error(error.message || "Erro ao deletar contato")
      throw error
    }
  }

  return {
    // Data
    contatos: filteredContatos,
    total,
    
    // Loading states
    isLoadingContatos,
    isCreatingContato,
    isUpdatingContato,
    isDeletingContato,
    
    // Errors
    contatosError,
    
    // Filters
    searchTerm,
    setSearchTerm,
    filterStatus,
    setFilterStatus,
    
    // Actions
    handleCreateContato,
    handleUpdateContato,
    handleDeleteContato,
    refetchContatos
  }
}

// Hook para gerenciar um contato específico
export function useContato(id: string) {
  const {
    data: contato,
    isLoading: isLoadingContato,
    error: contatoError,
    refetch: refetchContato
  } = useGetContatoQuery(id, {
    skip: !id
  })

  const [updateContato, { isLoading: isUpdatingContato }] = useUpdateContatoMutation()
  const [deleteContato, { isLoading: isDeletingContato }] = useDeleteContatoMutation()

  const handleUpdateContato = async (data: UpdateContatoRequest) => {
    if (!id) return
    
    try {
      const updatedContato = await updateContato({ id, data }).unwrap()
      toast.success("Contato atualizado com sucesso!")
      return updatedContato
    } catch (error: any) {
      console.error('Erro ao atualizar contato:', error)
      toast.error(error.message || "Erro ao atualizar contato")
      throw error
    }
  }

  const handleDeleteContato = async () => {
    if (!id) return
    
    try {
      await deleteContato(id).unwrap()
      toast.success("Contato deletado com sucesso!")
    } catch (error: any) {
      console.error('Erro ao deletar contato:', error)
      toast.error(error.message || "Erro ao deletar contato")
      throw error
    }
  }

  return {
    // Data
    contato,
    
    // Loading states
    isLoadingContato,
    isUpdatingContato,
    isDeletingContato,
    
    // Errors
    contatoError,
    
    // Actions
    handleUpdateContato,
    handleDeleteContato,
    refetchContato
  }
}
