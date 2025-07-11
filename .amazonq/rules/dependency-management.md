# Dependency Management Rules

## No Package Overrides

- Do not use package overrides in package.json
- Always add direct dependencies with explicit versions
- Address security vulnerabilities by updating the affected packages directly
- If a package has a security vulnerability, update it or replace it with a secure alternative

## Best Practices

- Keep dependencies up to date
- Use exact versions (e.g., "5.2.1" instead of "^5.2.1") for critical dependencies
- Document dependency changes in commit messages
- Run security audits regularly