module.exports = {
  displayName: 'ng-mockito-ng-mockito',

  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  globals: {
    'ts-jest': {
      stringifyContentPathRegex: '\\.(html|svg)$',

      tsconfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  coverageDirectory: '../../../coverage/libs/ng-mockito/ng-mockito',
  snapshotSerializers: [
    'jest-preset-angular/build/serializers/no-ng-attributes',
    'jest-preset-angular/build/serializers/ng-snapshot',
    'jest-preset-angular/build/serializers/html-comment',
  ],
  transform: {
    '^.+.(ts|mjs|js|html)$': 'jest-preset-angular',
  },
  transformIgnorePatterns: ['node_modules/(?!.*.mjs$)'],
  preset: '../../../jest.preset.ts',
};
