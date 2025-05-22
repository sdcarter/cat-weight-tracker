#!/bin/bash

# Check which MCP servers to start
if [ "$1" == "all" ] || [ "$1" == "jira" ] || [ -z "$1" ]; then
  echo "Starting Jira MCP server..."
  docker-compose -f docker-compose.jira.yml up -d
  echo "Jira is starting up at http://localhost:8080"
fi

if [ "$1" == "all" ] || [ "$1" == "github" ]; then
  echo "Starting GitHub MCP server..."
  docker-compose -f docker-compose.github.yml up -d
  echo "GitHub is starting up at http://localhost:8888"
  echo "Note: You'll need to replace the placeholder license key in docker-compose.github.yml"
fi

echo "MCP servers are starting. They may take a few minutes to be fully available."