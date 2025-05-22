#!/bin/bash

echo "Starting Jira MCP server..."
docker-compose -f docker-compose.jira.yml up -d

echo "Jira is starting up. It may take a few minutes to be fully available."
echo "Access Jira at http://localhost:8080"
echo "Initial setup will require you to:"
echo "1. Complete the setup wizard"
echo "2. Enter your Atlassian license"
echo "3. Configure your project"

echo "To stop Jira, run: docker-compose -f docker-compose.jira.yml down"