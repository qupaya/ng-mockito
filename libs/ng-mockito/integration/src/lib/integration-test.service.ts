import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class IntegrationTestService {
  public getSomeValue() {
    return 'real value from service';
  }

  constructor() {
    //
  }
}
