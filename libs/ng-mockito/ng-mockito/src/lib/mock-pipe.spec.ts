import { Component, Pipe, PipeTransform } from '@angular/core';
import { render, screen } from '@testing-library/angular';
import * as tsMockito from 'ts-mockito';
import { mockPipe as _mockPipe } from './mock-pipe';
import { mock as _mock } from './mock';

describe.each`
  mockPipe     | description
  ${_mock}     | ${'using mock function'}
  ${_mockPipe} | ${'using mockPipe function'}
`('mock pipe ($description)', ({ mockPipe }: { mockPipe: typeof _mock }) => {
  describe('integration', () => {
    @Pipe({ name: 'test' })
    class TestPipe implements PipeTransform {
      transform(value: string, ...args: string[]) {
        return `Real implementation used: ${value}, ${args.join()}`;
      }
    }

    describe('when using a pipe without arguments', () => {
      @Component({
        template: `<span data-testID="pipeOutput">{{ 'test' | test }}</span>`,
      })
      class TestComponent {}

      it('should provide default mock', async () => {
        await render(TestComponent, { declarations: [mockPipe(TestPipe)] });

        expect(screen.getByTestId('pipeOutput')).toHaveTextContent('');
      });

      it('should setup mock pipe', async () => {
        await render(TestComponent, {
          declarations: [
            mockPipe(TestPipe, (mock) =>
              tsMockito.when(mock.transform('test')).thenReturn('mocked')
            ),
          ],
        });

        expect(screen.getByTestId('pipeOutput')).toHaveTextContent('mocked');
      });

      it('should work with pre-defined mock pipe', async () => {
        const mockTestPipe = tsMockito.mock(TestPipe);
        tsMockito.when(mockTestPipe.transform('test')).thenReturn('mocked');

        await render(TestComponent, {
          declarations: [mockPipe(mockTestPipe)],
        });

        expect(screen.getByTestId('pipeOutput')).toHaveTextContent('mocked');
      });
    });

    describe('when using a pipe with arguments', () => {
      @Component({
        template: `<span data-testID="pipeOutput">{{
          'test' | test: 'arg'
        }}</span>`,
      })
      class TestComponent {}

      it('should setup mock pipe', async () => {
        await render(TestComponent, {
          declarations: [
            mockPipe(TestPipe, (mock) =>
              tsMockito.when(mock.transform('test', 'arg')).thenReturn('mocked')
            ),
          ],
        });

        expect(screen.getByTestId('pipeOutput')).toHaveTextContent('mocked');
      });
    });
  });
});
