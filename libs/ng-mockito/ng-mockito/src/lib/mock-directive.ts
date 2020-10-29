/* eslint-disable @typescript-eslint/no-explicit-any */
import { Directive, EventEmitter, Type } from '@angular/core';
import { instance, when } from 'ts-mockito';
import {
  getDecoratorMetadata,
  getDirectiveProperties,
} from './ng-decorator-helpers';
import { createTypeAndMock, isStubbed, noOp } from './ts-mockito-helpers';
import { SetupMockFn, TypeOrMock } from './types';

/**
 * Returns a mocked version of the given directive.
 *
 * `EventEmitters` of outputs are stubbed with an empty `new EventEmitter<any>()`, if not stubbed manually.
 *
 * @param typeOrMock either the class to mock, or an already prepared ts-mockito mock
 * @param setupMock  Optional setup function for stubbing. Perfect place to call ts-mockito's `when` function
 */
export function mockDirective<T>(
  directive: TypeOrMock<T>,
  setupMock: SetupMockFn<T> = noOp
): Type<T> {
  const { type, mock } = createTypeAndMock(directive);
  const { selector } = getDecoratorMetadata(type, 'Directive');
  const { inputs, outputs } = getDirectiveProperties(type);

  const metadata: Directive = {
    selector,
    inputs,
    outputs,
  };

  setupMock(mock);

  outputs.forEach((output) => {
    // provide default EventEmitter stub for all output properties,
    // if they are not already set up.
    if (!isStubbed(mock, output)) {
      when((mock as any)[output]).thenReturn(new EventEmitter<any>());
    }
  });

  function MockDirective() {
    return instance(mock);
  }

  return (Directive(metadata)(MockDirective) as unknown) as Type<T>;
}
