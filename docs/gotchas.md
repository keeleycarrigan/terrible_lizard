# Gotchas and Edge Cases

This document tracks discovered issues, edge cases, and their solutions during the development of the terrible_lizard polyglot monorepo.

## Generator-Specific Issues

### Laravel Generator

#### Issue: Docker Build Fails with Missing .env File
**Symptoms**: `php artisan key:generate` fails during Docker build with "No application encryption key has been specified."

**Root Cause**: Laravel commands require `.env` file at build time, but `.env` files are excluded by `.dockerignore` for security.

**Solution**: Move Laravel-specific operations to runtime initialization script:
- Remove `php artisan key:generate`, `php artisan config:cache`, `php artisan route:cache` from Dockerfile
- Add automatic `.env` file creation in `init-db.sh.template`
- Run Laravel optimization commands at container startup

**Prevention**: For future Laravel-like frameworks, avoid build-time operations that require environment files.

#### Issue: Wrong Docker Templates Used
**Symptoms**: Laravel generator uses generic PHP Docker templates instead of Laravel-specific ones.

**Root Cause**: `phpFrameworksWithDocker` array in `tools/generators/app/index.ts` missing 'laravel'.

**Solution**: Add 'laravel' to framework array:
```typescript
const phpFrameworksWithDocker = ['symfony', 'laravel'];
```

**Prevention**: Always verify framework-specific template selection logic when adding new frameworks.

### Symfony Generator

#### Issue: Empty Directory Artifacts
**Symptoms**: Empty 'fastapi-test' directories created during Symfony generation.

**Root Cause**: Nx cache/state artifacts from previous generator runs.

**Solution**: Clear Nx cache and environment state before testing generators.

**Prevention**: Use `pnpm nx reset` between major generator changes.

#### Issue: Database Schema Not Created
**Symptoms**: Symfony app starts but database tables don't exist.

**Root Cause**: Initialization script checked schema validity instead of forcing creation.

**Solution**: Change from `doctrine:schema:validate --skip-sync` to `doctrine:schema:create --no-interaction` with graceful handling of existing tables.

### FastAPI Generator  

#### Issue: Generic Python Templates Used
**Symptoms**: FastAPI apps get incorrect port mappings and missing FastAPI-specific configurations.

**Root Cause**: Missing 'fastapi' in `frameworksWithDocker` array.

**Solution**: Add 'fastapi' to framework detection array.

**Prevention**: Framework detection arrays must be updated when adding new frameworks with custom templates.

## Docker-Related Issues

### Multi-Framework Port Conflicts
**Issue**: Multiple PHP frameworks trying to use same ports.

**Solution**: Established consistent port strategy:
- Flask: 5001:5000 (avoid macOS AirPlay conflict)
- Django: 8001:8000  
- FastAPI: 8002:8000
- Symfony: 8003:80
- Laravel: 8004:80

### .dockerignore Security vs Build Requirements
**Issue**: Security best practices (excluding .env) vs build-time requirements.

**Solution**: Runtime environment file creation in initialization scripts rather than build-time inclusion.

## Template Development Patterns

### Framework-Specific Template Selection
**Pattern**: Each framework needing custom Docker templates must be explicitly added to framework detection arrays.

**Implementation**: Update both `frameworksWithDocker` (Python) and `phpFrameworksWithDocker` (PHP) arrays in generator logic.

### Runtime vs Build-Time Operations
**Pattern**: Environment-dependent operations should happen at runtime, not build time.

**Examples**:
- Laravel key generation → runtime
- Database migrations → runtime  
- Configuration caching → runtime

## Testing Edge Cases

### Generator Isolation
**Issue**: Generators can be affected by previous test artifacts.

**Solution**: Always use fresh directories and clean Nx cache between major tests.

### Database Initialization Timing
**Issue**: Applications may start before database is ready.

**Solution**: Comprehensive database readiness checks with retries in initialization scripts.

## Performance Considerations

### Docker Build Optimization
**Pattern**: Use multi-stage builds to minimize production image size while maintaining development capabilities.

**Implementation**: Separate development and production stages with appropriate dependency copying.

### Nx Cache Invalidation
**Issue**: Nx cache can become stale during generator development.

**Solution**: Use `pnpm nx reset` when generator changes don't appear to take effect.

## Security Considerations

### Environment File Handling
**Pattern**: Never include actual environment files in Docker images.

