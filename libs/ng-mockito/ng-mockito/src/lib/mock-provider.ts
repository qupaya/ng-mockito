import { FactoryProvider } from '@angular/core';
import { instance } from 'ts-mockito';
import { createTypeAndMock, noOp } from './ts-mockito-helpers';
import { SetupMockFn, TypeOrMock } from './types';

/**
 * Returns a mocked version of the given service, wrapped in a `FactoryProvider`, that can be directly used in the `providers`
 * array of the test module.
 *
 * @param provide either the class to mock, or an already prepared ts-mockito mock
 * @param setupMock  Optional setup function for stubbing. Perfect place to call ts-mockito's `when` function
 */
export function mockProvider<T>(
  provide: TypeOrMock<T>,
  setupMock: SetupMockFn<T> = noOp
): FactoryProvider {
  const { type, mock } = createTypeAndMock(provide);

  setupMock(mock);
  return { provide: type, useFactory: () => instance(mock) };
}
