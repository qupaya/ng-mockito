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
import { mock, when } from 'ts-mockito';
import { IntegrationTestChildComponent } from './integration-test-child.component';
import { IntegrationTestComponent } from './integration-test.component';
import { IntegrationTestDirective } from './integration-test.directive';
import { IntegrationTestPipe } from './integration-test.pipe';
import { IntegrationTestService } from './integration-test.service';

describe('IntegrationTest', () => {
  it('should create', async () => {
    await expect(
      render(IntegrationTestComponent, {
        declarations: [
          mockNg(IntegrationTestChildComponent),
          mockNg(IntegrationTestPipe),
          mockNg(IntegrationTestDirective),
        ],
        providers: [mockNg(IntegrationTestService)],
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
      providers: [mockNg(IntegrationTestService)],
    });

    detectChanges();

    expect(screen.getByTestId('valueFromService')).toHaveTextContent('');
    expect(screen.getByTestId('valueFromChildComponent')).toHaveTextContent(
      'real initial value' // default EventEmitter mock does not emit
    );
    expect(screen.getByTestId('valueFromPipe')).toHaveTextContent('');
  });

  it('should mock all the things with default values using mockAll', async () => {
    const { detectChanges } = await render(IntegrationTestComponent, {
      declarations: mockAll(
        IntegrationTestChildComponent,
        IntegrationTestPipe,
        IntegrationTestDirective
      ),
      providers: mockAll(IntegrationTestService),
    });

    detectChanges();

    expect(screen.getByTestId('valueFromService')).toHaveTextContent('');
    expect(screen.getByTestId('valueFromChildComponent')).toHaveTextContent(
      'real initial value' // default EventEmitter mock does not emit
    );
    expect(screen.getByTestId('valueFromPipe')).toHaveTextContent('');
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

    const { detectChanges } = await render(IntegrationTestComponent, {
      declarations: [
        mockNg(mockChildComponent),
        mockNg(mockTestPipe),
        mockNg(mockTestDirective),
      ],
      providers: [mockNg(mockService)],
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
