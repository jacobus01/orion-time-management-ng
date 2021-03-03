/* tslint:disable:no-unused-variable */

import { TestBed, inject, waitForAsync } from '@angular/core/testing';
import { SignalrService } from './signalr.service';

describe('Service: Signalr', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SignalrService]
    });
  });

  it('should ...', inject([SignalrService], (service: SignalrService) => {
    expect(service).toBeTruthy();
  }));
});
