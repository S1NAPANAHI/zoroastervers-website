'use client';

import { useState } from 'react';
import EasterEggContainer from './EasterEggContainer';

function BookNavigator() {
  const [selectedBook, setSelectedBook] = useState<any>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  const books = [
    { 
      id: 1,
      title: "The Quantum Prophecy", 
      author: "By Your Name",
      summary: "In a universe where quantum mechanics and ancient prophecies collide, our heroes must navigate the delicate balance between science and magic to prevent the collapse of reality itself.", 
      progress: 85,
      status: "Near Completion",
      pages: 342,
      genre: "Sci-Fi Fantasy",
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
    },
    { 
      id: 2,
      title: "Chronicles of the Void", 
      author: "By Your Name",
      summary: "Deep in the cosmic void, explorers discover an ancient civilization that holds the key to understanding the true nature of existence and the multiverse.", 
      progress: 62,
      status: "In Progress",
      pages: 298,
      genre: "Space Opera",
      gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
    },
    { 
      id: 3,
      title: "The Neural Nexus", 
      author: "By Your Name",
      summary: "When humanity achieves direct neural connection to the quantum field, the boundaries between individual consciousness and collective intelligence begin to blur.", 
      progress: 43,
      status: "Drafting",
      pages: 187,
      genre: "Cyberpunk",
      gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
    },
    { 
      id: 4,
      title: "Echoes of Tomorrow", 
      author: "By Your Name",
      summary: "Time traveler refugees from a dystopian future must work with present-day scientists to prevent the catastrophic events that destroyed their timeline.", 
      progress: 29,
      status: "Planning",
      pages: 134,
      genre: "Time Travel",
      gradient: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)"
    },
    { 
      id: 5,
      title: "The Infinity Engine", 
      author: "By Your Name",
      summary: "An experimental device that can manipulate the fundamental forces of the universe becomes the center of an intergalactic conflict that will determine the fate of all sentient life.", 
      progress: 15,
      status: "Concept",
      pages: 67,
      genre: "Hard Sci-Fi",
      gradient: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)"
    }
  ];

  const getStackTransform = (index: number) => {
    const baseOffset = index * 35; // Controlled spacing
    let yOffset = baseOffset;
    let zIndex = books.length - index + 10;
    let scale = 1;
    let rotateX = 0;
    let opacity = 1;
    
    // If this book is being hovered, bring it fully forward
    if (hoveredIndex === index) {
      yOffset = baseOffset - 50; // Pull the hovered book significantly forward
      zIndex = 1000; // Bring to very front
      scale = 1.1; // Larger scale
      rotateX = -5; // Slight tilt for 3D effect
      opacity = 1;
    } else if (hoveredIndex !== null && index > hoveredIndex) {
      // Books below the hovered one get pushed down
      yOffset = baseOffset + 20;
    }
    
    return {
      transform: `translateY(${yOffset}px) rotateX(${rotateX}deg) scale(${scale})`,
      zIndex: zIndex,
      opacity: opacity
    };
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 70) return '#10b981';
    if (progress >= 40) return '#f59e0b';
    return '#3b82f6';
  };

  const closeModal = () => {
    setSelectedBook(null);
    document.body.style.overflow = 'auto';
  };

  const openModal = (book: any) => {
    setSelectedBook(book);
    document.body.style.overflow = 'hidden';
  };

  return (
    <>
      <div className="glass-dark p-6 glow-card bookshelf-container">
        <h2 className="text-2xl font-bold mb-6 text-center text-[#dcddde] flex items-center justify-center">
          📚 My Novel Library
        </h2>
        
        <div className="book-stack">
          {books.map((book, index) => (
            <EasterEggContainer
              itemId={book.id}
              itemType="book"
              className={`book-cover ${selectedBook?.id === book.id ? 'selected' : ''}`}
              key={book.id}
            >
              <div
                style={{
                  ...getStackTransform(index),
                  background: book.gradient
                }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => openModal(book)}
                className="w-full h-full"
              >
                {/* Book Spine */}
                <div className="book-spine"></div>
                
                {/* Book Content */}
                <div className="book-title">{book.title}</div>
                <div className="book-author">{book.author}</div>
              
              {/* Progress Section */}
              <div className="book-progress">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-white opacity-80">{book.progress}% Complete</span>
                  <span className="text-xs text-white opacity-80">{book.pages} pages</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ 
                      width: `${book.progress}%`,
                      background: `linear-gradient(90deg, ${getProgressColor(book.progress)}, #34d399)`
                    }}
                  ></div>
                </div>
              </div>
              </div>
            </EasterEggContainer>
          ))}
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-[#b3b3b3] text-sm">
            Hover over books to expand • Click to explore
          </p>
        </div>
      </div>

      {/* Enhanced Modal */}
      <div className={`book-details-modal ${selectedBook ? 'open' : ''}`} onClick={closeModal}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          {selectedBook && (
            <>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-[#dcddde] mb-2">{selectedBook.title}</h2>
                  <p className="text-[#a855f7] font-medium">{selectedBook.author}</p>
                </div>
                <button 
                  onClick={closeModal}
                  className="text-[#b3b3b3] hover:text-[#dcddde] text-2xl leading-none"
                >
                  ×
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="glass p-4 text-center">
                  <div className="text-2xl font-bold text-[#a855f7]">{selectedBook.progress}%</div>
                  <div className="text-[#b3b3b3] text-sm">Complete</div>
                </div>
                <div className="glass p-4 text-center">
                  <div className="text-2xl font-bold text-[#a855f7]">{selectedBook.pages}</div>
                  <div className="text-[#b3b3b3] text-sm">Pages</div>
                </div>
                <div className="glass p-4 text-center">
                  <div className="text-sm font-bold text-[#a855f7]">{selectedBook.genre}</div>
                  <div className="text-[#b3b3b3] text-sm">Genre</div>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-xl font-bold text-[#dcddde] mb-3">Synopsis</h3>
                <p className="text-[#b3b3b3] leading-relaxed">{selectedBook.summary}</p>
              </div>
              
              <div className="mb-6">
                <h3 className="text-xl font-bold text-[#dcddde] mb-3">Progress</h3>
                <div className="glass p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[#dcddde] font-medium">Status: {selectedBook.status}</span>
                    <span className="text-[#a855f7] font-bold">{selectedBook.progress}%</span>
                  </div>
                  <div className="progress-bar h-3">
                    <div 
                      className="progress-fill h-3" 
                      style={{ 
                        width: `${selectedBook.progress}%`,
                        background: `linear-gradient(90deg, ${getProgressColor(selectedBook.progress)}, #34d399)`
                      }}
                    ></div>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3">
                <button className="neon-button-blue flex-1 py-3">
                  Read Sample Chapter
                </button>
                <button className="neon-button-purple flex-1 py-3">
                  Add to Wishlist
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default BookNavigator;
