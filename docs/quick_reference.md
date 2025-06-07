# Quick Reference - Polyglot Monorepo Generators

## AI-Friendly Command Mappings 🤖

This section maps natural language requests to specific commands for AI assistants:

### Mobile Development Intents
```yaml
# Intent: "start a new iOS project" / "create an iOS app" / "make an iOS application"
Command: pnpm nx g @terrible-lizard/generators:create-app {app-name} --type=ios-native --organizationIdentifier=com.company.{app-name-snake-case}
Default organizationIdentifier: com.terrible-lizard.{app-name-kebab-case-with-underscores}
Post-generation: open apps/{app-name}/{app-name}.xcodeproj
Prerequisites: macOS, Xcode installed, xcnew available (auto-installed)

# Intent: "create an Android app" / "start Android project"
Status: 🚧 Not yet implemented (coming in Phase 4.7.2)
Future Command: pnpm nx g @terrible-lizard/generators:create-app {app-name} --type=android-native --packageName=com.company.{app-name-snake-case}
```

### Web Development Intents  
```yaml
# Intent: "create a React app" / "start a React project" / "build a React frontend"
Command: pnpm nx g @terrible-lizard/generators:create-app {app-name} --framework=react --docker
Port: 3000
Features: Vite, TypeScript, Testing Library, Docker

# Intent: "create a Next.js app" / "start a Next.js project"
Command: pnpm nx g @terrible-lizard/generators:create-app {app-name} --framework=nextjs --docker
Port: 3000
Features: Next.js, TypeScript, SSR/SSG, Docker

# Intent: "create an API" / "build a REST API" / "start a backend"
Recommendation: pnpm nx g @terrible-lizard/generators:create-app {app-name} --framework=nestjs --docker
Alternative Python: pnpm nx g @terrible-lizard/generators:create-app {app-name} --framework=fastapi --docker
Alternative PHP: pnpm nx g @terrible-lizard/generators:create-app {app-name} --framework=symfony --docker
```

### Backend Development Intents
```yaml
# Intent: "create a Python API" / "build with FastAPI" / "start a Python backend"
FastAPI: pnpm nx g @terrible-lizard/generators:create-app {app-name} --framework=fastapi --docker
Port: 8002:8000
Features: Async, OpenAPI docs, PostgreSQL, pytest

Django: pnpm nx g @terrible-lizard/generators:create-app {app-name} --framework=django --docker  
Port: 8001:8000
Features: ORM, Admin interface, PostgreSQL, pytest

Flask: pnpm nx g @terrible-lizard/generators:create-app {app-name} --framework=flask --docker
Port: 5001:5000
Features: Lightweight, Blueprints, PostgreSQL, pytest

# Intent: "create a PHP API" / "build with Laravel" / "start a PHP backend"
Laravel: pnpm nx g @terrible-lizard/generators:create-app {app-name} --framework=laravel --docker
Port: 8004:80
Features: Eloquent ORM, Artisan, PostgreSQL, PHPUnit

Symfony: pnpm nx g @terrible-lizard/generators:create-app {app-name} --framework=symfony --docker
Port: 8003:80
Features: Doctrine ORM, Console, PostgreSQL, PHPUnit
```

### Library Development Intents
```yaml
# Intent: "create a shared library" / "build a utility library" / "make a component library"
UI Components: pnpm nx g @terrible-lizard/generators:create-lib {lib-name} --type=ui
Python Package: pnpm nx g @terrible-lizard/generators:create-lib {lib-name} --type=python
PHP Package: pnpm nx g @terrible-lizard/generators:create-lib {lib-name} --type=php
iOS Framework: pnpm nx g @terrible-lizard/generators:create-lib {lib-name} --type=ios-native
Utilities: pnpm nx g @terrible-lizard/generators:create-lib {lib-name} --type=utility
Networking: pnpm nx g @terrible-lizard/generators:create-lib {lib-name} --type=networking
```

