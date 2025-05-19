# Cat Weight Tracker

A simple application to track your cat's weight over time.

## Features

- Record your cat's weight by weighing yourself with and without your cat
- Track multiple cats
- View weight trends over time
- Visualize weight progress towards target weight

## Local Development

### Prerequisites

- Docker and Docker Compose
- Task (optional, for running task commands)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/cat-weight-tracker.git
cd cat-weight-tracker
```

2. Start the application:

```bash
# Using task (recommended)
task launch

# Or using docker-compose directly
docker-compose up -d
```

3. Access the application:
   - Frontend: http://localhost
   - API: http://localhost:4000

### Development Mode

For development with hot-reloading:

```bash
task launch ENV=dev

# Frontend will be available at http://localhost:3000
# Backend will be available at http://localhost:4000
```

## Kubernetes Deployment with ArgoCD

### Prerequisites

- Kubernetes cluster
- ArgoCD installed in the cluster
- GitHub Container Registry access

### Deployment Steps

1. Update the repository URL in `k8s/argocd-app.yaml` to point to your GitHub repository.

2. Build and push Docker images:

```bash
# Manually
task build-images
task push-images

# Or let GitHub Actions handle it by pushing to main branch
git push origin main
```

3. Deploy the application using ArgoCD:

```bash
# Apply the ArgoCD Application manifest
task argocd-deploy
```

4. ArgoCD will automatically sync the application from the Git repository.

### Kubernetes Resources

- Namespace: `cat-weight-tracker`
- Deployments: `frontend`, `backend`, `postgres`
- Services: `frontend`, `backend`, `postgres`
- Ingress: Routes traffic to frontend and backend services

## Development

### Running Tests

```bash
task test
```

### Linting

```bash
task lint
```

### Database Operations

```bash
# Run migrations
task db OP=migrate

# Reset database
task db OP=reset
```

### Backup and Restore

```bash
# Backup database
task backup

# Restore from backup
task restore BACKUP=./backups/filename.sql
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.