import {
    addProjectConfiguration,
    formatFiles,
    generateFiles,
    Tree,
    names,
} from '@nx/devkit';
import * as path from 'path';
import { CreateLibGeneratorSchema } from './schema';

interface NormalizedOptions extends Omit<CreateLibGeneratorSchema, 'tags'> {
    projectRoot: string;
    projectDirectory: string;
    projectName: string;
    className: string;
    propertyName: string;
    constantName: string;
    fileName: string;
    tags: string[];
}

function normalizeOptions(tree: Tree, options: CreateLibGeneratorSchema): NormalizedOptions {
    const name = names(options.name).fileName;
    const projectDirectory = options.directory
        ? `${names(options.directory).fileName}/${name}`
        : name;
    const projectName = projectDirectory.replace(new RegExp('/', 'g'), '-');
    const projectRoot = `libs/${projectDirectory}`;
    const parsedTags = options.tags ? options.tags.split(',').map((s) => s.trim()) : [];

    return {
        ...options,
        projectName,
        projectRoot,
        projectDirectory,
        className: names(name).className,
        propertyName: names(name).propertyName,
        constantName: names(name).constantName,
        fileName: names(name).fileName,
        tags: parsedTags,
    };
}

function getTargetsForType(type: string): Record<string, any> {
    switch (type) {
        case 'python':
            return {
                build: {
                    executor: '@nxlv/python:build',
                    outputs: ['{projectRoot}/dist'],
                    options: {
                        ignorePaths: ['.venv', '.tox', 'tests/'],
                    },
                },
                test: {
                    executor: 'nx:run-commands',
                    options: {
                        command: 'poetry run pytest tests/',
                        cwd: '{projectRoot}',
                    },
                },
                lint: {
                    executor: 'nx:run-commands',
                    options: {
                        command: 'poetry run ruff check src/',
                        cwd: '{projectRoot}',
                    },
                },
                install: {
                    executor: 'nx:run-commands',
                    options: {
                        command: 'poetry install',
                        cwd: '{projectRoot}',
                    },
                },
            };
        case 'php':
            return {
                test: {
                    executor: 'nx:run-commands',
                    options: {
                        command: 'composer exec phpunit',
                        cwd: '{projectRoot}',
                    },
                },
                lint: {
                    executor: 'nx:run-commands',
                    options: {
                        command: 'composer exec php-cs-fixer fix --dry-run --diff',
                        cwd: '{projectRoot}',
                    },
                },
                'lint:fix': {
                    executor: 'nx:run-commands',
                    options: {
                        command: 'composer exec php-cs-fixer fix',
                        cwd: '{projectRoot}',
                    },
                },
            };
        case 'ios-native':
            return {
                build: {
                    executor: 'nx:run-commands',
                    options: {
                        command: `xcodebuild build -project {projectName}.xcodeproj -scheme {projectName} -configuration Debug -sdk iphonesimulator`,
                        cwd: '{projectRoot}',
                    },
                },
                test: {
                    executor: 'nx:run-commands',
                    options: {
                        command: `xcodebuild test -project {projectName}.xcodeproj -scheme {projectName} -configuration Debug -sdk iphonesimulator -destination 'platform=iOS Simulator,name=iPhone 15'`,
                        cwd: '{projectRoot}',
                    },
                },
                lint: {
                    executor: 'nx:run-commands',
                    options: {
                        command: 'swiftlint',
                        cwd: '{projectRoot}',
                    },
                },
            };
        case 'android-native':
            return {
                build: {
                    executor: '@nx/gradle:gradle',
                    options: {
                        task: 'assembleDebug',
                    },
                },
                test: {
                    executor: '@nx/gradle:gradle',
                    options: {
                        task: 'testDebugUnitTest',
                    },
                },
                lint: {
                    executor: 'nx:run-commands',
                    options: {
                        command: './gradlew ktlintCheck',
                        cwd: '{projectRoot}',
                    },
                },
            };
        default: // ui, networking, utility (TypeScript)
            return {
                build: {
                    executor: '@nx/js:tsc',
                    outputs: ['{options.outputPath}'],
                    options: {
                        outputPath: 'dist/{projectRoot}',
                        main: '{projectRoot}/src/index.ts',
                        tsConfig: '{projectRoot}/tsconfig.lib.json',
                    },
                },
                test: {
                    executor: '@nx/jest:jest',
                    outputs: ['{workspaceRoot}/coverage/{projectRoot}'],
                    options: {
                        jestConfig: '{projectRoot}/jest.config.ts',
                    },
                },
                lint: {
                    executor: '@nx/eslint:lint',
                    outputs: ['{options.outputFile}'],
                    options: {
                        lintFilePatterns: ['{projectRoot}/**/*.{ts,tsx,js,jsx}'],
                    },
                },
            };
    }
}

