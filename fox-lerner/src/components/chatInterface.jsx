import React, { useState, useRef, useEffect } from 'react';
import { Send, ThumbsUp, ThumbsDown, HelpCircle, X, Smile, ArrowLeft, Mic, Video, MessageSquare, Camera, ChevronDown, Check, BookmarkPlus, Monitor } from 'lucide-react';
import CanvasArea from './CanvasArea';

// Predefined question-answer flow
const questionAnswerFlow = [
  {
    question: /linear data structures/i,
    chatResponse: "Sure! Linear data structures arrange elements sequentially. Examples include arrays, linked lists, stacks, and queues.",
    canvasContent: {
      content: "Linear Data Structure\nElements are arranged in a sequential manner.",
      contentType: "text",
      title: "Linear Data Structures",
      language: "plaintext"
    }
  },
  {
    question: /Great. Could you explain what an array is?/i,
    chatResponse: "An array is a collection of elements stored at contiguous memory locations, accessible by an index starting from zero.",
    canvasContent: {
      content: "\n\nArray Representation\nIndices from 0 onwards.\n[Element 0, Element 1, Element 2, ...]",
      contentType: "text",
      title: "Linear Data Structures",
      language: "plaintext"
    }
  },
  {
    question: /first element.*index 0/i,
    chatResponse: "Exactly! Would you like to see a visual example and do a quick quiz?",
    canvasContent: {
      content: `\n\nQuiz\nGiven arr = [10, 20, 30, 40], what is arr[2]?\n- 10\n- 20\n- 30\n- 40\n\nMisconception\n❌ Arrays can grow or shrink dynamically.\n✅ Arrays have fixed size once created.\n\nRelated Concepts\n- Linked List: elements connected via pointers.\n- Stack: LIFO principle.\n- Queue: FIFO principle.\nGreat! Would you like to learn about linked lists next or practice more array operations?`,
      contentType: "text",
      title: "Linear Data Structures",
      language: "plaintext"
    }
  }
];

