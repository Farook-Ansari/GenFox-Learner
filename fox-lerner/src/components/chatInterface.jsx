import React, { useState, useRef, useEffect } from 'react';
import { Send, ThumbsUp, ThumbsDown, HelpCircle, X, Smile, ArrowLeft, Mic, Video, MessageSquare, Camera, ChevronDown, Check, BookmarkPlus } from 'lucide-react';
import CanvasArea from './CanvasArea';

const ChatInterface = ({ category, categoryIcon, categoryColor, onBackClick, initialQuestion = '', addNote, onNavigate }) => {
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
  
  const [isTyping, setIsTyping] = useState(false);
  const [fullExplanation, setFullExplanation] = useState("");
  const [currentExplanation, setCurrentExplanation] = useState("");
  const typingSpeedRef = useRef(10); // milliseconds per character

  const [explainMode, setExplainMode] = useState("chat"); // "chat", "audio", or "video"
  const [micActive, setMicActive] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  
  const videoRef = useRef(null);
  const mediaStreamRef = useRef(null);

  const inputRef = useRef(null);
  
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedOption, setSelectedOption] = useState('solve');
  const [optionSelected, setOptionSelected] = useState(true);
  
  const [showChatDropdown, setShowChatDropdown] = useState(false);
  const [selectedChat, setSelectedChat] = useState("chat1");
  const [chatSelected, setChatSelected] = useState(false);
  
  const [showAddNoteMenu, setShowAddNoteMenu] = useState(false);
  const [selectedText, setSelectedText] = useState("");
  const [noteMenuPosition, setNoteMenuPosition] = useState({ top: 0, left: 0 });
  
  const canvasRef = useRef(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = '44px';
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
  }, [inputText]);
  
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
  
  useEffect(() => {
    if (!showCanvas) {
      cleanupMediaResources();
    }
  }, [showCanvas]);
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDropdown && !event.target.closest('.option-dropdown-container')) {
        setShowDropdown(false);
      }
      if (showChatDropdown && !event.target.closest('.chat-dropdown-container')) {
        setShowChatDropdown(false);
      }
      if (showAddNoteMenu && !event.target.closest('.add-note-menu')) {
        setShowAddNoteMenu(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDropdown, showChatDropdown, showAddNoteMenu]);
  
  useEffect(() => {
    const handleTextSelection = () => {
      const selection = window.getSelection();

      if (selection && selection.toString().trim().length > 0) {
        if (canvasRef.current && canvasRef.current.contains(selection.anchorNode)) {
          const selectedText = selection.toString().trim();
          setSelectedText(selectedText);

          const range = selection.getRangeAt(0);
          const rect = range.getBoundingClientRect();

          const canvasRect = canvasRef.current.getBoundingClientRect();
          const canvasScrollTop = canvasRef.current.scrollTop;
          const canvasScrollLeft = canvasRef.current.scrollLeft;

          const menuWidth = 120;
          const menuHeight = 40;

          const relativeTop = rect.top - canvasRect.top + canvasScrollTop - menuHeight - 10;
          const relativeLeft = rect.left - canvasRect.left + canvasScrollLeft + (rect.width / 2) - (menuWidth / 2);

          setNoteMenuPosition({
            top: relativeTop,
            left: relativeLeft
          });

          setShowAddNoteMenu(true);
        }
      } else {
        setShowAddNoteMenu(false);
      }
    };

    document.addEventListener('mouseup', handleTextSelection);
    return () => document.removeEventListener('mouseup', handleTextSelection);
  }, []);
  
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
    if (inputText.trim() === '' || !selectedOption) return;
    
    setMessages([...messages, { type: 'user', content: inputText }]);
    setInputText('');
    
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
      if ((mode === "audio" && !micActive) || (mode === "video" && !cameraActive)) {
        requestMediaPermissions(mode);
      }
    } else {
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
          
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play().catch(err => console.error("Error playing video:", err));
          }
        }
      })
      .catch(err => {
        console.error("Media permissions denied:", err);
        alert(`Please allow ${mode === "audio" ? "microphone" : "camera and microphone"} access to use this feature.`);
        setExplainMode("chat");
      });
  };
  
  const handleOpenExplainOptions = (message) => {
    setSelectedMessage(message);
    setExplainMode("chat");
    startExplanation(message);
  };
  
  const startExplanation = (message) => {
    const explanation = `Here's a simpler explanation of:\n\n"${message}"\n\n🦊 Fox explanation:\nThis means the AI assistant is giving you a placeholder response about ${category}. In a real app, this would be replaced with an actual helpful answer based on your question.`;
    
    setCanvasContent({
      content: "",
      contentType: "text",
      title: `Fox Explanation (${explainMode.charAt(0).toUpperCase() + explainMode.slice(1)} Mode)`
    });
    
    setFullExplanation(explanation);
    setCurrentExplanation("");
    
    setShowCanvas(true);
    
    setTimeout(() => {
      setIsTyping(true);
    }, 50);
  };
  
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
      if (selectedOption) {
        handleSendMessage();
      } else {
        alert("Please select an option first (Solve, Memorize, or Practice)");
      }
    }
  };
  
  const handleOptionSelect = (option) => {
    console.log(`Selected option: ${option}`);
    const previousOption = selectedOption;
    setSelectedOption(option);
    setShowDropdown(false);
    setOptionSelected(true);
    
    if (option === 'memorize' && previousOption !== 'memorize') {
      const learningMessage = `This is a learning session for ${category}. We'll help you memorize key concepts through interactive exercises and spaced repetition techniques.`;
      
      startLearningSession(learningMessage);
    } else if (option !== 'memorize' && previousOption === 'memorize') {
      handleCloseCanvas();
    }
  };
  
  const startLearningSession = (message) => {
    const learningContent = `# Learning Session for ${category}\n\nWelcome to your learning session! This canvas will help you memorize key concepts about ${category}.\n\n## Key Points\n\n- Point 1: This is where key learning material would appear\n- Point 2: More detailed explanations would be shown here\n- Point 3: Visual aids and memory techniques would be displayed`;
    
    setCanvasContent({
      content: "",
      contentType: "text",
      title: `Learn With Me: ${category}`
    });
    
    setFullExplanation(learningContent);
    setCurrentExplanation("");
    
    setShowCanvas(true);
    setExplainMode("chat"); // Set default mode to chat when starting a learning session
    
    setTimeout(() => {
      setIsTyping(true);
    }, 50);
  };
  
  const handleChatSelect = (chat) => {
    console.log(`Selected chat: ${chat}`);
    setSelectedChat(chat);
    setShowChatDropdown(false);
    setChatSelected(true);
  };
  
