# Applications (`apps/`)

This directory contains all **deployable applications** in the monorepo.

## Supported Application Types

- **Web Applications**: React, Angular, Next.js, Nest.js ✅ Production Ready
- **Mobile Applications**: Native iOS (SwiftUI + Xcode) ✅ Production Ready, Native Android 🚧 Next Phase
- **Backend Applications**: PHP (Symfony, Laravel) ✅ Production Ready, Python (Flask, Django, FastAPI) ✅ Production Ready

## Creating Applications

Use the custom generator to create new applications:

```bash
# ⭐ SIMPLIFIED COMMANDS (Recommended - Auto-detects type from framework)
pnpm nx g @terrible-lizard/generators:create-app my-app --framework=react --docker
pnpm nx g @terrible-lizard/generators:create-app my-app --framework=angular --docker
pnpm nx g @terrible-lizard/generators:create-app my-app --framework=nextjs --docker
pnpm nx g @terrible-lizard/generators:create-app my-app --framework=nestjs --docker
pnpm nx g @terrible-lizard/generators:create-app my-app --framework=flask --docker
pnpm nx g @terrible-lizard/generators:create-app my-app --framework=django --docker
pnpm nx g @terrible-lizard/generators:create-app my-app --framework=fastapi --docker
pnpm nx g @terrible-lizard/generators:create-app my-app --framework=symfony --docker
pnpm nx g @terrible-lizard/generators:create-app my-app --framework=laravel --docker

# 📱 MOBILE APPLICATIONS
pnpm nx g @terrible-lizard/generators:create-app my-ios-app --type=ios-native --organizationIdentifier=com.company.app
# pnpm nx g @terrible-lizard/generators:create-app my-android-app --type=android-native --packageName=com.company.app  # 🚧 Coming Soon

# 📝 EXPLICIT TYPE COMMANDS (Legacy - Still supported)
pnpm nx g @terrible-lizard/generators:create-app my-web-app --type=web --framework=react --docker
pnpm nx g @terrible-lizard/generators:create-app my-api --type=web --framework=nestjs --docker
pnpm nx g @terrible-lizard/generators:create-app my-php-app --type=php --framework=symfony --docker
pnpm nx g @terrible-lizard/generators:create-app my-python-app --type=python --framework=fastapi --docker
```

## Application Features

### Web Applications (Ports: 3000, 8080)
- Vite/Webpack build systems with TypeScript
- Testing setup with Jest/Vitest
- Docker configurations for development and production
- ESLint and Prettier configurations

### Python Applications
- **Flask** (Port 5001:5000): Lightweight web framework with Blueprints
- **Django** (Port 8001:8000): Full-featured framework with ORM, admin interface
- **FastAPI** (Port 8002:8000): Modern async API framework with automatic OpenAPI docs
- Docker support with Poetry dependency management
- Comprehensive testing setup with pytest
- PostgreSQL database integration

### PHP Applications  
- **Symfony** (Port 8003:80): Enterprise framework with Doctrine ORM
- **Laravel** (Port 8004:80): Elegant framework with Eloquent ORM
- Docker multi-stage builds with PHP-FPM + Nginx
- PostgreSQL database with automatic schema creation
- Comprehensive testing with PHPUnit
- Redis caching integration

### iOS Applications ✅ NEW!
- **SwiftUI-only applications** with pure SwiftUI App lifecycle
- Professional templates with AppState management and network monitoring
- 11 Nx targets: build, test, test-ui, run, archive, export-ipa, lint, format, coverage, instruments, analyze
- SwiftLint (80+ rules) and SwiftFormat configurations
- iOS 17.0+ with Swift 6.0 support
- Xcode project integration via xcnew

## Running Applications

```bash
# All applications support these commands:
pnpm nx serve <app-name>          # Start development server
pnpm nx build <app-name>          # Build for production
pnpm nx test <app-name>           # Run tests
pnpm nx lint <app-name>           # Lint code

# iOS-specific commands:
pnpm nx run <ios-app>             # Run in iOS Simulator
pnpm nx test-ui <ios-app>         # Run UI tests
pnpm nx archive <ios-app>         # Create archive for App Store
open apps/<ios-app>/<ios-app>.xcodeproj  # Open in Xcode
```

## Key Principles

- **Single Responsibility**: Each app serves one specific purpose
- **Thin Applications**: Business logic should reside in shared libraries (`libs/`)
- **Consistent Tooling**: All apps use unified `pnpm nx` commands
- **Docker Ready**: Web, PHP, and Python apps include Docker configurations by default
- **Production Ready**: All generators create fully functional applications out of the box
