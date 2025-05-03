import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, BookOpen, Award, ChevronDown, ChevronUp, Send, Smile, FileText, Youtube, Github, X, UploadCloud } from 'lucide-react';
import ChatInterface from './ChatInterface'; // Import the ChatInterface component

const Syllabus = ({ category, categoryIcon, categoryColor, onBackClick }) => {
  // State to track which modules are expanded
  const [expandedModules, setExpandedModules] = useState({});
  
  // States for text input
  const [inputText, setInputText] = useState('');
  const inputRef = useRef(null);
  
  // States for file upload
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  
  // State for external sources modal
  const [showExternalSourceModal, setShowExternalSourceModal] = useState(false);
  const [externalSourceType, setExternalSourceType] = useState('youtube');
  const [youtubeLink, setYoutubeLink] = useState('');
  const [githubProfile, setGithubProfile] = useState('');
  
  // State to track if we should show the chat interface
  const [showChatInterface, setShowChatInterface] = useState(false);
  // State to store the selected lesson
  const [selectedLesson, setSelectedLesson] = useState(null);
  
  // Auto-adjust textarea height
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = '44px';
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
  }, [inputText]);
  
  // Toggle the expanded state of a module
  const toggleModule = (moduleId) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

  // Example syllabus data - Modules 1 and 2 are fully completed
  const syllabus = {
    modules: [
      {
        id: 1,
        title: 'Introduction to the Subject',
        lessons: [
          { id: 101, title: 'Overview and Key Concepts', completed: true },
          { id: 102, title: 'Historical Context', completed: true },
          { id: 103, title: 'Modern Applications', completed: true }
        ]
      },
      {
        id: 2,
        title: 'Core Principles',
        lessons: [
          { id: 201, title: 'Fundamental Theories', completed: true },
          { id: 202, title: 'Practical Applications', completed: true },
          { id: 203, title: 'Case Studies', completed: true }
        ]
      },
      {
        id: 3,
        title: 'Advanced Topics',
        lessons: [
          { id: 301, title: 'Cutting-edge Research', completed: false },
          { id: 302, title: 'Future Directions', completed: false },
          { id: 303, title: 'Integration with Other Fields', completed: false }
        ]
      },
      {
        id: 4,
        title: 'Practical Implementation',
        lessons: [
          { id: 401, title: 'Real-world Examples', completed: false },
          { id: 402, title: 'Hands-on Project', completed: false },
          { id: 403, title: 'Troubleshooting Guide', completed: false }
        ]
      },
      {
        id: 5,
        title: 'Final Assessment',
        lessons: [
          { id: 501, title: 'Knowledge Review', completed: false },
          { id: 502, title: 'Practical Examination', completed: false },
          { id: 503, title: 'Certification Path', completed: false }
        ]
      }
    ]
  };

  // Calculate total lessons and completed lessons
  const totalLessons = syllabus.modules.reduce((total, module) => total + module.lessons.length, 0);
  const completedLessons = syllabus.modules.reduce((total, module) => 
    total + module.lessons.filter(lesson => lesson.completed).length, 0);
  const completionPercentage = Math.round((completedLessons / totalLessons) * 100);
  
  // Handle sending a message
  const handleSendMessage = () => {
    if (inputText.trim() === '') return;
    
    // In a real app, you'd send this message to your backend
    console.log("Message sent:", inputText);
    alert(`Message sent: ${inputText}`);
    setInputText('');
  };
  
  // Handle key press in the input field
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // File handling functions
  const handleAddFile = () => {
    setShowFileUpload(!showFileUpload);
  };

  const handleSelectFile = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFiles(files);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFiles(files);
    }
  };

  const processFiles = (files) => {
    // Process the files here
    console.log("Files to process:", files);
    
    // Display the files in some way (e.g., alert)
    const fileNames = Array.from(files).map(file => file.name).join(", ");
    alert(`Files received: ${fileNames}`);
    
    // Close the file upload dialog
    setShowFileUpload(false);
  };

  // External source functions
  const handleAddExternalSource = () => {
    setShowExternalSourceModal(true);
  };

  const handleCloseExternalSourceModal = () => {
    setShowExternalSourceModal(false);
  };

  const handleExternalSourceTypeChange = (type) => {
    setExternalSourceType(type);
  };

  const handleSubmitExternalSource = () => {
    // Process the external source based on type
    if (externalSourceType === 'youtube' && youtubeLink) {
      alert(`YouTube link added: ${youtubeLink}`);
      setYoutubeLink('');
    } else if (externalSourceType === 'github' && githubProfile) {
      alert(`GitHub profile added: ${githubProfile}`);
      setGithubProfile('');
    }
    
    // Close the modal
    setShowExternalSourceModal(false);
  };

  // Function to handle lesson click
  const handleLessonClick = (moduleTitle, lesson) => {
    // Generate an initial question based on the lesson title
    const initialQuestion = `Tell me about "${lesson.title}" in the "${moduleTitle}" module.`;
    
    // Store the lesson information
    setSelectedLesson({
      moduleTitle,
      lesson,
      initialQuestion
    });
    
    // Show the chat interface
    setShowChatInterface(true);
  };

  // Function to handle back click from ChatInterface
  const handleChatInterfaceBack = () => {
    setShowChatInterface(false);
    setSelectedLesson(null);
  };

  // If chat interface is shown, render it
  if (showChatInterface && selectedLesson) {
    return (
      <ChatInterface
        category={`${selectedLesson.moduleTitle}: ${selectedLesson.lesson.title}`}
        categoryIcon={categoryIcon}
        categoryColor={categoryColor}
        onBackClick={handleChatInterfaceBack}
        initialQuestion={selectedLesson.initialQuestion}
      />
    );
  }

  return (
    <div className="h-full w-full flex flex-col bg-white" style={{ height: '100vh' }}>
      {/* Header - Fixed height */}
      <div className="flex-none p-4 border-b border-slate-200 flex items-center bg-white">
        <button 
          onClick={onBackClick}
          className="mr-4 p-2 rounded-full hover:bg-slate-100 transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
        
        <div className="flex items-center">
          <div className={`p-2 rounded-lg mr-3 ${categoryColor || 'text-blue-500'}`}>
            {categoryIcon}
          </div>
          <div>
            <h1 className="text-xl font-semibold text-slate-800">{category} Syllabus</h1>
            <p className="text-sm text-slate-500">Comprehensive learning path</p>
          </div>
        </div>
      </div>
      
      {/* Content area - Scrollable with explicit overflow */}
      <div className="flex-1 overflow-y-auto bg-white" style={{ overflowY: 'scroll' }}>
        <div className="p-6">
          {/* Input area moved to top */}
          <div className="mb-6 bg-white rounded-xl p-4">
            <div className="flex items-center">
              <div className="flex-1 border border-slate-200 rounded-lg flex items-center overflow-hidden bg-white">
                <textarea
                  ref={inputRef}
                  className="flex-1 px-4 py-2 bg-transparent outline-none resize-none text-slate-700"
                  placeholder={`Ask a question about ${category}...`}
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
                  inputText.trim()
                    ? 'bg-indigo-500 text-white hover:bg-indigo-600' 
                    : 'bg-slate-100 text-slate-400'
                } transition-all`}
                onClick={handleSendMessage}
                disabled={!inputText.trim()}
              >
                <Send size={20} />
              </button>
            </div>
            
            {/* Add File and Add YouTube/GitHub buttons moved to top */}
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
          
          {/* Course overview */}
          <div className="bg-white rounded-xl p-6 mb-8 border border-slate-100">
            <h2 className="text-lg font-medium mb-4 text-slate-800">Course Overview</h2>
            <p className="text-slate-600 mb-4">
              This comprehensive course covers all the essential aspects of {category}. 
              You'll learn fundamental concepts, practical applications, and advanced techniques
              through structured modules and interactive lessons.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-50 rounded-lg mr-3 text-blue-500">
                  <BookOpen size={20} />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Total Modules</p>
                  <p className="font-medium text-slate-800">{syllabus.modules.length}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="p-2 bg-green-50 rounded-lg mr-3 text-green-500">
                  <Award size={20} />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Completion</p>
                  <p className="font-medium text-slate-800">{completionPercentage}% complete</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Syllabus modules */}
          <div className="space-y-6 pb-20">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">Syllabus</h2>
            
            {syllabus.modules.map((module, index) => {
              // Check if all lessons in this module are completed
              const isModuleCompleted = module.lessons.every(lesson => lesson.completed);
              
              return (
                <div 
                  key={module.id} 
                  className={`bg-white rounded-xl border overflow-hidden ${
                    isModuleCompleted ? 'border-green-200' : 'border-slate-200'
                  }`}
                >
                  {/* Module header - Clickable to expand/collapse */}
                  <div 
                    className={`p-4 border-b cursor-pointer ${
                      isModuleCompleted ? 'bg-green-50 border-green-200' : 'bg-white border-slate-200'
                    }`}
                    onClick={() => toggleModule(module.id)}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <h3 className="font-medium text-slate-800">Module {index + 1}: {module.title}</h3>
                        {expandedModules[module.id] ? 
                          <ChevronUp size={18} className="ml-2 text-slate-500" /> : 
                          <ChevronDown size={18} className="ml-2 text-slate-500" />
                        }
                      </div>
                      <div className={`text-sm ${isModuleCompleted ? 'text-green-600' : 'text-slate-500'}`}>
                        {module.lessons.filter(l => l.completed).length}/{module.lessons.length} completed
                        {isModuleCompleted && (
                          <span className="ml-2">✓</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Module lessons - With smooth transition */}
                  <div 
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${expandedModules[module.id] ? 'max-h-96' : 'max-h-0'}`}
                  >
                    <div className="divide-y divide-slate-100">
                      {module.lessons.map(lesson => (
                        <div 
                          key={lesson.id} 
                          className="p-4 hover:bg-slate-50 transition-colors cursor-pointer"
                          onClick={() => handleLessonClick(module.title, lesson)}
                        >
                          <div className="flex items-center">
                            <div className={`w-5 h-5 rounded-full mr-3 flex items-center justify-center
                                            ${lesson.completed ? 'bg-green-500' : 'border-2 border-slate-300'}`}>
                              {lesson.completed && (
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M10 3L4.5 8.5L2 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              )}
                            </div>
                            <span className={`${lesson.completed ? 'text-slate-400' : 'text-slate-700'}`}>
                              {lesson.title}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* File Upload Dialog */}
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
      
      {/* External Source Modal */}
      {showExternalSourceModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-white/75 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
              <h3 className="font-medium text-lg text-slate-700">Add External Resource</h3>
              <button 
                className="p-1 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
                onClick={handleCloseExternalSourceModal}
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Modal Tabs */}
            <div className="flex border-b border-slate-200">
              <button 
                className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
                  externalSourceType === 'youtube' 
                    ? 'bg-white text-indigo-600 border-b-2 border-indigo-500' 
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
                onClick={() => handleExternalSourceTypeChange('youtube')}
              >
                <div className="flex items-center justify-center">
                  <Youtube size={18} className="mr-2" />
                  <span>YouTube Link</span>
                </div>
              </button>
              
              <button 
                className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
                  externalSourceType === 'github' 
                    ? 'bg-white text-indigo-600 border-b-2 border-indigo-500' 
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
                onClick={() => handleExternalSourceTypeChange('github')}
              >
                <div className="flex items-center justify-center">
                  <Github size={18} className="mr-2" />
                  <span>GitHub Profile</span>
                </div>
              </button>
            </div>
            
            {/* Modal Content */}
            <div className="p-4">
              {externalSourceType === 'youtube' ? (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Add YouTube Link
                  </label>
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
                    onClick={() => console.log("Connect to GitHub clicked")}
                  >
                    <div className="flex items-center justify-center h-12 w-12 bg-gray-900 rounded-full text-white">
                      <Github size={24} className="text-white" />
                    </div>
                    <div className="text-left">
                      <div className="text-lg font-semibold text-slate-800">CONNECT TO GITHUB</div>
                      <div className="text-sm text-slate-500">Access code repositories for this course</div>
                    </div>
                  </button>                
                </div>
              )}  
            </div>
            
            {/* Modal Footer */}
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
                disabled={
                  (externalSourceType === 'youtube' && !youtubeLink) || 
                  (externalSourceType === 'github' && !githubProfile)
                }
              >
                Add Resource
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Syllabus;