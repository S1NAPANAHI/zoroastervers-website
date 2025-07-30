# 🎯 React Fundamentals

This guide explains React concepts through examples from your project. React is a JavaScript library for building user interfaces with reusable components.

## 🧩 What is React?

React lets you build interactive websites by creating **components** - reusable pieces of UI that manage their own state and render themselves.

Think of it like building with LEGO blocks:
- Each LEGO piece is a component
- You combine pieces to build larger structures
- Each piece has a specific purpose and can be reused

## 🏗️ Components - The Building Blocks

### Basic Component Structure

```typescript
// A simple React component
import React from 'react';

const WelcomeMessage: React.FC = () => {
  return (
    <div>
      <h1>Welcome to our Universe!</h1>
      <p>Start your journey here.</p>
    </div>
  );
};

export default WelcomeMessage;
```

**Breaking it down**:
- `React.FC` = "React Functional Component" (TypeScript type)
- `return (...)` = What gets rendered on screen
- JSX = HTML-like syntax inside JavaScript
- `export default` = Makes component available to other files

### Real Example from Your Project

Let's look at your Header component:

```typescript
// src/app/components/Header.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';

const Header: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-dark">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold">
            Novel Universe
          </Link>
          
          {/* Authentication Section */}
          <div className="flex items-center space-x-3">
            {isAuthenticated ? (
              <>
                <span>Welcome, {user?.username}!</span>
                <button onClick={logout}>Logout</button>
              </>
            ) : (
              <>
                <Link href="/login">Sign In</Link>
                <Link href="/signup">Join Universe</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
```

**What's happening here**:
1. **Import dependencies**: React, Next.js Link, authentication context
2. **Get data**: User info from authentication context
3. **Conditional rendering**: Show different content based on login status
4. **Return JSX**: The HTML-like structure that gets rendered

## 🎣 Hooks - Adding Functionality

Hooks are special functions that let you "hook into" React features. They always start with `use`.

### useState - Managing Component State

State is data that can change over time. When state changes, React re-renders the component.

```typescript
import React, { useState } from 'react';

const Counter: React.FC = () => {
  // Create state variable with initial value of 0
  const [count, setCount] = useState(0);
  
  const increment = () => {
    setCount(count + 1);  // Update state
  };
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>+1</button>
    </div>
  );
};
```

**How it works**:
- `useState(0)` creates state with initial value 0
- Returns array: `[currentValue, setterFunction]`
- `setCount(newValue)` updates state and triggers re-render

### Real Example: Login Form

From your login page:

```typescript
const LoginPage: React.FC = () => {
  // Form data state
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  // Error state
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  
  // Loading state
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Attempt login...
      const success = await login(formData.email, formData.password);
      if (success) {
        router.push('/profile');
      }
    } catch (error) {
      setErrors({ general: 'Login failed' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
      />
      <input
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Password"
        type="password"
      />
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Signing In...' : 'Sign In'}
      </button>
    </form>
  );
};
```

**Three types of state**:
1. **Form data**: What the user has typed
2. **Errors**: Validation or server errors
3. **Loading**: Whether operation is in progress

### useEffect - Side Effects

`useEffect` runs code when components mount, update, or unmount.

```typescript
import React, { useState, useEffect } from 'react';

const UserProfile: React.FC = () => {
  const [user, setUser] = useState(null);
  
  // Run when component mounts
  useEffect(() => {
    // Load user data from localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []); // Empty array = run only once when component mounts
  
  // Run when user changes
  useEffect(() => {
    if (user) {
      // Save user data to localStorage
      localStorage.setItem('user', JSON.stringify(user));
    }
  }, [user]); // Run when 'user' state changes
  
  return (
    <div>
      {user ? <p>Welcome, {user.name}!</p> : <p>Please log in</p>}
    </div>
  );
};
```

### useContext - Sharing Data

Context lets you share data across components without passing props down manually.

```typescript
// Creating context (AuthContext.tsx)
import React, { createContext, useContext, useState } from 'react';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component wraps the app
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = async (email: string, password: string) => {
    // Login logic...
    setUser(foundUser);
    setIsAuthenticated(true);
    return true;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```

**Using the context**:
```typescript
const Header: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  
  return (
    <header>
      {isAuthenticated ? (
        <button onClick={logout}>Logout</button>
      ) : (
        <Link href="/login">Login</Link>
      )}
    </header>
  );
};
```

## 🔄 Component Lifecycle

React components go through stages:

1. **Mounting**: Component is created and added to DOM
2. **Updating**: Component re-renders due to state/props changes
3. **Unmounting**: Component is removed from DOM

