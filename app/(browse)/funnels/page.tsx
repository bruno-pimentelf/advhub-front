'use client';
import {
  KanbanBoard,
  KanbanCard,
  KanbanCards,
  KanbanHeader,
  KanbanProvider,
} from '@/components/ui/shadcn-io/kanban';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Plus, Search, Settings, Loader2, AlertCircle, Trash2, MoreVertical, Copy, Phone } from 'lucide-react';
import Link from 'next/link';
import { useSidebar } from '@/contexts/sidebar-context';
import { useFunis, useEstagios } from '@/hooks/use-funis';
import { useCards } from '@/hooks/use-cards';
import { CreateFunnelModal } from '@/components/funnels/create-funnel-modal';
import { DeleteFunnelModal } from '@/components/funnels/delete-funnel-modal';
import { LoadingState, ErrorState, EmptyState } from '@/components/ui/loading-state';
import { Skeleton } from '@/components/ui/skeleton';
import { formatFirestoreDate } from '@/lib/utils/date-utils';
import { toast } from 'sonner';
import type { Card, CardWithContact } from '@/lib/api';

const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});

const shortDateFormatter = new Intl.DateTimeFormat('pt-BR', {
  month: 'short',
  day: 'numeric',
});

// Função para converter Card da API para formato do Kanban (memoizada)
const convertCardToKanban = (card: CardWithContact) => ({
  id: card.id,
  name: card.title,
  column: card.estagioId,
  priority: card.priority,
  estimatedValue: card.estimatedValue,
  serviceOfInterest: card.serviceOfInterest,
  channel: card.channel,
  lastContactAt: card.lastContactAt,
  createdAt: card.createdAt,
  contato: card.contato
});

// Componente de skeleton para o card
const CardSkeleton = () => (
  <div className="flex flex-col h-full p-4 border rounded-xl min-h-[140px]">
    {/* Header com Avatar, Nome e Tempo */}
    <div className="flex items-start justify-between mb-3">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="flex-1 min-w-0">
          <Skeleton className="h-4 w-24 mb-1" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
      {/* Indicador de tempo */}
      <div className="flex items-center gap-1 ml-2">
        <Skeleton className="h-2 w-2 rounded-full" />
        <Skeleton className="h-3 w-6" />
      </div>
    </div>
    
    {/* Última mensagem do contato */}
    <div className="mb-4">
      <Skeleton className="h-4 w-full mb-1" />
      <Skeleton className="h-4 w-3/4" />
    </div>
    
    {/* Footer com Prioridade, Valor e Telefone */}
    <div className="flex items-center justify-between mt-auto">
      <div className="flex items-center gap-2">
        <Skeleton className="h-5 w-12 rounded-full" />
        <Skeleton className="h-4 w-16" />
      </div>
      
      {/* Telefone clicável no rodapé */}
      <Skeleton className="h-6 w-12 rounded-full" />
    </div>
  </div>
);

// Componente de skeleton para a coluna
const ColumnSkeleton = () => (
  <div className="flex flex-col gap-4">
    {/* Header da coluna */}
    <div className="flex items-center gap-3 p-4 border rounded-lg">
      <Skeleton className="h-3 w-3 rounded-full" />
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-5 w-6 rounded-full ml-auto" />
    </div>
    
    {/* Cards skeleton */}
    <div className="space-y-3">
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
    </div>
  </div>
);

