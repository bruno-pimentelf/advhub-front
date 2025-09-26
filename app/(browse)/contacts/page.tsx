'use client';
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
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
  ChevronsRight
} from 'lucide-react';
import { faker } from '@faker-js/faker';
// Sem necessidade de useHeader

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  source: 'whatsapp' | 'manual' | 'import';
  status: 'active' | 'inactive' | 'lead';
  lastContact: Date;
  avatar?: string;
  tags: string[];
}

const generateContacts = (): Contact[] => {
  return Array.from({ length: 25 }).map(() => ({
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    source: faker.helpers.arrayElement(['whatsapp', 'manual', 'import'] as const),
    status: faker.helpers.arrayElement(['active', 'inactive', 'lead'] as const),
    lastContact: faker.date.recent({ days: 30 }),
    avatar: faker.image.avatar(),
    tags: faker.helpers.arrayElements(['Cliente', 'Lead', 'VIP', 'Novo'], { min: 1, max: 2 })
  }));
};

const getStatusColor = (status: Contact['status']) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800/50';
    case 'inactive':
      return 'bg-muted text-muted-foreground border-border';
    case 'lead':
      return 'bg-primary-100 text-primary-600 border-primary-200 dark:bg-primary-900/30 dark:text-primary-400 dark:border-primary-800/50';
    default:
      return 'bg-muted text-muted-foreground border-border';
  }
};


export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  useEffect(() => {
    setIsClient(true);
    setContacts(generateContacts());
  }, []);

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.phone.includes(searchTerm);
    const matchesFilter = filterStatus === 'all' || contact.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredContacts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedContacts = filteredContacts.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus]);

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

  if (!isClient) {
    return (
      <div className="mx-4 mb-4 mt-4">
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Carregando contatos...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-4 mb-4 mt-4 space-y-4">
      {/* Filters */}
      <Card className="border-primary/30 bg-background/95 backdrop-blur-md">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar contatos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-primary/30 focus:border-primary focus:ring-[#04CDD4]"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFilterStatus('all')}
                className={filterStatus === 'all' 
                  ? 'bg-primary-100 dark:bg-primary-900/30 border border-primary-200 dark:border-primary-800/50 text-primary-700 dark:text-primary-300 hover:bg-primary-200 dark:hover:bg-primary-800/40 hover:border-primary-300 dark:hover:border-primary-700/50 font-semibold' 
                  : 'border-primary-200 dark:border-primary-800/50 hover:bg-primary-100 dark:hover:bg-primary-900/30 hover:border-primary-300 dark:hover:border-primary-700/50'
                }
              >
                Todos
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFilterStatus('lead')}
                className={filterStatus === 'lead' 
                  ? 'bg-primary-100 dark:bg-primary-900/30 border border-primary-200 dark:border-primary-800/50 text-primary-700 dark:text-primary-300 hover:bg-primary-200 dark:hover:bg-primary-800/40 hover:border-primary-300 dark:hover:border-primary-700/50 font-semibold' 
                  : 'border-primary-200 dark:border-primary-800/50 hover:bg-primary-100 dark:hover:bg-primary-900/30 hover:border-primary-300 dark:hover:border-primary-700/50'
                }
              >
                Leads
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFilterStatus('active')}
                className={filterStatus === 'active' 
                  ? 'bg-primary-100 dark:bg-primary-900/30 border border-primary-200 dark:border-primary-800/50 text-primary-700 dark:text-primary-300 hover:bg-primary-200 dark:hover:bg-primary-800/40 hover:border-primary-300 dark:hover:border-primary-700/50 font-semibold' 
                  : 'border-primary-200 dark:border-primary-800/50 hover:bg-primary-100 dark:hover:bg-primary-900/30 hover:border-primary-300 dark:hover:border-primary-700/50'
                }
              >
                Ativos
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contacts Table */}
      <Card className="border-primary/30 bg-background/95 backdrop-blur-md">
        <CardHeader className="border-b border-border/50">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <CardTitle className="m-0">Lista de Contatos</CardTitle>
              <Badge variant="outline" className="border-primary/30 text-primary">
                {filteredContacts.length} contatos
              </Badge>
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                className="border-primary-200 dark:border-primary-800/50 hover:bg-primary-100 dark:hover:bg-primary-900/30 hover:border-primary-300 dark:hover:border-primary-700/50"
              >
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="border-primary-200 dark:border-primary-800/50 hover:bg-primary-100 dark:hover:bg-primary-900/30 hover:border-primary-300 dark:hover:border-primary-700/50"
              >
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Importar
              </Button>
              <Button 
                size="sm"
                className="bg-primary-100 dark:bg-primary-900/30 border border-primary-200 dark:border-primary-800/50 text-primary-700 dark:text-primary-300 hover:bg-primary-200 dark:hover:bg-primary-800/40 hover:border-primary-300 dark:hover:border-primary-700/50 font-semibold"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Importar do WhatsApp
              </Button>
              <Button 
                size="sm"
                className="bg-primary-100 dark:bg-primary-900/30 border border-primary-200 dark:border-primary-800/50 text-primary-700 dark:text-primary-300 hover:bg-primary-200 dark:hover:bg-primary-800/40 hover:border-primary-300 dark:hover:border-primary-700/50 font-semibold"
              >
                <Plus className="h-4 w-4 mr-2" />
                Novo
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left p-4 font-semibold text-sm text-muted-foreground">Contato</th>
                  <th className="text-left p-4 font-semibold text-sm text-muted-foreground">Telefone</th>
                  <th className="text-left p-4 font-semibold text-sm text-muted-foreground">Email</th>
                  <th className="text-left p-4 font-semibold text-sm text-muted-foreground">Status</th>
                  <th className="text-left p-4 font-semibold text-sm text-muted-foreground">Último Contato</th>
                  <th className="text-left p-4 font-semibold text-sm text-muted-foreground">Ações</th>
                </tr>
              </thead>
              <tbody>
                {paginatedContacts.map((contact) => (
                  <tr key={contact.id} className="border-b border-border/30 hover:bg-muted/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border border-border/50">
                          <AvatarImage src={contact.avatar} />
                          <AvatarFallback className="bg-primary-100 dark:bg-primary-900/30 text-foreground">
                            {contact.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-foreground">{contact.name}</div>
                          <div className="flex gap-1 mt-1">
                            {contact.tags.map((tag, index) => (
                              <Badge 
                                key={index} 
                                variant="outline" 
                                className="text-xs border-primary/30 text-primary"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{contact.phone}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{contact.email}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge className={`${getStatusColor(contact.status)} border`}>
                        {contact.status === 'active' ? 'Ativo' : 
                         contact.status === 'inactive' ? 'Inativo' : 'Lead'}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-muted-foreground">
                        {contact.lastContact.toLocaleDateString('pt-BR')}
                      </span>
                    </td>
                    <td className="p-4">
                      <Button variant="ghost" size="sm" className="hover:bg-primary-100 dark:hover:bg-primary-900/30">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
                Mostrando {startIndex + 1} a {Math.min(endIndex, filteredContacts.length)} de {filteredContacts.length} contatos
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
    </div>
  );
}