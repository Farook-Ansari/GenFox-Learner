import React, { useState, useRef, useEffect } from 'react';
import { Send, ThumbsUp, ThumbsDown, HelpCircle, X, Smile, Menu, ArrowLeft, Mic, Video, MessageSquare, Camera, ChevronDown, Check } from 'lucide-react';
import CanvasArea from './CanvasArea';

const ChatInterface = ({ category, categoryIcon, categoryColor, onBackClick, initialQuestion = '' }) => {
  const [messages, setMessages] = useState([]);
  
  const [inputText, setInputText] = useState(initialQuestion);
  const messagesEndRef = useRef(null);
  const [showCanvas, setShowCanvas] = useState(false);
  const [canvasContent, setCanvasContent] = useState({
    content: "",
    contentType: "text",
    language: "javascript",
    title: "Fox Explanation"
  });
  
  // Adding state for typing effect
  const [isTyping, setIsTyping] = useState(false);
  const [fullExplanation, setFullExplanation] = useState("");
  const [currentExplanation, setCurrentExplanation] = useState("");
  const typingSpeedRef = useRef(10); // milliseconds per character

  // Media-related states
  const [explainMode, setExplainMode] = useState("chat"); // "chat", "audio", or "video"
  const [micActive, setMicActive] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  
  // Camera video stream reference
  const videoRef = useRef(null);
  const mediaStreamRef = useRef(null);

  const inputRef = useRef(null);
  
  // Dropdown state - modified to start with null selected option
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null); // Changed from 'solve' to null
  const [optionSelected, setOptionSelected] = useState(false); // Track if an option has been selected
  
  // New dropdown for category chats
  const [showChatDropdown, setShowChatDropdown] = useState(false);
  const [selectedChat, setSelectedChat] = useState("chat1"); // Default selected chat
  const [chatSelected, setChatSelected] = useState(false); // Track if a chat has been explicitly selected
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  // Auto-adjust textarea height
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = '44px';
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
  }, [inputText]);
  
  // Modified effect to send initial question ONLY after an option has been selected
  useEffect(() => {
    if (initialQuestion && optionSelected && selectedOption) {
      // Set input text to initial question if it's not already set
      if (inputText !== initialQuestion) {
        setInputText(initialQuestion);
      }
      
      // Set a small timeout to ensure UI renders first
      const timer = setTimeout(() => {
        handleSendMessage();
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [optionSelected, selectedOption]); // Depend on both optionSelected and selectedOption
  
  // Effect for typing animation
  useEffect(() => {
    if (isTyping && currentExplanation.length < fullExplanation.length) {
      const timer = setTimeout(() => {
        setCurrentExplanation(fullExplanation.substring(0, currentExplanation.length + 1));
      }, typingSpeedRef.current);
      
      return () => clearTimeout(timer);
    } else if (isTyping && currentExplanation.length === fullExplanation.length) {
      setIsTyping(false);
    }
  }, [isTyping, currentExplanation, fullExplanation]);
  
  // Clean up media resources when closing the canvas
  useEffect(() => {
    if (!showCanvas) {
      cleanupMediaResources();
    }
  }, [showCanvas]);
  
  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDropdown && !event.target.closest('.option-dropdown-container')) {
        setShowDropdown(false);
      }
      if (showChatDropdown && !event.target.closest('.chat-dropdown-container')) {
        setShowChatDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDropdown, showChatDropdown]);
  
  // Cleanup function for media resources
  const cleanupMediaResources = () => {
    if (micActive) {
      setMicActive(false);
    }
    
    if (cameraActive) {
      setCameraActive(false);
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
        mediaStreamRef.current = null;
      }
    }
  };
  
  const handleSendMessage = () => {
    if (inputText.trim() === '' || !selectedOption) return; // Prevent sending message if no option selected
    
    setMessages([...messages, { type: 'user', content: inputText }]);
    setInputText('');
    
    // Simulate assistant response - in a real app, this would be an API call
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        type: 'assistant', 
        content: `This is a simulated response about ${category} using the ${selectedOption} approach in ${selectedChat}. In a real implementation, this would be an actual response from your AI service.`
      }]);
    }, 1000);
  };
  
  const handleSelectExplainMode = (mode) => {
    setExplainMode(mode);
    
    if (mode === "audio" || mode === "video") {
      // Request media permissions only if not already active
      if ((mode === "audio" && !micActive) || (mode === "video" && !cameraActive)) {
        requestMediaPermissions(mode);
      }
    } else {
      // If switching to chat mode, clean up media resources but keep the explanation
      cleanupMediaResources();
    }
  };

  const requestMediaPermissions = (mode) => {
    const constraints = {
      audio: mode === "audio" || mode === "video",
      video: mode === "video" ? { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } } : false
    };

    navigator.mediaDevices.getUserMedia(constraints)
      .then(stream => {
        if (mode === "audio" || mode === "video") {
          setMicActive(true);
        }
        
        if (mode === "video") {
          setCameraActive(true);
          mediaStreamRef.current = stream;
          
          // Connect stream to video element if we're in video mode
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play().catch(err => console.error("Error playing video:", err));
          }
        }
      })
      .catch(err => {
        console.error("Media permissions denied:", err);
        alert(`Please allow ${mode === "audio" ? "microphone" : "camera and microphone"} access to use this feature.`);
        // Fallback to chat mode if permissions denied
        setExplainMode("chat");
      });
  };
  
  const handleOpenExplainOptions = (message) => {
    setSelectedMessage(message);
    setExplainMode("chat"); // Set default mode
    startExplanation(message);
  };
  
  const startExplanation = (message) => {
    // Generate the full explanation text
    const explanation = `Here's a simpler explanation of:\n\n"${message}"\n\n🦊 Fox explanation:\nThis means the AI assistant is giving you a placeholder response about ${category}. In a real app, this would be replaced with an actual helpful answer based on your question.`;
    
    // Start with empty content
    setCanvasContent({
      content: "",
      contentType: "text",
      title: `Fox Explanation (${explainMode.charAt(0).toUpperCase() + explainMode.slice(1)} Mode)`
    });
    
    // Set the full explanation that will be shown character by character
    setFullExplanation(explanation);
    setCurrentExplanation("");
    
    // Show the canvas
    setShowCanvas(true);
    
    // Start typing effect after a small delay
    setTimeout(() => {
      setIsTyping(true);
    }, 50);
  };
  
  // Update canvas content as typing occurs
  useEffect(() => {
    if (currentExplanation) {
      setCanvasContent(prev => ({
        ...prev,
        content: currentExplanation
      }));
    }
  }, [currentExplanation]);
  
  const handleCloseCanvas = () => {
    setShowCanvas(false);
    setIsTyping(false);
    setCurrentExplanation("");
    setExplainMode("chat");
    cleanupMediaResources();
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      // Only send message if an option is selected
      if (selectedOption) {
        handleSendMessage();
      } else {
        // Optional: Show a tooltip or message that user needs to select an option first
        alert("Please select an option first (Solve, Memorize, or Practice)");
      }
    }
  };
  
  const handleOptionSelect = (option) => {
    console.log(`Selected option: ${option}`);
    setSelectedOption(option);
    setShowDropdown(false);
    setOptionSelected(true); // Mark that an option has been selected
  };
  
  const handleChatSelect = (chat) => {
    console.log(`Selected chat: ${chat}`);
    setSelectedChat(chat);
    setShowChatDropdown(false);
    setChatSelected(true); // Mark that a chat has been explicitly selected
    // You might want to load chat history based on the selected chat here
  };
  
  // Option label mapping for display
  const optionLabels = {
    solve: 'Solve',
    memorize: 'Memorize',
    practice: 'Practice'
  };
  
  // Chat options for dropdown
  const chatOptions = ['chat1', 'chat2', 'chat3'];
  
  const suggestedQueries = [
    `What is ${category}?`,
    `Why is ${category} important?`,
    `How can I learn more about ${category}?`
  ];

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Main Content Area with clean white theme */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left side: Chat area - Now with minimalist white theme */}
        <div className={`${showCanvas ? 'w-2/5' : 'w-full'} flex flex-col border-r border-slate-100`}>
          {/* Header now with clean white design */}
          <div className="border-b border-slate-100 bg-white p-4 flex items-center justify-between text-slate-700 shadow-sm">
            <div className="flex items-center flex-1">
              <button 
                className="p-2 rounded-full hover:bg-slate-50 transition-colors text-slate-500"
                onClick={onBackClick}
              >
                <ArrowLeft size={20} />
              </button>
              <div className="ml-4 flex items-center">
                <span className="mr-2 text-slate-500">{categoryIcon}</span>
                <h2 className="font-medium text-lg text-slate-700">{category}</h2>
              </div>
              
              {/* Options Dropdown - MOVED HERE */}
              <div className="ml-4 option-dropdown-container relative">
                <button 
                  className="py-1 px-3 rounded-full hover:bg-slate-50 transition-colors text-slate-700 flex items-center border border-slate-200"
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  {selectedOption ? (
                    <span className="mr-1 text-sm">{optionLabels[selectedOption]}</span>
                  ) : (
                    <span className="mr-1 text-sm">Select</span>
                  )}
                  <ChevronDown size={16} />
                </button>
                
                {/* Dropdown menu */}
                {showDropdown && (
                  <div className="absolute left-0 top-full mt-1 bg-white rounded-lg shadow-lg py-2 z-10 w-40 border border-slate-100">
                    {Object.entries(optionLabels).map(([value, label]) => (
                      <button 
                        key={value}
                        className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700 transition-colors flex items-center justify-between"
                        onClick={() => handleOptionSelect(value)}
                      >
                        <span>{label}</span>
                        {selectedOption === value && <Check size={16} className="text-indigo-500" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {/* New Chat Selection Dropdown - MOVED TO RIGHT */}
            <div className="chat-dropdown-container relative">
              <button 
                className="py-1 px-3 rounded-full hover:bg-slate-50 transition-colors text-slate-700 flex items-center border border-slate-200 text-sm"
                onClick={() => setShowChatDropdown(!showChatDropdown)}
              >
                {chatSelected ? (
                  <span className="mr-1">{selectedChat}</span>
                ) : (
                  <span className="mr-1">Chats in this "{category}"</span>
                )}
                <ChevronDown size={16} />
              </button>
              
              {/* Chat dropdown menu */}
              {showChatDropdown && (
                <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg py-2 z-10 w-48 border border-slate-100">
                  {chatOptions.map((chat) => (
                    <button 
                      key={chat}
                      className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700 transition-colors flex items-center justify-between"
                      onClick={() => handleChatSelect(chat)}
                    >
                      <span>{chat}</span>
                      {selectedChat === chat && <Check size={16} className="text-indigo-500" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Chat messages with white theme */}
          <div className="flex-1 overflow-y-auto py-4 px-4 bg-slate-50">
            {messages.map((message, index) => (
              <div key={index} className={`mb-6 ${message.type === 'user' ? 'flex justify-end' : ''}`}>
                {message.type === 'assistant' && (
                  <div className="flex">
                    <div className="bg-slate-200 text-slate-600 h-8 w-8 rounded-full flex items-center justify-center mr-3 shadow-sm">
                      <span className="text-sm font-medium">AI</span>
                    </div>
                    <div className="max-w-3xl">
                      <div className="p-4 bg-white rounded-lg shadow-sm">
                        <p className="text-slate-700">{message.content}</p>
                      </div>
                      
                      <div className="mt-2 flex gap-2">
                        <button className="p-1 rounded-full hover:bg-white text-slate-400 transition-colors">
                          <ThumbsUp size={16} />
                        </button>
                        <button className="p-1 rounded-full hover:bg-white text-slate-400 transition-colors">
                          <ThumbsDown size={16} />
                        </button>
                        <button 
                          className="px-2 py-1 rounded-full hover:bg-white text-slate-500 flex items-center transition-colors"
                          onClick={() => handleOpenExplainOptions(message.content)}
                        >
                          <HelpCircle size={16} />
                          <span className="ml-1 text-xs font-medium">Explain it Fox</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                
                {message.type === 'user' && (
                  <div className="max-w-md bg-indigo-500 text-white rounded-lg p-3 shadow-sm">
                    {message.content}
                  </div>
                )}
              </div>
            ))}            
          </div>
          
          {/* Input area with white theme */}
          <div className="border-t border-slate-100 bg-white p-4">
            <div className="flex items-center">
              <div className="flex-1 border border-slate-200 rounded-lg flex items-center overflow-hidden bg-white">
                <textarea
                  ref={inputRef}
                  className="flex-1 px-4 py-2 bg-transparent outline-none resize-none text-slate-700"
                  placeholder={selectedOption ? `Ask about ${category} in ${selectedChat}...` : "Select an option above to continue..."}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  rows={1}
                  style={{ minHeight: '40px', maxHeight: '100px' }}
                  disabled={!selectedOption} // Disable input until option is selected
                />
                <button className="p-2 text-slate-300 hover:text-slate-500">
                  <Smile size={20} />
                </button>
              </div>
              <button 
                className={`ml-2 p-2 rounded-lg ${
                  inputText.trim() && selectedOption
                    ? 'bg-indigo-500 text-white hover:bg-indigo-600' 
                    : 'bg-slate-100 text-slate-400'
                } transition-all`}
                onClick={handleSendMessage}
                disabled={!inputText.trim() || !selectedOption}
              >
                <Send size={20} />
              </button>
            </div>
            <div className="mt-2">
              <p className="text-xs text-slate-400 text-center">
                {!selectedOption ? 'Please select an option above to continue.' : 'AI responses may contain inaccuracies. Please verify important information.'}
              </p>
            </div>
          </div>
        </div>
        
        {/* Right side: Canvas Area with white theme */}
        {showCanvas && (
          <div className="w-3/5 flex flex-col relative">
            <div className="bg-white p-3 flex justify-between items-center text-black z-10">
              <h3 className="font-medium flex items-center">
                <span className="mr-2 text-lg">🦊</span> 
                Fox Explanation
                {isTyping && (
                  <span className="ml-2 inline-flex">
                    <span className="animate-pulse">.</span>
                    <span className="animate-pulse delay-100">.</span>
                    <span className="animate-pulse delay-200">.</span>
                  </span>
                )}
                
                {/* Media mode selector icons */}
                <div className="ml-3 flex gap-2">
                  <button 
                    className={`p-1 rounded-full hover:bg-slate-100 transition-colors ${explainMode === "chat" ? "bg-indigo-100 text-indigo-600" : "text-slate-400"}`}
                    onClick={() => handleSelectExplainMode("chat")}
                    title="Text explanation"
                  >
                    <MessageSquare size={16} />
                  </button>
                  <button 
                    className={`p-1 rounded-full hover:bg-slate-100 transition-colors ${explainMode === "audio" ? "bg-indigo-100 text-indigo-600" : "text-slate-400"}`}
                    onClick={() => handleSelectExplainMode("audio")}
                    title="Voice explanation"
                  >
                    <Mic size={16} />
                  </button>
                  <button 
                    className={`p-1 rounded-full hover:bg-slate-100 transition-colors ${explainMode === "video" ? "bg-indigo-100 text-indigo-600" : "text-slate-400"}`}
                    onClick={() => handleSelectExplainMode("video")}
                    title="Video explanation"
                  >
                    <Video size={16} />
                  </button>
                </div>
                
                {/* Media indicators */}
                {micActive && (
                  <span className="ml-2 px-2 py-1 bg-red-100 text-red-600 rounded-full text-xs flex items-center">
                    <Mic size={12} className="mr-1" /> Mic active
                  </span>
                )}
                {cameraActive && (
                  <span className="ml-2 px-2 py-1 bg-red-100 text-red-600 rounded-full text-xs flex items-center">
                    <Video size={12} className="mr-1" /> Camera active
                  </span>
                )}
              </h3>
              <button 
                className="p-1 rounded-full hover:bg-slate-200 transition-colors"
                onClick={handleCloseCanvas}
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 bg-slate-50 relative">
              {/* Camera Avatar */}
              {cameraActive && (
                <div className="absolute bottom-8 right-8 z-10 transition-all duration-300 ease-in-out">
                  <div className="group relative">
                    {/* User Avatar with Camera Feed */}
                    <div className="w-36 h-36 rounded-xl overflow-hidden shadow-lg bg-gray-900 ring-4 ring-indigo-500 ring-opacity-70 transition-all duration-300 hover:ring-opacity-100">
                      <video 
                        ref={videoRef} 
                        className="w-full h-full object-cover"
                        autoPlay 
                        playsInline
                        muted
                      />
                    </div>
                    
                    {/* Camera Indicator Circle */}
                    <div className="absolute -top-2 -right-2 bg-red-500 p-2 rounded-full shadow-md flex items-center justify-center">
                      <Camera size={14} className="text-white" />
                    </div>
                    
                    {/* User Label */}
                    <div className="absolute -bottom-2 inset-x-0 bg-indigo-600 py-1 px-3 text-white text-xs font-medium text-center rounded-b-xl opacity-90">
                      You
                    </div>
                  </div>
                </div>
              )}
              
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <CanvasArea
                  content={canvasContent.content}
                  contentType={canvasContent.contentType}
                  language={canvasContent.language}
                  title={canvasContent.title}
                />
              </div>
            </div>
          </div>
        )}     
      </div>
    </div>
  );
};

export default ChatInterface;