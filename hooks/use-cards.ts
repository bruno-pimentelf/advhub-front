import { useState } from 'react'
import { toast } from 'sonner'
import {
  useGetCardsByFunilQuery,
  useGetCardQuery,
  useCreateCardMutation,
  useUpdateCardMutation,
  useMoveCardMutation,
  useDeleteCardMutation,
  type Card,
  type CreateCardRequest,
  type UpdateCardRequest,
  type MoveCardRequest,
} from '@/lib/api'

// Hook para gerenciar cards de um funil
export function useCards(funilId?: string) {
  const {
    data: cards = [],
    isLoading: isLoadingCards,
    error: cardsError,
    refetch: refetchCards
  } = useGetCardsByFunilQuery(funilId!, {
    skip: !funilId
  })

  const [createCard, { isLoading: isCreatingCard }] = useCreateCardMutation()
  const [updateCard, { isLoading: isUpdatingCard }] = useUpdateCardMutation()
  const [moveCard, { isLoading: isMovingCard }] = useMoveCardMutation()
  const [deleteCard, { isLoading: isDeletingCard }] = useDeleteCardMutation()

  const handleCreateCard = async (data: CreateCardRequest) => {
    try {
      const card = await createCard(data).unwrap()
      toast.success("Card criado com sucesso!")
      return card
    } catch (error: any) {
      console.error('Erro ao criar card:', error)
      toast.error(error.message || "Erro ao criar card")
      throw error
    }
  }

  const handleUpdateCard = async (id: string, data: UpdateCardRequest) => {
    try {
      const card = await updateCard({ id, data }).unwrap()
      toast.success("Card atualizado com sucesso!")
      return card
    } catch (error: any) {
      console.error('Erro ao atualizar card:', error)
      toast.error(error.message || "Erro ao atualizar card")
      throw error
    }
  }

  const handleMoveCard = async (id: string, data: MoveCardRequest) => {
    try {
      const card = await moveCard({ id, data }).unwrap()
      toast.success("Card movido com sucesso!")
      return card
    } catch (error: any) {
      console.error('Erro ao mover card:', error)
      toast.error(error.message || "Erro ao mover card")
      throw error
    }
  }

  const handleDeleteCard = async (id: string) => {
    try {
      await deleteCard(id).unwrap()
      toast.success("Card deletado com sucesso!")
    } catch (error: any) {
      console.error('Erro ao deletar card:', error)
      toast.error(error.message || "Erro ao deletar card")
      throw error
    }
  }

  return {
    // Data
    cards,
    
    // Loading states
    isLoadingCards,
    isCreatingCard,
    isUpdatingCard,
    isMovingCard,
    isDeletingCard,
    
    // Errors
    cardsError,
    
    // Actions
    handleCreateCard,
    handleUpdateCard,
    handleMoveCard,
    handleDeleteCard,
    refetchCards
  }
}

// Hook para gerenciar um card específico
export function useCard(id: string) {
  const {
    data: card,
    isLoading: isLoadingCard,
    error: cardError,
    refetch: refetchCard
  } = useGetCardQuery(id, {
    skip: !id
  })

  const [updateCard, { isLoading: isUpdatingCard }] = useUpdateCardMutation()
  const [moveCard, { isLoading: isMovingCard }] = useMoveCardMutation()
  const [deleteCard, { isLoading: isDeletingCard }] = useDeleteCardMutation()

  const handleUpdateCard = async (data: UpdateCardRequest) => {
    if (!id) return
    
    try {
      const updatedCard = await updateCard({ id, data }).unwrap()
      toast.success("Card atualizado com sucesso!")
      return updatedCard
    } catch (error: any) {
      console.error('Erro ao atualizar card:', error)
      toast.error(error.message || "Erro ao atualizar card")
      throw error
    }
  }

  const handleMoveCard = async (data: MoveCardRequest) => {
    if (!id) return
    
    try {
      const movedCard = await moveCard({ id, data }).unwrap()
      toast.success("Card movido com sucesso!")
      return movedCard
    } catch (error: any) {
      console.error('Erro ao mover card:', error)
      toast.error(error.message || "Erro ao mover card")
      throw error
    }
  }

  const handleDeleteCard = async () => {
    if (!id) return
    
    try {
      await deleteCard(id).unwrap()
      toast.success("Card deletado com sucesso!")
    } catch (error: any) {
      console.error('Erro ao deletar card:', error)
      toast.error(error.message || "Erro ao deletar card")
      throw error
    }
  }

  return {
    // Data
    card,
    
    // Loading states
    isLoadingCard,
    isUpdatingCard,
    isMovingCard,
    isDeletingCard,
    
    // Errors
    cardError,
    
    // Actions
    handleUpdateCard,
    handleMoveCard,
    handleDeleteCard,
    refetchCard
  }
}
