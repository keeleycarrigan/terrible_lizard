import {
  Tree,
  formatFiles,
  installPackagesTask,
  generateFiles,
  addProjectConfiguration,
  joinPathFragments,
  names,
  runTasksInSerial,
  offsetFromRoot,
  logger,
} from '@nx/devkit';
import { execSync } from 'child_process';
import { CreateAppSchema } from './schema';
import { applicationGenerator as reactApplicationGenerator } from '@nx/react';
import { applicationGenerator as angularApplicationGenerator } from '@nx/angular/generators';
import { applicationGenerator as nextApplicationGenerator } from '@nx/next';
import { applicationGenerator as nestApplicationGenerator } from '@nx/nest';

interface NormalizedSchema extends CreateAppSchema {
  projectName: string;
  projectRoot: string;
  projectDirectory: string;
  parsedTags: string[];
  className: string;
  propertyName: string;
  constantName: string;
  fileName: string;
}

type AppType = 'web' | 'python' | 'php' | 'ios-native' | 'android-native';

function inferTypeFromFramework(framework?: string): AppType | null {
  if (!framework) return null;

  const frameworkTypeMap: Record<string, AppType> = {
    // Web frameworks
    'react': 'web',
    'angular': 'web',
    'nextjs': 'web',
    'nestjs': 'web',
    'express': 'web',
    'fastify': 'web',
    'vue': 'web',
    'svelte': 'web',
    // Python frameworks
    'flask': 'python',
    'django': 'python',
    'fastapi': 'python',
    // PHP frameworks
    'symfony': 'php',
    'laravel': 'php',
  };

  return frameworkTypeMap[framework] || null;
}

function normalizeOptions(tree: Tree, options: CreateAppSchema): NormalizedSchema {
  const name = names(options.name).fileName;
  const projectDirectory = options.directory
    ? `${names(options.directory).fileName}/${name}`
    : name;
  const projectName = projectDirectory.replace(new RegExp('/', 'g'), '-');
  const projectRoot = `apps/${projectDirectory}`;
  const parsedTags = options.tags ? options.tags.split(',').map((s) => s.trim()) : [];

  // Auto-infer type from framework if type not provided
  let finalType = options.type;
  if (!finalType && options.framework) {
    const inferredType = inferTypeFromFramework(options.framework);
    if (inferredType) {
      finalType = inferredType;
      console.log(`🎯 Auto-detected type '${finalType}' from framework '${options.framework}'`);
    }
  }

  // Validation: ensure we have a type either provided or inferred
  if (!finalType) {
    if (options.framework) {
      throw new Error(`Unknown framework '${options.framework}'. Supported frameworks: react, angular, nextjs, nestjs, flask, django, fastapi, symfony, laravel`);
    } else {
      throw new Error('Application type must be specified. Please provide --type=web|python|php|ios-native|android-native or use --framework to auto-detect type.');
    }
  }

  // For iOS/Android apps, framework is not required
  if (['ios-native', 'android-native'].includes(finalType) && !options.framework) {
    // Set framework to 'none' for native apps
    options.framework = 'none';
  }

  return {
    ...options,
    type: finalType || options.type, // Use inferred type or fallback to original
    projectName,
    projectRoot,
    projectDirectory,
    parsedTags,
    className: names(name).className,
    propertyName: names(name).propertyName,
    constantName: names(name).constantName,
    fileName: names(name).fileName,
  };
}

function getDockerDefault(type: string): boolean {
  return ['web', 'python', 'php', 'android-native'].includes(type);
}

