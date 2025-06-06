# Tools (`tools/`)

This directory contains **custom workspace tooling** and Nx generators.

## Purpose

The tools directory houses custom automation and code generation tools that help maintain consistency and developer productivity across the polyglot monorepo.

## Contents

### Custom Nx Generators (`generators/`)

- **`create-lib/`** - Universal library scaffolding generator
- **`create-app/`** - Universal application scaffolding generator  
- **`setup-docker/`** - Docker configuration generator
- **`init-workspace/`** - Workspace initialization utilities

### Scripts (`scripts/`)

- **`publish-python-lib.ts`** - Python library publishing automation
- **`publish-php-lib.ts`** - PHP library publishing automation
- **`validate-workspace.ts`** - Workspace validation utilities
- **`update-deps.ts`** - Dependency update automation

## Using Custom Generators

Once implemented, generators will be available as:

```bash
# Library generation
nx g create-lib my-library --type=ui
nx g create-lib my-python-lib --type=python

# Application generation  
nx g create-app my-app --type=web --framework=react
nx g create-app my-service --type=php --framework=symfony --docker

# Additional tooling
nx g setup-docker my-existing-app
```

## Generator Structure

Each custom generator follows the standard Nx pattern:

```
tools/generators/create-lib/
├── index.ts              # Main generator logic
├── schema.json          # Parameter definitions
├── schema.d.ts          # TypeScript interfaces
└── files/               # EJS templates
    ├── common/          # Shared templates
    ├── javascript/      # JS/TS specific
    ├── python/          # Python specific
    ├── php/             # PHP specific
    └── native/          # Mobile specific
```

## Development Guidelines

### Generator Development
- Use `@nx/devkit` APIs for consistency
- Include comprehensive error handling
- Provide clear user feedback
- Support dry-run mode for testing

### Template Management
- Use EJS for dynamic file generation
- Keep templates modular and reusable
- Include proper TypeScript types
- Follow language-specific best practices

### Testing
- Unit test all generator logic
- Integration test template generation
- Validate generated project structures
- Test across all supported platforms

## AI Integration

This tooling is designed to be maintained and extended by AI code generation, following the patterns established in the high-level architecture plan.

The AI should:
- Generate new templates as frameworks evolve
- Update generators when best practices change
- Maintain consistency across all project types
- Provide comprehensive error handling and user guidance 
