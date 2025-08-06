# Dependency Management Guidelines

## Package Management Best Practices

### No Package Overrides
- Do not use package overrides in package.json
- Always add direct dependencies with explicit versions
- Address security vulnerabilities by updating the affected packages directly
- If a package has a security vulnerability, update it or replace it with a secure alternative

### Version Management
- Keep dependencies up to date
- Use exact versions (e.g., "5.2.1" instead of "^5.2.1") for critical dependencies
- Document dependency changes in commit messages
- Run security audits regularly

### Container-First Dependency Management
- Never run package managers (npm, pip, etc.) directly on the host machine
- Always install dependencies inside the appropriate container
- Use `task backend:shell` or `task frontend:shell` to access container environments
- Update requirements.txt and package.json files through container operations

### Security Practices
- Run `npm audit` and `pip-audit` regularly
- Address high and critical vulnerabilities promptly
- Use tools like Dependabot for automated dependency updates
- Review dependency licenses for compliance

### Documentation
- Document significant dependency changes in CHANGELOG.md
- Include rationale for major version updates
- Note any breaking changes that affect the application

## Python Dependencies (Backend)

### Core Dependencies
- FastAPI: Web framework
- SQLAlchemy: ORM
- Alembic: Database migrations
- Pydantic: Data validation
- python-jose: JWT handling
- passlib: Password hashing

### Development Dependencies
- pytest: Testing framework
- pytest-cov: Coverage reporting
- flake8: Linting
- black: Code formatting

## Node.js Dependencies (Frontend)

### Core Dependencies
- React: UI framework
- TypeScript: Type safety
- Vite: Build tool
- Tailwind CSS: Styling
- Axios: HTTP client
- React Router: Routing

### Development Dependencies
- Vitest: Testing framework
- ESLint: Linting
- Prettier: Code formatting
- @testing-library/react: Component testing utilities

## Dependency Update Workflow

1. Check for updates: `task deps:check`
2. Update in container: `task deps:update`
3. Test thoroughly: `task test`
4. Update documentation if needed
5. Commit with descriptive message: `feat: update dependencies for security fixes`
