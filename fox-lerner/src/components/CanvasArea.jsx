import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Copy,
  Download,
  Code,
  FileText,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Share2,
  BookMarked,
  Layout,
  Play as PlayIcon,
} from "lucide-react";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-python";
import "prismjs/components/prism-java";
import "prismjs/components/prism-csharp";
import "prismjs/components/prism-css";
import "prismjs/components/prism-json";
import "prismjs/plugins/line-numbers/prism-line-numbers.css";
import "prismjs/plugins/line-numbers/prism-line-numbers";
import ReactMarkdown from "react-markdown";
import mermaid from "mermaid";
import Editor from "react-simple-code-editor";

const CanvasArea = ({
  content,
  contentType = "markdown",
  language = "plaintext",
  title = "Canvas Area",
  onSwitchToBook,
  isNewMessage = false,
}) => {
  const [copied, setCopied] = useState(false);
  const [currentContent, setCurrentContent] = useState(content);
  const [currentContentType, setCurrentContentType] = useState(contentType);
  const [currentLanguage, setCurrentLanguage] = useState(language);
  const [currentTitle, setCurrentTitle] = useState(title);
  const [history, setHistory] = useState([{ content, contentType, language, title }]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [showTooltip, setShowTooltip] = useState("");
  const [viewMode, setViewMode] = useState("book");
  const [pageFlipAnimation, setPageFlipAnimation] = useState(false);
  const [hasActivatedCanvasView, setHasActivatedCanvasView] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [quizFeedback, setQuizFeedback] = useState("");
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [codeContents, setCodeContents] = useState({});
  const [codeOutputs, setCodeOutputs] = useState({});
  const [displayedContent, setDisplayedContent] = useState(""); // State for typing effect
  const [isTyping, setIsTyping] = useState(false); // Track typing animation
  const contentRef = useRef(null);
  const bookCodeRef = useRef(null);

  useEffect(() => {
    mermaid.initialize({ startOnLoad: false });
  }, []);

  useEffect(() => {
    if (onSwitchToBook && viewMode === "book") {
      onSwitchToBook(currentContent, currentTitle, currentContentType, currentLanguage);
    }
  }, [viewMode, onSwitchToBook, currentContent, currentTitle, currentContentType, currentLanguage]);

  // Handle content updates and trigger typing effect
  useEffect(() => {
    // Update history with new content
    setHistory((prev) => {
      const newHistory = prev.slice(0, historyIndex + 1);
      return [...newHistory, { content, contentType, language, title }];
    });
    setHistoryIndex((prev) => prev + 1);

    // Update current states
    setCurrentContent(content);
    setCurrentContentType(contentType);
    setCurrentLanguage(language);
    setCurrentTitle(title);

    // Trigger typing effect for new messages in canvas view
    if (
      viewMode === "canvas" &&
      isNewMessage &&
      ["text", "markdown", "code"].includes(contentType)
    ) {
      setDisplayedContent(""); // Reset displayed content
      setIsTyping(true); // Start typing animation
    } else {
      setDisplayedContent(content); // Show full content immediately
      setIsTyping(false);
    }

    // Scroll to the end of content for new messages
    if (contentRef.current && isNewMessage) {
      contentRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [content, contentType, language, title, isNewMessage, viewMode]);

  // Typing effect logic
  useEffect(() => {
    if (isTyping && viewMode === "canvas" && displayedContent.length < currentContent.length) {
      const typingSpeed = currentContentType === "code" ? 20 : 10; // Slower for code
      const timer = setInterval(() => {
        setDisplayedContent((prev) => {
          const nextIndex = prev.length + 1;
          if (nextIndex <= currentContent.length) {
            return currentContent.slice(0, nextIndex);
          }
          setIsTyping(false);
          return prev;
        });
      }, typingSpeed);

      return () => clearInterval(timer);
    } else if (isTyping && displayedContent.length >= currentContent.length) {
      setIsTyping(false);
    }
  }, [isTyping, displayedContent, currentContent, currentContentType, viewMode]);

  // Handle Prism highlighting for code
  useEffect(() => {
    if (currentContentType === "code" && viewMode === "canvas") {
      Prism.highlightAll();
    }
  }, [displayedContent, currentContentType, currentLanguage, viewMode]);

  // Scroll to bottom after quiz submission
  useEffect(() => {
    if (quizSubmitted && contentRef.current) {
      contentRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [quizSubmitted]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(currentContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadContent = () => {
    const fileExtension = getFileExtension(currentContentType, currentLanguage);
    const fileName = `${currentTitle.toLowerCase().replace(/\s+/g, "-")}.${fileExtension}`;
    const element = document.createElement("a");
    const file = new Blob([currentContent], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = fileName;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const getFileExtension = (type, lang) => {
    if (type === "code") {
      switch (lang) {
        case "javascript": return "js";
        case "jsx": return "jsx";
        case "python": return "py";
        case "java": return "java";
        case "csharp": return "cs";
        case "css": return "css";
        case "json": return "json";
        default: return "txt";
      }
    }
    return "txt";
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
      setSelectedAnswer(null);
      setQuizFeedback("");
      setDisplayedContent(previousItem.content); // Show full content
      setIsTyping(false); // Disable typing for history
      if (contentRef.current) contentRef.current.scrollTop = 0;
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
      setSelectedAnswer(null);
      setQuizFeedback("");
      setDisplayedContent(nextItem.content); // Show full content
      setIsTyping(false); // Disable typing for history
      if (contentRef.current) contentRef.current.scrollTop = 0;
    }
  };

  const toggleFullscreen = () => {
    setFullscreen(!fullscreen);
  };

  const toggleViewMode = () => {
    setPageFlipAnimation(true);
    setTimeout(() => {
      const newMode = viewMode === "canvas" ? "book" : "canvas";
      setViewMode(newMode);
      setHasActivatedCanvasView(true);
      if (newMode === "canvas" && isNewMessage && ["text", "markdown", "code"].includes(currentContentType)) {
        setDisplayedContent("");
        setIsTyping(true); // Trigger typing effect
      } else {
        setDisplayedContent(currentContent);
        setIsTyping(false);
      }
      if (onSwitchToBook && newMode === "book") {
        onSwitchToBook(currentContent, currentTitle, currentContentType, currentLanguage);
      }
      setPageFlipAnimation(false);
    }, 300);
  };

  const handleTooltip = (tooltip) => {
    setShowTooltip(tooltip);
  };

  const getLanguageLabel = () => {
    switch (currentLanguage) {
      case "javascript": return "JavaScript";
      case "jsx": return "React JSX";
      case "python": return "Python";
      case "java": return "Java";
      case "csharp": return "C#";
      case "css": return "CSS";
      case "json": return "JSON";
      default: return currentLanguage.charAt(0).toUpperCase() + currentLanguage.slice(1);
    }
  };

  const getContentIcon = () => {
    switch (currentContentType) {
      case "code": return <Code size={18} className="text-indigo-600" />;
      case "text": return <FileText size={18} className="text-indigo-600" />;
      case "markdown": return <FileText size={18} className="text-indigo-600" />;
      case "image": return <ImageIcon size={18} className="text-indigo-600" />;
      default: return <FileText size={18} className="text-indigo-600" />;
    }
  };

  const parseContent = () => {
    const lines = currentContent.split("\n");
    let quiz = { question: "", options: [] };
    let misconception = "";
    let relatedConcepts = "";
    let currentSection = "";

    lines.forEach((line) => {
      if (line.startsWith("Quiz")) currentSection = "quiz";
      else if (line.startsWith("Misconception")) currentSection = "misconception";
      else if (line.startsWith("Related Concepts")) currentSection = "relatedConcepts";
      else if (currentSection === "quiz") {
        if (line.trim() && !quiz.question) quiz.question = line.trim();
        else if (line.startsWith("- ") && line.trim().length > 2)
          quiz.options.push(line.replace("- ", "").trim());
      } else if (currentSection === "misconception") misconception += line + "\n";
      else if (currentSection === "relatedConcepts") relatedConcepts += line + "\n";
    });

    return { quiz, misconception, relatedConcepts };
  };

  const renderQuiz = (quiz) => {
    const correctAnswer = "30";
    const handleAnswerSelect = (option) => {
      setSelectedAnswer(option);
      setQuizFeedback(
        option === correctAnswer
          ? "Correct! arr[2] is 30."
          : `Incorrect. The correct answer is 30.`
      );
    };

    return (
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-2">{quiz.question}</h3>
        <div className="space-y-2">
          {quiz.options.map((option, index) => (
            <label key={index} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="quiz"
                value={option}
                checked={selectedAnswer === option}
                onChange={() => handleAnswerSelect(option)}
                className="form-radio text-indigo-600"
              />
              <span className="text-sm text-slate-700">{option}</span>
            </label>
          ))}
        </div>
        {quizFeedback && (
          <p
            className={`mt-2 text-sm ${
              quizFeedback.includes("Correct") ? "text-green-600" : "text-red-600"
            }`}
          >
            {quizFeedback}
          </p>
        )}
      </div>
    );
  };

  const handleQuizAnswerChange = (questionIndex, option) => {
    setQuizAnswers((prev) => ({ ...prev, [questionIndex]: option }));
  };

  const handleQuizSubmit = () => {
    setQuizSubmitted(true);
  };

  const Mermaid = ({ code }) => {
    const [svg, setSvg] = useState(null);
    const id = useMemo(
      () => `mermaid-${Math.random().toString(36).substr(2, 9)}`,
      []
    );

    useEffect(() => {
      const renderMermaid = async () => {
        try {
          const { svg } = await mermaid.render(id, code);
          setSvg(svg);
        } catch (error) {
          console.error("Mermaid rendering error:", error);
          setSvg(`<p>Error rendering diagram: ${error.message}</p>`);
        }
      };
      renderMermaid();
    }, [code, id]);

    return <div className="mermaid max-w-full overflow-x-auto" dangerouslySetInnerHTML={{ __html: svg }} />;
  };

  const highlightCode = (code, lang) => {
    return Prism.highlight(code, Prism.languages[lang] || Prism.languages.plaintext, lang);
  };

  const renderInlineCode = (code, blockId) => {
    const currentCode = codeContents[blockId] !== undefined ? codeContents[blockId] : code;
    return (
      <div className="my-4 bg-gray-100 rounded-lg overflow-hidden shadow-inner">
        <div className="flex items-center justify-between px-4 py-2 bg-gray-200 text-gray-700 text-sm font-mono border-b border-gray-300">
          <span>{getLanguageLabel()}</span>
          <button
            onClick={() => runCode(currentCode, blockId)}
            className="flex items-center gap-1 px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-all"
          >
            <PlayIcon size={14} />
            Run
          </button>
        </div>
        <Editor
          value={currentCode}
          onValueChange={(code) => setCodeContents((prev) => ({ ...prev, [blockId]: code }))}
          highlight={(code) => highlightCode(code, currentLanguage)}
          padding={16}
          className="w-full min-h-[200px] font-mono text-sm text-gray-800 bg-white overflow-y-auto resize-y focus:outline-none"
          style={{
            fontFamily: '"Fira Code", monospace',
            fontSize: '14px',
            lineHeight: '1.5',
            border: 'none',
            backgroundColor: '#fff',
            caretColor: '#000',
          }}
        />
        {codeOutputs[blockId] && (
          <div className="bg-gray-50 p-4">
            <h4 className="text-sm font-semibold text-slate-800 mb-2">Output</h4>
            <pre className="text-sm text-green-700 whitespace-pre-wrap">
              {codeOutputs[blockId]}
            </pre>
          </div>
        )}
      </div>
    );
  };

  const runCode = (code, blockId) => {
    console.log("Executing code:", code, "for blockId:", blockId);
    try {
      const output = [];
      const originalConsoleLog = console.log;
      console.log = (...args) => output.push(args.join(" "));
      // eslint-disable-next-line no-eval
      eval(code);
      console.log = originalConsoleLog;
      setCodeOutputs((prev) => ({ ...prev, [blockId]: output.join("\n") || "No output" }));
    } catch (error) {
      console.error("Code execution error:", error);
      setCodeOutputs((prev) => ({ ...prev, [blockId]: `Error: ${error.message}` }));
    }
  };

  const renderBookContent = () => {
    const getPageBackground = () => {
      switch (currentContentType) {
        case "code": return "bg-gray-50 border-gray-200";
        case "text": return "bg-white border-white";
        case "markdown": return "bg-blue-50 border-blue-100";
        case "image": return "bg-white border-gray-100";
        case "quiz": return "bg-white border-white";
        default: return "bg-amber-50 border-amber-100";
      }
    };

    if (currentContentType === "quiz") {
      const quizQuestions = JSON.parse(currentContent);
      return (
        <div className="p-4 sm:p-6 overflow-y-auto max-w-full">
          <h3 className="text-lg font-medium mb-4">{currentTitle}</h3>
          {quizQuestions.map((q, index) => (
            <div key={index} className="mb-6">
              <p className="text-sm font-medium mb-2">{q.question}</p>
              {q.options.map((option, optIndex) => (
                <label key={optIndex} className="block mb-2 pl-2">
                  <input
                    type="radio"
                    name={`question-${index}`}
                    value={String.fromCharCode(65 + optIndex)}
                    checked={quizAnswers[index] === String.fromCharCode(65 + optIndex)}
                    onChange={() => handleQuizAnswerChange(index, String.fromCharCode(65 + optIndex))}
                    disabled={quizSubmitted}
                    className="mr-2 align-middle"
                  />
                  <span className="text-sm text-slate-700 align-middle">{option}</span>
                </label>
              ))}
              {quizSubmitted && (
                <p
                  className={`text-sm mt-2 pl-2 ${
                    quizAnswers[index] === q.correct ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {quizAnswers[index] === q.correct ? "Correct" : "Incorrect"}. {q.explanation}
                </p>
              )}
            </div>
          ))}
          {!quizSubmitted && (
            <button
              onClick={handleQuizSubmit}
              className="mt-4 px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
            >
              Submit
            </button>
          )}
        </div>
      );
    }

    const formatCodeForBook = () => {
      if (currentContentType === "code") {
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
            <pre className="p-4 text-sm bg-white overflow-y-auto max-w-full">
              <code ref={bookCodeRef} className="font-mono text-gray-800">
                {displayedContent}
              </code>
            </pre>
          </div>
        );
      } else if (currentContentType === "markdown") {
        return (
          <div className="prose prose-indigo max-w-none overflow-y-auto">
            <ReactMarkdown
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || "");
                  if (!inline && match && match[1] === "mermaid") {
                    return <Mermaid code={String(children).trim()} />;
                  }
                  if (!inline && match && match[1] === "javascript") {
                    const code = String(children).replace(/\n$/, "");
                    const blockId = `${node.position.start.line}-${node.position.end.line}`;
                    return renderInlineCode(code, blockId);
                  }
                  if (!inline && match) {
                    const lang = match[1];
                    return (
                      <pre className={`language-${lang} my-4 rounded-lg overflow-x-auto`}>
                        <code className={`language-${lang}`}>
                          {String(children).replace(/\n$/, "")}
                        </code>
                      </pre>
                    );
                  }
                  return (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },
              }}
            >
              {displayedContent}
            </ReactMarkdown>
          </div>
        );
      } else if (currentContentType === "image") {
        return (
          <div className="flex justify-center">
            <img
              src={currentContent}
              alt="Content"
              className="max-w-full max-h-[80vh] rounded-lg shadow-lg object-contain"
            />
          </div>
        );
      } else {
        const { quiz, misconception, relatedConcepts } = parseContent();
        return (
          <div className="space-y-6 overflow-y-auto max-w-full">
            {displayedContent.split("\n\n").map((section, index) => {
              if (section.startsWith("Quiz")) {
                return (
                  <div key={index}>
                    <h2 className="text-xl font-semibold text-slate-800 mb-4">Quiz</h2>
                    {renderQuiz(quiz)}
                  </div>
                );
              } else if (section.startsWith("Misconception")) {
                return (
                  <div key={index}>
                    <hr className="border-t border-slate-200 my-6" />
                    <h2 className="text-xl font-semibold text-slate-800 mb-4">Misconception</h2>
                    <div className="whitespace-pre-wrap font-serif text-gray-800 leading-relaxed">
                      {misconception}
                    </div>
                  </div>
                );
              } else if (section.startsWith("Related Concepts")) {
                return (
                  <div key={index}>
                    <hr className="border-t border-slate-200 my-6" />
                    <h2 className="text-xl font-semibold text-slate-800 mb-4">Related Concepts</h2>
                    <div className="whitespace-pre-wrap font-serif text-gray-800 leading-relaxed">
                      {relatedConcepts}
                    </div>
                  </div>
                );
              } else {
                return (
                  <div
                    key={index}
                    className="whitespace-pre-wrap font-serif text-gray-800 leading-relaxed"
                  >
                    {section}
                    <hr className="border-t border-slate-200 my-6" />
                  </div>
                );
              }
            })}
          </div>
        );
      }
    };

    return (
      <div className={`w-full h-full ${getPageBackground()} flex flex-col min-h-screen`}>
        <div className="sticky top-0 z-10 p-4 sm:p-6 pb-0 bg-white bg-opacity-95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
          <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <h1 className="text-lg sm:text-xl font-serif text-gray-800 font-medium truncate">
              {currentTitle}
            </h1>
            <div className="flex items-center gap-2 sm:gap-3 mt-2 sm:mt-0">
              <button
                onClick={copyToClipboard}
                className="p-2 rounded-full bg-white shadow-sm hover:bg-gray-50 text-gray-700 transition-all"
                onMouseEnter={() => handleTooltip("Copy")}
                onMouseLeave={() => handleTooltip("")}
              >
                <Copy size={16} />
                {copied && (
                  <span className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-3 py-1 rounded-md shadow-lg z-20">
                    Copied!
                  </span>
                )}
              </button>
              <button
                onClick={downloadContent}
                className="p-2 rounded-full bg-white shadow-sm hover:bg-gray-50 text-gray-700 transition-all"
                onMouseEnter={() => handleTooltip("Download")}
                onMouseLeave={() => handleTooltip("")}
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
        <div className="flex-1 p-4 sm:p-6 pt-4 overflow-y-auto max-w-full" ref={contentRef}>
          <div className="w-full">{formatCodeForBook()}</div>
        </div>
        <div className="sticky bottom-0 p-4 border-t border-gray-200 bg-white bg-opacity-90 backdrop-blur-sm flex justify-between items-center text-xs text-gray-500 shadow-inner">
          <div className="flex items-center gap-4">
            <button
              onClick={goBack}
              disabled={historyIndex === 0}
              className={`flex items-center gap-1 px-2 py-1 rounded ${
                historyIndex === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"
              }`}
            >
              <ChevronLeft size={14} />
              <span>Previous</span>
            </button>
            <button
              onClick={goForward}
              disabled={historyIndex === history.length - 1}
              className={`flex items-center gap-1 px-2 py-1 rounded ${
                historyIndex === history.length - 1
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-gray-100"
              }`}
            >
              <span>Next</span>
              <ChevronRight size={14} />
            </button>
          </div>
          <div className="font-mono">{new Date().toLocaleDateString()}</div>
        </div>
      </div>
    );
  };

  const renderCanvasContent = () => {
    switch (currentContentType) {
      case "quiz":
        const quizQuestions = JSON.parse(currentContent);
        return (
          <div className="p-4 sm:p-6 overflow-y-auto max-w-full">
            <h3 className="text-lg font-medium mb-4">{currentTitle}</h3>
            {quizQuestions.map((q, index) => (
              <div key={index} className="mb-6">
                <p className="text-sm font-medium mb-2">{q.question}</p>
                {q.options.map((option, optIndex) => (
                  <label key={optIndex} className="block mb-2 pl-2">
                    <input
                      type="radio"
                      name={`question-${index}`}
                      value={String.fromCharCode(65 + optIndex)}
                      checked={quizAnswers[index] === String.fromCharCode(65 + optIndex)}
                      onChange={() => handleQuizAnswerChange(index, String.fromCharCode(65 + optIndex))}
                      disabled={quizSubmitted}
                      className="mr-2 align-middle"
                    />
                    <span className="text-sm text-slate-700 align-middle">{option}</span>
                  </label>
                ))}
                {quizSubmitted && (
                  <p
                    className={`text-sm mt-2 pl-2 ${
                      quizAnswers[index] === q.correct ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {quizAnswers[index] === q.correct ? "Correct" : "Incorrect"}. {q.explanation}
                  </p>
                )}
              </div>
            ))}
            {!quizSubmitted && (
              <button
                onClick={handleQuizSubmit}
                className="mt-4 px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
              >
                Submit
              </button>
            )}
          </div>
        );
      case "code":
        return (
          <div className="relative p-4 sm:p-6 overflow-y-auto max-w-full">
            {currentLanguage && (
              <div className="absolute top-4 right-4 bg-opacity-80 backdrop-blur-sm bg-gray-800 text-gray-200 px-3 py-1 rounded-full text-xs font-mono shadow-md z-10">
                {getLanguageLabel()}
              </div>
            )}
            {renderInlineCode(displayedContent, "single-code-block")}
          </div>
        );
      case "text":
        const { quiz, misconception, relatedConcepts } = parseContent();
        return (
          <div className="p-4 sm:p-6 whitespace-pre-wrap text-slate-700 bg-white rounded-none space-y-6 overflow-y-auto max-w-full">
            {displayedContent.split("\n\n").map((section, index) => {
              if (section.startsWith("Quiz")) {
                return (
                  <div key={index}>
                    <h2 className="text-xl font-semibold text-slate-800 mb-4">Quiz</h2>
                    {renderQuiz(quiz)}
                  </div>
                );
              } else if (section.startsWith("Misconception")) {
                return (
                  <div key={index}>
                    <hr className="border-t border-slate-200 my-6" />
                    <h2 className="text-xl font-semibold text-slate-800 mb-4">Misconception</h2>
                    <div className="whitespace-pre-wrap text-slate-700">
                      {misconception}
                    </div>
                  </div>
                );
              } else if (section.startsWith("Related Concepts")) {
                return (
                  <div key={index}>
                    <hr className="border-t border-slate-200 my-6" />
                    <h2 className="text-xl font-semibold text-slate-800 mb-4">Related Concepts</h2>
                    <div className="whitespace-pre-wrap text-slate-700">
                      {relatedConcepts}
                    </div>
                  </div>
                );
              } else {
                return (
                  <div key={index} className="whitespace-pre-wrap text-slate-700">
                    {section}
                    <hr className="border-t border-slate-200 my-6" />
                  </div>
                );
              }
            })}
          </div>
        );
      case "markdown":
        return (
          <div className="p-4 sm:p-6 prose prose-slate max-w-none bg-white rounded-none prose-headings:font-semibold prose-headings:text-slate-800 prose-strong:text-slate-900 prose-ul:list-disc prose-ul:pl-6 prose-li:my-1 overflow-y-auto">
            <ReactMarkdown
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || "");
                  if (!inline && match && match[1] === "mermaid") {
                    return <Mermaid code={String(children).trim()} />;
                  }
                  if (!inline && match && match[1] === "javascript") {
                    const code = String(children).replace(/\n$/, "");
                    const blockId = `${node.position.start.line}-${node.position.end.line}`;
                    return renderInlineCode(code, blockId);
                  }
                  if (!inline && match) {
                    const lang = match[1];
                    return (
                      <pre className={`language-${lang} my-4 rounded-lg overflow-x-auto`}>
                        <code className={`language-${lang}`}>
                          {String(children).replace(/\n$/, "")}
                        </code>
                      </pre>
                    );
                  }
                  return (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },
              }}
            >
              {displayedContent}
            </ReactMarkdown>
          </div>
        );
      case "image":
        return (
          <div className="flex items-center justify-center bg-slate-50 p-4 sm:p-6 rounded-none overflow-y-auto">
            <img
              src={currentContent}
              alt="Content"
              className="max-w-full max-h-[80vh] shadow-lg rounded-xl object-contain"
            />
          </div>
        );
      default:
        return (
          <div className="p-4 sm:p-6 whitespace-pre-wrap overflow-y-auto max-w-full">
            {displayedContent}
          </div>
        );
    }
  };

  const animationClass = pageFlipAnimation
    ? "animate-flip-out opacity-0 transform scale-95"
    : "animate-flip-in opacity-100 transform scale-100";

  if (viewMode === "book") {
    return (
      <div className={`${fullscreen ? "fixed inset-0 z-50" : "h-full min-h-screen"}`}>
        <div
          className={`w-full h-full bg-white rounded-xl shadow-lg overflow-hidden ${animationClass} transition-all duration-300 max-w-full`}
        >
          <div className="w-full h-full flex flex-col">
            <div className="absolute left-0 top-0 bottom-0 w-3 bg-gradient-to-r from-indigo-600 to-indigo-400 rounded-l-xl"></div>
            <div className="pl-6 w-full h-full flex flex-col">
              {renderBookContent()}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isDarkMode = currentContentType === "code";
  const headerBg = isDarkMode ? "bg-gray-800" : "bg-white";
  const headerText = isDarkMode ? "text-gray-100" : "text-slate-700";
  const buttonHover = isDarkMode ? "hover:bg-gray-700" : "hover:bg-slate-50";
  const buttonText = isDarkMode ? "text-gray-300" : "text-slate-500";
  const borderColor = isDarkMode ? "border-gray-700" : "border-slate-100";

  const containerStyles = fullscreen
    ? "fixed inset-0 z-50 flex flex-col"
    : "flex flex-col h-full min-h-screen";

  return (
    <div
      className={`${containerStyles} ${
        isDarkMode ? "bg-gray-900" : "bg-white"
      } transition-all duration-200 ${animationClass} max-w-full`}
    >
      <div
        className={`z-20 px-2 sm:px-4 py-3 flex flex-col sm:flex-row items-start sm:items-center ${headerBg} ${headerText} ${borderColor} border-b backdrop-blur-sm bg-opacity-90`}
      >
        <div className="flex items-center gap-2 sm:gap-3 max-w-full sm:max-w-[50%]">
          <div className="p-2 rounded-lg bg-opacity-20 backdrop-blur-sm">
            {getContentIcon()}
          </div>
          <div className="font-medium truncate text-sm">{currentTitle}</div>
          {currentContentType === "code" && (
            <span className="px-2 sm:px-3 py-1 text-xs rounded-full bg-indigo-100 text-indigo-800 ml-2 shadow-sm">
              {getLanguageLabel()}
            </span>
          )}
        </div>
        <div className="ml-auto flex items-center gap-1 sm:gap-2 bg-white rounded-lg px-2 sm:px-3 py-1 shadow-sm mt-2 sm:mt-0 flex-wrap">
          <button
            onClick={goBack}
            disabled={historyIndex === 0}
            className={`p-2 rounded-full transition-all ${
              historyIndex === 0
                ? "opacity-30 cursor-not-allowed"
                : `${buttonText} ${buttonHover}`
            }`}
            onMouseEnter={() => handleTooltip("Previous")}
            onMouseLeave={() => handleTooltip("")}
          >
            <ChevronLeft size={14} className="stroke-2" />
          </button>
          <button
            onClick={goForward}
            disabled={historyIndex === history.length - 1}
            className={`p-2 rounded-full transition-all ${
              historyIndex === history.length - 1
                ? "opacity-30 cursor-not-allowed"
                : `${buttonText} ${buttonHover}`
            }`}
            onMouseEnter={() => handleTooltip("Next")}
            onMouseLeave={() => handleTooltip("")}
          >
            <ChevronRight size={14} className="stroke-2" />
          </button>
          <div className="w-px h-6 mx-1 bg-slate-200 dark:bg-gray-700 self-center"></div>
          <button
            onClick={toggleViewMode}
            className={`p-2 rounded-full transition-all ${buttonText} ${buttonHover}`}
            onMouseEnter={() => handleTooltip("Switch to Book View")}
            onMouseLeave={() => handleTooltip("")}
          >
            <BookMarked size={14} className="stroke-2" />
          </button>
          <button
            onClick={copyToClipboard}
            className={`p-2 rounded-full relative transition-all ${buttonText} ${buttonHover}`}
            onMouseEnter={() => handleTooltip("Copy")}
            onMouseLeave={() => handleTooltip("")}
          >
            <Copy size={14} className="stroke-2" />
            {copied && (
              <span className="absolute -top-8 sm:-top-10 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 sm:px-3 py-1 rounded-md shadow-lg z-10">
                Copied!
              </span>
            )}
          </button>
          <button
            onClick={downloadContent}
            className={`p-2 rounded-full transition-all ${buttonText} ${buttonHover}`}
            onMouseEnter={() => handleTooltip("Download")}
            onMouseLeave={() => handleTooltip("")}
          >
            <Download size={14} className="stroke-2" />
          </button>
          <button
            onClick={toggleFullscreen}
            className={`p-2 rounded-full transition-all ${buttonText} ${buttonHover}`}
            onMouseEnter={() => handleTooltip(fullscreen ? "Exit Fullscreen" : "Fullscreen")}
            onMouseLeave={() => handleTooltip("")}
          >
            {fullscreen ? (
              <Minimize2 size={14} className="stroke-2" />
            ) : (
              <Maximize2 size={14} className="stroke-2" />
            )}
          </button>
          <button
            className={`p-2 rounded-full transition-all ${buttonText} ${buttonHover}`}
            onMouseEnter={() => handleTooltip("Share")}
            onMouseLeave={() => handleTooltip("")}
          >
            <Share2 size={14} className="stroke-2" />
          </button>
        </div>
      </div>

      {showTooltip && (
        <div className="absolute top-12 right-2 sm:right-4 bg-black text-white text-xs px-2 sm:px-3 py-1 rounded-md shadow-lg z-30 transition-opacity duration-200">
          {showTooltip}
        </div>
      )}

      <div ref={contentRef} className="flex-1 overflow-y-auto max-w-full">
        {hasActivatedCanvasView && renderCanvasContent()}
      </div>

      {currentContentType === "code" &&
        viewMode === "canvas" &&
        hasActivatedCanvasView && (
          <div className="z-20 bg-gray-800 text-gray-400 text-xs py-2 px-2 sm:px-4 border-t border-gray-700 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-gray-400"></div>
              <span>{currentContent.split("\n").length} lines</span>
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