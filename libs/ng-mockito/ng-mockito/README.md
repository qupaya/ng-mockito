![GitHub Workflow Status (branch main)](https://img.shields.io/github/workflow/status/qupaya/ng-mockito/CI/main) ![GitHub](https://img.shields.io/github/license/qupaya/ng-mockito) ![npm](https://img.shields.io/npm/v/ng-mockito)

<img src="https://raw.githubusercontent.com/qupaya/assets/master/logo/logo-full.svg" alt="dark qupaya logo with font" width="50" align="right">

<br>

# ng-mockito

Mocking for Angular, based on [ts-mockito](https://github.com/NagRock/ts-mockito). If you use ts-mockito for your Angular project, you'll love ng-mockito!

As a layer on top of ts-mockito, it's 100% compatible to it. You're still working with the usual functions (`when`, `verify`, ...).
It just makes your life easier when preparing mocks for Angular-specific types, by providing utilities to simplify setup:

<!-- prettier-ignore -->
```typescript
TestBed.configureTestingModule({
  declarations: [
    ComponentUnderTest,
    mockNg(SomeChildComponent), // mockNg detects if Component...
    mockNg(SomePipe), // ... Pipe ...
  ],
  providers: [mockNg(SomeService)], // ... or Service is mocked
             // 👆️
             //    Note, that you don't have to declare
             //    {provide: SomeService, useFactory: ... }

});
```

You can stub mocks inline:

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
const mockTestComponent = mock(IntegrationTestChildComponent);
when(mockTestComponent.someOutput).thenReturn(testComponentOutput);
                    // 👆️
                    //    Note, that if you don't provide a default stub for someOutput
                    //    here, mockNg will create a default EventEmitter stub for you.

mockNg(IntegrationTestChildComponent);
```

---

From [qupaya](https://www.qupaya.com/) with 🖤️

Follow Us: [Twitter](twitter.com/qupaya) | [LinkedIn](linkedin.com/company/qupaya)