**Implementation**: Use `.env.example` templates and runtime environment file generation.

### Database Credentials
**Pattern**: Use Docker Compose environment variables for database configuration rather than hardcoded values.

## Framework-Specific Gotchas

### Laravel
- Requires `storage/framework/{cache,sessions,views}` and `storage/logs` directories
- Application key must be generated before most Artisan commands work
- Config and route caching require valid `.env` file

### Symfony  
- Doctrine schema operations should use `--no-interaction` flag
- Composer autoloader optimization needed for production
- Cache clearing may require proper permissions

### FastAPI
- Async database operations require proper session management
- Pydantic v2 has different validation patterns than v1
- Poetry virtual environments can conflict with Docker builds

### Django
- Database migrations must run before app starts
- Static files need proper collection for production
- Admin interface requires superuser creation

### Flask
- Blueprint registration order matters for URL routing
- Application factory pattern required for proper testing
- WSGI server configuration affects performance

## Prevention Strategies

1. **Generator Testing**: Always test generators with fresh environments
2. **Documentation**: Update this file immediately when new issues are discovered
3. **Template Validation**: Verify all framework-specific arrays when adding new frameworks
4. **Docker Patterns**: Use established patterns for runtime vs build-time operations
5. **Port Management**: Follow established port assignment strategy
6. **Environment Handling**: Use runtime environment file creation for security

## iOS Application Generator (Phase 4.7.1 Complete ✅)

### Issue: Duplicate File Build Conflicts
**Symptoms**: Xcode build fails with "Multiple commands produce '/path/to/ContentView.stringsdata'" error.

**Root Cause**: Template integration creates duplicate Swift files:
- xcnew-generated files in project root
- Enhanced template files in `App/` subdirectory
- Both sets included in Xcode build process

**Solution**: Template integration system with cleanup:
```typescript
// Replace xcnew files with enhanced templates
tree.write(`${appPath}/${options.name.replace(/-/g, '_')}App.swift`, enhancedAppFile);
// CRITICAL: Clean up duplicates to prevent build conflicts
tree.delete(`${options.projectRoot}/${options.name}/App/${options.name}App.swift`);
tree.delete(`${options.projectRoot}/${options.name}/App/ContentView.swift`);
```

**Prevention**: Always clean up template files after integration to prevent Xcode conflicts.

### Issue: Framework Prompting for Native Apps
**Symptoms**: iOS generator incorrectly prompts for React/Angular framework selection.

**Root Cause**: Generator framework validation didn't account for native mobile apps that don't use web frameworks.

**Solution**: Preprocess options for native apps:
```typescript
// For iOS/Android apps, framework is not needed
if (options.type && ['ios-native', 'android-native'].includes(options.type)) {
  if (!options.framework) {
    options.framework = 'none';
  }
}
```

**Prevention**: Account for non-web application types in framework validation logic.

### Issue: xcnew Hybrid UIKit/SwiftUI Projects
**Symptoms**: xcnew default creates hybrid projects with UIKit SceneDelegate/AppDelegate pattern.

**Root Cause**: xcnew `-s` flag creates SwiftUI with UIKit lifecycle, not pure SwiftUI.

**Solution**: Use `-S` flag for pure SwiftUI App lifecycle:
```typescript
const xcnewCommand = [
  'xcnew', options.name,
  '-S', // Use SwiftUI lifecycle (pure SwiftUI, no UIKit)
  '-t'  // Include tests
];
```

**Prevention**: Use correct xcnew flags for desired iOS project architecture.

### Command Line Tool Dependencies
**Issue**: xcnew requires Homebrew installation which may not be available.

**Solution**: Automatic installation with fallback:
```typescript
try {
  execSync('which xcnew', { stdio: 'pipe' });
} catch (error) {
  logger.warn(`⚠️  xcnew not found. Installing via Homebrew...`);
  execSync('brew install manicmaniac/tap/xcnew', { stdio: 'inherit' });
}
```

**Prevention**: Check for dependencies and provide automatic installation when possible.

### iOS Simulator Version Compatibility
**Issue**: Xcode build can fail if specified iOS simulator version doesn't match available simulators.

**Root Cause**: iOS SDK versions change with Xcode updates.

**Solution**: Use available simulator rather than hardcoded versions in build commands.

**Prevention**: Dynamic simulator detection for iOS testing targets.

