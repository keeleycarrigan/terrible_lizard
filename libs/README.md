# Libraries (`libs/`)

This directory contains all **reusable libraries** in the monorepo.

## Supported Library Types

- **UI Libraries**: Shared component libraries (React, Angular) ✅ Ready
- **Networking Libraries**: HTTP clients, API wrappers, WebSocket utilities ✅ Ready
- **Utility Libraries**: Common utilities, helpers, validators ✅ Ready
- **Python Libraries**: Shared Python packages with Poetry ✅ Ready
- **PHP Libraries**: Shared PHP packages with Composer ✅ Ready
- **Native iOS Libraries**: Swift frameworks and static libraries ✅ Ready
- **Native Android Libraries**: Kotlin/Java library modules ✅ Ready

## Creating Libraries

Use the custom generator to create new libraries:

```bash
# JavaScript/TypeScript libraries
pnpm nx g @terrible-lizard/generators:create-lib my-ui-components --type=ui
pnpm nx g @terrible-lizard/generators:create-lib api-client --type=networking
pnpm nx g @terrible-lizard/generators:create-lib common-utils --type=utility

# Language-specific libraries
pnpm nx g @terrible-lizard/generators:create-lib data-processing --type=python
pnpm nx g @terrible-lizard/generators:create-lib auth-helpers --type=php
pnpm nx g @terrible-lizard/generators:create-lib core-ios --type=ios-native
pnpm nx g @terrible-lizard/generators:create-lib shared-android --type=android-native

# With additional options
pnpm nx g @terrible-lizard/generators:create-lib my-lib --type=ui --publishable --importPath=@terrible-lizard/my-lib
pnpm nx g @terrible-lizard/generators:create-lib my-lib --type=python --directory=data
```

## Library Features

### TypeScript Libraries
- **UI Libraries**: React/Angular components with Storybook support
- **Networking Libraries**: HTTP clients, WebSocket utilities, API wrappers
- **Utility Libraries**: Common helpers, validators, formatters
- Modern TypeScript with ESLint and Prettier
- Jest testing with high coverage requirements
- Build with Rollup/Vite for optimal bundling

### Python Libraries
- **Poetry** dependency management with `pyproject.toml`
- **High quality standards**: 90% test coverage requirement
- **Professional tooling**: pytest, ruff (linting), mypy (type checking), black (formatting)
- **Package mode**: Configured for reusable module development
- **Structured testing**: Comprehensive test suites with fixtures

### PHP Libraries
- **Composer** dependency management with PSR-4 autoloading
- **Professional tooling**: PHPUnit testing, PHP-CS-Fixer formatting
- **PSR compliance**: Following PHP standards for interoperability
- **High quality**: 85% test coverage requirement

### iOS Libraries (Swift)
- **Swift Package Manager** compatible
- **Modern Swift**: iOS 17.0+ with Swift 6.0 support
- **XCTest** framework for unit testing
- **SwiftLint** for code quality
- **Professional structure**: Clean API boundaries and documentation

### Android Libraries (Kotlin)
- **Gradle** build system with Kotlin DSL
- **Modern Android**: Target SDK 34+ with Kotlin support
- **JUnit** testing framework
- **Professional structure**: Clean module organization

## Directory Structure

Libraries are created in a flat structure for simplicity:
```
libs/
├── my-ui-components/         # TypeScript UI library
├── api-client/               # TypeScript networking library
├── common-utils/             # TypeScript utility library
├── data-processing/          # Python library
├── auth-helpers/             # PHP library
├── core-ios/                 # iOS Swift library
└── shared-android/           # Android Kotlin library
```

Each library contains:
```
my-library/
├── src/                      # Source code
├── tests/                    # Test files
├── project.json             # Nx configuration
├── package.json             # Dependencies (TypeScript)
├── pyproject.toml           # Dependencies (Python)
├── composer.json            # Dependencies (PHP)
└── README.md                # Library documentation
```

## Running Libraries

```bash
# All libraries support these commands:
pnpm nx build <lib-name>          # Build the library
pnpm nx test <lib-name>           # Run tests
pnpm nx lint <lib-name>           # Lint code

# Language-specific commands:
pnpm nx type-check <lib-name>     # TypeScript type checking
```

## Library Tagging

Libraries are automatically tagged based on type for dependency management:

- `type:ui` - UI component libraries
- `type:networking` - Networking and API libraries  
- `type:utility` - Utility and helper libraries
- `type:python` - Python libraries
- `type:php` - PHP libraries
- `type:ios-native` - iOS Swift libraries
- `type:android-native` - Android Kotlin libraries

## Key Principles

- **80/20 Rule**: Aim for 80% of code in libraries, 20% in applications
- **Public APIs**: Each library exports a clean, well-defined API
- **Single Purpose**: Each library should have one clear responsibility
- **Framework Agnostic**: Where possible, libraries should not be tied to specific frameworks
- **Testable**: All libraries include comprehensive unit tests with high coverage requirements
- **Documentation**: Each library includes usage examples and API documentation
- **Quality Standards**: High test coverage (85-90%) and consistent code formatting
