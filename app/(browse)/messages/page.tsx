'use client';
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSidebar } from '@/contexts/sidebar-context';
import { 
  Plus, 
  Search, 
  Send, 
  Clock, 
  FileText,
  Calendar,
  Edit,
  Trash2,
  Copy,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight
} from 'lucide-react';
import { faker } from '@faker-js/faker';

interface ScheduledMessage {
  id: string;
  contact: {
    name: string;
    phone: string;
    avatar?: string;
  };
  message: string;
  scheduledAt: Date;
  status: 'scheduled' | 'sent' | 'failed';
  template?: string;
}

interface MessageTemplate {
  id: string;
  name: string;
  content: string;
  category: 'welcome' | 'followup' | 'reminder' | 'promotion';
  createdAt: Date;
  usageCount: number;
}

const generateScheduledMessages = (): ScheduledMessage[] => {
  return Array.from({ length: 15 }).map(() => ({
    id: faker.string.uuid(),
    contact: {
      name: faker.person.fullName(),
      phone: faker.phone.number(),
      avatar: faker.image.avatar(),
    },
    message: faker.lorem.sentence(),
    scheduledAt: faker.date.future(),
    status: faker.helpers.arrayElement(['scheduled', 'sent', 'failed'] as const),
    template: faker.helpers.maybe(() => faker.helpers.arrayElement(['Boas-vindas', 'Follow-up', 'Lembrete'])),
  }));
};

const generateTemplates = (): MessageTemplate[] => {
  return [
    {
      id: faker.string.uuid(),
      name: 'Boas-vindas',
      content: 'Olá! Bem-vindo(a) à nossa clínica. Estamos felizes em tê-lo(a) conosco!',
      category: 'welcome',
      createdAt: faker.date.past(),
      usageCount: faker.number.int({ min: 5, max: 50 }),
    },
    {
      id: faker.string.uuid(),
      name: 'Lembrete de Consulta',
      content: 'Olá! Lembramos que você tem uma consulta agendada para amanhã às 14h. Confirma sua presença?',
      category: 'reminder',
      createdAt: faker.date.past(),
      usageCount: faker.number.int({ min: 10, max: 100 }),
    },
    {
      id: faker.string.uuid(),
      name: 'Follow-up Pós-Tratamento',
      content: 'Como você está se sentindo após o tratamento? Gostaríamos de saber sua experiência!',
      category: 'followup',
      createdAt: faker.date.past(),
      usageCount: faker.number.int({ min: 3, max: 30 }),
    },
  ];
};

const getStatusColor = (status: ScheduledMessage['status']) => {
  switch (status) {
    case 'scheduled':
      return 'bg-primary-100 text-primary-600 border-primary-200 dark:bg-primary-900/30 dark:text-primary-400 dark:border-primary-800/50';
    case 'sent':
      return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800/50';
    case 'failed':
      return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800/50';
    default:
      return 'bg-muted text-muted-foreground border-border';
  }
};

const getCategoryColor = (category: MessageTemplate['category']) => {
  switch (category) {
    case 'welcome':
      return 'bg-primary-100 text-primary-600 border-primary-200 dark:bg-primary-900/30 dark:text-primary-400 dark:border-primary-800/50';
    case 'followup':
      return 'bg-secondary text-secondary-foreground border-border';
    case 'reminder':
      return 'bg-accent text-accent-foreground border-border';
    case 'promotion':
      return 'bg-primary-200 text-primary-700 border-primary-300 dark:bg-primary-800/30 dark:text-primary-300 dark:border-primary-700/50';
    default:
      return 'bg-muted text-muted-foreground border-border';
  }
};

