# Code Style Enforcement Rules

When generating or modifying code for the Cat Weight Tracker application, strictly adhere to these style guidelines:

## Python Code Style

- Follow PEP 8 style guidelines
- Maximum line length: 100 characters
- Use 4 spaces for indentation (no tabs)
- Use proper docstrings for all functions, classes, and modules
- Organize imports in this order: standard library, third-party, local application
- Always include type hints for function parameters and return values
- Use snake_case for variables and function names
- Use PascalCase for class names
- Avoid unused imports and variables
- Never use bare except clauses
- Always handle exceptions properly
- Avoid long lines by breaking up function signatures and long statements

## TypeScript/JavaScript Code Style

- Maximum line length: 100 characters
- Use 2 spaces for indentation (no tabs)
- Use TypeScript for all new components and files
- Use proper type annotations for props, state, and function returns
- Use ES6+ syntax
- Use functional components with hooks instead of class components
- Use destructuring for props
- Use named exports instead of default exports when possible
- Use camelCase for variables and function names
- Use PascalCase for component names and interfaces
- Avoid using `any` type; use proper typing or `unknown` when necessary
- Follow the existing pattern for component structure

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
- Write tests for new functionality

By following these rules, we ensure consistent code quality and avoid accumulating technical debt through linting issues.