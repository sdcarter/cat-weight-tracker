# MANDATORY DEVELOPMENT RULES

## Container-First Development
- **ALL commands MUST be run from containers (Docker, Task, etc.)**
- **NEVER run commands directly on the host system**
- **Always use containerized environments for development/testing**

## Approved Command Methods
✅ **USE THESE:**
- `task <command>` (using Taskfile.yml)
- `docker run` or `docker-compose` commands
- Container-based CI/CD workflows
- Containerized development environments

❌ **NEVER USE:**
- Direct `npm`, `pip`, `python`, `pytest` commands on host
- Direct package manager commands on host system
- Host-based development tools

## Examples
```bash
# ✅ CORRECT - Using Task
task backend:test
task frontend:build

# ✅ CORRECT - Using Docker
docker run --rm -v $(pwd):/app python:3.11 pytest

# ❌ WRONG - Direct host commands
pytest
npm test
pip install
```

## Rationale
- Ensures consistent environments across all developers
- Prevents "works on my machine" issues
- Maintains clean host systems
- Matches production deployment patterns
- Enables reproducible builds and tests
