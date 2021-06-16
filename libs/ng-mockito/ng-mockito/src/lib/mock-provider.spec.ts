import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import * as tsMockito from 'ts-mockito';
import { mockNg } from './mock-ng';
import { mockProvider as _mockProvider } from './mock-provider';
import { ActivatedRoute } from '@angular/router';

describe.each`
  mockProvider     | description
  ${mockNg}        | ${'using mock function'}
  ${_mockProvider} | ${'using mockProvider function'}
`(
  'mock provider ($description)',
  ({ mockProvider }: { mockProvider: typeof mockNg }) => {
    it('should throw error if ts-mockito instance is given', () => {
      expect(() =>
        mockProvider(tsMockito.instance(tsMockito.mock(class TestService {})))
      ).toThrowError(
        /.*Constructor name was empty, maybe you used instance\(\) function\?.*/
      );
    });

    it('should throw error if instance is given', () => {
      class TestService {}

      expect(() => mockProvider(new TestService())).toThrowError(
        /instance of TestService/
      );
    });

    it('should throw error if object is given', () => {
      expect(() => mockProvider({})).toThrowError(/instance of Object/);
    });

    it('should throw error if other value is given', () => {
      expect(() => mockProvider('test')).toThrowError(/invalid type./);
    });

    it('should mock ActivatedRoute', () => {
      TestBed.configureTestingModule({
        providers: [mockProvider(ActivatedRoute)],
      });

      expect(TestBed.inject(ActivatedRoute)).toBeDefined();
    });

    describe('with test service', () => {
      @Injectable({
        providedIn: 'root',
      })
      class HeavyweightService {
        doSomeHeavyweightStuff(): string {
          throw new Error('Real implementation used.');
        }
      }

      describe('when called with a service class', () => {
        it('should provide default mock', async () => {
          TestBed.configureTestingModule({
            providers: [mockProvider(HeavyweightService)],
          });

          const heavyweightService = TestBed.inject(HeavyweightService);
          expect(() =>
            heavyweightService.doSomeHeavyweightStuff()
          ).not.toThrowError();
        });

        it('should be able to set up inline', async () => {
          TestBed.configureTestingModule({
            providers: [
              mockProvider(HeavyweightService, (mock) =>
                tsMockito.when(mock.doSomeHeavyweightStuff()).thenReturn('test')
              ),
            ],
          });

          const heavyweightService = TestBed.inject(HeavyweightService);
          expect(heavyweightService.doSomeHeavyweightStuff()).toEqual('test');
        });
      });

      describe('when called with a ts-mockito mock', () => {
        it('should work with given mock', async () => {
          const mockHeavyweightService = tsMockito.mock(HeavyweightService);
          tsMockito
            .when(mockHeavyweightService.doSomeHeavyweightStuff())
            .thenReturn('test');

          TestBed.configureTestingModule({
            providers: [mockProvider(mockHeavyweightService)],
          });

          const heavyweightService = TestBed.inject(HeavyweightService);
          expect(heavyweightService.doSomeHeavyweightStuff()).toEqual('test');
        });

        it('should be able to set up inline', async () => {
          const mockHeavyweightService = tsMockito.mock(HeavyweightService);

          TestBed.configureTestingModule({
            providers: [
              mockProvider(mockHeavyweightService, (mock) =>
                tsMockito.when(mock.doSomeHeavyweightStuff()).thenReturn('test')
              ),
            ],
          });

          const heavyweightService = TestBed.inject(HeavyweightService);
          expect(heavyweightService.doSomeHeavyweightStuff()).toEqual('test');
        });
      });
    });
  }
);
