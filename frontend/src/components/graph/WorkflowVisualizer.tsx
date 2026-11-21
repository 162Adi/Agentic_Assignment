import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Panel,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { CustomAgentNode } from './CustomAgentNode';
import { NodeDetailDrawer } from './NodeDetailDrawer';
import { LabArchitecture, WorkflowNodeData } from '../../types';
import { Maximize2, Layers, RefreshCw, Eye } from 'lucide-react';
import { useAppStore } from '../../stores/useAppStore';

interface WorkflowVisualizerProps {
  architecture: LabArchitecture;
  height?: string;
  className?: string;
}

export const WorkflowVisualizer: React.FC<WorkflowVisualizerProps> = ({
  architecture,
  height = '520px',
  className = '',
}) => {
  const theme = useAppStore((s) => s.theme);
  const isDark = theme === 'dark';

  const [viewMode, setViewMode] = useState<'architecture' | 'execution'>('architecture');
  const [selectedNode, setSelectedNode] = useState<WorkflowNodeData | null>(null);

  const nodeTypes = useMemo(() => ({ customAgent: CustomAgentNode }), []);

  // Format nodes for React Flow
  const initialNodes: Node[] = useMemo(() => {
    return architecture.nodes.map((n) => ({
      id: n.id,
      type: 'customAgent',
      position: n.position || { x: 100, y: 100 },
      data: {
        label: n.label,
        type: n.type,
        description: n.description,
        relevant_function: n.relevant_function,
        status: viewMode === 'execution' ? 'completed' : 'idle',
      },
    }));
  }, [architecture, viewMode]);

  const initialEdges: Edge[] = useMemo(() => {
    return architecture.edges.map((e) => ({
      id: e.id,
      source: e.source,
      target: e.target,
      label: e.label,
      animated: true,
      style: {
        stroke: isDark ? 'rgba(139, 92, 246, 0.5)' : '#8b5cf6',
        strokeWidth: 2,
      },
      labelStyle: {
        fill: isDark ? '#cbd5e1' : '#475569',
        fontSize: 10,
        fontFamily: 'monospace',
      },
      labelBgStyle: {
        fill: isDark ? '#0f1422' : '#ffffff',
        fillOpacity: 0.9,
      },
    }));
  }, [architecture, isDark]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
    setSelectedNode(null);
  }, [initialNodes, initialEdges, setNodes, setEdges]);

  const onNodeClick = useCallback(
    (_: any, node: Node) => {
      const match = architecture.nodes.find((n) => n.id === node.id);
      if (match) {
        setSelectedNode(match);
      }
    },
    [architecture]
  );

  return (
    <div
      className={`relative rounded-xl border border-white/10 dark:border-white/10 light:border-slate-200 overflow-hidden bg-[#0a0d18] shadow-md ${className}`}
      style={{ height }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        onNodeClick={onNodeClick}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.4}
        maxZoom={1.8}
        proOptions={{ hideAttribution: true }}
      >
        <Background
          color={isDark ? 'rgba(255, 255, 255, 0.05)' : '#e2e8f0'}
          gap={16}
          size={1}
        />
        <Controls
          className="!bg-[#0e1322] !border !border-white/10 !rounded-lg !shadow-xl [&>button]:!border-white/5 [&>button]:!text-slate-300"
        />
        <MiniMap
          nodeColor={() => (isDark ? '#8b5cf6' : '#6366f1')}
          maskColor={isDark ? 'rgba(10, 13, 24, 0.7)' : 'rgba(241, 245, 249, 0.7)'}
          className="!bg-[#0e1322] !border !border-white/10 !rounded-lg !overflow-hidden"
          zoomable
          pannable
        />

        {/* View Mode Toggle Panel */}
        <Panel position="top-left" className="m-3 flex items-center gap-2">
          <div className="flex items-center p-1 rounded-lg bg-[#0e1322]/90 backdrop-blur border border-white/10 text-xs">
            <button
              onClick={() => setViewMode('architecture')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded transition-colors ${
                viewMode === 'architecture'
                  ? 'bg-violet-600 text-white font-medium shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Architecture View
            </button>
            <button
              onClick={() => setViewMode('execution')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded transition-colors ${
                viewMode === 'execution'
                  ? 'bg-cyan-600 text-white font-medium shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              Execution Trace View
            </button>
          </div>
        </Panel>

        {/* Graph Info Panel */}
        <Panel position="top-right" className="m-3">
          <div className="px-3 py-1.5 rounded-lg bg-[#0e1322]/90 backdrop-blur border border-white/10 text-xs font-mono text-slate-300">
            <span className="text-violet-400 font-bold">{architecture.pattern_name}</span>
            <span className="text-slate-500 ml-2">({architecture.nodes.length} nodes)</span>
          </div>
        </Panel>
      </ReactFlow>

      {/* Node Detail Drawer */}
      <NodeDetailDrawer node={selectedNode} onClose={() => setSelectedNode(null)} />
    </div>
  );
};
