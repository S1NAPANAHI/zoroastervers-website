'use client';

import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Link from 'next/link';

const SeriesOverviewPage: React.FC = () => {
  const [spoilerLevel, setSpoilerLevel] = useState<'none' | 'minimal' | 'moderate'>('none');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const { user, isAuthenticated } = useAuth();

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const SectionCard: React.FC<{
    id: string;
    title: string;
    icon: string;
    preview: string;
    children: React.ReactNode;
  }> = ({ id, title, icon, preview, children }) => {
    const isExpanded = expandedSections.has(id);
    
    return (
      <div className="glass-dark rounded-2xl border border-white/20 overflow-hidden">
        <button
          onClick={() => toggleSection(id)}
          className="w-full p-6 text-left hover:bg-white/5 transition-colors flex items-center justify-between"
        >
          <div className="flex items-center space-x-4">
            <span className="text-3xl">{icon}</span>
            <div>
              <h3 className="text-xl font-bold text-white">{title}</h3>
              <p className="text-slate-300 text-sm">{preview}</p>
            </div>
          </div>
          <div className="text-cyan-400 text-2xl">
            {isExpanded ? '−' : '+'}
          </div>
        </button>
        
        {isExpanded && (
          <div className="px-6 pb-6 border-t border-white/10">
            {children}
          </div>
        )}
      </div>
    );
  };

  const SpoilerBadge: React.FC<{ level: 'none' | 'minimal' | 'moderate' }> = ({ level }) => {
    const badges = {
      none: { color: 'bg-green-500/20 text-green-300', text: 'Spoiler-Free' },
      minimal: { color: 'bg-yellow-500/20 text-yellow-300', text: 'Minor Details' },
      moderate: { color: 'bg-orange-500/20 text-orange-300', text: 'Some Context' }
    };
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${badges[level].color}`}>
        {badges[level].text}
      </span>
    );
  };

  return (
    <div className="min-h-screen">
      {/* Floating particles for enhanced cosmic effect */}
      <div className="fixed inset-0 opacity-30 pointer-events-none">
        <div className="absolute inset-0">
          <div className="absolute w-96 h-96 rounded-full bg-purple-500/20 blur-3xl animate-pulse -top-20 -left-20"></div>
          <div className="absolute w-64 h-64 rounded-full bg-cyan-500/20 blur-3xl animate-pulse top-1/3 -right-10"></div>
          <div className="absolute w-80 h-80 rounded-full bg-pink-500/20 blur-3xl animate-pulse -bottom-20 left-1/2"></div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="mb-6">
            <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 mb-4">
              Series Overview
            </h1>
            <div className="text-2xl text-slate-300 font-light mb-6">
              A Complete Guide to the Universe
            </div>
            <p className="text-lg text-slate-400 max-w-3xl mx-auto leading-relaxed">
              Welcome to a sprawling universe where magic and technology collide, ancient powers awaken, 
              and the fate of multiple worlds hangs in the balance. Explore this comprehensive guide to 
              understand the foundations of our story without encountering spoilers.
            </p>
          </div>

          {/* Spoiler Control */}
          <div className="glass-dark p-6 rounded-2xl border border-white/20 max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center justify-center">
              <span className="mr-2">🛡️</span>
              Spoiler Protection Level
            </h3>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { level: 'none' as const, label: 'Complete Safety', desc: 'No plot details' },
                { level: 'minimal' as const, label: 'Light Context', desc: 'Basic background only' },
                { level: 'moderate' as const, label: 'Rich Details', desc: 'World depth without outcomes' }
              ].map(({ level, label, desc }) => (
                <button
                  key={level}
                  onClick={() => setSpoilerLevel(level)}
                  className={`p-3 rounded-lg border transition-all ${
                    spoilerLevel === level
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                      : 'bg-white/5 border-white/20 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  <div className="font-medium">{label}</div>
                  <div className="text-xs opacity-75">{desc}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {[
            { icon: '📚', label: 'Books', value: '5 Planned', detail: '3 Published' },
            { icon: '🌍', label: 'Worlds', value: '7 Realms', detail: 'Interconnected' },
            { icon: '⏳', label: 'Timeline', value: '3,000 Years', detail: 'Of recorded history' },
            { icon: '✨', label: 'Magic System', value: 'Crystal-Based', detail: 'Technology hybrid' }
          ].map(({ icon, label, value, detail }) => (
            <div key={label} className="glass-dark p-6 rounded-2xl border border-white/20 text-center">
              <div className="text-3xl mb-2">{icon}</div>
              <div className="text-cyan-400 font-bold text-lg">{value}</div>
              <div className="text-slate-300 text-sm">{label}</div>
              <div className="text-slate-400 text-xs mt-1">{detail}</div>
            </div>
          ))}
        </div>

        {/* Content Sections */}
        <div className="space-y-6">
          <SectionCard
            id="series-structure"
            title="Series Structure"
            icon="📖"
            preview="Five interconnected novels spanning millennia of history"
          >
            <div className="space-y-4 mt-4">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-cyan-400 font-semibold">Reading Order</h4>
                <SpoilerBadge level="none" />
              </div>
              
              <div className="grid gap-4">
                {[
                  { 
                    title: 'Book 1: The Awakening', 
                    status: 'Published', 
                    era: 'The Dawn Age',
                    description: 'The discovery that changes everything begins here.' 
                  },
                  { 
                    title: 'Book 2: Shattered Realms', 
                    status: 'Published', 
                    era: 'The Great Fracture',
                    description: 'When worlds collide, heroes must choose sides.' 
                  },
                  { 
                    title: 'Book 3: Convergence', 
                    status: 'Published', 
                    era: 'The Time of Choices',
                    description: 'Ancient powers return as new alliances form.' 
                  },
                  { 
                    title: 'Book 4: The Crystal War', 
                    status: 'In Progress', 
                    era: 'The Final Conflict',
                    description: 'The ultimate confrontation approaches.' 
                  },
                  { 
                    title: 'Book 5: Infinite Paths', 
                    status: 'Planned', 
                    era: 'The New Dawn',
                    description: 'Every ending is a new beginning.' 
                  }
                ].map((book, index) => (
                  <div key={index} className="bg-black/20 p-4 rounded-lg border border-white/10">
                    <div className="flex justify-between items-start mb-2">
                      <h5 className="text-white font-medium">{book.title}</h5>
                      <span className={`px-2 py-1 rounded text-xs ${
                        book.status === 'Published' ? 'bg-green-500/20 text-green-300' :
                        book.status === 'In Progress' ? 'bg-yellow-500/20 text-yellow-300' :
                        'bg-blue-500/20 text-blue-300'
                      }`}>
                        {book.status}
                      </span>
                    </div>
                    <div className="text-slate-400 text-sm mb-2">{book.era}</div>
                    <p className="text-slate-300 text-sm">{book.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </SectionCard>

          <SectionCard
            id="world-primer"
            title="World Foundation"
            icon="🌌"
            preview="Seven interconnected realms bound by crystal technology"
          >
            <div className="space-y-4 mt-4">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-cyan-400 font-semibold">The Seven Realms</h4>
                <SpoilerBadge level={spoilerLevel} />
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  {
                    name: 'Aethros Prime',
                    type: 'Origin World',
                    description: 'Where crystal technology first emerged, blending magic and science.',
                    climate: 'Varied - from crystal deserts to floating cities'
                  },
                  {
                    name: 'The Shattered Lands',
                    type: 'Fractured Realm',
                    description: 'A world broken by ancient conflicts, now islands in the void.',
                    climate: 'Harsh, with reality storms between fragments'
                  },
                  {
                    name: 'Verdant Spiral',
                    type: 'Living World',
                    description: 'A realm where nature and crystal energy create symbiotic life.',
                    climate: 'Lush forests with crystalline growths'
                  },
                  {
                    name: 'The Shadow Expanse',
                    type: 'Hidden Realm',
                    description: 'A mysterious dimension accessible only through crystal gates.',
                    climate: 'Perpetual twilight with shifting landscapes'
                  }
                ].map((realm, index) => (
                  <div key={index} className="bg-black/20 p-4 rounded-lg border border-white/10">
                    <div className="flex justify-between items-start mb-2">
                      <h5 className="text-white font-medium">{realm.name}</h5>
                      <span className="px-2 py-1 rounded text-xs bg-purple-500/20 text-purple-300">
                        {realm.type}
                      </span>
                    </div>
                    <p className="text-slate-300 text-sm mb-2">{realm.description}</p>
                    <div className="text-slate-400 text-xs">
                      <strong>Climate:</strong> {realm.climate}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </SectionCard>

          <SectionCard
            id="magic-system"
            title="Crystal Technology"
            icon="💎"
            preview="The fusion of magic and science that powers this universe"
          >
            <div className="space-y-4 mt-4">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-cyan-400 font-semibold">Core Principles</h4>
                <SpoilerBadge level="minimal" />
              </div>
              
              <div className="space-y-4">
                <div className="bg-black/20 p-4 rounded-lg border border-white/10">
                  <h5 className="text-white font-medium mb-2">🔮 Crystal Resonance</h5>
                  <p className="text-slate-300 text-sm">
                    Crystals naturally occurring throughout the realms can store, amplify, and redirect 
                    various forms of energy. Each type resonates with different forces.
                  </p>
                </div>
                
                <div className="bg-black/20 p-4 rounded-lg border border-white/10">
                  <h5 className="text-white font-medium mb-2">⚡ Energy Channeling</h5>
                  <p className="text-slate-300 text-sm">
                    Skilled practitioners can channel personal energy through crystals to achieve 
                    effects that blur the line between technology and magic.
                  </p>
                </div>
                
                <div className="bg-black/20 p-4 rounded-lg border border-white/10">
                  <h5 className="text-white font-medium mb-2">🌐 Network Connectivity</h5>
                  <p className="text-slate-300 text-sm">
                    Larger crystal formations create networks that enable communication and travel 
                    between distant locations and even different realms.
                  </p>
                </div>
              </div>
            </div>
          </SectionCard>

          <SectionCard
            id="key-conflicts"
            title="Central Themes"
            icon="⚔️"
            preview="The philosophical and physical conflicts that drive the narrative"
          >
            <div className="space-y-4 mt-4">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-cyan-400 font-semibold">Core Questions</h4>
                <SpoilerBadge level="none" />
              </div>
              
              <div className="space-y-3">
                {[
                  {
                    theme: 'Power & Responsibility',
                    question: 'What happens when individuals gain the ability to reshape reality itself?'
                  },
                  {
                    theme: 'Identity & Change',
                    question: 'Can someone remain true to themselves while adapting to cosmic-scale challenges?'
                  },
                  {
                    theme: 'Unity & Division',
                    question: 'Is it possible to bridge differences between vastly different worlds and cultures?'
                  },
                  {
                    theme: 'Progress & Tradition',
                    question: 'Should ancient wisdom be preserved or must it give way to new understanding?'
                  },
                  {
                    theme: 'Sacrifice & Hope',
                    question: 'What price is worth paying to protect those you love and the future itself?'
                  }
                ].map((theme, index) => (
                  <div key={index} className="bg-black/20 p-4 rounded-lg border border-white/10">
                    <h5 className="text-cyan-300 font-medium mb-2">{theme.theme}</h5>
                    <p className="text-slate-300 text-sm italic">"{theme.question}"</p>
                  </div>
                ))}
              </div>
            </div>
          </SectionCard>

          <SectionCard
            id="getting-started"
            title="Begin Your Journey"
            icon="🚀"
            preview="Everything you need to dive into this universe"
          >
            <div className="space-y-6 mt-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-cyan-400 font-semibold">New Reader Recommendations</h4>
                  <div className="space-y-3">
                    <Link href="/books" className="block bg-black/20 p-4 rounded-lg border border-white/10 hover:border-cyan-400/30 transition-colors">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">📚</span>
                        <div>
                          <div className="text-white font-medium">Start with Book 1</div>
                          <div className="text-slate-400 text-sm">Begin at the beginning with The Awakening</div>
                        </div>
                      </div>
                    </Link>
                    
                    <Link href="/timeline" className="block bg-black/20 p-4 rounded-lg border border-white/10 hover:border-cyan-400/30 transition-colors">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">⏰</span>
                        <div>
                          <div className="text-white font-medium">Explore the Timeline</div>
                          <div className="text-slate-400 text-sm">Understand the historical context</div>
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="text-cyan-400 font-semibold">Join the Community</h4>
                  <div className="space-y-3">
                    {isAuthenticated ? (
                      <Link href="/profile" className="block bg-black/20 p-4 rounded-lg border border-white/10 hover:border-cyan-400/30 transition-colors">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">👤</span>
                          <div>
                            <div className="text-white font-medium">Your Profile</div>
                            <div className="text-slate-400 text-sm">Track progress and achievements</div>
                          </div>
                        </div>
                      </Link>
                    ) : (
                      <Link href="/signup" className="block bg-black/20 p-4 rounded-lg border border-white/10 hover:border-cyan-400/30 transition-colors">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">✨</span>
                          <div>
                            <div className="text-white font-medium">Join the Universe</div>
                            <div className="text-slate-400 text-sm">Create your profile and track your journey</div>
                          </div>
                        </div>
                      </Link>
                    )}
                    
                    <div className="bg-black/20 p-4 rounded-lg border border-white/10">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">💬</span>
                        <div>
                          <div className="text-white font-medium">Discussion Forums</div>
                          <div className="text-slate-400 text-sm">Coming soon - connect with other readers</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SectionCard>
        </div>

        {/* Footer CTA */}
        <div className="mt-12 text-center">
          <div className="glass-dark p-8 rounded-2xl border border-white/20">
            <h3 className="text-2xl font-bold text-white mb-4">Ready to Begin?</h3>
            <p className="text-slate-300 mb-6">
              You now have the foundation to explore this universe safely. Every page you visit 
              will remember your spoiler preferences, ensuring your reading experience remains unspoiled.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/books" className="neon-button-cyan px-6 py-3 rounded-lg font-semibold">
                Explore Books
              </Link>
              <Link href="/timeline" className="neon-button-purple px-6 py-3 rounded-lg font-semibold">
                View Timeline
              </Link>
              {!isAuthenticated && (
                <Link href="/signup" className="neon-button-pink px-6 py-3 rounded-lg font-semibold">
                  Join Community
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeriesOverviewPage;
