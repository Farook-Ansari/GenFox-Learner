import React, { useState, useEffect } from 'react';
import { Search, ChevronRight } from 'lucide-react';
import { learningCards, getCategoryIcon } from '../utils/learningCards';
import ChatInterface from './chatInterface';
import Syllabus from './Syllabus'; // Import the new Syllabus component

const LearningModule = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [cards, setCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [showSyllabus, setShowSyllabus] = useState(false); // New state for syllabus
  const [animatedCards, setAnimatedCards] = useState([]);

  // Ensure all cards are loaded and reset view states
  useEffect(() => {
    setCards(learningCards);
    setShowSyllabus(false); // Reset syllabus view
    setShowChat(false); // Reset chat view
    setSelectedCard(null); // Reset selected card
    
    // Set up staggered animation for cards
    const timer = setTimeout(() => {
      const cardIds = learningCards.map(card => card.id);
      setAnimatedCards(cardIds);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // Filter cards based on search query
  const filteredCards = cards.filter(card => 
    card.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    card.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    card.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCardClick = (card) => {
    setSelectedCard(card);
    setShowSyllabus(true); // Show syllabus instead of chat interface
    setShowChat(false); // Ensure chat is hidden
  };

  const handleBackToCards = () => {
    setShowChat(false);
    setShowSyllabus(false);
    setSelectedCard(null);
  };

  // Show Syllabus when a card is clicked
  if (showSyllabus && selectedCard) {
    return (
      <div className="flex-1">
        <Syllabus 
          category={selectedCard.category}
          categoryIcon={getCategoryIcon(selectedCard.category)}
          categoryColor={selectedCard.iconColor}
          onBackClick={handleBackToCards}
          // No need to pass title as you mentioned
        />
      </div>
    );
  }

  // Keep the chat interface option (you can remove this if not needed)
  if (showChat && selectedCard) {
    return (
      <div className="flex-1">
        <ChatInterface 
          category={selectedCard.category} 
          categoryIcon={getCategoryIcon(selectedCard.category)}
          categoryColor={selectedCard.iconColor}
          onBackClick={handleBackToCards}
          initialQuestion={`Tell me about ${selectedCard.title}`}
        />
      </div>
    );
  }

  return (
    <div className="flex-1 bg-slate-50 overflow-y-auto">
      <div className="p-6">
        {/* Search bar at the top */}
        <div className="max-w-2xl mx-auto mb-8 relative">
          <div className="relative flex items-center">
            <input
              type="text"
              className="w-full py-3 px-4 pl-12 rounded-full bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Search subjects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="absolute left-4 text-slate-400">
              <Search size={20} />
            </div>
          </div>
        </div>

        {/* Learning cards grid - Using Dashboard card design */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto pb-16">
          {filteredCards.map((card) => {
            const isAnimated = animatedCards.includes(card.id);
            
            return (
              <div 
                key={card.id} 
                className={`group relative rounded-2xl overflow-hidden transition-all duration-500 cursor-pointer
                            ${isAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transitionDelay: `${(card.id % 10) * 0.1}s` }}
                onClick={() => handleCardClick(card)}
              >
                {/* Glass effect background with gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-white to-white/90 rounded-2xl shadow-lg backdrop-blur-sm
                                group-hover:shadow-xl transition-all duration-300 border border-white/50"></div>
                
                {/* Card top section with image/gradient */}
                <div className="relative">
                  <div className="h-40 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 to-indigo-500/10 
                                   group-hover:from-blue-400/20 group-hover:to-indigo-500/20 transition-all duration-500"></div>
                    
                    {/* Abstract pattern overlay */}
                    <div className="absolute inset-0 opacity-10 overflow-hidden">
                      <svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                          <pattern id={`grid-${card.id}`} width="10" height="10" patternUnits="userSpaceOnUse">
                            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5" />
                          </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill={`url(#grid-${card.id})`} className="text-blue-500" />
                      </svg>
                    </div>
                    
                    {/* Floating 3D icon */}
                    <div className="absolute top-4 right-4 w-16 h-16 flex items-center justify-center">
                      <div className="relative w-12 h-12 rounded-lg bg-gradient-to-br from-blue-100 to-blue-50
                                     shadow-lg transform group-hover:rotate-12 transition-all duration-500">
                        <div className="absolute inset-0 flex items-center justify-center text-blue-500">
                          {getCategoryIcon(card.category)}
                        </div>
                      </div>
                    </div>
                    
                    {/* Category badge */}
                    <div className="absolute top-4 left-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium 
                                        bg-white/80 backdrop-blur-sm ${card.iconColor}`}>
                        {card.category}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Card content */}
                <div className="relative p-5">
                  <h3 className="text-xl font-semibold mb-3 text-slate-800 group-hover:text-blue-700 transition-colors">{card.title}</h3>
                  <p className="text-slate-600 mb-5 line-clamp-2 text-sm">{card.description}</p>
                  
                  {/* Start learning button */}
                  <button className="mt-4 w-full py-2.5 px-4 rounded-lg font-medium text-sm
                                     relative overflow-hidden group-hover:text-white transition-colors duration-300">
                    <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-500 to-indigo-500 
                                  rounded-lg -translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                    <span className="relative flex items-center justify-center">
                      Start learning <ChevronRight size={16} className="ml-1" />
                    </span>
                  </button>
                </div>
                
                {/* Interactive hover effect overlay */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-400/20 
                                rounded-2xl transition-all duration-300 pointer-events-none"></div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Add minimal required animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default LearningModule;