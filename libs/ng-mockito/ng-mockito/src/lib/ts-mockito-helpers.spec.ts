/* eslint-disable @typescript-eslint/no-empty-function */
import { instance, mock, when } from 'ts-mockito';
import { createTypeAndMock, isStubbed } from './ts-mockito-helpers';

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

    it('should create type and mock if type is given', () => {
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
});
