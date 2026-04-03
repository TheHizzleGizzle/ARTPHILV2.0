```markdown
# ARTPHILV2.0 Development Patterns

> Auto-generated skill from repository analysis

## Overview
This skill teaches the core development patterns and conventions used in the ARTPHILV2.0 Python codebase. It covers file organization, code style, import/export practices, and testing patterns, providing a foundation for consistent contributions and maintenance.

## Coding Conventions

### File Naming
- Use **snake_case** for all Python file names.
  - Example: `data_loader.py`, `image_utils.py`

### Import Style
- Use **relative imports** within the package.
  - Example:
    ```python
    from .utils import process_image
    from ..models import ArtModel
    ```

### Export Style
- Use **named exports** (explicitly define what is exported).
  - Example:
    ```python
    __all__ = ['process_image', 'ArtModel']
    ```

### Commit Patterns
- Commit messages are freeform, typically around 65 characters.
  - Example: `Add preprocessing step for image normalization`

## Workflows

### Adding a New Module
**Trigger:** When you need to add new functionality as a separate module  
**Command:** `/add-module`

1. Create a new Python file using snake_case (e.g., `new_feature.py`).
2. Implement the required functions/classes.
3. Use relative imports to access shared utilities or models.
4. Define `__all__` to specify exported symbols.
5. Write corresponding tests in a `*.test.*` file.

### Writing and Running Tests
**Trigger:** When you add or modify code and need to verify correctness  
**Command:** `/run-tests`

1. Create a test file matching the pattern `*.test.*` (e.g., `utils.test.py`).
2. Write test functions for your code. (Testing framework is unknown; follow existing patterns.)
3. Run tests using the project's preferred method (consult project docs or maintainers).

## Testing Patterns

- Test files follow the pattern: `*.test.*` (e.g., `module.test.py`).
- The specific testing framework is unknown; review existing test files for structure.
- Place tests alongside or near the code they validate.

## Commands
| Command      | Purpose                                  |
|--------------|------------------------------------------|
| /add-module  | Scaffold a new module with conventions   |
| /run-tests   | Run all tests in the repository          |
```
