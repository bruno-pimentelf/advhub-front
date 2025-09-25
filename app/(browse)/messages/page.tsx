'use client';
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, 
  Search, 
  Send, 
  Clock, 
  FileText,
  Calendar,
  Edit,
  Trash2,
  Copy
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
      return 'bg-[#04CDD410] text-[#04CDD4] border-[#04CDD470]';
    case 'sent':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'failed':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getCategoryColor = (category: MessageTemplate['category']) => {
  switch (category) {
    case 'welcome':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'followup':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'reminder':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'promotion':
      return 'bg-pink-100 text-pink-800 border-pink-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export default function MessagesPage() {
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

  useEffect(() => {
    setIsClient(true);
    setScheduledMessages(generateScheduledMessages());
    setTemplates(generateTemplates());
  }, []);

  const filteredScheduledMessages = scheduledMessages.filter(message => {
    const matchesSearch = message.contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = statusFilter === 'all' || message.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

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
    <div className="mx-4 mb-4 mt-4 space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6 bg-transparent border border-[#04CDD4]/30 rounded-lg p-1 h-auto min-h-[3rem]">
          <TabsTrigger 
            value="scheduled" 
            className="data-[state=active]:bg-[#04CDD4] data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-[#04CDD4]/25 rounded-lg transition-all duration-200 hover:bg-[#04CDD410] hover:text-[#04CDD4] py-3 px-4"
          >
            <Clock className="h-4 w-4 mr-2" />
            Agendadas
          </TabsTrigger>
          <TabsTrigger 
            value="templates"
            className="data-[state=active]:bg-[#04CDD4] data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-[#04CDD4]/25 rounded-lg transition-all duration-200 hover:bg-[#04CDD410] hover:text-[#04CDD4] py-3 px-4"
          >
            <FileText className="h-4 w-4 mr-2" />
            Templates
          </TabsTrigger>
          <TabsTrigger 
            value="schedule"
            className="data-[state=active]:bg-[#04CDD4] data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-[#04CDD4]/25 rounded-lg transition-all duration-200 hover:bg-[#04CDD410] hover:text-[#04CDD4] py-3 px-4"
          >
            <Calendar className="h-4 w-4 mr-2" />
            Agendar
          </TabsTrigger>
        </TabsList>

        {/* Mensagens Agendadas */}
        <TabsContent value="scheduled" className="space-y-6">
          {/* Filters */}
          <Card className="border-[#04CDD470] bg-background/95 backdrop-blur-md">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar mensagens..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-[#04CDD470] focus:border-[#04CDD4] focus:ring-[#04CDD4]"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={statusFilter === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setStatusFilter('all')}
                    className={statusFilter === 'all' ? 'bg-[#04CDD4] hover:bg-[#04CDD4]/90' : 'border-[#04CDD470] hover:bg-[#04CDD410]'}
                  >
                    Todas
                  </Button>
                  <Button
                    variant={statusFilter === 'scheduled' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setStatusFilter('scheduled')}
                    className={statusFilter === 'scheduled' ? 'bg-[#04CDD4] hover:bg-[#04CDD4]/90' : 'border-[#04CDD470] hover:bg-[#04CDD410]'}
                  >
                    Agendadas
                  </Button>
                  <Button
                    variant={statusFilter === 'sent' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setStatusFilter('sent')}
                    className={statusFilter === 'sent' ? 'bg-[#04CDD4] hover:bg-[#04CDD4]/90' : 'border-[#04CDD470] hover:bg-[#04CDD410]'}
                  >
                    Enviadas
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Messages List */}
          <Card className="border-[#04CDD470] bg-background/95 backdrop-blur-md">
            <CardHeader className="border-b border-border/50">
              <CardTitle className="flex items-center justify-between">
                <span>Mensagens Agendadas</span>
                <Badge variant="outline" className="border-[#04CDD470] text-[#04CDD4]">
                  {filteredScheduledMessages.length} mensagens
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-0">
                {filteredScheduledMessages.map((message) => (
                  <div key={message.id} className="border-b border-border/30 p-4 hover:bg-muted/30 transition-colors">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-10 w-10 border border-border/50">
                        <AvatarImage src={message.contact.avatar} />
                        <AvatarFallback className="bg-[#04CDD410] text-foreground">
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
                        <Button variant="ghost" size="sm" className="hover:bg-[#04CDD410]">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="hover:bg-[#04CDD410]">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Templates */}
        <TabsContent value="templates" className="space-y-6">
          <Card className="border-[#04CDD470] bg-background/95 backdrop-blur-md">
            <CardHeader className="border-b border-border/50">
              <div className="flex items-center justify-between">
                <CardTitle className="m-0">Templates de Mensagem</CardTitle>
                <Button 
                  size="sm"
                  className="bg-[#04CDD4] hover:bg-[#04CDD4]/90 text-white"
                  onClick={() => setShowNewTemplate(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Template
                </Button>
              </div>
            </CardHeader>
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
                        <Button variant="ghost" size="sm" className="hover:bg-[#04CDD410]">
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="hover:bg-[#04CDD410]">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="hover:bg-[#04CDD410]">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Agendar Mensagem */}
        <TabsContent value="schedule" className="space-y-6">
          <Card className="border-[#04CDD470] bg-background/95 backdrop-blur-md">
            <CardHeader className="border-b border-border/50">
              <CardTitle>Agendar Nova Mensagem</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Contato
                  </label>
                  <Input placeholder="Nome do contato" className="border-[#04CDD470] focus:border-[#04CDD4]" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Telefone
                  </label>
                  <Input placeholder="(11) 99999-9999" className="border-[#04CDD470] focus:border-[#04CDD4]" />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Mensagem
                </label>
                <Textarea 
                  placeholder="Digite sua mensagem aqui..."
                  className="border-[#04CDD470] focus:border-[#04CDD4] min-h-[100px]"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Data
                  </label>
                  <Input type="date" className="border-[#04CDD470] focus:border-[#04CDD4]" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Horário
                  </label>
                  <Input type="time" className="border-[#04CDD470] focus:border-[#04CDD4]" />
                </div>
    </div>
              
              <div className="flex gap-3 pt-4">
                <Button className="bg-[#04CDD4] hover:bg-[#04CDD4]/90 text-white">
                  <Calendar className="h-4 w-4 mr-2" />
                  Agendar Mensagem
                </Button>
                <Button variant="outline" className="border-[#04CDD470] hover:bg-[#04CDD410]">
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
          <Card className="w-full max-w-md border-[#04CDD470] bg-background/95 backdrop-blur-md">
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
                  className="border-[#04CDD470] focus:border-[#04CDD4]"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Categoria
                </label>
                <select 
                  value={newTemplate.category}
                  onChange={(e) => setNewTemplate({...newTemplate, category: e.target.value as MessageTemplate['category']})}
                  className="w-full px-3 py-2 border border-[#04CDD470] rounded-md bg-background focus:border-[#04CDD4] focus:ring-[#04CDD4] focus:outline-none"
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
                  className="border-[#04CDD470] focus:border-[#04CDD4] min-h-[100px]"
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button 
                  className="bg-[#04CDD4] hover:bg-[#04CDD4]/90 text-white"
                  onClick={handleCreateTemplate}
                >
                  Criar Template
                </Button>
                <Button 
                  variant="outline" 
                  className="border-[#04CDD470] hover:bg-[#04CDD410]"
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
  );
}
