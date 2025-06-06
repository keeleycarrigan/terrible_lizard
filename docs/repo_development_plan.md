# Monorepo Development Plan: Step-by-Step Checklist

## Phase 1: Foundation and Monorepo Strategy

### 1.1. Introduction to the Polyglot Monorepo Vision
- [x] **AI Task:** Review and understand the strategic advantages of a polyglot monorepo, including benefits like simplified dependency management, code sharing, atomic commits, and streamlined CI/CD. [1, 2]
- [x] **AI Task:** Understand the importance of avoiding mere "code collocation" by implementing proper tooling and defined relationships. [2, 3]
- [x] **AI Task:** Acknowledge the role of the AI code generator in automating tasks and ensuring adherence to architectural principles.

### 1.2. Selecting the Primary Monorepo Management Tool: Nx
- [x] **AI Task:** Confirm **Nx** as the primary monorepo management tool. [4, 5]
- [x] **AI Task:** Note Nx's suitability for polyglot environments (JavaScript/TypeScript, Python via `@nxlv/python` [6], PHP via custom generators/`@nx-php/composer-plugin` [7, 8], Android via `@nx/gradle` [9], iOS via custom generators [10, 11, 12]).
- [x] **AI Task:** Understand that the AI will be responsible for developing custom Nx plugins and generators where official/community support is lacking (e.g., pure native iOS, complex PHP). [13, 14]

### 1.3. High-Level Architectural Principles
- [x] **AI Task:** Implement a clear separation of concerns with `apps/` for deployable units and `libs/` for reusable code (target 80% code in libs). [15, 16]
- [x] **AI Task:** Ensure libraries expose well-defined public APIs (e.g., using `enforce-module-boundaries` for TS). [2, 17]
- [x] **AI Task:** Strive for consistency in tooling and commands across project types (e.g., `nx build <project>`, `nx test <project>`). [2]
- [x] **AI Task:** Design for scalability and performance, utilizing Nx "affected" commands and caching. [2, 4, 5]
- [x] **AI Task:** Prioritize Developer Experience (DX) through ease of onboarding, code discoverability, and efficient workflows. [2, 18]

## Phase 2: Monorepo Setup and Core Structure

### 2.1. Initializing the Nx Workspace
- [x] **AI Task:** Execute the command to initialize a new, empty Nx workspace: `npx create-nx-workspace@latest <workspace-name> --preset=empty`. [19]
    - [x] Use `pnpm` as the package manager if feasible. [20, 21] *✅ Switched to pnpm after initial setup*
- [x] **AI Task:** Verify the creation of core configuration files: `nx.json`, `package.json`, `pnpm-lock.yaml` (if pnpm used), `tsconfig.base.json`.

### 2.2. Establishing the Top-Level Directory Structure
- [x] **AI Task:** Create the following top-level directories:
    - [x] `apps/` (for deployable applications) [15, 16, 21]
    - [x] `libs/` (for shared and non-deployable code modules) [15, 16, 21]
    - [x] `tools/` (for custom workspace tooling, including Nx generators) [13]
    - [x] `docs/` (for project-wide documentation) *Pre-existing*
    - [x] `config/` (Optional: for shared global configurations)

### 2.3. Root-Level Configuration Files
- [x] **AI Task:** Generate/Manage `nx.json`:
    - [x] Define installed Nx plugins and their configurations.
    - [x] Set default options for targets.
    - [x] Configure workspace layout settings.
- [x] **AI Task:** Generate/Manage root `package.json`:
    - [x] List dev dependencies for Nx, plugins, and workspace tooling (Prettier, ESLint).
    - [x] Define root-level scripts.
- [x] **AI Task:** Generate `pnpm-workspace.yaml` (if pnpm is used), listing `apps/*` and `libs/*`. [21, 22, 23]
- [x] **AI Task:** Generate `tsconfig.base.json` with common compiler options and path mappings for shared libraries (e.g., `@<workspace-name>/lib-a`). [24, 25]
- [x] **AI Task:** Generate a comprehensive `.gitignore` file. *Pre-existing*
- [x] **AI Task:** Generate root linting and formatting configurations:
    - [x] JavaScript/TypeScript: `.eslintrc.json`, `.prettierrc`. [15]
    - [x] Python: Root `pyproject.toml` with shared Ruff/Black configurations. [26, 27]
    - [x] PHP: Root `.php-cs-fixer.dist.php` or `phpcs.xml`. [28, 29]

