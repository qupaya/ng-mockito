import {
  Component,
  Directive,
  FactoryProvider,
  Injectable,
  Input,
  OnInit,
  Pipe,
  PipeTransform,
} from '@angular/core';
import { render } from '@testing-library/angular';
import { mockAll } from './mock-all';

describe('mockAll', () => {
  it('should mock all providers', () => {
    @Injectable()
    class TestService1 {
      test() {
        throw 'real implementation';
      }
    }
    @Injectable()
    class TestService2 {
      test() {
        throw 'real implementation';
      }
    }
    @Injectable()
    class TestService3 {
      test() {
        throw 'real implementation';
      }
    }

    const providers = mockAll(
      TestService1,
      TestService2,
      TestService3
    ) as FactoryProvider[];
    expect(() => {
      providers[0].useFactory().test();
    }).not.toThrow();
  });

  it('should mock all declarations', async () => {
    @Component({ selector: 'test', template: `` })
    class TestComponent implements OnInit {
      ngOnInit() {
        throw 'real implementation';
      }
    }
    @Directive({ selector: `[test]` })
    class TestDirective {
      @Input() set test(_: string) {
        throw 'real implementation';
      }
    }
    @Pipe({ name: `test` })
    class TestPipe implements PipeTransform {
      transform() {
        throw 'real implementation';
      }
    }

    @Component({ template: `<test [test]="'test'">{{ 'test' | test }}</test>` })
    class TestHostComponent {}

    await expect(
      render(TestHostComponent, {
        declarations: mockAll(TestComponent, TestDirective, TestPipe),
      })
    ).resolves.toBeDefined();
  });
});
