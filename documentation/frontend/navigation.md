# Navigation Documentation

## Overview

The Novel Worldbuilding Hub uses Next.js App Router for routing and navigation. This document outlines our conventions, patterns, and best practices for implementing navigation throughout the application.

## Routing Structure

### File-based Routing
We follow Next.js 13+ App Router conventions with the `app/` directory:

```
app/
├── layout.tsx              # Root layout
├── page.tsx               # Home page (/)
├── globals.css            # Global styles
├── loading.tsx            # Global loading UI
├── error.tsx              # Global error UI
├── not-found.tsx          # 404 page
├── (auth)/                # Route group
│   ├── login/
│   │   └── page.tsx       # /login
│   └── register/
│       └── page.tsx       # /register
├── dashboard/
│   ├── layout.tsx         # Dashboard layout
│   ├── page.tsx          # /dashboard
│   ├── worlds/
│   │   ├── page.tsx      # /dashboard/worlds
│   │   └── [id]/
│   │       ├── page.tsx   # /dashboard/worlds/[id]
│   │       └── edit/
│   │           └── page.tsx # /dashboard/worlds/[id]/edit
│   └── characters/
│       ├── page.tsx      # /dashboard/characters
│       └── [id]/
│           └── page.tsx   # /dashboard/characters/[id]
└── api/                  # API routes
    └── worlds/
        └── route.ts      # API endpoint
```

### Route Groups
Use parentheses `()` to organize routes without affecting the URL structure:
- `(auth)/` - Authentication pages
- `(dashboard)/` - Protected dashboard pages
- `(public)/` - Public marketing pages

### Dynamic Routes
- `[id]` - Single dynamic segment
- `[...slug]` - Catch-all segments
- `[[...slug]]` - Optional catch-all segments

## Navigation Patterns

### Programmatic Navigation
```typescript
import { useRouter } from 'next/navigation';

const Component = () => {
  const router = useRouter();

  const handleNavigation = () => {
    // Push new route (adds to history)
    router.push('/dashboard/worlds');
    
    // Replace current route (no history entry)
    router.replace('/login');
    
    // Go back in history
    router.back();
    
    // Navigate with query parameters
    router.push('/search?q=fantasy&type=world');
  };

  return <button onClick={handleNavigation}>Navigate</button>;
};
```

### Link Component Usage
```typescript
import Link from 'next/link';

// Basic link
<Link href="/dashboard">Dashboard</Link>

// Link with dynamic route
<Link href={`/worlds/${worldId}`}>View World</Link>

// Link with query parameters
<Link href={{
  pathname: '/search',
  query: { q: 'fantasy', category: 'worlds' }
}}>
  Search Fantasy Worlds
</Link>

// External link (opens in new tab)
<Link href="https://external-site.com" target="_blank" rel="noopener">
  External Link
</Link>

// Conditional active styling
<Link 
  href="/dashboard" 
  className={pathname === '/dashboard' ? 'active' : ''}
>
  Dashboard
</Link>
```

### Navigation Guards
```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('auth-token');

  // Protect dashboard routes
  if (pathname.startsWith('/dashboard') && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Redirect authenticated users away from auth pages
  if ((pathname === '/login' || pathname === '/register') && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/register']
};
```

## URL Patterns and Conventions

### Resource-Based URLs
Follow RESTful conventions for resource URLs:
- `/worlds` - List all worlds
- `/worlds/new` - Create new world form
- `/worlds/[id]` - View specific world
- `/worlds/[id]/edit` - Edit world form
- `/worlds/[id]/characters` - Characters in world

### Query Parameters
Use consistent query parameter naming:
- `q` - Search query
- `page` - Pagination page number
- `limit` - Items per page
- `sort` - Sort field
- `order` - Sort direction (asc/desc)
- `filter` - Filter values

```typescript
// Example URL: /worlds?q=fantasy&sort=created&order=desc&page=2
const searchParams = useSearchParams();
const query = searchParams.get('q');
const sort = searchParams.get('sort') || 'created';
const order = searchParams.get('order') || 'desc';
const page = parseInt(searchParams.get('page') || '1');
```

