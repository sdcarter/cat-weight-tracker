#!/bin/bash

# Local CI Test Script - Matches GitHub Actions exactly
# Run this locally to test what will happen in CI

set -e  # Exit on any error

echo "🧪 Running Local CI Tests (GitHub Actions Parity)"
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_step() {
    echo -e "${BLUE}📋 $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Cleanup function
cleanup() {
    print_step "Cleaning up..."
    task clean || true
    task stop ENV=dev || true
    docker-compose -f docker-compose.dev.yml down -v || true
}

# Set trap to cleanup on exit
trap cleanup EXIT

# Step 1: Environment Setup
print_step "Setting up environment..."
if [ ! -f .env ]; then
    if [ -f .env.example ]; then
        cp .env.example .env
    else
        echo "SECRET_KEY=test-secret-key" > .env
    fi
fi

# Add required environment variables
echo "ALGORITHM=HS256" >> .env
echo "ACCESS_TOKEN_EXPIRE_MINUTES=30" >> .env
echo "REGISTRATION_ENABLED=false" >> .env
echo "DB_USER=postgres" >> .env
echo "DB_PASSWORD=postgres" >> .env
echo "DB_HOST=db" >> .env
echo "DB_PORT=5432" >> .env
echo "DB_NAME=cat_weight_tracker_test" >> .env

print_success "Environment configured"

# Step 2: Frontend Quality Checks
print_step "Running Frontend Quality Checks..."

print_step "Building and starting services..."
docker-compose -f docker-compose.dev.yml up -d --build
sleep 30

print_step "Running frontend type checking..."
if task frontend:type-check; then
    print_success "Type checking passed"
else
    print_error "Type checking failed"
    exit 1
fi

print_step "Running frontend linting..."
if task frontend:lint; then
    print_success "Frontend linting passed"
else
    print_error "Frontend linting failed"
    exit 1
fi

print_step "Running frontend format check..."
if docker-compose -f docker-compose.dev.yml run --rm frontend npm run format:check; then
    print_success "Format check passed"
else
    print_error "Format check failed"
    exit 1
fi

print_step "Running frontend full check..."
if docker-compose -f docker-compose.dev.yml run --rm frontend npm run check; then
    print_success "Full check passed"
else
    print_error "Full check failed"
    exit 1
fi

print_step "Running frontend tests with coverage..."
if docker-compose -f docker-compose.dev.yml run --rm frontend npm run test:coverage; then
    print_success "Frontend tests passed"
else
    print_error "Frontend tests failed"
    exit 1
fi

print_step "Building frontend application..."
if task frontend:build; then
    print_success "Frontend build passed"
else
    print_error "Frontend build failed"
    exit 1
fi

# Step 3: Backend Quality Checks
print_step "Running Backend Quality Checks..."

print_step "Running backend linting..."
if task backend:lint; then
    print_success "Backend linting passed"
else
    print_error "Backend linting failed"
    exit 1
fi

print_step "Running backend tests with coverage..."
if task backend:test ARGS="--cov=app --cov-report=xml --cov-report=html"; then
    print_success "Backend tests passed"
else
    print_error "Backend tests failed"
    exit 1
fi

# Step 4: Security Scanning
print_step "Running Security Scanning..."
if task security; then
    print_success "Security audit passed"
else
    print_warning "Security audit had warnings (non-blocking)"
fi

# Step 5: Integration Tests
print_step "Running Integration Tests..."

print_step "Restarting services for integration tests..."
task stop ENV=dev || true
task launch ENV=dev
sleep 30

print_step "Testing service health..."
timeout 60 bash -c 'until curl -f http://localhost:4000/; do sleep 2; done' || {
    print_error "Backend service not responding"
    exit 1
}

timeout 60 bash -c 'until curl -f http://localhost:3000/; do sleep 2; done' || {
    print_error "Frontend service not responding"
    exit 1
}

print_step "Running API integration tests..."
if curl -f http://localhost:4000/auth/registration-status; then
    print_success "API integration tests passed"
else
    print_error "API integration tests failed"
    exit 1
fi

# Step 6: Unified Tests (exactly like local)
print_step "Running Unified Tests (Local Parity)..."

print_step "Running all tests (exactly like local)..."
if task test ENV=dev; then
    print_success "All tests passed"
else
    print_error "Some tests failed"
    exit 1
fi

print_step "Running all linting (exactly like local)..."
if task lint ENV=dev; then
    print_success "All linting passed"
else
    print_error "Linting failed"
    exit 1
fi

# Final Success
echo ""
echo "🎉 All CI tests passed locally!"
echo "✅ Your code should pass in GitHub Actions"
echo "🚀 Safe to push to GitHub"
echo ""
print_success "Local CI test completed successfully"
