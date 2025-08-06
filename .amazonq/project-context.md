# Cat Weight Tracker - Project Context

## Project Overview
A modern web application for tracking cat weight and health metrics, built with Material 3 design system and modern development tools.

## Technology Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **UI Library**: Material UI v6 (Material 3 Design System)
- **Styling**: Material 3 theming with Emotion
- **Build Tool**: Vite 7
- **Linting & Formatting**: Biome (replacing ESLint)
- **Testing**: Vitest with React Testing Library
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Internationalization**: i18next

### Backend
- **Framework**: FastAPI (Python 3.11)
- **Database**: PostgreSQL 15
- **ORM**: SQLAlchemy with Alembic migrations
- **Authentication**: JWT with OAuth2
- **API Documentation**: OpenAPI/Swagger
- **Linting**: Flake8
- **Testing**: Pytest with async support

### Infrastructure
- **Containerization**: Docker & Docker Compose
- **Web Server**: Nginx (frontend proxy)
- **Database**: PostgreSQL with health checks
- **Environment**: Development with Docker

## Key Features
- User authentication and authorization
- Cat profile management
- Weight tracking with historical data
- Data visualization and progress charts
- Multi-language support
- Responsive Material 3 design
- RESTful API with OpenAPI documentation

## Development Workflow

### Code Quality
- **Frontend**: Biome for linting, formatting, and import organization
- **Backend**: Flake8 for Python linting
- **Type Safety**: TypeScript strict mode
- **Testing**: Comprehensive unit and integration tests
- **CI/CD**: GitHub Actions with quality gates

### Material 3 Design System
- **Color Palette**: Material 3 dynamic color system
- **Typography**: Roboto font with Material 3 scale
- **Components**: Cards, buttons, forms with Material 3 styling
- **Elevation**: Proper shadow system for depth
- **Shape**: Consistent border radius system
- **Icons**: Material Icons throughout

### API Design
- RESTful endpoints with proper HTTP methods
- JWT authentication with secure token handling
- Input validation with Pydantic models
- Error handling with structured responses
- Rate limiting and security middleware

## Project Structure

```
cat-weight-tracker/
├── frontend/                 # React + Material 3 frontend
│   ├── src/
│   │   ├── components/      # Material 3 React components
│   │   ├── pages/          # Route components
│   │   ├── services/       # API client and utilities
│   │   ├── theme/          # Material 3 theme configuration
│   │   ├── types/          # TypeScript type definitions
│   │   └── context/        # React context providers
│   ├── biome.json          # Biome configuration
│   └── package.json        # Dependencies and scripts
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── models/         # SQLAlchemy models
│   │   ├── schemas/        # Pydantic schemas
│   │   ├── crud/           # Database operations
│   │   ├── auth/           # Authentication logic
│   │   └── main.py         # FastAPI application
│   └── requirements.txt    # Python dependencies
├── .github/workflows/      # CI/CD pipelines
├── .amazonq/              # Amazon Q configuration
└── docker-compose.yml     # Development environment
```

## Development Commands

### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run Biome linting
npm run format       # Format code with Biome
npm run check        # Run all Biome checks
npm run type-check   # TypeScript type checking
npm run test         # Run tests
```

### Backend
```bash
uvicorn app.main:app --reload  # Start development server
pytest                         # Run tests
flake8 app/                   # Run linting
alembic upgrade head          # Run database migrations
```

### Docker
```bash
docker-compose up -d          # Start all services
docker-compose logs frontend  # View frontend logs
docker-compose logs backend   # View backend logs
```

## Key Design Decisions

### Material 3 Migration
- Migrated from Radix UI + Tailwind to Material UI v6
- Implemented Material 3 design tokens and theming
- Reduced bundle size from 5MB+ to 572KB
- Improved accessibility and user experience

### Biome Adoption
- Replaced ESLint + Prettier with Biome for better performance
- Unified linting, formatting, and import organization
- Faster CI/CD pipelines with single tool
- Better TypeScript integration

### Architecture Patterns
- Component composition over inheritance
- Custom hooks for state management
- Service layer for API interactions
- Context providers for global state
- Type-safe API client with proper error handling

## Security Considerations
- JWT token security with proper expiration
- Input validation on both frontend and backend
- Rate limiting to prevent abuse
- CORS configuration for cross-origin requests
- SQL injection prevention with ORM
- XSS protection with proper sanitization

## Performance Optimizations
- Code splitting with dynamic imports
- Lazy loading of components
- Efficient Material 3 theming
- Database indexing and query optimization
- Docker multi-stage builds
- Nginx caching and compression

## Testing Strategy
- Unit tests for components and utilities
- Integration tests for API endpoints
- End-to-end testing with Docker Compose
- Coverage reporting with Codecov
- Automated testing in CI/CD pipeline

## Deployment
- Docker containerization for consistency
- Environment-based configuration
- Health checks for all services
- Automated deployment pipeline
- Monitoring and logging setup
