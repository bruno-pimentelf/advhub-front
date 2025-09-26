'use client';
import { faker } from '@faker-js/faker';
import { useHeader } from '../layout';
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
import { Plus, Search, Settings } from 'lucide-react';

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});

const shortDateFormatter = new Intl.DateTimeFormat('pt-BR', {
  month: 'short',
  day: 'numeric',
});

// Estrutura de dados para diferentes tipos de funis
const funnelTemplates = {
  'vendas-geral': {
    id: 'vendas-geral',
    name: 'Vendas Geral',
    description: 'Funil padrão para vendas B2B',
    stages: [
      { id: 'leads', name: 'Leads', color: 'var(--primary)' },
      { id: 'qualificados', name: 'Qualificados', color: 'var(--primary)' },
      { id: 'propostas', name: 'Propostas', color: 'var(--primary)' },
      { id: 'fechados', name: 'Fechados', color: 'var(--primary)' },
    ]
  },
  'ecommerce': {
    id: 'ecommerce',
    name: 'E-commerce',
    description: 'Funil para vendas online',
    stages: [
      { id: 'visitantes', name: 'Visitantes', color: '#8B5CF6' },
      { id: 'interessados', name: 'Interessados', color: '#8B5CF6' },
      { id: 'carrinho', name: 'Carrinho', color: '#8B5CF6' },
      { id: 'checkout', name: 'Checkout', color: '#8B5CF6' },
      { id: 'compra', name: 'Compra', color: '#8B5CF6' },
    ]
  },
  'saas': {
    id: 'saas',
    name: 'SaaS',
    description: 'Funil para software como serviço',
    stages: [
      { id: 'awareness', name: 'Awareness', color: '#10B981' },
      { id: 'interest', name: 'Interest', color: '#10B981' },
      { id: 'trial', name: 'Trial', color: '#10B981' },
      { id: 'conversion', name: 'Conversion', color: '#10B981' },
      { id: 'retention', name: 'Retention', color: '#10B981' },
    ]
  }
};

