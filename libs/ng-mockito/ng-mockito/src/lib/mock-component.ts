/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, EventEmitter } from '@angular/core';
import { instance, when } from 'ts-mockito';
import {
  getDirectiveProperties,
  getDecoratorMetadata,
} from './ng-decorator-helpers';
import { createTypeAndMock, noOp, isStubbed } from './ts-mockito-helpers';
import { SetupMockFn, TypeOrMock, Type } from './types';

/**
 * Returns a mocked version of the given component.
 *
 * `EventEmitters` of outputs are stubbed with an empty `new EventEmitter<any>()`, if not stubbed manually.
 *
 * @param typeOrMock either the class to mock, or an already prepared ts-mockito mock
 * @param setupMock  Optional setup function for stubbing. Perfect place to call ts-mockito's `when` function
 */
export function mockComponent<T>(
  component: TypeOrMock<T>,
  setupMock: SetupMockFn<T> = noOp
): Type<T> {
  const { type, mock } = createTypeAndMock(component);
  const { selector } = getDecoratorMetadata(type, 'Component');
  const { inputs, outputs } = getDirectiveProperties(type);

  const metadata: Component = {
    selector,
    template: '<ng-content></ng-content>',
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

  function MockComponent() {
    return instance(mock);
  }

  return (Component(metadata)(MockComponent) as unknown) as Type<T>;
}
