# Quick Reference Guide

## Workspace Commands

### Core Nx Commands
```bash
# Build affected projects
pnpm run build
# or: nx affected:build

# Test affected projects  
pnpm run test
# or: nx affected:test

# Lint affected projects
pnpm run lint
# or: nx affected:lint

# View project graph
pnpm run graph
# or: nx graph

# View affected project graph
pnpm run affected:graph
# or: nx affected:graph

# Format code
pnpm run format
# or: nx format:write

# Check formatting
pnpm run format:check
# or: nx format:check
```

### Project Structure
```
terrible-lizard/
├── apps/           # Deployable applications
├── libs/           # Reusable libraries
├── tools/          # Custom Nx generators
├── docs/           # Documentation
├── config/         # Shared configurations
├── nx.json         # Nx workspace config
├── package.json    # Dependencies & scripts
├── pnpm-workspace.yaml  # pnpm workspace config
├── pnpm-lock.yaml  # pnpm lock file
├── tsconfig.base.json  # TypeScript base config
├── pyproject.toml  # Python config (Ruff, Pytest)
├── .php-cs-fixer.dist.php  # PHP formatting
├── .eslintrc.json  # JS/TS linting
├── .prettierrc     # Code formatting
└── .gitignore      # Git exclusions
```

## Configuration Files

### TypeScript Path Mappings
```json
{
  "@terrible-lizard/ui": ["libs/ui/src/index.ts"],
  "@terrible-lizard/networking": ["libs/networking/src/index.ts"],
  "@terrible-lizard/utilities": ["libs/utilities/src/index.ts"]
}
```

### Nx Tags and Scope Rules
- `scope:shared` - Can only depend on other shared libraries
- `scope:frontend` - Can depend on shared and frontend libraries
- `scope:backend` - Can depend on shared and backend libraries  
- `scope:mobile` - Can depend on shared and mobile libraries

### Installed Plugins
- `@nx/js` - JavaScript/TypeScript support
- `@nx/react` - React applications and libraries
- `@nx/angular` - Angular applications and libraries
- `@nx/next` - Next.js applications
- `@nx/nest` - NestJS applications
- `@nx/cypress` - Cypress E2E testing
- `@nx/playwright` - Playwright E2E testing
- `@nx/gradle` - Android/Gradle projects
- `@nxlv/python` - Python projects with Poetry/Uv
- `@nx/eslint` - ESLint integration
- `@nx/jest` - Jest testing

## Linting and Formatting

### JavaScript/TypeScript
```bash
# Lint specific project
nx lint my-project

# Format specific project
nx format:write --projects=my-project
```

### Python
```bash
# Lint with Ruff (from project directory)
ruff check .

# Format with Ruff
ruff format .

# Run tests with Pytest
pytest
```

### PHP
```bash
# Format with PHP CS Fixer (from project directory)  
php-cs-fixer fix

# Check formatting without changes
php-cs-fixer fix --dry-run --diff

# Run tests with PHPUnit
phpunit
```

## User Preferences Applied

### Code Style
- **Tab Width**: 4 spaces (configured in .prettierrc)
- **Unused Variables**: Warnings instead of errors (more forgiving during development)
- **Package Manager**: pnpm (optimized for monorepo performance)

### ESLint Configuration
- TypeScript: Warnings for unused vars, errors for prefer-const
- JavaScript: Warnings for unused vars, errors for no-var and prefer-const
- Module boundaries enforced based on scope tags

### Prettier Configuration
- Single quotes enabled
- 4-space tabs
- Trailing commas (ES5 style)
- Arrow parentheses always included

## Generator Development Patterns

### Custom Nx Generator Structure
```
tools/generators/
├── generators.json          # Generator registry
├── create-lib.ts           # Main generator logic
├── schema.json             # Parameter definitions
├── schema.d.ts             # TypeScript interfaces
└── files/                  # Template directories
    ├── common/             # Shared templates (README)
    ├── typescript/         # JS/TS templates
    ├── python/             # Python templates  
    ├── php/                # PHP templates
    ├── ios/                # iOS templates
    └── android/            # Android templates
```

### Template File Conventions
- **Extension**: Use `.template` (not `.ejs`) for template files
- **Variables**: Use EJS syntax `<%= variableName %>` (not `__variableName__`)
- **File Naming**: Use `__variableName__` in template file paths for dynamic naming
- **Directory Structure**: For mobile, create proper package paths (`com/terrible_lizard/__fileName__/`)

