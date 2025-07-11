# Project Context

The Cat Weight Tracker is a full-stack application designed to help cat owners track their cats' weight over time. This context should be applied to all interactions with the codebase.

## Application Purpose

- Track multiple cats' weights over time
- Visualize weight trends with charts
- Manage cat profiles (add, edit, delete)
- User authentication and profile management

## Technical Stack

- **Frontend**: React, Vite, TypeScript, Tailwind CSS
- **Backend**: FastAPI, SQLAlchemy
- **Database**: PostgreSQL
- **Authentication**: JWT
- **Testing**: Vitest (frontend), pytest (backend)
- **Deployment**: Docker, Kubernetes

## Architecture

- RESTful API design
- Separation of concerns between models, schemas, and CRUD operations
- Component-based frontend architecture
- Context API for state management

## Development Priorities

- Code quality and maintainability
- Test coverage
- Performance optimization
- Security best practices
- Accessibility

## Development Practices

- All development work is done via Docker containers
- Never run pip, npm, pgsql or other package/dependency commands locally
- Always perform operations inside the development container
- Use Task-based workflows for common operations (task launch, task test, etc.)
- Follow SEMVER style commits (feat:, fix:, docs:, style:, refactor:, test:, chore:)
- Never use package overrides in package.json; always add direct dependencies

When suggesting changes or additions to the codebase, consider how they align with the existing architecture and development priorities.