### Parameter Decision Logic
```yaml
# If user doesn't specify app name:
Default Pattern: "my-{framework}-app" or "my-{type}-app"
Examples: my-react-app, my-ios-app, my-fastapi-app

# If user doesn't specify organizationIdentifier for iOS:
Default: com.terrible-lizard.{app-name-with-underscores}
Example: com.terrible-lizard.my_ios_app

# If user asks for "simple" or "basic" web app:
Command: pnpm nx g @terrible-lizard/generators:create-app {app-name} --framework=none --docker
Features: Static HTML/CSS/JS with nginx

# Docker default logic:
Web/Python/PHP apps: --docker (default: true)
iOS/Android apps: No Docker option
```

### Success Indicators
```yaml
# How to know the command worked:
iOS: "✅ iOS application created successfully!" + Xcode project exists
Web: "✅ Successfully created web application" + package.json exists  
Python: "✅ Successfully created python application" + pyproject.toml exists
PHP: "✅ Successfully created php application" + composer.json exists

# Next steps to suggest:
iOS: "Open in Xcode: open apps/{app-name}/{app-name}.xcodeproj"
Web/Backend: "Start development: pnpm nx serve {app-name}"
Library: "Build library: pnpm nx build {lib-name}"
```

## Generator Commands

### Library Creation
```bash
# Create TypeScript library
pnpm nx g @terrible-lizard/generators:create-lib ui-components --type=ui

# Create Python library  
pnpm nx g @terrible-lizard/generators:create-lib data-utils --type=python

# Create PHP library
pnpm nx g @terrible-lizard/generators:create-lib api-client --type=php

# Create iOS library
pnpm nx g @terrible-lizard/generators:create-lib ios-utils --type=ios-native

# Create Android library
pnpm nx g @terrible-lizard/generators:create-lib android-utils --type=android-native
```

### Application Creation
```bash
# Create React web app
pnpm nx g @terrible-lizard/generators:create-app dashboard --type=web --framework=react --docker

# Create basic web app (no framework)
pnpm nx g @terrible-lizard/generators:create-app landing-page --type=web --framework=none --docker

# Create Flask Python app
pnpm nx g @terrible-lizard/generators:create-app api-service --type=python --framework=flask --docker

# Create Next.js app
pnpm nx g @terrible-lizard/generators:create-app marketing-site --type=web --framework=nextjs --docker

# Create Symfony PHP app
pnpm nx g @terrible-lizard/generators:create-app api-backend --type=php --framework=symfony --docker

# iOS Native Applications ✅ NEW!
pnpm nx g @terrible-lizard/generators:create-app my-ios-app --type=ios-native --organizationIdentifier=com.company.app

# SIMPLIFIED Application Commands (Auto-detect type from framework) ⭐ RECOMMENDED
pnpm nx g @terrible-lizard/generators:create-app my-app --framework=react|angular|nextjs|nestjs --docker
pnpm nx g @terrible-lizard/generators:create-app my-app --framework=flask|django|fastapi|symfony|laravel --docker

# Legacy Explicit Commands (Still work for backwards compatibility)
pnpm nx g @terrible-lizard/generators:create-app my-app --type=web --framework=react|angular|nextjs|nestjs|none --docker
pnpm nx g @terrible-lizard/generators:create-app my-app --type=python --framework=flask|django|fastapi --docker
pnpm nx g @terrible-lizard/generators:create-app my-app --type=php --framework=symfony|laravel --docker
```

## Library Types

| Type | Description | Output Location | Key Features |
|------|-------------|-----------------|--------------|
| `ui` | TypeScript UI components | `libs/` | React components, Storybook |
| `networking` | Network utilities | `libs/` | HTTP clients, API wrappers |
| `utility` | General utilities | `libs/` | Helper functions, common logic |
| `python` | Python modules | `libs/` | Poetry, pytest, ruff, 90% coverage |
| `php` | PHP packages | `libs/` | Composer, PHPUnit, PSR-4 |
| `ios-native` | iOS frameworks | `libs/` | Swift, XCTest, CocoaPods ready |
| `android-native` | Android modules | `libs/` | Kotlin, JUnit, Gradle |

