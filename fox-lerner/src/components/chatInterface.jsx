import { useState, useRef, useEffect, useCallback } from "react";
import {
  Send,
  ThumbsUp,
  ThumbsDown,
  HelpCircle,
  X,
  Smile,
  ArrowLeft,
  Mic,
  Share2,
  Video,
  MessageSquare,
  Camera,
  ChevronDown,
  Check,
  BookmarkPlus,
  ScreenShare,
} from "lucide-react";
import CanvasArea from "./CanvasArea";

const MAX_RECONNECT_ATTEMPTS = 5;
const RECONNECT_DELAY = 3000;

const ChatInterface = ({
  category,
  categoryIcon,
  categoryColor,
  onBackClick,
  initialQuestion = "",
  addNote,
  onNavigate,
}) => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState(initialQuestion);
  const [currentFrame, setCurrentFrame] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [isVoiceModeActive, setIsVoiceModeActive] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [accumulatedContent, setAccumulatedContent] = useState("");
  const [canvasContent, setCanvasContent] = useState({
    content: "",
    contentType: "markdown",
    title: "Conversation History",
    language: "plaintext",
  });

  const recognition = useRef(null);
  const recognitionRef = useRef(null);
  const audioRef = useRef(null);
  const messagesEndRef = useRef(null);
  const [showCanvas, setShowCanvas] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [fullExplanation, setFullExplanation] = useState("");
  const [currentExplanation, setCurrentExplanation] = useState("");
  const typingSpeedRef = useRef(2);

  const [explainMode, setExplainMode] = useState("chat");
  const [micActive, setMicActive] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);

  const videoRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const inputRef = useRef(null);

  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedOption, setSelectedOption] = useState("teach");
  const [optionSelected, setOptionSelected] = useState(true);

  const [showChatDropdown, setShowChatDropdown] = useState(false);
  const [selectedChat, setSelectedChat] = useState("chat1");
  const [chatSelected, setChatSelected] = useState(false);

  const [showAddNoteMenu, setShowAddNoteMenu] = useState(false);
  const [selectedText, setSelectedText] = useState("");
  const [noteMenuPosition, setNoteMenuPosition] = useState({ top: 0, left: 0 });
  const [isRecognitionActive, setIsRecognitionActive] = useState(false);
  const canvasRef = useRef(null);
  const ws = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const base64ToBlob = (base64, mimeType) => {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
  };

  const connectWebSocket = useCallback((attempt = 0) => {
    if (
      ws.current &&
      [WebSocket.OPEN, WebSocket.CONNECTING].includes(ws.current.readyState)
    ) {
      console.log("WebSocket already open or connecting, attempt:", attempt);
      return;
    }

    ws.current = new WebSocket("ws://localhost:8765/ws");
    let reconnectTimer = null;

    ws.current.onopen = () => {
      console.log("WebSocket connection opened, attempt:", attempt);
      if (reconnectTimer) clearTimeout(reconnectTimer);
    };

    ws.current.onmessage = async (event) => {
      const data = JSON.parse(event.data);
      console.log("Received data from backend:", data);
      const newMessage = {
        type: "assistant",
        content: data.text,
        mode: data.mode,
        quizOptions: data.quizOptions || null,
      };

      setMessages((prev) => [...prev, newMessage]);

      const title =
        data.responseType === "quiz"
          ? `Quiz on "${data.question}"`
          : `Explanation of "${data.question}"`;
      setAccumulatedContent((prev) => {
        const newContent =
          prev + `\n\n## ${title}\n\n${data.detailed}\n\n---\n\n`;
        setCanvasContent({
          content: newContent,
          contentType: "markdown",
          title: "Conversation History",
          language: "plaintext",
        });
        return newContent;
      });

      if (data.mode === "voice_query" && data.audio) {
        console.log("Processing voice response with audio");
        stopRecognition();
        const audioBlob = base64ToBlob(data.audio, "audio/mp3");
        const audioUrl = URL.createObjectURL(audioBlob);
        audioRef.current = new Audio(audioUrl);
        handleAudioEvents(audioRef.current);

        audioTimeoutRef.current = setTimeout(() => {
          if (isPlayingAudio) {
            console.warn("Audio playback timeout");
            setIsPlayingAudio(false);
            if (isVoiceModeActive) startRecognition();
          }
        }, 10000);

        audioRef.current.play().catch((e) => {
          console.error("Error playing audio:", e);
          clearTimeout(audioTimeoutRef.current);
          setIsPlayingAudio(false);
          if (isVoiceModeActive) startRecognition();
        });
      }
      setIsProcessing(false);
      setShowCanvas(true);
    };

    ws.current.onerror = (error) => {
      console.error("WebSocket error:", error);
      if (
        ![WebSocket.CLOSED, WebSocket.CLOSING].includes(ws.current?.readyState)
      ) {
        ws.current?.close();
      }
    };

    ws.current.onclose = (event) => {
      console.log("WebSocket connection closed:", event.code, event.reason);
      if (attempt < MAX_RECONNECT_ATTEMPTS) {
        reconnectTimer = setTimeout(
          () => connectWebSocket(attempt + 1),
          RECONNECT_DELAY
        );
      }
    };
  }, []);

  useEffect(() => {
    connectWebSocket();
    return () => {
      if (ws.current?.readyState === WebSocket.OPEN) {
        ws.current.close(1000, "Component unmounted");
      }
      if (audioTimeoutRef.current) {
        clearTimeout(audioTimeoutRef.current);
      }
      stopRecognition();
    };
  }, [connectWebSocket]);

  useEffect(() => {
    setCanvasContent({
      content: accumulatedContent,
      contentType: "markdown",
      title: "Conversation History",
      language: "plaintext",
    });
  }, [accumulatedContent]);

  useEffect(() => {
    if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      recognition.current = new SpeechRecognition();
      recognition.current.continuous = false;
      recognition.current.interimResults = false;
      recognition.current.lang = "en-US";

      recognition.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
      };

      recognition.current.onerror = (event) => {
        setVoiceStatus(`Error: ${event.error}`);
      };

      recognition.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  useEffect(() => {
    return () => {
      stopRecognition();
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const startRecognition = () => {
    if (
      !("SpeechRecognition" in window || "webkitSpeechRecognition" in window)
    ) {
      console.error("Speech recognition not supported in this browser");
      alert("Speech recognition is not supported in this browser.");
      setVoiceStatus("Speech recognition not supported");
      return;
    }

    if (!recognitionRef.current) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onstart = () => {
        console.log("Speech recognition started");
        setIsRecognitionActive(true);
        setVoiceStatus("Listening...");
      };

      recognitionRef.current.onresult = (event) => {
        const transcript =
          event.results[event.results.length - 1][0].transcript;
        console.log("Transcribed text:", transcript);
        setInputText(transcript);
        setIsProcessing(true);
        setVoiceStatus("Processing...");
        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
          console.log("Sending voice query to backend:", {
            type: "voice_query",
            question: transcript,
            frame: currentFrame ? "Frame data present" : "No frame",
            mode: selectedOption,
          });
          ws.current.send(
            JSON.stringify({
              type: "voice_query",
              question: transcript,
              frame: currentFrame,
              mode: selectedOption,
            })
          );
        } else {
          console.error("WebSocket not open for sending voice query");
          setVoiceStatus("WebSocket connection error");
        }
      };

      recognitionRef.current.onend = () => {
        console.log("Speech recognition ended");
        setIsRecognitionActive(false);
        if (isVoiceModeActive && !isPlayingAudio) {
          console.log("Restarting recognition due to voice mode active");
          startRecognition();
        } else {
          setVoiceStatus("");
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setVoiceStatus(`Error: ${event.error}`);
        if (event.error === "no-speech") {
          console.log("No speech detected, restarting recognition");
          if (isVoiceModeActive) setTimeout(startRecognition, 500);
        } else if (
          event.error === "not-allowed" ||
          event.error === "service-not-allowed"
        ) {
          alert(
            "Microphone access denied. Please allow microphone permissions."
          );
          setIsVoiceModeActive(false);
        }
      };
    }

    if (!isRecognitionActive) {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then(() => {
          console.log("Microphone access granted");
          try {
            recognitionRef.current.start();
          } catch (error) {
            console.error("Failed to start recognition:", error);
            setVoiceStatus("Error starting recognition");
          }
        })
        .catch((err) => {
          console.error("Microphone permission denied:", err);
          alert("Please allow microphone access to use voice mode.");
          setVoiceStatus("Microphone access denied");
          setIsVoiceModeActive(false);
        });
    }
  };

  const stopRecognition = () => {
    if (recognitionRef.current && isRecognitionActive) {
      recognitionRef.current.stop();
    }
  };

  const handleMicClick = () => {
    if (isVoiceModeActive) {
      console.log("Stopping voice mode");
      setIsVoiceModeActive(false);
      stopRecognition();
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      setVoiceStatus("");
    } else {
      console.log("Starting voice mode");
      setIsVoiceModeActive(true);
      startRecognition();
    }
  };

  const handleAudioEvents = (audio) => {
    audio.addEventListener("canplay", () => {
      console.log("Audio can play");
    });

    audio.addEventListener("playing", () => {
      console.log("Audio is playing");
      setIsPlayingAudio(true);
      setVoiceStatus("Playing Response...");
    });

    audio.addEventListener("ended", () => {
      console.log("Audio ended");
      setIsPlayingAudio(false);
      startRecognition();
      clearTimeout(audioTimeoutRef.current);
    });

    audio.addEventListener("error", (e) => {
      console.error("Audio error:", e);
      clearTimeout(audioTimeoutRef.current);
      setIsPlayingAudio(false);
      if (isVoiceModeActive) {
        startRecognition();
      }
    });
  };

  const audioTimeoutRef = useRef(null);

  async function startScreenShare() {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { frameRate: 5 },
      });
      stream.getVideoTracks()[0].addEventListener("ended", () => {
        setCurrentFrame(null);
        setIsVoiceModeActive(false);
        stopRecognition();
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current = null;
        }
        setVoiceStatus("");
      });
      const processor = new MediaStreamTrackProcessor({
        track: stream.getVideoTracks()[0],
      });
      const reader = processor.readable.getReader();

      const processFrame = async () => {
        try {
          const { done, value } = await reader.read();
          if (done) return;

          const bitmap = await createImageBitmap(value);
          const canvas = document.createElement("canvas");
          canvas.width = bitmap.width;
          canvas.height = bitmap.height;
          canvas.getContext("2d").drawImage(bitmap, 0, 0);
          setCurrentFrame(canvas.toDataURL("image/jpeg").split(",")[1]);

          setTimeout(processFrame, 200);
        } catch (error) {
          console.error("Frame processing error:", error);
        }
      };

      processFrame();
    } catch (error) {
      console.error("Error sharing screen:", error);
    }
  }

  const cleanupMediaResources = () => {
    if (micActive) {
      setMicActive(false);
    }

    if (cameraActive) {
      setCameraActive(false);
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = null;
      }
    }
  };

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && currentFrame) {
        connectWebSocket();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [currentFrame, connectWebSocket]);

  const handleSendMessage = (isVoice = false) => {
    if (inputText.trim() === "" || !selectedOption) return;

    const newMessage = {
      type: "user",
      content: inputText,
      mode: isVoice ? "voice" : "text",
    };
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);

    const history = updatedMessages.map((msg) => ({
      role: msg.type,
      content: msg.content,
    }));

    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      setIsProcessing(true);
      ws.current.send(
        JSON.stringify({
          type: isVoice ? "voice_query" : "text_query",
          question: inputText,
          frame: currentFrame,
          mode: selectedOption,
          category: category,
          history: history,
        })
      );
    } else {
      const matchedFlow = questionAnswerFlow.find((flow) =>
        flow.question.test(inputText)
      );
      if (matchedFlow) {
        const chatResponse = matchedFlow.chatResponse;
        const canvasData = matchedFlow.canvasContent;

        if (matchedFlow.question.test(/first element.*index 0/i)) {
          setSelectedOption("quiz");
          setOptionSelected(true);
        }

        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            { type: "assistant", content: chatResponse },
          ]);
          if (selectedOption !== "learn") {
            const title = `Explanation of "${inputText}"`;
            setAccumulatedContent(
              (prev) =>
                prev + `\n\n## ${title}\n\n${canvasData.content}\n\n---\n\n`
            );
          }
        }, 1000);
      } else {
        console.warn(
          "WebSocket is not open or no flow match. Falling back to default response."
        );
        const chatResponse = `This is a simulated response about ${category} using the ${selectedOption} approach in ${selectedChat}.`;
        const detailed = `\n\nExplanation of ${inputText}`;

        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            { type: "assistant", content: chatResponse },
          ]);
          if (selectedOption !== "learn") {
            const title = `Explanation of "${inputText}"`;
            setAccumulatedContent(
              (prev) => prev + `\n\n## ${title}\n\n${detailed}\n\n---\n\n`
            );
          }
        }, 1000);
      }
    }

    setInputText("");
  };

  const handleQuizSubmit = (messageIndex) => {
    const message = messages[messageIndex];
    const selected = quizAnswers[messageIndex] || [];
    const correctAnswer = "30";
    const isCorrect = selected.includes(correctAnswer) && selected.length === 1;
    const feedback = isCorrect
      ? "Correct! arr[2] is 30."
      : `Incorrect. The correct answer is 30. You selected: ${selected.join(
          ", "
        )}.`;

    setMessages((prev) =>
      prev.map((msg, idx) =>
        idx === messageIndex ? { ...msg, feedback } : msg
      )
    );
  };

  const handleCheckboxChange = (messageIndex, option) => {
    setQuizAnswers((prev) => {
      const currentAnswers = prev[messageIndex] || [];
      if (currentAnswers.includes(option)) {
        return {
          ...prev,
          [messageIndex]: currentAnswers.filter((ans) => ans !== option),
        };
      } else {
        return {
          ...prev,
          [messageIndex]: [...currentAnswers, option],
        };
      }
    });
  };

  const handleSelectExplainMode = (mode) => {
    setExplainMode(mode);

    if (mode === "audio" || mode === "video") {
      if (
        (mode === "audio" && !micActive) ||
        (mode === "video" && !cameraActive)
      ) {
        requestMediaPermissions(mode);
      }
    } else {
      cleanupMediaResources();
    }
  };

  const requestMediaPermissions = (mode) => {
    const constraints = {
      audio: mode === "audio" || mode === "video",
      video:
        mode === "video"
          ? {
              facingMode: "user",
              width: { ideal: 640 },
              height: { ideal: 480 },
            }
          : false,
    };

    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream) => {
        if (mode === "audio" || mode === "video") {
          setMicActive(true);
        }

        if (mode === "video") {
          setCameraActive(true);
          mediaStreamRef.current = stream;

          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current
              .play()
              .catch((err) => console.error("Error playing video:", err));
          }
        }
      })
      .catch((err) => {
        console.error("Media permissions denied:", err);
        alert(
          `Please allow ${
            mode === "audio" ? "microphone" : "camera and microphone"
          } access to use this feature.`
        );
        setExplainMode("chat");
      });
  };

  const handleOpenExplainOptions = (message) => {
    setSelectedMessage(message);
    setExplainMode("chat");
    if (selectedOption === "learn") {
      startLearningSession(message);
    } else {
      startExplanation(message);
    }
  };

  const startExplanation = (message) => {
    const explanation = `Here's a simpler explanation of:\n\n"${message}"\n\nThis means the AI assistant is providing a detailed response about ${category}.`;
    const title = `Explanation of "${message}"`;
    setAccumulatedContent(
      (prev) => prev + `\n\n## ${title}\n\n${explanation}\n\n---\n\n`
    );
    setShowCanvas(true);
    setExplainMode("chat");
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "44px";
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
  }, [inputText]);

  useEffect(() => {
    if (isTyping && currentExplanation.length < fullExplanation.length) {
      const timer = setTimeout(() => {
        setCurrentExplanation(
          fullExplanation.substring(0, currentExplanation.length + 1)
        );
      }, typingSpeedRef.current);

      return () => clearTimeout(timer);
    } else if (
      isTyping &&
      currentExplanation.length === fullExplanation.length
    ) {
      setIsTyping(false);
    }
  }, [isTyping, currentExplanation, fullExplanation]);

  useEffect(() => {
    if (!showCanvas) {
      cleanupMediaResources();
      setAccumulatedContent("");
      setCurrentExplanation("");
      setFullExplanation("");
    }
  }, [showCanvas]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDropdown && !event.target.closest(".option-dropdown-container")) {
        setShowDropdown(false);
      }
      if (
        showChatDropdown &&
        !event.target.closest(".chat-dropdown-container")
      ) {
        setShowChatDropdown(false);
      }
      if (showAddNoteMenu && !event.target.closest(".add-note-menu")) {
        setShowAddNoteMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showDropdown, showChatDropdown, showAddNoteMenu]);

  useEffect(() => {
    const handleTextSelection = () => {
      const selection = window.getSelection();

      if (selection && selection.toString().trim().length > 0) {
        if (
          canvasRef.current &&
          canvasRef.current.contains(selection.anchorNode)
        ) {
          const selectedText = selection.toString().trim();
          setSelectedText(selectedText);

          const range = selection.getRangeAt(0);
          const rect = range.getBoundingClientRect();

          const canvasRect = canvasRef.current.getBoundingClientRect();
          const canvasScrollTop = canvasRef.current.scrollTop;
          const canvasScrollLeft = canvasRef.current.scrollLeft;

          const menuWidth = 120;
          const menuHeight = 40;

          const relativeTop =
            rect.top - canvasRect.top + canvasScrollTop - menuHeight - 10;
          const relativeLeft =
            rect.left -
            canvasRect.left +
            canvasScrollLeft +
            rect.width / 2 -
            menuWidth / 2;

          setNoteMenuPosition({
            top: relativeTop,
            left: relativeLeft,
          });

          setShowAddNoteMenu(true);
        }
      } else {
        setShowAddNoteMenu(false);
      }
    };

    document.addEventListener("mouseup", handleTextSelection);
    return () => document.removeEventListener("mouseup", handleTextSelection);
  }, []);

  const handleCloseCanvas = () => {
    setShowCanvas(false);
    setIsTyping(false);
    setCurrentExplanation("");
    setExplainMode("chat");
    cleanupMediaResources();
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (selectedOption) {
        handleSendMessage();
      } else {
        alert(
          "Please select an option first (Teach Me, Learn With Me, or Quiz Me)"
        );
      }
    }
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setShowDropdown(false);
    setOptionSelected(true);
  };

  const startLearningSession = (message) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      setIsProcessing(true);
      ws.current.send(
        JSON.stringify({
          type: "text_query",
          question: `Explain ${message} in a learning session for ${category} using interactive examples`,
          frame: currentFrame,
          mode: "learn",
        })
      );
      setShowCanvas(true);
      setExplainMode("chat");
    }
  };

  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
    setShowChatDropdown(false);
    setChatSelected(true);
  };

  const handleAddNote = () => {
    if (selectedText) {
      const colors = [
        "bg-blue-50 text-blue-500",
        "bg-purple-50 text-purple-500",
        "bg-green-50 text-green-500",
        "bg-orange-50 text-orange-500",
        "bg-red-50 text-red-500",
        "bg-indigo-50 text-indigo-500",
      ];

      const newNote = {
        id: Date.now(),
        subject: category,
        content: selectedText,
        timestamp: new Date().toISOString(),
        color: colors[Math.floor(Math.random() * colors.length)],
      };

      addNote(newNote);
      setShowAddNoteMenu(false);

      alert(
        `Note added: "${selectedText.substring(0, 30)}${
          selectedText.length > 30 ? "..." : ""
        }"`
      );

      if (onNavigate) {
        onNavigate("notes");
      }
    }
  };

  const optionLabels = {
    teach: "Teach Me",
    learn: "Learn With Me",
    quiz: "Quiz Me",
  };

  const chatOptions = ["chat1", "chat2", "chat3"];

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex-1 flex">
        <div
          className={`${
            showCanvas ? "w-2/5" : "w-full"
          } flex flex-col border-r border-slate-100`}
        >
          <div className="sticky top-0 z-10 border-b border-slate-100 bg-white p-3 flex items-center justify-between text-slate-700 shadow-sm">
            <div className="flex items-center flex-1">
              <button
                className="p-1 rounded-full hover:bg-slate-50 transition-colors text-slate-500"
                onClick={onBackClick}
              >
                <ArrowLeft size={16} />
              </button>
              <div className="ml-2 flex items-center">
                <span className="mr-1 text-sm text-slate-500">
                  {categoryIcon}
                </span>
                <h2 className="font-medium text-sm text-slate-700">
                  {category}
                </h2>
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
                        {selectedOption === value && (
                          <Check size={12} className="text-indigo-500" />
                        )}
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
                      {selectedChat === chat && (
                        <Check size={12} className="text-indigo-500" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div
            className="flex-1 overflow-y-auto py-3 px-3 bg-slate-50"
            style={{ maxHeight: "calc(100vh - 120px)" }}
          >
            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-4 ${
                  message.type === "user" ? "flex justify-end" : ""
                }`}
              >
                {message.type === "assistant" && (
                  <div className="flex">
                    <div className="bg-slate-200 text-slate-600 h-6 w-6 rounded-full flex items-center justify-center mr-2 shadow-sm">
                      <span className="text-xs font-medium">AI</span>
                    </div>
                    <div className="max-w-2xl">
                      <div className="p-3 bg-white rounded-lg shadow-sm mt-5">
                        <p className="text-sm text-slate-700">
                          {message.content}
                        </p>
                        {selectedOption === "quiz" && message.quizOptions && (
                          <div className="mt-2">
                            {message.quizOptions.map((option, optIndex) => (
                              <label
                                key={optIndex}
                                className="flex items-center space-x-2"
                              >
                                <input
                                  type="checkbox"
                                  checked={(quizAnswers[index] || []).includes(
                                    option
                                  )}
                                  onChange={() =>
                                    handleCheckboxChange(index, option)
                                  }
                                  className="form-checkbox text-indigo-600"
                                />
                                <span className="text-sm text-slate-700">
                                  {option}
                                </span>
                              </label>
                            ))}
                            <button
                              className="mt-2 px-2 py-1 bg-indigo-500 text-white rounded hover:bg-indigo-600"
                              onClick={() => handleQuizSubmit(index)}
                            >
                              Submit
                            </button>
                            {message.feedback && (
                              <p
                                className={`mt-2 text-sm ${
                                  message.feedback.includes("Correct")
                                    ? "text-green-600"
                                    : "text-red-600"
                                }`}
                              >
                                {message.feedback}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="mt-1 flex gap-1">
                        <button className="p-1 rounded-full hover:bg-white text-slate-400 transition-colors">
                          <ThumbsUp size={12} />
                        </button>
                        <button className="p-1 rounded-full hover:bg-white text-slate-400 transition-colors">
                          <ThumbsDown size={12} />
                        </button>
                        {selectedOption !== "learn" && (
                          <button
                            className="px-1 py-0.5 rounded-full hover:bg-white text-slate-500 flex items-center transition-colors"
                            onClick={() =>
                              handleOpenExplainOptions(message.content)
                            }
                          >
                            <HelpCircle size={12} />
                            <span className="ml-1 text-xs">Explain it Fox</span>
                          </button>
                        )}
                        {selectedOption === "learn" && (
                          <button
                            className="px-1 py-0.5 rounded-full hover:bg-white text-slate-500 flex items-center transition-colors"
                            onClick={() =>
                              handleOpenExplainOptions(message.content)
                            }
                          >
                            <BookmarkPlus size={12} />
                            <span className="ml-1 text-xs">Explain It Fox</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                {message.type === "user" && (
                  <div className="max-w-sm bg-indigo-500 text-white rounded-lg p-2 shadow-sm mt-13">
                    <p className="text-sm">{message.content}</p>
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="border-t border-slate-100 bg-white p-3">
            {selectedOption === "learn" && (
              <div className="mb-2 flex justify-center">
                <div className="flex gap-1 bg-slate-50 rounded-lg p-1 shadow-sm">
                  <button
                    className={`p-1 rounded-full hover:bg-slate-100 transition-colors ${
                      isVoiceModeActive
                        ? isListening
                          ? "animate-pulse bg-red-100 text-red-600"
                          : "bg-green-100 text-green-600"
                        : "text-slate-400"
                    }`}
                    onClick={handleMicClick}
                    title={
                      isVoiceModeActive ? "Stop Voice Mode" : "Start Voice Mode"
                    }
                  >
                    <Mic size={14} />
                  </button>
                  <button
                    className={`p-1 rounded-full hover:bg-slate-100 transition-colors ${
                      currentFrame
                        ? "bg-indigo-100 text-indigo-600"
                        : "text-slate-400"
                    }`}
                    onClick={startScreenShare}
                    title="Screen Share"
                  >
                    <ScreenShare size={14} />
                  </button>
                  <button
                    className={`p-1 rounded-full hover:bg-slate-100 transition-colors ${
                      explainMode === "video"
                        ? "bg-indigo-100 text-indigo-600"
                        : "text-slate-400"
                    }`}
                    onClick={() => handleSelectExplainMode("video")}
                    title="Video explanation"
                  >
                    <Video size={14} />
                  </button>
                  {isVoiceModeActive && (
                    <span className="ml-1 px-1 py-0.5 bg-red-100 text-red-600 rounded-full text-xs flex items-center">
                      <Mic size={10} className="mr-0.5" />{" "}
                      {voiceStatus || "Active"}
                    </span>
                  )}
                  {currentFrame && (
                    <span className="ml-1 px-1 py-0.5 bg-indigo-100 text-indigo-600 rounded-full text-xs flex items-center">
                      <ScreenShare size={10} className="mr-0.5" /> Sharing
                    </span>
                  )}
                  {cameraActive && (
                    <span className="ml-1 px-1 py-0.5 bg-red-100 text-red-600 rounded-full text-xs flex items-center">
                      <Video size={10} className="mr-0.5" /> Camera active
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
                  style={{ minHeight: "36px", maxHeight: "80px" }}
                />
                <button className="p-1 text-slate-300 hover:text-slate-500">
                  <Smile size={16} />
                </button>
              </div>
              <button
                className={`ml-1 p-1 rounded-lg ${
                  inputText.trim() && selectedOption
                    ? "bg-indigo-500 text-white hover:bg-indigo-600"
                    : "bg-slate-100 text-slate-400"
                } transition-all`}
                onClick={() => handleSendMessage()}
                disabled={!inputText.trim() || !selectedOption}
              >
                <Send size={16} />
              </button>
            </div>
            <div className="mt-1">
              <p className="text-xs text-slate-400 text-center">
                AI responses may contain inaccuracies. Please verify important
                information.
              </p>
            </div>
          </div>
        </div>

        {showCanvas && (
          <div
            className="w-3/5 flex flex-col relative"
            style={{ maxHeight: "calc(100vh - 60px)" }}
          >
            <div className="sticky top-0 z-10 bg-white p-2 flex justify-between items-center text-black shadow-sm">
              <h3 className="font-medium flex items-center text-sm">
                {selectedOption === "learn" ? (
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
                        className={`p-1 rounded-full hover:bg-slate-100 transition-colors ${
                          explainMode === "chat"
                            ? "bg-indigo-100 text-indigo-600"
                            : "text-slate-400"
                        }`}
                        onClick={() => handleSelectExplainMode("chat")}
                        title="Text explanation"
                      >
                        <MessageSquare size={12} />
                      </button>
                      <button
                        className={`p-1 rounded-full hover:bg-slate-100 transition-colors ${
                          explainMode === "audio"
                            ? "bg-indigo-100 text-indigo-600"
                            : "text-slate-400"
                        }`}
                        onClick={() => handleSelectExplainMode("audio")}
                        title="Voice explanation"
                      >
                        <Mic size={12} />
                      </button>
                      <button
                        className={`p-1 rounded-full hover:bg-slate-100 transition-colors ${
                          explainMode === "video"
                            ? "bg-indigo-100 text-indigo-600"
                            : "text-slate-400"
                        }`}
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

            <div
              className="flex-1 overflow-y-auto bg-slate-50 relative"
              style={{ height: "calc(100% - 32px)" }}
            >
              {showAddNoteMenu && (
                <div
                  className="add-note-menu absolute bg-white rounded-lg shadow-lg py-1 px-3 z-20 flex items-center border border-indigo-100"
                  style={{
                    top: `${noteMenuPosition.top}px`,
                    left: `${noteMenuPosition.left}px`,
                  }}
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
              <div
                className="bg-white rounded-lg p-3 shadow-sm w-full"
                ref={canvasRef}
              >
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