const ChatInterface = ({ category, categoryIcon, categoryColor, onBackClick, initialQuestion = '', addNote, onNavigate }) => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState(initialQuestion);
  const messagesEndRef = useRef(null);
  const [showCanvas, setShowCanvas] = useState(false);
  const [canvasContent, setCanvasContent] = useState({
    content: "",
    contentType: "text",
    language: "plaintext",
    title: "Linear Data Structures"
  });
  const [isTyping, setIsTyping] = useState(false);
  const [fullExplanation, setFullExplanation] = useState("");
  const [currentExplanation, setCurrentExplanation] = useState("");
  const [previousContent, setPreviousContent] = useState("");
  const typingSpeedRef = useRef(10);
  const [explainMode, setExplainMode] = useState("chat");
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
  const [isLearnWithMeMode, setIsLearnWithMeMode] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = '36px';
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
    if (currentExplanation !== "") {
      setCanvasContent(prev => ({
        ...prev,
        content: previousContent + currentExplanation
      }));
    }
  }, [currentExplanation, previousContent]);

  useEffect(() => {
    if (!showCanvas) {
      cleanupMediaResources();
      setIsLearnWithMeMode(false);
      setCanvasContent({
        content: "",
        contentType: "text",
        language: "plaintext",
        title: "Linear Data Structures"
      });
      setPreviousContent("");
      setCurrentExplanation("");
      setFullExplanation("");
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
          const menuWidth = 100;
          const menuHeight = 32;
          const relativeTop = rect.top - canvasRect.top + canvasScrollTop - menuHeight - 8;
          const relativeLeft = rect.left - canvasRect.left + canvasScrollLeft + (rect.width / 2) - (menuWidth / 2);
          setNoteMenuPosition({ top: relativeTop, left: relativeLeft });
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
    if (micActive) setMicActive(false);
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

    const matchedFlow = questionAnswerFlow.find(flow => flow.question.test(inputText));
    const chatResponse = matchedFlow ? matchedFlow.chatResponse : `This is a simulated response about ${category} using the ${selectedOption} approach in ${selectedChat}.`;
    const canvasData = matchedFlow ? matchedFlow.canvasContent : {
      content: `\n\nExplanation of ${inputText}`,
      contentType: "text",
      title: "Linear Data Structures",
      language: "plaintext"
    };

    if (matchedFlow && matchedFlow.question.test(/first element.*index 0/i)) {
      setSelectedOption('practice');
      setOptionSelected(true);
    }

    setTimeout(() => {
      setMessages(prev => [...prev, { type: 'assistant', content: chatResponse }]);
      setPreviousContent(canvasContent.content);
      setFullExplanation(canvasData.content);
      setCurrentExplanation("");
      setShowCanvas(true);
      setIsLearnWithMeMode(selectedOption === 'memorize');
      setTimeout(() => setIsTyping(true), 50);
    }, 1000);

    setInputText('');
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
        if (mode === "audio" || mode === "video") setMicActive(true);
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
    setIsLearnWithMeMode(false);
    startExplanation(message);
  };

  const startExplanation = (message) => {
    const explanation = `Here's a simpler explanation of:\n\n"${message}"\n\n🦊 Fox explanation:\nThis means the AI assistant is giving you a placeholder response about ${category}. In a real app, this would be replaced with an actual helpful answer based on your question.`;
    setCanvasContent({
      content: "",
      contentType: "text",
      title: `Fox Explanation (${explainMode.charAt(0).toUpperCase() + explainMode.slice(1)} Mode)`,
      language: "plaintext"
    });
    setPreviousContent("");
    setFullExplanation(explanation);
    setCurrentExplanation("");
    setShowCanvas(true);
    setTimeout(() => setIsTyping(true), 50);
  };

  const handleCloseCanvas = () => {
    setShowCanvas(false);
    setIsTyping(false);
    setCurrentExplanation("");
    setExplainMode("chat");
    setIsLearnWithMeMode(false);
    cleanupMediaResources();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (selectedOption) handleSendMessage();
      else alert("Please select an option first (Solve, Memorize, or Practice)");
    }
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setShowDropdown(false);
    setOptionSelected(true);
    setIsLearnWithMeMode(option === 'memorize');
  };

  const startLearningSession = (message) => {
    const learningContent = `# Learning Session for ${category}\n\nWelcome to your learning session! This canvas will help you memorize key concepts about ${category}.\n\n## Key Points\n\n- Point 1: This is where key learning material would appear\n- Point 2: More detailed explanations would be shown here\n- Point 3: Visual aids and memory techniques would be displayed`;
    setCanvasContent({
      content: "",
      contentType: "text",
      title: `Learn With Me: ${category}`,
      language: "plaintext"
    });
    setPreviousContent("");
    setFullExplanation(learningContent);
    setCurrentExplanation("");
    setShowCanvas(true);
    setExplainMode("chat");
    setIsLearnWithMeMode(true);
    setTimeout(() => setIsTyping(true), 50);
  };

  const handleChatSelect = (chat) => {
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
      if (onNavigate) onNavigate('notes');
    }
  };

  const optionLabels = {
    solve: 'Teach Me',
    memorize: 'Learn With Me',
    practice: 'Quiz Me'
  };

  const chatOptions = ['chat1', 'chat2', 'chat3'];

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex-1 flex">
        {/* Chat Interface */}
        <div className={`${showCanvas ? 'w-2/5' : 'w-full'} flex flex-col border-r border-slate-100`}>
          {/* Chat Header - Sticky */}
          <div className="sticky top-0 z-10 border-b border-slate-100 bg-white p-3 flex items-center justify-between text-slate-700 shadow-sm">
            <div className="flex items-center flex-1">
              <button
                className="p-1 rounded-full hover:bg-slate-50 transition-colors text-slate-500"
                onClick={onBackClick}
              >
                <ArrowLeft size={16} />
              </button>
              <div className="ml-2 flex items-center">
                <span className="mr-1 text-sm text-slate-500">{categoryIcon}</span>
                <h2 className="font-medium text-sm text-slate-700">{category}</h2>
              </div>
              <div className="ml-2 option-dropdown-container relative">
                <button
                  className="py-1 px-2 rounded-full hover:bg-slate-50 transition-colors text-slate-700 flex items-center border border-slate-200 text-xs"
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  {selectedOption ? (
                    <span className="mr-1">{optionLabels[selectedOption]}</span>
                  ) : (
                    <span className="mr-1">Select</span>
                  )}
                  <ChevronDown size={12} />
                </button>
                {showDropdown && (
                  <div className="absolute left-0 top-full mt-1 bg-white rounded-lg shadow-lg py-1 z-10 w-32 border border-slate-100">
                    {Object.entries(optionLabels).map(([value, label]) => (
                      <button
                        key={value}
                        className="w-full text-left px-3 py-1 hover:bg-slate-50 text-slate-700 transition-colors flex items-center justify-between text-xs"
                        onClick={() => handleOptionSelect(value)}
                      >
                        <span>{label}</span>
                        {selectedOption === value && <Check size={12} className="text-indigo-500" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="chat-dropdown-container relative">
              <button
                className="py-1 px-2 rounded-full hover:bg-slate-50 transition-colors text-slate-700 flex items-center border border-slate-200 text-xs"
                onClick={() => setShowChatDropdown(!showChatDropdown)}
              >
                {chatSelected ? (
                  <span className="mr-1">{selectedChat}</span>
                ) : (
                  <span className="mr-1">Chats in this "{category}"</span>
                )}
                <ChevronDown size={12} />
              </button>
              {showChatDropdown && (
                <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg py-1 z-10 w-40 border border-slate-100">
                  {chatOptions.map((chat) => (
                    <button
                      key={chat}
                      className="w-full text-left px-3 py-1 hover:bg-slate-50 text-slate-700 transition-colors flex items-center justify-between text-xs"
                      onClick={() => handleChatSelect(chat)}
                    >
                      <span>{chat}</span>
                      {selectedChat === chat && <Check size={12} className="text-indigo-500" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Chat Content - Scrollable */}
          <div
            className="overflow-y-auto py-3 px-3 bg-slate-50"
            style={{ height: 'calc(100vh - 64px - 96px)' }}
          >
            {messages.map((message, index) => (
              <div key={index} className={`mb-4 ${message.type === 'user' ? 'flex justify-end' : ''}`}>
                {message.type === 'assistant' && (
                  <div className="flex">
                    <div className="bg-slate-200 text-slate-600 h-6 w-6 rounded-full flex items-center justify-center mr-2 shadow-sm">
                      <span className="text-xs font-medium">AI</span>
                    </div>
                    <div className="max-w-2xl">
                      <div className="p-3 bg-white rounded-lg shadow-sm mt-5">
                        <p className="text-sm text-slate-700">{message.content}</p>
                      </div>
                      <div className="mt-1 flex gap-1">
                        <button className="p-1 rounded-full hover:bg-white text-slate-400 transition-colors">
                          <ThumbsUp size={12} />
                        </button>
                        <button className="p-1 rounded-full hover:bg-white text-slate-400 transition-colors">
                          <ThumbsDown size={12} />
                        </button>
                        {selectedOption !== 'memorize' && (
                          <button
                            className="px-1 py-0.5 rounded-full hover:bg-white text-slate-500 flex items-center transition-colors"
                            onClick={() => handleOpenExplainOptions(message.content)}
                          >
                            <HelpCircle size={12} />
                            <span className="ml-1 text-xs">Explain it Fox</span>
                          </button>
                        )}
                        {selectedOption === 'memorize' && (
                          <button
                            className="px-1 py-0.5 rounded-full hover:bg-white text-slate-500 flex items-center transition-colors"
                            onClick={() => startLearningSession(message.content)}
                          >
                            <BookmarkPlus size={12} />
                            <span className="ml-1 text-xs">Explain It Fox</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                {message.type === 'user' && (
                  <div className="max-w-sm bg-indigo-500 text-white rounded-lg p-2 shadow-sm mt-13">
                    <p className="text-sm">{message.content}</p>
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area - Pinned to Bottom */}
          <div className="border-t border-slate-100 bg-white p-3">
            {isLearnWithMeMode && (
              <div className="mb-2 flex justify-center">
                <div className="flex gap-1 bg-slate-50 rounded-lg p-1 shadow-sm">
                  <button
                    className={`p-1 rounded-full hover:bg-slate-100 transition-colors ${explainMode === "chat" ? "bg-indigo-100 text-indigo-600" : "text-slate-400"}`}
                    onClick={() => handleSelectExplainMode("chat")}
                    title="Screen share"
                  >
                    <Monitor size={14} />
                  </button>
                  <button
                    className={`p-1 rounded-full hover:bg-slate-100 transition-colors ${explainMode === "audio" ? "bg-indigo-100 text-indigo-600" : "text-slate-400"}`}
                    onClick={() => handleSelectExplainMode("audio")}
                    title="Voice explanation"
                  >
                    <Mic size={14} />
                  </button>
                  <button
                    className={`p-1 rounded-full hover:bg-slate-100 transition-colors ${explainMode === "video" ? "bg-indigo-100 text-indigo-600" : "text-slate-400"}`}
                    onClick={() => handleSelectExplainMode("video")}
                    title="Video explanation"
                  >
                    <Video size={14} />
                  </button>
                  {micActive && (
                    <span className="ml-1 px-1 py-0.5 bg-red-100 text-red-600 rounded-full text-xs flex items-center">
                      <Mic size={10} className="mr-0.5" /> Active
                    </span>
                  )}
                  {cameraActive && (
                    <span className="ml-1 px-1 py-0.5 bg-red-100 text-red-600 rounded-full text-xs flex items-center">
                      <Video size={10} className="mr-0.5" /> Active
                    </span>
                  )}
                </div>
              </div>
            )}
            <div className="flex items-center">
              <div className="flex-1 border border-slate-200 rounded-lg flex items-center overflow-hidden bg-white">
                <textarea
                  ref={inputRef}
                  className="flex-1 px-3 py-1.5 bg-transparent outline-none resize-none text-sm text-slate-700"
                  placeholder={`Ask about ${category} in ${selectedChat}...`}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  rows={1}
                  style={{ minHeight: '36px', maxHeight: '80px' }}
                />
                <button className="p-1 text-slate-300 hover:text-slate-500">
                  <Smile size={16} />
                </button>
              </div>
              <button
                className={`ml-1 p-1 rounded-lg ${inputText.trim() && selectedOption ? 'bg-indigo-500 text-white hover:bg-indigo-600' : 'bg-slate-100 text-slate-400'} transition-all`}
                onClick={handleSendMessage}
                disabled={!inputText.trim() || !selectedOption}
              >
                <Send size={16} />
              </button>
            </div>
            <div className="mt-1">
              <p className="text-xs text-slate-400 text-center">
                AI responses may contain inaccuracies. Please verify important information.
              </p>
            </div>
          </div>
        </div>

        {/* Canvas Area */}
        {showCanvas && (
          <div className="w-3/5 flex flex-col relative">
            {/* Canvas Header - Sticky */}
            <div className="sticky top-0 z-10 bg-white p-2 flex justify-between items-center text-black shadow-sm">
              <h3 className="font-medium flex items-center text-sm">
                {isLearnWithMeMode ? (
                  <>
                    <span className="mr-1 text-base">📚</span>
                    Learn With Me: {category}
                    {isTyping && (
                      <span className="ml-1 inline-flex">
                        <span className="animate-pulse">.</span>
                        <span className="animate-pulse delay-100">.</span>
                        <span className="animate-pulse delay-200">.</span>
                      </span>
                    )}
                  </>
                ) : (
                  <>
                    <span className="mr-1 text-base">🦊</span>
                    {canvasContent.title}
                    {isTyping && (
                      <span className="ml-1 inline-flex">
                        <span className="animate-pulse">.</span>
                        <span className="animate-pulse delay-100">.</span>
                        <span className="animate-pulse delay-200">.</span>
                      </span>
                    )}
                    <div className="ml-2 flex gap-1">
                      <button
                        className={`p-1 rounded-full hover:bg-slate-100 transition-colors ${explainMode === "chat" ? "bg-indigo-100 text-indigo-600" : "text-slate-400"}`}
                        onClick={() => handleSelectExplainMode("chat")}
                        title="Text explanation"
                      >
                        <MessageSquare size={12} />
                      </button>
                      <button
                        className={`p-1 rounded-full hover:bg-slate-100 transition-colors ${explainMode === "audio" ? "bg-indigo-100 text-indigo-600" : "text-slate-400"}`}
                        onClick={() => handleSelectExplainMode("audio")}
                        title="Voice explanation"
                      >
                        <Mic size={12} />
                      </button>
                      <button
                        className={`p-1 rounded-full hover:bg-slate-100 transition-colors ${explainMode === "video" ? "bg-indigo-100 text-indigo-600" : "text-slate-400"}`}
                        onClick={() => handleSelectExplainMode("video")}
                        title="Video explanation"
                      >
                        <Video size={12} />
                      </button>
                      {micActive && (
                        <span className="ml-1 px-1 py-0.5 bg-red-100 text-red-600 rounded-full text-xs flex items-center">
                          <Mic size={10} className="mr-0.5" /> Mic active
                        </span>
                      )}
                      {cameraActive && (
                        <span className="ml-1 px-1 py-0.5 bg-red-100 text-red-600 rounded-full text-xs flex items-center">
                          <Video size={10} className="mr-0.5" /> Camera active
                        </span>
                      )}
                    </div>
                  </>
                )}
              </h3>
              <button
                className="p-1 rounded-full hover:bg-slate-200 transition-colors"
                onClick={handleCloseCanvas}
              >
                <X size={14} />
              </button>
            </div>

            {/* Canvas Content - Scrollable */}
            <div
              className="flex-1 overflow-y-auto p-3 bg-slate-50 relative mt-12"
              style={{ height: 'calc(100vh - 60px)' }}
            >
              {showAddNoteMenu && (
                <div
                  className="add-note-menu absolute bg-white rounded-lg shadow-lg py-1 px-3 z-20 flex items-center border border-indigo-100"
                  style={{ top: `${noteMenuPosition.top}px`, left: `${noteMenuPosition.left}px` }}
                >
                  <button
                    className="flex items-center gap-1 text-indigo-600 text-xs font-medium hover:text-indigo-800 transition-colors"
                    onClick={handleAddNote}
                  >
                    <BookmarkPlus size={12} />
                    Add note
                  </button>
                </div>
              )}
              {cameraActive && (
                <div className="absolute bottom-6 right-6 z-10 transition-all duration-300 ease-in-out">
                  <div className="group relative">
                    <div className="w-28 h-28 rounded-xl overflow-hidden shadow-lg bg-gray-900 ring-2 ring-indigo-500 ring-opacity-70 transition-all duration-300 hover:ring-opacity-100">
                      <video
                        ref={videoRef}
                        className="w-full h-full object-cover"
                        autoPlay
                        playsInline
                        muted
                      />
                    </div>
                    <div className="absolute -top-1 -right-1 bg-red-500 p-1 rounded-full shadow-md flex items-center justify-center">
                      <Camera size={12} className="text-white" />
                    </div>
                    <div className="absolute -bottom-1 inset-x-0 bg-indigo-600 py-0.5 px-2 text-white text-xs font-medium text-center rounded-b-xl opacity-90">
                      You
                    </div>
                  </div>
                </div>
              )}
              <div className="bg-white rounded-lg p-3 shadow-sm min-h-full" ref={canvasRef}>
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
