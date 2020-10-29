import {
  Component,
  Pipe,
  PipeTransform,
  Injectable,
  Input,
  Output,
  EventEmitter,
  Directive,
} from '@angular/core';
import { getDirectiveProperties } from './ng-decorator-helpers';
import { Type } from '@angular/core';
import {
  getDecoratorMetadata,
  getDecoratorNames,
} from './ng-decorator-helpers';

describe('Angular decorator helpers', () => {
  describe('getDecoratorNames', () => {
    it('should get decorator names', () => {
      @Injectable()
      @Component({})
      @Pipe({ name: 'test' })
      class TestPipe implements PipeTransform {
        transform() {
          return null;
        }
      }

      expect(getDecoratorNames(TestPipe)).toEqual(
        expect.arrayContaining(['Pipe', 'Injectable', 'Component'])
      );
    });
  });

  describe('getDecoratorMetadata', () => {
    it('should get Pipe metadata', () => {
      @Pipe({ name: 'test' })
      class TestPipe implements PipeTransform {
        transform() {
          return null;
        }
      }

      expect(getDecoratorMetadata(TestPipe, 'Pipe').name).toEqual('test');
    });

    it('should get Component metadata', () => {
      @Component({ template: 'test' })
      class TestComponent {}

      expect(getDecoratorMetadata(TestComponent, 'Component').template).toEqual(
        'test'
      );
    });

    it('should get Directive metadata', () => {
      @Directive({ selector: '[test]' })
      class TestDirective {}

      expect(getDecoratorMetadata(TestDirective, 'Directive').selector).toEqual(
        '[test]'
      );
    });

    it('should get Injectable metadata', () => {
      @Injectable({ providedIn: 'root' })
      class TestService {}

      expect(getDecoratorMetadata(TestService, 'Injectable')).toBeDefined();
    });

    it('should throw error if metadata was not found', () => {
      @Component({ template: 'test' })
      class TestComponent {}

      expect(() => getDecoratorMetadata(TestComponent, 'Pipe')).toThrowError(
        /Did not find decorator Pipe. Found: Component/
      );
    });
  });

  describe('getDirectiveProperties', () => {
    @Component({})
    class TestComponent {
      @Input() testInput1 = '';
      @Input('otherNameForTestInput2') testInput2 = true;
      @Output() testOutput1 = new EventEmitter<string>();
      @Output() testOutput2 = new EventEmitter<boolean>();
    }

    @Directive({})
    class TestDirective {
      @Input() testInput1 = '';
      @Input('otherNameForTestInput2') testInput2 = true;
      @Output() testOutput1 = new EventEmitter<string>();
      @Output() testOutput2 = new EventEmitter<boolean>();
    }

    it.each`
      type
      ${TestComponent}
      ${TestDirective}
    `(
      'should get Inputs and Outpus for $type',
      <T>({ type }: { type: Type<T> }) => {
        expect(getDirectiveProperties(type)).toEqual({
          inputs: ['testInput1', 'testInput2'],
          outputs: ['testOutput1', 'testOutput2'],
        });
      }
    );
  });
});