const FunnelsPage = () => {
  const { isHidden } = useSidebar();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [showCreateFunnel, setShowCreateFunnel] = useState(false);
  const [showDeleteFunnel, setShowDeleteFunnel] = useState(false);
  const [funilToDelete, setFunilToDelete] = useState<any>(null);

  const {
    funis,
    selectedFunil,
    selectedFunilId,
    isLoadingFunis,
    funisError,
    setSelectedFunilId,
    refetchFunis
  } = useFunis();

  const {
    estagios,
    isLoadingEstagios,
    estagiosError
  } = useEstagios(selectedFunilId || undefined);

  const {
    cards: apiCards,
    isLoadingCards,
    cardsError,
    handleMoveCard
  } = useCards(selectedFunilId || undefined);

  // Estado local para controlar o drag and drop
  const [localCards, setLocalCards] = useState<ReturnType<typeof convertCardToKanban>[]>([]);
  const [isMovingCard, setIsMovingCard] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Converter cards da API para formato do Kanban (memoizado)
  const cards = useMemo(() => apiCards.map(convertCardToKanban), [apiCards]);

  // Inicializar estado local apenas uma vez
  useEffect(() => {
    if (!isInitialized && apiCards.length > 0) {
      setLocalCards(apiCards.map(convertCardToKanban));
      setIsInitialized(true);
    }
  }, [apiCards, isInitialized]);

  // Selecionar primeiro funil automaticamente quando carregar
  useEffect(() => {
    if (funis.length > 0 && !selectedFunilId) {
      setSelectedFunilId(funis[0].id);
    }
  }, [funis, selectedFunilId, setSelectedFunilId]);

  // Detectar estado da sidebar
  useEffect(() => {
    const checkSidebarState = () => {
      const sidebar = document.querySelector('[data-sidebar]');
      if (sidebar) {
        const isCollapsed = sidebar.classList.contains('w-16');
        setSidebarCollapsed(isCollapsed);
      }
    };

    // Verificar estado inicial
    checkSidebarState();

    // Observer para mudanças na sidebar
    const observer = new MutationObserver(checkSidebarState);
    const sidebar = document.querySelector('[data-sidebar]');
    if (sidebar) {
      observer.observe(sidebar, { 
        attributes: true, 
        attributeFilter: ['class'] 
      });
    }

    return () => observer.disconnect();
  }, []);

  // Função para lidar com mudança de funil
  const handleFunnelChange = (funilId: string) => {
    setSelectedFunilId(funilId);
  };

  // Função para abrir modal de deletar
  const handleDeleteClick = (funil: any) => {
    setFunilToDelete(funil);
    setShowDeleteFunnel(true);
  };

  // Função para fechar modal de deletar
  const handleDeleteClose = () => {
    setShowDeleteFunnel(false);
    setFunilToDelete(null);
  };

  // Função para lidar com movimento de cards no Kanban (movimento otimista)
  const handleCardMove = async (cardId: string, newEstagioId: string) => {
    // Marcar card como sendo movido
    setIsMovingCard(cardId);
    
    try {
      // Chamar API em background
      await handleMoveCard(cardId, { newEstagioId });
    } catch (error) {
      console.error('Erro ao mover card:', error);
      
      // Reverter movimento se API falhar
      setLocalCards(prevCards => 
        prevCards.map(card => 
          card.id === cardId 
            ? { ...card, column: cards.find(c => c.id === cardId)?.column || card.column }
            : card
        )
      );
      
      // Mostrar toast de erro
      toast.error('Erro ao mover card. Tente novamente.');
    } finally {
      // Remover indicador de movimento
      setIsMovingCard(null);
    }
  };

  // Função para copiar telefone para área de transferência
  const handleCopyPhone = async (phone: string) => {
    try {
      await navigator.clipboard.writeText(phone);
      toast.success(`Telefone copiado: ${phone}`);
    } catch (error) {
      console.error('Erro ao copiar telefone:', error);
      toast.error('Erro ao copiar telefone');
    }
  };

  // Converter estágios para formato do Kanban
  const columns = estagios.map(estagio => ({
    id: estagio.id,
    name: estagio.name,
    color: estagio.color,
  }));

  // Loading state
  if (isLoadingFunis) {
    return (
      <div className="mb-4 mt-2 overflow-x-hidden">
        {/* Header skeleton */}
        <header className={`fixed top-0 right-0 z-50 mb-3 pb-3 pt-2 border-b border-border bg-background/95 backdrop-blur-md transition-all duration-300 ease-in-out ${isHidden ? 'left-0' : sidebarCollapsed ? 'left-16' : 'left-56'}`}>
          <div className="flex items-center justify-between px-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-[200px]" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-24" />
            </div>
          </div>
        </header>

        {/* Conteúdo principal skeleton */}
        <div className="mx-4 pt-16 overflow-x-auto">
          <div className="min-w-max">
            <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6">
              <ColumnSkeleton />
              <ColumnSkeleton />
              <ColumnSkeleton />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (funisError) {
    return (
      <div className="mx-4 mb-4 mt-2">
        <ErrorState
          title="Erro ao carregar funis"
          message="Não foi possível carregar os funis. Verifique sua conexão e tente novamente."
          onRetry={refetchFunis}
          retryLabel="Recarregar funis"
        />
      </div>
    );
  }

  // Empty state
  if (funis.length === 0) {
    return (
      <div className="mx-4 mb-4 mt-2">
        <EmptyState
          title="Nenhum funil encontrado"
          message="Crie seu primeiro funil para começar a gerenciar seus processos de vendas."
          actionLabel="Criar Primeiro Funil"
          onAction={() => setShowCreateFunnel(true)}
          icon={<Plus className="h-8 w-8 text-muted-foreground" />}
        />
      </div>
    );
  }

  return (
    <div className="mb-4 mt-2 overflow-x-hidden">
      {/* Header com seleção de funil e botões de ação */}
      <header className={`fixed top-0 right-0 z-50 mb-3 pb-3 pt-2 border-b border-border bg-background/95 backdrop-blur-md transition-all duration-300 ease-in-out ${isHidden ? 'left-0' : sidebarCollapsed ? 'left-16' : 'left-56'}`}>
        <div className="flex items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Select value={selectedFunilId || ''} onValueChange={handleFunnelChange}>
              <SelectTrigger className="w-[200px] h-10">
                <SelectValue>
                  {selectedFunil?.name || 'Selecione um funil'}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {funis.map((funil) => (
                  <SelectItem key={funil.id} value={funil.id}>
                    <div className="flex flex-col items-start">
                      <span className="font-medium">{funil.name}</span>
                      <span className="text-xs text-muted-foreground">{funil.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center gap-2">
            <Link href="/funnel-explorer">
              <Button 
                variant="outline" 
                size="sm"
                className="flex items-center gap-2 border-primary-200 dark:border-primary-800/50 hover:bg-primary-100 dark:hover:bg-primary-900/30 hover:border-primary-300 dark:hover:border-primary-700/50 cursor-pointer"
              >
                <Search className="h-4 w-4" />
                Explorar
              </Button>
            </Link>
            
            {selectedFunil && funis.length > 1 && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleDeleteClick(selectedFunil)}
                className="flex items-center gap-2 border-destructive/20 hover:bg-destructive/10 hover:border-destructive/30 text-destructive cursor-pointer"
              >
                <Trash2 className="h-4 w-4" />
                Deletar
              </Button>
            )}
            
            <Button 
              size="sm"
              onClick={() => setShowCreateFunnel(true)}
              className="flex items-center gap-2 bg-primary-100 dark:bg-primary-900/30 border border-primary-200 dark:border-primary-800/50 text-primary-700 dark:text-primary-300 hover:bg-primary-200 dark:hover:bg-primary-800/40 hover:border-primary-300 dark:hover:border-primary-700/50 font-semibold cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              Criar Funil
            </Button>
          </div>
        </div>
      </header>

      {/* Conteúdo principal */}
      <div className="mx-4 pt-16 overflow-x-auto">
        {/* Loading dos estágios e cards */}
        {(isLoadingEstagios || isLoadingCards) && (
          <div className="min-w-max">
            <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6">
              <ColumnSkeleton />
              <ColumnSkeleton />
              <ColumnSkeleton />
            </div>
          </div>
        )}

        {/* Error dos estágios */}
        {estagiosError && (
          <ErrorState
            title="Erro ao carregar estágios"
            message="Não foi possível carregar os estágios deste funil."
            onRetry={() => window.location.reload()}
            retryLabel="Recarregar página"
            className="mb-4"
          />
        )}

        {/* Error dos cards */}
        {cardsError && (
          <ErrorState
            title="Erro ao carregar cards"
            message="Não foi possível carregar os cards deste funil."
            onRetry={() => window.location.reload()}
            retryLabel="Recarregar página"
            className="mb-4"
          />
        )}

        {/* Kanban Board */}
        {!isLoadingEstagios && !estagiosError && !isLoadingCards && !cardsError && columns.length > 0 && (
        <div className="min-w-max">
          <KanbanProvider
            columns={columns}
            data={localCards}
            onDataChange={(newCards) => {
              // Atualizar estado local imediatamente (movimento otimista)
              setLocalCards(newCards);
              
              // Encontrar o card que foi movido
              const movedCard = newCards.find((newCard, index) => 
                newCard.column !== cards[index]?.column
              );
              
              if (movedCard) {
                // Chamar API em background
                handleCardMove(movedCard.id, movedCard.column);
              }
            }}
            className="grid-cols-[repeat(auto-fit,minmax(300px,1fr))]"
          >
          {(column) => (
            <KanbanBoard id={column.id} key={column.id}>
              <KanbanHeader>
                <div className="flex items-center gap-3">
                  <div
                    className="h-3 w-3 rounded-full shadow-sm"
                    style={{ backgroundColor: column.color }}
                  />
                  <span className="font-semibold text-foreground">{column.name}</span>
                  <span className="ml-auto text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                    {localCards.filter(card => card.column === column.id).length}
                  </span>
                </div>
              </KanbanHeader>
              <KanbanCards id={column.id}>
                {(card: (typeof cards)[number]) => (
                  <KanbanCard
                    column={column.id}
                    id={card.id}
                    key={card.id}
                    name={card.name}
                  >
                    <div className={`flex flex-col h-full relative ${isMovingCard === card.id ? 'opacity-75' : ''}`}>
                      {/* Indicador de sincronização */}
                      {isMovingCard === card.id && (
                        <div className="absolute top-2 right-2">
                          <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse" title="Sincronizando..."></div>
                        </div>
                      )}
                      {/* Header com Avatar, Nome e Tempo */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <Avatar className="h-10 w-10 border border-border/50">
                            <AvatarImage src={card.contato.photoUrl} />
                            <AvatarFallback className="bg-primary-100 dark:bg-primary-900/30 text-foreground text-sm">
                              {card.contato.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="m-0 font-semibold text-sm text-foreground leading-tight truncate">
                              {card.contato.name}
                            </p>
                            <p className="m-0 text-xs text-muted-foreground truncate">
                              ...{card.contato.phone.slice(-4)}
                            </p>
                          </div>
                        </div>
                        {/* Indicador de tempo */}
                        <div className="flex items-center gap-1 ml-2">
                          <div 
                            className="h-2 w-2 rounded-full flex-shrink-0"
                            style={{ backgroundColor: column.color }}
                          ></div>
                          <span className="text-xs text-muted-foreground">
                            {formatFirestoreDate(card.lastContactAt, 'short')}
                          </span>
                        </div>
                      </div>
                      
                      {/* Última mensagem do contato */}
                      <div className="mb-4">
                        <p className="m-0 text-sm text-foreground/70 leading-tight">
                          {card.contato.lastMessage || "Mensagem"}
                        </p>
                      </div>
                      
                      {/* Footer com Prioridade, Valor e Telefone */}
                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            card.priority === 'alta' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                            card.priority === 'média' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                            'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                          }`}>
                            {card.priority}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            R$ {card.estimatedValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                        
                        {/* Telefone clicável no rodapé */}
                        <button
                          onClick={() => handleCopyPhone(card.contato.phone)}
                          className="flex items-center gap-1 px-2 py-1 rounded-full bg-muted/50 hover:bg-muted transition-colors text-xs text-muted-foreground hover:text-foreground"
                          title="Clique para copiar telefone"
                        >
                          <Phone className="h-3 w-3" />
                          <span className="font-mono">{card.contato.phone.slice(-4)}</span>
                        </button>
                      </div>
                    </div>
                  </KanbanCard>
                )}
              </KanbanCards>
            </KanbanBoard>
          )}
          </KanbanProvider>
        </div>
        )}

        {/* Empty state para estágios */}
        {!isLoadingEstagios && !estagiosError && columns.length === 0 && selectedFunilId && (
          <EmptyState
            title="Nenhum estágio encontrado"
            message="Este funil não possui estágios configurados. Adicione estágios para começar a usar o Kanban."
            actionLabel="Configurar Estágios"
            onAction={() => setShowCreateFunnel(true)}
          />
        )}
      </div>

      {/* Modal para criar funil */}
      <CreateFunnelModal
        isOpen={showCreateFunnel}
        onClose={() => setShowCreateFunnel(false)}
      />

      {/* Modal para deletar funil */}
      <DeleteFunnelModal
        isOpen={showDeleteFunnel}
        onClose={handleDeleteClose}
        funil={funilToDelete}
      />
    </div>
  );
};

export default FunnelsPage;