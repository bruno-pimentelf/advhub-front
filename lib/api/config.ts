import { fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { auth } from '../firebase'

// Função para obter o token do Firebase
export const getAuthToken = async (): Promise<string> => {
  const user = auth.currentUser
  if (!user) {
    throw new Error('Usuário não autenticado')
  }
  return await user.getIdToken()
}

// Base query para RTK Query
export const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || '',
  prepareHeaders: async (headers) => {
    try {
      const token = await getAuthToken()
      headers.set('authorization', `Bearer ${token}`)
      headers.set('content-type', 'application/json')
    } catch (error) {
      // Se não conseguir obter o token, não adiciona o header
      console.warn('Não foi possível obter token de autenticação:', error)
    }
    return headers
  },
})

// Configuração base da API
export const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || '',
  prepareHeaders: async (headers: Headers) => {
    try {
      const token = await getAuthToken()
      headers.set('authorization', `Bearer ${token}`)
      headers.set('content-type', 'application/json')
    } catch (error) {
      // Se não conseguir obter o token, não adiciona o header
      console.warn('Não foi possível obter token de autenticação:', error)
    }
    return headers
  },
  tagTypes: ['User', 'Clinica', 'Funil', 'Estagio', 'Contato', 'Card'] as const
}
