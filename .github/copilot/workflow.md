# Development Workflow

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

## Common Tasks

### Starting the Application

```bash
# Development mode
task launch ENV=dev

# Production mode
task launch
```

### Stopping the Application

```bash
# Development mode
task stop ENV=dev

# Production mode
task stop
```

### Running Tests

```bash
# All tests
task test

# Frontend tests only
task frontend:test

# Backend tests only
task backend:test
```

### Linting

```bash
# All linting
task lint

# Fix linting issues
task lint-fix

# Frontend linting only
task frontend:lint

# Backend linting only
task backend:lint
```

### Accessing Shells

```bash
# Backend shell
task shell SERVICE=backend

# Frontend shell
task shell SERVICE=frontend

# Database shell
task shell SERVICE=db
```