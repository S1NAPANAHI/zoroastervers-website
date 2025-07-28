'use client'
import React, { useRef, useEffect, useCallback, useState } from 'react';
import ForceGraph2D from 'react-force-graph-2d';

interface CharacterNode {
  id: number;
  name: string;
  importance?: number;
  type?: string;
}

interface RelationshipLink {
  source: number;
  target: number;
  relationship_type: string;
  strength?: number;
}

interface GraphData {
  nodes: CharacterNode[];
  links: RelationshipLink[];
}

interface RelationshipGraphProps {
  characters: CharacterNode[];
  relationships: RelationshipLink[];
  onNodeClick?: (node: CharacterNode) => void;
  onNodeDrag?: (node: CharacterNode, translate: { x: number; y: number }) => void;
  onCreateRelationship?: (sourceId: number, targetId: number) => void;
  editable?: boolean;
}

const RelationshipGraph: React.FC<RelationshipGraphProps> = ({ 
  characters, 
  relationships, 
  onNodeClick,
  onNodeDrag,
  onCreateRelationship,
  editable = false
}) => {
  const graphRef = useRef<any>();
  const [isConnecting, setIsConnecting] = useState(false);
  const [sourceNode, setSourceNode] = useState<CharacterNode | null>(null);

  const handleLinkCreation = useCallback((source: any, target: any) => {
    if (onCreateRelationship) {
      onCreateRelationship(source.id, target.id);
    }
    setIsConnecting(false);
    setSourceNode(null);
  }, [onCreateRelationship]);
  
  const data: GraphData = {
    nodes: characters.map(char => ({
      ...char,
      importance: Math.random() * 10 + 1, // Mock importance for sizing
      type: Math.random() > 0.5 ? 'protagonist' : 'supporting'
    })),
    links: relationships.filter(rel => 
      characters.find(c => c.id === rel.source) && 
      characters.find(c => c.id === rel.target)
    )
  };

  const getNodeColor = useCallback((node: CharacterNode) => {
    switch (node.type) {
      case 'protagonist': return '#ff6b6b';
      case 'antagonist': return '#ee5a24';
      case 'supporting': return '#3742fa';
      default: return '#2f3542';
    }
  }, []);

  const getNodeSize = useCallback((node: CharacterNode) => {
    return Math.max(8, (node.importance || 5) * 2);
  }, []);

  const getLinkColor = useCallback((link: RelationshipLink) => {
    switch (link.relationship_type) {
      case 'family': return '#ff4757';
      case 'friend': return '#2ed573';
      case 'enemy': return '#ff3838';
      case 'romantic': return '#ff6b81';
      case 'ally': return '#3742fa';
      case 'rival': return '#ffa502';
      case 'mentor': return '#5f27cd';
      default: return '#57606f';
    }
  }, []);

  const handleNodeClick = useCallback((node: any) => {
    if (onNodeClick) {
      onNodeClick(node);
    }
  }, [onNodeClick]);

  const handleNodeDrag = useCallback((node: any, translate: { x: number; y: number }) => {
    if (onNodeDrag) {
      onNodeDrag(node, translate);
    }
  }, [onNodeDrag]);

  useEffect(() => {
    if (graphRef.current) {
      // Customize force simulation
      graphRef.current.d3Force('charge').strength(-300);
      graphRef.current.d3Force('link').distance(100);
    }
  }, []);

  return (
    <div className="w-full h-[500px] bg-gray-900 rounded-lg border border-gray-700 overflow-hidden">
      <div className="p-4 bg-gray-800 border-b border-gray-700">
        <h3 className="text-white font-semibold mb-2">Character Relationship Network</h3>
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <span className="text-gray-300">Family</span>
          </span>
          <span className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
            <span className="text-gray-300">Friend</span>
          </span>
          <span className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-blue-400"></div>
            <span className="text-gray-300">Ally</span>
          </span>
          <span className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-pink-400"></div>
            <span className="text-gray-300">Romantic</span>
          </span>
          <span className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-orange-400"></div>
            <span className="text-gray-300">Rival</span>
          </span>
        </div>
      </div>
      
      <ForceGraph2D
        ref={graphRef}
        graphData={data}
        width={undefined}
        height={400}
        backgroundColor="transparent"
        nodeLabel={(node: any) => `
          <div style="
            background: rgba(0,0,0,0.8); 
            color: white; 
            padding: 8px 12px; 
            border-radius: 4px; 
            font-size: 14px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.3);
          ">
            <strong>${node.name}</strong><br/>
            Importance: ${node.importance?.toFixed(1) || 'N/A'}<br/>
            Type: ${node.type || 'Unknown'}
          </div>
        `}
        nodeColor={getNodeColor}
        nodeVal={getNodeSize}
        nodeRelSize={6}
        linkColor={getLinkColor}
        linkWidth={(link: any) => Math.max(1, (link.strength || 1) * 2)}
        linkDirectionalParticles={2}
        linkDirectionalParticleWidth={2}
        linkDirectionalParticleSpeed={0.01}
        linkDirectionalArrowLength={6}
        linkDirectionalArrowRelPos={1}
        linkLabel={(link: any) => `
          <div style="
            background: rgba(0,0,0,0.8); 
            color: white; 
            padding: 6px 10px; 
            border-radius: 4px; 
            font-size: 12px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.3);
          ">
            ${link.relationship_type}
            ${link.strength ? `<br/>Strength: ${link.strength}/10` : ''}
          </div>
        `}
        onNodeClick={handleNodeClick}
        onNodeDrag={handleNodeDrag}
        enableNodeDrag={true}
        enableZoomPanInteraction={true}
        cooldownTicks={100}
        nodeCanvasObject={(node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
          const label = node.name;
          const fontSize = 12/globalScale;
          ctx.font = `${fontSize}px Sans-Serif`;
          const textWidth = ctx.measureText(label).width;
          const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2);

          ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
          ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, ...bckgDimensions);

          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = 'white';
          ctx.fillText(label, node.x, node.y);

          node.__bckgDimensions = bckgDimensions;
        }}
        nodePointerAreaPaint={(node: any, color: string, ctx: CanvasRenderingContext2D) => {
          ctx.fillStyle = color;
          const bckgDimensions = node.__bckgDimensions;
          bckgDimensions &&
            ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, ...bckgDimensions);
        }}
      />
    </div>
  );
};

export default RelationshipGraph;

