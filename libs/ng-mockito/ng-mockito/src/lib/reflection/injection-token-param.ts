import { Type } from '@angular/core';

/**
 * Constructor functions that are used to create default values for injection tokens.
 */
export const constructables = [
  String,
  Boolean,
  Number,
  Array,
  Function,
  Symbol,
] as const;

export type Constructable = typeof constructables[number];

/**
 * Information about an injection token for a constructable value.
 * @see Constructable
 */
export interface ValueInjectionTokenParam {
  /**
   * Native value, array, function or symbol (something for which a default value can be constructed)
   */
  type: 'value';
  /**
   * Function that can be used to create the default value
   */
  constructorFunction: Constructable;
  /**
   * Whether the parameter is optional (`Optional()` decorator was used)
   */
  optional: boolean;
}

/**
 * Information about an injection token for a class.
 */
export interface ClassInjectionTokenParam {
  /**
   * Class that can be mocked
   */
  type: 'class';
  /**
   * Class type used for mocking
   */
  classType: Type<unknown>;
  /**
   * Whether the parameter is optional (`Optional()` decorator was used)
   */
  optional: boolean;
}

/**
 * Information about an injection token for an interface.
 */
export interface InterfaceInjectionTokenParam {
  /**
   * Interface that can be mocked (but needs special handling)
   */
  type: 'interface';
  /**
   * Whether the parameter is optional (`Optional()` decorator was used)
   */
  optional: boolean;
}

/**
 * Information about the constructor parameter that uses an injection token.
 */
export type InjectionTokenParam =
  | ValueInjectionTokenParam
  | ClassInjectionTokenParam
  | InterfaceInjectionTokenParam;
