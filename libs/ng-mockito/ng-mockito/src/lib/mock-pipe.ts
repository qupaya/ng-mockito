import { Pipe } from '@angular/core';
import { instance } from '@typestrong/ts-mockito';
import { getDecoratorMetadata } from './ng-decorator-helpers';
import { createTypeAndMock, noOp } from './ts-mockito-helpers';
import { SetupMockFn, TypeOrMock, Type } from './types';

/**
 * Returns a mocked version of the given pipe.
 *
 * @param pipe either the class to mock, or an already prepared ts-mockito mock
 * @param setupMock  Optional setup function for stubbing. Perfect place to call ts-mockito's `when` function
 */
export function mockPipe<T>(
  pipe: TypeOrMock<T>,
  setupMock: SetupMockFn<T> = noOp
): Type<T> {
  const { type, mock } = createTypeAndMock(pipe);
  const metadata = getDecoratorMetadata(type, 'Pipe');

  setupMock(mock);

  function MockPipe() {
    return instance(mock);
  }

  Pipe(metadata)(MockPipe);

  return MockPipe as unknown as Type<T>;
}
