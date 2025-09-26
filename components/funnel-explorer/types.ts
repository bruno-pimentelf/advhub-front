export interface FunnelNodeData {
  label: string;
  count: number;
  conversion: string;
  color: string;
  description: string;
  [key: string]: unknown;
}

export interface FunnelEdgeData {
  conversion: string;
  time: string;
  [key: string]: unknown;
}

export interface FunnelTemplate {
  id: string;
  name: string;
  description: string;
  nodes: Array<{
    id: string;
    type: string;
    position: { x: number; y: number };
    data: FunnelNodeData;
  }>;
  edges: Array<{
    id: string;
    source: string;
    target: string;
    type: string;
    data: FunnelEdgeData;
  }>;
}
