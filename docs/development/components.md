# Components Documentation

## Overview

The component architecture in the Novel Worldbuilding Hub is structured to promote reusability, maintainability, and ease of integration. This document outlines the standards and best practices for developing and utilizing components within the application.

## Component Structure

Each component lives in its own directory and includes related files for logic, styles, and testing:

```
components/
└── ComponentName/
    ├── index.tsx        // Component logic
    ├── ComponentName.module.css // Component-specific styles (if any)
    ├── ComponentName.test.tsx   // Component tests
    └── ComponentName.stories.tsx // Storybook stories
```

## Component Types

### Dumb Components
- Stateless
- Primarily responsible for rendering UI
- Receive data via props
- Examples: Button, Avatar, Icon

### Smart Components
- Stateful
- Handle component-specific logic and side effects
- Often encapsulate both logic and dumb components
- Examples: UserProfileCard, DashboardWidget

## Props and State

### Props Best Practices
- **Required vs. Optional**: Clearly define required and optional props
- **Default Props**: Supply defaults for optional props when appropriate
- **Type Annotations**: Use TypeScript interfaces for props

```typescript
interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}
```

### Component State
- Use `useState()` for local state management
- Co-locate state logic using custom hooks where reusable
- Employ `useReducer()` for complex state management scenarios

## Component Patterns

### Controlled Components
- Use when external control over component state is required
- Component state is fully driven by props

```typescript
const InputField = ({ value, onChange }: InputFieldProps) => {
  return <input value={value} onChange={onChange} />;
};
```

### Higher-Order Components (HOCs)
- Use to add shared logic to multiple components
- Prefer React hooks over HOCs where possible

```typescript
function withLogging<T>(Component: React.ComponentType<T>) {
  return (props: T) => {
    useEffect(() => {
      console.log('Component mounted');
      return () => console.log('Component unmounted');
    }, []);
    return <Component {...props} />;
  };
}
```

### Render Props
- Use for cross-cutting concerns that require element configurations

```typescript
const DataProvider = ({ children }: DataProviderProps) => {
  const data = useDataFetch();
  return children(data);
};
```

## Best Practices

### Component Reusability
- Design components for reuse across pages and contexts
- Abstract common UI patterns into reusable components

### Accessibility
- Ensure components are accessible out-of-the-box
- Use semantic HTML and ARIA attributes where necessary

### Testing Components
- Test for rendering, interactions, and state changes
- Utilize React Testing Library and Jest for unit tests

```typescript
describe('Button Component', () => {
  it('renders with correct label', () => {
    const { getByText } = render(<Button label="Submit" onClick={() => {}} />);
    expect(getByText('Submit')).toBeTruthy();
  });

  it('handles click events', () => {
    const onClick = jest.fn();
    const { getByText } = render(<Button label="Submit" onClick={onClick} />);
    fireEvent.click(getByText('Submit'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
```

---

*This document is part of the living documentation series and should be updated with new component paradigms and patterns.*
