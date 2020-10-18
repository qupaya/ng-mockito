import { Type, Pipe, ɵReflectionCapabilities, Component } from '@angular/core';

type DecoratorName = 'Pipe' | 'Component';

type Decorator<D> = D extends 'Pipe'
  ? Pipe
  : D extends 'Component'
  ? Component
  : Record<string, unknown>;

export function getDecoratorMetadata<T, D extends DecoratorName>(
  decoratedClass: Type<T>,
  decoratorName: D
): Decorator<D> {
  const reflection = new ɵReflectionCapabilities();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const annotations: any[] = reflection.annotations(decoratedClass);
  const decorator = annotations.find((a) => a.ngMetadataName === decoratorName);
  if (!decorator) {
    throw new Error(
      `Did not find decorator ${decoratorName}. Found: ${annotations
        .map((a) => a.ngMetadataName)
        .join(',')}`
    );
  }
  return decorator;
}
