import React, { useState } from 'react';
import { BookOpen } from 'lucide-react';
import ChatInterface from './components/ChatInterface';
import LearningModule from './components/LearningModule';
import DashboardView from './components/DashboardView';
import Sidebar from './components/Sidebar';
import Syllabus from './components/Syllabus';
import ProjectDashboard from './components/ProjectDashboard';
import Assessment from './components/Assessment';
import Notes from './components/Notes';
import QuizModal from './components/QuizModal';
import LoginPage from './components/LoginPage';
import SignUp from './components/SignUp';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');
  const [chatQuestion, setChatQuestion] = useState('');
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [showSyllabus, setShowSyllabus] = useState(true);
  const [activeProject, setActiveProject] = useState(null);
  const [projectName, setProjectName] = useState('');
  const [projects, setProjects] = useState([]);
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [authView, setAuthView] = useState('login'); // New state for auth navigation

  const [notesData, setNotesData] = useState([
    {
      id: 1,
      subject: 'Mathematics',
      content: 'Review calculus formulas for the upcoming test. Focus on integration by parts and substitution methods.',
      timestamp: '2025-05-08T14:30:00Z',
      color: 'bg-blue-50 text-blue-500'
    },
    {
      id: 2,
      subject: 'OOPS with C++',
      content: 'Study inheritance, polymorphism, and encapsulation concepts. Practice virtual functions and operator overloading examples.',
      timestamp: '2025-05-07T09:15:00Z',
      color: 'bg-purple-50 text-purple-500'
    },
    {
      id: 3,
      subject: 'Data Structures',
      content: 'Implement binary search tree and heap data structures. Analyze time complexity for each operation.',
      timestamp: '2025-05-06T11:45:00Z',
      color: 'bg-green-50 text-green-500'
    },
    {
      id: 4,
      subject: 'Computer Networks',
      content: 'Study TCP/IP protocol stack, OSI model layers, and routing algorithms. Review subnet masking calculations.',
      timestamp: '2025-05-05T16:20:00Z',
      color: 'bg-orange-50 text-orange-500'
    },
    {
      id: 5,
      subject: 'Software Engineering',
      content: 'Review software development life cycle models. Study agile methodologies and scrum practices.',
      timestamp: '2025-05-04T10:00:00Z',
      color: 'bg-red-50 text-red-500'
    }
  ]);

  const addNote = (newNote) => {
    setNotesData([newNote, ...notesData]);
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleSignUp = () => {
    setIsLoggedIn(true); // Assuming successful signup leads to login
  };

  const handleNavItemClick = (itemId, projectNameParam) => {
    if (itemId.startsWith('project_')) {
      const projectId = itemId;
      setProjectName(projectNameParam || 'Unnamed Project');
      setActiveProject(projectId);
      setCurrentView('project');
    } else {
      if (itemId === 'learning') {
        setShowSyllabus(false);
      }
      setCurrentView(itemId);
      if (itemId !== 'chat') {
        setChatQuestion('');
        setSelectedLesson(null);
      }
      setActiveProject(null);
      setSelectedAssessment(null);
    }
  };

  const handleNavigate = (view, data) => {
    setCurrentView(view);
    if (view === 'quiz' && data?.assessment) {
      setSelectedAssessment(data.assessment);
    }
  };

  const handleProjectAdded = (newProject) => {
    setProjects([...projects, newProject]);
  };

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

  const handleBackToAssessment = () => {
    setCurrentView('assessment');
    setSelectedAssessment(null);
  };

  const handleShowSignUp = () => {
    setAuthView('signup');
  };

  const handleShowLogin = () => {
    setAuthView('login');
  };

  if (!isLoggedIn) {
    return (
      <>
        {authView === 'login' && <LoginPage onLogin={handleLogin} onShowSignUp={handleShowSignUp} />}
        {authView === 'signup' && <SignUp onSignUp={handleSignUp} onShowLogin={handleShowLogin} />}
      </>
    );
  }

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
            category="Your Category"
            categoryIcon={<BookOpen size={24} />}
            categoryColor="bg-blue-50 text-blue-500"
            initialQuestion={chatQuestion}
            selectedLesson={selectedLesson}
            onBackClick={handleBackToSyllabus}
            addNote={addNote}
            onNavigate={handleNavigate}
          />
        )}
        {currentView === 'dashboard' && (
          <DashboardView />
        )}
        {currentView === 'assessment' && (
          <Assessment 
            category="React Development"
            categoryIcon={<BookOpen size={24} />}
            categoryColor="bg-blue-50 text-blue-500"
            onBackClick={() => handleNavItemClick('dashboard')}
            onNavigate={handleNavigate}
          />
        )}
        {currentView === 'notes' && (
          <Notes notesData={notesData} setNotesData={setNotesData} />
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
        {currentView === 'quiz' && (
          <QuizModal
            assessment={selectedAssessment}
            onBackClick={handleBackToAssessment}
          />
        )}
      </div>
    </div>
  );
};

export default App;