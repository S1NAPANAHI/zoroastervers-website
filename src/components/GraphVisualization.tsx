'use client';

export default function GraphVisualization() {
  return (
    <div className="glass-dark p-6 glow-card h-64">
      <h3 className="text-xl font-semibold text-[#dcddde] mb-4 flex items-center">
        🕸️ World Connections
      </h3>
      <div className="relative h-full glass rounded-lg overflow-hidden">
        {/* Animated Graph Nodes */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-full h-full">
            {/* Central Node */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-purple-500 rounded-full animate-pulse shadow-lg shadow-purple-500/50">
            </div>
            
            {/* Satellite Nodes */}
            <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-blue-400 rounded-full animate-bounce shadow-lg shadow-blue-400/50">
            </div>
            <div className="absolute top-1/4 right-1/4 w-3 h-3 bg-green-400 rounded-full animate-bounce shadow-lg shadow-green-400/50" style={{animationDelay: '0.5s'}}>
            </div>
            <div className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-yellow-400 rounded-full animate-bounce shadow-lg shadow-yellow-400/50" style={{animationDelay: '1s'}}>
            </div>
            <div className="absolute bottom-1/4 right-1/3 w-3 h-3 bg-red-400 rounded-full animate-bounce shadow-lg shadow-red-400/50" style={{animationDelay: '1.5s'}}>
            </div>
            
            {/* Connection Lines */}
            <svg className="absolute inset-0 w-full h-full">
              <line x1="50%" y1="50%" x2="25%" y2="25%" stroke="#484848" strokeWidth="1" opacity="0.6"/>
              <line x1="50%" y1="50%" x2="75%" y2="25%" stroke="#484848" strokeWidth="1" opacity="0.6"/>
              <line x1="50%" y1="50%" x2="33%" y2="75%" stroke="#484848" strokeWidth="1" opacity="0.6"/>
              <line x1="50%" y1="50%" x2="67%" y2="75%" stroke="#484848" strokeWidth="1" opacity="0.6"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
