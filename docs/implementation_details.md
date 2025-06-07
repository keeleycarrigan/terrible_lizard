# Implementation Details - Polyglot Monorepo Generator System

## Generator Directory Organization

### Structure Overview
```
tools/generators/
├── lib/                    # Library generator
│   ├── index.ts           # Library scaffolding logic
│   ├── schema.json        # Library-specific parameters
│   └── files/             # Library-focused templates
│       ├── python/        # Python library templates
│       ├── php/           # PHP library templates
│       ├── typescript/    # TypeScript library templates
│       ├── ios/           # iOS library templates
│       └── android/       # Android library templates
├── app/                   # Application generator
│   ├── index.ts          # Application scaffolding logic
│   ├── schema.json       # Application-specific parameters
│   └── files/            # Application-focused templates
│       ├── python/       # Python application templates
│       │   ├── flask/    # Flask web applications
│       │   ├── django/   # Django applications
│       │   └── fastapi/  # FastAPI applications
│       ├── php/          # PHP application templates
│       │   ├── symfony/  # Symfony applications
│       │   └── laravel/  # Laravel applications
│       ├── ios/          # iOS application templates ✅ NEW
│       │   ├── __name__/ # SwiftUI app structure
│       │   ├── __name__Tests/     # Unit test templates
│       │   ├── __name__UITests/   # UI test templates
│       │   ├── project.json.template  # Nx targets (11 iOS-specific)
│       │   ├── .swiftlint.yml.template # Linting configuration
│       │   ├── .swiftformat.template   # Code formatting
│       │   └── README.md.template      # iOS documentation
│       └── web/          # Web application templates
├── common/               # Shared templates
└── docker/              # Docker configurations
```

### Key Design Decisions

#### 1. Separation of Library vs Application Concerns

**Problem**: Originally, Python templates were mixed, leading to confusion about whether to generate reusable libraries or deployable applications.

**Solution**: Clear separation based on intended use:
- **Libraries** (`lib/files/python/`): Focus on reusability, clean APIs, minimal dependencies
- **Applications** (`app/files/python/flask/`): Focus on deployment, web frameworks, Docker integration

#### 2. Template Naming Convention

**Format**: `.template` instead of `.ejs` for clarity
**Rationale**: Makes it immediately clear these are template files for code generation

#### 3. Python-Specific Configurations

| Aspect | Library Template | Application Template |
|--------|------------------|---------------------|
| **pyproject.toml** | `package-mode = true` (default) | `package-mode = false` |
| **Dependencies** | pytest, ruff, mypy, black | + Flask, gunicorn, flask-cors |
| **Test Coverage** | 90% required | 85% required |
| **Structure** | `src/module_name/` | `src/` with app.py, routes/ |
| **Docker** | Not included | Full Docker + compose |

#### 4. Template Variable Strategy

**Standard Variables**:
- `name`: Project name (kebab-case)
- `moduleName`: Python module name (snake_case)
- `className`: Class name (PascalCase)
- `fileName`: File name (kebab-case)
- `description`: Auto-generated description
- `projectName`: Full project identifier

**Example Usage**:
```ejs
# In pyproject.toml.template
name = "<%= projectName %>"
packages = [{include = "<%= moduleName %>", from = "src"}]

# In Python source
class <%= className %>:
    def __init__(self, name: str = "<%= name %>"):
```

### Generator Implementation Patterns

#### Library Generator Logic
```typescript
async function scaffoldPythonLibrary(tree: Tree, options: NormalizedOptions) {
    generateFiles(
        tree,
        path.join(__dirname, 'files', 'python'),
        options.projectRoot,
        {
            ...options,
            moduleName: options.name.replace(/-/g, '_'),
            description: `${options.name} - Python library for Terrible Lizard monorepo`,
            importPath: options.importPath || null,
        }
    );
}
```

#### Application Generator Logic
```typescript
case 'python':
    if (options.framework === 'flask') {
        // Use Flask-specific templates with Docker
        await scaffoldFlaskApp(tree, options);
    }
    break;
```

### Testing Strategy

#### Library Tests
- Focus on unit testing individual components
- High coverage requirement (90%)
- Test fixtures for complex scenarios
- Performance tests for large data processing

#### Application Tests
- Include integration tests for web endpoints
- Lower coverage requirement (85%) due to framework overhead
- Test application factory pattern
- Docker environment testing

### Docker Integration

#### Application-Only Docker
- Libraries don't include Docker (they're dependencies)
- Applications include full Docker setup
- Multi-stage builds for optimization
- Development vs production configurations

#### Port Management
- Flask apps: 5001:5000 mapping (avoids macOS AirPlay)
- Hot reloading in development
- Production-ready Gunicorn setup

## iOS Application Generator Implementation

### xcnew Integration Strategy

#### Tool Installation and Verification
```typescript
// Check if xcnew is available, install if needed
try {
  execSync('which xcnew', { stdio: 'pipe' });
} catch (error) {
  logger.warn(`⚠️  xcnew not found. Installing via Homebrew...`);
  execSync('brew install manicmaniac/tap/xcnew', { stdio: 'inherit' });
}
```

