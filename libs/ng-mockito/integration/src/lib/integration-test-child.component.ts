import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'qp-integration-test-child',
  template: `<div data-testID="text">{{ text }}</div>`,
})
export class IntegrationTestChildComponent implements OnInit {
  @Input() text = 'default text';
  @Output() someOutput = new EventEmitter<string>();

  ngOnInit(): void {
    this.someOutput.emit('real value from ngOnInit');
  }
}