### 2.4. Dependency Management Strategy
- [ ] **AI Task:** Implement single version policy for JavaScript/TypeScript dependencies in the root `package.json`. [30]
- [ ] **AI Task:** For Python projects, ensure dependencies are managed via `pyproject.toml` (Poetry/Uv), integrated with `@nxlv/python`. [6]
    - [ ] Consider strategy for shared vs. isolated Python virtual environments. [6, 31]
- [ ] **AI Task:** For PHP projects, ensure dependencies are managed via `composer.json` (Composer), integrated with custom Nx generators or `@nx-php/composer-plugin`. [7]
- [ ] **AI Task:** For Native Mobile (iOS/Android):
    - [ ] iOS: Manage dependencies via CocoaPods (`Podfile`) or SPM. Integrate with custom Nx generators. [12]
    - [ ] Android: Manage dependencies via Gradle (`build.gradle`/`.kts`). Integrate with `@nx/gradle` plugin. [9]
- [ ] **AI Task:** (Optional) Design and implement custom Nx build executors for bundling local library dependencies into application packages for Python/PHP if private registries are to be avoided. [6]

## Phase 3: Library Scaffolding (`libs/`)

### 3.1. Designing the CLI Command for Library Creation
- [ ] **AI Task:** Define the structure for the AI-interpreted command:
    `ai-gen create-lib <lib-name> --type <ui|networking|utility|python|php|ios-native|android-native> [--tags <tag1,tag2>][--publishable][--importPath <@scope/lib-name>][--directory <path/to/lib>]`
    - [ ] Ensure all parameters are understood for subsequent generator implementation.

### 3.2. Implementing the Nx Generator for Libraries
- [ ] **AI Task:** Create a custom Nx generator at `tools/generators/create-lib/index.ts`.
    - [ ] **Core Structure (All library types):**
        - [ ] Create library directory: `libs/<directory-if-provided>/<lib-name>`.
        - [ ] Generate `project.json` with root path, source root, project type (`library`), tags, and language-specific lint/test/build targets.
        - [ ] Generate a basic `README.md`.
    - [ ] **JavaScript/TypeScript Libraries (`--type ui | networking | utility`):**
        - [ ] Invoke official Nx generators (e.g., `@nx/js:library`). [13, 32]
        - [ ] Generate standard JS/TS structure (`src/index.ts`, `package.json`, `tsconfig.lib.json`).
        - [ ] Setup Jest/Vitest, ESLint.
        - [ ] If `--publishable`, configure build target and package.json for distribution. [32]
    - [ ] **Python Libraries (`--type python`):**
        - [ ] Invoke `@nxlv/python:poetry-project --projectType=library` or `uv-project`. [6]
        - [ ] Generate `pyproject.toml`, source directory, `tests/` directory.
        - [ ] Setup Pytest, Ruff/Flake8+Black.
        - [ ] If `--publishable`, configure build target for wheel/sdist.
    - [ ] **PHP Libraries (`--type php`):**
        - [ ] Generate `composer.json` with PSR-4 autoloading for `src/`. [13, 33, 34]
        - [ ] Create `src/` and `tests/` directories.
        - [ ] Setup PHPUnit (`phpunit.xml.dist`), PHP CS Fixer (`.php-cs-fixer.dist.php`).
        - [ ] Run `composer install` if initial dev dependencies are specified.
        - [ ] If `--publishable`, ensure `composer.json` is ready for Packagist.
    - [ ] **Native iOS Libraries (`--type ios-native` - Framework/Static Library):**
        - [ ] Generate Xcode project structure: `<lib-name>.xcodeproj`, `Sources/`, `Tests/`, `Info.plist`.
        - [ ] Template a minimal but valid `.xcodeproj/project.pbxproj`.
        - [ ] Template `Info.plist` with bundle identifier. [35]
        - [ ] Create placeholder Swift source and XCTest files.
        - [ ] Configure `project.json` targets to use `xcodebuild`.
        - [ ] Integrate SwiftLint.
    - [ ] **Native Android Libraries (`--type android-native` - Module):**
        - [ ] Generate Android library module structure: `build.gradle.kts`, `src/main/kotlin/` (or `java/`), `src/main/AndroidManifest.xml`, test directories.
        - [ ] Template `build.gradle.kts` for an Android library.
        - [ ] Template minimal `AndroidManifest.xml`.
        - [ ] Create placeholder Kotlin/Java source and JUnit test files.
        - [ ] Configure `project.json` targets to use `gradlew` (potentially via `@nx/gradle`). [9]

