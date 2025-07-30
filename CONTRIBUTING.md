# Contributing to Novel Worldbuilding Hub

Thank you for your interest in contributing to the Novel Worldbuilding Hub project! This document outlines the coding standards and conventions we follow.

## Code Style and Conventions

### Export-Import Convention

We use a **barrel pattern** for all components with consistent named exports. This ensures a uniform import experience across the codebase.

#### Component Export Pattern

Every component directory should have an `index.ts` file that re-exports the component as a **named export**:

```typescript
export { default as ComponentName } from './ComponentName';
```

**Example:**
```typescript
// src/components/features/admin/ArcModal/index.ts
export { default as ArcModal } from './ArcModal';
```

#### Component Import Pattern

All consumers must import components using **named imports with brackets**:

```typescript
import { ComponentName } from '@/components/path/to/ComponentName';
```

**Example:**
```typescript
import { ArcModal } from '@/components/features/admin/ArcModal';
import { CharacterModal } from '@/components/features/admin/CharacterModal';
import { BookModal } from '@/components/features/admin/BookModal';
```

#### Why This Convention?

1. **Consistency**: All imports follow the same pattern regardless of the component
2. **Tree Shaking**: Named imports work better with bundler optimization
3. **IDE Support**: Better IntelliSense and auto-completion
4. **Refactoring**: Easier to rename and move components
5. **Barrel Exports**: Enables clean re-exports from higher-level index files

#### Important Notes

- **Always use named imports**: Never use default imports for components
- **Use the barrel pattern**: Always create an `index.ts` that re-exports the component
- **Follow the naming**: The exported name should match the component name exactly
- **Maintain consistency**: This pattern applies to all components, regardless of their location in the component tree

#### Incorrect Usage ❌

```typescript
// DON'T: Default import
import ArcModal from '@/components/features/admin/ArcModal';

// DON'T: Direct file import
import { ArcModal } from '@/components/features/admin/ArcModal/ArcModal';
```

#### Correct Usage ✅

```typescript
// DO: Named import from barrel export
import { ArcModal } from '@/components/features/admin/ArcModal';
```

## Getting Started

1. Fork the repository
2. Create a new branch for your feature or bug fix
3. Follow the established conventions outlined above
4. Write tests for your changes
5. Submit a pull request

## Questions?

If you have any questions about these conventions or need clarification, please feel free to open an issue or reach out to the maintainers.
