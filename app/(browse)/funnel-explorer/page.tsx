'use client';

import React, { useCallback, useState, useMemo } from 'react';
import {
  ReactFlow,
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  MiniMap,
  Panel,
  NodeTypes,
  EdgeTypes,
  ReactFlowProvider,
  ReactFlowInstance,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import './funnel-explorer.css';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Plus, 
  Save, 
  Download, 
  Upload, 
  Settings, 
  Eye,
  Play,
  Pause,
  RotateCcw,
  Target,
  Users,
  MessageSquare,
  TrendingUp,
  CheckCircle,
  XCircle,
  Clock,
  Zap,
  Home,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Tipos de nós customizados
import { LeadNode } from '@/components/funnel-explorer/nodes/lead-node';
import { QualificationNode } from '@/components/funnel-explorer/nodes/qualification-node';
import { ProposalNode } from '@/components/funnel-explorer/nodes/proposal-node';
import { ClosingNode } from '@/components/funnel-explorer/nodes/closing-node';
import { CustomEdge } from '@/components/funnel-explorer/edges/custom-edge';
import { FunnelNodeData, FunnelEdgeData, FunnelTemplate } from '@/components/funnel-explorer/types';

// Definir tipos de nós e arestas
const nodeTypes: NodeTypes = {
  lead: LeadNode,
  qualification: QualificationNode,
  proposal: ProposalNode,
  closing: ClosingNode,
};

const edgeTypes: EdgeTypes = {
  custom: CustomEdge,
};

// Dados iniciais dos funis
const initialFunnels: FunnelTemplate[] = [
  {
    id: 'vendas-geral',
    name: 'Vendas Geral',
    description: 'Funil padrão para vendas B2B',
    nodes: [
      {
        id: '1',
        type: 'lead',
        position: { x: 100, y: 100 },
        data: { 
          label: 'Leads', 
          count: 150, 
          conversion: '100%',
          color: '#04CDD4',
          description: 'Novos contatos interessados'
        },
      },
      {
        id: '2',
        type: 'qualification',
        position: { x: 400, y: 100 },
        data: { 
          label: 'Qualificados', 
          count: 75, 
          conversion: '50%',
          color: '#8B5CF6',
          description: 'Leads que atendem critérios'
        },
      },
      {
        id: '3',
        type: 'proposal',
        position: { x: 700, y: 100 },
        data: { 
          label: 'Propostas', 
          count: 30, 
          conversion: '40%',
          color: '#10B981',
          description: 'Propostas enviadas'
        },
      },
      {
        id: '4',
        type: 'closing',
        position: { x: 1000, y: 100 },
        data: { 
          label: 'Fechados', 
          count: 12, 
          conversion: '40%',
          color: '#F59E0B',
          description: 'Vendas realizadas'
        },
      },
    ],
    edges: [
      {
        id: 'e1-2',
        source: '1',
        target: '2',
        type: 'custom',
        data: { conversion: '50%', time: '2 dias' },
      },
      {
        id: 'e2-3',
        source: '2',
        target: '3',
        type: 'custom',
        data: { conversion: '40%', time: '5 dias' },
      },
      {
        id: 'e3-4',
        source: '3',
        target: '4',
        type: 'custom',
        data: { conversion: '40%', time: '3 dias' },
      },
    ],
  },
  {
    id: 'ecommerce',
    name: 'E-commerce',
    description: 'Funil para vendas online',
    nodes: [
      {
        id: '1',
        type: 'lead',
        position: { x: 100, y: 100 },
        data: { 
          label: 'Visitantes', 
          count: 1000, 
          conversion: '100%',
          color: '#04CDD4',
          description: 'Usuários que visitam o site'
        },
      },
      {
        id: '2',
        type: 'qualification',
        position: { x: 400, y: 100 },
        data: { 
          label: 'Interessados', 
          count: 200, 
          conversion: '20%',
          color: '#8B5CF6',
          description: 'Visitantes que demonstram interesse'
        },
      },
      {
        id: '3',
        type: 'proposal',
        position: { x: 700, y: 100 },
        data: { 
          label: 'Carrinho', 
          count: 50, 
          conversion: '25%',
          color: '#10B981',
          description: 'Produtos adicionados ao carrinho'
        },
      },
      {
        id: '4',
        type: 'closing',
        position: { x: 1000, y: 100 },
        data: { 
          label: 'Compra', 
          count: 15, 
          conversion: '30%',
          color: '#F59E0B',
          description: 'Compras finalizadas'
        },
      },
    ],
    edges: [
      {
        id: 'e1-2',
        source: '1',
        target: '2',
        type: 'custom',
        data: { conversion: '20%', time: '1 dia' },
      },
      {
        id: 'e2-3',
        source: '2',
        target: '3',
        type: 'custom',
        data: { conversion: '25%', time: '2 dias' },
      },
      {
        id: 'e3-4',
        source: '3',
        target: '4',
        type: 'custom',
        data: { conversion: '30%', time: '1 dia' },
      },
    ],
  },
  {
    id: 'saas',
    name: 'SaaS',
    description: 'Funil para software como serviço',
    nodes: [
      {
        id: '1',
        type: 'lead',
        position: { x: 100, y: 100 },
        data: { 
          label: 'Awareness', 
          count: 500, 
          conversion: '100%',
          color: '#04CDD4',
          description: 'Pessoas que conhecem o produto'
        },
      },
      {
        id: '2',
        type: 'qualification',
        position: { x: 400, y: 100 },
        data: { 
          label: 'Interest', 
          count: 100, 
          conversion: '20%',
          color: '#8B5CF6',
          description: 'Interessados em saber mais'
        },
      },
      {
        id: '3',
        type: 'proposal',
        position: { x: 700, y: 100 },
        data: { 
          label: 'Trial', 
          count: 30, 
          conversion: '30%',
          color: '#10B981',
          description: 'Teste gratuito iniciado'
        },
      },
      {
        id: '4',
        type: 'closing',
        position: { x: 1000, y: 100 },
        data: { 
          label: 'Conversion', 
          count: 9, 
          conversion: '30%',
          color: '#F59E0B',
          description: 'Conversão para pagante'
        },
      },
    ],
    edges: [
      {
        id: 'e1-2',
        source: '1',
        target: '2',
        type: 'custom',
        data: { conversion: '20%', time: '3 dias' },
      },
      {
        id: 'e2-3',
        source: '2',
        target: '3',
        type: 'custom',
        data: { conversion: '30%', time: '7 dias' },
      },
      {
        id: 'e3-4',
        source: '3',
        target: '4',
        type: 'custom',
        data: { conversion: '30%', time: '14 dias' },
      },
    ],
  },
];

function FunnelExplorerContent() {
  const router = useRouter();
  const [selectedFunnel, setSelectedFunnel] = useState(initialFunnels[0]);
  const [nodes, setNodes, onNodesChange] = useNodesState(selectedFunnel.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(selectedFunnel.edges);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance<any, any> | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);

  // Auto fit view inicial para centralizar
  React.useEffect(() => {
    if (reactFlowInstance) {
      setTimeout(() => {
        reactFlowInstance.fitView({
          padding: 0.2,
          includeHiddenNodes: false,
          minZoom: 0.1,
          maxZoom: 1.5
        });
      }, 100);
    }
  }, [reactFlowInstance]);

  // Atualizar nós e arestas quando o funil selecionado mudar
  React.useEffect(() => {
    setNodes(selectedFunnel.nodes);
    setEdges(selectedFunnel.edges);
  }, [selectedFunnel, setNodes, setEdges]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({
      ...params,
      type: 'custom',
      data: { conversion: '0%', time: '0 dias' },
    }, eds)),
    [setEdges]
  );

  const onSave = useCallback(() => {
    if (reactFlowInstance) {
      const flow = reactFlowInstance.toObject();
      console.log('Salvando funil:', flow);
      // Aqui você implementaria a lógica de salvamento
    }
  }, [reactFlowInstance]);

  const onDownload = useCallback(() => {
    if (reactFlowInstance) {
      const flow = reactFlowInstance.toObject();
      const dataStr = JSON.stringify(flow, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `funil-${selectedFunnel.name.toLowerCase().replace(/\s+/g, '-')}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    }
  }, [reactFlowInstance, selectedFunnel]);

  const onUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const flow = JSON.parse(e.target?.result as string);
          setNodes(flow.nodes || []);
          setEdges(flow.edges || []);
        } catch (error) {
          console.error('Erro ao carregar arquivo:', error);
        }
      };
      reader.readAsText(file);
    }
  }, [setNodes, setEdges]);

  const addNode = useCallback((type: string) => {
    const newNode = {
      id: `${Date.now()}`,
      type,
      position: { x: Math.random() * 500 + 100, y: Math.random() * 300 + 100 },
      data: { 
        label: `Novo ${type}`, 
        count: 0, 
        conversion: '0%',
        color: '#04CDD4',
        description: 'Novo estágio'
      },
    };
    setNodes((nds) => [...nds, newNode]);
  }, [setNodes]);

  const totalConversion = useMemo(() => {
    if (nodes.length === 0) return '0%';
    const firstNode = nodes[0];
    const lastNode = nodes[nodes.length - 1];
    if (firstNode && lastNode) {
      const firstCount = (firstNode.data as FunnelNodeData).count || 0;
      const lastCount = (lastNode.data as FunnelNodeData).count || 0;
      return firstCount > 0 ? `${((lastCount / firstCount) * 100).toFixed(1)}%` : '0%';
    }
    return '0%';
  }, [nodes]);

  const handleUseFunnel = useCallback(() => {
    // Aqui você pode implementar a lógica para aplicar o funil selecionado
    // Por exemplo, salvar no localStorage ou enviar para o backend
    localStorage.setItem('selectedFunnel', selectedFunnel.id);
    router.push('/funnels');
  }, [selectedFunnel, router]);

  return (
    <div className="h-screen w-full bg-background flex flex-col">
      {/* Header Compacto */}
      <div className="flex-shrink-0 border-b border-border/50 bg-background/95 backdrop-blur-md">
        <div className="flex items-center justify-between h-14 px-4">
          {/* Dropdown Adicionar */}
          <div className="flex items-center gap-3">
            <Select onValueChange={(value) => addNode(value)}>
              <SelectTrigger className="w-[140px] h-10">
                <SelectValue placeholder="Adicionar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lead">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>Lead</span>
                  </div>
                </SelectItem>
                <SelectItem value="qualification">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    <span>Qualificação</span>
                  </div>
                </SelectItem>
                <SelectItem value="proposal">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    <span>Proposta</span>
                  </div>
                </SelectItem>
                <SelectItem value="closing">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    <span>Fechamento</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Botões de Ação Compactos */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onSave}
              className="border-primary-200 dark:border-primary-800/50 hover:bg-primary-100 dark:hover:bg-primary-900/30 hover:border-primary-300 dark:hover:border-primary-700/50"
            >
              <Save className="h-4 w-4" />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={onDownload}
              className="border-primary-200 dark:border-primary-800/50 hover:bg-primary-100 dark:hover:bg-primary-900/30 hover:border-primary-300 dark:hover:border-primary-700/50"
            >
              <Download className="h-4 w-4" />
            </Button>
            
            <input
              type="file"
              accept=".json"
              onChange={onUpload}
              className="hidden"
              id="upload-funnel"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => document.getElementById('upload-funnel')?.click()}
              className="border-primary-200 dark:border-primary-800/50 hover:bg-primary-100 dark:hover:bg-primary-900/30 hover:border-primary-300 dark:hover:border-primary-700/50"
            >
              <Upload className="h-4 w-4" />
            </Button>
            
            <Button
              size="sm"
              onClick={handleUseFunnel}
              className="bg-primary-100 dark:bg-primary-900/30 border border-primary-200 dark:border-primary-800/50 text-primary-700 dark:text-primary-300 hover:bg-primary-200 dark:hover:bg-primary-800/40 hover:border-primary-300 dark:hover:border-primary-700/50 font-semibold"
            >
              <Play className="h-4 w-4 mr-2" />
              Usar Funil
            </Button>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal - Layout Horizontal */}
      <div className="flex-1 flex overflow-hidden">
        {/* Painel Lateral Colapsável */}
        <div className={`${sidebarCollapsed ? 'w-12' : 'w-80'} flex-shrink-0 border-r border-border/50 bg-background/95 backdrop-blur-md overflow-y-auto transition-all duration-300`}>
          {sidebarCollapsed ? (
            /* Sidebar Colapsada */
            <div className="p-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarCollapsed(false)}
                className="w-full h-8 p-0 hover:bg-primary-100 dark:hover:bg-primary-900/30"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            /* Sidebar Expandida */
            <div className="p-4 space-y-4">
              {/* Botão para colapsar */}
              <div className="flex justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarCollapsed(true)}
                  className="h-6 w-6 p-0 hover:bg-primary-100 dark:hover:bg-primary-900/30"
                >
                  <ChevronLeft className="h-3 w-3" />
                </Button>
              </div>
              
              {/* Seletor de Funil */}
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-foreground">Template</h3>
                <select
                  value={selectedFunnel.id}
                  onChange={(e) => {
                    const funnel = initialFunnels.find(f => f.id === e.target.value);
                    if (funnel) setSelectedFunnel(funnel);
                  }}
                  className="w-full px-3 py-2 text-sm border border-primary-200 dark:border-primary-800/50 rounded-md bg-background hover:bg-primary-100 dark:hover:bg-primary-900/30 focus:border-primary-300 dark:focus:border-primary-700/50 focus:ring-[#04CDD4] focus:outline-none"
                >
                  {initialFunnels.map((funnel) => (
                    <option key={funnel.id} value={funnel.id}>
                      {funnel.name}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-muted-foreground">
                  {selectedFunnel.description}
                </p>
              </div>

              {/* Estatísticas Compactas */}
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-foreground">Estatísticas</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-background/80 p-2 rounded border border-border/50">
                    <div className="flex items-center gap-1 mb-1">
                      <Target className="h-3 w-3 text-primary" />
                      <span className="text-xs font-medium text-foreground">Conversão</span>
                    </div>
                    <div className="text-lg font-bold text-primary">{totalConversion}</div>
                  </div>
                  
                  <div className="bg-background/80 p-2 rounded border border-border/50">
                    <div className="flex items-center gap-1 mb-1">
                      <Users className="h-3 w-3 text-primary" />
                      <span className="text-xs font-medium text-foreground">Leads</span>
                    </div>
                    <div className="text-lg font-bold text-primary">
                      {(nodes[0]?.data as FunnelNodeData)?.count || 0}
                    </div>
                  </div>
                </div>
              </div>

              {/* Estágios Compactos */}
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-foreground">Estágios</h3>
                <div className="space-y-2">
                  {nodes.map((node, index) => {
                    const nodeData = node.data as FunnelNodeData;
                    return (
                      <div key={node.id} className="bg-background/80 p-2 rounded border border-border/50">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: nodeData.color }}
                            />
                            <span className="text-xs font-medium text-foreground">{nodeData.label}</span>
                          </div>
                          <Badge variant="outline" className="text-xs px-1 py-0">
                            {nodeData.conversion}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {nodeData.count} {nodeData.label.toLowerCase()}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}
        </div>

        {/* Área do React Flow - Máxima Largura */}
        <div className="flex-1 relative">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            className="bg-muted/10"
          >
            <Controls 
              showZoom={true}
              showFitView={true}
              showInteractive={false}
              position="bottom-left"
            />
            <MiniMap 
              nodeColor={(node) => (node.data as FunnelNodeData).color}
              nodeStrokeWidth={3}
              zoomable
              pannable
              maskColor="hsl(var(--background) / 0.1)"
            />
            <Background 
              gap={20} 
              size={1} 
              color="var(--border)"
            />
            
            <Panel position="top-right" className="rounded-lg p-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Eye className="h-4 w-4" />
                <span>Modo Exploração</span>
              </div>
            </Panel>
          </ReactFlow>
        </div>
      </div>
    </div>
  );
}

export default function FunnelExplorerPage() {
  return (
    <ReactFlowProvider>
      <FunnelExplorerContent />
    </ReactFlowProvider>
  );
}