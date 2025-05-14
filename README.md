# Cat Weight Tracker

A modern web application for tracking the weekly weight of cats, especially those needing to lose weight.

## Features

- Add, edit, and delete cats with target weights
- Record weekly weight measurements
- Calculate cat weight by subtracting user weight from combined weight
- Visualize weight changes over time with interactive charts
- Store historical weight data
- Modern UI with shadcn/ui and Tailwind CSS

## Technology Stack

- **Frontend**: React, shadcn/ui, Tailwind CSS, Plotly.js
- **Backend**: Python, FastAPI
- **Database**: PostgreSQL
- **Containerization**: Docker, Docker Compose
- **Database Migrations**: Alembic
- **Linting**: ESLint (frontend), Flake8 (backend)

## Getting Started

### Prerequisites

- Docker and Docker Compose
- Task (optional, for running tasks): https://taskfile.dev/

### Running the Application

#### Using Task (recommended)

```bash
# Launch in production mode
task launch

# Launch in development mode
task launch ENV=dev

# View logs
task logs FOLLOW=true

# Stop the application
task stop

# Run linting checks
task lint

# Run tests
task test

# Database operations
task db OP=migrate  # Run migrations
task db OP=reset    # Reset database

# Open a shell in a container
task shell SERVICE=backend
task shell SERVICE=frontend

# Create a new release
task release TYPE=patch  # For patch version (0.0.x)
task release TYPE=minor  # For minor version (0.x.0)
task release TYPE=major  # For major version (x.0.0)
```

#### Using Docker Compose directly

```bash
# Production mode
docker-compose up -d

# Development mode
docker-compose -f docker-compose.dev.yml up -d
```

## Development vs Production

### Production Mode
- Frontend served by Nginx on port 80
- Optimized React build
- Backend API on port 4000

### Development Mode
- Frontend React dev server with hot reloading on port 3000
- Backend with auto-reload on port 4000
- Code changes reflected immediately

## Project Structure

```
cat-weight-tracker/
├── backend/
│   ├── app/
│   │   ├── crud.py
│   │   ├── database.py
│   │   ├── main.py
│   │   ├── models.py
│   │   ├── plots.py
│   │   └── schemas.py
│   ├── migrations/
│   │   ├── versions/
│   │   ├── env.py
│   │   └── script.py.mako
│   ├── alembic.ini
│   ├── Dockerfile
│   ├── .flake8
│   └── requirements.txt
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── index.js
│   ├── Dockerfile
│   ├── Dockerfile.dev
│   ├── .eslintrc.json
│   ├── nginx.conf
│   └── package.json
├── docker-compose.yml
├── docker-compose.dev.yml
├── Taskfile.yml
└── README.md
```