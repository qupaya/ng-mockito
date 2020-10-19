import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'integrationTest',
})
export class IntegrationTestPipe implements PipeTransform {
  transform(value: unknown, ...args: unknown[]): unknown {
    return `real value from pipe. value: ${value}, args: ${args.join()}`;
  }
}
