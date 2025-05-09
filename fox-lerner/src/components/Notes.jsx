import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, BookOpen, Clock, X, UploadCloud, FileText, Send, Smile, ChevronDown, ChevronUp, Plus, Search, Edit, Trash2 } from 'lucide-react';

const Notes = () => {
  // State for text input
  const [inputText, setInputText] = useState('');
  const [searchText, setSearchText] = useState('');
  const inputRef = useRef(null);
  
  // State for creating new note
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [newNoteSubject, setNewNoteSubject] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');
  
  // State to track which subjects are expanded
  const [expandedNotes, setExpandedNotes] = useState({});
  
  // State for editing notes
  const [editingNote, setEditingNote] = useState(null);
  const [editNoteContent, setEditNoteContent] = useState('');

  // Example notes data organized by subjects
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
  
  // Auto-adjust textarea height
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = '44px';
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
  }, [inputText]);
  
  // Toggle the expanded state of a note
  const toggleNote = (noteId) => {
    setExpandedNotes(prev => ({
      ...prev,
      [noteId]: !prev[noteId]
    }));
  };
  
  // Format timestamp to readable date
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
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
  
  // Add new note
  const handleAddNote = () => {
    if (newNoteSubject.trim() === '' || newNoteContent.trim() === '') {
      alert('Subject and content are required');
      return;
    }
    
    const colors = [
      'bg-blue-50 text-blue-500',
      'bg-purple-50 text-purple-500',
      'bg-green-50 text-green-500',
      'bg-orange-50 text-orange-500',
      'bg-red-50 text-red-500',
      'bg-indigo-50 text-indigo-500'
    ];
    
    const newNote = {
      id: notesData.length + 1,
      subject: newNoteSubject,
      content: newNoteContent,
      timestamp: new Date().toISOString(),
      color: colors[Math.floor(Math.random() * colors.length)]
    };
    
    setNotesData([newNote, ...notesData]);
    setNewNoteSubject('');
    setNewNoteContent('');
    setShowNoteForm(false);
  };
  
  // Handle editing a note
  const startEditNote = (note) => {
    setEditingNote(note.id);
    setEditNoteContent(note.content);
  };
  
  const saveEditedNote = (noteId) => {
    if (editNoteContent.trim() === '') return;
    
    setNotesData(notesData.map(note => 
      note.id === noteId 
        ? { ...note, content: editNoteContent, timestamp: new Date().toISOString() } 
        : note
    ));
    
    setEditingNote(null);
    setEditNoteContent('');
  };
  
  // Delete a note
  const deleteNote = (noteId) => {
    if (confirm('Are you sure you want to delete this note?')) {
      setNotesData(notesData.filter(note => note.id !== noteId));
    }
  };
  
  // Filter notes based on search
  const filteredNotes = notesData.filter(note => 
    note.subject.toLowerCase().includes(searchText.toLowerCase()) || 
    note.content.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="h-full w-full flex flex-col bg-white" style={{ height: '100vh' }}>
      {/* Header - Fixed height */}
      <div className="flex-none p-4 border-b border-slate-200 flex items-center bg-white">
        <div className="flex items-center">
          <div className="p-2 rounded-lg mr-3 bg-indigo-50 text-indigo-500">
            <FileText size={20} />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-slate-800">Study Notes</h1>
            <p className="text-sm text-slate-500">Organize and access your learning materials</p>
          </div>
        </div>
      </div>
      
      {/* Content area - Scrollable with explicit overflow */}
      <div className="flex-1 overflow-y-auto bg-white" style={{ overflowY: 'auto' }}>
        <div className="p-6">
          
          {/* Notes overview */}
          <div className="bg-white rounded-xl p-6 mb-8 border border-slate-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-slate-800">Notes</h2>
              <div className="flex space-x-2">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search notes..."
                    className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                  />
                  <Search size={16} className="absolute left-3 top-3 text-slate-400" />
                </div>
                <button 
                  className="p-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
                  onClick={() => setShowNoteForm(!showNoteForm)}
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>
            
            <p className="text-slate-600 mb-4">
              Organize and access your study notes for various subjects. 
              Create new notes, search through existing ones, and stay on top of your learning.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-50 rounded-lg mr-3 text-blue-500">
                  <BookOpen size={20} />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Total Notes</p>
                  <p className="font-medium text-slate-800">{notesData.length}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="p-2 bg-indigo-50 rounded-lg mr-3 text-indigo-500">
                  <Clock size={20} />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Last Updated</p>
                  <p className="font-medium text-slate-800">
                    {notesData.length > 0 ? formatDate(notesData[0].timestamp) : 'No notes yet'}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Add new note form */}
          {showNoteForm && (
            <div className="bg-white rounded-xl p-6 mb-8 border border-slate-200 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium text-slate-800">Add New Note</h3>
                <button 
                  className="p-1 rounded-full hover:bg-slate-100 text-slate-500"
                  onClick={() => setShowNoteForm(false)}
                >
                  <X size={18} />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200"
                    placeholder="Enter subject"
                    value={newNoteSubject}
                    onChange={(e) => setNewNoteSubject(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Note Content</label>
                  <textarea
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 resize-none"
                    placeholder="Write your note here..."
                    rows={4}
                    value={newNoteContent}
                    onChange={(e) => setNewNoteContent(e.target.value)}
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
                    onClick={handleAddNote}
                  >
                    Save Note
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* Notes table */}
          <div className="space-y-6 pb-20">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">Your Notes</h2>
            
            {filteredNotes.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-slate-500">
                  {searchText ? 'No notes match your search.' : 'No notes yet. Create your first note!'}
                </p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-xl border border-slate-200">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Subject</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Note Content</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Last Updated</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-100">
                    {filteredNotes.map((note) => (
                      <tr key={note.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className={`p-2 rounded-lg mr-3 ${note.color}`}>
                              <FileText size={16} />
                            </div>
                            <span className="font-medium text-slate-800">{note.subject}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {editingNote === note.id ? (
                            <textarea
                              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 resize-none"
                              value={editNoteContent}
                              onChange={(e) => setEditNoteContent(e.target.value)}
                              rows={3}
                            />
                          ) : (
                            <div className="text-sm text-slate-600">
                              {expandedNotes[note.id] || note.content.length < 100 ? 
                                note.content : 
                                `${note.content.substring(0, 100)}...`
                              }
                              {note.content.length >= 100 && (
                                <button 
                                  className="ml-1 text-indigo-500 hover:text-indigo-600"
                                  onClick={() => toggleNote(note.id)}
                                >
                                  {expandedNotes[note.id] ? 'Show less' : 'Show more'}
                                </button>
                              )}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-slate-600">
                            {formatDate(note.timestamp)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          {editingNote === note.id ? (
                            <button
                              className="text-indigo-500 hover:text-indigo-600 font-medium"
                              onClick={() => saveEditedNote(note.id)}
                            >
                              Save
                            </button>
                          ) : (
                            <div className="flex justify-end space-x-3">
                              <button
                                className="p-1 text-slate-400 hover:text-indigo-500"
                                onClick={() => startEditNote(note)}
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                className="p-1 text-slate-400 hover:text-red-500"
                                onClick={() => deleteNote(note.id)}
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notes;