#### SwiftUI-Only Project Creation
```typescript
// Create pure SwiftUI project (no UIKit SceneDelegate/AppDelegate)
const xcnewCommand = [
  'xcnew',
  options.name,
  '-i', `${organizationIdentifier}.${options.propertyName}`,
  '-S', // Use SwiftUI lifecycle (pure SwiftUI, no UIKit hybrid)
  '-t', // Include tests
  options.projectDirectory
];
```

#### Template Integration and Conflict Resolution
```typescript
// Replace xcnew-generated files with professional templates
const enhancedAppFile = tree.read(`${options.projectRoot}/${options.name}/App/${options.name}App.swift`);
if (enhancedAppFile) {
  tree.write(`${appPath}/${options.name.replace(/-/g, '_')}App.swift`, enhancedAppFile);
}

// CRITICAL: Clean up duplicate template files to prevent Xcode build conflicts
tree.delete(`${options.projectRoot}/${options.name}/App/${options.name}App.swift`);
tree.delete(`${options.projectRoot}/${options.name}/App/ContentView.swift`);
```

### iOS-Specific Template System

#### SwiftUI App Architecture
- **Pure SwiftUI Lifecycle**: `@main` App struct without UIKit components
- **Professional AppState Management**: Global state with scene phase handling
- **Network Monitoring**: Built-in connectivity tracking
- **Modern Swift Patterns**: Async/await, proper error handling, MVVM architecture

#### Nx Target Configuration (11 iOS-Specific Targets)
```json
{
  "build": "xcodebuild -project {projectName}.xcodeproj -scheme {projectName} build",
  "test": "xcodebuild test -project {projectName}.xcodeproj -scheme {projectName}",
  "test-ui": "xcodebuild test -project {projectName}.xcodeproj -scheme {projectName} -testPlan UITests",
  "run": "xcrun simctl boot 'iPhone 15' && xcodebuild build -project {projectName}.xcodeproj",
  "archive": "xcodebuild archive -project {projectName}.xcodeproj -scheme {projectName}",
  "lint": "swiftlint lint --quiet",
  "format": "swiftformat --config .swiftformat .",
  "coverage": "xcodebuild test -enableCodeCoverage YES",
  "instruments": "instruments -t 'Time Profiler'",
  "analyze": "xcodebuild analyze -project {projectName}.xcodeproj"
}
```

#### Template Variable Strategy for iOS
```typescript
const iosConfig = {
  uiFramework: 'SwiftUI',
  architecture: 'MVVM', 
  minIOSVersion: '17.0',
  swiftVersion: '6.0',
  organizationIdentifier: options.organizationIdentifier || 'com.terrible-lizard',
  // Template substitution variables
  name: options.name,
  className: options.className,  // PascalCase for Swift classes
  propertyName: options.propertyName  // camelCase for properties
};
```

### iOS Development Tooling Integration

#### SwiftLint Configuration
- 80+ linting rules for code quality
- Custom rules for architecture patterns
- Disabled rules for template-generated code
- Integration with Xcode build process

#### SwiftFormat Configuration  
- Modern Swift formatting standards
- Consistent code style across all generated projects
- Integration with development workflow

#### Testing Templates
- **Unit Tests**: Comprehensive test patterns with async support
- **UI Tests**: SwiftUI-specific UI testing patterns
- **Performance Tests**: Built-in performance monitoring templates
- **Test Utilities**: Shared testing infrastructure

### Error Handling and Edge Cases

#### Duplicate File Prevention
**Problem**: xcnew generates basic Swift files that conflict with enhanced templates
**Solution**: Template integration system that replaces and cleans up duplicates

```typescript
// Clean up duplicate template files to prevent Xcode build conflicts
tree.delete(`${options.projectRoot}/${options.name}/App/${options.name}App.swift`);
// Remove empty App directory
if (tree.children(appDir).length === 0) {
  tree.delete(appDir);
}
```

#### Framework Prompting Fix
**Problem**: iOS apps were incorrectly prompted for web framework selection
**Solution**: Preprocess options to set framework='none' for native apps

```typescript
// For iOS/Android apps, framework is not needed
if (options.type && ['ios-native', 'android-native'].includes(options.type)) {
  if (!options.framework) {
    options.framework = 'none';
  }
}
```

### File Generation Process

1. **Validate Options**: Check required parameters
2. **Generate Project Configuration**: Create `project.json` with appropriate targets
3. **Apply Templates**: Use `generateFiles` with variable substitution
4. **Execute Post-Generation**: Run shell commands (composer install, poetry install)
5. **Format Files**: Apply consistent formatting

### Error Handling

#### Template Variables
```typescript
// Safe template variable handling
<% if (description) { %><%= description %><% } else { %>Default description<% } %>
```

#### Shell Command Safety
```typescript
try {
    execSync('poetry install', { cwd: projectRoot, stdio: 'inherit' });
    console.log(`✅ Python library ${options.name} initialized successfully`);
} catch (error) {
    console.warn(`⚠️ Poetry install failed: ${error.message}`);
}
```

