// Exportações centralizadas de todos os serviços
export * from './types'
export * from './config'

// Services
export * from './services/users'
export * from './services/clinicas'
export * from './services/funis'
export * from './services/estagios'
export * from './services/contatos'
export * from './services/contatos-funil'
export * from './services/cards' // DEPRECATED - mantido para compatibilidade

// Store configuration
export { configureApiStore } from './store'
