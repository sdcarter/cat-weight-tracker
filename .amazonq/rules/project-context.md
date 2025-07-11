# Project Context

The Cat Weight Tracker is a full-stack application designed to help cat owners track their cats' weight over time. This context should be applied to all interactions with the codebase.

## Application Purpose

- Track multiple cats' weights over time
- Visualize weight trends with charts
- Manage cat profiles (add, edit, delete)
- User authentication and profile management

## Technical Stack

- **Frontend**: React, Tailwind CSS
- **Backend**: FastAPI, SQLAlchemy
- **Database**: PostgreSQL
- **Authentication**: JWT
- **Testing**: Jest (frontend), pytest (backend)
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

- Everything is done via docker container
- Do not perform pip, npm, pgsql or other commands locally
- Perform all operations inside of a development container

When suggesting changes or additions to the codebase, consider how they align with the existing architecture and development priorities.