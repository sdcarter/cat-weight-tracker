# Cat Weight Tracker

A modern web application for tracking your cat's weight over time with beautiful charts and user management.

## ✨ Features

- 🔐 **User Authentication** - Secure login/register system
- 👤 **Profile Management** - Update user information and preferences
- 🐱 **Cat Management** - Add, edit, and manage multiple cats
- 📊 **Weight Tracking** - Visual charts showing weight trends over time
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile
- 🌍 **Internationalization** - Multi-language support

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose
- Node.js 22+ and npm (for local development)
- Python 3.11+ (for local development)

### Run with Docker (Recommended)
```bash
# Development mode
docker-compose -f docker-compose.dev.yml up

# Production mode
docker-compose up
```

### Local Development
```bash
# Backend
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 4000

# Frontend
cd frontend
npm install
npm start
```

## 🛠️ Development Workflow

This project uses [Task](https://taskfile.dev) for streamlined development:

```bash
# Start application
task launch [ENV=dev|prod]

# Run all tests
task test

# Run all linting
task lint

# Comprehensive CI testing
task ci-test
```

### Component-Specific Commands
```bash
# Frontend
task frontend:test
task frontend:lint
task frontend:type-check

# Backend
task backend:test
task backend:lint
task backend:db:migrate

# Database
task db:backup
task db:restore BACKUP=./backups/filename.sql
```

## 🔧 Configuration

### Environment Variables
- `DATABASE_URL` - PostgreSQL connection string
- `SECRET_KEY` - JWT token secret key
- `ALGORITHM` - JWT algorithm (default: HS256)
- `ACCESS_TOKEN_EXPIRE_MINUTES` - Token expiration time
- `REGISTRATION_ENABLED` - Enable/disable user registration

## 🤖 AI Integration

### Amazon Q
Configured with project-specific prompts and rules in `.amazonq/`:
- Use `@cat-weight-tracker-assistant` for general help
- Use `@backend-dev` for backend development
- Use `@frontend-dev` for frontend development

### GitHub Copilot
Optimized instructions in `.github/copilot-instructions.md` for:
- Material 3 design patterns
- TypeScript best practices
- Testing patterns
- Code consistency

## 🧪 Testing

Comprehensive testing strategy with local and CI alignment:

```bash
# High-confidence local testing
task ci-test

# Quick development testing
task test
task lint
```

See [TESTING.md](TESTING.md) for detailed testing strategy.

## 📁 Project Structure

```
├── backend/           # FastAPI Python backend
├── frontend/          # React TypeScript frontend
├── .amazonq/          # Amazon Q integration
├── .github/           # GitHub Actions & Copilot config
├── scripts/           # Development scripts
├── k8s/              # Kubernetes manifests
└── db/               # Database scripts
```

## 🔒 Security

- JWT authentication with PyJWT and cryptography
- Password hashing with bcrypt
- SQL injection protection with SQLAlchemy
- CORS configuration for API security
- Regular dependency updates and vulnerability scanning

## 📄 License

MIT License - see LICENSE file for details.

---

**Built with ❤️ for cat lovers everywhere** 🐾
