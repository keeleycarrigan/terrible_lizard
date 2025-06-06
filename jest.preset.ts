const { getJestProjects } = require('@nx/jest');

module.exports = {
  projects: getJestProjects(),
  collectCoverageFrom: [
    'apps/**/*.{ts,tsx,js,jsx}',
    'libs/**/*.{ts,tsx,js,jsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/.nx/**',
    '!**/coverage/**',
    '!**/dist/**',
  ],
  coverageReporters: ['text', 'lcov', 'html'],
  coverageDirectory: 'coverage',
  testMatch: [
    '<rootDir>/apps/**/*.(test|spec).{js,ts,tsx}',
    '<rootDir>/libs/**/*.(test|spec).{js,ts,tsx}',
  ],
};