## Navigation Components

### Breadcrumb Navigation
```typescript
interface BreadcrumbItem {
  label: string;
  href?: string;
}

const Breadcrumb = ({ items }: { items: BreadcrumbItem[] }) => {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && <ChevronRight className="h-4 w-4 text-gray-400" />}
            {item.href ? (
              <Link href={item.href} className="text-blue-600 hover:underline">
                {item.label}
              </Link>
            ) : (
              <span className="text-gray-900">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

// Usage
<Breadcrumb items={[
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Worlds', href: '/dashboard/worlds' },
  { label: world.name }
]} />
```

### Sidebar Navigation
```typescript
const SidebarNav = ({ items }: { items: NavItem[] }) => {
  const pathname = usePathname();

  return (
    <nav className="space-y-2">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            'flex items-center px-3 py-2 rounded-md text-sm font-medium',
            pathname === item.href 
              ? 'bg-blue-100 text-blue-700' 
              : 'text-gray-700 hover:bg-gray-100'
          )}
        >
          <item.icon className="mr-3 h-5 w-5" />
          {item.label}
        </Link>
      ))}
    </nav>
  );
};
```

### Tab Navigation
```typescript
const TabNavigation = ({ tabs, activeTab }: TabNavigationProps) => {
  return (
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex space-x-8">
        {tabs.map((tab) => (
          <Link
            key={tab.id}
            href={tab.href}
            className={cn(
              'py-2 px-1 border-b-2 font-medium text-sm',
              activeTab === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            )}
          >
            {tab.label}
          </Link>
        ))}
      </nav>
    </div>
  );
};
```

## Search and Filtering

### Search Implementation
```typescript
const useSearch = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const setSearchQuery = (query: string) => {
    const params = new URLSearchParams(searchParams);
    if (query) {
      params.set('q', query);
    } else {
      params.delete('q');
    }
    params.set('page', '1'); // Reset to first page
    router.push(`?${params.toString()}`);
  };

  return {
    query: searchParams.get('q') || '',
    setSearchQuery,
  };
};
```

### Filter Components
```typescript
const FilterSelect = ({ name, options, value, onChange }: FilterSelectProps) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(name, e.target.value)}
      className="block w-full rounded-md border-gray-300"
    >
      <option value="">All {name}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};
```

## Performance Considerations

### Prefetching
```typescript
// Prefetch on hover
<Link href="/dashboard/worlds" prefetch={false}>
  Worlds
</Link>

// Prefetch programmatically
const router = useRouter();
useEffect(() => {
  router.prefetch('/dashboard/worlds');
}, [router]);
```

### Loading States
```typescript
// app/dashboard/loading.tsx
export default function Loading() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
    </div>
  );
}
```

## Accessibility

### Keyboard Navigation
- Ensure all interactive elements are keyboard accessible
- Implement proper focus management
- Use skip links for main content

### Screen Reader Support
```typescript
// Navigation landmarks
<nav aria-label="Main navigation">
  {/* navigation items */}
</nav>

<nav aria-label="Breadcrumb">
  {/* breadcrumb items */}
</nav>

// Current page indication
<Link 
  href="/dashboard" 
  aria-current={pathname === '/dashboard' ? 'page' : undefined}
>
  Dashboard
</Link>
```

## Testing Navigation

### Navigation Testing
```typescript
import { render, screen } from '@testing-library/react';
import { useRouter } from 'next/navigation';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
  useSearchParams: jest.fn(),
}));

test('navigates to correct route on click', () => {
  const mockPush = jest.fn();
  (useRouter as jest.Mock).mockReturnValue({
    push: mockPush,
  });

  render(<NavigationComponent />);
  
  fireEvent.click(screen.getByText('Dashboard'));
  expect(mockPush).toHaveBeenCalledWith('/dashboard');
});
```

---

*This navigation guide should be updated as routing patterns evolve and new navigation features are added.*
