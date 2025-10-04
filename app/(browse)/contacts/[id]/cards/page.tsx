'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useSidebar } from '@/contexts/sidebar-context'
import { 
  Plus, 
  ArrowLeft, 
  Phone, 
  Mail, 
  Calendar,
  DollarSign,
  Tag,
  MessageSquare,
  Edit,
  Trash2
} from 'lucide-react'
import { useContato } from '@/hooks/use-contatos'
import { useFunisByContato } from '@/hooks/use-contatos-funil'
import { useFunis } from '@/hooks/use-funis'
import { LoadingState, ErrorState, EmptyState } from '@/components/ui/loading-state'
import { Skeleton } from '@/components/ui/skeleton'
import { formatFirestoreDate } from '@/lib/utils/date-utils'
import type { ContatoFunilWithContato } from '@/lib/api'

const getEstagioColor = (estagioName: string) => {
  // Cores baseadas no nome do estágio
  const colors = {
    'Primeiro Contato': 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800/50',
    'Interessado': 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800/50',
    'Proposta': 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800/50',
    'Negociação': 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800/50',
    'Fechado': 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800/50',
    'Perdido': 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800/50',
  }
  
  return colors[estagioName as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/30 dark:text-gray-400 dark:border-gray-800/50'
}

// Componente de skeleton para um funil individual
const FunilSkeleton = () => (
  <div className="border-b border-border/30 p-4">
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
        
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="flex items-center gap-1">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <Skeleton className="h-8 w-8 rounded" />
        <Skeleton className="h-8 w-8 rounded" />
      </div>
    </div>
  </div>
)

// Componente de skeleton para a lista de funis
const FunisListSkeleton = () => (
  <Card className="border-primary/30 bg-background/95 backdrop-blur-md py-0">
    <CardContent className="p-0">
      <div className="space-y-0">
        <FunilSkeleton />
        <FunilSkeleton />
        <FunilSkeleton />
        <FunilSkeleton />
        <FunilSkeleton />
      </div>
      <div className="px-4 py-3 border-t border-border/50 bg-muted/30">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
    </CardContent>
  </Card>
)

export default function ContactFunisPage() {
  const params = useParams()
  const router = useRouter()
  const contactId = params.id as string
  const { isHidden } = useSidebar()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true)

  const [showAddToFunil, setShowAddToFunil] = useState(false)
  const [showEditFunil, setShowEditFunil] = useState(false)
  const [showRemoveFromFunil, setShowRemoveFromFunil] = useState(false)
  const [selectedContatoFunil, setSelectedContatoFunil] = useState<any | null>(null)

  const { contato, isLoadingContato, contatoError } = useContato(contactId)
  const { funis } = useFunis()
  const { 
    funisContato, 
    isLoadingFunisContato, 
    funisContatoError, 
    handleAddContatoToFunil,
    handleMoveContatoInFunil,
    handleRemoveContatoFromFunil,
    refetchFunisContato 
  } = useFunisByContato(contactId)

  // Pré-carregar dados do contato assim que o componente é montado
  useEffect(() => {
    if (contactId) {
      // Força o carregamento imediato dos dados
      router.prefetch(`/contacts/${contactId}/cards`)
    }
  }, [contactId, router])

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

  const handleAddToFunil = () => {
    setShowAddToFunil(true)
  }

  const handleEditFunil = (contatoFunil: any) => {
    setSelectedContatoFunil(contatoFunil)
    setShowEditFunil(true)
  }

  const handleRemoveFromFunil = (contatoFunil: any) => {
    setSelectedContatoFunil(contatoFunil)
    setShowRemoveFromFunil(true)
  }

  const handleCloseModals = () => {
    setShowAddToFunil(false)
    setShowEditFunil(false)
    setShowRemoveFromFunil(false)
    setSelectedContatoFunil(null)
  }

  // Loading state
  if (isLoadingContato) {
    return (
      <div className="mb-4 mt-2 overflow-x-hidden">
        {/* Header skeleton */}
        <header className={`fixed top-0 right-0 z-50 mb-3 pb-3 pt-2 border-b border-border bg-background/95 backdrop-blur-md transition-all duration-300 ease-in-out ${isHidden ? 'left-0' : sidebarCollapsed ? 'left-16' : 'left-56'}`}>
          <div className="flex items-center justify-between px-4">
            <div className="flex items-center gap-4">
              <Skeleton className="h-8 w-16" />
              <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div>
                  <Skeleton className="h-5 w-32 mb-1" />
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-20" />
            </div>
          </div>
        </header>

        {/* Conteúdo principal skeleton */}
        <div className="mx-4 pt-16 space-y-2">
          <FunisListSkeleton />
        </div>
      </div>
    )
  }

  // Error state
  if (contatoError || funisContatoError) {
    return (
      <div className="mx-4 mb-4 mt-2">
        <ErrorState
          title="Erro ao carregar dados"
          message="Não foi possível carregar as informações do contato ou seus funis."
          onRetry={() => window.location.reload()}
          retryLabel="Recarregar página"
        />
      </div>
    )
  }

  // Contato não encontrado
  if (!contato) {
    return (
      <div className="mx-4 mb-4 mt-2">
        <EmptyState
          title="Contato não encontrado"
          message="O contato solicitado não foi encontrado."
          actionLabel="Voltar para Contatos"
          onAction={() => router.push('/contacts')}
          icon={<ArrowLeft className="h-8 w-8 text-muted-foreground" />}
        />
      </div>
    )
  }

  return (
    <div className="mb-4 mt-2 overflow-x-hidden">
      {/* Header fixo com informações do contato e botões de ação */}
      <header className={`fixed top-0 right-0 z-50 mb-3 pb-3 pt-2 border-b border-border bg-background/95 backdrop-blur-md transition-all duration-300 ease-in-out ${isHidden ? 'left-0' : sidebarCollapsed ? 'left-16' : 'left-56'}`}>
        <div className="flex items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push('/contacts')}
              className="flex items-center gap-2 border-primary-200 dark:border-primary-800/50 hover:bg-primary-100 dark:hover:bg-primary-900/30 hover:border-primary-300 dark:hover:border-primary-700/50 cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
            
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8 border border-border/50">
                <AvatarImage src={contato.photoUrl} />
                <AvatarFallback className="bg-primary-100 dark:bg-primary-900/30 text-foreground text-xs">
                  {contato.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-lg font-semibold">{contato.name}</h1>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    {contato.phone}
                  </div>
                  {contato.email && (
                    <div className="flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {contato.email}
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatFirestoreDate(contato.lastContactAt)}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              onClick={handleAddToFunil}
              size="sm"
              className="flex items-center gap-2 bg-primary-100 dark:bg-primary-900/30 border border-primary-200 dark:border-primary-800/50 text-primary-700 dark:text-primary-300 hover:bg-primary-200 dark:hover:bg-primary-800/40 hover:border-primary-300 dark:hover:border-primary-700/50 font-semibold cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              Adicionar a Funil
            </Button>
          </div>
        </div>
      </header>

      {/* Conteúdo principal */}
      <div className="mx-4 pt-16 space-y-2">
        {/* Lista de Funis */}
        <Card className="border-primary/30 bg-background/95 backdrop-blur-md py-0">
          <CardContent className="p-0">
            {isLoadingFunisContato ? (
              <div className="space-y-0">
                <FunilSkeleton />
                <FunilSkeleton />
                <FunilSkeleton />
                <FunilSkeleton />
                <FunilSkeleton />
              </div>
            ) : funisContatoError ? (
              <ErrorState
                title="Erro ao carregar funis"
                message="Não foi possível carregar os funis do contato."
                onRetry={refetchFunisContato}
                retryLabel="Tentar novamente"
              />
            ) : funisContato.length === 0 ? (
              <EmptyState
                title="Nenhum funil encontrado"
                message="Este contato ainda não foi adicionado a nenhum funil."
                actionLabel="Adicionar a Funil"
                onAction={handleAddToFunil}
                icon={<Plus className="h-8 w-8 text-muted-foreground" />}
              />
            ) : (
              <div className="space-y-0">
                {funisContato.map((contatoFunil) => (
                  <div key={`${contatoFunil.contatoId}-${contatoFunil.funilId}`} className="border-b border-border/30 p-4 hover:bg-muted/30 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-medium text-foreground">{contatoFunil.funilName}</h3>
                          <Badge className={`${getEstagioColor(contatoFunil.estagioName)} border`}>
                            {contatoFunil.estagioName}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            Adicionado: {formatFirestoreDate(contatoFunil.addedAt)}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            Último movimento: {formatFirestoreDate(contatoFunil.lastMovedAt)}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditFunil(contatoFunil)}
                          className="hover:bg-primary-100 dark:hover:bg-primary-900/30 cursor-pointer"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveFromFunil(contatoFunil)}
                          className="hover:bg-destructive/10 text-destructive cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="px-4 py-3 border-t border-border/50 bg-muted/30">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {funisContato.length} funis carregados
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modais */}
      {showAddToFunil && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Adicionar a Funil</h3>
            <div className="space-y-4">
              <Select onValueChange={async (funilId) => {
                try {
                  await handleAddContatoToFunil({ funilId })
                  handleCloseModals()
                } catch (error) {
                  // Error já é tratado no hook
                }
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um funil" />
                </SelectTrigger>
                <SelectContent>
                  {funis.map((funil) => (
                    <SelectItem key={funil.id} value={funil.id}>
                      {funil.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={handleCloseModals}>
                  Cancelar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showEditFunil && selectedContatoFunil && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Mover no Funil</h3>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Funil: {selectedContatoFunil.funilName}
              </p>
              <p className="text-sm text-muted-foreground">
                Estágio atual: {selectedContatoFunil.estagioName}
              </p>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={handleCloseModals}>
                  Cancelar
                </Button>
                <Button 
                  onClick={async () => {
                    try {
                      // Aqui você pode implementar a lógica para mover para outro estágio
                      // Por enquanto, apenas fecha o modal
                      handleCloseModals()
                    } catch (error) {
                      // Error já é tratado no hook
                    }
                  }}
                >
                  Mover
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showRemoveFromFunil && selectedContatoFunil && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Remover do Funil</h3>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Tem certeza que deseja remover este contato do funil <strong>{selectedContatoFunil.funilName}</strong>?
              </p>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={handleCloseModals}>
                  Cancelar
                </Button>
                <Button 
                  variant="destructive"
                  onClick={async () => {
                    try {
                      await handleRemoveContatoFromFunil(selectedContatoFunil.funilId)
                      handleCloseModals()
                    } catch (error) {
                      // Error já é tratado no hook
                    }
                  }}
                >
                  Remover
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