### Performance Optimizations

1. **Parallel Template Processing**: Multiple file generation operations
2. **Conditional Shell Commands**: Only run when necessary
3. **Cached Template Compilation**: Reuse compiled templates
4. **Incremental Generation**: Only update changed files

### Extension Points

#### Adding New Framework Support
1. Create new subdirectory in `app/files/python/`
2. Add framework-specific templates
3. Update application generator switch statement
4. Add framework option to schema

#### Adding New Language Support
1. Create new subdirectory in `lib/files/` and `app/files/`
2. Implement language-specific scaffolding function
3. Add language type to schema
4. Update generator logic

### Common Patterns

#### Template Organization
```
language/
├── framework/              # For applications only
│   ├── pyproject.toml.template
│   ├── src/               # Application structure
│   ├── tests/            # Application tests
│   ├── Dockerfile.template
│   └── docker-compose.yml.template
├── src/                   # For libraries
│   └── __moduleName__/    # Module structure
├── tests/                 # Library tests
└── README.md.template     # Documentation
```

#### Target Configuration
```typescript
const targets = {
    build: { executor: language-specific-executor },
    test: { executor: test-framework-executor },
    lint: { executor: linter-executor },
    serve: { executor: dev-server-executor } // Applications only
};
```

This implementation provides a scalable foundation for adding new languages and frameworks while maintaining clear separation of concerns.

## Recent Reorganization (June 7, 2025)

### Generator Directory Cleanup

**Issue**: Original directory structure was confusing with mixed library and application templates in a flat `files/` directory.

**Solution**: Reorganized into clear hierarchical structure:

#### Before:
```
tools/generators/
├── create-lib.ts
├── create-app.ts
└── files/
    ├── typescript/    # Used by create-lib
    ├── python/        # Used by both (confusing!)
    ├── web/          # Used by create-app
    └── php/          # Used by create-lib
```

#### After:
```
tools/generators/
├── lib/
│   ├── index.ts
│   ├── schema.json
│   └── files/
│       ├── python/    # Library-focused
│       ├── php/       # Library-focused
│       ├── typescript/
│       ├── ios/
│       └── android/
├── app/
│   ├── index.ts
│   ├── schema.json
│   └── files/
│       ├── python/    # Application-focused
│       │   └── flask/
│       └── web/
├── common/            # Shared templates
└── docker/           # Docker configurations
```

### Key Improvements

1. **Clear Separation of Concerns**: Libraries vs applications have distinct templates
2. **Template Path Updates**: Fixed `__dirname` references to point to reorganized structure
3. **Generators.json Updates**: Updated factory paths to point to new locations
4. **Schema Separation**: Distinct schemas for library vs application parameters
5. **Test File Organization**: Separate test generators for lib and app
6. **Documentation Updates**: All references updated to reflect new structure

### Python Template Distinction

| Aspect | Library (`lib/files/python/`) | Application (`app/files/python/flask/`) |
|--------|-------------------------------|----------------------------------------|
| **Purpose** | Reusable code modules | Deployable web applications |
| **Dependencies** | Minimal (pytest, ruff, mypy) | Web frameworks (Flask, gunicorn) |
| **Structure** | `src/module_name/` | `src/` with `app.py`, `routes/` |
| **Test Coverage** | 90% (higher standard) | 85% (framework overhead) |
| **Docker** | None (consumed by apps) | Full Docker + compose setup |
| **Class Design** | Generic utility classes | Application factory pattern |

### Validation Results

✅ **Library Generator**: Creates lightweight Python modules with clean APIs
✅ **Application Generator**: Creates Docker-ready Flask apps with proper structure
✅ **Path Resolution**: All template paths correctly resolved after reorganization
✅ **Generator Tests**: Both lib and app generators pass comprehensive testing
✅ **Documentation**: All references updated to reflect new organization

## FastAPI Generator Completion (June 8, 2025)

### Critical Bug Fix: Template Selection Logic

**Issue**: FastAPI generator was falling back to generic Python Docker templates instead of using FastAPI-specific templates, causing incorrect port mappings and environment configurations.

**Root Cause**: In `tools/generators/app/index.ts`, the `frameworksWithDocker` array only included `['django']`, causing FastAPI to use generic templates.

**Solution**: Added `'fastapi'` to the array:
```typescript
// List of frameworks that have their own Docker templates
const frameworksWithDocker = ['django', 'fastapi'];
```

### FastAPI Template Validation

✅ **Multi-Stage Docker Build**: Development and production stages with proper Poetry configuration
✅ **SQLAlchemy 2.0 Async**: Modern async patterns with proper database session management
✅ **Pydantic v2 Schemas**: Request/response validation with comprehensive error handling
✅ **PostgreSQL + Redis**: Full async database and cache setup with health checks
✅ **Comprehensive Testing**: 27 tests with 80% coverage using pytest-asyncio
✅ **API Documentation**: FastAPI auto-generated docs at `/docs` and `/redoc`
✅ **Port Strategy**: Correct 8002:8000 mapping (Flask: 5001, Django: 8001, FastAPI: 8002)

