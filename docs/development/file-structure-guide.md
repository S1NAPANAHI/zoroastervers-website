# 📁 File Structure Guide

This guide explains every folder, file, and their purposes in your Next.js project. Understanding the structure is crucial for web development.

## 🏗️ Complete Project Structure

```
novel-worldbuilding-hub/
├── 📁 docs/                       ← Educational content and guides
│   ├── README.md                  ← Main documentation (you read this!)
│   ├── file-structure-guide.md    ← This file explaining structure
│   ├── react-fundamentals.md      ← React concepts explained
│   └── [other guides...]
│
├── 📁 src/                        ← Source code (everything we write)
│   └── 📁 app/                    ← Next.js App Router (the main app)
│       ├── 📁 components/         ← Reusable UI components
│       │   ├── Header.tsx         ← Navigation bar with auth
│       │   └── Timeline.tsx       ← Interactive timeline component
│       │
│       ├── 📁 contexts/           ← Global state management
│       │   └── AuthContext.tsx    ← User authentication logic
│       │
│       ├── 📁 login/              ← Login page folder
│       │   └── page.tsx           ← Login page component
│       │
│       ├── 📁 signup/             ← Sign up page folder
│       │   └── page.tsx           ← Sign up page component
│       │
│       ├── 📁 profile/            ← User profile page folder
│       │   └── page.tsx           ← Profile dashboard component
│       │
│       ├── 📁 timeline/           ← Timeline page folder
│       │   └── page.tsx           ← Timeline page component
│       │
│       ├── 📁 books/              ← Books page folder
│       │   └── page.tsx           ← Books showcase component
│       │
│       ├── globals.css            ← Global styles and design system
│       ├── layout.tsx             ← Wraps all pages (header, footer, etc.)
│       └── page.tsx               ← Home page (index)
│
├── 📁 public/                     ← Static files served directly
│   ├── favicon.ico                ← Website icon in browser tab
│   └── [images, icons, etc.]      ← Static assets
│
├── 📁 node_modules/               ← Installed packages (DON'T EDIT)
│   └── [thousands of files]       ← Dependencies downloaded by npm
│
├── 📄 package.json                ← Project configuration & dependencies
├── 📄 package-lock.json           ← Exact dependency versions (DON'T EDIT)
├── 📄 next.config.js              ← Next.js configuration
├── 📄 tailwind.config.js          ← Tailwind CSS configuration
├── 📄 tsconfig.json               ← TypeScript configuration
├── 📄 postcss.config.js           ← CSS processing configuration
└── 📄 .next/                      ← Build output (DON'T EDIT)
```

## 📋 File-by-File Explanation

### 🌟 Root Level Files

#### `package.json` - Project Blueprint
```json
{
  "name": "novel-worldbuilding-hub",
  "version": "0.1.0",
  "scripts": {
    "dev": "next dev --turbopack",    ← Start development server
    "build": "next build",           ← Build for production
    "start": "next start"            ← Run production server
  },
  "dependencies": {
    "react": "^18.0.0",              ← UI library
    "next": "^15.0.0",               ← React framework
    "typescript": "^5.0.0"           ← Type safety
  }
}
```

**What it does**: Defines your project, lists dependencies, contains scripts to run commands.

#### `next.config.js` - Next.js Settings
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {};
export default nextConfig;
```

**What it does**: Configures how Next.js builds and runs your app.

#### `tailwind.config.js` - Styling Configuration
```javascript
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],  ← Where to look for classes
  theme: {
    extend: {
      // Custom colors, fonts, etc.
    }
  }
}
```

**What it does**: Tells Tailwind CSS where to find your components and defines custom styles.

#### `tsconfig.json` - TypeScript Settings
```json
{
  "compilerOptions": {
    "target": "es5",
    "module": "esnext",
    "strict": true,                    ← Enable strict type checking
    "jsx": "preserve"                  ← How to handle JSX
  }
}
```

**What it does**: Configures TypeScript compiler for type checking and compilation.

### 📁 Source Code Structure (`src/app/`)

#### Why `src/app/`?
Next.js 13+ uses the "App Router" which organizes files in the `app` directory. Each folder can contain:
- `page.tsx` - The main component for that route
- `layout.tsx` - Wrapper for pages in that folder
- Other supporting files

### 🧩 Components (`src/app/components/`)

#### `Header.tsx` - Navigation Component
```typescript
'use client';  // Runs in browser (interactive)

import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const Header: React.FC = () => {
  const { user, logout } = useAuth();  // Get user data
  
  return (
    <header className="glass-dark">     {/* Styled header */}
      {/* Navigation content */}
    </header>
  );
};

export default Header;
```

**What it does**: 
- Shows navigation links
- Displays user info when logged in
- Provides login/logout functionality
- Uses authentication context for user data

#### `Timeline.tsx` - Interactive Timeline
```typescript
'use client';