## Phase 4: Application Scaffolding (`apps/`)

### 4.1. Designing the CLI Commands for Application Creation
- [ ] **AI Task:** Define the structure for the AI-interpreted command:
    `ai-gen create-app <app-name> --type <web|ios-native|android-native|php|python> [--framework <react|angular|nextjs|nestjs|flask|django|symfony|laravel>][--docker][--tags <tag1,tag2>][--directory <path/to/app>]`
    - [ ] Ensure all parameters, especially `--type`, `--framework`, and `--docker`, are understood for subsequent generator implementation.

### 4.2. Web Application Scaffolding (`--type web`)
- [ ] **AI Task:** Implement/Call Nx generator for web applications.
    - [ ] If `--framework` (React, Angular, Next.js, etc.) is specified, invoke the corresponding official Nx plugin's application generator (e.g., `@nx/react:application`). [36, 37]
    - [ ] If no framework, create a basic static HTML/JS/CSS or simple Node.js Express app.
    - [ ] **If `--docker` is true (default for many web types):** [38]
        - [ ] Generate a multi-stage `Dockerfile` (build stage for dependencies/compilation, lean production stage). [39, 40]
        - [ ] Generate `docker-compose.yml` defining the app service, port mapping, and development volume mounts for hot reloading. [40, 41]
        - [ ] Ensure dev servers (Vite, Webpack Dev Server) are configured for Docker (listen on `0.0.0.0`, polling if needed). [41, 42]
    - [ ] **If `--docker` is false:**
        - [ ] Setup for direct local serving via `nx serve <app-name>`.

### 4.3. PHP Application Scaffolding (`--type php`)
- [ ] **AI Task:** Implement a custom Nx generator for PHP applications.
    - [ ] Generate `composer.json` with PSR-4 autoloading for `src/`. [33, 34]
    - [ ] If `--framework` (Symfony, Laravel) is specified:
        - [ ] Include framework dependencies in `composer.json`.
        - [ ] Optionally, run the framework's own CLI for project creation (e.g., `composer create-project symfony/skeleton`) and then integrate into Nx. [14, 43]
    - [ ] Create standard PHP app structure (`public/index.php`, `src/`, `config/`, `tests/`).
    - [ ] Setup PHPUnit (`phpunit.xml.dist`), PHP CS Fixer (`.php-cs-fixer.dist.php`), Psalm (`psalm.xml`). [28, 29, 44]
    - [ ] Run `composer install`.
    - [ ] **If `--docker` is true (default for PHP):**
        - [ ] Generate a multi-stage `Dockerfile` (composer install stage, PHP-FPM runtime stage). [39]
        - [ ] Generate `docker-compose.yml` with services for PHP-FPM, a web server (Nginx/Apache), and optionally a database. [45]
        - [ ] Include volume mounts for development and configure Xdebug if feasible.

### 4.4. Python Application Scaffolding (`--type python`)
- [ ] **AI Task:** Implement/Call Nx generator for Python applications.
    - [ ] Utilize `@nxlv/python:poetry-project --projectType=application` or `uv-project`. [6]
    - [ ] If `--framework` (Flask, Django, FastAPI) is specified:
        - [ ] Add framework dependencies to `pyproject.toml`.
        - [ ] Scaffold basic framework structure (e.g., `app.py`, `manage.py`) potentially using `@nxlv/python`'s `templateDir` option with AI-generated EJS templates. [6]
    - [ ] Setup Pytest, Ruff/Flake8+Black. [6, 26, 27, 46, 47]
    - [ ] **If `--docker` is true (default for Python):**
        - [ ] Generate a multi-stage `Dockerfile` (builder stage for dependencies, slim runtime stage with Gunicorn/Uvicorn). [39, 48, 49]
        - [ ] Generate `docker-compose.yml` with services for the Python app and optionally a database.
        - [ ] Include volume mounts for development and configure hot reloading (e.g., Uvicorn `--reload`). [48, 49]

