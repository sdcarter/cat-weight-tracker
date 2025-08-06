# Code Style Guidelines

## Backend (Python)

- Follow PEP 8 style guidelines
- Maximum line length: 100 characters
- Use 4 spaces for indentation (no tabs)
- Use type hints for all function parameters and return values
- Use docstrings for all functions and classes
- Organize imports in the following order: standard library, third-party, local application
- Use snake_case for variables and function names
- Use PascalCase for class names
- Prefix private methods and variables with underscore (_)
- Avoid unused imports and variables
- Never use bare except clauses
- Always handle exceptions properly
- Avoid long lines by breaking up function signatures and long statements

## Frontend (TypeScript/React)

- Use TypeScript for all new components and files
- Maximum line length: 100 characters
- Use 2 spaces for indentation (no tabs)
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
- Write tests for new functionality
- Maintain high test coverage

## Git Commits

- Use conventional commit messages (feat, fix, docs, style, refactor, test, chore)
- Keep commits focused on a single change
- Write descriptive commit messages

## General Rules

- Never commit code with linting errors
- Run linting tools before submitting code:
  - For Python: `task backend:lint`
  - For TypeScript/JavaScript: `task frontend:lint`
- Fix linting issues with:
  - For Python: `task backend:lint-fix`
  - For TypeScript/JavaScript: `task frontend:lint-fix`
- Do not modify auto-generated files like migrations
- Keep functions and methods small and focused
- Use meaningful variable and function names
- Add comments for complex logic
- Always maintain consistency with the existing codebase when suggesting changes or additions