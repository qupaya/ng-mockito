import {
  Component,
  Pipe,
  PipeTransform,
  Injectable,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { getComponentProperties } from './ng-decorator-helpers';
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

    it('should throw error if metadata was not found', () => {
      @Component({ template: 'test' })
      class TestComponent {}

      expect(() => getDecoratorMetadata(TestComponent, 'Pipe')).toThrowError(
        /Did not find decorator Pipe. Found: Component/
      );
    });
  });

  describe('getComponentProperties', () => {
    it('should get Inputs and Outpus', () => {
      @Component({})
      class TestComponent {
        @Input() testInput1 = '';
        @Input('otherNameForTestInput2') testInput2 = true;
        @Output() testOutput1 = new EventEmitter<string>();
        @Output() testOutput2 = new EventEmitter<boolean>();
      }

      expect(getComponentProperties(TestComponent)).toEqual({
        inputs: ['testInput1', 'testInput2'],
        outputs: ['testOutput1', 'testOutput2'],
      });
    });
  });
});
