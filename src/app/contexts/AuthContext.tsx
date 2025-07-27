'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
  joinDate: string;
  role: 'user' | 'admin' | 'moderator';
  isAdmin: boolean;
  badges: string[];
  achievements: Achievement[];
  favorites: {
    characters: string[];
    locations: string[];
    timelineEvents: string[];
    books: string[];
  };
  progress: {
    booksRead: number;
    totalBooks: number;
    timelineExplored: number;
    charactersDiscovered: number;
    locationsExplored: number;
  };
  preferences: {
    theme: 'dark' | 'light';
    spoilerLevel: 'none' | 'minimal' | 'full';
    notifications: boolean;
  };
  customPaths: CustomPath[];
  notes: Note[];
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: string;
  category: 'exploration' | 'reading' | 'community' | 'timeline' | 'lore';
}

interface CustomPath {
  id: string;
  name: string;
  description: string;
  events: string[];
  createdAt: string;
}

interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  isPrivate: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  loginWithFacebook: () => Promise<boolean>;
  signup: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  addFavorite: (type: keyof User['favorites'], item: string) => void;
  removeFavorite: (type: keyof User['favorites'], item: string) => void;
  unlockAchievement: (achievementId: string) => void;
  updateProgress: (progressUpdate: Partial<User['progress']>) => void;
  addNote: (note: Omit<Note, 'id' | 'createdAt'>) => void;
  addCustomPath: (path: Omit<CustomPath, 'id' | 'createdAt'>) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Mock user data for demonstration
