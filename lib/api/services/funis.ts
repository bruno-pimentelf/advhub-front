import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { API_CONFIG } from '../config'
import type { Funil, CreateFunilRequest } from '../types'

export const funisApi = createApi({
  reducerPath: 'funisApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_CONFIG.baseUrl,
    prepareHeaders: API_CONFIG.prepareHeaders,
  }),
  tagTypes: ['Funil'],
  endpoints: (builder) => ({
    getFunis: builder.query<Funil[], void>({
      query: () => '/funis',
      providesTags: ['Funil'],
    }),

    getFunil: builder.query<Funil, string>({
      query: (id) => `/funis/${id}`,
      providesTags: (result, error, id) => [{ type: 'Funil', id }],
    }),

    createFunil: builder.mutation<Funil, CreateFunilRequest>({
      query: (funilData) => ({
        url: '/funis',
        method: 'POST',
        body: funilData,
      }),
      invalidatesTags: ['Funil'],
    }),

    updateFunil: builder.mutation<Funil, { id: string; data: Partial<CreateFunilRequest> }>({
      query: ({ id, data }) => ({
        url: `/funis/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Funil', id }, 'Funil'],
    }),

    deleteFunil: builder.mutation<void, string>({
      query: (id) => ({
        url: `/funis/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Funil', id },
        'Funil'
      ],
    }),
  }),
})

export const {
  useGetFunisQuery,
  useGetFunilQuery,
  useCreateFunilMutation,
  useUpdateFunilMutation,
  useDeleteFunilMutation,
} = funisApi
