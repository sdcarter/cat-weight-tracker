#!/bin/bash

# Local CI Test Script - Tests what can be tested locally
# GitHub Actions uses native Node/Python, but we test with containers for consistency

set -e  # Exit on any error

echo "🧪 Running Local CI Tests (Container-based Development)"
echo "======================================================"
echo "ℹ️  Note: GitHub Actions uses native Node/Python for speed"
echo "ℹ️  But we test with containers locally for consistency"
echo ""

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

print_info() {
    echo -e "${YELLOW}ℹ️  $1${NC}"
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

# Step 2: Container-based Frontend Tests (Local Advantage)
print_step "Running Frontend Quality Checks (Container-based)..."
print_info "GitHub Actions uses native Node.js, but containers provide better consistency"

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

# Step 3: Container-based Backend Tests (Local Advantage)
print_step "Running Backend Quality Checks (Container-based)..."
print_info "GitHub Actions uses native Python, but containers provide better consistency"

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

# Step 5: Docker Integration Tests (Matches GitHub Actions)
print_step "Running Docker Integration Tests..."
print_info "This matches exactly what GitHub Actions does"

print_step "Stopping dev services and starting production-like services..."
task stop ENV=dev || true
sleep 5

print_step "Starting production-like services..."
docker-compose up -d --build
sleep 30

print_step "Testing service health..."
timeout 60 bash -c 'until curl -f http://localhost:80/api/; do sleep 2; done' || {
    print_error "Backend API not responding"
    exit 1
}

timeout 60 bash -c 'until curl -f http://localhost:80/; do sleep 2; done' || {
    print_error "Frontend not responding"
    exit 1
}

print_step "Running integration tests..."
if curl -f http://localhost:80/api/auth/registration-status; then
    print_success "Integration tests passed"
else
    print_error "Integration tests failed"
    exit 1
fi

print_step "Stopping production-like services..."
docker-compose down

# Step 6: Local Development Tests
print_step "Running Local Development Tests..."
print_info "Testing the commands you use daily"

print_step "Starting dev environment again..."
task launch ENV=dev
sleep 30

print_step "Running unified tests..."
if task test ENV=dev; then
    print_success "All unified tests passed"
else
    print_error "Some unified tests failed"
    exit 1
fi

print_step "Running unified linting..."
if task lint ENV=dev; then
    print_success "All unified linting passed"
else
    print_error "Unified linting failed"
    exit 1
fi

# Final Success
echo ""
echo "🎉 All local CI tests passed!"
echo ""
print_info "Environment Comparison:"
echo "  📦 Local: Container-based (more consistent)"
echo "  🚀 GitHub Actions: Native Node/Python (faster)"
echo "  🎯 Both: Same test commands and expectations"
echo ""
print_success "Your code should pass in GitHub Actions"
print_success "Local container testing provides extra confidence"
echo ""
echo "🚀 Safe to push to GitHub!"
