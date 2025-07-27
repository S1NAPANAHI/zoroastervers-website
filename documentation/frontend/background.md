# Background Documentation

## Overview

This document provides context and rationale for the key architectural decisions, technology choices, and patterns adopted in the Novel Worldbuilding Hub frontend. Understanding these decisions helps developers make consistent choices and contributes to the maintainability of the codebase.

## Project Context

### Application Purpose
The Novel Worldbuilding Hub is a comprehensive platform for writers to create, organize, and manage fictional worlds. The frontend serves as the primary interface for:

- **World Creation**: Interactive tools for building fictional worlds with maps, cultures, and histories
- **Character Management**: Detailed character profiles with relationships and development arcs  
- **Story Organization**: Tools for plotting narratives and managing story elements
- **Collaboration**: Features for sharing worlds and collaborating with other writers
- **Publishing**: Integration with publishing tools and platforms

### User Personas
1. **Solo Writers** - Independent authors creating personal worlds
2. **Collaborative Teams** - Writing groups working on shared universes
3. **Game Masters** - RPG creators building campaign settings
4. **Worldbuilding Enthusiasts** - Hobbyists creating worlds for fun

## Technology Decisions

### Framework Selection: React + Next.js

**Decision**: Use React with Next.js App Router as the primary frontend framework.

**Rationale**:
- **Developer Experience**: Excellent tooling, large community, and extensive documentation
- **Performance**: Built-in optimizations including SSR, SSG, and automatic code splitting
- **Scalability**: Component-based architecture scales well with team size and project complexity
- **SEO Requirements**: Server-side rendering capabilities for public world pages
- **Ecosystem**: Rich ecosystem of compatible libraries and tools

**Alternatives Considered**:
- Vue.js + Nuxt.js: Excellent but smaller ecosystem
- SvelteKit: Great performance but less mature ecosystem
- Angular: Too heavy for our use case and team preferences

### State Management: React Context + SWR

**Decision**: Use React Context for client state and SWR for server state management.

**Rationale**:
- **Simplicity**: Avoids complexity of Redux for our use cases
- **Built-in**: React Context is built into React, reducing bundle size
- **Server State**: SWR handles caching, revalidation, and synchronization elegantly
- **Developer Experience**: Hooks-based API is more intuitive than Redux patterns

**Alternatives Considered**:
- Redux Toolkit: Overkill for our state complexity
- Zustand: Good option but Context + SWR covers our needs
- React Query: Similar to SWR but we preferred SWR's API

### Styling: Tailwind CSS

**Decision**: Use Tailwind CSS for styling with component-based overrides.

**Rationale**:
- **Development Speed**: Utility-first approach enables rapid prototyping
- **Consistency**: Design system constraints prevent inconsistent styling
- **Bundle Size**: Purges unused CSS automatically
- **Customization**: Easy to extend with custom design tokens
- **Team Productivity**: Less context switching between CSS files and components

**Alternatives Considered**:
- Styled Components: Runtime overhead and complexity
- CSS Modules: Less flexible than utilities
- Emotion: Similar tradeoffs to Styled Components

### TypeScript Integration

**Decision**: Full TypeScript adoption with strict mode enabled.

**Rationale**:
- **Type Safety**: Catches errors at compile time, especially important for complex data structures
- **Developer Experience**: Excellent IDE support with autocomplete and refactoring
- **Documentation**: Types serve as inline documentation
- **Refactoring**: Safe large-scale refactoring with confidence
- **Team Collaboration**: Interfaces make component contracts explicit

## Architecture Patterns

### Component Architecture

**Pattern**: Atomic Design with Container/Presentational separation

**Rationale**:
- **Reusability**: Atomic components can be composed into larger features
- **Testing**: Easier to test isolated components
- **Storybook Integration**: Atomic components work well with component documentation
- **Design System**: Aligns with design team's component library approach

### Data Fetching Strategy

**Pattern**: Server state with SWR, client state with Context