export default function MessagesPage() {
  const { isHidden } = useSidebar();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [scheduledMessages, setScheduledMessages] = useState<ScheduledMessage[]>([]);
  const [templates, setTemplates] = useState<MessageTemplate[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('scheduled');
  const [showNewTemplate, setShowNewTemplate] = useState(false);
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    content: '',
    category: 'welcome' as MessageTemplate['category'],
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    setIsClient(true);
    setScheduledMessages(generateScheduledMessages());
    setTemplates(generateTemplates());
  }, []);

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

  const filteredScheduledMessages = scheduledMessages.filter(message => {
    const matchesSearch = message.contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = statusFilter === 'all' || message.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredScheduledMessages.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedScheduledMessages = filteredScheduledMessages.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

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

  const handleCreateTemplate = () => {
    if (newTemplate.name && newTemplate.content) {
      const template: MessageTemplate = {
        id: faker.string.uuid(),
        name: newTemplate.name,
        content: newTemplate.content,
        category: newTemplate.category,
        createdAt: new Date(),
        usageCount: 0,
      };
      setTemplates([...templates, template]);
      setNewTemplate({ name: '', content: '', category: 'welcome' });
      setShowNewTemplate(false);
    }
  };

  if (!isClient) {
    return (
      <div className="mx-4 mb-4 mt-4">
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Carregando mensagens...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-4 mt-2 overflow-x-hidden">
      {/* Header com busca e navegação */}
      <header className={`fixed top-0 right-0 z-50 mb-3 pb-3 pt-2 border-b border-border bg-background/95 backdrop-blur-md transition-all duration-300 ease-in-out ${isHidden ? 'left-0' : sidebarCollapsed ? 'left-16' : 'left-56'}`}>
        <div className="flex items-center justify-between px-4">
          <div className="flex items-center gap-3 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar mensagens..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-0 bg-transparent focus:ring-0 focus:outline-none focus:border-0 focus:shadow-none cursor-text shadow-none"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
              <TabsList className="grid grid-cols-3 bg-transparent border border-primary/30 rounded-lg p-1 h-10">
                <TabsTrigger 
                  value="scheduled" 
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg transition-all duration-200 hover:bg-primary-100 dark:hover:bg-primary-900/30 hover:text-primary py-1 px-3 text-sm h-8 cursor-pointer"
                >
                  <Clock className="h-4 w-4 mr-1" />
                  Agendadas
                </TabsTrigger>
                <TabsTrigger 
                  value="templates"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg transition-all duration-200 hover:bg-primary-100 dark:hover:bg-primary-900/30 hover:text-primary py-1 px-3 text-sm h-8 cursor-pointer"
                >
                  <FileText className="h-4 w-4 mr-1" />
                  Templates
                </TabsTrigger>
                <TabsTrigger 
                  value="schedule"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg transition-all duration-200 hover:bg-primary-100 dark:hover:bg-primary-900/30 hover:text-primary py-1 px-3 text-sm h-8 cursor-pointer"
                >
                  <Calendar className="h-4 w-4 mr-1" />
                  Agendar
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </header>

      {/* Conteúdo principal */}
      <div className="mx-4 pt-16 space-y-2">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">

        {/* Mensagens Agendadas */}
        <TabsContent value="scheduled" className="space-y-2">
          {/* Messages List */}
          <Card className="border-primary/30 bg-background/95 backdrop-blur-md py-0">
            <CardContent className="p-0">
              <div className="space-y-0">
                {paginatedScheduledMessages.map((message) => (
                  <div key={message.id} className="border-b border-border/30 p-4 hover:bg-muted/30 transition-colors">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-10 w-10 border border-border/50">
                        <AvatarImage src={message.contact.avatar} />
                        <AvatarFallback className="bg-primary-100 dark:bg-primary-900/30 text-foreground">
                          {message.contact.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-foreground">{message.contact.name}</span>
                          <Badge className={`${getStatusColor(message.status)} border text-xs`}>
                            {message.status === 'scheduled' ? 'Agendada' : 
                             message.status === 'sent' ? 'Enviada' : 'Falhou'}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                          {message.message}
                        </p>
                        
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {message.scheduledAt.toLocaleDateString('pt-BR')} às {message.scheduledAt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                          </div>
                          {message.template && (
                            <div className="flex items-center gap-1">
                              <FileText className="h-3 w-3" />
                              {message.template}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" className="hover:bg-primary-100 dark:hover:bg-primary-900/30">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="hover:bg-primary-100 dark:hover:bg-primary-900/30">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 py-3 border-t border-border/50 bg-muted/30">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {filteredScheduledMessages.length} mensagens carregadas
                  </span>
                  {totalPages > 1 && (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="h-6 w-6 p-0"
                      >
                        <ChevronLeft className="h-3 w-3" />
                      </Button>
                      <span className="text-xs text-muted-foreground">
                        {currentPage} de {totalPages}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="h-6 w-6 p-0"
                      >
                        <ChevronRight className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Templates */}
        <TabsContent value="templates" className="space-y-2">
          <Card className="border-primary/30 bg-background/95 backdrop-blur-md py-0">
            <CardContent className="p-0">
              <div className="space-y-0">
                {templates.map((template) => (
                  <div key={template.id} className="border-b border-border/30 p-4 hover:bg-muted/30 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-foreground">{template.name}</span>
                          <Badge className={`${getCategoryColor(template.category)} border text-xs`}>
                            {template.category === 'welcome' ? 'Boas-vindas' :
                             template.category === 'followup' ? 'Follow-up' :
                             template.category === 'reminder' ? 'Lembrete' : 'Promoção'}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                          {template.content}
                        </p>
                        
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>Usado {template.usageCount} vezes</span>
                          <span>Criado em {template.createdAt.toLocaleDateString('pt-BR')}</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" className="hover:bg-primary-100 dark:hover:bg-primary-900/30">
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="hover:bg-primary-100 dark:hover:bg-primary-900/30">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="hover:bg-primary-100 dark:hover:bg-primary-900/30">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 py-3 border-t border-border/50 bg-muted/30">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {templates.length} templates carregados
                  </span>
                  <Button 
                    size="sm"
                    className="bg-primary-100 dark:bg-primary-900/30 border border-primary-200 dark:border-primary-800/50 text-primary-700 dark:text-primary-300 hover:bg-primary-200 dark:hover:bg-primary-800/40 hover:border-primary-300 dark:hover:border-primary-700/50 font-semibold"
                    onClick={() => setShowNewTemplate(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Template
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Agendar Mensagem */}
        <TabsContent value="schedule" className="space-y-4">
          <Card className="border-primary/30 bg-background/95 backdrop-blur-md">
            <CardHeader className="border-b border-border/50">
              <CardTitle>Agendar Nova Mensagem</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Contato
                  </label>
                  <Input placeholder="Nome do contato" className="border-primary/30 focus:border-primary" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Telefone
                  </label>
                  <Input placeholder="(11) 99999-9999" className="border-primary/30 focus:border-primary" />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Mensagem
                </label>
                <Textarea 
                  placeholder="Digite sua mensagem aqui..."
                  className="border-primary/30 focus:border-primary min-h-[100px]"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Data
                  </label>
                  <Input type="date" className="border-primary/30 focus:border-primary" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Horário
                  </label>
                  <Input type="time" className="border-primary/30 focus:border-primary" />
                </div>
    </div>
              
              <div className="flex gap-3 pt-4">
                <Button className="bg-primary hover:bg-primary/90 text-white font-semibold dark:bg-primary-600 dark:hover:bg-primary-700">
                  <Calendar className="h-4 w-4 mr-2" />
                  Agendar Mensagem
                </Button>
                <Button variant="outline" className="border-primary/30 hover:bg-primary-100 dark:hover:bg-primary-900/30">
                  <Send className="h-4 w-4 mr-2" />
                  Enviar Agora
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        </Tabs>

        {/* Modal para Novo Template */}
      {showNewTemplate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md border-primary/30 bg-background/95 backdrop-blur-md">
            <CardHeader className="border-b border-border/50">
              <CardTitle>Novo Template</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Nome do Template
                </label>
                <Input 
                  placeholder="Ex: Boas-vindas"
                  value={newTemplate.name}
                  onChange={(e) => setNewTemplate({...newTemplate, name: e.target.value})}
                  className="border-primary/30 focus:border-primary"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Categoria
                </label>
                <select 
                  value={newTemplate.category}
                  onChange={(e) => setNewTemplate({...newTemplate, category: e.target.value as MessageTemplate['category']})}
                  className="w-full px-3 py-2 border border-primary/30 rounded-md bg-background focus:border-primary focus:ring-[#04CDD4] focus:outline-none"
                >
                  <option value="welcome">Boas-vindas</option>
                  <option value="followup">Follow-up</option>
                  <option value="reminder">Lembrete</option>
                  <option value="promotion">Promoção</option>
                </select>
              </div>
              
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Conteúdo
                </label>
                <Textarea 
                  placeholder="Digite o conteúdo do template..."
                  value={newTemplate.content}
                  onChange={(e) => setNewTemplate({...newTemplate, content: e.target.value})}
                  className="border-primary/30 focus:border-primary min-h-[100px]"
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button 
                  className="bg-primary hover:bg-primary/90 text-white font-semibold dark:bg-primary-600 dark:hover:bg-primary-700"
                  onClick={handleCreateTemplate}
                >
                  Criar Template
                </Button>
                <Button 
                  variant="outline" 
                  className="border-primary/30 hover:bg-primary-100 dark:hover:bg-primary-900/30"
                  onClick={() => setShowNewTemplate(false)}
                >
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      </div>
    </div>
  );
}
