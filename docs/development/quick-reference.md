# 🚀 Quick Reference Guide

Essential commands, URLs, and information for your Novel Worldbuilding Hub project.

## 🎯 Getting Started Commands

```bash
# Navigate to project folder
cd "D:\work\novel-worldbuilding-hub"

# Start development server
npm run dev

# Install new packages (if needed)
npm install

# Build for production (future use)
npm run build
```

## 🌐 Important URLs

| Page | URL | Purpose |
|------|---------|
| **Home** | `http://localhost:3000/` | Main landing page |
| **Series Overview** | `http://localhost:3000/overview` | Spoiler-free universe guide |
| **Sign Up** | `http://localhost:3000/signup` | Create new account |
| **Login** | `http://localhost:3000/login` | Sign in to existing account |
| **Profile** | `http://localhost:3000/profile` | User dashboard (requires login) |
| **Timeline** | `http://localhost:3000/timeline` | Enhanced interactive timeline with book navigation ribbons, date ruler, and scroll-triggered gradients |
| **Books** | `http://localhost:3000/books` | Book showcase |

## 🔑 Demo Login Credentials

| Method | Details |
|--------|---------|
| **Quick Demo** | Click "🚀 Demo Login" button on login page |
| **Manual Login** | Email: `loremaster@example.com` \u003cbr\u003e Password: `password123` |
| **Google Login** | Click "Continue with Google" button (mocked for demo) |
| **Facebook Login** | Click "Continue with Facebook" button (mocked for demo) |
| **New Account** | Use signup page with any username/email/password |

## 🔐 Authentication Methods

### Email/Password Login
```javascript
const { login } = useAuth();
const success = await login(email, password);
if (success) {
  router.push('/profile');
}
```

### Google Login
```javascript
const { loginWithGoogle } = useAuth();
const success = await loginWithGoogle();
if (success) {
  router.push('/profile');
}
```

### Facebook Login
```javascript
const { loginWithFacebook } = useAuth();
const success = await loginWithFacebook();
if (success) {
  router.push('/profile');
}
```

### Signup
```javascript
const { signup } = useAuth();
const success = await signup(username, email, password);
```

### Logout
```javascript
const { logout } = useAuth();
logout(); // Clears user data and redirects
```

## 📁 Key Files to Know

| File | Location | Purpose |
|------|----------|---------|
| **Home Page** | `src/app/page.tsx` | Main landing page |
| **Series Overview** | `src/app/overview/page.tsx` | Spoiler-free universe guide |
| **Authentication** | `src/app/contexts/AuthContext.tsx` | User login system |
| **Global Styles** | `src/app/globals.css` | Design system and themes |
| **Header** | `src/app/components/Header.tsx` | Navigation bar |
| **Enhanced Timeline** | `src/app/components/EnhancedTimeline.tsx` | Enhanced interactive timeline with additional features |
| **Profile** | `src/app/profile/page.tsx` | User dashboard |
| **Login** | `src/app/login/page.tsx` | Sign in page |
| **Signup** | `src/app/signup/page.tsx` | Registration page |

## 🎨 CSS Classes Reference

### Glassmorphism Effects
```css
.glass-dark          /* Dark glass with blur */
.glass               /* Light glass with blur */
```

### Neon Button Colors
```css
.neon-button-cyan    /* Cyan/blue glow */
.neon-button-purple  /* Purple glow */
.neon-button-pink    /* Pink glow */
.neon-button-green   /* Green glow */
.neon-button-red     /* Red glow */
```

### Layout Classes
```css
.container mx-auto px-4    /* Centered container with padding */
.grid grid-cols-3 gap-6    /* 3-column grid with spacing */
.flex items-center         /* Horizontal flex with vertical centering */
```

## 🔧 Authentication Hook Usage

```typescript
import { useAuth } from '../contexts/AuthContext';

const MyComponent = () = {
  const { 
    user,              // Current user data or null
    isAuthenticated,   // Boolean: is user logged in?
    login,             // Function to log in with email and password
    loginWithGoogle,   // Function to log in with Google
    loginWithFacebook, // Function to log in with Facebook
    logout,            // Function to log out
    updateProfile,     // Function to update user data
    addFavorite,       // Function to add favorites
    unlockAchievement  // Function to award achievements
  } = useAuth();
  
  // Use in your component...
};
```

## 📊 User Data Structure

```typescript
interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
  joinDate: string;
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
  notes: Note[];
  customPaths: CustomPath[];
}
```

## 🎯 Component Creation Template

