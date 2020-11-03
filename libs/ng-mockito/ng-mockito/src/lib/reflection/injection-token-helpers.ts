import { InjectionToken, Type, ɵReflectionCapabilities } from '@angular/core';
import {
  Constructable,
  constructables,
  InjectionTokenParam,
} from './injection-token-param';

const reflection = new ɵReflectionCapabilities();

export function getConstructorParameterTypeOfInjectionToken<T, U>(
  decoratedClass: Type<T>,
  token: InjectionToken<U>
): InjectionTokenParam {
  const parameterDescriptions = reflection.parameters(decoratedClass);

  const parameterDescriptionForToken = parameterDescriptions.find(
    (paramDescription) => paramDescription.some((d) => d?.token === token)
  );

  if (!parameterDescriptionForToken) {
    throw new Error(
      `Could not find a constructor parameter of ${decoratedClass.name} that uses token ${token}.`
    );
  }

  const isOptional = parameterDescriptionForToken.some(
    (entry) => entry?.ngMetadataName === 'Optional'
  );

  if (typeof parameterDescriptionForToken[0] === 'function') {
    if (constructables.includes(parameterDescriptionForToken[0])) {
      return {
        type: 'value',
        constructorFunction: parameterDescriptionForToken[0] as Constructable,
        optional: isOptional,
      };
    } else {
      return {
        type: 'class',
        classType: parameterDescriptionForToken[0] as Type<unknown>,
        optional: isOptional,
      };
    }
  }

  return {
    type: 'interface',
    optional: isOptional,
  };
}

export function createDefaultValue<T>(paramType: InjectionTokenParam): T {
  if (paramType.type === 'value') {
    return (paramType.constructorFunction as () => unknown)() as T;
  } else {
    throw new Error(`Could not create default value for inferred type ${paramType} (Currently only String,
      Boolean, Number, Array & Function are supported). Please use 'value' instead of 'inferValue'.`);
  }
}