```typescript
const ExampleComponent: React.FC = () => {
  const [count, setCount] = useState(0);
  
  // Mounting: Run once when component is created
  useEffect(() => {
    console.log('Component mounted');
    
    // Cleanup function: Runs when component unmounts
    return () => {
      console.log('Component will unmount');
    };
  }, []);
  
  // Updating: Runs when count changes
  useEffect(() => {
    console.log('Count changed to:', count);
  }, [count]);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
};
```

## 🎨 JSX - JavaScript + HTML

JSX lets you write HTML-like code in JavaScript:

```typescript
const UserCard: React.FC = ({ user }) => {
  return (
    <div className="user-card">
      {/* JavaScript expressions in curly braces */}
      <h2>{user.name}</h2>
      <p>Joined: {user.joinDate}</p>
      
      {/* Conditional rendering */}
      {user.isOnline && <span className="online-indicator">Online</span>}
      
      {/* Map over arrays */}
      <ul>
        {user.achievements.map(achievement => (
          <li key={achievement.id}>{achievement.name}</li>
        ))}
      </ul>
      
      {/* Event handlers */}
      <button onClick={() => console.log('Clicked!')}>
        View Profile
      </button>
    </div>
  );
};
```

**JSX Rules**:
- JavaScript expressions go in `{curly braces}`
- Use `className` instead of `class`
- All tags must be closed (`<img />` not `<img>`)
- Return single parent element (or React Fragment `<>...</>`)

## 📊 Props - Passing Data

Props (properties) let you pass data from parent to child components:

```typescript
// Parent component
const App: React.FC = () => {
  const user = { name: 'John', age: 25 };
  
  return (
    <div>
      <UserProfile user={user} showAge={true} />
    </div>
  );
};

// Child component
interface UserProfileProps {
  user: { name: string; age: number };
  showAge: boolean;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, showAge }) => {
  return (
    <div>
      <h1>{user.name}</h1>
      {showAge && <p>Age: {user.age}</p>}
    </div>
  );
};
```

**Key points**:
- Props flow down from parent to child
- Props are read-only (immutable)
- Use TypeScript interfaces to define prop types
- Destructure props in function parameters

## 🎭 Conditional Rendering

Show different content based on conditions:

```typescript
const AuthButton: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  
  // Method 1: Ternary operator
  return (
    <div>
      {isAuthenticated ? (
        <span>Welcome, {user?.username}!</span>
      ) : (
        <button>Please log in</button>
      )}
    </div>
  );
  
  // Method 2: Logical AND
  return (
    <div>
      {isAuthenticated && <span>Welcome, {user?.username}!</span>}
      {!isAuthenticated && <button>Please log in</button>}
    </div>
  );
  
  // Method 3: Early return
  if (!isAuthenticated) {
    return <button>Please log in</button>;
  }
  
  return <span>Welcome, {user?.username}!</span>;
};
```

## 🔄 Lists and Keys

Render lists of data:

```typescript
const AchievementsList: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <div>
      <h2>Your Achievements</h2>
      {user?.achievements.map(achievement => (
        <div key={achievement.id} className="achievement-card">
          <span>{achievement.icon}</span>
          <h3>{achievement.name}</h3>
          <p>{achievement.description}</p>
        </div>
      ))}
    </div>
  );
};
```

**Key points**:
- Always provide unique `key` prop for list items
- Keys help React identify which items changed
- Use stable IDs, not array indices when possible

## 📝 Forms and Events

Handle user input:

```typescript
const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent page refresh
    console.log('Form submitted:', formData);
    // Handle form submission...
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleInputChange}
        placeholder="Your name"
      />
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleInputChange}
        placeholder="Your email"
      />
      <textarea
        name="message"
        value={formData.message}
        onChange={handleInputChange}
        placeholder="Your message"
      />
      <button type="submit">Send Message</button>
    </form>
  );
};
```

## 🎯 Key React Concepts Summary

1. **Components**: Reusable UI building blocks
2. **JSX**: HTML-like syntax in JavaScript
3. **Props**: Data passed from parent to child
4. **State**: Component's changeable data
5. **Hooks**: Functions to add features to components
6. **Context**: Share data across component tree
7. **Events**: Handle user interactions
8. **Conditional Rendering**: Show content based on conditions
9. **Lists**: Render arrays of data
10. **Lifecycle**: Component creation, updates, and destruction

## 🚀 Next Steps

Now that you understand React fundamentals:

1. **Practice**: Modify existing components in your project
2. **Experiment**: Add new features to components
3. **Read**: Study the code in your project with this knowledge
4. **Build**: Create new components using these patterns

---

*Next: Learn about [🚀 Next.js Concepts](./nextjs-concepts.md) to understand the framework powering your app.*
