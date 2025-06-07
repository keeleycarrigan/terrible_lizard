import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree, readProjectConfiguration } from '@nx/devkit';

import { createLibGenerator } from './index';
import { CreateLibGeneratorSchema } from './schema';

describe('create-lib generator', () => {
    let tree: Tree;
    const options: CreateLibGeneratorSchema = { name: 'test', type: 'utility' };

    beforeEach(() => {
        tree = createTreeWithEmptyWorkspace();
    });

    it('should run successfully', async () => {
        await createLibGenerator(tree, options);
        const config = readProjectConfiguration(tree, 'test');
        expect(config).toBeDefined();
    });

    it('should create TypeScript library files', async () => {
        await createLibGenerator(tree, { name: 'ui-lib', type: 'ui' });

        expect(tree.exists('libs/ui-lib/project.json')).toBeTruthy();
        expect(tree.exists('libs/ui-lib/src/index.ts')).toBeTruthy();
        expect(tree.exists('libs/ui-lib/tsconfig.lib.json')).toBeTruthy();
        expect(tree.exists('libs/ui-lib/README.md')).toBeTruthy();
    });

    it('should create Python library files', async () => {
        await createLibGenerator(tree, { name: 'python-lib', type: 'python' });

        expect(tree.exists('libs/python-lib/project.json')).toBeTruthy();
        expect(tree.exists('libs/python-lib/pyproject.toml')).toBeTruthy();
        expect(tree.exists('libs/python-lib/src/python_lib/__init__.py')).toBeTruthy();
        expect(tree.exists('libs/python-lib/README.md')).toBeTruthy();
    });
});