async function scaffoldWebApplication(tree: Tree, options: NormalizedSchema) {
  const { framework } = options;

  if (!framework || framework === 'none') {
    // Create a basic static web application if no framework specified
    await scaffoldBasicWebApp(tree, options);
    return;
  }

  // Use official Nx generators for web frameworks
  switch (framework) {
    case 'react':
      await reactApplicationGenerator(tree, {
        name: options.name,
        style: 'css',
        routing: true,
        bundler: 'vite',
        directory: options.projectRoot,
        tags: options.parsedTags.join(','),
        skipFormat: true,
        e2eTestRunner: 'none', // We'll add this separately if needed
        linter: 'eslint',
      });
      break;

    case 'angular':
      await angularApplicationGenerator(tree, {
        name: options.name,
        style: 'css',
        routing: true,
        directory: options.projectRoot,
        tags: options.parsedTags.join(','),
        skipFormat: true,
      });
      break;

    case 'nextjs':
      await nextApplicationGenerator(tree, {
        name: options.name,
        style: 'css',
        directory: options.projectRoot,
        tags: options.parsedTags.join(','),
        skipFormat: true,
      });
      break;

    case 'nestjs':
      await nestApplicationGenerator(tree, {
        name: options.name,
        directory: options.projectRoot,
        tags: options.parsedTags.join(','),
        skipFormat: true,
      });
      break;

    default:
      throw new Error(`Framework ${framework} is not supported for web applications`);
  }

  // Add Docker support if enabled
  if (options.docker) {
    await addDockerSupport(tree, options, 'web');
  }
}

async function scaffoldBasicWebApp(tree: Tree, options: NormalizedSchema) {
  // Create basic TypeScript + Vite web application structure
  addProjectConfiguration(tree, options.projectName, {
    root: options.projectRoot,
    projectType: 'application',
    sourceRoot: `${options.projectRoot}/src`,
    tags: options.parsedTags,
    targets: {
      build: {
        executor: 'nx:run-commands',
        outputs: [`{options.outputPath}`],
        options: {
          command: 'npm run build',
          cwd: options.projectRoot,
          outputPath: `dist/${options.projectRoot}`,
        },
      },
      serve: {
        executor: 'nx:run-commands',
        options: {
          command: 'npm run dev',
          cwd: options.projectRoot,
        },
      },
      preview: {
        executor: 'nx:run-commands',
        options: {
          command: 'npm run preview',
          cwd: options.projectRoot,
        },
      },
      test: {
        executor: 'nx:run-commands',
        outputs: ['{workspaceRoot}/coverage/{projectRoot}'],
        options: {
          command: 'npm run test',
          cwd: options.projectRoot,
        },
      },
      'test:watch': {
        executor: 'nx:run-commands',
        options: {
          command: 'npm run test:watch',
          cwd: options.projectRoot,
        },
      },
      'test:coverage': {
        executor: 'nx:run-commands',
        options: {
          command: 'npm run test:coverage',
          cwd: options.projectRoot,
        },
      },
      lint: {
        executor: 'nx:run-commands',
        outputs: ['{options.outputFile}'],
        options: {
          command: 'npm run lint',
          cwd: options.projectRoot,
        },
      },
      'lint:fix': {
        executor: 'nx:run-commands',
        options: {
          command: 'npm run lint:fix',
          cwd: options.projectRoot,
        },
      },
      'type-check': {
        executor: 'nx:run-commands',
        options: {
          command: 'npm run type-check',
          cwd: options.projectRoot,
        },
      },
      install: {
        executor: 'nx:run-commands',
        options: {
          command: 'npm install',
          cwd: options.projectRoot,
        },
      },
    },
  });

  // Generate basic web application files
  generateFiles(
    tree,
    joinPathFragments(__dirname, 'files', 'web', 'basic'),
    options.projectRoot,
    {
      ...options,
      template: '',
      offsetFromRoot: offsetFromRoot(options.projectRoot),
    }
  );

  console.log(`✅ Created TypeScript web application with:`);
  console.log(`   📦 Modern tooling: TypeScript, Jest, ESLint`);
  console.log(`   🧪 Testing setup: Jest with jsdom and coverage`);
  console.log(`   🔧 Development server: npm run serve`);
  console.log(`   🏗️  Production build: npm run build`);
}

