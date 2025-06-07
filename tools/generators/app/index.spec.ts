import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree, readProjectConfiguration } from '@nx/devkit';

import createAppGenerator from './index';
import { CreateAppSchema } from './schema';

describe('create-app generator', () => {
    let tree: Tree;

    beforeEach(() => {
        tree = createTreeWithEmptyWorkspace();
    });

    it('should run successfully for web apps', async () => {
        const options: CreateAppSchema = {
            name: 'test-web-app',
            type: 'web',
            framework: 'none'
        };

        await createAppGenerator(tree, options);
        const config = readProjectConfiguration(tree, 'test-web-app');
        expect(config).toBeDefined();
    });

    it('should create basic web application files', async () => {
        const options: CreateAppSchema = {
            name: 'basic-web',
            type: 'web',
            framework: 'none'
        };

        await createAppGenerator(tree, options);

        expect(tree.exists('apps/basic-web/project.json')).toBeTruthy();
        expect(tree.exists('apps/basic-web/src/main.ts')).toBeTruthy();
        expect(tree.exists('apps/basic-web/index.html')).toBeTruthy();
    });

    it('should create Python Flask application files', async () => {
        const options: CreateAppSchema = {
            name: 'flask-app',
            type: 'python',
            framework: 'flask'
        };

        await createAppGenerator(tree, options);

        expect(tree.exists('apps/flask-app/project.json')).toBeTruthy();
        expect(tree.exists('apps/flask-app/pyproject.toml')).toBeTruthy();
        expect(tree.exists('apps/flask-app/src/app.py')).toBeTruthy();
    });
});