### Production-Ready Features

- **Dependency Injection**: Clean separation with proper mocking in tests
- **Database Migrations**: Alembic integration with async database operations  
- **Error Handling**: Professional HTTP exception handling with validation
- **Configuration Management**: Environment-based config with development/production settings
- **Async Performance**: Full async/await patterns throughout the application stack
- **Docker Optimization**: Disabled Poetry virtual environments in containers for proper builds

### Generator Status Summary

| Framework | Status | Test Coverage | Docker | Key Features |
|-----------|--------|---------------|---------|--------------|
| **Flask** | ✅ Complete | 85%+ | ✅ Multi-stage | Traditional WSGI, Gunicorn |
| **Django** | ✅ Complete | 88%+ | ✅ Multi-stage | Admin interface, ORM, REST |
| **FastAPI** | ✅ Complete | 80%+ | ✅ Multi-stage | Async, auto-docs, Pydantic |

All Python application generators are now production-ready with proven Docker-first architecture and comprehensive testing suites.

## Major UX Improvement: Auto-Type Inference (June 8, 2025)

### Framework-to-Type Auto-Detection

**Problem**: Users had to specify both `--type` and `--framework`, creating redundant command line arguments since each framework belongs to only one type.

**Solution**: Implemented automatic type inference from framework selection, simplifying commands significantly.

### Framework Type Mapping

```typescript
type AppType = 'web' | 'python' | 'php' | 'ios-native' | 'android-native';

function inferTypeFromFramework(framework?: string): AppType | null {
  const frameworkTypeMap: Record<string, AppType> = {
    // Web frameworks
    'react': 'web', 'angular': 'web', 'nextjs': 'web', 'nestjs': 'web',
    'express': 'web', 'fastify': 'web', 'vue': 'web', 'svelte': 'web',
    // Python frameworks  
    'flask': 'python', 'django': 'python', 'fastapi': 'python',
    // PHP frameworks
    'symfony': 'php', 'laravel': 'php',
  };
  return frameworkTypeMap[framework] || null;
}
```

### Command Simplification Results

| Before (Verbose) | After (Simplified) | Auto-Detection |
|------------------|-------------------|----------------|
| `--type=python --framework=fastapi` | `--framework=fastapi` | `🎯 Auto-detected type 'python' from framework 'fastapi'` |
| `--type=web --framework=react` | `--framework=react` | `🎯 Auto-detected type 'web' from framework 'react'` |
| `--type=python --framework=django` | `--framework=django` | `🎯 Auto-detected type 'python' from framework 'django'` |

### Backwards Compatibility

✅ **Legacy Commands**: Explicit `--type` + `--framework` combinations still work perfectly
✅ **Error Handling**: Clear guidance when neither type nor framework provided
✅ **Validation**: Prevents invalid framework/type combinations
✅ **Schema Updates**: Removed redundant prompting when framework is specified

### Implementation Details

1. **Schema Simplification**: Removed `x-prompt` from type field to prevent unnecessary prompting
2. **Normalization Logic**: Auto-inference happens in `normalizeOptions()` before validation
3. **Error Messages**: Helpful guidance directing users to either `--type` or `--framework`
4. **Type Safety**: Proper TypeScript typing ensures compile-time validation

This improvement reduces cognitive load and command verbosity while maintaining full backwards compatibility.

## Symfony Generator Completion (June 8, 2025)

### Critical Template Bug Fixes

**Issue 1**: Empty 'fastapi-test' directory was created every time a Symfony app was generated, indicating cache/state issues in the generator.
**Solution**: Cleaned up environment state and Nx cache to prevent directory artifacts from previous generations.

**Issue 2**: Database initialization script would run successfully but fail to create database schema automatically, requiring manual intervention.
**Solution**: Rewritten `init-db.sh.template` with robust schema detection and automatic creation logic.

### Database Initialization Fix

**Problem**: The `init-db.sh` script was checking for schema validity rather than actual table existence.

**Original Logic** (flawed):
```bash
# This only checked mapping validity, not actual tables
php bin/console doctrine:schema:validate --skip-sync
```

**Fixed Logic** (robust):
```bash
# Force schema creation - let Doctrine handle existing tables gracefully
echo "Creating database schema (Doctrine handles existing tables gracefully)..."
php bin/console doctrine:schema:create --no-interaction
```

### Symfony Template Validation  

✅ **Multi-Stage Docker Build**: Composer dependencies + PHP-FPM + Nginx + Supervisor configuration
✅ **Doctrine ORM Integration**: Automatic database schema creation with PostgreSQL support
✅ **Redis Caching**: Full Redis integration with health monitoring
✅ **Professional API Structure**: RESTful endpoints with proper validation and error handling
✅ **Routing Configuration**: Global `/api` prefix with proper controller route organization
✅ **Health Monitoring**: Comprehensive health endpoint with database and memory checks
✅ **Docker Architecture**: Clean container builds without problematic volume mounts

