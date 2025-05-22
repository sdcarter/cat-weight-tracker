#!/bin/bash

echo "Stopping Jira MCP server..."
docker-compose -f docker-compose.jira.yml down

echo "Jira server has been stopped."
echo "Your data is preserved in Docker volumes."