**Implementation**:
```typescript
// Server state - world data from API
const { data: world, error } = useSWR(`/api/worlds/${worldId}`, fetcher);

// Client state - UI state like modals, forms
const { isEditing, setIsEditing } = useContext(EditModeContext);
```

**Rationale**:
- **Separation of Concerns**: Different patterns for different types of state
- **Performance**: SWR handles caching and background updates
- **Simplicity**: Context for simple client state avoids Redux complexity

### Error Handling Strategy

**Pattern**: Error boundaries for component errors, hooks for async errors

**Implementation**:
- Error boundaries catch rendering errors
- Custom hooks manage async operation errors
- Global error reporting for uncaught errors

### Routing Approach

**Pattern**: File-based routing with route groups and middleware

**Rationale**:
- **Convention over Configuration**: File system determines routes
- **Code Organization**: Route groups organize related pages
- **Authentication**: Middleware handles route protection
- **Performance**: Automatic code splitting by route

## Design System Decisions

### Color System
- **Primary**: Blue palette for main actions and navigation
- **Secondary**: Gray palette for text and backgrounds  
- **Semantic**: Green (success), Red (error), Yellow (warning)
- **Accessibility**: WCAG AA compliant contrast ratios

### Background Design System
- **Global Background**: High-resolution cosmic image (`/bg.jpg`) with blur effect
- **Glass Overlay**: Dark overlay with 6px backdrop filter blur for enhanced readability
- **Layer Structure**: Fixed cosmic background + blurred overlay + content layer
- **Visual Effects**: Floating particle animations for enhanced cosmic atmosphere
- **Performance**: Single global background reduces redundant image loading across pages

### Typography Scale
- **System Fonts**: Native font stacks for performance
- **Scale**: Modular scale based on 1.25 ratio
- **Hierarchy**: Clear distinction between heading levels

### Spacing System
- **8px Grid**: All spacing based on 8px increments
- **Responsive**: Consistent spacing across breakpoints
- **Component Spacing**: Internal component spacing separate from layout spacing

## Development Practices

### Code Organization
```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base design system components
│   └── features/       # Feature-specific components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── types/              # TypeScript type definitions
└── app/                # Next.js app directory (pages, layouts)
```

### Testing Strategy
- **Unit Tests**: Jest + React Testing Library for components
- **Integration Tests**: Testing user workflows
- **E2E Tests**: Playwright for critical user journeys
- **Visual Tests**: Storybook visual regression testing

### Performance Standards
- **Core Web Vitals**: Meet Google's performance recommendations
- **Bundle Size**: Monitor and optimize JavaScript bundle size
- **Image Optimization**: Use Next.js Image component
- **Code Splitting**: Lazy load non-critical components

## Migration Considerations

### From Legacy System
- **Incremental Migration**: Page-by-page migration strategy
- **Shared Components**: Gradually replace legacy UI components
- **Data Layer**: Maintain API compatibility during transition

### Future Considerations
- **Internationalization**: i18n setup for multi-language support
- **Offline Support**: Service worker for offline functionality
- **Mobile App**: React Native code sharing opportunities

## Decision Log

### Key Architectural Decisions (ADRs)

1. **ADR-001**: Adopt Next.js App Router over Pages Router
2. **ADR-002**: Use TypeScript strict mode for all new code
3. **ADR-003**: Implement design system with Tailwind CSS
4. **ADR-004**: Choose SWR over React Query for server state
5. **ADR-005**: Use file-based routing with middleware for auth

## Success Metrics

### Developer Experience
- **Build Time**: < 30 seconds for development builds
- **Test Suite**: < 2 minutes for full test run
- **Code Review**: Clear patterns reduce review time

### User Experience  
- **Performance**: Core Web Vitals in green
- **Accessibility**: WCAG AA compliance
- **Mobile**: Responsive design works on all devices

### Maintainability
- **Code Coverage**: > 80% test coverage
- **Documentation**: Up-to-date docs for all major features
- **Dependencies**: Regular updates and security patches

---

*This background documentation captures the reasoning behind our technical choices. Update this document when significant architectural decisions are made.*