### 4.5. Native iOS Application Scaffolding (`--type ios-native`)
- [ ] **AI Task:** Implement a custom Nx generator for native iOS applications.
    - [ ] Create Xcode project structure: `<app-name>.xcodeproj`, `Sources/`, `Resources/`, `<app-name>Tests/`.
    - [ ] **File Templating:**
        - [ ] Generate a minimal, valid `.xcodeproj/project.pbxproj` (likely via a complex EJS template).
        - [ ] Generate `Info.plist` with bundle identifier, display name, etc. [35, 50]
        - [ ] Generate `AppDelegate.swift`, `ViewController.swift` (UIKit) or `App.swift`/`ContentView.swift` (SwiftUI).
        - [ ] Generate XCTest boilerplate.
        - [ ] Create basic `Assets.xcassets`.
        - [ ] Generate `.gitignore` for Xcode/Swift.
    - [ ] Configure `project.json` targets (`build`, `test`, `run`) to use `nx:run-commands` with `xcodebuild`. [8, 12, 50]
    - [ ] Note: `--docker` is false/inapplicable.

### 4.6. Native Android Application Scaffolding (`--type android-native`)
- [ ] **AI Task:** Implement a custom Nx generator for native Android applications.
    - [ ] Option 1: Execute `gradle init --type kotlin-application...` then augment. [51]
    - [ ] Option 2: Fully template the Gradle project structure.
    - [ ] Ensure creation/modification of:
        - [ ] Root `build.gradle.kts`, `settings.gradle.kts`.
        - [ ] App module `build.gradle.kts` (with `com.android.application` plugin, dependencies, SDK versions, `applicationId`).
        - [ ] `src/main/kotlin/.../MainActivity.kt`, layout XMLs.
        - [ ] `src/main/AndroidManifest.xml`. [52]
        - [ ] Test directories and example tests (JUnit, Espresso).
    - [ ] Configure `project.json` targets (`build`, `test`, `androidTest`, `run`) to use `@nx/gradle:gradle` or `nx:run-commands` with `./gradlew`. [9, 12, 53]
    - [ ] Note: `--docker` is false/inapplicable.

## Phase 5: Build, Test, and Lint Integration

### 5.1. Configuring Nx Targets in `project.json`
- [ ] **AI Task:** For every scaffolded app and library, ensure its `project.json` includes:
    - [ ] **Standard Targets:** `build`, `serve` (for web/APIs), `test`, `lint`.
    - [ ] **Additional Targets (as applicable):** `docker-build`, `package`, `run-ios`, `run-android`, `pod-install`.
    - [ ] **Executor Configuration:** Use official Nx executors, community plugin executors (e.g., `@nxlv/python`, `@nx/gradle`), or `nx:run-commands` for custom scripts. [6, 7, 8, 9, 10, 54, 55]
    - [ ] **Caching Configuration:** Define `outputs` and `inputs` for targets to enable Nx caching, especially for `nx:run-commands`. [2, 8]

### 5.2. Shared Linting and Formatting Configurations
- [ ] **AI Task:** Ensure project-level lint/format configurations extend or use root-level configurations.
    - [ ] **JS/TS:** Project `.eslintrc.json` extends root; `tsconfig.json` extends `tsconfig.base.json`.
    - [ ] **Python:** Project `pyproject.toml` extends root `pyproject.toml` for Ruff/Black using Ruff's `extend` option. [6, 26]
    - [ ] **PHP:** Project `.php-cs-fixer.dist.php` uses/extends root, or `lint` target uses root config. Setup Psalm with `psalm.xml`. [44]
    - [ ] **iOS (Swift):** Project `.swiftlint.yml` uses/includes root; `lint` target runs `swiftlint`.
    - [ ] **Android (Kotlin):** Project uses root `.editorconfig` for ktlint; `lint` target runs `gradlew ktlintCheck` or `gradlew lintDebug`.

### 5.3. Testing Strategies
- [ ] **AI Task:** For every scaffolded app and library, generate initial test configurations and example tests.
    - [ ] **Unit Tests:**
        - [ ] JS/TS: Jest/Vitest. [12]
        - [ ] Python: Pytest. [6]
        - [ ] PHP: PHPUnit. [7]
        - [ ] iOS: XCTest.
        - [ ] Android: JUnit, Robolectric.
    - [ ] **E2E Tests (for applications):**
        - [ ] Web: Cypress/Playwright (using `@nx/cypress` or `@nx/playwright`). [10, 54]
        - [ ] iOS: XCUITest.
        - [ ] Android: Espresso.
        - [ ] (Consider Appium for cross-platform mobile E2E). [12]
    - [ ] Ensure `project.json` has correctly configured `test` targets.

