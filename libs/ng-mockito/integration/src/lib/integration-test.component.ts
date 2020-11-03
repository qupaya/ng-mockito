import { Component, Inject, OnInit } from '@angular/core';
import { IntegrationTestService } from './integration-test.service';
import { INTEGRATION_TEST_INTERFACE_TOKEN } from './injection-tokens';
import {
  INTEGRATION_TEST_STRING_TOKEN,
  IntegrationTestInterface,
} from './injection-tokens';

@Component({
  selector: 'qp-integration-test',
  template: `
    <!-- access test service: -->
    <div data-testID="valueFromService">{{ testService.getSomeValue() }}</div>
    <!-- access test child component: -->
    <qp-integration-test-child
      [text]="testService.getSomeValue()"
      (someOutput)="valueFromChildComponent = $event"
    ></qp-integration-test-child>
    <div data-testID="valueFromChildComponent">
      {{ valueFromChildComponent }}
    </div>
    <!-- access test pipe: -->
    <div data-testID="valueFromPipe">
      {{ 'test pipe input' | integrationTest: 'test argument' }}
    </div>
    <!-- access test directive: -->
    <div
      data-testID="valueFromDirective"
      [qpIntegrationTestDirective]="testService.getSomeValue()"
      (qpIntegrationTestDirectiveOutput)="valueFromDirective = $event"
    >
      {{ valueFromDirective }}
    </div>
    <!-- access test string token: -->
    <div data-testID="valueFromStringToken">
      {{ valueFromStringToken }}
    </div>
    <!-- access test interface token: -->
    <div data-testID="someFunctionValueFromInterfaceToken">
      {{ testInterface.someFunction('test') }}
    </div>
    <div data-testID="somePropertyValueFromInterfaceToken">
      {{ testInterface.someValue }}
    </div>
  `,
})
export class IntegrationTestComponent {
  valueFromChildComponent = 'real initial value';
  valueFromDirective = 'real initial value';

  constructor(
    public readonly testService: IntegrationTestService,
    @Inject(INTEGRATION_TEST_STRING_TOKEN)
    public readonly valueFromStringToken: string,
    @Inject(INTEGRATION_TEST_INTERFACE_TOKEN)
    public readonly testInterface: IntegrationTestInterface
  ) {}
}
