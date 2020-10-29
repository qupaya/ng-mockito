import { PipeTransform } from '@angular/core';
import { mockComponent } from './mock-component';
import { mockPipe } from './mock-pipe';
import { mockProvider } from './mock-provider';
import { getDecoratorNames } from './ng-decorator-helpers';
import { createTypeAndMock, noOp } from './ts-mockito-helpers';
import { SetupMockFn, TypeOrMock } from './types';
import { mockDirective } from './mock-directive';

/**
 * Returns a mocked version of the given type.
 * Decides which kind of Angular building block (component, directive, pipe or services) needs to be mocked.
 *
 * In case of service mock, a `FactoryProvider` is returned, that can be directly used in the `providers`
 * array of the test module.
 *
 * @param typeOrMock either the class to mock, or an already prepared ts-mockito mock
 * @param setup  Optional setup function for stubbing. Perfect place to call ts-mockito's `when` function
 */
export function mockNg<T>(
  typeOrMock: TypeOrMock<T>,
  setup: SetupMockFn<T> = noOp
) {
  const { type, mock } = createTypeAndMock(typeOrMock);
  const decoratorNames = getDecoratorNames(type);

  if (decoratorNames.includes('Pipe')) {
    return mockPipe(
      (mock as unknown) as PipeTransform,
      (setup as unknown) as SetupMockFn<PipeTransform>
    );
  }

  if (decoratorNames.includes('Component')) {
    return mockComponent(mock, setup);
  }

  if (decoratorNames.includes('Directive')) {
    return mockDirective(mock, setup);
  }

  if (decoratorNames.includes('Injectable')) {
    return mockProvider(mock, setup);
  }

  throw new Error('Unknown decorator.');
}
