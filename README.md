# Cat Weight Tracker

A web application for tracking your cat's weight over time.

## Features

- User authentication (login/register)
- User profile management
- Cat management (add, edit, delete)
- Weight tracking with charts
- Responsive design

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

## Deployment

The application can be deployed to Google Kubernetes Engine (GKE) using the GitHub Actions workflow.

## License

MIT