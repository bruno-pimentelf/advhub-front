# 📋 API Integration Guide - Ailum CRM

## 🔐 Autenticação

Todas as rotas requerem autenticação via Firebase Auth. Inclua o token no header:

```http
Authorization: Bearer <firebase_id_token>
```

---

## 📞 CONTATOS API

### 1. Criar Contato
```http
POST /contatos
```

**Payload:**
```json
{
  "name": "João Silva",
  "phone": "+5511999999999",
  "email": "joao@email.com", // opcional
  "photoUrl": "https://example.com/photo.jpg" // opcional
}
```

**Response (201):**
```json
{
  "id": "contato_123",
  "clinicaId": "clinica_456",
  "name": "João Silva",
  "phone": "+5511999999999",
  "email": "joao@email.com",
  "photoUrl": "https://example.com/photo.jpg",
  "status": "active",
  "lastContactAt": "2024-01-15T10:30:00.000Z",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

### 2. Listar Contatos (com paginação)
```http
GET /contatos?page=1&limit=20
```

**Query Parameters:**
- `page` (opcional): Número da página (padrão: 1)
- `limit` (opcional): Itens por página (padrão: 20)

**Response (200):**
```json
{
  "contatos": [
    {
      "id": "contato_123",
      "clinicaId": "clinica_456",
      "name": "João Silva",
      "phone": "+5511999999999",
      "email": "joao@email.com",
      "photoUrl": "https://example.com/photo.jpg",
      "status": "active",
      "lastContactAt": "2024-01-15T10:30:00.000Z",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "total": 1
}
```

### 3. Buscar Contato Específico
```http
GET /contatos/{id}
```

**Response (200):**
```json
{
  "id": "contato_123",
  "clinicaId": "clinica_456",
  "name": "João Silva",
  "phone": "+5511999999999",
  "email": "joao@email.com",
  "photoUrl": "https://example.com/photo.jpg",
  "status": "active",
  "lastContactAt": "2024-01-15T10:30:00.000Z",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

### 4. Atualizar Contato
```http
PATCH /contatos/{id}
```

**Payload:**
```json
{
  "name": "João Silva Santos", // opcional
  "phone": "+5511888888888",   // opcional
  "email": "joao.santos@email.com", // opcional
  "photoUrl": "https://example.com/new-photo.jpg", // opcional
  "status": "archived" // opcional: "active" | "archived"
}
```

**Response (200):**
```json
{
  "id": "contato_123",
  "clinicaId": "clinica_456",
  "name": "João Silva Santos",
  "phone": "+5511888888888",
  "email": "joao.santos@email.com",
  "photoUrl": "https://example.com/new-photo.jpg",
  "status": "archived",
  "lastContactAt": "2024-01-15T10:30:00.000Z",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T11:45:00.000Z"
}
```

### 5. Deletar Contato
```http
DELETE /contatos/{id}
```

**Response (200):** Sem conteúdo

---

## 🎯 CARDS API

### 1. Criar Card
```http
POST /cards
```

**Payload:**
```json
{
  "contatoId": "contato_123",
  "funilId": "funil_456",
  "title": "Agendamento Consulta Inicial - João Silva",
  "priority": "alta",
  "estimatedValue": 500.00,
  "serviceOfInterest": "Consulta Cardiológica", // opcional
  "channel": "Indicação"
}
```

**Campos obrigatórios:**
- `contatoId`: ID do contato (deve existir)
- `funilId`: ID do funil (deve existir)
- `title`: Título do card
- `priority`: "baixa" | "média" | "alta"
- `estimatedValue`: Valor estimado (number)
- `channel`: "Indicação" | "Redes Sociais" | "Google" | "Comercial de TV" | "Outdoor" | "Outro"

**Response (201):**
```json
{
  "id": "card_789",
  "clinicaId": "clinica_456",
  "contatoId": "contato_123",
  "funilId": "funil_456",
  "estagioId": "estagio_101", // Automaticamente colocado no primeiro estágio
  "title": "Agendamento Consulta Inicial - João Silva",
  "priority": "alta",
  "estimatedValue": 500.00,
  "serviceOfInterest": "Consulta Cardiológica",
  "channel": "Indicação",
  "lastContactAt": "2024-01-15T12:00:00.000Z",
  "createdAt": "2024-01-15T12:00:00.000Z",
  "updatedAt": "2024-01-15T12:00:00.000Z"
}
```

### 2. Listar Cards por Funil
```http
GET /cards?funilId={funilId}
```

**Query Parameters:**
- `funilId` (obrigatório): ID do funil

**Response (200):**
```json
[
  {
    "id": "card_789",
    "clinicaId": "clinica_456",
    "contatoId": "contato_123",
    "funilId": "funil_456",
    "estagioId": "estagio_101",
    "title": "Agendamento Consulta Inicial - João Silva",
    "priority": "alta",
    "estimatedValue": 500.00,
    "serviceOfInterest": "Consulta Cardiológica",
    "channel": "Indicação",
    "lastContactAt": "2024-01-15T12:00:00.000Z",
    "createdAt": "2024-01-15T12:00:00.000Z",
    "updatedAt": "2024-01-15T12:00:00.000Z"
  }
]
```

### 3. Buscar Card Específico
```http
GET /cards/{id}
```

**Response (200):**
```json
{
  "id": "card_789",
  "clinicaId": "clinica_456",
  "contatoId": "contato_123",
  "funilId": "funil_456",
  "estagioId": "estagio_101",
  "title": "Agendamento Consulta Inicial - João Silva",
  "priority": "alta",
  "estimatedValue": 500.00,
  "serviceOfInterest": "Consulta Cardiológica",
  "channel": "Indicação",
  "lastContactAt": "2024-01-15T12:00:00.000Z",
  "createdAt": "2024-01-15T12:00:00.000Z",
  "updatedAt": "2024-01-15T12:00:00.000Z"
}
```

### 4. Atualizar Card
```http
PATCH /cards/{id}
```

**Payload:**
```json
{
  "title": "Agendamento Consulta Cardiológica - João Silva", // opcional
  "priority": "média", // opcional: "baixa" | "média" | "alta"
  "estimatedValue": 600.00, // opcional
  "serviceOfInterest": "Consulta Cardiológica + Exames", // opcional
  "channel": "Google" // opcional
}
```

**Response (200):**
```json
{
  "id": "card_789",
  "clinicaId": "clinica_456",
  "contatoId": "contato_123",
  "funilId": "funil_456",
  "estagioId": "estagio_101",
  "title": "Agendamento Consulta Cardiológica - João Silva",
  "priority": "média",
  "estimatedValue": 600.00,
  "serviceOfInterest": "Consulta Cardiológica + Exames",
  "channel": "Google",
  "lastContactAt": "2024-01-15T12:00:00.000Z",
  "createdAt": "2024-01-15T12:00:00.000Z",
  "updatedAt": "2024-01-15T13:30:00.000Z"
}
```

### 5. Mover Card (Drag & Drop) ⭐
```http
PATCH /cards/{id}/move
```

**Payload:**
```json
{
  "newEstagioId": "estagio_102",
  "newOrderInStage": 2 // opcional
}
```

**Response (200):**
```json
{
  "id": "card_789",
  "clinicaId": "clinica_456",
  "contatoId": "contato_123",
  "funilId": "funil_456",
  "estagioId": "estagio_102", // Atualizado
  "title": "Agendamento Consulta Cardiológica - João Silva",
  "priority": "média",
  "estimatedValue": 600.00,
  "serviceOfInterest": "Consulta Cardiológica + Exames",
  "channel": "Google",
  "lastContactAt": "2024-01-15T12:00:00.000Z",
  "createdAt": "2024-01-15T12:00:00.000Z",
  "updatedAt": "2024-01-15T14:00:00.000Z"
}
```

### 6. Deletar Card
```http
DELETE /cards/{id}
```

**Response (200):** Sem conteúdo

---

## 🔗 RELAÇÃO ENTRE CONTATOS E CARDS

### **Conceito:**
- **1 Contato** pode ter **múltiplos Cards**
- **1 Card** pertence a **1 Contato específico**
- Cards representam **oportunidades/interações** com um contato

### **Fluxo Típico:**

1. **Criar Contato** → `POST /contatos`
2. **Criar Card para o Contato** → `POST /cards` (usando `contatoId`)
3. **Mover Card entre Estágios** → `PATCH /cards/{id}/move`
4. **Atualizar informações** → `PATCH /contatos/{id}` ou `PATCH /cards/{id}`

### **Exemplo Prático:**

```javascript
// 1. Criar contato
const contato = await fetch('/contatos', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` },
  body: JSON.stringify({
    name: "Maria Santos",
    phone: "+5511999888777",
    email: "maria@email.com"
  })
});