## Application Commands (Simplified - Auto-detects type from framework!)

### Web Applications (Auto-detected as `type=web`)
| Framework | Command | Features |
|-----------|---------|----------|
| `react` | `--framework=react` | Vite, TypeScript, Testing Library |
| `angular` | `--framework=angular` | Angular CLI, TypeScript, Karma |
| `nextjs` | `--framework=nextjs` | Next.js, TypeScript, SSR |
| `nestjs` | `--framework=nestjs` | NestJS, TypeScript, Backend API |

### Python Applications (Auto-detected as `type=python`)
| Framework | Command | Features |
|-----------|---------|----------|
| `flask` | `--framework=flask` | Flask, Docker, CORS, Blueprints |
| `django` | `--framework=django` | Django, ORM, Admin, 88% test coverage |
| `fastapi` | `--framework=fastapi` | FastAPI, async, OpenAPI, 80% test coverage |

### PHP Applications (Auto-detected as `type=php`)
| Framework | Command | Features |
|-----------|---------|----------|
| `symfony` | `--framework=symfony` | Symfony 7.0, Doctrine ORM, automatic schema, API |

### Legacy Explicit Commands (Still Supported)
```bash
# If you prefer explicit type specification (backwards compatible)
pnpm nx g @terrible-lizard/generators:create-app my-app --type=web --framework=react
pnpm nx g @terrible-lizard/generators:create-app my-app --type=python --framework=django

# For frameworks without auto-detection or basic apps
pnpm nx g @terrible-lizard/generators:create-app my-app --type=web --framework=none
```

### Native Mobile Applications ✅ NEW!
| Type | Command | Features | Status |
|------|---------|----------|---------|
| iOS | `--type=ios-native --organizationIdentifier=com.company.app` | SwiftUI-only, xcnew integration, 11 Nx targets | ✅ Production Ready |
| Android | `--type=android-native --packageName=com.company.app` | Gradle, Kotlin, Material Design | 🚧 Next Phase |

## Common Options

### Global Options
```bash
--tags <tag1,tag2>       # Add Nx tags for organization
--directory <path>       # Custom subdirectory within libs/ or apps/
--dry-run               # Preview changes without applying
```

### Library-Specific Options
```bash
--publishable           # Make library publishable to npm/PyPI/etc
--importPath <@scope/name>  # Custom import path
```

### Application-Specific Options
```bash
--docker               # Add Docker support (default: true for most)
--framework <name>     # Specify framework (required for some types)
```

## File Structures

### Python Library Structure
```
libs/my-python-lib/
├── src/
│   └── my_python_lib/
│       ├── __init__.py
│       └── my_python_lib.py
├── tests/
│   └── test_my_python_lib.py
├── pyproject.toml
├── README.md
└── project.json
```

### Python Flask Application Structure
```
apps/my-flask-app/
├── src/
│   ├── app.py
│   ├── config.py
│   └── routes/
│       ├── __init__.py
│       └── main.py
├── tests/
│   └── test_app.py
├── pyproject.toml
├── Dockerfile
├── docker-compose.yml
├── README.md
└── project.json
```

### PHP Symfony Application Structure
```
apps/my-symfony-app/
├── src/
│   ├── Controller/
│   │   ├── HealthController.php
│   │   └── ItemController.php
│   └── Entity/
│       └── Item.php
├── config/
│   ├── packages/
│   └── routes.yaml
├── public/
│   └── index.php
├── tests/
│   └── Controller/
├── docker/
│   ├── init-db.sh
│   └── php.ini
├── composer.json
├── Dockerfile
├── docker-compose.yml
└── project.json
```

