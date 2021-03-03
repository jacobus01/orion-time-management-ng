/* tslint:disable:no-unused-variable */

import { TestBed, inject, waitForAsync } from '@angular/core/testing';
import { TimecaptureService } from './timecapture.service';

describe('Service: Timecapture', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TimecaptureService]
    });
  });

  it('should ...', inject([TimecaptureService], (service: TimecaptureService) => {
    expect(service).toBeTruthy();
  }));
});
