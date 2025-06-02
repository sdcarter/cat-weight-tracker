# Amazon Q Rules

This directory contains package-level rules for Amazon Q that are automatically added to the context of every chat and inline chat request.

## How Rules Work

Rules in this directory are automatically loaded by Amazon Q when interacting with this repository. They provide consistent context and guidelines for AI interactions without needing to explicitly reference them.

## Available Rules

- `code-style.md`: Enforces coding style guidelines for the project
- `project-context.md`: Provides essential project context for all interactions

## Creating New Rules

Add new rule files as Markdown (`.md`) files in this directory. All rules will be automatically applied to Amazon Q interactions.