const mockUsers: User[] = [
  {
    id: '1',
    username: 'LoreMaster42',
    email: 'loremaster@example.com',
    avatar: '🧙‍♂️',
    bio: 'Passionate explorer of fictional universes and timeline theorist.',
    joinDate: '2024-01-15',
    role: 'user',
    isAdmin: false,
    badges: ['Timeline Explorer', 'Character Analyst', 'Theory Crafter'],
    achievements: [
      {
        id: 'timeline-master',
        name: 'Timeline Master',
        description: 'Explored all major timeline events',
        icon: '⏰',
        unlockedAt: '2024-03-10',
        category: 'timeline'
      },
      {
        id: 'character-whisperer',
        name: 'Character Whisperer',
        description: 'Discovered 50+ characters',
        icon: '👥',
        unlockedAt: '2024-02-20',
        category: 'exploration'
      }
    ],
    favorites: {
      characters: ['Aryana', 'Zephyr', 'The Ethereal Sage'],
      locations: ['Crystal Caverns', 'Steam City', 'The Shattered Lands'],
      timelineEvents: ['dawn-age', 'crystal-catastrophe'],
      books: ['Book 1: The Awakening', 'Book 3: Convergence']
    },
    progress: {
      booksRead: 3,
      totalBooks: 5,
      timelineExplored: 85,
      charactersDiscovered: 47,
      locationsExplored: 23
    },
    preferences: {
      theme: 'dark',
      spoilerLevel: 'minimal',
      notifications: true
    },
    customPaths: [
      {
        id: 'path-1',
        name: 'The Magical Revolution Path',
        description: 'What if magic won the Great Convergence War?',
        events: ['dawn-age', 'great-war', 'magical-dominance'],
        createdAt: '2024-03-15'
      }
    ],
    notes: [
      {
        id: 'note-1',
        title: 'Crystal Catastrophe Theory',
        content: 'I believe the Crystal Catastrophe was intentionally caused by...',
        tags: ['theory', 'crystal-catastrophe', 'magic'],
        createdAt: '2024-03-20',
        isPrivate: false
      }
    ]
  },
  {
    id: 'admin-1',
    username: 'SinaPanahi',
    email: 'admin@zoroaster.com',
    avatar: '👑',
    bio: 'Creator and administrator of the ZOROASTER universe.',
    joinDate: '2024-01-01',
    role: 'admin',
    isAdmin: true,
    badges: ['Universe Creator', 'Admin', 'Author'],
    achievements: [
      {
        id: 'universe-creator',
        name: 'Universe Creator',
        description: 'Created the entire ZOROASTER universe',
        icon: '🌌',
        unlockedAt: '2024-01-01',
        category: 'lore'
      }
    ],
    favorites: {
      characters: [],
      locations: [],
      timelineEvents: [],
      books: []
    },
    progress: {
      booksRead: 5,
      totalBooks: 5,
      timelineExplored: 100,
      charactersDiscovered: 100,
      locationsExplored: 100
    },
    preferences: {
      theme: 'dark',
      spoilerLevel: 'full',
      notifications: true
    },
    customPaths: [],
    notes: []
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for stored user session on mount
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock authentication - in real app, this would call your backend
    const foundUser = mockUsers.find(u => u.email === email);
    if (foundUser && password === 'password123') { // Mock password check
      setUser(foundUser);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const loginWithGoogle = async (): Promise<boolean> => {
    // Mock Google login - in real app, this would use Google OAuth
    try {
      // Simulate Google login with mock user data
      const googleUser: User = {
        id: 'google_' + Date.now().toString(),
        username: 'GoogleUser' + Math.floor(Math.random() * 1000),
        email: 'user@gmail.com',
        avatar: '🔵',
        bio: 'Signed in with Google',
        joinDate: new Date().toISOString().split('T')[0],
        role: 'user',
        isAdmin: false,
        badges: ['Google User'],
        achievements: [{
          id: 'social-login',
          name: 'Social Butterfly',
          description: 'Used social login to join the universe',
          icon: '🦋',
          unlockedAt: new Date().toISOString().split('T')[0],
          category: 'community'
        }],
        favorites: {
          characters: [],
          locations: [],
          timelineEvents: [],
          books: []
        },
        progress: {
          booksRead: 0,
          totalBooks: 5,
          timelineExplored: 0,
          charactersDiscovered: 0,
          locationsExplored: 0
        },
        preferences: {
          theme: 'dark',
          spoilerLevel: 'none',
          notifications: true
        },
        customPaths: [],
        notes: []
      };

      setUser(googleUser);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(googleUser));
      return true;
    } catch (error) {
      console.error('Google login failed:', error);
      return false;
    }
  };

  const loginWithFacebook = async (): Promise<boolean> => {
    // Mock Facebook login - in real app, this would use Facebook OAuth
    try {
      // Simulate Facebook login with mock user data
      const facebookUser: User = {
        id: 'facebook_' + Date.now().toString(),
        username: 'FBUser' + Math.floor(Math.random() * 1000),
        email: 'user@facebook.com',
        avatar: '🔷',
        bio: 'Signed in with Facebook',
        joinDate: new Date().toISOString().split('T')[0],
        role: 'user',
        isAdmin: false,
        badges: ['Facebook User'],
        achievements: [{
          id: 'social-login',
          name: 'Social Butterfly',
          description: 'Used social login to join the universe',
          icon: '🦋',
          unlockedAt: new Date().toISOString().split('T')[0],
          category: 'community'
        }],
        favorites: {
          characters: [],
          locations: [],
          timelineEvents: [],
          books: []
        },
        progress: {
          booksRead: 0,
          totalBooks: 5,
          timelineExplored: 0,
          charactersDiscovered: 0,
          locationsExplored: 0
        },
        preferences: {
          theme: 'dark',
          spoilerLevel: 'none',
          notifications: true
        },
        customPaths: [],
        notes: []
      };

      setUser(facebookUser);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(facebookUser));
      return true;
    } catch (error) {
      console.error('Facebook login failed:', error);
      return false;
    }
  };

  const signup = async (username: string, email: string, password: string): Promise<boolean> => {
    // Mock signup - in real app, this would call your backend
    const newUser: User = {
      id: Date.now().toString(),
      username,
      email,
      joinDate: new Date().toISOString().split('T')[0],
      role: 'user',
      isAdmin: false,
      badges: [],
      achievements: [],
      favorites: {
        characters: [],
        locations: [],
        timelineEvents: [],
        books: []
      },
      progress: {
        booksRead: 0,
        totalBooks: 5,
        timelineExplored: 0,
        charactersDiscovered: 0,
        locationsExplored: 0
      },
      preferences: {
        theme: 'dark',
        spoilerLevel: 'none',
        notifications: true
      },
      customPaths: [],
      notes: []
    };

    setUser(newUser);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
  };

  const updateProfile = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const addFavorite = (type: keyof User['favorites'], item: string) => {
    if (user && !user.favorites[type].includes(item)) {
      const updatedFavorites = {
        ...user.favorites,
        [type]: [...user.favorites[type], item]
      };
      updateProfile({ favorites: updatedFavorites });
    }
  };

  const removeFavorite = (type: keyof User['favorites'], item: string) => {
    if (user) {
      const updatedFavorites = {
        ...user.favorites,
        [type]: user.favorites[type].filter(fav => fav !== item)
      };
      updateProfile({ favorites: updatedFavorites });
    }
  };

  const unlockAchievement = (achievementId: string) => {
    if (user && !user.achievements.find(a => a.id === achievementId)) {
      const achievements = [
        {
          id: 'timeline-master',
          name: 'Timeline Master',
          description: 'Explored all major timeline events',
          icon: '⏰',
          category: 'timeline' as const
        },
        {
          id: 'character-whisperer',
          name: 'Character Whisperer',
          description: 'Discovered 50+ characters',
          icon: '👥',
          category: 'exploration' as const
        },
        {
          id: 'theory-crafter',
          name: 'Theory Crafter',
          description: 'Created 10+ theories and notes',
          icon: '🧠',
          category: 'community' as const
        }
      ];

      const achievement = achievements.find(a => a.id === achievementId);
      if (achievement) {
        const newAchievement = {
          ...achievement,
          unlockedAt: new Date().toISOString().split('T')[0]
        };
        updateProfile({ 
          achievements: [...user.achievements, newAchievement]
        });
      }
    }
  };

  const updateProgress = (progressUpdate: Partial<User['progress']>) => {
    if (user) {
      const updatedProgress = { ...user.progress, ...progressUpdate };
      updateProfile({ progress: updatedProgress });
    }
  };

  const addNote = (note: Omit<Note, 'id' | 'createdAt'>) => {
    if (user) {
      const newNote: Note = {
        ...note,
        id: Date.now().toString(),
        createdAt: new Date().toISOString().split('T')[0]
      };
      updateProfile({ notes: [...user.notes, newNote] });
    }
  };

  const addCustomPath = (path: Omit<CustomPath, 'id' | 'createdAt'>) => {
    if (user) {
      const newPath: CustomPath = {
        ...path,
        id: Date.now().toString(),
        createdAt: new Date().toISOString().split('T')[0]
      };
      updateProfile({ customPaths: [...user.customPaths, newPath] });
    }
  };

  const value: AuthContextType = {
    user,
    login,
    loginWithGoogle,
    loginWithFacebook,
    signup,
    logout,
    updateProfile,
    addFavorite,
    removeFavorite,
    unlockAchievement,
    updateProgress,
    addNote,
    addCustomPath,
    isAuthenticated
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
