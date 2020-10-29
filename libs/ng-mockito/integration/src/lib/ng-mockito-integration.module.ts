import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IntegrationTestChildComponent } from './integration-test-child.component';
import { IntegrationTestComponent } from './integration-test.component';
import { IntegrationTestPipe } from './integration-test.pipe';
import { IntegrationTestDirective } from './integration-test.directive';

@NgModule({
  imports: [CommonModule],
  declarations: [
    IntegrationTestComponent,
    IntegrationTestChildComponent,
    IntegrationTestPipe,
    IntegrationTestDirective,
  ],
})
export class NgMockitoIntegrationModule {}
