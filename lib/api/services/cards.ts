import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQuery } from '../config'
import type { 
  Card, 
  CreateCardRequest, 
  UpdateCardRequest, 
  MoveCardRequest 
} from '../types'

export const cardsApi = createApi({
  reducerPath: 'cardsApi',
  baseQuery,
  tagTypes: ['Card'],
  endpoints: (builder) => ({
    getCardsByFunil: builder.query<Card[], string>({
      query: (funilId: string) => ({
        url: '/cards',
        params: { funilId },
      }),
      providesTags: ['Card'],
    }),

    getCard: builder.query<Card, string>({
      query: (id: string) => `/cards/${id}`,
      providesTags: (result: any, error: any, id: string) => [{ type: 'Card', id }],
    }),

    createCard: builder.mutation<Card, CreateCardRequest>({
      query: (data: CreateCardRequest) => ({
        url: '/cards',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Card'],
    }),

    updateCard: builder.mutation<Card, { id: string; data: UpdateCardRequest }>({
      query: ({ id, data }: { id: string; data: UpdateCardRequest }) => ({
        url: `/cards/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result: any, error: any, { id }: { id: string }) => [{ type: 'Card', id }, 'Card'],
    }),

    moveCard: builder.mutation<Card, { id: string; data: MoveCardRequest }>({
      query: ({ id, data }: { id: string; data: MoveCardRequest }) => ({
        url: `/cards/${id}/move`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result: any, error: any, { id }: { id: string }) => [{ type: 'Card', id }, 'Card'],
    }),

    deleteCard: builder.mutation<void, string>({
      query: (id: string) => ({
        url: `/cards/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result: any, error: any, id: string) => [
        { type: 'Card', id },
        'Card'
      ],
    }),
  }),
})

export const {
  useGetCardsByFunilQuery,
  useGetCardQuery,
  useCreateCardMutation,
  useUpdateCardMutation,
  useMoveCardMutation,
  useDeleteCardMutation,
} = cardsApi
