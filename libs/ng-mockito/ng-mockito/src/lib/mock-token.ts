/* eslint-disable @typescript-eslint/no-explicit-any */
import { FactoryProvider, InjectionToken, Type } from '@angular/core';
import { instance, mock } from '@typestrong/ts-mockito';
import {
  createDefaultValue,
  getConstructorParameterTypeOfInjectionToken,
} from './reflection/injection-token-helpers';
import {
  ClassInjectionTokenParam,
  ValueInjectionTokenParam,
} from './reflection/injection-token-param';
import { SetupMockFn } from './types';
import { isMock } from './ts-mockito-helpers';

/**
 * Tuple of an injection token and its client (e.g. the service injecting this token).
 */
export type TokenWithClient<T, U> = Readonly<[InjectionToken<T>, Type<U>]>;

export type TokenConfigValue<T> = { use: T };

type ValueType =
  | boolean
  | string
  | number
  | symbol
  | unknown[]
  | ((...args: any) => any);

export type TokenConfigOrSetup<T> = T extends ValueType
  ? TokenConfigValue<T> // for value types, it only makes sense to provide values instead of mocks
  : SetupMockFn<T> | TokenConfigValue<T>;

function isValueConfig<T>(
  configOrSetup?: SetupMockFn<T> | TokenConfigValue<T>
): configOrSetup is TokenConfigValue<T> {
  return configOrSetup !== undefined && 'use' in configOrSetup;
}

function isSetupMockFn<T>(
  configOrSetup?: SetupMockFn<T> | TokenConfigValue<T>
): configOrSetup is SetupMockFn<T> {
  return (
    configOrSetup !== undefined &&
    typeof configOrSetup === 'function' &&
    !('use' in configOrSetup)
  );
}

/**
 * Returns a mock or fake value for something injected via InjectionToken, wrapped in a `FactoryProvider`, that can be directly used in the `providers`
 * array of the test module.
 *
 * @param tokenWithClient The InjectionToken and the class that is using it (the client)
 * @param configOrSetup  Optional setup function for stubbing or configuration object. Depends on the type of InjectionToken
 */
export function mockToken<T, U>(
  tokenWithClient: TokenWithClient<T, U>,
  configOrSetup?: TokenConfigOrSetup<T>
): FactoryProvider {
  const [token, client] = tokenWithClient;
  const paramType = getConstructorParameterTypeOfInjectionToken(client, token);

  if (paramType.optional && configOrSetup === undefined) {
    return { provide: token, useFactory: () => null };
  }

  switch (paramType.type) {
    case 'value':
      return mockValueToken(token, paramType, configOrSetup);
    case 'class':
      return mockClassToken(token, paramType, configOrSetup);
    case 'interface':
      return mockInterfaceToken(token, configOrSetup);

    default:
      ((x: never) => {
        throw new Error(
          `Could not determine mock for InjectionToken: ${JSON.stringify(x)}!`
        );
      })(paramType);
  }
}

function mockValueToken<T>(
  token: InjectionToken<T>,
  paramType: ValueInjectionTokenParam,
  configOrSetup?: TokenConfigOrSetup<T>
): FactoryProvider {
  if (configOrSetup !== undefined && !isValueConfig(configOrSetup)) {
    throw new Error(`Provided illegal config for value InjectionToken. Please provide a value matching the constructor parameter or omit config to provide default value.
      Example config for string InjectionToken: { use: 'test'}`);
  }

  const providedValue =
    configOrSetup === undefined
      ? createDefaultValue<T>(paramType)
      : configOrSetup.use;

  return {
    provide: token,
    useFactory: () => providedValue,
  };
}

function mockClassToken<T>(
  token: InjectionToken<T>,
  paramType: ClassInjectionTokenParam,
  configOrSetup?: TokenConfigOrSetup<T>
): FactoryProvider {
  if (configOrSetup === undefined || isSetupMockFn(configOrSetup)) {
    const mockedClass = mock<T>(paramType.classType);

    if (configOrSetup !== undefined) {
      configOrSetup(mockedClass);
    }

    return {
      provide: token,
      useFactory: () => instance(mockedClass),
    };
  }

  if (isValueConfig(configOrSetup)) {
    return {
      provide: token,
      useFactory: () =>
        isMock(configOrSetup.use)
          ? instance(configOrSetup.use)
          : configOrSetup.use,
    };
  }

  throw new Error(
    `Could not determine config for class InjectionToken. Please provide a setup function, use or omit config to provide default mock.`
  );
}

function mockInterfaceToken<T>(
  token: InjectionToken<T>,
  configOrSetup?: TokenConfigOrSetup<T>
): FactoryProvider {
  if (configOrSetup === undefined || isSetupMockFn(configOrSetup)) {
    const mockedClass = mock<T>();

    if (configOrSetup !== undefined) {
      configOrSetup(mockedClass);
    }

    return {
      provide: token,
      useFactory: () => instance(mockedClass),
    };
  }

  if (isValueConfig(configOrSetup)) {
    return {
      provide: token,
      useFactory: () =>
        isMock(configOrSetup.use)
          ? instance(configOrSetup.use)
          : configOrSetup.use,
    };
  }

  throw new Error(
    `Could not determine config for interface InjectionToken. Please provide a setup function, use or omit config to provide default mock.`
  );
}
