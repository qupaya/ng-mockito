![GitHub Workflow Status (branch main)](https://img.shields.io/github/workflow/status/qupaya/ng-mockito/CI/main) ![Codecov branch](https://img.shields.io/codecov/c/github/qupaya/ng-mockito/main) ![npm](https://img.shields.io/npm/v/ng-mockito) ![GitHub](https://img.shields.io/github/license/qupaya/ng-mockito)

<img src="https://raw.githubusercontent.com/qupaya/assets/master/logo/logo-full.svg" alt="dark qupaya logo with font" width="50" align="right">

<br>

# ng-mockito

Mocking for Angular, based on [ts-mockito](https://github.com/NagRock/ts-mockito). If you use ts-mockito for your Angular project, you'll love ng-mockito! It also integrates nicely with [@testing-library/angular](https://github.com/testing-library/angular-testing-library).

As a layer on top of ts-mockito, it's 100% compatible to it. You're still working with the usual functions (`when`, `verify`, ...).
It just makes your life easier when preparing mocks for Angular-specific types.

## Installation

To use this package, install it as development dependency:

`npm install ng-mockito --save-dev`

Additionally, install ts-mockito in the same way, if not done already (it is a peer dependency of ng-mockito):

`npm install ts-mockito --save-dev`

## Features

Provides `mockNg` function to **simplify mock setup**:

<!-- prettier-ignore -->
```typescript
TestBed.configureTestingModule({
  declarations: [
    ComponentUnderTest,
    mockNg(SomeChildComponent), // mockNg detects if component...
    mockNg(SomePipe), // ... pipe ...
    mockNg(SomeDirective), // ... directive ...
  ],
  providers: [mockNg(SomeService)], // ... or service is mocked
             // 👆️
             //    Note, that you don't have to declare
             //    {provide: SomeService, useFactory: ... }

});
```

You can **stub your mocks inline**:

```typescript
mockNg(TestPipe, (mockTestPipe) =>
  when(mockTestPipe.transform('test pipe input', 'test argument')).thenReturn(
    'mocked pipe output'
  )
);
```

Or use your pre-defined mocks (e.g. if you want to use `beforeEach`):

<!-- prettier-ignore -->
```typescript
const mockTestComponent = mock(SomeChildComponent);
when(mockTestComponent.someOutput).thenReturn(testComponentOutput);
                      // 👆️
                      //    Note, that if you don't provide a default stub for someOutput
                      //    here, mockNg will create a default EventEmitter stub for you.

mockNg(mockTestComponent);
```

Instead of `mockNg`, you can also use the more specific function `mockComponent`, `mockDirective`, `mockPipe` and `mockProvider`.

Finally, use `mockAll` to **create multiple default mocks with a single function call**:

<!-- prettier-ignore -->
```typescript
TestBed.configureTestingModule({
  declarations: [
    ComponentUnderTest,
    ...mockAll(SomeChildComponent, SomePipe, SomeDirective)
  ],
  providers: mockAll(SomeService, OtherService)
});
```

## Further reading

For more usage examples in combination with [@testing-library/angular](https://github.com/testing-library/angular-testing-library), please have a look at the [spec file in our GitHub repo](https://github.com/qupaya/ng-mockito/blob/main/libs/ng-mockito/integration/src/lib/integration-test.spec.ts).

---

From [qupaya](https://www.qupaya.com/) with 🖤️

Follow us: [Twitter](twitter.com/qupaya) | [LinkedIn](linkedin.com/company/qupaya)