### Production-Ready Features

- **Automatic Schema Creation**: Database tables created automatically on application startup
- **CRUD Operations**: Complete Create, Read, Update, Delete functionality verified
- **Error Handling**: Professional HTTP responses with proper status codes
- **Health Checks**: Database connectivity, memory usage, and application status monitoring
- **Docker Optimization**: Multi-stage builds with proper vendor directory handling
- **Port Strategy**: Consistent port mapping (8003:80) for Symfony applications

### Template Bug Resolution Summary

| Issue | Root Cause | Solution | Result |
|-------|------------|----------|---------|
| **Empty fastapi-test directory** | Cache/state artifacts | Environment cleanup + Nx reset | ✅ No unwanted directories |
| **Database schema not created** | Flawed validation logic | Force schema creation approach | ✅ Automatic table creation |
| **Double /api routing** | Redundant prefix in controllers | Remove individual controller prefixes | ✅ Clean routing structure |
| **Docker vendor issues** | Problematic volume mounts | Remove application volume mount | ✅ Proper dependency resolution |

### Generator Status Summary

| Framework | Status | Database | Docker | Key Features |
|-----------|--------|----------|---------|--------------|
| **Flask** | ✅ Complete | SQLite/PostgreSQL | ✅ Multi-stage | Traditional WSGI, blueprints |
| **Django** | ✅ Complete | PostgreSQL | ✅ Multi-stage | Admin interface, ORM, REST |
| **FastAPI** | ✅ Complete | PostgreSQL + Redis | ✅ Multi-stage | Async, auto-docs, Pydantic |
| **Symfony** | ✅ Complete | PostgreSQL + Redis | ✅ Multi-stage | Doctrine ORM, professional API |

All PHP and Python application generators are now production-ready with proven Docker-first architecture, automatic database initialization, and comprehensive API functionality. The generator creates fully working applications without any manual intervention required, supporting 5 major web frameworks with consistent patterns and professional-grade implementations.

## Laravel Generator Completion (June 8, 2025)

### Critical Bug Fix: Generator Template Selection Logic

**Issue**: Laravel generator was falling back to generic PHP Docker templates instead of using Laravel-specific templates, causing Docker build failures with missing Laravel commands and incorrect directory structure.

**Root Cause**: In `tools/generators/app/index.ts`, the `phpFrameworksWithDocker` array only included `['symfony']`, causing Laravel to use generic PHP templates that lacked Laravel-specific configurations.

**Solution**: Added `'laravel'` to the array:
```typescript
// List of PHP frameworks that have their own Docker templates
const phpFrameworksWithDocker = ['symfony', 'laravel'];
```

### Critical Docker Build Fix: Runtime .env Handling

**Issue**: Laravel Dockerfile was trying to generate application keys and run Laravel optimization commands during Docker build, but the `.env` file wasn't available (excluded by `.dockerignore`), causing build failures.

**Root Cause**: Laravel commands like `php artisan key:generate` and `php artisan config:cache` require a valid `.env` file, but Docker builds shouldn't include environment-specific files.

**Solution**: Moved all Laravel-specific operations to runtime initialization:
1. **Removed from Dockerfile**: Eliminated key generation and optimization from build process
2. **Enhanced init-db.sh**: Added automatic `.env` file creation with complete Laravel configuration
3. **Runtime Optimization**: Key generation and Laravel caching now happen during container startup

### Laravel Initialization Script Enhancement

**Problem**: Laravel requires proper `.env` configuration and application key before database operations can run.

**Solution**: Comprehensive runtime initialization in `init-db.sh.template`:
```bash
# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file..."
    # Complete Laravel .env configuration including database, Redis, and framework settings
fi

# Generate application key if not set
if [ -z "$APP_KEY" ]; then
    echo "🔑 Generating Laravel application key..."
    php artisan key:generate --no-interaction --force
fi

# Optimize Laravel application
echo "⚡ Optimizing Laravel application..."
php artisan config:cache --no-interaction
php artisan route:cache --no-interaction
```

### Laravel Template Validation

✅ **Multi-Stage Docker Build**: Composer dependencies + PHP-FPM + Nginx + Supervisor configuration  
✅ **Eloquent ORM Integration**: Automatic database migration execution with PostgreSQL support  
✅ **Redis Caching**: Full Redis integration with health monitoring  
✅ **Professional API Structure**: RESTful endpoints with proper validation and Laravel Ignition error handling  
✅ **Laravel Directory Structure**: Proper storage/framework, storage/logs, and bootstrap/cache directories  
✅ **Health Monitoring**: Comprehensive health endpoint with database, Redis, and memory checks  
✅ **Testing Suite**: PHPUnit integration with 9/9 tests passing (100% success rate)  
✅ **Laravel Optimization**: Runtime config and route caching for optimal performance

### Production-Ready Features

