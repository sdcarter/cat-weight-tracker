#!/bin/bash

echo "Running frontend linting..."
docker-compose run --rm frontend npm run lint

echo "Running backend linting..."
docker-compose run --rm backend flake8

echo "Linting complete!"