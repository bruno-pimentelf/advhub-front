import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, TrendingUp, Clock } from 'lucide-react';
import { FunnelNodeData } from '../types';

export function LeadNode({ data, selected }: NodeProps) {
  const nodeData = data as FunnelNodeData;
  return (
    <div className={`relative ${selected ? 'ring-2 ring-primary ring-offset-2' : ''}`}>
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-primary border-2 border-background"
      />
      
      <Card className={`w-64 border-2 transition-all duration-200 ${
        selected 
          ? 'border-primary shadow-lg shadow-primary/25' 
          : 'border-border hover:border-primary/50'
      }`}>
        <CardContent className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
              style={{ backgroundColor: nodeData.color }}
            >
              <Users className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">{nodeData.label}</h3>
              <p className="text-xs text-muted-foreground">{nodeData.description}</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Quantidade</span>
              <Badge variant="outline" className="bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 border-primary-200 dark:border-primary-800/50">
                {nodeData.count}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Taxa de Conversão</span>
              <div className="flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-green-500" />
                <span className="text-sm font-medium text-green-600 dark:text-green-400">
                  {nodeData.conversion}
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Tempo Médio</span>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">2 dias</span>
              </div>
            </div>
          </div>
          
          {/* Barra de Progresso */}
          <div className="mt-3">
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: nodeData.conversion,
                  backgroundColor: nodeData.color 
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-primary border-2 border-background"
      />
    </div>
  );
}