### PHP Laravel Application Structure
```
apps/my-laravel-app/
├── app/
│   ├── Http/
│   │   └── Controllers/
│   │       ├── HealthController.php
│   │       └── ItemController.php
│   └── Models/
│       └── Item.php
├── config/
│   ├── app.php
│   └── database.php
├── database/
│   ├── factories/
│   │   └── ItemFactory.php
│   └── migrations/
│       └── create_items_table.php
├── routes/
│   ├── api.php
│   └── web.php
├── tests/
│   └── Feature/
├── docker/
│   ├── init-db.sh
│   └── php.ini
├── composer.json
├── Dockerfile
├── docker-compose.yml
└── project.json
```

### iOS Application Structure ✅ NEW!
```
apps/my-ios-app/
├── my-ios-app/
│   ├── my_ios_appApp.swift      # SwiftUI App (main entry point)
│   ├── ContentView.swift        # Professional SwiftUI templates
│   └── Assets.xcassets/         # App icons, images
├── my-ios-appTests/
│   └── my-ios-appTests.swift    # Unit tests with async support
├── my-ios-appUITests/
│   └── my-ios-appUITests.swift  # UI tests for SwiftUI
├── my-ios-app.xcodeproj/        # Xcode project (xcnew generated)
├── .swiftlint.yml               # 80+ linting rules
├── .swiftformat                 # Modern Swift formatting
├── ExportOptions.plist          # IPA export configuration
├── README.md                    # iOS development guide
└── project.json                 # 11 Nx targets for iOS development
```

### Web Application Structure (React)
```
apps/my-react-app/
├── src/
│   ├── main.tsx
│   ├── app/
│   └── assets/
├── public/
├── tests/
├── Dockerfile
├── docker-compose.yml
├── package.json
├── vite.config.ts
└── project.json
```

## Running Generated Projects

### Development Commands
```bash
# Serve any application
pnpm nx serve <app-name>

# Build any project
pnpm nx build <project-name>

# Test any project
pnpm nx test <project-name>

# Lint any project
pnpm nx lint <project-name>
```

### Docker Commands
```bash
# Build Docker image
pnpm nx docker-build <app-name>

# Run with Docker Compose
cd apps/<app-name>
docker-compose up -dev
```

### Python-Specific Commands
```bash
# Install Python dependencies
cd libs/<python-lib>
poetry install

# Run Python app directly
cd apps/<python-app>
poetry run python src/app.py
```

### Mobile-Specific Commands ✅ NEW!
```bash
# iOS Development
pnpm nx build <ios-app>           # Build with Xcode
pnpm nx test <ios-app>            # Run unit tests
pnpm nx test-ui <ios-app>         # Run UI tests  
pnpm nx run <ios-app>             # Run in iOS Simulator
pnpm nx archive <ios-app>         # Create archive for distribution
pnpm nx export-ipa <ios-app>      # Export IPA file
pnpm nx lint <ios-app>            # SwiftLint validation
pnpm nx format <ios-app>          # SwiftFormat code formatting
pnpm nx coverage <ios-app>        # Code coverage analysis
pnpm nx instruments <ios-app>     # Performance profiling
pnpm nx analyze <ios-app>         # Static code analysis

# Open in Xcode
open apps/<ios-app>/<ios-app>.xcodeproj

# Android (NEW! Phase 4.7.2 ✅)
pnpm nx g @terrible-lizard/generators:create-app my-android-app --type=android-native --packageName=com.company.app

# ⚠️ Package name validation prevents Java keywords:
# GOOD: --packageName=com.company.testapp
# BAD:  --packageName=com.company.final  # 'final' is Java keyword - will error

# Development commands (13 available targets)
pnpm nx build my-android-app           # ✅ Build debug APK (Gradle 8.11.1, Kotlin 1.9.20)
pnpm nx test my-android-app            # ✅ Run unit tests  
pnpm nx test-ui my-android-app         # ✅ Run instrumentation tests (requires emulator)
pnpm nx lint my-android-app            # ✅ Lint Kotlin code (KtLint + Detekt)
pnpm nx format my-android-app          # ✅ Format code with KtLint
pnpm nx analyze my-android-app         # ✅ Static analysis with Detekt
pnpm nx clean my-android-app           # ✅ Clean build files
pnpm nx install-debug my-android-app   # ✅ Install debug APK on device/emulator
pnpm nx install-release my-android-app # ✅ Install release APK
pnpm nx assemble my-android-app        # ✅ Assemble APK without installing
pnpm nx bundle my-android-app          # ✅ Build Android App Bundle (AAB)

# Docker development (zero-setup)
pnpm nx docker-build my-android-app    # ✅ Build with Docker (Java 17 + Android SDK)
pnpm nx docker-run my-android-app      # ✅ Run in Docker container

# Open in Android Studio
open apps/my-android-app  # ✅ Open entire project folder (not /app subfolder!)

# Important: Emulator Requirements
# - API 24+ (Android 7.0+) minimum - lower APIs cause immediate crashes
# - API 34 recommended for development
# - Create emulator in Android Studio: Tools > AVD Manager
```

