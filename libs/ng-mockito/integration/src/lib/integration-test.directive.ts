import { Directive, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Directive({
  selector: '[qpIntegrationTestDirective]',
})
export class IntegrationTestDirective implements OnInit {
  @Input() qpIntegrationTestDirective = 'default text';
  @Output() qpIntegrationTestDirectiveOutput = new EventEmitter<string>();

  ngOnInit(): void {
    this.qpIntegrationTestDirectiveOutput.emit('real value from ngOnInit');
  }
}