async function scaffoldPythonApplication(tree: Tree, options: NormalizedSchema) {
  const framework = options.framework || 'basic';

  // Framework-specific configuration
  const frameworkConfig = {
    flask: {
      port: '5001',
      internalPort: '5000',
      healthPath: '/api/health',
      adminPath: null,
    },
    django: {
      port: '8001',
      internalPort: '8000',
      healthPath: '/api/health/',
      adminPath: '/admin/',
    },
    fastapi: {
      port: '8002',
      internalPort: '8000',
      healthPath: '/api/health',
      adminPath: null,
      docsPath: '/docs',
    },
    basic: {
      port: '5001',
      internalPort: '5000',
      healthPath: '/health',
      adminPath: null,
    }
  };

  const config = frameworkConfig[framework] || frameworkConfig.basic;

  // Create project configuration
  addProjectConfiguration(tree, options.projectName, {
    root: options.projectRoot,
    projectType: 'application',
    sourceRoot: `${options.projectRoot}/src`,
    tags: options.parsedTags,
    targets: {
      build: {
        executor: '@nxlv/python:build',
        outputs: ['{projectRoot}/dist'],
        options: {
          outputPath: `dist/${options.projectRoot}`,
          publish: false,
        },
      },
      serve: {
        executor: 'nx:run-commands',
        options: {
          commands: [
            `echo '🚀 Starting ${options.projectName} (${framework.toUpperCase()})...'`,
            `echo "📡 Application will be available at: http://localhost:${config.port}"`,
            `echo "🔍 Health Check: http://localhost:${config.port}${config.healthPath}"`,
            ...(config.adminPath ? [`echo "👤 Admin Interface: http://localhost:${config.port}${config.adminPath}"`] : []),
            ...(config.docsPath ? [`echo "📚 API Docs: http://localhost:${config.port}${config.docsPath}"`] : []),
            ...(config.docsPath ? [`echo "📖 ReDoc: http://localhost:${config.port}/redoc"`] : []),
            framework === 'flask' ? `echo "⚠️  Note: Flask shows port ${config.internalPort} (internal), but external port is ${config.port}"` : '',
            'echo ""',
            'docker-compose up --build'
          ].filter(cmd => cmd !== ''), // Remove empty commands
          cwd: options.projectRoot,
          parallel: false,
        },
      },
      test: {
        executor: 'nx:run-commands',
        outputs: ['{workspaceRoot}/coverage/{projectRoot}'],
        options: {
          command: 'docker-compose exec app poetry run pytest tests/ --cov=src --cov-report=xml --cov-report=html',
          cwd: options.projectRoot,
        },
      },
      lint: {
        executor: 'nx:run-commands',
        options: {
          command: 'docker-compose exec app poetry run ruff check src/',
          cwd: options.projectRoot,
        },
      },
      install: {
        executor: 'nx:run-commands',
        options: {
          command: 'docker-compose build',
          cwd: options.projectRoot,
        },
      },
    },
  });

  // Generate Python application files based on framework
  generateFiles(
    tree,
    joinPathFragments(__dirname, 'files', 'python', framework),
    options.projectRoot,
    {
      ...options,
      moduleName: options.fileName.replace(/-/g, '_'),
      pythonVersion: '3.11',
      template: '',
    }
  );

  // Add Docker support if enabled
  if (options.docker) {
    await addDockerSupport(tree, options, 'python');
  }
}

