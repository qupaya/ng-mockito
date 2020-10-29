import {
  Type,
  Pipe,
  ɵReflectionCapabilities,
  Component,
  Injectable,
  Directive,
} from '@angular/core';

type DecoratorName = 'Pipe' | 'Component' | 'Directive' | 'Injectable';

type Decorator<D> = D extends 'Pipe'
  ? Pipe
  : D extends 'Component'
  ? Component
  : D extends 'Directive'
  ? Directive
  : D extends 'Injectable'
  ? Injectable
  : Record<string, unknown>;

const reflection = new ɵReflectionCapabilities();

export function getDecoratorNames<T>(decoratedClass: Type<T>): DecoratorName[] {
  return reflection.annotations(decoratedClass).map((a) => a.ngMetadataName);
}

export function getDecoratorMetadata<T, D extends DecoratorName>(
  decoratedClass: Type<T>,
  decoratorName: D
): Decorator<D> {
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

export function getDirectiveProperties<T>(directive: Type<T>) {
  const props = reflection.propMetadata(directive);
  const inputs: string[] = [];
  const outputs: string[] = [];
  Object.entries(props).forEach((entry) => {
    if (entry[1].find((decorator) => decorator.ngMetadataName === 'Input')) {
      inputs.push(entry[0]);
    }
    if (entry[1].find((decorator) => decorator.ngMetadataName === 'Output')) {
      outputs.push(entry[0]);
    }
  });
  return { inputs, outputs };
}
