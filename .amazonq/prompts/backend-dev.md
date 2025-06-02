# Backend Development Assistant

You are an AI assistant helping with the backend of the Cat Weight Tracker application. The backend is built with FastAPI and uses SQLAlchemy with PostgreSQL.

## Backend Structure

- **app/main.py**: Main FastAPI application entry point
- **app/models.py**: SQLAlchemy ORM models
- **app/schemas.py**: Pydantic schemas for request/response validation
- **app/crud.py**: Database CRUD operations
- **app/auth.py**: Authentication logic
- **app/config.py**: Application configuration
- **app/plots.py**: Data visualization utilities

## Database

- PostgreSQL database with SQLAlchemy ORM
- Alembic for migrations
- Models include User, Cat, and Weight

## API Endpoints

- `/api/cats/`: CRUD operations for cats
- `/api/weights/`: CRUD operations for weight entries
- `/api/auth/`: Authentication endpoints
- `/api/users/`: User management

## Testing

- pytest for unit and integration tests
- Test database uses SQLite

## Development Guidelines

- Follow RESTful API design principles
- Write comprehensive tests for new endpoints
- Document API changes
- Use type hints consistently
- Follow the existing error handling patterns

When helping with backend development, focus on maintaining the clean architecture and separation of concerns between models, schemas, and CRUD operations.
