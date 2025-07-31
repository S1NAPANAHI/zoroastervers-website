'use client';

import React, { useState } from 'react';
import { useAuth } from '@/app/contexts/AuthContext';

interface RelatedBook {
  bookId: string;
  title: string;
  coverImage: string;
  price: number;
  purchaseUrl: string;
  relevanceDescription: string;
  chapterReferences?: string[];
}

interface TimelineEvent {
  id: string;
  title: string;
  date: string;
  year: number;
  shortDescription: string;
  fullDescription: string;
  category: 'magical' | 'political' | 'technological' | 'cultural' | 'catastrophic' | 'discovery' | 'war' | 'diplomacy' | 'prophecy' | 'mystery' | 'battle' | 'heroes' | 'climax' | 'resolution' | 'future';
  icon: string;
  relatedBooks: RelatedBook[];
  consequences: string[];
  spoilerLevel: 'none' | 'minimal' | 'moderate';
  color: string;
}

interface InteractiveTimelineEventProps {
  event: TimelineEvent;
  isExpanded: boolean;
  onToggle: () => void;
  position: 'left' | 'right';
}

const InteractiveTimelineEvent: React.FC<InteractiveTimelineEventProps> = ({
  event,
  isExpanded,
  onToggle,
  position
}) => {
  const { user, updateProgress } = useAuth();

  const handlePurchase = (book: RelatedBook) => {
    // Track user interaction for analytics
    if (user) {
      console.log(`User ${user.username} clicked purchase for ${book.title} from timeline event ${event.id}`);
      
      // Update user progress
      updateProgress({
        timelineExplored: Math.min((user.progress.timelineExplored || 0) + 5, 100)
      });
    }
    
    // For demo purposes, we'll show an alert. In production, this would redirect to your shop
    alert(`Redirecting to purchase ${book.title} for $${book.price}. This would normally open your book shop.`);
    
    // In production, uncomment this:
    // window.open(book.purchaseUrl, '_blank');
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      magical: 'from-purple-500 to-pink-500',
      political: 'from-red-500 to-orange-500',
      technological: 'from-blue-500 to-cyan-500',
      cultural: 'from-green-500 to-emerald-500',
      catastrophic: 'from-red-600 to-red-800',
      discovery: 'from-yellow-500 to-amber-500',
      war: 'from-red-700 to-rose-700',
      diplomacy: 'from-blue-600 to-indigo-600',
      prophecy: 'from-purple-600 to-violet-600',
      mystery: 'from-gray-700 to-slate-700',
      battle: 'from-orange-600 to-red-600',
      heroes: 'from-cyan-500 to-blue-500',
      climax: 'from-pink-600 to-purple-600',
      resolution: 'from-green-600 to-teal-600',
      future: 'from-indigo-500 to-purple-500'
    };
    return colors[category as keyof typeof colors] || 'from-gray-500 to-slate-500';
  };

  return (
    <div className={`relative flex items-start ${position === 'left' ? 'justify-start' : 'justify-end'} mb-16`}>
      {/* Timeline Dot */}
      <div 
        className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full border-4 border-white shadow-lg z-10 cursor-pointer hover:scale-110 transition-transform duration-300"
        style={{ backgroundColor: event.color }}
        onClick={onToggle}
      >
        <div 
          className="absolute inset-0 rounded-full animate-pulse opacity-50"
          style={{ backgroundColor: event.color }}
        />
      </div>

      {/* Event Card */}
      <div 
        className={`w-5/12 ${position === 'left' ? 'mr-auto' : 'ml-auto'} glass-dark rounded-2xl border border-white/20 backdrop-blur-xl shadow-2xl hover:shadow-3xl transition-all duration-300 overflow-hidden`}
        style={{ borderColor: `${event.color}40` }}
      >
        {/* Card Header */}
        <div className="p-6 cursor-pointer" onClick={onToggle}>
          <div className="flex items-start space-x-4">
            <div 
              className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-2xl shadow-lg"
              style={{ backgroundColor: `${event.color}20`, color: event.color }}
            >
              {event.icon}
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="text-xl font-bold text-white font-serif">{event.title}</h3>
                <span 
                  className={`px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getCategoryColor(event.category)} text-white`}
                >
                  {event.category}
                </span>
              </div>
              <p className="text-sm text-white/60 mb-3 font-serif-elegant">{event.date}</p>
              <p className="text-white/80 font-serif-body">{event.shortDescription}</p>
              
              {/* Expand/Collapse Indicator */}
              <div className="mt-4 flex items-center justify-between">
                <span className="text-cyan-400 text-sm font-medium">
                  {isExpanded ? 'Click to collapse' : 'Click to explore'}
                </span>
                <div 
                  className={`w-6 h-6 rounded-full bg-cyan-400/20 flex items-center justify-center text-cyan-400 transition-transform duration-300 ${
                    isExpanded ? 'rotate-180' : ''
                  }`}
                >
                  ↓
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Expandable Content */}
        <div 
          className={`transition-all duration-500 ease-in-out overflow-hidden ${
            isExpanded ? 'max-h-none opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          {isExpanded && (
            <div className="px-6 pb-6 border-t border-white/10">
              {/* Detailed Description */}
              <div className="mb-6 pt-6">
                <h4 className="text-lg font-bold text-cyan-400 mb-3 font-serif">
                  📖 Event Details
                </h4>
                <p className="text-white/80 leading-relaxed font-serif-body">
                  {event.fullDescription}
                </p>
              </div>

              {/* Consequences */}
              {event.consequences.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-lg font-bold text-purple-400 mb-3 font-serif">
                    ⚡ Consequences
                  </h4>
                  <ul className="space-y-2">
                    {event.consequences.map((consequence, index) => (
                      <li key={index} className="flex items-start space-x-2 text-white/70">
                        <span className="text-purple-400 mt-1">•</span>
                        <span className="font-serif-body">{consequence}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Related Books Section */}
              {event.relatedBooks.length > 0 && (
                <div className="border-t border-white/10 pt-6">
                  <h4 className="text-lg font-bold text-green-400 mb-4 font-serif">
                    📚 Explore This Event in Our Books
                  </h4>
                  <div className="space-y-4">
                    {event.relatedBooks.map((book) => (
                      <div 
                        key={book.bookId}
                        className="glass rounded-xl p-4 border border-white/10 hover:border-green-400/30 transition-all duration-300 group"
                      >
                        <div className="flex items-start space-x-4">
                          <div 
                            className="w-16 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center text-white font-bold text-xs shadow-lg"
                          >
                            📖
                          </div>
                          <div className="flex-1">
                            <h5 className="text-white font-bold mb-2 font-serif">
                              {book.title}
                            </h5>
                            <p className="text-white/70 text-sm mb-3 font-serif-body">
                              {book.relevanceDescription}
                            </p>
                            
                            {book.chapterReferences && (
                              <p className="text-cyan-400 text-xs mb-3">
                                Referenced in: {book.chapterReferences.join(', ')}
                              </p>
                            )}
                            
                            <div className="flex items-center justify-between">
                              <span className="text-green-400 font-bold text-lg">
                                ${book.price}
                              </span>
                              <button
                                onClick={() => handlePurchase(book)}
                                className="neon-button-green px-4 py-2 rounded-lg text-sm font-medium hover:scale-105 transition-transform duration-200"
                              >
                                🛒 Buy Now
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Call to Action */}
              <div className="mt-6 p-4 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-xl border border-cyan-400/20">
                <p className="text-cyan-300 text-sm text-center font-serif-elegant italic">
                  💡 Discover more events like this by exploring our complete timeline and book collection
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export { InteractiveTimelineEvent };
