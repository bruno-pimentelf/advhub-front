import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { API_CONFIG } from '../config'
import type { Estagio, CreateEstagioRequest } from '../types'

export const estagiosApi = createApi({
  reducerPath: 'estagiosApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_CONFIG.baseUrl,
    prepareHeaders: API_CONFIG.prepareHeaders,
  }),
  tagTypes: ['Estagio'],
  endpoints: (builder) => ({
    getEstagiosByFunil: builder.query<Estagio[], string>({
      query: (funilId) => `/estagios/funil/${funilId}`,
      providesTags: (result, error, funilId) => [
        { type: 'Estagio', id: 'LIST' },
        ...(result?.map(({ id }) => ({ type: 'Estagio' as const, id })) || [])
      ],
    }),

    getEstagio: builder.query<Estagio, string>({
      query: (id) => `/estagios/${id}`,
      providesTags: (result, error, id) => [{ type: 'Estagio', id }],
    }),

    createEstagio: builder.mutation<Estagio, CreateEstagioRequest>({
      query: (estagioData) => ({
        url: '/estagios',
        method: 'POST',
        body: estagioData,
      }),
      invalidatesTags: ['Estagio'],
    }),

    updateEstagio: builder.mutation<Estagio, { id: string; data: Partial<CreateEstagioRequest> }>({
      query: ({ id, data }) => ({
        url: `/estagios/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Estagio', id }, 'Estagio'],
    }),

    deleteEstagio: builder.mutation<void, string>({
      query: (id) => ({
        url: `/estagios/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Estagio', id },
        'Estagio'
      ],
    }),
  }),
})

export const {
  useGetEstagiosByFunilQuery,
  useGetEstagioQuery,
  useCreateEstagioMutation,
  useUpdateEstagioMutation,
  useDeleteEstagioMutation,
} = estagiosApi