### Generator Implementation Patterns
```typescript
// Standard generator function structure
export async function myGenerator(tree: Tree, options: Schema) {
    const normalizedOptions = normalizeOptions(tree, options);
    
    // 1. Add Nx project configuration
    addProjectConfiguration(tree, normalizedOptions.projectName, {
        root: normalizedOptions.projectRoot,
        projectType: 'library',
        sourceRoot: `${normalizedOptions.projectRoot}/src`,
        tags: normalizedOptions.tags,
        targets: getTargetsForType(normalizedOptions.type),
    });
    
    // 2. Generate files from templates
    generateFiles(
        tree,
        path.join(__dirname, 'files', normalizedOptions.type),
        normalizedOptions.projectRoot,
        {
            ...normalizedOptions,
            // Add computed variables
            description: `${options.name} - Description`,
            packageName: computePackageName(options.name),
        }
    );
    
    // 3. Format and return
    await formatFiles(tree);
}
```

### Essential Variables for Templates
- **All Types**: `name`, `className`, `fileName`, `description`
- **Python**: `moduleName` (snake_case conversion)
- **PHP**: `namespace` (PascalCase conversion)
- **Android**: `packageName` (com.company.module_name)
- **iOS**: `bundleIdentifier` (com.company.module-name)

### Target Configuration by Language
```typescript
// TypeScript libraries
{
    build: { executor: '@nx/js:tsc' },
    test: { executor: '@nx/jest:jest' },
    lint: { executor: '@nx/eslint:lint' }
}

// Python libraries  
{
    build: { executor: 'nx:run-commands', command: 'poetry build' },
    test: { executor: 'nx:run-commands', command: 'poetry run pytest' },
    lint: { executor: 'nx:run-commands', command: 'poetry run ruff check' }
}

// PHP libraries
{
    test: { executor: 'nx:run-commands', command: 'composer exec phpunit' },
    lint: { executor: 'nx:run-commands', command: 'composer exec php-cs-fixer fix --dry-run' }
}

// iOS libraries (requires Xcode)
{
    build: { executor: 'nx:run-commands', command: 'xcodebuild build ...' },
    test: { executor: 'nx:run-commands', command: 'xcodebuild test ...' }
}

// Android libraries
{
    build: { executor: '@nx/gradle:gradle', options: { task: 'assembleDebug' } },
    test: { executor: '@nx/gradle:gradle', options: { task: 'testDebugUnitTest' } }
}
```

### Testing Generators (Without Native Toolchains)
```bash
# Test generator creation
pnpm nx g @terrible-lizard/generators:create-lib test-lib --type=python

# Validate generated structure
ls -la libs/test-lib/

# Check template substitution
cat libs/test-lib/src/test_lib/test_lib.py

# Test TypeScript integration
pnpm nx test test-lib  # (for TS libraries)

# Clean up test
rm -rf libs/test-lib
```

### Common Gotchas
1. **Template Variables**: Must pass all referenced variables in `generateFiles` options
2. **File Paths**: Android/mobile templates need proper directory structure in `files/`
3. **Package Names**: Convert hyphens to underscores for Python/Android, maintain for others
4. **Native Toolchains**: iOS requires Xcode, Android requires SDK for actual building
5. **EJS Syntax**: Template files must use `<%= var %>` not `__var__` for substitution

### Generator Commands
```bash
# Generate library (all types supported)
nx g @terrible-lizard/generators:create-lib my-lib --type=python
nx g @terrible-lizard/generators:create-lib ui-components --type=ui  
nx g @terrible-lizard/generators:create-lib api-client --type=php
nx g @terrible-lizard/generators:create-lib ios-utils --type=ios-native
nx g @terrible-lizard/generators:create-lib android-utils --type=android-native

# Optional parameters
--tags=scope:shared,type:utility
--directory=mobile/ios
--importPath=@my-org/my-lib
```

## Next Phase Preparation

✅ **Phase 3 Complete**: Library scaffolding fully implemented

Ready for Phase 4 tasks:
- [ ] Create custom `create-app` generator for applications
- [ ] Support app types: `web`, `python`, `php`, `ios-native`, `android-native`  
- [ ] Implement framework selection (React, Angular, Flask, Django, etc.)
- [ ] Add Docker integration for web/backend applications
- [ ] Set up application templates with proper configurations
