# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [v0.2.2] - 2025-05-14

### Changed
- Improved release process:
  - Integrated automated semantic versioning into Taskfile
  - Removed standalone release.sh script
  - Updated README with comprehensive documentation
  - Fixed Taskfile.yml structure and removed duplications


## [v0.2.1] - 2025-05-15

### Fixed
- Development environment improvements:
  - Fixed memory issues in frontend container by increasing memory limits and optimizing npm install process
  - Fixed CORS issues in development mode by adding localhost:3000 to allowed origins
  - Updated API_URL to use environment-specific endpoints
  - Fixed ESLint warnings in React components
  - Added memory-efficient dependency installation script

## [v0.2.0] - 2025-05-14

### Changed
- Major improvements to build process and application reliability:
- Fix CatForm tests to match actual button text
- Add database backup and restore functionality
- Implement security improvements (input validation, CORS, rate limiting)
- Optimize Docker build performance with .dockerignore and selective file copying
- Improve React build speed with environment-specific configurations
- Fix frontend build and Nginx configuration issues


## [v0.1.0] - 2023-11-15

### Added
- Initial release of Cat Weight Tracker
- Cat management (add, edit, delete cats)
- Weight recording functionality
- Weight visualization with charts
- Docker containerization
- Development and production environments
- Task-based workflow management