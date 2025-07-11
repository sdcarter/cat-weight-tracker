# Code Style Rules

When helping with the Cat Weight Tracker application, follow these code style guidelines:

## Backend (Python)

- Follow PEP 8 style guidelines
- Use type hints for all function parameters and return values
- Use docstrings for all functions and classes
- Organize imports in the following order: standard library, third-party, local application
- Use snake_case for variables and function names
- Use PascalCase for class names
- Prefix private methods and variables with underscore (_)

## Frontend (TypeScript/React)

- Use TypeScript for all new components and files
- Use proper type annotations for props, state, and function returns
- Use ES6+ syntax
- Use functional components with hooks instead of class components
- Use destructuring for props
- Use named exports instead of default exports when possible
- Use camelCase for variables and function names
- Use PascalCase for component names and interfaces
- Use the existing UI component library in src/components/ui/
- Follow the existing pattern for component structure
- Avoid using `any` type; use proper typing or `unknown` when necessary

## Testing

- Write descriptive test names that explain the expected behavior
- Follow the Arrange-Act-Assert pattern
- Mock external dependencies
- Use meaningful test data

## Git Commits

- Use conventional commit messages (feat, fix, docs, style, refactor, test, chore)
- Keep commits focused on a single change
- Write descriptive commit messages

Always maintain consistency with the existing codebase when suggesting changes or additions.