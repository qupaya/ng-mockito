module.exports = {
  branches: ['main', { name: 'alpha', prerelease: true }],
  preset: 'angular',
  plugins: [
    [
      '@semantic-release/commit-analyzer',
      {
        parserOpts: {
          noteKeywords: ['BREAKING CHANGE', 'BREAKING CHANGES', 'BREAKING'],
        },
      },
    ],
    [
      '@semantic-release/release-notes-generator',
      {
        parserOpts: {
          noteKeywords: ['BREAKING CHANGE', 'BREAKING CHANGES', 'BREAKING'],
        },
        writerOpts: {
          commitsSort: ['subject', 'scope'],
        },
      },
    ],
    [
      '@semantic-release/changelog',
      {
        changelogFile: 'CHANGELOG.md',
      },
    ],
    [
      '@semantic-release/npm',
      { npmPublish: true, pkgRoot: './dist/libs/ng-mockito/ng-mockito' },
    ],
    [
      '@semantic-release/git',
      {
        assets: ['libs/ng-mockito/ng-mockito/package.json', 'CHANGELOG.md'],
        message: 'build: release version ${nextRelease.version}\n\n[skip ci]',
      },
    ],
  ],
};
