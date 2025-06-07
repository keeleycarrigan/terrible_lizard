export interface CreateAppSchema {
  name: string;
  type: 'web' | 'python' | 'php' | 'ios-native' | 'android-native';
  framework?: string;
  appType?: 'frontend' | 'backend';
  directory?: string;
  tags?: string;
  docker?: boolean;
  organizationIdentifier?: string;
}
