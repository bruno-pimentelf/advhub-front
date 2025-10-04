# 🔄 Funis e Estágios API Guide - Ailum CRM

## 🔐 Autenticação

Todas as rotas requerem autenticação via Firebase Auth. Inclua o token no header:

```http
Authorization: Bearer <firebase_id_token>
```

---

## 🔄 FUNIS API

### 1. Criar Funil
```http
POST /funis
```

**Payload:**
```json
{
  "name": "Funil Comercial",
  "description": "Funil para vendas de consultas e procedimentos" // opcional
}
```

**Response (201):**
```json
{
  "id": "funil_123",
  "clinicaId": "clinica_456",
  "name": "Funil Comercial",
  "description": "Funil para vendas de consultas e procedimentos",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

### 2. Listar Funis
```http
GET /funis
```

**Response (200):**
```json
[
  {
    "id": "funil_123",
    "clinicaId": "clinica_456",
    "name": "Funil Comercial",
    "description": "Funil para vendas de consultas e procedimentos",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
  {
    "id": "funil_124",
    "clinicaId": "clinica_456",
    "name": "Funil Pós-Venda",
    "description": "Acompanhamento de pacientes após procedimentos",
    "createdAt": "2024-01-15T11:00:00.000Z",
    "updatedAt": "2024-01-15T11:00:00.000Z"
  }
]
```

### 3. Buscar Funil Específico
```http
GET /funis/{id}
```

**Response (200):**
```json
{
  "id": "funil_123",
  "clinicaId": "clinica_456",
  "name": "Funil Comercial",
  "description": "Funil para vendas de consultas e procedimentos",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

### 4. Atualizar Funil
```http
PATCH /funis/{id}
```

**Payload:**
```json
{
  "name": "Funil Comercial Atualizado", // opcional
  "description": "Funil otimizado para vendas" // opcional
}
```

**Response (200):**
```json
{
  "id": "funil_123",
  "clinicaId": "clinica_456",
  "name": "Funil Comercial Atualizado",
  "description": "Funil otimizado para vendas",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T12:00:00.000Z"
}
```

### 5. Deletar Funil
```http
DELETE /funis/{id}
```

**Response (200):** Sem conteúdo

**⚠️ Restrições:**
- Não é possível deletar um funil que contém estágios
- Não é possível deletar um funil que contém cards

---

## 📊 ESTÁGIOS API

### 1. Criar Estágio
```http
POST /estagios
```

**Payload:**
```json
{
  "funilId": "funil_123",
  "name": "Primeiro Contato",
  "description": "Estágio inicial do funil", // opcional
  "color": "#FF5733", // opcional - cor em hex
  "order": 0 // posição no Kanban (0, 1, 2...)
}
```

**Campos obrigatórios:**
- `funilId`: ID do funil (deve existir)
- `name`: Nome do estágio
- `order`: Posição no Kanban (número sequencial)

**Response (201):**
```json
{
  "id": "estagio_456",
  "clinicaId": "clinica_456",
  "funilId": "funil_123",
  "name": "Primeiro Contato",
  "description": "Estágio inicial do funil",
  "color": "#FF5733",
  "order": 0,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

### 2. Listar Estágios por Funil
```http
GET /estagios/funil/{funilId}
```

**Response (200):**
```json
[
  {
    "id": "estagio_456",
    "clinicaId": "clinica_456",
    "funilId": "funil_123",
    "name": "Primeiro Contato",
    "description": "Estágio inicial do funil",
    "color": "#FF5733",
    "order": 0,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
  {
    "id": "estagio_457",
    "clinicaId": "clinica_456",
    "funilId": "funil_123",
    "name": "Agendamento",
    "description": "Cliente agendou consulta",
    "color": "#33FF57",
    "order": 1,
    "createdAt": "2024-01-15T10:35:00.000Z",
    "updatedAt": "2024-01-15T10:35:00.000Z"
  },
  {
    "id": "estagio_458",
    "clinicaId": "clinica_456",
    "funilId": "funil_123",
    "name": "Consulta Realizada",
    "description": "Consulta foi realizada com sucesso",
    "color": "#3357FF",
    "order": 2,
    "createdAt": "2024-01-15T10:40:00.000Z",
    "updatedAt": "2024-01-15T10:40:00.000Z"
  }
]
```

### 3. Buscar Estágio Específico
```http
GET /estagios/{id}
```

**Response (200):**
```json
{
  "id": "estagio_456",
  "clinicaId": "clinica_456",
  "funilId": "funil_123",
  "name": "Primeiro Contato",
  "description": "Estágio inicial do funil",
  "color": "#FF5733",
  "order": 0,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

### 4. Atualizar Estágio
```http
PATCH /estagios/{id}
```

**Payload:**
```json
{
  "name": "Primeiro Contato Atualizado", // opcional
  "description": "Descrição atualizada", // opcional
  "color": "#FF0000", // opcional - cor em hex
  "order": 1 // opcional - nova posição
}
```

**Response (200):**
```json
{
  "id": "estagio_456",
  "clinicaId": "clinica_456",
  "funilId": "funil_123",
  "name": "Primeiro Contato Atualizado",
  "description": "Descrição atualizada",
  "color": "#FF0000",
  "order": 1,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T12:00:00.000Z"
}
```

### 5. Deletar Estágio
```http
DELETE /estagios/{id}
```

**Response (200):** Sem conteúdo

**⚠️ Restrições:**
- Não é possível deletar um estágio que contém cards

---

## 🔗 RELAÇÃO ENTRE FUNIS E ESTÁGIOS

### **Conceito:**
- **1 Funil** pode ter **múltiplos Estágios**
- **1 Estágio** pertence a **1 Funil específico**
- Estágios representam **colunas do Kanban** com ordem definida
- Cards são movidos entre estágios dentro do mesmo funil

### **Fluxo Típico de Configuração:**

1. **Criar Funil** → `POST /funis`
2. **Criar Estágios** → `POST /estagios` (múltiplas vezes)
3. **Listar Estágios** → `GET /estagios/funil/{funilId}` (para montar o Kanban)
4. **Criar Cards** → Cards são automaticamente colocados no primeiro estágio

### **Exemplo Prático de Configuração:**

```javascript
// 1. Criar funil comercial
const funil = await fetch('/funis', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` },
  body: JSON.stringify({
    name: "Funil Comercial",
    description: "Processo de vendas de consultas"
  })
});

// 2. Criar estágios do funil (em ordem)
const estagios = [
  { name: "Lead", color: "#FF5733", order: 0 },
  { name: "Qualificado", color: "#FFA500", order: 1 },
  { name: "Agendado", color: "#33FF57", order: 2 },
  { name: "Consulta Realizada", color: "#3357FF", order: 3 },
  { name: "Fechado", color: "#8A2BE2", order: 4 }
];

for (const estagio of estagios) {
  await fetch('/estagios', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({
      funilId: funil.id,
      ...estagio
    })
  });
}

