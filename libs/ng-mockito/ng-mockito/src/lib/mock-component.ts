/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, EventEmitter } from '@angular/core';
import { instance, when } from 'ts-mockito';
import {
  getComponentProperties,
  getDecoratorMetadata,
} from './ng-decorator-helpers';
import { createTypeAndMock, noOp } from './ts-mockito-helpers';
import { SetupMockFn, TypeOrMock } from './types';

export function mockComponent<T>(
  component: TypeOrMock<T>,
  setupMock: SetupMockFn<T> = noOp
) {
  const { type, mock } = createTypeAndMock(component);
  const { selector } = getDecoratorMetadata(type, 'Component');
  const { inputs, outputs } = getComponentProperties(type);

  const metadata: Component = {
    selector,
    template: '<ng-content></ng-content>',
    inputs,
    outputs,
  };

  setupMock(mock);

  outputs.forEach((output) => {
    const outputStub = (mock as any)[output];
    // provide default EventEmitter stub for all output properties,
    // if they are not already set up.
    if (outputStub?.methodStubCollection?.items?.length === 0) {
      when((mock as any)[output]).thenReturn(new EventEmitter<any>());
    }
  });

  function MockComponent() {
    return instance(mock);
  }

  return Component(metadata)(MockComponent);
}
