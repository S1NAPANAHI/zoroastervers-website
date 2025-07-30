'use client';

import React from 'react';

const WorldConnections: React.FC = () => {
  const connections = [
    {
      name: "Ethereal Crystals",
      type: "Magic System",
      connected: ["Aethermage Academy", "Crystal Caverns", "Mana Wells"],
      strength: "Strong"
    },
    {
      name: "The Great Library",
      type: "Location",
      connected: ["Scholar's Guild", "Ancient Texts", "Wisdom Keepers"],
      strength: "Moderate"
    },
    {
      name: "Dragon Riders",
      type: "Organization",
      connected: ["Sky Citadel", "Dragon Bonds", "Aerial Combat"],
      strength: "Strong"
    },
    {
      name: "Time Rifts",
      type: "Phenomenon",
      connected: ["Temporal Magic", "Lost Civilizations", "Chrono Knights"],
      strength: "Weak"
    }
  ];

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case 'Strong': return 'text-green-400 glow-green';
      case 'Moderate': return 'text-yellow-400 glow-yellow';
      case 'Weak': return 'text-red-400 glow-red';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="glass-dark rounded-lg p-6">
      <h3 className="text-xl font-bold text-[#dcddde] mb-4 flex items-center">
        <span className="mr-2">🌐</span>
        World Connections
      </h3>
      <div className="space-y-4">
        {connections.map((connection, index) => (
          <div
            key={index}
            className="glass-card p-4 rounded-lg hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300 group cursor-pointer"
          >
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-semibold text-[#dcddde] group-hover:text-purple-300 transition-colors">
                {connection.name}
              </h4>
              <span className={`text-xs px-2 py-1 rounded-full ${getStrengthColor(connection.strength)}`}>
                {connection.strength}
              </span>
            </div>
            <p className="text-xs text-purple-300 mb-2">{connection.type}</p>
            <div className="space-y-1">
              {connection.connected.map((item, idx) => (
                <div key={idx} className="flex items-center text-xs text-[#b3b3b3]">
                  <span className="w-1 h-1 bg-purple-400 rounded-full mr-2"></span>
                  {item}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <button className="neon-button w-full mt-4 py-2 px-4 rounded-lg font-medium text-sm">
        Explore All Connections
      </button>
    </div>
  );
};

export default WorldConnections;
