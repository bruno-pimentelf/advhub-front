'use client';
import {
  KanbanBoard,
  KanbanCard,
  KanbanCards,
  KanbanHeader,
  KanbanProvider,
} from '@/components/ui/shadcn-io/kanban';
import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Plus, Search, Settings, Loader2, AlertCircle, Trash2, MoreVertical } from 'lucide-react';
import Link from 'next/link';
import { useSidebar } from '@/contexts/sidebar-context';
import { useFunis, useEstagios } from '@/hooks/use-funis';
import { useCards } from '@/hooks/use-cards';
import { CreateFunnelModal } from '@/components/funnels/create-funnel-modal';
import { DeleteFunnelModal } from '@/components/funnels/delete-funnel-modal';
import { LoadingState, ErrorState, EmptyState } from '@/components/ui/loading-state';
import { formatFirestoreDate } from '@/lib/utils/date-utils';
import type { Card } from '@/lib/api';

const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});

const shortDateFormatter = new Intl.DateTimeFormat('pt-BR', {
  month: 'short',
  day: 'numeric',
});

// Função para converter Card da API para formato do Kanban
const convertCardToKanban = (card: Card) => ({
  id: card.id,
  name: card.title,
  column: card.estagioId,
  priority: card.priority,
  estimatedValue: card.estimatedValue,
  serviceOfInterest: card.serviceOfInterest,
  channel: card.channel,
  lastContactAt: card.lastContactAt,
  createdAt: card.createdAt
});

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

  // Converter cards da API para formato do Kanban
  const cards = apiCards.map(convertCardToKanban);

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

  // Função para lidar com movimento de cards no Kanban
  const handleCardMove = async (cardId: string, newEstagioId: string) => {
    try {
      await handleMoveCard(cardId, { newEstagioId });
    } catch (error) {
      console.error('Erro ao mover card:', error);
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
      <div className="mx-4 mb-4 mt-2">
        <LoadingState message="Carregando funis..." size="lg" />
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
        {/* Loading dos estágios */}
        {isLoadingEstagios && (
          <LoadingState message="Carregando estágios..." size="md" />
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

        {/* Loading dos cards */}
        {isLoadingCards && (
          <LoadingState message="Carregando cards..." size="md" />
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
            data={cards}
            onDataChange={(newCards) => {
              // Encontrar o card que foi movido
              const movedCard = newCards.find((newCard, index) => 
                newCard.column !== cards[index]?.column
              );
              
              if (movedCard) {
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
                    {cards.filter(card => card.column === column.id).length}
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
                    <div className="flex flex-col h-full">
                      {/* Título */}
                      <div className="mb-3">
                        <p className="m-0 font-semibold text-sm text-foreground leading-tight">
                          {card.name}
                        </p>
                      </div>
                      
                      {/* Data */}
                      <div className="flex items-center gap-2 mb-2">
                        <div 
                          className="h-1.5 w-1.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: column.color }}
                        ></div>
                        <p className="m-0 text-muted-foreground text-xs">
                          {formatFirestoreDate(card.lastContactAt)}
                        </p>
                      </div>
                      
                      {/* Serviço de interesse (se existir) */}
                      {card.serviceOfInterest && (
                        <div className="mb-2">
                          <p className="m-0 text-muted-foreground text-xs">
                            {card.serviceOfInterest}
                          </p>
                        </div>
                      )}
                      
                      {/* Prioridade e Valor - sempre no final */}
                      <div className="flex items-center gap-2 mt-auto">
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