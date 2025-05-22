#!/bin/bash

# Check which MCP servers to stop
if [ "$1" == "all" ] || [ "$1" == "jira" ] || [ -z "$1" ]; then
  echo "Stopping Jira MCP server..."
  docker-compose -f docker-compose.jira.yml down
fi

if [ "$1" == "all" ] || [ "$1" == "github" ]; then
  echo "Stopping GitHub MCP server..."
  docker-compose -f docker-compose.github.yml down
fi

echo "MCP servers have been stopped."
echo "Your data is preserved in Docker volumes."