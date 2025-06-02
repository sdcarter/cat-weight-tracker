# Amazon Q Integration

This directory contains configuration files for Amazon Q integration with the Cat Weight Tracker project. These files help ensure consistent AI assistance across the team.

## Directory Structure

- **prompts/**: Contains saved prompts that can be referenced using `@prompt` syntax
- **rules/**: Contains package-level rules that are automatically applied to all Amazon Q interactions

## Using Prompts

To use a saved prompt in your Amazon Q conversation, reference it with the `@prompt` syntax:

```
@cat-weight-tracker-assistant
```

This will include the prompt's context in your conversation with Amazon Q.

Available prompts:
- `cat-weight-tracker-assistant`: General assistant for the Cat Weight Tracker application
- `backend-dev`: Specialized prompt for backend development tasks
- `frontend-dev`: Specialized prompt for frontend development tasks

## Rules

Rules in the `rules/` directory are automatically applied to all Amazon Q interactions with this repository. They provide consistent context and guidelines without needing to explicitly reference them.

Available rules:
- `code-style`: Enforces coding style guidelines for the project
- `project-context`: Provides essential project context for all interactions

## Best Practices

1. **Use specific prompts** for specialized tasks (backend development, frontend development)
2. **Create new prompts** for recurring tasks or specific areas of the codebase
3. **Update prompts and rules** as the project evolves
4. **Reference the repository structure** in prompts to help Amazon Q understand the codebase

## Adding to Version Control

Make sure to commit the `.amazonq` directory to your repository so that all team members can benefit from the same prompts and rules.