const Timeline: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);  // Track selected event
  
  const timelineEvents = [
    {
      id: 'dawn-age',
      title: 'The Dawn of Magic',
      // Event data...
    }
  ];
  
  return (
    <div className="timeline-container">
      {/* Timeline visualization */}
    </div>
  );
};
```

**What it does**:
- Renders interactive timeline with events
- Handles event selection and modal display
- Manages component state for interactions

### 🌐 Global State (`src/app/contexts/`)

#### `AuthContext.tsx` - Authentication Management
```typescript
'use client';

interface User {
  id: string;
  username: string;
  email: string;
  // More user properties...
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const login = async (email: string, password: string) => {
    // Authentication logic...
  };
  
  return (
    <AuthContext.Provider value={{ user, login, logout, /* ... */ }}>
      {children}
    </AuthContext.Provider>
  );
};
```

**What it does**:
- Manages user authentication state globally
- Provides login/logout functions
- Stores user data accessible anywhere in app
- Handles session persistence with localStorage

### 📄 Pages Structure

Each page folder contains a `page.tsx` file that represents a route:

#### Route Mapping
- `app/page.tsx` → `http://localhost:3000/` (Home)
- `app/login/page.tsx` → `http://localhost:3000/login`
- `app/signup/page.tsx` → `http://localhost:3000/signup`
- `app/profile/page.tsx` → `http://localhost:3000/profile`
- `app/timeline/page.tsx` → `http://localhost:3000/timeline`

#### Page Structure Example
```typescript
// app/login/page.tsx
'use client';

import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { login } = useAuth();
  
  const handleSubmit = async (e: React.FormEvent) => {
    // Handle form submission...
  };
  
  return (
    <div>
      {/* Login form JSX */}
    </div>
  );
};

export default LoginPage;
```

### 🎨 Styling (`src/app/globals.css`)

```css
/* Tailwind CSS imports */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Custom CSS variables for consistent theming */
:root {
  --primary-bg: #1e1e1e;
  --glass-border: rgba(255, 255, 255, 0.2);
  /* ... more variables */
}

/* Custom component classes */
.glass-dark {
  background: rgba(30, 30, 30, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid var(--glass-border);
}

.neon-button-cyan {
  background: linear-gradient(45deg, #00bcd4, #00acc1);
  box-shadow: 0 0 20px rgba(0, 188, 212, 0.3);
  /* Glow effect */
}
```

**What it does**:
- Imports Tailwind CSS utilities
- Defines CSS custom properties (variables)
- Creates reusable component styles
- Implements glassmorphism and neon effects

### 🔧 Layout (`src/app/layout.tsx`)

```typescript
import { AuthProvider } from './contexts/AuthContext';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>          {/* Wraps entire app with auth context */}
          {children}            {/* Individual page content goes here */}
        </AuthProvider>
      </body>
    </html>
  );
}
```

**What it does**:
- Wraps all pages with common elements
- Provides global context providers
- Sets up HTML structure
- Includes global imports

## 🤔 Common Questions

### Q: Why so many files?
**A**: Modern web development breaks functionality into small, focused files for:
- **Maintainability**: Easy to find and fix issues
- **Reusability**: Components can be used in multiple places
- **Collaboration**: Multiple developers can work on different files
- **Testing**: Individual pieces can be tested separately

### Q: What's the difference between `.js`, `.jsx`, `.ts`, `.tsx`?
**A**: 
- `.js` - Regular JavaScript
- `.jsx` - JavaScript with JSX (React HTML-like syntax)
- `.ts` - TypeScript (JavaScript with types)
- `.tsx` - TypeScript with JSX (what we use for React components)

### Q: Why `'use client'` at the top of some files?
**A**: Next.js has two types of components:
- **Server Components**: Run on server, good for static content
- **Client Components**: Run in browser, needed for interactions (clicks, forms, etc.)

The `'use client'` directive tells Next.js this component needs to run in the browser.

### Q: What are all these configuration files?
**A**: Modern web development requires tools for:
- **TypeScript**: Type checking (`tsconfig.json`)
- **Tailwind**: CSS processing (`tailwind.config.js`)
- **Next.js**: Framework settings (`next.config.js`)
- **PostCSS**: CSS transformations (`postcss.config.js`)
- **Node.js**: Package management (`package.json`)

## 🎯 Key Takeaways

1. **File Organization**: Each file has a specific purpose and location
2. **Components**: Reusable UI pieces in their own files
3. **Pages**: Each route gets its own folder and `page.tsx`
4. **Context**: Global state management for data used across components
5. **Configuration**: Multiple config files control different tools
6. **Separation of Concerns**: Styles, logic, and structure are separated

Understanding this structure is essential for:
- Finding where to make changes
- Adding new features
- Debugging issues
- Following React/Next.js best practices

---

*Next: Learn about [🎯 React Fundamentals](./react-fundamentals.md) to understand how components work.*
