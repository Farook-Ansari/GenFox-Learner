import React, { useState, useEffect } from 'react';
import { Search, ChevronRight, Clock, BookOpen, MoreHorizontal, Send } from 'lucide-react';
import { learningCards, getCategoryIcon } from '../utils/learningCards';

const DashboardView = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [animatedCards, setAnimatedCards] = useState([]);
  
  // Card progress data
  const cardProgressMap = {
    1: 75, 2: 45, 3: 20, 4: 60, 5: 10,
    6: 90, 7: 30, 8: 50, 9: 15,
  };
  
  // Function to get progress for a specific card
  const getCardProgress = (cardId) => {
    return cardProgressMap[cardId] || 0;
  };

  // Staggered animation effect for cards
  useEffect(() => {
    const timer = setTimeout(() => {
      const cardIds = learningCards.map(card => card.id);
      setAnimatedCards(cardIds);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // Handle quick question selection
  const handleQuestionClick = (question) => {
    setSearchQuery(question);
  };

  // Always show all cards regardless of search query
  const filteredCards = learningCards;

  return (
    <div className="flex-1 bg-slate-50 p-6 overflow-y-auto">
      {/* Decorative floating elements - using more neutral tones */}
      <div className="fixed top-20 left-20 w-64 h-64 bg-slate-100 rounded-full opacity-30 blur-3xl animate-pulse"></div>
      <div className="fixed bottom-20 right-40 w-80 h-80 bg-slate-100 rounded-full opacity-30 blur-3xl animate-pulse" ></div>
      <div className="fixed top-1/2 right-1/4 w-40 h-40 bg-slate-100 rounded-full opacity-20 blur-3xl animate-pulse" ></div>
      
      {/* Header with larger centered title */}
      <div className="text-center mb-12 mt-25 relative z-10">
        <h1 className="text-5xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-slate-700 to-slate-900 mb-6 animate-fadeIn">
          Hey, Rahul! What would you like <br />to learn today?
        </h1>
        <p className="text-slate-500 max-w-1xl mx-auto text-lg animate-fadeIn" >
        You've been enrolled to 1st year Engineering- Computer Science. Let's get started with your learning journey.
        </p>
      </div>

      {/* Quick questions buttons - with neutral colors */}
      <div className="max-w-3xl mx-auto mb-6 flex flex-wrap items-center justify-center gap-3 animate-fadeIn">
        <button 
          onClick={() => handleQuestionClick("Explain AI")}
          className="px-5 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-slate-200/50 to-slate-300/50 border border-slate-200 
                    text-slate-700 hover:from-blue-500/20 hover:to-indigo-500/20 hover:shadow-md transition-all duration-300 hover:scale-105"
        >
          1. Explain AI
        </button>
        <button 
          onClick={() => handleQuestionClick("What is Matrix")}
          className="px-5 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-slate-200/50 to-slate-300/50 border border-slate-200 
                    text-slate-700 hover:from-blue-500/20 hover:to-indigo-500/20 hover:shadow-md transition-all duration-300 hover:scale-105"
        >
          2. What is Matrix
        </button>
        <button 
          onClick={() => handleQuestionClick("Explain Thermodynamics")}
          className="px-5 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-slate-200/50 to-slate-300/50 border border-slate-200 
                    text-slate-700 hover:from-blue-500/20 hover:to-indigo-500/20 hover:shadow-md transition-all duration-300 hover:scale-105"
        >
          3. Explain Thermodynamics
        </button>
      </div>

      {/* Search input with neutral colors */}
      <div className="max-w-3xl mx-auto mb-12 flex items-center justify-center animate-fadeIn mt-16" >
        <div className="relative flex items-center w-full">
          <input
            type="text"
            className="w-full py-4 px-6 pl-12 rounded-full bg-white border border-slate-200 
                      focus:outline-none focus:ring-2 focus:ring-slate-200 focus:border-transparent 
                      text-slate-700 placeholder-slate-400 text-lg shadow-lg transform transition-all 
                      duration-300 hover:shadow-xl"
            placeholder="Type or share a file to start..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="absolute left-5 text-slate-400">
            <Search size={20} />
          </div>
        </div>
        <button className="ml-4 p-4 rounded-full bg-white text-slate-500 shadow-lg 
                          hover:bg-slate-50 hover:text-slate-700 transition-all duration-300 
                          hover:shadow-xl transform hover:scale-105">
          <Send size={20} />
        </button>
      </div>

      {/* Featured section - repositioned with extra space */}
      <div className="max-w-6xl mx-auto mb-12 animate-fadeIn mt-20" >
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-8 shadow-lg overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-200 rounded-full opacity-20 blur-3xl -translate-y-1/2 translate-x-1/4"></div>
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-2/3 mb-6 md:mb-0 md:pr-8 ">
              <span className="px-4 py-1 rounded-full bg-blue-100 text-blue-600 text-xs font-medium ">FEATURED</span>
              <h2 className="text-3xl font-bold mt-4 mb-4 text-slate-800">Advanced Machine Learning Techniques</h2>
              <p className="text-slate-600 mb-6">Master the latest machine learning algorithms and techniques with our comprehensive learning path.</p>
              <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full font-medium flex items-center hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                Start learning <ChevronRight size={18} className="ml-2" />
              </button>
            </div>
            <div className="md:w-1/3 bg-white rounded-xl shadow-md overflow-hidden">
              <div className="h-48 bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2a10 10 0 1 0 10 10H12V2Z"></path>
                  <path d="M12 2a10 10 0 0 1 10 10h-10V2Z"></path>
                  <path d="M12 12a10 10 0 0 0 10 10V12H12Z"></path>
                  <path d="M12 12a10 10 0 0 1 10 10V12H12Z"></path>
                </svg>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="text-slate-500">Progress</span>
                  <span className="font-medium text-blue-600">35%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full transition-all duration-500"
                    style={{ width: '35%' }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Learning cards grid - matching LearningModule neutral style */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {filteredCards.map((card) => {
          const progress = getCardProgress(card.id);
          const isAnimated = animatedCards.includes(card.id);
          
          return (
            <div 
              key={card.id} 
              className={`group relative rounded-2xl overflow-hidden 
                          transition-all duration-500 cursor-pointer
                          ${isAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{ transitionDelay: `${(card.id % 10) * 0.1}s` }}
            >
              {/* Enhanced background with subtle neutral highlight - MATCHING LEARNING MODULE */}
              <div className="absolute inset-0 bg-gradient-to-br from-white to-slate-50/90 rounded-2xl shadow-md backdrop-blur-sm
                              border-l-4 border-t border-r border-b border-l-slate-200 border-white/50
                              group-hover:shadow-xl transition-all duration-300"></div>
              
              {/* Card top section with image/gradient */}
              <div className="relative">
                <div className="h-40 overflow-hidden">
                  {/* Base gradient - subtle neutral for non-hover state - MATCHING LEARNING MODULE */}
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-100/40 to-slate-200/30 
                                group-hover:from-blue-400/20 group-hover:to-indigo-500/20 transition-all duration-500"></div>
                  
                  {/* Abstract pattern overlay */}
                  <div className="absolute inset-0 opacity-10 overflow-hidden">
                    <svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <pattern id={`grid-${card.id}`} width="10" height="10" patternUnits="userSpaceOnUse">
                          <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5" />
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill={`url(#grid-${card.id})`} className="text-slate-500" />
                    </svg>
                  </div>
                  
                  {/* Floating 3D icon - MATCHING LEARNING MODULE */}
                  <div className="absolute top-4 right-4 w-16 h-16 flex items-center justify-center">
                    <div className="relative w-12 h-12 rounded-lg bg-gradient-to-br from-slate-50 to-white
                                 shadow-lg transform group-hover:rotate-12 transition-all duration-500">
                      <div className="absolute inset-0 flex items-center justify-center text-slate-700">
                        {getCategoryIcon(card.category)}
                      </div>
                    </div>
                  </div>
                  
                  {/* Category badge */}
                  <div className="absolute top-4 left-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium 
                                    bg-white/90 backdrop-blur-sm shadow-sm ${card.iconColor}`}>
                      {card.category}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Card content */}
              <div className="relative p-5">
                <h3 className="text-xl font-semibold mb-3 text-slate-800 group-hover:text-blue-700 transition-colors">{card.title}</h3>
                <p className="text-slate-600 mb-5 line-clamp-2 text-sm">{card.description}</p>
                
                {/* Bottom section with stats */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2 text-xs text-slate-500">
                    <BookOpen size={14} />
                    <span>{Math.floor(Math.random() * 10) + 1} modules</span>
                  </div>
                  
                  <button className="text-slate-500 hover:text-slate-700 transition-colors">
                    <MoreHorizontal size={18} />
                  </button>
                </div>
                
                {/* Progress section with neutral colors */}
                <div className="relative mt-4 pt-4 border-t border-slate-100">
                  <div className="flex justify-between items-center text-xs mb-2">
                    <span className="font-medium text-slate-700">Course Progress</span>
                    <span className="font-medium text-slate-700">{progress}%</span>
                  </div>
                  
                  {/* Animated progress bar with neutral colors */}
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-1000 ease-out relative
                              group-hover:shadow-sm overflow-hidden"
                      style={{ 
                        width: `${progress}%`,
                        background: 'linear-gradient(90deg,rgb(35, 127, 255),rgb(118, 173, 255))'
                      }}
                    >
                      {/* Animated shine effect */}
                      <div className="absolute inset-0 w-full bg-gradient-to-r from-transparent via-white/30 to-transparent 
                                    -translate-x-full group-hover:translate-x-full transition-all duration-1000"></div>
                    </div>
                  </div>
                  
                  {/* Enhanced button with subtle neutral gradient - MATCHING LEARNING MODULE */}
                  <button className="mt-5 w-full py-2.5 px-4 rounded-lg font-medium text-sm text-slate-700
                                   border border-slate-200 bg-slate-50/50
                                   relative overflow-hidden group-hover:text-white transition-colors duration-300">
                    <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-500 to-indigo-500 
                                rounded-lg -translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                    <span className="relative flex items-center justify-center">
                      Continue learning <ChevronRight size={16} className="ml-1" />
                    </span>
                  </button>
                </div>
              </div>
              
              {/* Enhanced interactive glow effect with neutral colors - MATCHING LEARNING MODULE */}
              <div className="absolute inset-0 bg-gradient-to-br from-slate-200/0 to-slate-300/0 
                            group-hover:from-blue-400/5 group-hover:to-indigo-500/5 
                            rounded-2xl transition-all duration-300 pointer-events-none"></div>
              
              {/* Subtle shadow highlight along bottom with neutral colors - MATCHING LEARNING MODULE */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-slate-200/40 to-slate-300/40 
                           group-hover:from-blue-400/60 group-hover:to-indigo-500/60 transition-all duration-300"></div>
            </div>
          );
        })}
      </div>

      {/* Add these styles to your CSS or add them inline */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
        }
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        @keyframes pulse {
          0% { opacity: 0.2; }
          50% { opacity: 0.3; }
          100% { opacity: 0.2; }
        }
        .animate-pulse {
          animation: pulse 8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default DashboardView;