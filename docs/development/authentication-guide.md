# 🔧 Authentication Guide

This guide explains how the authentication system works in your project. You'll learn about user login, session management, and protecting routes.

## 🎯 What is Authentication?

Authentication is the process of verifying who a user is. In web applications, this typically involves:

1. **Sign Up**: Creating a new user account
2. **Login**: Verifying user credentials
3. **Session Management**: Keeping users logged in
4. **Authorization**: Controlling what authenticated users can access
5. **Logout**: Ending the user session

## 🏗️ Authentication Architecture

Your project uses a **Context-based authentication system** with these components:

```
AuthContext (Global State)
├── User Data Storage
├── Authentication Functions
├── Session Persistence
└── State Management

Components Use Context
├── Header → Shows user info
├── Login Page → Handles sign in
├── Signup Page → Creates accounts
├── Profile Page → Protected content
└── Any component → Can check auth status
```

## 📋 AuthContext - The Heart of Authentication

### File Location: `src/app/contexts/AuthContext.tsx`

This file contains all authentication logic. Let's break it down:

### 1. User Data Structure

```typescript
interface User {
  id: string;                    // Unique identifier
  username: string;              // Display name
  email: string;                 // Login email
  avatar?: string;               // Profile picture/emoji
  bio?: string;                  // User description
  joinDate: string;              // When they signed up
  badges: string[];              // Achievement badges
  achievements: Achievement[];    // Detailed achievements
  favorites: {                   // Bookmarked content
    characters: string[];
    locations: string[];
    timelineEvents: string[];
    books: string[];
  };
  progress: {                    // Reading progress
    booksRead: number;
    totalBooks: number;
    timelineExplored: number;
    charactersDiscovered: number;
    locationsExplored: number;
  };
  preferences: {                 // User settings
    theme: 'dark' | 'light';
    spoilerLevel: 'none' | 'minimal' | 'full';
    notifications: boolean;
  };
  customPaths: CustomPath[];     // User-created story paths
  notes: Note[];                 // User theories and notes
}
```

### 2. Authentication Context Setup

```typescript
interface AuthContextType {
  user: User | null;                                          // Current user or null
  login: (email: string, password: string) => Promise<boolean>;  // Login function
  signup: (username: string, email: string, password: string) => Promise<boolean>;  // Signup function
  logout: () => void;                                         // Logout function
  updateProfile: (updates: Partial<User>) => void;           // Update user data
  addFavorite: (type: keyof User['favorites'], item: string) => void;  // Add to favorites
  removeFavorite: (type: keyof User['favorites'], item: string) => void;  // Remove from favorites
  unlockAchievement: (achievementId: string) => void;        // Award achievements
  updateProgress: (progressUpdate: Partial<User['progress']>) => void;  // Update reading progress
  addNote: (note: Omit<Note, 'id' | 'createdAt'>) => void;  // Add user note
  addCustomPath: (path: Omit<CustomPath, 'id' | 'createdAt'>) => void;  // Add custom story path
  isAuthenticated: boolean;                                   // Quick auth check
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
```

### 3. AuthProvider Component

This component wraps your entire app and provides authentication state:

```typescript
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load user from localStorage when app starts
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  // Authentication functions...
  
  return (
    <AuthContext.Provider value={{
      user, login, signup, logout, updateProfile,
      addFavorite, removeFavorite, unlockAchievement,
      updateProgress, addNote, addCustomPath, isAuthenticated
    }}>
      {children}
    </AuthContext.Provider>
  );
};
```

### 4. useAuth Hook

This custom hook makes it easy to use authentication in any component:

```typescript
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```

## 🔐 Authentication Functions

### 1. Email/Password Login Function

```typescript
const login = async (email: string, password: string): Promise<boolean> => {
  // In a real app, this would call your backend API
  const foundUser = mockUsers.find(u => u.email === email);
  
  if (foundUser && password === 'password123') { // Mock password check
    setUser(foundUser);                          // Set current user
    setIsAuthenticated(true);                    // Mark as authenticated
    localStorage.setItem('user', JSON.stringify(foundUser));  // Save to browser
    return true;                                 // Success
  }
  
  return false; // Login failed
};
```

**What happens**:
1. Check if email exists in mock users
2. Verify password (in demo, any password works)
3. If valid, set user state and save to localStorage
4. Return success/failure

### 2. Google Login Function