## Phase 6: Custom Nx Generator Development (`tools/generators/`)

### 6.1. Guiding the AI to Create Custom Nx Generators
- [ ] **AI Task:** For each custom generator (e.g., `create-lib`, `create-app`, `setup-php-docker`):
    - [ ] Create generator directory in `tools/generators/`. [13]
    - [ ] Generate `index.ts` (main generator function).
    - [ ] Generate `schema.json` (defines options, types, defaults, validation). [13]
    - [ ] Generate `schema.d.ts` (TypeScript interface for schema).
    - [ ] Create `files/` subdirectory for EJS templates. [14]
    - [ ] Utilize `@nx/devkit` API: `Tree`, `formatFiles`, `installPackagesTask`, `generateFiles`, `read/update/addProjectConfiguration`, `runTasksInSerial`, `joinPathFragments`, `names`. [11, 13, 14]
    - [ ] Implement logic to compose with other Nx generators where appropriate. [13, 56]

### 6.2. File Templating for Polyglot Configuration
- [ ] **AI Task:** Create EJS templates (`.ejs`) within each generator's `files/` directory for:
    - [ ] PHP: `composer.json.ejs` (with dynamic name, PSR-4 autoload). [13, 33, 34]
    - [ ] Python: `pyproject.toml.ejs` (with dynamic name, Python version, dependencies). [6, 26]
    - [ ] iOS: `Info.plist.ejs`, and critically, `.xcodeproj/project.pbxproj.ejs`. [35]
    - [ ] Android: `AndroidManifest.xml.ejs`, `build.gradle.kts.ejs`. [51, 52]
    - [ ] Docker: `Dockerfile.ejs`, `docker-compose.yml.ejs`. [38, 39]
    - [ ] Use `__variable__` syntax for dynamic file/folder names.
    - [ ] Ensure `generateFiles` is used with correct substitutions. [14]

### 6.3. Running Shell Commands within Generators
- [ ] **AI Task:** Within generator `index.ts` files, use Node.js `child_process.execSync` for necessary shell commands.
    - [ ] **PHP:** `composer install`, `composer dump-autoload`, `composer create-project` (if used). [33, 43]
    - [ ] **Python:** `poetry install` or `uv pip sync`. [6]
    - [ ] **Android:** `gradle init` (if used for initial scaffolding). [51]
    - [ ] Implement error handling (`try...catch`) for shell commands.
    - [ ] Ensure commands are idempotent where possible.

## Phase 7: CI/CD, Versioning, and AI Management

### 7.1. CI/CD Pipeline Considerations
- [ ] **AI Task:** Design CI pipeline scripts to use Nx "affected" commands (`nx affected:build`, `nx affected:test`, `nx affected:lint`). [2, 3, 4, 57]
- [ ] **AI Task:** Plan for Nx Cloud integration for Distributed Task Execution (DTE) and remote caching. [4, 5, 58, 59]
- [ ] **AI Task:** Define CI pipeline stages (Lint, Test, Build, Package, Deploy).
- [ ] **AI Task:** Address diverse build environment needs (macOS for iOS, Android SDK for Android, specific runtimes for Python/PHP/Node.js) potentially using Docker for CI agents.
- [ ] **AI Task:** For Dockerized apps, ensure CI builds, tags, and pushes images to a registry.
- [ ] **AI Task:** For native mobile apps, ensure CI archives/signs and prepares `.ipa`/`.aab` for distribution.

### 7.2. Versioning and Publishing Strategy
- [ ] **AI Task:** Configure `nx release` for JS/TS libraries. [60, 61]
    - [ ] Support independent project releases if needed (project-specific tags, changelogs). [60]
- [ ] **AI Task:** For non-JavaScript libraries (Python, PHP, Native Mobile):
    - [ ] Leverage `nx release` for Git tagging and changelogs.
    - [ ] Implement custom executors/scripts to update versions in `pyproject.toml`, `composer.json`, `Info.plist`, `build.gradle.kts`.
    - [ ] Integrate with native publishing tools (`poetry publish`, `uv publish`, Packagist, binary repositories). [6]
- [ ] **AI Task:** For applications, versioning may be tied to Git SHAs or CI build numbers.