```typescript
'use client';

import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface MyComponentProps {
  // Define props here
}

const MyComponent: React.FC<MyComponentProps> = ({ /* props */ }) => {
  const [state, setState] = useState(initialValue);
  const { user, isAuthenticated } = useAuth();

  const handleSomething = () => {
    // Event handler logic
  };

  return (
    <div className="glass-dark p-6 rounded-2xl border border-white/20">
      {/* Component JSX */}
    </div>
  );
};

export default MyComponent;
```

## 🛠️ Common Tasks

### Add a New Page
1. Create folder: `src/app/my-page/`
2. Create file: `src/app/my-page/page.tsx`
3. Add component code
4. Access at: `http://localhost:3000/my-page`

### Add New Component
1. Create file: `src/app/components/MyComponent.tsx`
2. Write component code
3. Import and use: `import MyComponent from './components/MyComponent';`

### Modify Styles
1. Global styles: Edit `src/app/globals.css`
2. Component styles: Use Tailwind classes in `className`
3. Custom classes: Add to `globals.css` with `.class-name { ... }`

### Check Authentication
```typescript
const { isAuthenticated, user } = useAuth();

if (!isAuthenticated) {
  return <div>Please log in</div>;
}

// Render authenticated content
```

## 🎨 Color Palette

| Color | Tailwind Class | CSS Value | Usage |
|-------|---------------|-----------|-------|
| **Cyan** | `text-cyan-400` | `#22d3ee` | Primary accent, buttons |
| **Purple** | `text-purple-400` | `#c084fc` | Secondary accent |
| **Pink** | `text-pink-400` | `#f472b6` | Highlights, special items |
| **Green** | `text-green-400` | `#4ade80` | Success, positive actions |
| **Red** | `text-red-400` | `#f87171` | Error, danger, logout |
| **Slate** | `text-slate-300` | `#cbd5e1` | Body text |
| **White** | `text-white` | `#ffffff` | Headings, important text |

## 🔍 Debugging Tips

### Check Authentication State
```typescript
console.log('User:', user);
console.log('Authenticated:', isAuthenticated);
console.log('LocalStorage:', localStorage.getItem('user'));
```

### Common Issues
| Problem | Solution |
|---------|----------|
| **Page won't load** | Check console for errors, restart dev server |
| **Login not working** | Clear localStorage, check credentials |
| **Styles not applying** | Check Tailwind class names, restart server |
| **Component not showing** | Check imports, file paths, and export/import |

### Browser DevTools
- **F12** or **Ctrl+Shift+I**: Open developer tools
- **Console tab**: See JavaScript errors and logs
- **Elements tab**: Inspect HTML and CSS
- **Application tab**: Check localStorage data

## 📚 Documentation Index

| Guide | Purpose | When to Read |
|-------|---------|--------------|
| [📖 Web Development Basics](./web-development-basics.md) | Core concepts | Start here if new to web dev |
| [📁 File Structure Guide](./file-structure-guide.md) | Project organization | Understand how files are organized |
| [🎯 React Fundamentals](./react-fundamentals.md) | Component concepts | Learn how React works |
| [🔧 Authentication Guide](./authentication-guide.md) | Login system | Understand user management |

## 🆘 Getting Help

### If Something Breaks
1. **Check the browser console** for error messages
2. **Restart the dev server**: Stop with Ctrl+C, run `npm run dev` again
3. **Clear browser data**: Refresh page, clear localStorage
4. **Read error messages**: They usually tell you what's wrong

### Learning Resources
- **React Documentation**: https://react.dev/
- **Next.js Documentation**: https://nextjs.org/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **TypeScript Handbook**: https://www.typescriptlang.org/docs/

### Project-Specific Help
- Read the documentation guides in this folder
- Examine existing code to see patterns
- Make small changes and observe results
- Use browser DevTools to debug issues

## 🎉 Quick Wins

### Easy Modifications to Try
1. **Change text**: Edit strings in JSX
2. **Modify colors**: Change Tailwind color classes
3. **Add new achievement**: Update the achievements array
4. **Create new timeline event**: Add to timelineEvents array
5. **Customize user profile**: Modify the profile page layout

### Next Steps
1. **Explore all pages**: Visit every URL and understand what you see
2. **Login and test features**: Create account, add notes, view achievements
3. **Read the code**: Study files with documentation as reference
4. **Make changes**: Start with small modifications
5. **Build new features**: Add your own components and pages

---

*This quick reference should help you navigate and work with your project efficiently. Bookmark this page for easy access to essential information!*
