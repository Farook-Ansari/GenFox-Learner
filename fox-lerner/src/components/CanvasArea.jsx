import React, { useState, useEffect, useRef } from 'react';
import { Copy, Download, Code, FileText, Image as ImageIcon, ChevronLeft, ChevronRight, Maximize2, Minimize2, Share2, Book, Layout } from 'lucide-react';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-csharp';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-json';
import 'prismjs/plugins/line-numbers/prism-line-numbers.css';
import 'prismjs/plugins/line-numbers/prism-line-numbers';

const CanvasArea = ({ content, contentType = 'code', language = 'javascript', title = 'Content Display', onSwitchToBook }) => {
  const [copied, setCopied] = useState(false);
  const [currentContent, setCurrentContent] = useState(content);
  const [currentContentType, setCurrentContentType] = useState(contentType);
  const [currentLanguage, setCurrentLanguage] = useState(language);
  const [currentTitle, setCurrentTitle] = useState(title);
  const [history, setHistory] = useState([{ content, contentType, language, title }]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [showTooltip, setShowTooltip] = useState('');
  const [viewMode, setViewMode] = useState('book'); 
  const contentRef = useRef(null);
  const bookCodeRef = useRef(null);
  const [pageFlipAnimation, setPageFlipAnimation] = useState(false);
  const [hasActivatedCanvasView, setHasActivatedCanvasView] = useState(false);

  useEffect(() => {
    // Notify parent component of initial book mode
    if (onSwitchToBook && viewMode === 'book') {
      onSwitchToBook(currentContent, currentTitle, currentContentType, currentLanguage);
    }
  }, []);

  useEffect(() => {
    if (content !== currentContent || contentType !== currentContentType || 
        language !== currentLanguage || title !== currentTitle) {
      setCurrentContent(content);
      setCurrentContentType(contentType);
      setCurrentLanguage(language);
      setCurrentTitle(title);
      
      const newHistoryItem = { content, contentType, language, title };
      setHistory([...history.slice(0, historyIndex + 1), newHistoryItem]);
      setHistoryIndex(historyIndex + 1);
    }
  }, [content, contentType, language, title]);

  useEffect(() => {
    // Apply code highlighting ONLY in canvas view mode
    if (currentContentType === 'code' && viewMode === 'canvas') {
      Prism.highlightAll();
    }
  }, [currentContent, currentContentType, currentLanguage, viewMode]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(currentContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadContent = () => {
    const fileExtension = getFileExtension(currentContentType, currentLanguage);
    const fileName = `${currentTitle.toLowerCase().replace(/\s+/g, '-')}.${fileExtension}`;
    
    const element = document.createElement('a');
    const file = new Blob([currentContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = fileName;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const getFileExtension = (type, lang) => {
    if (type === 'code') {
      switch (lang) {
        case 'javascript': return 'js';
        case 'jsx': return 'jsx';
        case 'python': return 'py';
        case 'java': return 'java';
        case 'csharp': return 'cs';
        case 'css': return 'css';
        case 'json': return 'json';
        default: return 'txt';
      }
    }
    return 'txt';
  };

  const goBack = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      const previousItem = history[newIndex];
      setCurrentContent(previousItem.content);
      setCurrentContentType(previousItem.contentType);
      setCurrentLanguage(previousItem.language);
      setCurrentTitle(previousItem.title);
      setHistoryIndex(newIndex);
    }
  };

  const goForward = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      const nextItem = history[newIndex];
      setCurrentContent(nextItem.content);
      setCurrentContentType(nextItem.contentType);
      setCurrentLanguage(nextItem.language);
      setCurrentTitle(nextItem.title);
      setHistoryIndex(newIndex);
    }
  };

  const toggleFullscreen = () => {
    setFullscreen(!fullscreen);
  };

  const toggleViewMode = () => {
    // Add page flip animation
    setPageFlipAnimation(true);
    setTimeout(() => {
      const newMode = viewMode === 'canvas' ? 'book' : 'canvas';
      setViewMode(newMode);
      
      // Mark canvas view as activated if switching to it
      if (newMode === 'canvas') {
        setHasActivatedCanvasView(true);
      }
      
      // Call the parent component callback if provided
      if (onSwitchToBook && newMode === 'book') {
        onSwitchToBook(currentContent, currentTitle, currentContentType, currentLanguage);
      }
      setPageFlipAnimation(false);
    }, 300);
  };

  const handleTooltip = (tooltip) => {
    setShowTooltip(tooltip);
  };

  const getLanguageLabel = () => {
    switch(currentLanguage) {
      case 'javascript': return 'JavaScript';
      case 'jsx': return 'React JSX';
      case 'python': return 'Python';
      case 'java': return 'Java';
      case 'csharp': return 'C#';
      case 'css': return 'CSS';
      case 'json': return 'JSON';
      default: return currentLanguage.charAt(0).toUpperCase() + currentLanguage.slice(1);
    }
  };

  const getContentIcon = () => {
    switch (currentContentType) {
      case 'code': return <Code size={18} className="text-indigo-600" />;
      case 'text': return <FileText size={18} className="text-indigo-600" />;
      case 'markdown': return <FileText size={18} className="text-indigo-600" />;
      case 'image': return <ImageIcon size={18} className="text-indigo-600" />;
      default: return <FileText size={18} className="text-indigo-600" />;
    }
  };

  // Book View Content Renderer - Modified to remove code highlighting effects
  const renderBookContent = () => {
    const getPageBackground = () => {
      switch (currentContentType) {
        case 'code': return 'bg-gray-50 border-gray-200';
        case 'text': return 'bg-white border-white';
        case 'markdown': return 'bg-blue-50 border-blue-100';
        case 'image': return 'bg-white border-gray-100';
        default: return 'bg-amber-50 border-amber-100';
      }
    };

    // Format content for book view - modified to use simple text display without Prism highlighting
    const formatCodeForBook = () => {
      if (currentContentType === 'code') {
        return (
          <div className="rounded-lg overflow-hidden bg-gray-100 shadow-inner">
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 text-sm font-mono border-b border-gray-300">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="flex-1 text-center">{getLanguageLabel()}</div>
            </div>
            {/* Simple code display without Prism highlighting */}
            <pre className="p-4 overflow-auto text-sm bg-white">
              <code ref={bookCodeRef} className="font-mono text-gray-800">{currentContent}</code>
            </pre>
          </div>
        );
      } else if (currentContentType === 'markdown') {
        return (
          <div className="prose prose-indigo max-w-none">
            {currentContent}
          </div>
        );
      } else if (currentContentType === 'image') {
        return (
          <div className="flex justify-center">
            <img src={currentContent} alt="Content" className="max-w-full rounded-lg shadow-lg" />
          </div>
        );
      } else {
        return (
          <div className="whitespace-pre-wrap font-serif text-gray-800 leading-relaxed">
            {currentContent}
          </div>
        );
      }
    };

    return (
      <div className={`w-full h-full ${getPageBackground()} flex flex-col`}>
        {/* Book header */}
        <div className="p-6 pb-0">
          <div className="mb-6 flex justify-between items-center">
            <h1 className="text-xl font-serif text-gray-800 font-medium">{currentTitle}</h1>
            <div className="flex items-center gap-3">
              <button 
                onClick={copyToClipboard} 
                className="p-2 rounded-full bg-white shadow-sm hover:bg-gray-50 text-gray-700 transition-all"
                onMouseEnter={() => handleTooltip('Copy')}
                onMouseLeave={() => handleTooltip('')}
              >
                <Copy size={16} />
                {copied && (
                  <span className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-3 py-1 rounded-md shadow-lg z-10">
                    Copied!
                  </span>
                )}
              </button>
              <button 
                onClick={downloadContent} 
                className="p-2 rounded-full bg-white shadow-sm hover:bg-gray-50 text-gray-700 transition-all"
                onMouseEnter={() => handleTooltip('Download')}
                onMouseLeave={() => handleTooltip('')}
              >
                <Download size={16} />
              </button>
              <button 
                onClick={toggleViewMode}
                className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-full shadow-sm hover:bg-gray-50 text-gray-700 transition-all text-sm font-medium"
              >
                <Layout size={14} />
                Canvas View
              </button>
            </div>
          </div>
          </div>
        
        {/* Book content */}
        <div className="flex-1 overflow-auto p-6 pt-4">
          <div className="w-full h-full">
          Here's a simpler explanation of: "This is a simulated response about Advanced Topics: Cutting-edge Research using the memorize approach in chat1. In a real implementation, this would be an actual response from your AI service."
          🦊 Fox explanation:This means the AI assistant is giving you a placeholder response about Advanced Topics: Cutting-edge Research. In a real app, this would be replaced with an actual helpful answer based on your question. <br /> <br />
          Here's a simpler explanation of: "This is a simulated response about Advanced Topics: Cutting-edge Research using the memorize approach in chat1. In a real implementation, this would be an actual response from your AI service."
          🦊 Fox explanation:This means the AI assistant is giving you a placeholder response about Advanced Topics: Cutting-edge Research. In a real app, this would be replaced with an actual helpful answer based on your question.
          </div>
        </div>
        
        {/* Book footer */}
        <div className="p-4 border-t border-gray-200 bg-white bg-opacity-60 backdrop-blur-sm flex justify-between items-center text-xs text-gray-500">
          <div className="flex items-center gap-4">
            <button 
              onClick={goBack} 
              disabled={historyIndex === 0} 
              className={`flex items-center gap-1 px-2 py-1 rounded ${historyIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}`}
            >
              <ChevronLeft size={14} />
              <span>Previous</span>
            </button>
            <button 
              onClick={goForward} 
              disabled={historyIndex === history.length - 1} 
              className={`flex items-center gap-1 px-2 py-1 rounded ${historyIndex === history.length - 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}`}
            >
              <span>Next</span>
              <ChevronRight size={14} />
            </button>
          </div>
          <div className="font-mono">
            {new Date().toLocaleDateString()}
          </div>
        </div>
      </div>
    );
  };

  // Canvas View Content Renderer (Original)
  const renderCanvasContent = () => {
    switch (currentContentType) {
      case 'code':
        return (
          <div className="relative h-full">
            {currentLanguage && (
              <div className="absolute top-4 right-4 bg-opacity-80 backdrop-blur-sm bg-gray-800 text-gray-200 px-3 py-1 rounded-full text-xs font-mono shadow-md">
                {getLanguageLabel()}
              </div>
            )}
            <pre className={`language-${currentLanguage} line-numbers h-full overflow-auto m-0 rounded-xl bg-gray-900 p-6 pb-12`}>
              <code className={`language-${currentLanguage}`}>{currentContent}</code>
            </pre>
          </div>
        );
      case 'text':
        return (
          <div className="p-6 h-full overflow-auto whitespace-pre-wrap text-slate-700 bg-white rounded-xl">
            {currentContent}
          </div>
        );
      case 'markdown':
        return (
          <div className="p-6 h-full overflow-auto prose prose-slate max-w-none bg-white rounded-xl">
            {currentContent}
          </div>
        );
      case 'image':
        return (
          <div className="flex items-center justify-center h-full bg-slate-50 p-6 rounded-xl">
            <img src={currentContent} alt="Content" className="max-w-full max-h-full shadow-lg rounded-xl" />
          </div>
        );
      default:
        return (
          <div className="p-6 h-full overflow-auto whitespace-pre-wrap">
            {currentContent}
          </div>
        );
    }
  };

  const getIcon = () => {
    switch (currentContentType) {
      case 'code': return <Code size={20} className="text-indigo-500" />;
      case 'text': return <FileText size={20} className="text-indigo-500" />;
      case 'markdown': return <FileText size={20} className="text-indigo-500" />;
      case 'image': return <ImageIcon size={20} className="text-indigo-500" />;
      default: return <FileText size={20} className="text-indigo-500" />;
    }
  };

  // Animation classes for page flip
  const animationClass = pageFlipAnimation ? 
    'animate-flip-out opacity-0 transform scale-95' : 
    'animate-flip-in opacity-100 transform scale-100';

  // Render book mode
  if (viewMode === 'book') {
    return (
      <div className={`${fullscreen ? 'fixed inset-0 z-50' : 'h-full'}`}>
        <div className={`w-full h-full bg-white rounded-xl shadow-lg overflow-hidden ${animationClass} transition-all duration-300`}>
          <div className="w-full h-full flex flex-col">
            {/* Book spine decoration */}
            <div className="absolute left-0 top-0 bottom-0 w-3 bg-gradient-to-r from-indigo-600 to-indigo-400 rounded-l-xl"></div>
            
            {/* Book content area with left margin for spine */}
            <div className="pl-6 w-full h-full flex flex-col">
              {renderBookContent()}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render canvas mode (original layout)
  const isDarkMode = currentContentType === 'code';
  const headerBg = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const headerText = isDarkMode ? 'text-gray-100' : 'text-slate-700';
  const buttonHover = isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-slate-50';
  const buttonText = isDarkMode ? 'text-gray-300' : 'text-slate-500';
  const borderColor = isDarkMode ? 'border-gray-700' : 'border-slate-100';

  const containerStyles = fullscreen 
    ? 'fixed inset-0 z-50 flex flex-col shadow-2xl'
    : 'flex flex-col rounded-lg shadow-sm h-full bg-opacity-75 backdrop-blur-sm';

  return (
    <div className={`${containerStyles} ${isDarkMode ? 'bg-gray-900' : 'bg-white'} overflow-hidden transition-all duration-200 ${animationClass}`}>
      <div className={`px-4 py-3 flex justify-between items-center ${headerBg} ${headerText} ${borderColor} border-b backdrop-blur-sm bg-opacity-90`}>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-opacity-20 backdrop-blur-sm">
            {getIcon()}
          </div>
          <div className="font-medium truncate">{currentTitle}</div>
          
          {currentContentType === 'code' && (
            <span className="px-3 py-1 text-xs rounded-full bg-indigo-100 text-indigo-800 ml-2 shadow-sm">
              {getLanguageLabel()}
            </span>
          )}
        </div>
        <div className="flex gap-1">
          <button 
            onClick={goBack} 
            disabled={historyIndex === 0} 
            className={`p-2 rounded-full transition-all ${historyIndex === 0 ? 'opacity-30 cursor-not-allowed' : `${buttonText} ${buttonHover}`}`}
            onMouseEnter={() => handleTooltip('Previous')}
            onMouseLeave={() => handleTooltip('')}
          >
            <ChevronLeft size={16} className="stroke-2" />
          </button>
          <button 
            onClick={goForward} 
            disabled={historyIndex === history.length - 1} 
            className={`p-2 rounded-full transition-all ${historyIndex === history.length - 1 ? 'opacity-30 cursor-not-allowed' : `${buttonText} ${buttonHover}`}`}
            onMouseEnter={() => handleTooltip('Next')}
            onMouseLeave={() => handleTooltip('')}
          >
            <ChevronRight size={16} className="stroke-2" />
          </button>
          <div className="w-px h-6 mx-1 bg-slate-200 dark:bg-gray-700 self-center"></div>
          <button 
            onClick={toggleViewMode}
            className={`p-2 rounded-full transition-all ${buttonText} ${buttonHover}`}
            onMouseEnter={() => handleTooltip('Switch to Book View')}
            onMouseLeave={() => handleTooltip('')}
          >
            <Book size={16} className="stroke-2" />
          </button>
          <button 
            onClick={copyToClipboard} 
            className={`p-2 rounded-full relative transition-all ${buttonText} ${buttonHover}`}
            onMouseEnter={() => handleTooltip('Copy')}
            onMouseLeave={() => handleTooltip('')}
          >
            <Copy size={16} className="stroke-2" />
            {copied && (
              <span className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-3 py-1 rounded-md shadow-lg z-10">
                Copied!
              </span>
            )}
          </button>
          <button 
            onClick={downloadContent} 
            className={`p-2 rounded-full transition-all ${buttonText} ${buttonHover}`}
            onMouseEnter={() => handleTooltip('Download')}
            onMouseLeave={() => handleTooltip('')}
          >
            <Download size={16} className="stroke-2" />
          </button>
          <button 
            onClick={toggleFullscreen} 
            className={`p-2 rounded-full transition-all ${buttonText} ${buttonHover}`}
            onMouseEnter={() => handleTooltip(fullscreen ? 'Exit Fullscreen' : 'Fullscreen')}
            onMouseLeave={() => handleTooltip('')}
          >
            {fullscreen ? <Minimize2 size={16} className="stroke-2" /> : <Maximize2 size={16} className="stroke-2" />}
          </button>
          <button 
            className={`p-2 rounded-full transition-all ${buttonText} ${buttonHover}`}
            onMouseEnter={() => handleTooltip('Share')}
            onMouseLeave={() => handleTooltip('')}
          >
            <Share2 size={16} className="stroke-2" />
          </button>
        </div>
      </div>
      
      {showTooltip && (
        <div className="absolute top-12 right-4 bg-black text-white text-xs px-3 py-1 rounded-md shadow-lg z-10 transition-opacity duration-200">
          {showTooltip}
        </div>
      )}
      
      <div ref={contentRef} className="flex-1 overflow-hidden relative transition-all duration-200">
        {/* Only render the canvas content when in canvas view mode AND the canvas view has been activated */}
        {hasActivatedCanvasView && renderCanvasContent()}
      </div>
      
      {currentContentType === 'code' && viewMode === 'canvas' && hasActivatedCanvasView && (
        <div className="bg-gray-800 text-gray-400 text-xs py-2 px-4 border-t border-gray-700 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-gray-400"></div>
            <span>{currentContent.split('\n').length} lines</span>
          </div>
          <div className="text-gray-500">
            {new Date().toLocaleDateString()}
          </div>
        </div>
      )}
    </div>
  );
};

export default CanvasArea;