// 3. Listar estágios para montar o Kanban
const estagiosList = await fetch(`/estagios/funil/${funil.id}`, {
  headers: { 'Authorization': `Bearer ${token}` }
});
```

---

## 🎨 SUGESTÕES DE CORES PARA ESTÁGIOS

### **Paleta Recomendada:**
```javascript
const coresSugeridas = {
  "Lead": "#FF5733",        // Vermelho/Laranja
  "Qualificado": "#FFA500", // Laranja
  "Agendado": "#33FF57",    // Verde
  "Em Andamento": "#3357FF", // Azul
  "Fechado": "#8A2BE2",     // Roxo
  "Perdido": "#808080"      // Cinza
};
```

### **Exemplo de Funil Completo:**

```javascript
// Funil de Vendas Médicas
const funilVendas = {
  name: "Funil de Vendas",
  description: "Processo completo de vendas médicas",
  estagios: [
    { name: "Lead", color: "#FF5733", order: 0 },
    { name: "Interessado", color: "#FFA500", order: 1 },
    { name: "Qualificado", color: "#FFD700", order: 2 },
    { name: "Agendado", color: "#33FF57", order: 3 },
    { name: "Consulta Realizada", color: "#3357FF", order: 4 },
    { name: "Proposta Enviada", color: "#9370DB", order: 5 },
    { name: "Fechado - Ganho", color: "#00FF00", order: 6 },
    { name: "Fechado - Perdido", color: "#808080", order: 7 }
  ]
};
```

---

## 📊 CÓDIGOS DE ERRO

### **400 - Bad Request**
```json
{
  "statusCode": 400,
  "message": "Não é possível deletar um funil que contém estágios",
  "error": "Bad Request"
}
```

```json
{
  "statusCode": 400,
  "message": "Não é possível deletar um estágio que contém cards",
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
  "message": "Acesso negado a este funil",
  "error": "Forbidden"
}
```

### **404 - Not Found**
```json
{
  "statusCode": 404,
  "message": "Funil não encontrado",
  "error": "Not Found"
}
```

### **422 - Validation Error**
```json
{
  "statusCode": 422,
  "message": [
    "name should not be empty",
    "order must be a number"
  ],
  "error": "Unprocessable Entity"
}
```

---

## 🚀 EXEMPLO DE INTEGRAÇÃO COMPLETA

```javascript
class FunisEstagiosAPI {
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

