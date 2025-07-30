'use client';

import React, { useState } from 'react';

interface TimelineEvent {
  id: string;
  title: string;
  date: string;
  description: string;
  category: 'political' | 'magical' | 'technological' | 'cultural' | 'catastrophic';
  consequences: string[];
  relatedEvents?: string[];
  position: 'top' | 'bottom';
}

const Timeline: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);
  const [hoveredEvent, setHoveredEvent] = useState<string | null>(null);

  const timelineEvents: TimelineEvent[] = [
    {
      id: 'dawn-age',
      title: 'The Dawn of Magic',
      date: 'Year 0 - The Beginning',
      description: 'The first recorded use of magic by the ancient Ethereal civilization. This marks the beginning of the magical era.',
      category: 'magical',
      consequences: [
        'Establishment of the first magical academies',
        'Division of society into magical and non-magical classes',
        'Discovery of ley lines across the continent'
      ],
      position: 'top'
    },
    {
      id: 'great-war',
      title: 'The Great Convergence War',
      date: 'Year 342-356',
      description: 'A devastating 14-year war between the magical kingdoms and the technologically advanced Republic of Iron.',
      category: 'political',
      consequences: [
        'Formation of the Treaty of Balanced Powers',
        'Establishment of neutral zones',
        'Birth of hybrid magic-technology'
      ],
      relatedEvents: ['dawn-age', 'tech-revolution'],
      position: 'bottom'
    },
    {
      id: 'tech-revolution',
      title: 'The Steam & Steel Revolution',
      date: 'Year 298-315',
      description: 'The rapid industrialization of the eastern kingdoms, leading to the development of steam-powered machinery and advanced metallurgy.',
      category: 'technological',
      consequences: [
        'Rise of the merchant class',
        'Environmental degradation in industrial zones',
        'Mass migration to industrial cities'
      ],
      position: 'top'
    },
    {
      id: 'crystal-catastrophe',
      title: 'The Crystal Catastrophe',
      date: 'Year 421',
      description: 'A magical experiment gone wrong that shattered the Great Crystal of Aethermoor, creating unstable magical zones.',
      category: 'catastrophic',
      consequences: [
        'Creation of the Shattered Lands',
        'Magical creatures mutation',
        'Discovery of chrono-magic'
      ],
      relatedEvents: ['dawn-age', 'great-war'],
      position: 'bottom'
    },
    {
      id: 'cultural-renaissance',
      title: 'The Age of Wonder',
      date: 'Year 445-Present',
      description: 'A period of cultural flourishing where art, literature, and philosophy merged magic and technology.',
      category: 'cultural',
      consequences: [
        'Establishment of the Grand Libraries',
        'Cross-cultural magical exchanges',
        'Development of artistic magic'
      ],
      relatedEvents: ['crystal-catastrophe'],
      position: 'top'
    }
  ];

  const getCategoryColor = (category: string) => {
    const colors = {
      political: 'from-red-500 to-pink-500',
      magical: 'from-purple-500 to-indigo-500',
      technological: 'from-blue-500 to-cyan-500',
      cultural: 'from-green-500 to-emerald-500',
      catastrophic: 'from-orange-500 to-red-600'
    };
    return colors[category as keyof typeof colors] || 'from-gray-500 to-gray-600';
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      political: '⚔️',
      magical: '✨',
      technological: '⚙️',
      cultural: '🎭',
      catastrophic: '💥'
    };
    return icons[category as keyof typeof icons] || '📅';
  };

  return (
    <div className="timeline-container relative w-full min-h-screen p-8">
      {/* Timeline Ribbon */}
      <div className="relative">
        {/* Main Timeline Line */}
        <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-cyan-500 via-purple-500 to-pink-500 opacity-60 shadow-lg shadow-cyan-500/30"></div>
        
        {/* Timeline Events */}
        <div className="relative z-10">
          {timelineEvents.map((event, index) => (
            <div
              key={event.id}
              className={`relative mb-16 ${
                event.position === 'top' ? 'flex-row' : 'flex-row-reverse'
              } flex items-center justify-center`}
            >
              {/* Event Card */}
              <div
                className={`group relative w-80 mx-8 ${
                  event.position === 'top' ? 'mr-auto ml-16' : 'ml-auto mr-16'
                }`}
                onMouseEnter={() => setHoveredEvent(event.id)}
                onMouseLeave={() => setHoveredEvent(null)}
              >
                {/* Connection Line */}
                <div
                  className={`absolute top-1/2 w-16 h-0.5 bg-gradient-to-r ${getCategoryColor(event.category)} opacity-60 ${
                    event.position === 'top' ? '-right-16' : '-left-16'
                  }`}
                ></div>

                {/* Event Card */}
                <div
                  className={`glass-dark p-6 rounded-xl border border-white/20 cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-${event.category === 'magical' ? 'purple' : event.category === 'technological' ? 'cyan' : event.category === 'political' ? 'red' : event.category === 'cultural' ? 'green' : 'orange'}-500/30 ${
                    hoveredEvent === event.id ? 'shadow-2xl shadow-purple-500/40' : ''
                  }`}
                  onClick={() => setSelectedEvent(event)}
                >
                  {/* Category Icon */}
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br ${getCategoryColor(event.category)} text-2xl mb-4 shadow-lg`}>
                    {getCategoryIcon(event.category)}
                  </div>

                  {/* Event Title */}
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:to-purple-400">
                    {event.title}
                  </h3>

                  {/* Event Date */}
                  <p className="text-cyan-300 text-sm font-semibold mb-3">
                    {event.date}
                  </p>

                  {/* Event Description */}
                  <p className="text-gray-300 text-sm leading-relaxed line-clamp-3">
                    {event.description}
                  </p>

                  {/* Consequences Preview */}
                  <div className="mt-4">
                    <p className="text-purple-300 text-xs font-semibold mb-1">
                      Key Consequences:
                    </p>
                    <p className="text-gray-400 text-xs line-clamp-2">
                      {event.consequences[0]}...
                    </p>
                  </div>
                </div>

                {/* Timeline Node */}
                <div
                  className={`absolute top-1/2 transform -translate-y-1/2 w-6 h-6 rounded-full bg-gradient-to-br ${getCategoryColor(event.category)} border-4 border-gray-900 shadow-lg ${
                    event.position === 'top' ? '-right-3' : '-left-3'
                  } ${hoveredEvent === event.id ? 'scale-125 shadow-2xl' : ''} transition-all duration-300`}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-dark max-w-2xl w-full p-8 rounded-2xl border border-white/30 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${getCategoryColor(selectedEvent.category)} flex items-center justify-center text-3xl shadow-lg`}>
                  {getCategoryIcon(selectedEvent.category)}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">
                    {selectedEvent.title}
                  </h2>
                  <p className="text-cyan-300 font-semibold">
                    {selectedEvent.date}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedEvent(null)}
                className="neon-button-red text-white hover:text-red-300 text-2xl font-bold w-10 h-10 rounded-full flex items-center justify-center"
              >
                ×
              </button>
            </div>

            {/* Event Description */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-purple-300 mb-3">
                Event Description
              </h3>
              <p className="text-gray-300 leading-relaxed">
                {selectedEvent.description}
              </p>
            </div>

            {/* Consequences */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-cyan-300 mb-3">
                Key Consequences
              </h3>
              <ul className="space-y-2">
                {selectedEvent.consequences.map((consequence, index) => (
                  <li key={index} className="flex items-start gap-2 text-gray-300">
                    <span className="text-purple-400 mt-1">•</span>
                    {consequence}
                  </li>
                ))}
              </ul>
            </div>

            {/* Related Events */}
            {selectedEvent.relatedEvents && selectedEvent.relatedEvents.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-green-300 mb-3">
                  Related Events
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedEvent.relatedEvents.map((relatedId) => {
                    const relatedEvent = timelineEvents.find(e => e.id === relatedId);
                    return relatedEvent ? (
                      <button
                        key={relatedId}
                        onClick={() => setSelectedEvent(relatedEvent)}
                        className="neon-button-purple text-sm px-3 py-1 rounded-full"
                      >
                        {relatedEvent.title}
                      </button>
                    ) : null;
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Timeline Legend */}
      <div className="fixed bottom-8 right-8 glass-dark p-4 rounded-xl border border-white/20">
        <h4 className="text-white font-semibold mb-3">Timeline Categories</h4>
        <div className="space-y-2">
          {Object.entries({
            political: '⚔️ Political',
            magical: '✨ Magical',
            technological: '⚙️ Technological',
            cultural: '🎭 Cultural',
            catastrophic: '💥 Catastrophic'
          }).map(([key, label]) => (
            <div key={key} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full bg-gradient-to-br ${getCategoryColor(key)}`}></div>
              <span className="text-gray-300 text-sm">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Timeline;