// 2. Criar card para o contato
const card = await fetch('/cards', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` },
  body: JSON.stringify({
    contatoId: contato.id,
    funilId: "funil_comercial",
    title: "Interesse em Cirurgia Plástica",
    priority: "alta",
    estimatedValue: 15000.00,
    channel: "Indicação"
  })
});

// 3. Mover card para próximo estágio
await fetch(`/cards/${card.id}/move`, {
  method: 'PATCH',
  headers: { 'Authorization': `Bearer ${token}` },
  body: JSON.stringify({
    newEstagioId: "estagio_agendamento"
  })
});
```

---

## 📊 CÓDIGOS DE ERRO

### **400 - Bad Request**
```json
{
  "statusCode": 400,
  "message": "Não é possível deletar um funil que contém cards",
  "error": "Bad Request"
}
```

### **401 - Unauthorized**
```json
{
  "statusCode": 401,
  "message": "Token de autenticação não encontrado.",
  "error": "Unauthorized"
}
```

### **403 - Forbidden**
```json
{
  "statusCode": 403,
  "message": "Acesso negado a este contato",
  "error": "Forbidden"
}
```

### **404 - Not Found**
```json
{
  "statusCode": 404,
  "message": "Contato não encontrado",
  "error": "Not Found"
}
```

### **422 - Validation Error**
```json
{
  "statusCode": 422,
  "message": [
    "name should not be empty",
    "phone must be a string"
  ],
  "error": "Unprocessable Entity"
}
```

---

## 🚀 EXEMPLO DE INTEGRAÇÃO COMPLETA

```javascript
class AilumAPI {
  constructor(baseURL, token) {
    this.baseURL = baseURL;
    this.token = token;
  }

  async request(endpoint, options = {}) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json',
        ...options.headers
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }

    return response.json();
  }

  // Contatos
  async createContato(data) {
    return this.request('/contatos', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async getContatos(page = 1, limit = 20) {
    return this.request(`/contatos?page=${page}&limit=${limit}`);
  }

  async getContato(id) {
    return this.request(`/contatos/${id}`);
  }

  async updateContato(id, data) {
    return this.request(`/contatos/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    });
  }

  async deleteContato(id) {
    return this.request(`/contatos/${id}`, { method: 'DELETE' });
  }

  // Cards
  async createCard(data) {
    return this.request('/cards', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async getCards(funilId) {
    return this.request(`/cards?funilId=${funilId}`);
  }

  async getCard(id) {
    return this.request(`/cards/${id}`);
  }

  async updateCard(id, data) {
    return this.request(`/cards/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    });
  }

  async moveCard(id, newEstagioId, newOrderInStage) {
    return this.request(`/cards/${id}/move`, {
      method: 'PATCH',
      body: JSON.stringify({ newEstagioId, newOrderInStage })
    });
  }

  async deleteCard(id) {
    return this.request(`/cards/${id}`, { method: 'DELETE' });
  }
}

// Uso
const api = new AilumAPI('https://api.ailum.com', firebaseToken);

// Criar contato e card
const contato = await api.createContato({
  name: "João Silva",
  phone: "+5511999999999",
  email: "joao@email.com",
  photoUrl: "https://example.com/joao-photo.jpg"
});

const card = await api.createCard({
  contatoId: contato.id,
  funilId: "funil_comercial",
  title: "Consulta Inicial",
  priority: "alta",
  estimatedValue: 500.00,
  channel: "Indicação"
});
```

---

## 📝 NOTAS IMPORTANTES

1. **Autenticação obrigatória** em todas as rotas
2. **Isolamento por clínica** - usuário só acessa dados da sua clínica
3. **Cards são criados automaticamente** no primeiro estágio do funil
4. **Validação de relacionamentos** - contato e funil devem existir
5. **Timestamps** são gerenciados automaticamente pelo backend
6. **Paginação** disponível apenas para contatos
7. **Drag & Drop** implementado via endpoint `/move`

---

**Base URL:** `https://api.ailum.com` (ou sua URL de desenvolvimento)  
**Versão:** v1  
**Formato:** JSON  
**Autenticação:** Firebase ID Token