async function scaffoldByType(tree: Tree, options: NormalizedOptions) {
    const templateDir = path.join(__dirname, 'files', options.type);

    switch (options.type) {
        case 'python':
            await scaffoldPythonLibrary(tree, options);
            break;
        case 'php':
            await scaffoldPhpLibrary(tree, options);
            break;
        case 'ios-native':
            await scaffoldIosLibrary(tree, options);
            break;
        case 'android-native':
            await scaffoldAndroidLibrary(tree, options);
            break;
        case 'ui':
        case 'networking':
        case 'utility':
        default:
            await scaffoldTypeScriptLibrary(tree, options);
            break;
    }

    // Generate common README for all types
    generateFiles(
        tree,
        path.join(__dirname, '..', 'common'),
        options.projectRoot,
        options
    );
}

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

async function scaffoldPhpLibrary(tree: Tree, options: NormalizedOptions) {
    generateFiles(
        tree,
        path.join(__dirname, 'files', 'php'),
        options.projectRoot,
        {
            ...options,
            namespace: options.className,
            phpVersion: '8.2',
            importPath: options.importPath || null,
        }
    );
}

async function scaffoldIosLibrary(tree: Tree, options: NormalizedOptions) {
    generateFiles(
        tree,
        path.join(__dirname, 'files', 'ios'),
        options.projectRoot,
        {
            ...options,
            bundleIdentifier: `com.terrible-lizard.${options.fileName}`,
            targetType: 'framework',
            description: `${options.name} - iOS library for Terrible Lizard monorepo`,
            importPath: options.importPath || null,
        }
    );
}

async function scaffoldAndroidLibrary(tree: Tree, options: NormalizedOptions) {
    generateFiles(
        tree,
        path.join(__dirname, 'files', 'android'),
        options.projectRoot,
        {
            ...options,
            packageName: `com.terrible_lizard.${options.fileName.replace(/-/g, '_')}`,
            description: `${options.name} - Android library for Terrible Lizard monorepo`,
            importPath: options.importPath || null,
        }
    );
}

async function scaffoldTypeScriptLibrary(tree: Tree, options: NormalizedOptions) {
    generateFiles(
        tree,
        path.join(__dirname, 'files', 'typescript'),
        options.projectRoot,
        {
            ...options,
            importPath: options.importPath || null,
        }
    );
}

export async function createLibGenerator(
    tree: Tree,
    options: CreateLibGeneratorSchema
) {
    const normalizedOptions = normalizeOptions(tree, options);

    // Add project configuration with type-specific targets
    addProjectConfiguration(tree, normalizedOptions.projectName, {
        root: normalizedOptions.projectRoot,
        projectType: 'library',
        sourceRoot: `${normalizedOptions.projectRoot}/src`,
        tags: normalizedOptions.tags,
        targets: getTargetsForType(normalizedOptions.type),
    });

    // Generate type-specific files
    await scaffoldByType(tree, normalizedOptions);

    await formatFiles(tree);
}

export default createLibGenerator;
