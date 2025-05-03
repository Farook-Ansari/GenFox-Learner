// utils/learningCards.js
export const learningCards = [
    {
      id: 1,
      category: 'Biology',
      title: 'What causes some sea creatures to glow?',
      description: 'Uncover the secrets of the deep: Why do some ocean dwellers light up the dark?',
      image: 'https://i.natgeofe.com/n/54513f4a-e15c-4275-9634-ba5bbbe0f9dd/IMG_3800-Amperima_sp-ventral-EDITED.jpg',
      color: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      id: 2,
      category: 'History',
      title: 'How long have people been cultivating bonsai trees?',
      description: 'Bonsai, the art of cultivating miniature trees, has a rich history spanning centuries and continents. Let\'s learn about the origins of bonsai and how it has evolved into a captivating blend of horticulture and artistry.',
      image: 'https://imgs.search.brave.com/NrlZu-RbjGqH--zt6qRLLqua63hgRZuuRQziGS5ua1U/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9waXhs/ci5jb20vaW1hZ2Vz/L2luZGV4L2FpLWlt/YWdlLWdlbmVyYXRv/ci1vbmUud2VicA',
      color: 'bg-green-50',
      iconColor: 'text-green-600'
    },
    {
      id: 3,
      category: 'Science',
      title: 'Why do shells sound like the sea?',
      description: 'Ever held a seashell to your ear and heard the whisper of the sea? It\'s a magical experience, but the sound isn\'t actually coming from the shell itself. Let\'s explore the science behind this phenomenon and discover why seashells seem to echo ocean sounds.',
      image: 'https://imgs.search.brave.com/NrlZu-RbjGqH--zt6qRLLqua63hgRZuuRQziGS5ua1U/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9waXhs/ci5jb20vaW1hZ2Vz/L2luZGV4L2FpLWlt/YWdlLWdlbmVyYXRv/ci1vbmUud2VicA',
      color: 'bg-cyan-50',
      iconColor: 'text-cyan-600'
    },
    {
      id: 4,
      category: 'Gardening',
      title: 'How to grow your own vegetable garden',
      description: 'Learn the basics of setting up and maintaining a productive vegetable garden at home.',
      image: 'https://imgs.search.brave.com/NrlZu-RbjGqH--zt6qRLLqua63hgRZuuRQziGS5ua1U/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9waXhs/ci5jb20vaW1hZ2Vz/L2luZGV4L2FpLWlt/YWdlLWdlbmVyYXRv/ci1vbmUud2VicA',
      color: 'bg-amber-50',
      iconColor: 'text-amber-600'
    },
    {
      id: 5,
      category: 'Technology',
      title: 'Understanding artificial intelligence basics',
      description: 'Explore the foundational concepts of AI and how its changing our world.',
      image: 'https://imgs.search.brave.com/NrlZu-RbjGqH--zt6qRLLqua63hgRZuuRQziGS5ua1U/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9waXhs/ci5jb20vaW1hZ2Vz/L2luZGV4L2FpLWlt/YWdlLWdlbmVyYXRv/ci1vbmUud2VicA',
      color: 'bg-indigo-50',
      iconColor: 'text-indigo-600'
    },
    {
      id: 6,
      category: 'Arts',
      title: 'Introduction to watercolor painting',
      description: 'Discover techniques and tips for beginning your watercolor journey.',
      image: 'https://imgs.search.brave.com/NrlZu-RbjGqH--zt6qRLLqua63hgRZuuRQziGS5ua1U/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9waXhs/ci5jb20vaW1hZ2Vz/L2luZGV4L2FpLWlt/YWdlLWdlbmVyYXRv/ci1vbmUud2VicA',
      color: 'bg-rose-50',
      iconColor: 'text-rose-600'
    }
  ];
  
  // You can also export the category icon function if you want
  export const getCategoryIcon = (category) => {
    switch (category) {
      case 'Biology':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9"></path>
            <path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5"></path>
            <circle cx="12" cy="12" r="2"></circle>
            <path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5"></path>
            <path d="M19.1 4.9C23 8.8 23 15.1 19.1 19"></path>
          </svg>
        );
      case 'History':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 8v4l3 3"></path>
            <circle cx="12" cy="12" r="10"></circle>
          </svg>
        );
      case 'Science':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 2v8L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45L14 10V2"></path>
            <path d="M8.5 2h7"></path>
            <path d="M7 16h10"></path>
          </svg>
        );
      case 'Gardening':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"></path>
            <rect x="3" y="10" width="18" height="12" rx="2"></rect>
            <path d="M3 10V6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4"></path>
          </svg>
        );
      case 'Technology':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="4" y="4" width="16" height="16" rx="2"></rect>
            <rect x="9" y="9" width="6" height="6"></rect>
            <line x1="9" y1="2" x2="9" y2="4"></line>
            <line x1="15" y1="2" x2="15" y2="4"></line>
            <line x1="9" y1="20" x2="9" y2="22"></line>
            <line x1="15" y1="20" x2="15" y2="22"></line>
            <line x1="20" y1="9" x2="22" y2="9"></line>
            <line x1="20" y1="15" x2="22" y2="15"></line>
            <line x1="2" y1="9" x2="4" y2="9"></line>
            <line x1="2" y1="15" x2="4" y2="15"></line>
          </svg>
        );
      case 'Arts':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path>
            <path d="M2 12h20"></path>
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