'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/app/contexts/AuthContext';
import { InteractiveTimelineEvent } from '../InteractiveTimelineEvent';

interface TimelineEvent {
  id: string;
  title: string;
  date: string;
  year: number;
  bookId: string;
  description: string;
  category: string;
  icon: string;
}

interface Book {
  id: string;
  title: string;
  shortTitle: string;
  color: string;
  gradientFrom: string;
  gradientTo: string;
  startYear: number;
  endYear: number;
  events: TimelineEvent[];
}

const EnhancedTimeline: React.FC = () => {
  const [activeBook, setActiveBook] = useState('');
  const [currentYear, setCurrentYear] = useState(1000);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [backgroundGradient, setBackgroundGradient] = useState('');
  const [expandedEventId, setExpandedEventId] = useState<string | null>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const { user, updateProgress } = useAuth();

  const handleEventToggle = (eventId: string) => {
    setExpandedEventId(expandedEventId === eventId ? null : eventId);
  };

  // Helper function to get full description for events
  const getFullDescription = (eventId: string, shortDescription: string) => {
    const descriptions = {
      'dawn-age': 'In the early morning hours of the summer solstice, witnesses across multiple realms reported seeing streams of ethereal light emanating from ancient temples and sacred sites. This phenomenon, later known as the Dawn of Magic, marked the beginning of what historians call the First Age of Wonder. The event fundamentally altered the fabric of reality, introducing magical energies that would reshape civilization, politics, and the very nature of existence across all known worlds.',
      'first-crystal': 'Deep within the treacherous Crystal Caverns of Mount Aethros, a team of brave explorers led by the legendary Crystalseeker Varin made a discovery that would change the course of history. The Prime Crystal, a massive gem pulsing with otherworldly energy, was found embedded in the heart of the mountain. This discovery revealed that crystals were not mere minerals, but conduits for magical power, leading to the development of crystal-based technology that would define the next thousand years.',
      'crystal-cities': 'The first fully crystal-powered settlements began appearing across the realms, with gleaming spires that hummed with magical energy. These cities represented a new age of prosperity and wonder, where crystal technology provided light, heat, transportation, and communication. The largest of these, New Aethros, became a beacon of hope and progress, attracting scholars, inventors, and dreamers from across all known worlds.',
      'great-fracture': 'On a day that would forever be remembered as the Day of Shattering, reality itself seemed to tear apart at its seams. Massive rifts opened across multiple realms simultaneously, creating unstable zones where the laws of physics bent and twisted. The Shattered Lands that resulted became dangerous territories where time and space behaved unpredictably, forever changing the geography and accessibility of the world.',
      'realm-wars': 'As crystal resources became scarce due to the instability caused by the Great Fracture, desperate realms began competing violently for control of remaining crystal deposits. These conflicts, collectively known as the Realm Wars, marked the end of the peaceful cooperation that had characterized the early Crystal Age. Alliances shattered, trade routes were militarized, and the once-unified world became a collection of suspicious, warring territories.',
      'lost-alliance': 'Recognizing that continued warfare would lead to the total collapse of civilization, representatives from the major surviving realms met in secret to forge a desperate pact. The Lost Alliance, so named because its existence was hidden from the general population to prevent sabotage, coordinated efforts to stabilize the Shattered Lands and share critical resources. Though fragile and secretive, this alliance prevented complete societal collapse.',
      'convergence-prophecy': 'Scholars studying ancient texts discovered references to a prophetic event called the Convergence, where all separated realms would be reunited under specific cosmic conditions. The prophecy spoke of signs and portents that would herald this reunification, including the appearance of bridge-crystals that could stabilize the rifts between worlds. This discovery reignited hope that the fragmented world could someday be made whole again.',
      'crystal-network': 'Building upon the principles discovered through study of the Convergence Prophecy, brilliant engineers and mages worked together to create an interconnected network of communication crystals spanning all accessible realms. This network, known as the Great Crystal Web, allowed for instantaneous communication across vast distances and unstable dimensional barriers, effectively reuniting the intellectual and cultural life of the separated worlds.',
      'shadow-emergence': 'From the deepest rifts created during the Great Fracture, something unexpected began to emerge: an entirely new realm that seemed to exist in the spaces between other worlds. The Shadow Expanse, as explorers named it, operated according to different rules than the established realms, and its inhabitants possessed abilities and knowledge that both fascinated and terrified those who encountered them.',
      'war-declaration': 'After centuries of mysterious expansion, the Shadow Expanse formally declared its intention to absorb all other realms into its dark domain. This declaration, delivered simultaneously through every crystal in the Great Network, announced that the Shadow Expanse viewed the other realms as incomplete fragments that needed to be "unified" under shadow rule. The message sent shockwaves through every corner of the known worlds.',
      'siege-prime': 'The Shadow Expanse launched a coordinated assault on Aethros Prime, the origin world and spiritual heart of crystal civilization. The siege lasted for months, with shadow forces using previously unknown techniques to corrupt and turn crystal technology against its creators. The very foundations of crystal society were threatened as their most sacred sites fell under shadow influence.',
      'heroes-rise': 'In response to the existential threat posed by the Shadow Expanse, a new generation of crystal-wielders emerged with abilities that surpassed anything seen before. These Crystal Heroes, as they came to be known, could purify corrupted crystals, heal rifts in reality, and channel power directly from the Prime Crystal itself. Their emergence marked a turning point in the war against the shadows.',
      'final-battle': 'The climactic confrontation between all remaining free realms and the Shadow Expanse took place across multiple dimensional planes simultaneously. This Final Convergence, as prophesied in ancient texts, saw crystal-wielders from every realm combining their powers in an unprecedented display of unity and determination. The battle would determine whether the worlds would fall to shadow or find a new path forward.',
      'new-dawn': 'Following the Final Convergence, a new age began as the barriers between realms finally fell away completely, not through destruction but through voluntary unity. The worlds merged into a single, vast reality where former enemies became neighbors and the knowledge of all realms became available to everyone. This New Dawn marked the beginning of an era of unprecedented peace and prosperity.',
      'infinite-possibilities': 'With all realms unified and crystal technology reaching its full potential, the future became truly limitless. New frontiers opened up as explorers could now travel not just between the former realms, but to entirely new dimensions and realities. The Infinite Age had begun, where every dream could potentially become reality through the harmonious combination of crystal power, unified knowledge, and boundless imagination.'
    };
    
    return descriptions[eventId as keyof typeof descriptions] || shortDescription + ' This pivotal moment in history shaped the future of all realms and continues to influence events to this day.';
  };

  // Helper function to get related books for purchase
  const getRelatedBooks = (bookId: string, bookTitle: string) => {
    const bookData = {
      'book1': {
        title: 'Book 1: The Awakening',
        price: 14.99,
        relevanceDescription: 'Discover the origins of crystal magic and witness the dawn of a new age. This book chronicles the first stirrings of power that will shape the destiny of all realms.'
      },
      'book2': {
        title: 'Book 2: Shattered Realms', 
        price: 15.99,
        relevanceDescription: 'Experience the chaos and conflict that followed the Great Fracture. Follow heroes as they navigate a world torn apart and fight for survival.'
      },
      'book3': {
        title: 'Book 3: Convergence',
        price: 16.99,
        relevanceDescription: 'Uncover ancient prophecies and witness the first steps toward reunification. Hope emerges from darkness as the realms begin to reconnect.'
      },
      'book4': {
        title: 'Book 4: The Crystal War',
        price: 17.99,
        relevanceDescription: 'Join the epic struggle against the Shadow Expanse. Witness the rise of heroes and the ultimate test of crystal civilization.'
      },
      'book5': {
        title: 'Book 5: Infinite Paths',
        price: 18.99,
        relevanceDescription: 'Explore the dawn of the Infinite Age and discover what lies beyond the convergence. The conclusion to an epic saga spanning millennia.'
      }
    };

    const book = bookData[bookId as keyof typeof bookData];
    if (!book) return [];

    return [{
      bookId: bookId,
      title: book.title,
      coverImage: `/covers/${bookId}.jpg`,
      price: book.price,
      purchaseUrl: `/shop/${bookId}`,
      relevanceDescription: book.relevanceDescription,
      chapterReferences: getChapterReferences(bookId)
    }];
  };

  // Helper function to get chapter references
  const getChapterReferences = (bookId: string) => {
    const chapters = {
      'book1': ['Chapter 1: First Light', 'Chapter 5: The Discovery', 'Chapter 12: Rising Cities'],
      'book2': ['Chapter 3: The Shattering', 'Chapter 8: War Begins', 'Chapter 15: Secret Alliance'],
      'book3': ['Chapter 2: Ancient Prophecy', 'Chapter 9: The Great Network', 'Chapter 18: Shadow Emergence'],
      'book4': ['Chapter 4: Declaration of War', 'Chapter 11: Siege of Prime', 'Chapter 20: Heroes Ascend'],
      'book5': ['Chapter 7: Final Battle', 'Chapter 14: New Beginning', 'Chapter 21: Infinite Dawn']
    };
    
    return chapters[bookId as keyof typeof chapters] || [];
  };

  // Helper function to get consequences for events
  const getConsequences = (eventId: string) => {
    const consequences = {
      'dawn-age': [
        'Traditional forms of government became obsolete as magical abilities created new power structures',
        'Trade and commerce transformed completely as crystal-powered transportation revolutionized logistics',
        'Scientific understanding expanded exponentially as magic provided new ways to study reality'
      ],
      'first-crystal': [
        'Crystal mining became the most important industry across all realms',
        'New academic disciplines emerged to study crystal properties and applications',
        'Social hierarchies shifted as crystal-wielding abilities became highly valued'
      ],
      'crystal-cities': [
        'Rural populations migrated en masse to crystal-powered urban centers',
        'Traditional crafts and professions were replaced by crystal-based technologies',
        'Environmental impact increased as crystal harvesting intensified'
      ],
      'great-fracture': [
        'Millions of people were displaced as stable lands became hazardous Shattered Zones',
        'International trade and communication were severely disrupted',
        'Emergency governance structures had to be established to manage the crisis'
      ],
      'realm-wars': [
        'Technological advancement accelerated as military needs drove innovation',
        'Civilian populations suffered as resources were diverted to warfare',
        'Cultural exchange ceased as realms became isolated and suspicious'
      ],
      'lost-alliance': [
        'Underground networks developed to circumvent official hostilities',
        'Scientific and magical knowledge began to be secretly shared again',
        'Hope for eventual reunification was quietly maintained among leaders'
      ],
      'convergence-prophecy': [
        'Massive scholarly expeditions were launched to find more prophetic texts',
        'Public sentiment shifted from despair to cautious optimism',
        'Religious and spiritual movements gained significant influence'
      ],
      'crystal-network': [
        'Cultural renaissance began as ideas could flow freely between realms again',
        'Economic cooperation slowly resumed as secure communication was reestablished',
        'Coordinated defense strategies became possible against external threats'
      ],
      'shadow-emergence': [
        'Exploration and research priorities shifted dramatically toward understanding this new realm',
        'Existing magical theories had to be revised to account for shadow phenomena',
        'Military preparations intensified as the potential threat became apparent'
      ],
      'war-declaration': [
        'All realms were forced to cease internal conflicts and unite against the common threat',
        'Crystal technology was rapidly militarized and weaponized',
        'Civilian populations were evacuated from vulnerable border regions'
      ],
      'siege-prime': [
        'Sacred crystal sites were either destroyed or had to be abandoned',
        'Refugee crises developed as people fled from corrupted areas',
        'Traditional crystal magic became unreliable in shadow-influenced zones'
      ],
      'heroes-rise': [
        'Training institutions were established to develop crystal-wielding abilities',
        'Social structures adapted to support and honor the Crystal Heroes',
        'New tactical approaches were developed that incorporated heroic abilities'
      ],
      'final-battle': [
        'The dimensional barriers between realms were permanently altered',
        'Both shadow and crystal magics were fundamentally changed by the conflict',
        'Survivors gained new understanding of the deeper nature of reality'
      ],
      'new-dawn': [
        'Governmental systems had to be completely restructured for a unified world',
        'Economic systems were revolutionized as all resources became accessible',
        'Cultural exchange exploded as former barriers disappeared'
      ],
      'infinite-possibilities': [
        'Exploration shifted from between realms to entirely new dimensions',
        'Educational systems expanded to prepare people for unlimited possibilities',
        'Philosophical and ethical frameworks evolved to handle infinite potential'
      ]
    };
    
    return consequences[eventId as keyof typeof consequences] || [
      'This event reshaped the political landscape of all affected realms',
      'Long-term cultural and social changes emerged from this pivotal moment',
      'The balance of power shifted significantly following these developments'
    ];
  };

  // Book data with enhanced properties for gradients and navigation
  const books: Book[] = [
    {
      id: 'book1',
      title: 'Book 1: The Awakening',
      shortTitle: 'The Awakening',
      color: '#FF6B6B',
      gradientFrom: '#FF6B6B',
      gradientTo: '#4ECDC4',
      startYear: 500,
      endYear: 800,
      events: [
        {
          id: 'dawn-age',
          title: 'The Dawn Age Begins',
          date: '500 CE',
          year: 500,
          bookId: 'book1',
          description: 'The first stirrings of crystal magic awaken across the realms.',
          category: 'magical-awakening',
          icon: '🌅'
        },
        {
          id: 'first-crystal',
          title: 'Discovery of the First Crystal',
          date: '650 CE',
          year: 650,
          bookId: 'book1',
          description: 'Explorers uncover the legendary Prime Crystal deep within the Crystal Caverns.',
          category: 'discovery',
          icon: '💎'
        },
        {
          id: 'crystal-cities',
          title: 'Rise of Crystal Cities',
          date: '750 CE',
          year: 750,
          bookId: 'book1',
          description: 'The first settlements powered entirely by crystal technology emerge.',
          category: 'civilization',
          icon: '🏛️'
        }
      ]
    },
    {
      id: 'book2',
      title: 'Book 2: Shattered Realms',
      shortTitle: 'Shattered Realms',
      color: '#4ECDC4',
      gradientFrom: '#4ECDC4',
      gradientTo: '#45B7D1',
      startYear: 800,
      endYear: 1200,
      events: [
        {
          id: 'great-fracture',
          title: 'The Great Fracture',
          date: '850 CE',
          year: 850,
          bookId: 'book2',
          description: 'Reality itself tears apart, creating the Shattered Lands.',
          category: 'catastrophe',
          icon: '⚡'
        },
        {
          id: 'realm-wars',
          title: 'The Realm Wars Begin',
          date: '1000 CE',
          year: 1000,
          bookId: 'book2',
          description: 'Conflicts erupt between the surviving realms for crystal resources.',
          category: 'war',
          icon: '⚔️'
        },
        {
          id: 'lost-alliance',
          title: 'The Lost Alliance',
          date: '1150 CE',
          year: 1150,
          bookId: 'book2',
          description: 'A desperate alliance forms to prevent total realm collapse.',
          category: 'diplomacy',
          icon: '🤝'
        }
      ]
    },
    {
      id: 'book3',
      title: 'Book 3: Convergence',
      shortTitle: 'Convergence',
      color: '#45B7D1',
      gradientFrom: '#45B7D1',
      gradientTo: '#96CEB4',
      startYear: 1200,
      endYear: 1600,
      events: [
        {
          id: 'convergence-prophecy',
          title: 'The Convergence Prophecy',
          date: '1250 CE',
          year: 1250,
          bookId: 'book3',
          description: 'Ancient texts reveal a prophecy about the realms converging.',
          category: 'prophecy',
          icon: '📜'
        },
        {
          id: 'crystal-network',
          title: 'The Great Crystal Network',
          date: '1400 CE',
          year: 1400,
          bookId: 'book3',
          description: 'All realms become connected through a vast crystal communication network.',
          category: 'technology',
          icon: '🌐'
        },
        {
          id: 'shadow-emergence',
          title: 'Emergence of the Shadow Expanse',
          date: '1550 CE',
          year: 1550,
          bookId: 'book3',
          description: 'A mysterious new realm emerges from the void between worlds.',
          category: 'mystery',
          icon: '🌑'
        }
      ]
    },
    {
      id: 'book4',
      title: 'Book 4: The Crystal War',
      shortTitle: 'Crystal War',
      color: '#96CEB4',
      gradientFrom: '#96CEB4',
      gradientTo: '#FFEAA7',
      startYear: 1600,
      endYear: 1900,
      events: [
        {
          id: 'war-declaration',
          title: 'Declaration of the Crystal War',
          date: '1650 CE',
          year: 1650,
          bookId: 'book4',
          description: 'The Shadow Expanse declares war on all other realms.',
          category: 'war',
          icon: '⚡'
        },
        {
          id: 'siege-prime',
          title: 'Siege of Aethros Prime',
          date: '1750 CE',
          year: 1750,
          bookId: 'book4',
          description: 'The origin world comes under direct assault.',
          category: 'battle',
          icon: '🏰'
        },
        {
          id: 'heroes-rise',
          title: 'Rise of the Crystal Heroes',
          date: '1850 CE',
          year: 1850,
          bookId: 'book4',
          description: 'A new generation of crystal-wielders emerges to defend the realms.',
          category: 'heroes',
          icon: '⭐'
        }
      ]
    },
    {
      id: 'book5',
      title: 'Book 5: Infinite Paths',
      shortTitle: 'Infinite Paths',
      color: '#FFEAA7',
      gradientFrom: '#FFEAA7',
      gradientTo: '#DDA0DD',
      startYear: 1900,
      endYear: 2200,
      events: [
        {
          id: 'final-battle',
          title: 'The Final Convergence',
          date: '1950 CE',
          year: 1950,
          bookId: 'book5',
          description: 'All realms unite for the ultimate battle against chaos.',
          category: 'climax',
          icon: '🌟'
        },
        {
          id: 'new-dawn',
          title: 'The New Dawn',
          date: '2000 CE',
          year: 2000,
          bookId: 'book5',
          description: 'A new age begins with the realms transformed forever.',
          category: 'resolution',
          icon: '🌈'
        },
        {
          id: 'infinite-possibilities',
          title: 'Infinite Possibilities',
          date: '2100 CE',
          year: 2100,
          bookId: 'book5',
          description: 'The future holds endless potential for all realms.',
          category: 'future',
          icon: '∞'
        }
      ]
    }
  ];

  // All events combined and sorted by year
  const allEvents = books.flatMap(book => book.events).sort((a, b) => a.year - b.year);

  // Scroll to specific book section
  const scrollToBook = (bookId: string) => {
    const bookElement = document.getElementById(`book-${bookId}`);
    if (bookElement) {
      bookElement.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
      setActiveBook(bookId);
    }
  };

  // Calculate current year based on scroll position
  const calculateCurrentYear = (scrollY: number) => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progress = Math.min(scrollY / maxScroll, 1);
    const minYear = 500;
    const maxYear = 2200;
    return Math.round(minYear + (maxYear - minYear) * progress);
  };

  // Generate gradient background based on scroll progress
  const generateGradientBackground = (progress: number) => {
    if (progress <= 0.2) {
      // Book 1 gradient
      const factor = progress / 0.2;
      return `linear-gradient(135deg, ${interpolateColor('#1a1a2e', '#FF6B6B', factor)} 0%, ${interpolateColor('#16213e', '#4ECDC4', factor)} 100%)`;
    } else if (progress <= 0.4) {
      // Book 2 gradient
      const factor = (progress - 0.2) / 0.2;
      return `linear-gradient(135deg, ${interpolateColor('#FF6B6B', '#4ECDC4', factor)} 0%, ${interpolateColor('#4ECDC4', '#45B7D1', factor)} 100%)`;
    } else if (progress <= 0.6) {
      // Book 3 gradient
      const factor = (progress - 0.4) / 0.2;
      return `linear-gradient(135deg, ${interpolateColor('#4ECDC4', '#45B7D1', factor)} 0%, ${interpolateColor('#45B7D1', '#96CEB4', factor)} 100%)`;
    } else if (progress <= 0.8) {
      // Book 4 gradient
      const factor = (progress - 0.6) / 0.2;
      return `linear-gradient(135deg, ${interpolateColor('#45B7D1', '#96CEB4', factor)} 0%, ${interpolateColor('#96CEB4', '#FFEAA7', factor)} 100%)`;
    } else {
      // Book 5 gradient
      const factor = (progress - 0.8) / 0.2;
      return `linear-gradient(135deg, ${interpolateColor('#96CEB4', '#FFEAA7', factor)} 0%, ${interpolateColor('#FFEAA7', '#DDA0DD', factor)} 100%)`;
    }
  };

  // Color interpolation utility
  const interpolateColor = (color1: string, color2: string, factor: number): string => {
    const hex1 = color1.replace('#', '');
    const hex2 = color2.replace('#', '');
    
    const r1 = parseInt(hex1.substr(0, 2), 16);
    const g1 = parseInt(hex1.substr(2, 2), 16);
    const b1 = parseInt(hex1.substr(4, 2), 16);
    
    const r2 = parseInt(hex2.substr(0, 2), 16);
    const g2 = parseInt(hex2.substr(2, 2), 16);
    const b2 = parseInt(hex2.substr(4, 2), 16);
    
    const r = Math.round(r1 + (r2 - r1) * factor);
    const g = Math.round(g1 + (g2 - g1) * factor);
    const b = Math.round(b1 + (b2 - b1) * factor);
    
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  };

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min(Math.max(scrollTop / docHeight, 0), 1);
      
      setScrollProgress(progress);
      setCurrentYear(calculateCurrentYear(scrollTop));
      setBackgroundGradient(generateGradientBackground(progress));

      // Update user progress if authenticated
      if (user) {
        updateProgress({
          timelineExplored: Math.round(progress * 100)
        });
      }

      // Determine current active book section
      const sections = document.querySelectorAll('[data-book-section]');
      let current = '';
      
      sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
          current = section.getAttribute('data-book-section') || '';
        }
      });
      
      setActiveBook(current);
    };

    let ticking = false;
    const scrollHandler = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', scrollHandler, { passive: true });
    handleScroll(); // Initial calculation
    
    return () => window.removeEventListener('scroll', scrollHandler);
  }, [user, updateProgress]);

  return (
    <div 
      className="min-h-screen relative transition-all duration-300 ease-out"
      style={{ background: backgroundGradient || 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' }}
    >
      {/* Book Navigation Ribbons */}
      <div className="fixed top-24 left-0 z-40 flex flex-col space-y-2">
        {books.map((book, index) => (
          <div key={book.id} className="relative">
            <button
              onClick={() => scrollToBook(book.id)}
              className={`group relative transform transition-all duration-300 hover:scale-105 ${
                activeBook === book.id ? 'scale-110' : ''
              }`}
            >
              {/* Ribbon Shape */}
              <div 
                className={`relative px-6 py-3 text-white font-bold text-sm shadow-lg transition-all duration-300 ${
                  activeBook === book.id ? 'shadow-2xl' : 'shadow-md'
                }`}
                style={{ 
                  backgroundColor: book.color,
                  clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 50%, calc(100% - 12px) 100%, 0 100%)'
                }}
              >
                <div className="flex items-center space-x-2">
                  <span className="text-lg">📖</span>
                  <span>{book.shortTitle}</span>
                </div>
                
                {/* Glow effect */}
                <div 
                  className={`absolute inset-0 rounded-l-lg transition-opacity duration-300 ${
                    activeBook === book.id ? 'opacity-30' : 'opacity-0 group-hover:opacity-20'
                  }`}
                  style={{ 
                    backgroundColor: book.color,
                    filter: 'blur(8px)',
                    zIndex: -1
                  }}
                />
              </div>

              {/* Connection line indicator */}
              {activeBook === book.id && (
                <div 
                  className="absolute left-full top-1/2 w-8 h-0.5 transform -translate-y-1/2 transition-all duration-300"
                  style={{ backgroundColor: book.color }}
                />
              )}
            </button>
          </div>
        ))}
      </div>

      {/* Date Ruler Indicator */}
      <div className="fixed right-4 top-1/2 transform -translate-y-1/2 z-40">
        <div className="glass-dark rounded-2xl border border-white/20 p-4 min-w-[120px]">
          {/* Ruler background */}
          <div className="relative h-64 w-4 bg-white/10 rounded-full mx-auto mb-4">
            {/* Date markers */}
            <div className="absolute inset-0">
              {[500, 800, 1200, 1600, 1900, 2200].map((year, index) => (
                <div 
                  key={year}
                  className="absolute w-full flex items-center"
                  style={{ top: `${(index / 5) * 100}%` }}
                >
                  {/* Major tick mark */}
                  <div className="w-full h-0.5 bg-white/30" />
                  
                  {/* Year label */}
                  <div className="absolute left-6 text-xs text-white/70 whitespace-nowrap">
                    {year} CE
                  </div>
                </div>
              ))}
              
              {/* Current position indicator */}
              <div 
                className="absolute w-6 h-6 bg-cyan-400 rounded-full transform -translate-x-1 -translate-y-1/2 shadow-lg border-2 border-white/20 transition-all duration-300"
                style={{ 
                  top: `${scrollProgress * 100}%`,
                  left: '50%'
                }}
              >
                <div className="absolute inset-0 bg-cyan-400 rounded-full animate-pulse opacity-50" />
              </div>
            </div>
          </div>
          
          {/* Current date display */}
          <div className="text-center">
            <div className="text-cyan-400 font-bold text-lg">
              {currentYear} CE
            </div>
            <div className="text-white/60 text-xs mt-1">
              Current Era
            </div>
          </div>
        </div>
      </div>

      {/* Main Timeline Content */}
      <div ref={timelineRef} className="relative z-10 pt-32 pb-16">
        <div className="container mx-auto px-4">
          {/* Timeline Header */}
          <div className="text-center mb-16">
            <div className="mb-6">
              <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 font-serif drop-shadow-2xl mb-2">
                ZOROASTER
              </h1>
              <h2 className="text-4xl font-bold text-white/90 mb-4 font-serif-body">
                Universal Timeline
              </h2>
              <p className="text-sm text-white/60 font-serif-elegant italic">
                by Sina Panahi
              </p>
            </div>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Journey through 1,700 years of history across five interconnected books. 
              Use the navigation ribbons to jump between different eras.
            </p>
          </div>

          {/* Timeline Events */}
          <div className="relative">
            {/* Central timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gradient-to-b from-white/20 via-white/40 to-white/20 h-full rounded-full" />

            {books.map((book, bookIndex) => (
              <div 
                key={book.id} 
                id={`book-${book.id}`}
                data-book-section={book.id}
                className="relative mb-32"
              >
                {/* Book Section Header */}
                <div className="text-center mb-16">
                  <div 
                    className="inline-block px-8 py-4 rounded-2xl glass-dark border border-white/20 backdrop-blur-xl shadow-2xl"
                    style={{ borderColor: `${book.color}40` }}
                  >
                    <h2 className="text-3xl font-bold text-white mb-2">{book.title}</h2>
                    <p className="text-white/70">{book.startYear} - {book.endYear} CE</p>
                  </div>
                </div>

                {/* Interactive Book Events */}
                <div className="space-y-8">
                  {book.events.map((event, eventIndex) => {
                    // Convert basic event to interactive event format
                    const interactiveEvent = {
                      id: event.id,
                      title: event.title,
                      date: event.date,
                      year: event.year,
                      shortDescription: event.description,
                      fullDescription: getFullDescription(event.id, event.description),
                      category: event.category as any,
                      icon: event.icon,
                      relatedBooks: getRelatedBooks(event.bookId, book.title),
                      consequences: getConsequences(event.id),
                      spoilerLevel: 'none' as const,
                      color: book.color
                    };

                    return (
                      <InteractiveTimelineEvent
                        key={event.id}
                        event={interactiveEvent}
                        isExpanded={expandedEventId === event.id}
                        onToggle={() => handleEventToggle(event.id)}
                        position={eventIndex % 2 === 0 ? 'left' : 'right'}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Progress Indicator */}
          <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-40">
            <div className="glass-dark rounded-full border border-white/20 px-6 py-3">
              <div className="flex items-center space-x-4">
                <span className="text-white/70 text-sm">Progress:</span>
                <div className="w-32 h-2 bg-white/20 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full transition-all duration-300"
                    style={{ width: `${scrollProgress * 100}%` }}
                  />
                </div>
                <span className="text-cyan-400 text-sm font-bold">
                  {Math.round(scrollProgress * 100)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { EnhancedTimeline };
