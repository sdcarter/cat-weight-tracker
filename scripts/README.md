# Scripts Directory

This directory contains utility scripts for development and CI/CD.

## Available Scripts

### `test-ci-locally.sh`
Runs the complete CI test suite locally using the same container-based approach as GitHub Actions.

**Usage:**
```bash
# Run via Task (recommended)
task ci-test

# Or run directly
./scripts/test-ci-locally.sh
```

**What it does:**
- Sets up the same environment as GitHub Actions
- Runs all frontend quality checks (type checking, linting, formatting, tests)
- Runs all backend quality checks (linting, tests with coverage)
- Runs security audits
- Runs integration tests
- Runs unified tests (exactly matching local development)

**Benefits:**
- ✅ Test locally before pushing to GitHub
- ✅ Catch CI failures early
- ✅ Identical environment to GitHub Actions
- ✅ Container-based testing (matches production)

## Container-First Development

All scripts follow the container-first development approach:
- Use Docker containers for consistent environments
- Match production deployment patterns
- Avoid "works on my machine" issues
- Enable reproducible builds and tests

## Usage Tips

1. **Before pushing to GitHub:**
   ```bash
   task ci-test
   ```

2. **If CI test passes locally but fails in GitHub:**
   - Check the GitHub Actions logs
   - Ensure `.env.example` is up to date
   - Verify all required environment variables are set

3. **For debugging:**
   - The script provides colored output for easy reading
   - Failed steps will show clear error messages
   - Cleanup happens automatically on exit
