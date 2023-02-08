/* eslint-disable @typescript-eslint/no-empty-function */
import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { InjectionToken, Renderer2 } from '@angular/core';
import { instance, mock, when } from '@typestrong/ts-mockito';
import { createTypeAndMock, isStubbed, isMock } from './ts-mockito-helpers';

describe('ts-mockito helpers', () => {
  describe('createTypeAndMock', () => {
    function funcWithThrowingToString() {}
    funcWithThrowingToString.toString = () => {
      throw new Error('test');
    };

    class classWithThrowingToString {}
    classWithThrowingToString.toString = () => {
      throw new Error('test');
    };

    it.each`
      argument                         | description                    | expectedMessage
      ${undefined}                     | ${'undefined'}                 | ${/null or undefined/}
      ${null}                          | ${'null'}                      | ${/null or undefined/}
      ${void 0}                        | ${'void 0'}                    | ${/null or undefined/}
      ${'some value'}                  | ${'string'}                    | ${/type: string/}
      ${{ test: 'value' }}             | ${'object'}                    | ${/instance of Object/}
      ${instance(mock(class Test {}))} | ${'ts-mockito instance'}       | ${/maybe you used instance\(\) function/}
      ${function () {}}                | ${'function'}                  | ${/type: function/}
      ${function test() {}}            | ${'names funtion'}             | ${/type: function/}
      ${() => {}}                      | ${'arrow function'}            | ${/type: function/}
      ${funcWithThrowingToString}      | ${'funcWithThrowingToString'}  | ${/toString\(\) method threw an error/}
      ${classWithThrowingToString}     | ${'classWithThrowingToString'} | ${/toString\(\) method threw an error/}
    `(
      'should throw error if argument is $description',
      ({ argument, expectedMessage }) => {
        expect(() => createTypeAndMock(argument)).toThrowError(expectedMessage);
      }
    );

    it.each`
      argument                        | description         | expectedMessage
      ${function myTestFunction() {}} | ${'named function'} | ${/myTestFunction/}
      ${() => {
  console.log('sample code');
  console.log('2 sample code');
}} | ${'arrow function'} | ${/sample code/}
      ${function () {
  console.log('sample code');
  console.log('2 sample code');
}} | ${'nameless function'} | ${/sample code/}
    `(
      'when using an $description should include $expectedMessage as info when throwing an error',
      ({ argument, expectedMessage }) => {
        expect(() => createTypeAndMock(argument)).toThrowError(expectedMessage);
      }
    );

    it('should create type and mock if class is given', () => {
      class Test {
        test() {
          throw new Error('real implementation used.');
        }
      }
      const typeAndMock = createTypeAndMock(Test);

      expect(typeAndMock.type).toBe(Test);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect((typeAndMock.mock as any).__tsmockitoMocker.clazz).toBe(Test);
    });

    it('should create type and mock if abstract class is given', () => {
      abstract class Test {}
      const typeAndMock = createTypeAndMock(Test);

      expect(typeAndMock.type).toBe(Test);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect((typeAndMock.mock as any).__tsmockitoMocker.clazz).toBe(Test);
    });

    it('should create type and mock if mock is given', () => {
      class Test {
        test() {
          throw new Error('real implementation used.');
        }
      }
      const mockTest = mock(Test);
      const typeAndMock = createTypeAndMock(mockTest);

      expect(typeAndMock.type).toBe(Test);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect((typeAndMock.mock as any).__tsmockitoMocker.clazz).toBe(Test);
    });

    it('should accept transpiled classes', () => {
      expect(() => createTypeAndMock(HttpClient)).not.toThrow();
    });

    it('should accept transpiled abstract classes', () => {
      expect(() => createTypeAndMock(Renderer2)).not.toThrow();
    });

    it.each`
      argument                      | description
      ${new InjectionToken('test')} | ${'custom injection token'}
      ${DOCUMENT}                   | ${'pre-defined injection token'}
    `(
      'when trying to mock $description it should throw an error message aiding the user use correct syntax',
      ({ argument }: { argument: InjectionToken<unknown> }) => {
        expect(() => createTypeAndMock(argument)).toThrow(
          /Given object was an InjectionToken.\s*To mock InjectionTokens, please provide it like this: \[TheInjectionToken, TheClassUsingIt\]./
        );
      }
    );
  });

  describe('isStubbed', () => {
    it('should return true if property is stubbed', () => {
      const mockTest = mock(
        class Test {
          testProperty = '';
          testFunction() {
            return '';
          }
        }
      );
      when(mockTest.testProperty).thenReturn('test');
      when(mockTest.testFunction()).thenReturn('test');

      expect(isStubbed(mockTest, 'testProperty')).toBe(true);
      expect(isStubbed(mockTest, 'testFunction')).toBe(true);
    });

    it('should return false if property is not stubbed', () => {
      const mockTest = mock(
        class Test {
          testProperty = '';
          testFunction() {
            return '';
          }
        }
      );

      expect(isStubbed(mockTest, 'testProperty')).toBe(false);
      expect(isStubbed(mockTest, 'testFunction')).toBe(false);
    });
  });

  describe('isMock', () => {
    it('should recognize a class mock as mock', () => {
      const mockTest = mock(
        class Test {
          testProperty = '';
          testFunction() {
            return '';
          }
        }
      );
      expect(isMock(mockTest)).toBeTruthy();
    });

    it('should recognize an interface mock as mock', () => {
      // eslint-disable-next-line @typescript-eslint/ban-types
      const mockTest = mock<{}>();
      expect(isMock(mockTest)).toBeTruthy();
    });

    it('should recognize a class instance as not a mock', () => {
      const mockTest = new (class Test {
        testProperty = '';
        testFunction() {
          return '';
        }
      })();
      expect(isMock(mockTest)).toBeFalsy();
    });
  });
});
