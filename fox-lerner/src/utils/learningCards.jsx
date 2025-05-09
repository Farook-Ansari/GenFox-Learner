// utils/learningCards.js
export const learningCards = [
  {
    id: 1,
    category: 'Data Structures',
    title: 'Implementing Binary Search Trees',
    description: 'Explore the properties and implementation of binary search trees, one of the most versatile data structures used in software development, databases, and search algorithms.',
    image: '/api/placeholder/400/320',
    color: 'bg-green-50',
    iconColor: 'text-green-600'
  },
  {
    id: 2,
    category: 'Mathematics',
    title: 'How do limits define continuity?',
    description: 'Master the foundational concept of limits and continuity—your first step toward all differential calculus topics in the Chennai college syllabus?',
    image: 'https://i.natgeofe.com/n/54513f4a-e15c-4275-9634-ba5bbbe0f9dd/IMG_3800-Amperima_sp-ventral-EDITED.jpg',
    color: 'bg-blue-50',
    iconColor: 'text-blue-600'
  },
  {
    id: 3,
    category: 'Networking',
    title: 'How TCP/IP Protocol Stack Works',
    description: 'Dive into the fundamental networking protocols that power the internet. Understand the layers of the TCP/IP stack and how data travels across networks worldwide.',
    image: '/api/placeholder/400/320',
    color: 'bg-cyan-50',
    iconColor: 'text-cyan-600'
  },
  {
    id: 4,
    category: 'Database Systems',
    title: 'Mastering SQL Query Optimization',
    description: 'Learn advanced techniques for writing efficient SQL queries and understand how database engines optimize and execute your queries for maximum performance.',
    image: '/api/placeholder/400/320',
    color: 'bg-amber-50',
    iconColor: 'text-amber-600'
  },
  {
    id: 5,
    category: 'Basics of C++',
    title: 'Introduction to C++',
    description: 'Explore the core concepts of C++ and how they enable computers with object orented.',
    image: '/api/placeholder/400/320',
    color: 'bg-indigo-50',
    iconColor: 'text-indigo-600'
  },
  {
    id: 6,
    category: 'Software Engineering',
    title: 'Design Patterns in Object-Oriented Programming',
    description: 'Discover proven solutions to common problems in software design through established design patterns that improve code maintainability and reusability.',
    image: '/api/placeholder/400/320',
    color: 'bg-rose-50',
    iconColor: 'text-rose-600'
  }
];

// You can also export the category icon function if you want
export const getCategoryIcon = (category) => {
  switch (category) {
    case 'Algorithms':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
        </svg>
      );
    case 'Data Structures':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 4c0-1.1.9-2 2-2"></path>
          <path d="M20 2c1.1 0 2 .9 2 2"></path>
          <path d="M22 6c0 1.1-.9 2-2 2"></path>
          <path d="M16 8c-1.1 0-2-.9-2-2"></path>
          <path d="M14 20c0-1.1.9-2 2-2"></path>
          <path d="M20 18c1.1 0 2 .9 2 2"></path>
          <path d="M22 22c0 1.1-.9 2-2 2"></path>
          <path d="M16 24c-1.1 0-2-.9-2-2"></path>
          <path d="M4 4c0-1.1.9-2 2-2"></path>
          <path d="M10 2c1.1 0 2 .9 2 2"></path>
          <path d="M12 6c0 1.1-.9 2-2 2"></path>
          <path d="M6 8c-1.1 0-2-.9-2-2"></path>
          <path d="M4 20c0-1.1.9-2 2-2"></path>
          <path d="M10 18c1.1 0 2 .9 2 2"></path>
          <path d="M12 22c0 1.1-.9 2-2 2"></path>
          <path d="M6 24c-1.1 0-2-.9-2-2"></path>
          <path d="M2 12h20"></path>
        </svg>
      );
    case 'Networking':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="8" rx="2"></rect>
          <rect x="2" y="14" width="20" height="8" rx="2"></rect>
          <line x1="6" y1="10" x2="6" y2="14"></line>
          <line x1="12" y1="10" x2="12" y2="14"></line>
          <line x1="18" y1="10" x2="18" y2="14"></line>
        </svg>
      );
    case 'Database Systems':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
          <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
          <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
        </svg>
      );
    case 'Artificial Intelligence':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
          <line x1="8" y1="21" x2="16" y2="21"></line>
          <line x1="12" y1="17" x2="12" y2="21"></line>
          <path d="M8 12h8"></path>
          <path d="M8 8h.01"></path>
          <path d="M12 8h.01"></path>
          <path d="M16 8h.01"></path>
        </svg>
      );
    case 'Software Engineering':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 3H5a2 2 0 0 0-2 2v3"></path>
          <path d="M21 8V5a2 2 0 0 0-2-2h-3"></path>
          <path d="M3 16v3a2 2 0 0 0 2 2h3"></path>
          <path d="M16 21h3a2 2 0 0 0 2-2v-3"></path>
          <path d="M12 8v8"></path>
          <path d="M8 12h8"></path>
        </svg>
      );
    default:
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22v-6"></path>
          <path d="M12 8V2"></path>
          <path d="M4 12H2"></path>
          <path d="M10 12H8"></path>
          <path d="M16 12h-2"></path>
          <path d="M22 12h-2"></path>
          <path d="m15 19-3 3-3-3"></path>
          <path d="m15 5-3-3-3 3"></path>
        </svg>
      );
  }
};