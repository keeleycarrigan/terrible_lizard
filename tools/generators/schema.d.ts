export interface CreateLibGeneratorSchema {
    name: string;
    type: 'ui' | 'networking' | 'utility' | 'python' | 'php' | 'ios-native' | 'android-native';
    directory?: string;
    tags?: string;
    publishable?: boolean;
    importPath?: string;
}
