import React, { useState, useRef, useEffect } from 'react'; 
import { Home, Book, Calendar, MessageSquare, Settings, LogOut, ChevronLeft, ChevronRight, Plus, X, FileText, ChevronDown, MoreHorizontal, Edit2, Trash2 } from 'lucide-react';

const Sidebar = ({ onNavItemClick }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState('dashboard');
  const [activeProject, setActiveProject] = useState(null);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [projects, setProjects] = useState([]);
  const [expandedItems, setExpandedItems] = useState({ schedule: false });
  const [editingProject, setEditingProject] = useState(null);
  const [showActionsForProject, setShowActionsForProject] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  
  const actionsMenuRef = useRef(null);
  
  // Close actions menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (actionsMenuRef.current && !actionsMenuRef.current.contains(event.target)) {
        setShowActionsForProject(null);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'learning', label: 'Acadamic&Support', icon: Book },
    { id: 'schedule', label: 'Study Resources', icon: Calendar, hasAction: true, actionIcon: Plus, hasSubItems: true },
    { id: 'chat', label: 'Chat', icon: MessageSquare },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];
  
  const handleNavItemClick = (itemId) => {
    // Toggle expanded state if item has subitems
    if (navItems.find(item => item.id === itemId)?.hasSubItems) {
      setExpandedItems(prev => ({
        ...prev,
        [itemId]: !prev[itemId]
      }));
      return;
    }
    
    setActiveItem(itemId);
    setActiveProject(null);
    if (onNavItemClick) {
      onNavItemClick(itemId);
    }
  };

  const handleProjectClick = (projectId) => {
    // Find the project by ID to get its name
    const project = projects.find(p => p.id === projectId);
    
    setActiveProject(projectId);
    setActiveItem(null);
    if (onNavItemClick) {
      // Pass both the project ID and name to the parent component
      onNavItemClick(`project_${projectId}`, project ? project.name : 'Unnamed Project');
    }
  };
  
  const handleActionClick = (e, itemId) => {
    e.stopPropagation(); // Prevent triggering the nav item click
    // Open project creation modal
    setShowProjectModal(true);
    setEditingProject(null);
    setNewProjectName('');
    setIsEditing(false);
  };
  
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };
  
  const createNewProject = () => {
    if (newProjectName.trim()) {
      if (isEditing && editingProject) {
        // Update existing project
        setProjects(projects.map(p => 
          p.id === editingProject ? { ...p, name: newProjectName } : p
        ));
      } else {
        // Create new project
        const newProject = {
          id: `project_${Date.now()}`,
          name: newProjectName
        };
        
        setProjects([...projects, newProject]);
        
        // Auto-expand the Study Resources section
        setExpandedItems(prev => ({
          ...prev,
          schedule: true
        }));
      }
      
      // Reset and close modal
      setNewProjectName('');
      setShowProjectModal(false);
      setEditingProject(null);
      setIsEditing(false);
    }
  };
  
  const handleProjectActions = (e, projectId) => {
    e.stopPropagation();
    setShowActionsForProject(projectId === showActionsForProject ? null : projectId);
  };
  
  const editProject = (e, projectId) => {
    e.stopPropagation();
    const project = projects.find(p => p.id === projectId);
    if (project) {
      setEditingProject(projectId);
      setNewProjectName(project.name);
      setShowProjectModal(true);
      setIsEditing(true);
    }
    setShowActionsForProject(null);
  };
  
  const deleteProject = (e, projectId) => {
    e.stopPropagation();
    setProjects(projects.filter(p => p.id !== projectId));
    if (activeProject === projectId) {
      setActiveProject(null);
      setActiveItem('schedule');
    }
    setShowActionsForProject(null);
  };
  
  return (
    <>
      <div
        className={`bg-slate-50 rounded-xl shadow-md m-3 flex flex-col transition-all duration-300 ease-in-out ${
          isCollapsed ? 'w-20' : 'w-72'
        }`}
      >
        {/* Logo and Title with fluid design */}
        <div className="p-4 flex items-center justify-between rounded-t-xl bg-blue-50">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-lg bg-indigo-500 flex items-center justify-center flex-shrink-0 shadow-sm">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" fill="white" fillOpacity="0.2"/>
                <path d="M17.5 12c0 3.038-2.462 5.5-5.5 5.5S6.5 15.038 6.5 12 8.962 6.5 12 6.5s5.5 2.462 5.5 5.5z" fill="white"/>
                <path d="M14 8l-4 8M10 8l4 8" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            {!isCollapsed && <h1 className="font-semibold text-lg text-slate-700">Genfox AI</h1>}
          </div>
          <button
            onClick={toggleSidebar}
            className="text-slate-500 hover:bg-blue-100 p-2 rounded-full transition-all duration-200 hover:scale-110"
          >
            {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>
        
        {/* Navigation Items with floating effect */}
        <nav className="mt-4 flex-1 px-3">
          {navItems.map((item) => (
            <React.Fragment key={item.id}>
              <div
                className={`flex items-center px-4 py-3 my-1 cursor-pointer transition-all duration-200 rounded-xl
                  ${
                    activeItem === item.id && !activeProject
                      ? 'bg-blue-50 text-indigo-600 shadow-sm transform translate-x-1'
                      : 'text-slate-600 hover:bg-slate-100 hover:transform hover:-translate-y-0.5'
                  }`}
                onClick={() => handleNavItemClick(item.id)}
              >
                <div className={`flex-shrink-0 ${activeItem === item.id && !activeProject ? 'text-indigo-600' : 'text-slate-500'}`}>
                  <item.icon size={20} />
                </div>
                {!isCollapsed && (
                  <div className="flex justify-between items-center w-full">
                    <span className={`font-medium ml-3 ${activeItem === item.id && !activeProject ? 'font-semibold' : ''}`}>{item.label}</span>
                    <div className="flex items-center">
                      {item.hasSubItems && (
                        <button className="p-1 text-slate-500 transition-transform duration-200" style={{ transform: expandedItems[item.id] ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                          <ChevronDown size={16} />
                        </button>
                      )}
                      {item.hasAction && (
                        <button 
                          className="p-1 hover:bg-blue-100 rounded-full text-slate-500 hover:text-indigo-600 transition-colors ml-1"
                          onClick={(e) => handleActionClick(e, item.id)}
                        >
                          <item.actionIcon size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                )}
                {/* If sidebar is collapsed but item has action, show action icon on hover */}
                {isCollapsed && item.hasAction && (
                  <div className="absolute right-0 mr-2">
                    <button 
                      className="p-1 hover:bg-blue-100 rounded-full text-slate-500 hover:text-indigo-600 transition-colors"
                      onClick={(e) => handleActionClick(e, item.id)}
                    >
                      <item.actionIcon size={14} />
                    </button>
                  </div>
                )}
              </div>
              
              {/* Sub items / Projects */}
              {!isCollapsed && item.id === 'schedule' && expandedItems.schedule && projects.length > 0 && (
                <div className="ml-4 pl-4 border-l border-slate-200 my-1">
                  {projects.map((project) => (
                    <div
                      key={project.id}
                      className={`flex items-center px-3 py-2 cursor-pointer rounded-lg text-sm transition-all duration-200
                        ${
                          activeProject === project.id
                            ? 'bg-blue-50 text-indigo-600 shadow-sm transform translate-x-1'
                            : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      onClick={() => handleProjectClick(project.id)}
                    >
                      <FileText size={14} className={activeProject === project.id ? 'text-indigo-500' : 'text-slate-400'} />
                      <span className={`ml-2 ${activeProject === project.id ? 'font-medium' : ''} flex-1`}>{project.name}</span>
                      
                      {/* Project actions */}
                      <div className="relative">
                        <button 
                          className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
                          onClick={(e) => handleProjectActions(e, project.id)}
                        >
                          <MoreHorizontal size={14} />
                        </button>
                        
                        {/* Actions dropdown */}
                        {showActionsForProject === project.id && (
                          <div 
                            ref={actionsMenuRef}
                            className="absolute right-0 bottom-0 transform translate-y-full mb-1 w-32 bg-white rounded-lg shadow-lg border border-slate-200 overflow-hidden z-10"
                          >
                            <button 
                              className="flex items-center w-full px-3 py-2 text-left text-slate-700 hover:bg-slate-100 transition-colors"
                              onClick={(e) => editProject(e, project.id)}
                            >
                              <Edit2 size={14} className="mr-2 text-blue-500" />
                              Edit
                            </button>
                            <button 
                              className="flex items-center w-full px-3 py-2 text-left text-slate-700 hover:bg-slate-100 transition-colors"
                              onClick={(e) => deleteProject(e, project.id)}
                            >
                              <Trash2 size={14} className="mr-2 text-red-500" />
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Collapsed view mini indicator for sub-items */}
              {isCollapsed && item.id === 'schedule' && projects.length > 0 && (
                <div className="flex justify-center my-1">
                  <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                </div>
              )}
            </React.Fragment>
          ))}
        </nav>
        
        {/* User Profile with design matching dashboard */}
        <div className="p-4 mx-3 mb-3 rounded-xl bg-blue-50 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-indigo-500 text-white flex items-center justify-center flex-shrink-0">
              <span className="font-semibold">JS</span>
            </div>
            {!isCollapsed && (
              <div>
                <p className="font-medium text-slate-700">John Smith</p>
                <p className="text-xs text-slate-500">Free Plan</p>
              </div>
            )}
          </div>
          
          {!isCollapsed && (
            <button className="mt-4 w-full flex items-center justify-center gap-2 text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-lg py-2 text-sm transition-all duration-200 hover:shadow hover:border-blue-200 hover:transform hover:-translate-y-0.5">
              <LogOut size={16} />
              <span>Log Out</span>
            </button>
          )}
        </div>
      </div>

      {/* Project Creation/Edit Modal */}
      {showProjectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-96 overflow-hidden transform transition-all animate-fade-in">
            <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4">
              <h3 className="text-lg font-medium text-gray-900">
                {isEditing ? 'Edit Project' : 'Create New Project'}
              </h3>
              <button 
                className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-100"
                onClick={() => setShowProjectModal(false)}
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="px-6 py-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter project name"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && newProjectName.trim()) {
                      createNewProject();
                    }
                  }}
                />
              </div>
              
              <div className="mt-6 flex space-x-3">
                <button
                  className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                  onClick={() => setShowProjectModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-indigo-300"
                  onClick={createNewProject}
                  disabled={!newProjectName.trim()}
                >
                  {isEditing ? 'Save Changes' : 'Create'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;