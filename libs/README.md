# Libraries (`libs/`)

This directory contains all **reusable libraries** in the monorepo.

## Supported Library Types

- **UI Libraries**: Shared component libraries (React, Angular)
- **Networking Libraries**: HTTP clients, API wrappers, WebSocket utilities
- **Utility Libraries**: Common utilities, helpers, validators
- **Python Libraries**: Shared Python packages with Poetry/Uv
- **PHP Libraries**: Shared PHP packages with Composer
- **Native iOS Libraries**: Swift frameworks and static libraries
- **Native Android Libraries**: Kotlin/Java library modules

## Creating Libraries

Use the custom generator to create new libraries:

```bash
# JavaScript/TypeScript libraries
nx g create-lib my-ui-components --type=ui
nx g create-lib api-client --type=networking
nx g create-lib common-utils --type=utility

# Language-specific libraries
nx g create-lib data-processing --type=python
nx g create-lib auth-helpers --type=php
nx g create-lib core-ios --type=ios-native
nx g create-lib shared-android --type=android-native

# With additional options
nx g create-lib my-lib --type=ui --publishable --importPath=@terrible-lizard/my-lib
nx g create-lib my-lib --type=python --directory=shared/data
```

## Directory Structure

Libraries are organized by scope and functionality:
```
libs/
├── ui/
│   ├── components/           # Shared UI components
│   └── design-system/        # Design tokens, themes
├── shared/
│   ├── utilities/            # Common utilities
│   ├── networking/           # HTTP/API libraries
│   └── data-access/          # Data layer abstractions
├── mobile/
│   ├── ios-core/             # iOS shared functionality
│   └── android-core/         # Android shared functionality
└── backend/
    ├── php-common/           # PHP shared libraries
    └── python-common/        # Python shared libraries
```

## Library Tagging

Libraries are tagged for dependency management:

- `scope:shared` - Core utilities usable by any project
- `scope:frontend` - Frontend-specific libraries (web, mobile UI)
- `scope:backend` - Backend-specific libraries (APIs, services)
- `scope:mobile` - Mobile-specific libraries (iOS, Android)

## Key Principles

- **80/20 Rule**: Aim for 80% of code in libraries, 20% in applications
- **Public APIs**: Each library exports a clean, well-defined API via `index.ts`
- **Single Purpose**: Each library should have one clear responsibility
- **Framework Agnostic**: Where possible, libraries should not be tied to specific frameworks
- **Testable**: All libraries include comprehensive unit tests
- **Documentation**: Each library includes usage examples and API documentation 
