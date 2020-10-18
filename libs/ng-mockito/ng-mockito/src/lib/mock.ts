import { PipeTransform } from '@angular/core';
import { mockPipe } from './mock-pipe';
import { getDecoratorNames } from './ng-decorator-helpers';
import { createTypeAndMock, noOp } from './ts-mockito-helpers';
import { TypeOrMock, SetupMockFn } from './types';
import { mockProvider } from './mock-provider';

export function mock<T>(
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

  if (decoratorNames.includes('Injectable')) {
    return mockProvider(mock, setup);
  }

  throw new Error('Unknown decorator.');
}
