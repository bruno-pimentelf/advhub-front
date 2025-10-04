import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { API_CONFIG } from '../config'
import type { User, CreateUserRequest, UserExistsResponse } from '../types'

export const usersApi = createApi({
  reducerPath: 'usersApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_CONFIG.baseUrl,
    prepareHeaders: API_CONFIG.prepareHeaders,
  }),
  tagTypes: ['User'],
  endpoints: (builder) => ({
    checkUserExists: builder.query<UserExistsResponse, void>({
      query: () => '/users/me/exists',
      providesTags: ['User'],
    }),
    
    getCurrentUser: builder.query<User, void>({
      query: () => '/users/me',
      providesTags: ['User'],
    }),
    
    createUser: builder.mutation<User, CreateUserRequest>({
      query: (userData) => ({
        url: '/users',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: ['User'],
    }),
  }),
})

export const {
  useCheckUserExistsQuery,
  useGetCurrentUserQuery,
  useCreateUserMutation,
} = usersApi
