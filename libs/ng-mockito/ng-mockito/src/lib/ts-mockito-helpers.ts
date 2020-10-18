/* eslint-disable @typescript-eslint/no-explicit-any */

import { Type } from '@angular/core';

export function getMockedClass<T>(mock: T): Type<T> {
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