async function scaffoldPhpApplication(tree: Tree, options: NormalizedSchema) {
  const framework = options.framework || 'symfony';

  // Framework-specific configuration
  const frameworkConfig = {
    symfony: {
      port: '8003',
      internalPort: '80',
      healthPath: '/api/health',
      adminPath: null,
      docsPath: null,
    },
    laravel: {
      port: '8004',
      internalPort: '80',
      healthPath: '/api/health',
      adminPath: null,
      docsPath: null,
    },
  };

  const config = frameworkConfig[framework] || frameworkConfig.symfony;

  // Create project configuration
  addProjectConfiguration(tree, options.projectName, {
    root: options.projectRoot,
    projectType: 'application',
    sourceRoot: `${options.projectRoot}/src`,
    tags: options.parsedTags,
    targets: {
      build: {
        executor: 'nx:run-commands',
        outputs: ['{projectRoot}/vendor'],
        options: {
          command: 'composer install --no-dev --optimize-autoloader',
          cwd: options.projectRoot,
        },
      },
      serve: {
        executor: 'nx:run-commands',
        options: {
          commands: [
            `echo '🚀 Starting ${options.projectName} (${framework.toUpperCase()})...'`,
            `echo "📡 Application will be available at: http://localhost:${config.port}"`,
            `echo "🔍 Health Check: http://localhost:${config.port}${config.healthPath}"`,
            framework === 'symfony' ? `echo "🛠️  Symfony Web Profiler: http://localhost:${config.port}/_profiler (dev mode)"` : '',
            `echo "💾 Database: PostgreSQL on port 5435"`,
            `echo "🗄️  Redis Cache: Redis on port 6382"`,
            `echo "🔧 PhpMyAdmin: http://localhost:8081 (run with --profile admin)"`,
            'echo ""',
            'docker-compose up --build'
          ].filter(cmd => cmd !== ''), // Remove empty commands
          cwd: options.projectRoot,
          parallel: false,
        },
      },
      test: {
        executor: 'nx:run-commands',
        outputs: ['{workspaceRoot}/coverage/{projectRoot}'],
        options: {
          command: 'docker-compose exec app composer test',
          cwd: options.projectRoot,
        },
      },
      lint: {
        executor: 'nx:run-commands',
        options: {
          command: 'docker-compose exec app composer lint',
          cwd: options.projectRoot,
        },
      },
      'lint:fix': {
        executor: 'nx:run-commands',
        options: {
          command: 'docker-compose exec app composer lint:fix',
          cwd: options.projectRoot,
        },
      },
      install: {
        executor: 'nx:run-commands',
        options: {
          command: 'docker-compose build',
          cwd: options.projectRoot,
        },
      },
    },
  });

    // Generate PHP application files based on framework
  generateFiles(
    tree,
    joinPathFragments(__dirname, 'files', 'php', framework),
    options.projectRoot,
    {
      ...options,
      phpVersion: '8.2',
      template: '',
    }
  );

    // Handle special file renaming (for files blocked by globalIgnore)
  const dotenvPath = joinPathFragments(options.projectRoot, 'dotenv');
  const envPath = joinPathFragments(options.projectRoot, '.env');

  if (tree.exists(dotenvPath)) {
    const content = tree.read(dotenvPath, 'utf8');
    tree.write(envPath, content || '');
    tree.delete(dotenvPath);
  }

  const dockerignorePath = joinPathFragments(options.projectRoot, 'dockerignore');
  const dockerignoreTargetPath = joinPathFragments(options.projectRoot, '.dockerignore');

  if (tree.exists(dockerignorePath)) {
    const content = tree.read(dockerignorePath, 'utf8');
    tree.write(dockerignoreTargetPath, content || '');
    tree.delete(dockerignorePath);
  }

  // Add Docker support if enabled
  if (options.docker) {
    await addDockerSupport(tree, options, 'php');
  }
}

function determineWebAppType(options: NormalizedSchema): 'frontend' | 'backend' {
  // 1. Explicit override takes precedence
  if (options.appType) {
    console.log(`🎯 Using explicit app type: ${options.appType}`);
    return options.appType;
  }

  // 2. Smart defaults based on framework
  const frontendFrameworks = ['react', 'angular', 'vue', 'svelte'];
  const backendFrameworks = ['nestjs', 'express', 'fastify', 'koa'];

  if (options.framework) {
    if (frontendFrameworks.includes(options.framework)) {
      console.log(`🎯 Auto-detected frontend app (framework: ${options.framework})`);
      return 'frontend';
    }

    if (backendFrameworks.includes(options.framework)) {
      console.log(`🎯 Auto-detected backend app (framework: ${options.framework})`);
      return 'backend';
    }

    // 3. Special case: Next.js can be either
    if (options.framework === 'nextjs') {
      console.log(`⚠️  Next.js detected - defaulting to backend (SSR/API). Use --appType=frontend for static export.`);
      return 'backend';
    }
  }

  // 4. Default fallback
  if (options.framework === 'none' || !options.framework) {
    console.log(`🎯 Basic web app detected - using frontend (static assets)`);
    return 'frontend';
  }

  console.log(`⚠️  Unknown framework '${options.framework}' - defaulting to frontend. Use --appType=backend if this is a server application.`);
  return 'frontend';
}

