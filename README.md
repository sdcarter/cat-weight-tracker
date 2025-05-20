# Cat Weight Tracker

A web application for tracking cat weights over time.

## GCP Kubernetes Deployment

This application is deployed to a personal GCP Kubernetes cluster using GitHub Actions.

### Prerequisites

1. Install Google Cloud SDK:
   ```bash
   # For macOS
   brew install --cask google-cloud-sdk
   
   # Initialize
   gcloud init
   ```

2. Create a GCP project:
   ```bash
   gcloud projects create YOUR_PROJECT_ID
   gcloud config set project YOUR_PROJECT_ID
   ```

3. Enable required APIs:
   ```bash
   gcloud services enable container.googleapis.com
   ```

4. Create a small GKE cluster:
   ```bash
   gcloud container clusters create cat-weight-tracker \
     --num-nodes=1 \
     --machine-type=e2-small \
     --zone=us-central1-a
   ```

5. Create a service account for GitHub Actions:
   ```bash
   gcloud iam service-accounts create github-actions
   
   gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
     --member="serviceAccount:github-actions@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
     --role="roles/container.developer"
   
   gcloud iam service-accounts keys create key.json \
     --iam-account=github-actions@YOUR_PROJECT_ID.iam.gserviceaccount.com
   
   # Base64 encode the key file for GitHub secrets
   cat key.json | base64
   ```

6. Add the following secrets to your GitHub repository:
   - `GCP_PROJECT_ID`: Your GCP project ID
   - `GCP_SA_KEY`: The base64-encoded content of the key.json file
   - `GKE_CLUSTER_NAME`: The name of your GKE cluster (e.g., cat-weight-tracker)
   - `GKE_CLUSTER_LOCATION`: The zone of your GKE cluster (e.g., us-central1-a)

### Deployment Process

1. Push changes to the main branch
2. GitHub Actions will build and push Docker images to GitHub Container Registry
3. A second workflow will deploy the application to your GKE cluster

### Accessing the Application

After deployment, you can access the application using the external IP provided by GCP:

```bash
kubectl get ingress cat-weight-tracker-ingress -n cat-weight-tracker
```

## Local Development

To run the application locally:

```bash
docker-compose -f docker-compose.dev.yml up
```