const FunnelsPage = () => {
  const [leads, setLeads] = useState<any[]>([]);
  const [columns, setColumns] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [selectedFunnel, setSelectedFunnel] = useState<string>('vendas-geral');
  const [showCreateFunnel, setShowCreateFunnel] = useState(false);
  const [showExploreFunnels, setShowExploreFunnels] = useState(false);

  // Função para carregar dados baseado no funil selecionado
  const loadFunnelData = (funnelId: string) => {
    const funnel = funnelTemplates[funnelId as keyof typeof funnelTemplates];
    if (!funnel) return;

    const generatedColumns = funnel.stages.map(stage => ({
      id: stage.id,
      name: stage.name,
      color: stage.color,
    }));

    // Usuários da equipe de vendas
    const teamUsers = [
      { name: "Ana Carolina", role: "Gerente de Vendas" },
      { name: "Pedro Santos", role: "Executivo de Contas" },
      { name: "Mariana Costa", role: "Analista Comercial" },
      { name: "Rafael Oliveira", role: "Consultor de Vendas" }
    ];

    const generatedUsers = teamUsers.map((user) => ({
      id: faker.string.uuid(),
      name: user.name,
      role: user.role,
      image: `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=04CDD4&color=fff&size=64&bold=true`,
    }));

    // Dados específicos para clínicas médicas
    const clinicLeads = [
      { name: "Dr. Carlos Silva - Clínica CardioVida", type: "cardiologia" },
      { name: "Dra. Ana Santos - OdontoCare", type: "odontologia" },
      { name: "Dr. Roberto Lima - Clínica Dermatológica", type: "dermatologia" },
      { name: "Dra. Maria Oliveira - FisioTotal", type: "fisioterapia" },
      { name: "Dr. João Costa - Clínica Oftalmológica", type: "oftalmologia" },
      { name: "Dra. Patricia Alves - GinecoSaúde", type: "ginecologia" },
      { name: "Dr. Fernando Rocha - Ortopedia Plus", type: "ortopedia" },
      { name: "Dra. Juliana Mendes - Pediatria Feliz", type: "pediatria" },
      { name: "Dr. Marcelo Souza - Clínica Neurológica", type: "neurologia" },
      { name: "Dra. Camila Ferreira - EndoClinic", type: "endocrinologia" },
      { name: "Dr. Rafael Torres - UroVida", type: "urologia" },
      { name: "Dra. Beatriz Nunes - Clínica Psiquiátrica", type: "psiquiatria" },
      { name: "Dr. Lucas Martins - GastroSaúde", type: "gastroenterologia" },
      { name: "Dra. Fernanda Costa - Clínica de Estética", type: "estetica" },
      { name: "Dr. André Silva - Clínica Vascular", type: "cirurgia_vascular" },
      { name: "Dra. Larissa Oliveira - Clínica de Nutrição", type: "nutricao" },
      { name: "Dr. Gustavo Santos - Clínica de Acupuntura", type: "acupuntura" },
      { name: "Dra. Renata Lima - Clínica de Psicologia", type: "psicologia" },
      { name: "Dr. Diego Alves - Clínica de Otorrino", type: "otorrinolaringologia" },
      { name: "Dra. Vanessa Rocha - Clínica de Mastologia", type: "mastologia" }
    ];

    const generatedLeads = clinicLeads.map((clinic) => ({
      id: faker.string.uuid(),
      name: clinic.name,
      startAt: faker.date.past({ years: 0.5, refDate: new Date() }),
      endAt: faker.date.future({ years: 0.5, refDate: new Date() }),
      column: faker.helpers.arrayElement(generatedColumns).id,
      owner: faker.helpers.arrayElement(generatedUsers),
      type: clinic.type,
    }));

    setColumns(generatedColumns);
    setUsers(generatedUsers);
    setLeads(generatedLeads);
  };

  useEffect(() => {
    // Garantir que os dados sejam gerados apenas no cliente
    setIsClient(true);
    loadFunnelData(selectedFunnel);
  }, [selectedFunnel]);

  // Função para lidar com mudança de funil
  const handleFunnelChange = (funnelId: string) => {
    setSelectedFunnel(funnelId);
  };


  // Mostrar loading enquanto os dados não são carregados
  if (!isClient || columns.length === 0) {
    return (
      <div className="mx-4 mb-4 mt-2">
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Carregando...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-4 mb-4 mt-2">
      {/* Header clean com seleção de funil e botões de ação */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-foreground">Funil Selecionado:</span>
            <Select value={selectedFunnel} onValueChange={handleFunnelChange}>
              <SelectTrigger className="w-[200px] h-10">
                <SelectValue>
                  {funnelTemplates[selectedFunnel as keyof typeof funnelTemplates]?.name}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {Object.values(funnelTemplates).map((funnel) => (
                  <SelectItem key={funnel.id} value={funnel.id}>
                    <div className="flex flex-col items-start">
                      <span className="font-medium">{funnel.name}</span>
                      <span className="text-xs text-muted-foreground">{funnel.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowExploreFunnels(true)}
              className="flex items-center gap-2"
            >
              <Search className="h-4 w-4" />
              Explorar
            </Button>
            <Button 
              size="sm"
              onClick={() => setShowCreateFunnel(true)}
              className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-semibold dark:bg-primary-600 dark:hover:bg-primary-700"
            >
              <Plus className="h-4 w-4" />
              Criar Funil
            </Button>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <KanbanProvider
        columns={columns}
        data={leads}
        onDataChange={setLeads}
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
                  {leads.filter(lead => lead.column === column.id).length}
                </span>
              </div>
            </KanbanHeader>
            <KanbanCards id={column.id}>
              {(lead: (typeof leads)[number]) => (
                <KanbanCard
                  column={column.id}
                  id={lead.id}
                  key={lead.id}
                  name={lead.name}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-col gap-2 flex-1">
                      <p className="m-0 font-semibold text-sm text-foreground leading-tight">
                        {lead.name}
                      </p>
                      <div className="flex items-center gap-2">
                        <div 
                          className="h-1.5 w-1.5 rounded-full"
                          style={{ backgroundColor: column.color }}
                        ></div>
                        <p className="m-0 text-muted-foreground text-xs">
                          {shortDateFormatter.format(lead.startAt)} -{' '}
                          {dateFormatter.format(lead.endAt)}
                        </p>
                      </div>
                    </div>
                    {lead.owner && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Avatar className="h-6 w-6 shrink-0 border border-border/50 cursor-pointer">
                              <AvatarImage src={lead.owner.image} />
                              <AvatarFallback 
                                className="text-xs text-foreground"
                                style={{ backgroundColor: `${column.color}10` }}
                              >
                                {lead.owner.name?.slice(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="font-medium">{lead.owner.name}</p>
                            <p className="text-xs text-muted-foreground">{lead.owner.role}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                </KanbanCard>
              )}
            </KanbanCards>
          </KanbanBoard>
        )}
      </KanbanProvider>

      {/* Modais para criar e explorar funis (placeholder) */}
      {showCreateFunnel && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold mb-4">Criar Novo Funil</h2>
            <p className="text-muted-foreground mb-4">
              Esta funcionalidade será implementada posteriormente.
            </p>
            <Button onClick={() => setShowCreateFunnel(false)} className="w-full">
              Fechar
            </Button>
          </div>
        </div>
      )}

      {showExploreFunnels && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold mb-4">Explorar Funis</h2>
            <p className="text-muted-foreground mb-4">
              Esta funcionalidade será implementada posteriormente.
            </p>
            <Button onClick={() => setShowExploreFunnels(false)} className="w-full">
              Fechar
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FunnelsPage;