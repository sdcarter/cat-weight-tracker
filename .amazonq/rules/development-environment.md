# Development Environment Rules

## Container-First Development

- All development must be performed inside Docker containers
- Never run package managers (npm, pip, etc.) directly on the host machine
- Use the provided development containers for all operations

## Command Execution

- Use `task` commands to interact with the application components
- When suggesting commands, always prefix with `task` rather than direct tool invocation
- Examples:
  - Use `task backend:test` instead of `pytest`
  - Use `task frontend:lint` instead of `npm run lint`
  - Use `task db:backup` instead of direct PostgreSQL commands

## Environment Setup

- All environment variables should be managed through `.env` files
- Container configuration should be done through docker-compose files
- Never hardcode environment-specific values in application code

## Workflow

- Use `task launch ENV=dev` to start the development environment
- Use `task stop ENV=dev` to stop the development environment
- Use `task test` to run all tests
- Use `task lint` to run all linting

When suggesting code changes or commands, always assume they will be executed within the appropriate container context.