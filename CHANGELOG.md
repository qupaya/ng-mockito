## [2.0.1](https://github.com/qupaya/ng-mockito/compare/v2.0.0...v2.0.1) (2022-05-11)


### Bug Fixes

* **ng-mockito:** use correct peer dependencies for angular router and platform-browser-dynamic ([4497bcd](https://github.com/qupaya/ng-mockito/commit/4497bcdd270fed02cea17085a46633c8935004df))

## [2.0.1-next.1](https://github.com/qupaya/ng-mockito/compare/v2.0.0...v2.0.1-next.1) (2022-05-11)


### Bug Fixes

* **ng-mockito:** use correct peer dependencies for angular router and platform-browser-dynamic ([4497bcd](https://github.com/qupaya/ng-mockito/commit/4497bcdd270fed02cea17085a46633c8935004df))

# [2.0.0](https://github.com/qupaya/ng-mockito/compare/v1.3.3...v2.0.0) (2022-05-10)

### Features

- **ng-mockito:** bump peerDeps of published lib to support angular >= 12 ([d03beed](https://github.com/qupaya/ng-mockito/commit/d03beed1b58fdddd2fb50948d9c5947ab830fde0))
- **ng-mockito:** distribute as Ivy lib ([7c90cd3](https://github.com/qupaya/ng-mockito/commit/7c90cd3b1899886b202e127f192639699a455e4d)), closes [#35](https://github.com/qupaya/ng-mockito/issues/35)

### BREAKING CHANGES

- **ng-mockito:** drop support for symbol injection tokens because they can't be distinguished from interfaces anymore ([755c492](https://github.com/qupaya/ng-mockito/commit/755c492ede36c38ebe56ec8a45156fc0de94627b))
- **ng-mockito:** drop support of bigint as value type ([104b50f](https://github.com/qupaya/ng-mockito/commit/104b50f08e1273f094d74e9da1df84be7433de5f))

## [1.3.3](https://github.com/qupaya/ng-mockito/compare/v1.3.2...v1.3.3) (2021-06-17)

### Bug Fixes

- **ng-mockito:** support providing classes without Injectable decorator in mockNg ([f223e6a](https://github.com/qupaya/ng-mockito/commit/f223e6a15dba6d93703e46edb9799d443eb2d501)), closes [#31](https://github.com/qupaya/ng-mockito/issues/31)

## [1.3.2](https://github.com/qupaya/ng-mockito/compare/v1.3.1...v1.3.2) (2021-02-17)

### Bug Fixes

- **ng-mockito:** don't use named tuples, because they break projects with typescript versions below v4.0.0 ([77232d1](https://github.com/qupaya/ng-mockito/commit/77232d1368588cb194e0f0e1619144273dacad75))

## [1.3.1](https://github.com/qupaya/ng-mockito/compare/v1.3.0...v1.3.1) (2021-02-11)

### Bug Fixes

- **ng-mockito:** allow mocking of transpiled abstract classes like Renderer2 ([ea62a95](https://github.com/qupaya/ng-mockito/commit/ea62a95092f52728e3d07dbf5b09b5a1b4121665))

# [1.3.0](https://github.com/qupaya/ng-mockito/compare/v1.2.1...v1.3.0) (2021-01-27)

### Features

- **ng-mockito:** add support for injection tokens ([8e2e725](https://github.com/qupaya/ng-mockito/commit/8e2e7250e817aa2600ca481f4f929dcc12956da3)), closes [#19](https://github.com/qupaya/ng-mockito/issues/19)

## [1.2.1](https://github.com/qupaya/ng-mockito/compare/v1.2.0...v1.2.1) (2021-01-24)

### Bug Fixes

- **ng-mockito:** allow Angular >= v11 as peer dependency ([d26e97b](https://github.com/qupaya/ng-mockito/commit/d26e97b7556a819cbd1672a5998cdc076e7d8652)), closes [#26](https://github.com/qupaya/ng-mockito/issues/26)

# [1.2.0](https://github.com/qupaya/ng-mockito/compare/v1.1.1...v1.2.0) (2021-01-21)

### Features

- **ng-mockito:** add mockAll function to create multiple default mocks ([40909e3](https://github.com/qupaya/ng-mockito/commit/40909e3d86ac9d65b80dd676349bd172060685af)), closes [#21](https://github.com/qupaya/ng-mockito/issues/21)

## [1.1.1](https://github.com/qupaya/ng-mockito/compare/v1.1.0...v1.1.1) (2021-01-21)

### Bug Fixes

- **ng-mockito:** allow transpiled classes to be mocked ([cafecfe](https://github.com/qupaya/ng-mockito/commit/cafecfe71b391dc7b429956b259771a4fe244a06)), closes [#22](https://github.com/qupaya/ng-mockito/issues/22)

# [1.1.0](https://github.com/qupaya/ng-mockito/compare/v1.0.3...v1.1.0) (2021-01-14)

### Features

- **ng-mockito:** function name or details in mock creation throw error ([83393c5](https://github.com/qupaya/ng-mockito/commit/83393c597ffda57161caf5e71a21fcbd57eb204a))

## [1.0.3](https://github.com/qupaya/ng-mockito/compare/v1.0.2...v1.0.3) (2020-11-20)

### Bug Fixes

- **ng-mockito:** return correct types from mock functions ([c898691](https://github.com/qupaya/ng-mockito/commit/c8986914f41a04020120106016daac3be7efad25))

## [1.0.2](https://github.com/qupaya/ng-mockito/compare/v1.0.1...v1.0.2) (2020-10-29)

### Bug Fixes

- disable GitHub release until configuration issue is solved ([853ef81](https://github.com/qupaya/ng-mockito/commit/853ef8101dcf196bc8bf7bc241d1f1a6bb54e95c))

## [1.0.1](https://github.com/qupaya/ng-mockito/compare/v1.0.0...v1.0.1) (2020-10-29)

### Bug Fixes

- release correct assets on GitHub ([1dd0f7c](https://github.com/qupaya/ng-mockito/commit/1dd0f7c8c9e63eff748a137fbc46b7a0261ff976))

# 1.0.0 (2020-10-29)

### Bug Fixes

- **ng-mockito:** handle illegal function arguments ([d7ee7ef](https://github.com/qupaya/ng-mockito/commit/d7ee7ef8737b4f8bd24e07fbe02c2824dfd84665))

### Features

- **ng-mockito:** add general mock function ([4c35782](https://github.com/qupaya/ng-mockito/commit/4c3578295d7196ab0ecb94acd4685d1b02975f70))
- **ng-mockito:** add mockComponent ([c812ab3](https://github.com/qupaya/ng-mockito/commit/c812ab37f86399bfea894270ebcc3b4f87f740ab))
- **ng-mockito:** add mocking function for directives ([0aef7b7](https://github.com/qupaya/ng-mockito/commit/0aef7b7212edb308b5e010d18a39a327a003b9bd))
- **ng-mockito:** add mockPipe ([1cfc6f5](https://github.com/qupaya/ng-mockito/commit/1cfc6f52135b7c57bd07a973fa1ba60c3ac2765a))
- **ng-mockito:** add mockProvider ([7f4285e](https://github.com/qupaya/ng-mockito/commit/7f4285e13ff4bda94e1560810620db42024fd685))
- **ng-mockito:** allow pre-defined mocks for mockPipe ([ca01004](https://github.com/qupaya/ng-mockito/commit/ca01004a3f678353c4bcad6481e4e6107871c99c))
- **ng-mockito:** rename mock to mockNg ([b6f3cbf](https://github.com/qupaya/ng-mockito/commit/b6f3cbf6e4351f50fa7913dc74010ab83224367a))

# [1.0.0-alpha.2](https://github.com/qupaya/ng-mockito/compare/v1.0.0-alpha.1...v1.0.0-alpha.2) (2020-10-29)

### Bug Fixes

- **ng-mockito:** handle illegal function arguments ([d7ee7ef](https://github.com/qupaya/ng-mockito/commit/d7ee7ef8737b4f8bd24e07fbe02c2824dfd84665))

### Features

- **ng-mockito:** add mocking function for directives ([0aef7b7](https://github.com/qupaya/ng-mockito/commit/0aef7b7212edb308b5e010d18a39a327a003b9bd))

# 1.0.0-alpha.1 (2020-10-24)

### Features

- **ng-mockito:** add general mock function ([4c35782](https://github.com/qupaya/ng-mockito/commit/4c3578295d7196ab0ecb94acd4685d1b02975f70))
- **ng-mockito:** add mockComponent ([c812ab3](https://github.com/qupaya/ng-mockito/commit/c812ab37f86399bfea894270ebcc3b4f87f740ab))
- **ng-mockito:** add mockPipe ([1cfc6f5](https://github.com/qupaya/ng-mockito/commit/1cfc6f52135b7c57bd07a973fa1ba60c3ac2765a))
- **ng-mockito:** add mockProvider ([7f4285e](https://github.com/qupaya/ng-mockito/commit/7f4285e13ff4bda94e1560810620db42024fd685))
- **ng-mockito:** allow pre-defined mocks for mockPipe ([ca01004](https://github.com/qupaya/ng-mockito/commit/ca01004a3f678353c4bcad6481e4e6107871c99c))
- **ng-mockito:** rename mock to mockNg ([b6f3cbf](https://github.com/qupaya/ng-mockito/commit/b6f3cbf6e4351f50fa7913dc74010ab83224367a))
