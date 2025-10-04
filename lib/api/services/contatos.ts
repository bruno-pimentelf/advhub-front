import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQuery } from '../config'
import type { 
  Contato, 
  CreateContatoRequest, 
  UpdateContatoRequest, 
  ContatosResponse 
} from '../types'

export const contatosApi = createApi({
  reducerPath: 'contatosApi',
  baseQuery,
  tagTypes: ['Contato'],
  endpoints: (builder) => ({
    getContatos: builder.query<ContatosResponse, { page?: number; limit?: number }>({
      query: ({ page = 1, limit = 20 } = {}) => ({
        url: '/contatos',
        params: { page, limit },
      }),
      providesTags: ['Contato'],
    }),

    getContato: builder.query<Contato, string>({
      query: (id: string) => `/contatos/${id}`,
      providesTags: (result: any, error: any, id: string) => [{ type: 'Contato', id }],
    }),

    createContato: builder.mutation<Contato, CreateContatoRequest>({
      query: (data: CreateContatoRequest) => ({
        url: '/contatos',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Contato'],
    }),

    updateContato: builder.mutation<Contato, { id: string; data: UpdateContatoRequest }>({
      query: ({ id, data }: { id: string; data: UpdateContatoRequest }) => ({
        url: `/contatos/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result: any, error: any, { id }: { id: string }) => [{ type: 'Contato', id }, 'Contato'],
    }),

    deleteContato: builder.mutation<void, string>({
      query: (id: string) => ({
        url: `/contatos/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result: any, error: any, id: string) => [
        { type: 'Contato', id },
        'Contato'
      ],
    }),
  }),
})

export const {
  useGetContatosQuery,
  useGetContatoQuery,
  useCreateContatoMutation,
  useUpdateContatoMutation,
  useDeleteContatoMutation,
} = contatosApi
