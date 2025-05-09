import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, BookOpen, Award, X, UploadCloud, FileText, Send, Smile, ChevronDown, ChevronUp } from 'lucide-react';

const Assessment = ({ category, categoryIcon, categoryColor, onBackClick, onNavigate }) => {
  // State for text input
  const [inputText, setInputText] = useState('');
  const inputRef = useRef(null);

  // State for file upload
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  // State to track which subjects are expanded
  const [expandedSubjects, setExpandedSubjects] = useState({});

  // Auto-adjust textarea height
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = '44px';
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
  }, [inputText]);

  // Toggle the expanded state of a subject
  const toggleSubject = (subjectId) => {
    setExpandedSubjects(prev => ({
      ...prev,
      [subjectId]: !prev[subjectId]
    }));
  };

  // Handle click on an assessment
  const handleAssessmentClick = (assessment) => {
    if (assessment.title === 'Application Design' && onNavigate) {
      onNavigate('quiz', { assessment });
    }
  };

  // Example assessment data organized by subjects
  const assessmentData = [
    {
      id: 1,
      title: 'Mathamathics',
      assessments: [
        { id: 101, title: 'Quiz: Key Concepts', type: 'Multiple Choice', questions: 10, duration: '20 minutes', completed: true, score: 80 },
        { id: 102, title: 'Assignment: Concept Mapping', type: 'Written Submission', questions: 2, duration: '1 hour', completed: true, score: 85 },
        { id: 103, title: 'Practical: Basic Application', type: 'Project', questions: 1, duration: '2 hours', completed: false, score: null }
      ]
    },
    {
      id: 2,
      title: 'OOPS with C++',
      assessments: [
        { id: 201, title: 'Quiz: Fundamental Theories', type: 'Multiple Choice', questions: 15, duration: '30 minutes', completed: true, score: 90 },
        { id: 202, title: 'Case Study Analysis', type: 'Written Submission', questions: 3, duration: '2 hours', completed: true, score: 88 },
        { id: 203, title: 'Application Design', type: 'Project', questions: 1, duration: '3 hours', completed: false, score: null },
        { id: 204, title: 'Peer Review', type: 'Evaluation', questions: 5, duration: '1 hour', completed: false, score: null }
      ]
    },
    {
      id: 3,
      title: 'Advanced Topics',
      assessments: [
        { id: 301, title: 'Quiz: Advanced Concepts', type: 'Multiple Choice', questions: 20, duration: '40 minutes', completed: false, score: null },
        { id: 302, title: 'Research Paper', type: 'Written Submission', questions: 1, duration: '1 week', completed: false, score: null },
        { id: 303, title: 'Project: Advanced Implementation', type: 'Project', questions: 1, duration: '5 hours', completed: false, score: null },
        { id: 304, title: 'Presentation', type: 'Oral', questions: 1, duration: '30 minutes', completed: false, score: null }
      ]
    },
    {
      id: 4,
      title: 'Practical Implementation',
      assessments: [
        { id: 401, title: 'Quiz: Implementation Techniques', type: 'Multiple Choice', questions: 12, duration: '25 minutes', completed: false, score: null },
        { id: 402, title: 'Project: Real-world Application', type: 'Project', questions: 1, duration: '1 week', completed: false, score: null },
        { id: 403, title: 'Troubleshooting Exercise', type: 'Practical', questions: 5, duration: '2 hours', completed: false, score: null }
      ]
    },
    {
      id: 5,
      title: 'Final Assessment',
      assessments: [
        { id: 501, title: 'Comprehensive Exam', type: 'Mixed Format', questions: 50, duration: '3 hours', completed: false, score: null },
        { id: 502, title: 'Capstone Project', type: 'Project', questions: 1, duration: '2 weeks', completed: false, score: null },
        { id: 503, title: 'Certification Assessment', type: 'Mixed Format', questions: 30, duration: '2 hours', completed: false, score: null }
      ]
    }
  ];

  // Calculate assessment statistics
  const totalAssessments = assessmentData.reduce((total, subject) => total + subject.assessments.length, 0);
  const completedAssessments = assessmentData.reduce(
    (total, subject) => total + subject.assessments.filter(a => a.completed).length, 0
  );
  const completionPercentage = Math.round((completedAssessments / totalAssessments) * 100);
  const averageScore = completedAssessments > 0 ? 
    Math.round(
      assessmentData
        .flatMap(subject => subject.assessments)
        .filter(a => a.completed && a.score !== null)
        .reduce((sum, a) => sum + a.score, 0) / completedAssessments
    ) : 0;

  // Handle sending a message
  const handleSendMessage = () => {
    if (inputText.trim() === '') return;
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
    console.log("Files to process:", files);
    const fileNames = Array.from(files).map(file => file.name).join(", ");
    alert(`Files received: ${fileNames}`);
    setShowFileUpload(false);
  };

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
            <h1 className="text-xl font-semibold text-slate-800">{category} Assessments</h1>
            <p className="text-sm text-slate-500">Test your knowledge and skills</p>
          </div>
        </div>
      </div>
      
      {/* Content area - Scrollable with explicit overflow */}
      <div className="flex-1 overflow-y-auto bg-white" style={{ overflowY: 'scroll' }}>
        <div className="p-6">
          {/* Input area */}
          <div className="bg-white rounded-xl p-4 mb-8">
            <div className="flex items-center">
              <div className="flex-1 border border-slate-200 rounded-lg flex items-center overflow-hidden bg-white">
                <textarea
                  ref={inputRef}
                  className="flex-1 px-4 py-2 bg-transparent outline-none resize-none text-slate-700"
                  placeholder={`Ask a question about ${category} assessments...`}
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
            
            {/* Add File button */}
            <div className="flex justify-center gap-4 mt-4">
              <button 
                className="flex items-center justify-center gap-2 border border-slate-200 rounded-lg py-3 px-4 text-slate-700 font-medium hover:bg-slate-50 transition-all w-full bg-white hover:text-indigo-600 hover:border-indigo-200 group"
                onClick={handleAddFile}
              >
                <div className="bg-indigo-50 p-2 rounded-full text-indigo-500 group-hover:bg-indigo-100 transition-colors">
                  <FileText size={18} />
                </div>
                <span>Submit Assignment</span>
              </button>
            </div>
          </div>
          
          {/* Assessment overview */}
          <div className="bg-white rounded-xl p-6 mb-8 border border-slate-100">
            <h2 className="text-lg font-medium mb-4 text-slate-800">Assessment Overview</h2>
            <p className="text-slate-600 mb-4">
              Evaluate your understanding of {category} through various assessment types, 
              including quizzes, assignments, and comprehensive exams across multiple subjects.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-50 rounded-lg mr-3 text-blue-500">
                  <BookOpen size={20} />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Total Assessments</p>
                  <p className="font-medium text-slate-800">{totalAssessments}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="p-2 bg-green-50 rounded-lg mr-3 text-green-500">
                  <Award size={20} />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Average Score</p>
                  <p className="font-medium text-slate-800">
                    {averageScore ? `${averageScore}%` : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Assessment subjects */}
          <div className="space-y-6 pb-20">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">Assessments by Subject</h2>
            
            {assessmentData.map((subject, index) => {
              const isSubjectCompleted = subject.assessments.every(a => a.completed);
              
              return (
                <div 
                  key={subject.id} 
                  className={`bg-white rounded-xl border overflow-hidden ${
                    isSubjectCompleted ? 'border-green-200' : 'border-slate-200'
                  }`}
                >
                  {/* Subject header - Clickable to expand/collapse */}
                  <div 
                    className={`p-4 border-b cursor-pointer ${
                      isSubjectCompleted ? 'bg-green-50 border-green-200' : 'bg-white border-slate-200'
                    }`}
                    onClick={() => toggleSubject(subject.id)}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <h3 className="font-medium text-slate-800"> {subject.title}</h3>
                        {expandedSubjects[subject.id] ? 
                          <ChevronUp size={18} className="ml-2 text-slate-500" /> : 
                          <ChevronDown size={18} className="ml-2 text-slate-500" />
                        }
                      </div>
                      <div className={`text-sm ${isSubjectCompleted ? 'text-green-600' : 'text-slate-500'}`}>
                        {subject.assessments.filter(a => a.completed).length}/{subject.assessments.length} completed
                        {isSubjectCompleted && (
                          <span className="ml-2">✓</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Subject assessments - With smooth transition */}
                  <div 
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${expandedSubjects[subject.id] ? 'max-h-96' : 'max-h-0'}`}
                  >
                    <div className="divide-y divide-slate-100">
                      {subject.assessments.map(assessment => (
                        <div 
                          key={assessment.id} 
                          className="p-4 hover:bg-slate-50 transition-colors cursor-pointer"
                          onClick={() => handleAssessmentClick(assessment)}
                        >
                          <div className="flex justify-between items-center">
                            <div className="flex items-center">
                              <div className={`w-5 h-5 rounded-full mr-3 flex items-center justify-center
                                              ${assessment.completed ? 'bg-green-500' : 'border-2 border-slate-300'}`}>
                                {assessment.completed && (
                                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10 3L4.5 8.5L2 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                )}
                              </div>
                              <span className={`${assessment.completed ? 'text-slate-400' : 'text-slate-700'}`}>
                                {assessment.title}
                              </span>
                            </div>
                            <div className="text-sm text-slate-500">
                              {assessment.completed && assessment.score !== null && (
                                <span className="text-green-600">Score: {assessment.score}%</span>
                              )}
                            </div>
                          </div>
                          <div className="mt-2 ml-8 text-sm text-slate-600">
                            <p>Type: {assessment.type}</p>
                            <p>Questions: {assessment.questions}</p>
                            <p>Duration: {assessment.duration}</p>
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
        <div className="file-upload-container absolute bottom-20 left-0 right-0 mx-80 bg-white rounded-lg shadow-lg border border-slate-200 overflow-hidden z-20">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-medium text-slate-700">Submit Assignment</h3>
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
    </div>
  );
};

export default Assessment;