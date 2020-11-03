import { Inject, Injectable, InjectionToken, Optional } from '@angular/core';
import { getConstructorParameterTypeOfInjectionToken } from './injection-token-helpers';

describe('InjectionToken helpers', () => {
  describe('getConstructorParameterTypeOfInjectionToken', () => {
    interface TestInterface {
      someFunction(): void;
    }

    class TestClass {
      x = 0;
    }

    const TEST_TOKEN_INTERFACE = new InjectionToken<TestInterface>('interface');
    const TEST_TOKEN_CLASS = new InjectionToken<TestClass>('class');
    const TEST_TOKEN_STRING = new InjectionToken<string>('string');

    @Injectable()
    class TestService {
      constructor(
        @Inject(TEST_TOKEN_INTERFACE) public testTokenInterface: TestInterface,
        @Inject(TEST_TOKEN_STRING) public testTokenString: string,
        @Inject(TEST_TOKEN_CLASS) public testTokenClass: TestClass
      ) {}
    }

    @Injectable()
    class TestServiceWithOptionals {
      constructor(
        @Optional()
        @Inject(TEST_TOKEN_INTERFACE)
        public testTokenInterfaceOptional: TestInterface,
        @Optional()
        @Inject(TEST_TOKEN_STRING)
        public testTokenStringOptional: string,
        @Optional()
        @Inject(TEST_TOKEN_CLASS)
        public testTokenClass: TestClass
      ) {}
    }

    it('should get parameter for string injection token', () => {
      expect(
        getConstructorParameterTypeOfInjectionToken(
          TestService,
          TEST_TOKEN_STRING
        )
      ).toEqual({
        type: 'value',
        constructorFunction: String,
        optional: false,
      });
    });

    it('should throw error if parameter was not found', () => {
      const TEST_TOKEN_UNUSED = new InjectionToken<string>('a string');

      expect(() =>
        getConstructorParameterTypeOfInjectionToken(
          TestService,
          TEST_TOKEN_UNUSED
        )
      ).toThrow(/Could not find a constructor parameter/i);
    });

    it('should get parameter for interface injection token', () => {
      expect(
        getConstructorParameterTypeOfInjectionToken(
          TestService,
          TEST_TOKEN_INTERFACE
        )
      ).toEqual({
        type: 'interface',
        optional: false,
      });
    });

    it('should get parameter for class injection token', () => {
      expect(
        getConstructorParameterTypeOfInjectionToken(
          TestService,
          TEST_TOKEN_CLASS
        )
      ).toEqual({
        type: 'class',
        classType: TestClass,
        optional: false,
      });
    });

    it('should get parameter for optional string injection token', () => {
      expect(
        getConstructorParameterTypeOfInjectionToken(
          TestServiceWithOptionals,
          TEST_TOKEN_STRING
        )
      ).toEqual({
        type: 'value',
        constructorFunction: String,
        optional: true,
      });
    });

    it('should get parameter for optional interface injection token', () => {
      expect(
        getConstructorParameterTypeOfInjectionToken(
          TestServiceWithOptionals,
          TEST_TOKEN_INTERFACE
        )
      ).toEqual({
        type: 'interface',
        optional: true,
      });
    });

    it('should get parameter for optional class injection token', () => {
      expect(
        getConstructorParameterTypeOfInjectionToken(
          TestServiceWithOptionals,
          TEST_TOKEN_CLASS
        )
      ).toEqual({
        type: 'class',
        classType: TestClass,
        optional: true,
      });
    });
  });
});
