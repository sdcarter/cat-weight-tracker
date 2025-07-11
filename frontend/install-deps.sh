#!/bin/sh
# Alternative installation script that uses a more memory-efficient approach

# Install only production dependencies first
echo "Installing production dependencies..."
npm install --only=production --no-fund --no-audit

# Then install dev dependencies one by one to avoid memory spikes
echo "Installing dev dependencies one by one..."
devDeps=$(node -e "console.log(Object.keys(require('./package.json').devDependencies).join(' '))")

for pkg in $devDeps; do
  echo "Installing $pkg..."
  npm install --no-save --no-fund --no-audit "$pkg"
done

echo "All dependencies installed!"