  // Funis
  async createFunil(data) {
    return this.request('/funis', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async getFunis() {
    return this.request('/funis');
  }

  async getFunil(id) {
    return this.request(`/funis/${id}`);
  }

  async updateFunil(id, data) {
    return this.request(`/funis/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    });
  }

  async deleteFunil(id) {
    return this.request(`/funis/${id}`, { method: 'DELETE' });
  }

  // Estágios
  async createEstagio(data) {
    return this.request('/estagios', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async getEstagiosByFunil(funilId) {
    return this.request(`/estagios/funil/${funilId}`);
  }

  async getEstagio(id) {
    return this.request(`/estagios/${id}`);
  }

  async updateEstagio(id, data) {
    return this.request(`/estagios/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    });
  }

  async deleteEstagio(id) {
    return this.request(`/estagios/${id}`, { method: 'DELETE' });
  }

  // Método helper para criar funil completo
  async createFunilCompleto(funilData, estagiosData) {
    // 1. Criar funil
    const funil = await this.createFunil(funilData);
    
    // 2. Criar estágios
    const estagios = [];
    for (const estagioData of estagiosData) {
      const estagio = await this.createEstagio({
        funilId: funil.id,
        ...estagioData
      });
      estagios.push(estagio);
    }
    
    return { funil, estagios };
  }
}

// Uso
const api = new FunisEstagiosAPI('https://api.ailum.com', firebaseToken);

// Criar funil completo
const { funil, estagios } = await api.createFunilCompleto(
  {
    name: "Funil Comercial",
    description: "Processo de vendas"
  },
  [
    { name: "Lead", color: "#FF5733", order: 0 },
    { name: "Qualificado", color: "#FFA500", order: 1 },
    { name: "Agendado", color: "#33FF57", order: 2 },
    { name: "Fechado", color: "#3357FF", order: 3 }
  ]
);

console.log('Funil criado:', funil);
console.log('Estágios criados:', estagios);
```

---

## 📝 NOTAS IMPORTANTES

1. **Autenticação obrigatória** em todas as rotas
2. **Isolamento por clínica** - usuário só acessa dados da sua clínica
3. **Ordem dos estágios** é importante para o Kanban (campo `order`)
4. **Cores em formato hex** (#FF5733) para personalização visual
5. **Validação de relacionamentos** - estágio deve pertencer a funil existente
6. **Restrições de deleção** - funis/estágios com cards não podem ser deletados
7. **Estágios ordenados** automaticamente por `order` na listagem
8. **Primeiro estágio** é onde novos cards são colocados automaticamente

---

## 🎯 FLUXO RECOMENDADO PARA FRONTEND

### **1. Configuração Inicial:**
```javascript
// Criar funil padrão
const funilPadrao = await api.createFunil({
  name: "Funil Comercial",
  description: "Funil principal de vendas"
});

// Criar estágios padrão
const estagiosPadrao = [
  { name: "Novo Lead", color: "#FF5733", order: 0 },
  { name: "Interessado", color: "#FFA500", order: 1 },
  { name: "Agendado", color: "#33FF57", order: 2 },
  { name: "Consulta Realizada", color: "#3357FF", order: 3 },
  { name: "Fechado", color: "#8A2BE2", order: 4 }
];

for (const estagio of estagiosPadrao) {
  await api.createEstagio({
    funilId: funilPadrao.id,
    ...estagio
  });
}
```

### **2. Montar Kanban:**
```javascript
// Buscar funis
const funis = await api.getFunis();

// Para cada funil, buscar seus estágios
for (const funil of funis) {
  const estagios = await api.getEstagiosByFunil(funil.id);
  // Ordenar por 'order' e montar colunas do Kanban
  estagios.sort((a, b) => a.order - b.order);
  // Renderizar colunas...
}
```

---

**Base URL:** `https://api.ailum.com` (ou sua URL de desenvolvimento)  
**Versão:** v1  
**Formato:** JSON  
**Autenticação:** Firebase ID Token
