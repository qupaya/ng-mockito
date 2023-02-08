import { EventEmitter } from '@angular/core';
import { render, screen } from '@testing-library/angular';
import {
  mockAll,
  mockComponent,
  mockDirective,
  mockNg,
  mockPipe,
  mockProvider,
} from 'ng-mockito';
import { anyString, mock, when } from '@typestrong/ts-mockito';
import {
  INTEGRATION_TEST_STRING_TOKEN,
  INTEGRATION_TEST_INTERFACE_TOKEN,
} from './injection-tokens';
import { IntegrationTestChildComponent } from './integration-test-child.component';
import { IntegrationTestComponent } from './integration-test.component';
import { IntegrationTestDirective } from './integration-test.directive';
import { IntegrationTestPipe } from './integration-test.pipe';
import { IntegrationTestService } from './integration-test.service';
import { IntegrationTestInterface } from './injection-tokens';

describe('IntegrationTest', () => {
  it('should create', async () => {
    await expect(
      render(IntegrationTestComponent, {
        declarations: [
          mockNg(IntegrationTestChildComponent),
          mockNg(IntegrationTestPipe),
          mockNg(IntegrationTestDirective),
        ],
        providers: [
          mockNg(IntegrationTestService),
          mockNg([INTEGRATION_TEST_STRING_TOKEN, IntegrationTestComponent]),
          mockNg([INTEGRATION_TEST_INTERFACE_TOKEN, IntegrationTestComponent]),
        ],
      })
    ).resolves.toBeDefined();
  });

  it('should mock all the things with default values', async () => {
    const { detectChanges } = await render(IntegrationTestComponent, {
      declarations: [
        mockNg(IntegrationTestChildComponent),
        mockNg(IntegrationTestPipe),
        mockNg(IntegrationTestDirective),
      ],
      providers: [
        mockNg(IntegrationTestService),
        mockNg([INTEGRATION_TEST_STRING_TOKEN, IntegrationTestComponent]),
        mockNg([INTEGRATION_TEST_INTERFACE_TOKEN, IntegrationTestComponent]),
      ],
    });

    detectChanges();

    expect(screen.getByTestId('valueFromService').textContent?.trim()).toEqual(
      ''
    );
    expect(screen.getByTestId('valueFromChildComponent')).toHaveTextContent(
      'real initial value' // default EventEmitter mock does not emit
    );
    expect(screen.getByTestId('valueFromPipe').textContent?.trim()).toEqual('');
    expect(
      screen
        .getByTestId('someFunctionValueFromInterfaceToken')
        .textContent?.trim()
    ).toEqual('');

    // FIXME: This is a special case, because interfaces don't exist at runtime. Due to this, default values of an interface property
    // can't be recognized by ts-mockito. Instead, a Proxy is used to collect this information at call time.
    // Unfortunately, the toString() method of the ts-mockito Proxy will return the function definition itself
    // ("function () { var args = ....; })") as default if interpreted as string.
    // I have no idea how or even if this can be fixed in either ts-mockito or here.
    // The user should be encouraged to always provide custom default values.
    expect(
      screen.getByTestId('somePropertyValueFromInterfaceToken')
    ).not.toHaveTextContent('real');
  });

  it('should mock all the things with default values using mockAll', async () => {
    const { detectChanges } = await render(IntegrationTestComponent, {
      declarations: mockAll(
        IntegrationTestChildComponent,
        IntegrationTestPipe,
        IntegrationTestDirective
      ),
      providers: mockAll(IntegrationTestService, [
        INTEGRATION_TEST_INTERFACE_TOKEN,
        IntegrationTestComponent,
      ]),
    });

    detectChanges();

    expect(screen.getByTestId('valueFromService').textContent?.trim()).toEqual(
      ''
    );
    expect(screen.getByTestId('valueFromChildComponent')).toHaveTextContent(
      'real initial value' // default EventEmitter mock does not emit
    );
    expect(screen.getByTestId('valueFromPipe').textContent?.trim()).toEqual('');
    expect(
      screen
        .getByTestId('someFunctionValueFromInterfaceToken')
        .textContent?.trim()
    ).toEqual('');
    // see comment in 'should mock all the things with default values'
    expect(
      screen.getByTestId('somePropertyValueFromInterfaceToken')
    ).not.toHaveTextContent('real');
  });

  it('should mock all the things with stubbed values', async () => {
    const mockComponentOutput = new EventEmitter<string>();
    const mockDirectiveOutput = new EventEmitter<string>();

    const { detectChanges } = await render(IntegrationTestComponent, {
      declarations: [
        mockNg(IntegrationTestChildComponent, (m) =>
          when(m.someOutput).thenReturn(mockComponentOutput)
        ),
        mockNg(IntegrationTestPipe, (m) =>
          when(m.transform('test pipe input', 'test argument')).thenReturn(
            'mocked pipe output'
          )
        ),
        mockNg(IntegrationTestDirective, (m) =>
          when(m.qpIntegrationTestDirectiveOutput).thenReturn(
            mockDirectiveOutput
          )
        ),
      ],
      providers: [
        mockNg(IntegrationTestService, (m) =>
          when(m.getSomeValue()).thenReturn('mocked service output')
        ),
        mockNg([INTEGRATION_TEST_STRING_TOKEN, IntegrationTestComponent], {
          use: 'mocked string token text',
        }),

        mockNg(
          [INTEGRATION_TEST_INTERFACE_TOKEN, IntegrationTestComponent],
          (m) => {
            when(m.someValue).thenReturn('mocked someValue text');
            when(m.someFunction(anyString())).thenReturn(
              'mocked someFunction text'
            );
          }
        ),
      ],
    });

    mockComponentOutput.emit('mocked child component output');
    mockDirectiveOutput.emit('mocked directive output');
    detectChanges();

    expect(screen.getByTestId('valueFromService')).toHaveTextContent(
      'mocked service output'
    );
    expect(screen.getByTestId('valueFromChildComponent')).toHaveTextContent(
      'mocked child component output'
    );
    expect(screen.getByTestId('valueFromPipe')).toHaveTextContent(
      'mocked pipe output'
    );
    expect(screen.getByTestId('valueFromDirective')).toHaveTextContent(
      'mocked directive output'
    );
    expect(screen.getByTestId('valueFromStringToken')).toHaveTextContent(
      'mocked string token text'
    );
    expect(
      screen.getByTestId('someFunctionValueFromInterfaceToken')
    ).toHaveTextContent('mocked someFunction text');
    expect(
      screen.getByTestId('somePropertyValueFromInterfaceToken')
    ).toHaveTextContent('mocked someValue text');
  });

  it('should mock all the things with stubbed values (using pre-defined mocks)', async () => {
    const mockService = mock(IntegrationTestService);
    when(mockService.getSomeValue()).thenReturn('mocked service output');

    const mockTestPipe = mock(IntegrationTestPipe);
    when(mockTestPipe.transform('test pipe input', 'test argument')).thenReturn(
      'mocked pipe output'
    );

    const mockChildComponent = mock(IntegrationTestChildComponent);
    const mockComponentOutput = new EventEmitter<string>();
    when(mockChildComponent.someOutput).thenReturn(mockComponentOutput);

    const mockTestDirective = mock(IntegrationTestDirective);
    const mockDirectiveOutput = new EventEmitter<string>();
    when(mockTestDirective.qpIntegrationTestDirectiveOutput).thenReturn(
      mockDirectiveOutput
    );

    const mockIntegrationTestInterface = mock<IntegrationTestInterface>();
    when(mockIntegrationTestInterface.someValue).thenReturn(
      'mocked someValue text'
    );
    when(mockIntegrationTestInterface.someFunction(anyString())).thenReturn(
      'mocked someFunction text'
    );

    const { detectChanges } = await render(IntegrationTestComponent, {
      declarations: [
        mockNg(mockChildComponent),
        mockNg(mockTestPipe),
        mockNg(mockTestDirective),
      ],
      providers: [
        mockNg(mockService),
        mockNg([INTEGRATION_TEST_INTERFACE_TOKEN, IntegrationTestComponent], {
          use: mockIntegrationTestInterface,
        }),
      ],
    });

    mockComponentOutput.emit('mocked child component output');
    mockDirectiveOutput.emit('mocked directive output');
    detectChanges();

    expect(screen.getByTestId('valueFromService')).toHaveTextContent(
      'mocked service output'
    );
    expect(screen.getByTestId('valueFromChildComponent')).toHaveTextContent(
      'mocked child component output'
    );
    expect(screen.getByTestId('valueFromPipe')).toHaveTextContent(
      'mocked pipe output'
    );

    expect(screen.getByTestId('valueFromDirective')).toHaveTextContent(
      'mocked directive output'
    );
    expect(
      screen.getByTestId('someFunctionValueFromInterfaceToken')
    ).toHaveTextContent('mocked someFunction text');
    expect(
      screen.getByTestId('somePropertyValueFromInterfaceToken')
    ).toHaveTextContent('mocked someValue text');
  });

  it('should mock all the things with stubbed values (using pre-defined mocks and specific mock functions)', async () => {
    const mockService = mock(IntegrationTestService);
    when(mockService.getSomeValue()).thenReturn('mocked service output');

    const mockTestPipe = mock(IntegrationTestPipe);
    when(mockTestPipe.transform('test pipe input', 'test argument')).thenReturn(
      'mocked pipe output'
    );

    const mockChildComponent = mock(IntegrationTestChildComponent);
    const mockComponentOutput = new EventEmitter<string>();
    when(mockChildComponent.someOutput).thenReturn(mockComponentOutput);

    const mockTestDirective = mock(IntegrationTestDirective);
    const mockDirectiveOutput = new EventEmitter<string>();
    when(mockTestDirective.qpIntegrationTestDirectiveOutput).thenReturn(
      mockDirectiveOutput
    );

    const { detectChanges } = await render(IntegrationTestComponent, {
      declarations: [
        mockComponent(mockChildComponent),
        mockPipe(mockTestPipe),
        mockDirective(mockTestDirective),
      ],
      providers: [mockProvider(mockService)],
    });

    mockComponentOutput.emit('mocked child component output');
    mockDirectiveOutput.emit('mocked directive output');
    detectChanges();

    expect(screen.getByTestId('valueFromService')).toHaveTextContent(
      'mocked service output'
    );
    expect(screen.getByTestId('valueFromChildComponent')).toHaveTextContent(
      'mocked child component output'
    );
    expect(screen.getByTestId('valueFromPipe')).toHaveTextContent(
      'mocked pipe output'
    );

    expect(screen.getByTestId('valueFromDirective')).toHaveTextContent(
      'mocked directive output'
    );
  });
});
