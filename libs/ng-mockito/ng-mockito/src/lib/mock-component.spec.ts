import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { render } from '@testing-library/angular';
import * as tsMockito from 'ts-mockito';
import { mockComponent as _mockComponent } from './mock-component';
import { mockNg } from './mock-ng';

describe.each`
  mockComponent     | description
  ${mockNg}         | ${'using mockNg function'}
  ${_mockComponent} | ${'using mockComponent function'}
`(
  'mock component ($description)',
  ({ mockComponent }: { mockComponent: typeof mockNg }) => {
    @Component({
      selector: 'test-child',
      template: '',
    })
    class TestComponent implements OnInit {
      @Input() set testInput(value: string) {
        throw new Error(`used real Input with value ${value}`);
      }
      @Output() testOutput = new EventEmitter<string>();

      ngOnInit(): void {
        throw new Error(`used real ngOnInit`);
      }
    }

    @Component({
      selector: 'test-host',
      template: `<test-child
        [testInput]="'test'"
        (testOutput)="outputFromTestComponent = $event"
      ></test-child>`,
    })
    class TestHostComponent {
      outputFromTestComponent = '';
    }

    it('should provide default mocks for component', async () => {
      await expect(
        render(TestHostComponent, {
          declarations: [mockComponent(TestComponent)],
        })
      ).resolves.toBeDefined();
    });

    it('should setup mocked component', async () => {
      const testOutput = new EventEmitter<string>();

      const { fixture } = await render(TestHostComponent, {
        declarations: [
          mockComponent(TestComponent, (mock) => {
            tsMockito.when(mock.testOutput).thenReturn(testOutput);
          }),
        ],
      });

      testOutput.emit('test');

      expect(fixture.componentInstance.outputFromTestComponent).toEqual('test');
    });

    it('should work with pre-defined mock', async () => {
      const mockTestComponent = tsMockito.mock(TestComponent);
      const testOutput = new EventEmitter<string>();
      tsMockito.when(mockTestComponent.testOutput).thenReturn(testOutput);

      const { fixture } = await render(TestHostComponent, {
        declarations: [mockComponent(mockTestComponent)],
      });

      testOutput.emit('test');

      expect(fixture.componentInstance.outputFromTestComponent).toEqual('test');
    });
  }
);
