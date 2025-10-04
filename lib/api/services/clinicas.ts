import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { API_CONFIG } from '../config'
import type { Clinica, CreateClinicaRequest } from '../types'

export const clinicasApi = createApi({
  reducerPath: 'clinicasApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_CONFIG.baseUrl,
    prepareHeaders: API_CONFIG.prepareHeaders,
  }),
  tagTypes: ['Clinica'],
  endpoints: (builder) => ({
    getClinicas: builder.query<Clinica[], void>({
      query: () => '/clinicas',
      providesTags: ['Clinica'],
    }),
    
    createClinica: builder.mutation<Clinica, CreateClinicaRequest>({
      query: (clinicaData) => ({
        url: '/clinicas',
        method: 'POST',
        body: clinicaData,
      }),
      invalidatesTags: ['Clinica'],
    }),
  }),
})

export const {
  useGetClinicasQuery,
  useCreateClinicaMutation,
} = clinicasApi
