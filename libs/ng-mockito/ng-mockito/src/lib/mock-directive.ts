/* eslint-disable @typescript-eslint/no-explicit-any */
import { Directive, EventEmitter } from '@angular/core';
import { instance, when } from 'ts-mockito';
import {
  getDecoratorMetadata,
  getDirectiveProperties,
} from './ng-decorator-helpers';
import { createTypeAndMock, isStubbed, noOp } from './ts-mockito-helpers';
import { SetupMockFn, TypeOrMock } from './types';

export function mockDirective<T>(
  directive: TypeOrMock<T>,
  setupMock: SetupMockFn<T> = noOp
) {
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

  return Directive(metadata)(MockDirective);
}
