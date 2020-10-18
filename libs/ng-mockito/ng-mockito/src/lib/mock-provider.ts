import { FactoryProvider } from '@angular/core';
import { instance } from 'ts-mockito';
import { createTypeAndMock, noOp } from './ts-mockito-helpers';
import { SetupMockFn, TypeOrMock } from './types';

export function mockProvider<T>(
  provide: TypeOrMock<T>,
  setupMock: SetupMockFn<T> = noOp
): FactoryProvider {
  const { type, mock } = createTypeAndMock(provide);

  setupMock(mock);
  return { provide: type, useFactory: () => instance(mock) };
}