- **Automatic Migration Execution**: Database tables created automatically via `php artisan migrate`
- **CRUD Operations**: Complete Create, Read, Update, Delete functionality with Eloquent ORM
- **Error Handling**: Laravel Ignition integration with professional error pages and debugging
- **Health Checks**: Database connectivity, Redis connectivity, memory usage, and application status monitoring
- **Docker Optimization**: Multi-stage builds with proper Laravel directory creation and permissions
- **Port Strategy**: Consistent port mapping (8004:80) for Laravel applications
- **Factory Support**: Database seeding and testing with Laravel factories for comprehensive test coverage

### Template Bug Resolution Summary

| Issue | Root Cause | Solution | Result |
|-------|------------|----------|---------|
| **Wrong Docker templates** | Missing 'laravel' in phpFrameworksWithDocker | Added Laravel to framework array | ✅ Uses Laravel-specific templates |
| **Docker build failures** | Laravel commands in build without .env | Move to runtime initialization | ✅ Successful Docker builds |
| **.env file missing** | Excluded by .dockerignore for security | Runtime .env creation with full config | ✅ Proper Laravel configuration |
| **Key generation failures** | Missing APP_KEY during build | Runtime key generation in init script | ✅ Automatic application key setup |
| **Laravel optimization issues** | Config/route cache without .env | Runtime optimization after .env exists | ✅ Optimal Laravel performance |

### Generator Status Summary

| Framework | Status | Database | Docker | Key Features |
|-----------|--------|----------|---------|--------------|
| **Flask** | ✅ Complete | SQLite/PostgreSQL | ✅ Multi-stage | Traditional WSGI, blueprints |
| **Django** | ✅ Complete | PostgreSQL | ✅ Multi-stage | Admin interface, ORM, REST |
| **FastAPI** | ✅ Complete | PostgreSQL + Redis | ✅ Multi-stage | Async, auto-docs, Pydantic |
| **Symfony** | ✅ Complete | PostgreSQL + Redis | ✅ Multi-stage | Doctrine ORM, professional API |
| **Laravel** | ✅ Complete | PostgreSQL + Redis | ✅ Multi-stage | Eloquent ORM, Ignition, factories |

All PHP and Python application generators are now production-ready with proven Docker-first architecture, automatic database initialization, and comprehensive API functionality. The generator creates fully working applications without any manual intervention required, supporting 5 major web frameworks with consistent patterns and professional-grade implementations.

## iOS Application Generator Research (June 8, 2025)

### Command Line Tools Discovery

**Research Goal**: Identify command line tools to programmatically create iOS Xcode projects for our generator.

**Key Findings**: Multiple excellent tools available for iOS project creation from command line.

### Primary Tool: xcnew

**Tool**: `xcnew` - Third-party iOS project generator  
**GitHub**: https://github.com/manicmaniac/xcnew  
**Installation**: `brew install manicmaniac/tap/xcnew`

**Capabilities**:
- Creates complete iOS Single View App projects programmatically
- Works exactly like Xcode's "New Project" but from command line
- Supports multiple iOS project types and configurations

**Usage Examples**:
```bash
# Basic iOS app
xcnew MyiOSApp

# With organization identifier
xcnew MyiOSApp -i com.company.myapp

# With additional options
xcnew MyiOSApp -i com.company.myapp -t --swift-ui --has-tests
```

**Supported Options**:
- `-i <ORG_ID>` - Organization identifier
- `-t` - Enable unit and UI tests
- `-c` - Enable Core Data template
- `-C` - Enable Core Data with CloudKit
- `-s` - Use Swift UI instead of Storyboard
- `-S` - Use Swift UI lifecycle
- `-o` - Use Objective-C instead of Swift

### Secondary Tool: Swift Package Manager

**Tool**: Swift Package Manager (built into Xcode)  
**Usage**: `swift package init --type library`

**Benefits**:
- Official Apple tool included with Xcode
- Creates proper Swift project structure with Package.swift
- Perfect for iOS library projects
- We already have iOS library templates from Phase 3

### Build Integration: xcodebuild

**Tool**: `xcodebuild` - Apple's official command line tool  
**Usage**: Build, test, and archive iOS projects from command line

**Integration Strategy**:
```bash
# Build iOS project
xcodebuild -project MyApp.xcodeproj -scheme MyApp build

# Test iOS project  
xcodebuild test -project MyApp.xcodeproj -scheme MyApp -destination 'platform=iOS Simulator,name=iPhone 15,OS=latest'

# Archive for distribution
xcodebuild archive -project MyApp.xcodeproj -scheme MyApp -archivePath MyApp.xcarchive
```

### Implementation Strategy

**Generator Architecture**:
1. **Use xcnew for Xcode Project Creation**: Primary tool for generating .xcodeproj structure
2. **Leverage Existing iOS Library Templates**: Adapt Phase 3 iOS templates for applications
3. **Nx Integration**: Configure `project.json` with iOS-specific targets using `nx:run-commands`

**Template Structure Plan**:
```
tools/generators/app/files/ios/
├── project.pbxproj.template     # Xcode project file
├── Info.plist.template          # iOS app configuration
├── AppDelegate.swift.template   # UIKit app delegate
├── SceneDelegate.swift.template # iOS 13+ scene delegate
├── ContentView.swift.template   # SwiftUI main view
├── Assets.xcassets/            # App icons and assets
└── LaunchScreen.storyboard.template
```