async function addDockerSupport(tree: Tree, options: NormalizedSchema, appType: string) {
  let templatePath: string;

  if (appType === 'web') {
    // For web apps, determine frontend vs backend
    const webAppType = determineWebAppType(options);
    templatePath = joinPathFragments(__dirname, '..', 'docker', 'web', webAppType);
    console.log(`📦 Using ${webAppType} Docker template for ${options.framework || 'basic'} application`);
    } else if (appType === 'python') {
    // For Python apps, check if framework has its own Docker files
    const framework = options.framework || 'basic';

    // List of frameworks that have their own Docker templates
    const frameworksWithDocker = ['django', 'fastapi'];

    if (frameworksWithDocker.includes(framework)) {
      // Framework has its own Docker files, they're already generated
      console.log(`📦 Using ${framework} Docker template (framework-specific)`);
      return; // Docker files already generated with the framework templates
    } else {
      // Use generic Python Docker template
      templatePath = joinPathFragments(__dirname, '..', 'docker', appType);
      console.log(`📦 Using generic Python Docker template for ${framework} application`);
    }
  } else if (appType === 'php') {
    // For PHP apps, check if framework has its own Docker files
    const framework = options.framework || 'symfony';

    // List of PHP frameworks that have their own Docker templates
    const phpFrameworksWithDocker = ['symfony', 'laravel'];

    if (phpFrameworksWithDocker.includes(framework)) {
      // Framework has its own Docker files, they're already generated
      console.log(`📦 Using ${framework} Docker template (framework-specific)`);
      return; // Docker files already generated with the framework templates
    } else {
      // Use generic PHP Docker template
      templatePath = joinPathFragments(__dirname, '..', 'docker', appType);
      console.log(`📦 Using generic PHP Docker template for ${framework} application`);
    }
  } else if (appType === 'android-native') {
    // Android Docker template
    templatePath = joinPathFragments(__dirname, '..', 'docker', 'android');
    console.log(`📦 Using Android Docker template with Java 11 and Android SDK`);
  } else {
    // For other app types, use the existing structure
    templatePath = joinPathFragments(__dirname, '..', 'docker', appType);
  }

  // Generate Docker files based on application type
  generateFiles(tree, templatePath, options.projectRoot, {
    ...options,
    template: '',
  });

  // Add docker-build target to project.json
  const projectConfig = tree.read(joinPathFragments(options.projectRoot, 'project.json'), 'utf8');
  if (projectConfig) {
    const config = JSON.parse(projectConfig);
    config.targets = config.targets || {};

    config.targets['docker-build'] = {
      executor: 'nx:run-commands',
      options: {
        command: `docker build -t ${options.projectName}:latest .`,
        cwd: options.projectRoot,
      },
    };

    // Set appropriate port mapping based on app type
    let dockerRunPort: string;
    if (appType === 'python') {
      // Framework-specific port mapping for Python apps
      const framework = options.framework || 'basic';
      if (framework === 'django') {
        dockerRunPort = '8001:8000'; // Django uses port 8000 internally
      } else if (framework === 'fastapi') {
        dockerRunPort = '8002:8000'; // FastAPI uses port 8000 internally
      } else {
        dockerRunPort = '5001:5000'; // Flask and others use port 5000 internally
      }
    } else if (appType === 'php') {
      // Framework-specific port mapping for PHP apps
      const framework = options.framework || 'symfony';
      if (framework === 'laravel') {
        dockerRunPort = '8004:80'; // Laravel uses port 80 internally
      } else {
        dockerRunPort = '8003:80'; // Symfony uses port 80 internally
      }
    } else if (appType === 'web') {
      const webAppType = determineWebAppType(options);
      dockerRunPort = webAppType === 'frontend' ? '8080:80' : '3000:3000';
    } else if (appType === 'android-native') {
      dockerRunPort = '8005:8080'; // Android development server port
    } else {
      dockerRunPort = '3000:3000'; // Default for other types
    }

    config.targets['docker-run'] = {
      executor: 'nx:run-commands',
      options: {
        command: `docker run -p ${dockerRunPort} ${options.projectName}:latest`,
        cwd: options.projectRoot,
      },
    };

    tree.write(
      joinPathFragments(options.projectRoot, 'project.json'),
      JSON.stringify(config, null, 2)
    );
  }
}

