# Applications (`apps/`)

This directory contains all **deployable applications** in the monorepo.

## Supported Application Types

- **Web Applications**: React, Angular, Next.js, Nest.js
- **Mobile Applications**: Native iOS (Xcode), Native Android (Gradle)
- **Backend Applications**: PHP (Symfony, Laravel), Python (Flask, Django, FastAPI)

## Creating Applications

Use the custom generator to create new applications:

```bash
# Web applications
nx g create-app my-web-app --type=web --framework=react
nx g create-app my-api --type=web --framework=nestjs

# Mobile applications
nx g create-app my-ios-app --type=ios-native
nx g create-app my-android-app --type=android-native

# Backend applications  
nx g create-app my-php-app --type=php --framework=symfony --docker
nx g create-app my-python-app --type=python --framework=fastapi --docker
```

## Directory Structure

Each application follows the pattern:
```
apps/
├── my-web-app/           # React web application
├── my-api/               # NestJS API
├── my-mobile-ios/        # Native iOS app
├── my-mobile-android/    # Native Android app
├── my-php-service/       # PHP backend service
└── my-python-api/        # Python backend API
```

## Key Principles

- **Single Responsibility**: Each app serves one specific purpose
- **Thin Applications**: Business logic should reside in shared libraries (`libs/`)
- **Consistent Tooling**: All apps use unified `nx build`, `nx test`, `nx lint` commands
- **Docker Ready**: Web, PHP, and Python apps include Docker configurations by default 
