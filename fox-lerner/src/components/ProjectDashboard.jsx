import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  ThumbsUp, 
  ThumbsDown, 
  HelpCircle, 
  X, 
  Smile, 
  ArrowLeft, 
  CheckSquare, 
  ChevronDown, 
  FileText,
  Youtube,
  Github,
  UploadCloud,
  Mic,
  Video,
  MessageSquare,
  Camera
} from 'lucide-react';
import CanvasArea from './CanvasArea'; // Import CanvasArea

const ProjectDashboard = ({ projectId, projectName, onBackClick }) => {
  const [activeTab, setActiveTab] = useState('overview');  
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);
  const [showCanvas, setShowCanvas] = useState(false);
  const [canvasContent, setCanvasContent] = useState({
    content: "",
    contentType: "text",
    language: "markdown", // Changed to markdown for consistency
    title: "Project Details"
  });
  
  const [projectData, setProjectData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const inputRef = useRef(null);
  
  // Dropdown state for project views
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedOption, setSelectedOption] = useState('tasks');
  
  // New dropdown for projects
  const [showProjectDropdown, setShowProjectDropdown] = useState(false);
  const [selectedProject, setSelectedProject] = useState("current");

  // File-upload & external resource states
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const [showExternalSourceModal, setShowExternalSourceModal] = useState(false);
  const [externalSourceType, setExternalSourceType] = useState('youtube');
  const [youtubeLink, setYoutubeLink] = useState('');
  const [githubProfile, setGithubProfile] = useState('');
  
  // New states for explanation and media (similar to ChatInterface)
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
  
  // Simulate loading project data when projectId changes
  useEffect(() => {
    setIsLoading(true);
    
    setTimeout(() => {
      setProjectData({
        id: projectId,
        name: projectName || 'Project Name',
        description: 'This is a study project for the semester',
        dueDate: '2025-05-15',
        completion: 45,
        tasks: [
          { id: 1, title: 'Research chapter 3 material', status: 'completed', dueDate: '2025-04-28' },
          { id: 2, title: 'Create study outline for midterm', status: 'in-progress', dueDate: '2025-05-01' },
          { id: 3, title: 'Review lecture notes', status: 'in-progress', dueDate: '2025-05-03' },
          { id: 4, title: 'Complete practice questions', status: 'not-started', dueDate: '2025-05-05' },
          { id: 5, title: 'Schedule study group meeting', status: 'not-started', dueDate: '2025-05-07' }
        ],
        notes: [
          { id: 1, title: 'Key concepts from lecture 4', content: 'Important points about key theories and their applications in the real world...', lastEdited: '2025-04-23' },
          { id: 2, title: 'Study group discussion notes', content: 'We discussed the main concepts from chapter 5 and decided to focus on...', lastEdited: '2025-04-20' },
          { id: 3, title: 'Question for professor', content: 'Need to ask about the relationship between concepts A and B...', lastEdited: '2025-04-18' },
          { id: 4, title: 'Research findings', content: 'Key papers found on the topic include Smith (2023) and Johnson (2024)...', lastEdited: '2025-04-15' }
        ],
        resources: [
          { id: 1, title: 'Core textbook chapters 3-5', type: 'reading', source: 'Textbook' },
          { id: 2, title: 'Supplementary article on topic', type: 'article', source: 'Journal' },
          { id: 3, title: 'Lecture slides - Week 4', type: 'slides', source: 'Course material' },
          { id: 4, title: 'Practice exam', type: 'assessment', source: 'Course material' },
          { id: 5, title: 'YouTube tutorial series', type: 'video', source: 'External' },
          { id: 6, title: 'Study guide', type: 'document', source: 'Self-created' }
        ]
      });
      
      setIsLoading(false);
    }, 800);
  }, [projectId, projectName]);

  // Typing effect
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

  // Update canvas content as typing occurs
  useEffect(() => {
    if (currentExplanation) {
      setCanvasContent(prev => ({
        ...prev,
        content: currentExplanation
      }));
    }
  }, [currentExplanation]);

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
      if (showProjectDropdown && !event.target.closest('.project-dropdown-container')) {
        setShowProjectDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDropdown, showProjectDropdown]);

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return 'bg-green-100 text-green-700';
      case 'in-progress': return 'bg-blue-100 text-blue-700';
      case 'not-started': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };
  
  const getStatusLabel = (status) => {
    switch(status) {
      case 'completed': return 'Completed';
      case 'in-progress': return 'In Progress';
      case 'not-started': return 'Not Started';
      default: return status;
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // ---------- File & External resource handlers ----------
  const handleAddFile = () => setShowFileUpload(!showFileUpload);

  const handleSelectFile = () => fileInputRef.current?.click();

  const handleFileInputChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) processFiles(files);
  };

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e) => { e.preventDefault(); setIsDragging(false); };
  const handleDrop = (e) => {
    e.preventDefault(); setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) processFiles(files);
  };

  const processFiles = (files) => {
    const fileNames = Array.from(files).map(f => f.name).join(', ');
    alert(`Files received: ${fileNames}`);
    setShowFileUpload(false);
  };

  const handleAddExternalSource = () => setShowExternalSourceModal(true);
  const handleCloseExternalSourceModal = () => setShowExternalSourceModal(false);
  const handleExternalSourceTypeChange = (type) => setExternalSourceType(type);

  const handleSubmitExternalSource = () => {
    if (externalSourceType === 'youtube' && youtubeLink) {
      alert(`YouTube link added: ${youtubeLink}`);
      setYoutubeLink('');
    } else if (externalSourceType === 'github' && githubProfile) {
      alert(`GitHub profile added: ${githubProfile}`);
      setGithubProfile('');
    }
    setShowExternalSourceModal(false);
  };

  // ---------- Media Handlers ----------
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

  // ---------- Chat logic ----------
  const handleSendMessage = () => {
    if (inputText.trim() === '') return;
    
    setMessages([...messages, { type: 'user', content: inputText }]);
    setInputText('');
    
    const userQuery = inputText.toLowerCase();
    setTimeout(() => {
      let response;
      
      if (userQuery.includes('task') || userQuery.includes('to do')) {
        response = `You have ${projectData.tasks.length} tasks in this project. ${projectData.tasks.filter(t => t.status === 'completed').length} tasks are completed.`;
        // Removed showTaskDetails() to avoid auto-opening canvas
      } else if (userQuery.includes('note') || userQuery.includes('document')) {
        response = `You have ${projectData.notes.length} notes in this project.`;
      } else if (userQuery.includes('resource') || userQuery.includes('material')) {
        response = `You have ${projectData.resources.length} resources available for this project.`;
      } else if (userQuery.includes('progress') || userQuery.includes('status')) {
        response = `This project is ${projectData.completion}% complete. The due date is ${formatDate(projectData.dueDate)}.`;
      } else {
        response = `I can help you manage your project "${projectData.name}". You can ask about tasks, notes, resources, or progress.`;
      }
      
      setMessages(prev => [...prev, { type: 'assistant', content: response }]);
    }, 1000);
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setShowDropdown(false);
  };
  
  const handleProjectSelect = (project) => {
    setSelectedProject(project);
    setShowProjectDropdown(false);
  };
  
  // ---------- Canvas Content Generators ----------
  const showProjectOverview = () => {
    setShowCanvas(true);
    setCanvasContent({
      content: `
# ${projectData.name}

**Description:** ${projectData.description}

**Progress:** ${projectData.completion}% Complete

**Due Date:** ${formatDate(projectData.dueDate)}

## Summary
- Tasks: ${projectData.tasks.length} total (${projectData.tasks.filter(t => t.status === 'completed').length} completed)
- Notes: ${projectData.notes.length}
- Resources: ${projectData.resources.length}
      `,
      contentType: "text/markdown",
      language: "markdown",
      title: "Project Overview"
    });
  };
  
  const showTaskDetails = () => {
    setShowCanvas(true);
    const taskList = projectData.tasks.map(task => 
      `- [${task.status === 'completed' ? 'x' : ' '}] **${task.title}** (Due: ${formatDate(task.dueDate)}) - ${getStatusLabel(task.status)}`
    ).join('\n');
    
    setCanvasContent({
      content: `
# Tasks for ${projectData.name}

${taskList}
      `,
      contentType: "text/markdown",
      language: "markdown",
      title: "Project Tasks"
    });
  };
  
  const showNoteDetails = () => {
    setShowCanvas(true);
    const notesList = projectData.notes.map(note => 
      `## ${note.title}\n${note.content}\n\n*Last edited: ${formatDate(note.lastEdited)}*\n\n---\n`
    ).join('\n');
    
    setCanvasContent({
      content: `
# Notes for ${projectData.name}

${notesList}
      `,
      contentType: "text/markdown",
      language: "markdown",
      title: "Project Notes"
    });
  };
  
  const showResourceDetails = () => {
    setShowCanvas(true);
    const resourcesList = projectData.resources.map(resource => 
      `- **${resource.title}** (${resource.type}) - Source: ${resource.source}`
    ).join('\n');
    
    setCanvasContent({
      content: `
# Resources for ${projectData.name}

${resourcesList}
      `,
      contentType: "text/markdown",
      language: "markdown",
      title: "Project Resources"
    });
  };
  
  // Modified handleOpenDetails to mimic ChatInterface's explanation behavior
  const handleOpenDetails = (message) => {
    setSelectedMessage(message);
    setExplainMode("chat"); // Default to chat mode
    
    // Generate explanation based on message content
    const content = message.content.toLowerCase();
    let explanation;
    
    if (content.includes('task')) {
      const taskList = projectData.tasks.map(task => 
        `- [${task.status === 'completed' ? 'x' : ' '}] **${task.title}** (Due: ${formatDate(task.dueDate)}) - ${getStatusLabel(task.status)}`
      ).join('\n');
      explanation = `Here's a simpler explanation of:\n\n"${message.content}"\n\n🦊 Fox explanation:\nThis message is about the tasks in your project "${projectData.name}". You have ${projectData.tasks.length} tasks, with ${projectData.tasks.filter(t => t.status === 'completed').length} completed. Here's the full list:\n\n${taskList}`;
    } else if (content.includes('note')) {
      const notesList = projectData.notes.map(note => 
        `- **${note.title}**: ${note.content.substring(0, 50)}... (Last edited: ${formatDate(note.lastEdited)})`
      ).join('\n');
      explanation = `Here's a simpler explanation of:\n\n"${message.content}"\n\n🦊 Fox explanation:\nThis message refers to the notes in your project "${projectData.name}". You have ${projectData.notes.length} notes. Here's a summary:\n\n${notesList}`;
    } else if (content.includes('resource')) {
      const resourcesList = projectData.resources.map(resource => 
        `- **${resource.title}** (${resource.type}) - Source: ${resource.source}`
      ).join('\n');
      explanation = `Here's a simpler explanation of:\n\n"${message.content}"\n\n🦊 Fox explanation:\nThis message is about the resources available for your project "${projectData.name}". You have ${projectData.resources.length} resources. Here's the list:\n\n${resourcesList}`;
    } else {
      explanation = `Here's a simpler explanation of:\n\n"${message.content}"\n\n🦊 Fox explanation:\nThis message relates to your project "${projectData.name}", which is ${projectData.completion}% complete and due on ${formatDate(projectData.dueDate)}. You can ask about tasks, notes, resources, or progress for more details.`;
    }
    
    // Set up for typing effect
    setFullExplanation(explanation);
    setCurrentExplanation("");
    
    // Initialize canvas content
    setCanvasContent({
      content: "",
      contentType: "text",
      language: "markdown",
      title: `Fox Explanation (${explainMode.charAt(0).toUpperCase() + explainMode.slice(1)} Mode)`
    });
    
    // Show canvas
    setShowCanvas(true);
    
    // Start typing effect
    setTimeout(() => {
      setIsTyping(true);
    }, 50);
  };
  
  const handleCloseCanvas = () => {
    setShowCanvas(false);
    setIsTyping(false);
    setCurrentExplanation("");
    setExplainMode("chat");
    cleanupMediaResources();
  };

  // Option label mapping for display
  const optionLabels = {
    tasks: 'Mode',
    notes: 'Solve',
    resources: 'Memorize',
    overview: 'practice'
  };

  // Project options for dropdown
  const projectOptions = ['Chat1', 'Chat2', 'Chat3'];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left side: Chat area */}
        <div className={`${showCanvas ? 'w-2/5' : 'w-full'} flex flex-col border-r border-slate-100 relative`}>
          {/* Header */}
          <div className="border-b border-slate-100 bg-white p-4 flex items-center justify-between text-slate-700 shadow-sm">
            <div className="flex items-center flex-1">
              <button 
                className="p-2 rounded-full hover:bg-slate-50 transition-colors text-slate-500"
                onClick={onBackClick}
              >
                <ArrowLeft size={20} />
              </button>
              <div className="ml-4 flex items-center">
                <span className="mr-2 text-slate-500"><FileText size={20} /></span>
                <h2 className="font-medium text-lg text-slate-700">{projectData.name}</h2>
              </div>
              <div className="ml-4 option-dropdown-container relative">
                <button 
                  className="py-1 px-3 rounded-full hover:bg-slate-50 transition-colors text-slate-700 flex items-center border border-slate-200"
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  <span className="mr-1 text-sm">{optionLabels[selectedOption]}</span>
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
                        {selectedOption === value && <CheckSquare size={16} className="text-indigo-500" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="project-dropdown-container relative">
              <button 
                className="py-1 px-3 rounded-full hover:bg-slate-50 transition-colors text-slate-700 flex items-center border border-slate-200 text-sm"
                onClick={() => setShowProjectDropdown(!showProjectDropdown)}
              >
                <span className="mr-1">Select chat</span>
                <ChevronDown size={16} />
              </button>
              {showProjectDropdown && (
                <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg py-2 z-10 w-48 border border-slate-100">
                  {projectOptions.map(project => (
                    <button 
                      key={project}
                      className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700 transition-colors flex items-center justify-between"
                      onClick={() => handleProjectSelect(project)}
                    >
                      <span>{project}</span>
                      {selectedProject === project && <CheckSquare size={16} className="text-indigo-500" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto py-4 px-4 bg-slate-50">
            {messages.map((message, index) => (
              <div key={index} className={`mb-6 ${message.type === 'user' ? 'flex justify-end' : ''}`}>
                {message.type === 'assistant' && (
                  <div className="flex">
                    <div className="bg-slate-200 text-slate-600 h-8 w-8 rounded-full flex items-center justify-center mr-3 shadow-sm">
                      <span className="text-sm font-medium">P</span>
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
                          onClick={() => handleOpenDetails(message)}
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
            <div ref={messagesEndRef} />
          </div>
          {/* Input Area */}
          <div className="border-t border-slate-100 bg-white p-4">
            <div className="flex items-center">
              <div className="flex-1 border border-slate-200 rounded-lg flex items-center overflow-hidden bg-white">
                <textarea
                  ref={inputRef}
                  className="flex-1 px-4 py-2 bg-transparent outline-none resize-none text-slate-700"
                  placeholder={`Ask about your project "${projectData.name}"...`}
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
                className={`ml-2 p-2 rounded-lg ${inputText.trim() ? 'bg-indigo-500 text-white hover:bg-indigo-600' : 'bg-slate-100 text-slate-400'} transition-all`}
                onClick={handleSendMessage}
                disabled={!inputText.trim()}
              >
                <Send size={20} />
              </button>
            </div>
            <div className="mt-2 text-center text-xs text-slate-400">
              Ask about tasks, notes, resources, or project progress
            </div>
            <div className="flex justify-center gap-4 mt-4">
              <button 
                className="flex items-center justify-center gap-2 border border-slate-200 rounded-lg py-3 px-4 text-slate-700 font-medium hover:bg-slate-50 transition-all w-full bg-white hover:text-indigo-600 hover:border-indigo-200 group"
                onClick={handleAddFile}
              >
                <div className="bg-indigo-50 p-2 rounded-full text-indigo-500 group-hover:bg-indigo-100 transition-colors">
                  <FileText size={18} />
                </div>
                <span>Add File</span>
              </button>
              <button 
                className="flex items-center justify-center gap-2 border border-slate-200 rounded-lg py-3 px-4 text-slate-700 font-medium hover:bg-slate-50 transition-all w-full bg-white hover:text-indigo-600 hover:border-indigo-200 group"
                onClick={handleAddExternalSource}
              >
                <div className="bg-indigo-50 rounded-full p-2 flex items-center justify-center text-indigo-500 group-hover:bg-indigo-100 transition-colors">
                  <Youtube size={16} className="mr-1" />
                  <span className="mx-1 text-indigo-300">/</span>
                  <Github size={16} className="ml-1" />
                </div>
                <span>Add Resource</span>
              </button>
            </div>
          </div>

          {/* File Upload Overlay */}
          {showFileUpload && (
            <div className="file-upload-container absolute bottom-20 left-0 right-0 mx-4 bg-white rounded-lg shadow-lg border border-slate-200 overflow-hidden z-20">
              <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                <h3 className="font-medium text-slate-700">Upload Files</h3>
                <button 
                  className="p-1 rounded-full hover:bg-slate-100 text-slate-500"
                  onClick={() => setShowFileUpload(false)}
                >
                  <X size={18} />
                </button>
              </div>
              <div 
                className={`p-8 flex flex-col items-center justify-center text-center ${isDragging ? 'bg-indigo-50' : 'bg-white'}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className={`p-4 rounded-full ${isDragging ? 'bg-indigo-100 text-indigo-600' : 'bg-white text-indigo-500'} shadow-sm mb-4`}>
                  <UploadCloud size={40} />
                </div>
                <h4 className="text-lg font-medium text-slate-700 mb-2">
                  {isDragging ? 'Drop files here' : 'Drag & drop files here'}
                </h4>
                <p className="text-slate-500 mb-4">or</p>
                <button 
                  className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors shadow-sm"
                  onClick={handleSelectFile}
                >
                  Select from your computer
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  onChange={handleFileInputChange} 
                  multiple 
                />
                <p className="mt-4 text-xs text-slate-400">
                  Supported file types: PDF, DOC, DOCX, TXT, JPG, PNG
                </p>
              </div>
            </div>
          )}

          {/* External Resource Modal */}
          {showExternalSourceModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-white/75 z-50">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-slate-200">
                  <h3 className="font-medium text-lg text-slate-700">Add External Resource</h3>
                  <button 
                    className="p-1 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
                    onClick={handleCloseExternalSourceModal}
                  >
                    <X size={20} />
                  </button>
                </div>
                <div className="flex border-b border-slate-200">
                  <button 
                    className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${externalSourceType === 'youtube' ? 'bg-white text-indigo-600 border-b-2 border-indigo-500' : 'text-slate-600 hover:bg-slate-50'}`}
                    onClick={() => handleExternalSourceTypeChange('youtube')}
                  >
                    <div className="flex items-center justify-center">
                      <Youtube size={18} className="mr-2" />
                      <span>YouTube Link</span>
                    </div>
                  </button>
                  <button 
                    className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${externalSourceType === 'github' ? 'bg-white text-indigo-600 border-b-2 border-indigo-500' : 'text-slate-600 hover:bg-slate-50'}`}
                    onClick={() => handleExternalSourceTypeChange('github')}
                  >
                    <div className="flex items-center justify-center">
                      <Github size={18} className="mr-2" />
                      <span>GitHub Profile</span>
                    </div>
                  </button>
                </div>
                <div className="p-4">
                  {externalSourceType === 'youtube' ? (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Add YouTube Link</label>
                      <input 
                        type="text" 
                        className="w-full p-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                        placeholder="https://www.youtube.com/watch?v=..."
                        value={youtubeLink}
                        onChange={(e) => setYoutubeLink(e.target.value)}
                      />
                    </div>
                  ) : (
                    <div className="py-4">
                      <button 
                        className="w-full flex items-center justify-start cursor-pointer gap-4 bg-white hover:bg-white text-slate-800 font-medium py-4 px-6 rounded-lg border border-slate-200 shadow-md hover:shadow-lg transition-all duration-300"
                        onClick={() => console.log('Connect to GitHub clicked')}
                      >
                        <div className="flex items-center justify-center h-12 w-12 bg-gray-900 rounded-full text-white">
                          <Github size={24} className="text-white" />
                        </div>
                        <div className="text-left">
                          <div className="text-lg font-semibold text-slate-800">CONNECT TO GITHUB</div>
                          <div className="text-sm text-slate-500">Access code repositories for this project</div>
                        </div>
                      </button>
                    </div>
                  )}
                </div>
                <div className="p-4 bg-white flex justify-end">
                  <button 
                    className="px-4 py-2 bg-slate-200 text-slate-700 rounded-md hover:bg-slate-300 transition-colors mr-2"
                    onClick={handleCloseExternalSourceModal}
                  >
                    Cancel
                  </button>
                  <button 
                    className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition-colors"
                    onClick={handleSubmitExternalSource}
                    disabled={(externalSourceType === 'youtube' && !youtubeLink) || (externalSourceType === 'github' && !githubProfile)}
                  >
                    Add Resource
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        {/* Right side: Canvas Area */}
        {showCanvas && (
          <div className="w-3/5 flex flex-col relative">
            <div className="bg-white p-3 flex justify-between items-center text-black z-10">
              <h3 className="font-medium flex items-center">
                <span className="mr-2 text-lg">🦊</span> 
                {canvasContent.title}
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

export default ProjectDashboard;