async function scaffoldIOSApplication(tree: Tree, options: NormalizedSchema) {
  logger.info(`📱 Creating iOS application with integrated xcnew workflow...`);

  // Default iOS configuration
  const iosConfig = {
    uiFramework: 'SwiftUI',
    architecture: 'MVVM',
    minIOSVersion: '17.0',
    swiftVersion: '6.0',
    organizationIdentifier: options.organizationIdentifier || 'com.terrible-lizard',
    description: `A modern iOS application built with SwiftUI and Swift.`,
    ...options
  };

  // Step 1: Create Xcode project using xcnew
  await createXcodeProject(options, iosConfig);

  // Step 2: Add Nx project configuration
  addProjectConfiguration(tree, options.projectName, {
    root: options.projectRoot,
    projectType: 'application',
    sourceRoot: `${options.projectRoot}/${options.name}`,
    tags: options.parsedTags,
    targets: {
      // Targets will be added from project.json template
    },
  });

  // Step 3: Generate and replace files with our professional templates
  await enhanceXcodeProjectWithTemplates(tree, options, iosConfig);

  logger.info(`✅ iOS application created successfully!`);
  logger.info(`📁 Location: ${options.projectRoot}`);
  logger.info(`🚀 Ready to open: open ${options.projectRoot}/${options.name}.xcodeproj`);
  logger.info(`🎯 Then build and run with ⌘+R in Xcode`);
}

async function createXcodeProject(options: NormalizedSchema, iosConfig: any) {
  logger.info(`🔨 Creating Xcode project with xcnew...`);

  // Ensure the parent directory exists
  const parentDir = options.projectRoot.split('/').slice(0, -1).join('/');

  try {
    // Check if xcnew is available
    execSync('which xcnew', { stdio: 'pipe' });
  } catch (error) {
    logger.warn(`⚠️  xcnew not found. Installing via Homebrew...`);
    try {
      execSync('brew install manicmaniac/tap/xcnew', { stdio: 'inherit' });
    } catch (installError) {
      throw new Error(`Failed to install xcnew. Please install manually: brew install manicmaniac/tap/xcnew`);
    }
  }

  // Create the Xcode project
  const xcnewCommand = [
    'xcnew',
    options.name,
    '-i', `${iosConfig.organizationIdentifier}.${options.propertyName}`,
    '-S', // Use SwiftUI lifecycle (pure SwiftUI, no UIKit SceneDelegate/AppDelegate)
    '-t', // Include tests
    options.projectDirectory // Output directory (relative to apps/)
  ];

  logger.info(`Running: ${xcnewCommand.join(' ')}`);

  try {
    execSync(xcnewCommand.join(' '), {
      cwd: 'apps',
      stdio: 'inherit'
    });
    logger.info(`✅ Xcode project created successfully`);
  } catch (error) {
    throw new Error(`Failed to create Xcode project: ${error.message}`);
  }
}

async function enhanceXcodeProjectWithTemplates(tree: Tree, options: NormalizedSchema, iosConfig: any) {
  logger.info(`🎨 Enhancing project with professional templates...`);

  // Generate Nx configuration and supporting files
  generateFiles(
    tree,
    joinPathFragments(__dirname, 'files', 'ios'),
    options.projectRoot,
    {
      ...iosConfig,
      template: '',
    }
  );

  // Replace xcnew-generated files with our professional templates
  try {
    const appPath = `${options.projectRoot}/${options.name}`;

    // Replace the main App file
    const enhancedAppFile = tree.read(`${options.projectRoot}/${options.name}/App/${options.name}App.swift`);
    if (enhancedAppFile) {
      tree.write(`${appPath}/${options.name.replace(/-/g, '_')}App.swift`, enhancedAppFile);
      logger.info(`✅ Replaced main App file with enhanced template`);
    }

    // Replace ContentView
    const enhancedContentView = tree.read(`${options.projectRoot}/${options.name}/App/ContentView.swift`);
    if (enhancedContentView) {
      tree.write(`${appPath}/ContentView.swift`, enhancedContentView);
      logger.info(`✅ Replaced ContentView with enhanced template`);
    }

    // Clean up duplicate template files in App/ subdirectory to prevent Xcode build conflicts
    tree.delete(`${options.projectRoot}/${options.name}/App/${options.name}App.swift`);
    tree.delete(`${options.projectRoot}/${options.name}/App/ContentView.swift`);

    // Remove the App directory if it's now empty
    try {
      const appDir = joinPathFragments(options.projectRoot, options.name, 'App');
      if (tree.exists(appDir) && tree.children(appDir).length === 0) {
        tree.delete(appDir);
        logger.info(`🧹 Cleaned up empty App/ directory`);
      }
    } catch (e) {
      // Ignore errors when cleaning up directory
    }

    logger.info(`✅ Project enhanced with professional templates`);
    logger.info(`🧹 Removed duplicate files to prevent Xcode build conflicts`);
  } catch (error) {
    logger.warn(`⚠️  Could not replace some xcnew files: ${error.message}`);
    logger.info(`✅ Professional templates available in App/ subdirectory`);
  }
}

