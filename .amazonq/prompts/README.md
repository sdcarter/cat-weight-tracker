# Amazon Q Prompts

This directory contains saved prompts for Amazon Q to ensure consistent interactions across the team.

## How to Use

1. When chatting with Amazon Q in your IDE, reference these prompts using the `@prompt` syntax:
   ```
   @cat-weight-tracker-assistant
   ```

2. This will automatically include the prompt's context in your conversation with Amazon Q.

## Available Prompts

- `cat-weight-tracker-assistant.md`: General assistant for the Cat Weight Tracker application
- `backend-dev.md`: Specialized prompt for backend development tasks
- `frontend-dev.md`: Specialized prompt for frontend development tasks

## Creating New Prompts

Add new prompt files as Markdown (`.md`) files in this directory. The filename (without extension) will be the prompt name you reference with `@prompt`.