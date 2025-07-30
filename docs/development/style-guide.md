# Frontend Style Guide

## Overview

This style guide establishes coding standards and best practices for frontend development in the Novel Worldbuilding Hub. Following these conventions ensures code consistency, maintainability, and team productivity.

## Code Formatting

### Prettier Configuration
We use Prettier for automatic code formatting with these key settings:
- **Semi-colons**: Required
- **Quotes**: Single quotes for JS/TS, double quotes for JSX attributes
- **Trailing commas**: ES5 style (objects and arrays)
- **Tab width**: 2 spaces
- **Print width**: 80 characters

### Example
```typescript
const userConfig = {
  name: 'John Doe',
  email: 'john@example.com',
  preferences: ['fantasy', 'sci-fi'],
};
```

## Naming Conventions

### Files and Folders
- **Components**: PascalCase (`UserProfile.tsx`, `NavigationBar.tsx`)
- **Hooks**: camelCase with `use` prefix (`useUserData.ts`, `useLocalStorage.ts`)
- **Utilities**: camelCase (`formatDate.ts`, `apiHelpers.ts`)
- **Constants**: SCREAMING_SNAKE_CASE (`API_ENDPOINTS.ts`, `THEME_COLORS.ts`)
- **Folders**: kebab-case (`user-management/`, `world-builder/`)

### Variables and Functions
```typescript
// Variables: camelCase
const userName = 'John Doe';
const isLoggedIn = true;

// Functions: camelCase, descriptive verbs
const getUserProfile = () => { /* ... */ };
const handleSubmitForm = () => { /* ... */ };

// Constants: SCREAMING_SNAKE_CASE
const MAX_UPLOAD_SIZE = 5 * 1024 * 1024; // 5MB
const API_BASE_URL = 'https://api.example.com';
```

### React Components
```typescript
// Component names: PascalCase
const UserProfileCard = ({ user }: UserProfileCardProps) => {
  return <div>{user.name}</div>;
};

// Props interfaces: ComponentName + Props
interface UserProfileCardProps {
  user: User;
  onEdit?: () => void;
}
```

## TypeScript Guidelines

### Type Definitions
```typescript
// Use interfaces for object shapes
interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

// Use types for unions, primitives, and computed types
type Status = 'loading' | 'success' | 'error';
type UserWithoutId = Omit<User, 'id'>;

// Generic types: single capital letters
interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}
```

### Strict Type Checking
- Always define return types for functions
- Avoid `any` - use `unknown` or proper types
- Use optional chaining (`?.`) and nullish coalescing (`??`)
- Prefer `const assertions` for immutable data

```typescript
// Good
const fetchUser = async (id: string): Promise<User | null> => {
  const response = await api.get(`/users/${id}`);
  return response.data?.user ?? null;
};

// Avoid
const fetchUser = async (id: any) => {
  const response = await api.get(`/users/${id}`);
  return response.data.user;
};
```

## React Best Practices

### Component Structure
```typescript
// 1. Imports (external first, then internal)
import React, { useState, useEffect } from 'react';
import { User } from '@/types';
import { Button } from '@/components/ui';
import { useUserData } from '@/hooks';

// 2. Types/Interfaces
interface UserProfileProps {
  userId: string;
  onUpdate?: (user: User) => void;
}

// 3. Component
export const UserProfile: React.FC<UserProfileProps> = ({ 
  userId, 
  onUpdate 
}) => {
  // 4. Hooks (useState, useEffect, custom hooks)
  const [isEditing, setIsEditing] = useState(false);
  const { user, loading, error } = useUserData(userId);

  // 5. Event handlers
  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  // 6. Effects
  useEffect(() => {
    if (user && onUpdate) {
      onUpdate(user);
    }
  }, [user, onUpdate]);

  // 7. Early returns
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!user) return null;

  // 8. Render
  return (
    <div className="user-profile">
      {/* Component JSX */}
    </div>
  );
};
```

### Hooks Guidelines
```typescript
// Custom hooks: always start with 'use'
export const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  return [storedValue, setValue] as const;
};
```

## CSS and Styling

### Tailwind CSS Patterns
```typescript
// Use semantic class groupings
const buttonClasses = cn(
  // Layout
  'flex items-center justify-center',
  // Sizing
  'px-4 py-2 min-w-[120px]',
  // Appearance
  'bg-blue-600 text-white rounded-md',
  // States
  'hover:bg-blue-700 focus:ring-2 focus:ring-blue-500',
  // Responsive
  'sm:px-6 sm:py-3'
);

// Conditional classes
const cardClasses = cn(
  'p-4 rounded-lg border',
  {
    'border-red-300 bg-red-50': hasError,
    'border-gray-200 bg-white': !hasError,
  }
);
```

### Component Styling Principles
- Use Tailwind utilities first
- Create reusable component variants
- Avoid inline styles unless dynamic values
- Use CSS custom properties for theme values
- Maintain consistent spacing scale

## Error Handling

### React Error Boundaries
```typescript
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }

    return this.props.children;
  }
}
```

### Async Error Handling
```typescript
const useAsyncOperation = () => {
  const [state, setState] = useState<{
    data: null | any;
    loading: boolean;
    error: null | Error;
  }>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = async (asyncFn: () => Promise<any>) => {
    setState({ data: null, loading: true, error: null });
    
    try {
      const result = await asyncFn();
      setState({ data: result, loading: false, error: null });
    } catch (error) {
      setState({ 
        data: null, 
        loading: false, 
        error: error instanceof Error ? error : new Error('Unknown error')
      });
    }
  };

  return { ...state, execute };
};
```

## Performance Guidelines

### Component Optimization
- Use `React.memo()` for expensive components
- Implement `useMemo()` for expensive calculations
- Use `useCallback()` for functions passed to children
- Avoid creating objects/arrays in render
- Use `React.lazy()` for code splitting

### Bundle Optimization
- Import only what you need from libraries
- Use dynamic imports for heavy components
- Implement proper tree shaking
- Monitor bundle size with webpack-bundle-analyzer

## Testing Standards

### Component Testing
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { UserProfile } from './UserProfile';

describe('UserProfile', () => {
  it('displays user information correctly', () => {
    const mockUser = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
    };

    render(<UserProfile user={mockUser} />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });

  it('handles edit mode toggle', () => {
    const mockUser = { id: '1', name: 'John Doe', email: 'john@example.com' };
    
    render(<UserProfile user={mockUser} />);
    
    const editButton = screen.getByText('Edit');
    fireEvent.click(editButton);
    
    expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument();
  });
});
```

## ESLint Rules

Key rules enforced in our configuration:
- `@typescript-eslint/no-unused-vars`: Error
- `@typescript-eslint/explicit-function-return-type`: Warning
- `react/prop-types`: Off (using TypeScript)
- `react/react-in-jsx-scope`: Off (React 17+ JSX transform)
- `react-hooks/exhaustive-deps`: Warning

---

*This style guide is living documentation. Update it as patterns evolve and new standards are adopted.*
