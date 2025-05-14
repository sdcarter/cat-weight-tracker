# Cat Weight Tracker

A modern web application for tracking the weekly weight of cats, especially those needing to lose weight.

## Features

- Add, edit, and delete cats with target weights
- Record weekly weight measurements using the "you + cat" weighing method
- Calculate cat weight automatically by subtracting user weight from combined weight
- Visualize weight changes over time with interactive charts
- Track progress toward target weight goals
- Store historical weight data
- Modern, responsive UI with shadcn/ui components and Tailwind CSS

## Technology Stack

- **Frontend**: React, shadcn/ui, Tailwind CSS, Plotly.js
- **Backend**: Python, FastAPI
- **Database**: PostgreSQL
- **Containerization**: Docker, Docker Compose
- **Database Migrations**: Alembic
- **Linting**: ESLint (frontend), Flake8 (backend)
- **Testing**: Jest (frontend), pytest (backend)

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

# Backup and restore database
task backup
task restore BACKUP=./backups/cat_weight_tracker_20250514_123455.sql
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
- API accessed through Nginx proxy at /api

### Development Mode
- Frontend React dev server with hot reloading on port 3000
- Backend with auto-reload on port 4000
- Direct API access at http://localhost:4000
- Code changes reflected immediately

## Versioning and Releases

This project uses automated semantic versioning based on [Conventional Commits](https://www.conventionalcommits.org/):

- Commit messages starting with `fix:` trigger a patch version bump
- Commit messages starting with `feat:` trigger a minor version bump
- Commit messages containing `BREAKING CHANGE:` or `!:` trigger a major version bump

To create a new release:
```bash
# Automatic version determination based on commit messages
task release

# Manual version specification
task release TYPE=patch MESSAGE='Fixed bug in weight calculation'
task release TYPE=minor MESSAGE='Added new chart visualization'
task release TYPE=major MESSAGE='Complete UI redesign'
```

All changes are documented in the [CHANGELOG.md](CHANGELOG.md) file.

## Project Structure

```
cat-weight-tracker/
├── backend/                # FastAPI backend
│   ├── app/
│   │   ├── crud.py         # Database operations
│   │   ├── database.py     # Database connection
│   │   ├── main.py         # API endpoints
│   │   ├── models.py       # SQLAlchemy models
│   │   ├── plots.py        # Chart data generation
│   │   └── schemas.py      # Pydantic schemas
│   ├── migrations/         # Alembic migrations
│   ├── tests/              # Backend tests
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/               # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── ui/         # UI components
│   │   │   ├── CatForm.jsx
│   │   │   ├── WeightChart.jsx
│   │   │   └── ...
│   │   ├── App.jsx         # Main application
│   │   └── index.js        # Entry point
│   ├── Dockerfile          # Production build
│   ├── Dockerfile.dev      # Development build
│   └── package.json
├── docker-compose.yml      # Production setup
├── docker-compose.dev.yml  # Development setup
├── Taskfile.yml           # Task runner configuration
├── CHANGELOG.md           # Release history
└── README.md
```

## Development Workflow

1. Run the application in development mode: `task launch ENV=dev`
2. Make changes to the code - they will be automatically reflected
3. Run tests to verify changes: `task test`
4. Run linting to ensure code quality: `task lint`
5. Commit changes using conventional commit format: `git commit -m "feat: add new feature"`
6. Create a release when ready: `task release`

## Database Backup and Restore

The application includes functionality to backup and restore the database:

```bash
# Create a backup
task backup

# Restore from a backup
task restore BACKUP=./backups/filename.sql
```

## Cleaning Up

To clean up development resources:

```bash
# Stop containers and remove volumes
task dev-clean

# Stop containers only
task stop ENV=dev
```