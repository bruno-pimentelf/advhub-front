import { configureStore } from '@reduxjs/toolkit'
import { usersApi } from './services/users'
import { clinicasApi } from './services/clinicas'
import { funisApi } from './services/funis'
import { estagiosApi } from './services/estagios'
import { contatosApi } from './services/contatos'
import { cardsApi } from './services/cards'

export const configureApiStore = () => {
  return configureStore({
    reducer: {
      [usersApi.reducerPath]: usersApi.reducer,
      [clinicasApi.reducerPath]: clinicasApi.reducer,
      [funisApi.reducerPath]: funisApi.reducer,
      [estagiosApi.reducerPath]: estagiosApi.reducer,
      [contatosApi.reducerPath]: contatosApi.reducer,
      [cardsApi.reducerPath]: cardsApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware()
        .concat(usersApi.middleware)
        .concat(clinicasApi.middleware)
        .concat(funisApi.middleware)
        .concat(estagiosApi.middleware)
        .concat(contatosApi.middleware)
        .concat(cardsApi.middleware),
  })
}

export const store = configureApiStore()

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
