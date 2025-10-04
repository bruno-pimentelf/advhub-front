import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQuery } from '../config'
import type { 
  ContatoFunil,
  ContatoFunilWithContato,
  ContatosFunilResponse,
  AddContatoToFunilRequest,
  MoveContatoInFunilRequest
} from '../types'

export const contatosFunilApi = createApi({
  reducerPath: 'contatosFunilApi',
  baseQuery,
  tagTypes: ['ContatoFunil'],
  endpoints: (builder) => ({
    // Listar contatos de um funil
    getContatosByFunil: builder.query<ContatoFunil[], string>({
      query: (funilId: string) => ({
        url: `/funis/${funilId}/contatos`,
      }),
      providesTags: ['ContatoFunil'],
    }),

    // Listar funis de um contato
    getFunisByContato: builder.query<ContatoFunil[], string>({
      query: (contatoId: string) => ({
        url: `/contatos/${contatoId}/funis`,
      }),
      providesTags: ['ContatoFunil'],
    }),

    // Adicionar contato a um funil
    addContatoToFunil: builder.mutation<ContatoFunil, { contatoId: string; data: AddContatoToFunilRequest }>({
      query: ({ contatoId, data }) => ({
        url: `/contatos/${contatoId}/funis`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['ContatoFunil'],
    }),

    // Mover contato para outro estágio
    moveContatoInFunil: builder.mutation<ContatoFunil, { contatoId: string; funilId: string; data: MoveContatoInFunilRequest }>({
      query: ({ contatoId, funilId, data }) => ({
        url: `/contatos/${contatoId}/funis/${funilId}/move`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['ContatoFunil'],
    }),

    // Remover contato de um funil
    removeContatoFromFunil: builder.mutation<void, { contatoId: string; funilId: string }>({
      query: ({ contatoId, funilId }) => ({
        url: `/contatos/${contatoId}/funis/${funilId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['ContatoFunil'],
    }),
  }),
})

export const {
  useGetContatosByFunilQuery,
  useGetFunisByContatoQuery,
  useAddContatoToFunilMutation,
  useMoveContatoInFunilMutation,
  useRemoveContatoFromFunilMutation,
} = contatosFunilApi
