/* eslint-disable @typescript-eslint/no-explicit-any */

import { Type } from '@angular/core';
import { mock } from 'ts-mockito';
import { Mocker } from 'ts-mockito/lib/Mock';
import { TypeAndMock, TypeOrMock } from './types';

export function createTypeAndMock<T>(
  typeOrMock: TypeOrMock<T>
): TypeAndMock<T> {
  if (!typeOrMock) {
    throw new Error(
      'Given argument was null or undefined. Please provide a class or a ts-mockito mock.'
    );
  }

  if (typeof typeOrMock === 'object') {
    return { type: getMockedClass(typeOrMock), mock: typeOrMock };
  } else if (isClass(typeOrMock)) {
    return { type: typeOrMock as Type<T>, mock: mock(typeOrMock) };
  } else {
    throw new Error(
      `Given argument had invalid type: ${typeof typeOrMock}. Please provide a class or a ts-mockito mock.`
    );
  }
}

function isClass(anything: unknown) {
  try {
    return (
      typeof anything === 'function' &&
      anything.toString()?.trim().startsWith('class')
    );
  } catch (e) {
    throw new Error(
      `Given argument could be a class, but its toString() method threw an error. Please provide a class or a ts-mockito mock. Error was: ${e}`
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
        Please provide a class or a mock created by ts-mockito mock() function.`
      );
    } else {
      throw new Error(
        `Given object was no ts-mockito mock, but an instance of ${constructorName}.
          Please provide a class or a ts-mockito mock.`
      );
    }
  }
  const mockedClass = getTsMockitoMocker<T>(mock)['clazz'] as Type<T>;
  return mockedClass;
}

export function noOp() {
  // do nothing
}

export function isStubbed<T>(mock: T, propertyName: string) {
  const mocker = getTsMockitoMocker(mock);
  return propertyName in mocker['methodStubCollections'];
}

function getTsMockitoMocker<T>(mock: T): Mocker {
  return (mock as any).__tsmockitoMocker;
}
