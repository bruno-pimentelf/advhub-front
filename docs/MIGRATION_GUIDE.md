# Guia de Migração - Nova Arquitetura de Contatos e Funis

## 📋 Visão Geral

Esta migração elimina a abstração de **Cards** e implementa uma abordagem mais direta onde **Contatos** podem estar em múltiplos **Funis** simultaneamente, cada um em um **Estágio** específico.

### 🎯 Principais Mudanças

- ❌ **Removido**: Módulo de `Cards`
- ✅ **Adicionado**: Sistema de `ContatoFunil` com subcoleções
- 🔄 **Mantido**: Estrutura de `Contatos`, `Funis` e `Estágios`

---

## 🏗️ Nova Arquitetura

### Estrutura de Dados

```typescript
// ANTES: Card (abstração desnecessária)
interface Card {
  id: string;
  contatoId: string;
  funilId: string;
  estagioId: string;
  title: string;
  priority: CardPriority;
  estimatedValue: number;
  // ... outros campos
}

// DEPOIS: ContatoFunil (relação direta)
interface ContatoFunil {
  contatoId: string;
  funilId: string;
  estagioId: string;
  estagioName: string;    // denormalizado
  funilName: string;      // denormalizado
  addedAt: Timestamp;
  lastMovedAt: Timestamp;
}
```

### Estrutura no Firestore

```
contatos/
  {contatoId}/
    funis/
      {funilId} -> ContatoFunil
```

---

## 🔄 Mudanças nos Endpoints

### ❌ Endpoints Removidos

```http
# Todos os endpoints de Cards serão removidos
GET    /cards
POST   /cards
GET    /cards/:id
PATCH  /cards/:id
DELETE /cards/:id
PATCH  /cards/:id/move
```

### ✅ Novos Endpoints

#### 1. Gerenciar Contatos em Funis

```http
# Adicionar contato a um funil
POST /contatos/:contatoId/funis
Content-Type: application/json
{
  "funilId": "funil-123"
}

# Mover contato para outro estágio
PATCH /contatos/:contatoId/funis/:funilId/move
Content-Type: application/json
{
  "newEstagioId": "estagio-456"
}

# Remover contato de um funil
DELETE /contatos/:contatoId/funis/:funilId

# Listar funis de um contato
GET /contatos/:contatoId/funis
```

#### 2. Consultar Contatos por Funil

```http
# Listar contatos de um funil
GET /funis/:funilId/contatos
```

---

## 📱 Implementação no Frontend

### 1. Substituir Consultas de Cards

#### ANTES (Cards)
```typescript
// Buscar cards de um funil
const cards = await api.get(`/cards?funilId=${funilId}`);

// Mover card para outro estágio
await api.patch(`/cards/${cardId}/move`, {
  newEstagioId: newEstagioId
});
```

#### DEPOIS (ContatoFunil)
```typescript
// Buscar contatos de um funil
const contatosFunil = await api.get(`/funis/${funilId}/contatos`);

// Mover contato para outro estágio
await api.patch(`/contatos/${contatoId}/funis/${funilId}/move`, {
  newEstagioId: newEstagioId
});
```

### 2. Estrutura de Dados para Kanban

#### ANTES
```typescript
interface KanbanCard {
  id: string;
  title: string;
  priority: string;
  estimatedValue: number;
  // dados do card
}

// Agrupar por estágio
const cardsByStage = groupBy(cards, 'estagioId');
```

#### DEPOIS
```typescript
interface KanbanContato {
  contatoId: string;
  contato: {
    name: string;
    phone: string;
    email?: string;
    photoUrl?: string;
  };
  funilId: string;
  estagioId: string;
  estagioName: string;
  funilName: string;
  addedAt: string;
  lastMovedAt: string;
}

// Agrupar por estágio
const contatosByStage = groupBy(contatosFunil, 'estagioId');
```

### 3. Componentes de Kanban

#### ANTES
```tsx
// CardComponent.tsx
interface CardProps {
  card: Card;
  onMove: (cardId: string, newEstagioId: string) => void;
}

const CardComponent = ({ card, onMove }: CardProps) => {
  return (
    <div className="card">
      <h3>{card.title}</h3>
      <p>Prioridade: {card.priority}</p>
      <p>Valor: R$ {card.estimatedValue}</p>
      {/* ... */}
    </div>
  );
};
```

