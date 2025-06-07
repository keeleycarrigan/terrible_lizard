# Workspace Context 🏗️
## Current State and Capabilities

**Repository**: terrible_lizard - Polyglot Nx Monorepo Generator System  
**Last Updated**: June 8, 2025  
**Status**: Clean workspace, ready for project generation

## Current Workspace State

```bash
📁 apps/          # EMPTY - Ready for new applications
📁 libs/          # EMPTY - Ready for new libraries  
📁 tools/         # Generator system (PRODUCTION READY)
📁 docs/          # Complete documentation
```

## Available Generators ✅

### 🚀 PRODUCTION READY (100% Working)

#### Web Applications
- **React**: `--framework=react` → Vite + TypeScript + Docker (Port 3000)
- **Angular**: `--framework=angular` → Angular CLI + TypeScript + Docker  
- **Next.js**: `--framework=nextjs` → SSR/SSG + TypeScript + Docker (Port 3000)
- **NestJS**: `--framework=nestjs` → Backend API + TypeScript + Docker
- **Basic Web**: `--framework=none` → Static HTML/CSS/JS + nginx (Port 8080)

#### Python Applications  
- **FastAPI**: `--framework=fastapi` → Async + OpenAPI + PostgreSQL + Docker (Port 8002)
- **Django**: `--framework=django` → ORM + Admin + PostgreSQL + Docker (Port 8001)
- **Flask**: `--framework=flask` → Lightweight + Blueprints + PostgreSQL + Docker (Port 5001)

#### PHP Applications
- **Laravel**: `--framework=laravel` → Eloquent + Artisan + PostgreSQL + Docker (Port 8004)
- **Symfony**: `--framework=symfony` → Doctrine + Console + PostgreSQL + Docker (Port 8003)

#### Mobile Applications
- **iOS**: `--type=ios-native` → SwiftUI + Xcode + 11 Nx targets ✅ NEW!

#### All Library Types
- **UI**: `--type=ui` → React/Angular components + Storybook
- **Networking**: `--type=networking` → HTTP clients + API wrappers
- **Utility**: `--type=utility` → Helper functions + validators
- **Python**: `--type=python` → Poetry + pytest + 90% coverage
- **PHP**: `--type=php` → Composer + PHPUnit + PSR-4
- **iOS**: `--type=ios-native` → Swift Package Manager + XCTest
- **Android**: `--type=android-native` → Gradle + Kotlin + JUnit

### 🚧 COMING SOON (Next Phase)
- **Android Apps**: `--type=android-native` (Phase 4.7.2)

## Quick Start Examples

### For "start a new iOS project":
```bash
pnpm nx g @terrible-lizard/generators:create-app WeatherApp --type=ios-native --organizationIdentifier=com.company.weather
# Then: open apps/WeatherApp/WeatherApp.xcodeproj
```

### For "create a React app":
```bash
pnpm nx g @terrible-lizard/generators:create-app my-dashboard --framework=react --docker
# Then: pnpm nx serve my-dashboard
```

### For "build a Python API":
```bash
pnpm nx g @terrible-lizard/generators:create-app user-api --framework=fastapi --docker
# Then: pnpm nx serve user-api (http://localhost:8002)
```

## Current Capabilities

### ✅ What Works Right Now
- **All generators create production-ready applications**
- **One-command project creation** (no manual setup required)
- **Comprehensive testing setup** for all project types
- **Docker configurations** for web/backend applications
- **Professional code quality** (linting, formatting, type checking)
- **Complete Nx integration** (build, test, serve, lint commands)

### 📋 Generator Command Patterns
```bash
# Simplified (Recommended)
pnpm nx g @terrible-lizard/generators:create-app {name} --framework={framework}

# Explicit (Legacy, still works)  
pnpm nx g @terrible-lizard/generators:create-app {name} --type={type} --framework={framework}

# Libraries
pnpm nx g @terrible-lizard/generators:create-lib {name} --type={type}
```

### 🎯 Default Behaviors
- **Docker**: Automatically included for web/backend apps
- **Testing**: Comprehensive test suites for all projects
- **Linting**: ESLint, SwiftLint, ruff, PHP-CS-Fixer configured
- **Type Safety**: TypeScript, mypy, PHPStan where applicable

## Error Prevention

### ❌ Common Mistakes to Avoid
```bash
# WRONG - Missing generator namespace
nx g create-app my-app

# CORRECT - Include full namespace
pnpm nx g @terrible-lizard/generators:create-app my-app --framework=react
```

### ⚠️ Platform Requirements
- **iOS Development**: Requires macOS + Xcode
- **Docker Applications**: Requires Docker Desktop
- **General**: Requires Node.js + pnpm

## AI Assistant Quick Checks

### Before Running Commands
1. **Check OS**: iOS development requires macOS
2. **Verify name**: Use kebab-case for project names
3. **Choose framework**: Ask if user doesn't specify

### After Running Commands  
1. **Verify success**: Look for "✅ Successfully created" message
2. **Check directory**: Confirm apps/{name} or libs/{name} exists
3. **Suggest next steps**: Provide appropriate serve/build/open commands

### Success Patterns
```bash
# iOS App Success
✅ iOS application created successfully!
📁 Location: apps/{name}
🚀 Ready to open: open apps/{name}/{name}.xcodeproj

# Web/Backend App Success  
✅ Successfully created {type} application: {name}
📁 Location: apps/{name}
🚀 Start development: pnpm nx serve {name}
```

---

**This workspace is a clean slate ready for any type of application development!** 🦎 
