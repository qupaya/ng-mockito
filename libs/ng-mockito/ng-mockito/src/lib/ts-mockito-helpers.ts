/* eslint-disable @typescript-eslint/no-explicit-any */

import { Type } from '@angular/core';
import { mock } from 'ts-mockito';
import { TypeAndMock, TypeOrMock } from './types';

export function createTypeAndMock<T>(
  typeOrMock: TypeOrMock<T>
): TypeAndMock<T> {
  if (typeof typeOrMock === 'object') {
    return { type: getMockedClass(typeOrMock), mock: typeOrMock };
  } else if (typeof typeOrMock === 'function') {
    return { type: typeOrMock as Type<T>, mock: mock(typeOrMock) };
  } else {
    throw new Error(
      `Given argument had invalid type. Please provide a class or a ts-mockito mock.`
    );
  }
}

function getMockedClass<T>(mock: T): Type<T> {
  if (!('__tsmockitoMocker' in mock)) {
    const constructorName = (mock as any).constructor?.name;
    if (constructorName === '') {
      throw new Error(
        `Given object was no ts-mockito mock.
        Constructor name was empty, maybe you used instance() function?
        Please provide a class or a ts-mockito mock created by mock() function.`
      );
    } else {
      throw new Error(
        `Given object was no ts-mockito mock, but an instance of ${constructorName}.
          Please provide a class or a ts-mockito mock.`
      );
    }
  }
  const mockedClass = (mock as any).__tsmockitoMocker.clazz as Type<T>;
  return mockedClass;
}

export function noOp() {
  // do nothing
}