const handleAddNote = () => {
  if (selectedText) {
    const colors = [
      'bg-blue-50 text-blue-500',
      'bg-purple-50 text-purple-500',
      'bg-green-50 text-green-500',
      'bg-orange-50 text-orange-500',
      'bg-red-50 text-red-500',
      'bg-indigo-50 text-indigo-500'
    ];

    const newNote = {
      id: Date.now(),
      subject: category,
      content: selectedText,
      timestamp: new Date().toISOString(),
      color: colors[Math.floor(Math.random() * colors.length)]
    };

    addNote(newNote);
    setShowAddNoteMenu(false);

    alert(`Note added: "${selectedText.substring(0, 30)}${selectedText.length > 30 ? '...' : ''}"`);

    if (onNavigate) {
      onNavigate('notes'); // This correctly navigates to notes
    }
  }
};
  
  const optionLabels = {
    solve: 'Teach Me',
    memorize: 'LearnWithMe',
    practice: 'Quiz Me'
  };
  
  const chatOptions = ['chat1', 'chat2', 'chat3'];
  
  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex-1 flex overflow-hidden">
        <div className={`${showCanvas ? 'w-2/5' : 'w-full'} flex flex-col border-r border-slate-100`}>
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
          
          <div className="border-t border-slate-100 bg-white p-4">
            <div className="flex items-center">
              <div className="flex-1 border border-slate-200 rounded-lg flex items-center overflow-hidden bg-white">
                <textarea
                  ref={inputRef}
                  className="flex-1 px-4 py-2 bg-transparent outline-none resize-none text-slate-700"
                  placeholder={`Ask about ${category} in ${selectedChat}...`}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  rows={1}
                  style={{ minHeight: '40px', maxHeight: '100px' }}
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
                AI responses may contain inaccuracies. Please verify important information.
              </p>
            </div>
          </div>
        </div>
        
        {showCanvas && (
          <div className="w-3/5 flex flex-col relative">
            <div className="bg-white p-3 flex justify-between items-center text-black z-10">
              <h3 className="font-medium flex items-center">
                {selectedOption === 'memorize' ? (
                  <>
                    <span className="mr-2 text-lg">📚</span> 
                    Learn With Me: {category}
                    {isTyping && (
                      <span className="ml-2 inline-flex">
                        <span className="animate-pulse">.</span>
                        <span className="animate-pulse delay-100">.</span>
                        <span className="animate-pulse delay-200">.</span>
                      </span>
                    )}
                  </>
                ) : (
                  <>
                    <span className="mr-2 text-lg">🦊</span> 
                    Fox Explanation
                    {isTyping && (
                      <span className="ml-2 inline-flex">
                        <span className="animate-pulse">.</span>
                        <span className="animate-pulse delay-100">.</span>
                        <span className="animate-pulse delay-200">.</span>
                      </span>
                    )}
                  </>
                )}
                
                {/* Removed the condition so the controls show regardless of mode */}
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
              {showAddNoteMenu && (
                <div 
                  className="add-note-menu absolute bg-white rounded-lg shadow-lg py-2 px-4 z-20 flex items-center border border-indigo-100"
                  style={{ 
                    top: `${noteMenuPosition.top}px`, 
                    left: `${noteMenuPosition.left}px`
                  }}
                >
                  <button 
                    className="flex items-center gap-1 text-indigo-600 text-sm font-medium hover:text-indigo-800 transition-colors"
                    onClick={handleAddNote}
                  >
                    <BookmarkPlus size={16} />
                    Add note
                  </button>
                </div>
              )}
              
              {cameraActive && (
                <div className="absolute bottom-8 right-8 z-10 transition-all duration-300 ease-in-out">
                  <div className="group relative">
                    <div className="w-36 h-36 rounded-xl overflow-hidden shadow-lg bg-gray-900 ring-4 ring-indigo-500 ring-opacity-70 transition-all duration-300 hover:ring-opacity-100">
                      <video 
                        ref={videoRef} 
                        className="w-full h-full object-cover"
                        autoPlay 
                        playsInline
                        muted
                      />
                    </div>
                    
                    <div className="absolute -top-2 -right-2 bg-red-500 p-2 rounded-full shadow-md flex items-center justify-center">
                      <Camera size={14} className="text-white" />
                    </div>
                    
                    <div className="absolute -bottom-2 inset-x-0 bg-indigo-600 py-1 px-3 text-white text-xs font-medium text-center rounded-b-xl opacity-90">
                      You
                    </div>
                  </div>
                </div>
              )}
              
              <div className="bg-white rounded-lg p-4 shadow-sm" ref={canvasRef}>
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