import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  Directive,
} from '@angular/core';
import { render } from '@testing-library/angular';
import * as tsMockito from 'ts-mockito';
import { mockDirective as _mockDirective } from './mock-directive';
import { mockNg } from './mock-ng';

describe.each`
  mockDirective     | description
  ${mockNg}         | ${'using mockNg function'}
  ${_mockDirective} | ${'using mockDirective function'}
`(
  'mock directive ($description)',
  ({ mockDirective }: { mockDirective: typeof mockNg }) => {
    @Directive({
      selector: '[test]',
    })
    class TestDirective implements OnInit {
      @Input() set test(value: string) {
        throw new Error(`used real Input with value ${value}`);
      }
      @Output() testOutput = new EventEmitter<string>();

      ngOnInit(): void {
        throw new Error(`used real ngOnInit`);
      }
    }

    @Component({
      selector: 'test-host',
      template: `<div
        [test]="'test'"
        (testOutput)="outputFromTestDirective = $event"
      ></div>`,
    })
    class TestHostComponent {
      outputFromTestDirective = '';
    }

    it('should provide default mocks for directive', async () => {
      await expect(
        render(TestHostComponent, {
          declarations: [mockDirective(TestDirective)],
        })
      ).resolves.toBeDefined();
    });

    it('should setup mocked directive', async () => {
      const testOutput = new EventEmitter<string>();

      const { fixture } = await render(TestHostComponent, {
        declarations: [
          mockDirective(TestDirective, (mock) => {
            tsMockito.when(mock.testOutput).thenReturn(testOutput);
          }),
        ],
      });

      testOutput.emit('test');

      expect(fixture.componentInstance.outputFromTestDirective).toEqual('test');
    });

    it('should work with pre-defined mock', async () => {
      const mockTestDirective = tsMockito.mock(TestDirective);
      const testOutput = new EventEmitter<string>();
      tsMockito.when(mockTestDirective.testOutput).thenReturn(testOutput);

      const { fixture } = await render(TestHostComponent, {
        declarations: [mockDirective(mockTestDirective)],
      });

      testOutput.emit('test');

      expect(fixture.componentInstance.outputFromTestDirective).toEqual('test');
    });
  }
);