### 7.3. Managing the AI Code Generator
- [ ] **User Task:** Provide this plan to the AI in manageable sections.
- [ ] **User Task:** Use specific prompts, referencing this plan and Nx APIs.
- [ ] **User Task:** Iteratively review AI-generated code, validate outputs (static analysis, functional testing of generators, manual inspection of complex files).
- [ ] **User Task:** Ensure AI correctly implements `schema.json` for custom generators.
- [ ] **User Task:** Maintain human oversight for architectural decisions and complex issues.

Based on the research conducted to generate the development plan, here is a formatted list of the key sources that informed the strategy:

### Core Monorepo & Nx Tooling

1.  **Nx Official Documentation**: The primary source for all Nx features, including core concepts, CLI commands, and plugin architecture.
      * URL: [https://nx.dev/getting-started/intro](https://nx.dev/getting-started/intro)
2.  **Nx Local Generators Guide**: Documentation detailing how to create custom, workspace-specific code generators.
      * URL: [https://nx.dev/extending-nx/recipes/local-generators](https://nx.dev/extending-nx/recipes/local-generators)
3.  **Lerna Official Documentation**: Source for understanding Lerna's role in versioning and publishing, now powered by Nx.
      * URL: [https://lerna.js.org/](https://lerna.js.org/)
4.  **PNPM Workspaces Documentation**: Information on how PNPM handles monorepo dependency management.
      * URL: [https://pnpm.io/workspaces](https://pnpm.io/workspaces)

### Language & Platform Integration

5.  **`@nxlv/python` Plugin**: The key community plugin for integrating Python (using Poetry or Uv) into an Nx workspace.
      * URL: [https://www.npmjs.com/package/@nxlv/python](https://www.npmjs.com/package/@nxlv/python)
6.  **`@nx/gradle` Plugin Documentation**: The official Nx plugin for integrating and managing Gradle projects, essential for native Android development.
      * URL: [https://nx.dev/nx-api/gradle](https://nx.dev/nx-api/gradle)
7.  **`@nx/react-native` Plugin Documentation**: Served as a reference for how Nx can wrap native toolchains for mobile development.
      * URL: [https://nx.dev/nx-api/react-native](https://nx.dev/nx-api/react-native)
8.  **`graycoreio/nx-php` GitHub Repository**: A work-in-progress community plugin for PHP, providing patterns for Composer and PHPUnit integration.
      * URL: [https://github.com/graycoreio/nx-php](https://github.com/graycoreio/nx-php)
9.  **Gradle `init` Task Documentation**: Official documentation on how to use Gradle's init task to scaffold new projects, a key strategy for the Android generator.
      * URL: [https://docs.gradle.org/current/userguide/build\_init\_plugin.html](https://docs.gradle.org/current/userguide/build_init_plugin.html)
10. **Apple Developer Documentation - Bundle Structures**: Authoritative source for the structure of application and framework bundles for iOS/macOS.
      * URL: [https://developer.apple.com/library/archive/documentation/CoreFoundation/Conceptual/CFBundles/BundleTypes/BundleTypes.html](https://developer.apple.com/library/archive/documentation/CoreFoundation/Conceptual/CFBundles/BundleTypes/BundleTypes.html)
11. **Composer (PHP Dependency Manager)**: Official documentation for PHP's dependency manager.
      * URL: [https://getcomposer.org/](https://getcomposer.org/)
12. **PHP-FIG PSR-4 Autoloader Standard**: The specification for autoloading classes from file paths, fundamental to structuring modern PHP projects.
      * URL: [https://www.php-fig.org/psr/psr-4/](https://www.php-fig.org/psr/psr-4/)

### Dockerization & Configuration

13. **Docker Best Practices Guide**: Official guide from Docker on best practices for writing Dockerfiles, including multi-stage builds.
      * URL: [https://docs.docker.com/develop/develop-images/dockerfile\_best-practices/](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/)
14. **TestDriven.io - Docker for Python/Poetry**: An article providing a clear example of creating development- and production-ready multi-stage Dockerfiles for Poetry projects.
      * URL: [https://testdriven.io/blog/dockerizing-python-with-poetry/](https://www.google.com/search?q=https://testdriven.io/blog/dockerizing-python-with-poetry/)
15. **Ruff Linter Documentation**: Source for configuring the Ruff linter, including its `extend` functionality for hierarchical configurations in a monorepo.
      * URL: [https://docs.astral.sh/ruff/configuration/](https://docs.astral.sh/ruff/configuration/)