#### DEPOIS
```tsx
// ContatoFunilComponent.tsx
interface ContatoFunilProps {
  contatoFunil: ContatoFunil;
  contato: Contato;
  onMove: (contatoId: string, funilId: string, newEstagioId: string) => void;
}

const ContatoFunilComponent = ({ contatoFunil, contato, onMove }: ContatoFunilProps) => {
  return (
    <div className="contato-funil">
      <div className="contato-info">
        <img src={contato.photoUrl} alt={contato.name} />
        <h3>{contato.name}</h3>
        <p>{contato.phone}</p>
      </div>
      <div className="funil-info">
        <span className="funil-name">{contatoFunil.funilName}</span>
        <span className="estagio-name">{contatoFunil.estagioName}</span>
      </div>
      {/* ... */}
    </div>
  );
};
```

### 4. Gerenciamento de Estado

#### ANTES
```typescript
// store/cards.ts
interface CardsState {
  cards: Card[];
  loading: boolean;
  error: string | null;
}

const useCardsStore = create<CardsState>((set) => ({
  cards: [],
  loading: false,
  error: null,
  
  fetchCardsByFunil: async (funilId: string) => {
    set({ loading: true });
    try {
      const cards = await api.get(`/cards?funilId=${funilId}`);
      set({ cards, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
}));
```

#### DEPOIS
```typescript
// store/contatos-funil.ts
interface ContatosFunilState {
  contatosFunil: ContatoFunil[];
  contatos: Record<string, Contato>; // cache de contatos
  loading: boolean;
  error: string | null;
}

const useContatosFunilStore = create<ContatosFunilState>((set, get) => ({
  contatosFunil: [],
  contatos: {},
  loading: false,
  error: null,
  
  fetchContatosByFunil: async (funilId: string) => {
    set({ loading: true });
    try {
      const contatosFunil = await api.get(`/funis/${funilId}/contatos`);
      
      // Buscar dados dos contatos
      const contatoIds = [...new Set(contatosFunil.map(cf => cf.contatoId))];
      const contatos = await Promise.all(
        contatoIds.map(id => api.get(`/contatos/${id}`))
      );
      
      const contatosMap = contatos.reduce((acc, contato) => {
        acc[contato.id] = contato;
        return acc;
      }, {});
      
      set({ 
        contatosFunil, 
        contatos: { ...get().contatos, ...contatosMap },
        loading: false 
      });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
  
  moveContato: async (contatoId: string, funilId: string, newEstagioId: string) => {
    try {
      await api.patch(`/contatos/${contatoId}/funis/${funilId}/move`, {
        newEstagioId
      });
      
      // Atualizar estado local
      set(state => ({
        contatosFunil: state.contatosFunil.map(cf => 
          cf.contatoId === contatoId && cf.funilId === funilId
            ? { ...cf, estagioId: newEstagioId, lastMovedAt: new Date().toISOString() }
            : cf
        )
      }));
    } catch (error) {
      set({ error: error.message });
    }
  },
}));
```

### 5. Adicionar Contato a Funil

```typescript
// Adicionar contato a um funil
const addContatoToFunil = async (contatoId: string, funilId: string) => {
  try {
    await api.post(`/contatos/${contatoId}/funis`, { funilId });
    
    // Atualizar estado local
    const newContatoFunil = {
      contatoId,
      funilId,
      estagioId: 'primeiro-estagio-id', // será definido pelo backend
      estagioName: 'Primeiro Estágio',
      funilName: 'Nome do Funil',
      addedAt: new Date().toISOString(),
      lastMovedAt: new Date().toISOString(),
    };
    
    set(state => ({
      contatosFunil: [...state.contatosFunil, newContatoFunil]
    }));
  } catch (error) {
    console.error('Erro ao adicionar contato ao funil:', error);
  }
};
```

---

## 🔧 Utilitários e Helpers

### 1. Agrupar Contatos por Estágio

```typescript
// utils/kanban.ts
export const groupContatosByEstagio = (contatosFunil: ContatoFunil[]) => {
  return contatosFunil.reduce((acc, contatoFunil) => {
    const estagioId = contatoFunil.estagioId;
    if (!acc[estagioId]) {
      acc[estagioId] = [];
    }
    acc[estagioId].push(contatoFunil);
    return acc;
  }, {} as Record<string, ContatoFunil[]>);
};
```

