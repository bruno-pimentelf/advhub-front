'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useSidebar } from '@/contexts/sidebar-context';
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Upload, 
  MessageSquare, 
  Phone, 
  Mail,
  MoreHorizontal,
  FileSpreadsheet,
  Smartphone,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Edit,
  Trash2
} from 'lucide-react';
import { useContatos } from '@/hooks/use-contatos';
import { ContactModal } from '@/components/contacts/contact-modal';
import { DeleteContactModal } from '@/components/contacts/delete-contact-modal';
import { LoadingState, ErrorState, EmptyState } from '@/components/ui/loading-state';
import { Skeleton } from '@/components/ui/skeleton';
import { formatFirestoreDate } from '@/lib/utils/date-utils';
import type { Contato } from '@/lib/api';

const getStatusColor = (status: Contato['status']) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800/50';
    case 'archived':
      return 'bg-muted text-muted-foreground border-border';
    default:
      return 'bg-muted text-muted-foreground border-border';
  }
};

// Componente de skeleton para a linha da tabela de contatos
const ContactRowSkeleton = () => (
  <tr className="border-b border-border/30">
    <td className="p-3">
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div>
          <Skeleton className="h-4 w-24 mb-1" />
        </div>
      </div>
    </td>
    <td className="p-3">
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-20" />
      </div>
    </td>
    <td className="p-3">
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-32" />
      </div>
    </td>
    <td className="p-3">
      <Skeleton className="h-6 w-16 rounded-full" />
    </td>
    <td className="p-3">
      <Skeleton className="h-4 w-20" />
    </td>
    <td className="p-3">
      <div className="flex items-center gap-1">
        <Skeleton className="h-8 w-8 rounded" />
        <Skeleton className="h-8 w-8 rounded" />
      </div>
    </td>
  </tr>
);

// Componente de skeleton para a tabela completa
const ContactsTableSkeleton = () => (
  <Card className="border-primary/30 bg-background/95 backdrop-blur-md py-0">
    <CardContent className="p-0">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border/50">
              <th className="text-left p-3 font-semibold text-sm text-muted-foreground">Contato</th>
              <th className="text-left p-3 font-semibold text-sm text-muted-foreground">Telefone</th>
              <th className="text-left p-3 font-semibold text-sm text-muted-foreground">Email</th>
              <th className="text-left p-3 font-semibold text-sm text-muted-foreground">Status</th>
              <th className="text-left p-3 font-semibold text-sm text-muted-foreground">Último Contato</th>
              <th className="text-left p-3 font-semibold text-sm text-muted-foreground">Ações</th>
            </tr>
          </thead>
          <tbody>
            <ContactRowSkeleton />
            <ContactRowSkeleton />
            <ContactRowSkeleton />
            <ContactRowSkeleton />
            <ContactRowSkeleton />
            <ContactRowSkeleton />
            <ContactRowSkeleton />
            <ContactRowSkeleton />
            <ContactRowSkeleton />
            <ContactRowSkeleton />
          </tbody>
        </table>
      </div>
      <div className="px-4 py-3 border-t border-border/50 bg-muted/30">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
    </CardContent>
  </Card>
);


