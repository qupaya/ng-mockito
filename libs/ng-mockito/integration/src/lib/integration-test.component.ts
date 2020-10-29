import { Component, OnInit } from '@angular/core';
import { IntegrationTestService } from './integration-test.service';

@Component({
  selector: 'qp-integration-test',
  template: `
    <!-- access test service: -->
    <div data-testID="valueFromService">{{ valueFromService }}</div>
    <!-- access test child component: -->
    <qp-integration-test-child
      [text]="valueFromService"
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
      [qpIntegrationTestDirective]="valueFromService"
      (qpIntegrationTestDirectiveOutput)="valueFromDirective = $event"
    >
      {{ valueFromDirective }}
    </div>
  `,
})
export class IntegrationTestComponent implements OnInit {
  valueFromService = '';
  valueFromChildComponent = 'real initial value';
  valueFromDirective = 'real initial value';

  constructor(private testService: IntegrationTestService) {}

  ngOnInit(): void {
    this.valueFromService = this.testService.getSomeValue();
  }
}
