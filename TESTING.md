# Testing Guide

This document describes the comprehensive testing strategy for the Novel Worldbuilding Hub character management system.

## Testing Stack

- **Unit & Integration Tests**: Jest with React Testing Library
- **End-to-End Tests**: Playwright
- **Component Testing**: React Testing Library
- **API Testing**: Jest with mock implementations
- **Test Coverage**: Istanbul (via Jest)

## Test Structure

```
src/
├── __tests__/
│   ├── api/
│   │   └── characters/
│   │       ├── route.test.ts           # Characters API tests
│   │       ├── [id].test.ts            # Single character API tests
│   │       └── relationships.test.ts   # Relationships API tests
│   └── components/
│       └── admin/
│           ├── CharacterManager.test.tsx  # Component tests
│           └── CharacterForm.test.tsx     # Form component tests
tests/
└── e2e/
    └── character-lifecycle.spec.ts     # End-to-end tests
```

## Test Categories

### 1. Unit Tests for API Routes

#### Characters API (`/api/characters`)
- **GET**: 
  - ✅ Returns all characters with default parameters
  - ✅ Filters by search term, status, importance
  - ✅ Applies pagination and sorting
  - ✅ Returns CSV format when requested
  - ✅ Handles database errors
  
- **POST**: 
  - ✅ Creates new characters successfully
  - ✅ Validates required fields (name)
  - ✅ Sets default values for optional fields
  - ✅ Handles bulk import (CSV/JSON)
  - ✅ Validates file formats
  - ✅ Handles database errors

#### Single Character API (`/api/characters/[id]`)
- **GET**: 
  - ✅ Returns character by ID
  - ✅ Returns 404 for non-existent characters
  - ✅ Includes relationships when requested
  - ✅ Includes timeline data when requested
  - ✅ Handles database errors
  
- **PUT**: 
  - ✅ Updates character successfully
  - ✅ Validates character existence
  - ✅ Filters out read-only fields
  - ✅ Handles validation errors
  - ✅ Handles database errors
  
- **DELETE**: 
  - ✅ Deletes character successfully
  - ✅ Handles database errors
  - ✅ Validates character ID format

#### Relationships API (`/api/characters/relationships`)
- **GET**: 
  - ✅ Returns all relationships with pagination
  - ✅ Filters by character ID, type, status
  - ✅ Includes character data in response
  - ✅ Handles database errors
  
- **POST**: 
  - ✅ Creates new relationships
  - ✅ Validates required fields
  - ✅ Prevents self-relationships
  - ✅ Creates mutual relationships
  - ✅ Sets default values
  - ✅ Handles database errors

### 2. Component Tests

#### CharacterManager Component
- ✅ Renders component correctly
- ✅ Fetches and displays characters
- ✅ Handles search and filtering
- ✅ Opens modal for adding characters
- ✅ Handles character editing
- ✅ Handles character deletion with confirmation
- ✅ Exports characters to CSV
- ✅ Handles loading and error states

#### CharacterForm Component
- ✅ Renders form fields correctly
- ✅ Validates required fields
- ✅ Handles form submission
- ✅ Supports editing existing characters
- ✅ Manages form sections (collapsible)
- ✅ Integrates with sub-components (tags, images, etc.)
- ✅ Handles save/cancel actions

### 3. End-to-End Tests

#### Character Lifecycle Flow
- ✅ **Create**: Navigate to admin panel, add new character
- ✅ **Read**: Verify character appears in list
- ✅ **Edit**: Update character information
- ✅ **Relate**: Create relationships with other characters
- ✅ **Delete**: Remove character with confirmation

## Running Tests

### Unit Tests
```bash
# Run all unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

### End-to-End Tests
```bash
# Run E2E tests (requires dev server running)
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui

# Run all tests (unit + E2E)
npm run test:all
```

### Development Workflow
```bash
# Start development server (required for E2E)
npm run dev

# In another terminal, run tests
npm run test:watch
```

## Test Configuration

### Jest Configuration (`jest.config.js`)
- Uses Next.js Jest configuration
- JSdom environment for React components
- Custom module name mapping for path aliases
- Setup files for test environment
- Coverage collection from src directory

### Playwright Configuration (`playwright.config.ts`)
- Tests multiple browsers (Chrome, Firefox, Safari)
- Automatic dev server startup
- Trace collection on failures
- HTML reporter for results

### Test Setup (`jest.setup.js`)
- Mocks Next.js router and navigation
- Sets up environment variables
- Provides global mocks (fetch, ResizeObserver, etc.)
- Imports Jest DOM matchers

## Test Patterns

### API Route Testing Pattern
```typescript
// Mock Supabase
jest.mock('@/lib/supabaseAdmin', () => ({
  adminDb: { from: jest.fn() }
}))

// Test structure
describe('API Route', () => {
  beforeEach(() => jest.clearAllMocks())
  
  describe('HTTP Method', () => {
    it('should handle success case', async () => {
      // Arrange: Mock dependencies
      // Act: Call API handler
      // Assert: Verify response
    })
    
    it('should handle error case', async () => {
      // Test error scenarios
    })
  })
})
```

### Component Testing Pattern
```typescript
// Test structure
describe('Component', () => {
  const defaultProps = { /* minimal props */ }
  
  it('should render correctly', () => {
    render(<Component {...defaultProps} />)
    expect(screen.getByText('Expected Text')).toBeInTheDocument()
  })
  
  it('should handle user interactions', async () => {
    const mockHandler = jest.fn()
    render(<Component {...defaultProps} onAction={mockHandler} />)
    
    await userEvent.click(screen.getByRole('button'))
    expect(mockHandler).toHaveBeenCalled()
  })
})
```

### E2E Testing Pattern
```typescript
test('User flow description', async ({ page }) => {
  // Navigate to page
  await page.goto('/admin/characters')
  
  // Perform actions
  await page.click('text=Add Character')
  await page.fill('input[name="name"]', 'Test Character')
  await page.click('text=Save')
  
  // Verify results
  await expect(page.locator('text=Test Character')).toBeVisible()
})
```

## Coverage Goals

- **API Routes**: 100% line coverage
- **Components**: 90%+ line coverage
- **Integration**: All major user flows covered
- **Edge Cases**: Error handling and validation

## Continuous Integration

Tests are designed to run in CI environments:
- All dependencies mocked appropriately
- No external service dependencies
- Deterministic test results
- Parallel execution support

## Best Practices

1. **Test Structure**: Follow AAA pattern (Arrange, Act, Assert)
2. **Test Names**: Descriptive names explaining what is being tested
3. **Mocking**: Mock external dependencies, not internal logic
4. **Assertions**: Specific assertions, avoid overly broad matchers
5. **Data**: Use realistic test data that reflects actual usage
6. **Cleanup**: Proper test cleanup to avoid test pollution
7. **Performance**: Keep tests fast and focused

## Troubleshooting

### Common Issues
- **Module not found**: Check Jest module name mapping
- **Async tests timing out**: Ensure proper await usage
- **Mocks not working**: Verify mock placement and imports
- **E2E tests flaky**: Add proper waits and selectors

### Debug Commands
```bash
# Debug specific test file
npm run test -- --verbose CharacterManager.test.tsx

# Debug with coverage
npm run test:coverage -- --verbose

# Debug E2E test
npx playwright test --debug character-lifecycle.spec.ts
```

This comprehensive testing setup ensures reliability, maintainability, and confidence in the character management system.
