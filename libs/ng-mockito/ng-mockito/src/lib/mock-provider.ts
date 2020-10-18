import { FactoryProvider } from '@angular/core';
import { instance } from 'ts-mockito';
import { createTypeAndMock, noOp, TypeOrMock } from './ts-mockito-helpers';

export function mockProvider<T>(
  provide: TypeOrMock<T>,
  setupMock: (m: T) => void = noOp
): FactoryProvider {
  const { type, mock } = createTypeAndMock(provide);

  setupMock(mock);
  return { provide: type, useFactory: () => instance(mock) };
}
