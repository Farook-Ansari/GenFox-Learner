import React, { useState } from 'react';
import { BookOpen } from 'lucide-react';
import ChatInterface from './components/chatInterface'; 
import LearningModule from './components/LearningModule';
import DashboardView from './components/DashboardView';
import Sidebar from './components/Sidebar';
import Syllabus from './components/Syllabus';
import ProjectDashboard from './components/ProjectDashboard';
import Assessment from './components/Assessment'; // Fixed the typo in the import


const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');
  const [chatQuestion, setChatQuestion] = useState('');
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [showSyllabus, setShowSyllabus] = useState(true);
  const [activeProject, setActiveProject] = useState(null);
  const [projectName, setProjectName] = useState('');
  const [projects, setProjects] = useState([]);  // Track projects at the App level
  
  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleNavItemClick = (itemId, projectNameParam) => {
    // Check if the clicked item is a project
    if (itemId.startsWith('project_')) {
      const projectId = itemId;
      // Use the project name passed from the Sidebar component
      setProjectName(projectNameParam || 'Unnamed Project');
      setActiveProject(projectId);
      setCurrentView('project');
    } else {
      if (itemId === 'learning') {
        setShowSyllabus(false);
      }
      
      setCurrentView(itemId);
      // Reset chat question when navigating to other views
      if (itemId !== 'chat') {
        setChatQuestion('');
        setSelectedLesson(null);
      }
      
      setActiveProject(null);
    }
  };

  // Function to handle new projects created in the Sidebar
  const handleProjectAdded = (newProject) => {
    setProjects([...projects, newProject]);
  };

  // Function to handle project updates from the Sidebar
  const handleProjectUpdated = (updatedProjects) => {
    setProjects(updatedProjects);
  };

  const handleCardClick = (title) => {
    setChatQuestion(title);
    setCurrentView('chat');
  };

  const handleLessonClick = (moduleTitle, lesson) => {
    const initialQuestion = `Tell me about "${lesson.title}" from the ${moduleTitle} module`;
    setChatQuestion(initialQuestion);
    setSelectedLesson({
      moduleTitle,
      lesson,
      initialQuestion
    });
    setShowSyllabus(false);
    setCurrentView('chat');
  };

  const handleBackToSyllabus = () => {
    setShowSyllabus(true);
    setCurrentView('learning');
  };

  const handleBackToProjects = () => {
    setCurrentView('schedule');
    setActiveProject(null);
  };

  // Updated Login Page Component with improved responsiveness and no blue bubbles
  const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isHovered, setIsHovered] = useState(false);

    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div 
          className={`w-full max-w-md mx-4 p-6 bg-white rounded-xl shadow-lg 
                    border border-blue-100 transition-transform duration-300
                    ${isHovered ? 'scale-105' : 'scale-100'}`}
          style={{
            backgroundImage: 'linear-gradient(135deg, rgba(239,246,255,0.8) 0%, rgba(255,255,255,0.95) 100%)',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 0 15px rgba(59, 130, 246, 0.15)'
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <h1 className="text-center mb-6">
            <span className="text-3xl font-semibold text-slate-700">
              Login
            </span>
          </h1>
          
          <div className="mb-5">
            <label className="block mb-2 text-sm font-medium text-slate-700" htmlFor="email">
              Email
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" 
                     stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
              </div>
              <input
                id="email"
                type="email"
                className="w-full px-4 py-3 pl-10 bg-blue-50 border border-blue-100 rounded-lg
                        text-slate-700 placeholder-slate-400 text-base
                        focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-transparent
                        transition-all duration-300"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium text-slate-700" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" 
                     stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <input
                id="password"
                type="password"
                className="w-full px-4 py-3 pl-10 bg-blue-50 border border-blue-100 rounded-lg
                        text-slate-700 placeholder-slate-400 text-base
                        focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-transparent
                        transition-all duration-300"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          
          <button
            className="w-full px-4 py-3 text-white font-medium rounded-lg
                    bg-gradient-to-r from-blue-500 to-indigo-600
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                    hover:shadow-lg transition-all duration-300
                    relative overflow-hidden text-base"
            onClick={handleLogin}
          >
            <span className="relative z-10">Sign In</span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 opacity-0 hover:opacity-20 transition-opacity duration-300"></div>
          </button>
          
          <div className="mt-4 text-center">
            <a href="#" className="text-sm text-blue-600 hover:text-blue-800 transition-colors duration-300">
              Forgot password?
            </a>
          </div>
        </div>
      </div>
    );
  };

  // If not logged in, show login page
  if (!isLoggedIn) {
    return <LoginPage />;
  }

  // Main app layout after login
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar 
        onNavItemClick={handleNavItemClick} 
        onProjectAdded={handleProjectAdded}
        onProjectsUpdated={handleProjectUpdated}
        initialProjects={projects}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        {currentView === 'project' && activeProject && (
          <ProjectDashboard 
            projectId={activeProject} 
            projectName={projectName}
            onBackClick={handleBackToProjects}
          />
        )}
        {currentView === 'learning' && showSyllabus && (
          <Syllabus 
            category="React Development" 
            categoryIcon={<BookOpen size={24} />} 
            categoryColor="bg-blue-50 text-blue-500" 
            onLessonClick={handleLessonClick}
            onBackClick={() => handleNavItemClick('dashboard')}
          />
        )}
        {currentView === 'learning' && !showSyllabus && (
          <LearningModule onCardClick={handleCardClick} />
        )}
        {currentView === 'chat' && (
          <ChatInterface 
            initialQuestion={chatQuestion} 
            selectedLesson={selectedLesson}
            onBackClick={handleBackToSyllabus}
          />
        )}
        {currentView === 'dashboard' && (
          <DashboardView />
        )}
        {currentView === 'assessment' && (
          <Assessment />
        )}
        {currentView === 'schedule' && (
          <div className="flex-1 bg-slate-50 p-6 overflow-y-auto">
            <h1 className="text-2xl font-semibold text-slate-700">Study Resources</h1>
            {projects.length > 0 ? (
              <p className="mt-4">Select a project from the sidebar to view its details.</p>
            ) : (
              <p className="mt-4">Click the + icon next to "Study Resources" in the sidebar to create your first project.</p>
            )}
          </div>
        )}
        {currentView === 'settings' && (
          <div className="flex-1 bg-slate-50 p-6 overflow-y-auto">
            <h1 className="text-2xl font-semibold text-slate-700">Settings View</h1>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;