#!/bin/bash

echo "Pulling required Docker images..."
docker pull postgres:15
docker pull node:18-alpine
docker pull nginx:alpine
docker pull python:3.11-slim

echo "Starting Cat Weight Tracker application..."
echo "Building and starting containers..."
docker-compose up --build -d

echo "Waiting for services to be ready..."
sleep 10

echo "Checking if backend is running..."
curl -s http://localhost:4000/cats/ > /dev/null
if [ $? -eq 0 ]; then
  echo "Backend is running successfully!"
else
  echo "Backend might not be ready yet. Check logs with: docker-compose logs backend"
fi

echo "Application should be available at http://localhost"
echo "To view logs: docker-compose logs -f"