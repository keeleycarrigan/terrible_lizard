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

## Next Phase Preparation

Ready for Phase 3 tasks:
- [ ] Create custom `create-lib` generator in `tools/generators/`
- [ ] Support library types: `ui`, `networking`, `utility`, `python`, `php`, `ios-native`, `android-native`
- [ ] Set up EJS templates for each library type
- [ ] Implement shell command integration for package managers 
