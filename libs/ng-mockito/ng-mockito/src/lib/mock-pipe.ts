/* eslint-disable @typescript-eslint/no-explicit-any */
import { Pipe, PipeTransform, Type } from '@angular/core';
import { instance } from 'ts-mockito';
import { getDecoratorMetadata } from './ng-decorator-helpers';
import { createTypeAndMock, noOp, TypeOrMock } from './ts-mockito-helpers';

export function mockPipe<T extends PipeTransform>(
  pipe: TypeOrMock<T>,
  setupMock: (m: T) => void = noOp
): Type<T> {
  const { type, mock: mockPipeDelegate } = createTypeAndMock(pipe);
  const { name, pure } = getDecoratorMetadata(type, 'Pipe');

  const mockPipeDelegateInstance = instance(mockPipeDelegate);

  @Pipe({ name, pure })
  class MockPipe implements PipeTransform {
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
