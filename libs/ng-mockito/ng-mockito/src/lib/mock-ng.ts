import { PipeTransform } from '@angular/core';
import { mockComponent } from './mock-component';
import { mockPipe } from './mock-pipe';
import { mockProvider } from './mock-provider';
import { getDecoratorNames } from './ng-decorator-helpers';
import { createTypeAndMock, noOp } from './ts-mockito-helpers';
import { SetupMockFn, TypeOrMock } from './types';

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

  if (decoratorNames.includes('Injectable')) {
    return mockProvider(mock, setup);
  }

  throw new Error('Unknown decorator.');
}
