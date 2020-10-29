import { Pipe, PipeTransform, Type } from '@angular/core';
import { instance } from 'ts-mockito';
import { getDecoratorMetadata } from './ng-decorator-helpers';
import { createTypeAndMock, noOp } from './ts-mockito-helpers';
import { TypeOrMock, SetupMockFn } from './types';

/**
 * Returns a mocked version of the given pipe.
 *
 * @param pipe either the class to mock, or an already prepared ts-mockito mock
 * @param setupMock  Optional setup function for stubbing. Perfect place to call ts-mockito's `when` function
 */
export function mockPipe<T extends PipeTransform>(
  pipe: TypeOrMock<T>,
  setupMock: SetupMockFn<T> = noOp
): Type<T> {
  const { type, mock: mockPipeDelegate } = createTypeAndMock(pipe);
  const { name, pure } = getDecoratorMetadata(type, 'Pipe');

  const mockPipeDelegateInstance = instance(mockPipeDelegate);

  @Pipe({ name, pure })
  class MockPipe implements PipeTransform {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    transform(value: any, ...args: any[]) {
      if (args.length > 0) {
        return mockPipeDelegateInstance.transform(value, ...args);
      } else {
        return mockPipeDelegateInstance.transform(value);
      }
    }
  }

  setupMock(mockPipeDelegate);

  return MockPipe as Type<T>;
}
