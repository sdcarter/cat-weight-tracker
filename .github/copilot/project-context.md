# Cat Weight Tracker Project Context

## Application Purpose

The Cat Weight Tracker is a full-stack application designed to help cat owners track their cats' weight over time. Key features include:

- Track multiple cats' weights over time
- Visualize weight trends with charts
- Manage cat profiles (add, edit, delete)
- User authentication and profile management

## Architecture

- RESTful API design
- Separation of concerns between models, schemas, and CRUD operations
- Component-based frontend architecture
- Context API for state management

## Development Practices

- All development work is done via Docker containers
- Never run pip, npm, pgsql or other package/dependency commands locally
- Always perform operations inside the development container
- Use Task-based workflows for common operations (task launch, task test, etc.)
- Follow SEMVER style commits (feat:, fix:, docs:, style:, refactor:, test:, chore:)
- Never use package overrides in package.json; always add direct dependencies

## Development Priorities

- Code quality and maintainability
- Test coverage
- Performance optimization
- Security best practices
- Accessibility

## Environment Setup

- All environment variables should be managed through `.env` files
- Container configuration should be done through docker-compose files
- Never hardcode environment-specific values in application code