### 2. Buscar Contato por ID

```typescript
// utils/contatos.ts
export const getContatoById = (contatoId: string, contatos: Record<string, Contato>) => {
  return contatos[contatoId];
};

export const getContatoFunilWithContato = (
  contatoFunil: ContatoFunil, 
  contatos: Record<string, Contato>
) => {
  return {
    ...contatoFunil,
    contato: getContatoById(contatoFunil.contatoId, contatos)
  };
};
```

### 3. Filtros e Busca

```typescript
// utils/filters.ts
export const filterContatosByFunil = (
  contatosFunil: ContatoFunil[], 
  funilId: string
) => {
  return contatosFunil.filter(cf => cf.funilId === funilId);
};

export const searchContatosInFunil = (
  contatosFunil: ContatoFunil[],
  contatos: Record<string, Contato>,
  searchTerm: string
) => {
  return contatosFunil.filter(cf => {
    const contato = contatos[cf.contatoId];
    return contato?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           contato?.phone.includes(searchTerm);
  });
};
```

---

## 📊 Exemplo de Implementação Completa

### Kanban Component

```tsx
// components/KanbanBoard.tsx
import React from 'react';
import { useContatosFunilStore } from '../store/contatos-funil';
import { useEstagiosStore } from '../store/estagios';
import { ContatoFunilComponent } from './ContatoFunilComponent';

interface KanbanBoardProps {
  funilId: string;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ funilId }) => {
  const { contatosFunil, contatos, loading, fetchContatosByFunil, moveContato } = useContatosFunilStore();
  const { estagios } = useEstagiosStore();
  
  React.useEffect(() => {
    fetchContatosByFunil(funilId);
  }, [funilId]);
  
  const contatosByEstagio = groupContatosByEstagio(
    contatosFunil.filter(cf => cf.funilId === funilId)
  );
  
  const handleMoveContato = (contatoId: string, newEstagioId: string) => {
    moveContato(contatoId, funilId, newEstagioId);
  };
  
  if (loading) return <div>Carregando...</div>;
  
  return (
    <div className="kanban-board">
      {estagios.map(estagio => (
        <div key={estagio.id} className="estagio-column">
          <h3>{estagio.name}</h3>
          <div className="contatos-list">
            {contatosByEstagio[estagio.id]?.map(contatoFunil => (
              <ContatoFunilComponent
                key={`${contatoFunil.contatoId}-${contatoFunil.funilId}`}
                contatoFunil={contatoFunil}
                contato={contatos[contatoFunil.contatoId]}
                onMove={handleMoveContato}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
```

---

## ⚠️ Pontos de Atenção

### 1. Performance
- **Cache de Contatos**: Mantenha um cache dos dados de contatos para evitar requisições desnecessárias
- **Lazy Loading**: Considere implementar paginação para funis com muitos contatos

### 2. Sincronização
- **Real-time**: Considere implementar WebSockets para atualizações em tempo real
- **Otimistic Updates**: Atualize a UI imediatamente e reverta em caso de erro

### 3. UX/UI
- **Loading States**: Mostre indicadores de carregamento durante operações
- **Error Handling**: Trate erros graciosamente com mensagens claras
- **Confirmações**: Confirme ações destrutivas (remover contato do funil)

### 4. Migração Gradual
- **Feature Flags**: Use feature flags para migrar gradualmente
- **Fallback**: Mantenha endpoints antigos temporariamente para rollback
- **Testes**: Teste thoroughly em ambiente de desenvolvimento

---

## 🚀 Checklist de Migração

- [ ] Atualizar tipos TypeScript
- [ ] Substituir chamadas de API de Cards por ContatoFunil
- [ ] Atualizar componentes de Kanban
- [ ] Implementar novo gerenciamento de estado
- [ ] Atualizar utilitários e helpers
- [ ] Testar funcionalidades principais
- [ ] Implementar tratamento de erros
- [ ] Adicionar loading states
- [ ] Testar performance
- [ ] Documentar mudanças para a equipe

---

## 📞 Suporte

Em caso de dúvidas durante a migração, consulte:
- Documentação da API: `/docs`
- Issues conhecidos: `/issues`
- Equipe de desenvolvimento: `dev@ailum.com`

---

**Data da Migração**: [Data atual]  
**Versão**: 2.0.0  
**Responsável**: Equipe de Desenvolvimento
