#!/bin/bash

echo "Pulling required Docker images..."
docker pull postgres:15
docker pull node:18-alpine
docker pull python:3.11-slim

echo "Starting Cat Weight Tracker in DEVELOPMENT mode..."
echo "Building and starting containers..."
docker-compose -f docker-compose.dev.yml up --build -d

echo "Waiting for services to be ready..."
sleep 10

echo "Checking if backend is running..."
curl -s http://localhost:4000/cats/ > /dev/null
if [ $? -eq 0 ]; then
  echo "Backend is running successfully!"
else
  echo "Backend might not be ready yet. Check logs with: docker-compose -f docker-compose.dev.yml logs backend"
fi

echo "Development server should be available at:"
echo "- Frontend: http://localhost:3000"
echo "- Backend API: http://localhost:4000"
echo "To view logs: docker-compose -f docker-compose.dev.yml logs -f"