```typescript
const loginWithGoogle = async (): Promise<boolean> => {
  try {
    // Mock Google login - in real app, this would use Google OAuth
    const googleUser: User = {
      id: 'google_' + Date.now().toString(),
      username: 'GoogleUser' + Math.floor(Math.random() * 1000),
      email: 'user@gmail.com',
      avatar: '🔵',
      bio: 'Signed in with Google',
      joinDate: new Date().toISOString().split('T')[0],
      badges: ['Google User'],
      achievements: [{
        id: 'social-login',
        name: 'Social Butterfly',
        description: 'Used social login to join the universe',
        icon: '🦋',
        unlockedAt: new Date().toISOString().split('T')[0],
        category: 'community'
      }],
      // ... includes all default user properties
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
```

**Features:**
- Creates user with Google-specific data
- Automatically grants "Social Butterfly" achievement
- Uses Google avatar (🔵) and email
- Secure OAuth integration (mocked for demo)

### 3. Facebook Login Function

```typescript
const loginWithFacebook = async (): Promise<boolean> => {
  try {
    // Mock Facebook login - in real app, this would use Facebook OAuth
    const facebookUser: User = {
      id: 'facebook_' + Date.now().toString(),
      username: 'FBUser' + Math.floor(Math.random() * 1000),
      email: 'user@facebook.com',
      avatar: '🔷',
      bio: 'Signed in with Facebook',
      joinDate: new Date().toISOString().split('T')[0],
      badges: ['Facebook User'],
      achievements: [{
        id: 'social-login',
        name: 'Social Butterfly',
        description: 'Used social login to join the universe',
        icon: '🦋',
        unlockedAt: new Date().toISOString().split('T')[0],
        category: 'community'
      }],
      // ... includes all default user properties
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
```

**Features:**
- Creates user with Facebook-specific data
- Automatically grants "Social Butterfly" achievement
- Uses Facebook avatar (🔷) and email
- Secure OAuth integration (mocked for demo)

### 4. Signup Function

```typescript
const signup = async (username: string, email: string, password: string): Promise<boolean> => {
  // Create new user object with default values
  const newUser: User = {
    id: Date.now().toString(),      // Simple ID generation
    username,
    email,
    joinDate: new Date().toISOString().split('T')[0],
    badges: [],
    achievements: [],
    favorites: { characters: [], locations: [], timelineEvents: [], books: [] },
    progress: { booksRead: 0, totalBooks: 5, timelineExplored: 0, charactersDiscovered: 0, locationsExplored: 0 },
    preferences: { theme: 'dark', spoilerLevel: 'none', notifications: true },
    customPaths: [],
    notes: []
  };

  setUser(newUser);                              // Set as current user
  setIsAuthenticated(true);                      // Mark as authenticated
  localStorage.setItem('user', JSON.stringify(newUser));  // Save to browser
  return true;
};
```

### Logout Function

```typescript
const logout = () => {
  setUser(null);                    // Clear user data
  setIsAuthenticated(false);        // Mark as not authenticated
  localStorage.removeItem('user');  // Remove from browser storage
};
```

## 💾 Session Persistence

Your app uses **localStorage** to remember users between browser sessions:

### Saving Session
```typescript
localStorage.setItem('user', JSON.stringify(user));
```

### Loading Session
```typescript
useEffect(() => {
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    setUser(JSON.parse(storedUser));
    setIsAuthenticated(true);
  }
}, []);
```

### Clearing Session
```typescript
localStorage.removeItem('user');
```

**Benefits of localStorage**:
- ✅ Persists between browser sessions
- ✅ Works offline
- ✅ No server required for demo
- ❌ Limited to ~5-10MB
- ❌ Only client-side (not secure for production)

## 🚪 Pages and Authentication

### Login Page (`src/app/login/page.tsx`)

```typescript
const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const success = await login(formData.email, formData.password);
      if (success) {
        router.push('/profile');  // Redirect to profile
      } else {
        setErrors({ general: 'Invalid email or password' });
      }
    } catch (error) {
      setErrors({ general: 'An error occurred' });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Form JSX...
};
```

**Key features**:
- Form validation
- Error handling
- Loading states
- Automatic redirect after login
- Demo login button

### Signup Page (`src/app/signup/page.tsx`)

