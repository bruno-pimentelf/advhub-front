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

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  Zap
} from 'lucide-react';

// Tipos de nós customizados
import { LeadNode } from './nodes/lead-node';
import { QualificationNode } from './nodes/qualification-node';
import { ProposalNode } from './nodes/proposal-node';
import { ClosingNode } from './nodes/closing-node';
import { CustomEdge } from './edges/custom-edge';

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
const initialFunnels = [
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
];

interface FunnelExplorerProps {
  onClose: () => void;
  onSelectFunnel: (funnelId: string) => void;
}

export function FunnelExplorer({ onClose, onSelectFunnel }: FunnelExplorerProps) {
  const [selectedFunnel, setSelectedFunnel] = useState(initialFunnels[0]);
  const [nodes, setNodes, onNodesChange] = useNodesState(selectedFunnel.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(selectedFunnel.edges);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);

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
    const newNode: Node = {
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
      const firstCount = firstNode.data.count || 0;
      const lastCount = lastNode.data.count || 0;
      return firstCount > 0 ? `${((lastCount / firstCount) * 100).toFixed(1)}%` : '0%';
    }
    return '0%';
  }, [nodes]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-7xl h-[90vh] border-primary/30 bg-background/95 backdrop-blur-md">
        <CardHeader className="border-b border-border/50">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold text-foreground">
                Explorador de Funis
              </CardTitle>
              <p className="text-muted-foreground mt-1">
                Crie, edite e visualize funis de vendas de forma interativa
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Seletor de Funil */}
              <select
                value={selectedFunnel.id}
                onChange={(e) => {
                  const funnel = initialFunnels.find(f => f.id === e.target.value);
                  if (funnel) setSelectedFunnel(funnel);
                }}
                className="px-3 py-2 border border-primary-200 dark:border-primary-800/50 rounded-md bg-background hover:bg-primary-100 dark:hover:bg-primary-900/30 focus:border-primary-300 dark:focus:border-primary-700/50 focus:ring-[#04CDD4] focus:outline-none"
              >
                {initialFunnels.map((funnel) => (
                  <option key={funnel.id} value={funnel.id}>
                    {funnel.name}
                  </option>
                ))}
              </select>

              {/* Botões de Ação */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => addNode('lead')}
                className="border-primary-200 dark:border-primary-800/50 hover:bg-primary-100 dark:hover:bg-primary-900/30 hover:border-primary-300 dark:hover:border-primary-700/50"
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={onSave}
                className="border-primary-200 dark:border-primary-800/50 hover:bg-primary-100 dark:hover:bg-primary-900/30 hover:border-primary-300 dark:hover:border-primary-700/50"
              >
                <Save className="h-4 w-4 mr-2" />
                Salvar
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={onDownload}
                className="border-primary-200 dark:border-primary-800/50 hover:bg-primary-100 dark:hover:bg-primary-900/30 hover:border-primary-300 dark:hover:border-primary-700/50"
              >
                <Download className="h-4 w-4 mr-2" />
                Exportar
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
                <Upload className="h-4 w-4 mr-2" />
                Importar
              </Button>
              
              <Button
                size="sm"
                onClick={() => onSelectFunnel(selectedFunnel.id)}
                className="bg-primary-100 dark:bg-primary-900/30 border border-primary-200 dark:border-primary-800/50 text-primary-700 dark:text-primary-300 hover:bg-primary-200 dark:hover:bg-primary-800/40 hover:border-primary-300 dark:hover:border-primary-700/50 font-semibold"
              >
                <Play className="h-4 w-4 mr-2" />
                Usar Este Funil
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={onClose}
                className="border-primary-200 dark:border-primary-800/50 hover:bg-primary-100 dark:hover:bg-primary-900/30 hover:border-primary-300 dark:hover:border-primary-700/50"
              >
                Fechar
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0 h-[calc(100%-5rem)]">
          <div className="flex h-full">
            {/* Painel Lateral */}
            <div className="w-80 border-r border-border/50 p-4 bg-muted/20">
              <div className="space-y-4">
                {/* Estatísticas do Funil */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-foreground">Estatísticas do Funil</h3>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-background/80 p-3 rounded-lg border border-border/50">
                      <div className="flex items-center gap-2 mb-1">
                        <Target className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium text-foreground">Conversão Total</span>
                      </div>
                      <div className="text-2xl font-bold text-primary">{totalConversion}</div>
                    </div>
                    
                    <div className="bg-background/80 p-3 rounded-lg border border-border/50">
                      <div className="flex items-center gap-2 mb-1">
                        <Users className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium text-foreground">Total de Leads</span>
                      </div>
                      <div className="text-2xl font-bold text-primary">
                        {nodes[0]?.data.count || 0}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Estágios do Funil */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-foreground">Estágios do Funil</h3>
                  
                  <div className="space-y-2">
                    {nodes.map((node, index) => (
                      <div key={node.id} className="bg-background/80 p-3 rounded-lg border border-border/50">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: node.data.color }}
                            />
                            <span className="font-medium text-foreground">{node.data.label}</span>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {node.data.conversion}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {node.data.count} {node.data.label.toLowerCase()}
                        </div>
                        {index < nodes.length - 1 && (
                          <div className="mt-2 pt-2 border-t border-border/30">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <TrendingUp className="h-3 w-3" />
                              Próximo: {nodes[index + 1]?.data.label}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Ações Rápidas */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-foreground">Ações Rápidas</h3>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addNode('lead')}
                      className="border-primary-200 dark:border-primary-800/50 hover:bg-primary-100 dark:hover:bg-primary-900/30"
                    >
                      <Users className="h-4 w-4 mr-1" />
                      Lead
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addNode('qualification')}
                      className="border-primary-200 dark:border-primary-800/50 hover:bg-primary-100 dark:hover:bg-primary-900/30"
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Qualificação
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addNode('proposal')}
                      className="border-primary-200 dark:border-primary-800/50 hover:bg-primary-100 dark:hover:bg-primary-900/30"
                    >
                      <MessageSquare className="h-4 w-4 mr-1" />
                      Proposta
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addNode('closing')}
                      className="border-primary-200 dark:border-primary-800/50 hover:bg-primary-100 dark:hover:bg-primary-900/30"
                    >
                      <Zap className="h-4 w-4 mr-1" />
                      Fechamento
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Área do React Flow */}
            <div className="flex-1">
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onInit={setReactFlowInstance}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                fitView
                className="bg-muted/10"
              >
                <Controls className="bg-background/95 border border-border/50" />
                <MiniMap 
                  className="bg-background/95 border border-border/50"
                  nodeColor={(node) => node.data.color}
                  nodeStrokeWidth={3}
                  zoomable
                  pannable
                />
                <Background 
                  variant="dots" 
                  gap={20} 
                  size={1} 
                  color="var(--border)"
                />
                
                <Panel position="top-right" className="bg-background/95 border border-border/50 rounded-lg p-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Eye className="h-4 w-4" />
                    <span>Visualização Interativa</span>
                  </div>
                </Panel>
              </ReactFlow>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Wrapper com ReactFlowProvider
export function FunnelExplorerWrapper(props: FunnelExplorerProps) {
  return (
    <ReactFlowProvider>
      <FunnelExplorer {...props} />
    </ReactFlowProvider>
  );
}