## Port Assignments

| Application Type | Development Port | Production Port | Notes |
|------------------|------------------|-----------------|--------|
| React/Vite | 3000 | 80 | Default Vite dev server |
| Next.js | 3000 | 80 | Next.js dev server |
| Flask | 5001 | 5000 | Mapped to avoid macOS AirPlay |
| Django | 8001 | 8000 | Django development server |
| FastAPI | 8002 | 8000 | Uvicorn server |
| Symfony | 8003 | 80 | PHP-FPM + Nginx |
| Laravel | 8004 | 80 | PHP-FPM + Nginx |
| NestJS | 3333 | 80 | NestJS default |
| Basic Web | 8080 | 80 | http-server |

## Template Organization

### Generator Structure
```
tools/generators/
├── lib/                    # Libraries only
│   ├── files/
│   │   ├── python/        # Reusable modules
│   │   ├── php/           # Composer packages
│   │   ├── typescript/    # UI/utility libraries
│   │   ├── ios/           # iOS frameworks
│   │   └── android/       # Android modules
├── app/                   # Applications only
│   ├── files/
│   │   ├── python/        # Web applications
│   │   │   └── flask/     # Flask-specific
│   │   └── web/           # Frontend applications
├── common/                # Shared across types
└── docker/               # Docker configurations
```

## Troubleshooting

### Common Issues
```bash
# Generator not found
pnpm nx reset    # Clear Nx cache

# Python dependencies issues
cd <project>
poetry install --no-cache

# Docker port conflicts
docker-compose down
docker system prune

# TypeScript compilation errors
pnpm nx build <project> --verbose
```

### Generator Development
```bash
# Test generator without creating project
pnpm nx g @terrible-lizard/generators:create-lib test --dry-run

# Test both generators
pnpm nx g @terrible-lizard/generators:create-lib test-lib --type=python --dry-run
pnpm nx g @terrible-lizard/generators:create-app test-app --type=python --framework=flask --dry-run
```

## Essential Commands (Critical)

### ⚠️ **ALWAYS Use `pnpm nx` Commands**
```bash
# ✅ CORRECT - Use pnpm nx for consistent dependency resolution
pnpm nx serve flask-api
pnpm nx g @terrible-lizard/generators:create-app my-app

# ❌ WRONG - Never use nx directly in this workspace
nx serve flask-api  # Can cause plugin loading issues
```

### Core Nx Commands
```bash
# Build affected projects
pnpm nx affected:build

# Test affected projects  
pnpm nx affected:test

# Lint affected projects
pnpm nx affected:lint

# View project graph
pnpm nx graph

# View affected project graph
pnpm nx affected:graph

# Format code
pnpm nx format:write

# Check formatting
pnpm nx format:check
```

## Best Practices

1. **Always use pnpm nx commands**, not direct nx
2. **Use Docker for Python applications** to avoid environment conflicts
3. **Apply consistent naming**: kebab-case for projects, snake_case for Python modules
4. **Tag projects appropriately** for Nx dependency management
5. **Test generators with --dry-run** before creating actual projects
6. **Use type-specific templates** - don't mix library and application concerns
