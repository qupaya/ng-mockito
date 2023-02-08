/* eslint-disable @typescript-eslint/no-explicit-any */

import { InjectionToken } from '@angular/core';
import { mock } from '@typestrong/ts-mockito';
import { Mocker } from 'ts-mockito/lib/Mock';
import { TypeAndMock, TypeOrMock, Type } from './types';

export function createTypeAndMock<T>(
  typeOrMock: TypeOrMock<T>
): TypeAndMock<T> {
  if (!typeOrMock) {
    throw new Error(
      'Given argument was null or undefined. Please provide a class or a ts-mockito mock.'
    );
  }
  if (typeOrMock instanceof InjectionToken) {
    throw new Error(
      `Given object was an InjectionToken.
      To mock InjectionTokens, please provide it like this: [TheInjectionToken, TheClassUsingIt].

      Examples:
      - mockNg([DOCUMENT, MyService])
      - mockToken([DOCUMENT, MyService])
      - mockNg([DOCUMENT, MyService], doc => when(doc.querySelector(anyString()).thenReturn({} as Element) ))
      - mockNg([DOCUMENT, MyService], {use: predefinedDocumentMock})
      `
    );
  } else if (typeof typeOrMock === 'object') {
    return { type: getMockedClass(typeOrMock), mock: typeOrMock as T };
  } else if (isClass(typeOrMock)) {
    return { type: typeOrMock as Type<T>, mock: mock(typeOrMock) };
  } else {
    const functionNameDetail = getFunctionNameDetail(typeOrMock);

    throw new Error(
      `Given argument had invalid type: ${typeof typeOrMock}${functionNameDetail}. Please provide a class or a ts-mockito mock.`
    );
  }
}

function getFunctionNameDetail(typeOrMock: any): string {
  if (typeof typeOrMock !== 'function') {
    return '';
  }

  if (typeOrMock.name === '') {
    const functionInChars = typeOrMock.toString();
    const firstCharsOfFunction = functionInChars.substring(0, 50);
    return ` (${firstCharsOfFunction}...)`;
  }

  return ` (${typeOrMock.name})`;
}

function isClass(anything: unknown) {
  function startsWithUppercaseLetter(s?: string) {
    // as a last resort, we trust that constructor functions start with upper-case letters
    return !!s && s.length > 0 && s[0].toUpperCase() === s[0];
  }

  try {
    return (
      typeof anything === 'function' &&
      ('ctorParameters' in anything ||
        anything.toString()?.trim().startsWith('class') ||
        startsWithUppercaseLetter(anything.name))
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

export function isMock(maybeMock: any): boolean {
  return typeof maybeMock === 'object' && '__tsmockitoMocker' in maybeMock;
}

function getTsMockitoMocker<T>(mock: T): Mocker {
  return (mock as any).__tsmockitoMocker;
}
