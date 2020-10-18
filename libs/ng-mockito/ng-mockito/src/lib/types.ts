import { Type } from '@angular/core';

export type TypeOrMock<T> = Type<T> | T;
export type TypeAndMock<T> = { type: Type<T>; mock: T };

export type SetupMockFn<T> = (m: T) => void;