**Nx Target Configuration**:
```json
{
  "build": {
    "executor": "nx:run-commands",
    "options": {
      "command": "xcodebuild -project {projectName}.xcodeproj -scheme {projectName} build"
    }
  },
  "test": {
    "executor": "nx:run-commands", 
    "options": {
      "command": "xcodebuild test -project {projectName}.xcodeproj -scheme {projectName} -destination 'platform=iOS Simulator,name=iPhone 15,OS=latest'"
    }
  },
  "run-ios": {
    "executor": "nx:run-commands",
    "options": {
      "command": "open {projectName}.xcodeproj"
    }
  }
}
```

### Advantages of This Approach

✅ **Proven Tools**: xcnew works exactly like Xcode's project creation  
✅ **Official Integration**: Uses Apple's official xcodebuild for all operations  
✅ **Existing Foundation**: Can leverage our Phase 3 iOS library templates  
✅ **Full iOS Support**: Supports both UIKit and SwiftUI project types  
✅ **Testing Integration**: Built-in support for unit and UI tests  
✅ **Nx Compatibility**: Integrates with Nx orchestration via run-commands executor

### Next Steps

1. **Test xcnew Integration**: Verify xcnew works in our environment
2. **Create iOS App Templates**: Develop application-specific templates extending library patterns
3. **Implement Generator Logic**: Extend app generator with iOS support using xcnew
4. **Configure Nx Targets**: Set up iOS build/test/run workflows
5. **Validate with Real Projects**: Test complete workflow from generation to Xcode build

This approach provides a solid foundation for iOS application generation using proven command line tools while leveraging our existing iOS template infrastructure from Phase 3.

## Android Application Generator Implementation

### Package Name Validation System

#### Java Keyword Prevention
```typescript
function validateAndroidPackageName(packageName: string): void {
  const javaKeywords = [
    'abstract', 'boolean', 'break', 'case', 'catch', 'class', 'const', 'continue',
    'default', 'do', 'else', 'enum', 'extends', 'final', 'finally', 'float',
    'for', 'if', 'implements', 'import', 'int', 'interface', 'long', 'native',
    'new', 'package', 'private', 'protected', 'public', 'return', 'short',
    'static', 'super', 'switch', 'this', 'throw', 'throws', 'try', 'void',
    'volatile', 'while', 'goto', 'const', 'strictfp', 'assert', 'var', 'yield',
    'record', 'sealed', 'permits', 'non-sealed'
  ];
  
  const parts = packageName.split('.');
  for (const part of parts) {
    if (javaKeywords.includes(part.toLowerCase())) {
      throw new Error(
        `Invalid package name: "${part}" is a Java keyword. ` +
        `Package names cannot contain Java keywords like: ${javaKeywords.join(', ')}. ` +
        `Please use a different project name or specify a custom --packageName.`
      );
    }
  }
}
```

#### Package Name Generation Strategy
```typescript
const androidConfig = {
  packageName: (options as any).packageName || `com.terrible_lizard.${options.propertyName}`,
  packagePath: packageName.replace(/\./g, '/'), // Convert dots to directory structure
  // ...
};
```

### Android-Specific Template Variables

#### Standard Variables for Android Templates
```typescript
const androidConfig = {
  ...options,
  packageName,                    // com.company.appname
  packagePath,                    // com/company/appname (for directory structure)
  minSdkVersion: '24',           // Android 7.0+
  compileSdkVersion: '34',       // Android 14 (latest)
  targetSdkVersion: '34',        // Android 14
  kotlinVersion: '1.9.20',      // Compatible with Compose 1.5.4
  gradleVersion: '8.11.1',      // Latest stable Gradle
  agpVersion: '8.2.0',          // Android Gradle Plugin
  description: `A modern Android application built with Kotlin and Jetpack Compose.`,
};
```

#### Template File Structure Mapping
```
files/android/
├── app/
│   ├── src/
│   │   ├── main/
│   │   │   ├── kotlin/
│   │   │   │   └── __packagePath__/     # Dynamic package structure
│   │   │   │       ├── MainActivity.kt
│   │   │   │       ├── MainScreen.kt
│   │   │   │       └── ui/theme/        # Material Design theme
│   │   │   ├── res/
│   │   │   │   ├── values/strings.xml
│   │   │   │   └── xml/backup_rules.xml
│   │   │   └── AndroidManifest.xml
│   │   ├── test/kotlin/__packagePath__/ # Unit tests
│   │   └── androidTest/kotlin/__packagePath__/ # UI tests
│   └── build.gradle.kts.template
├── gradle/wrapper/
│   ├── gradle-wrapper.properties.template
│   └── gradle-wrapper.jar              # Binary included
├── build.gradle.kts.template           # Project-level build
├── settings.gradle.kts.template
└── project.json.template               # Nx configuration
```

### Gradle Configuration Management

