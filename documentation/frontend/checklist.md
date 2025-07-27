# Documentation Checklist

## Overview

This checklist ensures that frontend documentation contributions are complete, consistent, and valuable to other developers. Use this guide when adding new documentation or updating existing content.

## Pre-Contribution Checklist

### 🔍 Research and Planning
- [ ] Reviewed existing documentation to avoid duplication
- [ ] Identified the target audience (new developers, experienced team members, etc.)
- [ ] Determined which documentation file(s) need updates
- [ ] Gathered relevant code examples and use cases
- [ ] Checked current implementation in the codebase

### 📝 Content Requirements

#### For New Patterns/Components
- [ ] **Purpose**: Clear explanation of what the pattern/component does
- [ ] **When to Use**: Specific use cases and scenarios
- [ ] **Code Example**: Working code snippet with proper imports
- [ ] **Props/Parameters**: Complete interface definitions
- [ ] **Best Practices**: Do's and don'ts for implementation
- [ ] **Testing**: Examples of how to test the pattern/component
- [ ] **Accessibility**: Any accessibility considerations

#### For Process Documentation
- [ ] **Step-by-step Instructions**: Clear, numbered steps
- [ ] **Prerequisites**: What developers need before starting
- [ ] **Expected Outcomes**: What success looks like
- [ ] **Troubleshooting**: Common issues and solutions
- [ ] **Related Resources**: Links to relevant documentation

#### For Architecture/Design Decisions
- [ ] **Context**: Why this decision was needed
- [ ] **Options Considered**: Alternative approaches evaluated
- [ ] **Decision Rationale**: Why this option was chosen
- [ ] **Implementation Details**: How to implement the decision
- [ ] **Trade-offs**: Benefits and drawbacks
- [ ] **Future Considerations**: Potential evolution or migration paths

## Content Quality Standards

### ✅ Writing Guidelines
- [ ] **Clear and Concise**: Avoid unnecessary jargon or complexity
- [ ] **Action-Oriented**: Use active voice and imperative mood
- [ ] **Consistent Terminology**: Use established project vocabulary
- [ ] **Proper Grammar**: Proofread for spelling and grammar errors
- [ ] **Logical Structure**: Information flows logically with proper headings

### 💻 Code Examples
- [ ] **Syntactically Correct**: All code compiles/runs without errors
- [ ] **Complete Examples**: Include necessary imports and context
- [ ] **TypeScript Types**: Include proper type annotations
- [ ] **Comments**: Explain complex or non-obvious code
- [ ] **Consistent Formatting**: Follow project code style guidelines
- [ ] **Realistic Examples**: Use meaningful variable names and scenarios

### 🔗 Links and References
- [ ] **Internal Links**: Use relative paths for internal documentation
- [ ] **External Links**: Verify links work and are relevant
- [ ] **Code References**: Link to actual implementation when helpful
- [ ] **Version Specific**: Note if information applies to specific versions

## File-Specific Guidelines

### README.md Updates
When updating the main README:
- [ ] Update the folder map if new files are added
- [ ] Update technology stack if dependencies change
- [ ] Refresh the quick navigation section
- [ ] Update the "Last updated" date

### style-guide.md Updates
When adding style guidelines:
- [ ] Include both "good" and "bad" examples
- [ ] Explain the reasoning behind the guideline
- [ ] Add ESLint rule references where applicable
- [ ] Update the table of contents if adding major sections

### components.md Updates
When documenting components:
- [ ] Follow the established component structure template
- [ ] Include Storybook story examples where applicable
- [ ] Document all props with types and descriptions
- [ ] Add testing examples specific to the component

### navigation.md Updates
When documenting navigation patterns:
- [ ] Include URL structure examples
- [ ] Show both Link component and programmatic navigation
- [ ] Document any middleware or guard implications
- [ ] Add accessibility considerations

### background.md Updates
When adding architectural decisions:
- [ ] Follow the ADR (Architecture Decision Record) format
- [ ] Include alternatives considered
- [ ] Update the decision log with a new ADR number
- [ ] Consider impact on existing patterns

## Review Process

### Self-Review Checklist
- [ ] **Accuracy**: Information is correct and up-to-date
- [ ] **Completeness**: All required sections are included
- [ ] **Clarity**: A new developer could follow the documentation
- [ ] **Examples Work**: All code examples have been tested
- [ ] **Links Function**: All links lead to valid destinations
- [ ] **Formatting**: Markdown is properly formatted
- [ ] **Consistency**: Style matches existing documentation

### Peer Review Guidelines
When reviewing documentation contributions:
- [ ] **Technical Accuracy**: Verify code examples and technical details
- [ ] **Clarity**: Can you understand and follow the documentation?
- [ ] **Completeness**: Are there missing pieces or unclear sections?
- [ ] **Consistency**: Does it match the established style and structure?
- [ ] **Value**: Will this help other developers?

## Maintenance Checklist

### Quarterly Review
Every three months, review documentation for:
- [ ] **Outdated Information**: Update deprecated patterns or APIs
- [ ] **Broken Links**: Check and fix any broken internal/external links
- [ ] **Missing Content**: Identify gaps in documentation coverage
- [ ] **Usage Analytics**: Remove or update rarely used patterns
- [ ] **Team Feedback**: Incorporate suggestions from team retrospectives

### After Major Changes
When significant codebase changes occur:
- [ ] **Update Examples**: Ensure code examples reflect current implementation
- [ ] **Revise Guidelines**: Update standards if new patterns are adopted
- [ ] **Check Consistency**: Verify documentation aligns with actual code
- [ ] **Update Dependencies**: Reflect changes in technology stack
- [ ] **Revise Architecture**: Update background documentation for new decisions

## Templates and Snippets

### New Component Documentation Template
```markdown
## ComponentName

### Purpose
Brief description of what the component does.

### When to Use
- Specific use case 1
- Specific use case 2

### Basic Usage
```typescript
import { ComponentName } from '@/components';

const Example = () => {
  return <ComponentName prop="value" />;
};
```

### Props
```typescript
interface ComponentNameProps {
  prop: string;
  optionalProp?: boolean;
}
```

### Best Practices
- Do: [Best practice with explanation]
- Don't: [Anti-pattern with explanation]

### Testing
```typescript
// Test example
```
```

### New Pattern Documentation Template
```markdown
## Pattern Name

### Overview
Brief description of the pattern.

### Problem
What problem does this pattern solve?

### Solution
How does the pattern address the problem?

### Implementation
```typescript
// Code example
```

### Considerations
- Benefits: [List benefits]
- Trade-offs: [List trade-offs]
- When to use: [Guidelines for usage]
```

## Quick Reference

### Documentation File Purposes
- **README.md**: Overview, navigation, and getting started
- **style-guide.md**: Coding standards and best practices
- **components.md**: Component patterns and architecture
- **navigation.md**: Routing and navigation patterns
- **background.md**: Architectural decisions and context
- **changelog.md**: History of documentation changes
- **checklist.md**: This file - contribution guidelines

### Common Markdown Patterns
```markdown
# Main Title (H1)
## Section Title (H2)
### Subsection Title (H3)

**Bold text** for emphasis
*Italic text* for subtle emphasis
`inline code` for code references
[Link text](./relative-link.md) for internal links
[External link](https://example.com) for external links

```typescript
// Code block with syntax highlighting
const example = 'code';
```

> Quote blocks for important notes

- [ ] Checkbox for task lists
```

---

*Use this checklist to ensure high-quality, consistent documentation contributions. Update the checklist itself as documentation processes evolve.*
