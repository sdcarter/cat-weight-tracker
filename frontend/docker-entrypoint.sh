#!/bin/sh
# Check if node_modules exists and package.json has changed
if [ ! -d "node_modules" ] || [ ! -f "node_modules/.package.json.md5" ] || [ "$(md5sum package.json | cut -d' ' -f1)" != "$(cat node_modules/.package.json.md5)" ]; then
  echo "Installing dependencies..."
  npm install
  md5sum package.json | cut -d' ' -f1 > node_modules/.package.json.md5
else
  echo "Dependencies are up to date, skipping npm install"
fi

exec "$@"