export default function ContactsPage() {
  const router = useRouter();
  const { isHidden } = useSidebar();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contato | null>(null);

  const {
    contatos,
    total,
    isLoadingContatos,
    contatosError,
    searchTerm,
    setSearchTerm,
    filterStatus,
    setFilterStatus,
    refetchContatos
  } = useContatos(currentPage, itemsPerPage);

  // Pagination logic
  const totalPages = Math.ceil(total / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus]);

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

  // Handlers
  const handleEditContact = (contact: Contato) => {
    setSelectedContact(contact);
    setShowEditModal(true);
  };

  const handleDeleteContact = (contact: Contato) => {
    setSelectedContact(contact);
    setShowDeleteModal(true);
  };

  const handleCloseModals = () => {
    setShowCreateModal(false);
    setShowEditModal(false);
    setShowDeleteModal(false);
    setSelectedContact(null);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const startPage = Math.max(1, currentPage - 2);
      const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      
      if (startPage > 1) {
        pages.push(1);
        if (startPage > 2) {
          pages.push('...');
        }
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          pages.push('...');
        }
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  // Loading state
  if (isLoadingContatos) {
    return (
      <div className="mb-4 mt-2 overflow-x-hidden">
        {/* Header skeleton */}
        <header className={`fixed top-0 right-0 z-50 mb-3 pb-3 pt-2 border-b border-border bg-background/95 backdrop-blur-md transition-all duration-300 ease-in-out ${isHidden ? 'left-0' : sidebarCollapsed ? 'left-16' : 'left-56'}`}>
          <div className="flex items-center justify-between px-4">
            <div className="flex items-center gap-3 flex-1">
              <div className="relative flex-1 max-w-md">
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-8 w-16" />
            </div>
          </div>
        </header>

        {/* Conteúdo principal skeleton */}
        <div className="mx-4 pt-16 space-y-2">
          <ContactsTableSkeleton />
        </div>
      </div>
    );
  }

  // Error state
  if (contatosError) {
    return (
      <div className="mx-4 mb-4 mt-4">
        <ErrorState
          title="Erro ao carregar contatos"
          message="Não foi possível carregar os contatos. Verifique sua conexão e tente novamente."
          onRetry={refetchContatos}
          retryLabel="Recarregar contatos"
        />
      </div>
    );
  }

  // Empty state
  if (contatos.length === 0) {
    return (
      <div className="mx-4 mb-4 mt-4">
        <EmptyState
          title="Nenhum contato encontrado"
          message="Crie seu primeiro contato para começar a gerenciar seus clientes."
          actionLabel="Criar Primeiro Contato"
          onAction={() => setShowCreateModal(true)}
          icon={<Plus className="h-8 w-8 text-muted-foreground" />}
        />
        
        {/* Modal para criar contato - renderizado mesmo no empty state */}
        <ContactModal
          isOpen={showCreateModal}
          onClose={handleCloseModals}
          mode="create"
        />
      </div>
    );
  }

  return (
    <div className="mb-4 mt-2 overflow-x-hidden">
      {/* Header com busca e botões de ação */}
      <header className={`fixed top-0 right-0 z-50 mb-3 pb-3 pt-2 border-b border-border bg-background/95 backdrop-blur-md transition-all duration-300 ease-in-out ${isHidden ? 'left-0' : sidebarCollapsed ? 'left-16' : 'left-56'}`}>
        <div className="flex items-center justify-between px-4">
          <div className="flex items-center gap-3 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar contatos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-0 bg-transparent focus:ring-0 focus:outline-none focus:border-0 focus:shadow-none cursor-text shadow-none"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              className="border-primary-200 dark:border-primary-800/50 hover:bg-primary-100 dark:hover:bg-primary-900/30 hover:border-primary-300 dark:hover:border-primary-700/50 cursor-pointer"
            >
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="border-primary-200 dark:border-primary-800/50 hover:bg-primary-100 dark:hover:bg-primary-900/30 hover:border-primary-300 dark:hover:border-primary-700/50 cursor-pointer"
            >
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              Importar
            </Button>
            <Button 
              size="sm"
              className="bg-primary-100 dark:bg-primary-900/30 border border-primary-200 dark:border-primary-800/50 text-primary-700 dark:text-primary-300 hover:bg-primary-200 dark:hover:bg-primary-800/40 hover:border-primary-300 dark:hover:border-primary-700/50 font-semibold cursor-pointer"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Importar do WhatsApp
            </Button>
            <Button 
              size="sm"
              onClick={() => setShowCreateModal(true)}
              className="bg-primary-100 dark:bg-primary-900/30 border border-primary-200 dark:border-primary-800/50 text-primary-700 dark:text-primary-300 hover:bg-primary-200 dark:hover:bg-primary-800/40 hover:border-primary-300 dark:hover:border-primary-700/50 font-semibold cursor-pointer"
            >
              <Plus className="h-4 w-4 mr-2" />
              Novo
            </Button>
          </div>
        </div>
      </header>

      {/* Conteúdo principal */}
      <div className="mx-4 pt-16 space-y-2">

      {/* Contacts Table */}
      <Card className="border-primary/30 bg-background/95 backdrop-blur-md py-0">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left p-3 font-semibold text-sm text-muted-foreground">Contato</th>
                  <th className="text-left p-3 font-semibold text-sm text-muted-foreground">Telefone</th>
                  <th className="text-left p-3 font-semibold text-sm text-muted-foreground">Email</th>
                  <th className="text-left p-3 font-semibold text-sm text-muted-foreground">Status</th>
                  <th className="text-left p-3 font-semibold text-sm text-muted-foreground">Último Contato</th>
                  <th className="text-left p-3 font-semibold text-sm text-muted-foreground">Ações</th>
                </tr>
              </thead>
                      <tbody>
                        {contatos.map((contact) => (
                          <tr 
                            key={contact.id} 
                            className="border-b border-border/30 hover:bg-muted/30 transition-colors cursor-pointer"
                            onClick={() => router.push(`/contacts/${contact.id}/cards`)}
                          >
                            <td className="p-3">
                              <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10 border border-border/50">
                                  <AvatarImage src={contact.photoUrl} />
                                  <AvatarFallback className="bg-primary-100 dark:bg-primary-900/30 text-foreground">
                                    {contact.name.split(' ').map(n => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium text-foreground">{contact.name}</div>
                                </div>
                              </div>
                            </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{contact.phone}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{contact.email || 'Não informado'}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <Badge className={`${getStatusColor(contact.status)} border`}>
                        {contact.status === 'active' ? 'Ativo' : 'Arquivado'}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <span className="text-sm text-muted-foreground">
                        {formatFirestoreDate(contact.lastContactAt)}
                      </span>
                    </td>
                            <td className="p-3">
                              <div className="flex items-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditContact(contact);
                                  }}
                                  className="hover:bg-primary-100 dark:hover:bg-primary-900/30"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteContact(contact);
                                  }}
                                  className="hover:bg-destructive/10 text-destructive"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t border-border/50 bg-muted/30">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {total} contatos carregados
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <Card className="border-primary/30 bg-background/95 backdrop-blur-md">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              {/* Items per page selector */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Mostrar:</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                  className="px-3 py-1 text-sm border border-primary-200 dark:border-primary-800/50 rounded-md bg-background hover:bg-primary-100 dark:hover:bg-primary-900/30 focus:border-primary-300 dark:focus:border-primary-700/50 focus:ring-[#04CDD4] focus:outline-none"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
                <span className="text-sm text-muted-foreground">por página</span>
              </div>

              {/* Page info */}
              <div className="text-sm text-muted-foreground">
                Mostrando {startIndex + 1} a {Math.min(endIndex, total)} de {total} contatos
              </div>

              {/* Pagination controls */}
              <div className="flex items-center gap-2">
                {/* First page */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                  className="border-primary/30 hover:bg-primary-100 dark:hover:bg-primary-900/30 hover:border-primary disabled:opacity-50"
                >
                  <ChevronsLeft className="h-4 w-4" />
                </Button>

                {/* Previous page */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="border-primary/30 hover:bg-primary-100 dark:hover:bg-primary-900/30 hover:border-primary disabled:opacity-50"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                {/* Page numbers */}
                <div className="flex items-center gap-1">
                  {getPageNumbers().map((page, index) => (
                    <div key={index}>
                      {page === '...' ? (
                        <span className="px-3 py-1 text-sm text-muted-foreground">...</span>
                      ) : (
                        <Button
                          variant={currentPage === page ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handlePageChange(page as number)}
                          className={
                            currentPage === page
                              ? 'bg-primary hover:bg-primary/90 text-white'
                              : 'border-primary/30 hover:bg-primary-100 dark:hover:bg-primary-900/30 hover:border-primary'
                          }
                        >
                          {page}
                        </Button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Next page */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="border-primary/30 hover:bg-primary-100 dark:hover:bg-primary-900/30 hover:border-primary disabled:opacity-50"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>

                {/* Last page */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages}
                  className="border-primary/30 hover:bg-primary-100 dark:hover:bg-primary-900/30 hover:border-primary disabled:opacity-50"
                >
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

        {/* Modais */}
        <ContactModal
          isOpen={showCreateModal}
          onClose={handleCloseModals}
          mode="create"
        />

        <ContactModal
          isOpen={showEditModal}
          onClose={handleCloseModals}
          contato={selectedContact}
          mode="edit"
        />

        <DeleteContactModal
          isOpen={showDeleteModal}
          onClose={handleCloseModals}
          contato={selectedContact}
        />
      </div>
    </div>
  );
}