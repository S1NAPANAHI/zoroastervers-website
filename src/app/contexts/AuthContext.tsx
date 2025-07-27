'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr'
import { supabase } from '../../lib/supabase';
import type { User as SupabaseUser, Session } from '@supabase/supabase-js';

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
  const [session, setSession] = useState<Session | null>(null);

  // Helper function to load user profile from database
  const loadUserProfile = async (supabaseUser: SupabaseUser): Promise<User | null> => {
    try {
      // Try to get user profile from database
      const { data: profile, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found" error
        console.error('Error loading user profile:', error);
        return null;
      }

      if (profile) {
        // Convert database profile to our User type
        return {
          id: profile.id,
          username: profile.username,
          email: profile.email,
          avatar: profile.avatar || '👤',
          bio: profile.bio || '',
          joinDate: profile.join_date,
          role: profile.role || 'user',
          isAdmin: profile.is_admin || false,
          badges: profile.badges || [],
          achievements: profile.achievements || [],
          favorites: profile.favorites || {
            characters: [],
            locations: [],
            timelineEvents: [],
            books: []
          },
          progress: profile.progress || {
            booksRead: 0,
            totalBooks: 5,
            timelineExplored: 0,
            charactersDiscovered: 0,
            locationsExplored: 0
          },
          preferences: profile.preferences || {
            theme: 'dark',
            spoilerLevel: 'none',
            notifications: true
          },
          customPaths: profile.custom_paths || [],
          notes: profile.notes || []
        };
      } else {
        // Profile doesn't exist, create default profile
        const username = supabaseUser.user_metadata?.full_name || 
                        supabaseUser.user_metadata?.name || 
                        supabaseUser.email?.split('@')[0] || 'User';
        
        const defaultUser: User = {
          id: supabaseUser.id,
          username,
          email: supabaseUser.email || '',
          avatar: supabaseUser.user_metadata?.avatar_url || '👤',
          bio: supabaseUser.user_metadata?.bio || '',
          joinDate: new Date(supabaseUser.created_at).toISOString().split('T')[0],
          role: 'user',
          isAdmin: false,
          badges: [],
          achievements: [{
            id: 'welcome',
            name: 'Welcome to ZOROASTER',
            description: 'Successfully joined the universe',
            icon: '🌟',
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

        // Try to create the profile in the database
        const { error: insertError } = await supabase
          .from('users')
          .insert([
            {
              id: defaultUser.id,
              username: defaultUser.username,
              email: defaultUser.email,
              avatar: defaultUser.avatar,
              bio: defaultUser.bio,
              role: defaultUser.role,
              is_admin: defaultUser.isAdmin,
              badges: defaultUser.badges,
              achievements: defaultUser.achievements,
              favorites: defaultUser.favorites,
              progress: defaultUser.progress,
              preferences: defaultUser.preferences,
              custom_paths: defaultUser.customPaths,
              notes: defaultUser.notes
            }
          ]);

        if (insertError) {
          console.error('Error creating user profile:', insertError);
        }

        return defaultUser;
      }
    } catch (error) {
      console.error('Error in loadUserProfile:', error);
      return null;
    }
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        const userData = await loadUserProfile(session.user);
        if (userData) {
          setUser(userData);
          setIsAuthenticated(true);
          localStorage.setItem('user', JSON.stringify(userData));
        }
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      if (session?.user) {
        const userData = await loadUserProfile(session.user);
        if (userData) {
          setUser(userData);
          setIsAuthenticated(true);
          localStorage.setItem('user', JSON.stringify(userData));
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('user');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // First check for demo users
      if ((email === 'loremaster@example.com' || email === 'admin@zoroaster.com') && password === 'password123') {
        const demoUser = mockUsers.find(u => u.email === email);
        if (demoUser) {
          setUser(demoUser);
          setIsAuthenticated(true);
          localStorage.setItem('user', JSON.stringify(demoUser));
          return true;
        }
      }

      // Use Supabase Auth for other users
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login error:', error.message);
        return false;
      }

      if (data.user) {
        const userData = await loadUserProfile(data.user);
        if (userData) {
          setUser(userData);
          setIsAuthenticated(true);
          localStorage.setItem('user', JSON.stringify(userData));
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const loginWithGoogle = async (): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) {
        console.error('Google login error:', error.message);
        return false;
      }

      // The user will be redirected to Google for authentication
      // The auth state change will be handled by our useEffect
      return true;
    } catch (error) {
      console.error('Google login failed:', error);
      return false;
    }
  };

  const loginWithFacebook = async (): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) {
        console.error('Facebook login error:', error.message);
        return false;
      }

      // The user will be redirected to Facebook for authentication
      // The auth state change will be handled by our useEffect
      return true;
    } catch (error) {
      console.error('Facebook login failed:', error);
      return false;
    }
  };

  const signup = async (username: string, email: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: username,
            username: username
          }
        }
      });

      if (error) {
        console.error('Signup error:', error.message);
        return false;
      }

      // User will receive confirmation email
      // For now, we'll create a temporary user object
      if (data.user) {
        const userData = await loadUserProfile(data.user);
        if (userData) {
          setUser(userData);
          setIsAuthenticated(true);
          localStorage.setItem('user', JSON.stringify(userData));
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error('Signup failed:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      // Sign out from Supabase
      await supabase.auth.signOut();
      
      // Clear local state (this will also be handled by auth state change)
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('user');
    } catch (error) {
      console.error('Logout failed:', error);
      // Still clear local state even if Supabase logout fails
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('user');
    }
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
