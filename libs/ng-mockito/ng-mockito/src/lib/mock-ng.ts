import { FactoryProvider, InjectionToken } from '@angular/core';
import { mockComponent } from './mock-component';
import { mockDirective } from './mock-directive';
import { mockPipe } from './mock-pipe';
import { mockProvider } from './mock-provider';
import { mockToken, TokenWithClient, TokenConfigOrSetup } from './mock-token';
import { getDecoratorNames } from './ng-decorator-helpers';
import { createTypeAndMock, noOp } from './ts-mockito-helpers';
import { SetupMockFn, TypeOrMock, Type } from './types';

type TypeOrMockButNotArrayLike<T> = T extends unknown[]
  ? never // exclude array-likes, otherwise TokenWithClient could be inferred as TypeOrMock
  : TypeOrMock<T>;

/**
 * Returns a mocked version of the given type.
 * Decides which kind of Angular building block (component, directive, pipe or services) needs to be mocked.
 *
 * In case of service mock, a `FactoryProvider` is returned, that can be directly used in the `providers`
 * array of the test module.
 *
 * @param typeOrMock either the class to mock, or an already prepared ts-mockito mock
 * @param setup  Optional setup function for stubbing. Perfect place to call ts-mockito's `when` function
 */
export function mockNg<T, U>(
  token: TokenWithClient<T, U>,
  configOrSetup?: TokenConfigOrSetup<T>
): FactoryProvider;
export function mockNg<T>(
  typeOrMock: TypeOrMockButNotArrayLike<T>,
  setup?: SetupMockFn<T>
): Type<T> | FactoryProvider;
export function mockNg<T, U>(
  typeOrMock: TypeOrMockButNotArrayLike<T> | TokenWithClient<T, U>,
  configOrSetup?: SetupMockFn<T> | TokenConfigOrSetup<T>
): Type<T> | FactoryProvider {
  if (isTokenWithClient(typeOrMock)) {
    return mockToken(
      typeOrMock,
      configOrSetup as TokenConfigOrSetup<T> | undefined
    );
  }

  const { type, mock } = createTypeAndMock(typeOrMock);
  const decoratorNames = getDecoratorNames(type);
  const setup = (configOrSetup as SetupMockFn<T>) ?? noOp;

  if (decoratorNames.includes('Pipe')) {
    return mockPipe(mock, setup);
  }

  if (decoratorNames.includes('Component')) {
    return mockComponent(mock, setup);
  }

  if (decoratorNames.includes('Directive')) {
    return mockDirective(mock, setup);
  }

  // Injectable decorator or no decorator (in which case
  // we guess that it must be a class to be provided, like ActivatedRoute)
  return mockProvider(mock, setup);
}

function isTokenWithClient<T, U>(
  target: TypeOrMock<T> | TokenWithClient<T, U>
): target is TokenWithClient<T, U> {
  return (
    Array.isArray(target) &&
    target.length > 0 &&
    target[0] instanceof InjectionToken
  );
}
