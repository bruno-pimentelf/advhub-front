import React from 'react';
import { EdgeProps, getBezierPath, EdgeLabelRenderer, BaseEdge } from '@xyflow/react';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Clock } from 'lucide-react';
import { FunnelEdgeData } from '../types';

export function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  selected,
}: EdgeProps) {
  const edgeData = data as FunnelEdgeData;
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          stroke: selected ? '#04CDD4' : '#8B5CF6',
          strokeWidth: selected ? 3 : 2,
          strokeDasharray: selected ? '5,5' : 'none',
        }}
        markerEnd="url(#arrowhead)"
      />
      
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: 'all',
          }}
          className="nodrag nopan"
        >
          <div className={`px-2 py-1 rounded-lg border transition-all duration-200 ${
            selected 
              ? 'bg-primary-100 dark:bg-primary-900/30 border-primary-200 dark:border-primary-800/50' 
              : 'bg-background/95 border-border/50'
          }`}>
            <div className="flex items-center gap-1 text-xs">
              <TrendingUp className="w-3 h-3 text-green-500" />
              <span className="font-medium text-foreground">{edgeData?.conversion || '0%'}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              <span>{edgeData?.time || '0 dias'}</span>
            </div>
          </div>
        </div>
      </EdgeLabelRenderer>
      
      {/* Definir marcador de seta */}
      <defs>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
        >
          <polygon
            points="0 0, 10 3.5, 0 7"
            fill={selected ? '#04CDD4' : '#8B5CF6'}
          />
        </marker>
      </defs>
    </>
  );
}
