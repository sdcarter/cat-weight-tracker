# Deployment Workflows

The deployment workflows have been temporarily disabled as the GKE cluster is being torn down. Local development will continue.

To re-enable the deployment process in the future:

1. Rename `.github/workflows/build-push.yml.disabled` to `.github/workflows/build-push.yml`
2. Rename `.github/workflows/deploy-to-gcp.yml.disabled` to `.github/workflows/deploy-to-gcp.yml`
3. Ensure all required secrets are configured in the GitHub repository

## Available Workflows

- `build-push.yml.disabled`: Builds and pushes Docker images to Docker Hub
- `deploy-to-gcp.yml.disabled`: Deploys the application to Google Kubernetes Engine