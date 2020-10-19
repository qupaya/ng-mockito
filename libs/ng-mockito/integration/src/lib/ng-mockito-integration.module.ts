import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IntegrationTestChildComponent } from './integration-test-child.component';
import { IntegrationTestComponent } from './integration-test.component';
import { IntegrationTestPipe } from './integration-test.pipe';

@NgModule({
  imports: [CommonModule],
  declarations: [
    IntegrationTestComponent,
    IntegrationTestChildComponent,
    IntegrationTestPipe,
  ],
})
export class NgMockitoIntegrationModule {}