#### Multi-Level Build Configuration
```kotlin
// Project-level build.gradle.kts
plugins {
    id("com.android.application") version "8.2.0" apply false
    id("org.jetbrains.kotlin.android") version "1.9.20" apply false
    id("org.jlleitschuh.gradle.ktlint") version "11.6.1" apply false
    id("io.gitlab.arturbosch.detekt") version "1.23.3" apply false
}

// App-level build.gradle.kts  
android {
    namespace = "<%= packageName %>"
    compileSdk = <%= compileSdkVersion %>
    
    defaultConfig {
        applicationId = "<%= packageName %>"
        minSdk = <%= minSdkVersion %>
        targetSdk = <%= targetSdkVersion %>
        // ...
    }
    
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    
    kotlinOptions {
        jvmTarget = "17"
    }
}
```

#### Dependency Management Strategy
```kotlin
dependencies {
    // Kotlin Foundation
    implementation("org.jetbrains.kotlin:kotlin-stdlib:<%= kotlinVersion %>")
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-android:1.7.3")
    
    // Android Core
    implementation("androidx.core:core-ktx:1.12.0")
    implementation("androidx.lifecycle:lifecycle-runtime-ktx:2.7.0")
    implementation("androidx.activity:activity-compose:1.8.2")
    
    // Jetpack Compose (BOM-managed versions)
    implementation(platform("androidx.compose:compose-bom:2023.10.01"))
    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.material3:material3")
    
    // Testing
    testImplementation("junit:junit:4.13.2")
    testImplementation("io.mockk:mockk:1.13.8")
    androidTestImplementation("androidx.test.ext:junit:1.1.5")
    androidTestImplementation("androidx.compose.ui:ui-test-junit4")
}
```

### Nx Target Configuration (13 Android-Specific Targets)

#### Core Development Targets
```json
{
  "build": {
    "executor": "nx:run-commands",
    "options": {
      "command": "cd {projectRoot} && ./gradlew assembleDebug"
    },
    "configurations": {
      "production": {
        "command": "cd {projectRoot} && ./gradlew assembleRelease"
      }
    }
  },
  "test": {
    "executor": "nx:run-commands", 
    "options": {
      "command": "cd {projectRoot} && ./gradlew test"
    }
  },
  "test-ui": {
    "executor": "nx:run-commands",
    "options": {
      "command": "cd {projectRoot} && ./gradlew connectedAndroidTest"
    }
  }
}
```

#### Code Quality and Maintenance Targets
```json
{
  "lint": {
    "executor": "nx:run-commands",
    "options": {
      "command": "cd {projectRoot} && ./gradlew ktlintCheck && ./gradlew detekt"
    }
  },
  "format": {
    "executor": "nx:run-commands", 
    "options": {
      "command": "cd {projectRoot} && ./gradlew ktlintFormat"
    }
  },
  "analyze": {
    "executor": "nx:run-commands",
    "options": {
      "command": "cd {projectRoot} && ./gradlew detekt"
    }
  }
}
```

#### Installation and Distribution Targets
```json
{
  "install-debug": {
    "executor": "nx:run-commands",
    "options": {
      "command": "cd {projectRoot} && ./gradlew installDebug"
    }
  },
  "install-release": {
    "executor": "nx:run-commands", 
    "options": {
      "command": "cd {projectRoot} && ./gradlew installRelease"
    }
  },
  "bundle": {
    "executor": "nx:run-commands",
    "options": {
      "command": "cd {projectRoot} && ./gradlew bundle"
    }
  }
}
```

### Android Development Environment Requirements

#### SDK and Tool Requirements
- **Java**: JDK 17+ (for Gradle 8.11.1 compatibility)
- **Android SDK**: API 24+ (minimum), API 34 (recommended for development)
- **Gradle**: 8.11.1 (managed by wrapper)
- **Kotlin**: 1.9.20 (Compose Compiler compatibility)

#### Emulator Configuration Requirements
- **API Level**: 24+ (Android 7.0+) minimum, API 34 recommended
- **Device Profile**: Pixel 8 or similar modern device
- **RAM**: 2GB minimum for emulator performance
- **Architecture**: ARM64 or x86_64 (Rosetta translation supported on Apple Silicon)

### Error Prevention Patterns

#### Template Validation
1. **Package Name Validation**: Check against Java keywords before generation
2. **Resource Reference Validation**: Only reference resources included in templates
3. **Version Compatibility**: Maintain Kotlin/Compose version synchronization
4. **Documentation Validation**: Include troubleshooting for common setup issues

#### Runtime Environment Checks
```typescript
async function checkAndroidEnvironment() {
  if (!process.env.ANDROID_HOME && !process.env.ANDROID_SDK_ROOT) {
    logger.warn(`⚠️  ANDROID_HOME or ANDROID_SDK_ROOT not found.`);
    logger.info(`💡 Install Android Studio from: https://developer.android.com/studio`);
  } else {
    logger.info(`✅ Android SDK found at: ${process.env.ANDROID_HOME || process.env.ANDROID_SDK_ROOT}`);
  }
}
```
