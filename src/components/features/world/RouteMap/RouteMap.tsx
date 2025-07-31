'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { fetchAvailableRoutes, chooseRoute } from '../../../../services/routeService';

// Dynamically import ForceGraph2D to avoid SSR issues
const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-96">Loading visualization...</div>
});

interface RouteMapProps {
  itemId: string;
  itemType: string;
  onRouteSelected?: (route: any) => void;
  className?: string;
}

interface RouteNode {
  id: string;
  title: string;
  description: string;
  is_unlocked: boolean;
  is_current: boolean;
  is_default_route: boolean;
  difficulty_level: number;
  estimated_duration: number;
  unlock_hint?: string;
  x?: number;
  y?: number;
}

interface RouteLink {
  source: string;
  target: string;
  type: 'prerequisite' | 'branch' | 'consequence';
}

const RouteMap: React.FC<RouteMapProps> = ({ 
  itemId, 
  itemType, 
  onRouteSelected, 
  className = '' 
}) => {
  const fgRef = useRef<any>(null);
  const [routes, setRoutes] = useState<RouteNode[]>([]);
  const [links, setLinks] = useState<RouteLink[]>([]);
  const [selectedNode, setSelectedNode] = useState<RouteNode | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadRoutes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchAvailableRoutes(itemId, itemType);
      
      // Transform routes into nodes
      const nodes: RouteNode[] = data.map((route: any) => ({
        id: route.id,
        title: route.title,
        description: route.description,
        is_unlocked: route.is_unlocked,
        is_current: route.is_current,
        is_default_route: route.is_default_route,
        difficulty_level: route.difficulty_level,
        estimated_duration: route.estimated_duration,
        unlock_hint: route.unlock_hint,
      }));

      // Create links based on route relationships
      const routeLinks: RouteLink[] = [];
      data.forEach((route: any) => {
        if (route.requires_previous_completion && !route.is_default_route) {
          // Find the prerequisite route (simplified logic)
          const prerequisiteRoute = data.find((r: any) => 
            r.order_index < route.order_index && 
            (r.is_default_route || r.is_unlocked)
          );
          if (prerequisiteRoute) {
            routeLinks.push({
              source: prerequisiteRoute.id,
              target: route.id,
              type: 'prerequisite'
            });
          }
        }
      });

      setRoutes(nodes);
      setLinks(routeLinks);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load routes');
      console.error('Error loading routes:', err);
    } finally {
      setLoading(false);
    }
  }, [itemId, itemType]);

  useEffect(() => {
    loadRoutes();
  }, [loadRoutes]);

  const handleNodeClick = useCallback(async (node: RouteNode) => {
    if (!node.is_unlocked) {
      setSelectedNode(node);
      return;
    }

    try {
      await chooseRoute(node.id, itemId, itemType);
      await loadRoutes(); // Refresh the routes
      onRouteSelected?.(node);
    } catch (err) {
      console.error('Error choosing route:', err);
      setError(err instanceof Error ? err.message : 'Failed to choose route');
    }
  }, [itemId, itemType, loadRoutes, onRouteSelected]);

  const handleNodeHover = useCallback((node: RouteNode | null) => {
    if (node && !node.is_unlocked) {
      setSelectedNode(node);
    } else if (!node) {
      setSelectedNode(null);
    }
  }, []);

  const getNodeColor = useCallback((node: RouteNode) => {
    if (node.is_current) return '#4ade80'; // green for current
    if (node.is_unlocked) return '#3b82f6'; // blue for unlocked
    return '#9ca3af'; // gray for locked
  }, []);

  const getLinkColor = useCallback((link: RouteLink) => {
    const sourceNode = routes.find(n => n.id === link.source);
    const targetNode = routes.find(n => n.id === link.target);
    
    if (sourceNode?.is_unlocked && targetNode?.is_unlocked) {
      return '#10b981'; // green for available paths
    }
    return '#d1d5db'; // gray for locked paths
  }, [routes]);

  if (loading) {
    return (
      <div className={`flex items-center justify-center h-96 ${className}`}>
        <div className="text-lg">Loading route map...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex items-center justify-center h-96 ${className}`}>
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <div className="h-96 border rounded-lg bg-gray-50">
        <ForceGraph2D
          ref={fgRef}
          graphData={{ nodes: routes, links }}
          nodeColor={(node: any) => getNodeColor(node as RouteNode)}
          linkColor={(link: any) => getLinkColor(link as RouteLink)}
          nodeRelSize={8}
          linkWidth={2}
          nodeCanvasObject={(node: any, ctx: any, globalScale: number) => {
            const routeNode = node as RouteNode;
            const label = routeNode.title;
            const fontSize = Math.max(10, 14 / globalScale);
            const radius = 20;
            
            // Draw node circle
            ctx.beginPath();
            ctx.arc(routeNode.x!, routeNode.y!, radius, 0, 2 * Math.PI);
            ctx.fillStyle = getNodeColor(routeNode);
            ctx.fill();
            
            // Draw border for current route
            if (routeNode.is_current) {
              ctx.strokeStyle = '#059669';
              ctx.lineWidth = 3;
              ctx.stroke();
            }
            
            // Draw lock icon for locked routes
            if (!routeNode.is_unlocked) {
              ctx.fillStyle = '#ffffff';
              ctx.font = `${fontSize}px Arial`;
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillText('🔒', routeNode.x!, routeNode.y!);
            }
            
            // Draw label
            ctx.fillStyle = routeNode.is_unlocked ? '#1f2937' : '#6b7280';
            ctx.font = `${fontSize}px Sans-Serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'top';
            ctx.fillText(label, routeNode.x!, routeNode.y! + radius + 5);
          }}
          onNodeClick={(node: any) => handleNodeClick(node as RouteNode)}
          onNodeHover={(node: any) => handleNodeHover(node as RouteNode)}
          cooldownTicks={100}
          d3AlphaDecay={0.01}
          d3VelocityDecay={0.3}
        />
      </div>
      
      {/* Route Details Panel */}
      {selectedNode && (
        <div className="absolute top-4 right-4 bg-white border rounded-lg shadow-lg p-4 max-w-xs">
          <h3 className="font-bold text-lg mb-2">{selectedNode.title}</h3>
          <p className="text-sm text-gray-600 mb-3">{selectedNode.description}</p>
          
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium">Status:</span>{' '}
              <span className={`px-2 py-1 rounded text-xs ${
                selectedNode.is_current ? 'bg-green-100 text-green-800' :
                selectedNode.is_unlocked ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {selectedNode.is_current ? 'Current' :
                 selectedNode.is_unlocked ? 'Available' : 'Locked'}
              </span>
            </div>
            
            <div>
              <span className="font-medium">Difficulty:</span>{' '}
              {'★'.repeat(selectedNode.difficulty_level)}{'☆'.repeat(5 - selectedNode.difficulty_level)}
            </div>
            
            <div>
              <span className="font-medium">Duration:</span>{' '}
              {selectedNode.estimated_duration} minutes
            </div>
            
            {!selectedNode.is_unlocked && selectedNode.unlock_hint && (
              <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded">
                <span className="font-medium text-yellow-800">Unlock Hint:</span>
                <p className="text-yellow-700 text-xs mt-1">{selectedNode.unlock_hint}</p>
              </div>
            )}
          </div>
          
          {selectedNode.is_unlocked && !selectedNode.is_current && (
            <button 
              onClick={() => handleNodeClick(selectedNode)}
              className="w-full mt-3 bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              Choose This Route
            </button>
          )}
        </div>
      )}
      
      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white border rounded-lg shadow-lg p-3">
        <h4 className="font-medium mb-2">Legend</h4>
        <div className="space-y-1 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-green-400 border-2 border-green-600"></div>
            <span>Current Route</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-blue-400"></div>
            <span>Available Route</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-gray-400"></div>
            <span>Locked Route</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RouteMap;

