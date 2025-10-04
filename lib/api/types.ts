// Tipos base compartilhados
export interface User {
  id: string
  email: string
  name: string
  avatarUrl?: string
  createdAt: string
}

export interface CreateUserRequest {
  name: string
  email: string
  avatarUrl?: string
}

export interface UserExistsResponse {
  exists: boolean
}

export interface Clinica {
  id: string
  name: string
  ownerId: string
  members: Array<{
    userId: string
    role: string
  }>
  createdAt: string
}

export interface CreateClinicaRequest {
  name: string
}

export interface Funil {
  id: string
  clinicaId: string
  name: string
  description: string
  createdAt: string
  updatedAt: string
}

export interface CreateFunilRequest {
  name: string
  description: string
}

export interface Estagio {
  id: string
  clinicaId: string
  funilId: string
  name: string
  description: string
  color: string
  order: number
  createdAt: string
  updatedAt: string
}

export interface CreateEstagioRequest {
  funilId: string
  name: string
  description: string
  color: string
  order: number
}

export interface UpdateEstagioRequest {
  name?: string
  description?: string
  color?: string
  order?: number
}

// ===== CONTATOS =====
export interface Contato {
  id: string
  clinicaId: string
  name: string
  phone: string
  email?: string
  photoUrl?: string
  status: 'active' | 'archived'
  lastContactAt: string | { _seconds: number; _nanoseconds: number }
  createdAt: string | { _seconds: number; _nanoseconds: number }
  updatedAt: string | { _seconds: number; _nanoseconds: number }
}

export interface CreateContatoRequest {
  name: string
  phone: string
  email?: string
  photoUrl?: string
}

export interface UpdateContatoRequest {
  name?: string
  phone?: string
  email?: string
  photoUrl?: string
  status?: 'active' | 'archived'
}

export interface ContatosResponse {
  contatos: Contato[]
  total: number
}

// ===== CARDS =====
export interface Card {
  id: string
  clinicaId: string
  contatoId: string
  funilId: string
  estagioId: string
  title: string
  priority: 'baixa' | 'média' | 'alta'
  estimatedValue: number
  serviceOfInterest?: string
  channel: 'Indicação' | 'Redes Sociais' | 'Google' | 'Comercial de TV' | 'Outdoor' | 'Outro'
  lastContactAt: string | { _seconds: number; _nanoseconds: number }
  createdAt: string | { _seconds: number; _nanoseconds: number }
  updatedAt: string | { _seconds: number; _nanoseconds: number }
}

export interface CreateCardRequest {
  contatoId: string
  funilId: string
  title: string
  priority: 'baixa' | 'média' | 'alta'
  estimatedValue: number
  serviceOfInterest?: string
  channel: 'Indicação' | 'Redes Sociais' | 'Google' | 'Comercial de TV' | 'Outdoor' | 'Outro'
}

export interface UpdateCardRequest {
  title?: string
  priority?: 'baixa' | 'média' | 'alta'
  estimatedValue?: number
  serviceOfInterest?: string
  channel?: 'Indicação' | 'Redes Sociais' | 'Google' | 'Comercial de TV' | 'Outdoor' | 'Outro'
}

export interface MoveCardRequest {
  newEstagioId: string
  newOrderInStage?: number
}
