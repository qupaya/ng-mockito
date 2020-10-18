import { FactoryProvider, Type } from '@angular/core';
import { instance, mock } from 'ts-mockito';
import { getMockedClass } from './ts-mockito-helpers';

export function mockProvider<T>(
  provide: Type<T> | T,
  setupMock: (m: T) => void = noOp
): FactoryProvider {
  if (typeof provide === 'object') {
    return createFactoryProviderFromMock<T>(provide, setupMock);
  } else if (typeof provide === 'function') {
    return createFactoryProviderFromClass<T>(provide as Type<T>, setupMock);
  } else {
    throw new Error(
      `Given argument had invalid type. Please provide a class or a ts-mockito mock.`
    );
  }
}

function createFactoryProviderFromClass<T>(
  provide: Type<T>,
  setupMock: (m: T) => void
) {
  const mocked = mock<T>(provide);
  setupMock(mocked);
  return { provide, useFactory: () => instance(mocked) };
}

function createFactoryProviderFromMock<T>(
  provide: T,
  setupMock: (m: T) => void
) {
  const mockedClass = getMockedClass(provide);
  setupMock(provide);
  return { provide: mockedClass, useFactory: () => instance(provide) };
}

function noOp() {
  // do nothing
}
