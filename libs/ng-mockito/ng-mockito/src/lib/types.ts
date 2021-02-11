// eslint-disable-next-line @typescript-eslint/ban-types
export type Type<T> = Function & { prototype: T };

export type TypeOrMock<T> = Type<T> | T;
export type TypeAndMock<T> = { type: Type<T>; mock: T };

export type SetupMockFn<T> = (m: T) => void;
