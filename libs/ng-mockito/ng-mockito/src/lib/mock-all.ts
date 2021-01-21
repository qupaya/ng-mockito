import { mockNg } from './mock-ng';
import { TypeOrMock } from './types';

/**
 * Returns an array of the mocked versions of the given type.
 * Decides which kind of Angular building block (component, directive, pipe or services) needs to be mocked.
 *
 * In case of a service mock, a `FactoryProvider` is returned, that can be directly used in the `providers`
 * array of the test module.
 *
 * @param typesOrMocks One or more of: either the class to mock, or an already prepared ts-mockito mock
 */
export function mockAll(...typesOrMocks: TypeOrMock<unknown>[]) {
  return typesOrMocks.map((t) => mockNg(t));
}