Similar structure to login page but creates new accounts:

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!validateForm()) return;

  setIsLoading(true);
  try {
    const success = await signup(formData.username, formData.email, formData.password);
    if (success) {
      router.push('/profile');  // Redirect to profile
    }
  } catch (error) {
    setErrors({ general: 'Sign up failed' });
  } finally {
    setIsLoading(false);
  }
};
```

### Protected Profile Page (`src/app/profile/page.tsx`)

This page requires authentication:

```typescript
const ProfilePage: React.FC = () => {
  const { user } = useAuth();

  // Redirect if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Access Denied</h2>
          <p className="text-slate-300 mb-6">Please sign in to view your profile.</p>
          <Link href="/login" className="neon-button-cyan">Sign In</Link>
        </div>
      </div>
    );
  }

  // Render profile content for authenticated users
  return (
    <div>
      <h1>Welcome, {user.username}!</h1>
      {/* Profile dashboard content */}
    </div>
  );
};
```

## 📊 Using Authentication in Components

### Header Component

Shows different content based on auth status:

```typescript
const Header: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <header>
      {isAuthenticated && user ? (
        <>
          <Link href="/profile">
            <span>{user.avatar}</span>
            <span>{user.username}</span>
          </Link>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <>
          <Link href="/login">Sign In</Link>
          <Link href="/signup">Join Universe</Link>
        </>
      )}
    </header>
  );
};
```

### Home Page

Shows personalized content for logged-in users:

```typescript
const HomePage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();

  return (
    <div>
      {!isAuthenticated ? (
        <div>
          <h1>Welcome to Novel Universe</h1>
          <Link href="/signup">Join the Universe</Link>
        </div>
      ) : (
        <div>
          <h1>Welcome back, {user?.username}!</h1>
          <div>Books Read: {user?.progress.booksRead}</div>
          <div>Achievements: {user?.achievements.length}</div>
        </div>
      )}
    </div>
  );
};
```

### Any Component

Any component can access auth state:

```typescript
const SomeComponent: React.FC = () => {
  const { user, isAuthenticated, addFavorite } = useAuth();
  
  const handleFavorite = (character: string) => {
    if (isAuthenticated) {
      addFavorite('characters', character);
    } else {
      // Redirect to login or show message
      alert('Please log in to add favorites');
    }
  };

  return (
    <div>
      {/* Component content */}
    </div>
  );
};
```

## 🛡️ Route Protection

### Client-Side Protection

For pages that require authentication:

```typescript
const ProtectedPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return <div>Redirecting...</div>;
  }

  return <div>Protected content</div>;
};
```

### Higher-Order Component (HOC) Pattern

Create a reusable wrapper:

```typescript
const withAuth = (Component: React.ComponentType) => {
  return function AuthenticatedComponent(props: any) {
    const { isAuthenticated } = useAuth();
    
    if (!isAuthenticated) {
      return (
        <div>
          <h2>Access Denied</h2>
          <Link href="/login">Please log in</Link>
        </div>
      );
    }
    
    return <Component {...props} />;
  };
};

// Usage
const ProtectedProfile = withAuth(ProfilePage);
```

## 🎯 Demo vs Production

### Current Demo System

**Pros**:
- ✅ No backend required
- ✅ Works immediately
- ✅ Great for testing and learning
- ✅ Shows all authentication concepts

**Cons**:
- ❌ Not secure (anyone can see user data)
- ❌ Data lost if localStorage is cleared
- ❌ No real password verification
- ❌ Can't share data between devices

### Production Authentication

For a real application, you'd need:

```typescript
// Real login function would look like:
const login = async (email: string, password: string) => {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    if (response.ok) {
      const { user, token } = await response.json();
      localStorage.setItem('authToken', token);
      setUser(user);
      setIsAuthenticated(true);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Login error:', error);
    return false;
  }
};
```

**Production requirements**:
- Backend API for authentication
- Secure password hashing
- JWT tokens or session cookies
- Database for user storage
- HTTPS for secure communication
- Password reset functionality
- Email verification

## 🔍 Debugging Authentication

### Common Issues

1. **User not persisting between page reloads**
   - Check if localStorage is working
   - Verify useEffect dependency array
   - Look for localStorage.clear() calls

2. **Login/signup not working**
   - Check form validation logic
   - Verify state updates
   - Look at browser console for errors

3. **Protected pages not redirecting**
   - Ensure useAuth hook is working
   - Check conditional rendering logic
   - Verify authentication state

### Debug Tools

```typescript
// Add to any component to debug auth state
const { user, isAuthenticated } = useAuth();
console.log('Auth Debug:', { user, isAuthenticated });

// Check localStorage manually
console.log('Stored user:', localStorage.getItem('user'));
```

## 🎯 Key Takeaways

1. **Context Pattern**: AuthContext provides global authentication state
2. **Hooks**: useAuth makes authentication easy to use in any component
3. **Persistence**: localStorage keeps users logged in between sessions
4. **Protection**: Pages can require authentication before showing content
5. **State Management**: Authentication state flows throughout the app
6. **Demo Ready**: Current system works great for learning and testing

## 🚀 Next Steps

1. **Explore the code**: Look at AuthContext.tsx to see everything in action
2. **Test the system**: Try logging in, signing up, and logging out
3. **Modify components**: Practice using useAuth in different components
4. **Add features**: Try adding new authentication-related functionality

Understanding this authentication system gives you a solid foundation for building user-centric web applications!

---

*Next: Learn about [🎯 Component Architecture](./component-architecture.md) to understand how components work together.*