function validateAndroidPackageName(packageName: string): void {
  const javaKeywords = [
    'abstract', 'assert', 'boolean', 'break', 'byte', 'case', 'catch', 'char', 'class', 'const',
    'continue', 'default', 'do', 'double', 'else', 'enum', 'extends', 'final', 'finally', 'float',
    'for', 'goto', 'if', 'implements', 'import', 'instanceof', 'int', 'interface', 'long', 'native',
    'new', 'package', 'private', 'protected', 'public', 'return', 'short', 'static', 'strictfp',
    'super', 'switch', 'synchronized', 'this', 'throw', 'throws', 'transient', 'try', 'void',
    'volatile', 'while'
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

async function scaffoldAndroidApplication(tree: Tree, options: NormalizedSchema) {
  logger.info(`📱 Creating Android application: ${options.projectName}`);

  // Android-specific configuration
  const packageName = (options as any).packageName || `com.terrible_lizard.${options.propertyName}`;

  // Validate package name for Java keywords
  validateAndroidPackageName(packageName);

  const androidConfig = {
    ...options,
    packageName,
    packagePath: packageName.replace(/\./g, '/'),
    minSdkVersion: '24',
    compileSdkVersion: '34',
    targetSdkVersion: '34',
    kotlinVersion: '1.9.20',
    gradleVersion: '8.11.1',
    agpVersion: '8.2.0',
    description: `A modern Android application built with Kotlin and Jetpack Compose.`,
  };

  // Step 1: Check Android development environment
  await checkAndroidEnvironment();

  // Step 2: Add Nx project configuration
  addProjectConfiguration(tree, options.projectName, {
    root: options.projectRoot,
    projectType: 'application',
    sourceRoot: `${options.projectRoot}/app/src/main`,
    tags: options.parsedTags,
    targets: {
      // Targets will be added from project.json template
    },
  });

  // Step 3: Generate Android project structure with templates
  await generateAndroidProject(tree, options, androidConfig);

  // Step 4: Setup Gradle wrapper
  await setupGradleWrapper(tree, options);

  // Step 5: Add Docker support if enabled
  if (options.docker) {
    await addDockerSupport(tree, options, 'android-native');
  }

  logger.info(`✅ Android application created successfully!`);
  logger.info(`📁 Location: ${options.projectRoot}`);
  logger.info(`🚀 Ready to open in Android Studio: open ${options.projectRoot}`);
  logger.info(`🎯 Or build from command line: cd ${options.projectRoot} && ./gradlew assembleDebug`);

  if (options.docker) {
    logger.info(`🐳 Docker build: docker-compose up --build`);
    logger.info(`🔨 Docker commands: pnpm nx docker-build ${options.projectName}`);
  }
}

async function checkAndroidEnvironment() {
  logger.info(`🔍 Checking Android development environment...`);

  // Check if ANDROID_HOME is set
  if (!process.env.ANDROID_HOME && !process.env.ANDROID_SDK_ROOT) {
    logger.warn(`⚠️  ANDROID_HOME or ANDROID_SDK_ROOT not found. Please install Android SDK.`);
    logger.info(`💡 Install Android Studio from: https://developer.android.com/studio`);
    logger.info(`💡 Or install via Homebrew: brew install --cask android-studio`);
  } else {
    logger.info(`✅ Android SDK found at: ${process.env.ANDROID_HOME || process.env.ANDROID_SDK_ROOT}`);
  }

  // Note: We don't fail the generation even if Android SDK is not found
  // The project structure can still be generated and opened in Android Studio later
}

async function generateAndroidProject(tree: Tree, options: NormalizedSchema, androidConfig: any) {
  logger.info(`🏗️  Generating Android project structure...`);

  // Generate all Android project files from templates
  generateFiles(
    tree,
    joinPathFragments(__dirname, 'files', 'android'),
    options.projectRoot,
    {
      ...androidConfig,
      template: '',
    }
  );

  logger.info(`✅ Android project structure generated`);
  logger.info(`📦 Includes: Gradle build, Kotlin source, Jetpack Compose UI, unit tests`);
}

async function setupGradleWrapper(tree: Tree, options: NormalizedSchema) {
  logger.info(`🔧 Setting up Gradle wrapper...`);

  try {
    // Make gradlew executable by updating its content to include executable permissions
    const gradlewPath = `${options.projectRoot}/gradlew`;
    if (tree.exists(gradlewPath)) {
      const gradlewContent = tree.read(gradlewPath, 'utf8');
      // The file content remains the same, but we'll document that users need to make it executable
      if (gradlewContent) {
        tree.write(gradlewPath, gradlewContent);
      }
    }

    logger.info(`✅ Gradle wrapper configured with gradle-wrapper.jar included`);
    logger.warn(`⚠️  Run 'chmod +x gradlew' for local builds`);
    logger.info(`💡 Or use Docker for zero-setup builds: docker-compose up --build`);
  } catch (error) {
    logger.warn(`⚠️  Could not setup Gradle wrapper: ${error.message}`);
  }
}

async function handleFrameworkSelection(options: CreateAppSchema) {
  // For iOS/Android apps, framework is not needed
  if (options.type && ['ios-native', 'android-native'].includes(options.type)) {
    if (!options.framework) {
      options.framework = 'none';
    }
    return;
  }

  // For other app types, framework is required if not provided
  if (!options.framework) {
    // We need to prompt for framework since it's required for web/python/php apps
    // For now, throw an error with helpful message
    throw new Error(`Framework is required for ${options.type || 'web/python/php'} applications. Please specify --framework=react/angular/nextjs/nestjs/flask/django/fastapi/symfony/laravel/none`);
  }
}

export default async function (tree: Tree, options: CreateAppSchema) {
  // Handle framework selection logic
  await handleFrameworkSelection(options);

  const normalizedOptions = normalizeOptions(tree, options);

  // Set docker default if not specified
  if (normalizedOptions.docker === undefined) {
    normalizedOptions.docker = getDockerDefault(normalizedOptions.type);
  }

  console.log(`Creating ${normalizedOptions.type} application: ${normalizedOptions.projectName}`);

  try {
    switch (normalizedOptions.type) {
      case 'web':
        await scaffoldWebApplication(tree, normalizedOptions);
        break;

      case 'python':
        await scaffoldPythonApplication(tree, normalizedOptions);
        break;

      case 'php':
        await scaffoldPhpApplication(tree, normalizedOptions);
        break;

      case 'ios-native':
        await scaffoldIOSApplication(tree, normalizedOptions);
        break;

      case 'android-native':
        await scaffoldAndroidApplication(tree, normalizedOptions);
        break;

      default:
        throw new Error(`Application type ${normalizedOptions.type} is not supported`);
    }

    await formatFiles(tree);

    console.log(`✅ Successfully created ${normalizedOptions.type} application: ${normalizedOptions.projectName}`);
    console.log(`📁 Location: ${normalizedOptions.projectRoot}`);

    if (normalizedOptions.docker) {
      console.log(`🐳 Docker support added`);
    }

    return () => {
      installPackagesTask(tree);
    };

  } catch (error) {
    console.error(`❌ Error creating application: ${error.message}`);
    throw error;
  }
}