## Android Application Generator (Phase 4.7.2 Complete ✅)

### Issue: Java Keywords in Package Names
**Symptoms**: Android Studio shows "Namespace 'com.test.final' is not a valid Java package name as 'final' is a Java keyword" error.

**Root Cause**: Project names containing Java keywords (like 'final', 'class', 'static') generate package names with reserved Java keywords.
- Example: `test-android-final` → package `com.test.final` → 'final' is Java keyword

**Solution**: Added `validateAndroidPackageName()` function that validates against 47 Java keywords:
```typescript
function validateAndroidPackageName(packageName: string): void {
  const javaKeywords = ['abstract', 'boolean', 'break', 'case', 'catch', 'class', 'const', 'continue', 'default', 'do', 'else', 'enum', 'extends', 'final', 'finally', 'float', 'for', 'if', 'implements', 'import', 'int', 'interface', 'long', 'native', 'new', 'package', 'private', 'protected', 'public', 'return', 'short', 'static', 'super', 'switch', 'this', 'throw', 'throws', 'try', 'void', 'volatile', 'while'];
  
  const parts = packageName.split('.');
  for (const part of parts) {
    if (javaKeywords.includes(part.toLowerCase())) {
      throw new Error(`Invalid package name: "${part}" is a Java keyword...`);
    }
  }
}
```

**Prevention**: Generator now validates package names and provides clear error messages for Java keyword conflicts.

### Issue: Kotlin Version Compatibility with Compose
**Symptoms**: Build fails with "Compose Compiler 1.5.4 requires Kotlin 1.9.20 or higher" error.

**Root Cause**: Template used Kotlin 1.9.10 but Compose Compiler 1.5.4 requires Kotlin 1.9.20+.

**Solution**: Updated Kotlin version in generator templates:
```typescript
const androidConfig = {
  kotlinVersion: '1.9.20', // Updated from 1.9.10
  // ...
};
```

**Prevention**: Keep Kotlin versions synchronized with Compose Compiler requirements in templates.

### Issue: Missing App Icon References
**Symptoms**: Build warnings about missing `@mipmap/ic_launcher` and `@mipmap/ic_launcher_round` resources.

**Root Cause**: AndroidManifest.xml template referenced icon resources not included in template structure.

**Solution**: Removed icon references from AndroidManifest template:
```xml
<!-- REMOVED: android:icon="@mipmap/ic_launcher" -->
<!-- REMOVED: android:roundIcon="@mipmap/ic_launcher_round" -->
<application
    android:allowBackup="true"
    android:label="@string/app_name"
    android:theme="@style/Theme.AppName">
```

**Prevention**: Only reference resources that are actually included in template structure.

### Issue: Gradle Version Outdated
**Symptoms**: Android Studio auto-updates Gradle from template version, causing version inconsistencies.

**Root Cause**: Template used Gradle 8.5 while latest stable is 8.11.1.

**Solution**: Updated Gradle version in generator:
```typescript
gradleVersion: '8.11.1', // Updated from 8.5
```

**Prevention**: Keep Gradle versions current with latest stable releases.

### Issue: App Crashes Immediately on Emulator
**Symptoms**: Android app starts then immediately closes with no visible error in Android Studio.

**Root Cause**: Emulator running API level lower than app's `minSdk = 24` requirement.

**Solution**: Added comprehensive documentation about emulator requirements:
- Clear API 24+ requirement in README templates
- Troubleshooting section for "app crashes immediately" 
- Step-by-step emulator creation with proper API selection

**Prevention**: Document minimum SDK requirements prominently and provide emulator setup guidance.

### Issue: Wrong Project Folder Opened in Android Studio
**Symptoms**: Android Studio shows Gradle sync errors and project structure appears broken.

**Root Cause**: Opening `apps/project-name/app/` folder instead of `apps/project-name/` (entire project).

**Solution**: Added clear documentation about proper project opening:
- ✅ **Correct**: Open `apps/your-app-name/`
- ❌ **Wrong**: Open `apps/your-app-name/app/`

**Prevention**: Include explicit folder opening instructions in generated README files.

---

**Last Updated**: June 8, 2025 (Session 4 - Part 2)  
**Contributors**: AI Assistant  
**Status**: Living document - update when new issues discovered  
**Latest Addition**: Android Application Generator issues and solutions 
