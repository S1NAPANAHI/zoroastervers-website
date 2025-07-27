'use client';

import { useState } from 'react';

export default function UniverseExplorer() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [showQuiz, setShowQuiz] = useState(false);

  const loreItems = [
    { 
      name: "Planet Aryana", 
      description: "A desert world inspired by Persian mythology, where ancient magic still flows through the crystalline sands...", 
      category: "locations",
      icon: "🏜️",
      details: "Home to the Sandwalkers and the legendary Crystal Oasis"
    },
    { 
      name: "The Void Crystals", 
      description: "Mysterious artifacts that can bend reality itself, sought after by both heroes and villains...", 
      category: "artifacts",
      icon: "💎",
      details: "Only seven exist in the known universe"
    },
    { 
      name: "Order of the Silver Moon", 
      description: "An ancient organization of warrior-mages who protect the balance between light and shadow...", 
      category: "factions",
      icon: "🌙",
      details: "Founded over 1000 years ago by the first Archmage"
    },
    { 
      name: "Temporal Storms", 
      description: "Dangerous phenomena that can trap travelers in time loops or age them decades in seconds...", 
      category: "phenomena",
      icon: "⚡",
      details: "Most common near ancient battlefields"
    },
    { 
      name: "The Great Library", 
      description: "A massive floating structure containing all knowledge of the universe, guarded by sentient books...", 
      category: "locations",
      icon: "📚",
      details: "Location changes every lunar cycle"
    },
    { 
      name: "Shadowbeast", 
      description: "Creatures from the void that feed on fear and despair, capable of taking any form...", 
      category: "creatures",
      icon: "👹",
      details: "Weakness: Pure silver and moonlight"
    }
  ];

  const categories = [
    { id: 'all', name: 'All', icon: '🌍' },
    { id: 'locations', name: 'Locations', icon: '🏰' },
    { id: 'artifacts', name: 'Artifacts', icon: '💎' },
    { id: 'factions', name: 'Factions', icon: '⚔️' },
    { id: 'phenomena', name: 'Phenomena', icon: '⚡' },
    { id: 'creatures', name: 'Creatures', icon: '🐉' }
  ];

  const filteredItems = loreItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || 
                         item.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const QuizComponent = () => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [showResults, setShowResults] = useState(false);

    const questions = [
      {
        question: "What is the home planet of the Sandwalkers?",
        options: ["Aryana", "Vextora", "Nebulus", "Cryston"],
        correct: 0
      },
      {
        question: "How many Void Crystals exist?",
        options: ["Five", "Seven", "Nine", "Twelve"],
        correct: 1
      },
      {
        question: "What is the weakness of Shadowbeasts?",
        options: ["Fire", "Ice", "Silver and moonlight", "Holy water"],
        correct: 2
      }
    ];

    const handleAnswer = (selectedIndex: number) => {
      if (selectedIndex === questions[currentQuestion].correct) {
        setScore(score + 1);
      }
      
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        setShowResults(true);
      }
    };

    const resetQuiz = () => {
      setCurrentQuestion(0);
      setScore(0);
      setShowResults(false);
    };

    if (showResults) {
      return (
        <div className="glass p-6 text-center">
          <h3 className="text-xl font-bold text-[#dcddde] mb-4">Quiz Complete! 🎉</h3>
          <p className="text-[#b3b3b3] mb-4">
            You scored {score} out of {questions.length}
          </p>
          <div className="flex gap-3 justify-center">
            <button onClick={resetQuiz} className="neon-button-blue px-4 py-2">
              Try Again
            </button>
            <button onClick={() => setShowQuiz(false)} className="neon-button-purple px-4 py-2">
              Close Quiz
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="glass p-6">
        <h3 className="text-xl font-bold text-[#dcddde] mb-4">
          Universe Quiz - Question {currentQuestion + 1}/{questions.length}
        </h3>
        <p className="text-[#b3b3b3] mb-6">{questions[currentQuestion].question}</p>
        <div className="space-y-3">
          {questions[currentQuestion].options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(index)}
              className="w-full glass border border-[#484848] p-3 text-left hover:border-[#a855f7] transition-colors"
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    );
  };

  if (showQuiz) {
    return (
      <div className="glass-dark p-6 glow-card">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-[#dcddde] flex items-center">
            🧠 Universe Knowledge Quiz
          </h2>
          <button 
            onClick={() => setShowQuiz(false)}
            className="text-[#b3b3b3] hover:text-[#dcddde]"
          >
            ✕
          </button>
        </div>
        <QuizComponent />
      </div>
    );
  }

  return (
    <div className="glass-dark p-6 glow-card">
      <h2 className="text-3xl font-bold mb-6 text-[#dcddde] flex items-center">
        🌌 Explore the Universe
      </h2>
      
      {/* Search and Quiz Button */}
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Search lore, locations, artifacts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 glass border border-[#484848] px-4 py-2 rounded-lg bg-transparent text-[#dcddde] placeholder-[#b3b3b3] focus:border-[#a855f7] focus:outline-none"
        />
        <button 
          onClick={() => setShowQuiz(true)}
          className="neon-button-green px-4 py-2"
        >
          Take Universe Quiz
        </button>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`px-4 py-2 rounded-full text-sm transition-all duration-200 ${
              activeCategory === category.id
                ? 'neon-button-blue'
                : 'glass border border-[#484848] text-[#b3b3b3] hover:border-[#a855f7]'
            }`}
          >
            {category.icon} {category.name}
          </button>
        ))}
      </div>

      {/* Lore Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item, index) => (
          <div key={index} className="glass p-4 glow-card hover:scale-105 transition-all duration-300">
            <div className="flex items-center mb-2">
              <span className="text-2xl mr-3">{item.icon}</span>
              <h3 className="text-lg font-bold text-[#dcddde]">{item.name}</h3>
            </div>
            <p className="text-[#b3b3b3] text-sm mb-3">{item.description}</p>
            <div className="glass-dark p-2 rounded text-xs text-[#a855f7]">
              💡 {item.details}
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="glass p-8 text-center">
          <span className="text-4xl mb-4 block">🔍</span>
          <p className="text-[#b3b3b3]">No items found matching your search.</p>
        </div>
      )}
    </div>
  );
}
