#!/bin/sh

# Debug - check if npm exists and where it is
which npm || echo "npm not found"
ls -la /usr/bin/npm || echo "npm not in /usr/bin"
ls -la /usr/local/bin/npm || echo "npm not in /usr/local/bin"
# Check if node_modules exists and package.json has changed
if [ ! -d "node_modules" ] || [ ! -f "node_modules/.package.json.md5" ] || [ "$(md5sum package.json | cut -d' ' -f1)" != "$(cat node_modules/.package.json.md5)" ]; then
  echo "Installing dependencies..."
  
  # Try the memory-efficient installation script if it exists
  if [ -f "install-deps.sh" ]; then
    echo "Using memory-efficient installation method..."
    chmod +x install-deps.sh
    ./install-deps.sh
  else
    # Fallback to standard npm ci with increased memory limit
    NODE_OPTIONS="--max-old-space-size=4096" /usr/local/bin/node /usr/local/lib/node_modules/npm/bin/npm-cli.js ci --no-fund --no-audit --production=false
  fi
  
  md5sum package.json | cut -d' ' -f1 > node_modules/.package.json.md5
else
  echo "Dependencies are up to date, skipping npm install"
fi

# If the command is npm, use node to run npm-cli.js directly
if [ "$1" = "npm" ]; then
  shift
  exec /usr/local/bin/node /usr/local/lib/node_modules/npm/bin/npm-cli.js "$@"
else
  exec "$@"
fi