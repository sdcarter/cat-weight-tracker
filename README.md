# Cat Weight Tracker

A web application for tracking your cat's weight over time.

## Features

- User authentication (login/register)
- User profile management
- Cat management (add, edit, delete)
- Weight tracking with charts
- Responsive design
- Atlassian MCP server integration for project management

## Environment Variables

### Backend

- `DATABASE_URL`: PostgreSQL connection string
- `SECRET_KEY`: Secret key for JWT token generation
- `ALGORITHM`: Algorithm for JWT token (default: HS256)
- `ACCESS_TOKEN_EXPIRE_MINUTES`: JWT token expiration time in minutes
- `REGISTRATION_ENABLED`: Feature flag to enable/disable user registration (true/false)

## Development

### Prerequisites

- Docker and Docker Compose
- Node.js and npm (for local frontend development)
- Python 3.9+ (for local backend development)

### Running with Docker Compose

```bash
# Development mode
docker-compose -f docker-compose.dev.yml up

# Production mode
docker-compose up
```

### Local Development

#### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 4000
```

#### Frontend

```bash
cd frontend
npm install
npm start
```

## Task-based Workflow

This project uses [Task](https://taskfile.dev) for managing development workflows. Tasks are organized by component:

### Main Tasks

```bash
# Start the application
task launch [ENV=dev|prod]

# Stop the application
task stop [ENV=dev|prod]

# Run all tests
task test

# Run all linting
task lint
```

### Component-specific Tasks

```bash
# Frontend tasks
task frontend:test
task frontend:lint
task frontend:lint-fix
task frontend:shell

# Backend tasks
task backend:test [ARGS="specific_test.py"]
task backend:lint
task backend:shell
task backend:db:migrate
task backend:db:reset

# Database tasks
task db:backup
task db:restore BACKUP=./backups/filename.sql
```

## MCP Integration

This project includes Atlassian MCP server for managing issues and stories.

### Managing MCP Server

```bash
# Start MCP server
task mcp:start

# Check MCP server status
task mcp:status

# Stop MCP server
task mcp:stop
```

### MCP Server URL

- Atlassian MCP: http://localhost:9000

### VS Code Integration

Install the recommended extensions:
- Atlassian Jira (atlascode)
- REST Client (rest-client)

Use the `.vscode/mcp.rest` file to interact with the MCP server via REST API.

## License

MIT