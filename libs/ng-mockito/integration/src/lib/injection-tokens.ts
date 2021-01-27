import { InjectionToken } from '@angular/core';

export interface IntegrationTestInterface {
  readonly someValue: string;
  someFunction(s: string): string;
}

export const INTEGRATION_TEST_STRING_TOKEN = new InjectionToken<string>(
  'INTEGRATION_TEST_STRING_TOKEN',
  { providedIn: 'root', factory: () => 'real text from token' }
);

export const INTEGRATION_TEST_INTERFACE_TOKEN = new InjectionToken<IntegrationTestInterface>(
  'INTEGRATION_TEST_INTERFACE_TOKEN',
  {
    providedIn: 'root',
    factory: () => ({
      someValue: 'real value from IntegrationTestInterface.someValue',
      someFunction() {
        return 'real value from IntegrationTestInterface.someFunction';
      },
    }),
  }
);
